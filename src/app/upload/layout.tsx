import { Metadata } from 'next';
import Page from './page';

export const metadata: Metadata = {
  title: 'Upload | No Trace OCR',
  description:
    'Upload PDF and image files for free OCR processing. No Trace OCR is a privacy-focused OCR tool that does not store your files.',
  keywords:
    'OCR, free OCR, PDF OCR, image OCR, OCR tool, privacy-focused OCR, No Trace OCR, image to text, pdf to text',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    url: 'https://notraceocr.com/upload',
    title: 'Upload | No Trace OCR',
    description:
      'Upload PDF and image files for free OCR processing. No Trace OCR is a privacy-focused OCR tool that does not store your files.',
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
export default Page;
