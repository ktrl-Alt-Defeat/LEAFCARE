'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PermissionCard } from '@/components/onboarding/PermissionCard';
import { usePermissions } from '@/hooks/usePermissions';

type PermStep = 'location' | 'camera' | 'microphone' | 'notifications';

const STEPS: PermStep[] = ['location', 'camera', 'microphone', 'notifications'];

export default function PermissionsPage() {
  const router = useRouter();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const {
    loading,
    requestLocationPermission,
    requestCameraPermission,
    requestMicrophonePermission,
    requestNotificationPermission
  } = usePermissions();

  const currentType = STEPS[currentStepIdx];

  const advanceStep = () => {
    if (currentStepIdx < STEPS.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    } else {
      router.push('/crops');
    }
  };

  const handleAllow = async () => {
    if (currentType === 'location') {
      await requestLocationPermission();
    } else if (currentType === 'camera') {
      await requestCameraPermission();
    } else if (currentType === 'microphone') {
      await requestMicrophonePermission();
    } else if (currentType === 'notifications') {
      await requestNotificationPermission();
    }
    advanceStep();
  };

  const handleSkip = () => {
    advanceStep();
  };

  return (
    <PermissionCard
      type={currentType}
      onAllow={handleAllow}
      onSkip={handleSkip}
      loading={loading}
      step={currentStepIdx + 1}
      totalSteps={STEPS.length}
    />
  );
}
