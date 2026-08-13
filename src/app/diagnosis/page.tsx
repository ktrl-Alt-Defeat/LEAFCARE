'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Share2, Camera } from 'lucide-react';
import { useAppState } from '@/context/AppStateContext';
import { useLanguage } from '@/context/LanguageContext';
import { MOCK_DISEASES } from '@/data/diseases';
import { ConfidenceMeter } from '@/components/diagnosis/ConfidenceMeter';
import { SymptomsCard } from '@/components/diagnosis/SymptomsCard';
import { ActionCard } from '@/components/diagnosis/ActionCard';
import { PreventionCard } from '@/components/diagnosis/PreventionCard';
import { Button } from '@/components/ui/Button';

function DiagnosisContent() {
  const searchParams = useSearchParams();
  const scanId = searchParams.get('id');
  const { scanHistory, selectedCrops } = useAppState();
  const { language } = useLanguage();

  // Find scan result by ID or fallback to latest/default
  const currentScan = scanHistory.find(s => s.id === scanId) || scanHistory[0];

  const primaryCrop = selectedCrops[0] || 'tomato';
  const disease = currentScan?.disease || MOCK_DISEASES[primaryCrop] || MOCK_DISEASES.tomato;
  const capturedImage = currentScan?.capturedImageData || disease.imageUrl;

  const diseaseTitle = disease.translatedNames[language] || disease.name;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      {/* Top Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        <Link href="/home" className="p-2 rounded-full text-slate-600 hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-base font-black text-slate-900">Crop Diagnosis</span>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `AgroCare Diagnosis: ${disease.name}`,
                text: `Disease diagnosis for ${disease.cropName}: ${disease.name}`,
                url: window.location.href
              }).catch(() => {});
            }
          }}
          className="p-2 rounded-full text-slate-600 hover:bg-slate-100"
          aria-label="Share"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-5 max-w-md mx-auto w-full">
        {/* Captured Crop Image Header */}
        <div className="relative w-full h-56 rounded-3xl overflow-hidden shadow-soft-md border border-slate-200 bg-slate-900">
          {/* eslint-disable-next-html-script-for-img */}
          <img
            src={capturedImage}
            alt={diseaseTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
              {disease.cropName} Crop
            </span>
            <span className="text-[11px] font-medium text-slate-300">
              {currentScan?.timestamp || 'Just now'}
            </span>
          </div>
        </div>

        {/* Disease Title & Scientific Name */}
        <div className="flex flex-col">
          <span className="text-xs font-bold text-agro-700 uppercase tracking-widest">
            Identified Pathogen
          </span>
          <h1 className="text-2xl font-black text-slate-900 leading-tight">
            {diseaseTitle}
          </h1>
          <span className="text-xs font-semibold text-slate-500 italic mt-0.5">
            Scientific: {disease.scientificName}
          </span>
        </div>

        {/* AI Confidence Meter & Severity Tag */}
        <ConfidenceMeter
          confidence={disease.confidence}
          severity={disease.severity}
        />

        {/* Overview text */}
        <p className="text-xs text-slate-600 leading-relaxed font-medium bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          {disease.overview}
        </p>

        {/* Symptoms & Causes Card */}
        <SymptomsCard
          symptoms={disease.symptoms}
          causes={disease.causes}
        />

        {/* Action Plan Card (Immediate, Organic, Chemical) */}
        <ActionCard
          immediateSteps={disease.immediateSteps}
          organicTreatment={disease.organicTreatment}
          chemicalTreatment={disease.chemicalTreatment}
        />

        {/* Prevention Tips & Disclaimer */}
        <PreventionCard
          preventionTips={disease.preventionTips}
          disclaimer={disease.disclaimer}
        />

        {/* Re-Scan CTA */}
        <div className="pt-2">
          <Link href="/scan" className="block">
            <Button size="xl" fullWidth icon={<Camera className="w-5 h-5" />}>
              Scan Another Crop
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DiagnosisPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sm font-bold text-slate-600">Loading Diagnosis...</div>
      </div>
    }>
      <DiagnosisContent />
    </Suspense>
  );
}
