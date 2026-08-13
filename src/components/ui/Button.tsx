'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  loading = false,
  disabled,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-agro-300 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-agro-600 hover:bg-agro-700 text-white shadow-soft-md hover:shadow-soft-lg shadow-agro-600/20 active:bg-agro-800',
    secondary: 'bg-agro-100 hover:bg-agro-200 text-agro-800 border border-agro-200',
    outline: 'border-2 border-agro-600 text-agro-700 hover:bg-agro-50 bg-white',
    ghost: 'text-slate-600 hover:bg-slate-100 bg-transparent',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-soft-md shadow-red-600/20'
  };

  const sizes = {
    sm: 'text-xs px-3 py-2 min-h-[36px] gap-1.5',
    md: 'text-sm px-4 py-3 min-h-[44px] gap-2',
    lg: 'text-base px-6 py-3.5 min-h-[52px] gap-2.5 rounded-2xl',
    xl: 'text-lg px-8 py-4 min-h-[58px] gap-3 rounded-3xl font-bold tracking-wide'
  };

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className
      )}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="inline-block shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="inline-block shrink-0">{icon}</span>}
        </>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';
