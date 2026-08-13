'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { NAV_ITEMS, isNavItemActive } from './navItems';
import { cn } from '@/lib/utils';

/**
 * Thumb-reach tab bar for phones and tablets.
 * Hidden from `lg` up, where `SideNavigation` takes over.
 */
export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();
  const { t } = useLanguage();

  const items = NAV_ITEMS.filter((item) => !item.desktopOnly);

  return (
    <div className="safe-bottom sticky bottom-0 z-40 w-full border-t border-slate-200/80 bg-white/95 shadow-lg backdrop-blur-lg lg:hidden">
      <div className="relative mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {/* Floating scanner action */}
        <Link
          href="/scan"
          className="group absolute -top-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center"
          aria-label="Scan crop"
        >
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-agro-600 via-emerald-500 to-agro-400 text-white shadow-soft-lg shadow-agro-600/40 ring-4 ring-white"
          >
            <Camera className="h-7 w-7 stroke-[2.5]" />
          </motion.div>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-agro-700">
            Scan
          </span>
        </Link>

        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = isNavItemActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex min-w-[64px] flex-col items-center justify-center rounded-2xl px-3 py-1.5 transition-colors duration-200',
                // Clear the floating capture button in the middle.
                index === 1 && 'mr-6',
                index === 2 && 'ml-6',
                isActive ? 'font-bold text-agro-700' : 'font-medium text-slate-500 hover:text-slate-800'
              )}
            >
              <div className="relative flex items-center justify-center">
                {isActive && (
                  <motion.div
                    layoutId="bottomNavActive"
                    className="absolute -m-1.5 inset-0 rounded-xl bg-agro-100/90"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className={cn('relative z-10 h-5 w-5', isActive ? 'stroke-[2.5]' : 'stroke-2')} />
              </div>
              <span className="relative z-10 mt-1 text-[11px] leading-tight tracking-tight">
                {t(item.labelKey, item.defaultLabel)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
