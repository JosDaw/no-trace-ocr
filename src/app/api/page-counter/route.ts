import { NextRequest, NextResponse } from 'next/server';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.min.mjs';
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
await import('pdfjs-dist/build/pdf.worker.min.mjs');

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const fileBlob = formData.get('pdf');

    if (!fileBlob || !(fileBlob instanceof Blob)) {
      return new NextResponse(JSON.stringify({ error: 'No file uploaded' }), {
        status: 400,
      });
    }

    // Convert the Blob to a Uint8Array for pdf.js
    const arrayBuffer = await fileBlob.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const loadingTask = pdfjsLib.getDocument({ data });

    const pdf: PDFDocumentProxy = await loadingTask.promise;

    return new NextResponse(JSON.stringify({ pageCount: pdf.numPages }), {
      status: 200,
    });
  } catch (error) {
    console.error('Failed to process PDF:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to process the file' }),
      { status: 500 }
    );
  }
}

(async () => {
  await import('pdfjs-dist/build/pdf.worker.min.mjs');
})();
