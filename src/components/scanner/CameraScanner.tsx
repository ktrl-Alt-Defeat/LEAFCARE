'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Zap, ZapOff } from 'lucide-react';
import { useCropScanner } from '@/hooks/useCropScanner';
import { useLeafDetection } from '@/hooks/useLeafDetection';
import { SmartGuidanceOverlay } from './SmartGuidanceOverlay';
import { ScanControls } from './ScanControls';
import { ScanAnalysisAnimation } from './ScanAnalysisAnimation';
import { ScanOutcomeNotice, ScanOutcome } from './ScanOutcomeNotice';
import { useAppState } from '@/context/AppStateContext';
import { useLanguage } from '@/context/LanguageContext';
import { Disease } from '@/types';

/** Torch is not in the standard DOM typings, though most mobile browsers expose it. */
type TorchCapabilities = MediaTrackCapabilities & { torch?: boolean };
type TorchConstraint = MediaTrackConstraintSet & { torch?: boolean };

/** Flattened result from `/api/scan`. */
interface ScanAnalysis {
  verdict: 'diagnosed' | 'unsupported_plant' | 'uncertain' | 'unavailable';
  leafDetection: { status?: string; leafCount?: number; cropped?: boolean } | null;
  plant: { name?: string; scientificName?: string; confidence?: number } | null;
  crop: { id: string; name: string; supported: boolean };
  healthy: boolean;
  disease: { name: string; confidence: number } | null;
  confidence: number;
  message?: string;
  detail?: string;
}

/** A scan that produced no diagnosis, and what to tell the farmer about it. */
interface ScanNotice {
  outcome: ScanOutcome;
  message: string;
  detail?: string;
}

const DISCLAIMER =
  'Guidance is advisory. Confirm with your local agricultural officer before applying chemicals.';

/**
 * Shown when the model names a disease the crop's library has no entry for —
 * the farmer still sees the identification and its confidence, with the
 * guidance sections empty rather than filled with another disease's advice.
 */
const EMPTY_DISEASE: Disease = {
  id: '',
  cropId: '',
  cropName: '',
  name: '',
  scientificName: '',
  translatedNames: { en: '', ta: '', hi: '', te: '', ml: '', kn: '' },
  confidence: 0,
  severity: 'moderate',
  imageUrl: '',
  overview: '',
  symptoms: [],
  causes: [],
  favorableConditions: [],
  immediateSteps: [],
  organicTreatment: [],
  chemicalTreatment: [],
  preventionTips: [],
  disclaimer: DISCLAIMER,
};

/**
 * The result for a leaf the classifier found nothing wrong with.
 *
 * A healthy verdict is an answer in its own right, so it gets its own card
 * rather than an empty disease entry with a blank name.
 */
const healthyResult = (cropName: string, confidence: number): Disease => ({
  ...EMPTY_DISEASE,
  name: 'Healthy',
  translatedNames: {
    en: 'Healthy',
    ta: 'ஆரோக்கியமானது',
    hi: 'स्वस्थ',
    te: 'ఆరోగ్యకరమైనది',
    ml: 'ആരോഗ്യകരം',
    kn: 'ಆರೋಗ್ಯಕರ',
  },
  cropName,
  confidence: Math.round(confidence * 100),
  severity: 'low',
  overview: `No disease was found on this ${cropName || 'crop'} leaf. Keep monitoring, and scan again if new spots, yellowing or wilting appear.`,
  preventionTips: [
    'Keep scouting the field weekly, checking the underside of lower leaves first.',
    'Water at the base rather than over the canopy so foliage stays dry.',
    'Remove and destroy fallen leaves and crop debris between seasons.',
  ],
  disclaimer: DISCLAIMER,
});

/** Words that carry no diagnostic meaning when comparing two disease names. */
const NOISE_TOKENS = new Set(['disease', 'virus_', 'and', 'the', 'of']);

