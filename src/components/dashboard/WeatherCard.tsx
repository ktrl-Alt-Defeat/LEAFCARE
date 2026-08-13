'use client';

import React from 'react';
import { MapPin, Droplets, CloudRain, Wind, SprayCan, type LucideIcon } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useLanguage } from '@/context/LanguageContext';

export const WeatherCard: React.FC = () => {
  const { weather } = useGeolocation();
  const { t } = useLanguage();

  const metrics: Array<{ icon: LucideIcon; iconClass: string; label: string; value: string; valueClass?: string }> = [
    {
      icon: Droplets,
      iconClass: 'text-sky-300',
      label: t('humidity', 'Humidity'),
      value: `${weather.humidity}%`,
    },
    {
      icon: CloudRain,
      iconClass: 'text-blue-300',
      label: t('rainProbability', 'Rain'),
      value: `${weather.rainProbability}%`,
    },
    {
      icon: Wind,
      iconClass: 'text-emerald-300',
      label: t('windSpeed', 'Wind'),
      value: `${weather.windSpeed} km/h`,
    },
    {
      icon: SprayCan,
      iconClass: 'text-amber-300',
      label: t('sprayCondition', 'Spraying'),
      value: weather.sprayingCondition,
      valueClass: 'text-amber-200',
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-agro-700 to-green-800 p-5 text-white shadow-soft-lg">
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-xl" />

      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 backdrop-blur-md">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-300" />
          <span className="truncate text-xs font-semibold tracking-tight">
            {weather.locationName}
          </span>
        </div>
        <span className="shrink-0 rounded-full border border-emerald-400/30 bg-emerald-900/40 px-2.5 py-0.5 text-xs font-medium text-emerald-100">
          Live
        </span>
      </div>

      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black tracking-tight">{weather.temp}</span>
            <span className="text-2xl font-bold text-emerald-200">°C</span>
          </div>
          <p className="mt-0.5 text-sm font-medium text-emerald-100">{weather.condition}</p>
        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-4xl shadow-inner backdrop-blur-md">
          ☀️
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 border-t border-white/15 pt-3">
        {metrics.map(({ icon: Icon, iconClass, label, value, valueClass }) => (
          <div key={label} className="flex flex-col items-center text-center">
            <Icon className={`mb-1 h-4 w-4 ${iconClass}`} />
            <span className="text-[10px] font-bold uppercase leading-tight text-emerald-200">
              {label}
            </span>
            <span className={`mt-0.5 text-xs font-bold ${valueClass ?? ''}`}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
