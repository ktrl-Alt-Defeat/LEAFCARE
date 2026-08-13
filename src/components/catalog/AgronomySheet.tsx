'use client';

import React from 'react';
import {
  Thermometer,
  Sun,
  CloudRain,
  Droplets,
  Waves,
  Layers,
  FlaskConical,
  ArrowDownToLine,
  RefreshCw,
  HardHat,
  Sprout,
  MoveHorizontal,
  MoveVertical,
  Handshake,
  Ban,
  type LucideIcon,
} from 'lucide-react';
import { CropAgronomy } from '@/types';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/* Building blocks                                                            */
/* -------------------------------------------------------------------------- */

const SheetCard: React.FC<{
  title: string;
  icon: LucideIcon;
  accent: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, icon: Icon, accent, children, className }) => (
  <section
    className={cn(
      'flex flex-col gap-3 rounded-3xl border border-slate-100 bg-white p-5 shadow-soft-sm',
      className
    )}
  >
    <h2 className="flex items-center gap-2.5 text-sm font-black uppercase tracking-wide text-slate-900">
      <span className={cn('flex h-8 w-8 items-center justify-center rounded-xl', accent)}>
        <Icon className="h-4 w-4" />
      </span>
      {title}
    </h2>
    {children}
  </section>
);

const DataRow: React.FC<{ icon: LucideIcon; label: string; value: string }> = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className="flex items-start justify-between gap-3 border-b border-slate-100 py-2 last:border-0 last:pb-0">
    <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
      <Icon className="h-4 w-4 shrink-0 text-slate-400" />
      {label}
    </span>
    <span className="text-right text-xs font-bold text-slate-900">{value}</span>
  </div>
);

/** Three-step meter for the labour requirement. */
const LabourMeter: React.FC<{ level: CropAgronomy['cultivation']['labour'] }> = ({ level }) => {
  const filled = level === 'Low' ? 1 : level === 'Medium' ? 2 : 3;
  const tone =
    level === 'Low' ? 'bg-emerald-500' : level === 'Medium' ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <span className="flex items-center gap-2">
      <span className="flex items-end gap-0.5" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className={cn(
              'w-1.5 rounded-full',
              index === 0 ? 'h-2' : index === 1 ? 'h-3' : 'h-4',
              index < filled ? tone : 'bg-slate-200'
            )}
          />
        ))}
      </span>
      <span className="text-xs font-bold text-slate-900">{level}</span>
    </span>
  );
};

/** Plots the crop's preferred pH band on an acid → alkaline scale. */
const PhScale: React.FC<{ range: string }> = ({ range }) => {
  const SCALE_MIN = 3.5;
  const SCALE_MAX = 9;

  const matches = range.match(/\d+(\.\d+)?/g);
  const from = matches?.[0] ? parseFloat(matches[0]) : null;
  const to = matches?.[1] ? parseFloat(matches[1]) : from;

  const toPercent = (value: number) =>
    ((Math.min(Math.max(value, SCALE_MIN), SCALE_MAX) - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;

  const left = from === null ? 0 : toPercent(from);
  const width = from === null || to === null ? 0 : Math.max(toPercent(to) - left, 2.5);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium text-slate-500">Soil pH</span>
        <span className="text-sm font-black text-slate-900">{range}</span>
      </div>

      {/* Stops are placed so the neutral band sits at pH 7 on the 3.5–9 scale. */}
      <div
        className="relative h-2.5 w-full overflow-hidden rounded-full"
        style={{
          background:
            'linear-gradient(to right, #FDA4AF 0%, #FCD34D 40%, #6EE7B7 64%, #7DD3FC 100%)',
        }}
      >
        {from !== null && (
          <span
            className="absolute inset-y-0 rounded-full bg-slate-900/85 ring-2 ring-white"
            style={{ left: `${left}%`, width: `${width}%` }}
            aria-hidden="true"
          />
        )}
      </div>

      <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        <span>Acidic 3.5</span>
        <span>Neutral 7</span>
        <span>Alkaline 9</span>
      </div>
    </div>
  );
};

const NutrientTile: React.FC<{ symbol: string; name: string; value: string; tone: string }> = ({
  symbol,
  name,
  value,
  tone,
}) => (
  <div className="flex flex-col items-center gap-1 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-center">
    <span
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full text-sm font-black',
        tone
      )}
    >
      {symbol}
    </span>
    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{name}</span>
    <span className="text-xs font-black leading-tight text-slate-900">{value}</span>
  </div>
);

