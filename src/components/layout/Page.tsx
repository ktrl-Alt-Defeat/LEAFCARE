'use client';

import React from 'react';
import { Header } from '@/components/navigation/Header';
import { cn } from '@/lib/utils';

export interface PageProps {
  title: string;
  subtitle?: string;
  /** Controls placed in the sticky top bar (laptop) and beside the title (phone). */
  titleAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Shared scaffold for the signed-in screens: sticky bar, consistent gutters and
 * a single max width so nothing stretches uncomfortably wide on a laptop.
 */
export const Page: React.FC<PageProps> = ({
  title,
  subtitle,
  titleAction,
  children,
  className,
}) => {
  return (
    <>
      <Header
        title={title}
        subtitle={subtitle}
        actions={titleAction ? <div className="hidden lg:block">{titleAction}</div> : undefined}
      />

      <main
        className={cn(
          'page-shell flex w-full flex-1 flex-col gap-5 pb-8 pt-4 sm:gap-6 sm:pt-6 lg:pb-12',
          className
        )}
      >
        {/* The bar shows the brand on phones, so the title lives in the page body there. */}
        <div className="flex items-start justify-between gap-3 lg:hidden">
          <div className="min-w-0">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">{title}</h1>
            {subtitle && (
              <p className="mt-0.5 text-sm font-medium text-slate-500">{subtitle}</p>
            )}
          </div>
          {titleAction}
        </div>

        {children}
      </main>
    </>
  );
};

/** Section heading used inside pages, above grids and lists. */
export const SectionHeading: React.FC<{
  children: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}> = ({ children, icon, action }) => (
  <div className="flex items-center justify-between gap-3">
    <h2 className="flex items-center gap-2 text-base font-black tracking-tight text-slate-900 sm:text-lg">
      {icon}
      {children}
    </h2>
    {action}
  </div>
);
