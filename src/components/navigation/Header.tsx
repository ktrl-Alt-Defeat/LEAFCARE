'use client';

import React from 'react';
import Link from 'next/link';
import { Leaf, Bell, User } from 'lucide-react';
import { LanguageMenu } from './LanguageMenu';

export interface HeaderProps {
  /** Page title. Shown in the bar on laptop widths, where the sidebar owns the brand. */
  title?: string;
  subtitle?: string;
  /** Extra controls (search, filters) rendered before the standard actions. */
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <header className="sticky top-0 z-40 h-[var(--header-h)] border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
      <div className="page-shell flex h-full items-center justify-between gap-3">
        {/* Brand on phones, page title on laptops */}
        <Link href="/home" className="group flex items-center gap-2 lg:hidden" aria-label="LeafCare home">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-agro-600 to-emerald-400 text-white shadow-soft-sm transition-transform group-hover:scale-105">
            <Leaf className="h-[18px] w-[18px] fill-white/20" />
          </div>
          <span className="text-lg font-black leading-none tracking-tight text-slate-900">
            Leaf<span className="text-agro-600">Care</span>
          </span>
        </Link>

        <div className="hidden min-w-0 flex-col lg:flex">
          {title && (
            <h1 className="truncate text-lg font-black leading-tight tracking-tight text-slate-900">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="truncate text-xs font-medium text-slate-500">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {actions}

          <LanguageMenu />

          <button
            className="relative rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-agro-700"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-agro-500 ring-2 ring-white" />
          </button>

          <Link
            href="/profile"
            className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-agro-700 lg:hidden"
            aria-label="Profile"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
};
