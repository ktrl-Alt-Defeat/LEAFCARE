'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, History, ArrowRight } from 'lucide-react';
import { Page, SectionHeading } from '@/components/layout/Page';
import { WeatherCard } from '@/components/dashboard/WeatherCard';
import { DiseaseScanBanner } from '@/components/dashboard/DiseaseScanBanner';
import { ToolsGrid } from '@/components/dashboard/ToolsGrid';
import { LibraryGrid } from '@/components/dashboard/LibraryGrid';
import { CalculatorModal } from '@/components/dashboard/CalculatorModal';
import { CropChip } from '@/components/crops/CropChip';
import { AddToUseItButton } from '@/components/tour/AddToUseItButton';
import { useAppState } from '@/context/AppStateContext';
import { useLanguage } from '@/context/LanguageContext';
import { CROPS_DATA } from '@/data/crops';
import { ToolItem } from '@/data/tools';
import { Card } from '@/components/ui/Card';
import { SafeImage } from '@/components/ui/SafeImage';

export default function HomePage() {
  const { selectedCrops, scanHistory, userProfile } = useAppState();
  const { t, language } = useLanguage();
  const [activeCropId, setActiveCropId] = useState<string | null>(null);
  const [calcModalType, setCalcModalType] = useState<'fertilizer' | 'pesticide' | null>(null);

  const activeCropsList = CROPS_DATA.filter((crop) => selectedCrops.includes(crop.id));

  // Derived rather than stored, so the first crop is correct straight after
  // the saved crop list hydrates.
  const activeCrop =
    activeCropsList.find((crop) => crop.id === activeCropId) ?? activeCropsList[0] ?? null;
  const activeCropName = activeCrop
    ? activeCrop.translatedNames[language] || activeCrop.name
    : null;

  const handleToolClick = (tool: ToolItem) => {
    if (tool.id === 'fertilizer_calc') setCalcModalType('fertilizer');
    else if (tool.id === 'pesticide_calc') setCalcModalType('pesticide');
  };

  return (
    // The greeting carries no emoji: the title is truncated, and tall emoji line
    // boxes get clipped by the overflow that `truncate` applies.
    <Page
      title={`Namaste, ${userProfile.name.split(' ')[0]}`}
      subtitle={t('homeSubtitle', 'Your field at a glance')}
    >
      {/* Crop selector */}
      <div className="no-scrollbar -mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1">
        {activeCropsList.map((crop) => (
          <CropChip
            key={crop.id}
            crop={crop}
            isActive={activeCrop?.id === crop.id}
            onClick={() => setActiveCropId(crop.id)}
          />
        ))}

        <Link
          href="/crops"
          className="flex items-center gap-1.5 whitespace-nowrap rounded-2xl border border-agro-200/80 bg-agro-50 px-3 py-2 text-xs font-bold text-agro-700 transition-colors hover:bg-agro-100"
        >
          <Plus className="h-4 w-4" />
          <span>{t('addCrop', 'Add crop')}</span>
        </Link>
      </div>

      {/* Dashboard grid — single column on phones, two tracks from `lg` up so a
          laptop shows the scanner, weather and history without scrolling. */}
      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-3 lg:gap-6">
        <div className="order-1 lg:order-none lg:col-span-2 lg:col-start-1 lg:row-start-1">
          <DiseaseScanBanner cropName={activeCropName} />
        </div>

        <aside className="order-2 lg:order-none lg:col-start-3 lg:row-span-2 lg:row-start-1">
          <div className="flex flex-col gap-5 lg:sticky lg:top-[calc(var(--header-h)+1.25rem)]">
            <WeatherCard />

            {/* Sits directly under the weather section, per the dashboard layout. */}
            <AddToUseItButton />

            {scanHistory.length > 0 && (
              <section className="flex flex-col gap-3">
                <SectionHeading icon={<History className="h-5 w-5 text-agro-600" />}>
                  {t('recentScans', 'Recent Scans')}
                </SectionHeading>

                <div className="flex flex-col gap-2">
                  {scanHistory.slice(0, 4).map((scan) => (
                    <Link key={scan.id} href={`/diagnosis?id=${scan.id}`}>
                      <Card
                        clickable
                        className="flex items-center justify-between border-slate-100 p-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                            <SafeImage
                              src={scan.capturedImageData}
                              alt={scan.disease.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate text-xs font-bold text-slate-900">
                              {scan.disease.name}
                            </span>
                            <span className="truncate text-[11px] font-medium text-slate-500">
                              {scan.cropName} • {scan.timestamp}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="ml-2 h-4 w-4 shrink-0 text-slate-400" />
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </aside>

        <div className="order-3 flex flex-col gap-6 lg:order-none lg:col-span-2 lg:col-start-1 lg:row-start-2">
          <ToolsGrid onSelectTool={handleToolClick} />
          <LibraryGrid />
        </div>
      </div>

      <CalculatorModal type={calcModalType} onClose={() => setCalcModalType(null)} />
    </Page>
  );
}
