'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useAppState } from './AppStateContext';
import { MAX_SPEECH_CHARACTERS } from '@/lib/voice/config';

export type SpeechStatus = 'idle' | 'loading' | 'playing';

interface SpeechContextType {
  /** False when the backend has no voice credentials — hide the controls. */
  available: boolean;
  /** Id of the block currently loading or playing, so only one icon lights up. */
  activeId: string | null;
  status: SpeechStatus;
  /** Last failure, cleared as soon as anything plays. */
  error: string | null;
  /** Starts reading `text`; calling again with the same id stops playback. */
  speak: (id: string, text: string) => void;
  stop: () => void;
}

const SpeechContext = createContext<SpeechContextType | undefined>(undefined);

/**
 * Clips are cached by text so replaying a card — or re-reading one the user
 * already heard — costs nothing. Synthesis is billed per character, and a
 * farmer comparing two treatments will play the same paragraph repeatedly.
 */
const MAX_CACHED_CLIPS = 24;

export const SpeechProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useAppState();

  const [available, setAvailable] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [status, setStatus] = useState<SpeechStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cacheRef = useRef(new Map<string, string>());
  /** Aborts an in-flight synthesis when the user starts something else. */
  const requestRef = useRef<AbortController | null>(null);

  // One element for the whole app: two overlapping voices are unusable, and a
  // per-button element would also leak an <audio> node for every card rendered.
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;

    const handleEnded = () => {
      setActiveId(null);
      setStatus('idle');
    };

    const handleError = () => {
      setError('The audio could not be played.');
      setActiveId(null);
      setStatus('idle');
    };

    // Only `ended`, never `pause`: the browser queues `pause` as a task, so a
    // stop-then-start (which every `speak` call performs) would deliver it
    // *after* the new clip had already been marked active and blank it out.
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    const cache = cacheRef.current;

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      cache.forEach((url) => URL.revokeObjectURL(url));
      cache.clear();
    };
  }, []);

  // Ask once whether voice is configured at all. A deployment without an
  // ElevenLabs key should show no speaker icons rather than failing icons.
  useEffect(() => {
    let cancelled = false;

    fetch('/api/voice/status')
      .then((response) => (response.ok ? response.json() : null))
      .then((body: { configured?: boolean } | null) => {
        if (!cancelled) setAvailable(Boolean(body?.configured));
      })
      .catch(() => {
        if (!cancelled) setAvailable(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const stop = useCallback(() => {
    requestRef.current?.abort();
    requestRef.current = null;

    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    setActiveId(null);
    setStatus('idle');
  }, []);

  const speak = useCallback(
    (id: string, rawText: string) => {
      const text = rawText.trim().slice(0, MAX_SPEECH_CHARACTERS);
      if (!text) return;

      // Tapping the speaker on the block that is already talking stops it —
      // the same control that started it, which is what people reach for.
      if (activeId === id) {
        stop();
        return;
      }

      stop();
      setError(null);
      setActiveId(id);
      setStatus('loading');

      const cacheKey = `${language}:${text}`;
      const cached = cacheRef.current.get(cacheKey);

      const play = (url: string) => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.src = url;
        audio
          .play()
          .then(() => setStatus('playing'))
          .catch(() => {
            // Autoplay policies block playback that is not tied to a gesture.
            // Every path here starts from a tap, so this is a real failure.
            setError('Playback was blocked by the browser.');
            setActiveId(null);
            setStatus('idle');
          });
      };

      if (cached) {
        play(cached);
        return;
      }

      const controller = new AbortController();
      requestRef.current = controller;

      fetch('/api/voice/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, languageCode: language }),
        signal: controller.signal,
      })
        .then(async (response) => {
          if (!response.ok) {
            const body = (await response.json().catch(() => null)) as { error?: string } | null;
            throw new Error(body?.error ?? 'This text could not be read aloud.');
          }
          return response.blob();
        })
        .then((blob) => {
          if (controller.signal.aborted) return;

          const url = URL.createObjectURL(blob);

          // Evicting oldest-first keeps memory bounded on a long session; the
          // object URL must be revoked or the blob stays alive after eviction.
          const cache = cacheRef.current;
          if (cache.size >= MAX_CACHED_CLIPS) {
            const oldest = cache.keys().next().value;
            if (oldest) {
              URL.revokeObjectURL(cache.get(oldest) as string);
              cache.delete(oldest);
            }
          }
          cache.set(cacheKey, url);

          play(url);
        })
        .catch((cause: unknown) => {
          if (controller.signal.aborted) return;
          setError(cause instanceof Error ? cause.message : 'This text could not be read aloud.');
          setActiveId(null);
          setStatus('idle');
        })
        .finally(() => {
          if (requestRef.current === controller) requestRef.current = null;
        });
    },
    [activeId, language, stop],
  );

  // A clip synthesised in the previous language is the wrong voice for the new
  // one, and leaving it playing across the switch is jarring. Written as a
  // cleanup rather than an effect body: it should fire when the old language is
  // torn down, not on first mount when nothing is playing yet.
  useEffect(() => () => stop(), [language, stop]);

  const value = useMemo(
    () => ({ available, activeId, status, error, speak, stop }),
    [available, activeId, status, error, speak, stop],
  );

  return <SpeechContext.Provider value={value}>{children}</SpeechContext.Provider>;
};

export const useSpeech = () => {
  const context = useContext(SpeechContext);
  if (!context) {
    throw new Error('useSpeech must be used within a SpeechProvider');
  }
  return context;
};
