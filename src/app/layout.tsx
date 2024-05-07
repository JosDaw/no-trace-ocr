import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';

import { AppLayout } from '@/components/layout/AppLayout';
import {
  ColorSchemeScript,
  createTheme,
  MantineColorsTuple,
  MantineProvider,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Fira_Sans } from 'next/font/google';

// Add font
const openSans = Fira_Sans({
  weight: ['400', '500', '600', '700'],
  style: 'normal',
  subsets: ['latin'],
});

// Add basic metadata
export const metadata = {
  title: 'No Trace OCR | Privacy-focused OCR tool',
  description:
    'No Trace OCR is a privacy-focused OCR service that does not store your data. Securely your files or images and get the text extracted from them, quickly, easily, and affordably.',
  keywords:
    'OCR, free OCR, PDF OCR, image OCR, OCR tool, privacy-focused OCR, No Trace OCR, image to text, pdf to text',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    url: 'https://notraceocr.com',
    title: 'No Trace OCR',
    description:
      'No Trace OCR is a privacy-focused OCR service that does not store your data. Securely your files or images and get the text extracted from them, quickly, easily, and affordably.',
    images: [
      {
        url: 'https://notraceocr.com/assets/metacover.png',
        width: 1200,
        height: 630,
        alt: 'No Trace OCR',
      },
    ],
  },
};

const myColor: MantineColorsTuple = [
  '#eef3ff',
  '#dce4f5',
  '#b9c7e2',
  '#94a8d0',
  '#748dc1',
  '#5f7cb8',
  '#5474b4',
  '#44639f',
  '#39588f',
  '#2d4b81',
];

const theme = createTheme({
  colors: {
    myColor,
  },
  fontFamily: openSans.style.fontFamily,
  defaultRadius: 'md',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={openSans.className}>
        <MantineProvider theme={theme}>
          <Notifications />
          <AppLayout>{children}</AppLayout>
        </MantineProvider>
      </body>
    </html>
  );
}
