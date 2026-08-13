'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ShieldAlert, Sun, Sprout, Bug, HeartHandshake } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/layout/Page';

export const LIBRARY_ITEMS = [
  {
    id: 'crops_guide',
    title: 'Crops Catalog',
    desc: '35+ supported crops with detailed cultivation specs',
    icon: Sprout,
    color: 'bg-emerald-100 text-emerald-700'
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
    icon: BookOpen,
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
    icon: Sun,
    color: 'bg-sky-100 text-sky-700'
  },
  {
    id: 'fertilizer_guide',
    title: 'Fertilizer Guide',
    desc: 'NPK ratios, bio-fertilizers & micro-nutrients',
    icon: HeartHandshake,
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
          return (
            <motion.div key={item.id} whileTap={{ scale: 0.96 }} className="h-full">
              <Card
                clickable
                className="hover-lift flex h-full flex-col border border-slate-100 bg-white p-4 hover:border-agro-200"
              >
                <div
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-2xl shadow-inner ${item.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-1 text-sm font-bold leading-tight text-slate-900">
                  {item.title}
                </h3>
                <p className="line-clamp-2 text-xs leading-normal text-slate-500">{item.desc}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
