'use client'
import { firebaseApp } from "@/config/firebase";
import { getFirebaseError } from "@/utils/text-helper";
import { Alert, Button, Container, TextInput, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const auth = getAuth(firebaseApp);

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    if (email === "") {
      showNotification({
        title: "Error",
        message: "Please write your email to reset your password.",
        color: "red",
      });
      return
    }

    // Send with Google auth
    try {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          showNotification({
            title: "Success",
            message: "Email sent. Please check your inbox.",
            color: "green",
          });
          setSubmitted(true);
        })
        .catch((error: any) => {
          showNotification({
            title: "Error",
            message: getFirebaseError(error.code),
            color: "red",
          });
        })
    } catch (error: any) {
      showNotification({
        title: "Error",
        message: getFirebaseError(error.code),
        color: "red",
      });
    }
  };

  return (
    <Container size="sm" style={{ marginTop: '40px' }}>
      <Title ta="center" mb={25}>Forgot Password</Title>
      <Title size="md" ta="center" mb={25}>Please use the email you registered with!</Title>

      <form onSubmit={handleSubmit}>
        <TextInput
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          required
          style={{ marginBottom: '20px' }}
          disabled={submitted}
        />
        <Button type="submit" disabled={submitted}>
          Reset Password
        </Button>
        {submitted && (
          <Alert title="Please check your email" color="green" style={{ marginTop: '20px' }}>
            If an account with that email exists, we have sent password reset instructions to your email address.
          </Alert>
        )}
      </form>
    </Container>
  );
}
