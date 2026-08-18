'use client';

import React, { useMemo, useState } from 'react';
import { AlertTriangle, Droplets } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SpeakButton } from '@/components/voice/SpeakButton';
import {
  DoseBasis,
  SPRAYERS,
  SPRAY_VOLUMES,
  calculateDosage,
  dosageWarning,
} from '@/lib/agronomy/dosage';
import { cn } from '@/lib/utils';

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({
  label,
  hint,
  children,
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-bold text-slate-900">{label}</label>
    {children}
    {hint && <span className="text-[11px] font-medium text-slate-500">{hint}</span>}
  </div>
);

const selectClass =
  'w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-800';

export const PesticideDosageModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [areaAcres, setAreaAcres] = useState(1);
  const [tankLitres, setTankLitres] = useState(16);
  const [litresPerAcre, setLitresPerAcre] = useState(200);
  const [basis, setBasis] = useState<DoseBasis>('per_area');
  const [doseRate, setDoseRate] = useState(400);
  const [unit, setUnit] = useState<'ml' | 'g'>('ml');

  const result = useMemo(
    () => calculateDosage({ areaAcres, tankLitres, litresPerAcre, basis, doseRate }),
    [areaAcres, tankLitres, litresPerAcre, basis, doseRate],
  );

  const warning = dosageWarning(result);

  /** Switching basis carries a sensible default so the field is never absurd. */
  const changeBasis = (next: DoseBasis) => {
    setBasis(next);
    setDoseRate(next === 'per_area' ? 400 : 2);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pesticide Dosage">
      <div className="flex flex-col gap-5 pt-1">
        <Field label="Area to spray" hint={`${areaAcres} acre = ${(areaAcres * 0.4047).toFixed(2)} hectare`}>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0.25"
              max="25"
              step="0.25"
              value={areaAcres}
              onChange={(event) => setAreaAcres(parseFloat(event.target.value))}
              className="h-2 flex-1 rounded-lg bg-slate-200 accent-agro-600"
            />
            <span className="min-w-[78px] rounded-xl bg-agro-100 px-3 py-1 text-center text-base font-black text-agro-700">
              {areaAcres} ac
            </span>
          </div>
        </Field>

        <Field label="How is the label rate written?">
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { value: 'per_area', title: 'Per acre', example: 'e.g. 400 ml/acre' },
                { value: 'per_litre', title: 'Per litre of water', example: 'e.g. 2 ml/litre' },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                onClick={() => changeBasis(option.value)}
                aria-pressed={basis === option.value}
                className={cn(
                  'flex flex-col rounded-2xl border px-3 py-2.5 text-left transition-colors',
                  basis === option.value
                    ? 'border-agro-500 bg-agro-50 text-agro-900'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-agro-200',
                )}
              >
                <span className="text-xs font-black">{option.title}</span>
                <span className="text-[10px] font-medium text-slate-500">{option.example}</span>
              </button>
            ))}
          </div>
        </Field>

        <Field
          label={`Label rate (${unit} ${basis === 'per_area' ? 'per acre' : 'per litre'})`}
          hint="Read this straight off the product label — do not convert it yourself."
        >
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              step="0.1"
              value={doseRate}
              onChange={(event) => setDoseRate(Math.max(0, parseFloat(event.target.value) || 0))}
              className={cn(selectClass, 'flex-1')}
            />
            <select
              value={unit}
              onChange={(event) => setUnit(event.target.value as 'ml' | 'g')}
              className={cn(selectClass, 'w-24')}
            >
              <option value="ml">ml</option>
              <option value="g">g</option>
            </select>
          </div>
        </Field>

        <Field label="Spray volume" hint="Driven by canopy size, not by the product.">
          <select
            value={litresPerAcre}
            onChange={(event) => setLitresPerAcre(parseInt(event.target.value, 10))}
            className={selectClass}
          >
            {SPRAY_VOLUMES.map((option) => (
              <option key={option.litresPerAcre} value={option.litresPerAcre}>
                {option.label} — {option.litresPerAcre} L/acre ({option.hint})
              </option>
            ))}
          </select>
        </Field>

        <Field label="Sprayer tank">
          <select
            value={tankLitres}
            onChange={(event) => setTankLitres(parseInt(event.target.value, 10))}
            className={selectClass}
          >
            {SPRAYERS.map((sprayer) => (
              <option key={sprayer.litres} value={sprayer.litres}>
                {sprayer.label} — {sprayer.litres} L
              </option>
            ))}
          </select>
        </Field>

        <Card variant="gradient" className="border-agro-300">
          <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-agro-800">
            <Droplets className="h-3.5 w-3.5" />
            Mixing plan
            {/* Read at the tank, hands wet, phone in a pocket — this one earns
                its place more than any other button in the app. */}
            <SpeakButton
              className="ml-auto"
              label="mixing plan"
              text={[
                'Mixing plan',
                `Total water ${result.totalWaterLitres} litres`,
                `Total product ${result.totalProduct} ${unit}`,
                `${result.fullTanks} full ${result.fullTanks === 1 ? 'tank' : 'tanks'} of ${tankLitres} litres, ${result.productPerTank} ${unit} in each`,
                result.partTankLitres > 0 &&
                  `Final part tank of ${result.partTankLitres} litres takes ${result.productPartTank} ${unit}`,
                `Working strength ${result.concentrationPerLitre} ${unit} per litre`,
                warning,
              ]}
            />
          </h4>

          <div className="grid grid-cols-2 gap-2.5 text-center">
            <div className="rounded-2xl border border-slate-100 bg-white p-3">
              <span className="block text-xs font-semibold text-slate-500">Total water</span>
              <span className="mt-1 block text-xl font-black text-agro-700">
                {result.totalWaterLitres} L
              </span>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-3">
              <span className="block text-xs font-semibold text-slate-500">Total product</span>
              <span className="mt-1 block text-xl font-black text-agro-700">
                {result.totalProduct} {unit}
              </span>
            </div>
          </div>

          <div className="mt-2.5 flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-3">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-xs font-semibold text-slate-500">
                {result.fullTanks} full {result.fullTanks === 1 ? 'tank' : 'tanks'} of {tankLitres} L
              </span>
              <span className="text-sm font-black text-slate-900">
                {result.productPerTank} {unit} each
              </span>
            </div>

            {/* Shown separately so the last strip is not over-dosed. */}
            {result.partTankLitres > 0 && (
              <div className="flex items-baseline justify-between gap-3 border-t border-slate-100 pt-2">
                <span className="text-xs font-semibold text-slate-500">
                  Final part tank — {result.partTankLitres} L
                </span>
                <span className="text-sm font-black text-slate-900">
                  {result.productPartTank} {unit}
                </span>
              </div>
            )}

            <div className="flex items-baseline justify-between gap-3 border-t border-slate-100 pt-2">
              <span className="text-xs font-semibold text-slate-500">Working strength</span>
              <span className="text-sm font-black text-slate-900">
                {result.concentrationPerLitre} {unit}/L
              </span>
            </div>
          </div>
        </Card>

        {warning && (
          <div className="flex items-start gap-2 rounded-2xl border border-amber-300 bg-amber-50 px-3.5 py-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-xs font-medium leading-relaxed text-amber-900">{warning}</p>
          </div>
        )}

        <div className="flex items-start gap-2">
          <p className="text-[11px] leading-relaxed text-slate-500">
            Always follow the product label and your local agricultural officer. Wear protective
            equipment and observe the pre-harvest interval before picking.
          </p>
          <SpeakButton
            tone="subtle"
            label="safety notice"
            text="Always follow the product label and your local agricultural officer. Wear protective equipment and observe the pre-harvest interval before picking."
          />
        </div>

        <Button fullWidth size="lg" onClick={onClose}>
          Done
        </Button>
      </div>
    </Modal>
  );
};
