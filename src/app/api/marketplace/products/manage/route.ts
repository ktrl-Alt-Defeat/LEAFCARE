import { NextResponse } from 'next/server';
import { backendWrite, writeResponse } from '@/lib/api/write-client';

/**
 * Seller dashboard writes.
 *
 * Separate from the read route so the listing endpoint stays cacheable while
 * these stay uncached, and so the admin key is confined to one file per domain.
 */

/** POST — list a new product. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Expected a JSON body.' }, { status: 400 });
  }

  const result = await backendWrite('/marketplace/products', { method: 'POST', body });
  return writeResponse(result, 'product');
}

/** PATCH — update an existing listing. Requires `id` in the body. */
export async function PATCH(request: Request) {
  let body: { id?: string } & Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Expected a JSON body.' }, { status: 400 });
  }

  const { id, ...changes } = body;
  if (!id) {
    return NextResponse.json({ error: 'A product id is required.' }, { status: 400 });
  }

  const result = await backendWrite(`/marketplace/products/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: changes,
  });
  return writeResponse(result, 'product');
}

/** DELETE — remove a listing. Soft delete upstream, so past orders survive. */
export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'A product id is required.' }, { status: 400 });
  }

  const result = await backendWrite(`/marketplace/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  return writeResponse(result, 'product');
}
