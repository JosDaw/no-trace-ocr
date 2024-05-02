'use client'
import CostSummary from '@/components/upload/CostSummary';
import FileUpload from '@/components/upload/FileUpload';
import ProcessText from '@/components/upload/ProcessText';
import useUser from '@/store/useUser';
import { Flex } from '@mantine/core';
import { useState } from 'react';

export default function UploadPage() {
  const [totalPages, setTotalPages] = useState<number>(0);
  const [localFiles, setLocalFiles] = useState<File[]>([]);

  const { isLoggedIn, user } = useUser();

  const costPerItem = Number(process.env.PRICE_PER_ITEM) || 0.02;
  const hasValidCredit = user.credit >= totalPages * costPerItem;

  const handleProcessFiles = async () => {
    console.log('Processing files...', localFiles);

    // Check if localFiles is defined and contains files
    if (!localFiles || localFiles.length === 0) {
      console.error('No files to process.');
      return 0;
    }

    try {
      const labels = [];

      // Iterate over each file in localFiles array
      for (const file of localFiles) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('api/vision', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }

        const result = await response.json();
        labels.push(result);
      }

      console.log("🚀 ~ totalFiles ~ labels:", labels);
      return labels;
    } catch (error) {
      console.error('Error processing file:', error);
      return 0;
    }
  }

  return (
    <>
      <FileUpload setTotalPages={setTotalPages} setLocalFiles={setLocalFiles} />
      <Flex
        gap="md"
        justify="center"
        align="center"
        direction="row"
        wrap="wrap"
      >
        <CostSummary totalCount={totalPages} user={user} />
        <ProcessText isLoggedIn={isLoggedIn} hasValidCredit={hasValidCredit} handleProcessFiles={handleProcessFiles} />
      </Flex>
    </>
  );
}
