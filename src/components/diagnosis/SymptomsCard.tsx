'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export interface SymptomsCardProps {
  symptoms: string[];
  causes: string[];
}

export const SymptomsCard: React.FC<SymptomsCardProps> = ({ symptoms, causes }) => {
  return (
    <Card className="flex flex-col gap-4 border-slate-100">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <h3 className="text-base font-black text-slate-900">
            Observed Symptoms
          </h3>
        </div>
        <ul className="flex flex-col gap-2">
          {symptoms.map((symptom, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span>{symptom}</span>
            </li>
          ))}
        </ul>
      </div>

      {causes && causes.length > 0 && (
        <div className="pt-3 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Root Causes:
          </h4>
          <ul className="flex flex-col gap-1.5">
            {causes.map((cause, idx) => (
              <li key={idx} className="text-xs text-slate-600 leading-normal">
                • {cause}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};
