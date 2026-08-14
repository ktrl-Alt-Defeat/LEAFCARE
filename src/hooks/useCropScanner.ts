'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type ScannerState =
  | 'initializing'
  | 'pointing'
  | 'closer'
  | 'centering'
  | 'holding'
  | 'ready'
  | 'capturing'
  | 'analyzing';

export interface ScannerGuidance {
  state: ScannerState;
  message: string;
  subtext: string;
  arrowDirection: 'none' | 'left' | 'right' | 'up' | 'down' | 'center' | 'hold';
  progressPercentage: number;
  captureReady: boolean;
}

export const GUIDANCE_STEPS: Record<ScannerState, Omit<ScannerGuidance, 'state' | 'progressPercentage'>> = {
  initializing: {
    message: 'Starting crop camera...',
    subtext: 'Please allow camera access',
    arrowDirection: 'none',
    captureReady: false
  },
  pointing: {
    message: 'Point camera at leaf or crop',
    subtext: 'Align leaf inside the green box',
    arrowDirection: 'center',
    captureReady: false
  },
  closer: {
    message: 'Move slightly closer',
    subtext: 'Ensure leaf veins are visible',
    arrowDirection: 'down',
    captureReady: false
  },
  centering: {
    message: 'Move camera left',
    subtext: 'Center the affected leaf surface',
    arrowDirection: 'left',
    captureReady: false
  },
  holding: {
    message: 'Perfect! Hold phone steady',
    subtext: 'Focusing on leaf symptoms...',
    arrowDirection: 'hold',
    captureReady: true
  },
  ready: {
    message: 'Crop detected cleanly!',
    subtext: 'Tap capture button to analyze',
    arrowDirection: 'none',
    captureReady: true
  },
  capturing: {
    message: 'Capturing photo...',
    subtext: 'Freezing image frame',
    arrowDirection: 'none',
    captureReady: false
  },
  analyzing: {
    message: 'Analyzing crop health...',
    subtext: 'Checking disease symptoms',
    arrowDirection: 'none',
    captureReady: false
  }
};

export const ANALYSIS_STEPS = [
  'Analyzing leaf texture...',
  'Identifying crop species...',
  'Checking disease symptoms...',
  'Matching pathogen database...',
  'Preparing recommended remedies...'
];

const CAPTURE_FREEZE_MS = 600;
const STEP_INTERVAL_MS = 500;
const HANDOFF_DELAY_MS = 400;

export const useCropScanner = () => {
  const [currentState, setCurrentState] = useState<ScannerState>('pointing');
  const [analysisStepIndex, setAnalysisStepIndex] = useState<number>(0);

  const guidanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const freezeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handoffTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  /** Blocks a second capture while one is already running. */
  const isCapturingRef = useRef(false);

  const clearAnalysisTimers = useCallback(() => {
    if (freezeTimerRef.current) clearTimeout(freezeTimerRef.current);
    if (handoffTimerRef.current) clearTimeout(handoffTimerRef.current);
    if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
    freezeTimerRef.current = null;
    handoffTimerRef.current = null;
    stepIntervalRef.current = null;
  }, []);

  // Auto-progress the simulated computer-vision guidance while framing.
  useEffect(() => {
    if (currentState === 'capturing' || currentState === 'analyzing' || currentState === 'initializing') {
      return;
    }

    const steps: ScannerState[] = ['pointing', 'closer', 'centering', 'holding', 'ready'];
    const index = steps.indexOf(currentState);

    if (index >= 0 && index < steps.length - 1) {
      const duration = index === 3 ? 1400 : 1800; // Hold-steady state is shorter.
      guidanceTimerRef.current = setTimeout(() => setCurrentState(steps[index + 1]), duration);
    }

    return () => {
      if (guidanceTimerRef.current) clearTimeout(guidanceTimerRef.current);
    };
  }, [currentState]);

  // Leaving the scanner mid-analysis must not fire the completion callback,
  // which would navigate away and save a scan the user abandoned.
  useEffect(() => {
    return () => {
      isCapturingRef.current = false;
      clearAnalysisTimers();
    };
  }, [clearAnalysisTimers]);

  const triggerCapture = useCallback(
    (onComplete: () => void) => {
      if (isCapturingRef.current) return;
      isCapturingRef.current = true;

      clearAnalysisTimers();
      setCurrentState('capturing');

      freezeTimerRef.current = setTimeout(() => {
        setCurrentState('analyzing');
        setAnalysisStepIndex(0);

        // The step counter is tracked outside React state so that finishing the
        // sequence never depends on side effects inside a state updater — those
        // can run more than once and would complete the scan twice.
        let step = 0;

        stepIntervalRef.current = setInterval(() => {
          step += 1;

          if (step < ANALYSIS_STEPS.length) {
            setAnalysisStepIndex(step);
            return;
          }

          if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
          stepIntervalRef.current = null;

          handoffTimerRef.current = setTimeout(() => {
            isCapturingRef.current = false;
            onComplete();
          }, HANDOFF_DELAY_MS);
        }, STEP_INTERVAL_MS);
      }, CAPTURE_FREEZE_MS);
    },
    [clearAnalysisTimers]
  );

  const resetScanner = useCallback(() => {
    clearAnalysisTimers();
    isCapturingRef.current = false;
    setCurrentState('pointing');
    setAnalysisStepIndex(0);
  }, [clearAnalysisTimers]);

  const guidanceInfo: ScannerGuidance = {
    state: currentState,
    ...GUIDANCE_STEPS[currentState],
    progressPercentage:
      currentState === 'analyzing'
        ? Math.round(((analysisStepIndex + 1) / ANALYSIS_STEPS.length) * 100)
        : currentState === 'ready'
        ? 100
        : 60
  };

  return {
    guidanceInfo,
    currentState,
    analysisStepIndex,
    triggerCapture,
    resetScanner
  };
};
