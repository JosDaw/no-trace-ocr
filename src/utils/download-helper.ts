import { showNotification } from '@mantine/notifications';
import { saveAs } from 'file-saver';
import { asBlob } from 'html-docx-js-typescript';

/**
 * Downloads the HTML content as a file.
 * If there is no HTML content, it shows an error notification.
 */
export function downloadHtmlContent(htmlContent: any) {
  if (!htmlContent) {
    showNotification({
      title: 'Error!',
      message: 'No HTML content available for download',
      color: 'red',
    });
    return;
  }

  try {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    saveAs(blob, 'no-trace-ocr.html');
  } catch (error: any) {
    showNotification({
      title: 'Error!',
      message: error.message,
      color: 'red',
    });
  }
}

/**
 * Prints the HTML content in a new window.
 * If there is no HTML content, it shows an error notification.
 */
export function printHtmlContent(htmlContent: any) {
  if (!htmlContent) {
    showNotification({
      title: 'Error!',
      message: 'No HTML content to print',
      color: 'red',
    });
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    showNotification({
      title: 'Error!',
      message: 'Failed to open new window',
      color: 'red',
    });
    return;
  }

  try {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  } catch (error: any) {
    showNotification({
      title: 'Error!',
      message: error.message,
      color: 'red',
    });
  } finally {
    printWindow.close();
  }
}

/**
 * Downloads the HTML content as a PDF document.
 * If no HTML content is available, it shows an error notification.
 */
export async function downloadPdf(htmlContent: any) {
  if (!htmlContent) {
    showNotification({
      title: 'Error!',
      message: 'No HTML content available for PDF conversion',
      color: 'red',
    });
    return;
  }

  const {default: html2pdf} = await import('html2pdf.js');
  
  try {
    html2pdf()
      .from(htmlContent)
      .set({
        margin: 1,
        pagebreak: { mode: ['css', 'legacy'] },
        filename: 'no-trace-ocr.pdf',
        html2canvas: {
          scale: 2, // Increase scale for better resolution
          logging: true, // Enable logging for debugging purposes
          useCORS: true, // Allows loading of resources across domains
          letterRendering: true,
        },
        jsPDF: {
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        },
      })
      .save();
  } catch (error: any) {
    showNotification({
      title: 'Error!',
      message: error.message,
      color: 'red',
    });
  }
}

/**
 * Downloads the content as a Word document.
 */
export function downloadAsDoc(htmlContent: any) {
  if (!htmlContent) {
    showNotification({
      title: 'Error!',
      message: 'No HTML content provided for DOC conversion',
      color: 'red',
    });
    return;
  }

  try {
    const header = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office'
        xmlns:w='urn:schemas-microsoft-com:office:word'
        xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'></head><body>`;
    const footer = `</body></html>`;
    const docContent = header + htmlContent + footer;

    const element = document.createElement('a');
    const file = new Blob([docContent], { type: 'application/msword' });

    element.href = URL.createObjectURL(file);
    element.download = 'no-trace-ocr.doc'; // Changed file name for clarity
    document.body.appendChild(element);
    element.click();

    // Clean-up to revoke object URL and remove element
    setTimeout(() => {
      URL.revokeObjectURL(element.href);
      document.body.removeChild(element);
    }, 100);
  } catch (error: any) {
    showNotification({
      title: 'Error!',
      message: error.message,
      color: 'red',
    });
  }
}

/**
 * Downloads the content as a text file.
 */
export function downloadAsTxt(htmlContent: any) {
  if (!htmlContent) {
    showNotification({
      title: 'Error!',
      message: 'No HTML content provided for TXT conversion',
      color: 'red',
    });
    return;
  }

  try {
    // Removing all HTML tags and encoded characters to get plain text
    const textContent = htmlContent
      .replace(/<[^>]*>?/gm, '')
      .replace(/&[^;]+;/gm, ' ');

    const element = document.createElement('a');
    const file = new Blob([textContent], { type: 'text/plain' });

    element.href = URL.createObjectURL(file);
    element.download = 'no-trace-ocr.txt';

    document.body.appendChild(element); // Add element to the DOM necessary for Firefox
    element.click(); // Trigger the download

    // Cleanup: Remove the element and revoke the blob URL to free up resources
    setTimeout(() => {
      URL.revokeObjectURL(element.href);
      document.body.removeChild(element);
    }, 100);
  } catch (error: any) {
    showNotification({
      title: 'Error!',
      message: error.message,
      color: 'red',
    });
  }
}

/**
 * Downloads the content as a DOCX file.
 * returns a promise that resolves when the download is complete.
 */
export async function downloadAsDocx(htmlContent: any) {
  if (!htmlContent) {
    showNotification({
      title: 'Error!',
      message: 'No HTML content provided for DOCX conversion',
      color: 'red',
    });
    return;
  }

  try {
    // Assuming asBlob is a custom function that converts HTML content to a Blob
    const contentBlob = await asBlob(htmlContent);
    if (!(contentBlob instanceof Blob)) {
      showNotification({
        title: 'Error!',
        message: 'The returned content is not a Blob',
        color: 'red',
      });
      return;
    }

    const url = URL.createObjectURL(contentBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'no-trace-ocr.docx';

    document.body.appendChild(link);
    link.click();

    // Clean up by removing the link and revoking the URL
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error: any) {
    showNotification({
      title: 'Error!',
      message: error.message,
      color: 'red',
    });
  }
}
