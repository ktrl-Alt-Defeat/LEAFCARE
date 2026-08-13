'use client';

import React from 'react';
import { MapPin, Droplets, CloudRain, Wind, SprayCan } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useLanguage } from '@/context/LanguageContext';

export const WeatherCard: React.FC = () => {
  const { weather } = useGeolocation();
  const { t } = useLanguage();

  return (
    <div className="rounded-3xl bg-gradient-to-br from-emerald-600 via-agro-700 to-green-800 text-white p-5 shadow-soft-lg relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />

      {/* Header with Location */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
          <MapPin className="w-3.5 h-3.5 text-amber-300" />
          <span className="text-xs font-semibold tracking-tight">{weather.locationName}</span>
        </div>
        <span className="text-xs text-emerald-100 font-medium bg-emerald-900/40 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
          Live Forecast
        </span>
      </div>

      {/* Main Temperature Display */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black tracking-tight">{weather.temp}</span>
            <span className="text-2xl font-bold text-emerald-200">°C</span>
          </div>
          <p className="text-sm font-medium text-emerald-100 mt-0.5">
            {weather.condition}
          </p>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-4xl shadow-inner border border-white/10">
          ☀️
        </div>
      </div>

      {/* 4 Agricultural Weather Metrics */}
      <div className="grid grid-cols-4 gap-2 pt-3 border-t border-white/15">
        <div className="flex flex-col items-center text-center">
          <Droplets className="w-4 h-4 text-sky-300 mb-1" />
          <span className="text-[10px] text-emerald-200 uppercase font-bold">{t('humidity', 'Humidity')}</span>
          <span className="text-xs font-bold mt-0.5">{weather.humidity}%</span>
        </div>

        <div className="flex flex-col items-center text-center">
          <CloudRain className="w-4 h-4 text-blue-300 mb-1" />
          <span className="text-[10px] text-emerald-200 uppercase font-bold">{t('rainProbability', 'Rain')}</span>
          <span className="text-xs font-bold mt-0.5">{weather.rainProbability}%</span>
        </div>

        <div className="flex flex-col items-center text-center">
          <Wind className="w-4 h-4 text-emerald-300 mb-1" />
          <span className="text-[10px] text-emerald-200 uppercase font-bold">{t('windSpeed', 'Wind')}</span>
          <span className="text-xs font-bold mt-0.5">{weather.windSpeed} km/h</span>
        </div>

        <div className="flex flex-col items-center text-center">
          <SprayCan className="w-4 h-4 text-amber-300 mb-1" />
          <span className="text-[10px] text-emerald-200 uppercase font-bold">{t('sprayCondition', 'Spraying')}</span>
          <span className="text-xs font-bold text-amber-200 mt-0.5">{weather.sprayingCondition}</span>
        </div>
      </div>
    </div>
  );
};
