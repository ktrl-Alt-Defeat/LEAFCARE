'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useAppState } from '@/context/AppStateContext';
import { SUPPORTED_LANGUAGES } from '@/data/languages';
import { cn } from '@/lib/utils';

/**
 * Replaces the old "cycle through languages on every tap" button, which forced
 * up to six taps to reach a language and gave no preview of the options.
 */
export const LanguageMenu: React.FC = () => {
  const { language, setLanguage } = useAppState();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-agro-200/80 bg-agro-50 px-2.5 py-1.5 text-xs font-semibold text-agro-800 transition-colors hover:bg-agro-100 sm:px-3"
        title="Change language"
      >
        <Globe className="h-3.5 w-3.5 text-agro-600" />
        <span className="hidden xs:inline">{current.nativeName}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-60 origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-soft-lg"
          >
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <li key={lang.code}>
                  <button
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setLanguage(lang.code);
                      setOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left transition-colors',
                      isSelected ? 'bg-agro-50 text-agro-900' : 'hover:bg-slate-50'
                    )}
                  >
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-bold">{lang.nativeName}</span>
                      <span className="truncate text-[11px] font-medium text-slate-500">
                        {lang.englishName}
                      </span>
                    </span>
                    {isSelected && <Check className="h-4 w-4 shrink-0 stroke-[3] text-agro-600" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
