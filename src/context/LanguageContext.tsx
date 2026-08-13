'use client';

import React, { createContext, useContext } from 'react';
import { useAppState } from './AppStateContext';
import { TRANSLATIONS } from '@/data/translations';
import { LanguageCode } from '@/types';

interface LanguageContextType {
  language: LanguageCode;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useAppState();

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (langDict[key]) return langDict[key];
    if (TRANSLATIONS.en[key]) return TRANSLATIONS.en[key];
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
