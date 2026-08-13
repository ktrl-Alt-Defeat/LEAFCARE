'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ScanLine, CloudSun, Users } from 'lucide-react';
import { BrandLockup } from '@/components/ui/BrandMark';
import { SideNavigation } from '@/components/navigation/SideNavigation';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';
import { useAppState } from '@/context/AppStateContext';
import { APP_SCROLL_ID } from '@/components/ui/Modal';

/** Routes that own the whole viewport and render no app chrome. */
const FULL_BLEED_ROUTES = ['/', '/scan'];

/** The first-run flow — presented as a centred card, with a brand panel on laptops. */
const ONBOARDING_ROUTES = ['/language', '/onboarding', '/permissions'];

const BRAND_HIGHLIGHTS = [
  { icon: ScanLine, label: 'Instant leaf disease diagnosis' },
  { icon: CloudSun, label: 'Local weather & spraying windows' },
  { icon: Users, label: 'Advice from farmers near you' },
];

const OnboardingLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex min-h-dvh">
    {/* Laptop-only brand panel — fills the space that used to be dead margin. */}
    <aside className="relative hidden w-[42%] shrink-0 flex-col justify-between overflow-hidden bg-gradient-to-br from-agro-900 via-agro-800 to-emerald-950 p-10 text-white lg:flex xl:w-[46%]">
      <div className="pointer-events-none absolute -right-24 top-1/4 h-96 w-96 rounded-full bg-agro-500/20 blur-3xl" />

      <BrandLockup size={44} inverted priority className="relative" />

      <div className="relative flex flex-col gap-6">
        <h2 className="max-w-sm text-3xl font-black leading-tight tracking-tight xl:text-4xl">
          Healthier crops, one photo at a time.
        </h2>
        <ul className="flex flex-col gap-3">
          {BRAND_HIGHLIGHTS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3 text-sm font-medium text-emerald-100">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                <Icon className="h-4 w-4 text-agro-300" />
              </span>
              {label}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs font-medium text-emerald-200/70">
        Built for farmers across India · Available in 6 languages
      </p>
    </aside>

    <div className="flex flex-1 flex-col overflow-y-auto bg-white lg:h-dvh lg:justify-center">
      {children}
    </div>
  </div>
);

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { onboardingCompleted } = useAppState();

  // `/crops` is both the last onboarding step and a settings screen reachable
  // later. During setup it renders its own full-width layout, because a grid of
  // 35+ crops needs the horizontal room the brand panel would take.
  const isCropSetup = pathname === '/crops' && !onboardingCompleted;

  if (FULL_BLEED_ROUTES.includes(pathname) || isCropSetup) {
    return <>{children}</>;
  }

  if (ONBOARDING_ROUTES.includes(pathname)) {
    return <OnboardingLayout>{children}</OnboardingLayout>;
  }

  return (
    <div className="flex min-h-dvh">
      <SideNavigation />

      <div id={APP_SCROLL_ID} className="app-scroll-pane">
        {children}
        <BottomNavigation />
      </div>
    </div>
  );
};
