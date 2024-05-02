'use client';
import {
  Button,
  Container,
  Divider,
  List,
  ListItem,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import Link from 'next/link';

export default function Promotion() {
  return (
    <>
      <Divider my='md' />
      <Container my={100}>
        <Title mb={30} className='text-2xl font-bold text-gray-800 md:text-3xl'>
          Sign Up and Get $1 in Credits Free!
        </Title>
        <Text
          mb={25}
          className='text-md max-w-xl text-center text-gray-600 md:text-lg'
        >
          Explore our OCR services with a complimentary credit on us. Experience
          the difference in your translation workflow.
        </Text>
        <List
          mb={25}
          spacing='md'
          size='xl'
          center
          icon={
            <ThemeIcon color='teal' size={35} radius='xl'>
              <IconCircleCheck />
            </ThemeIcon>
          }
        >
          <ListItem className='flex items-center'>
            <Text component='span' className='ml-2'>
              Test our OCR accuracy with your documents.
            </Text>
          </ListItem>
          <ListItem className='flex items-center'>
            <Text component='span' className='ml-2'>
              Securely process several pages at no cost.
            </Text>
          </ListItem>
          <ListItem className='flex items-center'>
            <Text component='span' className='ml-2'>
              Experience the speed of our service firsthand.
            </Text>
          </ListItem>
        </List>
        <Link href='/user/register' passHref>
          <Button
            variant='filled'
            size='md'
            className='rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'
          >
            Register Now
          </Button>
        </Link>
      </Container>
    </>
  );
}
