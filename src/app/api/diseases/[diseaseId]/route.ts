import { NextResponse } from 'next/server';
import { apiRequest } from '@/lib/api/client';
import { REVALIDATE } from '@/lib/api/config';
import { mapDisease } from '@/lib/api/mappers';
import { errorResponse, readLang } from '@/lib/api/route-helpers';
import type { ApiDisease } from '@/lib/api/types';

/** One disease, including its primary host crop and treatment guidance. */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ diseaseId: string }> },
) {
  const { diseaseId } = await params;
  const lang = readLang(new URL(request.url).searchParams);

  try {
    const { data } = await apiRequest<ApiDisease>(`/diseases/${encodeURIComponent(diseaseId)}`, {
      searchParams: { lang },
      revalidate: REVALIDATE.diseases,
    });

    return NextResponse.json({ disease: mapDisease(data, lang) });
  } catch (error) {
    return errorResponse(error);
  }
}
