'use client';
import Password from '@/components/user/Password';
import { firebaseApp } from '@/config/firebase';
import { getFirebaseError } from '@/utils/text-helper';
import {
  Button,
  Checkbox,
  Container,
  Flex,
  Group,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
} from 'firebase/auth';
import Link from 'next/link';
import { useState } from 'react';

const RegisterPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const auth = getAuth(firebaseApp);

  /**
   * Handles the registration process.
   * 
   * @returns {Promise<void>} A promise that resolves when the registration process is complete.
   */
  const handleRegister = async (): Promise<void> => {
    if (password !== confirmPassword) {
      showNotification({
        title: 'Error',
        message: 'Passwords do not match!',
        color: 'red',
      });
      return;
    }

    if (!termsAccepted) {
      showNotification({
        title: 'Error',
        message: 'You must accept the terms and conditions to register.',
        color: 'red',
      });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(userCredential.user);
      showNotification({
        title: 'Success',
        message: 'Registration successful! Verification email sent.',
        color: 'green',
      });
      setPassword('');
      setConfirmPassword('');
      setTermsAccepted(false);
      setEmailSent(true);
    } catch (error: any) {
      showNotification({
        title: 'Registration Error',
        message: getFirebaseError(error.message),
        color: 'red',
      });
    }
    setLoading(false);
  };

  return (
    <Container mx='auto' mt='xl'>
      <Title ta='center' mb={45}>
        Register
      </Title>
      <Text fw={500} ta='center' mb={45}>
        Create a free account to get started with No Trace OCR!
      </Text>
      {emailSent ? (
        <Title c='blue' ta='center' mb={45}>
          Verification email sent to your email ({email}).
        </Title>
      ) : (
        <Flex
          gap='md'
          justify='flex-start'
          align='flex-start'
          direction='column'
          wrap='wrap'
        >
          <TextInput
            label='Email'
            placeholder='Enter your email'
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            required
            miw={350}
          />
          <Password password={password} setPassword={setPassword} />
          <PasswordInput
            label='Confirm Password'
            type='password'
            placeholder='Confirm your password'
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.currentTarget.value)}
            required
            miw={300}
          />
          <Checkbox
            label={
              <>
                I agree to the No Trace OCR{' '}
                <Link href='/legal/terms' target='_blank'>
                  terms and conditions
                </Link>
              </>
            }
            checked={termsAccepted}
            onChange={(event: {
              currentTarget: {
                checked: boolean | ((prevState: boolean) => boolean);
              };
            }) => setTermsAccepted(event.currentTarget.checked)}
            mt='md'
          />
          <Group mt='md'>
            <Button
              disabled={!termsAccepted}
              onClick={handleRegister}
              loading={loading}
            >
              Register
            </Button>
          </Group>
        </Flex>
      )}
    </Container>
  );
};

export default RegisterPage;
