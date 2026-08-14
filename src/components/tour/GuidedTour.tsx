'use client';

import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Globe, X } from 'lucide-react';
import { useTour } from '@/context/TourContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAppState } from '@/context/AppStateContext';
import { SUPPORTED_LANGUAGES } from '@/data/languages';
import { TOUR_STEPS } from '@/data/tour';
import { cn } from '@/lib/utils';

/** Breathing room between the spotlight cut-out and the highlighted element. */
const SPOTLIGHT_PADDING = 10;
const CARD_WIDTH = 360;
const CARD_MIN_HEIGHT = 250;
const VIEWPORT_MARGIN = 16;
/** How long to keep looking for a target that has not rendered yet. */
const TARGET_TIMEOUT_MS = 4000;
/** Largest share of the viewport height a single spotlight may occupy. */
const MAX_SPOTLIGHT_VIEWPORT_RATIO = 0.5;

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** `useLayoutEffect` warns when it runs during server rendering. */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Locates the current step's target, scrolls it into view and keeps its
 * viewport rectangle up to date while the step is showing.
 *
 * Returns `null` once the search gives up, which the caller renders as a
 * centred card — a missing target must never strand the tour.
 */
const useTargetRect = (target: string | undefined, stepId: string) => {
  const [rect, setRect] = useState<Rect | null>(null);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    setRect(null);
    setSettled(false);

    if (!target) {
      setSettled(true);
      return;
    }

    let cancelled = false;
    let frame = 0;
    let measure: (() => void) | null = null;
    const deadline = performance.now() + TARGET_TIMEOUT_MS;
    const selector = `[data-tour="${target}"]`;

    const track = (element: HTMLElement) => {
      measure = () => {
        if (cancelled) return;
        const box = element.getBoundingClientRect();

        // Long targets — a 35-crop grid, a full product listing — would other-
        // wise cut a hole the size of the page, dimming nothing and leaving no
        // room for the card. Clamp to the visible top portion instead, which
        // still reads as "this region", and keeps space for the explanation.
        const top = Math.max(box.top, VIEWPORT_MARGIN);
        const maxHeight = window.innerHeight * MAX_SPOTLIGHT_VIEWPORT_RATIO;
        const height = Math.max(Math.min(box.height - (top - box.top), maxHeight), 0);

        setRect({ top, left: box.left, width: box.width, height });
      };

      measure();

      // Follow the smooth scroll for a moment, then stop. A permanent rAF loop
      // would burn frames for as long as the user reads the step.
      const settleUntil = performance.now() + 700;
      const follow = () => {
        if (cancelled) return;
        measure?.();
        if (performance.now() < settleUntil) frame = requestAnimationFrame(follow);
      };
      frame = requestAnimationFrame(follow);

      // Capture phase: scroll events from nested containers such as the desktop
      // scroll pane do not bubble, but they do capture.
      window.addEventListener('scroll', measure, true);
      window.addEventListener('resize', measure);
    };

    // The route may still be rendering, so poll until the element appears.
    const find = () => {
      if (cancelled) return;

      const element = document.querySelector<HTMLElement>(selector);
      if (element) {
        element.scrollIntoView({
          block: 'center',
          inline: 'nearest',
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        });
        setSettled(true);
        track(element);
        return;
      }

      if (performance.now() > deadline) {
        setSettled(true);
        return;
      }
      frame = requestAnimationFrame(find);
    };

    find();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      if (measure) {
        window.removeEventListener('scroll', measure, true);
        window.removeEventListener('resize', measure);
      }
    };
  }, [target, stepId]);

  return { rect, settled };
};

type CardPosition =
  | { mode: 'sheet' | 'centered'; style?: undefined }
  | { mode: 'anchored'; style: React.CSSProperties };

const computePosition = (rect: Rect | null): CardPosition => {
  // Phones get a bottom sheet: there is no room to float a card beside anything.
  if (window.matchMedia('(max-width: 639px)').matches) return { mode: 'sheet' };
  if (!rect) return { mode: 'centered' };

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const spaceBelow = viewportHeight - (rect.top + rect.height);
  const spaceAbove = rect.top;
  const spaceRight = viewportWidth - (rect.left + rect.width);

  const left = Math.min(
    Math.max(rect.left + rect.width / 2 - CARD_WIDTH / 2, VIEWPORT_MARGIN),
    viewportWidth - CARD_WIDTH - VIEWPORT_MARGIN
  );

  if (spaceBelow >= CARD_MIN_HEIGHT + SPOTLIGHT_PADDING * 2) {
    return {
      mode: 'anchored',
      style: { top: rect.top + rect.height + SPOTLIGHT_PADDING * 2, left, width: CARD_WIDTH },
    };
  }

  if (spaceAbove >= CARD_MIN_HEIGHT + SPOTLIGHT_PADDING * 2) {
    return {
      mode: 'anchored',
      style: {
        top: Math.max(rect.top - CARD_MIN_HEIGHT - SPOTLIGHT_PADDING * 2, VIEWPORT_MARGIN),
        left,
        width: CARD_WIDTH,
      },
    };
  }

  // Tall target: sit beside it on whichever side has more room.
  const sideLeft =
    spaceRight >= CARD_WIDTH + VIEWPORT_MARGIN
      ? rect.left + rect.width + SPOTLIGHT_PADDING * 2
      : Math.max(rect.left - CARD_WIDTH - SPOTLIGHT_PADDING * 2, VIEWPORT_MARGIN);

  return {
    mode: 'anchored',
    style: {
      top: Math.min(
        Math.max(rect.top, VIEWPORT_MARGIN),
        viewportHeight - CARD_MIN_HEIGHT - VIEWPORT_MARGIN
      ),
      left: sideLeft,
      width: CARD_WIDTH,
    },
  };
};