const simplify = (value: string): string => value.toLowerCase().replace(/[^a-z]/g, '');

/** Splits a disease name into comparable words, dropping the crop it names. */
const tokenise = (value: string, cropName: string): Set<string> => {
  const cropWords = new Set(
    cropName
      .toLowerCase()
      .split(/[^a-z]+/)
      .filter(Boolean),
  );

  return new Set(
    value
      .toLowerCase()
      .split(/[^a-z]+/)
      .filter((word) => word.length > 1 && !cropWords.has(word) && !NOISE_TOKENS.has(word)),
  );
};

/**
 * Links a model label such as "Cercospora Leaf Spot Gray Leaf Spot" to the
 * library entry for the same disease, whose name may carry the crop and a
 * different wording ("Corn Gray Leaf Spot").
 *
 * Exact and substring matches are taken first. Failing those, the names are
 * compared word by word: the dataset's labels and the library's names describe
 * the same pathogens with different phrasing often enough that substring
 * matching alone leaves real entries unlinked. The 0.6 floor is what keeps
 * "Early Blight" from matching "Late Blight", which overlap on exactly half
 * their words.
 */
const matchDisease = (predicted: string, cropName: string, library: Disease[]): Disease | null => {
  const target = simplify(predicted);
  if (!target || library.length === 0) return null;

  const direct = library.find((entry) => {
    const name = simplify(entry.name);
    return name === target || name.includes(target) || target.includes(name);
  });
  if (direct) return direct;

  const targetWords = tokenise(predicted, cropName);
  if (targetWords.size === 0) return null;

  let best: { entry: Disease; score: number } | null = null;

  for (const entry of library) {
    const entryWords = tokenise(entry.name, entry.cropName || cropName);
    if (entryWords.size === 0) continue;

    let shared = 0;
    entryWords.forEach((word) => {
      if (targetWords.has(word)) shared += 1;
    });

    const score = shared / Math.min(entryWords.size, targetWords.size);
    if (score >= 0.6 && (!best || score > best.score)) best = { entry, score };
  }

  return best?.entry ?? null;
};

/** Loads the disease library for the crop the model actually identified. */
const fetchCropDiseases = async (cropSlug: string, lang: string): Promise<Disease[]> => {
  if (!cropSlug) return [];

  try {
    const response = await fetch(
      `/api/crops/${encodeURIComponent(cropSlug)}?lang=${encodeURIComponent(lang)}`,
      { cache: 'no-store' },
    );
    if (!response.ok) return [];

    const payload = (await response.json()) as { diseases?: Disease[] };
    return payload.diseases ?? [];
  } catch (cause) {
    console.warn('Could not load the disease library for', cropSlug, cause);
    return [];
  }
};

