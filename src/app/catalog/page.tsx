'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Sprout, FileText, Check } from 'lucide-react';
import { Page } from '@/components/layout/Page';
import { SearchInput } from '@/components/ui/SearchInput';
import { FilterChips } from '@/components/ui/FilterChips';
import { Card } from '@/components/ui/Card';
import { CROPS_DATA } from '@/data/crops';
import { CROP_AGRONOMY } from '@/data/cropDetails';
import { useLanguage } from '@/context/LanguageContext';
import { useAppState } from '@/context/AppStateContext';
import { cn } from '@/lib/utils';

const CATEGORIES = ['All', 'Vegetables', 'Cereals', 'Fruits', 'Herbs', 'Cash Crops'] as const;

export default function CatalogPage() {
  const { language, t } = useLanguage();
  const { selectedCrops } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

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

  const sheetCount = Object.keys(CROP_AGRONOMY).length;

  return (
    <Page
      title={t('cropsCatalog', 'Crops Catalog')}
      subtitle={`${CROPS_DATA.length} crops · ${sheetCount} full agronomy sheets`}
    >
      <div className="sticky top-[var(--header-h)] z-30 -mx-4 flex flex-col gap-3 bg-[#F6F8F6]/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between xl:-mx-8 xl:px-8">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search the crop catalog…"
          className="lg:max-w-sm lg:flex-1"
        />
        <FilterChips options={CATEGORIES} value={activeCategory} onChange={setActiveCategory} />
      </div>

      {filteredCrops.length > 0 ? (
        <div
          data-tour="catalog"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredCrops.map((crop) => {
            const displayName = crop.translatedNames[language] || crop.name;
            const hasSheet = Boolean(CROP_AGRONOMY[crop.id]);
            const isMine = selectedCrops.includes(crop.id);

            return (
              <Link key={crop.id} href={`/catalog/${crop.id}`} className="h-full">
                <Card
                  clickable
                  className="hover-lift group flex h-full flex-col gap-3 border-slate-100 p-4"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-inner',
                        crop.color
                      )}
                    >
                      <span role="img" aria-hidden="true">
                        {crop.icon}
                      </span>
                    </span>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="truncate text-sm font-black text-slate-900">
                          {displayName}
                        </h3>
                        <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-agro-600" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-agro-700">
                        {crop.category}
                      </span>
                      {/* Only useful when reading in a non-English language. */}
                      {language !== 'en' && (
                        <span className="truncate text-[11px] font-medium text-slate-400">
                          {crop.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-slate-500">
                    {crop.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-2.5">
                    {hasSheet ? (
                      <span className="flex items-center gap-1 rounded-full bg-agro-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-agro-700">
                        <FileText className="h-3 w-3" />
                        Full sheet
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                        Sheet soon
                      </span>
                    )}

                    {isMine && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                        <Check className="h-3 w-3" />
                        My crop
                      </span>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center">
          <Sprout className="h-8 w-8 text-slate-400" />
          <p className="text-sm font-bold text-slate-700">No crops match “{searchTerm}”</p>
          <p className="text-xs font-medium text-slate-500">
            Try a shorter name or pick another category.
          </p>
        </div>
      )}
    </Page>
  );
}
