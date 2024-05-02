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

interface FileUploadProps {
  handleDeleteFiles: () => void;
  setTotalPages: (totalPages: number) => void;
  setLocalFile: (file: File | null) => void;
  user: LoggedInUser;
  totalPages: number;
}

export default function FileUpload({
  handleDeleteFiles,
  setTotalPages,
  setLocalFile,
  user,
  totalPages,
}: FileUploadProps) {
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

  // Handle file upload
  const handleSubmit = async () => {
    if (!file) {
      showNotification({
        title: 'No file selected',
        message: 'Please select a file to upload.',
        color: 'red',
      });
      return;
    }

    setUploading(true);
    setLocalFile(file);

    try {
      let pageCount = 0;
      if (file.type === 'application/pdf') {
        const formData = new FormData();
        formData.append('pdf', file);

        // Fetch page count for PDF
        const pageCountResponse = await fetch('api/page-counter', {
          method: 'POST',
          body: formData,
        });

        if (!pageCountResponse.ok) {
          throw new Error('Failed to get page count');
        }

        const pageCountResult = await pageCountResponse.json();
        pageCount = pageCountResult.pageCount;

        // Upload the PDF if it has more than 0 pages
        if (pageCount > 0) {
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
        }
      } else {
        // Assume non-PDF files are images with 1 page
        pageCount = 1;
      }

      // Update total pages with the page count of the single file
      setTotalPages(pageCount);

      showNotification({
        title: 'Upload Complete',
        message: 'Please continue to the next step.',
        color: 'green',
      });
    } catch (error: any) {
      showNotification({
        title: 'Error processing file',
        message: error.message,
        color: 'red',
      });
    } finally {
      setUploading(false);
    }
  };

  // Handle file upload cancellation
  const handleCancel = () => {
    setFile(null);
    setLocalFile(null);
  };

  const handleDelete = () => {
    handleDeleteFiles();
    setFile(null);
    setLocalFile(null);
  };

  return (
    <Container my={25}>
      <Title ta='center' my={20}>
        <IconCircleNumber1 size={50} color={theme.colors.red[6]} /> Upload your
        files
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
              <Dropzone.Idle>Upload file</Dropzone.Idle>
            </Text>
            <Text ta='center' fz='sm' mt='xs' c='dimmed'>
              Drag and drop files here to upload. We can accept only{' '}
              <i>.pdf, .jpeg, .png</i> files that are less than 30mb in size.
            </Text>
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
            disabled={uploading || file === null || totalPages === 0}
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
          disabled={uploading || file === null || totalPages > 0}
          loading={uploading}
        >
          {totalPages > 0 ? 'Uploaded File' : 'Start Upload'}
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
            disabled={uploading || totalPages > 0}
          >
            <IconX style={{ marginRight: rem(5) }} />
            Cancel
          </Button>
        )}
      </div>
    </Container>
  );
}
