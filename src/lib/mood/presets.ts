import type { MoodMode, MoodState } from './types';

export const MOOD_MODES: MoodMode[] = ['butterflies', 'koi', 'none'];

/** Cada ambiente sugiere una cinta, pero nunca la reproduce por su cuenta. */
const SUGGESTED_TAPES: Record<MoodMode, string> = {
  butterflies: 'tape-02',
  koi: 'tape-05',
  none: 'tape-01',
};

export const DEFAULT_MOOD_STATE: MoodState = {
  mode: 'butterflies',
};

export function getSuggestedTapeId(mode: MoodMode): string {
  return SUGGESTED_TAPES[mode];
}
