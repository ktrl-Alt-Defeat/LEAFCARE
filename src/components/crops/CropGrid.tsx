'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { CROPS_DATA } from '@/data/crops';
import { CropCard } from './CropCard';
import { useLanguage } from '@/context/LanguageContext';

export interface CropGridProps {
  selectedCrops: string[];
  onToggleCrop: (cropId: string) => void;
}

const CATEGORIES = ['All', 'Vegetables', 'Cereals', 'Fruits', 'Herbs', 'Cash Crops'];

export const CropGrid: React.FC<CropGridProps> = ({
  selectedCrops,
  onToggleCrop
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const { language, t } = useLanguage();

  const filteredCrops = CROPS_DATA.filter(crop => {
    const displayName = (crop.translatedNames[language] || crop.name).toLowerCase();
    const matchesSearch = displayName.includes(searchTerm.toLowerCase()) || crop.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || crop.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('searchCrops', 'Search crops...')}
          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-agro-500 focus:bg-white transition-all"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-agro-600 text-white shadow-soft-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Responsive Crop Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filteredCrops.map(crop => (
          <CropCard
            key={crop.id}
            crop={crop}
            selected={selectedCrops.includes(crop.id)}
            onToggle={onToggleCrop}
          />
        ))}
      </div>

      {filteredCrops.length === 0 && (
        <div className="text-center py-10 text-slate-500 font-medium text-sm">
          No crops found matching &quot;{searchTerm}&quot;
        </div>
      )}
    </div>
  );
};
