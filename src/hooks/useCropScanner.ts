'use client';

import { useState, useEffect, useRef } from 'react';

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

export const useCropScanner = () => {
  const [currentState, setCurrentState] = useState<ScannerState>('pointing');
  const [analysisStepIndex, setAnalysisStepIndex] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-progress simulated CV guidance state when camera is open
  useEffect(() => {
    if (currentState === 'capturing' || currentState === 'analyzing' || currentState === 'initializing') {
      return;
    }

    const steps: ScannerState[] = ['pointing', 'closer', 'centering', 'holding', 'ready'];
    let idx = steps.indexOf(currentState);

    if (idx >= 0 && idx < steps.length - 1) {
      const duration = idx === 3 ? 1400 : 1800; // Hold steady state slightly shorter
      timerRef.current = setTimeout(() => {
        setCurrentState(steps[idx + 1]);
      }, duration);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentState]);

  const triggerCapture = (onComplete: () => void) => {
    setCurrentState('capturing');
    
    // Simulate capture frame freeze -> AI analysis sequence
    setTimeout(() => {
      setCurrentState('analyzing');
      setAnalysisStepIndex(0);

      // Cycle through 5 AI analysis steps over 2.5s
      const interval = setInterval(() => {
        setAnalysisStepIndex((prev) => {
          if (prev < ANALYSIS_STEPS.length - 1) {
            return prev + 1;
          }
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 400);
          return prev;
        });
      }, 500);

    }, 600);
  };

  const resetScanner = () => {
    setCurrentState('pointing');
    setAnalysisStepIndex(0);
  };

  const guidanceInfo: ScannerGuidance = {
    state: currentState,
    ...GUIDANCE_STEPS[currentState],
    progressPercentage: currentState === 'analyzing' 
      ? Math.round(((analysisStepIndex + 1) / ANALYSIS_STEPS.length) * 100)
      : currentState === 'ready' ? 100 : 60
  };

  return {
    guidanceInfo,
    currentState,
    analysisStepIndex,
    currentAnalysisText: ANALYSIS_STEPS[analysisStepIndex] || ANALYSIS_STEPS[0],
    triggerCapture,
    resetScanner,
    setScannerState: setCurrentState
  };
};
