'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ScanControlsProps {
  onCapture: () => void;
  onFlipCamera: () => void;
  onGalleryClick: () => void;
  captureReady: boolean;
  disabled?: boolean;
  className?: string;
}

export const ScanControls: React.FC<ScanControlsProps> = ({
  onCapture,
  onFlipCamera,
  onGalleryClick,
  captureReady,
  disabled = false,
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="mb-6 rounded-full border border-white/10 bg-slate-900/90 px-4 py-1.5 text-[11px] font-medium text-emerald-300 shadow-lg backdrop-blur-md">
        💡 Use natural light &amp; capture one leaf at a time
      </div>

      <div className="flex w-full max-w-xs items-center justify-between">
        <button
          onClick={onGalleryClick}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-slate-800/80 text-white shadow-lg backdrop-blur-md transition-all hover:bg-slate-700 active:scale-95"
          title="Choose from gallery"
          aria-label="Choose from gallery"
        >
          <ImageIcon className="h-5 w-5" />
        </button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onCapture}
          disabled={disabled}
          className={cn(
            'relative flex h-20 w-20 items-center justify-center rounded-full p-1.5 transition-transform disabled:opacity-50',
            captureReady
              ? 'scale-105 ring-4 ring-agro-400 ring-offset-4 ring-offset-slate-950'
              : 'ring-4 ring-white/50'
          )}
          aria-label="Capture leaf photo"
        >
          <span className="flex h-full w-full items-center justify-center rounded-full bg-white p-1.5 shadow-2xl">
            <span
              className={cn(
                'h-full w-full rounded-full bg-agro-600 transition-colors',
                captureReady && 'animate-pulse'
              )}
            />
          </span>
        </motion.button>

        <button
          onClick={onFlipCamera}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-slate-800/80 text-white shadow-lg backdrop-blur-md transition-all hover:bg-slate-700 active:scale-95"
          title="Switch camera"
          aria-label="Switch camera"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