export const CameraScanner: React.FC = () => {
  const router = useRouter();
  const { addScanResult } = useAppState();
  const { language } = useLanguage();
  const [notice, setNotice] = useState<ScanNotice | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const videoTrackRef = useRef<MediaStreamTrack | null>(null);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [flashOn, setFlashOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [boxRect, setBoxRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  // Live leaf localization, paused once a capture is under way: the frame is
  // frozen from then on and further detections would only compete with the
  // analysis request for bandwidth.
  const [scanning, setScanning] = useState(true);
  const detection = useLeafDetection(videoRef, scanning && !cameraError);

  const { guidanceInfo, currentState, analysisStepIndex, triggerCapture, resetScanner } =
    useCropScanner(detection);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    let cancelled = false;

    const startCamera = async () => {
      setCameraError(null);
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setCameraError(
            window.isSecureContext
              ? 'Camera access is not supported by this browser.'
              : 'The camera needs a secure connection. Open this page over HTTPS (or on localhost) to scan.',
          );
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        // The effect may have been cleaned up while getUserMedia was pending.
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        activeStream = stream;
        const [videoTrack] = stream.getVideoTracks();
        videoTrackRef.current = videoTrack ?? null;

        // Only offer the flash control when this camera actually has a torch.
        const capabilities = videoTrack?.getCapabilities?.() as TorchCapabilities | undefined;
        setTorchSupported(Boolean(capabilities?.torch));
        setFlashOn(false);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } catch (error) {
        console.warn('Camera stream error:', error);
        setCameraError('Camera unavailable. You can upload a photo instead.');
      }
    };

    startCamera();

    return () => {
      cancelled = true;
      videoTrackRef.current = null;
      activeStream?.getTracks().forEach((track) => track.stop());
    };
  }, [facingMode]);

  // Place the detected box over the video. The element is `object-cover`, so
  // the frame is scaled to fill and then centre-cropped; mapping normalised
  // coordinates straight onto the element would drift on any device whose
  // screen and camera disagree on aspect ratio, which is most of them.
  useEffect(() => {
    const video = videoRef.current;
    const box = detection?.best;

    if (!video || !box || detection?.status !== 'detected') {
      setBoxRect(null);
      return;
    }

    const { videoWidth, videoHeight, clientWidth, clientHeight } = video;
    if (!videoWidth || !videoHeight || !clientWidth || !clientHeight) {
      setBoxRect(null);
      return;
    }

    const scale = Math.max(clientWidth / videoWidth, clientHeight / videoHeight);
    const renderedWidth = videoWidth * scale;
    const renderedHeight = videoHeight * scale;
    const offsetX = (clientWidth - renderedWidth) / 2;
    const offsetY = (clientHeight - renderedHeight) / 2;

    const [x1, y1, x2, y2] = box.boxNorm;

    setBoxRect({
      left: offsetX + x1 * renderedWidth,
      top: offsetY + y1 * renderedHeight,
      width: (x2 - x1) * renderedWidth,
      height: (y2 - y1) * renderedHeight,
    });
  }, [detection]);

  /** Drives the hardware torch — previously this only flipped an icon. */
  const toggleTorch = async () => {
    const track = videoTrackRef.current;
    if (!track || !torchSupported) return;

    const next = !flashOn;
    try {
      await track.applyConstraints({ advanced: [{ torch: next } as TorchConstraint] });
      setFlashOn(next);
    } catch (error) {
      console.warn('Torch unavailable on this device:', error);
      setTorchSupported(false);
    }
  };

  const completeScan = useCallback(
    (imageDataUrl: string) => {
      setScanning(false);

      // Inference is started here rather than inside the callback so it runs
      // during the analysis animation instead of after it. The full pipeline is
      // three models deep and can take far longer than the animation.
      const analysis = fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageDataUrl }),
      })
        .then(async (response) => {
          const payload = await response.json();
          if (!response.ok) throw new Error(payload?.error ?? 'Analysis failed.');
          return payload as ScanAnalysis;
        })
        // The library for the identified crop is loaded alongside the result,
        // not for the crop the farmer picked at onboarding: a scan of a potato
        // leaf must not be explained with tomato guidance.
        .then(async (outcome) => ({
          outcome,
          library: await fetchCropDiseases(outcome.crop.id, language),
        }))
        .catch((cause: unknown) => {
          console.warn('Scan analysis failed:', cause);
          setNotice({
            outcome: 'error',
            message:
              cause instanceof Error
                ? cause.message
                : 'Could not analyse this photo. Check your connection and try again.',
          });
          return null;
        });

      triggerCapture(async () => {
        const result = await analysis;
        setScanning(true);

        // No diagnosis means nothing is saved and nothing is navigated to. The
        // scanner stays put and explains itself: three of the four outcomes are
        // the system working correctly, and sending the farmer to an empty
        // diagnosis screen would hide both the reason and the way forward.
        if (!result) {
          resetScanner();
          return;
        }

        if (result.outcome.verdict !== 'diagnosed') {
          setNotice({
            outcome: result.outcome.verdict,
            message:
              result.outcome.message ??
              'No diagnosis could be produced for this photo. Try a closer shot of a single leaf.',
            ...(result.outcome.detail ? { detail: result.outcome.detail } : {}),
          });
          resetScanner();
          return;
        }

        const { outcome, library } = result;
        const cropName = outcome.crop.name || outcome.plant?.name || '';

        // The model supplies the label and confidence; the crop's disease
        // library supplies symptoms and treatment for that label.
        const reference = outcome.disease
          ? matchDisease(outcome.disease.name, cropName, library)
          : null;

        const disease: Disease = outcome.healthy
          ? healthyResult(cropName, outcome.confidence)
          : {
              ...(reference ?? EMPTY_DISEASE),
              name: reference?.name ?? outcome.disease?.name ?? '',
              cropName: reference?.cropName || cropName,
              confidence: Math.round((outcome.disease?.confidence ?? 0) * 100),
            };

        const scan = {
          id: `scan_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cropId: outcome.crop.id,
          cropName,
          disease,
          capturedImageData: imageDataUrl,
        };

        addScanResult(scan);
        router.push(`/diagnosis?id=${scan.id}`);
      });
    },
    [triggerCapture, resetScanner, addScanResult, router, language]
  );

  const handleCapture = () => {
    // Left empty when the frame cannot be grabbed. Substituting a stock photo
    // here would attach someone else's crop to the farmer's own diagnosis.
    let imageDataUrl = '';

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && video.videoWidth) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Compressed — full-quality data URLs quickly exhaust localStorage.
        imageDataUrl = canvas.toDataURL('image/jpeg', 0.7);
      }
    }

    if (!imageDataUrl) {
      setNotice({
        outcome: 'error',
        message: 'The camera frame could not be read. Try again in a moment.',
      });
      return;
    }

    setNotice(null);
    setCapturedImage(imageDataUrl);
    completeScan(imageDataUrl);
  };

  const handleGalleryUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const imageUrl = loadEvent.target?.result;
      if (typeof imageUrl === 'string') {
        setNotice(null);
        setCapturedImage(imageUrl);
        completeScan(imageUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const isAnalyzing = currentState === 'analyzing';
  const leafLocked = guidanceInfo.captureReady && detection?.status === 'detected';

  return (
    <div className="relative flex h-dvh w-full select-none flex-col overflow-hidden bg-slate-950 lg:items-center lg:justify-center lg:gap-5 lg:py-8">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleGalleryUpload}
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Top bar — overlaid on phones, a normal row above the stage on laptops. */}
      <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between bg-gradient-to-b from-slate-950/80 to-transparent p-4 lg:static lg:w-full lg:max-w-[26rem] lg:bg-none lg:p-0">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-900/80 text-white backdrop-blur-md transition-transform active:scale-95"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <span className="rounded-full border border-white/20 bg-slate-900/80 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md">
          Leaf Scanner
        </span>

        {torchSupported ? (
          <button
            onClick={toggleTorch}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-900/80 text-white backdrop-blur-md transition-transform active:scale-95"
            aria-label="Toggle flash"
            aria-pressed={flashOn}
          >
            {flashOn ? (
              <Zap className="h-5 w-5 fill-amber-400 text-amber-400" />
            ) : (
              <ZapOff className="h-5 w-5" />
            )}
          </button>
        ) : (
          // Keeps the title bar balanced when the device has no torch.
          <span className="h-10 w-10" aria-hidden="true" />
        )}
      </div>

      {/* Capture stage. Full bleed on phones; a framed portrait panel on laptops,
          where a stretched full-width video looked distorted and unusable. */}
      <div className="relative flex w-full flex-1 items-center justify-center overflow-hidden bg-slate-950 lg:aspect-[3/4] lg:max-h-[68vh] lg:w-full lg:max-w-[26rem] lg:flex-none lg:rounded-[2rem] lg:border lg:border-white/15 lg:shadow-2xl">
        {cameraError ? (
          <div className="flex max-w-sm flex-col items-center px-6 text-center text-white">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-agro-500/40 bg-agro-900/80 text-4xl">
              🌿
            </div>
            <h2 className="mb-2 text-xl font-black">Camera unavailable</h2>
            <p className="mb-6 text-sm leading-relaxed text-slate-300">{cameraError}</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-2xl bg-agro-600 px-6 py-3 font-bold text-white shadow-soft-lg transition-transform active:scale-95"
            >
              Upload photo instead
            </button>
          </div>
        ) : (
          <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
        )}

        {/* What the detector is actually looking at. Drawn from the model's own
            box, so it tracks the leaf rather than sitting in a fixed frame. */}
        {!cameraError && !isAnalyzing && boxRect && (
          <div
            className="pointer-events-none absolute z-20 rounded-xl border-2 border-agro-400 shadow-[0_0_18px_rgba(74,222,128,0.55)] transition-all duration-200"
            style={{
              left: `${boxRect.left}px`,
              top: `${boxRect.top}px`,
              width: `${boxRect.width}px`,
              height: `${boxRect.height}px`,
            }}
          >
            <span className="absolute -top-6 left-0 rounded-md bg-agro-500 px-1.5 py-0.5 text-[10px] font-black text-slate-950">
              Leaf {Math.round((detection?.best?.confidence ?? 0) * 100)}%
            </span>
          </div>
        )}

        {!cameraError && !isAnalyzing && (
          <>
            <div
              className={`pointer-events-none absolute z-10 aspect-[5/6] w-[74%] max-w-[280px] rounded-3xl border-2 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] transition-colors ${
                leafLocked ? 'border-agro-400/90' : 'border-white/40'
              }`}
            >
              <span className="absolute left-0 top-0 h-8 w-8 rounded-tl-2xl border-l-4 border-t-4 border-agro-400" />
              <span className="absolute right-0 top-0 h-8 w-8 rounded-tr-2xl border-r-4 border-t-4 border-agro-400" />
              <span className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-2xl border-b-4 border-l-4 border-agro-400" />
              <span className="absolute bottom-0 right-0 h-8 w-8 rounded-br-2xl border-b-4 border-r-4 border-agro-400" />

              <span className="absolute inset-x-6 bottom-4 rounded-full bg-slate-900/70 px-3 py-1 text-center text-xs font-bold text-white backdrop-blur-sm">
                {detection?.status === 'detected'
                  ? `${detection.leafCount} leaf${detection.leafCount === 1 ? '' : 'ves'} detected`
                  : 'Position leaf inside frame'}
              </span>
            </div>

            <SmartGuidanceOverlay guidance={guidanceInfo} />
          </>
        )}
      </div>

      {/* No diagnosis — explained over the live camera, so the next attempt is
          one tap away rather than a trip back from an empty diagnosis screen. */}
      {notice && !isAnalyzing && (
        <ScanOutcomeNotice
          outcome={notice.outcome}
          message={notice.message}
          {...(notice.detail ? { detail: notice.detail } : {})}
          onRetake={() => setNotice(null)}
          onUpload={() => {
            setNotice(null);
            fileInputRef.current?.click();
          }}
        />
      )}

      {/* Controls */}
      {!isAnalyzing && (
        <ScanControls
          className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent px-6 pb-8 pt-4 lg:static lg:w-full lg:max-w-[26rem] lg:bg-none lg:p-0"
          onCapture={handleCapture}
          onFlipCamera={() => setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
          onGalleryClick={() => fileInputRef.current?.click()}
          captureReady={guidanceInfo.captureReady}
          disabled={!!cameraError}
        />
      )}

      {isAnalyzing && (
        <ScanAnalysisAnimation
          capturedImage={capturedImage}
          currentStepIndex={analysisStepIndex}
        />
      )}
    </div>
  );
};
