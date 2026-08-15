'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Zap, ZapOff } from 'lucide-react';
import { useCropScanner } from '@/hooks/useCropScanner';
import { SmartGuidanceOverlay } from './SmartGuidanceOverlay';
import { ScanControls } from './ScanControls';
import { ScanAnalysisAnimation } from './ScanAnalysisAnimation';
import { useAppState } from '@/context/AppStateContext';
import { useCrop } from '@/hooks/useLeafCareData';
import { Disease } from '@/types';

/** Torch is not in the standard DOM typings, though most mobile browsers expose it. */
type TorchCapabilities = MediaTrackCapabilities & { torch?: boolean };
type TorchConstraint = MediaTrackConstraintSet & { torch?: boolean };

/** Flattened result from `/api/scan`. */
interface ScanAnalysis {
  plant: { name?: string; scientificName?: string; confidence?: number } | null;
  crop: { name: string; supported: boolean };
  disease: { name: string; confidence: number } | null;
  message?: string;
}

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
  disclaimer:
    'Guidance is advisory. Confirm with your local agricultural officer before applying chemicals.',
};

const simplify = (value: string): string => value.toLowerCase().replace(/[^a-z]/g, '');

/**
 * Links a model label such as "Early Blight" to the library entry for the same
 * disease, whose name may carry the crop ("Tomato Early Blight"). Compared on
 * letters alone so spacing and punctuation differences do not block a match.
 */
const matchDisease = (predicted: string, library: Disease[]): Disease | null => {
  const target = simplify(predicted);
  if (!target) return null;

  return (
    library.find((entry) => {
      const name = simplify(entry.name);
      return name === target || name.includes(target) || target.includes(name);
    }) ?? null
  );
};

export const CameraScanner: React.FC = () => {
  const router = useRouter();
  const { selectedCrops, addScanResult } = useAppState();
  const primaryCrop = selectedCrops[0] || 'tomato';
  // Fetched as soon as the scanner opens so the guidance library is ready by
  // the time the model returns a label.
  const { diseases: cropDiseases } = useCrop(primaryCrop);
  const [scanError, setScanError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const videoTrackRef = useRef<MediaStreamTrack | null>(null);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [flashOn, setFlashOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const { guidanceInfo, currentState, analysisStepIndex, triggerCapture } = useCropScanner();

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    let cancelled = false;

    const startCamera = async () => {
      setCameraError(null);
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setCameraError('Camera access is not supported by this browser.');
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
      // Inference is started here rather than inside the callback so it runs
      // during the analysis animation instead of after it. On a cold CPU
      // deployment the model can take far longer than the animation.
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
        .catch((cause: unknown) => {
          console.warn('Scan analysis failed:', cause);
          setScanError(
            cause instanceof Error ? cause.message : 'Could not analyse this photo.'
          );
          return null;
        });

      triggerCapture(async () => {
        const outcome = await analysis;

        // Without a prediction there is nothing honest to show, so no scan is
        // saved; the diagnosis screen explains the empty state.
        if (!outcome?.disease) {
          if (outcome?.message) console.info('Analysis note:', outcome.message);
          router.push('/diagnosis');
          return;
        }

        // The model supplies the label and confidence; the crop's disease
        // library supplies symptoms and treatment for that label.
        const reference = matchDisease(outcome.disease.name, cropDiseases);

        const result = {
          id: `scan_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cropId: primaryCrop,
          cropName: outcome.crop.name || reference?.cropName || '',
          disease: {
            ...(reference ?? EMPTY_DISEASE),
            name: reference?.name ?? outcome.disease.name,
            confidence: Math.round(outcome.disease.confidence * 100),
          },
          capturedImageData: imageDataUrl,
        };

        addScanResult(result);
        router.push(`/diagnosis?id=${result.id}`);
      });
    },
    [triggerCapture, primaryCrop, cropDiseases, addScanResult, router]
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

    setCapturedImage(imageDataUrl || null);
    completeScan(imageDataUrl);
  };

  const handleGalleryUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const imageUrl = loadEvent.target?.result;
      if (typeof imageUrl === 'string') {
        setCapturedImage(imageUrl);
        completeScan(imageUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const isAnalyzing = currentState === 'analyzing';

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

        {!cameraError && !isAnalyzing && (
          <>
            <div className="pointer-events-none absolute z-20 aspect-[5/6] w-[74%] max-w-[280px] rounded-3xl border-2 border-agro-400/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
              <span className="absolute left-0 top-0 h-8 w-8 rounded-tl-2xl border-l-4 border-t-4 border-agro-400" />
              <span className="absolute right-0 top-0 h-8 w-8 rounded-tr-2xl border-r-4 border-t-4 border-agro-400" />
              <span className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-2xl border-b-4 border-l-4 border-agro-400" />
              <span className="absolute bottom-0 right-0 h-8 w-8 rounded-br-2xl border-b-4 border-r-4 border-agro-400" />

              <span className="absolute inset-x-6 bottom-4 rounded-full bg-slate-900/70 px-3 py-1 text-center text-xs font-bold text-white backdrop-blur-sm">
                Position leaf inside frame
              </span>
            </div>

            <SmartGuidanceOverlay guidance={guidanceInfo} />
          </>
        )}
      </div>

      {/* Analysis failure — shown over the live camera so the farmer can simply
          retake the photo rather than being sent to an empty diagnosis. */}
      {scanError && !isAnalyzing && (
        <div
          role="alert"
          className="absolute inset-x-4 top-20 z-40 flex flex-col gap-1 rounded-2xl border border-red-400/40 bg-red-950/90 px-4 py-3 text-white backdrop-blur-md"
        >
          <span className="text-xs font-black">Could not analyse that photo</span>
          <span className="text-[11px] font-medium text-red-200">{scanError}</span>
          <button
            onClick={() => setScanError(null)}
            className="mt-1 self-start rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold transition-colors hover:bg-white/25"
          >
            Try again
          </button>
        </div>
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
