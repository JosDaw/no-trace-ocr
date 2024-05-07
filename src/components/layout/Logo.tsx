import { Title } from '@mantine/core';
import { Orbitron } from 'next/font/google';
import Link from 'next/link';
const orbitron = Orbitron({
  weight: ['700'],
  style: 'normal',
  subsets: ['latin'],
});

export default function Logo() {
  return (
    <Link href='/'>
      <Title
        p={10}
        ta='center'
        style={{
          display: 'inline-block',
          fontFamily: orbitron.style.fontFamily,
          color: 'black',
        }}
      >
        No Trace{' '}
        <span
          style={{
            background: 'linear-gradient(to bottom, #89D4CF, #734AE8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent', 
          }}
        >
          OCR
        </span>
      </Title>
    </Link>
  );
}
