'use client';
import ResetPassword from '@/components/user/ResetPassword';
import {
  Skeleton,
} from '@mantine/core';

import { Suspense } from 'react';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Skeleton height={8} mt={6} radius="xl" />}>
      <ResetPassword />
    </Suspense>
  );
}
