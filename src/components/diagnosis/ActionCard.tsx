'use client';

import React, { useState } from 'react';
import { ShieldCheck, Leaf, Syringe } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { SpeakButton } from '@/components/voice/SpeakButton';

export interface ActionCardProps {
  immediateSteps: string[];
  organicTreatment: string[];
  chemicalTreatment: string[];
}

export const ActionCard: React.FC<ActionCardProps> = ({
  immediateSteps,
  organicTreatment,
  chemicalTreatment
}) => {
  const [activeTab, setActiveTab] = useState<'immediate' | 'organic' | 'chemical'>('immediate');

  // The card shows one tab at a time, so reading it aloud follows the same
  // rule: what you can see is what you hear, numbered the way it is displayed.
  const spokenPlan = {
    immediate: { title: 'Immediate steps', steps: immediateSteps },
    organic: { title: 'Organic treatment', steps: organicTreatment },
    chemical: { title: 'Chemical treatment', steps: chemicalTreatment },
  }[activeTab];

  return (
    <Card className="flex flex-col gap-4 border-agro-200/80 bg-gradient-to-b from-agro-50/30 to-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-agro-600" />
          <h3 className="text-base font-black text-slate-900">
            Recommended Action Plan
          </h3>
        </div>

        <SpeakButton
          label={spokenPlan.title.toLowerCase()}
          text={[
            `Recommended action plan. ${spokenPlan.title}`,
            ...spokenPlan.steps.map((step, index) => `Step ${index + 1}. ${step}`),
          ]}
        />
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab('immediate')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'immediate'
              ? 'bg-white text-agro-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Immediate
        </button>
        <button
          onClick={() => setActiveTab('organic')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
            activeTab === 'organic'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Leaf className="w-3 h-3 text-emerald-600" />
          Organic
        </button>
        <button
          onClick={() => setActiveTab('chemical')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
            activeTab === 'chemical'
              ? 'bg-white text-blue-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Syringe className="w-3 h-3 text-blue-600" />
          Chemical
        </button>
      </div>

      {/* Tab Content List */}
      <div className="flex flex-col gap-2 min-h-[120px]">
        {activeTab === 'immediate' && (
          <ul className="flex flex-col gap-2.5">
            {immediateSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs font-semibold text-slate-800">
                <span className="w-5 h-5 rounded-full bg-agro-100 text-agro-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        )}

        {activeTab === 'organic' && (
          <ul className="flex flex-col gap-2.5">
            {organicTreatment.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                <span className="text-emerald-600 text-base leading-none">🌿</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        {activeTab === 'chemical' && (
          <ul className="flex flex-col gap-2.5">
            {chemicalTreatment.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                <span className="text-blue-600 text-base leading-none">🧪</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
};
