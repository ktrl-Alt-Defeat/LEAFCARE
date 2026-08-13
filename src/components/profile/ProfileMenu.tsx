'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Globe,
  Sprout,
  MapPin,
  Shield,
  RefreshCw,
  HelpCircle,
  FileText,
  ChevronRight,
  Ruler,
  CalendarDays,
  type LucideIcon,
} from 'lucide-react';
import { useAppState } from '@/context/AppStateContext';
import { SUPPORTED_LANGUAGES } from '@/data/languages';
import { Button } from '@/components/ui/Button';
import { PermissionStatus } from '@/types';

interface MenuRowProps {
  icon: LucideIcon;
  iconClass: string;
  label: string;
  detail?: string;
  href?: string;
}

const MenuRow: React.FC<MenuRowProps> = ({ icon: Icon, iconClass, label, detail, href }) => {
  const content = (
    <>
      <div className="flex min-w-0 items-center gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-bold text-slate-900">{label}</span>
          {detail && <span className="truncate text-xs text-slate-500">{detail}</span>}
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
    </>
  );

  const className =
    'flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors hover:border-agro-200 hover:bg-agro-50/30';

  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <button type="button" className={`${className} w-full text-left`}>
      {content}
    </button>
  );
};

const PERMISSION_LABELS: Array<{ key: keyof PermissionStatus; label: string }> = [
  { key: 'camera', label: 'Camera' },
  { key: 'location', label: 'Location' },
  { key: 'microphone', label: 'Microphone' },
  { key: 'notifications', label: 'Notifications' },
];

const STATUS_STYLES: Record<string, string> = {
  granted: 'bg-emerald-100 text-emerald-800',
  denied: 'bg-rose-100 text-rose-800',
  skipped: 'bg-amber-100 text-amber-800',
  prompt: 'bg-slate-200 text-slate-700',
};

export const ProfileMenu: React.FC = () => {
  const router = useRouter();
  const { language, userProfile, selectedCrops, permissions, resetAllData } = useAppState();

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const handleReset = () => {
    if (confirm('Reset all onboarding and application data on this device?')) {
      resetAllData();
      router.push('/language');
    }
  };

  return (
    <div className="flex flex-col gap-5 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
      {/* Identity + status */}
      <div className="flex flex-col gap-5">
        <div className="rounded-3xl bg-gradient-to-r from-agro-800 via-agro-700 to-emerald-800 p-5 text-white shadow-soft-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 text-3xl shadow-inner ring-2 ring-white/30 backdrop-blur-md">
              👨‍🌾
            </div>
            <div className="flex min-w-0 flex-col">
              <h2 className="truncate text-xl font-black">{userProfile.name}</h2>
              <span className="text-xs font-medium text-emerald-100">{userProfile.phone}</span>
              <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-emerald-200">
                <MapPin className="h-3 w-3 shrink-0 text-amber-300" />
                <span className="truncate">{userProfile.location}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/15 pt-4 text-center">
            <div className="flex flex-col items-center gap-0.5">
              <Ruler className="h-4 w-4 text-emerald-200" />
              <span className="text-sm font-black">{userProfile.farmSize}</span>
              <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-200">
                Farm size
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <CalendarDays className="h-4 w-4 text-emerald-200" />
              <span className="text-sm font-black">{userProfile.experienceYears}</span>
              <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-200">
                Experience
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <Sprout className="h-4 w-4 text-emerald-200" />
              <span className="text-sm font-black">{selectedCrops.length}</span>
              <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-200">
                Crops
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/60 bg-white p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Device permissions
          </span>
          <div className="grid gap-2 sm:grid-cols-2">
            {PERMISSION_LABELS.map(({ key, label }) => (
              <div
                key={key}
                className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs"
              >
                <span className="truncate font-medium text-slate-600">{label}</span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                    STATUS_STYLES[permissions[key]] ?? STATUS_STYLES.prompt
                  }`}
                >
                  {permissions[key]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          fullWidth
          onClick={handleReset}
          icon={<RefreshCw className="h-4 w-4" />}
          className="border-rose-200 text-rose-700 hover:bg-rose-50"
        >
          Reset app &amp; onboarding
        </Button>
      </div>

      {/* Settings */}
      <div className="flex flex-col gap-5">
        <section className="flex flex-col gap-2">
          <h3 className="px-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            Preferences &amp; crops
          </h3>
          <MenuRow
            icon={Globe}
            iconClass="bg-agro-50 text-agro-700"
            label="Preferred language"
            detail={`${currentLang.nativeName} (${currentLang.englishName})`}
            href="/language"
          />
          <MenuRow
            icon={Sprout}
            iconClass="bg-emerald-50 text-emerald-700"
            label="My crops"
            detail={`${selectedCrops.length} selected`}
            href="/crops"
          />
          <MenuRow
            icon={Shield}
            iconClass="bg-sky-50 text-sky-700"
            label="App permissions"
            detail="Camera, location, microphone"
            href="/permissions"
          />
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="px-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            Support &amp; info
          </h3>
          <MenuRow icon={HelpCircle} iconClass="bg-purple-50 text-purple-700" label="Help & support" />
          <MenuRow
            icon={FileText}
            iconClass="bg-amber-50 text-amber-700"
            label="Privacy policy & terms"
          />
        </section>
      </div>
    </div>
  );
};
