'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/context/AppStateContext';
import { BrandMark } from '@/components/ui/BrandMark';

export default function RootPage() {
  const router = useRouter();
  const { hydrated, onboardingCompleted } = useAppState();

  useEffect(() => {
    // Waiting for hydration stops returning users being bounced to the
    // language picker for a frame before the saved state loads.
    if (!hydrated) return;
    router.replace(onboardingCompleted ? '/home' : '/language');
  }, [hydrated, onboardingCompleted, router]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-gradient-to-b from-agro-50 via-white to-agro-50/60">
      <div className="animate-float">
        <BrandMark size={88} priority />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xl font-black tracking-tight text-slate-900">
          Leaf<span className="text-agro-600">Care</span>
        </span>
        <span className="text-xs font-semibold uppercase tracking-widest text-agro-700">
          Starting up…
        </span>
      </div>
    </div>
  );
}
