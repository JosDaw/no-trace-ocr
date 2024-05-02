import { LoggedInUser } from '@/types/types';
import { Button, Container, Group, Paper, Text, Title, useMantineTheme } from '@mantine/core';
import { IconCircleNumber3 } from '@tabler/icons-react';
import React from 'react';

interface ProcessTextProps {
  handleProcessFiles: () => void;
  isLoggedIn: boolean;
  hasValidCredit: boolean;
}

export default function ProcessText({ handleProcessFiles, isLoggedIn, hasValidCredit }: ProcessTextProps) {
  const theme = useMantineTheme();

  return (
    <Container my={100}>
      <Title ta="center" my={20}><IconCircleNumber3 size={50} color={theme.colors.green[6]} /> Process Text</Title>
      <Paper
        style={{
          maxWidth: 400,
          margin: 'auto',
          marginTop: 30,
          padding: 20,
          boxShadow: theme.shadows.sm,
        }}
      >
        <Title order={3} ta="center" style={{ marginBottom: 20 }}>
          Click to start processing
        </Title>
        <Button onClick={handleProcessFiles} disabled={!isLoggedIn || !hasValidCredit} fullWidth size="lg" my={30}>Process Files</Button>
        <Text ta="center" c="red.4" fw={700}>Warning: Do not refresh the page or turn off your device.</Text>
      </Paper>
    </Container>
  );
}