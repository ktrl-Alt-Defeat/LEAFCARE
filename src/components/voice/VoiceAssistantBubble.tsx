'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Mic, Sparkles, Square, X } from 'lucide-react';
import { useSpeech } from '@/context/SpeechContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAppState } from '@/context/AppStateContext';
import { resolveVoiceIntent } from '@/lib/voice/intents';
import { MAX_RECORDING_MS } from '@/lib/voice/config';
import { SpeakButton } from './SpeakButton';
import { cn } from '@/lib/utils';

/**
 * Screens that own the whole viewport. The bubble would cover the shutter on
 * the scanner and has nothing to act on during the splash.
 */
const HIDDEN_ROUTES = ['/', '/scan'];

/** Id the assistant's own replies are spoken under, so replays replace them. */
const REPLY_SPEECH_ID = 'voice-assistant-reply';

type AssistantPhase = 'idle' | 'listening' | 'thinking' | 'answered';

/** Containers differ by browser; the first supported one wins. */
const RECORDER_MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/ogg;codecs=opus',
];

const pickMimeType = (): string => {
  if (typeof MediaRecorder === 'undefined') return '';
  return RECORDER_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type)) ?? '';
};

/** Five bars that rise and fall while the microphone is open. */
const ListeningBars: React.FC = () => (
  <span className="flex items-end gap-[3px]" aria-hidden="true">
    {[0, 1, 2, 3, 4].map((index) => (
      <motion.span
        key={index}
        className="w-[3px] rounded-full bg-current"
        animate={{ height: ['6px', '16px', '9px', '18px', '7px'] }}
        transition={{
          duration: 1.1,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.11,
        }}
      />
    ))}
  </span>
);

/**
 * Floating microphone that listens, answers, and takes the user where they
 * asked to go.
 *
 * Speaking is the fastest input on a phone in a field, and typing a crop
 * question in Tamil or Kannada on a small keyboard is slow enough that most
 * people simply will not. The reply is both shown and spoken, so it works
 * whether or not the person reads comfortably.
 */
