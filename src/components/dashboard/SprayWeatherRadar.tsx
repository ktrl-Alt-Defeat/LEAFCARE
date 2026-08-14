'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  MapPin,
  Navigation,
  RefreshCw,
  Wind,
  Droplets,
  CloudRain,
  Thermometer,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';
import { HourlyForecastEntry, WeatherBundle } from '@/lib/open-meteo';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/* Spray suitability rules                                                    */
/* -------------------------------------------------------------------------- */

type Rating = 'GOOD' | 'CAUTION' | 'AVOID';

interface FactorResult {
  rating: Rating;
  critical: boolean;
}

function rateWindSpeed(kmh: number): FactorResult {
  if (kmh <= 10) return { rating: 'GOOD', critical: false };
  if (kmh <= 15) return { rating: 'CAUTION', critical: false };
  return { rating: 'AVOID', critical: true };
}

function rateWindGusts(kmh: number): FactorResult {
  if (kmh <= 15) return { rating: 'GOOD', critical: false };
  if (kmh <= 20) return { rating: 'CAUTION', critical: false };
  return { rating: 'AVOID', critical: true };
}

function rateRainProbability(pct: number): FactorResult {
  if (pct < 20) return { rating: 'GOOD', critical: false };
  if (pct < 40) return { rating: 'CAUTION', critical: false };
  return { rating: 'AVOID', critical: true };
}

function ratePrecipitation(mm: number): FactorResult {
  if (mm === 0) return { rating: 'GOOD', critical: false };
  if (mm < 0.5) return { rating: 'CAUTION', critical: false };
  return { rating: 'AVOID', critical: true };
}

function rateTemperature(c: number): FactorResult {
  if (c < 30) return { rating: 'GOOD', critical: false };
  if (c <= 35) return { rating: 'CAUTION', critical: false };
  return { rating: 'AVOID', critical: false };
}

function rateHumidity(pct: number): FactorResult {
  if (pct >= 40 && pct <= 85) return { rating: 'GOOD', critical: false };
  if ((pct >= 30 && pct < 40) || (pct > 85 && pct <= 90))
    return { rating: 'CAUTION', critical: false };
  return { rating: 'AVOID', critical: false };
}

interface HourAnalysis {
  entry: HourlyForecastEntry;
  overall: Rating;
  score: number;
  reason: string;
}

function analyzeHour(entry: HourlyForecastEntry): HourAnalysis {
  const wind = rateWindSpeed(entry.windSpeed);
  const gusts = rateWindGusts(entry.windGusts);
  const rain = rateRainProbability(entry.precipitationProbability);
  const precip = ratePrecipitation(entry.precipitation);
  const temp = rateTemperature(entry.temperature);
  const humidity = rateHumidity(entry.humidity);

  const allFactors = [wind, gusts, rain, precip, temp, humidity];
  const hasCritical = allFactors.some((f) => f.critical && f.rating === 'AVOID');

  let overall: Rating;
  if (allFactors.some((f) => f.rating === 'AVOID')) {
    overall = 'AVOID';
  } else if (allFactors.some((f) => f.rating === 'CAUTION')) {
    overall = 'CAUTION';
  } else {
    overall = 'GOOD';
  }

  // Score 0-100
  const windScore = wind.rating === 'GOOD' ? 40 : wind.rating === 'CAUTION' ? 24 : 0;
  const rainScore =
    rain.rating === 'GOOD' && precip.rating !== 'AVOID'
      ? 35
      : rain.rating === 'CAUTION' || precip.rating === 'CAUTION'
      ? 20
      : 0;
  const tempScore = temp.rating === 'GOOD' ? 15 : temp.rating === 'CAUTION' ? 8 : 0;
  const humScore = humidity.rating === 'GOOD' ? 10 : humidity.rating === 'CAUTION' ? 5 : 0;
  let score = windScore + rainScore + tempScore + humScore;
  if (hasCritical) score = Math.min(score, 40);

  // Reason
  const badWind = wind.rating !== 'GOOD' || gusts.rating !== 'GOOD';
  const badRain = rain.rating !== 'GOOD' || precip.rating !== 'GOOD';

  let reason: string;
  if (overall === 'GOOD') {
    reason = 'Low wind and low rain probability. Conditions are favorable.';
  } else if (overall === 'CAUTION') {
    if (badWind && badRain) reason = 'Moderate wind and rain risk. Use caution.';
    else if (badRain) reason = 'Rain is likely during this period.';
    else if (badWind) reason = 'Wind or rain risk is moderate. Use caution.';
    else reason = 'Conditions require caution.';
  } else {
    if (badWind && badRain) reason = 'High wind and rain risk make this period unsuitable.';
    else if (badWind) reason = 'High wind speed may increase spray drift.';
    else if (badRain) reason = 'Rain is likely during this period.';
    else reason = 'Wind or rain conditions are unfavorable for spraying.';
  }

  return { entry, overall, score, reason };
}

