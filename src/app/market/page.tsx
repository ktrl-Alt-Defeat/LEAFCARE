'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Header } from '@/components/navigation/Header';
import { ProductCard } from '@/components/market/ProductCard';
import { ProductDetailModal } from '@/components/market/ProductDetailModal';
import { MOCK_PRODUCTS } from '@/data/products';
import { MarketProduct } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

const CATEGORIES = ['All', 'Seeds', 'Crop Protection', 'Fertilizers', 'Equipment', 'Tools'];

export default function MarketPage() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<MarketProduct | null>(null);

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/60 pb-20">
      <Header />

      <div className="p-4 flex flex-col gap-4 max-w-md mx-auto w-full">
        {/* Title */}
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          {t('marketHeader', 'Agri Marketplace')}
        </h1>

        {/* Search */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search seeds, pesticides, equipment..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-agro-500"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-agro-600 text-white shadow-soft-sm'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={setSelectedProduct}
            />
          ))}
        </div>
      </div>

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
