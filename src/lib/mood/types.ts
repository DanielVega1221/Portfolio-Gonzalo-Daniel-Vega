export type WildlifeCreature =
  | 'butterflies'
  | 'koi'
  | 'hummingbirds'
  | 'petals'
  | 'comets'
  | 'turtles'
  | 'rain'
  | 'snow'
  | 'jellyfish';

/** Los diez estados que el usuario puede elegir desde MOOD. */
export type MoodMode = WildlifeCreature | 'none';

export type ButterflySpecies = 'mixed' | 'morpho' | 'monarch' | 'luna' | 'violet' | 'ink';

export type CursorInteractionMode = 'breeze' | 'attract' | 'calm';

export type PixelOverlayMode = 'ascii-pixels' | 'ascii-only' | 'pixels-only';

export interface MoodState {
  mode: MoodMode;
}
