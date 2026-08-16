'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Plus, Pencil, Trash2, Sprout, Bug } from 'lucide-react';
import { Page, SectionHeading } from '@/components/layout/Page';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RoleGate } from '@/components/layout/RoleGate';
import { ArticleFormModal } from '@/components/admin/ArticleFormModal';
import { useKnowledgeArticles, useCrops, useDiseases } from '@/hooks/useLeafCareData';
import { KnowledgeArticle } from '@/lib/api/mappers';

/**
 * Admin dashboard.
 *
 * Curation of the agri library: knowledge articles are editable here, and the
 * crop and disease catalogues are surfaced read-only so an admin can see what
 * the library currently covers.
 */
export default function AdminPage() {
  const { articles, status, error, refresh } = useKnowledgeArticles();
  const { crops } = useCrops();
  const { diseases } = useDiseases();

  const [editing, setEditing] = useState<KnowledgeArticle | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(articles.map((article) => article.categoryName).filter(Boolean))),
    [articles],
  );

  const handleDelete = async (article: KnowledgeArticle) => {
    if (!window.confirm(`Delete “${article.title}”? This removes all its translations.`)) return;

    setBusyId(article.id);
    setActionError(null);

    try {
      const response = await fetch(
        `/api/knowledge/articles/manage?idOrSlug=${encodeURIComponent(article.id)}`,
        { method: 'DELETE' },
      );
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error ?? 'Could not delete the article.');
      refresh();
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : 'Could not delete the article.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <RoleGate allow={['admin']}>
      <Page
        title="Admin"
        subtitle="Curate the agri library and knowledge base"
        titleAction={
          <button
            onClick={() => setIsCreating(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-agro-600 px-3.5 py-2 text-xs font-bold text-white shadow-soft-sm transition-colors hover:bg-agro-700"
          >
            <Plus className="h-4 w-4" />
            <span>New article</span>
          </button>
        }
      >
        {/* Library at a glance — what the catalogue currently covers. */}
        <div className="grid grid-cols-3 gap-2.5">
          <Card className="flex flex-col items-center border-slate-100 p-3.5 text-center">
            <Sprout className="h-4 w-4 text-agro-600" />
            <span className="mt-1 text-2xl font-black text-agro-700">{crops.length}</span>
            <span className="text-[11px] font-semibold text-slate-500">Crops</span>
          </Card>
          <Card className="flex flex-col items-center border-slate-100 p-3.5 text-center">
            <Bug className="h-4 w-4 text-rose-600" />
            <span className="mt-1 text-2xl font-black text-rose-700">{diseases.length}</span>
            <span className="text-[11px] font-semibold text-slate-500">Diseases</span>
          </Card>
          <Card className="flex flex-col items-center border-slate-100 p-3.5 text-center">
            <BookOpen className="h-4 w-4 text-amber-600" />
            <span className="mt-1 text-2xl font-black text-amber-700">{articles.length}</span>
            <span className="text-[11px] font-semibold text-slate-500">Articles</span>
          </Card>
        </div>

        {actionError && (
          <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3">
            <p className="text-xs font-medium text-red-800">{actionError}</p>
          </div>
        )}

        <SectionHeading icon={<BookOpen className="h-5 w-5 text-agro-600" />}>
          Knowledge base
        </SectionHeading>

        {status === 'error' ? (
          <div className="rounded-3xl border border-dashed border-red-300 bg-red-50/60 px-6 py-14 text-center">
            <p className="text-sm font-bold text-red-700">Could not load the knowledge base</p>
            <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
          </div>
        ) : status === 'loading' ? (
          <div className="flex flex-col gap-2.5">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="h-24 animate-pulse rounded-3xl bg-slate-200/60" />
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {articles.map((article) => (
              <Card key={article.id} className="flex items-start gap-3 border-slate-100 p-3.5">
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-agro-700">
                    {article.categoryName}
                  </span>
                  <span className="truncate text-sm font-black text-slate-900">{article.title}</span>
                  {article.summary && (
                    <span className="line-clamp-2 text-[11px] font-medium leading-snug text-slate-500">
                      {article.summary}
                    </span>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    onClick={() => setEditing(article)}
                    aria-label={`Edit ${article.title}`}
                    className="rounded-xl border border-slate-200 p-2 text-slate-600 transition-colors hover:border-agro-300 hover:text-agro-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(article)}
                    disabled={busyId === article.id}
                    aria-label={`Delete ${article.title}`}
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
            <BookOpen className="h-8 w-8 text-slate-400" />
            <p className="text-sm font-bold text-slate-700">No articles yet</p>
            <Button className="mt-2" onClick={() => setIsCreating(true)} icon={<Plus className="h-4 w-4" />}>
              Write the first one
            </Button>
          </div>
        )}

        {categories.length > 0 && (
          <p className="text-[11px] font-medium text-slate-500">
            Categories in use: {categories.join(', ')}
          </p>
        )}

        <SectionHeading icon={<Sprout className="h-5 w-5 text-agro-600" />}>
          Crop &amp; disease catalogue
        </SectionHeading>

        <Card className="flex flex-col gap-2 border-slate-100 p-4">
          <p className="text-xs font-medium leading-relaxed text-slate-600">
            The crop and disease catalogues are seeded from the backend and shared by every user.
            They are shown here read-only — editing them changes what the scanner can diagnose, so
            it is done through a database seed rather than the app.
          </p>
          <div className="flex gap-2 pt-1">
            <Link href="/catalog">
              <Button variant="outline">Browse crops</Button>
            </Link>
            <Link href="/knowledge">
              <Button variant="outline">View public library</Button>
            </Link>
          </div>
        </Card>

        <ArticleFormModal
          isOpen={isCreating || editing !== null}
          article={editing}
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
