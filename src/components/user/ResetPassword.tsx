'use client';
import Password from '@/components/user/Password';
import { firebaseApp } from '@/config/firebase';
import { Alert, Button, Container, PasswordInput, Title } from '@mantine/core';
import { confirmPasswordReset, getAuth } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function ResetPassword() {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const auth = getAuth(firebaseApp);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');

    if (!mode || !oobCode) {
      setError('Invalid reset link.');
      return;
    }

    if (password === '') {
      setError('Please enter a new password.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, password).then(() => {
        setSuccess(true);
        router.push('/user/login');
      });
    } catch (error) {
      setError('Failed to reset password. Please try again.');
    }
  };

  return (
    <Container size='sm' my={40}>
      <Title ta='center' mb={25}>
        Reset Password
      </Title>
      <form onSubmit={handleSubmit}>
        <Password password={password} setPassword={setPassword} />
        <PasswordInput
          label='Confirm Password'
          placeholder='Confirm your new password'
          type='password'
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.currentTarget.value)}
          required
          my={20}
          disabled={success}
        />
        <Button type='submit' disabled={success}>
          Reset Password
        </Button>
        {error && (
          <Alert color='red' title='Error'>
            {error}
          </Alert>
        )}
        {success && (
          <Alert color='green' title='Success'>
            Password has been reset successfully.
          </Alert>
        )}
      </form>
    </Container>
  );
}
