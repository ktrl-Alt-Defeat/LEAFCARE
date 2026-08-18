'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/context/AppStateContext';
import { LanguageSelector } from '@/components/onboarding/LanguageSelector';
import { LanguageCode } from '@/types';

export default function LanguagePage() {
  const router = useRouter();
  const { language, setLanguage } = useAppState();

  const handleSelectLanguage = (code: LanguageCode) => {
    setLanguage(code);
  };

  const handleContinue = () => {
    // Role comes straight after language: it decides which dashboards and
    // navigation the rest of onboarding leads into.
    router.push('/role');
  };

  return (
    <LanguageSelector
      selectedLanguage={language}
      onSelectLanguage={handleSelectLanguage}
      onContinue={handleContinue}
    />
  );
}
