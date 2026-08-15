import { NextResponse } from 'next/server';
import { API_V1_URL } from '@/lib/api/config';

/**
 * Runs a captured leaf frame through the backend's plant-analysis pipeline
 * (Pl@ntNet identification -> supported-crop gate -> EfficientNetV2-S disease
 * classifier) and returns a flattened result for the scanner.
 *
 * The browser posts the captured data URL as JSON; converting it to multipart
 * happens here so the backend URL and the upload format stay server-side.
 */

/** Inference on a cold CPU deployment can take well over a minute. */
export const maxDuration = 120;

interface AnalysisResponse {
  data?: {
    plant?: { name?: string; scientificName?: string; confidence?: number } | null;
    crop?: { name?: string; supported?: boolean };
    diseaseDetection?: {
      available?: boolean;
      disease?: { name?: string; confidence?: number } | null;
      message?: string;
    };
  };
  message?: string;
}

/** Splits a `data:image/jpeg;base64,...` URL into its MIME type and bytes. */
const decodeDataUrl = (dataUrl: string): { buffer: Buffer; mimeType: string } | null => {
  const match = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(dataUrl.trim());
  if (!match) return null;

  try {
    return { mimeType: match[1], buffer: Buffer.from(match[2], 'base64') };
  } catch {
    return null;
  }
};

export async function POST(request: Request) {
  let payload: { image?: string };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Expected a JSON body with an "image" data URL.' }, { status: 400 });
  }

  if (!payload.image) {
    return NextResponse.json({ error: 'No image was captured. Try taking the photo again.' }, { status: 400 });
  }

  const decoded = decodeDataUrl(payload.image);
  if (!decoded) {
    return NextResponse.json({ error: 'The captured image could not be read.' }, { status: 400 });
  }

  const form = new FormData();
  form.append(
    'image',
    new Blob([new Uint8Array(decoded.buffer)], { type: decoded.mimeType }),
    'leaf.jpg',
  );

  try {
    const response = await fetch(`${API_V1_URL}/ai/plant-identification`, {
      method: 'POST',
      body: form,
      // Never cache a scan: each capture is a distinct image.
      cache: 'no-store',
    });

    const body = (await response.json()) as AnalysisResponse;

    if (!response.ok) {
      return NextResponse.json(
        { error: body?.message ?? 'The analysis service could not process this image.' },
        { status: response.status },
      );
    }

    const analysis = body.data ?? {};
    const detection = analysis.diseaseDetection ?? {};

    return NextResponse.json({
      plant: analysis.plant ?? null,
      crop: {
        name: analysis.crop?.name ?? '',
        supported: Boolean(analysis.crop?.supported),
      },
      disease: detection.available && detection.disease?.name
        ? { name: detection.disease.name, confidence: detection.disease.confidence ?? 0 }
        : null,
      message: detection.message ?? body.message,
    });
  } catch (cause) {
    console.error('Scan analysis failed:', cause);
    return NextResponse.json(
      { error: 'Could not reach the analysis service. Check your connection and try again.' },
      { status: 503 },
    );
  }
}
