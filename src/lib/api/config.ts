/**
 * Connection settings for the LeafCare backend API.
 *
 * Deliberately server-only: the base URL is never shipped to the browser.
 * Client components reach the backend through this app's own `/api/*` route
 * handlers, which keeps the backend host private, avoids CORS entirely, and
 * lets Next cache upstream responses across users.
 */

const DEFAULT_API_URL = 'http://localhost:5000';

/**
 * Backend root, e.g. `https://leafcare-backend.onrender.com`.
 *
 * `NEXT_PUBLIC_API_URL` is accepted as a fallback because it is the name most
 * people reach for, and having the app silently fall back to localhost because
 * the variable was spelled differently is a confusing failure: every request
 * then dies with `ECONNREFUSED`, which surfaces as a bare "fetch failed".
 *
 * Only the value is shared — this module is still server-only, and the URL is
 * never read in the browser.
 */
const configuredUrl = process.env.LEAFCARE_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? '';

export const API_BASE_URL = (configuredUrl || DEFAULT_API_URL)
  .replace(/\/+$/, '')
  // A backend root is wanted here, but the variable is just as often set to the
  // versioned root instead. Left alone that silently produces
  // `/api/v1/api/v1/...` and every call 404s, which reads as a broken backend
  // rather than a misread environment variable.
  .replace(/\/api\/v\d+$/, '');

/** True when no backend URL was configured and the localhost default is in use. */
export const USING_DEFAULT_API_URL = configuredUrl.trim() === '';

/** Versioned API root that every request is built from. */
export const API_V1_URL = `${API_BASE_URL}/api/v1`;

/**
 * Shared secret for the backend's admin and seller write endpoints.
 *
 * Read server-side only and deliberately NOT prefixed with `NEXT_PUBLIC_`: if
 * this reached the browser the guard would be worthless, since anyone could
 * read it out of the bundle and write to the knowledge base directly.
 */
export const ADMIN_KEY = process.env.LEAFCARE_ADMIN_KEY ?? '';

/** Header the backend expects the secret in. */
export const ADMIN_KEY_HEADER = 'x-leafcare-admin-key';

/**
 * Cache windows in seconds. Reference data (languages, crops, diseases) is
 * effectively static; community and marketplace change throughout the day.
 */
export const REVALIDATE = {
  languages: 60 * 60 * 24,
  crops: 60 * 60,
  diseases: 60 * 60,
  knowledge: 60 * 15,
  community: 30,
  marketplace: 60,
} as const;
