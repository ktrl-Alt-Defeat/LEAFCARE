'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Share2, Camera } from 'lucide-react';
import { useAppState } from '@/context/AppStateContext';
import { useLanguage } from '@/context/LanguageContext';
import { useCrop } from '@/hooks/useLeafCareData';
import { ConfidenceMeter } from '@/components/diagnosis/ConfidenceMeter';
import { SymptomsCard } from '@/components/diagnosis/SymptomsCard';
import { ActionCard } from '@/components/diagnosis/ActionCard';
import { PreventionCard } from '@/components/diagnosis/PreventionCard';
import { Button } from '@/components/ui/Button';
import { SafeImage } from '@/components/ui/SafeImage';
import { SpeakButton } from '@/components/voice/SpeakButton';

function DiagnosisContent() {
  const searchParams = useSearchParams();
  const scanId = searchParams.get('id');
  const { hydrated, scanHistory, selectedCrops } = useAppState();
  const { language } = useLanguage();

  const currentScan = hydrated
    ? scanHistory.find((scan) => scan.id === scanId) || scanHistory[0]
    : undefined;

  // With no saved scan to show, the reference entry for the farmer's main crop
  // stands in. Fetched from the backend, so it stays in step with the library.
  const primaryCrop = selectedCrops[0] || 'tomato';
  const { diseases, status } = useCrop(hydrated && !currentScan ? primaryCrop : null);

  // Saved scans live in localStorage. Rendering before they load would briefly
  // show the reference disease instead of the scan the user actually opened.
  if (!hydrated || (!currentScan && status === 'loading')) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="text-sm font-bold text-slate-600">Loading diagnosis…</div>
      </div>
    );
  }

  const disease = currentScan?.disease ?? diseases[0] ?? null;

  if (!disease) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-sm font-bold text-slate-700">No diagnosis to show yet</p>
        <p className="max-w-xs text-xs font-medium text-slate-500">
          Scan a leaf to get a diagnosis, or pick a crop the disease library covers.
        </p>
        <Link href="/scan">
          <Button icon={<Camera className="h-5 w-5" />}>Scan a crop</Button>
        </Link>
      </div>
    );
  }

  const capturedImage = currentScan?.capturedImageData || disease.imageUrl;
  const diseaseTitle = disease.translatedNames[language] || disease.name;

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: `LeafCare diagnosis: ${disease.name}`,
          text: `Disease diagnosis for ${disease.cropName}: ${disease.name}`,
          url: window.location.href,
        })
        .catch(() => {});
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-[var(--header-h)] border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
        <div className="page-shell flex h-full items-center justify-between gap-3">
          <Link
            href="/home"
            className="flex items-center gap-1.5 rounded-full p-2 pr-3 text-slate-600 transition-colors hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden text-sm font-semibold sm:inline">Home</span>
          </Link>

          <span className="truncate text-base font-black text-slate-900">Crop Diagnosis</span>

          <button
            onClick={handleShare}
            className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100"
            aria-label="Share diagnosis"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Two tracks on laptops: the evidence stays pinned on the left while the
          treatment plan scrolls on the right. */}
      <main className="page-shell flex w-full flex-1 flex-col gap-5 pb-10 pt-4 sm:pt-6 lg:grid lg:grid-cols-5 lg:items-start lg:gap-7">
        <div className="flex flex-col gap-5 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:col-span-2">
          <div className="relative h-56 w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 shadow-soft-md sm:h-72 lg:h-80">
            <SafeImage
              src={capturedImage}
              alt={diseaseTitle}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute inset-x-4 bottom-3 flex items-center justify-between gap-2 text-white">
              <span className="truncate rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-md">
                {disease.cropName} crop
              </span>
              <span className="shrink-0 text-[11px] font-medium text-slate-300">
                {currentScan?.timestamp || 'Just now'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex min-w-0 flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-agro-700">
                Identified pathogen
              </span>
              <h1 className="text-2xl font-black leading-tight tracking-tight text-slate-900">
                {diseaseTitle}
              </h1>
              <span className="mt-0.5 text-xs font-semibold italic text-slate-500">
                {disease.scientificName}
              </span>
            </div>

            {/* The headline result: the crop, the diagnosis and how sure it is. */}
            <SpeakButton
              className="ml-auto mt-1"
              size="md"
              label="diagnosis summary"
              text={[
                `Diagnosis for your ${disease.cropName} crop`,
                diseaseTitle,
                `Scientific name, ${disease.scientificName}`,
                `Confidence ${Math.round(disease.confidence)} percent, severity ${disease.severity}`,
              ]}
            />
          </div>

          <ConfidenceMeter confidence={disease.confidence} severity={disease.severity} />

          <div className="flex max-w-prose items-start gap-2 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium leading-relaxed text-slate-600">
              {disease.overview}
            </p>
            <SpeakButton tone="subtle" label="overview" text={disease.overview} />
          </div>

          <Link href="/scan" className="hidden lg:block">
            <Button size="lg" fullWidth icon={<Camera className="h-5 w-5" />}>
              Scan another crop
            </Button>
          </Link>
        </div>

        <div className="flex flex-col gap-5 lg:col-span-3">
          <SymptomsCard symptoms={disease.symptoms} causes={disease.causes} />

          <ActionCard
            immediateSteps={disease.immediateSteps}
            organicTreatment={disease.organicTreatment}
            chemicalTreatment={disease.chemicalTreatment}
          />

          <PreventionCard
            preventionTips={disease.preventionTips}
            disclaimer={disease.disclaimer}
          />

          <Link href="/scan" className="block lg:hidden">
            <Button size="xl" fullWidth icon={<Camera className="h-5 w-5" />}>
              Scan another crop
            </Button>
          </Link>
        </div>
      </main>
    </>
  );
}

export default function DiagnosisPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center">
          <div className="text-sm font-bold text-slate-600">Loading diagnosis…</div>
        </div>
      }
    >
      <DiagnosisContent />
    </Suspense>
  );
}
