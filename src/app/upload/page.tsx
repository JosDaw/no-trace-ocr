'use client';
import DisplayResults from '@/components/display/DisplayResults';
import LoadingCover from '@/components/layout/LoadingCover';
import FileUpload from '@/components/upload/FileUpload';
import ProcessText from '@/components/upload/ProcessText';
import { database } from '@/config/firebase';
import useUser from '@/store/useUser';
import { checkPDFResults } from '@/utils/upload-helper';
import { Button, Container, Group, Paper, Stepper, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import {
  addDoc,
  collection,
  doc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { useState } from 'react';

export default function UploadPage() {
  const [totalPages, setTotalPages] = useState<number>(0);
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [fileType, setFileType] = useState<string>('');
  const [showResults, setShowResults] = useState<boolean>(false);
  const [textJSON, setTextJSON] = useState<any>({ annotations: [] });
  const [active, setActive] = useState(0);

  const env = process.env.NODE_ENV || 'development';
  const paypalClientId =
    env == 'development'
      ? process.env.NEXT_PUBLIC_PAYPAL_SANDBOX_CLIENT_ID
      : process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const { isLoggedIn, user } = useUser();
  const updateCredit = useUser((state: any) => state.updateCredit);

  const costPerItem = Number(process.env.PRICE_PER_ITEM) || 0.05;
  const hasValidCredit = user.credit >= totalPages * costPerItem;

  const handleProcessFile = async () => {
    const processStart = () => {
      setIsProcessing(true);
    };

    const processComplete = async () => {
      setIsProcessing(false);
      setShowResults(true);
      setActive(2);

      const totalCost = totalPages * costPerItem;

      // Add process record
      await addDoc(collection(database, 'processed'), {
        userDoc: user.userDoc,
        amount: totalCost,
        pages: totalPages,
        date: Timestamp.now(),
      });
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

    if (!hasValidCredit) {
      handleError(
        'Insufficient credit. Please add more credit to process the file.'
      );
      return;
    }

    const fileType = localFile.type === 'application/pdf' ? 'pdf' : 'image';

    try {
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
        setTextJSON({ annotations: result.result.fullTextAnnotation });
      }

      const totalCost = totalPages * costPerItem;
      // Update zustand credit
      updateCredit(user.credit - totalCost);

      const updateRef = doc(
        collection(database, 'user'),
        user.userDoc.toString()
      );

      // Update credit first
      await updateDoc(updateRef, {
        credit: user.credit - totalCost,
        dateUpdated: Timestamp.now(),
      });

      showNotification({
        title: 'Processing Ongoing',
        message: 'Please wait a moment.',
        color: 'green',
      });
    } catch (error: any) {
      handleDeleteFiles(); // Delete uploads if error occurs
      handleError(error.message);
    } finally {
      if (fileType === 'pdf') {
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

  const handleDeleteFiles = async () => {
    if (!localFile) return;

    await sendFileToServer(
      'api/vision-pdf-delete',
      JSON.stringify({ fileName: localFile.name + user.userID })
    );

    showNotification({
      title: 'File Deleted',
      message: 'Your content has been deleted and is secure.',
      color: 'green',
    });
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId: paypalClientId as string,
        currency: 'USD',
        intent: 'capture',
      }}
    >
      <Paper>
        <LoadingCover visible={isProcessing} />

        {showResults ? (
          <DisplayResults textJSON={textJSON} />
        ) : (
          <>
            <Container mt={50} mb={25}>
              <Stepper active={active} onStepClick={setActive}>
                <Stepper.Step
                  label='Step 1'
                  description='Upload your file'
                ></Stepper.Step>
                <Stepper.Step
                  label='Step 2'
                  description='Confirm & Process File'
                ></Stepper.Step>
                <Stepper.Step
                  label='Step 3'
                  description='Download Finished File'
                ></Stepper.Step>
                <Stepper.Completed>
                  Completed, click back button to get to previous step
                </Stepper.Completed>
              </Stepper>

              <Group justify='center' mt='xl'>
                {active !== 0 && (
                  <Button size='md' variant='default' onClick={prevStep}>
                    Back
                  </Button>
                )}
                {active !== 2 && (
                  <Button size='md' onClick={nextStep}>
                    Next Step
                  </Button>
                )}
              </Group>
            </Container>
            {active === 0 && (
              <FileUpload
                handleDeleteFiles={handleDeleteFiles}
                setTotalPages={setTotalPages}
                setLocalFile={setLocalFile}
                user={user}
                totalPages={totalPages}
                nextStep={nextStep}
              />
            )}
            {active === 1 && (
              <ProcessText
                isLoggedIn={isLoggedIn}
                hasValidCredit={hasValidCredit}
                handleProcessFile={handleProcessFile}
                isProcessing={isProcessing}
                totalPages={totalPages}
                user={user}
              />
            )}
            {active === 2 && (
              <Text size='lg' fw='bold' ta='center'>
                Please process documents to see them here.
              </Text>
            )}
          </>
        )}
      </Paper>
    </PayPalScriptProvider>
  );
}
