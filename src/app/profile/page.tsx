'use client';

import React from 'react';
import { Page } from '@/components/layout/Page';
import { ProfileMenu } from '@/components/profile/ProfileMenu';
import { useLanguage } from '@/context/LanguageContext';

export default function ProfilePage() {
  const { t } = useLanguage();

  return (
    <Page
      title={t('profileHeader', 'Farmer Profile')}
      subtitle="Account, crops and app preferences"
    >
      <ProfileMenu />
    </Page>
  );
}
