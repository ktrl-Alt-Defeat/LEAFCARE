/**
 * Server-side client for the backend's guarded write endpoints.
 *
 * Only route handlers may import this. It attaches the admin key, which must
 * never reach the browser — the whole point of proxying writes through this
 * app's own `/api/*` routes is that the secret stays on the server.
 */

import { NextResponse } from 'next/server';
import { ADMIN_KEY, ADMIN_KEY_HEADER, API_V1_URL } from './config';

export interface WriteResult {
  ok: boolean;
  status: number;
  body: unknown;
}

/**
 * Performs a guarded write against the backend.
 *
 * Never throws: callers get the upstream status back so a 404 stays a 404 and
 * a validation error keeps its message rather than collapsing into a generic
 * failure.
 */
export const backendWrite = async (
  path: string,
  init: { method: 'POST' | 'PATCH' | 'DELETE'; body?: unknown },
): Promise<WriteResult> => {
  if (!ADMIN_KEY) {
    // Fail closed and say why: an unset key is a deployment mistake, and
    // silently doing nothing would look like the save succeeded.
    return {
      ok: false,
      status: 503,
      body: {
        error:
          'Write access is not configured. Set LEAFCARE_ADMIN_KEY in this app’s environment.',
      },
    };
  }

  try {
    const response = await fetch(`${API_V1_URL}${path}`, {
      method: init.method,
      headers: {
        'Content-Type': 'application/json',
        [ADMIN_KEY_HEADER]: ADMIN_KEY,
      },
      ...(init.body !== undefined ? { body: JSON.stringify(init.body) } : {}),
      cache: 'no-store',
    });

    const body = await response.json().catch(() => undefined);
    return { ok: response.ok, status: response.status, body };
  } catch (cause) {
    console.error(`Backend write to ${path} failed:`, cause);
    return {
      ok: false,
      status: 503,
      body: { error: 'Could not reach the LeafCare API.' },
    };
  }
};

/**
 * Pulls a human-readable string out of a backend error payload.
 *
 * The backend nests errors as `{ success: false, error: { code, message } }`,
 * so `error` is an object, not a string. Returning it verbatim would put an
 * object into the dashboards' error state, which React cannot render as a
 * child — a failed save would crash the page instead of explaining itself.
 */
export const errorMessageFrom = (body: unknown, fallback: string): string => {
  if (typeof body !== 'object' || body === null) return fallback;

  const payload = body as { message?: unknown; error?: unknown };

  if (typeof payload.message === 'string') return payload.message;
  if (typeof payload.error === 'string') return payload.error;

  if (typeof payload.error === 'object' && payload.error !== null) {
    const nested = (payload.error as { message?: unknown }).message;
    if (typeof nested === 'string') return nested;
  }

  return fallback;
};

/** Turns a WriteResult into the response shape the dashboards expect. */
export const writeResponse = (result: WriteResult, dataKey: string): NextResponse => {
  if (!result.ok) {
    return NextResponse.json(
      { error: errorMessageFrom(result.body, 'The change could not be saved.') },
      { status: result.status },
    );
  }

  const data = (result.body as { data?: unknown } | undefined)?.data;
  return NextResponse.json({ [dataKey]: data }, { status: result.status });
};
