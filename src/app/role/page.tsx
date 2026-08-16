'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/context/AppStateContext';
import { RoleSelector } from '@/components/onboarding/RoleSelector';
import { UserRole } from '@/types';

/**
 * Second step of onboarding, straight after the language question: everything
 * shown afterwards depends on which role is chosen.
 */
export default function RolePage() {
  const router = useRouter();
  const { role, setRole } = useAppState();

  return (
    <RoleSelector
      selectedRole={role}
      onSelectRole={(next: UserRole) => setRole(next)}
      onContinue={() => router.push('/onboarding')}
    />
  );
}
