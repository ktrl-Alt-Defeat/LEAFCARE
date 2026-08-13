'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAppState } from '@/context/AppStateContext';

export type GeolocationStatus = 'idle' | 'locating' | 'ready' | 'unavailable';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Device coordinates only — weather lives in `useWeather`, which reads from the
 * centralized Open-Meteo service.
 *
 * The browser prompt is only triggered when location was granted during
 * onboarding, so the dashboard never ambushes the user with a permission dialog.
 */
export const useGeolocation = () => {
  const { permissions, hydrated } = useAppState();
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [status, setStatus] = useState<GeolocationStatus>('idle');

  const locate = useCallback(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setStatus('unavailable');
      return;
    }

    setStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setStatus('ready');
      },
      (error) => {
        console.warn('Geolocation unavailable:', error.message);
        setStatus('unavailable');
      },
      { timeout: 10_000, maximumAge: 5 * 60 * 1000 }
    );
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (permissions.location === 'granted') {
      locate();
    } else {
      setStatus('unavailable');
    }
  }, [hydrated, permissions.location, locate]);

  return { coords, status, locate };
};
