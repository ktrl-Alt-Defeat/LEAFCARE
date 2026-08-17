import { NextResponse } from 'next/server';
import { API_V1_URL } from '@/lib/api/config';
import { MAX_SPEECH_CHARACTERS } from '@/lib/voice/config';

/**
 * Reads a block of text aloud.
 *
 * Proxies to the backend's ElevenLabs integration and returns the MP3 bytes
 * unchanged, so the browser can hand the response straight to an audio element.
 * Keeping it server-side is the whole point: the backend URL stays private and
 * the API key never leaves the server.
 */

/** Synthesis of a long card can take a while on a cold backend. */
export const maxDuration = 60;

interface SpeechRequest {
  text?: string;
  languageCode?: string;
}

export async function POST(request: Request) {
  let payload: SpeechRequest;

  try {
    payload = (await request.json()) as SpeechRequest;
  } catch {
    return NextResponse.json({ error: 'Expected a JSON body with a "text" field.' }, { status: 400 });
  }

  const text = payload.text?.trim() ?? '';

  if (!text) {
    return NextResponse.json({ error: 'There is nothing to read aloud.' }, { status: 400 });
  }

  // Trimmed here as well as in the caller: a client that forgets leaves the
  // backend to reject the whole request, and the listener hears nothing at all.
  const trimmed = text.slice(0, MAX_SPEECH_CHARACTERS);

  try {
    const response = await fetch(`${API_V1_URL}/voice/speech`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: trimmed, languageCode: payload.languageCode }),
      // Each clip is cached in the browser by text; caching here too would
      // duplicate that for no gain, and Next cannot key on a POST body anyway.
      cache: 'no-store',
    });

    if (!response.ok) {
      const detail = (await response.json().catch(() => null)) as
        | { error?: { message?: string } }
        | null;

      return NextResponse.json(
        { error: detail?.error?.message ?? 'The voice service could not read this text.' },
        { status: response.status },
      );
    }

    const audio = await response.arrayBuffer();

    return new NextResponse(audio, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('Content-Type') ?? 'audio/mpeg',
        'Content-Length': String(audio.byteLength),
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (cause) {
    console.error('Voice synthesis failed:', cause);
    return NextResponse.json(
      { error: 'Could not reach the voice service. Check your connection and try again.' },
      { status: 503 },
    );
  }
}
