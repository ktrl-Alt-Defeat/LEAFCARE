'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { ANALYSIS_STEPS } from '@/hooks/useCropScanner';

export interface ScanAnalysisAnimationProps {
  capturedImage: string | null;
  currentStepIndex: number;
}

export const ScanAnalysisAnimation: React.FC<ScanAnalysisAnimationProps> = ({
  capturedImage,
  currentStepIndex
}) => {
  const currentStepText = ANALYSIS_STEPS[currentStepIndex] || ANALYSIS_STEPS[0];
  const progressPercent = Math.round(((currentStepIndex + 1) / ANALYSIS_STEPS.length) * 100);

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-between gap-4 bg-slate-950 p-6">
      {/* Captured frame — capped so it stays portrait on wide laptop screens. */}
      <div className="relative mt-4 h-[58vh] w-full max-w-[26rem] overflow-hidden rounded-3xl border border-white/20 shadow-2xl">
        {capturedImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={capturedImage}
            alt="Captured crop leaf"
            className="w-full h-full object-cover filter contrast-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-agro-900 via-slate-900 to-slate-950 flex items-center justify-center text-6xl">
            🌿
          </div>
        )}

        {/* Pulsing Scan Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

        {/* Animated Green Laser Scanning Line */}
        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-agro-400 to-transparent shadow-glow animate-scan-line z-20" />

        {/* Center Target Bracket Frame */}
        <div className="absolute inset-8 border-2 border-agro-400/80 rounded-3xl pointer-events-none animate-pulse-glow">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-agro-400 rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-agro-400 rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-agro-400 rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-agro-400 rounded-br-xl" />
        </div>
      </div>

      {/* Bottom Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex w-full max-w-[26rem] flex-col gap-3 rounded-3xl border border-white/20 bg-slate-900/90 p-5 text-white shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
            <span className="text-sm font-black tracking-wide">
              Analyzing Crop Disease...
            </span>
          </div>
          <span className="text-xs font-black text-agro-400 bg-agro-950 px-2.5 py-1 rounded-full border border-agro-500/30">
            {progressPercent}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-agro-500 to-emerald-400"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Analysis Step Checklist */}
        <div className="flex flex-col gap-1.5 pt-1">
          {ANALYSIS_STEPS.map((stepText, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={stepText}
                className={`flex items-center gap-2 text-xs transition-colors ${
                  isDone
                    ? 'text-agro-400 font-semibold'
                    : isCurrent
                    ? 'text-white font-bold'
                    : 'text-slate-500'
                }`}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-agro-400" />
                  ) : isCurrent ? (
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  )}
                </div>
                <span>{stepText}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
