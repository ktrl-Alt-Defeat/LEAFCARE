/**
 * Shared plumbing for the `/api/*` route handlers that front the backend.
 */

import { NextResponse } from 'next/server';
import { LeafCareApiError } from './client';

/**
 * Converts a thrown error into the `{ error }` shape the client hooks expect,
 * preserving the upstream status so a 404 stays a 404 and an unreachable
 * backend surfaces as 503 rather than a generic failure.
 */
export const errorResponse = (error: unknown): NextResponse => {
  if (error instanceof LeafCareApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  console.error('LeafCare API route failed:', error);
  return NextResponse.json({ error: 'Unable to load data right now.' }, { status: 502 });
};

const SUPPORTED_LANGUAGES = new Set(['en', 'ta', 'hi', 'te', 'ml', 'kn']);

/** Reads `?lang=`, falling back to English for anything unrecognised. */
export const readLang = (searchParams: URLSearchParams): string => {
  const lang = searchParams.get('lang')?.trim().toLowerCase() ?? '';
  return SUPPORTED_LANGUAGES.has(lang) ? lang : 'en';
};

/** Reads a bounded positive integer, used for pagination limits. */
export const readLimit = (searchParams: URLSearchParams, fallback: number, max = 100): number => {
  const raw = Number(searchParams.get('limit'));
  if (!Number.isFinite(raw) || raw <= 0) return fallback;
  return Math.min(Math.floor(raw), max);
};
