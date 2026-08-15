'use client';

import React from 'react';
import {
  MapPin,
  Droplets,
  CloudRain,
  Wind,
  SprayCan,
  Sun,
  Sunrise,
  Sunset,
  Navigation,
  RefreshCw,
  TriangleAlert,
  Leaf,
} from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';
import { useLanguage } from '@/context/LanguageContext';
import { SprayingCondition, WeatherBundle } from '@/lib/open-meteo';
import { cn } from '@/lib/utils';

import { Weather3DIcon } from './Weather3DIcon';

/** Open-Meteo returns local wall-clock ISO strings — slice rather than parse,
 *  so a browser in another timezone still shows the location's own time. */
const toClockTime = (isoLocal: string) => isoLocal.slice(11, 16);

const toWeekday = (isoDate: string, index: number) => {
  if (index === 0) return 'Today';
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, { weekday: 'short' });
};

const SPRAY_TONE: Record<SprayingCondition, string> = {
  Optimal: 'text-emerald-300',
  Favorable: 'text-amber-200',
  Unfavorable: 'text-[#fca5a5]',
};

const CardShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-agro-950 p-5 text-white shadow-soft-lg sm:p-6">
    {/* Photorealistic agricultural crop field background */}
    <img
      src="/weather-field-bg.jpg"
      alt="Crop field weather background"
      className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
    />
    {/* Realistic gradient vignette for text readability */}
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/75" />
    <div className="pointer-events-none absolute inset-0 bg-emerald-950/25 mix-blend-multiply" />
    {children}
  </div>
);

const WeatherSkeleton: React.FC = () => (
  <CardShell>
    <div className="relative flex animate-pulse flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="h-6 w-40 rounded-full bg-white/20" />
        <div className="h-6 w-12 rounded-full bg-white/15" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-10 w-24 rounded-lg bg-white/20" />
          <div className="h-4 w-32 rounded bg-white/15" />
        </div>
        <div className="h-16 w-16 rounded-2xl bg-white/15" />
      </div>
      <div className="grid grid-cols-4 gap-2 border-t border-white/15 pt-3">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="flex flex-col items-center gap-1.5">
            <div className="h-4 w-4 rounded bg-white/20" />
            <div className="h-2 w-10 rounded bg-white/15" />
            <div className="h-3 w-8 rounded bg-white/20" />
          </div>
        ))}
      </div>
    </div>
  </CardShell>
);

const WeatherMessage: React.FC<{
  icon: React.ReactNode;
  title: string;
  body: string;
  action?: { label: string; onClick: () => void };
}> = ({ icon, title, body, action }) => (
  <CardShell>
    <div className="relative flex flex-col items-start gap-2">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
        {icon}
      </span>
      <h3 className="text-base font-black">{title}</h3>
      <p className="text-xs font-medium leading-relaxed text-emerald-100/90">{body}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-1 flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold transition-colors hover:bg-white/25"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {action.label}
        </button>
      )}
    </div>
  </CardShell>
);

