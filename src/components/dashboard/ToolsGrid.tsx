'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TOOLS_DATA, ToolItem } from '@/data/tools';
import { Card } from '@/components/ui/Card';

export interface ToolsGridProps {
  onSelectTool: (tool: ToolItem) => void;
}

export const ToolsGrid: React.FC<ToolsGridProps> = ({ onSelectTool }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-slate-900 tracking-tight">
          Farming Tools & Calculators
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {TOOLS_DATA.map((tool) => (
          <motion.div
            key={tool.id}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelectTool(tool)}
          >
            <Card
              clickable
              className="flex flex-col h-full justify-between p-4 bg-white border border-slate-100 hover:border-agro-200"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl select-none" role="img" aria-label={tool.name}>
                    {tool.icon}
                  </span>
                  {tool.comingSoon && (
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full uppercase">
                      Soon
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight mb-1">
                  {tool.name}
                </h4>
                <p className="text-xs text-slate-500 leading-normal line-clamp-2">
                  {tool.description}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
