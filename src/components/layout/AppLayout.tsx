'use client';
import { database } from '@/config/firebase';
import useUser from '@/store/useUser';
import { formatCurrency } from '@/utils/text-helper';
import {
  AppShell,
  Burger,
  Button,
  Group,
  Loader,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Footer } from './Footer';
import Logo from './Logo';
import { UserMenu } from './UserMenu';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(false);

  const [opened, { toggle }] = useDisclosure();
  const { isLoggedIn, user } = useUser();

  const updateCredit = useUser((state: any) => state.updateCredit);

  useEffect(() => {
    async function fetchUserData() {
      if (isLoggedIn) {
        setLoading(true);

        try {
          // Get user details from firebase
          const userQuery = query(
            collection(database, 'user'),
            where('userID', '==', user.userID),
            limit(1)
          );
          const querySnapshot = await getDocs(userQuery);

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];

            if (userDoc.data().isDeleted) {
              setLoading(false);
              showNotification({
                title: 'Error',
                message: 'User not found. Please log out and try again.',
                color: 'red',
              });
              return;
            }

            // Store with zustand
            updateCredit(userDoc.data().credit);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          setLoading(false);
          showNotification({
            title: 'Error',
            message: 'An error occurred while fetching user details.',
            color: 'red',
          });
        } finally {
          setLoading(false);
        }
      }
    }

    fetchUserData();
  }, [isLoggedIn, updateCredit, user.userID, setLoading]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { desktop: true, mobile: !opened },
      }}
    >
      <AppShell.Header>
        <Group h='100%' px='md'>
          <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
          <Group justify='space-between' style={{ flex: 1 }}>
            <Logo />
            {isLoggedIn ? (
              <Group ml='xl' gap={8} visibleFrom='sm'>
                {loading ? (
                  <Loader />
                ) : (
                  <Text size='sm' c='gray' mx={5}>
                    Credit: {formatCurrency(user.credit)}
                  </Text>
                )}
                <Link href='/free' passHref>
                  <Button color='green'>Free Upload</Button>
                </Link>
                <Link href='/upload' passHref>
                  <Button>Upload</Button>
                </Link>
                <UserMenu />
              </Group>
            ) : (
              <Group ml='xl' gap={8} visibleFrom='sm'>
                <Link href='/free' passHref>
                  <Button color='green'>Free Upload</Button>
                </Link>
                <Link href='/user/register' passHref>
                  <Button>Register</Button>
                </Link>
                <Link href='/user/login' passHref>
                  <Button>Login</Button>
                </Link>
              </Group>
            )}
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py='md' px={4}>
        {isLoggedIn ? (
          <Group ml='xl' gap={6} visibleFrom='sm'>
            {loading ? (
              <Loader />
            ) : (
              <Text size='sm' c='gray' mx={5}>
                Credit: {formatCurrency(user.credit)}
              </Text>
            )}
            <Link href='/free' passHref>
              <Button color='green'>Free Upload</Button>
            </Link>
            <Link href='/upload' passHref>
              <Button>Upload</Button>
            </Link>
            <UserMenu />
          </Group>
        ) : (
          <Group ml='xl' gap={8} visibleFrom='sm'>
            <Link href='/free' passHref>
              <Button color='green'>Free Upload</Button>
            </Link>
            <Link href='/user/register' passHref>
              <Button>Register</Button>
            </Link>
            <Link href='/user/login' passHref>
              <Button>Login</Button>
            </Link>
          </Group>
        )}
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
      <Footer />
    </AppShell>
  );
}
