'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { WeatherBundle } from '@/lib/open-meteo';
import { useAppState } from '@/context/AppStateContext';
import { useGeolocation } from './useGeolocation';

export type WeatherStatus = 'loading' | 'ready' | 'error' | 'empty';

export interface UseWeatherResult {
  status: WeatherStatus;
  data: WeatherBundle | null;
  error: string | null;
  refresh: () => void;
}

/**
 * Single entry point for weather in the UI. Requests go to `/api/weather`, which
 * wraps the Open-Meteo service on the server so responses are cached and shared.
 *
 * Device coordinates are preferred; otherwise the farmer's saved location is
 * geocoded through Open-Meteo.
 */
export const useWeather = (): UseWeatherResult => {
  const { hydrated, userProfile } = useAppState();
  const { coords, status: geoStatus } = useGeolocation();

  const [data, setData] = useState<WeatherBundle | null>(null);
  const [status, setStatus] = useState<WeatherStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  // Keeps a stale response on screen while a refresh is in flight.
  const requestRef = useRef<AbortController | null>(null);

  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);

  useEffect(() => {
    // Wait until saved state is read and geolocation has settled, otherwise the
    // first request would fire against a placeholder location.
    if (!hydrated || geoStatus === 'idle' || geoStatus === 'locating') return;

    const savedLocation = userProfile.location?.trim() ?? '';

    if (!coords && !savedLocation) {
      setStatus('empty');
      setError(null);
      return;
    }

    const params = new URLSearchParams();
    if (coords) {
      params.set('lat', coords.latitude.toFixed(4));
      params.set('lon', coords.longitude.toFixed(4));
    } else {
      params.set('place', savedLocation);
    }

    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;

    setStatus('loading');
    setError(null);

    fetch(`/api/weather?${params.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error ?? 'Unable to load weather right now.');
        }
        return payload as WeatherBundle;
      })
      .then((bundle) => {
        if (controller.signal.aborted) return;
        setData(bundle);
        setStatus('ready');
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        console.warn('Weather request failed:', cause);
        setError(cause instanceof Error ? cause.message : 'Unable to load weather right now.');
        setStatus('error');
      });

    return () => controller.abort();
  }, [hydrated, geoStatus, coords, userProfile.location, reloadToken]);

  return { status, data, error, refresh };
};
