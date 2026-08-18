'use client';

import React, { useId } from 'react';
import { Loader2, Volume2, Square } from 'lucide-react';
import { useSpeech } from '@/context/SpeechContext';
import { useLanguage } from '@/context/LanguageContext';
import { buildSpeech, type SpeechPart } from '@/lib/voice/config';
import { cn } from '@/lib/utils';

export interface SpeakButtonProps {
  /**
   * What to read. An array is joined into one script, so a card can pass its
   * heading and its list together and be heard as a single passage rather than
   * needing a speaker icon per line.
   */
  text: string | SpeechPart[];
  size?: 'sm' | 'md';
  /** `onDark` for hero panels and image overlays, `subtle` inside dense lists. */
  tone?: 'default' | 'subtle' | 'onDark';
  /** Describes the passage for screen readers, e.g. "symptoms". */
  label?: string;
  className?: string;
}

const SIZES = {
  sm: { button: 'h-7 w-7', icon: 'h-3.5 w-3.5' },
  md: { button: 'h-9 w-9', icon: 'h-4 w-4' },
} as const;

const TONES = {
  default:
    'border border-agro-200 bg-agro-50 text-agro-700 hover:border-agro-300 hover:bg-agro-100 hover:text-agro-800',
  subtle:
    'border border-slate-200 bg-white text-slate-500 hover:border-agro-200 hover:bg-agro-50 hover:text-agro-700',
  onDark:
    'border border-white/25 bg-white/15 text-white backdrop-blur-md hover:border-white/40 hover:bg-white/25',
} as const;

/**
 * Reads the neighbouring block of text aloud.
 *
 * Sits next to every substantial passage in the app, because a lot of the
 * people this is built for would rather listen than read a screen of agronomy
 * in a second language. Renders nothing when the deployment has no voice
 * credentials, so an unconfigured build simply looks like the app without it.
 */
export const SpeakButton: React.FC<SpeakButtonProps> = ({
  text,
  size = 'sm',
  tone = 'default',
  label,
  className,
}) => {
  const { available, activeId, status, speak } = useSpeech();
  const { t } = useLanguage();

  // Stable per instance, so two cards showing identical text stay independent.
  const id = useId();

  const script = Array.isArray(text) ? buildSpeech(text) : buildSpeech([text]);

  if (!available || !script) return null;

  const isActive = activeId === id;
  const isLoading = isActive && status === 'loading';
  const isPlaying = isActive && status === 'playing';

  const readLabel = t('readAloud', 'Read aloud');
  const stopLabel = t('stopReading', 'Stop reading');
  const accessibleLabel = isPlaying
    ? stopLabel
    : label
      ? `${readLabel}: ${label}`
      : readLabel;

  return (
    <button
      type="button"
      onClick={(event) => {
        // Speaker icons often sit inside clickable cards; reading a passage
        // must not also open the thing it belongs to.
        event.preventDefault();
        event.stopPropagation();
        speak(id, script);
      }}
      aria-label={accessibleLabel}
      title={accessibleLabel}
      aria-pressed={isPlaying}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full transition-all duration-200 active:scale-95',
        SIZES[size].button,
        TONES[tone],
        isActive && tone !== 'onDark' && 'border-agro-500 bg-agro-600 text-white hover:bg-agro-700 hover:text-white',
        className,
      )}
    >
      {isLoading ? (
        <Loader2 className={cn(SIZES[size].icon, 'animate-spin')} />
      ) : isPlaying ? (
        <Square className={cn(SIZES[size].icon, 'fill-current')} />
      ) : (
        <Volume2 className={SIZES[size].icon} />
      )}
    </button>
  );
};
