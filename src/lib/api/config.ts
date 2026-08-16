/**
 * Connection settings for the LeafCare backend API.
 *
 * Deliberately server-only: the base URL is never shipped to the browser.
 * Client components reach the backend through this app's own `/api/*` route
 * handlers, which keeps the backend host private, avoids CORS entirely, and
 * lets Next cache upstream responses across users.
 */

const DEFAULT_API_URL = 'http://localhost:5000';

/** Backend root, e.g. `http://localhost:5000`. Override with `LEAFCARE_API_URL`. */
export const API_BASE_URL = (process.env.LEAFCARE_API_URL ?? DEFAULT_API_URL).replace(/\/+$/, '');

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
