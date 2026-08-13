'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface ProgressDotsProps {
  total: number;
  current: number;
}

export const ProgressDots: React.FC<ProgressDotsProps> = ({ total, current }) => {
  return (
    <div className="flex items-center gap-2 justify-center">
      {Array.from({ length: total }).map((_, idx) => {
        const isActive = idx === current;
        return (
          <motion.div
            key={idx}
            initial={false}
            animate={{
              width: isActive ? 24 : 8,
              backgroundColor: isActive ? '#16A34A' : '#CBD5E1'
            }}
            transition={{ duration: 0.3 }}
            className="h-2.5 rounded-full"
          />
        );
      })}
    </div>
  );
};
