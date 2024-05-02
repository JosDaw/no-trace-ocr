'use client';
import useUser from '@/store/useUser';
import { AppShell, Burger, Button, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { Footer } from './Footer';

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
            Logo
            {isLoggedIn ? (
              <Group ml='xl' gap={2} visibleFrom='sm'>
                <Link href='/upload' passHref>
                  <Button>Upload</Button>
                </Link>
                <Button color='red' onClick={logoutUser}>
                  Logout
                </Button>
              </Group>
            ) : (
              <Group ml='xl' gap={2} visibleFrom='sm'>
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
          <Group ml='xl' gap={2} visibleFrom='sm'>
            <Link href='/upload' passHref>
              <Button>Upload</Button>
            </Link>
            <Button color='red' onClick={logoutUser}>
              Logout
            </Button>
          </Group>
        ) : (
          <>
            <Button>Register</Button>
            <Button>Login</Button>
          </>
        )}
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
      <Footer />
    </AppShell>
  );
}
