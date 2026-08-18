'use client';

import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { Page } from '@/components/layout/Page';
import { ProfileMenu } from '@/components/profile/ProfileMenu';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { useLanguage } from '@/context/LanguageContext';
import { useAppState } from '@/context/AppStateContext';
import { ROLE_OPTIONS } from '@/data/roles';

export default function ProfilePage() {
  const { t } = useLanguage();
  const { role } = useAppState();
  const [isEditing, setIsEditing] = useState(false);

  const roleOption = ROLE_OPTIONS.find((option) => option.role === role);

  return (
    <Page
      title={t('profileHeader', 'Farmer Profile')}
      subtitle={
        roleOption
          ? `Signed in as ${roleOption.title} · account, crops and preferences`
          : 'Account, crops and app preferences'
      }
      titleAction={
        <button
          onClick={() => setIsEditing(true)}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-agro-600 px-3.5 py-2 text-xs font-bold text-white shadow-soft-sm transition-colors hover:bg-agro-700"
        >
          <Pencil className="h-4 w-4" />
          <span>Edit profile</span>
        </button>
      }
    >
      {/* The mobile layout hides `titleAction`, so the edit entry point is
          repeated inline where a phone user can actually reach it. */}
      <button
        onClick={() => setIsEditing(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-agro-200 bg-agro-50 px-4 py-3 text-sm font-bold text-agro-800 transition-colors hover:bg-agro-100 lg:hidden"
      >
        <Pencil className="h-4 w-4" />
        Edit profile details
      </button>

      <ProfileMenu />

      <EditProfileModal isOpen={isEditing} onClose={() => setIsEditing(false)} />
    </Page>
  );
}
