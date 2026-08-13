'use client';

import React from 'react';
import { Crop } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export interface CropChipProps {
  crop: Crop;
  isActive: boolean;
  onClick: () => void;
}

export const CropChip: React.FC<CropChipProps> = ({
  crop,
  isActive,
  onClick
}) => {
  const { language } = useLanguage();
  const name = crop.translatedNames[language] || crop.name;

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
        isActive
          ? 'bg-agro-600 text-white border-agro-600 shadow-soft-sm scale-105'
          : 'bg-white text-slate-700 border-slate-200 hover:border-agro-300 hover:bg-agro-50/50'
      }`}
    >
      <span className="text-base select-none">{crop.icon}</span>
      <span>{name}</span>
    </button>
  );
};
