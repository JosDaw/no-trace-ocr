import { showNotification } from '@mantine/notifications';
export function checkPDFResults(
  fileName: string,
  setIsProcessing: (arg0: boolean) => void,
  totalPages: number
) {
  return new Promise((resolve, reject) => {

    let currentPage = 1; // Track the current page being processed
    const results: any = []; // Array to store results from each page

    const intervalId = setInterval(async () => {
      let response;

      try {
        response = await fetch('api/vision-pdf-results', {
          method: 'POST',
          body: JSON.stringify({ fileName, currentPage: currentPage }),
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

        // Store the result from the current page
        results.push(pdfResult.result.responses[0].fullTextAnnotation.text);

        // Move to the next page
        if (currentPage < totalPages) {
          currentPage++;
        } else {
          const mergedResults = results.join('\n\n');
          clearInterval(intervalId);
          resolve({ text: mergedResults }); // Resolve the promise with all the results
        }
      }
    }, 5000);
  });
}
