'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAppState } from '@/context/AppStateContext';
import { useLanguage } from '@/context/LanguageContext';
import { CropGrid } from '@/components/crops/CropGrid';
import { Button } from '@/components/ui/Button';
import { Page } from '@/components/layout/Page';

export default function CropsPage() {
  const router = useRouter();
  const { selectedCrops, toggleCropSelection, onboardingCompleted, setOnboardingCompleted } =
    useAppState();
  const { t } = useLanguage();

  const isSetup = !onboardingCompleted;
  const hasSelection = selectedCrops.length > 0;

  const handleFinishSetup = () => {
    if (!hasSelection) return;
    setOnboardingCompleted(true);
    router.push('/home');
  };

  const grid = <CropGrid selectedCrops={selectedCrops} onToggleCrop={toggleCropSelection} />;

  // Setup mode: full width, own header and a sticky confirm bar.
  if (isSetup) {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/90 backdrop-blur-md">
          <div className="page-shell flex flex-col gap-1 py-4">
            <span className="w-fit rounded-full bg-agro-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-agro-700">
              Step 5 of 5
            </span>
            <h1 className="text-2xl font-black leading-tight tracking-tight text-slate-900">
              {t('selectCrops', 'Select your crops')}
            </h1>
            <p className="text-xs font-medium text-slate-500">
              {t('selectCropsSub', 'You can always change them later.')}
            </p>
          </div>
        </header>

        <div className="page-shell flex-1 py-5">{grid}</div>

        <div className="sticky bottom-0 border-t border-slate-100 bg-white/95 backdrop-blur-md">
          <div className="page-shell safe-bottom flex items-center justify-between gap-4 py-4">
            <span className="hidden text-sm font-semibold text-slate-600 sm:block">
              {hasSelection
                ? `${selectedCrops.length} ${selectedCrops.length === 1 ? 'crop' : 'crops'} selected`
                : 'Pick at least one crop to continue'}
            </span>
            <Button
              size="xl"
              disabled={!hasSelection}
              onClick={handleFinishSetup}
              className="w-full shadow-soft-lg sm:w-auto sm:min-w-[16rem]"
            >
              {t('next', 'Next')} ({selectedCrops.length})
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Settings mode: standard app chrome.
  return (
    <Page
      title={t('selectCrops', 'My Crops')}
      subtitle={`${selectedCrops.length} ${selectedCrops.length === 1 ? 'crop' : 'crops'} on your farm`}
      titleAction={
        <Button
          size="sm"
          variant="secondary"
          icon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => router.push('/home')}
        >
          Back
        </Button>
      }
    >
      {/* Selections persist as they are tapped — no save step needed. */}
      {grid}
    </Page>
  );
}
