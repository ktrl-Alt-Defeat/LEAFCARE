import { notFound } from 'next/navigation';
import { LeafCareApiError, apiRequest } from '@/lib/api/client';
import { REVALIDATE } from '@/lib/api/config';
import { mapCrop, mapCropAgronomy } from '@/lib/api/mappers';
import type { ApiCrop } from '@/lib/api/types';
import { CropDetail } from '@/components/catalog/CropDetail';

/** `params` is async from Next 15 onwards and must be awaited before use. */
type CropCatalogEntryPageProps = {
  params: Promise<{ cropId: string }>;
};

/**
 * Pre-renders one page per crop the backend knows about, so detail sheets stay
 * deep-linkable and statically served.
 *
 * If the backend is unreachable at build time this returns an empty list rather
 * than failing the build — the routes then render on demand instead.
 */
export async function generateStaticParams() {
  try {
    const { data } = await apiRequest<ApiCrop[]>('/crops', {
      searchParams: { limit: 100 },
      revalidate: REVALIDATE.crops,
    });
    return data.map((crop) => ({ cropId: crop.slug }));
  } catch {
    console.warn('Crop catalogue unavailable at build time; pages will render on demand.');
    return [];
  }
}

/** Loads one crop, treating "not found" as null and letting outages throw. */
const loadCrop = async (cropId: string) => {
  try {
    const { data } = await apiRequest<ApiCrop>(`/crops/${encodeURIComponent(cropId)}`, {
      revalidate: REVALIDATE.crops,
    });
    return data;
  } catch (error) {
    if (error instanceof LeafCareApiError && error.status === 404) return null;
    throw error;
  }
};

export async function generateMetadata({ params }: CropCatalogEntryPageProps) {
  const { cropId } = await params;

  try {
    const raw = await loadCrop(cropId);
    const crop = raw ? mapCrop(raw) : null;
    return {
      title: crop ? `${crop.name} — LeafCare Crop Catalog` : 'Crop Catalog — LeafCare',
      description: crop?.description,
    };
  } catch {
    return { title: 'Crop Catalog — LeafCare' };
  }
}

export default async function CropCatalogEntryPage({ params }: CropCatalogEntryPageProps) {
  const { cropId } = await params;
  const raw = await loadCrop(cropId);
  if (!raw) notFound();

  return <CropDetail crop={mapCrop(raw)} agronomy={mapCropAgronomy(raw)} />;
}
