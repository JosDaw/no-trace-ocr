import { Button, Container, Group, Title } from '@mantine/core';
import {
  IconFileTypeDoc,
  IconFileTypeDocx,
  IconFileTypeHtml,
  IconFileTypePdf,
  IconFileTypeTxt,
  IconPrinter,
} from '@tabler/icons-react';
import { saveAs } from 'file-saver';
import { asBlob } from 'html-docx-js-typescript';
import html2pdf from 'html2pdf.js';

export default function DownloadResults({ htmlContent }: any) {
  const downloadHtmlContent = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    saveAs(blob, 'content.html'); // This will trigger the download
  };

  const printHtmlContent = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const downloadPdf = () => {
    // This creates a .pdf file from the HTML content
    html2pdf()
      .from(htmlContent)
      .set({
        margin: 1,
        pagebreak: { mode: ['css', 'legacy'] },
        filename: 'document.pdf',
        html2canvas: {
          scale: 2, // Increase scale for better resolution
          logging: true,
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      })
      .save();
  };

  function downloadAsDoc() {
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
    element.download = 'content.doc';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  function downloadAsTxt() {
    const textContent = htmlContent.replace(/<[^>]*>?/gm, ''); // Remove HTML tags
    const element = document.createElement('a');
    const file = new Blob([textContent], { type: 'text/plain' });

    element.href = URL.createObjectURL(file);
    element.download = 'content.txt';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  }

  async function downloadAsDocx() {
    try {
      const contentBlob = (await asBlob(htmlContent)) as Blob; // Explicitly cast contentBlob to Blob
      const url = URL.createObjectURL(contentBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'document.docx';
      document.body.appendChild(link); // Add to the document
      link.click();
      document.body.removeChild(link); // Clean up
      URL.revokeObjectURL(url); // Free up memory
    } catch (error) {
      console.error('Error generating docx:', error);
    }
  }

  return (
    <Container>
      <Title ta='center' size='md' my={25}>
        Download Your Content
      </Title>
      <Group gap='md'>
        <Button onClick={printHtmlContent}>
          <IconPrinter /> Print
        </Button>
        <Button onClick={downloadAsDocx}>
          <IconFileTypeDocx /> Download DocX
        </Button>
        <Button onClick={downloadPdf}>
          <IconFileTypePdf /> Download PDF
        </Button>
        <Button onClick={downloadAsDoc}>
          <IconFileTypeDoc /> Download Doc
        </Button>
        <Button onClick={downloadAsTxt}>
          <IconFileTypeTxt /> Download TXT
        </Button>
        <Button onClick={downloadHtmlContent}>
          <IconFileTypeHtml /> Download HTML
        </Button>
      </Group>
    </Container>
  );
}
