import React, { useEffect, useRef } from 'react';
import { readButterflyPalette } from '../lib/butterflies/palette';
import type {
  ButterflySpecies,
  CursorInteractionMode,
  PixelOverlayMode,
  WildlifeCreature,
} from '../lib/mood/types';

export type { ButterflySpecies, CursorInteractionMode, PixelOverlayMode, WildlifeCreature };
export interface AsciiButterflyBackgroundProps {
  /** Which living scene to render behind the pixel/ASCII overlay */ creature?: WildlifeCreature;
  /** Number of active entities behind the pixel/ASCII overlay */ count?: number;
  /** Movement and animation speed multiplier */ speed?: number;
  /** Color palette preset */ species?: ButterflySpecies;
  /** How entities react to pointer movement */ interactionMode?: CursorInteractionMode;
  /** Pixel / ASCII grid cell size in CSS pixels (8 - 22) */ cellSize?: number;
  /** Visual rendering mode for the overlay */ overlayMode?: PixelOverlayMode;
  /** Entity size multiplier */ scale?: number;
  /** Show subtle drifting background color shapes, wakes & trails */ showAmbientParticles?: boolean;
  /** Surface theme for optimal contrast */ theme?: 'dark' | 'light';
  /** Pause animation loop */ paused?: boolean;
  /** Render cap, para liberar el main thread mientras hay un panel animando */ fps?: number;
  /** Global canvas opacity (0.1 - 1) */ opacity?: number;
  /** Allow clicking empty background to interact/spawn */ spawnOnClick?: boolean;
  className?: string;
}
interface PaletteColors {
  wingInner: string;
  wingMid: string;
  wingEdge: string;
  spot: string;
  body: string;
  glow: string;
}
interface KoiPalette {
  body: string;
  patchPrimary: string;
  patchSecondary: string;
  fins: string;
  glow: string;
}
interface AccentThemePalette {
  primary: string;
  secondary: string;
  highlight: string;
  deep: string;
  glow: string;
}
// Paletas derivadas de los tokens del portfolio: el fondo hereda papel, tinta,
// terracota y ámbar en vez de los azules/neones del componente original.
const T = readButterflyPalette();

