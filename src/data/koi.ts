export type KoiBehavior = 'calm' | 'smooth' | 'riser' | 'dart';

export interface KoiVarietyInfo {
  id: string;
  name: string;
  /** Patrón de movimiento dentro de la barra verde. */
  behavior: KoiBehavior;
  basePoints: number;
  accentColor: string;
  /** Sprite pixel art servido desde /fish/. */
  sprite: string;
}

/** Las cuatro variedades del estanque. Base antes del multiplicador de tamaño y racha. */
export const KOI_VARIETIES: KoiVarietyInfo[] = [
  {
    id: 'kohaku',
    name: 'Kohaku',
    behavior: 'calm',
    basePoints: 100,
    accentColor: '#EF4444',
    sprite: '/fish/kohaku.png',
  },
  {
    id: 'yamabuki',
    name: 'Yamabuki Dorado',
    behavior: 'dart',
    basePoints: 350,
    accentColor: '#FACC15',
    sprite: '/fish/yamabuki.png',
  },
  {
    id: 'showa',
    name: 'Showa Sanke',
    behavior: 'riser',
    basePoints: 220,
    accentColor: '#FB7185',
    sprite: '/fish/showa.png',
  },
  {
    id: 'asagi',
    name: 'Asagi',
    behavior: 'smooth',
    basePoints: 150,
    accentColor: '#C2703D',
    sprite: '/fish/asagi.png',
  },
];
