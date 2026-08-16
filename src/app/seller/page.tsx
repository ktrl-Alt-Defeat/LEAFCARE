'use client';

import React, { useMemo, useState } from 'react';
import { Plus, Store, Trash2, Pencil, PackageSearch } from 'lucide-react';
import { Page, SectionHeading } from '@/components/layout/Page';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SafeImage } from '@/components/ui/SafeImage';
import { ProductFormModal } from '@/components/seller/ProductFormModal';
import { RoleGate } from '@/components/layout/RoleGate';
import { useProducts } from '@/hooks/useLeafCareData';
import { MarketProduct } from '@/types';

/**
 * Seller dashboard.
 *
 * An addition to the regular app rather than a replacement — a seller keeps
 * every farmer feature and gains listing management here.
 */
export default function SellerPage() {
  const { products, status, error, refresh } = useProducts();
  const [editing, setEditing] = useState<MarketProduct | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const stats = useMemo(
    () => ({
      total: products.length,
      organic: products.filter((product) => product.isOrganic).length,
      value: products.reduce((sum, product) => sum + product.price, 0),
    }),
    [products],
  );

  const handleDelete = async (product: MarketProduct) => {
    // Removal is destructive from the seller's point of view, so it is
    // confirmed even though the backend only soft-deletes.
    if (!window.confirm(`Remove “${product.name}” from the marketplace?`)) return;

    setBusyId(product.id);
    setActionError(null);

    try {
      const response = await fetch(
        `/api/marketplace/products/manage?id=${encodeURIComponent(product.id)}`,
        { method: 'DELETE' },
      );
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error ?? 'Could not remove the listing.');
      refresh();
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : 'Could not remove the listing.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <RoleGate allow={['seller']}>
      <Page
        title="My Shop"
        subtitle="Manage the products you sell in the LeafCare marketplace"
        titleAction={
          <button
            onClick={() => setIsCreating(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-agro-600 px-3.5 py-2 text-xs font-bold text-white shadow-soft-sm transition-colors hover:bg-agro-700"
          >
            <Plus className="h-4 w-4" />
            <span>Add product</span>
          </button>
        }
      >
        <div className="grid grid-cols-3 gap-2.5">
          <Card className="flex flex-col items-center border-slate-100 p-3.5 text-center">
            <span className="text-xs font-semibold text-slate-500">Listings</span>
            <span className="mt-1 text-2xl font-black text-agro-700">{stats.total}</span>
          </Card>
          <Card className="flex flex-col items-center border-slate-100 p-3.5 text-center">
            <span className="text-xs font-semibold text-slate-500">Organic</span>
            <span className="mt-1 text-2xl font-black text-agro-700">{stats.organic}</span>
          </Card>
          <Card className="flex flex-col items-center border-slate-100 p-3.5 text-center">
            <span className="text-xs font-semibold text-slate-500">Catalogue value</span>
            <span className="mt-1 text-2xl font-black text-agro-700">₹{Math.round(stats.value)}</span>
          </Card>
        </div>

        {actionError && (
          <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3">
            <p className="text-xs font-medium text-red-800">{actionError}</p>
          </div>
        )}

        <SectionHeading icon={<Store className="h-5 w-5 text-agro-600" />}>
          Your listings
        </SectionHeading>

        {status === 'error' ? (
          <div className="rounded-3xl border border-dashed border-red-300 bg-red-50/60 px-6 py-14 text-center">
            <p className="text-sm font-bold text-red-700">Could not load your listings</p>
            <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
          </div>
        ) : status === 'loading' ? (
          <div className="flex flex-col gap-2.5">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="h-24 animate-pulse rounded-3xl bg-slate-200/60" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {products.map((product) => (
              <Card
                key={product.id}
                className="flex items-center gap-3 border-slate-100 p-3"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  <SafeImage
                    src={product.imageUrl}
                    alt={product.name}
                    fallbackEmoji="📦"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-black text-slate-900">{product.name}</span>
                  <span className="text-[11px] font-semibold text-agro-700">{product.category}</span>
                  <span className="text-[11px] font-medium text-slate-500">
                    ₹{product.price} / {product.unit}
                    {product.isOrganic && ' • Organic'}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    onClick={() => setEditing(product)}
                    aria-label={`Edit ${product.name}`}
                    className="rounded-xl border border-slate-200 p-2 text-slate-600 transition-colors hover:border-agro-300 hover:text-agro-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    disabled={busyId === product.id}
                    aria-label={`Remove ${product.name}`}
                    className="rounded-xl border border-slate-200 p-2 text-slate-600 transition-colors hover:border-red-300 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center">
            <PackageSearch className="h-8 w-8 text-slate-400" />
            <p className="text-sm font-bold text-slate-700">No listings yet</p>
            <p className="max-w-xs text-xs font-medium text-slate-500">
              Add your first product and it appears in the marketplace for every farmer.
            </p>
            <Button className="mt-2" onClick={() => setIsCreating(true)} icon={<Plus className="h-4 w-4" />}>
              Add product
            </Button>
          </div>
        )}

        <ProductFormModal
          isOpen={isCreating || editing !== null}
          product={editing}
          onClose={() => {
            setIsCreating(false);
            setEditing(null);
          }}
          onSaved={() => {
            setIsCreating(false);
            setEditing(null);
            refresh();
          }}
        />
      </Page>
    </RoleGate>
  );
}
