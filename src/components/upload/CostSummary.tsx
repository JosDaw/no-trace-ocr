import { LoggedInUser } from '@/types/types';
import { formatCurrency } from '@/utils/text-helper';
import {
  Alert,
  Group,
  Paper,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import React from 'react';

interface CostSummaryProps {
  totalCount: number;
  user: LoggedInUser;
  hasValidCredit: boolean;
}

export default function CostSummary({
  totalCount,
  user,
  hasValidCredit,
}: CostSummaryProps) {
  const theme = useMantineTheme();
  const costPerItem = Number(process.env.PRICE_PER_ITEM) || 0.05;
  const totalCost = totalCount * costPerItem;

  return (
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
        Cost Summary
      </Title>
      <Group style={{ marginBottom: 5 }}>
        <Text size='sm'>Total Pages/Image:</Text>
        <Text size='sm' fw={500}>
          {totalCount}
        </Text>
      </Group>
      <Group>
        <Text size='sm'>Cost per Page/Image:</Text>
        <Text size='sm' fw={500}>
          ${costPerItem}
        </Text>
      </Group>
      <Group style={{ marginTop: 20 }}>
        <Text size='md' fw={700}>
          Total Cost:
        </Text>
        <Text size='md' fw={700} c={theme.colors.blue[6]}>
          {formatCurrency(totalCost)}
        </Text>
      </Group>
      <Group style={{ marginTop: 20 }}>
        <Text size='md' fw={700}>
          Your Credits
        </Text>
        <Text size='md' fw={700} c={theme.colors.red[6]}>
          {formatCurrency(user.credit)}
        </Text>
      </Group>
      {!hasValidCredit && (
        <Alert
          my={20}
          variant='light'
          color='red'
          title='Notice'
          icon={<IconAlertTriangle />}
        >
          <Text size='sm'>
            You do not have enough credit for this process. Please add more
            credit to continue.
          </Text>
        </Alert>
      )}
    </Paper>
  );
}
