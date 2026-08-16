'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { MarketProduct } from '@/types';
import { cn } from '@/lib/utils';

/**
 * Backend category slugs paired with the labels the marketplace shows.
 * The API validates against the slug, so the mapping lives in one place.
 */
const CATEGORIES: Array<{ slug: string; label: string }> = [
  { slug: 'seeds', label: 'Seeds' },
  { slug: 'fertilizers', label: 'Fertilizers' },
  { slug: 'crop_protection', label: 'Crop Protection' },
  { slug: 'tools', label: 'Tools' },
  { slug: 'equipment', label: 'Equipment' },
];

const LABEL_TO_SLUG: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((entry) => [entry.label, entry.slug]),
);

/**
 * Seed seller account. Without an auth module there is no signed-in user to
 * attribute a listing to, so new products are owned by this account.
 */
const SEED_SELLER_ID = '33333333-3333-4333-8333-333333333333';

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-800 placeholder:font-medium placeholder:text-slate-400';

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({
  label,
  hint,
  children,
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-bold text-slate-900">{label}</label>
    {children}
    {hint && <span className="text-[11px] font-medium text-slate-500">{hint}</span>}
  </div>
);

export interface ProductFormModalProps {
  isOpen: boolean;
  /** Null when creating; the existing listing when editing. */
  product: MarketProduct | null;
  onClose: () => void;
  onSaved: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  product,
  onClose,
  onSaved,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('crop_protection');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('');
  const [stock, setStock] = useState('0');
  const [isOrganic, setIsOrganic] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refills whenever the modal opens, so editing one product then another does
  // not leave the previous product's values in the form.
  useEffect(() => {
    if (!isOpen) return;

    // Loading a draft from props is what this effect is for; editing one
    // product then another must not keep the previous values.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError(null);
    setName(product?.name ?? '');
    setCategory(product ? (LABEL_TO_SLUG[product.category] ?? 'crop_protection') : 'crop_protection');
    setDescription(product?.description ?? '');
    setPrice(product ? String(product.price) : '');
    setUnit(product?.unit ?? '');
    setStock('0');
    setIsOrganic(product?.isOrganic ?? false);
    setImageUrl(product?.imageUrl ?? '');
  }, [isOpen, product]);

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);

    const payload: Record<string, unknown> = {
      name: name.trim(),
      category,
      description: description.trim() || undefined,
      price,
      unit: unit.trim(),
      stock_quantity: stock,
      is_organic: isOrganic,
      // Empty string would fail URL validation upstream; omit instead.
      image_url: imageUrl.trim() || undefined,
    };

    try {
      const response = await fetch('/api/marketplace/products/manage', {
        method: product ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          product ? { id: product.id, ...payload } : { seller_id: SEED_SELLER_ID, ...payload },
        ),
      });

      const body = await response.json();
      if (!response.ok) throw new Error(body?.error ?? 'The listing could not be saved.');

      onSaved();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The listing could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const canSubmit = name.trim().length >= 2 && unit.trim().length > 0 && price !== '';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product ? 'Edit listing' : 'Add product'}>
      <div className="flex flex-col gap-4 pt-1">
        <Field label="Product name">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Neem-Care Organic Bio-Fungicide (1L)"
            className={inputClass}
          />
        </Field>

        <Field label="Category">
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={inputClass}
          >
            {CATEGORIES.map((entry) => (
              <option key={entry.slug} value={entry.slug}>
                {entry.label}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Price (₹)">
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="340"
              className={inputClass}
            />
          </Field>
          <Field label="Unit">
            <input
              value={unit}
              onChange={(event) => setUnit(event.target.value)}
              placeholder="Bottle"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Stock quantity">
          <input
            type="number"
            min="0"
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Description">
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder="What it treats, how it is applied, and the pack size."
            className={cn(inputClass, 'resize-none')}
          />
        </Field>

        <Field label="Image URL" hint="Optional. Leave blank to show a placeholder.">
          <input
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="https://…"
            className={inputClass}
          />
        </Field>

        <label className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-3">
          <input
            type="checkbox"
            checked={isOrganic}
            onChange={(event) => setIsOrganic(event.target.checked)}
            className="h-4 w-4 accent-agro-600"
          />
          <span className="text-sm font-bold text-slate-800">Certified organic</span>
        </label>

        {error && (
          <div className="rounded-2xl border border-red-300 bg-red-50 px-3.5 py-3">
            <p className="text-xs font-medium text-red-800">{error}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" fullWidth onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button fullWidth onClick={handleSubmit} disabled={!canSubmit || saving}>
            {saving ? 'Saving…' : product ? 'Save changes' : 'List product'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
