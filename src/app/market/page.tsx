'use client';

import React, { useMemo, useState } from 'react';
import { PackageSearch } from 'lucide-react';
import { Page } from '@/components/layout/Page';
import { ProductCard } from '@/components/market/ProductCard';
import { ProductDetailModal } from '@/components/market/ProductDetailModal';
import { SearchInput } from '@/components/ui/SearchInput';
import { FilterChips } from '@/components/ui/FilterChips';
import { MOCK_PRODUCTS } from '@/data/products';
import { MarketProduct } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

const CATEGORIES = ['All', 'Seeds', 'Crop Protection', 'Fertilizers', 'Equipment', 'Tools'] as const;

export default function MarketPage() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<MarketProduct | null>(null);

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return MOCK_PRODUCTS.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.seller.toLowerCase().includes(query);
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  return (
    <Page
      title={t('marketHeader', 'Agri Marketplace')}
      subtitle={`${filteredProducts.length} ${filteredProducts.length === 1 ? 'listing' : 'listings'} from verified sellers`}
    >
      {/* Filter bar — sticks under the header so laptop users keep the controls
          in view while scrolling a long grid. */}
      <div className="sticky top-[var(--header-h)] z-30 -mx-4 flex flex-col gap-3 bg-[#F6F8F6]/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between xl:-mx-8 xl:px-8">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search seeds, pesticides, equipment…"
          className="lg:max-w-sm lg:flex-1"
        />
        <FilterChips options={CATEGORIES} value={activeCategory} onChange={setActiveCategory} />
      </div>

      {filteredProducts.length > 0 ? (
        <div
          data-tour="market"
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5"
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={setSelectedProduct}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center">
          <PackageSearch className="h-8 w-8 text-slate-400" />
          <p className="text-sm font-bold text-slate-700">No products found</p>
          <p className="max-w-xs text-xs font-medium text-slate-500">
            Try a different search term or clear the category filter.
          </p>
        </div>
      )}

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </Page>
  );
}
