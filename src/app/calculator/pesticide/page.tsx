'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Page } from '@/components/layout/Page';
import { Button } from '@/components/ui/Button';
import { PesticideCalculator } from '@/components/calculator/PesticideCalculator';
import { useLanguage } from '@/context/LanguageContext';

export default function PesticideCalculatorPage() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <Page
      title={t('calcPesticide', 'Pesticide Dosage Calculator')}
      subtitle="Calculate precise pesticide quantity required for your spray tank"
      titleAction={
        <Button
          size="sm"
          variant="secondary"
          icon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => router.push('/home')}
        >
          Back
        </Button>
      }
    >
      <div className="mx-auto w-full max-w-2xl py-2 sm:py-4">
        <PesticideCalculator />
      </div>
    </Page>
  );
}
