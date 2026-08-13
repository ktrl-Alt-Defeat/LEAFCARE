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

export const OnboardingCarousel: React.FC<OnboardingCarouselProps> = ({
  onComplete,
  onSkip
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { t } = useLanguage();

  const isLastSlide = currentSlideIndex === ONBOARDING_SLIDES.length - 1;
  const currentSlide = ONBOARDING_SLIDES[currentSlideIndex];

  const handleNext = () => {
    if (isLastSlide) {
      onComplete();
    } else {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-between p-6 bg-white relative overflow-hidden">
      {/* Top Navbar with Skip */}
      <div className="flex items-center justify-between pt-4">
        <span className="text-xs font-bold text-agro-700 uppercase tracking-widest bg-agro-50 px-3 py-1 rounded-full border border-agro-200">
          Step {currentSlideIndex + 1} of {ONBOARDING_SLIDES.length}
        </span>
        <button
          onClick={onSkip}
          className="text-sm font-semibold text-slate-500 hover:text-agro-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          {t('skip', 'Skip')}
        </button>
      </div>

      {/* Main Slide Animated Content */}
      <div className="flex-1 flex flex-col items-center justify-center my-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="flex flex-col items-center text-center max-w-sm px-2"
          >
            {/* Animated Large Illustration Badge Container */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className={`w-40 h-40 rounded-full bg-gradient-to-tr ${currentSlide.color} text-white flex items-center justify-center shadow-soft-lg mb-8 relative`}
            >
              <span className="text-7xl select-none" role="img" aria-label="Illustration">
                {currentSlide.icon}
              </span>
              <span className="absolute -bottom-2 bg-white text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-md border border-slate-100">
                {currentSlide.badge}
              </span>
            </motion.div>

            {/* Slide Title */}
            <h2 className="text-2xl font-extrabold text-slate-900 leading-tight mb-3">
              {t(currentSlide.titleKey, currentSlide.defaultTitle)}
            </h2>

            {/* Slide Description */}
            <p className="text-slate-600 font-normal text-base leading-relaxed">
              {t(currentSlide.descKey, currentSlide.defaultDesc)}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls: Pagination Dots + Next/Get Started Button */}
      <div className="flex flex-col gap-6 pb-6">
        <ProgressDots total={ONBOARDING_SLIDES.length} current={currentSlideIndex} />

        <Button
          size="xl"
          fullWidth
          onClick={handleNext}
          className="shadow-soft-lg"
        >
          {isLastSlide ? t('getStarted', 'Get Started') : t('next', 'Next')}
        </Button>
      </div>
    </div>
  );
};
