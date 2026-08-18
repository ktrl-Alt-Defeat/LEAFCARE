'use client';

import { useEffect, useRef, useState } from 'react';

export type LeafDetectionStatus = 'detected' | 'no_leaf' | 'not_configured' | 'unavailable';

export interface LeafBox {
  confidence: number;
  /** Corners normalised to 0..1 against the frame: [x1, y1, x2, y2]. */
  boxNorm: [number, number, number, number];
}

export interface LiveDetection {
  status: LeafDetectionStatus;
  leafCount: number;
  topConfidence: number | null;
  best: LeafBox | null;
  latencyMs?: number;
}

/** Longest edge of the frame sent for detection. */
const FRAME_EDGE_PX = 480;

/** JPEG quality for those frames. Detection does not need a clean image. */
const FRAME_QUALITY = 0.6;

/** Idle gap between polls, on top of however long the round trip took. */
const POLL_GAP_MS = 350;

/** Grabs the current video frame as a downscaled JPEG data URL. */
const grabFrame = (video: HTMLVideoElement, canvas: HTMLCanvasElement): string | null => {
  const { videoWidth, videoHeight } = video;
  if (!videoWidth || !videoHeight) return null;

  const scale = Math.min(1, FRAME_EDGE_PX / Math.max(videoWidth, videoHeight));
  canvas.width = Math.round(videoWidth * scale);
  canvas.height = Math.round(videoHeight * scale);

  const context = canvas.getContext('2d');
  if (!context) return null;

  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', FRAME_QUALITY);
};

/**
 * Runs the YOLO11 leaf detector over the live camera feed.
 *
 * Polls one frame at a time — the next request is only scheduled once the
 * previous answer is in — so a slow detector stretches the interval instead of
 * queueing frames the user has already moved past.
 *
 * The detector is advisory throughout. Every failure resolves to `unavailable`
 * and the scanner keeps working with manual framing; a detector outage must
 * never stop a farmer taking a photo.
 */
export const useLeafDetection = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
  enabled: boolean,
): LiveDetection | null => {
  const [detection, setDetection] = useState<LiveDetection | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    if (!canvasRef.current) canvasRef.current = document.createElement('canvas');

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const controller = new AbortController();

    const poll = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Camera not ready yet: look again shortly rather than giving up.
      if (!video || !canvas || video.readyState < 2) {
        if (!cancelled) timer = setTimeout(poll, POLL_GAP_MS);
        return;
      }

      const frame = grabFrame(video, canvas);
      if (!frame) {
        if (!cancelled) timer = setTimeout(poll, POLL_GAP_MS);
        return;
      }

      try {
        const response = await fetch('/api/scan/detect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ frame }),
          signal: controller.signal,
        });
        const payload = (await response.json()) as LiveDetection;
        if (!cancelled) setDetection(payload);
      } catch {
        // Aborts happen on unmount and are not worth reporting.
        if (!cancelled) {
          setDetection({ status: 'unavailable', leafCount: 0, topConfidence: null, best: null });
        }
      }

      if (!cancelled) timer = setTimeout(poll, POLL_GAP_MS);
    };

    void poll();

    return () => {
      cancelled = true;
      controller.abort();
      if (timer) clearTimeout(timer);
    };
  }, [videoRef, enabled]);

  return detection;
};
