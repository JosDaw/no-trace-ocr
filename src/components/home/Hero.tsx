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
          <Title order={1} c='white'>
            Secure Your Documents with Leading-Edge OCR Technology
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
            Empower your business with our highly secure and accurate OCR
            services, designed for any professional needing reliable document
            conversion. Experience rapid processing speeds with the assurance
            that your data is protected and immediately deleted after use.
          </Text>
          <Link href='/user/register' passHref>
            <Button size='lg' variant='white' style={{ marginTop: 20 }}>
              Experience Secure OCR Now
            </Button>
          </Link>
        </div>
      </Container>
    </Paper>
  );
}
