'use client';

import React, { useMemo, useState } from 'react';
import { CalendarDays, Sprout, Scissors } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useCrops } from '@/hooks/useLeafCareData';
import { useLanguage } from '@/context/LanguageContext';
import { useAppState } from '@/context/AppStateContext';
import { SeasonStatus, formatWindow, monthName, seasonStatuses } from '@/lib/agronomy/calendar';
import { cn } from '@/lib/utils';

/** A twelve-month strip with the window highlighted, wrapping the year end. */
const MonthStrip: React.FC<{ from: number; to: number; tone: 'sow' | 'harvest'; now: number }> = ({
  from,
  to,
  tone,
  now,
}) => (
  <div className="flex gap-[2px]">
    {Array.from({ length: 12 }, (_, month) => {
      const active = from <= to ? month >= from && month <= to : month >= from || month <= to;
      return (
        <span
          key={month}
          title={monthName(month)}
          className={cn(
            'h-4 flex-1 rounded-[3px] text-[7px] font-bold leading-4 text-center',
            active
              ? tone === 'sow'
                ? 'bg-agro-500 text-white'
                : 'bg-amber-500 text-white'
              : 'bg-slate-100 text-slate-400',
            // The current month keeps a ring so "where am I now" is obvious.
            month === now && 'ring-2 ring-slate-900 ring-offset-1',
          )}
        >
          {monthName(month).charAt(0)}
        </span>
      );
    })}
  </div>
);

const SeasonCard: React.FC<{ status: SeasonStatus; now: number }> = ({ status, now }) => (
  <Card
    className={cn(
      'flex flex-col gap-2.5 border p-3.5',
      status.sowingNow ? 'border-agro-400 bg-agro-50/60' : 'border-slate-100 bg-white',
    )}
  >
    <div className="flex items-start justify-between gap-2">
      <div className="flex min-w-0 flex-col">
        <span className="text-sm font-black text-slate-900">{status.label}</span>
        <span className="text-[11px] font-medium leading-snug text-slate-500">
          {status.rationale}
        </span>
      </div>
      <span
        className={cn(
          'shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide',
          status.sowingNow
            ? 'bg-agro-600 text-white'
            : 'bg-slate-200/80 text-slate-600',
        )}
      >
        {status.sowingNow
          ? 'Sow now'
          : `In ${status.monthsUntilSowing} ${status.monthsUntilSowing === 1 ? 'month' : 'months'}`}
      </span>
    </div>

    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Sprout className="h-3.5 w-3.5 shrink-0 text-agro-600" />
        <span className="w-16 shrink-0 text-[11px] font-bold text-slate-700">Sowing</span>
        <span className="text-[11px] font-semibold text-slate-900">
          {formatWindow(status.sowFrom, status.sowTo)}
        </span>
      </div>
      <MonthStrip from={status.sowFrom} to={status.sowTo} tone="sow" now={now} />

      {/* A perennial has no meaningful harvest window, so it is not implied. */}
      {status.season !== 'perennial' && (
        <>
          <div className="mt-1 flex items-center gap-2">
            <Scissors className="h-3.5 w-3.5 shrink-0 text-amber-600" />
            <span className="w-16 shrink-0 text-[11px] font-bold text-slate-700">Harvest</span>
            <span className="text-[11px] font-semibold text-slate-900">
              {formatWindow(status.harvestFrom, status.harvestTo)}
            </span>
          </div>
          <MonthStrip
            from={status.harvestFrom}
            to={status.harvestTo}
            tone="harvest"
            now={now}
          />
        </>
      )}
    </div>
  </Card>
);

export const SowingCalendarModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { crops, status, error } = useCrops();
  const { language } = useLanguage();
  const { selectedCrops } = useAppState();
  const [cropId, setCropId] = useState<string | null>(null);

  // Defaults to the farmer's first crop rather than an arbitrary one.
  const activeId = cropId ?? selectedCrops[0] ?? crops[0]?.id ?? null;
  const crop = crops.find((entry) => entry.id === activeId) ?? null;

  // Read once per render rather than per season, so every card agrees.
  const currentMonth = useMemo(() => new Date().getMonth(), []);
  const statuses = useMemo(
    () => (crop ? seasonStatuses(crop.seasons, currentMonth) : []),
    [crop, currentMonth],
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sowing Calendar">
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-slate-900">Crop</label>
          <select
            value={activeId ?? ''}
            onChange={(event) => setCropId(event.target.value)}
            disabled={status !== 'ready'}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-800 disabled:opacity-60"
          >
            {status === 'loading' && <option>Loading crops…</option>}
            {crops.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.translatedNames[language] || entry.name}
              </option>
            ))}
          </select>
        </div>

        {status === 'error' && (
          <div className="rounded-2xl border border-dashed border-red-300 bg-red-50/60 px-4 py-8 text-center">
            <p className="text-sm font-bold text-red-700">Could not load crops</p>
            <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
          </div>
        )}

        {status === 'ready' && statuses.length > 0 && (
          <div className="flex flex-col gap-2.5">
            {statuses.map((entry) => (
              <SeasonCard key={entry.season} status={entry} now={currentMonth} />
            ))}
          </div>
        )}

        {status === 'ready' && crop && statuses.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-4 py-10 text-center">
            <CalendarDays className="mx-auto h-7 w-7 text-slate-400" />
            <p className="mt-2 text-sm font-bold text-slate-700">
              No season recorded for {crop.name}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Sowing windows appear once this crop has cropping seasons in the catalogue.
            </p>
          </div>
        )}

        <p className="text-[11px] leading-relaxed text-slate-500">
          Windows are typical for Indian cropping seasons and shift by a few weeks with latitude and
          monsoon onset. Check locally before sowing.
        </p>

        <Button fullWidth size="lg" onClick={onClose}>
          Done
        </Button>
      </div>
    </Modal>
  );
};
