'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LanguageCode, PermissionStatus, ScanResult, UserProfile } from '@/types';

interface AppStateContextType {
  /** False until localStorage has been read. Guards against redirect flashes. */
  hydrated: boolean;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  onboardingCompleted: boolean;
  setOnboardingCompleted: (completed: boolean) => void;
  permissions: PermissionStatus;
  updatePermission: (key: keyof PermissionStatus, status: PermissionStatus[keyof PermissionStatus]) => void;
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

const DEFAULT_CROPS = ['rice', 'tomato', 'wheat'];

/**
 * Captured frames are stored as data URLs, so an unbounded history fills the
 * ~5 MB localStorage quota after a handful of scans and every later write fails.
 */
const MAX_SCAN_HISTORY = 12;

const STORAGE_KEY = 'leafcare_app_state_v1';

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hydrated, setHydrated] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [permissions, setPermissions] = useState<PermissionStatus>(DEFAULT_PERMISSIONS);
  const [selectedCrops, setSelectedCropsState] = useState<string[]>(DEFAULT_CROPS);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  // Restore once on mount.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.language) setLanguage(parsed.language);
        if (typeof parsed.onboardingCompleted === 'boolean') {
          setOnboardingCompleted(parsed.onboardingCompleted);
        }
        if (parsed.permissions) setPermissions(parsed.permissions);
        if (Array.isArray(parsed.selectedCrops)) setSelectedCropsState(parsed.selectedCrops);
        if (Array.isArray(parsed.scanHistory)) {
          setScanHistory(parsed.scanHistory.slice(0, MAX_SCAN_HISTORY));
        }
        if (parsed.userProfile) setUserProfile(parsed.userProfile);
      }
    } catch (error) {
      console.error('Failed to read saved app state:', error);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist on change. Skipped until hydration so defaults never overwrite
  // saved data on first paint.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          language,
          onboardingCompleted,
          permissions,
          selectedCrops,
          scanHistory,
          userProfile
        })
      );
    } catch (error) {
      console.error('Failed to persist app state:', error);
    }
  }, [hydrated, language, onboardingCompleted, permissions, selectedCrops, scanHistory, userProfile]);

  const updatePermission = useCallback(
    (key: keyof PermissionStatus, status: PermissionStatus[keyof PermissionStatus]) => {
      setPermissions((prev) => ({ ...prev, [key]: status }));
    },
    []
  );

  const toggleCropSelection = useCallback((cropId: string) => {
    setSelectedCropsState((prev) =>
      prev.includes(cropId) ? prev.filter((id) => id !== cropId) : [...prev, cropId]
    );
  }, []);

  const addScanResult = useCallback((result: ScanResult) => {
    setScanHistory((prev) => [result, ...prev].slice(0, MAX_SCAN_HISTORY));
  }, []);

  const updateUserProfile = useCallback((update: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...update }));
  }, []);

  const resetAllData = useCallback(() => {
    setLanguage('en');
    setOnboardingCompleted(false);
    setPermissions(DEFAULT_PERMISSIONS);
    setSelectedCropsState(DEFAULT_CROPS);
    setScanHistory([]);
    setUserProfile(DEFAULT_PROFILE);
  }, []);

  const value = useMemo(
    () => ({
      hydrated,
      language,
      setLanguage,
      onboardingCompleted,
      setOnboardingCompleted,
      permissions,
      updatePermission,
      selectedCrops,
      setSelectedCrops: setSelectedCropsState,
      toggleCropSelection,
      scanHistory,
      addScanResult,
      userProfile,
      updateUserProfile,
      resetAllData
    }),
    [
      hydrated,
      language,
      onboardingCompleted,
      permissions,
      updatePermission,
      selectedCrops,
      toggleCropSelection,
      scanHistory,
      addScanResult,
      userProfile,
      updateUserProfile,
      resetAllData
    ]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
