/**
 * Server-side HTTP client for the LeafCare backend.
 *
 * Only route handlers and server components may import this — it reads the
 * private backend URL from the environment. The browser never talks to the
 * backend directly.
 */

import { API_V1_URL } from './config';
import type { ApiEnvelope, ApiMeta } from './types';

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

  let response: Response;
  try {
    response = await fetch(url, {
      signal,
      headers: { Accept: 'application/json' },
      next: { revalidate },
    });
  } catch (cause) {
    // A refused connection almost always means the backend is not running.
    throw new LeafCareApiError(
      `Could not reach the LeafCare API: ${cause instanceof Error ? cause.message : 'network error'}`,
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
    throw new LeafCareApiError(
      payload?.message ?? `LeafCare API responded with ${response.status}`,
      response.status,
    );
  }

  if (!payload?.success || payload.data === undefined) {
    throw new LeafCareApiError(payload?.message ?? 'LeafCare API returned an unusable response.', 502);
  }

  return { data: payload.data, meta: payload.meta };
};
