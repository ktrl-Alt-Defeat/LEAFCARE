'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Zap, ZapOff } from 'lucide-react';
import { useCropScanner } from '@/hooks/useCropScanner';
import { SmartGuidanceOverlay } from './SmartGuidanceOverlay';
import { ScanControls } from './ScanControls';
import { ScanAnalysisAnimation } from './ScanAnalysisAnimation';
import { useAppState } from '@/context/AppStateContext';
import { MOCK_DISEASES } from '@/data/diseases';

export const CameraScanner: React.FC = () => {
  const router = useRouter();
  const { selectedCrops, addScanResult } = useAppState();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [flashOn, setFlashOn] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const {
    guidanceInfo,
    currentState,
    analysisStepIndex,
    triggerCapture,
    setScannerState
  } = useCropScanner();

  // Start HTML5 Camera Stream
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const startCamera = async () => {
      setCameraError(null);
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setCameraError('Camera access is not supported on this browser device.');
          return;
        }

        const newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });

        currentStream = newStream;
        setStream(newStream);

        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          videoRef.current.play();
        }
      } catch (err: unknown) {
        console.warn('Camera stream error:', err);
        setCameraError('Camera stream unavailable. You can upload a photo from your gallery.');
      }
    };

    startCamera();

    // Clean up tracks on unmount
    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  // Capture image frame onto canvas
  const handleCapture = () => {
    let imageDataUrl = 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a63?q=80&w=800&auto=format&fit=crop';

    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        imageDataUrl = canvas.toDataURL('image/jpeg');
      }
    }

    setCapturedImage(imageDataUrl);

    // Run simulated AI analysis sequence
    triggerCapture(() => {
      // Pick disease based on primary selected crop or default
      const primaryCrop = selectedCrops[0] || 'tomato';
      const diseaseData = MOCK_DISEASES[primaryCrop] || MOCK_DISEASES.tomato;

      const result = {
        id: `scan_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cropId: primaryCrop,
        cropName: diseaseData.cropName,
        disease: diseaseData,
        capturedImageData: imageDataUrl
      };

      addScanResult(result);
      router.push(`/diagnosis?id=${result.id}`);
    });
  };

  // Flip rear / front camera
  const handleFlipCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  // Gallery Image Upload Fallback
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const imgUrl = event.target.result as string;
          setCapturedImage(imgUrl);
          triggerCapture(() => {
            const primaryCrop = selectedCrops[0] || 'tomato';
            const diseaseData = MOCK_DISEASES[primaryCrop] || MOCK_DISEASES.tomato;
            const result = {
              id: `scan_${Date.now()}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              cropId: primaryCrop,
              cropName: diseaseData.cropName,
              disease: diseaseData,
              capturedImageData: imgUrl
            };
            addScanResult(result);
            router.push(`/diagnosis?id=${result.id}`);
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col justify-between select-none">
      {/* Hidden File Input & Canvas */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleGalleryUpload}
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Header Bar */}
      <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between p-4 bg-gradient-to-b from-slate-950/80 to-transparent">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-md text-white flex items-center justify-center border border-white/20 active:scale-95"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="text-xs font-bold text-white uppercase tracking-widest bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
          Leaf Scanner
        </span>

        <button
          onClick={() => setFlashOn(!flashOn)}
          className="w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-md text-white flex items-center justify-center border border-white/20 active:scale-95"
          aria-label="Toggle Flash"
        >
          {flashOn ? <Zap className="w-5 h-5 text-amber-400 fill-amber-400" /> : <ZapOff className="w-5 h-5" />}
        </button>
      </div>

      {/* Camera Video Viewport or Error Fallback */}
      <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
        {cameraError ? (
          <div className="flex flex-col items-center text-center px-6 max-w-sm text-white">
            <div className="w-20 h-20 rounded-full bg-agro-900/80 border border-agro-500/40 flex items-center justify-center text-4xl mb-4">
              🌿
            </div>
            <h3 className="text-xl font-black mb-2">Camera Unavailable</h3>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              {cameraError}
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 rounded-2xl bg-agro-600 font-bold text-white shadow-soft-lg active:scale-95"
            >
              Upload Photo from Gallery
            </button>
          </div>
        ) : (
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}

        {/* Center Rectangular Scan Frame */}
        {!cameraError && currentState !== 'analyzing' && (
          <div className="absolute w-[280px] h-[340px] border-2 border-agro-400/90 rounded-3xl pointer-events-none z-20 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-agro-400 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-agro-400 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-agro-400 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-agro-400 rounded-br-2xl" />
            
            <span className="absolute bottom-4 left-0 right-0 text-center text-xs font-bold text-white bg-slate-900/70 backdrop-blur-sm py-1 px-3 mx-6 rounded-full">
              Position leaf inside frame
            </span>
          </div>
        )}
      </div>

      {/* Smart Computer Vision Guidance Overlay */}
      {!cameraError && currentState !== 'analyzing' && (
        <SmartGuidanceOverlay guidance={guidanceInfo} />
      )}

      {/* Camera Controls */}
      {currentState !== 'analyzing' && (
        <ScanControls
          onCapture={handleCapture}
          onFlipCamera={handleFlipCamera}
          onGalleryClick={() => fileInputRef.current?.click()}
          onToggleFlash={() => setFlashOn(!flashOn)}
          flashOn={flashOn}
          captureReady={guidanceInfo.captureReady}
        />
      )}

      {/* AI Scanning & Analysis Sequence Overlay */}
      {currentState === 'analyzing' && (
        <ScanAnalysisAnimation
          capturedImage={capturedImage}
          currentStepIndex={analysisStepIndex}
        />
      )}
    </div>
  );
};
