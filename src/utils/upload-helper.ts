import { showNotification } from '@mantine/notifications';

export function checkPDFResults(
  fileName: string,
  setIsProcessing: (arg0: boolean) => void
) {
  return new Promise((resolve, reject) => {
    console.log('Starting to check results...');

    const intervalId = setInterval(async () => {
      console.log('Checking results...');
      let response;

      try {
        response = await fetch('api/vision-pdf-results', {
          method: 'POST',
          body: JSON.stringify({ fileName }),
        });
      } catch (error) {
        console.error('Fetch error:', error);
        clearInterval(intervalId);
        setIsProcessing(false);
        reject(new Error('Failed to fetch results.'));
        return;
      }

      if (!response.ok) {
        // Check for critical error responses, and stop the interval if encountered
        if (response.status !== 200 && response.status !== 404) {
          clearInterval(intervalId);
          setIsProcessing(false);
          showNotification({
            title: 'Error processing files',
            message: `Unexpected status code ${response.status}. Please try again later.`,
            color: 'red',
          });
          reject(new Error(`Unexpected status code ${response.status}`));
        }
      } else {
        const pdfResult = await response.json();
        console.log('🚀 ~ checkResults ~ pdfResult:', pdfResult);
        clearInterval(intervalId);
        resolve(pdfResult); // Resolve the promise with the result
      }
    }, 5000);
  });
}