const CompanionList: React.FC<{
  title: string;
  items: string[];
  variant: 'good' | 'bad';
}> = ({ title, items, variant }) => {
  const isGood = variant === 'good';

  return (
    <div className="flex flex-col gap-2">
      <span
        className={cn(
          'flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide',
          isGood ? 'text-emerald-700' : 'text-rose-700'
        )}
      >
        {isGood ? <Handshake className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
        {title}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className={cn(
              'rounded-full border px-2.5 py-1 text-xs font-semibold',
              isGood
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-rose-200 bg-rose-50 text-rose-800'
            )}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Sheet                                                                      */
/* -------------------------------------------------------------------------- */

export const AgronomySheet: React.FC<{ agronomy: CropAgronomy }> = ({ agronomy }) => {
  const { growing, soil, cultivation, nutrients, companions } = agronomy;

  return (
    <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
      <SheetCard title="Growing conditions" icon={Sun} accent="bg-amber-100 text-amber-700">
        <div className="flex flex-col">
          <DataRow icon={Thermometer} label="Temperature" value={growing.temperature} />
          <DataRow icon={Sun} label="Exposure" value={growing.exposure} />
          <DataRow icon={CloudRain} label="Rainfall" value={growing.rainfall} />
          {growing.humidity && (
            <DataRow icon={Droplets} label="Relative humidity" value={growing.humidity} />
          )}
          <DataRow icon={Waves} label="Watering" value={growing.watering} />
        </div>
      </SheetCard>

      <SheetCard title="Soil parameters" icon={Layers} accent="bg-earth-100 text-earth-700">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <DataRow icon={Layers} label="Soil type" value={soil.type} />
            <DataRow icon={FlaskConical} label="pH range" value={soil.ph} />
            {soil.drainage && (
              <DataRow icon={ArrowDownToLine} label="Drainage" value={soil.drainage} />
            )}
          </div>
          <PhScale range={soil.ph} />
        </div>
      </SheetCard>

      <SheetCard title="Cultivation" icon={Sprout} accent="bg-agro-100 text-agro-700">
        <div className="flex flex-col">
          <DataRow icon={RefreshCw} label="Life cycle" value={cultivation.lifeCycle} />

          <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-2">
            <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <HardHat className="h-4 w-4 shrink-0 text-slate-400" />
              Labour
            </span>
            <LabourMeter level={cultivation.labour} />
          </div>

          <DataRow icon={Sprout} label="Planting method" value={cultivation.plantingMethod} />
          <DataRow icon={MoveHorizontal} label="Row to row" value={cultivation.rowSpacing} />
          <DataRow icon={MoveVertical} label="Plant to plant" value={cultivation.plantSpacing} />
        </div>
      </SheetCard>

      <div className="flex flex-col gap-4 lg:gap-5">
        <SheetCard
          title="Nutrient requirement"
          icon={FlaskConical}
          accent="bg-sky-100 text-sky-700"
        >
          <div className="grid grid-cols-3 gap-2.5">
            <NutrientTile
              symbol="N"
              name="Nitrogen"
              value={nutrients.nitrogen}
              tone="bg-emerald-100 text-emerald-700"
            />
            <NutrientTile
              symbol="P"
              name="Phosphorus"
              value={nutrients.phosphorus}
              tone="bg-amber-100 text-amber-700"
            />
            <NutrientTile
              symbol="K"
              name="Potassium"
              value={nutrients.potassium}
              tone="bg-purple-100 text-purple-700"
            />
          </div>
        </SheetCard>

        <SheetCard
          title="Crop combinations"
          icon={Handshake}
          accent="bg-teal-100 text-teal-700"
          className="flex-1"
        >
          <div className="flex flex-col gap-4">
            <CompanionList title="Good companions" items={companions.good} variant="good" />
            <CompanionList title="Avoid planting with" items={companions.bad} variant="bad" />
          </div>
        </SheetCard>
      </div>
    </div>
  );
};
