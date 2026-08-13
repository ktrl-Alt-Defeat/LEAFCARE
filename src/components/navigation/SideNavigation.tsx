'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Camera, Leaf, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAppState } from '@/context/AppStateContext';
import { NAV_ITEMS, isNavItemActive } from './navItems';
import { cn } from '@/lib/utils';

/**
 * Persistent left rail for laptop and desktop widths.
 * Replaces the bottom tab bar above `lg`, where a thumb-reach bar makes no sense
 * and wastes vertical space that short laptop screens cannot spare.
 */
export const SideNavigation: React.FC = () => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { userProfile, scanHistory } = useAppState();

  return (
    <aside className="hidden lg:flex lg:h-dvh lg:w-60 xl:w-64 shrink-0 flex-col gap-6 border-r border-slate-200/80 bg-white px-4 py-5">
      {/* Brand */}
      <Link href="/home" className="flex items-center gap-2.5 px-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-agro-600 to-emerald-400 text-white shadow-soft-sm">
          <Leaf className="h-5 w-5 fill-white/20" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black leading-none tracking-tight text-slate-900">
            Leaf<span className="text-agro-600">Care</span>
          </span>
          <span className="mt-1 text-[10px] font-semibold uppercase leading-none tracking-wider text-agro-700">
            AI Crop Doctor
          </span>
        </div>
      </Link>

      {/* Primary scan action */}
      <Link
        href="/scan"
        className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-agro-600 to-emerald-500 px-4 py-3 text-white shadow-soft-md shadow-agro-600/25 transition-all hover:shadow-soft-lg hover:brightness-105"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
          <Camera className="h-5 w-5 stroke-[2.5]" />
        </span>
        <span className="flex flex-col">
          <span className="text-sm font-bold leading-tight">{t('takePicture', 'Scan a crop')}</span>
          <span className="text-[11px] font-medium text-emerald-100">Instant AI diagnosis</span>
        </span>
      </Link>

      {/* Sections */}
      <nav className="flex flex-1 flex-col gap-1" aria-label="Main navigation">
        <span className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Menu
        </span>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = isNavItemActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-colors',
                isActive
                  ? 'font-bold text-agro-800'
                  : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="sideNavActive"
                  className="absolute inset-0 rounded-2xl bg-agro-50 ring-1 ring-agro-100"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <Icon
                className={cn(
                  'relative z-10 h-[18px] w-[18px]',
                  isActive ? 'stroke-[2.5] text-agro-700' : 'stroke-2'
                )}
              />
              <span className="relative z-10">{t(item.labelKey, item.defaultLabel)}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer summary */}
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl bg-gradient-to-br from-agro-50 to-emerald-50/60 p-3.5 ring-1 ring-agro-100">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-agro-800">
            <Sparkles className="h-3.5 w-3.5" />
            Scan activity
          </div>
          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-600">
            {scanHistory.length > 0
              ? `${scanHistory.length} crop ${scanHistory.length === 1 ? 'scan' : 'scans'} saved on this device.`
              : 'No scans yet — capture a leaf to get your first diagnosis.'}
          </p>
        </div>

        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-slate-50"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-lg">
            👨‍🌾
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-xs font-bold text-slate-900">{userProfile.name}</span>
            <span className="truncate text-[11px] font-medium text-slate-500">
              {userProfile.location}
            </span>
          </span>
        </Link>
      </div>
    </aside>
  );
};
