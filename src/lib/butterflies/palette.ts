export interface ButterflyPalette {
  paper: string;
  accent: string;
  ink: string;
  pollen: string;
  soft: string;
}

const FALLBACK: ButterflyPalette = {
  paper: '#f9f7f2',
  accent: '#a84432',
  ink: '#1a1a1a',
  pollen: '#c47a38',
  soft: '#cbc8bf',
};

/** Lee los tokens del tema (definidos en index.css) para que el fondo herede
 *  los mismos colores que el resto del portfolio. Si no están, usa los fallback. */
export function readButterflyPalette(): ButterflyPalette {
  if (typeof window === 'undefined') return FALLBACK;
  const styles = window.getComputedStyle(document.documentElement);
  const read = (name: keyof ButterflyPalette): string =>
    styles.getPropertyValue(`--color-${name}`).trim() || FALLBACK[name];
  return {
    paper: read('paper'),
    accent: read('accent'),
    ink: read('ink'),
    pollen: read('pollen'),
    soft: read('soft'),
  };
}
