'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen,
  ShieldAlert,
  CloudSun,
  Sprout,
  Bug,
  Lightbulb,
  FlaskConical,
  type LucideIcon
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/layout/Page';
import { cn } from '@/lib/utils';

export interface LibraryItem {
  id: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  color: string;
  /** Present once the section has a real destination. */
  href?: string;
}

export const LIBRARY_ITEMS: LibraryItem[] = [
  {
    id: 'crops_guide',
    title: 'Crops Catalog',
    desc: '35 supported crops with full agronomy reference sheets',
    icon: Sprout,
    color: 'bg-emerald-100 text-emerald-700',
    href: '/catalog'
  },
  {
    id: 'pests_diseases',
    title: 'Pests & Diseases',
    desc: 'Visual identification guide for common farm pathogens',
    icon: Bug,
    color: 'bg-rose-100 text-rose-700'
  },
  {
    id: 'cultivation_tips',
    title: 'Cultivation Tips',
    desc: 'Seasonal land preparation & organic soil fertility',
    icon: Lightbulb,
    color: 'bg-amber-100 text-amber-700'
  },
  {
    id: 'disease_alerts',
    title: 'Disease Alerts',
    desc: 'Regional outbreak advisories for your district',
    icon: ShieldAlert,
    color: 'bg-purple-100 text-purple-700'
  },
  {
    id: 'weather_guide',
    title: 'Weather Guide',
    desc: 'Monsoon predictions & frost warning guidance',
    icon: CloudSun,
    color: 'bg-sky-100 text-sky-700'
  },
  {
    id: 'fertilizer_guide',
    title: 'Fertilizer Guide',
    desc: 'NPK ratios, bio-fertilizers & micro-nutrients',
    icon: FlaskConical,
    color: 'bg-teal-100 text-teal-700'
  }
];

export const LibraryGrid: React.FC = () => {
  return (
    <section className="flex flex-col gap-3">
      <SectionHeading>Agri library &amp; knowledge base</SectionHeading>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {LIBRARY_ITEMS.map((item) => {
          const Icon = item.icon;
          const available = Boolean(item.href);

          const card = (
            <Card
              clickable={available}
              className={cn(
                'flex h-full flex-col border border-slate-100 bg-white p-4',
                available ? 'hover-lift hover:border-agro-200' : 'cursor-default bg-slate-50/60'
              )}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-2xl shadow-inner',
                    item.color,
                    !available && 'opacity-60 saturate-50'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                {!available && (
                  <span className="shrink-0 rounded-full bg-slate-200/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-600">
                    Soon
                  </span>
                )}
              </div>
              <h3
                className={cn(
                  'mb-1 text-sm font-bold leading-tight',
                  available ? 'text-slate-900' : 'text-slate-600'
                )}
              >
                {item.title}
              </h3>
              <p className="line-clamp-2 text-xs leading-normal text-slate-500">{item.desc}</p>
            </Card>
          );

          return available ? (
            <Link key={item.id} href={item.href as string} className="h-full">
              {card}
            </Link>
          ) : (
            <motion.div key={item.id} className="h-full">
              {card}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
