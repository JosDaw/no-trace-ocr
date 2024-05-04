'use client';
import useUser from '@/store/useUser';
import { formatCurrency } from '@/utils/text-helper';
import { AppShell, Burger, Button, Group, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { Footer } from './Footer';
import Logo from './Logo';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

  const { isLoggedIn, user } = useUser();
  const logoutUser = useUser((state: any) => state.logoutUser);

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
                <Text size='sm' c='gray' mx={5}>
                  Credit: {formatCurrency(user.credit)}
                </Text>
                <Link href='/free' passHref>
                  <Button color='green'>Free Upload</Button>
                </Link>
                <Link href='/upload' passHref>
                  <Button>Upload</Button>
                </Link>
                <Button color='red' onClick={logoutUser}>
                  Logout
                </Button>
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
            <Text size='sm' c='gray' mx={5}>
              Credit: {formatCurrency(user.credit)}
            </Text>
            <Link href='/free' passHref>
              <Button color='green'>Free Upload</Button>
            </Link>
            <Link href='/upload' passHref>
              <Button>Upload</Button>
            </Link>
            <Button color='red' onClick={logoutUser}>
              Logout
            </Button>
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
