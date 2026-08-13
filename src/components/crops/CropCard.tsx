'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Crop } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

export interface CropCardProps {
  crop: Crop;
  selected: boolean;
  onToggle: (cropId: string) => void;
}

export const CropCard: React.FC<CropCardProps> = ({ crop, selected, onToggle }) => {
  const { language } = useLanguage();
  const displayName = crop.translatedNames[language] || crop.name;

  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={selected}
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -2 }}
      onClick={() => onToggle(crop.id)}
      className={cn(
        'relative flex h-full flex-col items-center justify-start rounded-2xl border-2 bg-white p-3 transition-colors duration-200 sm:rounded-3xl sm:p-4',
        selected
          ? 'border-agro-600 bg-agro-50/40 shadow-soft-md ring-2 ring-agro-500/20'
          : 'border-slate-100 shadow-sm hover:border-agro-200 hover:shadow-soft-sm'
      )}
    >
      <span
        className={cn(
          'absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full transition-all sm:right-3 sm:top-3 sm:h-6 sm:w-6',
          selected
            ? 'scale-100 bg-agro-600 text-white'
            : 'scale-90 border border-slate-300 bg-slate-50 text-transparent'
        )}
      >
        <Check className="h-3 w-3 stroke-[3] sm:h-3.5 sm:w-3.5" />
      </span>

      <span
        className={cn(
          'mb-2 flex h-12 w-12 items-center justify-center rounded-full text-2xl shadow-inner sm:mb-3 sm:h-16 sm:w-16 sm:text-3xl',
          crop.color
        )}
      >
        <span role="img" aria-hidden="true">
          {crop.icon}
        </span>
      </span>

      <span className="line-clamp-2 text-center text-xs font-bold leading-tight text-slate-900 sm:text-sm">
        {displayName}
      </span>

      <span className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-500">
        {crop.category}
      </span>
    </motion.button>
  );
};
