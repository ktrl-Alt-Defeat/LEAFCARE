'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Globe } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { TOUR_STEPS } from '@/data/tour';
import { SUPPORTED_LANGUAGES } from '@/data/languages';
import { useLanguage } from '@/context/LanguageContext';
import { useAppState } from '@/context/AppStateContext';
import { cn } from '@/lib/utils';

export interface FeatureTourProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * High-level product walkthrough: what LeafCare is, what each feature is for,
 * and why it is worth using. Every string is translated, and the language can be
 * switched from inside the tour so a first-time user is never stuck reading a
 * language they do not know.
 */
export const FeatureTour: React.FC<FeatureTourProps> = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const { setLanguage } = useAppState();
  const [stepIndex, setStepIndex] = useState(0);

  // Always begin at the overview when the tour is reopened.
  useEffect(() => {
    if (isOpen) setStepIndex(0);
  }, [isOpen]);

  const step = TOUR_STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === TOUR_STEPS.length - 1;
  const Icon = step.icon;

  const goNext = () => (isLast ? onClose() : setStepIndex((index) => index + 1));
  const goBack = () => setStepIndex((index) => Math.max(index - 1, 0));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('tourHeading', 'Welcome to LeafCare')}>
      <div className="flex flex-col gap-5">
        {/* Language switcher — the tour itself is the first thing a new user reads. */}
        {/* `overflow-x-auto` also clips vertically, so the row carries padding —
            Tamil, Kannada and Malayalam glyphs extend past the text line box. */}
        <div className="no-scrollbar -mx-1 -my-1 flex items-center gap-2 overflow-x-auto px-1 py-1">
          <Globe className="h-4 w-4 shrink-0 text-slate-400" />
          {SUPPORTED_LANGUAGES.map((option) => (
            <button
              key={option.code}
              onClick={() => setLanguage(option.code)}
              aria-pressed={option.code === language}
              className={cn(
                'shrink-0 rounded-full px-3 py-1.5 text-xs font-bold leading-relaxed transition-colors',
                option.code === language
                  ? 'bg-agro-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {option.nativeName}
            </button>
          ))}
        </div>

        {/* Step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex min-h-[15rem] flex-col items-center text-center sm:min-h-[16rem]"
          >
            <span
              className={cn(
                'mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br text-white shadow-soft-lg',
                step.accent
              )}
            >
              <Icon className="h-10 w-10 stroke-[1.75]" />
            </span>

            <span className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-agro-700">
              {stepIndex + 1} / {TOUR_STEPS.length}
            </span>

            <h3 className="mb-2 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
              {t(step.titleKey, step.defaultTitle)}
            </h3>

            <p className="max-w-prose text-sm leading-relaxed text-slate-600">
              {t(step.descKey, step.defaultDesc)}
            </p>

            {step.href && (
              <Link
                href={step.href}
                onClick={onClose}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-agro-200 bg-agro-50 px-3.5 py-1.5 text-xs font-bold text-agro-800 transition-colors hover:bg-agro-100"
              >
                {t('tourOpen', 'Open')}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </motion.div>
        </AnimatePresence>

        <ProgressDots total={TOUR_STEPS.length} current={stepIndex} />

        {/* Navigation */}
        <div className="flex items-center gap-3">
          {isFirst ? (
            <Button variant="ghost" size="lg" onClick={onClose} className="flex-1">
              {t('skip', 'Skip')}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="lg"
              onClick={goBack}
              icon={<ArrowLeft className="h-4 w-4" />}
              className="flex-1"
            >
              {t('tourBack', 'Back')}
            </Button>
          )}

          <Button
            size="lg"
            onClick={goNext}
            icon={isLast ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            iconPosition="right"
            className="flex-[1.4]"
          >
            {isLast ? t('startExploring', 'Start exploring') : t('next', 'Next')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
