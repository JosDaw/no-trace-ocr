'use client';
import DisplayResults from '@/components/display/DisplayResults';
import LoadingCover from '@/components/layout/LoadingCover';
import FreeUpload from '@/components/upload/FreeUpload';
import { generateUniqueToken } from '@/utils/text-helper';
import { checkPDFResults } from '@/utils/upload-helper';
import { Button, Center, CloseButton, Container, Group, Paper, Text, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconUpload } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';

export default function FreeUploadPage() {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [textJSON, setTextJSON] = useState<any>({ annotations: [] });
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const uniqueUserId = generateUniqueToken();

  const handleProcessFile = async (file: File) => {
    const processStart = () => {
      setIsProcessing(true);
    };

    const processComplete = () => {
      setIsProcessing(false);
      setShowResults(true);
    };

    const handleError = (message: string) => {
      showNotification({
        title: 'Error processing file',
        message,
        color: 'red',
      });
      processComplete();
    };

    processStart();

    if (!file) {
      handleError('No file provided. Please upload a file.');
      return;
    }

    const fileType = file.type === 'application/pdf' ? 'pdf' : 'image';


    try {

      let result;
      if (fileType === 'pdf') {
        result = await sendFileToServer(
          'api/vision-pdf-process',
          JSON.stringify({ fileName: file.name + uniqueUserId })
        );
      } else {
        const formData = new FormData();
        formData.append('file', file);
        result = await sendFileToServer('api/vision-image', formData);
        setTextJSON({ annotations: result.result.fullTextAnnotation });
      }

      showNotification({
        title: 'Processing Complete',
        message: 'Please check the display.',
        color: 'green',
      });
    } catch (error: any) {
      handleError(error.message);
    } finally {
      if (fileType === 'pdf') {
        checkPDFResults(file.name + uniqueUserId, setIsProcessing).then(
          async (pdfResult: any) => {
            if (pdfResult) {
              setTextJSON({
                annotations: pdfResult.result.responses[0].fullTextAnnotation,
              });

              handleDeleteFiles(file).then(() => {
                processComplete();
              });
            }
          }
        );
      } else {
        processComplete();
      }
    }
  };

  const sendFileToServer = async (url: string, body: string | FormData) => {
    const response = await fetch(url, {
      method: 'POST',
      body,
    });
    if (!response.ok) {
      throw new Error(
        'Server responded with an error. Please try again later.'
      );
    }
    return response.json();
  };

  const handleDeleteFiles = async (file: File) => {
    if (!file) return;

    await sendFileToServer(
      'api/vision-pdf-delete',
      JSON.stringify({ fileName: file.name + uniqueUserId })
    );

    showNotification({
      title: 'Files Deleted',
      message: 'Your content has been deleted and is secure.',
      color: 'green',
    });
  };

  const handleRefresh = () => {
    setShowResults(false);
    setRefreshKey(oldKey => oldKey + 1); // Increment refresh key to force re-render
  };

  return (
    <Paper>
      <LoadingCover visible={isProcessing} />
      {showResults ? (
        <DisplayResults textJSON={textJSON} />
      ) : (
        <>
          <FreeUpload
            key={refreshKey}
            uniqueUserId={uniqueUserId}
            handleProcessFile={handleProcessFile}
            isProcessing={isProcessing}
          />
        </>
      )}
      <Center my={70}>
        <Button size="lg" variant="light" color="pink" onClick={handleRefresh}>
          <IconUpload style={{ marginRight: 8 }} />
          Upload Another File
        </Button>
      </Center>

      <Container mx={25} my={25}>
        <Paper withBorder p="lg" radius="md" shadow="md">
          <Group justify="space-between" mb="xs">
            <Title fz="lg" fw={500} c="purple">
              Need More Pages?
            </Title>
          </Group>
          <Text c="dimmed">
            Register and add credit to your account to process larger files with more pages.
            No Trace OCR provides secure, accurate, and affordable processing for just $0.05 per page.
          </Text>
          <Group justify="flex-end" mt="md">
            <Link href="/user/register">
              <Button variant="outline" size="md" color="purple">
                Register
              </Button>
            </Link>
          </Group>
        </Paper>
      </Container>
    </Paper>
  );
}
