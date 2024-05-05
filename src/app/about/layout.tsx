import { Metadata } from 'next';
import Page from './page';

export const metadata: Metadata = {
  title: 'About | No Trace OCR',
  description:
    'No Trace OCR is a privacy-focused OCR tool that does not store your files. Learn more about the tool and how it works.',
  keywords:
    'OCR, free OCR, PDF OCR, image OCR, OCR tool, privacy-focused OCR, No Trace OCR, image to text, pdf to text',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    url: 'https://notraceocr.com/about',
    title: 'About | No Trace OCR',
    description:
      'No Trace OCR is a privacy-focused OCR tool that does not store your files. Learn more about the tool and how it works.',
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