/* -------------------------------------------------------------------------- */
/* Best window finder                                                          */
/* -------------------------------------------------------------------------- */

interface SprayWindow {
  start: HourAnalysis;
  end: HourAnalysis;
  isGood: boolean;
  isCautionOnly: boolean;
}

function findBestWindow(hours: HourAnalysis[]): SprayWindow | null {
  if (hours.length === 0) return null;

  // Try consecutive GOOD windows (>=2 hours)
  let bestRun: { start: number; end: number } | null = null;
  let run = -1;
  for (let i = 0; i < hours.length; i++) {
    if (hours[i].overall === 'GOOD') {
      if (run === -1) run = i;
      const len = i - run + 1;
      if (len >= 2) {
        if (!bestRun || len > bestRun.end - bestRun.start + 1) bestRun = { start: run, end: i };
      }
    } else {
      run = -1;
    }
  }
  if (bestRun) {
    return {
      start: hours[bestRun.start],
      end: hours[bestRun.end],
      isGood: true,
      isCautionOnly: false,
    };
  }

  // Single GOOD
  const singleGood = hours.find((h) => h.overall === 'GOOD');
  if (singleGood) return { start: singleGood, end: singleGood, isGood: true, isCautionOnly: false };

  // Consecutive CAUTION
  let cautionRun = -1;
  let bestCaution: { start: number; end: number } | null = null;
  for (let i = 0; i < hours.length; i++) {
    if (hours[i].overall === 'CAUTION') {
      if (cautionRun === -1) cautionRun = i;
      const len = i - cautionRun + 1;
      if (len >= 2) {
        if (!bestCaution || len > bestCaution.end - bestCaution.start + 1)
          bestCaution = { start: cautionRun, end: i };
      }
    } else {
      cautionRun = -1;
    }
  }
  if (bestCaution) {
    return {
      start: hours[bestCaution.start],
      end: hours[bestCaution.end],
      isGood: false,
      isCautionOnly: true,
    };
  }

  // Single CAUTION
  const singleCaution = hours.find((h) => h.overall === 'CAUTION');
  if (singleCaution)
    return { start: singleCaution, end: singleCaution, isGood: false, isCautionOnly: true };

  return null;
}

/* -------------------------------------------------------------------------- */
/* Formatting helpers                                                          */
/* -------------------------------------------------------------------------- */

