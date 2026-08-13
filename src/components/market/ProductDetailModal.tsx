'use client';

import React from 'react';
import { Star, MapPin, ShieldCheck, PhoneCall } from 'lucide-react';
import { MarketProduct } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { SafeImage } from '@/components/ui/SafeImage';

export interface ProductDetailModalProps {
  product: MarketProduct | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose
}) => {
  if (!product) return null;

  return (
    <Modal isOpen={!!product} onClose={onClose} title={product.name}>
      <div className="flex flex-col gap-4">
        <div className="relative h-48 w-full overflow-hidden rounded-2xl shadow-sm sm:h-56">
          <SafeImage
            src={product.imageUrl}
            alt={product.name}
            fallbackEmoji="📦"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-black text-slate-900">₹{product.price}</span>
            <span className="text-xs text-slate-500 font-semibold"> /{product.unit}</span>
          </div>

          <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <Star className="w-4 h-4 fill-amber-500" />
            <span className="text-xs">{product.rating} ({product.reviewsCount} reviews)</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {product.description}
        </p>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Verified Seller:</span>
            <span className="font-bold text-slate-900">{product.seller}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Location:</span>
            <span className="font-bold text-slate-900 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              {product.location}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Direct farmer order with local agricultural dealer delivery.</span>
        </div>

        <Button size="lg" fullWidth icon={<PhoneCall className="w-5 h-5" />}>
          Inquire / Order Now
        </Button>
      </div>
    </Modal>
  );
};
