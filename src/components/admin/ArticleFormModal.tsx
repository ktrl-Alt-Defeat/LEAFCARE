'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useApiResource } from '@/hooks/useApiResource';
import { KnowledgeArticle } from '@/lib/api/mappers';
import { cn } from '@/lib/utils';

interface KnowledgeCategory {
  id: string;
  slug: string;
  name: string;
}

/**
 * Languages an admin can write. English is mandatory because every read falls
 * back to it when a translation is missing.
 */
const LANGUAGES: Array<{ code: string; label: string; required?: boolean }> = [
  { code: 'en', label: 'English', required: true },
  { code: 'ta', label: 'Tamil' },
  { code: 'hi', label: 'Hindi' },
];

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-800 placeholder:font-medium placeholder:text-slate-400';

/** `Managing Early Blight` -> `managing-early-blight` */
const toSlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

interface TranslationDraft {
  title: string;
  summary: string;
  body: string;
}

const emptyDraft = (): TranslationDraft => ({ title: '', summary: '', body: '' });

export interface ArticleFormModalProps {
  isOpen: boolean;
  /** Null when creating a new article. */
  article: KnowledgeArticle | null;
  onClose: () => void;
  onSaved: () => void;
}

export const ArticleFormModal: React.FC<ArticleFormModalProps> = ({
  isOpen,
  article,
  onClose,
  onSaved,
}) => {
  const { data: categories } = useApiResource<KnowledgeCategory[]>(
    isOpen ? '/api/knowledge/categories' : null,
    (payload) => (payload as { categories: KnowledgeCategory[] }).categories,
  );

  const [categoryId, setCategoryId] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [published, setPublished] = useState(true);
  const [activeLang, setActiveLang] = useState('en');
  const [drafts, setDrafts] = useState<Record<string, TranslationDraft>>({ en: emptyDraft() });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Loading a draft from props is what this effect is for; the form must
    // reset when it reopens on a different article.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError(null);
    setActiveLang('en');
    setSlugTouched(Boolean(article));
    setSlug(article?.id ?? '');
    setPublished(true);
    // Only the resolved language comes back from the read API, so editing
    // preloads English and leaves other languages blank rather than guessing.
    setDrafts({
      en: article
        ? { title: article.title, summary: article.summary, body: article.body }
        : emptyDraft(),
    });
  }, [isOpen, article]);

  // Default to the first category once they load, rather than an empty select.
  useEffect(() => {
    if (categories && categories.length > 0 && !categoryId) {
      // Categories arrive asynchronously, so the default cannot be set during
      // render — it depends on a fetch that has not resolved yet.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const draft = drafts[activeLang] ?? emptyDraft();

  const setDraftField = (field: keyof TranslationDraft, value: string) => {
    setDrafts((prev) => ({
      ...prev,
      [activeLang]: { ...(prev[activeLang] ?? emptyDraft()), [field]: value },
    }));

    // The slug follows the English title until an admin edits it by hand.
    if (field === 'title' && activeLang === 'en' && !slugTouched) {
      setSlug(toSlug(value));
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);

    // Only languages actually filled in are sent; a blank Tamil tab must not
    // overwrite an existing Tamil translation with empty strings.
    const translations = Object.entries(drafts)
      .filter(([, value]) => value.title.trim() && value.body.trim())
      .map(([language_code, value]) => ({
        language_code,
        title: value.title.trim(),
        summary: value.summary.trim() || undefined,
        body: value.body.trim(),
      }));

    try {
      const response = await fetch('/api/knowledge/articles/manage', {
        method: article ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          article
            ? { idOrSlug: article.id, category_id: categoryId, published, translations }
            : { category_id: categoryId, slug, published, translations },
        ),
      });

      const body = await response.json();
      if (!response.ok) throw new Error(body?.error ?? 'The article could not be saved.');

      onSaved();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The article could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const english = drafts.en ?? emptyDraft();
  const canSubmit =
    Boolean(categoryId) &&
    slug.trim().length >= 3 &&
    english.title.trim().length >= 3 &&
    english.body.trim().length >= 10;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={article ? 'Edit article' : 'New article'}>
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-slate-900">Category</label>
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className={inputClass}
          >
            {!categories && <option>Loading…</option>}
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-slate-900">Slug</label>
          <input
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(toSlug(event.target.value));
            }}
            disabled={Boolean(article)}
            placeholder="managing-early-blight-in-tomato"
            className={cn(inputClass, article && 'opacity-60')}
          />
          <span className="text-[11px] font-medium text-slate-500">
            {article
              ? 'The slug is part of the article URL and cannot be changed here.'
              : 'Used in the article URL. Generated from the English title.'}
          </span>
        </div>

        {/* Language tabs — one article, several translations. */}
        <div className="flex gap-1.5">
          {LANGUAGES.map((language) => {
            const filled = Boolean(drafts[language.code]?.title?.trim());
            return (
              <button
                key={language.code}
                onClick={() => setActiveLang(language.code)}
                aria-pressed={activeLang === language.code}
                className={cn(
                  'flex-1 rounded-2xl border px-3 py-2 text-xs font-bold transition-colors',
                  activeLang === language.code
                    ? 'border-agro-500 bg-agro-50 text-agro-900'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-agro-200',
                )}
              >
                {language.label}
                {language.required && <span className="text-red-500"> *</span>}
                {filled && !language.required && <span className="text-agro-600"> ✓</span>}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-slate-900">Title</label>
          <input
            value={draft.title}
            onChange={(event) => setDraftField('title', event.target.value)}
            placeholder="Managing early blight in tomato"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-slate-900">Summary</label>
          <input
            value={draft.summary}
            onChange={(event) => setDraftField('summary', event.target.value)}
            placeholder="One line shown in the article list."
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-slate-900">Body</label>
          <textarea
            value={draft.body}
            onChange={(event) => setDraftField('body', event.target.value)}
            rows={6}
            placeholder="The full guidance farmers will read."
            className={cn(inputClass, 'resize-none')}
          />
        </div>

        <label className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-3">
          <input
            type="checkbox"
            checked={published}
            onChange={(event) => setPublished(event.target.checked)}
            className="h-4 w-4 accent-agro-600"
          />
          <span className="flex flex-col">
            <span className="text-sm font-bold text-slate-800">Published</span>
            <span className="text-[11px] font-medium text-slate-500">
              Unpublished articles stay hidden from farmers.
            </span>
          </span>
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
            {saving ? 'Saving…' : article ? 'Save changes' : 'Publish article'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
