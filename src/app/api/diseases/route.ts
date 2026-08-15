import { NextResponse } from 'next/server';
import { apiRequest } from '@/lib/api/client';
import { REVALIDATE } from '@/lib/api/config';
import { mapDisease } from '@/lib/api/mappers';
import { errorResponse, readLang, readLimit } from '@/lib/api/route-helpers';
import type { ApiDisease } from '@/lib/api/types';

/** Disease reference library, translated into the requested language. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.trim();
  const lang = readLang(searchParams);

  try {
    const { data, meta } = await apiRequest<ApiDisease[]>(
      search ? '/diseases/search' : '/diseases',
      {
        searchParams: { lang, limit: readLimit(searchParams, 100), q: search },
        revalidate: REVALIDATE.diseases,
      },
    );

    return NextResponse.json({
      diseases: data.map((disease) => mapDisease(disease, lang)),
      total: meta?.total ?? data.length,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
