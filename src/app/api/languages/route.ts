import { NextResponse } from 'next/server';
import { apiRequest } from '@/lib/api/client';
import { REVALIDATE } from '@/lib/api/config';
import { mapLanguage } from '@/lib/api/mappers';
import { errorResponse } from '@/lib/api/route-helpers';
import type { ApiLanguage } from '@/lib/api/types';

/** Languages the backend has translations for. */
export async function GET() {
  try {
    const { data } = await apiRequest<ApiLanguage[]>('/languages', {
      revalidate: REVALIDATE.languages,
    });

    return NextResponse.json({ languages: data.filter((entry) => entry.is_active).map(mapLanguage) });
  } catch (error) {
    return errorResponse(error);
  }
}
