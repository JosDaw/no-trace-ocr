'use client';
import LoadingCover from '@/components/layout/LoadingCover';
import { database, firebaseApp } from '@/config/firebase';
import useUser from '@/store/useUser';
import { getFirebaseError } from '@/utils/text-helper';
import {
  Alert,
  Box,
  Button,
  Container,
  Flex,
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
import { useCallback, useEffect, useState } from 'react';

// TODO: check this page. seems like its failing on the first time.

type VerificationStatus = 'error' | 'verified' | null;

const VerifyPage = () => {
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const auth = getAuth(firebaseApp);
  const loginUser = useUser((state: any) => state.loginUser);

  const verifyEmail = useCallback(
    async (code: string) => {
      try {
        await applyActionCode(getAuth(firebaseApp), code);

        const user = auth.currentUser;

        if (!user) {
          return;
        }

        await addDoc(collection(database, 'user'), {
          email: user.email,
          userID: user.uid,
          credit: 0,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          dateCreated: Timestamp.now(),
          dateUpdated: Timestamp.now(),
        })
          .then((userDoc) => {
            // Store user data in global state
            loginUser({
              email: user.email,
              userID: user.uid,
              userDoc: userDoc.id,
              credit: 0,
            });

            setVerificationStatus('verified');
            setIsLoading(false);
          })
          .catch((error) => {
            setVerificationStatus('error');
            setIsLoading(false);
            showNotification({
              title: 'Create New User Error',
              message: getFirebaseError(error.message),
              color: 'red',
            });
          });
      } catch (error: any) {
        setIsLoading(false);
        setVerificationStatus('error');
        showNotification({
          title: 'Verification Error',
          message: getFirebaseError(error.message),
          color: 'red',
        });
      }
    },
    [auth.currentUser, loginUser]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        setVerificationStatus('verified');
        setIsLoading(false);
        return;
      }

      const mode = searchParams.get('mode');
      const oobCode = searchParams.get('oobCode');

      if (mode === 'verifyEmail' && typeof oobCode === 'string') {
        await verifyEmail(oobCode);
      } else {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, searchParams, verifyEmail]);

  return (
    <Container mx='auto' mt='xl'>
      <LoadingCover visible={isLoading} />
      {(verificationStatus === 'verified' ||
        verificationStatus === 'error') && (
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          pt={25}
        >
          {verificationStatus === 'verified' && (
            <>
              <IconMoodHappyFilled size={60} color='green' />
              <Title my={20} ta='center' c='green'>
                Your email has been successfully verified!
              </Title>

              <Alert
                my={50}
                variant='light'
                color='green'
                title='Start uploading'
                icon={<IconCircleCheck />}
              >
                <Text>
                  Start using your account by uploading your documents.
                </Text>
                <Link href='/upload' passHref>
                  <Button size='lg' mt={20} variant='white' color='green'>
                    Upload
                  </Button>
                </Link>
              </Alert>
            </>
          )}
          {verificationStatus === 'error' && (
            <>
              <IconMoodSadFilled size={60} color='red' />
              <Title my={20} ta='center' c='red'>
                Oh no, the verification failed!
              </Title>
              <Text>
                Refresh the page and try again. If the problem persists, please
                contact us.
              </Text>
            </>
          )}
          <Flex gap={6}>
            <Link href='/' passHref>
              <Button mt='md' color='red'>
                Go to Home
              </Button>
            </Link>
            <Link href='/contact' passHref>
              <Button mt='md' color='blue'>
                Contact Us
              </Button>
            </Link>
          </Flex>
        </Box>
      )}
    </Container>
  );
};

export default VerifyPage;
