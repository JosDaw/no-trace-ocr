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
  IconFileTypeDoc,
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
        'We utilize the latest OCR technology to ensure high accuracy in text recognition from PDFs and images.',
    },
    {
      icon: <IconLock size={40} stroke={2} />,
      title: 'Secure Processing',
      description:
        'All documents are processed securely and immediately deleted after the OCR process is completed, ensuring the confidentiality of your sensitive data.',
    },
    {
      icon: <IconFileTypeDoc size={40} stroke={2} />,
      title: 'Rich Text Editing Tools',
      description:
        'Easily edit and format your extracted text with our rich text editing tools, and download your changes in a range of formats.',
    },
    {
      icon: <IconTagsOff size={40} stroke={2} />,
      title: 'Affordable Pricing',
      description:
        'Our OCR services are priced competitively, designed for professionals at all levels.',
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
      <Grid>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Title mb={25} className='text-xxl font-bold' order={2}>
            Essential Features for Professionals
          </Title>
          <Text c='dimmed'>
            Our OCR technology is designed to increase your productivity and
            accuracy, without sacrificing security or confidentaility. Here are
            some of the key features that set us apart.
          </Text>
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
