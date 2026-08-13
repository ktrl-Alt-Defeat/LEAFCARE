'use client';

import React from 'react';
import { Star, MapPin, ShoppingCart } from 'lucide-react';
import { MarketProduct } from '@/types';
import { Card } from '@/components/ui/Card';
import { SafeImage } from '@/components/ui/SafeImage';

export interface ProductCardProps {
  product: MarketProduct;
  onSelectProduct: (product: MarketProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  return (
    <Card
      clickable
      onClick={() => onSelectProduct(product)}
      className="hover-lift group flex h-full flex-col justify-between border-slate-100 bg-white p-3 hover:border-agro-200 sm:p-3.5"
    >
      <div>
        <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100">
          <SafeImage
            src={product.imageUrl}
            alt={product.name}
            fallbackEmoji="📦"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.isOrganic && (
            <span className="absolute left-2 top-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">
              Organic
            </span>
          )}
        </div>

        <span className="block text-[10px] font-bold uppercase tracking-wider text-agro-700">
          {product.category}
        </span>
        <h3 className="mb-1 mt-0.5 line-clamp-2 text-xs font-bold leading-snug text-slate-900 sm:text-sm">
          {product.name}
        </h3>

        <div className="mb-2 flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="flex items-center gap-0.5 font-bold text-amber-500">
            <Star className="h-3 w-3 fill-amber-500" />
            {product.rating}
          </span>
          <span aria-hidden="true">•</span>
          <span className="flex min-w-0 items-center gap-0.5">
            <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
            <span className="truncate">{product.location}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
        <div className="min-w-0">
          <span className="text-sm font-black text-slate-900">₹{product.price}</span>
          <span className="text-[10px] font-medium text-slate-500"> /{product.unit}</span>
        </div>

        <span
          className="shrink-0 rounded-xl bg-agro-50 p-2 text-agro-700 transition-colors group-hover:bg-agro-600 group-hover:text-white"
          aria-hidden="true"
        >
          <ShoppingCart className="h-4 w-4" />
        </span>
      </div>
    </Card>
  );
};
