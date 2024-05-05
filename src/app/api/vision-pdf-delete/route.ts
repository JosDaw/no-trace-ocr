import { Storage } from '@google-cloud/storage';
import { NextRequest, NextResponse } from 'next/server';

/**
 * This route is responsible for deleting the JSON files
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
  const totalPages = body.totalPages;

  try {
    let totalDeleted = 0;
    const bucket = storage.bucket(bucketName);

    const inputFile = `uploads/${fileName}.pdf`;
    const inputExists = await bucket.file(inputFile).exists();
    if (inputExists[0]) {
      await bucket.file(inputFile).delete();
      totalDeleted++;
    }

    // Deletes the file from the bucket for output

    // If there are multiple pages, delete all the files
    if (totalPages > 1) {
      for (let i = 1; i <= totalPages; i++) {
        const outputFile = `output/${fileName}-output-${i}-to-${i}.json`;
        const outputExists = await bucket.file(outputFile).exists();
        if (outputExists[0]) {
          await bucket.file(outputFile).delete();
          totalDeleted++;
        }
      }
    } else {
      const outputFile = `output/${fileName}-output-1-to-1.json`;
      const outputExists = await bucket.file(outputFile).exists();
      if (outputExists[0]) {
        await bucket.file(outputFile).delete();
        totalDeleted++;
      }
    }

    return new NextResponse(
      JSON.stringify({ message: `${totalDeleted} Files Deleted` }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
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