function formatHour(iso: string): string {
  const hour = parseInt(iso.slice(11, 13), 10);
  const ampm = hour < 12 ? 'AM' : 'PM';
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h}:00 ${ampm}`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* -------------------------------------------------------------------------- */
/* Style maps                                                                  */
/* -------------------------------------------------------------------------- */

const RATING_STYLES: Record<Rating, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
  GOOD: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  },
  CAUTION: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  },
  AVOID: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-700',
    icon: <XCircle className="h-4 w-4 text-rose-500" />,
  },
};

function scoreStyle(score: number) {
  if (score >= 80) return { label: 'GOOD TO SPRAY', color: 'text-emerald-600', barColor: 'bg-emerald-500' };
  if (score >= 60) return { label: 'USE CAUTION', color: 'text-amber-600', barColor: 'bg-amber-400' };
  return { label: 'DO NOT SPRAY', color: 'text-rose-600', barColor: 'bg-rose-500' };
}

/* -------------------------------------------------------------------------- */
/* Sub-components                                                              */
/* -------------------------------------------------------------------------- */

const Pill: React.FC<{ rating: Rating }> = ({ rating }) => {
  const s = RATING_STYLES[rating];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold',
        s.bg,
        s.border,
        s.text
      )}
    >
      {s.icon}
      {rating}
    </span>
  );
};

const MetricTile: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <div className="flex flex-col items-center gap-0.5 rounded-2xl bg-slate-50 px-3 py-2 text-center">
    <span className="text-slate-500">{icon}</span>
    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</span>
    <span className="text-xs font-black text-slate-800">{value}</span>
  </div>
);

/* -------------------------------------------------------------------------- */
/* Main radar content                                                          */
/* -------------------------------------------------------------------------- */

const RadarContent: React.FC<{
  data: WeatherBundle;
  onRefresh: () => void;
  lastUpdated: Date | null;
}> = ({ data, onRefresh, lastUpdated }) => {
  const { location, current, hourly, daily } = data;

  // Only upcoming daylight hours in the next 48 h
  const nowMs = Date.now();
  const daylightHours = hourly.filter((h) => {
    const hMs = new Date(h.time).getTime();
    if (hMs < nowMs - 60 * 60 * 1000) return false;
    if (!h.isDay) return false;
    if (hMs > nowMs + 48 * 60 * 60 * 1000) return false;
    return true;
  });

  const analyzed = daylightHours.map(analyzeHour);

  // Current-hour analysis (using actual current-weather values)
  const currentHourEntry: HourlyForecastEntry = {
    time: current.observedAt,
    temperature: current.temperature,
    humidity: current.humidity,
    precipitationProbability: daily[0]?.precipitationProbability ?? 0,
    precipitation: current.precipitation,
    rain: current.precipitation,
    windSpeed: current.windSpeed,
    windDirection: current.windDirection,
    windDirectionLabel: current.windDirectionLabel,
    windGusts: current.windGusts,
    isDay: current.isDay,
    uvIndex: 0,
    condition: current.condition,
  };

  const currentAnalysis = analyzeHour(currentHourEntry);
  const ss = scoreStyle(currentAnalysis.score);
  const overallStyle = RATING_STYLES[currentAnalysis.overall];

  const bestWindow = findBestWindow(analyzed);

  return (
    <div className="flex flex-col gap-5">
      {/* Location + refresh */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-1.5 text-sm font-semibold text-slate-700">
          {location.fromDevice ? (
            <Navigation className="h-4 w-4 shrink-0 text-agro-600" />
          ) : (
            <MapPin className="h-4 w-4 shrink-0 text-agro-600" />
          )}
          <span className="truncate">
            📍 {location.name}
            {location.region ? `, ${location.region}` : ''}
          </span>
        </div>
        <button
          id="spray-radar-refresh-btn"
          onClick={onRefresh}
          aria-label="Refresh spray weather"
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-agro-200 bg-agro-50 px-3 py-1.5 text-xs font-bold text-agro-700 transition-colors hover:bg-agro-100"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {lastUpdated && (
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <Clock className="h-3 w-3" />
          Last updated: {formatTime(lastUpdated)}
        </div>
      )}

      {/* Overall status */}
      <div className={cn('rounded-2xl border-2 p-4', overallStyle.bg, overallStyle.border)}>
        <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">
          Current Status
        </p>
        <div className="flex items-center gap-2">
          {overallStyle.icon}
          <span className={cn('text-lg font-black', overallStyle.text)}>
            {currentAnalysis.overall === 'GOOD'
              ? '🟢 GOOD TO SPRAY'
              : currentAnalysis.overall === 'CAUTION'
              ? '🟡 CAUTION'
              : '🔴 DO NOT SPRAY'}
          </span>
        </div>
        <p className="mt-1 text-xs font-medium text-slate-600">{currentAnalysis.reason}</p>

        {/* Score bar */}
        <div className="mt-3 flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
            <div
              className={cn('h-full rounded-full transition-all duration-700', ss.barColor)}
              style={{ width: `${currentAnalysis.score}%` }}
            />
          </div>
          <span className={cn('whitespace-nowrap text-[11px] font-black', ss.color)}>
            {currentAnalysis.score}/100 — {ss.label}
          </span>
        </div>
      </div>

      {/* Best spray window */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
          Best Time to Spray
        </p>
        {bestWindow ? (
          <>
            <p className="text-lg font-black text-slate-900">
              {formatHour(bestWindow.start.entry.time)}
              {bestWindow.start.entry.time !== bestWindow.end.entry.time
                ? ` – ${formatHour(bestWindow.end.entry.time)}`
                : ''}
            </p>
            {bestWindow.isCautionOnly && (
              <p className="mt-1 text-xs font-semibold text-amber-600">
                ⚠️ Best available window — Use caution
              </p>
            )}
            {bestWindow.isGood && (
              <p className="mt-1 text-xs font-semibold text-emerald-600">✅ Ideal spraying window</p>
            )}
          </>
        ) : (
          <p className="text-sm font-bold text-rose-600">No ideal spraying window found today.</p>
        )}
      </div>

      {/* Current conditions */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-500">
          Current Conditions
        </p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          <MetricTile
            icon={<Thermometer className="h-4 w-4" />}
            label="Temp"
            value={`${Math.round(current.temperature)}°C`}
          />
          <MetricTile
            icon={<Wind className="h-4 w-4" />}
            label="Wind"
            value={`${Math.round(current.windSpeed)} km/h`}
          />
          <MetricTile
            icon={<Wind className="h-4 w-4 opacity-60" />}
            label="Gusts"
            value={`${Math.round(current.windGusts)} km/h`}
          />
          <MetricTile
            icon={<CloudRain className="h-4 w-4" />}
            label="Rain"
            value={`${Math.round(daily[0]?.precipitationProbability ?? 0)}%`}
          />
          <MetricTile
            icon={<Droplets className="h-4 w-4" />}
            label="Humidity"
            value={`${Math.round(current.humidity)}%`}
          />
          <MetricTile
            icon={<CloudRain className="h-4 w-4 opacity-70" />}
            label="Precip"
            value={`${current.precipitation.toFixed(1)} mm`}
          />
        </div>
      </div>

      {/* Hourly timeline */}
      {analyzed.length > 0 && (
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-500">
            Hourly Spray Timeline
          </p>
          <div className="flex flex-col divide-y divide-slate-100">
            {analyzed.slice(0, 12).map((h) => {
              const s = RATING_STYLES[h.overall];
              return (
                <div
                  key={h.entry.time}
                  className="flex flex-col gap-1.5 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:gap-3"
                >
                  <span className="w-20 shrink-0 text-xs font-black text-slate-700">
                    {formatHour(h.entry.time)}
                  </span>
                  <div className="shrink-0">
                    <Pill rating={h.overall} />
                  </div>
                  <div className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-slate-600">
                    <span className="flex items-center gap-1">
                      <Wind className="h-3 w-3 text-slate-400" />
                      {Math.round(h.entry.windSpeed)} km/h
                    </span>
                    <span className="flex items-center gap-1">
                      <Wind className="h-3 w-3 text-slate-300" />
                      gusts {Math.round(h.entry.windGusts)} km/h
                    </span>
                    <span className="flex items-center gap-1">
                      <CloudRain className="h-3 w-3 text-sky-400" />
                      {Math.round(h.entry.precipitationProbability)}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Thermometer className="h-3 w-3 text-orange-400" />
                      {Math.round(h.entry.temperature)}°C
                    </span>
                  </div>
                  <p className={cn('text-[11px] font-medium sm:text-right sm:w-44 shrink-0', s.text)}>
                    {h.reason}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="rounded-xl bg-slate-50 px-4 py-3 text-[11px] leading-relaxed text-slate-500">
        ⚠️ Spray conditions are estimated from weather forecast data. Always follow the pesticide
        product label and local agricultural guidance before application.
      </p>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Public export                                                               */
/* -------------------------------------------------------------------------- */

export const SprayWeatherRadar: React.FC = () => {
  const { status, data, error, refresh } = useWeather();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // 15-minute auto-refresh
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    intervalRef.current = setInterval(refresh, 15 * 60 * 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refresh]);

  useEffect(() => {
    if (status === 'ready') setLastUpdated(new Date());
  }, [status, data]);

  if (status === 'loading' && !data) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-slate-500">
        <RefreshCw className="h-7 w-7 animate-spin text-agro-500" />
        <p className="text-sm font-semibold">Loading spray conditions…</p>
      </div>
    );
  }

  if (status === 'empty') {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center text-slate-500">
        <MapPin className="h-8 w-8 text-agro-400" />
        <p className="text-sm font-bold text-slate-700">Location required</p>
        <p className="max-w-xs text-xs leading-relaxed">
          Location is required to calculate local spray conditions. Add your village or allow
          location access in your profile.
        </p>
      </div>
    );
  }

  if (status === 'error' && !data) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <XCircle className="h-8 w-8 text-rose-400" />
        <p className="text-sm font-bold text-slate-700">Unable to load spray weather conditions.</p>
        <p className="max-w-xs text-xs text-slate-500">
          {error ?? 'Could not reach the weather service. Check your connection.'}
        </p>
        <button
          onClick={refresh}
          className="mt-2 flex items-center gap-2 rounded-full bg-agro-600 px-4 py-2 text-xs font-bold text-white hover:bg-agro-700"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  return <RadarContent data={data} onRefresh={refresh} lastUpdated={lastUpdated} />;
};
