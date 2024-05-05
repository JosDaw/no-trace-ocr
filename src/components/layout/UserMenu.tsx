'use client';
import { database, firebaseApp } from '@/config/firebase';
import useUser from '@/store/useUser';
import { ActionIcon, Group, Menu, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import {
  IconDots,
  IconLogout,
  IconTrash,
  IconUserDollar,
} from '@tabler/icons-react';
import { deleteUser, getAuth } from 'firebase/auth';
import { collection, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import CreditModal from '../credit/CreditModal';

export function UserMenu() {
  const auth = getAuth(firebaseApp);
  const logoutUser = useUser((state: any) => state.logoutUser);
  const { user } = useUser();
  const router = useRouter();

  const [opened, { open, close }] = useDisclosure(false);

  const env = process.env.NODE_ENV || 'development';
  const paypalClientId =
    env == 'development'
      ? process.env.NEXT_PUBLIC_PAYPAL_SANDBOX_CLIENT_ID
      : process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  const handleDeleteUser = async () => {
    if (auth.currentUser) {
      try {
        await deleteUser(auth.currentUser).then(async () => {
          const updateRef = doc(
            collection(database, 'user'),
            user.userDoc.toString()
          );

          // Update credit first
          await updateDoc(updateRef, {
            isDeleted: true,
            dateUpdated: Timestamp.now(),
          });

          logoutUser();
          router.push('/');

          showNotification({
            title: 'Account Deleted',
            message: 'Your account has been successfully deleted.',
            color: 'green',
          });
        });
      } catch (error) {
        showNotification({
          title: 'Error',
          message: 'Failed to delete user.',
          color: 'red',
        });
      }
    } else {
      showNotification({
        title: 'Error',
        message: 'No user is signed in to delete.',
        color: 'red',
      });
    }
  };
  return (
    <PayPalScriptProvider
      options={{
        clientId: paypalClientId as string,
        currency: 'USD',
        intent: 'capture',
      }}
    >
      <Group justify='center'>
        <Menu
          withArrow
          width={300}
          position='bottom'
          transitionProps={{ transition: 'pop' }}
          withinPortal
        >
          <Menu.Target>
            <ActionIcon variant='default'>
              <IconDots
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={
                <IconUserDollar
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                  color='blue'
                />
              }
              onClick={open}
            >
              Add Credit
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconLogout
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                />
              }
              onClick={logoutUser}
            >
              Logout
            </Menu.Item>

            <Menu.Divider />
            <Menu.Label>Danger zone</Menu.Label>
            <Menu.Item
              color='red'
              leftSection={
                <IconTrash
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                />
              }
              onClick={handleDeleteUser}
            >
              Delete account
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <CreditModal opened={opened} onClose={close} />
    </PayPalScriptProvider>
  );
}