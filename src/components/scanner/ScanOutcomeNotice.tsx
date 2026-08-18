'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, HelpCircle, WifiOff, Camera, Image as ImageIcon } from 'lucide-react';

export type ScanOutcome = 'unsupported_plant' | 'uncertain' | 'unavailable' | 'error';

export interface ScanOutcomeNoticeProps {
  outcome: ScanOutcome;
  /** Copy from the backend, written for the farmer. */
  message: string;
  /** The technical reason, shown only on request. */
  detail?: string;
  onRetake: () => void;
  onUpload: () => void;
}

/** The 14 crops the model was trained on, in the order a farmer would scan them. */
const SUPPORTED_CROPS = [
  'Tomato',
  'Potato',
  'Corn',
  'Bell Pepper',
  'Apple',
  'Grape',
  'Orange',
  'Peach',
  'Cherry',
  'Strawberry',
  'Blueberry',
  'Raspberry',
  'Soybean',
  'Squash',
];

const PRESENTATION: Record<
  ScanOutcome,
  { icon: React.ReactNode; title: string; tone: string; showCrops: boolean }
> = {
  unsupported_plant: {
    icon: <Leaf className="h-7 w-7" />,
    title: 'Not a crop we can diagnose',
    tone: 'border-amber-400/40 bg-amber-950/90 text-amber-100',
    // The one case where the crop list belongs on screen: the farmer needs to
    // know what would work, because retaking this photo will not.
    showCrops: true,
  },
  uncertain: {
    icon: <HelpCircle className="h-7 w-7" />,
    title: 'Not clear enough to diagnose',
    tone: 'border-sky-400/40 bg-sky-950/90 text-sky-100',
    showCrops: false,
  },
  unavailable: {
    icon: <WifiOff className="h-7 w-7" />,
    title: 'Diagnosis service unreachable',
    tone: 'border-slate-400/40 bg-slate-900/95 text-slate-100',
    showCrops: false,
  },
  error: {
    icon: <WifiOff className="h-7 w-7" />,
    title: 'Could not analyse that photo',
    tone: 'border-red-400/40 bg-red-950/90 text-red-100',
    showCrops: false,
  },
};

/**
 * What the scanner shows when there is no diagnosis.
 *
 * Deliberately not an error dialog. Three of these four outcomes are the system
 * working correctly — refusing to name a disease it has no basis for is the
 * point — so the panel explains what happened and offers the action that will
 * actually help, which differs per outcome: an unsupported plant needs a
 * different subject, an unclear photo needs a retake.
 */
export const ScanOutcomeNotice: React.FC<ScanOutcomeNoticeProps> = ({
  outcome,
  message,
  detail,
  onRetake,
  onUpload,
}) => {
  const { icon, title, tone, showCrops } = PRESENTATION[outcome];

  return (
    <motion.div
      role="alert"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`absolute inset-x-4 top-20 z-40 max-h-[70vh] overflow-y-auto rounded-3xl border px-5 py-4 backdrop-blur-md ${tone}`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0">{icon}</span>
        <div className="min-w-0">
          <h2 className="text-base font-black leading-tight">{title}</h2>
          <p className="mt-1 text-[13px] font-medium leading-relaxed opacity-90">{message}</p>
        </div>
      </div>

      {showCrops && (
        <div className="mt-3">
          <p className="text-[11px] font-bold uppercase tracking-widest opacity-70">
            Crops LeafCare can diagnose
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SUPPORTED_CROPS.map((crop) => (
              <span
                key={crop}
                className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold"
              >
                {crop}
              </span>
            ))}
          </div>
        </div>
      )}

      {detail && (
        <details className="mt-3">
          <summary className="cursor-pointer text-[11px] font-bold opacity-70">
            Why did I get this?
          </summary>
          <p className="mt-1.5 text-[11px] font-medium leading-relaxed opacity-80">{detail}</p>
        </details>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={onRetake}
          className="flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-xs font-black transition-colors hover:bg-white/30"
        >
          <Camera className="h-4 w-4" />
          {outcome === 'unsupported_plant' ? 'Scan another plant' : 'Take another photo'}
        </button>
        <button
          onClick={onUpload}
          className="flex items-center gap-1.5 rounded-full border border-white/30 px-4 py-2 text-xs font-bold transition-colors hover:bg-white/10"
        >
          <ImageIcon className="h-4 w-4" />
          Choose from gallery
        </button>
      </div>
    </motion.div>
  );
};
