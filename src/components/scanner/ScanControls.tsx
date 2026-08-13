'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, RefreshCw, Zap, ZapOff } from 'lucide-react';

export interface ScanControlsProps {
  onCapture: () => void;
  onFlipCamera: () => void;
  onGalleryClick: () => void;
  onToggleFlash: () => void;
  flashOn: boolean;
  captureReady: boolean;
  disabled?: boolean;
}

export const ScanControls: React.FC<ScanControlsProps> = ({
  onCapture,
  onFlipCamera,
  onGalleryClick,
  onToggleFlash,
  flashOn,
  captureReady,
  disabled = false
}) => {
  return (
    <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center pb-8 pt-4 px-6 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
      {/* Rotational Quality Hint Banner */}
      <div className="mb-6 bg-slate-900/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-[11px] font-medium text-emerald-300 shadow-lg">
        💡 Use natural light & capture one leaf at a time
      </div>

      {/* Main Control Bar */}
      <div className="flex items-center justify-between w-full max-w-xs">
        {/* Gallery Upload Fallback Button */}
        <button
          onClick={onGalleryClick}
          className="w-12 h-12 rounded-full bg-slate-800/80 backdrop-blur-md text-white flex items-center justify-center border border-white/20 hover:bg-slate-700 active:scale-95 transition-all shadow-lg"
          title="Choose from Gallery"
          aria-label="Choose from gallery"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        {/* Large Circular Capture Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onCapture}
          disabled={disabled}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center p-1.5 transition-transform ${
            captureReady
              ? 'ring-4 ring-agro-400 ring-offset-4 ring-offset-slate-950 scale-105'
              : 'ring-4 ring-white/50'
          }`}
          aria-label="Capture leaf photo"
        >
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-1.5 shadow-2xl">
            <div className={`w-full h-full rounded-full transition-colors ${
              captureReady ? 'bg-agro-600 animate-pulse' : 'bg-agro-600'
            }`} />
          </div>
        </motion.button>

        {/* Camera Flip Button */}
        <button
          onClick={onFlipCamera}
          className="w-12 h-12 rounded-full bg-slate-800/80 backdrop-blur-md text-white flex items-center justify-center border border-white/20 hover:bg-slate-700 active:scale-95 transition-all shadow-lg"
          title="Switch Camera"
          aria-label="Switch camera"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
