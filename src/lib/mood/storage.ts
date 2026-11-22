import { safeGet, safeSet } from '../safeStorage';
import { DEFAULT_MOOD_STATE, MOOD_MODES } from './presets';
import type { MoodMode, MoodState } from './types';

const STORAGE_KEY = 'gdv_mood_v1';

function pick<T extends string>(value: unknown, allowed: T[], fallback: T): T {
  return typeof value === 'string' && (allowed as string[]).includes(value) ? (value as T) : fallback;
}

/** Migra el guardado anterior: paper/ink → mariposas, pond/dusk → koi. */
function legacyPresetMode(value: unknown): MoodMode | null {
  if (value === 'paper' || value === 'ink') return 'butterflies';
  if (value === 'pond' || value === 'dusk') return 'koi';
  return null;
}

export function loadMoodState(): MoodState {
  const stored = safeGet(STORAGE_KEY);
  if (!stored) return DEFAULT_MOOD_STATE;

  try {
    const parsed = JSON.parse(stored) as Record<string, unknown>;
    const config = (parsed.config && typeof parsed.config === 'object' ? parsed.config : {}) as Record<string, unknown>;
    const legacy = legacyPresetMode(parsed.presetId);
    const mode = pick(parsed.mode ?? config.creature ?? legacy, MOOD_MODES, DEFAULT_MOOD_STATE.mode);
    return { mode };
  } catch {
    return DEFAULT_MOOD_STATE;
  }
}

export function saveMoodState(state: MoodState): void {
  safeSet(STORAGE_KEY, JSON.stringify(state));
}
