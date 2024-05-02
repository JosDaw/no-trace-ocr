import {
  Button,
  Container,
  Paper,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { IconCircleNumber3 } from '@tabler/icons-react';
import React from 'react';

interface ProcessTextProps {
  handleProcessFile: () => void;
  isLoggedIn: boolean;
  hasValidCredit: boolean;
  isProcessing: boolean;
  totalPages: number;
}

export default function ProcessText({
  handleProcessFile,
  isLoggedIn,
  hasValidCredit,
  isProcessing,
  totalPages,
}: ProcessTextProps) {
  const theme = useMantineTheme();

  return (
    <Container my={100}>
      <Title ta='center' my={20}>
        <IconCircleNumber3 size={50} color={theme.colors.green[6]} /> Process
        Text
      </Title>
      <Paper
        style={{
          maxWidth: 400,
          margin: 'auto',
          marginTop: 30,
          padding: 20,
          boxShadow: theme.shadows.sm,
        }}
      >
        <Title order={3} ta='center' style={{ marginBottom: 20 }}>
          Click to start processing
        </Title>
        <Button
          onClick={handleProcessFile}
          disabled={!isLoggedIn || !hasValidCredit || totalPages === 0}
          fullWidth
          size='lg'
          my={30}
          loading={isProcessing}
        >
          Process Files
        </Button>
        <Text ta='center' c='red.4' fw={700}>
          Warning: Do not refresh the page or turn off your device.
        </Text>
      </Paper>
    </Container>
  );
}
