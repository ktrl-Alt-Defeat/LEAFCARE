'use client';

import { useMemo } from 'react';
import { CommunityPost, Crop, CropAgronomy, Disease, MarketProduct } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import type { KnowledgeArticle } from '@/lib/api/mappers';
import { useApiResource } from './useApiResource';

/**
 * Domain hooks over this app's `/api/*` routes, which front the LeafCare
 * backend. Each returns `{ data, status, error, refresh }`.
 *
 * Every request carries the farmer's chosen language so the backend returns
 * translated crop, disease and article copy.
 */

const query = (params: Record<string, string | undefined>): string => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    const trimmed = value?.trim();
    if (trimmed) search.set(key, trimmed);
  });
  const encoded = search.toString();
  return encoded ? `?${encoded}` : '';
};

export const useCrops = (search?: string) => {
  const { language } = useLanguage();
  const path = `/api/crops${query({ lang: language, search })}`;

  const { data, status, error, refresh } = useApiResource<Crop[]>(
    path,
    (payload) => (payload as { crops: Crop[] }).crops,
  );

  return { crops: data ?? [], status, error, refresh };
};

export const useCrop = (cropId: string | null) => {
  const { language } = useLanguage();
  const path = cropId ? `/api/crops/${encodeURIComponent(cropId)}${query({ lang: language })}` : null;

  const { data, status, error, refresh } = useApiResource<{
    crop: Crop;
    agronomy: CropAgronomy;
    diseases: Disease[];
  }>(path, (payload) => payload as { crop: Crop; agronomy: CropAgronomy; diseases: Disease[] });

  return {
    crop: data?.crop ?? null,
    agronomy: data?.agronomy ?? null,
    // Primary host first, so `diseases[0]` is the most likely match for a scan.
    diseases: data?.diseases ?? [],
    status,
    error,
    refresh,
  };
};

export const useDiseases = (search?: string) => {
  const { language } = useLanguage();
  const path = `/api/diseases${query({ lang: language, search })}`;

  const { data, status, error, refresh } = useApiResource<Disease[]>(
    path,
    (payload) => (payload as { diseases: Disease[] }).diseases,
  );

  // Memoised so the identity is stable across renders — a fresh `[]` each time
  // would invalidate every downstream memo and effect.
  const diseases = useMemo(() => data ?? [], [data]);

  /** Slug-keyed lookup, matching how the scanner and diagnosis screens read. */
  const byId = useMemo(
    () => Object.fromEntries(diseases.map((disease) => [disease.id, disease])),
    [diseases],
  );

  return { diseases, byId, status, error, refresh };
};

export const useCommunityPosts = (options: { category?: string; search?: string } = {}) => {
  const path = `/api/community/posts${query(options)}`;

  const { data, status, error, refresh } = useApiResource<CommunityPost[]>(
    path,
    (payload) => (payload as { posts: CommunityPost[] }).posts,
  );

  return { posts: data ?? [], status, error, refresh };
};

export const useProducts = (options: { category?: string; search?: string } = {}) => {
  const path = `/api/marketplace/products${query(options)}`;

  const { data, status, error, refresh } = useApiResource<MarketProduct[]>(
    path,
    (payload) => (payload as { products: MarketProduct[] }).products,
  );

  return { products: data ?? [], status, error, refresh };
};

export const useKnowledgeArticles = () => {
  const { language } = useLanguage();
  const path = `/api/knowledge/articles${query({ lang: language })}`;

  const { data, status, error, refresh } = useApiResource<KnowledgeArticle[]>(
    path,
    (payload) => (payload as { articles: KnowledgeArticle[] }).articles,
  );

  return { articles: data ?? [], status, error, refresh };
};
