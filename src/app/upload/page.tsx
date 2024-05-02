'use client';
import DisplayResults from '@/components/display/DisplayResults';
import LoadingCover from '@/components/layout/LoadingCover';
import CostSummary from '@/components/upload/CostSummary';
import FileUpload from '@/components/upload/FileUpload';
import ProcessText from '@/components/upload/ProcessText';
import useUser from '@/store/useUser';
import { checkPDFResults } from '@/utils/upload-helper';
import { Flex, Paper } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useState } from 'react';

export default function UploadPage() {
  const [totalPages, setTotalPages] = useState<number>(0);
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [fileType, setFileType] = useState<string>('');
  const [showResults, setShowResults] = useState<boolean>(false);
  const [textJSON, setTextJSON] = useState<any>({ annotations: [] });

  const { isLoggedIn, user } = useUser();

  const costPerItem = Number(process.env.PRICE_PER_ITEM) || 0.05;
  const hasValidCredit = user.credit >= totalPages * costPerItem;

  const handleProcessFile = async () => {
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

    if (!localFile) {
      handleError('No file provided. Please upload a file.');
      return;
    }

    try {
      const fileType = localFile.type === 'application/pdf' ? 'pdf' : 'image';
      setFileType(fileType);

      let result;
      if (fileType === 'pdf') {
        result = await sendFileToServer(
          'api/vision-pdf-process',
          JSON.stringify({ fileName: localFile.name + user.userID })
        );
      } else {
        const formData = new FormData();
        formData.append('file', localFile);
        result = await sendFileToServer('api/vision-image', formData);
        setTextJSON({ annotations: result.result.textAnnotations });
      }

      showNotification({
        title: 'Processing Complete',
        message: 'Please check the display.',
        color: 'green',
      });
    } catch (error: any) {
      handleError(error.message);
    } finally {
      checkPDFResults(localFile.name + user.userID, setIsProcessing).then(
        async (pdfResult: any) => {
          if (pdfResult) {
            setTextJSON({
              annotations: pdfResult.result.responses[0].fullTextAnnotation,
            });

            handleDeleteFiles().then(() => {
              processComplete();
            });
          }
        }
      );
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

  const handleDeleteFiles = async () => {
    if (!localFile) return;

    await sendFileToServer(
      'api/vision-pdf-delete',
      JSON.stringify({ fileName: localFile.name + user.userID })
    );

    showNotification({
      title: 'Files Deleted',
      message: 'Your content has been deleted and is secure.',
      color: 'green',
    });
  };

  return (
    <Paper>
      <LoadingCover visible={isProcessing} />
      {showResults ? (
        <DisplayResults fileType={fileType} textJSON={textJSON} />
      ) : (
        <>
          <FileUpload
            handleDeleteFiles={handleDeleteFiles}
            setTotalPages={setTotalPages}
            setLocalFile={setLocalFile}
            user={user}
            totalPages={totalPages}
          />
          <Flex
            gap='md'
            justify='center'
            align='center'
            direction='row'
            wrap='wrap'
          >
            <CostSummary totalCount={totalPages} user={user} />
            <ProcessText
              isLoggedIn={isLoggedIn}
              hasValidCredit={hasValidCredit}
              handleProcessFile={handleProcessFile}
              isProcessing={isProcessing}
              totalPages={totalPages}
            />
          </Flex>
        </>
      )}
    </Paper>
  );
}
