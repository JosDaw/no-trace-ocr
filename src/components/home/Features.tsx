'use client';
import {
  Button,
  Container,
  Grid,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconBrandSpeedtest,
  IconLock,
  IconTagsOff,
  IconTextRecognition,
} from '@tabler/icons-react';
import Link from 'next/link';

export default function FeaturesList() {
  const features = [
    {
      icon: <IconTextRecognition size={40} stroke={2} />,
      title: 'High Accuracy',
      description:
        'Our OCR technology ensures high accuracy in text recognition, crucial for effective translations.',
    },
    {
      icon: <IconLock size={40} stroke={2} />,
      title: 'Secure Processing',
      description:
        'All documents are processed securely, ensuring the confidentiality of your sensitive data.',
    },
    {
      icon: <IconBrandSpeedtest size={40} stroke={2} />,
      title: 'Fast Turnaround',
      description:
        'Enjoy rapid processing speeds that don’t compromise on quality, boosting your productivity.',
    },
    {
      icon: <IconTagsOff size={40} stroke={2} />,
      title: 'Affordable Pricing',
      description:
        'Our OCR services are priced competitively, making it accessible to all professional translators.',
    },
  ];

  const items = features.map((feature) => (
    <div key={feature.title}>
      <ThemeIcon
        size={44}
        radius='md'
        variant='gradient'
        gradient={{ deg: 135, from: '#89D4CF', to: '#734AE8' }}
      >
        {feature.icon}
      </ThemeIcon>
      <Text fz='lg' mt='sm' fw={500}>
        {feature.title}
      </Text>
      <Text c='dimmed' fz='sm'>
        {feature.description}
      </Text>
    </div>
  ));

  return (
    <Container my={100}>
      <Grid gutter={80}>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Title mb={25} className='text-xxl font-bold' order={2}>
            Essential Features for Freelance Translators
          </Title>
          <Text c='dimmed'>
            Our OCR technology is designed to increase your productivity and
            accuracy in translations. Here are some of the key features that set
            us apart.
          </Text>
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
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={30}>
            {items}
          </SimpleGrid>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
