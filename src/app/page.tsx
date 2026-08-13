'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/context/AppStateContext';

export default function RootPage() {
  const router = useRouter();
  const { onboardingCompleted } = useAppState();

  useEffect(() => {
    if (onboardingCompleted) {
      router.replace('/home');
    } else {
      router.replace('/language');
    }
  }, [onboardingCompleted, router]);

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-agro-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-3xl bg-agro-600 text-white flex items-center justify-center text-3xl shadow-soft-lg animate-bounce">
          🌿
        </div>
        <span className="text-sm font-bold text-agro-800">Loading LeafCare...</span>
      </div>
    </div>
  );
}
