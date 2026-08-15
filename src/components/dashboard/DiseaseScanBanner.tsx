'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Camera, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';

export interface DiseaseScanBannerProps {
  /** Crop currently selected on the dashboard, used to personalise the copy. */
  cropName?: string | null;
}

const FLOW_STEPS = [
  { icon: <Camera className="h-5 w-5 text-emerald-300" />, label: 'Camera' },
  { icon: <span className="text-lg leading-none">🌿</span>, label: 'Leaf' },
  { icon: <Sparkles className="h-5 w-5 text-amber-300" />, label: 'AI analysis' },
  { icon: <ShieldAlert className="h-5 w-5 text-emerald-300" />, label: 'Remedy' },
];

export const DiseaseScanBanner: React.FC<DiseaseScanBannerProps> = ({ cropName }) => {
  const { t } = useLanguage();

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="relative h-full overflow-hidden rounded-3xl border border-agro-700/50 bg-agro-950 p-5 text-white shadow-soft-lg sm:p-6 lg:p-7"
    >
      {/* Background farmer photo */}
      <img
        src="/farmer-scanner.jpg"
        alt="Farmer checking crop in field"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right sm:object-center opacity-80"
      />
      {/* Gradient overlay for contrast */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-agro-950/80 to-transparent sm:via-agro-950/65" />
      <div className="pointer-events-none absolute right-0 top-0 h-52 w-52 rounded-full bg-agro-500/20 blur-3xl" />

      {/* On laptops the copy and the action sit side by side instead of stacking
          into a very tall card. */}
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-agro-400/40 bg-agro-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-agro-300">
              <Sparkles className="h-3.5 w-3.5" />
              AI LeafCare Scanner
            </span>
            {cropName && (
              <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-bold text-emerald-100">
                {cropName}
              </span>
            )}
          </div>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-white xl:text-3xl">
            {t('checkCropTitle', 'Check your crop')}
          </h2>

          <p className="mt-2 max-w-prose text-sm leading-relaxed text-emerald-100/90">
            {t(
              'checkCropDesc',
              'Take a clear picture of a leaf or crop to identify possible diseases.'
            )}
          </p>

          {/* Workflow */}
          <div className="mt-5 flex max-w-xl items-center justify-between gap-1 rounded-2xl border border-white/10 bg-white/10 p-3 text-xs text-emerald-200 backdrop-blur-md sm:gap-2">
            {FLOW_STEPS.map((step, index) => (
              <React.Fragment key={step.label}>
                <div className="flex flex-col items-center gap-1 text-center">
                  {step.icon}
                  <span className="text-[10px] font-medium sm:text-[11px]">{step.label}</span>
                </div>
                {index < FLOW_STEPS.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-emerald-400/60" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <Link href="/scan" className="block sm:w-72 lg:w-60 lg:shrink-0">
          <Button
            size="xl"
            fullWidth
            icon={<Camera className="h-6 w-6 shrink-0 stroke-[2.5]" />}
            className="whitespace-nowrap bg-gradient-to-r from-agro-500 via-emerald-500 to-agro-400 px-5 text-base font-black tracking-wide text-white shadow-soft-lg shadow-agro-500/40 ring-2 ring-white/20 hover:from-agro-400 hover:to-emerald-400"
          >
            {t('takePicture', 'Take a Picture')}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};
