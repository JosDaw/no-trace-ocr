'use client';
import Verify from '@/components/user/Verify';
import { Skeleton } from '@mantine/core';
import { Suspense } from 'react';

const VerifyPage = () => {
  return (
    <Suspense fallback={<Skeleton height={8} mt={6} radius='xl' />}>
      <Verify />
    </Suspense>
  );
};

export default VerifyPage;
