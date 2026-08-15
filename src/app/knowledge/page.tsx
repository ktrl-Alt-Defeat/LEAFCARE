'use client';

import React, { useMemo, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Page } from '@/components/layout/Page';
import { Card } from '@/components/ui/Card';
import { SearchInput } from '@/components/ui/SearchInput';
import { FilterChips } from '@/components/ui/FilterChips';
import { SafeImage } from '@/components/ui/SafeImage';
import { useLanguage } from '@/context/LanguageContext';
import { useKnowledgeArticles } from '@/hooks/useLeafCareData';

export default function KnowledgePage() {
  const { t } = useLanguage();
  const { articles, status, error } = useKnowledgeArticles();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Categories come from the articles themselves, so a new one added to the
  // backend appears here without a frontend change.
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(articles.map((article) => article.categoryName).filter(Boolean)))],
    [articles],
  );

  const filteredArticles = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesSearch =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query);
      const matchesCategory = activeCategory === 'All' || article.categoryName === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [articles, searchTerm, activeCategory]);

  return (
    <Page
      title={t('knowledgeHeader', 'Knowledge Base')}
      subtitle={
        status === 'loading'
          ? 'Loading articles…'
          : `${articles.length} ${articles.length === 1 ? 'article' : 'articles'} from agronomists`
      }
    >
      <div className="sticky top-[var(--header-h)] z-30 -mx-4 flex flex-col gap-3 bg-[#F6F8F6]/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between xl:-mx-8 xl:px-8">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search guidance and how-tos…"
          className="lg:max-w-sm lg:flex-1"
        />
        <FilterChips options={categories} value={activeCategory} onChange={setActiveCategory} />
      </div>

      {status === 'error' ? (
        <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-red-300 bg-red-50/60 px-6 py-16 text-center">
          <BookOpen className="h-8 w-8 text-red-400" />
          <p className="text-sm font-bold text-red-700">Could not load the knowledge base</p>
          <p className="max-w-xs text-xs font-medium text-red-600">{error}</p>
        </div>
      ) : status === 'loading' ? (
        <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-3xl bg-slate-200/60" />
          ))}
        </div>
      ) : filteredArticles.length > 0 ? (
        <div className="grid gap-3 lg:grid-cols-2 lg:items-start lg:gap-4">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="flex flex-col gap-3 border-slate-100 p-4">
              {article.heroImageUrl && (
                <SafeImage
                  src={article.heroImageUrl}
                  alt={article.title}
                  fallbackEmoji="📖"
                  className="h-36 w-full rounded-2xl object-cover"
                />
              )}

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-agro-700">
                  {article.categoryName}
                </span>
                <h3 className="text-sm font-black leading-snug text-slate-900">{article.title}</h3>
              </div>

              {article.summary && (
                <p className="text-xs leading-relaxed text-slate-500">{article.summary}</p>
              )}

              {article.body && (
                <p className="whitespace-pre-line border-t border-slate-100 pt-2.5 text-xs leading-relaxed text-slate-600">
                  {article.body}
                </p>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center">
          <BookOpen className="h-8 w-8 text-slate-400" />
          <p className="text-sm font-bold text-slate-700">No articles match your search</p>
          <p className="max-w-xs text-xs font-medium text-slate-500">
            Try a different term or clear the category filter.
          </p>
        </div>
      )}
    </Page>
  );
}
