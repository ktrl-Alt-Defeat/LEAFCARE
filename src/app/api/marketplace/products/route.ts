import { NextResponse } from 'next/server';
import { apiRequest } from '@/lib/api/client';
import { REVALIDATE } from '@/lib/api/config';
import { mapProduct } from '@/lib/api/mappers';
import { errorResponse, readLimit } from '@/lib/api/route-helpers';
import type { ApiProduct } from '@/lib/api/types';

/**
 * Marketplace listings.
 *
 * Query params:
 *   category — backend category slug, e.g. `crop_protection`
 *   search   — free-text search across products
 *   limit    — page size
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.trim();
  const category = searchParams.get('category')?.trim();

  try {
    const { data, meta } = await apiRequest<ApiProduct[]>(
      search ? '/marketplace/search' : '/marketplace/products',
      {
        searchParams: { limit: readLimit(searchParams, 50), category, q: search },
        revalidate: REVALIDATE.marketplace,
      },
    );

    return NextResponse.json({
      products: data.map(mapProduct),
      total: meta?.total ?? data.length,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
