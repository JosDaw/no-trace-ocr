'use client'
import { Button, Container, Group, rem, Text, Title, useMantineTheme } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { IconCircleNumber1, IconCloudUpload, IconDownload, IconX } from '@tabler/icons-react';
import { useCallback, useRef, useState } from 'react';



interface FileUploadProps {
  setTotalPages: (totalPages: number) => void;
  setLocalFiles: (files: File[]) => void;
}

export default function FileUpload({ setTotalPages, setLocalFiles }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);

  const handleDrop = useCallback((droppedFiles: File[]) => {
    setFiles(currentFiles => [...currentFiles, ...droppedFiles]); // Add dropped files to the current array
  }, []);


  const handleSubmit = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setLocalFiles(files);


    // Calculate the total count for pages in PDFs or images
    const totalCounts = await Promise.all(files.map(async file => {
      if (file.type === 'application/pdf') {
        try {
          const formData = new FormData();
          formData.append('pdf', file);

          const response = await fetch('api/page-counter', {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            throw new Error('Network response was not ok.');
          }

          const result = await response.json();
          return result.pageCount;
        } catch (error) {
          console.error('Error processing PDF:', error);
          return 0;
        }
      } else {
        return 1;
      }
    }));

    // Sum up all counts
    const totalItems = totalCounts.reduce((acc, count) => acc + count, 0);
    setTotalPages(totalItems);

    console.log(`Total items to process: ${totalItems}`);

    // Create FormData to send multiple files to a server or API
    const formData = new FormData();
    files.forEach(file => formData.append('files[]', file));

    // Simulating a file upload request
    console.log('Uploading', files.map(file => file.name).join(', '));

    alert(`Files uploaded successfully with total ${totalItems} items (pages or images)!`);
    setUploading(false);
  };

  const handleCancel = () => {
    setFiles([]);
    setLocalFiles([]);
  };


  return (
    <Container my={25}>
      <Title ta="center" my={20}><IconCircleNumber1 size={50} color={theme.colors.red[6]} /> Upload your files</Title>
      <div style={{ position: 'relative', marginBottom: '30px' }}>
        <Dropzone
          openRef={openRef}
          onDrop={handleDrop}
          style={{ padding: rem(30), borderRadius: rem(10), border: `2px dashed ${theme.colors.blue[6]}` }}
          radius="md"
          accept={[MIME_TYPES.pdf, MIME_TYPES.jpeg, MIME_TYPES.png]}
          maxSize={30 * 1024 ** 2}
          multiple
        >
          <div style={{ pointerEvents: 'none' }}>
            {files.length > 0 &&
              <Text ta="center" fz="sm" c="dimmed" style={{ marginBottom: rem(10) }}>
                {files.map(file => file.name).join(', ')}
              </Text>
            }
            <Group justify="center">
              <Dropzone.Accept>
                <IconDownload style={{ width: rem(50), height: rem(50) }} color={theme.colors.blue[6]} stroke={1.5} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX style={{ width: rem(50), height: rem(50) }} color={theme.colors.red[6]} stroke={1.5} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconCloudUpload style={{ width: rem(50), height: rem(50) }} stroke={1.5} />
              </Dropzone.Idle>
            </Group>
            <Text ta="center" fw={700} fz="lg" mt="xl">
              <Dropzone.Accept>Drop files here</Dropzone.Accept>
              <Dropzone.Reject>File must be a PDF, JPEG, or PNG less than 30MB</Dropzone.Reject>
              <Dropzone.Idle>Upload files</Dropzone.Idle>
            </Text>
            <Text ta="center" fz="sm" mt="xs" c="dimmed">
              Drag and drop files here to upload. We can accept only <i>.pdf, .jpeg, .png</i> files that
              are less than 30mb in size.
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
          size="md" radius="xl" onClick={handleSubmit}
          disabled={uploading || files.length === 0}
        >
          {uploading ? 'Uploading...' : `Uploaded ${files.length} File${files.length === 1 ? '' : 's'}`}
        </Button>
        {files.length > 0 &&
          <Button
            style={{
              position: 'absolute',
              bottom: rem('-20px'),
              left: '90%',
              transform: 'translateX(-90%)',
            }}
            color="red"
            size="md"
            radius="xl"
            onClick={handleCancel}
            disabled={uploading || files.length === 0}
          >
            <IconX style={{ marginRight: rem(5) }} />
            Cancel
          </Button>
        }

      </div>
    </Container>
  );
}