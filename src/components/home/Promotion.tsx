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
      <Container my={100}>
        <Title
          ta='center'
          mb={30}
          className='text-2xl font-bold text-gray-800 md:text-3xl'
        >
          Sign Up and Get 10 Pages Free
        </Title>
        <Text
          mb={25}
          ta='center'
          fw={500}
          className='text-md max-w-xl text-center text-gray-600 md:text-lg'
        >
          Explore our OCR services with complimentary credit on us. Experience
          the difference in your workflow.
        </Text>
        <List
          mb={25}
          spacing='md'
          size='xl'
          center
          icon={
            <ThemeIcon color='#734AE8' size={35} radius='xl'>
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
              Experience the accuracy of our service firsthand.
            </Text>
          </ListItem>
        </List>
        <Link href='/user/register' passHref>
          <Button
            variant='gradient'
            gradient={{ deg: 135, from: '#89D4CF', to: '#734AE8' }}
            size='lg'
            radius='md'
            mt='xl'
          >
            Get Started
          </Button>
        </Link>
      </Container>
    </>
  );
}
