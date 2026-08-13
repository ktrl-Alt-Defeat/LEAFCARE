'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, PermissionStatus, ScanResult, UserProfile } from '@/types';

interface AppStateContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  onboardingCompleted: boolean;
  setOnboardingCompleted: (completed: boolean) => void;
  permissions: PermissionStatus;
  updatePermission: (key: keyof PermissionStatus, status: 'prompt' | 'granted' | 'denied' | 'skipped') => void;
  selectedCrops: string[];
  setSelectedCrops: (crops: string[]) => void;
  toggleCropSelection: (cropId: string) => void;
  scanHistory: ScanResult[];
  addScanResult: (result: ScanResult) => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  resetAllData: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Farmer Friend',
  phone: '+91 98765 43210',
  location: 'Mayiladuthurai, Tamil Nadu',
  farmSize: '3.5 Acres',
  experienceYears: '12 Years'
};

const DEFAULT_PERMISSIONS: PermissionStatus = {
  location: 'prompt',
  camera: 'prompt',
  microphone: 'prompt',
  notifications: 'prompt'
};

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

const STORAGE_KEY = 'leafcare_app_state_v1';

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [onboardingCompleted, setOnboardingCompletedState] = useState<boolean>(false);
  const [permissions, setPermissionsState] = useState<PermissionStatus>(DEFAULT_PERMISSIONS);
  const [selectedCrops, setSelectedCropsState] = useState<string[]>(['rice', 'tomato', 'wheat']);
  const [scanHistory, setScanHistoryState] = useState<ScanResult[]>([]);
  const [userProfile, setUserProfileState] = useState<UserProfile>(DEFAULT_PROFILE);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed.language) setLanguageState(parsed.language);
        if (typeof parsed.onboardingCompleted === 'boolean') setOnboardingCompletedState(parsed.onboardingCompleted);
        if (parsed.permissions) setPermissionsState(parsed.permissions);
        if (Array.isArray(parsed.selectedCrops)) setSelectedCropsState(parsed.selectedCrops);
        if (Array.isArray(parsed.scanHistory)) setScanHistoryState(parsed.scanHistory);
        if (parsed.userProfile) setUserProfileState(parsed.userProfile);
      }
    } catch (e) {
      console.error('Failed to parse saved state from localStorage:', e);
    }
  }, []);

  // Save to localStorage helper
  const saveState = (newState: Partial<{
    language: LanguageCode;
    onboardingCompleted: boolean;
    permissions: PermissionStatus;
    selectedCrops: string[];
    scanHistory: ScanResult[];
    userProfile: UserProfile;
  }>) => {
    try {
      const currentRaw = localStorage.getItem(STORAGE_KEY);
      const current = currentRaw ? JSON.parse(currentRaw) : {};
      const updated = {
        language: newState.language ?? language,
        onboardingCompleted: newState.onboardingCompleted ?? onboardingCompleted,
        permissions: newState.permissions ?? permissions,
        selectedCrops: newState.selectedCrops ?? selectedCrops,
        scanHistory: newState.scanHistory ?? scanHistory,
        userProfile: newState.userProfile ?? userProfile,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to persist app state:', e);
    }
  };

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    saveState({ language: lang });
  };

  const setOnboardingCompleted = (completed: boolean) => {
    setOnboardingCompletedState(completed);
    saveState({ onboardingCompleted: completed });
  };

  const updatePermission = (key: keyof PermissionStatus, status: 'prompt' | 'granted' | 'denied' | 'skipped') => {
    const updated = { ...permissions, [key]: status };
    setPermissionsState(updated);
    saveState({ permissions: updated });
  };

  const setSelectedCrops = (crops: string[]) => {
    setSelectedCropsState(crops);
    saveState({ selectedCrops: crops });
  };

  const toggleCropSelection = (cropId: string) => {
    const next = selectedCrops.includes(cropId)
      ? selectedCrops.filter(id => id !== cropId)
      : [...selectedCrops, cropId];
    setSelectedCrops(next);
  };

  const addScanResult = (result: ScanResult) => {
    const updated = [result, ...scanHistory];
    setScanHistoryState(updated);
    saveState({ scanHistory: updated });
  };

  const updateUserProfile = (profileUpdate: Partial<UserProfile>) => {
    const updated = { ...userProfile, ...profileUpdate };
    setUserProfileState(updated);
    saveState({ userProfile: updated });
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setLanguageState('en');
    setOnboardingCompletedState(false);
    setPermissionsState(DEFAULT_PERMISSIONS);
    setSelectedCropsState(['rice', 'tomato', 'wheat']);
    setScanHistoryState([]);
    setUserProfileState(DEFAULT_PROFILE);
  };

  return (
    <AppStateContext.Provider value={{
      language,
      setLanguage,
      onboardingCompleted,
      setOnboardingCompleted,
      permissions,
      updatePermission,
      selectedCrops,
      setSelectedCrops,
      toggleCropSelection,
      scanHistory,
      addScanResult,
      userProfile,
      updateUserProfile,
      resetAllData
    }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
