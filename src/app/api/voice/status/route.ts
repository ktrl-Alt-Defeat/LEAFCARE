import { NextResponse } from 'next/server';
import { API_V1_URL } from '@/lib/api/config';

/**
 * Reports whether the backend has voice credentials.
 *
 * The client uses this to decide whether to render the read-aloud icons and the
 * microphone bubble at all — an unconfigured deployment should show no voice
 * controls rather than buttons that fail on the first tap.
 */

/**
 * Evaluated per request, not prerendered.
 *
 * With the default static treatment this answer is decided at build time, so a
 * backend that happens to be asleep during the build freezes `configured:
 * false` into the deployment and every client hides the voice controls until
 * the first revalidation. The upstream call is still cached below, so being
 * dynamic costs one fetch a minute rather than one per visitor.
 */
export const dynamic = 'force-dynamic';

/** Seconds the backend's answer may be reused for. It changes at deploy time. */
const UPSTREAM_CACHE_SECONDS = 60;

export async function GET() {
  try {
    const response = await fetch(`${API_V1_URL}/voice/status`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: UPSTREAM_CACHE_SECONDS },
    });

    const body = (await response.json()) as {
      data?: { configured?: boolean; supportedLanguages?: string[]; maxCharacters?: number };
    };

    if (!response.ok) {
      return NextResponse.json({ configured: false }, { status: 200 });
    }

    return NextResponse.json({
      configured: Boolean(body.data?.configured),
      supportedLanguages: body.data?.supportedLanguages ?? [],
      maxCharacters: body.data?.maxCharacters ?? 0,
    });
  } catch {
    // An unreachable backend is not an error worth surfacing here: the honest
    // answer is simply that voice is unavailable, so the controls stay hidden.
    return NextResponse.json({ configured: false }, { status: 200 });
  }
}
