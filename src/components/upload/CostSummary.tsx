import { LoggedInUser } from '@/types/types';
import { Container, Group, Paper, Text, Title, useMantineTheme } from '@mantine/core';
import { IconCircleNumber2 } from '@tabler/icons-react';
import React from 'react';

interface CostSummaryProps {
  totalCount: number;
  user: LoggedInUser
}

export default function CostSummary({ totalCount, user }: CostSummaryProps) {
  const theme = useMantineTheme();
  const costPerItem = Number(process.env.PRICE_PER_ITEM) || 0.02;
  const totalCost = (totalCount * costPerItem).toFixed(2);

  return (
    <Container my={100}>
      <Title ta="center" my={20}><IconCircleNumber2 size={50} color={theme.colors.yellow[6]} /> Calculate Cost</Title>
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
          Cost Summary
        </Title>
        <Group style={{ marginBottom: 5 }}>
          <Text size="sm">Total Pages/Images:</Text>
          <Text size="sm" fw={500}>{totalCount}</Text>
        </Group>
        <Group >
          <Text size="sm">Cost per Page/Image:</Text>
          <Text size="sm" fw={500}>${costPerItem}</Text>
        </Group>
        <Group style={{ marginTop: 20 }}>
          <Text size="md" fw={700}>Total Cost:</Text>
          <Text size="md" fw={700} c={theme.colors.blue[6]}>${totalCost}</Text>
        </Group>
        <Group style={{ marginTop: 20 }}>
          <Text size="md" fw={700}>Your Credits</Text>
          <Text size="md" fw={700} c={theme.colors.red[6]}>${user.credit}</Text>
        </Group>
      </Paper>
    </Container>
  );
}
