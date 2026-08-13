'use client';

import React from 'react';
import { Header } from '@/components/navigation/Header';
import { ProfileMenu } from '@/components/profile/ProfileMenu';
import { useLanguage } from '@/context/LanguageContext';

export default function ProfilePage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/60 pb-20">
      <Header />

      <div className="p-4 flex flex-col gap-4 max-w-md mx-auto w-full">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          {t('profileHeader', 'Farmer Profile')}
        </h1>

        <ProfileMenu />
      </div>
    </div>
  );
}
