'use client';

import React from 'react';
import { TOOLS_DATA, ToolItem } from '@/data/tools';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/layout/Page';

export interface ToolsGridProps {
  onSelectTool: (tool: ToolItem) => void;
}

export const ToolsGrid: React.FC<ToolsGridProps> = ({ onSelectTool }) => {
  return (
    <section className="flex flex-col gap-3">
      <SectionHeading>Farming tools &amp; calculators</SectionHeading>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-3">
        {TOOLS_DATA.map((tool) => (
          <Card
            key={tool.id}
            clickable
            role="button"
            tabIndex={0}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelectTool(tool)}
            onKeyDown={(event: React.KeyboardEvent) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelectTool(tool);
              }
            }}
            className="hover-lift flex h-full flex-col border border-slate-100 bg-white p-4 hover:border-agro-200"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="select-none text-3xl" role="img" aria-label={tool.name}>
                {tool.icon}
              </span>
              {tool.comingSoon && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase text-slate-500">
                  Soon
                </span>
              )}
            </div>
            <h3 className="mb-1 text-sm font-bold leading-tight text-slate-900">{tool.name}</h3>
            <p className="line-clamp-2 text-xs leading-normal text-slate-500">{tool.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};
