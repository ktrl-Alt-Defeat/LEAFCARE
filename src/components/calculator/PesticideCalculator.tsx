'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplets,
  Package,
  RotateCcw,
  Calculator,
  AlertCircle,
  CheckCircle2,
  Info,
  Layers,
  Gauge,
  FlaskConical,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import {
  PesticideFormulation,
  PesticideCalculatorInputs,
  PesticideCalculationResult,
  PesticideValidationErrors,
  calculatePesticideDosage,
  validatePesticideInputs,
} from '@/lib/pesticide-calculator';

export interface PesticideCalculatorProps {
  onSuccess?: (result: PesticideCalculationResult) => void;
  className?: string;
  isModal?: boolean;
}

const COMMON_TANK_SIZES = ['10', '12', '16', '20', '25', '30'];

export const PesticideCalculator: React.FC<PesticideCalculatorProps> = ({
  onSuccess,
  className,
  isModal = false,
}) => {
  const [formulation, setFormulation] = useState<PesticideFormulation>('liquid');
  const [recommendedDose, setRecommendedDose] = useState<string>('');
  const [sprayVolume, setSprayVolume] = useState<string>('200');
  const [tankCapacity, setTankCapacity] = useState<string>('16');
  const [errors, setErrors] = useState<PesticideValidationErrors>({});
  const [result, setResult] = useState<PesticideCalculationResult | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const doseUnitLabel = formulation === 'liquid' ? 'mL/acre' : 'g/acre';
  const doseInputPlaceholder = formulation === 'liquid' ? 'e.g. 400' : 'e.g. 500';

  const handleFormulationChange = (newFormulation: PesticideFormulation) => {
    if (newFormulation === formulation) return;
    setFormulation(newFormulation);
    // Clear previous result and errors when switching formulation to ensure clarity
    setResult(null);
    setErrors({});
  };

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const currentInputs: PesticideCalculatorInputs = {
      formulation,
      recommendedDose,
      sprayVolume,
      tankCapacity,
    };

    const validation = validatePesticideInputs(currentInputs);
    setTouched({
      recommendedDose: true,
      sprayVolume: true,
      tankCapacity: true,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      setResult(null);
      return;
    }

    setErrors({});
    const calcResult = calculatePesticideDosage(currentInputs);
    setResult(calcResult);
    if (onSuccess) {
      onSuccess(calcResult);
    }
  };

  const handleReset = () => {
    setFormulation('liquid');
    setRecommendedDose('');
    setSprayVolume('200');
    setTankCapacity('16');
    setErrors({});
    setTouched({});
    setResult(null);
  };

  const handleInputChange = (
    field: 'recommendedDose' | 'sprayVolume' | 'tankCapacity',
    value: string
  ) => {
    // Allow empty or positive numeric input (including decimals)
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      if (field === 'recommendedDose') setRecommendedDose(value);
      if (field === 'sprayVolume') setSprayVolume(value);
      if (field === 'tankCapacity') setTankCapacity(value);

      // If user had an error for this field, revalidate live on change
      if (errors[field]) {
        const nextErrors = { ...errors };
        delete nextErrors[field];
        setErrors(nextErrors);
      }
    }
  };

  const handleBlur = (field: 'recommendedDose' | 'sprayVolume' | 'tankCapacity') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const currentInputs: PesticideCalculatorInputs = {
      formulation,
      recommendedDose,
      sprayVolume,
      tankCapacity,
    };
    const validation = validatePesticideInputs(currentInputs);
    if (validation.errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validation.errors[field] }));
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Header Info */}
      {!isModal && (
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-agro-100 text-agro-700 shadow-soft-sm mt-0.5">
              <FlaskConical className="h-5 w-5" />
            </span>
            <div className="flex flex-col gap-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
                Pesticide Dosage Calculator
              </h1>
                              <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed mt-2">
                Calculate the required pesticide quantity for your spray tank.
              </p>
            </div>
          </div>
        </div>
      )}

      {isModal && (
        <div className="text-xs font-medium text-slate-500 mt-3 leading-relaxed">
          Calculate the required pesticide quantity for your spray tank.
        </div>
      )}

      {/* Main Calculator Card */}
      <Card className="border border-slate-200/80 shadow-soft-md p-5 sm:p-6 bg-white rounded-3xl">
        <form onSubmit={handleCalculate} noValidate className="flex flex-col gap-5">
          {/* Formulation Type Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-between">
              <span>Pesticide Formulation</span>
              <span className="text-[11px] font-semibold text-slate-400">Select formulation</span>
            </label>

            <div
              role="radiogroup"
              aria-label="Pesticide formulation type"
              className="grid grid-cols-2 gap-2.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/60"
            >
              <button
                type="button"
                role="radio"
                aria-checked={formulation === 'liquid'}
                onClick={() => handleFormulationChange('liquid')}
                className={cn(
                  'flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 select-none',
                  formulation === 'liquid'
                    ? 'bg-agro-600 text-white shadow-soft-md shadow-agro-600/30 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium'
                )}
              >
                <Droplets className={cn('h-4 w-4', formulation === 'liquid' ? 'text-white' : 'text-agro-600')} />
                <span>Liquid</span>
                <span className={cn('text-[10px] ml-0.5 px-1.5 py-0.2 rounded-md', formulation === 'liquid' ? 'bg-agro-700/50 text-agro-50' : 'bg-slate-200 text-slate-600')}>
                  mL
                </span>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={formulation === 'solid'}
                onClick={() => handleFormulationChange('solid')}
                className={cn(
                  'flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 select-none',
                  formulation === 'solid'
                    ? 'bg-agro-600 text-white shadow-soft-md shadow-agro-600/30 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium'
                )}
              >
                <Package className={cn('h-4 w-4', formulation === 'solid' ? 'text-white' : 'text-agro-600')} />
                <span>Solid</span>
                <span className={cn('text-[10px] ml-0.5 px-1.5 py-0.2 rounded-md', formulation === 'solid' ? 'bg-agro-700/50 text-agro-50' : 'bg-slate-200 text-slate-600')}>
                  g
                </span>
              </button>
            </div>
          </div>

          {/* Form Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Recommended Dose Input */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label
                htmlFor="recommended-dose-input"
                className="text-xs sm:text-sm font-bold text-slate-900"
              >
                Recommended Dose
                <span className="ml-1 text-slate-500 font-semibold">
                  ({doseUnitLabel})
                </span>
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  id="recommended-dose-input"
                  type="text"
                  inputMode="decimal"
                  value={recommendedDose}
                  onChange={(e) => handleInputChange('recommendedDose', e.target.value)}
                  onBlur={() => handleBlur('recommendedDose')}
                  placeholder={doseInputPlaceholder}
                  aria-invalid={!!errors.recommendedDose}
                  aria-describedby={errors.recommendedDose ? 'dose-error' : undefined}
                  className={cn(
                    'w-full rounded-2xl border px-4 py-3.5 text-sm font-bold text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-4',
                    errors.recommendedDose
                      ? 'border-red-400 bg-red-50/30 text-red-900 focus:border-red-500 focus:ring-red-200'
                      : 'border-slate-200 bg-slate-50/70 focus:border-agro-600 focus:bg-white focus:ring-agro-100'
                  )}
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 pointer-events-none">
                  {formulation === 'liquid' ? 'mL/acre' : 'g/acre'}
                </div>
              </div>
              {errors.recommendedDose && (
                <p id="dose-error" className="flex items-center gap-1.5 text-xs font-semibold text-red-600 mt-0.5">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{errors.recommendedDose}</span>
                </p>
              )}
            </div>

            {/* 2. Water Volume Input */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="spray-volume-input"
                className="text-xs sm:text-sm font-bold text-slate-900"
              >
                Water Volume
                <span className="ml-1 text-slate-500 font-semibold">(L/acre)</span>
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  id="spray-volume-input"
                  type="text"
                  inputMode="decimal"
                  value={sprayVolume}
                  onChange={(e) => handleInputChange('sprayVolume', e.target.value)}
                  onBlur={() => handleBlur('sprayVolume')}
                  placeholder="e.g. 200"
                  aria-invalid={!!errors.sprayVolume}
                  aria-describedby={errors.sprayVolume ? 'spray-volume-error' : undefined}
                  className={cn(
                    'w-full rounded-2xl border px-4 py-3.5 text-sm font-bold text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-4',
                    errors.sprayVolume
                      ? 'border-red-400 bg-red-50/30 text-red-900 focus:border-red-500 focus:ring-red-200'
                      : 'border-slate-200 bg-slate-50/70 focus:border-agro-600 focus:bg-white focus:ring-agro-100'
                  )}
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 pointer-events-none">
                  L/acre
                </div>
              </div>
              {errors.sprayVolume && (
                <p id="spray-volume-error" className="flex items-center gap-1.5 text-xs font-semibold text-red-600 mt-0.5">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{errors.sprayVolume}</span>
                </p>
              )}
            </div>

            {/* 3. Sprayer Size Input */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="tank-capacity-input"
                className="text-xs sm:text-sm font-bold text-slate-900"
              >
                Sprayer Size
                <span className="ml-1 text-slate-500 font-semibold">(L/tank)</span>
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  id="tank-capacity-input"
                  type="text"
                  inputMode="decimal"
                  value={tankCapacity}
                  onChange={(e) => handleInputChange('tankCapacity', e.target.value)}
                  onBlur={() => handleBlur('tankCapacity')}
                  placeholder="e.g. 16"
                  aria-invalid={!!errors.tankCapacity}
                  aria-describedby={errors.tankCapacity ? 'tank-capacity-error' : undefined}
                  className={cn(
                    'w-full rounded-2xl border px-4 py-3.5 text-sm font-bold text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-4',
                    errors.tankCapacity
                      ? 'border-red-400 bg-red-50/30 text-red-900 focus:border-red-500 focus:ring-red-200'
                      : 'border-slate-200 bg-slate-50/70 focus:border-agro-600 focus:bg-white focus:ring-agro-100'
                  )}
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 pointer-events-none">
                  L/tank
                </div>
              </div>
              {errors.tankCapacity && (
                <p id="tank-capacity-error" className="flex items-center gap-1.5 text-xs font-semibold text-red-600 mt-0.5">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{errors.tankCapacity}</span>
                </p>
              )}
            </div>
          </div>

          {/* Common Tank Size Quick Chips */}
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Quick Tank Presets:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {COMMON_TANK_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleInputChange('tankCapacity', size)}
                  className={cn(
                    'px-2.5 py-1 text-xs font-bold rounded-xl border transition-all',
                    tankCapacity === size
                      ? 'bg-agro-600 border-agro-600 text-white shadow-soft-sm'
                      : 'bg-slate-100 border-slate-200/80 text-slate-700 hover:bg-slate-200/70'
                  )}
                >
                  {size} L
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              icon={<Calculator className="h-5 w-5" />}
              className="font-bold tracking-wide"
            >
              Calculate Dosage
            </Button>

            {(result || recommendedDose || sprayVolume !== '200' || tankCapacity !== '16') && (
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={handleReset}
                icon={<RotateCcw className="h-4 w-4" />}
                className="shrink-0 text-slate-500 hover:text-slate-800"
                title="Reset Calculator"
              >
                Reset
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Prominent Result Section */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex flex-col gap-4"
          >
            <Card
              variant="gradient"
              className="border-2 border-agro-300 shadow-soft-lg p-5 sm:p-6 bg-gradient-to-br from-agro-50 via-white to-emerald-50/60 rounded-3xl relative overflow-hidden"
            >
              {/* Decorative background highlight */}
              <div className="absolute top-0 right-0 -mr-12 -mt-12 h-40 w-40 rounded-full bg-agro-200/30 blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col gap-4">
                {/* Result Header */}
                <div className="flex items-center gap-2 border-b border-agro-200/60 pb-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-agro-600 text-white shadow-soft-sm">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <h3 className="text-sm font-black uppercase tracking-wider text-agro-900">
                    Pesticide Required Per Tank
                  </h3>
                </div>

                {/* Primary Number Display */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 bg-white/90 p-4 sm:p-5 rounded-2xl border border-agro-200/80 shadow-soft-sm">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Per Tank
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-3xl sm:text-4xl font-black text-agro-700 tracking-tight">
                        {result.pesticideRequired}
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-agro-800">
                        {result.unit}
                      </span>
                      <span className="text-sm font-bold text-slate-400">
                        / {result.tankCapacity}L tank
                      </span>
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-agro-800 bg-agro-50 sm:bg-transparent px-2.5 py-1.5 sm:p-0 rounded-xl sm:text-right">
                    {result.displaySummary}
                  </div>
                </div>

                {/* Calculation Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-white/80 p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col">
                    <span className="text-[11px] font-semibold text-slate-500">Formulation</span>
                    <span className="text-sm font-black text-slate-800 mt-0.5">
                      {result.formulation === 'liquid' ? 'Liquid Formulation' : 'Solid Formulation'}
                    </span>
                  </div>

                  <div className="bg-white/80 p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col">
                    <span className="text-[11px] font-semibold text-slate-500">Recommended Dose</span>
                    <span className="text-sm font-black text-slate-800 mt-0.5">
                      {result.recommendedDose} {result.doseUnit}
                    </span>
                  </div>

                  <div className="bg-white/80 p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col">
                    <span className="text-[11px] font-semibold text-slate-500">Water Volume</span>
                    <span className="text-sm font-black text-slate-800 mt-0.5">
                      {result.sprayVolume} {result.volumeUnit}
                    </span>
                  </div>

                  <div className="bg-white/80 p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col">
                    <span className="text-[11px] font-semibold text-slate-500">Tank Capacity</span>
                    <span className="text-sm font-black text-slate-800 mt-0.5">
                      {result.tankCapacity} {result.tankUnit}
                    </span>
                  </div>
                </div>

                {/* Practical Mixing Guidance */}
                <div className="flex items-start gap-2.5 bg-agro-100/70 p-3 rounded-xl border border-agro-200/80 text-xs text-agro-900 font-medium leading-relaxed">
                  <Info className="h-4 w-4 text-agro-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Mixing instruction:</strong> For one <strong>{result.tankCapacity} L</strong> spray tank, measure <strong>{result.pesticideRequired} {result.unit}</strong> of pesticide, pre-mix in a small quantity of clean water, then pour into the tank and fill with water up to {result.tankCapacity} L.
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Safety & Agricultural Disclaimer */}
      <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-amber-950 shadow-soft-sm">
        <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5 text-xs leading-relaxed">
          <span className="font-bold text-amber-900 uppercase tracking-wider text-[10px]">
            Agricultural &amp; Safety Disclaimer
          </span>
          <p className="text-amber-800 font-medium">
            Use only the dose recommended on the pesticide product label or by an authorized agricultural professional. This calculator only converts the recommended area-based dose into the quantity required for the selected spray tank.
          </p>
        </div>
      </div>
    </div>
  );
};
