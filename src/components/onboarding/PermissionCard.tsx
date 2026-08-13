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
  /** 1-based position in the permission sequence, shown as progress. */
  step?: number;
  totalSteps?: number;
}

export const PERMISSION_CONFIG = {
  location: {
    icon: '🗺️',
    titleKey: 'allowLocation',
    defaultTitle: 'Allow Location Access',
    descKey: 'locationDesc',
    defaultDesc:
      'Get local weather forecasts, spraying conditions, and regional crop disease alerts.',
    color: 'from-amber-400 to-orange-500',
    allowText: 'Allow Location',
  },
  camera: {
    icon: '📸',
    titleKey: 'checkCrops',
    defaultTitle: "Let's Check Your Crops",
    descKey: 'cameraDesc',
    defaultDesc:
      'Use your camera to capture clear leaf pictures for instant AI disease identification.',
    color: 'from-agro-500 to-emerald-600',
    allowText: 'Allow Camera',
  },
  microphone: {
    icon: '🎙️',
    titleKey: 'talkToAssistant',
    defaultTitle: 'Talk to Farming Assistant',
    descKey: 'micDesc',
    defaultDesc:
      'Use your voice to ask questions and receive instant farming advice in your native language.',
    color: 'from-sky-500 to-blue-600',
    allowText: 'Allow Microphone',
  },
  notifications: {
    icon: '🔔',
    titleKey: 'stayInformed',
    defaultTitle: 'Stay Informed',
    descKey: 'notifDesc',
    defaultDesc:
      'Receive important weather warnings, crop care reminders, and seasonal disease alerts.',
    color: 'from-purple-500 to-indigo-600',
    allowText: 'Allow Notifications',
  },
};

export const PermissionCard: React.FC<PermissionCardProps> = ({
  type,
  onAllow,
  onSkip,
  loading = false,
  step,
  totalSteps,
}) => {
  const { t } = useLanguage();
  const config = PERMISSION_CONFIG[type];

  return (
    <div className="onboarding-stage">
      <div className="flex items-center justify-between pt-4 lg:pt-0">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-500">
          {step && totalSteps ? `Permission ${step} of ${totalSteps}` : 'Permission request'}
        </span>
        <button
          onClick={onSkip}
          className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-800"
        >
          {t('skip', 'Skip')}
        </button>
      </div>

      <motion.div
        key={type}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto my-8 flex max-w-sm flex-col items-center text-center lg:my-0"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className={`mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-tr text-white shadow-soft-lg h-sm:h-36 h-sm:w-36 ${config.color}`}
        >
          <span className="select-none text-5xl h-sm:text-6xl" role="img" aria-hidden="true">
            {config.icon}
          </span>
        </motion.div>

        <h2 className="mb-3 text-2xl font-black text-slate-900">
          {t(config.titleKey, config.defaultTitle)}
        </h2>

        <p className="text-base leading-relaxed text-slate-600">
          {t(config.descKey, config.defaultDesc)}
        </p>
      </motion.div>

      <div className="flex flex-col gap-3 pb-6 lg:pb-0">
        <Button size="xl" fullWidth loading={loading} onClick={onAllow} className="shadow-soft-lg">
          {config.allowText}
        </Button>

        <Button variant="ghost" size="lg" fullWidth onClick={onSkip}>
          {t('skipForNow', 'Skip for now')}
        </Button>
      </div>
    </div>
  );
};
