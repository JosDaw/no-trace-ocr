import { Button, Container, Paper, Text, Title } from '@mantine/core';
import Link from 'next/link';

export default function Hero() {
  return (
    <Paper
      shadow='xl'
      radius='none'
      style={{
        backgroundImage: 'linear-gradient(135deg, #89D4CF 0%, #734AE8 100%)',
        padding: '120px 0',
      }}
    >
      <Container size='lg'>
        <div style={{ maxWidth: 600 }}>
          <Title className='text-white' order={1} style={{}}>
            Elevate Your Translations with Cutting-Edge OCR Technology
          </Title>
          <Text
            color='dimmed'
            size='lg'
            style={{
              marginTop: 20,
              marginBottom: 30,
              color: '#FFFFFF',
            }}
          >
            Unlock the full potential of your translation processes with our
            secure, accurate, and fast OCR services, designed specifically for
            professional translators.
          </Text>
          <Link href='/user/register' passHref>
            <Button size='lg' variant='white' style={{ marginTop: 20 }}>
              Try It Free
            </Button>
          </Link>
        </div>
      </Container>
    </Paper>
  );
}
