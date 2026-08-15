'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { TOUR_STEPS } from '@/data/tour';

interface TourContextType {
  isActive: boolean;
  stepIndex: number;
  totalSteps: number;
  start: () => void;
  stop: () => void;
  next: () => void;
  back: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

/**
 * Drives the guided walkthrough. State lives above the page so it survives the
 * route changes the tour itself performs — a tour that reset on navigation
 * could not walk the user through more than one screen.
 */
export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [isActive, setIsActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const start = useCallback(() => {
    setStepIndex(0);
    setIsActive(true);
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
    setStepIndex(0);
  }, []);

  const next = useCallback(() => {
    setStepIndex((index) => {
      if (index >= TOUR_STEPS.length - 1) {
        setIsActive(false);
        return 0;
      }
      return index + 1;
    });
  }, []);

  const back = useCallback(() => {
    setStepIndex((index) => Math.max(index - 1, 0));
  }, []);

  // Move to the screen the current step lives on.
  useEffect(() => {
    if (!isActive) return;

    const target = TOUR_STEPS[stepIndex]?.route;
    if (target && pathname !== target) {
      router.push(target);
    }
  }, [isActive, stepIndex, pathname, router]);

  // The scanner and the onboarding flow take over the whole screen; a tour
  // overlay on top of them would trap the user.
  useEffect(() => {
    if (isActive && (pathname === '/scan' || pathname === '/language')) {
      // Reacting to the router's pathname, which is external state React
      // cannot derive during render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsActive(false);
    }
  }, [isActive, pathname]);

  const value = useMemo(
    () => ({
      isActive,
      stepIndex,
      totalSteps: TOUR_STEPS.length,
      start,
      stop,
      next,
      back,
    }),
    [isActive, stepIndex, start, stop, next, back]
  );

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};
