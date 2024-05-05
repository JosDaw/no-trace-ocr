import { Annotation } from '@/types/types';
import { Alert, Button, Center, Paper, Title } from '@mantine/core';
import { IconAlertTriangle, IconUpload } from '@tabler/icons-react';
import Link from 'next/link';
import TextEditor from './TextEditor';

interface DisplayModalProps {
  textJSON: Annotation[] | any;
}

export default function DisplayResults({ textJSON }: DisplayModalProps) {
  return (
    <Paper my={50}>
      <Title ta='center'>OCR Processed Content</Title>
      <Center>
        <Alert
          w={500}
          my={50}
          variant='light'
          color='red'
          withCloseButton
          title='Warning - Please Read'
          icon={<IconAlertTriangle />}
        >
          For confidentiality purposes, no content is saved on OCRiginal
          Translator.
          <br />
          <br />
          <strong>
            Closing this page will permanently delete the content below.
          </strong>
          <br />
          <br />
          Please use the download buttons to save your content.
        </Alert>
      </Center>
      {textJSON && <TextEditor content={textJSON.annotations.text} />}
    </Paper>
  );
}