export const VoiceAssistantBubble: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const { language, updatePermission } = useAppState();
  const { available, speak, stop: stopSpeaking } = useSpeech();

  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<AssistantPhase>('idle');
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const autoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigateRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const releaseRecorder = useCallback(() => {
    if (autoStopRef.current) {
      clearTimeout(autoStopRef.current);
      autoStopRef.current = null;
    }

    const recorder = recorderRef.current;
    if (recorder) {
      // Releasing the tracks is what turns off the browser's recording
      // indicator; without it the tab looks like it is still listening.
      recorder.stream.getTracks().forEach((track) => track.stop());
      recorderRef.current = null;
    }
  }, []);

  /**
   * Tears the microphone down when the screen changes or the bubble unmounts.
   *
   * Keyed on `pathname` and written as a cleanup, so leaving a screen mid-
   * recording cannot leave the browser's recording indicator lit behind you.
   */
  useEffect(
    () => () => {
      releaseRecorder();
      if (navigateRef.current) clearTimeout(navigateRef.current);
      setPhase('idle');
    },
    [pathname, releaseRecorder],
  );

  /** Answers the question, speaks the answer, then acts on it. */
  const respondTo = useCallback(
    (heard: string) => {
      const match = resolveVoiceIntent(heard);

      const answer = match
        ? t(match.intent.replyKey, match.intent.replyFallback)
        : t(
            'voiceReplyUnknown',
            'I did not catch a command I know. Try: scan my crop, show the weather, open the market, or how does it work.',
          );

      setReply(answer);
      setPhase('answered');
      speak(REPLY_SPEECH_ID, answer);

      // The reply is spoken before the screen changes, so the user hears what
      // is about to happen rather than being moved mid-sentence.
      if (match?.intent.route && match.intent.route !== pathname) {
        navigateRef.current = setTimeout(() => {
          router.push(match.intent.route as string);
          setOpen(false);
        }, 1400);
      }
    },
    [pathname, router, speak, t],
  );

  const transcribe = useCallback(
    async (clip: Blob) => {
      setPhase('thinking');

      const form = new FormData();
      form.append('audio', clip, 'question.webm');
      form.append('languageCode', language);

      try {
        const response = await fetch('/api/voice/transcribe', { method: 'POST', body: form });
        const body = (await response.json()) as { text?: string; error?: string };

        if (!response.ok) {
          throw new Error(body.error ?? t('voiceErrorGeneric', 'That did not work. Try again.'));
        }

        const heard = (body.text ?? '').trim();

        if (!heard) {
          setPhase('idle');
          setError(t('voiceErrorNoSpeech', 'I did not hear anything. Tap the mic and speak clearly.'));
          return;
        }

        setTranscript(heard);
        respondTo(heard);
      } catch (cause) {
        setPhase('idle');
        setError(
          cause instanceof Error
            ? cause.message
            : t('voiceErrorGeneric', 'That did not work. Try again.'),
        );
      }
    },
    [language, respondTo, t],
  );

  const stopListening = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state === 'recording') {
      // `onstop` assembles the clip and hands it to `transcribe`.
      recorder.stop();
    }
  }, []);

  const startListening = useCallback(async () => {
    setError(null);
    setTranscript('');
    setReply('');
    stopSpeaking();

    if (typeof MediaRecorder === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setError(t('voiceErrorUnsupported', 'This browser cannot record audio.'));
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      updatePermission('microphone', 'denied');
      setError(
        t('voiceErrorDenied', 'Microphone access is blocked. Allow it in your browser settings.'),
      );
      return;
    }

    updatePermission('microphone', 'granted');

    const mimeType = pickMimeType();
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

    chunksRef.current = [];
    recorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };

    recorder.onstop = () => {
      const clip = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
      chunksRef.current = [];
      releaseRecorder();

      if (clip.size === 0) {
        setPhase('idle');
        setError(t('voiceErrorNoSpeech', 'I did not hear anything. Tap the mic and speak clearly.'));
        return;
      }

      void transcribe(clip);
    };

    recorder.start();
    setPhase('listening');

    // A recorder left running by a forgotten tap would upload minutes of audio
    // and bill for it, so the clip is capped whatever the user does.
    autoStopRef.current = setTimeout(stopListening, MAX_RECORDING_MS);
  }, [releaseRecorder, stopListening, stopSpeaking, t, transcribe, updatePermission]);

  const closePanel = useCallback(() => {
    releaseRecorder();
    stopSpeaking();
    if (navigateRef.current) clearTimeout(navigateRef.current);
    setOpen(false);
    setPhase('idle');
  }, [releaseRecorder, stopSpeaking]);

  if (!available || HIDDEN_ROUTES.includes(pathname)) return null;

  const suggestions = [
    t('voiceSuggestScan', 'Scan my crop'),
    t('voiceSuggestWeather', "Today's weather"),
    t('voiceSuggestMarket', 'Open the market'),
    t('voiceSuggestHow', 'How does it work?'),
  ];

  const busy = phase === 'thinking';
  const listening = phase === 'listening';

  return (
    <div
      className={cn(
        'fixed right-4 z-40 flex flex-col items-end gap-3 sm:right-6',
        // Clears the tab bar on phones; on laptops the bar is gone and the
        // bubble can sit closer to the edge.
        'bottom-[calc(var(--bottom-nav-h)+1rem+env(safe-area-inset-bottom,0px))] lg:bottom-6',
      )}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            role="dialog"
            aria-label={t('voiceAssistant', 'Voice assistant')}
            className="flex w-[min(20rem,calc(100vw-2rem))] flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-soft-lg sm:w-80"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm font-black tracking-tight text-slate-900">
                <Sparkles className="h-4 w-4 text-agro-600" />
                {t('voiceAssistant', 'Voice assistant')}
              </span>
              <button
                type="button"
                onClick={closePanel}
                aria-label={t('close', 'Close')}
                className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex max-h-64 flex-col gap-2.5 overflow-y-auto">
              {transcript && (
                <div className="self-end rounded-2xl rounded-br-md bg-agro-600 px-3.5 py-2 text-xs font-semibold leading-relaxed text-white">
                  {transcript}
                </div>
              )}

              {reply && (
                <div className="flex items-start gap-2 self-start">
                  <div className="rounded-2xl rounded-bl-md bg-slate-100 px-3.5 py-2 text-xs font-medium leading-relaxed text-slate-700">
                    {reply}
                  </div>
                  <SpeakButton text={reply} size="sm" tone="subtle" label={t('voiceAssistant', 'Voice assistant')} />
                </div>
              )}

              {!transcript && !reply && !error && (
                <p className="text-xs font-medium leading-relaxed text-slate-500">
                  {t(
                    'voiceAssistantHint',
                    'Tap the microphone and ask in your own language. I can open any screen or explain how LeafCare works.',
                  )}
                </p>
              )}

              {error && (
                <p className="rounded-2xl bg-amber-50 px-3 py-2 text-xs font-medium leading-relaxed text-amber-800">
                  {error}
                </p>
              )}
            </div>

            {!transcript && !listening && !busy && (
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((suggestion) => (
                  <span
                    key={suggestion}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                  >
                    {suggestion}
                  </span>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={listening ? stopListening : startListening}
              disabled={busy}
              className={cn(
                'flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition-colors disabled:cursor-not-allowed',
                listening
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'bg-agro-600 text-white hover:bg-agro-700 disabled:bg-slate-200 disabled:text-slate-500',
              )}
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('voiceThinking', 'Understanding…')}
                </>
              ) : listening ? (
                <>
                  <ListeningBars />
                  {t('voiceStopListening', 'Tap to stop')}
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  {t('voiceStartListening', 'Tap and speak')}
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => (open ? closePanel() : setOpen(true))}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-expanded={open}
        aria-label={t('voiceAssistant', 'Voice assistant')}
        className={cn(
          'relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-soft-lg ring-4 ring-white transition-colors',
          listening
            ? 'bg-gradient-to-tr from-rose-600 to-rose-400 shadow-rose-500/40'
            : 'bg-gradient-to-tr from-agro-600 via-emerald-500 to-agro-400 shadow-agro-600/40',
        )}
      >
        {/* Expanding halo, so an open microphone is obvious from across a screen. */}
        {listening && (
          <motion.span
            className="absolute inset-0 rounded-full bg-rose-500/40"
            animate={{ scale: [1, 1.55], opacity: [0.55, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
          />
        )}

        {busy ? (
          <Loader2 className="relative h-6 w-6 animate-spin" />
        ) : open && listening ? (
          <Square className="relative h-5 w-5 fill-current" />
        ) : (
          <Mic className="relative h-6 w-6 stroke-[2.5]" />
        )}
      </motion.button>
    </div>
  );
};
