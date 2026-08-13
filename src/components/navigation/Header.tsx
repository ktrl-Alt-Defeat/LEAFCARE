'use client';

import React from 'react';
import Link from 'next/link';
import { Leaf, Bell, Globe, User } from 'lucide-react';
import { useAppState } from '@/context/AppStateContext';
import { SUPPORTED_LANGUAGES } from '@/data/languages';

export const Header: React.FC = () => {
  const { language, setLanguage } = useAppState();

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const cycleLanguage = () => {
    const idx = SUPPORTED_LANGUAGES.findIndex(l => l.code === language);
    const nextIdx = (idx + 1) % SUPPORTED_LANGUAGES.length;
    setLanguage(SUPPORTED_LANGUAGES[nextIdx].code);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between">
      {/* Brand Logo & Name */}
      <Link href="/home" className="flex items-center gap-2 group">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-agro-600 to-emerald-400 flex items-center justify-center shadow-soft-sm text-white group-hover:scale-105 transition-transform">
          <Leaf className="w-5 h-5 fill-white/20" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
            Agro<span className="text-agro-600">Care</span>
          </span>
          <span className="text-[10px] font-medium text-agro-700 tracking-wider uppercase leading-none mt-1">
            LeafCare AI
          </span>
        </div>
      </Link>

      {/* Header Actions */}
      <div className="flex items-center gap-2">
        {/* Language Quick Toggle Pill */}
        <button
          onClick={cycleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-agro-50 text-agro-800 text-xs font-semibold border border-agro-200/80 hover:bg-agro-100 transition-colors"
          title="Switch Language"
        >
          <Globe className="w-3.5 h-3.5 text-agro-600" />
          <span>{currentLang.nativeName}</span>
        </button>

        {/* Notifications Icon */}
        <button
          className="relative p-2.5 rounded-full text-slate-600 hover:text-agro-700 hover:bg-slate-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-agro-500 rounded-full ring-2 ring-white" />
        </button>

        {/* Profile Link */}
        <Link
          href="/profile"
          className="p-2.5 rounded-full text-slate-600 hover:text-agro-700 hover:bg-slate-100 transition-colors"
          aria-label="Profile"
        >
          <User className="w-5 h-5" />
        </Link>
      </div>
    </header>
  );
};
