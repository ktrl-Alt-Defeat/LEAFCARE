'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Crop } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export interface CropCardProps {
  crop: Crop;
  selected: boolean;
  onToggle: (cropId: string) => void;
}

export const CropCard: React.FC<CropCardProps> = ({
  crop,
  selected,
  onToggle
}) => {
  const { language } = useLanguage();
  const displayName = crop.translatedNames[language] || crop.name;

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -2 }}
      onClick={() => onToggle(crop.id)}
      className={`relative flex flex-col items-center justify-between p-4 rounded-3xl cursor-pointer transition-all duration-200 border-2 bg-white ${
        selected
          ? 'border-agro-600 bg-agro-50/40 shadow-soft-md ring-2 ring-agro-500/20'
          : 'border-slate-100 hover:border-agro-200 shadow-sm hover:shadow-soft-sm'
      }`}
    >
      {/* Selection Check Badge */}
      <div
        className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
          selected
            ? 'bg-agro-600 text-white scale-100'
            : 'border border-slate-300 bg-slate-50 text-transparent scale-90'
        }`}
      >
        <Check className="w-3.5 h-3.5 stroke-[3]" />
      </div>

      {/* Circular Crop Illustration Container */}
      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3 shadow-inner ${crop.color}`}>
        <span role="img" aria-label={crop.name}>{crop.icon}</span>
      </div>

      {/* Crop Name */}
      <span className="text-sm font-bold text-slate-900 text-center leading-tight">
        {displayName}
      </span>

      {/* Secondary Category Tag */}
      <span className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wider">
        {crop.category}
      </span>
    </motion.div>
  );
};
