import { notFound } from 'next/navigation';
import { CROPS_DATA } from '@/data/crops';
import { CropDetail } from '@/components/catalog/CropDetail';

/** Pre-renders one page per crop so detail sheets are deep-linkable and static. */
export function generateStaticParams() {
  return CROPS_DATA.map((crop) => ({ cropId: crop.id }));
}

export function generateMetadata({ params }: { params: { cropId: string } }) {
  const crop = CROPS_DATA.find((entry) => entry.id === params.cropId);
  return {
    title: crop ? `${crop.name} — LeafCare Crop Catalog` : 'Crop Catalog — LeafCare',
    description: crop?.description,
  };
}

export default function CropCatalogEntryPage({ params }: { params: { cropId: string } }) {
  const crop = CROPS_DATA.find((entry) => entry.id === params.cropId);
  if (!crop) notFound();

  return <CropDetail cropId={params.cropId} />;
}
