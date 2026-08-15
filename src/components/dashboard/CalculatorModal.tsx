'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PesticideCalculator } from '@/components/calculator/PesticideCalculator';

export interface CalculatorModalProps {
  type: 'fertilizer' | 'pesticide' | null;
  onClose: () => void;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({
  type,
  onClose,
}) => {
  const [landArea, setLandArea] = useState<number>(1);
  const [cropType, setCropType] = useState<string>('Rice');

  // Don't render the modal when no calculator is selected.
  if (!type) {
    return null;
  }

  // Fertilizer dosage calculation.
  // Per acre:
  // Urea = 50 kg = 1 bag
  // DAP = 25 kg = 0.5 bag
  // MOP = 25 kg = 0.5 bag
  const ureaBags = (landArea * 1).toFixed(1);
  const dapBags = (landArea * 0.5).toFixed(1);
  const mopBags = (landArea * 0.5).toFixed(1);

  return (
    <Modal
      isOpen={!!type}
      onClose={onClose}
      title={
        type === 'fertilizer'
          ? 'Fertilizer Calculator'
          : 'Pesticide Dosage Calculator'
      }
    >
      {type === 'pesticide' ? (
        /* ================================
           PESTICIDE CALCULATOR
           ================================ */
        <div className="pt-1">
          <PesticideCalculator isModal />
        </div>
      ) : (
        /* ================================
           FERTILIZER CALCULATOR
           ================================ */
        <div className="flex flex-col gap-5 pt-1">
          {/* Land Area */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-900">
              Land Area (in Acres):
            </label>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0.5"
                max="25"
                step="0.5"
                value={landArea}
                onChange={(e) =>
                  setLandArea(parseFloat(e.target.value))
                }
                className="flex-1 accent-agro-600 h-2 bg-slate-200 rounded-lg"
              />

              <span className="text-base font-black text-agro-700 min-w-[70px] px-3 py-1 bg-agro-100 rounded-xl text-center">
                {landArea} Acre
              </span>
            </div>
          </div>

          {/* Crop Selection */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="crop-type"
              className="text-sm font-bold text-slate-900"
            >
              Select Crop:
            </label>

            <select
              id="crop-type"
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800"
            >
              <option value="Rice">Rice (Paddy)</option>
              <option value="Tomato">Tomato</option>
              <option value="Wheat">Wheat</option>
              <option value="Cotton">Cotton</option>
              <option value="Chili">Chili</option>
            </select>
          </div>

          {/* Fertilizer Dosage Result */}
          <Card variant="gradient" className="border-agro-300">
            <h4 className="text-xs font-bold text-agro-800 uppercase tracking-wider mb-3">
              Recommended Basal Dosage for {landArea} Acre {cropType}:
            </h4>

            <div className="grid grid-cols-3 gap-2 text-center">
              {/* Urea */}
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                <span className="text-xs text-slate-500 font-semibold block">
                  Urea (46% N)
                </span>

                <span className="text-lg font-black text-agro-700 mt-1 block">
                  {ureaBags} Bags
                </span>

                <span className="text-[10px] text-slate-400">
                  ({parseFloat(ureaBags) * 50} kg)
                </span>
              </div>

              {/* DAP */}
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                <span className="text-xs text-slate-500 font-semibold block">
                  DAP (18-46)
                </span>

                <span className="text-lg font-black text-agro-700 mt-1 block">
                  {dapBags} Bags
                </span>

                <span className="text-[10px] text-slate-400">
                  ({parseFloat(dapBags) * 50} kg)
                </span>
              </div>

              {/* MOP */}
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                <span className="text-xs text-slate-500 font-semibold block">
                  MOP (Potash)
                </span>

                <span className="text-lg font-black text-agro-700 mt-1 block">
                  {mopBags} Bags
                </span>

                <span className="text-[10px] text-slate-400">
                  ({parseFloat(mopBags) * 50} kg)
                </span>
              </div>
            </div>
          </Card>

          {/* Close */}
          <Button fullWidth onClick={onClose} size="lg">
            Done
          </Button>
        </div>
      )}
    </Modal>
  );
};