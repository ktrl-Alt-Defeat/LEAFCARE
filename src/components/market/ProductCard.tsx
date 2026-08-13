'use client';

import React from 'react';
import { Star, MapPin, ShoppingCart } from 'lucide-react';
import { MarketProduct } from '@/types';
import { Card } from '@/components/ui/Card';

export interface ProductCardProps {
  product: MarketProduct;
  onSelectProduct: (product: MarketProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct
}) => {
  return (
    <Card
      clickable
      onClick={() => onSelectProduct(product)}
      className="flex flex-col justify-between p-3.5 border-slate-100 bg-white hover:border-agro-200"
    >
      <div>
        {/* Product Image */}
        <div className="relative w-full h-32 rounded-2xl overflow-hidden mb-3 bg-slate-100">
          {/* eslint-disable-next-html-script-for-img */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          {product.isOrganic && (
            <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              Organic
            </span>
          )}
        </div>

        {/* Name & Category */}
        <span className="text-[10px] font-bold text-agro-700 uppercase tracking-wider block">
          {product.category}
        </span>
        <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 mt-0.5 mb-1">
          {product.name}
        </h4>

        {/* Rating & Seller */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-2">
          <div className="flex items-center gap-0.5 text-amber-500 font-bold">
            <Star className="w-3 h-3 fill-amber-500" />
            <span>{product.rating}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-0.5 truncate">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{product.location}</span>
          </div>
        </div>
      </div>

      {/* Price & Action */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div>
          <span className="text-sm font-black text-slate-900">₹{product.price}</span>
          <span className="text-[10px] text-slate-500 font-medium"> /{product.unit}</span>
        </div>

        <button className="p-2 rounded-xl bg-agro-50 text-agro-700 hover:bg-agro-600 hover:text-white transition-colors">
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
};
