import { NextResponse } from 'next/server';
import { API_V1_URL } from '@/lib/api/config';

/**
 * Live viewfinder leaf detection.
 *
 * The scanner posts a downscaled frame here a few times a second while the
 * farmer is framing a shot; the backend runs YOLO11 over it and answers with
 * boxes. Nothing else in the pipeline runs — no species identification, no
 * disease model — so this stays cheap enough to poll.
 *
 * Same reasoning as `/api/scan`: the browser talks to this app, and only this
 * app knows the backend's address.
 */

/** A frame is worthless a second later; never let one queue up behind a stall. */
export const maxDuration = 15;

interface DetectionBox {
  confidence: number;
  boxPixel: [number, number, number, number];
  boxNorm: [number, number, number, number];
}

interface DetectionResponse {
  data?: {
    status?: string;
    leafCount?: number;
    topConfidence?: number | null;
    best?: DetectionBox | null;
    latencyMs?: number;
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
  let payload: { frame?: string };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Expected a JSON body with a "frame" data URL.' }, { status: 400 });
  }

  const decoded = payload.frame ? decodeDataUrl(payload.frame) : null;
  if (!decoded) {
    return NextResponse.json({ error: 'The camera frame could not be read.' }, { status: 400 });
  }

  const form = new FormData();
  form.append(
    'image',
    new Blob([new Uint8Array(decoded.buffer)], { type: decoded.mimeType }),
    'frame.jpg',
  );

  try {
    const response = await fetch(`${API_V1_URL}/ai/leaf-detection`, {
      method: 'POST',
      body: form,
      cache: 'no-store',
    });

    const body = (await response.json()) as DetectionResponse;

    if (!response.ok) {
      // The viewfinder degrades to manual framing rather than showing an error,
      // so this reports "we could not look" instead of failing the request.
      return NextResponse.json({ status: 'unavailable', leafCount: 0, topConfidence: null, best: null });
    }

    const detection = body.data ?? {};

    return NextResponse.json({
      status: detection.status ?? 'unavailable',
      leafCount: detection.leafCount ?? 0,
      topConfidence: detection.topConfidence ?? null,
      best: detection.best ?? null,
      latencyMs: detection.latencyMs,
    });
  } catch {
    return NextResponse.json({ status: 'unavailable', leafCount: 0, topConfidence: null, best: null });
  }
}
