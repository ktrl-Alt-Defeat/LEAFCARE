'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Globe, Sprout, MapPin, Shield, RefreshCw, HelpCircle, FileText, ChevronRight, User } from 'lucide-react';
import { useAppState } from '@/context/AppStateContext';
import { SUPPORTED_LANGUAGES } from '@/data/languages';
import { Button } from '@/components/ui/Button';

export const ProfileMenu: React.FC = () => {
  const router = useRouter();
  const {
    language,
    userProfile,
    selectedCrops,
    permissions,
    resetAllData
  } = useAppState();

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all onboarding and application data?')) {
      resetAllData();
      router.push('/language');
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Profile Header Card */}
      <div className="rounded-3xl bg-gradient-to-r from-agro-800 via-agro-700 to-emerald-800 text-white p-5 shadow-soft-lg flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner ring-2 ring-white/30">
          👨‍🌾
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-black">{userProfile.name}</h2>
          <span className="text-xs text-emerald-100 font-medium">{userProfile.phone}</span>
          <div className="flex items-center gap-1 text-[11px] text-emerald-200 mt-1 font-medium">
            <MapPin className="w-3 h-3 text-amber-300" />
            <span>{userProfile.location}</span>
          </div>
        </div>
      </div>

      {/* Quick Settings Group */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          Preferences & Crops
        </h3>

        <Link
          href="/language"
          className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 hover:border-agro-200 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-agro-50 text-agro-700 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900">Preferred Language</span>
              <span className="text-xs text-slate-500">{currentLang.nativeName} ({currentLang.englishName})</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </Link>

        <Link
          href="/crops"
          className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 hover:border-agro-200 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900">My Crops</span>
              <span className="text-xs text-slate-500">{selectedCrops.length} Crops Selected</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </Link>

        <Link
          href="/permissions"
          className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 hover:border-agro-200 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900">App Permissions</span>
              <span className="text-xs text-slate-500">Camera, Location, Microphone</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </Link>
      </div>

      {/* Permissions Status Summary */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col gap-2 text-xs">
        <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
          Active Permissions Status:
        </span>
        <div className="grid grid-cols-2 gap-2 text-slate-600">
          <div>Camera: <strong className="text-slate-900 uppercase">{permissions.camera}</strong></div>
          <div>Location: <strong className="text-slate-900 uppercase">{permissions.location}</strong></div>
          <div>Mic: <strong className="text-slate-900 uppercase">{permissions.microphone}</strong></div>
          <div>Notif: <strong className="text-slate-900 uppercase">{permissions.notifications}</strong></div>
        </div>
      </div>

      {/* Support & Legal */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          Support & Info
        </h3>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-900">Help & Support</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-900">Privacy Policy & Terms</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* App Reset */}
      <div className="pt-2">
        <Button
          variant="outline"
          fullWidth
          onClick={handleReset}
          icon={<RefreshCw className="w-4 h-4 text-rose-600" />}
          className="border-rose-200 text-rose-700 hover:bg-rose-50"
        >
          Reset App & Onboarding
        </Button>
      </div>
    </div>
  );
};
