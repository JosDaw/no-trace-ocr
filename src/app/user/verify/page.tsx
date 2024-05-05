'use client';
import LoadingCover from '@/components/layout/LoadingCover';
import Verify from '@/components/user/Verify';
import { database, firebaseApp } from '@/config/firebase';
import useUser from '@/store/useUser';
import { getFirebaseError } from '@/utils/text-helper';
import {
  Alert,
  Box,
  Button,
  Container,
  Flex,
  Skeleton,
  Text,
  Title,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import {
  IconCircleCheck,
  IconMoodHappyFilled,
  IconMoodSadFilled,
} from '@tabler/icons-react';
import { applyActionCode, getAuth, onAuthStateChanged } from 'firebase/auth';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';

// TODO: check this page. seems like its failing on the first time.

const VerifyPage = () => {
  return (
    <Suspense fallback={<Skeleton height={8} mt={6} radius="xl" />}>
      <Verify />
    </Suspense>
  );
};

export default VerifyPage;
