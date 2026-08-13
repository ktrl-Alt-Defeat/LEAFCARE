'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export interface PreventionCardProps {
  preventionTips: string[];
  disclaimer: string;
}

export const PreventionCard: React.FC<PreventionCardProps> = ({
  preventionTips,
  disclaimer
}) => {
  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-3 border-slate-100">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-black text-slate-900">
            Prevention & Cultural Practices
          </h3>
        </div>
        <ul className="flex flex-col gap-2">
          {preventionTips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Mandatory Safety Disclaimer Alert */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs font-medium leading-relaxed">
          {disclaimer}
        </p>
      </div>
    </div>
  );
};
