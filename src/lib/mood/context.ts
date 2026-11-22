import { createContext, useContext } from 'react';
import type { MoodMode } from './types';

export interface MoodContextValue {
  mode: MoodMode;
  suggestedTapeId: string;
  setMode: (mode: MoodMode) => void;
}

export const MoodContext = createContext<MoodContextValue | null>(null);

export function useMood(): MoodContextValue {
  const context = useContext(MoodContext);
  if (!context) throw new Error('useMood debe usarse dentro de MoodProvider');
  return context;
}
