import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { MoodContext, type MoodContextValue } from './context';
import { getSuggestedTapeId } from './presets';
import { loadMoodState, saveMoodState } from './storage';
import type { MoodMode, MoodState } from './types';

export function MoodProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MoodState>(loadMoodState);

  useEffect(() => {
    saveMoodState(state);
  }, [state]);

  const setMode = useCallback((mode: MoodMode) => {
    setState({ mode });
  }, []);

  const value = useMemo<MoodContextValue>(
    () => ({
      mode: state.mode,
      suggestedTapeId: getSuggestedTapeId(state.mode),
      setMode,
    }),
    [state.mode, setMode],
  );

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
}
