'use client'
import { Container, Divider, Paper, Text, Title, useMantineTheme } from "@mantine/core";

export default function AboutPage() {
  const theme = useMantineTheme();

  const customPaperStyle = {
    padding: '20px',
    backgroundColor: theme.colors.gray[0],
    boxShadow: theme.shadows.sm,
    borderRadius: theme.radius.md,
    marginBottom: '20px'
  };

  return (
    <Container size="md" mt={40} style={{ padding: '20px' }}>
      <Paper style={customPaperStyle}>
        <Title order={1} mb={20}>About No Trace OCR</Title>

        <Text size="lg" mb={10}>
          No Trace OCR offers cutting-edge Optical Character Recognition (OCR) technology
          to make your documents instantly readable and editable. Our service is designed
          to be fast, secure, and user-friendly, catering to your OCR needs.
        </Text>
      </Paper>

      <Divider m={20} />

      <Paper style={customPaperStyle}>
        <Title order={2} mb={10}>Our Promise</Title>
        <Text size="lg" mb={10}>
          We provide a fully confidential service that ensures your documents are handled
          securely. With No Trace OCR, your privacy is guaranteed. We do not store any
          confidential documents or data after processing.
        </Text>
      </Paper>

      <Divider m={20} />

      <Paper style={customPaperStyle}>
        <Title order={2} mb={10}>Affordable and Accessible</Title>
        <Text size="lg">
          Our OCR services are not only free but also offer premium features at an affordable
          rate, ensuring accessibility for all users, from students to professionals.
        </Text>
      </Paper>
    </Container>
  );
}
