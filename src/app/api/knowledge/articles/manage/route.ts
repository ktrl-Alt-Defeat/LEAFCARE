import { NextResponse } from 'next/server';
import { backendWrite, writeResponse } from '@/lib/api/write-client';

/**
 * Admin dashboard writes for the knowledge base.
 *
 * Kept apart from the read route so articles stay cacheable for farmers while
 * edits go straight through, and so the admin key lives in one file per domain.
 */

/** POST — create an article with one or more translations. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Expected a JSON body.' }, { status: 400 });
  }

  const result = await backendWrite('/knowledge/articles', { method: 'POST', body });
  return writeResponse(result, 'article');
}

/** PATCH — update an article. Requires `idOrSlug` in the body. */
export async function PATCH(request: Request) {
  let body: { idOrSlug?: string } & Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Expected a JSON body.' }, { status: 400 });
  }

  const { idOrSlug, ...changes } = body;
  if (!idOrSlug) {
    return NextResponse.json({ error: 'An article id or slug is required.' }, { status: 400 });
  }

  const result = await backendWrite(`/knowledge/articles/${encodeURIComponent(idOrSlug)}`, {
    method: 'PATCH',
    body: changes,
  });
  return writeResponse(result, 'article');
}

/** DELETE — remove an article and its translations. */
export async function DELETE(request: Request) {
  const idOrSlug = new URL(request.url).searchParams.get('idOrSlug');
  if (!idOrSlug) {
    return NextResponse.json({ error: 'An article id or slug is required.' }, { status: 400 });
  }

  const result = await backendWrite(`/knowledge/articles/${encodeURIComponent(idOrSlug)}`, {
    method: 'DELETE',
  });
  return writeResponse(result, 'article');
}
