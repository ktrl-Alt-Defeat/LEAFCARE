import { NextResponse } from 'next/server';
import { apiRequest } from '@/lib/api/client';
import { REVALIDATE } from '@/lib/api/config';
import { mapCrop } from '@/lib/api/mappers';
import { errorResponse, readLang, readLimit } from '@/lib/api/route-helpers';
import type { ApiCrop } from '@/lib/api/types';

/**
 * Crop catalogue, translated into the requested language.
 *
 * Query params:
 *   lang   — one of en|ta|hi|te|ml|kn, defaults to en
 *   limit  — page size, defaults to the full catalogue
 *   search — free-text crop search
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = readLang(searchParams);
  const search = searchParams.get('search')?.trim();

  try {
    const { data, meta } = await apiRequest<ApiCrop[]>(search ? '/crops/search' : '/crops', {
      searchParams: { lang, limit: readLimit(searchParams, 100), q: search },
      revalidate: REVALIDATE.crops,
    });

    return NextResponse.json({ crops: data.map(mapCrop), total: meta?.total ?? data.length });
  } catch (error) {
    return errorResponse(error);
  }
}
