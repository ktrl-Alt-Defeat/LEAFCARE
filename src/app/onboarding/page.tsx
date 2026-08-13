'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingCarousel } from '@/components/onboarding/OnboardingCarousel';

export default function OnboardingPage() {
  const router = useRouter();

  const handleNextFlow = () => {
    router.push('/permissions');
  };

  return (
    <OnboardingCarousel
      onComplete={handleNextFlow}
      onSkip={handleNextFlow}
    />
  );
}
