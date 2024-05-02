import { Storage } from '@google-cloud/storage';
import { NextRequest, NextResponse } from 'next/server';

/**
 * This route is responsible for uploading the PDF to the bucket
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
  try {
    const formData = await req.formData();
    const fileBlob = formData.get('file');
    const user = formData.get('userId');

    if (!fileBlob || !(fileBlob instanceof Blob)) {
      return new NextResponse(JSON.stringify({ error: 'No file uploaded' }), {
        status: 400,
      });
    }

    const fileName = `uploads/${fileBlob.name + user}.pdf`;
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    // Upload the file to GCS
    await new Promise<void>(async (resolve, reject) => {
      const arrayBuffer = await fileBlob.arrayBuffer();
      const blobStream = file.createWriteStream({
        resumable: true,
        contentType: 'application/pdf',
      });

      blobStream.on('error', (error) => {
        console.error('Stream Error:', error);
        reject(error);
      });
      blobStream.on('finish', () => {
        resolve();
      });
      blobStream.on('close', () => {});

      // Make sure to end the stream with the buffer
      blobStream.end(Buffer.from(arrayBuffer));
    });

    return new NextResponse(
      JSON.stringify({ message: 'File uploaded successfully', fileName }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('Upload Error:', error);
    return new NextResponse(
      JSON.stringify({
        error: 'Unable to process your request: ' + error.message,
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

// export async function POST(req: NextRequest): Promise<NextResponse> {
//   try {
//     const formData = await req.formData();
//     const fileBlob = formData.get('file');

//     if (!fileBlob || !(fileBlob instanceof Blob)) {
//       return new NextResponse(JSON.stringify({ error: 'No file uploaded' }), {
//         status: 400,
//       });
//     }

//     const fileName = `uploads/${fileBlob.name}.pdf`;
//     const bucket = storage.bucket(bucketName);
//     const file = bucket.file(fileName);

//     await new Promise(async (resolve, reject) => {
//       const blobStream = file.createWriteStream({
//         resumable: false,
//         contentType: 'application/pdf',
//       });

//       blobStream.on('error', reject);
//       blobStream.on('finish', resolve);
//       blobStream.end(Buffer.from(await fileBlob.arrayBuffer()));
//     });

//     // The file has been uploaded to GCS, now return a response.
//     return new NextResponse(
//       JSON.stringify({ message: 'File uploaded successfully', fileName }),
//       {
//         status: 200,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//   } catch (error: any) {
//     return new NextResponse(
//       JSON.stringify({
//         error: 'Unable to process your request: ' + error.message,
//       }),
//       {
//         status: 500,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//   }
// }
