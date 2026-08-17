import { NextResponse } from 'next/server';
import { API_V1_URL } from '@/lib/api/config';

/**
 * Turns a recorded question into text.
 *
 * The browser posts the clip its `MediaRecorder` produced; this hands it to the
 * backend's ElevenLabs Scribe integration and returns just the transcript, so
 * the client never sees the provider's word-level payload.
 */

/** Transcription is quick, but a cold backend is not. */
export const maxDuration = 60;

interface TranscriptionResponse {
  data?: { text?: string; languageCode?: string | null };
  error?: { message?: string };
}

export async function POST(request: Request) {
  let incoming: FormData;

  try {
    incoming = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Expected a recorded audio clip.' }, { status: 400 });
  }

  const clip = incoming.get('audio');

  if (!(clip instanceof Blob) || clip.size === 0) {
    return NextResponse.json(
      { error: 'No audio was recorded. Hold the microphone button while you speak.' },
      { status: 400 },
    );
  }

  const outgoing = new FormData();
  // The recorder's own filename is not forwarded by every browser, so the
  // extension is derived from the type — the backend uses it to pick a decoder.
  const extension = clip.type.includes('mp4') ? 'mp4' : clip.type.includes('ogg') ? 'ogg' : 'webm';
  outgoing.append('audio', clip, `question.${extension}`);

  const languageCode = incoming.get('languageCode');
  if (typeof languageCode === 'string' && languageCode) {
    outgoing.append('languageCode', languageCode);
  }

  try {
    const response = await fetch(`${API_V1_URL}/voice/transcribe`, {
      method: 'POST',
      body: outgoing,
      cache: 'no-store',
    });

    const body = (await response.json()) as TranscriptionResponse;

    if (!response.ok) {
      return NextResponse.json(
        { error: body.error?.message ?? 'That recording could not be understood.' },
        { status: response.status },
      );
    }

    return NextResponse.json({
      text: body.data?.text ?? '',
      languageCode: body.data?.languageCode ?? null,
    });
  } catch (cause) {
    console.error('Voice transcription failed:', cause);
    return NextResponse.json(
      { error: 'Could not reach the voice service. Check your connection and try again.' },
      { status: 503 },
    );
  }
}
