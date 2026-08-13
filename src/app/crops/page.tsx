'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/context/AppStateContext';
import { useLanguage } from '@/context/LanguageContext';
import { CropGrid } from '@/components/crops/CropGrid';
import { Button } from '@/components/ui/Button';

export default function CropsPage() {
  const router = useRouter();
  const { selectedCrops, toggleCropSelection, setOnboardingCompleted } = useAppState();
  const { t } = useLanguage();

  const handleFinishCropSelection = () => {
    if (selectedCrops.length === 0) return;
    setOnboardingCompleted(true);
    router.push('/home');
  };

  return (
    <div className="flex flex-col min-h-screen justify-between p-6 bg-white">
      {/* Header */}
      <div className="flex flex-col pt-4 mb-4">
        <span className="text-xs font-bold text-agro-700 uppercase tracking-widest bg-agro-50 px-3 py-1 rounded-full w-fit mb-2">
          Step 5 of 5
        </span>
        <h1 className="text-2xl font-black text-slate-900 leading-tight">
          {t('selectCrops', 'Select your crops')}
        </h1>
        <p className="text-slate-500 font-medium text-xs mt-1">
          {t('selectCropsSub', 'You can always change them later.')}
        </p>
      </div>

      {/* Responsive Crops Grid */}
      <div className="flex-1 overflow-y-auto mb-6">
        <CropGrid
          selectedCrops={selectedCrops}
          onToggleCrop={toggleCropSelection}
        />
      </div>

      {/* Bottom Sticky Action Button */}
      <div className="pt-2 pb-6 border-t border-slate-100 bg-white sticky bottom-0">
        <Button
          size="xl"
          fullWidth
          disabled={selectedCrops.length === 0}
          onClick={handleFinishCropSelection}
          className="shadow-soft-lg"
        >
          {t('next', 'Next')} ({selectedCrops.length} Selected)
        </Button>
      </div>
    </div>
  );
}
