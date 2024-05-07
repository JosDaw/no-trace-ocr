'use client';
import DisplayResults from '@/components/display/DisplayResults';
import LoadingCover from '@/components/layout/LoadingCover';
import FreeUpload from '@/components/upload/FreeUpload';
import { generateUniqueToken } from '@/utils/text-helper';
import { checkPDFResults } from '@/utils/upload-helper';
import {
  Button,
  Center,
  Group,
  Paper,
  Text,
  Title,
} from '@mantine/core';
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

  /**
   * Handles the processing of a file.
   * 
   * @param file - The file to be processed.
   */
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
      handleDeleteFiles(file); // Delete uploads if error occurs
      handleError(error.message);
    } finally {
      if (fileType === 'pdf') {
        checkPDFResults(file.name + uniqueUserId, setIsProcessing, 1).then(
          async (pdfResult: any) => {
            if (pdfResult) {
              setTextJSON({
                annotations: pdfResult,
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

  /**
   * Sends a file to the server using a POST request.
   * @param {string} url - The URL to send the file to.
   * @param {string | FormData} body - The body of the request, which can be either a string or a FormData object.
   * @returns {Promise<any>} - A Promise that resolves to the JSON response from the server.
   * @throws {Error} - If the server responds with an error.
   */
  const sendFileToServer = async (url: string, body: string | FormData): Promise<any> => {
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

  /**
   * Deletes a file and sends a request to the server to delete the file.
   * Shows a notification after successful deletion.
   *
   * @param file - The file to be deleted.
   */
  const handleDeleteFiles = async (file: File) => {
    if (!file) return;

    await sendFileToServer(
      'api/vision-pdf-delete',
      JSON.stringify({ fileName: file.name + uniqueUserId, totalPages: 1 })
    );

    showNotification({
      title: 'File Deleted',
      message: 'Your content has been deleted and is secure.',
      color: 'green',
    });
  };

  /**
   * Handles the refresh action.
   * This function sets `showResults` to `false` and increments the `refreshKey` to force a re-render.
   */
  const handleRefresh = () => {
    setShowResults(false);
    setRefreshKey((oldKey) => oldKey + 1); // Increment refresh key to force re-render
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
        <Button size='lg' variant='light' color='pink' onClick={handleRefresh}>
          <IconUpload style={{ marginRight: 8 }} />
          Upload Another File
        </Button>
      </Center>

      <Center mx={25} my={25}>
        <Paper withBorder p='lg' radius='md' shadow='md'>
          <Group justify='space-between' mb='xs'>
            <Title fz='lg' fw={500} c='purple'>
              Need More Pages?
            </Title>
          </Group>
          <Text c='dimmed'>
            Register and add credit to your account to process larger files with
            more pages. No Trace OCR provides secure, accurate, and affordable
            processing for just $0.05 per page.
          </Text>
          <Group justify='flex-end' mt='md'>
            <Link href='/user/register'>
              <Button variant='outline' size='md' color='purple'>
                Register
              </Button>
            </Link>
          </Group>
        </Paper>
      </Center>
    </Paper>
  );
}
