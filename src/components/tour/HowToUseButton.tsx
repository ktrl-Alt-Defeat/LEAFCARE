'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Compass, ArrowRight } from 'lucide-react';
import { useTour } from '@/context/TourContext';
import { useLanguage } from '@/context/LanguageContext';

/** Opens the guided walkthrough. */
export const HowToUseButton: React.FC = () => {
  const { t } = useLanguage();
  const { start } = useTour();

  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={start}
      className="group flex w-full items-center gap-3 rounded-3xl border border-agro-200/70 bg-gradient-to-r from-agro-50 via-white to-emerald-50/60 p-4 text-left shadow-soft-sm transition-shadow hover:shadow-soft-md"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-agro-600 to-emerald-500 text-white shadow-soft-sm">
        <Compass className="h-5 w-5" />
      </span>

      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-black tracking-tight text-slate-900">
          {t('howToUseIt', 'How to Use It')}
        </span>
        <span className="text-xs font-medium leading-snug text-slate-500">
          {t('howToUseItSub', 'A guided tour through every feature')}
        </span>
      </span>

      <ArrowRight className="h-4 w-4 shrink-0 text-agro-600 transition-transform group-hover:translate-x-0.5" />
    </motion.button>
  );
};
