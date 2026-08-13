'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Camera, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';

export const DiseaseScanBanner: React.FC = () => {
  const { t } = useLanguage();

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-3xl bg-gradient-to-br from-agro-900 via-agro-800 to-emerald-950 text-white p-6 shadow-soft-lg border border-agro-700/50 relative overflow-hidden"
    >
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-52 h-52 bg-agro-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agro-500/20 border border-agro-400/40 text-agro-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          AI LeafCare Scanner
        </span>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-black tracking-tight text-white mb-2">
        {t('checkCropTitle', 'Check your crop')}
      </h2>

      {/* Subtitle description */}
      <p className="text-emerald-100/90 text-sm leading-relaxed mb-6">
        {t('checkCropDesc', 'Take a clear picture of a leaf or crop to identify possible diseases.')}
      </p>

      {/* Visual Workflow Row */}
      <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-2xl p-3 mb-6 border border-white/10 text-xs text-emerald-200">
        <div className="flex flex-col items-center">
          <Camera className="w-5 h-5 text-emerald-300 mb-1" />
          <span>Camera</span>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-emerald-400/60" />
        <div className="flex flex-col items-center">
          <span className="text-lg">🌿</span>
          <span>Leaf</span>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-emerald-400/60" />
        <div className="flex flex-col items-center">
          <Sparkles className="w-5 h-5 text-amber-300 mb-1" />
          <span>AI Analysis</span>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-emerald-400/60" />
        <div className="flex flex-col items-center">
          <ShieldAlert className="w-5 h-5 text-emerald-300 mb-1" />
          <span>Remedy</span>
        </div>
      </div>

      {/* Large Primary Action Button */}
      <Link href="/scan" className="block">
        <Button
          size="xl"
          fullWidth
          icon={<Camera className="w-6 h-6 stroke-[2.5]" />}
          className="bg-gradient-to-r from-agro-500 via-emerald-500 to-agro-400 hover:from-agro-400 hover:to-emerald-400 text-white font-black text-lg tracking-wide shadow-soft-lg shadow-agro-500/40 ring-2 ring-white/20"
        >
          {t('takePicture', 'Take a Picture')}
        </Button>
      </Link>
    </motion.div>
  );
};
