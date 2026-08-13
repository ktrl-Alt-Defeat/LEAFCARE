'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Plus, Thermometer, Waves, RefreshCw, FileText, Camera } from 'lucide-react';
import { CROPS_DATA } from '@/data/crops';
import { getCropAgronomy } from '@/data/cropDetails';
import { useAppState } from '@/context/AppStateContext';
import { useLanguage } from '@/context/LanguageContext';
import { AgronomySheet } from './AgronomySheet';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const QuickStat: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({
  label,
  value,
  icon,
}) => (
  <div className="flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 px-3 py-2.5 backdrop-blur-md">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/15 text-emerald-200">
      {icon}
    </span>
    <span className="flex min-w-0 flex-col">
      <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-200">
        {label}
      </span>
      {/* Wraps rather than truncates: values like "Moderate–High" must stay readable. */}
      <span className="text-xs font-bold leading-tight text-white">{value}</span>
    </span>
  </div>
);

export const CropDetail: React.FC<{ cropId: string }> = ({ cropId }) => {
  const { language } = useLanguage();
  const { selectedCrops, toggleCropSelection } = useAppState();

  const crop = CROPS_DATA.find((entry) => entry.id === cropId);
  const agronomy = getCropAgronomy(cropId);

  if (!crop) return null;

  const displayName = crop.translatedNames[language] || crop.name;
  const isSelected = selectedCrops.includes(crop.id);

  return (
    <>
      <header className="sticky top-0 z-40 h-[var(--header-h)] border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
        <div className="page-shell flex h-full items-center justify-between gap-3">
          <Link
            href="/catalog"
            className="flex items-center gap-1.5 rounded-full p-2 pr-3 text-slate-600 transition-colors hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden text-sm font-semibold sm:inline">Catalog</span>
          </Link>

          <span className="truncate text-base font-black text-slate-900">{displayName}</span>

          <button
            onClick={() => toggleCropSelection(crop.id)}
            aria-pressed={isSelected}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition-colors',
              isSelected
                ? 'bg-agro-600 text-white hover:bg-agro-700'
                : 'border border-slate-200 text-slate-700 hover:border-agro-300 hover:text-agro-800'
            )}
          >
            {isSelected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            <span className="hidden sm:inline">{isSelected ? 'In my crops' : 'Add to my crops'}</span>
          </button>
        </div>
      </header>

      <main className="page-shell flex w-full flex-1 flex-col gap-5 pb-10 pt-4 sm:pt-6">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-agro-900 via-agro-800 to-emerald-950 p-5 text-white shadow-soft-lg sm:p-6">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-agro-500/20 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  'flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl text-5xl shadow-inner',
                  crop.color
                )}
              >
                <span role="img" aria-hidden="true">
                  {crop.icon}
                </span>
              </span>

              <div className="flex min-w-0 flex-col">
                <span className="text-xs font-bold uppercase tracking-widest text-agro-300">
                  {crop.category}
                </span>
                <h1 className="text-2xl font-black leading-tight tracking-tight xl:text-3xl">
                  {displayName}
                </h1>
                {/* Only useful when reading in a non-English language. */}
                {language !== 'en' && (
                  <span className="text-sm font-medium text-emerald-200">{crop.name}</span>
                )}
              </div>
            </div>

            <p className="max-w-prose flex-1 text-sm leading-relaxed text-emerald-100/90">
              {crop.description}
            </p>
          </div>

          {agronomy && (
            <div className="relative mt-5 grid grid-cols-1 gap-2.5 xs:grid-cols-3">
              <QuickStat
                label="Temperature"
                value={agronomy.growing.temperature}
                icon={<Thermometer className="h-4 w-4" />}
              />
              <QuickStat
                label="Watering"
                value={agronomy.growing.watering}
                icon={<Waves className="h-4 w-4" />}
              />
              <QuickStat
                label="Life cycle"
                value={agronomy.cultivation.lifeCycle}
                icon={<RefreshCw className="h-4 w-4" />}
              />
            </div>
          )}
        </div>

        {agronomy ? (
          <AgronomySheet agronomy={agronomy} />
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center">
            <FileText className="h-8 w-8 text-slate-400" />
            <p className="text-sm font-bold text-slate-700">Reference sheet in progress</p>
            <p className="max-w-xs text-xs font-medium text-slate-500">
              Detailed agronomy data for {displayName} is being prepared and will appear here soon.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/scan" className="block sm:w-64">
            <Button size="lg" fullWidth icon={<Camera className="h-5 w-5" />}>
              Scan this crop
            </Button>
          </Link>
          <Link href="/catalog" className="block sm:w-56">
            <Button size="lg" variant="outline" fullWidth>
              Browse all crops
            </Button>
          </Link>
        </div>
      </main>
    </>
  );
};
