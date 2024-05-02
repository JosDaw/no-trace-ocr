'use client'
import { database, firebaseApp } from '@/config/firebase';
import useUser from '@/store/useUser';
import { getFirebaseError } from '@/utils/text-helper';
import { Button, Container, Flex, Group, Text, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


const LoginPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter()

  const auth = getAuth(firebaseApp);
  const loginUser = useUser((state: any) => state.loginUser)

  const handleRegister = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password)
        .then(async data => {
          // Get user details from firebase
          const userQuery = query(
            collection(database, "user"),
            where("userID", "==", data.user.uid),
            limit(1),
          )
          const querySnapshot = await getDocs(userQuery)

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0]

            if (userDoc.data().isDeleted) {
              setLoading(false)
              showNotification({
                title: 'Error',
                message: 'User not found. Please log out and try again.',
                color: 'red',
              });
              return
            }

            // Store with zustand
            loginUser({
              email: userDoc.data().email,
              userID: data.user.uid,
              userDoc: userDoc.id,
              credit: userDoc.data().credit,
            })

            showNotification({
              title: 'Success',
              message: 'Login successful!',
              color: 'green',
            });

            router.push("/upload")

          } else {
            setLoading(false)
            showNotification({
              title: 'Error',
              message: 'User not found. Please log out and try again.',
              color: 'red',
            });
          }
        })
        .catch((error: any) => {
          setLoading(false)
          showNotification({
            title: 'Login Error',
            message: getFirebaseError(error.message),
            color: 'red',
          });
            console.log("🚀 ~ handleRegister ~ error.message:", error.message)
        })
    } catch (error: any) {
      setLoading(false)
      showNotification({
        title: 'Login Error',
        message: getFirebaseError(error.message),
        color: 'red',
      });
    }
    setLoading(false);
  };


  return (
    <Container mx="auto" mt="xl">
      <Text size="xl" ta="center" fw={900} style={{ marginBottom: 20 }}>Login</Text>
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
        <Group mt="md">
          <Button onClick={handleRegister} loading={loading}>
            Login
          </Button>
        </Group>
      </Flex>
    </Container>
  );
};

export default LoginPage;
