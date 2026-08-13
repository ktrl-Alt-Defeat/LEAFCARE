'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'flat' | 'outline' | 'gradient';
  selected?: boolean;
  clickable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  children,
  className,
  variant = 'default',
  selected = false,
  clickable = false,
  ...props
}, ref) => {
  const baseStyles = 'rounded-3xl p-5 bg-white transition-all duration-200 relative overflow-hidden';
  
  const variants = {
    default: 'shadow-soft-md border border-slate-100/80 hover:shadow-soft-lg',
    flat: 'bg-slate-50 border border-slate-200/60',
    outline: 'border-2 border-slate-200 bg-white',
    gradient: 'bg-gradient-to-br from-agro-50 via-white to-emerald-50/40 border border-agro-100 shadow-soft-sm'
  };

  const selectedStyles = selected 
    ? 'ring-2 ring-agro-600 border-agro-600 bg-agro-50/30 shadow-soft-md scale-[1.01]' 
    : '';

  const clickableStyles = clickable 
    ? 'cursor-pointer hover:border-agro-200 active:scale-[0.99]' 
    : '';

  return (
    <motion.div
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        selectedStyles,
        clickableStyles,
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';
