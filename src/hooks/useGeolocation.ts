'use client';

import { useState, useEffect } from 'react';
import { WeatherInfo } from '@/types';

export const useGeolocation = () => {
  const [weather, setWeather] = useState<WeatherInfo>({
    temp: 26,
    condition: 'Partly Cloudy',
    locationName: 'Mayiladuthurai, Tamil Nadu',
    humidity: 78,
    rainProbability: 25,
    windSpeed: 12,
    sprayingCondition: 'Optimal'
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // Simulated weather lookup based on coordinates
          const lat = pos.coords.latitude;
          if (lat > 20) {
            setWeather({
              temp: 24,
              condition: 'Sunny & Clear',
              locationName: 'Karnal, Haryana',
              humidity: 65,
              rainProbability: 10,
              windSpeed: 8,
              sprayingCondition: 'Optimal'
            });
          } else {
            setWeather({
              temp: 28,
              condition: 'Humid & Moist',
              locationName: 'Thanjavur, Tamil Nadu',
              humidity: 82,
              rainProbability: 35,
              windSpeed: 14,
              sprayingCondition: 'Favorable'
            });
          }
        },
        () => {
          // Fallback location
        }
      );
    }
  }, []);

  return { weather, loading };
};
