'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { ROLE_OPTIONS } from '@/data/roles';
import { BrandMark } from '@/components/ui/BrandMark';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface RoleSelectorProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onContinue: () => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onSelectRole,
  onContinue,
}) => {
  return (
    <div className="onboarding-stage">
      <div className="flex flex-col items-center pb-4 pt-6 text-center lg:items-start lg:pt-0 lg:text-left">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="mb-4 lg:hidden"
        >
          <BrandMark size={72} priority />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black tracking-tight text-slate-900"
        >
          How will you use LeafCare?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-1 text-base font-medium text-slate-600"
        >
          You can change this later in your profile
        </motion.p>
      </div>

      <div className="flex flex-col gap-3">
        {ROLE_OPTIONS.map((option, index) => {
          const isSelected = selectedRole === option.role;

          return (
            <motion.button
              key={option.role}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectRole(option.role)}
              aria-pressed={isSelected}
              className={cn(
                'flex items-center gap-4 rounded-3xl border-2 p-4 text-left transition-colors',
                isSelected
                  ? 'border-agro-500 bg-agro-50'
                  : 'border-slate-200 bg-white hover:border-agro-200'
              )}
            >
              <span
                role="img"
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-soft-sm"
              >
                {option.icon}
              </span>

              <span className="flex min-w-0 flex-1 flex-col">
                <span
                  className={cn(
                    'text-base font-black',
                    isSelected ? 'text-agro-900' : 'text-slate-900'
                  )}
                >
                  {option.title}
                </span>
                <span className="text-xs font-medium leading-snug text-slate-500">
                  {option.description}
                </span>
              </span>

              {isSelected && (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-agro-600 text-white">
                  <Check className="h-4 w-4" />
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-auto pt-6">
        <Button fullWidth size="lg" onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
};
