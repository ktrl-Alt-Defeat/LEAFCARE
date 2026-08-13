'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Users, ShoppingBag, User, Camera } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();
  const { t } = useLanguage();

  // Hide bottom nav on scanner page to give full-screen camera viewport
  if (pathname === '/scan') {
    return null;
  }

  const navItems = [
    { href: '/home', label: t('navHome', 'Home'), icon: Home },
    { href: '/community', label: t('navCommunity', 'Community'), icon: Users },
    { href: '/market', label: t('navMarket', 'Market'), icon: ShoppingBag },
    { href: '/profile', label: t('navProfile', 'Profile'), icon: User },
  ];

  return (
    <div className="sticky bottom-0 z-40 w-full bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-lg">
      <div className="flex items-center justify-around px-2 py-2 relative">

        {/* Floating Scanner FAB in Center */}
        <Link
          href="/scan"
          className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center group z-50"
          aria-label="Scan Crop"
        >
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-agro-600 via-emerald-500 to-agro-400 text-white flex items-center justify-center shadow-soft-lg shadow-agro-600/40 ring-4 ring-white animate-pulse-glow"
          >
            <Camera className="w-7 h-7 stroke-[2.5]" />
          </motion.div>
          <span className="text-[10px] font-bold text-agro-700 mt-1 uppercase tracking-wider">
            Scan
          </span>
        </Link>

        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === '/home' && pathname === '/');

          // Add extra margin around center FAB
          const isLeftOfFab = index === 1;
          const isRightOfFab = index === 2;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 min-w-[64px]',
                isLeftOfFab && 'mr-6',
                isRightOfFab && 'ml-6',
                isActive ? 'text-agro-700 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
              )}
            >
              <div className="relative flex items-center justify-center">
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-agro-100/90 rounded-xl -m-1.5"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className={cn('w-5 h-5 relative z-10', isActive ? 'stroke-[2.5]' : 'stroke-2')} />
              </div>
              <span className="text-[11px] leading-tight mt-1 relative z-10 tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
