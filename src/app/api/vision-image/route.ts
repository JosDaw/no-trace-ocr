import { ImageAnnotatorClient } from '@google-cloud/vision';
import { GoogleAuth } from 'google-auth-library';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const fileBlob = formData.get('file');

    if (!fileBlob || !(fileBlob instanceof Blob)) {
      return new NextResponse(JSON.stringify({ error: 'No file uploaded' }), {
        status: 400,
      });
    }

    // Set credentials from environment variable
    const credentials = JSON.parse(
      process.env.GOOGLE_APPLICATION_CREDENTIALS || ''
    );
    const auth = new GoogleAuth({ credentials });

    // Convert the Blob to a Uint8Array
    const arrayBuffer = await fileBlob.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    // Create a new client for the Vision API
    const client = new ImageAnnotatorClient({ auth });

    // Convert the Uint8Array to base64
    const base64Image = Buffer.from(data).toString('base64');

    // Perform label detection with the Vision API
    const [result] = await client.textDetection({
      image: { content: base64Image },
    });

    // Return the result as a JSON response
    return new NextResponse(JSON.stringify({ result }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ error: 'Unable to process your request' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
