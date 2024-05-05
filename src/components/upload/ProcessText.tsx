import { LoggedInUser } from '@/types/types';
import {
  Alert,
  Button,
  Container,
  Flex,
  Paper,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconCircleNumber2,
  IconSkull,
} from '@tabler/icons-react';
import React from 'react';
import { AddCreditBanner } from '../credit/AddCreditBanner';
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
    <Paper my={50}>
      <Title ta='center' my={20}>
        <IconCircleNumber2 size={50} color={theme.colors.green[6]} />
        Confirm & Process File
      </Title>
      <Flex
        gap='md'
        justify='center'
        align='center'
        direction='row'
        wrap='wrap'
      >
        <CostSummary
          totalCount={totalPages}
          user={user}
          hasValidCredit={hasValidCredit}
        />
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
          <Alert
            variant='outline'
            color='red'
            title='Danger'
            icon={<IconSkull />}
          >
            <Text size='sm'>
              Do not refresh the page or turn off your device during processing.
              Large documents may take some time.
            </Text>
          </Alert>
        </Paper>
      </Flex>
      <AddCreditBanner />
    </Paper>
  );
}