function mixHex(a: string, b: string, amount: number): string {
  const toRgb = (hex: string) => {
    const clean = hex.replace('#', '');
    const full =
      clean.length === 3
        ? clean
            .split('')
            .map((c) => c + c)
            .join('')
        : clean;
    const value = Number.parseInt(full.slice(0, 6), 16);
    return Number.isNaN(value) ? [0, 0, 0] : [(value >> 16) & 255, (value >> 8) & 255, value & 255];
  };
  const from = toRgb(a);
  const to = toRgb(b);
  return `#${from
    .map((v, i) =>
      Math.round(v + (to[i] - v) * amount)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
}

function rgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const value = Number.parseInt(full.slice(0, 6), 16);
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
}

const SPECIES_KEYS = ['morpho', 'monarch', 'luna', 'violet', 'ink'] as const;
type SpeciesKey = (typeof SPECIES_KEYS)[number];
const MIXED_KEYS: SpeciesKey[] = [...SPECIES_KEYS];

const SPECIES_BASE: Record<SpeciesKey, { inner: string; mid: string; edge: string; spot: string }> =
  {
    morpho: {
      inner: mixHex(T.accent, T.paper, 0.35),
      mid: T.accent,
      edge: mixHex(T.accent, T.ink, 0.38),
      spot: T.pollen,
    },
    monarch: {
      inner: mixHex(T.pollen, T.paper, 0.34),
      mid: T.pollen,
      edge: mixHex(T.pollen, T.ink, 0.38),
      spot: T.accent,
    },
    luna: {
      inner: mixHex(T.soft, T.paper, 0.36),
      mid: mixHex(T.soft, T.ink, 0.32),
      edge: mixHex(T.ink, T.soft, 0.36),
      spot: T.accent,
    },
    violet: {
      inner: mixHex(T.accent, T.ink, 0.28),
      mid: mixHex(T.accent, T.ink, 0.55),
      edge: mixHex(T.accent, T.ink, 0.75),
      spot: T.pollen,
    },
    ink: {
      inner: mixHex(T.ink, T.paper, 0.36),
      mid: mixHex(T.ink, T.accent, 0.22),
      edge: mixHex(T.ink, T.soft, 0.35),
      spot: T.pollen,
    },
  };

const PALETTES = Object.fromEntries(
  SPECIES_KEYS.map((key) => {
    const b = SPECIES_BASE[key];
    return [
      key,
      {
        light: {
          wingInner: b.inner,
          wingMid: b.mid,
          wingEdge: b.edge,
          spot: b.spot,
          body: T.ink,
          glow: rgba(b.mid, 0.28),
        },
        dark: {
          wingInner: mixHex(b.inner, T.paper, 0.18),
          wingMid: b.mid,
          wingEdge: mixHex(b.edge, T.paper, 0.2),
          spot: mixHex(b.spot, T.paper, 0.2),
          body: mixHex(T.ink, T.paper, 0.25),
          glow: rgba(b.mid, 0.36),
        },
      },
    ];
  }),
) as Record<SpeciesKey, { dark: PaletteColors; light: PaletteColors }>;

function koiVariant(body: string, primary: string, secondary: string): KoiPalette {
  return {
    body,
    patchPrimary: primary,
    patchSecondary: secondary,
    fins: rgba(mixHex(secondary, body, 0.34), 0.82),
    glow: rgba(primary, 0.28),
  };
}

const KOI_PALETTES = Object.fromEntries(
  SPECIES_KEYS.map((key) => {
    const b = SPECIES_BASE[key];
    return [
      key,
      {
        light: [
          koiVariant(mixHex(T.paper, b.spot, 0.2), b.mid, mixHex(b.mid, b.spot, 0.4)),
          koiVariant(mixHex(b.spot, T.paper, 0.42), b.spot, b.mid),
        ],
        dark: [koiVariant(mixHex(T.paper, b.spot, 0.1), b.mid, mixHex(b.mid, b.spot, 0.3))],
      },
    ];
  }),
) as Record<SpeciesKey, { dark: KoiPalette[]; light: KoiPalette[] }>;

const MIXED_KOI_LIGHT = [
  koiVariant(T.accent, mixHex(T.accent, T.ink, 0.3), T.pollen),
  koiVariant(T.pollen, mixHex(T.pollen, T.ink, 0.2), T.accent),
  koiVariant(mixHex(T.soft, T.paper, 0.2), T.accent, T.ink),
];
const MIXED_KOI_DARK = MIXED_KOI_LIGHT.map((p) => ({
  ...p,
  body: mixHex(p.body, T.paper, 0.2),
  glow: rgba(p.patchPrimary, 0.34),
}));

function accentVariant(
  primary: string,
  secondary: string,
  highlight: string,
  deep: string,
): AccentThemePalette {
  return {
    primary,
    secondary,
    highlight,
    deep,
    glow: rgba(primary, 0.3),
  };
}

const ACCENT_PALETTES = Object.fromEntries(
  SPECIES_KEYS.map((key) => {
    const b = SPECIES_BASE[key];
    const primary = b.mid;
    const secondary = b.edge;
    const highlight = b.spot;
    const deep = mixHex(b.edge, T.ink, 0.4);
    return [
      key,
      {
        light: accentVariant(primary, secondary, highlight, deep),
        dark: {
          primary: mixHex(primary, T.paper, 0.16),
          secondary,
          highlight: mixHex(highlight, T.paper, 0.2),
          deep,
          glow: rgba(primary, 0.38),
        },
      },
    ];
  }),
) as Record<SpeciesKey, { dark: AccentThemePalette; light: AccentThemePalette }>;

const ACCENT_TRIPLES: Array<[string, string, string]> = [
  [T.accent, T.pollen, mixHex(T.accent, T.paper, 0.4)],
  [T.pollen, T.accent, mixHex(T.pollen, T.paper, 0.4)],
  [mixHex(T.ink, T.accent, 0.35), T.soft, mixHex(T.soft, T.paper, 0.4)],
];

function mixedAccents(): Array<{ dark: AccentThemePalette; light: AccentThemePalette }> {
  return ACCENT_TRIPLES.map(([primary, secondary, highlight]) => ({
    light: accentVariant(primary, secondary, highlight, mixHex(secondary, T.ink, 0.4)),
    dark: {
      primary: mixHex(primary, T.paper, 0.16),
      secondary,
      highlight,
      deep: mixHex(secondary, T.ink, 0.4),
      glow: rgba(primary, 0.38),
    },
  }));
}

const PETAL_MIXED_COLORS = mixedAccents();
const ASCII_RAMP = ' .,:;~=+*#%@';
/** Ajuste global de presencia del fondo sobre el papel (1 = diseño original). */
const BACKGROUND_VISIBILITY = 1.1;
interface CreatureEntity {
  x: number;
  y: number;
  angle: number;
  baseSpeed: number;
  size: number;
  paletteKey: Exclude<ButterflySpecies, 'mixed'>;
  variantIdx: number;
  phase: number;
  phaseRate: number;
  glideTimer: number;
  hoverTimer: number;
  targetY: number;
  seedA: number;
  seedB: number;
  boostVx: number;
  boostVy: number;
  excitement: number;
  offscreenFor: number;
  trail: Array<{ x: number; y: number; color: string }>;
}
interface AmbientBlob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: string;
}
interface RippleWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color?: string;
}
interface InteractivePoint {
  x: number;
  y: number;
  life: number;
  radius: number;
  color: string;
}
function createCreature(
  width: number,
  height: number,
  species: ButterflySpecies,
  idx: number,
  overrideX?: number,
  overrideY?: number,
): CreatureEntity {
  const paletteKey = species === 'mixed' ? MIXED_KEYS[idx % MIXED_KEYS.length] : species;
  const size = 76 + Math.random() * 68;
  return {
    x: overrideX ?? Math.random() * width,
    y: overrideY ?? Math.random() * height,
    angle: Math.random() * Math.PI * 2,
    baseSpeed: 36 + Math.random() * 34,
    size,
    paletteKey,
    variantIdx: idx,
    phase: Math.random() * Math.PI * 2,
    phaseRate: 5.5 + Math.random() * 3.2,
    glideTimer: Math.random() * 2.5,
    hoverTimer: Math.random() * 3.5,
    targetY: height * (0.2 + Math.random() * 0.72),
    seedA: Math.random() * 100,
    seedB: Math.random() * 100,
    boostVx: 0,
    boostVy: 0,
    excitement: overrideX !== undefined ? 0.9 : 0,
    offscreenFor: 0,
    trail: [],
  };
}
function respawnCreature(b: CreatureEntity, width: number, height: number) {
  b.x = Math.random() * width;
  b.y = Math.random() * height;
  b.angle = Math.random() * Math.PI * 2;
  b.baseSpeed = 36 + Math.random() * 34;
  b.phase = Math.random() * Math.PI * 2;
  b.seedA = Math.random() * 100;
  b.seedB = Math.random() * 100;
  b.boostVx = 0;
  b.boostVy = 0;
  b.excitement = 0;
  b.offscreenFor = 0;
  b.trail = [];
}
function getKoiPalette(
  species: ButterflySpecies,
  entity: CreatureEntity,
  theme: 'dark' | 'light',
): KoiPalette {
  if (species === 'mixed') {
    const arr = theme === 'dark' ? MIXED_KOI_DARK : MIXED_KOI_LIGHT;
    return arr[entity.variantIdx % arr.length];
  }
  const arr = KOI_PALETTES[entity.paletteKey][theme];
  return arr[entity.variantIdx % arr.length];
}
function getAccentPalette(
  creature: WildlifeCreature,
  species: ButterflySpecies,
  entity: CreatureEntity,
  theme: 'dark' | 'light',
): AccentThemePalette {
  if (species === 'mixed') {
    if (creature === 'petals') {
      return PETAL_MIXED_COLORS[entity.variantIdx % PETAL_MIXED_COLORS.length][theme];
    }
  }
  return ACCENT_PALETTES[entity.paletteKey][theme];
}
function drawKoiFish(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  length: number,
  swimPhase: number,
  palette: KoiPalette,
) {
  const aura = ctx.createRadialGradient(x, y, length * 0.08, x, y, length * 0.9);
  aura.addColorStop(0, palette.glow);
  aura.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(x, y, length * 0.9, 0, Math.PI * 2);
  ctx.fill();
  const numSegs = 7;
  const segStep = (length * 0.95) / (numSegs - 1);
  const backDir = angle + Math.PI;
  const perpX = Math.cos(angle + Math.PI / 2);
  const perpY = Math.sin(angle + Math.PI / 2);
  const backX = Math.cos(backDir);
  const backY = Math.sin(backDir);
  const spine: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < numSegs; i++) {
    const t = i / (numSegs - 1);
    const waveAmp = (0.04 + t * t * 0.22) * length;
    const sway = Math.sin(swimPhase - i * 0.68) * waveAmp;
    spine.push({
      x: x + backX * (i * segStep) + perpX * sway,
      y: y + backY * (i * segStep) + perpY * sway,
    });
  }
  const finAnchor = spine[1];
  const finRow = Math.sin(swimPhase * 0.85) * 0.35;
  const finLen = length * 0.28;
  for (const side of [-1, 1]) {
    const finAngle = angle + side * (Math.PI * 0.62 + finRow);
    const tipX = finAnchor.x + Math.cos(finAngle) * finLen;
    const tipY = finAnchor.y + Math.sin(finAngle) * finLen;
    const ctrlX = finAnchor.x + Math.cos(finAngle - side * 0.45) * (finLen * 0.85);
    const ctrlY = finAnchor.y + Math.sin(finAngle - side * 0.45) * (finLen * 0.85);
    ctx.fillStyle = palette.fins;
    ctx.beginPath();
    ctx.moveTo(finAnchor.x, finAnchor.y);
    ctx.quadraticCurveTo(ctrlX, ctrlY, tipX, tipY);
    ctx.quadraticCurveTo(
      finAnchor.x + backX * (length * 0.16),
      finAnchor.y + backY * (length * 0.16),
      spine[2].x,
      spine[2].y,
    );
    ctx.closePath();
    ctx.fill();
  }
  const tailBase = spine[numSegs - 1];
  const tailPrev = spine[numSegs - 2];
  const tailDir = Math.atan2(tailBase.y - tailPrev.y, tailBase.x - tailPrev.x);
  const tailLen = length * 0.34;
  const tailSpread = 0.56;
  ctx.fillStyle = palette.fins;
  ctx.beginPath();
  ctx.moveTo(tailBase.x, tailBase.y);
  ctx.lineTo(
    tailBase.x + Math.cos(tailDir + tailSpread) * tailLen,
    tailBase.y + Math.sin(tailDir + tailSpread) * tailLen,
  );
  ctx.quadraticCurveTo(
    tailBase.x + Math.cos(tailDir) * (tailLen * 0.48),
    tailBase.y + Math.sin(tailDir) * (tailLen * 0.48),
    tailBase.x + Math.cos(tailDir - tailSpread) * tailLen,
    tailBase.y + Math.sin(tailDir - tailSpread) * tailLen,
  );
  ctx.closePath();
  ctx.fill();
  const widths = [0.11, 0.21, 0.22, 0.17, 0.12, 0.07, 0.035].map((w) => w * length);
  const leftPts: Array<{ x: number; y: number }> = [];
  const rightPts: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < numSegs; i++) {
    const p = spine[i];
    const next = spine[Math.min(numSegs - 1, i + 1)];
    const prev = spine[Math.max(0, i - 1)];
    const tangent = Math.atan2(next.y - prev.y, next.x - prev.x);
    const normal = tangent + Math.PI / 2;
    const nx = Math.cos(normal);
    const ny = Math.sin(normal);
    leftPts.push({ x: p.x + nx * widths[i], y: p.y + ny * widths[i] });
    rightPts.push({ x: p.x - nx * widths[i], y: p.y - ny * widths[i] });
  }
  ctx.save();
  ctx.beginPath();
  ctx.arc(spine[0].x, spine[0].y, widths[0] * 0.95, angle - Math.PI / 2, angle + Math.PI / 2);
  for (let i = 0; i < numSegs; i++) {
    ctx.lineTo(leftPts[i].x, leftPts[i].y);
  }
  for (let i = numSegs - 1; i >= 0; i--) {
    ctx.lineTo(rightPts[i].x, rightPts[i].y);
  }
  ctx.closePath();
  ctx.fillStyle = palette.body;
  ctx.fill();
  ctx.clip();
  ctx.fillStyle = palette.patchPrimary;
  ctx.beginPath();
  ctx.ellipse(spine[1].x, spine[1].y, widths[1] * 1.15, widths[1] * 0.85, angle, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(
    spine[3].x + perpX * widths[3] * 0.25,
    spine[3].y + perpY * widths[3] * 0.25,
    widths[2] * 0.95,
    widths[2] * 0.65,
    angle + 0.3,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.fillStyle = palette.patchSecondary;
  ctx.beginPath();
  ctx.ellipse(
    spine[4].x - perpX * widths[4] * 0.2,
    spine[4].y - perpY * widths[4] * 0.2,
    widths[3] * 0.75,
    widths[3] * 0.55,
    angle - 0.2,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.restore();
}
function drawButterflyShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  radius: number,
  flapCompression: number,
  colors: PaletteColors,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle + Math.PI / 2);
  const aura = ctx.createRadialGradient(0, 0, radius * 0.1, 0, 0, radius * 1.15);
  aura.addColorStop(0, colors.glow);
  aura.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 1.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.save();
  ctx.scale(flapCompression, 1);
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.scale(side, 1);
    const grad = ctx.createRadialGradient(
      radius * 0.22,
      -radius * 0.08,
      radius * 0.05,
      radius * 0.45,
      0,
      radius * 1.05,
    );
    grad.addColorStop(0, colors.wingInner);
    grad.addColorStop(0.55, colors.wingMid);
    grad.addColorStop(1, colors.wingEdge);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, -radius * 0.14);
    ctx.bezierCurveTo(
      radius * 0.45,
      -radius * 0.92,
      radius * 1.12,
      -radius * 0.65,
      radius * 0.96,
      -radius * 0.02,
    );
    ctx.bezierCurveTo(radius * 0.85, radius * 0.22, radius * 0.32, radius * 0.16, 0, radius * 0.06);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, radius * 0.04);
    ctx.bezierCurveTo(
      radius * 0.48,
      radius * 0.06,
      radius * 0.82,
      radius * 0.36,
      radius * 0.62,
      radius * 0.78,
    );
    ctx.bezierCurveTo(radius * 0.44, radius * 0.96, radius * 0.14, radius * 0.66, 0, radius * 0.34);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = colors.spot;
    ctx.beginPath();
    ctx.ellipse(radius * 0.56, -radius * 0.28, radius * 0.16, radius * 0.12, -0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(radius * 0.42, radius * 0.44, radius * 0.09, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
  ctx.fillStyle = colors.body;
  ctx.beginPath();
  ctx.ellipse(0, 0, Math.max(2, radius * 0.08), radius * 0.34, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = colors.wingInner;
  ctx.lineWidth = Math.max(1.2, radius * 0.035);
  ctx.beginPath();
  ctx.moveTo(-radius * 0.03, -radius * 0.28);
  ctx.quadraticCurveTo(-radius * 0.14, -radius * 0.54, -radius * 0.22, -radius * 0.58);
  ctx.moveTo(radius * 0.03, -radius * 0.28);
  ctx.quadraticCurveTo(radius * 0.14, -radius * 0.54, radius * 0.22, -radius * 0.58);
  ctx.stroke();
  ctx.restore();
}
function drawHummingbirdShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  radius: number,
  wingPhase: number,
  colors: AccentThemePalette,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle + Math.PI / 2);
  const aura = ctx.createRadialGradient(0, 0, radius * 0.08, 0, 0, radius * 1.1);
  aura.addColorStop(0, colors.glow);
  aura.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 1.1, 0, Math.PI * 2);
  ctx.fill();
  const wingSweep = Math.sin(wingPhase * 3.8) * 0.35;
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.scale(side, 1);
    ctx.globalAlpha = 0.34;
    ctx.fillStyle = colors.highlight;
    ctx.beginPath();
    ctx.moveTo(radius * 0.08, -radius * 0.08);
    ctx.bezierCurveTo(
      radius * 0.65,
      -radius * (0.72 + wingSweep),
      radius * 1.18,
      -radius * (0.28 - wingSweep * 0.4),
      radius * 0.92,
      radius * 0.16,
    );
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 0.88;
    const wGrad = ctx.createLinearGradient(0, -radius * 0.4, radius, radius * 0.1);
    wGrad.addColorStop(0, colors.primary);
    wGrad.addColorStop(1, colors.deep);
    ctx.fillStyle = wGrad;
    ctx.beginPath();
    ctx.moveTo(radius * 0.06, -radius * 0.08);
    ctx.bezierCurveTo(
      radius * 0.42,
      -radius * (0.58 - wingSweep * 0.5),
      radius * 1.08,
      -radius * (0.38 - wingSweep * 0.5),
      radius * 0.96,
      -radius * 0.02,
    );
    ctx.bezierCurveTo(
      radius * 0.72,
      radius * 0.14,
      radius * 0.28,
      radius * 0.1,
      radius * 0.06,
      radius * 0.08,
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = colors.deep;
  ctx.beginPath();
  ctx.moveTo(-radius * 0.08, radius * 0.22);
  ctx.lineTo(-radius * 0.28, radius * 0.72);
  ctx.quadraticCurveTo(0, radius * 0.58, radius * 0.28, radius * 0.72);
  ctx.lineTo(radius * 0.08, radius * 0.22);
  ctx.closePath();
  ctx.fill();
  const bodyGrad = ctx.createLinearGradient(0, -radius * 0.35, 0, radius * 0.35);
  bodyGrad.addColorStop(0, colors.highlight);
  bodyGrad.addColorStop(0.4, colors.primary);
  bodyGrad.addColorStop(1, colors.secondary);
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 0.14, radius * 0.36, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = colors.highlight;
  ctx.beginPath();
  ctx.arc(0, -radius * 0.18, radius * 0.11, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = colors.highlight;
  ctx.lineWidth = Math.max(2, radius * 0.045);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, -radius * 0.32);
  ctx.lineTo(0, -radius * 0.82);
  ctx.stroke();
  ctx.restore();
}
function drawPetalShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  radius: number,
  tumblePhase: number,
  colors: AccentThemePalette,
) {
  const r = radius * 0.72;
  const flipScale = 0.28 + 0.72 * Math.abs(Math.cos(tumblePhase));
  const isBackface = Math.cos(tumblePhase) < 0;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle + Math.sin(tumblePhase * 0.7) * 0.8);
  const aura = ctx.createRadialGradient(0, 0, r * 0.05, 0, 0, r * 1.15);
  aura.addColorStop(0, colors.glow);
  aura.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.scale(flipScale, 1);
  const grad = ctx.createLinearGradient(0, -r, 0, r);
  grad.addColorStop(0, isBackface ? colors.secondary : colors.highlight);
  grad.addColorStop(0.55, colors.primary);
  grad.addColorStop(1, colors.deep);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(0, r * 0.85);
  ctx.bezierCurveTo(-r * 0.82, r * 0.35, -r * 0.72, -r * 0.68, -r * 0.18, -r * 0.85);
  ctx.lineTo(0, -r * 0.62);
  ctx.lineTo(r * 0.18, -r * 0.85);
  ctx.bezierCurveTo(r * 0.72, -r * 0.68, r * 0.82, r * 0.35, 0, r * 0.85);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
function drawCometShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  radius: number,
  pulsePhase: number,
  trail: Array<{ x: number; y: number; color: string }>,
  colors: AccentThemePalette,
) {
  if (trail.length > 1) {
    for (let i = 0; i < trail.length; i++) {
      const pt = trail[i];
      const ratio = (i + 1) / trail.length;
      ctx.globalAlpha = ratio * 0.68;
      ctx.fillStyle = i > trail.length * 0.65 ? colors.highlight : colors.primary;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, radius * 0.28 * ratio, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const coma = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.95);
  coma.addColorStop(0, colors.highlight);
  coma.addColorStop(0.35, colors.primary);
  coma.addColorStop(0.7, colors.glow);
  coma.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = coma;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.95, 0, Math.PI * 2);
  ctx.fill();
  const flare = radius * (0.55 + 0.15 * Math.sin(pulsePhase * 2));
  ctx.fillStyle = colors.highlight;
  ctx.beginPath();
  ctx.moveTo(flare, 0);
  ctx.lineTo(radius * 0.1, radius * 0.1);
  ctx.lineTo(0, flare * 0.65);
  ctx.lineTo(-radius * 0.1, radius * 0.1);
  ctx.lineTo(-flare * 1.15, 0);
  ctx.lineTo(-radius * 0.1, -radius * 0.1);
  ctx.lineTo(0, -flare * 0.65);
  ctx.lineTo(radius * 0.1, -radius * 0.1);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
function drawSeaTurtleShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  radius: number,
  strokePhase: number,
  colors: AccentThemePalette,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle + Math.PI / 2);
  const aura = ctx.createRadialGradient(0, 0, radius * 0.1, 0, 0, radius * 1.2);
  aura.addColorStop(0, colors.glow);
  aura.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 1.2, 0, Math.PI * 2);
  ctx.fill();
  const frontSweep = Math.sin(strokePhase) * 0.55;
  const backSweep = Math.cos(strokePhase) * 0.25;
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.scale(side, 1);
    ctx.save();
    ctx.translate(radius * 0.34, -radius * 0.18);
    ctx.rotate(frontSweep - 0.18);
    ctx.fillStyle = colors.secondary;
    ctx.beginPath();
    ctx.moveTo(0, -radius * 0.08);
    ctx.bezierCurveTo(
      radius * 0.55,
      -radius * 0.28,
      radius * 0.88,
      radius * 0.15,
      radius * 0.66,
      radius * 0.42,
    );
    ctx.bezierCurveTo(radius * 0.42, radius * 0.46, radius * 0.18, radius * 0.18, 0, radius * 0.12);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.translate(radius * 0.2, radius * 0.44);
    ctx.rotate(backSweep + 0.35);
    ctx.fillStyle = colors.deep;
    ctx.beginPath();
    ctx.ellipse(radius * 0.14, radius * 0.16, radius * 0.12, radius * 0.24, -0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.restore();
  }
  ctx.fillStyle = colors.secondary;
  ctx.beginPath();
  ctx.ellipse(0, -radius * 0.54, radius * 0.15, radius * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();
  const shellGrad = ctx.createRadialGradient(0, -radius * 0.05, radius * 0.06, 0, 0, radius * 0.56);
  shellGrad.addColorStop(0, colors.highlight);
  shellGrad.addColorStop(0.45, colors.primary);
  shellGrad.addColorStop(1, colors.deep);
  ctx.fillStyle = shellGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 0.44, radius * 0.54, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = colors.highlight;
  for (const offsetY of [-0.22, 0, 0.22]) {
    ctx.beginPath();
    ctx.ellipse(0, radius * offsetY, radius * 0.14, radius * 0.09, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
function drawRaindropStreak(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  radius: number,
  colors: AccentThemePalette,
) {
  const len = radius * 0.95;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const grad = ctx.createLinearGradient(-len, 0, len * 0.2, 0);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.65, colors.primary);
  grad.addColorStop(1, colors.highlight);
  ctx.strokeStyle = grad;
  ctx.lineWidth = Math.max(8, radius * 0.16);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-len, 0);
  ctx.lineTo(len * 0.2, 0);
  ctx.stroke();
  ctx.restore();
}
function drawSnowflakeShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  radius: number,
  spinPhase: number,
  theme: 'dark' | 'light',
  colors: AccentThemePalette,
) {
  const r = radius * 0.56;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle + spinPhase * 0.45);
  const aura = ctx.createRadialGradient(0, 0, r * 0.05, 0, 0, r * 1.25);
  aura.addColorStop(0, theme === 'dark' ? rgba(T.paper, 0.18) : colors.glow);
  aura.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.25, 0, Math.PI * 2);
  ctx.fill();
  const armColor = theme === 'dark' ? mixHex(T.paper, T.soft, 0.2) : colors.primary;
  ctx.strokeStyle = armColor;
  ctx.lineWidth = Math.max(4, r * 0.14);
  ctx.lineCap = 'round';
  for (let arm = 0; arm < 6; arm++) {
    ctx.save();
    ctx.rotate((arm * Math.PI) / 3);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(r, 0);
    ctx.moveTo(r * 0.56, 0);
    ctx.lineTo(r * 0.78, -r * 0.22);
    ctx.moveTo(r * 0.56, 0);
    ctx.lineTo(r * 0.78, r * 0.22);
    ctx.stroke();
    ctx.restore();
  }
  ctx.fillStyle = theme === 'dark' ? T.paper : colors.highlight;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
function drawJellyfishShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  radius: number,
  pulsePhase: number,
  colors: AccentThemePalette,
) {
  const pulse = Math.sin(pulsePhase);
  const bellWidth = radius * (0.58 - pulse * 0.14);
  const bellHeight = radius * (0.44 + pulse * 0.12);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle + Math.PI / 2);
  const aura = ctx.createRadialGradient(0, 0, radius * 0.1, 0, 0, radius * 1.35);
  aura.addColorStop(0, colors.glow);
  aura.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 1.35, 0, Math.PI * 2);
  ctx.fill();
  const tentacleOffsets = [-0.65, -0.32, 0, 0.32, 0.65];
  ctx.lineCap = 'round';
  for (let t = 0; t < tentacleOffsets.length; t++) {
    const startX = tentacleOffsets[t] * bellWidth * 0.75;
    const tLen = radius * (0.95 + (t === 2 ? 0.28 : 0));
    const sway1 = Math.sin(pulsePhase - 1.1 + t * 0.7) * radius * 0.22;
    const sway2 = Math.sin(pulsePhase - 2.3 + t * 0.7) * radius * 0.32;
    ctx.strokeStyle = t % 2 === 0 ? colors.primary : colors.secondary;
    ctx.globalAlpha = 0.72;
    ctx.lineWidth = Math.max(4, radius * (t === 2 ? 0.085 : 0.055));
    ctx.beginPath();
    ctx.moveTo(startX, bellHeight * 0.15);
    ctx.bezierCurveTo(
      startX + sway1,
      bellHeight * 0.15 + tLen * 0.38,
      startX - sway2,
      bellHeight * 0.15 + tLen * 0.72,
      startX + sway2 * 0.85,
      bellHeight * 0.15 + tLen,
    );
    ctx.stroke();
  }
  ctx.globalAlpha = 0.94;
  const bellGrad = ctx.createRadialGradient(
    0,
    -bellHeight * 0.35,
    bellWidth * 0.08,
    0,
    -bellHeight * 0.1,
    bellWidth * 1.1,
  );
  bellGrad.addColorStop(0, colors.highlight);
  bellGrad.addColorStop(0.55, colors.primary);
  bellGrad.addColorStop(1, colors.deep);
  ctx.fillStyle = bellGrad;
  ctx.beginPath();
  ctx.moveTo(-bellWidth, bellHeight * 0.18);
  ctx.bezierCurveTo(
    -bellWidth * 1.05,
    -bellHeight * 1.05,
    bellWidth * 1.05,
    -bellHeight * 1.05,
    bellWidth,
    bellHeight * 0.18,
  );
  ctx.quadraticCurveTo(0, bellHeight * 0.34, -bellWidth, bellHeight * 0.18);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = colors.highlight;
  ctx.beginPath();
  ctx.ellipse(0, -bellHeight * 0.25, bellWidth * 0.32, bellHeight * 0.24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
export const AsciiButterflyBackground: React.FC<AsciiButterflyBackgroundProps> = ({
  creature = 'koi',
  count = 12,
  speed = 1,
  species = 'mixed',
  interactionMode = 'breeze',
  cellSize = 11,
  overlayMode = 'ascii-pixels',
  scale = 1,
  showAmbientParticles = true,
  theme = 'dark',
  paused = false,
  fps = 60,
  opacity = 1,
  spawnOnClick = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const creaturesRef = useRef<CreatureEntity[]>([]);
  const blobsRef = useRef<AmbientBlob[]>([]);
  const ripplesRef = useRef<RippleWave[]>([]);
  const interactivePtsRef = useRef<InteractivePoint[]>([]);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });
  const configRef = useRef({
    creature,
    count,
    speed,
    species,
    interactionMode,
    cellSize,
    overlayMode,
    scale,
    showAmbientParticles,
    theme,
    paused,
    fps,
  });
  configRef.current = {
    creature,
    count,
    speed,
    species,
    interactionMode,
    cellSize,
    overlayMode,
    scale,
    showAmbientParticles,
    theme,
    paused,
    fps,
  };
  useEffect(() => {
    for (const c of creaturesRef.current) {
      c.trail = [];
      if (creature === 'rain') {
        c.angle = Math.PI * 0.47;
      }
    }
    interactivePtsRef.current = [];
  }, [creature]);
  useEffect(() => {
    const list = creaturesRef.current;
    for (let i = 0; i < list.length; i++) {
      list[i].paletteKey = species === 'mixed' ? MIXED_KEYS[i % MIXED_KEYS.length] : species;
    }
  }, [species]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const sceneCanvas = document.createElement('canvas');
    const sceneCtx = sceneCanvas.getContext('2d', { willReadFrequently: true });
    if (!sceneCtx) return;
    const gridBackdropCanvas = document.createElement('canvas');
    const gridBackdropCtx = gridBackdropCanvas.getContext('2d');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cols = 1;
    let rows = 1;
    let lastBackdropKey = '';
    const rebuildGridBackdrop = (
      currentCell: number,
      currentTheme: 'dark' | 'light',
      currentMode: PixelOverlayMode,
    ) => {
      if (!gridBackdropCtx) return;
      const key = `${width}x${height}:${currentCell}:${currentTheme}:${currentMode}`;
      if (key === lastBackdropKey) return;
      lastBackdropKey = key;
      gridBackdropCanvas.width = Math.floor(width * dpr);
      gridBackdropCanvas.height = Math.floor(height * dpr);
      gridBackdropCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gridBackdropCtx.clearRect(0, 0, width, height);
      const isDark = currentTheme === 'dark';
      if (currentMode !== 'ascii-only') {
        gridBackdropCtx.fillStyle = isDark
          ? `rgba(255, 255, 255, ${(0.026 * BACKGROUND_VISIBILITY).toFixed(3)})`
          : `rgba(15, 23, 42, ${(0.032 * BACKGROUND_VISIBILITY).toFixed(3)})`;
        const gap = currentCell >= 12 ? 1.5 : 1;
        for (let r = 0; r < rows; r++) {
          const py = r * currentCell;
          for (let c = 0; c < cols; c++) {
            const px = c * currentCell;
            gridBackdropCtx.fillRect(px, py, currentCell - gap, currentCell - gap);
          }
        }
      }
      if (currentMode !== 'pixels-only') {
        const fontSize = Math.max(7, Math.floor(currentCell * 0.82));
        gridBackdropCtx.font = `400 ${fontSize}px "JetBrains Mono", ui-monospace, monospace`;
        gridBackdropCtx.textAlign = 'center';
        gridBackdropCtx.textBaseline = 'middle';
        gridBackdropCtx.fillStyle = isDark
          ? `rgba(148, 163, 184, ${(0.14 * BACKGROUND_VISIBILITY).toFixed(3)})`
          : `rgba(71, 85, 105, ${(0.16 * BACKGROUND_VISIBILITY).toFixed(3)})`;
        for (let r = 0; r < rows; r++) {
          const cy = r * currentCell + currentCell * 0.5;
          for (let c = 0; c < cols; c++) {
            if ((r + c) % 2 === 0) {
              const cx = c * currentCell + currentCell * 0.5;
              gridBackdropCtx.fillText((r * 7 + c * 13) % 11 === 0 ? '~' : '·', cx, cy);
            }
          }
        }
      }
    };
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const cs = Math.max(7, configRef.current.cellSize);
      cols = Math.max(1, Math.ceil(width / cs));
      rows = Math.max(1, Math.ceil(height / cs));
      sceneCanvas.width = cols;
      sceneCanvas.height = rows;
      lastBackdropKey = '';
    };
    resize();
    window.addEventListener('resize', resize);
    if (creaturesRef.current.length === 0) {
      const baseCount = Math.max(1, Math.min(40, configRef.current.count));
      for (let i = 0; i < baseCount; i++) {
        creaturesRef.current.push(
          createCreature(width, height, configRef.current.species, i),
        );
      }
    }
    if (blobsRef.current.length === 0) {
      const hues = [
        T.accent,
        T.pollen,
        mixHex(T.soft, T.ink, 0.22),
        mixHex(T.accent, T.paper, 0.42),
        mixHex(T.pollen, T.soft, 0.4),
      ];
      for (let i = 0; i < 6; i++) {
        blobsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 16,
          vy: (Math.random() - 0.5) * 16,
          radius: 190 + Math.random() * 190,
          hue: hues[i % hues.length],
        });
      }
    }
    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    };
    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };
    const handlePointerDown = (e: PointerEvent) => {
      if (!spawnOnClick) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        target !== canvas &&
        target.closest('button, a, input, textarea, select, [data-interactive-surface]')
      ) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cfg = configRef.current;
      const rippleColor =
        cfg.creature === 'petals'
          ? T.accent
          : cfg.creature === 'comets' || cfg.creature === 'jellyfish'
            ? mixHex(T.accent, T.ink, 0.35)
            : cfg.creature === 'turtles'
              ? mixHex(T.pollen, T.ink, 0.2)
              : cfg.creature === 'snow'
                ? T.soft
                : cfg.creature === 'rain'
                  ? mixHex(T.ink, T.soft, 0.3)
                  : cfg.creature === 'hummingbirds'
                    ? T.pollen
                    : T.accent;
      ripplesRef.current.push({
        x,
        y,
        radius: 6,
        maxRadius: cfg.creature === 'rain' ? 320 : 270,
        alpha: 0.95,
        color: rippleColor,
      });
      if (cfg.creature === 'snow') {
        for (let i = 0; i < 4; i++) {
          creaturesRef.current.push(
            createCreature(
              width,
              height,
              cfg.species,
              creaturesRef.current.length,
              x + (Math.random() - 0.5) * 60,
              y + (Math.random() - 0.5) * 40,
            ),
          );
        }
        if (creaturesRef.current.length > Math.max(cfg.count + 8, 42)) {
          creaturesRef.current.splice(0, creaturesRef.current.length - Math.max(cfg.count + 8, 42));
        }
      } else if (cfg.creature === 'jellyfish') {
        for (const c of creaturesRef.current) {
          const dx = c.x - x;
          const dy = c.y - y;
          if (dx * dx + dy * dy < 320 * 320) {
            c.excitement = 1;
          }
        }
        const spawned = createCreature(
          width,
          height,
          cfg.species,
          creaturesRef.current.length,
          x,
          y,
        );
        creaturesRef.current.push(spawned);
        if (creaturesRef.current.length > Math.max(cfg.count + 6, 40)) {
          creaturesRef.current.shift();
        }
      } else if (cfg.creature === 'rain') {
        ripplesRef.current.push({ x, y, radius: 2, maxRadius: 210, alpha: 0.85, color: T.soft });
      } else if (cfg.creature === 'koi') {
        for (let i = 0; i < 3; i++) {
          interactivePtsRef.current.push({
            x: x + (Math.random() - 0.5) * 28,
            y: y + (Math.random() - 0.5) * 28,
            life: 9,
            radius: 11 + Math.random() * 6,
            color: cfg.theme === 'dark' ? T.pollen : T.accent,
          });
        }
      } else if (cfg.creature === 'hummingbirds') {
        interactivePtsRef.current.push({
          x,
          y,
          life: 10,
          radius: 22,
          color: cfg.theme === 'dark' ? mixHex(T.accent, T.paper, 0.2) : T.accent,
        });
      } else if (cfg.creature === 'petals') {
        for (const c of creaturesRef.current) {
          const dx = c.x - x;
          const dy = c.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 280 && dist > 4) {
            const tangX = -dy / dist;
            const tangY = dx / dist;
            const push = (1 - dist / 280) * 140;
            c.boostVx += tangX * push + (dx / dist) * 50;
            c.boostVy += tangY * push + (dy / dist) * 50;
          }
        }
        for (let i = 0; i < 3; i++) {
          creaturesRef.current.push(
            createCreature(
              width,
              height,
              cfg.species,
              creaturesRef.current.length,
              x + (Math.random() - 0.5) * 40,
              y + (Math.random() - 0.5) * 40,
            ),
          );
        }
        if (creaturesRef.current.length > Math.max(cfg.count + 8, 42)) {
          creaturesRef.current.splice(0, creaturesRef.current.length - Math.max(cfg.count + 8, 42));
        }
      } else if (cfg.creature === 'comets') {
        interactivePtsRef.current.push({
          x,
          y,
          life: 6,
          radius: 18,
          color: mixHex(T.soft, T.paper, 0.2),
        });
        const spawned = createCreature(
          width,
          height,
          cfg.species,
          creaturesRef.current.length,
          x,
          y,
        );
        creaturesRef.current.push(spawned);
        if (creaturesRef.current.length > Math.max(cfg.count + 6, 40)) {
          creaturesRef.current.shift();
        }
      } else {
        const spawned = createCreature(
          width,
          height,
          cfg.species,
          creaturesRef.current.length,
          x,
          y,
        );
        creaturesRef.current.push(spawned);
        if (creaturesRef.current.length > Math.max(cfg.count + 6, 40)) {
          creaturesRef.current.shift();
        }
      }
      if (interactivePtsRef.current.length > 24) {
        interactivePtsRef.current.splice(0, interactivePtsRef.current.length - 24);
      }
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('pointerdown', handlePointerDown);
    let rafId = 0;
    let lastTime = performance.now();
    let lastRender = 0;
    let elapsed = 0;
    const renderFrame = (now: number) => {
      const cfg = configRef.current;
      const frameInterval = 1000 / Math.max(1, Math.min(60, cfg.fps));
      if (now - lastRender < frameInterval) {
        rafId = requestAnimationFrame(renderFrame);
        return;
      }
      lastRender = now;
      const rawDt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const cs = Math.max(7, Math.min(24, cfg.cellSize));
      const nextCols = Math.max(1, Math.ceil(width / cs));
      const nextRows = Math.max(1, Math.ceil(height / cs));
      if (nextCols !== cols || nextRows !== rows) {
        cols = nextCols;
        rows = nextRows;
        sceneCanvas.width = cols;
        sceneCanvas.height = rows;
      }
      rebuildGridBackdrop(cs, cfg.theme, cfg.overlayMode);
      const motionFactor = prefersReducedMotion ? 0.25 : 1;
      const dt = cfg.paused ? 0 : rawDt * cfg.speed * motionFactor;
      elapsed += dt;
      const list = creaturesRef.current;
      const ptr = pointerRef.current;
      const kind = cfg.creature;
      if (dt > 0) {
        for (let i = interactivePtsRef.current.length - 1; i >= 0; i--) {
          interactivePtsRef.current[i].life -= dt;
          if (interactivePtsRef.current[i].life <= 0) {
            interactivePtsRef.current.splice(i, 1);
          }
        }
      }
      for (let i = 0; i < list.length; i++) {
        const b = list[i];
        if (dt > 0) {
          let moveScale = 1;
          if (kind === 'snow') {
            b.angle = Math.PI * 0.5 + Math.sin(elapsed * 0.7 + b.seedA) * 0.36;
            moveScale = 0.72;
          } else if (kind === 'jellyfish') {
            const turn =
              Math.sin(elapsed * 0.4 + b.seedA) * 0.4 + Math.cos(elapsed * 0.2 + b.seedB) * 0.25;
            b.angle += turn * dt;
            moveScale = 0.32 + 0.88 * Math.max(0, Math.sin(b.phase));
          } else if (kind === 'rain') {
            b.angle = Math.PI * 0.47;
            moveScale = 4.6;
            const vx = Math.cos(b.angle) * b.baseSpeed * moveScale;
            const vy = Math.sin(b.angle) * b.baseSpeed * moveScale;
            b.x += vx * dt;
            b.y += vy * dt;
            if (b.y >= b.targetY) {
              const pal = getAccentPalette(kind, cfg.species, b, cfg.theme);
              ripplesRef.current.push({
                x: b.x,
                y: b.y,
                radius: 4,
                maxRadius: 120 + (b.size % 70),
                alpha: 0.78,
                color: pal.primary,
              });
              if (ripplesRef.current.length > 36) {
                ripplesRef.current.shift();
              }
              b.x = Math.random() * width;
              b.y = -40 - Math.random() * 140;
              b.targetY = height * (0.18 + Math.random() * 0.78);
            }
            continue;
          } else if (kind === 'turtles') {
            const turn =
              Math.sin(elapsed * 0.45 + b.seedA) * 0.45 + Math.cos(elapsed * 0.22 + b.seedB) * 0.3;
            b.angle += turn * dt;
            moveScale = 0.55 + 0.38 * Math.max(0, Math.sin(b.phase));
          } else if (kind === 'petals') {
            const windAngle = 0.55 + Math.sin(elapsed * 0.45 + b.y * 0.004 + b.seedA) * 0.7;
            b.angle = windAngle;
            moveScale = 0.85;
          } else if (kind === 'comets') {
            const curve = Math.sin(elapsed * 0.35 + b.seedA) * 0.65;
            b.angle += curve * dt;
            moveScale = 1.65;
          } else if (kind === 'hummingbirds') {
            b.hoverTimer -= dt;
            if (b.hoverTimer < -1.4) {
              b.hoverTimer = 1.6 + Math.random() * 2.2;
              b.angle += (Math.random() - 0.5) * 1.8;
            }
            const isHovering = b.hoverTimer < 0 && b.excitement < 0.25;
            if (isHovering) {
              moveScale = 0.06;
            } else {
              b.angle += Math.sin(elapsed * 1.1 + b.seedA) * 0.6 * dt;
              moveScale = 1.45;
            }
          } else {
            const turn =
              Math.sin(elapsed * 0.75 + b.seedA) * 0.85 + Math.cos(elapsed * 0.38 + b.seedB) * 0.55;
            b.angle += turn * dt;
          }
          let seekingTarget = false;
          if (
            (kind === 'koi' || kind === 'hummingbirds' || kind === 'comets') &&
            interactivePtsRef.current.length > 0
          ) {
            let bestDist = 380 * 380;
            let bestIdx = -1;
            for (let p = 0; p < interactivePtsRef.current.length; p++) {
              const pt = interactivePtsRef.current[p];
              const dx = pt.x - b.x;
              const dy = pt.y - b.y;
              const d2 = dx * dx + dy * dy;
              if (d2 < bestDist) {
                bestDist = d2;
                bestIdx = p;
              }
            }
            if (bestIdx !== -1) {
              const pt = interactivePtsRef.current[bestIdx];
              const targetAngle = Math.atan2(pt.y - b.y, pt.x - b.x);
              let diff = targetAngle - b.angle;
              while (diff > Math.PI) diff -= Math.PI * 2;
              while (diff < -Math.PI) diff += Math.PI * 2;
              b.angle += diff * (kind === 'comets' ? 2.1 : 3.2) * dt;
              b.excitement = Math.min(0.85, b.excitement + dt * 1.3);
              seekingTarget = true;
              if (kind === 'koi' && bestDist < 26 * 26) {
                interactivePtsRef.current.splice(bestIdx, 1);
                ripplesRef.current.push({
                  x: pt.x,
                  y: pt.y,
                  radius: 4,
                  maxRadius: 110,
                  alpha: 0.75,
                });
              } else if (kind === 'hummingbirds' && bestDist < 54 * 54) {
                moveScale = 0.08;
              }
            }
          }
          if (ptr.active && cfg.interactionMode !== 'calm') {
            const dx = b.x - ptr.x;
            const dy = b.y - ptr.y;
            const distSq = dx * dx + dy * dy;
            const radius = cfg.interactionMode === 'breeze' ? 190 : 280;
            if (distSq < radius * radius && distSq > 4) {
              const dist = Math.sqrt(distSq);
              const strength = 1 - dist / radius;
              if (cfg.interactionMode === 'breeze') {
                const push = 210 * strength * dt;
                b.boostVx += (dx / dist) * push;
                b.boostVy += (dy / dist) * push;
                b.excitement = Math.min(1, b.excitement + strength * 2.5 * dt);
              } else if (cfg.interactionMode === 'attract' && !seekingTarget) {
                const targetAngle = Math.atan2(-dy, -dx);
                let diff = targetAngle - b.angle;
                while (diff > Math.PI) diff -= Math.PI * 2;
                while (diff < -Math.PI) diff += Math.PI * 2;
                b.angle += diff * 2.4 * strength * dt;
              }
            }
          }
          b.excitement = Math.max(0, b.excitement - dt * 0.65);
          b.boostVx *= Math.pow(0.18, dt);
          b.boostVy *= Math.pow(0.18, dt);
          const speedBoost = (1 + b.excitement * 0.45) * moveScale;
          const vx = Math.cos(b.angle) * b.baseSpeed * speedBoost + b.boostVx;
          const vy = Math.sin(b.angle) * b.baseSpeed * speedBoost + b.boostVy;
          b.x += vx * dt;
          b.y += vy * dt;
          const margin = b.size * cfg.scale + 55;
          let wrapped = false;
          if (b.x < -margin) {
            b.x = width + margin;
            wrapped = true;
          }
          if (b.x > width + margin) {
            b.x = -margin;
            wrapped = true;
          }
          if (b.y < -margin) {
            b.y = height + margin;
            wrapped = true;
          }
          if (b.y > height + margin) {
            b.y = -margin;
            wrapped = true;
          }
          if (wrapped) {
            b.trail = [];
          }
          // Si una entidad se queda fuera del viewport por deriva o resize, la
          // devolvemos al área visible en lugar de dejar la escena vacía.
          const outside = b.x < 0 || b.x > width || b.y < 0 || b.y > height;
          b.offscreenFor = outside ? b.offscreenFor + dt : 0;
          if (b.offscreenFor > 3.5) {
            respawnCreature(b, width, height);
          }
          const maxTrail = kind === 'comets' ? 18 : 11;
          if (Math.floor((elapsed * 26) % 2) === 0 || b.trail.length === 0) {
            const trailColor =
              kind === 'koi'
                ? getKoiPalette(cfg.species, b, cfg.theme).patchPrimary
                : kind === 'butterflies'
                  ? PALETTES[b.paletteKey][cfg.theme].wingMid
                  : getAccentPalette(kind, cfg.species, b, cfg.theme).primary;
            b.trail.push({ x: b.x, y: b.y, color: trailColor });
            if (b.trail.length > maxTrail) b.trail.shift();
          }
          if (kind === 'koi') {
            b.phase += b.phaseRate * (1 + b.excitement * 0.9) * dt;
          } else if (kind === 'turtles') {
            b.phase += 2.6 * (1 + b.excitement * 0.6) * dt;
          } else if (kind === 'jellyfish') {
            b.phase += 2.4 * (1 + b.excitement * 0.8) * dt;
          } else if (kind === 'snow') {
            b.phase += 1.6 * dt;
          } else if (kind === 'petals') {
            b.phase += 2.2 * dt;
          } else if (kind === 'comets') {
            b.phase += 3.5 * dt;
          } else if (kind === 'hummingbirds') {
            b.phase += 5.5 * dt;
          } else {
            b.glideTimer -= dt;
            if (b.glideTimer < -0.55) {
              b.glideTimer = 1.8 + Math.random() * 2.6;
            }
            const isGliding = b.glideTimer < 0 && b.excitement < 0.2;
            if (!isGliding) {
              b.phase += b.phaseRate * (1 + b.excitement * 1.1) * dt * Math.PI * 0.65;
            }
          }
        }
      }
      if (dt > 0) {
        for (const blob of blobsRef.current) {
          blob.x += blob.vx * dt;
          blob.y += blob.vy * dt;
          if (blob.x < -blob.radius) blob.x = width + blob.radius;
          if (blob.x > width + blob.radius) blob.x = -blob.radius;
          if (blob.y < -blob.radius) blob.y = height + blob.radius;
          if (blob.y > height + blob.radius) blob.y = -blob.radius;
        }
        for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
          const rp = ripplesRef.current[i];
          rp.radius += (kind === 'rain' ? 160 : 210) * rawDt;
          rp.alpha = Math.max(0, 1 - rp.radius / rp.maxRadius);
          if (rp.radius >= rp.maxRadius) {
            ripplesRef.current.splice(i, 1);
          }
        }
      }
      sceneCtx.setTransform(1 / cs, 0, 0, 1 / cs, 0, 0);
      sceneCtx.clearRect(0, 0, width, height);
      if (cfg.showAmbientParticles) {
        for (const blob of blobsRef.current) {
          const grad = sceneCtx.createRadialGradient(
            blob.x,
            blob.y,
            0,
            blob.x,
            blob.y,
            blob.radius,
          );
          grad.addColorStop(0, blob.hue);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          sceneCtx.globalAlpha = cfg.theme === 'dark' ? 0.14 : 0.11;
          sceneCtx.fillStyle = grad;
          sceneCtx.beginPath();
          sceneCtx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
          sceneCtx.fill();
        }
      }
      for (const pt of interactivePtsRef.current) {
        const fade = Math.min(1, pt.life * 0.45);
        sceneCtx.globalAlpha = fade;
        if (kind === 'hummingbirds') {
          sceneCtx.fillStyle = pt.color;
          for (let p = 0; p < 5; p++) {
            const ang = (p / 5) * Math.PI * 2;
            sceneCtx.beginPath();
            sceneCtx.arc(
              pt.x + Math.cos(ang) * pt.radius * 0.55,
              pt.y + Math.sin(ang) * pt.radius * 0.55,
              pt.radius * 0.45,
              0,
              Math.PI * 2,
            );
            sceneCtx.fill();
          }
          sceneCtx.fillStyle = T.pollen;
          sceneCtx.beginPath();
          sceneCtx.arc(pt.x, pt.y, pt.radius * 0.3, 0, Math.PI * 2);
          sceneCtx.fill();
        } else {
          sceneCtx.fillStyle = pt.color;
          sceneCtx.beginPath();
          sceneCtx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
          sceneCtx.fill();
        }
      }
      if (kind === 'snow') {
        const driftGrad = sceneCtx.createLinearGradient(0, height - 38, 0, height);
        driftGrad.addColorStop(0, 'rgba(0,0,0,0)');
        driftGrad.addColorStop(1, rgba(T.soft, cfg.theme === 'dark' ? 0.35 : 0.28));
        sceneCtx.globalAlpha = 1;
        sceneCtx.fillStyle = driftGrad;
        sceneCtx.fillRect(0, height - 38, width, 38);
      }
      for (let i = 0; i < list.length; i++) {
        const b = list[i];
        if (
          kind !== 'comets' &&
          kind !== 'rain' &&
          kind !== 'snow' &&
          cfg.showAmbientParticles &&
          b.trail.length > 1
        ) {
          for (let t = 0; t < b.trail.length; t++) {
            const pt = b.trail[t];
            const ratio = (t + 1) / b.trail.length;
            sceneCtx.globalAlpha = ratio * (kind === 'koi' ? 0.18 : 0.22);
            sceneCtx.fillStyle = pt.color;
            sceneCtx.beginPath();
            sceneCtx.arc(
              pt.x,
              pt.y,
              b.size * cfg.scale * (kind === 'koi' ? 0.18 : 0.22) * ratio,
              0,
              Math.PI * 2,
            );
            sceneCtx.fill();
          }
        }
        sceneCtx.globalAlpha = 1;
        if (kind === 'koi') {
          const koiPal = getKoiPalette(cfg.species, b, cfg.theme);
          drawKoiFish(sceneCtx, b.x, b.y, b.angle, b.size * cfg.scale * 1.25, b.phase, koiPal);
        } else if (kind === 'butterflies') {
          const pal = PALETTES[b.paletteKey][cfg.theme];
          const isGliding = b.glideTimer < 0 && b.excitement < 0.2;
          const flapCompression = isGliding ? 0.96 : 0.24 + 0.76 * ((Math.sin(b.phase) + 1) * 0.5);
          drawButterflyShape(sceneCtx, b.x, b.y, b.angle, b.size * cfg.scale, flapCompression, pal);
        } else if (kind === 'hummingbirds') {
          const pal = getAccentPalette(kind, cfg.species, b, cfg.theme);
          drawHummingbirdShape(
            sceneCtx,
            b.x,
            b.y,
            b.angle,
            b.size * cfg.scale * 0.92,
            b.phase,
            pal,
          );
        } else if (kind === 'petals') {
          const pal = getAccentPalette(kind, cfg.species, b, cfg.theme);
          drawPetalShape(sceneCtx, b.x, b.y, b.angle, b.size * cfg.scale * 0.72, b.phase, pal);
        } else if (kind === 'comets') {
          const pal = getAccentPalette(kind, cfg.species, b, cfg.theme);
          drawCometShape(
            sceneCtx,
            b.x,
            b.y,
            b.angle,
            b.size * cfg.scale * 0.85,
            b.phase,
            b.trail,
            pal,
          );
        } else if (kind === 'turtles') {
          const pal = getAccentPalette(kind, cfg.species, b, cfg.theme);
          drawSeaTurtleShape(sceneCtx, b.x, b.y, b.angle, b.size * cfg.scale * 0.98, b.phase, pal);
        } else if (kind === 'rain') {
          const pal = getAccentPalette(kind, cfg.species, b, cfg.theme);
          drawRaindropStreak(sceneCtx, b.x, b.y, b.angle, b.size * cfg.scale * 0.62, pal);
        } else if (kind === 'snow') {
          const pal = getAccentPalette(kind, cfg.species, b, cfg.theme);
          drawSnowflakeShape(
            sceneCtx,
            b.x,
            b.y,
            b.angle,
            b.size * cfg.scale * 0.78,
            b.phase,
            cfg.theme,
            pal,
          );
        } else if (kind === 'jellyfish') {
          const pal = getAccentPalette(kind, cfg.species, b, cfg.theme);
          drawJellyfishShape(sceneCtx, b.x, b.y, b.angle, b.size * cfg.scale * 0.95, b.phase, pal);
        }
      }
      for (const rp of ripplesRef.current) {
        sceneCtx.globalAlpha = rp.alpha * 0.75;
        sceneCtx.strokeStyle = rp.color || T.accent;
        sceneCtx.lineWidth = Math.max(cs * 1.35, 13);
        sceneCtx.beginPath();
        sceneCtx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
        sceneCtx.stroke();
      }
      if (ptr.active && cfg.interactionMode !== 'calm') {
        const pGrad = sceneCtx.createRadialGradient(ptr.x, ptr.y, 0, ptr.x, ptr.y, 95);
        pGrad.addColorStop(0, rgba(T.accent, 0.14));
        pGrad.addColorStop(1, 'rgba(0,0,0,0)');
        sceneCtx.globalAlpha = 1;
        sceneCtx.fillStyle = pGrad;
        sceneCtx.beginPath();
        sceneCtx.arc(ptr.x, ptr.y, 95, 0, Math.PI * 2);
        sceneCtx.fill();
      }
      const imgData = sceneCtx.getImageData(0, 0, cols, rows).data;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(gridBackdropCanvas, 0, 0, width, height);
      const showPixelBlocks = cfg.overlayMode !== 'ascii-only';
      const showAsciiChars = cfg.overlayMode !== 'pixels-only';
      const gap = cs >= 12 ? 1.5 : 1;
      const fontSize = Math.max(7, Math.floor(cs * 0.86));
      if (showAsciiChars) {
        ctx.font = `600 ${fontSize}px "JetBrains Mono", ui-monospace, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
      }
      const isDark = cfg.theme === 'dark';
      for (let r = 0; r < rows; r++) {
        const py = r * cs;
        const cy = py + cs * 0.5;
        const rowOffset = r * cols;
        for (let c = 0; c < cols; c++) {
          const idx = (rowOffset + c) * 4;
          const a = imgData[idx + 3];
          if (a < 9) continue;
          const red = imgData[idx];
          const green = imgData[idx + 1];
          const blue = imgData[idx + 2];
          const alphaNorm = Math.min(1, (a / 255) * BACKGROUND_VISIBILITY);
          const lum = ((0.299 * red + 0.587 * green + 0.114 * blue) / 255) * alphaNorm;
          const px = c * cs;
          if (showPixelBlocks) {
            const blockAlpha =
              cfg.overlayMode === 'pixels-only'
                ? Math.min(0.92, alphaNorm * 0.85)
                : Math.min(0.42, alphaNorm * (isDark ? 0.34 : 0.28));
            ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${blockAlpha.toFixed(2)})`;
            ctx.fillRect(px, py, cs - gap, cs - gap);
          }
          if (showAsciiChars && (lum > 0.035 || alphaNorm > 0.15)) {
            const rampScore = Math.min(1, Math.max(0.08, lum * 0.8 + alphaNorm * 0.35));
            const charIdx = Math.min(
              ASCII_RAMP.length - 1,
              Math.max(1, Math.floor(rampScore * (ASCII_RAMP.length - 1))),
            );
            const ch = ASCII_RAMP[charIdx];
            const charAlpha = Math.min(0.98, 0.28 + alphaNorm * 0.72);
            const boost = isDark ? 1.18 : 0.85;
            const cr = Math.min(255, Math.round(red * boost));
            const cg = Math.min(255, Math.round(green * boost));
            const cb = Math.min(255, Math.round(blue * boost));
            ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${charAlpha.toFixed(2)})`;
            ctx.fillText(ch, px + cs * 0.5, cy);
          }
        }
      }
      rafId = requestAnimationFrame(renderFrame);
    };
    rafId = requestAnimationFrame(renderFrame);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [spawnOnClick]);
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ opacity }}
      className={`butterfly-backdrop pointer-events-none fixed inset-0 -z-10 h-full w-full transition-opacity duration-300 ${className}`}
    />
  );
};
