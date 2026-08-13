'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Leaf } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '@/data/languages';
import { LanguageCode } from '@/types';
import { Button } from '@/components/ui/Button';

export interface LanguageSelectorProps {
  selectedLanguage: LanguageCode;
  onSelectLanguage: (code: LanguageCode) => void;
  onContinue: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onSelectLanguage,
  onContinue
}) => {
  return (
    <div className="flex flex-col min-h-screen justify-between p-6 bg-gradient-to-b from-agro-50/60 via-white to-white">
      {/* Header section */}
      <div className="flex flex-col items-center text-center pt-6 pb-4">
        {/* Brand Emblem */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-agro-600 via-emerald-500 to-green-400 text-white flex items-center justify-center shadow-soft-lg shadow-agro-600/30 mb-4"
        >
          <Leaf className="w-9 h-9 fill-white/20" />
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-bold text-agro-700 uppercase tracking-widest bg-agro-100/80 px-3 py-1 rounded-full mb-2"
        >
          AgroCare Platform
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-black text-slate-900 tracking-tight"
        >
          Welcome!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-slate-600 font-medium text-base mt-1"
        >
          Select your preferred language
        </motion.p>
      </div>

      {/* Vertical Language Cards List */}
      <div className="flex flex-col gap-3 my-4">
        {SUPPORTED_LANGUAGES.map((lang, index) => {
          const isSelected = selectedLanguage === lang.code;

          return (
            <motion.div
              key={lang.code}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={() => onSelectLanguage(lang.code)}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer bg-white ${
                isSelected
                  ? 'border-agro-600 bg-agro-50/40 shadow-soft-md scale-[1.01]'
                  : 'border-slate-200/80 hover:border-agro-300 hover:bg-slate-50/60 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className="text-2xl select-none" role="img" aria-label={lang.englishName}>
                  {lang.flagSymbol || '🇮🇳'}
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900 leading-tight">
                      {lang.nativeName}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      ({lang.englishName})
                    </span>
                  </div>
                  <span className="text-xs text-slate-600 font-normal mt-0.5">
                    {lang.description}
                  </span>
                </div>
              </div>

              {/* Radio Indicator */}
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'border-agro-600 bg-agro-600 text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-3 pt-2 pb-6">
        <Button
          size="xl"
          fullWidth
          disabled={!selectedLanguage}
          onClick={onContinue}
          className="shadow-soft-lg"
        >
          Continue
        </Button>

        <p className="text-center text-xs text-slate-500 leading-relaxed px-4">
          I agree to the{' '}
          <span className="underline font-medium text-slate-700">Terms of Use</span> and{' '}
          <span className="underline font-medium text-slate-700">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};
