'use client';

import React, { useMemo } from 'react';
import { CloudRain, Wind, Thermometer, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SpeakButton } from '@/components/voice/SpeakButton';
import { useWeather } from '@/hooks/useWeather';
import { SprayHour, SprayVerdict, buildSprayWindow, nextSprayWindow } from '@/lib/agronomy/spray';
import { cn } from '@/lib/utils';

const VERDICT_STYLE: Record<SprayVerdict, { chip: string; bar: string; label: string }> = {
  ideal: { chip: 'bg-emerald-100 text-emerald-800', bar: 'bg-emerald-500', label: 'Good' },
  marginal: { chip: 'bg-amber-100 text-amber-800', bar: 'bg-amber-500', label: 'Caution' },
  unsuitable: { chip: 'bg-red-100 text-red-800', bar: 'bg-red-500', label: 'Avoid' },
};

const VerdictIcon: React.FC<{ verdict: SprayVerdict; className?: string }> = ({
  verdict,
  className,
}) => {
  if (verdict === 'ideal') return <CheckCircle2 className={cn('text-emerald-600', className)} />;
  if (verdict === 'marginal') return <AlertTriangle className={cn('text-amber-600', className)} />;
  return <XCircle className={cn('text-red-600', className)} />;
};

const hourLabel = (iso: string): string => {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleTimeString([], { hour: 'numeric', hour12: true }).toLowerCase();
};

export const SprayWeatherModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { data, status, error } = useWeather();

  const hours = useMemo(() => (data ? buildSprayWindow(data.hourly).slice(0, 18) : []), [data]);
  const window = useMemo(() => nextSprayWindow(hours), [hours]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Spray Weather Radar">
      <div className="flex flex-col gap-4 pt-1">
        {status === 'loading' && (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="h-14 animate-pulse rounded-2xl bg-slate-200/60" />
            ))}
          </div>
        )}

        {status === 'error' && (
          <div className="rounded-2xl border border-dashed border-red-300 bg-red-50/60 px-4 py-8 text-center">
            <p className="text-sm font-bold text-red-700">Could not load the forecast</p>
            <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
          </div>
        )}

        {status === 'empty' && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-4 py-8 text-center">
            <p className="text-sm font-bold text-slate-700">No location set</p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Allow location access or set your village in your profile to see spray conditions.
            </p>
          </div>
        )}

        {status === 'ready' && data && (
          <>
            {/* Headline: the next usable window, which is the actual question. */}
            <Card
              variant="gradient"
              className={cn('border-agro-300', !window && 'border-amber-300')}
            >
              <div className="mb-1 flex items-center gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-agro-800">
                  Next good spray window
                </h4>
                {/* The one answer someone opens this tool for, spoken so it can
                    be heard with a sprayer already on your back. */}
                <SpeakButton
                  className="ml-auto"
                  label="next spray window"
                  text={
                    window
                      ? [
                          `The next good spray window starts at ${hourLabel(window.start.time)}`,
                          window.length > 1 && `It lasts about ${window.length} hours`,
                          window.start.reasons[0],
                        ]
                      : [
                          'There is no good spray window in the next 18 hours',
                          'Conditions stay outside the safe range. Re-check later rather than spraying now.',
                        ]
                  }
                />
              </div>
              {window ? (
                <>
                  <p className="text-xl font-black text-slate-900">
                    {hourLabel(window.start.time)}
                    {window.length > 1 && (
                      <span className="text-sm font-bold text-slate-600">
                        {' '}
                        for {window.length} hours
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-600">{window.start.reasons[0]}</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-black text-amber-800">None in the next 18 hours</p>
                  <p className="mt-1 text-xs font-medium text-slate-600">
                    Conditions stay outside the safe range. Re-check later rather than spraying now.
                  </p>
                </>
              )}
              <p className="mt-2 text-[11px] font-medium text-slate-500">
                {data.location.name}
                {data.location.region ? `, ${data.location.region}` : ''}
              </p>
            </Card>

            {/* Hour-by-hour, so a farmer can plan around work rather than just
                being told the single best moment. */}
            <div className="flex flex-col gap-1.5">
              {hours.map((hour) => (
                <SprayHourRow key={hour.time} hour={hour} />
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3">
              <div className="flex items-center gap-2">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                  How this is judged
                </p>
                <SpeakButton
                  className="ml-auto"
                  tone="subtle"
                  label="how spray conditions are judged"
                  text={[
                    'How spray conditions are judged',
                    'Delta T, the gap between air and wet-bulb temperature, measures how fast droplets evaporate. Two to eight is the target range.',
                    'Wind under 3 kilometres per hour is flagged too, because still air often means a temperature inversion that carries spray off-target later.',
                    'Rain within 2 hours washes product off before the crop absorbs it.',
                  ]}
                />
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                Delta T (the gap between air and wet-bulb temperature) measures how fast droplets
                evaporate; 2–8 is the target range. Wind under 3 km/h is flagged too, because still
                air often means a temperature inversion that carries spray off-target later. Rain
                within {2} hours washes product off before the crop absorbs it.
              </p>
            </div>
          </>
        )}

        <Button fullWidth size="lg" onClick={onClose}>
          Done
        </Button>
      </div>
    </Modal>
  );
};

const SprayHourRow: React.FC<{ hour: SprayHour }> = ({ hour }) => {
  const style = VERDICT_STYLE[hour.verdict];

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-3 py-2.5">
      <div className="flex w-14 shrink-0 flex-col">
        <span className="text-xs font-black text-slate-900">{hourLabel(hour.time)}</span>
        <span className={cn('mt-0.5 rounded-full px-1.5 py-0.5 text-center text-[9px] font-bold uppercase', style.chip)}>
          {style.label}
        </span>
      </div>

      <VerdictIcon verdict={hour.verdict} className="h-4 w-4 shrink-0" />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] font-semibold text-slate-600">
          <span className="flex items-center gap-1">
            <Thermometer className="h-3 w-3 text-slate-400" />
            {Math.round(hour.temperature)}°
          </span>
          <span className="flex items-center gap-1">
            <Wind className="h-3 w-3 text-slate-400" />
            {Math.round(hour.windSpeed)} km/h
          </span>
          <span className="flex items-center gap-1">
            <CloudRain className="h-3 w-3 text-slate-400" />
            {Math.round(hour.precipitationProbability)}%
          </span>
          <span className="text-slate-400">ΔT {hour.deltaT}</span>
        </div>
        <p className="truncate text-[11px] leading-tight text-slate-500">{hour.reasons[0]}</p>
      </div>
    </div>
  );
};
