import type { MoodMode, MoodState } from './types';

export const MOOD_MODES: MoodMode[] = [
  'butterflies',
  'koi',
  'hummingbirds',
  'petals',
  'comets',
  'turtles',
  'rain',
  'snow',
  'jellyfish',
  'none',
];

/** Cada ambiente sugiere una cinta, pero nunca la reproduce por su cuenta. */
const SUGGESTED_TAPES: Record<MoodMode, string> = {
  butterflies: 'tape-02',
  koi: 'tape-05',
  hummingbirds: 'tape-02',
  petals: 'tape-01',
  comets: 'tape-04',
  turtles: 'tape-05',
  rain: 'tape-04',
  snow: 'tape-01',
  jellyfish: 'tape-03',
  none: 'tape-01',
};

export const DEFAULT_MOOD_STATE: MoodState = {
  mode: 'butterflies',
};

export function getSuggestedTapeId(mode: MoodMode): string {
  return SUGGESTED_TAPES[mode];
}
