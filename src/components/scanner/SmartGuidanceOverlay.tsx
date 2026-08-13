'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Move, Hand, CheckCircle2 } from 'lucide-react';
import { ScannerGuidance } from '@/hooks/useCropScanner';

export interface SmartGuidanceOverlayProps {
  guidance: ScannerGuidance;
}

export const SmartGuidanceOverlay: React.FC<SmartGuidanceOverlayProps> = ({ guidance }) => {
  const getDirectionIcon = () => {
    switch (guidance.arrowDirection) {
      case 'left': return <ArrowLeft className="w-8 h-8 text-amber-400 animate-bounce" />;
      case 'right': return <ArrowRight className="w-8 h-8 text-amber-400 animate-bounce" />;
      case 'up': return <ArrowUp className="w-8 h-8 text-amber-400 animate-bounce" />;
      case 'down': return <ArrowDown className="w-8 h-8 text-amber-400 animate-bounce" />;
      case 'center': return <Move className="w-8 h-8 text-amber-400 animate-pulse" />;
      case 'hold': return <Hand className="w-8 h-8 text-agro-400 animate-pulse" />;
      default: return <CheckCircle2 className="w-8 h-8 text-agro-400" />;
    }
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 top-16 z-30 flex flex-col items-center px-4 lg:top-5">
      {/* Guidance Message Box */}
      <motion.div
        key={guidance.state}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-5 py-3 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-white shadow-2xl"
      >
        <div className="flex items-center justify-center">
          {getDirectionIcon()}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black tracking-wide text-white leading-tight">
            {guidance.message}
          </span>
          <span className="text-xs text-slate-300 font-medium">
            {guidance.subtext}
          </span>
        </div>
      </motion.div>
    </div>
  );
};
