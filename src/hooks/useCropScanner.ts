'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { LiveDetection } from './useLeafDetection';

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
    message: 'Center the leaf',
    subtext: 'Bring the affected leaf into the frame',
    arrowDirection: 'center',
    captureReady: false
  },
  holding: {
    message: 'Perfect! Hold phone steady',
    subtext: 'Focusing on leaf symptoms...',
    arrowDirection: 'hold',
    captureReady: true
  },
  ready: {
    message: 'Leaf detected cleanly!',
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
  'Locating the leaf...',
  'Identifying crop species...',
  'Checking disease symptoms...',
  'Matching pathogen database...',
  'Preparing recommended remedies...'
];

const CAPTURE_FREEZE_MS = 600;
const STEP_INTERVAL_MS = 500;
const HANDOFF_DELAY_MS = 400;

/**
 * Fraction of the frame the leaf box must cover before the shot is worth
 * taking. Below this the leaf is too small for the classifier to read texture
 * off, which is what "move closer" is actually asking for.
 */
const MIN_LEAF_AREA = 0.1;

/** How far the leaf centre may sit from the frame centre before it is nudged. */
const CENTRE_TOLERANCE = 0.22;

/** Detection score below which the box is treated as a maybe, not a leaf. */
const MIN_BOX_CONFIDENCE = 0.45;

/** Guidance derived from one detection: which state, and where to point. */
interface DerivedGuidance {
  state: ScannerState;
  arrowDirection: ScannerGuidance['arrowDirection'];
  message?: string;
  subtext?: string;
}

/**
 * Turns a detector answer into framing advice.
 *
 * When the detector is unreachable or was never configured, framing falls back
 * to "point at a leaf" with capture enabled: the guidance is a help, and a
 * farmer must never be locked out of taking a photo because a model is down.
 */
const deriveGuidance = (detection: LiveDetection | null): DerivedGuidance => {
  if (!detection) return { state: 'initializing', arrowDirection: 'none' };

  if (detection.status === 'not_configured' || detection.status === 'unavailable') {
    return {
      state: 'ready',
      arrowDirection: 'none',
      message: 'Frame one leaf and capture',
      subtext: 'Live leaf detection is unavailable right now',
    };
  }

  const box = detection.best;
  if (detection.status !== 'detected' || !box || box.confidence < MIN_BOX_CONFIDENCE) {
    return { state: 'pointing', arrowDirection: 'center' };
  }

  const [x1, y1, x2, y2] = box.boxNorm;
  const area = Math.abs((x2 - x1) * (y2 - y1));
  const centreX = (x1 + x2) / 2;
  const centreY = (y1 + y2) / 2;
  const offsetX = centreX - 0.5;
  const offsetY = centreY - 0.5;

  // Off-centre is corrected before distance: moving closer to a leaf that is
  // half out of frame just pushes more of it out.
  if (Math.abs(offsetX) > CENTRE_TOLERANCE || Math.abs(offsetY) > CENTRE_TOLERANCE) {
    const horizontal = Math.abs(offsetX) >= Math.abs(offsetY);
    return {
      state: 'centering',
      // The leaf sits right of centre, so the camera moves right to catch it.
      arrowDirection: horizontal ? (offsetX > 0 ? 'right' : 'left') : offsetY > 0 ? 'down' : 'up',
      message: horizontal
        ? `Move camera ${offsetX > 0 ? 'right' : 'left'}`
        : `Move camera ${offsetY > 0 ? 'down' : 'up'}`,
      subtext: 'Center the affected leaf surface',
    };
  }

  if (area < MIN_LEAF_AREA) {
    return {
      state: 'closer',
      arrowDirection: 'down',
      subtext: `Leaf fills ${Math.round(area * 100)}% of the frame — get closer`,
    };
  }

  if (detection.leafCount > 1) {
    return {
      state: 'holding',
      arrowDirection: 'hold',
      message: `${detection.leafCount} leaves in frame`,
      subtext: 'Isolate one leaf for the sharpest diagnosis, or capture now',
    };
  }

  return {
    state: 'ready',
    arrowDirection: 'none',
    subtext: `Leaf detected at ${Math.round(box.confidence * 100)}% — tap to analyze`,
  };
};

/**
 * Drives the scanner's framing guidance and the post-capture animation.
 *
 * Framing comes from the YOLO11 detector via `detection`; nothing here is
 * simulated. Pass `null` before the first answer arrives.
 */
export const useCropScanner = (detection: LiveDetection | null = null) => {
  const [captureState, setCaptureState] = useState<'framing' | 'capturing' | 'analyzing'>('framing');
  const [analysisStepIndex, setAnalysisStepIndex] = useState<number>(0);

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
      setCaptureState('capturing');

      freezeTimerRef.current = setTimeout(() => {
        setCaptureState('analyzing');
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
    setCaptureState('framing');
    setAnalysisStepIndex(0);
  }, [clearAnalysisTimers]);

  const framing = deriveGuidance(detection);
  const currentState: ScannerState =
    captureState === 'framing' ? framing.state : captureState;

  const defaults = GUIDANCE_STEPS[currentState];

  const guidanceInfo: ScannerGuidance = {
    state: currentState,
    message: (captureState === 'framing' && framing.message) || defaults.message,
    subtext: (captureState === 'framing' && framing.subtext) || defaults.subtext,
    arrowDirection:
      captureState === 'framing' ? framing.arrowDirection : defaults.arrowDirection,
    captureReady: defaults.captureReady,
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
