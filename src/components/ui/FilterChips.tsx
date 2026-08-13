'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface FilterChipsProps {
  options: readonly string[];
  value: string;
  onChange: (option: string) => void;
  className?: string;
}

/**
 * Horizontally scrollable on phones; wraps onto one or two tidy rows once there
 * is room, so laptop users never have to drag a scroll strip.
 */
export const FilterChips: React.FC<FilterChipsProps> = ({
  options,
  value,
  onChange,
  className,
}) => (
  <div
    role="tablist"
    className={cn(
      'no-scrollbar -mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible md:pb-0',
      className
    )}
  >
    {options.map((option) => {
      const isActive = value === option;
      return (
        <button
          key={option}
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(option)}
          className={cn(
            'whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors',
            isActive
              ? 'bg-agro-600 text-white shadow-soft-sm'
              : 'border border-slate-200 bg-white text-slate-600 hover:border-agro-200 hover:text-agro-800'
          )}
        >
          {option}
        </button>
      );
    })}
  </div>
);
