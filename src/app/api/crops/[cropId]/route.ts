import { NextResponse } from 'next/server';
import { apiRequest } from '@/lib/api/client';
import { REVALIDATE } from '@/lib/api/config';
import { mapCrop, mapCropAgronomy, mapDisease } from '@/lib/api/mappers';
import { errorResponse, readLang } from '@/lib/api/route-helpers';
import type { ApiCrop } from '@/lib/api/types';

/**
 * One crop plus its agronomy sheet. The backend accepts a slug wherever it
 * accepts an id, so existing `/catalog/tomato` links resolve unchanged.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ cropId: string }> },
) {
  const { cropId } = await params;
  const lang = readLang(new URL(request.url).searchParams);

  try {
    const { data } = await apiRequest<ApiCrop>(`/crops/${encodeURIComponent(cropId)}`, {
      searchParams: { lang },
      revalidate: REVALIDATE.crops,
    });

    // Diseases this crop hosts, primary host first — the scanner and the
    // diagnosis screen both need "which disease affects this crop".
    const diseases = (data.crop_diseases ?? [])
      .slice()
      .sort((a, b) => Number(b.is_primary_host) - Number(a.is_primary_host))
      .map((entry) => entry.disease)
      .filter((disease): disease is NonNullable<typeof disease> => Boolean(disease))
      .map((disease) => ({ ...mapDisease(disease, lang), cropId: data.slug, cropName: mapCrop(data).name }));

    return NextResponse.json({
      crop: mapCrop(data),
      agronomy: mapCropAgronomy(data),
      diseases,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
