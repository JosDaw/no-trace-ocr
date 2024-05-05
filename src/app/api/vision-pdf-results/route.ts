import { Storage } from '@google-cloud/storage';
import { NextRequest, NextResponse } from 'next/server';

/**
 * This route is responsible for fetching the result JSON file from the output
 */

// Need to set the storage credentials in a very particular way here
const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID || '',
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_EMAIL || '',
    private_key: process.env.GOOGLE_CLOUD_KEY?.split(String.raw`\n`).join('\n'),
  },
});

const bucketName = process.env.BUCKET_NAME || '';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();
  const fileName = body.fileName;
  const currentPage = body.currentPage;
  const outputPrefix =
    currentPage === 1
      ? `output/${fileName}-output-1-to-1.json`
      : `output/${fileName}-output-${currentPage}-to-${currentPage}.json`;

  try {
    const bucket = storage.bucket(bucketName);

    // Fetch the result JSON file from the output folder
    const outputFile = bucket.file(outputPrefix);

    if (!(await outputFile.exists())[0]) {
      return new NextResponse(JSON.stringify({ error: 'File not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const [resultData] = await outputFile.download();

    const resultText = JSON.parse(resultData.toString('utf8'));

    return new NextResponse(JSON.stringify({ result: resultText }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: 'Failed to retrieve or delete files. Error:' + error.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
