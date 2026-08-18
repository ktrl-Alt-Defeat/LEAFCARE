'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { useAppState } from '@/context/AppStateContext';
import { Button } from '@/components/ui/Button';
import { UserRole } from '@/types';

/**
 * Hides a dashboard from roles it does not belong to.
 *
 * This is a navigation guard, not a security boundary: the role lives in this
 * browser's own state, so anyone can change it. The backend's admin key is what
 * actually protects the data — this only keeps farmers out of screens that
 * would confuse them.
 */
export const RoleGate: React.FC<{ allow: UserRole[]; children: React.ReactNode }> = ({
  allow,
  children,
}) => {
  const { hydrated, role } = useAppState();

  // Rendering before the saved role loads would flash the "not available"
  // screen at the very users who are allowed in.
  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <span className="text-sm font-bold text-slate-600">Loading…</span>
      </div>
    );
  }

  if (!allow.includes(role)) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
        <ShieldAlert className="h-9 w-9 text-slate-400" />
        <p className="text-sm font-bold text-slate-800">This section is not part of your account</p>
        <p className="max-w-xs text-xs font-medium text-slate-500">
          Switch your role in Profile if you need access to it.
        </p>
        <div className="mt-2 flex gap-2">
          <Link href="/home">
            <Button variant="outline">Back to home</Button>
          </Link>
          <Link href="/profile">
            <Button>Open profile</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