/**
 * Places the card beside the spotlight, clamped inside the viewport.
 *
 * Held in state and recomputed in an effect rather than derived during render:
 * reading `window` while rendering makes the result depend on which render the
 * value happens to land in, which previously left the card centred while the
 * spotlight was correctly anchored.
 */
const useCardPosition = (rect: Rect | null): CardPosition => {
  const [position, setPosition] = useState<CardPosition>({ mode: 'centered' });

  // Layout effect so the card is positioned in the same paint it appears in,
  // rather than flashing centred for a frame first.
  useIsomorphicLayoutEffect(() => {
    const sync = () => setPosition(computePosition(rect));
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [rect]);

  return position;
};

export const GuidedTour: React.FC = () => {
  const { isActive, stepIndex, totalSteps, stop, next, back } = useTour();
  const { t, language } = useLanguage();
  const { setLanguage } = useAppState();

  const step = TOUR_STEPS[stepIndex];
  const { rect, settled } = useTargetRect(isActive ? step?.target : undefined, step?.id ?? '');
  const position = useCardPosition(rect);

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') stop();
      if (event.key === 'ArrowRight') next();
      if (event.key === 'ArrowLeft') back();
    },
    [stop, next, back]
  );

  useEffect(() => {
    if (!isActive) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, handleKeyDown]);

  // The page behind must not scroll independently while the tour drives it.
  useEffect(() => {
    if (!isActive) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isActive]);

  if (!isActive || !step) return null;

  const Icon = step.icon;
  const showSpotlight = Boolean(step.target) && rect !== null;

  const card = (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={cn(
        'pointer-events-auto flex flex-col gap-4 border border-slate-200 bg-white p-5 shadow-2xl',
        position.mode === 'sheet'
          ? 'safe-bottom fixed inset-x-0 bottom-0 rounded-t-3xl'
          : position.mode === 'centered'
          ? 'relative w-full max-w-md rounded-3xl'
          : 'fixed rounded-3xl'
      )}
      style={position.mode === 'anchored' ? position.style : undefined}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-soft-sm',
            step.accent
          )}
        >
          <Icon className="h-5 w-5" />
        </span>

        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-agro-700">
            {stepIndex + 1} / {totalSteps}
          </span>
          <h2 className="text-lg font-black leading-tight tracking-tight text-slate-900">
            {t(step.titleKey, step.defaultTitle)}
          </h2>
        </div>

        <button
          onClick={stop}
          aria-label={t('skip', 'Skip')}
          className="-mr-1 -mt-1 shrink-0 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="text-sm leading-relaxed text-slate-600">
        {t(step.descKey, step.defaultDesc)}
      </p>

      {/* Offered on the opening step, where a first-time user decides what
          language to read the rest of the tour in. */}
      {isFirst && (
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
      )}

      {/* Progress */}
      <div className="flex items-center gap-1" aria-hidden="true">
        {TOUR_STEPS.map((entry, index) => (
          <span
            key={entry.id}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              index <= stepIndex ? 'bg-agro-600' : 'bg-slate-200'
            )}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        {isFirst ? (
          <button
            onClick={stop}
            className="rounded-2xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            {t('skip', 'Skip')}
          </button>
        ) : (
          <button
            onClick={back}
            className="flex items-center gap-1.5 rounded-2xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('tourBack', 'Back')}
          </button>
        )}

        <button
          onClick={next}
          className="ml-auto flex items-center gap-1.5 rounded-2xl bg-agro-600 px-5 py-2.5 text-sm font-bold text-white shadow-soft-sm transition-colors hover:bg-agro-700"
        >
          {isLast ? t('startExploring', 'Start exploring') : t('next', 'Next')}
          {isLast ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
    </motion.div>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('tourHeading', 'Welcome to LeafCare')}
      className="fixed inset-0 z-[60]"
    >
      {/* Backdrop. When a target is spotlit the dimming comes from the ring's
          huge box-shadow, which leaves the element itself visible. */}
      {showSpotlight && rect ? (
        <motion.div
          initial={false}
          animate={{
            top: rect.top - SPOTLIGHT_PADDING,
            left: rect.left - SPOTLIGHT_PADDING,
            width: rect.width + SPOTLIGHT_PADDING * 2,
            height: rect.height + SPOTLIGHT_PADDING * 2,
          }}
          transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          className="pointer-events-auto absolute rounded-2xl ring-2 ring-agro-400"
          style={{ boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.72)' }}
        />
      ) : (
        <div className="pointer-events-auto absolute inset-0 bg-slate-900/70" />
      )}

      {/* Deliberately not wrapped in AnimatePresence: its child would alternate
          between a centring wrapper and the keyed card, and with `mode="wait"`
          that stalls the enter animation, leaving the card at opacity 0.
          The `key` alone gives each step a fresh mount and entrance. */}
      {settled &&
        (position.mode === 'centered' ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
            {card}
          </div>
        ) : (
          card
        ))}
    </div>
  );
};
