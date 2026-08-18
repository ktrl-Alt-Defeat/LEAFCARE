'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useAppState } from '@/context/AppStateContext';
import { ROLE_OPTIONS } from '@/data/roles';
import { UserProfile, UserRole } from '@/types';
import { cn } from '@/lib/utils';

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-800 placeholder:font-medium placeholder:text-slate-400';

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({
  label,
  hint,
  children,
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-bold text-slate-900">{label}</label>
    {children}
    {hint && <span className="text-[11px] font-medium text-slate-500">{hint}</span>}
  </div>
);

/**
 * Lets a farmer fill in their own details instead of living with the sample
 * profile the app ships with, and switch role without redoing onboarding.
 */
export const EditProfileModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { userProfile, updateUserProfile, role, setRole } = useAppState();

  const [draft, setDraft] = useState<UserProfile>(userProfile);
  const [draftRole, setDraftRole] = useState<UserRole>(role);

  // Reloaded each time it opens so a cancelled edit does not persist into the
  // next one.
  useEffect(() => {
    if (!isOpen) return;
    // Reloading the draft from saved state is the point of this effect: a
    // cancelled edit must not leak into the next one.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(userProfile);
    setDraftRole(role);
  }, [isOpen, userProfile, role]);

  const set = (field: keyof UserProfile, value: string) =>
    setDraft((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    updateUserProfile({
      name: draft.name.trim() || 'Farmer',
      phone: draft.phone.trim(),
      location: draft.location.trim(),
      farmSize: draft.farmSize.trim(),
      experienceYears: draft.experienceYears.trim(),
    });
    setRole(draftRole);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit profile">
      <div className="flex flex-col gap-4 pt-1">
        <Field label="Name">
          <input
            value={draft.name}
            onChange={(event) => set('name', event.target.value)}
            placeholder="Your name"
            className={inputClass}
          />
        </Field>

        <Field label="Phone">
          <input
            value={draft.phone}
            onChange={(event) => set('phone', event.target.value)}
            placeholder="+91 98765 43210"
            inputMode="tel"
            className={inputClass}
          />
        </Field>

        <Field
          label="Village / district"
          hint="Used for your weather forecast when location access is off."
        >
          <input
            value={draft.location}
            onChange={(event) => set('location', event.target.value)}
            placeholder="Mayiladuthurai, Tamil Nadu"
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Farm size">
            <input
              value={draft.farmSize}
              onChange={(event) => set('farmSize', event.target.value)}
              placeholder="3.5 Acres"
              className={inputClass}
            />
          </Field>
          <Field label="Experience">
            <input
              value={draft.experienceYears}
              onChange={(event) => set('experienceYears', event.target.value)}
              placeholder="12 Years"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="I use LeafCare as" hint="Changes which dashboards appear in your navigation.">
          <div className="flex flex-col gap-2">
            {ROLE_OPTIONS.map((option) => (
              <button
                key={option.role}
                onClick={() => setDraftRole(option.role)}
                aria-pressed={draftRole === option.role}
                className={cn(
                  'flex items-center gap-3 rounded-2xl border px-3.5 py-2.5 text-left transition-colors',
                  draftRole === option.role
                    ? 'border-agro-500 bg-agro-50'
                    : 'border-slate-200 bg-white hover:border-agro-200',
                )}
              >
                <span role="img" aria-hidden="true" className="text-xl">
                  {option.icon}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-sm font-black text-slate-900">{option.title}</span>
                  <span className="line-clamp-1 text-[11px] font-medium text-slate-500">
                    {option.description}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </Field>

        <div className="flex gap-2">
          <Button variant="outline" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button fullWidth onClick={handleSave}>
            Save profile
          </Button>
        </div>
      </div>
    </Modal>
  );
};
