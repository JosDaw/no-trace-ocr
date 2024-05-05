'use client';
import { Button, Center, Group, Paper, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import CreditModal from './CreditModal';

export function AddCreditBanner() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Center mx={25} my={50}>
        <Paper withBorder p='lg' radius='md' shadow='md'>
          <Group justify='space-between' mb='xs'>
            <Title fz='lg' fw={500} c='blue'>
              Need More Credit?
            </Title>
          </Group>
          <Text c='dimmed'>
            Easily and conveniently add credit to your account now!
          </Text>
          <Group justify='flex-end' mt='md'>
            <Button variant='outline' size='md' onClick={open}>
              Add Credit
            </Button>
          </Group>
        </Paper>
      </Center>
      <CreditModal opened={opened} onClose={close} />
    </>
  );
}
