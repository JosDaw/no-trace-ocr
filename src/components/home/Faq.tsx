'use client';
import {
  Accordion,
  Container,
  Paper,
  ThemeIcon,
  Title,
  rem,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

const questions = [
  {
    question: 'How do I create an account?',
    answer:
      'To create an account, click on the "Register" button and follow the instructions.',
  },
  {
    question: 'How does OCRiginal Translator work?',
    answer:
      'After creating an account, you can upload your documents for OCR processing. You can use your free credit or load more credit onto your account to process more documents. Once your documents are processed, you can download the results in your preferred format.',
  },
  {
    question: 'How can I reset my password?',
    answer:
      'To reset your password, click on the "Forgot password" link on the login page and follow the instructions.',
  },
  {
    question: 'Can I create more that one account?',
    answer: 'No, you can only create one account per email address.',
  },
  {
    question: 'Do you store credit card information securely?',
    answer:
      'Yes, we use industry-standard encryption to protect your credit card information.',
  },
  {
    question: 'What payment systems to you work with?',
    answer:
      'We use PayPal to process payments. You can pay with your PayPal account or with a credit card.',
  },
];

export function Faq() {
  return (
    <Paper
      shadow='xl'
      radius='none'
      style={{
        backgroundColor: '#89D4CF',
        padding: '120px 0',
      }}
    >
      <Container size='sm'>
        <Title ta='center' my={30}>
          Frequently Asked Questions
        </Title>

        <Accordion
          chevronPosition='right'
          defaultValue='reset-password'
          chevronSize={26}
          variant='separated'
          disableChevronRotation
          styles={{
            label: { color: 'var(--mantine-color-black)' },
            item: { border: 0 },
          }}
          chevron={
            <ThemeIcon radius='xl' color='#734AE8' size={26}>
              <IconPlus
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            </ThemeIcon>
          }
        >
          {questions.map((question) => (
            <Accordion.Item key={question.question} value={question.question}>
              <Accordion.Control>{question.question}</Accordion.Control>
              <Accordion.Panel>{question.answer}</Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </Paper>
  );
}
