'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, History, ArrowRight } from 'lucide-react';
import { Header } from '@/components/navigation/Header';
import { WeatherCard } from '@/components/dashboard/WeatherCard';
import { DiseaseScanBanner } from '@/components/dashboard/DiseaseScanBanner';
import { ToolsGrid } from '@/components/dashboard/ToolsGrid';
import { LibraryGrid } from '@/components/dashboard/LibraryGrid';
import { CalculatorModal } from '@/components/dashboard/CalculatorModal';
import { CropChip } from '@/components/crops/CropChip';
import { useAppState } from '@/context/AppStateContext';
import { useLanguage } from '@/context/LanguageContext';
import { CROPS_DATA } from '@/data/crops';
import { ToolItem } from '@/data/tools';
import { Card } from '@/components/ui/Card';

export default function HomePage() {
  const { selectedCrops, scanHistory } = useAppState();
  const { t } = useLanguage();
  const [activeCropId, setActiveCropId] = useState<string>(selectedCrops[0] || 'rice');
  const [calcModalType, setCalcModalType] = useState<'fertilizer' | 'pesticide' | null>(null);

  const activeCropsList = CROPS_DATA.filter(c => selectedCrops.includes(c.id));

  const handleToolClick = (tool: ToolItem) => {
    if (tool.id === 'fertilizer_calc') {
      setCalcModalType('fertilizer');
    } else if (tool.id === 'pesticide_calc') {
      setCalcModalType('pesticide');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/60 pb-20">
      <Header />

      <div className="p-4 flex flex-col gap-6 max-w-md mx-auto w-full">
        {/* Horizontal Crop Chips Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {activeCropsList.map(crop => (
            <CropChip
              key={crop.id}
              crop={crop}
              isActive={activeCropId === crop.id}
              onClick={() => setActiveCropId(crop.id)}
            />
          ))}

          <Link
            href="/crops"
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold text-agro-700 bg-agro-50 border border-agro-200/80 hover:bg-agro-100 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Crop</span>
          </Link>
        </div>

        {/* Live Weather Card */}
        <WeatherCard />

        {/* Primary AI Disease Scanner Card */}
        <DiseaseScanBanner />

        {/* Recent Scans History Section (if any) */}
        {scanHistory.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <History className="w-5 h-5 text-agro-600" />
                {t('recentScans', 'Recent Scans')}
              </h3>
            </div>

            <div className="flex flex-col gap-2">
              {scanHistory.slice(0, 2).map((scan) => (
                <Link key={scan.id} href={`/diagnosis?id=${scan.id}`}>
                  <Card clickable className="flex items-center justify-between p-3.5 border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        {/* eslint-disable-next-html-script-for-img */}
                        <img
                          src={scan.capturedImageData}
                          alt={scan.disease.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900">
                          {scan.disease.name}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {scan.cropName} • {scan.timestamp}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Farming Tools Grid */}
        <ToolsGrid onSelectTool={handleToolClick} />

        {/* Agri Knowledge Library Grid */}
        <LibraryGrid />
      </div>

      {/* Interactive Fertilizer/Pesticide Calculator Popup */}
      <CalculatorModal
        type={calcModalType}
        onClose={() => setCalcModalType(null)}
      />
    </div>
  );
}
