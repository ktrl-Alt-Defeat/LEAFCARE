import { NextResponse } from 'next/server';
import { apiRequest } from '@/lib/api/client';
import { REVALIDATE } from '@/lib/api/config';
import { mapArticle } from '@/lib/api/mappers';
import { errorResponse, readLang, readLimit } from '@/lib/api/route-helpers';
import type { ApiArticle } from '@/lib/api/types';

/** Knowledge-base articles, translated into the requested language. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    const { data, meta } = await apiRequest<ApiArticle[]>('/knowledge/articles', {
      searchParams: { lang: readLang(searchParams), limit: readLimit(searchParams, 50) },
      revalidate: REVALIDATE.knowledge,
    });

    return NextResponse.json({
      articles: data.map(mapArticle),
      total: meta?.total ?? data.length,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
