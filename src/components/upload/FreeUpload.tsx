'use client';
import {
  Alert,
  Button,
  Container,
  Group,
  rem,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';
import {
  IconAlertTriangle,
  IconCloudUpload,
  IconDownload,
  IconX,
} from '@tabler/icons-react';
import { useCallback, useRef, useState } from 'react';
import { Document, pdfjs } from 'react-pdf';

// Set workerSrc for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface FreeUploadProps {
  handleProcessFile: (file: File) => void;
  uniqueUserId: string;
  isProcessing: boolean;
}

export default function FreeUpload({
  handleProcessFile,
  uniqueUserId,
  isProcessing,
}: FreeUploadProps) {
  const [totalPages, setTotalPages] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);

  // Handle file drop event
  const handleDrop = useCallback((files: File[]) => {
    if (files.length > 0) {
      const droppedFile = files[0]; // Only take the first file from the dropped files
      setFile(droppedFile); // Set the file in state, replacing any previous
    }
  }, []);

  /**
   * Handle page counter
   */
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages);
  };

  // Handle file upload
  const handleSubmit = async () => {
    if (!file) {
      showNotification({
        title: 'No file selected',
        message: 'Please select a file to upload.',
        color: 'red',
        autoClose: 5000,
      });
      return;
    }

    setUploading(true);

    try {
      if (file.type === 'application/pdf') {
        if (totalPages > 1) {
          showNotification({
            title: 'Error processing file',
            message:
              'Please register for an account to process PDFs with multiple pages.',
            color: 'red',
            autoClose: 5000,
          });
          setUploading(false);
          return;
        }

        if (totalPages === 0) {
          showNotification({
            title: 'Error processing file',
            message: 'Please upload a PDF with at least 1 page.',
            color: 'red',
            autoClose: 5000,
          });
          setUploading(false);
          return;
        }

        // Upload the PDF if it has more than 0 pages
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('userId', uniqueUserId);

        const uploadResponse = await fetch('api/vision-pdf-upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload PDF');
        }
      }

      // Handle processing
      try {
        handleProcessFile(file);
      } catch (error: any) {
        setUploading(false);
        showNotification({
          title: 'Error processing file',
          message: error.message,
          color: 'red',
          autoClose: 5000,
        });
      } finally {
        setUploading(false);
      }
    } catch (error: any) {
      setUploading(false);
      showNotification({
        title: 'Error uploading file',
        message: error.message,
        color: 'red',
        autoClose: 5000,
      });
    }
  };

  // Handle file upload cancellation
  const handleCancel = () => {
    setFile(null);
    setTotalPages(0);
  };

  return (
    <Container my={25}>
      <Title ta='center' my={10}>
        Free OCR Processing
      </Title>
      <Title ta='center' size='md'>
        (1 Page/Image per File)
      </Title>
      {totalPages > 1 && (
        <Alert
          color='red'
          title='Cannot Upload File'
          icon={<IconAlertTriangle />}
        >
          Free upload only supports 1 page documents!
          <br />
          Please register for an account to process PDFs with multiple pages.
        </Alert>
      )}
      <div style={{ position: 'relative', marginTop: 50 }}>
        <Dropzone
          openRef={openRef}
          onDrop={handleDrop}
          style={{
            padding: rem(30),
            borderRadius: rem(10),
            border: `2px dashed ${theme.colors.blue[6]}`,
          }}
          radius='md'
          accept={[MIME_TYPES.pdf, MIME_TYPES.jpeg, MIME_TYPES.png]}
          maxSize={30 * 1024 ** 2}
          multiple
        >
          <div style={{ pointerEvents: 'none' }}>
            {file !== null && (
              <Text
                ta='center'
                fz='sm'
                c='dimmed'
                style={{ marginBottom: rem(10) }}
              >
                {file.name}
              </Text>
            )}
            <Group justify='center'>
              <Dropzone.Accept>
                <IconDownload
                  style={{ width: rem(50), height: rem(50) }}
                  color={theme.colors.blue[6]}
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  style={{ width: rem(50), height: rem(50) }}
                  color={theme.colors.red[6]}
                  stroke={1.5}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconCloudUpload
                  style={{ width: rem(50), height: rem(50) }}
                  stroke={1.5}
                />
              </Dropzone.Idle>
            </Group>
            <Text ta='center' fw={700} fz='lg' mt='xl'>
              <Dropzone.Accept>Drop file here</Dropzone.Accept>
              <Dropzone.Reject>
                Free Upload only supports PDF, JPEG, and PNG files that contain
                just 1 page/image.
              </Dropzone.Reject>
              <Dropzone.Idle>Upload file</Dropzone.Idle>
            </Text>
            <Text ta='center' fz='sm' mt='xs' c='dimmed'>
              Drag and drop files here to upload. We can accept only{' '}
              <i>.pdf, .jpeg, .png</i> files that contain just 1 page/image.
            </Text>
            <Text ta='center' fz='sm' mt='xs' fw={700} c='red'>
              All files are deleted after processing.
            </Text>
          </div>
        </Dropzone>
        <Button
          style={{
            position: 'absolute',
            width: rem('250px'),
            bottom: rem('-20px'),
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          size='md'
          radius='xl'
          onClick={handleSubmit}
          disabled={
            uploading || file === null || isProcessing || totalPages > 1
          }
          loading={uploading}
        >
          {totalPages > 1 && 'Cannot'} Process File
        </Button>
        {file !== null && (
          <Button
            style={{
              position: 'absolute',
              bottom: rem('-20px'),
              left: '90%',
              transform: 'translateX(-90%)',
            }}
            color='red'
            size='md'
            radius='xl'
            onClick={handleCancel}
            disabled={uploading || totalPages === 0 || isProcessing}
          >
            <IconX style={{ marginRight: rem(5) }} />
            Cancel
          </Button>
        )}
      </div>
      {file && file.type === 'application/pdf' && (
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}></Document>
      )}
    </Container>
  );
}
