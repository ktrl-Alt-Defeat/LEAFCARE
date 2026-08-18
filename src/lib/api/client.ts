/**
 * Server-side HTTP client for the LeafCare backend.
 *
 * Only route handlers and server components may import this — it reads the
 * private backend URL from the environment. The browser never talks to the
 * backend directly.
 */

import { API_BASE_URL, API_V1_URL, USING_DEFAULT_API_URL } from './config';
import type { ApiEnvelope, ApiMeta } from './types';

/**
 * A free-tier host sleeps after inactivity and takes up to a minute to wake,
 * answering 502/503 or dropping the connection until it is ready. One retry
 * with a pause turns that cold start into a slow request instead of an error.
 */
const RETRY_STATUSES = new Set([502, 503, 504]);
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 4000;

/** Upper bound per attempt, so a hung upstream cannot stall a page forever. */
const REQUEST_TIMEOUT_MS = 45_000;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class LeafCareApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'LeafCareApiError';
  }
}

export interface ApiRequestOptions {
  /** Query string values; `undefined` and empty values are dropped. */
  searchParams?: Record<string, string | number | undefined>;
  /** Seconds Next may serve a cached upstream response for. */
  revalidate: number;
  signal?: AbortSignal;
}

export interface ApiResult<T> {
  data: T;
  meta?: ApiMeta;
}

const buildUrl = (path: string, searchParams: ApiRequestOptions['searchParams']): string => {
  const url = new URL(`${API_V1_URL}${path.startsWith('/') ? path : `/${path}`}`);
  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    if (value === undefined) return;
    const asString = String(value).trim();
    if (asString) url.searchParams.set(key, asString);
  });
  return url.toString();
};

/**
 * Performs one backend call and unwraps the `{ success, data, meta }` envelope.
 *
 * Throws `LeafCareApiError` for unreachable hosts, non-2xx responses, and
 * `success: false` payloads, so callers only ever see valid data.
 */
export const apiRequest = async <T>(
  path: string,
  { searchParams, revalidate, signal }: ApiRequestOptions,
): Promise<ApiResult<T>> => {
  const url = buildUrl(path, searchParams);

  let response: Response | undefined;
  let lastNetworkError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    // Per-attempt timeout, combined with any caller signal so an aborted
    // request still cancels immediately.
    const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
    const attemptSignal = signal ? AbortSignal.any([signal, timeout]) : timeout;

    try {
      response = await fetch(url, {
        signal: attemptSignal,
        headers: { Accept: 'application/json' },
        next: { revalidate },
      });

      // A sleeping host answers 502/503/504 while it boots; retry those.
      if (!RETRY_STATUSES.has(response.status) || attempt === MAX_ATTEMPTS) break;
    } catch (cause) {
      // The caller gave up: propagate rather than retrying behind their back.
      if (signal?.aborted) throw cause;

      lastNetworkError = cause;
      response = undefined;
      if (attempt === MAX_ATTEMPTS) break;
    }

    await wait(RETRY_DELAY_MS * attempt);
  }

  if (!response) {
    const detail = lastNetworkError instanceof Error ? lastNetworkError.message : 'network error';
    const code = (lastNetworkError as { cause?: { code?: string } } | undefined)?.cause?.code;

    // `fetch failed` on its own is undiagnosable, so the message names the URL
    // that was tried and, when the connection was refused, points at the most
    // common cause: no backend URL configured, so the localhost default is used.
    const hint =
      code === 'ECONNREFUSED' && USING_DEFAULT_API_URL
        ? ' No backend URL is configured, so the default was used — set LEAFCARE_API_URL.'
        : code === 'ECONNREFUSED'
          ? ' Nothing is listening there.'
          : '';

    throw new LeafCareApiError(
      `Could not reach the LeafCare API at ${API_BASE_URL} (${code ?? detail}).${hint}`,
      503,
    );
  }

  let payload: ApiEnvelope<T> | undefined;
  try {
    payload = (await response.json()) as ApiEnvelope<T>;
  } catch {
    payload = undefined;
  }

  if (!response.ok) {
    // Errors are nested as `{ success: false, error: { code, message } }`,
    // so the useful text is not at `payload.message`.
    const nested = (payload as unknown as { error?: { message?: string } } | undefined)?.error
      ?.message;

    throw new LeafCareApiError(
      nested ?? payload?.message ?? `LeafCare API responded with ${response.status}`,
      response.status,
    );
  }

  if (!payload?.success || payload.data === undefined) {
    throw new LeafCareApiError(payload?.message ?? 'LeafCare API returned an unusable response.', 502);
  }

  return { data: payload.data, meta: payload.meta };
};
