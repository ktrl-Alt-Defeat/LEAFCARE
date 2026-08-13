'use client';

import React, { useMemo, useState } from 'react';
import { Sprout } from 'lucide-react';
import { CROPS_DATA } from '@/data/crops';
import { CropCard } from './CropCard';
import { SearchInput } from '@/components/ui/SearchInput';
import { FilterChips } from '@/components/ui/FilterChips';
import { useLanguage } from '@/context/LanguageContext';

export interface CropGridProps {
  selectedCrops: string[];
  onToggleCrop: (cropId: string) => void;
}

const CATEGORIES = ['All', 'Vegetables', 'Cereals', 'Fruits', 'Herbs', 'Cash Crops'] as const;

export const CropGrid: React.FC<CropGridProps> = ({ selectedCrops, onToggleCrop }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const { language, t } = useLanguage();

  const filteredCrops = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return CROPS_DATA.filter((crop) => {
      const displayName = (crop.translatedNames[language] || crop.name).toLowerCase();
      const matchesSearch =
        !query || displayName.includes(query) || crop.name.toLowerCase().includes(query);
      const matchesCategory = activeCategory === 'All' || crop.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, language]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={t('searchCrops', 'Search crops…')}
          className="lg:max-w-sm lg:flex-1"
        />
        <FilterChips options={CATEGORIES} value={activeCategory} onChange={setActiveCategory} />
      </div>

      {filteredCrops.length > 0 ? (
        <div className="grid grid-cols-3 gap-2.5 xs:gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
          {filteredCrops.map((crop) => (
            <CropCard
              key={crop.id}
              crop={crop}
              selected={selectedCrops.includes(crop.id)}
              onToggle={onToggleCrop}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-slate-300 px-6 py-14 text-center">
          <Sprout className="h-8 w-8 text-slate-400" />
          <p className="text-sm font-bold text-slate-700">No crops match “{searchTerm}”</p>
          <p className="text-xs font-medium text-slate-500">
            Try a shorter name or pick another category.
          </p>
        </div>
      )}
    </div>
  );
};
