import { Annotation } from '@/types/types';
import { Alert, Center, Paper, Title } from '@mantine/core';
import { IconAlertTriangle, IconInfoCircle } from '@tabler/icons-react';
import TextDisplay from './TextDisplay';
import TextEditor from './TextEditor';

interface DisplayModalProps {
  textJSON: Annotation[] | any;
  fileType: string;
}

export default function DisplayResults({
  textJSON,
  fileType,
}: DisplayModalProps) {
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
          title='Warning'
          icon={<IconAlertTriangle />}
        >
          For confidentiality purposes, no content is saved on OCRiginal
          Translator. Closing this page will permanently delete the content
          below.
          <br />
          <br />
          Please use the download buttons to save your content.
        </Alert>
      </Center>
      {fileType === 'image' &&
        textJSON &&
        Array.isArray(textJSON) &&
        textJSON.map((text: any) => {
          return <TextDisplay key={text.id} annotations={text.annotations} />;
        })}
      {fileType === 'pdf' && textJSON && (
        <TextEditor content={textJSON.annotations.text} />
      )}
    </Paper>
  );
}
