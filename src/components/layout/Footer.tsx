import {
  Anchor,
  Center,
  Divider,
  Grid,
  Group,
  Paper,
  Text,
} from '@mantine/core';
import Logo from './Logo';

const links = [
  { link: '/about', label: 'About' },
  { link: '/contact', label: 'Contact' },
  { link: '/legal/privacy', label: 'Privacy' },
  { link: '/legal/terms', label: 'Terms and Conditions' },
];

export function Footer() {
  const items = links.map((link) => (
    <Anchor<'a'>
      c='dimmed'
      key={link.label}
      href={link.link}
      onClick={(event) => event.preventDefault()}
      size='sm'
      fw={900}
    >
      {link.label}
    </Anchor>
  ));

  return (
    <Paper pb={20}>
      <Divider mb={20} />
      <Center>
        <Logo />
      </Center>
      <Grid style={{ overflow: 'hidden' }} justify='center' align='stretch' px={8}>
        <Grid.Col span={6}>
          <Text size='sm' py={6} c='dimmed'>
            © 2024 No Trace OCR, a brand of Constant Learning. All rights
            reserved.
            <br />
            경기도 용인시 기흥구 공세로 150-29 Business License: 423-40-00999 |
            CEO: 도조시 (+82)10-4882-1900
          </Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Group justify='flex-end' align='center'>{items}</Group>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}
