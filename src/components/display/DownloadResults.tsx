import {
  downloadAsDoc,
  downloadAsDocx,
  downloadAsTxt,
  downloadHtmlContent,
  downloadPdf,
  printHtmlContent,
} from '@/utils/download-helper';
import { Button, Container, Group, Title } from '@mantine/core';
import {
  IconFileTypeDoc,
  IconFileTypeDocx,
  IconFileTypeHtml,
  IconFileTypePdf,
  IconFileTypeTxt,
  IconPrinter,
} from '@tabler/icons-react';

export default function DownloadResults({ htmlContent }: any) {
  return (
    <Container my={50}>
      <Title ta='center' size='md' my={25}>
        Download Your Content
      </Title>
      <Group gap='md' justify='center'>
        <Button
          onClick={() => {
            printHtmlContent(htmlContent);
          }}
        >
          <IconPrinter /> Print
        </Button>
        <Button
          onClick={() => {
            downloadAsDocx(htmlContent);
          }}
        >
          <IconFileTypeDocx /> Download DocX
        </Button>
        <Button
          onClick={() => {
            downloadPdf(htmlContent);
          }}
        >
          <IconFileTypePdf /> Download PDF
        </Button>
        <Button
          onClick={() => {
            downloadAsDoc(htmlContent);
          }}
        >
          <IconFileTypeDoc /> Download Doc
        </Button>
        <Button
          onClick={() => {
            downloadAsTxt(htmlContent);
          }}
        >
          <IconFileTypeTxt /> Download TXT
        </Button>
        <Button
          onClick={() => {
            downloadHtmlContent(htmlContent);
          }}
        >
          <IconFileTypeHtml /> Download HTML
        </Button>
      </Group>
    </Container>
  );
}
