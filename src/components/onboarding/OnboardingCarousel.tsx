'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ONBOARDING_SLIDES } from '@/data/onboarding';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';

export interface OnboardingCarouselProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingCarousel: React.FC<OnboardingCarouselProps> = ({ onComplete, onSkip }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { t } = useLanguage();

  const isLastSlide = currentSlideIndex === ONBOARDING_SLIDES.length - 1;
  const currentSlide = ONBOARDING_SLIDES[currentSlideIndex];

  const handleNext = () => {
    if (isLastSlide) onComplete();
    else setCurrentSlideIndex((prev) => prev + 1);
  };

  return (
    <div className="onboarding-stage">
      <div className="flex items-center justify-between pt-4 lg:pt-0">
        <span className="rounded-full border border-agro-200 bg-agro-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-agro-700">
          Step {currentSlideIndex + 1} of {ONBOARDING_SLIDES.length}
        </span>
        <button
          onClick={onSkip}
          className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-agro-700"
        >
          {t('skip', 'Skip')}
        </button>
      </div>

      <div className="my-6 flex flex-1 flex-col items-center justify-center lg:my-0 lg:flex-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex max-w-sm flex-col items-center px-2 text-center"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              // Smaller on short laptop screens so the CTA stays above the fold.
              className={`relative mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-tr text-white shadow-soft-lg h-sm:h-40 h-sm:w-40 ${currentSlide.color}`}
            >
              <span className="select-none text-6xl h-sm:text-7xl" role="img" aria-hidden="true">
                {currentSlide.icon}
              </span>
              <span className="absolute -bottom-2 rounded-full border border-slate-100 bg-white px-3 py-1 text-xs font-bold text-slate-800 shadow-md">
                {currentSlide.badge}
              </span>
            </motion.div>

            <h2 className="mb-3 text-2xl font-extrabold leading-tight text-slate-900">
              {t(currentSlide.titleKey, currentSlide.defaultTitle)}
            </h2>

            <p className="text-base leading-relaxed text-slate-600">
              {t(currentSlide.descKey, currentSlide.defaultDesc)}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-6 pb-6 lg:pb-0">
        <ProgressDots total={ONBOARDING_SLIDES.length} current={currentSlideIndex} />

        <Button size="xl" fullWidth onClick={handleNext} className="shadow-soft-lg">
          {isLastSlide ? t('getStarted', 'Get Started') : t('next', 'Next')}
        </Button>
      </div>
    </div>
  );
};
