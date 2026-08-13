import React from 'react';
import Image from 'next/image';
import logo from '../../../public/logo.png';
import { cn } from '@/lib/utils';

export interface BrandMarkProps {
  /** Rendered pixel size of the square mark. */
  size?: number;
  className?: string;
  priority?: boolean;
  /**
   * Sets the mark on a light rounded plate. Required over dark backgrounds,
   * where the green leaf would otherwise vanish into the surface.
   */
  plate?: boolean;
}

/**
 * The LeafCare logo. Kept in one place so the header, sidebar, onboarding panel
 * and splash screen never drift apart.
 */
export const BrandMark: React.FC<BrandMarkProps> = ({
  size = 40,
  className,
  priority = false,
  plate = false,
}) => {
  const image = (
    <Image
      src={logo}
      alt="LeafCare"
      width={size}
      height={size}
      priority={priority}
      className={cn('object-contain', !plate && className)}
      style={{ width: size, height: size }}
    />
  );

  if (!plate) return image;

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-2xl bg-white/95 p-1.5 shadow-soft-sm ring-1 ring-white/30',
        className
      )}
    >
      {image}
    </span>
  );
};

/** Logo plus wordmark, used wherever the full lockup fits. */
export const BrandLockup: React.FC<{
  size?: number;
  tagline?: string;
  className?: string;
  inverted?: boolean;
  priority?: boolean;
}> = ({ size = 40, tagline, className, inverted = false, priority = false }) => (
  <span className={cn('flex items-center gap-2.5', className)}>
    <BrandMark size={size} priority={priority} plate={inverted} />
    <span className="flex flex-col">
      <span
        className={cn(
          'text-lg font-black leading-none tracking-tight',
          inverted ? 'text-white' : 'text-slate-900'
        )}
      >
        Leaf<span className={inverted ? 'text-agro-300' : 'text-agro-600'}>Care</span>
      </span>
      {tagline && (
        <span
          className={cn(
            'mt-1 text-[10px] font-semibold uppercase leading-none tracking-wider',
            inverted ? 'text-emerald-200/80' : 'text-agro-700'
          )}
        >
          {tagline}
        </span>
      )}
    </span>
  </span>
);
