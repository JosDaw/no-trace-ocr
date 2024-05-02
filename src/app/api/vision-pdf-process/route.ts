import { ImageAnnotatorClient } from '@google-cloud/vision';
import { GoogleAuth } from 'google-auth-library';
import { NextRequest, NextResponse } from 'next/server';

/**
 * This route is responsible for processing the image file
 */

const bucketName = process.env.BUCKET_NAME || '';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const fileName = body.fileName; // Expect the fileName to be sent in the request body

    if (!fileName) {
      return new NextResponse(
        JSON.stringify({ error: 'No file name provided' }),
        {
          status: 400,
        }
      );
    }

    // Set credentials from environment variable
    const credentials = JSON.parse(
      process.env.GOOGLE_CLOUD_STORAGE_CREDENTIALS || ''
    );
    const auth = new GoogleAuth({ credentials });

    const client = new ImageAnnotatorClient({ auth });
    const gcsSourceUri = `gs://${bucketName}/uploads/${fileName}.pdf`;
    const gcsDestinationUri = `gs://${bucketName}/output/${fileName}-`;

    const [operation] = await client.asyncBatchAnnotateFiles({
      requests: [
        {
          inputConfig: {
            gcsSource: {
              uri: gcsSourceUri,
            },
            mimeType: 'application/pdf',
          },
          features: [
            {
              type: 'DOCUMENT_TEXT_DETECTION',
            },
          ],
          outputConfig: {
            gcsDestination: {
              uri: gcsDestinationUri,
            },
            batchSize: 1,
          },
        },
      ],
    });

    return new NextResponse(
      JSON.stringify({ message: 'Processing started', fileName }),
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
        error: 'Unable to process your request. Error: ' + error.message,
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