const CurrentConditions: React.FC<{ data: WeatherBundle; onRefresh: () => void }> = ({
  data,
  onRefresh,
}) => {
  const { t } = useLanguage();
  const { location, current, daily, spraying, airQuality } = data;
  const today = daily[0];

  const metrics = [
    {
      icon: Droplets,
      iconClass: 'text-sky-300',
      label: t('humidity', 'HUMIDITY'),
      value: `${Math.round(current.humidity)}%`,
    },
    {
      icon: CloudRain,
      iconClass: 'text-sky-200',
      label: t('rainProbability', 'RAIN PROB.'),
      value: `${Math.round(today?.precipitationProbability ?? 0)}%`,
    },
    {
      icon: Wind,
      iconClass: 'text-emerald-300',
      label: t('windSpeed', 'WIND'),
      value: `${Math.round(current.windSpeed)} km/h ${current.windDirectionLabel}`,
    },
    {
      icon: Sun,
      iconClass: 'text-amber-300',
      label: 'UV INDEX',
      value: `${Math.round(today?.uvIndexMax ?? 0)}`,
    },
  ];

  return (
    <CardShell>
      <div className="relative">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex min-w-0 max-w-[70%] items-center gap-1.5 rounded-full border border-white/10 bg-black/25 px-3.5 py-1.5 backdrop-blur-md">
            {location.fromDevice ? (
               <Navigation className="h-3.5 w-3.5 shrink-0 fill-amber-300 text-amber-300" />
            ) : (
              <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-300" />
            )}
            <span className="truncate text-xs font-semibold tracking-tight text-white">
              {location.name}
              {location.region ? `, ${location.region}` : ''}
            </span>
          </div>

          <button
            onClick={onRefresh}
            title={`Updated ${toClockTime(current.observedAt)} · refresh`}
            aria-label="Refresh weather"
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-md transition-colors hover:bg-black/40"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{toClockTime(current.observedAt)}</span>
          </button>
        </div>

        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-baseline gap-1 drop-shadow-md">
              <span className="text-5xl font-black tracking-tight text-white">
                {Math.round(current.temperature)}
              </span>
              <span className="text-2xl font-bold text-white/80">°C</span>
            </div>
            <p className="mt-1 text-base font-bold text-white drop-shadow-sm">
              {current.condition.label}
            </p>
            <p className="text-xs font-medium text-white/90 drop-shadow-sm">
              Feels like {Math.round(current.apparentTemperature)}°C
            </p>
          </div>

          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/20 shadow-lg backdrop-blur-md"
            role="img"
            aria-label={current.condition.label}
          >
            <Weather3DIcon
              conditionCode={current.condition.code}
              group={current.condition.group}
              isDay={current.isDay}
              className="h-14 w-14 drop-shadow-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 pt-1 text-center">
          {metrics.map(({ icon: Icon, iconClass, label, value }) => (
            <div key={label} className="flex flex-col items-center">
              <Icon className={cn('mb-1.5 h-4 w-4 drop-shadow', iconClass)} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 drop-shadow">
                {label}
              </span>
              <span className="mt-0.5 text-xs font-bold text-white drop-shadow">{value}</span>
            </div>
          ))}
        </div>

        {/* Spray window, derived from live wind, rain and humidity. */}
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-white/10 bg-[#1f331b]/80 p-3.5 shadow-md backdrop-blur-md">
          <SprayCan className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
          <div className="flex min-w-0 flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/90">
              {t('sprayCondition', 'SPRAYING INDEX')}
            </span>
            <span className={cn('text-base font-black', SPRAY_TONE[spraying.condition])}>
              {spraying.condition}
            </span>
            <span className="text-xs font-normal leading-relaxed text-white/90">
              {spraying.reason}
            </span>
          </div>
        </div>

        {/* Sun times and air quality */}
        <div className="mt-3.5 flex items-center justify-between gap-2 text-xs font-semibold text-white drop-shadow-md">
          {today && (
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Sunrise className="h-3.5 w-3.5 text-amber-300" />
                {toClockTime(today.sunrise)}
              </span>
              <span className="flex items-center gap-1.5">
                <Sunset className="h-3.5 w-3.5 text-amber-300" />
                {toClockTime(today.sunset)}
              </span>
            </div>
          )}
          {airQuality && airQuality.europeanAqi !== null && (
            <span className="flex items-center gap-1.5">
              <Leaf className="h-3.5 w-3.5 text-emerald-300" />
              Air {airQuality.label} ({Math.round(airQuality.europeanAqi)})
            </span>
          )}
        </div>
      </div>
    </CardShell>
  );
};

const ForecastStrip: React.FC<{ daily: WeatherBundle['daily'] }> = ({ daily }) => (
  <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-soft-sm">
    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
      7-day outlook
    </h3>

    {/* Scrolls in the narrow desktop rail; the edge fade signals there is more. */}
    <div className="no-scrollbar scroll-fade-x -mx-1 flex gap-2 overflow-x-auto px-1">
      {daily.map((day, index) => (
        <div
          key={day.date}
          className={cn(
            'flex min-w-[62px] flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2.5',
            index === 0 ? 'bg-agro-50 ring-1 ring-agro-100' : 'bg-slate-50'
          )}
        >
          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
            {toWeekday(day.date, index)}
          </span>
          <span className="text-xl leading-none" role="img" aria-label={day.condition.label}>
            {day.condition.icon}
          </span>
          <span className="text-xs font-black text-slate-900">
            {Math.round(day.temperatureMax)}°
          </span>
          <span className="text-[10px] font-semibold text-slate-400">
            {Math.round(day.temperatureMin)}°
          </span>
          <span className="flex items-center gap-0.5 text-[10px] font-bold text-sky-600">
            <CloudRain className="h-2.5 w-2.5" />
            {Math.round(day.precipitationProbability)}%
          </span>
        </div>
      ))}
    </div>
  </section>
);

export const WeatherCard: React.FC = () => {
  const { status, data, error, refresh } = useWeather();

  if (status === 'loading' && !data) return <WeatherSkeleton />;

  if (status === 'empty') {
    return (
      <WeatherMessage
        icon={<MapPin className="h-5 w-5 text-amber-300" />}
        title="Location needed"
        body="Add your village or district in your profile, or allow location access, to see local weather and spraying windows."
      />
    );
  }

  if (status === 'error' && !data) {
    return (
      <WeatherMessage
        icon={<TriangleAlert className="h-5 w-5 text-amber-300" />}
        title="Weather unavailable"
        body={error ?? 'Open-Meteo could not be reached. Check your connection and try again.'}
        action={{ label: 'Try again', onClick: refresh }}
      />
    );
  }

  if (!data) return <WeatherSkeleton />;

  return (
    <div data-tour="weather" className="flex flex-col gap-4">
      <CurrentConditions data={data} onRefresh={refresh} />
      {data.daily.length > 0 && <ForecastStrip daily={data.daily} />}
    </div>
  );
};
