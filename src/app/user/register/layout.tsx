import { Metadata } from 'next';
import Page from './page';

export const metadata: Metadata = {
  title: 'Register | No Trace OCR',
  description:
    'Register for a No Trace OCR account to access free OCR processing for PDF and image files. No Trace OCR is a privacy-focused OCR tool that does not store your files.',
  keywords:
    'OCR, free OCR, PDF OCR, image OCR, OCR tool, privacy-focused OCR, No Trace OCR, image to text, pdf to text',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    url: 'https://notraceocr.com/user/register',
    title: 'Register | No Trace OCR',
    description:
      'Register for a No Trace OCR account to access free OCR processing for PDF and image files. No Trace OCR is a privacy-focused OCR tool that does not store your files.',
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
