'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Leaf } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '@/data/languages';
import { LanguageCode } from '@/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface LanguageSelectorProps {
  selectedLanguage: LanguageCode;
  onSelectLanguage: (code: LanguageCode) => void;
  onContinue: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onSelectLanguage,
  onContinue,
}) => {
  return (
    <div className="onboarding-stage">
      <div className="flex flex-col items-center pb-4 pt-6 text-center lg:items-start lg:pt-0 lg:text-left">
        {/* The brand mark is already shown in the laptop side panel. */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-agro-600 via-emerald-500 to-green-400 text-white shadow-soft-lg shadow-agro-600/30 lg:hidden"
        >
          <Leaf className="h-9 w-9 fill-white/20" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black tracking-tight text-slate-900"
        >
          Welcome!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-1 text-base font-medium text-slate-600"
        >
          Select your preferred language
        </motion.p>
      </div>

      {/* Two columns once there is room, so all six languages stay in view
          instead of pushing the Continue button off a short laptop screen. */}
      <div className="my-4 grid gap-2.5 lg:my-0 lg:grid-cols-2">
        {SUPPORTED_LANGUAGES.map((lang, index) => {
          const isSelected = selectedLanguage === lang.code;

          return (
            <motion.button
              key={lang.code}
              type="button"
              role="radio"
              aria-checked={isSelected}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + index * 0.04 }}
              onClick={() => onSelectLanguage(lang.code)}
              className={cn(
                'flex items-center justify-between gap-3 rounded-2xl border-2 bg-white p-3.5 text-left transition-colors duration-200',
                isSelected
                  ? 'border-agro-600 bg-agro-50/40 shadow-soft-md'
                  : 'border-slate-200/80 shadow-sm hover:border-agro-300 hover:bg-slate-50/60'
              )}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="select-none text-2xl" role="img" aria-hidden="true">
                  {lang.flagSymbol || '🇮🇳'}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-base font-bold leading-tight text-slate-900">
                    {lang.nativeName}
                  </span>
                  <span className="truncate text-xs font-medium text-slate-500">
                    {lang.englishName}
                  </span>
                </span>
              </span>

              <span
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                  isSelected
                    ? 'border-agro-600 bg-agro-600 text-white'
                    : 'border-slate-300 bg-white'
                )}
              >
                {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 pb-6 pt-2 lg:pb-0">
        <Button
          size="xl"
          fullWidth
          disabled={!selectedLanguage}
          onClick={onContinue}
          className="shadow-soft-lg"
        >
          Continue
        </Button>

        <p className="px-4 text-center text-xs leading-relaxed text-slate-500">
          I agree to the{' '}
          <span className="font-medium text-slate-700 underline">Terms of Use</span> and{' '}
          <span className="font-medium text-slate-700 underline">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};
