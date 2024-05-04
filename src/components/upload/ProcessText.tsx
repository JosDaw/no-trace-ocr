import { LoggedInUser } from '@/types/types';
import {
  Button,
  Container,
  Flex,
  Paper,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { IconCircleNumber2, IconCircleNumber3 } from '@tabler/icons-react';
import React from 'react';
import CostSummary from './CostSummary';

interface ProcessTextProps {
  handleProcessFile: () => void;
  isLoggedIn: boolean;
  hasValidCredit: boolean;
  isProcessing: boolean;
  totalPages: number;
  user: LoggedInUser;
}

export default function ProcessText({
  handleProcessFile,
  isLoggedIn,
  hasValidCredit,
  isProcessing,
  totalPages,
  user,
}: ProcessTextProps) {
  const theme = useMantineTheme();

  return (
    <Paper my={100}>
      <Title ta='center' my={20}>
        <IconCircleNumber2 size={50} color={theme.colors.green[6]} />
        Confirm & Process Document
      </Title>
      <Flex
        gap='md'
        justify='center'
        align='center'
        direction='row'
        wrap='wrap'
      >
        <CostSummary totalCount={totalPages} user={user} />
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
      </Flex>
    </Paper>
  );
}
