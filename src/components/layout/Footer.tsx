import { Center, Divider, Grid, Group, Paper, Text } from '@mantine/core';
import Link from 'next/link';
import CookieConsent from 'react-cookie-consent';
import Logo from './Logo';

const links = [
  { link: '/about', label: 'About' },
  { link: '/contact', label: 'Contact' },
  { link: '/legal/privacy', label: 'Privacy' },
  { link: '/legal/terms', label: 'Terms and Conditions' },
];

export function Footer() {
  const items = links.map((link) => (
    <Link key={link.label} href={link.link}>
      <Text c='dimmed' size='sm' fw={900}>
        {link.label}
      </Text>
    </Link>
  ));

  return (
    <>
      {process.env.NODE_ENV !== 'test' && (
        <CookieConsent
          style={{ background: '#734AE8', overflowX: 'hidden' }}
          buttonStyle={{
            color: '#232323',
            background: '#ffff',
            borderRadius: '25px',
          }}
          buttonText='I understand and agree'
          overlay={true}
        >
          <Text c='white'>
            This site uses cookies and similar technologies to improve your user
            experience. You can read the No Trace OCR{' '}
            <Link
              href='/legal/privacy'
              style={{ color: '#fff' }}
              className='underline'
            >
              Privacy Policy
            </Link>
            .
            <br />
            By clicking &quot;I understand&quot;, you consent to the use of
            cookies and similar technologies on No Trace OCR. This agreement is
            required for No Trace OCR to function correctly. No personal data is
            stored or shared.
          </Text>
        </CookieConsent>
      )}
      <Paper pb={20}>
        <Divider mb={20} />
        <Center>
          <Logo />
        </Center>
        <Grid
          style={{ overflow: 'hidden' }}
          justify='center'
          align='stretch'
          px={8}
        >
          <Grid.Col span={6}>
            <Text size='sm' py={6} c='dimmed'>
              © 2024 No Trace OCR, a website of Constant Learning. All rights
              reserved.
              <br />
              경기도 용인시 기흥구 공세로 150-29 Business License: 423-40-00999
              | CEO: 도조시 (+82)10-4882-1900
            </Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Group justify='flex-end' align='center'>
              {items}
            </Group>
          </Grid.Col>
        </Grid>
      </Paper>
    </>
  );
}
