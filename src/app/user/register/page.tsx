'use client'
import { firebaseApp } from '@/config/firebase';
import { getFirebaseError } from '@/utils/text-helper';
import { Button, Checkbox, Container, Flex, Group, Text, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from 'firebase/auth';
import Link from 'next/link';
import { useState } from 'react';

// TODO: require more secure password

const RegisterPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const auth = getAuth(firebaseApp);

  const handleRegister = async () => {
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      showNotification({
        title: 'Success',
        message: 'Registration successful! Verification email sent.',
        color: 'green',
      });
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setTermsAccepted(false);
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
    <Container mx="auto" mt="xl">
      <Text size="xl" ta="center" fw={900} style={{ marginBottom: 20 }}>Register</Text>
      <Flex
        gap="md"
        justify="flex-start"
        align="flex-start"
        direction="column"
        wrap="wrap"
      >
        <TextInput
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          required
          miw={350}
        />
        <TextInput
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          required
        />
        <TextInput
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.currentTarget.value)}
          required
        />
        <Checkbox
          label={<>
            I agree to the OCRiginal Translator{" "}
            <Link href="/legal/terms" target="_blank">
              terms and conditions
            </Link>
          </>}
          checked={termsAccepted}
          onChange={(event: { currentTarget: { checked: boolean | ((prevState: boolean) => boolean); }; }) => setTermsAccepted(event.currentTarget.checked)}
          mt="md"
        />
        <Group mt="md">
          <Button disabled={!termsAccepted} onClick={handleRegister} loading={loading}>
            Register
          </Button>
        </Group>
      </Flex>
    </Container>
  );
};

export default RegisterPage;
