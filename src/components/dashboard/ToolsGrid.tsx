'use client';

import React from 'react';
import { TOOLS_DATA, ToolItem } from '@/data/tools';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/layout/Page';
import { cn } from '@/lib/utils';

export interface ToolsGridProps {
  onSelectTool: (tool: ToolItem) => void;
}

export const ToolsGrid: React.FC<ToolsGridProps> = ({ onSelectTool }) => {
  return (
    <section className="flex flex-col gap-3">
      <SectionHeading>Farming tools &amp; calculators</SectionHeading>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-3">
        {TOOLS_DATA.map((tool) => {
          // Tools still in the pipeline are labelled and inert rather than
          // opening an empty screen.
          const available = !tool.comingSoon;

          return (
            <Card
              key={tool.id}
              clickable={available}
              role={available ? 'button' : undefined}
              tabIndex={available ? 0 : undefined}
              aria-disabled={available ? undefined : true}
              whileTap={available ? { scale: 0.96 } : undefined}
              onClick={available ? () => onSelectTool(tool) : undefined}
              onKeyDown={
                available
                  ? (event: React.KeyboardEvent) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onSelectTool(tool);
                      }
                    }
                  : undefined
              }
              className={cn(
                'flex h-full flex-col border border-slate-100 bg-white p-4',
                available ? 'hover-lift hover:border-agro-200' : 'cursor-default bg-slate-50/60'
              )}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span
                  className={cn('select-none text-3xl', !available && 'opacity-60 grayscale')}
                  role="img"
                  aria-label={tool.name}
                >
                  {tool.icon}
                </span>
                {tool.comingSoon && (
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
                {tool.name}
              </h3>
              <p className="line-clamp-2 text-xs leading-normal text-slate-500">
                {tool.description}
              </p>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
