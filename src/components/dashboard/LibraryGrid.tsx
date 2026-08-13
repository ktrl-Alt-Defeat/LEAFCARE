'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ShieldAlert, Sun, Sprout, Bug, HeartHandshake } from 'lucide-react';
import { Card } from '@/components/ui/Card';

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
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-black text-slate-900 tracking-tight">
        Agri Library & Knowledge Base
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {LIBRARY_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div key={item.id} whileTap={{ scale: 0.96 }}>
              <Card
                clickable
                className="flex flex-col h-full justify-between p-4 bg-white border border-slate-100 hover:border-agro-200"
              >
                <div>
                  <div className={`w-10 h-10 rounded-2xl ${item.color} flex items-center justify-center mb-3 shadow-inner`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-normal line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
