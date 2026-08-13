'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';

export interface PermissionCardProps {
  type: 'location' | 'camera' | 'microphone' | 'notifications';
  onAllow: () => void;
  onSkip: () => void;
  loading?: boolean;
}

export const PERMISSION_CONFIG = {
  location: {
    icon: '🗺️',
    titleKey: 'allowLocation',
    defaultTitle: 'Allow Location Access',
    descKey: 'locationDesc',
    defaultDesc: 'Get local weather forecasts, spraying conditions, and regional crop disease alerts.',
    color: 'from-amber-400 to-orange-500',
    allowText: 'Allow Location',
  },
  camera: {
    icon: '📸',
    titleKey: 'checkCrops',
    defaultTitle: "Let's Check Your Crops",
    descKey: 'cameraDesc',
    defaultDesc: 'Use your camera to capture clear leaf pictures for instant AI disease identification.',
    color: 'from-agro-500 to-emerald-600',
    allowText: 'Allow Camera',
  },
  microphone: {
    icon: '🎙️',
    titleKey: 'talkToAssistant',
    defaultTitle: 'Talk to Farming Assistant',
    descKey: 'micDesc',
    defaultDesc: 'Use your voice to ask questions and receive instant farming advice in your native language.',
    color: 'from-sky-500 to-blue-600',
    allowText: 'Allow Microphone',
  },
  notifications: {
    icon: '🔔',
    titleKey: 'stayInformed',
    defaultTitle: 'Stay Informed',
    descKey: 'notifDesc',
    defaultDesc: 'Receive important weather warnings, crop care reminders, and seasonal disease alerts.',
    color: 'from-purple-500 to-indigo-600',
    allowText: 'Allow Notifications',
  }
};

export const PermissionCard: React.FC<PermissionCardProps> = ({
  type,
  onAllow,
  onSkip,
  loading = false
}) => {
  const { t } = useLanguage();
  const config = PERMISSION_CONFIG[type];

  return (
    <div className="flex flex-col min-h-screen justify-between p-6 bg-white">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-4">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
          Permission Request
        </span>
        <button
          onClick={onSkip}
          className="text-sm font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg"
        >
          {t('skip', 'Skip')}
        </button>
      </div>

      {/* Center Permission Card Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center text-center my-8 max-w-sm mx-auto"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className={`w-36 h-36 rounded-full bg-gradient-to-tr ${config.color} text-white flex items-center justify-center shadow-soft-lg mb-6`}
        >
          <span className="text-6xl select-none" role="img" aria-label="Permission Icon">
            {config.icon}
          </span>
        </motion.div>

        <h2 className="text-2xl font-black text-slate-900 mb-3">
          {t(config.titleKey, config.defaultTitle)}
        </h2>

        <p className="text-slate-600 text-base leading-relaxed">
          {t(config.descKey, config.defaultDesc)}
        </p>
      </motion.div>

      {/* Bottom Button Actions */}
      <div className="flex flex-col gap-3 pb-6">
        <Button
          size="xl"
          fullWidth
          loading={loading}
          onClick={onAllow}
          className="shadow-soft-lg"
        >
          {config.allowText}
        </Button>

        <Button
          variant="ghost"
          size="lg"
          fullWidth
          onClick={onSkip}
        >
          {t('skipForNow', 'Skip for now')}
        </Button>
      </div>
    </div>
  );
};
