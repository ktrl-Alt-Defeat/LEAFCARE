/**
 * Shared limits for the read-aloud and microphone features.
 *
 * Imported by both the browser components and the `/api/voice/*` handlers, so
 * the client trims to the same ceiling the server enforces.
 */

/**
 * Mirrors ELEVEN_LABS_MAX_CHARS on the backend. Synthesis is billed per
 * character, so a card that grows past this is cut rather than refused —
 * hearing most of the advice beats hearing an error.
 */
export const MAX_SPEECH_CHARACTERS = 2500;

/** Longest single recording. A question is a sentence, not a monologue. */
export const MAX_RECORDING_MS = 20_000;

/**
 * A segment of a spoken script. `false` is accepted so callers can write the
 * usual `condition && 'text'` inline, exactly as they would in JSX.
 */
export type SpeechPart = string | number | false | null | undefined;

/**
 * Joins the parts of a card into one script.
 *
 * Blocks are separated by a full stop and a space so the voice pauses between
 * a heading and its list instead of running them together, and blank entries
 * are dropped so a missing field never produces a stray pause.
 */
export const buildSpeech = (parts: SpeechPart[]): string => {
  const segments = parts
    .map((part) => (part === null || part === undefined || part === false ? '' : String(part).trim()))
    .filter(Boolean)
    // A segment that already ends in punctuation should not gain a second mark.
    .map((part) => (/[.!?:;]$/.test(part) ? part : `${part}.`));

  return segments.join(' ').slice(0, MAX_SPEECH_CHARACTERS);
};
