'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';

export interface ConfidenceMeterProps {
  confidence: number;
  severity: 'low' | 'moderate' | 'high' | 'severe';
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  confidence,
  severity
}) => {
  const getSeverityBadge = () => {
    switch (severity) {
      case 'low':
        return <Badge variant="success">Minor Damage</Badge>;
      case 'moderate':
        return <Badge variant="warning">Needs Attention</Badge>;
      case 'high':
        return <Badge variant="danger">High Risk</Badge>;
      case 'severe':
        return <Badge variant="danger">Critical Outbreak</Badge>;
      default:
        return <Badge variant="warning">Attention</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            AI Diagnosis Confidence:
          </span>
          <span className="text-sm font-black text-agro-700">{confidence}%</span>
        </div>
        {getSeverityBadge()}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${confidence}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-agro-500 to-emerald-600"
        />
      </div>
    </div>
  );
};
