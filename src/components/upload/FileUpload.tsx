'use client';
import { LoggedInUser } from '@/types/types';
import {
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
  IconCircleNumber1,
  IconCloudUpload,
  IconDownload,
  IconTrashX,
  IconX,
} from '@tabler/icons-react';
import { useCallback, useRef, useState } from 'react';
import { Document, pdfjs } from 'react-pdf';

// Set workerSrc for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface FileUploadProps {
  handleDeleteFiles: () => void;
  setTotalPages: (totalPages: number) => void;
  setLocalFile: (file: File | null) => void;
  nextStep: () => void;
  user: LoggedInUser;
  totalPages: number;
}

export default function FileUpload({
  handleDeleteFiles,
  setTotalPages,
  setLocalFile,
  nextStep,
  user,
  totalPages,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [hasUploaded, setHasUploaded] = useState<boolean>(false);
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

  /**
   * Handles the submission of the file upload form.
   * If a file is selected, it uploads the file and shows a success notification.
   * If the file is a PDF, it checks if it has at least 1 page before uploading.
   * If the upload is successful, it sets the `hasUploaded` state to true.
   * If there is an error during the upload or processing, it shows an error notification.
   * Finally, it sets the `uploading` state to false.
   */
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
    setLocalFile(file);

    try {
      if (file.type === 'application/pdf') {
        if (totalPages === 0) {
          showNotification({
            title: 'Error processing file',
            message: 'Please upload a PDF with at least 1 page.',
            color: 'red',
            autoClose: 5000,
          });
          return;
        }

        // Upload the PDF if it has more than 0 pages
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('userId', user.userID);

        const uploadResponse = await fetch('api/vision-pdf-upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload PDF');
        }

        setHasUploaded(true);
      }

      showNotification({
        title: 'Upload Complete',
        message: 'Please confirm and process the file.',
        color: 'green',
      });
      nextStep();
    } catch (error: any) {
      showNotification({
        title: 'Error processing file',
        message: error.message,
        color: 'red',
        autoClose: 5000,
      });
    } finally {
      setUploading(false);
    }
  };

  /**
   * Deletes a non-uploaded file
   */
  const handleCancel = () => {
    setFile(null);
    setLocalFile(null);
  };

  /**
   * Deletes the file and resets the state.
   */
  const handleDelete = () => {
    handleDeleteFiles();
    setFile(null);
    setLocalFile(null);
  };

  return (
    <Container my={25}>
      <Title ta='center' my={20}>
        <IconCircleNumber1 size={50} color={theme.colors.red[6]} /> Upload your
        file
      </Title>
      <div style={{ position: 'relative', marginBottom: '30px' }}>
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
                File must be a PDF, JPEG, or PNG less than 30MB
              </Dropzone.Reject>
              {file === null && <Dropzone.Idle>Drag & Drop File</Dropzone.Idle>}
            </Text>
            {file === null && (
              <Text ta='center' fz='sm' mt='xs' c='dimmed'>
                Drag and drop files here to upload. We can accept only{' '}
                <i>.pdf, .jpeg, .png</i> files that are less than 30mb in size.
              </Text>
            )}
            <Text ta='center' fz='sm' mt='xs' fw={700} c='red'>
              All files are deleted after processing.
            </Text>
          </div>
        </Dropzone>
        {file !== null && (
          <Button
            style={{
              position: 'absolute',
              bottom: rem('-20px'),
              left: '10%',
              transform: 'translateX(-10%)',
            }}
            color='red'
            size='md'
            radius='xl'
            onClick={handleDelete}
            disabled={uploading || file === null || !hasUploaded}
          >
            <IconTrashX style={{ marginRight: rem(5) }} />
            Delete
          </Button>
        )}
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
          disabled={uploading || file === null}
          loading={uploading}
        >
          Upload File
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
            disabled={uploading || hasUploaded}
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
