import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { readButterflyPalette, type ButterflyPalette } from '../lib/butterflies/palette';
import type {
  ButterflySpecies,
  CursorInteractionMode,
  PixelOverlayMode,
  WildlifeCreature,
} from '../lib/mood/types';

export interface AtmosphereBackgroundProps {
  /** Which ASCII wildlife ecosystem to render behind the pixel overlay */
  creature?: WildlifeCreature;
  /** Number of creatures flying/swimming behind the pixel/ASCII overlay */
  count?: number;
  /** Flight and wingbeat speed multiplier */
  speed?: number;
  /** Color palette / species preset */
  species?: ButterflySpecies;
  /** How butterflies react to pointer movement */
  interactionMode?: CursorInteractionMode;
  /** Pixel / ASCII grid cell size in CSS pixels (8 - 22) */
  cellSize?: number;
  /** Visual rendering mode for the overlay */
  overlayMode?: PixelOverlayMode;
  /** Wing size multiplier */
  scale?: number;
  /** Show subtle drifting background color shapes & trails */
  showAmbientParticles?: boolean;
  /** Surface theme for optimal contrast */
  theme?: 'dark' | 'light';
  /** Pause animation loop */
  paused?: boolean;
  /** Render cap. Bajar a ~18 mientras un panel anima libera el main thread. */
  fps?: number;
  /** Global canvas opacity (0.1 - 1) */
  opacity?: number;
  /** Allow clicking empty background to ripple & release a butterfly */
  spawnOnClick?: boolean;
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
  outline: string;
  glow: string;
}

type PaletteKey = Exclude<ButterflySpecies, 'mixed'>;

/** Mezcla dos colores hex devolviendo hex (para que canvas y CSS compartan tokens). */
function mixHex(a: string, b: string, amount: number): string {
  const toRgb = (hex: string) => {
    const clean = hex.replace('#', '');
    const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
    const value = Number.parseInt(full.slice(0, 6), 16);
    return Number.isNaN(value) ? [0, 0, 0] : [(value >> 16) & 255, (value >> 8) & 255, value & 255];
  };
  const from = toRgb(a);
  const to = toRgb(b);
  return `#${from.map((v, i) => Math.round(v + (to[i] - v) * amount).toString(16).padStart(2, '0')).join('')}`;
}

function rgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const value = Number.parseInt(full.slice(0, 6), 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Las "especies" se traducen a la paleta del portfolio, no a los azules/neones
 *  del componente original: terracota, ámbar, tinta, papel y gris suave. */
function buildPalettes(p: ButterflyPalette): Record<PaletteKey, { dark: PaletteColors; light: PaletteColors }> {
  const pair = (inner: string, mid: string, edge: string, spot: string, glowAlpha: number) => ({
    light: { wingInner: inner, wingMid: mid, wingEdge: edge, spot, body: p.ink, glow: rgba(mid, glowAlpha) },
    dark: {
      wingInner: mixHex(inner, p.paper, 0.16),
      wingMid: mid,
      wingEdge: mixHex(edge, p.ink, 0.2),
      spot: mixHex(spot, p.paper, 0.2),
      body: p.ink,
      glow: rgba(mid, glowAlpha + 0.08),
    },
  });

  const burnt = mixHex(p.accent, p.ink, 0.55);
  const slate = mixHex(p.ink, p.soft, 0.28);

  // Los puntos de las alas van en tonos cálidos del tema, nunca en papel/blanco.
  return {
    morpho: pair(mixHex(p.accent, p.paper, 0.35), p.accent, mixHex(p.accent, p.ink, 0.38), p.pollen, 0.3),
    monarch: pair(mixHex(p.pollen, p.paper, 0.34), p.pollen, mixHex(p.pollen, p.ink, 0.38), p.accent, 0.3),
    luna: pair(
      mixHex(p.pollen, p.paper, 0.36),
      mixHex(p.pollen, p.soft, 0.32),
      mixHex(p.soft, p.ink, 0.36),
      p.accent,
      0.27,
    ),
    violet: pair(mixHex(burnt, p.paper, 0.4), burnt, mixHex(burnt, p.ink, 0.35), p.pollen, 0.27),
    ink: pair(
      mixHex(slate, p.paper, 0.36),
      mixHex(slate, p.accent, 0.22),
      mixHex(slate, p.ink, 0.35),
      p.pollen,
      0.24,
    ),
  };
}

/** Variedades koi en la misma paleta que el resto del portfolio: nada de azules. */
function buildKoiPalettes(p: ButterflyPalette): Record<PaletteKey, KoiPalette> {
  const burnt = mixHex(p.accent, p.ink, 0.55);
  const slate = mixHex(p.ink, p.soft, 0.28);
  const variety = (
    body: string,
    primary: string,
    secondary: string,
    glowColor: string,
    glowAlpha: number,
  ): KoiPalette => ({
    body,
    patchPrimary: primary,
    patchSecondary: secondary,
    // Las aletas salen del propio cuerpo, no del papel: evita que parezcan
    // una pieza blanca separada cuando el koi es claro.
    fins: rgba(mixHex(secondary, body, 0.34), 0.82),
    outline: rgba(mixHex(body, p.ink, 0.3), 0.46),
    glow: rgba(glowColor, glowAlpha),
  });

  return {
    morpho: variety(mixHex(p.paper, p.pollen, 0.2), p.accent, mixHex(p.accent, p.pollen, 0.4), p.accent, 0.3),
    monarch: variety(mixHex(p.pollen, p.paper, 0.42), p.pollen, p.accent, p.pollen, 0.3),
    luna: variety(
      mixHex(mixHex(p.paper, p.soft, 0.22), p.pollen, 0.14),
      mixHex(p.pollen, p.soft, 0.25),
      p.accent,
      p.pollen,
      0.28,
    ),
    violet: variety(mixHex(burnt, p.paper, 0.5), burnt, p.pollen, burnt, 0.28),
    ink: variety(mixHex(slate, p.paper, 0.35), p.accent, p.pollen, p.accent, 0.25),
  };
}

const MIXED_KEYS: PaletteKey[] = ['morpho', 'monarch', 'luna', 'violet', 'ink'];
const ASCII_RAMP = ' .,:;~=+*#%@';
const TARGET_FPS = 30;
// Agujero de lectura: núcleo limpio y borde difuso, en px CSS.
const READING_HOLE_RADIUS = 130;
const READING_HOLE_CORE = 0.46;
// Separación suave entre criaturas, para que no se amontonen ni se solapen.
const SEPARATION_PUSH = 130;
const MAX_BOOST = 200;

interface CreatureEntity {
  x: number;
  y: number;
  angle: number;
  baseSpeed: number;
  size: number;
  paletteKey: PaletteKey;
  flapPhase: number;
  flapRate: number;
  swimPhase: number;
  swimRate: number;
  glideTimer: number;
  wanderTarget: number;
  wanderTimer: number;
  seedA: number;
  seedB: number;
  boostVx: number;
  boostVy: number;
  excitement: number;
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
}

interface FoodPellet {
  x: number;
  y: number;
  life: number;
  radius: number;
}

function createCreature(
  width: number,
  height: number,
  creature: WildlifeCreature,
  species: ButterflySpecies,
  overrideX?: number,
  overrideY?: number,
): CreatureEntity {
  const paletteKey =
    species === 'mixed'
      ? MIXED_KEYS[Math.floor(Math.random() * MIXED_KEYS.length)]
      : species;
  const angle = Math.random() * Math.PI * 2;
  const isKoi = creature === 'koi';

  return {
    x: overrideX ?? Math.random() * width,
    y: overrideY ?? Math.random() * height,
    angle,
    baseSpeed: isKoi ? 28 + Math.random() * 26 : 32 + Math.random() * 34,
    size: isKoi ? 76 + Math.random() * 64 : 64 + Math.random() * 68,
    paletteKey,
    flapPhase: Math.random() * Math.PI * 2,
    flapRate: 6 + Math.random() * 3.8,
    swimPhase: Math.random() * Math.PI * 2,
    swimRate: 4.6 + Math.random() * 2.4,
    glideTimer: Math.random() * 2.5,
    wanderTarget: angle,
    wanderTimer: 1 + Math.random() * 3,
    seedA: Math.random() * 100,
    seedB: Math.random() * 100,
    boostVx: 0,
    boostVy: 0,
    excitement: overrideX !== undefined ? 1 : 0,
    trail: [],
  };
}

function drawButterflyShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  radius: number,
  flapCompression: number,
  colors: PaletteColors,
): void {
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

    // Ala superior
    ctx.beginPath();
    ctx.moveTo(0, -radius * 0.14);
    ctx.bezierCurveTo(radius * 0.45, -radius * 0.92, radius * 1.12, -radius * 0.65, radius * 0.96, -radius * 0.02);
    ctx.bezierCurveTo(radius * 0.85, radius * 0.22, radius * 0.32, radius * 0.16, 0, radius * 0.06);
    ctx.closePath();
    ctx.fill();

    // Ala inferior
    ctx.beginPath();
    ctx.moveTo(0, radius * 0.04);
    ctx.bezierCurveTo(radius * 0.48, radius * 0.06, radius * 0.82, radius * 0.36, radius * 0.62, radius * 0.78);
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

/** Koi articulado: la misma escena de baja resolución, dibujado con palette cálida. */
function drawKoiFish(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  length: number,
  swimPhase: number,
  palette: KoiPalette,
): void {
  const numSegs = 7;
  const segStep = (length * 0.88) / (numSegs - 1);
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

  // Iluminación alargada y centrada en el cuerpo, no en la cabeza: evita el
  // halo redondo que hacía que el koi se leyera como larva sobre papel claro.
  const glowX = x + backX * length * 0.42;
  const glowY = y + backY * length * 0.42;
  ctx.save();
  ctx.translate(glowX, glowY);
  ctx.rotate(angle);
  ctx.scale(1.25, 0.72);
  const glow = ctx.createRadialGradient(0, 0, length * 0.06, 0, 0, length * 0.62);
  glow.addColorStop(0, palette.glow);
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, length * 0.62, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const finAnchor = spine[1];
  const finRow = Math.sin(swimPhase * 0.85) * 0.35;
  const finLen = length * 0.24;

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
      tipX + backX * (finLen * 0.38),
      tipY + backY * (finLen * 0.38),
      spine[2].x,
      spine[2].y,
    );
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = palette.outline;
    ctx.lineWidth = length * 0.018;
    ctx.stroke();
  }

  const tailBase = spine[numSegs - 1];
  const tailPrev = spine[numSegs - 2];
  const tailDir = Math.atan2(tailBase.y - tailPrev.y, tailBase.x - tailPrev.x);
  const tailLen = length * 0.4;
  const tailSpread = 0.72;
  const tailPoint = (offset: number, dist: number) => ({
    x: tailBase.x + Math.cos(tailDir + offset) * dist,
    y: tailBase.y + Math.sin(tailDir + offset) * dist,
  });
  const upperTip = tailPoint(tailSpread, tailLen);
  const lowerTip = tailPoint(-tailSpread, tailLen);
  const notch = tailPoint(0, tailLen * 0.52);
  const upperCtrl = tailPoint(tailSpread * 0.78, tailLen * 0.94);
  const notchUpperCtrl = tailPoint(tailSpread * 0.3, tailLen * 0.86);
  const notchLowerCtrl = tailPoint(-tailSpread * 0.3, tailLen * 0.86);
  const lowerCtrl = tailPoint(-tailSpread * 0.78, tailLen * 0.94);

  // Cola en abanico con muesca central: dos lóbulos, no un hilo triangular.
  ctx.fillStyle = palette.fins;
  ctx.beginPath();
  ctx.moveTo(tailBase.x, tailBase.y);
  ctx.quadraticCurveTo(upperCtrl.x, upperCtrl.y, upperTip.x, upperTip.y);
  ctx.quadraticCurveTo(notchUpperCtrl.x, notchUpperCtrl.y, notch.x, notch.y);
  ctx.quadraticCurveTo(notchLowerCtrl.x, notchLowerCtrl.y, lowerTip.x, lowerTip.y);
  ctx.quadraticCurveTo(lowerCtrl.x, lowerCtrl.y, tailBase.x, tailBase.y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = palette.outline;
  ctx.lineWidth = length * 0.022;
  ctx.stroke();

  const widths = [0.14, 0.23, 0.25, 0.23, 0.19, 0.14, 0.09].map((w) => w * length);
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
  ctx.arc(
    spine[0].x,
    spine[0].y,
    widths[0] * 0.95,
    angle - Math.PI / 2,
    angle + Math.PI / 2,
  );
  for (let i = 0; i < numSegs; i++) ctx.lineTo(leftPts[i].x, leftPts[i].y);
  for (let i = numSegs - 1; i >= 0; i--) ctx.lineTo(rightPts[i].x, rightPts[i].y);
  ctx.closePath();

  ctx.fillStyle = palette.body;
  ctx.fill();
  ctx.strokeStyle = palette.outline;
  ctx.lineWidth = length * 0.035;
  ctx.stroke();
  ctx.clip();

  ctx.fillStyle = palette.patchPrimary;
  ctx.beginPath();
  ctx.ellipse(
    spine[1].x,
    spine[1].y,
    widths[1] * 1.15,
    widths[1] * 0.85,
    angle,
    0,
    Math.PI * 2,
  );
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

/** Fondo global: escena suave en un buffer de baja resolución (1 px = 1 celda)
 *  y encima una matriz de píxeles + glifos ASCII según luminancia. */
export default function AtmosphereBackground({
  creature = 'butterflies',
  count = 14,
  speed = 1,
  species = 'mixed',
  interactionMode = 'breeze',
  cellSize = 11,
  overlayMode = 'ascii-pixels',
  scale = 1,
  showAmbientParticles = true,
  theme = 'light',
  paused = false,
  fps = TARGET_FPS,
  opacity = 1,
  spawnOnClick = false,
  className = '',
}: AtmosphereBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const creaturesRef = useRef<CreatureEntity[]>([]);
  const blobsRef = useRef<AmbientBlob[]>([]);
  const ripplesRef = useRef<RippleWave[]>([]);
  const pelletsRef = useRef<FoodPellet[]>([]);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });

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
    spawnOnClick,
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
    spawnOnClick,
  };

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const list = creaturesRef.current;
    const target = Math.max(1, Math.min(40, count));

    list.length = 0;
    pelletsRef.current = [];
    ripplesRef.current = [];
    const minGap = creature === 'koi' ? 110 : 120;
    for (let i = 0; i < target; i++) {
      let next = createCreature(width, height, creature, species);
      // Unos pocos intentos para no arrancar con el fondo ya amontonado.
      for (let attempt = 0; attempt < 8; attempt++) {
        const tooClose = list.some(
          (other) => Math.hypot(next.x - other.x, next.y - other.y) < minGap,
        );
        if (!tooClose) break;
        next = createCreature(width, height, creature, species);
      }
      list.push(next);
    }
  }, [creature, count, species]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const palette = readButterflyPalette();
    const palettes = buildPalettes(palette);
    const koiPalettes = buildKoiPalettes(palette);

    // 1 px del buffer = 1 celda de la rejilla; el suavizado se muestrea después.
    const sceneCanvas = document.createElement('canvas');
    const sceneCtx = sceneCanvas.getContext('2d', { willReadFrequently: true });
    if (!sceneCtx) return;

    const gridBackdropCanvas = document.createElement('canvas');
    const gridBackdropCtx = gridBackdropCanvas.getContext('2d');

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
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
        gridBackdropCtx.fillStyle = isDark ? 'rgba(255,255,255,0.025)' : 'rgba(26,26,26,0.028)';
        const gap = currentCell >= 12 ? 1.5 : 1;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            gridBackdropCtx.fillRect(c * currentCell, r * currentCell, currentCell - gap, currentCell - gap);
          }
        }
      }

      if (currentMode !== 'pixels-only') {
        const fontSize = Math.max(7, Math.floor(currentCell * 0.82));
        gridBackdropCtx.font = `400 ${fontSize}px "IBM Plex Mono", ui-monospace, monospace`;
        gridBackdropCtx.textAlign = 'center';
        gridBackdropCtx.textBaseline = 'middle';
        gridBackdropCtx.fillStyle = isDark ? 'rgba(203,200,191,0.13)' : 'rgba(90,80,72,0.13)';
        for (let r = 0; r < rows; r++) {
          const cy = r * currentCell + currentCell * 0.5;
          for (let c = 0; c < cols; c++) {
            if ((r + c) % 2 === 0) {
              gridBackdropCtx.fillText(
                (r * 7 + c * 13) % 11 === 0 ? '+' : '·',
                c * currentCell + currentCell * 0.5,
                cy,
              );
            }
          }
        }
      }
    };

    const resize = () => {
      // El canvas es fixed inset-0: debe medir el viewport, no #app-root (crece con el scroll).
      width = window.innerWidth;
      height = window.innerHeight;
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

    if (creaturesRef.current.length === 0) {
      for (let i = 0; i < configRef.current.count; i++) {
        creaturesRef.current.push(
          createCreature(width, height, configRef.current.creature, configRef.current.species),
        );
      }
    }

    if (blobsRef.current.length === 0) {
      const hues = [palette.accent, palette.pollen, palette.soft, palette.accent, palette.pollen, palette.soft];
      for (let i = 0; i < 6; i++) {
        blobsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 18,
          vy: (Math.random() - 0.5) * 18,
          radius: 180 + Math.random() * 180,
          hue: hues[i % hues.length],
        });
      }
    }

    const handlePointerMove = (e: PointerEvent) => {
      // El "agujero de lectura" es solo para cursor real (mouse/pen), no para el dedo.
      if (e.pointerType === 'touch') return;
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    };
    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };
    const handlePointerEnd = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') pointerRef.current.active = false;
    };
    const handlePointerDown = (e: PointerEvent) => {
      const cfg = configRef.current;
      if (!cfg.spawnOnClick) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('button, a, input, textarea, select, [data-interactive-surface]')) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ripplesRef.current.push({ x, y, radius: 6, maxRadius: 240, alpha: 0.9 });

      if (cfg.creature === 'koi') {
        for (let i = 0; i < 3; i++) {
          pelletsRef.current.push({
            x: x + (Math.random() - 0.5) * 28,
            y: y + (Math.random() - 0.5) * 28,
            life: 9,
            radius: 9 + Math.random() * 6,
          });
        }
        if (pelletsRef.current.length > 24) {
          pelletsRef.current.splice(0, pelletsRef.current.length - 24);
        }
      } else {
        creaturesRef.current.push(createCreature(width, height, cfg.creature, cfg.species, x, y));
        if (creaturesRef.current.length > Math.max(cfg.count + 6, 40)) creaturesRef.current.shift();
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('pointerup', handlePointerEnd);
    window.addEventListener('pointercancel', handlePointerEnd);
    window.addEventListener('pointerdown', handlePointerDown);

    let raf = 0;
    let last = 0;
    let accumulator = 0;
    let elapsed = 0;
    let disposed = false;

    const render = (dt: number) => {
      const cfg = configRef.current;
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
      elapsed += dt;

      const list = creaturesRef.current;
      const ptr = pointerRef.current;
      const isKoi = cfg.creature === 'koi';

      if (dt > 0) {
        for (let i = pelletsRef.current.length - 1; i >= 0; i--) {
          pelletsRef.current[i].life -= dt;
          if (pelletsRef.current[i].life <= 0) pelletsRef.current.splice(i, 1);
        }
      }

      for (const b of list) {
        if (dt > 0) {
          // Cada criatura empuja suavemente a las que se le acercan demasiado.
          let sepX = 0;
          let sepY = 0;
          for (const other of list) {
            if (other === b) continue;
            const dx = b.x - other.x;
            const dy = b.y - other.y;
            const d2 = dx * dx + dy * dy;
            const personal =
              (b.size + other.size) * 0.5 * cfg.scale * (isKoi ? 1.05 : 1.15);
            if (d2 < personal * personal && d2 > 1) {
              const dist = Math.sqrt(d2);
              const strength = 1 - dist / personal;
              sepX += (dx / dist) * strength;
              sepY += (dy / dist) * strength;
            }
          }
          b.boostVx += sepX * SEPARATION_PUSH * dt;
          b.boostVy += sepY * SEPARATION_PUSH * dt;

          // Tramos largos y viradas suaves: ni mariposas ni koi dan vueltas chicas.
          b.wanderTimer -= dt;
          if (b.wanderTimer <= 0) {
            b.wanderTimer = isKoi ? 3.4 + Math.random() * 6 : 2.8 + Math.random() * 5.5;
            b.wanderTarget = b.angle + (Math.random() - 0.5) * (isKoi ? 1.2 : 1.5);
          }
          const wobble =
            Math.sin(elapsed * 0.7 + b.seedA) * (isKoi ? 0.12 : 0.1) +
            Math.cos(elapsed * 0.33 + b.seedB) * 0.07;
          let diff = b.wanderTarget + wobble - b.angle;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          const maxTurn = isKoi ? 0.55 : 0.8;
          b.angle += Math.max(-maxTurn * dt, Math.min(maxTurn * dt, diff));

          let seekingFood = false;
          if (isKoi && pelletsRef.current.length > 0) {
            let bestDist = 340 * 340;
            let bestIdx = -1;
            for (let p = 0; p < pelletsRef.current.length; p++) {
              const pellet = pelletsRef.current[p];
              const dx = pellet.x - b.x;
              const dy = pellet.y - b.y;
              const d2 = dx * dx + dy * dy;
              if (d2 < bestDist) {
                bestDist = d2;
                bestIdx = p;
              }
            }
            if (bestIdx !== -1) {
              const pellet = pelletsRef.current[bestIdx];
              const targetAngle = Math.atan2(pellet.y - b.y, pellet.x - b.x);
              let foodDiff = targetAngle - b.angle;
              while (foodDiff > Math.PI) foodDiff -= Math.PI * 2;
              while (foodDiff < -Math.PI) foodDiff += Math.PI * 2;
              b.angle += Math.max(-1.6 * dt, Math.min(1.6 * dt, foodDiff));
              b.excitement = Math.min(0.85, b.excitement + dt * 1.3);
              seekingFood = true;
              if (bestDist < 26 * 26) {
                pelletsRef.current.splice(bestIdx, 1);
                ripplesRef.current.push({
                  x: pellet.x,
                  y: pellet.y,
                  radius: 4,
                  maxRadius: 110,
                  alpha: 0.75,
                });
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
                const push = 140 * strength * dt;
                b.boostVx += (dx / dist) * push;
                b.boostVy += (dy / dist) * push;
                b.excitement = Math.min(1, b.excitement + strength * 2.5 * dt);
              } else if (!seekingFood) {
                const targetAngle = Math.atan2(-dy, -dx);
                let pointerDiff = targetAngle - b.angle;
                while (pointerDiff > Math.PI) pointerDiff -= Math.PI * 2;
                while (pointerDiff < -Math.PI) pointerDiff += Math.PI * 2;
                b.angle += pointerDiff * 2.4 * strength * dt;
                b.wanderTarget = b.angle;
              }
            }
          }

          const boostMag = Math.hypot(b.boostVx, b.boostVy);
          if (boostMag > MAX_BOOST) {
            b.boostVx = (b.boostVx / boostMag) * MAX_BOOST;
            b.boostVy = (b.boostVy / boostMag) * MAX_BOOST;
          }

          b.excitement = Math.max(0, b.excitement - dt * 0.7);
          b.boostVx *= Math.pow(0.16, dt);
          b.boostVy *= Math.pow(0.16, dt);

          b.glideTimer -= dt;
          if (!isKoi && b.glideTimer < -0.55) b.glideTimer = 1.8 + Math.random() * 2.6;
          const isGliding = !isKoi && b.glideTimer < 0 && b.excitement < 0.2;

          const speed =
            b.baseSpeed *
            cfg.speed *
            (isGliding ? 0.74 : 1) *
            (0.9 + 0.1 * Math.sin(elapsed * 1.1 + b.seedB)) *
            (isKoi ? 1 + b.excitement * 0.25 : 1);
          const weave = Math.sin(elapsed * 2.1 + b.seedA) * (isGliding ? 2 : isKoi ? 3 : 6);
          b.x += (Math.cos(b.angle) * speed + b.boostVx - Math.sin(b.angle) * weave) * dt;
          b.y += (Math.sin(b.angle) * speed + b.boostVy + Math.cos(b.angle) * weave) * dt;

          const margin = b.size * cfg.scale + 40;
          if (b.x < -margin) b.x = width + margin;
          if (b.x > width + margin) b.x = -margin;
          if (b.y < -margin) b.y = height + margin;
          if (b.y > height + margin) b.y = -margin;

          if (cfg.showAmbientParticles && (Math.floor((elapsed * 24) % 2) === 0 || b.trail.length === 0)) {
            const trailColor = isKoi
              ? koiPalettes[b.paletteKey].patchPrimary
              : palettes[b.paletteKey][cfg.theme].wingMid;
            b.trail.push({ x: b.x, y: b.y, color: trailColor });
            if (b.trail.length > 10) b.trail.shift();
          }

          if (isKoi) {
            b.swimPhase += b.swimRate * cfg.speed * (1 + b.excitement * 0.9) * dt;
          } else if (!isGliding) {
            b.flapPhase += b.flapRate * cfg.speed * (1 + b.excitement * 1.1) * dt * Math.PI * 0.65;
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
          rp.radius += 220 * dt;
          rp.alpha = Math.max(0, 1 - rp.radius / rp.maxRadius);
          if (rp.radius >= rp.maxRadius) ripplesRef.current.splice(i, 1);
        }
      }

      // 2. Escena suave (colores reales) en el buffer de baja resolución.
      sceneCtx.setTransform(1 / cs, 0, 0, 1 / cs, 0, 0);
      sceneCtx.clearRect(0, 0, width, height);

      if (cfg.showAmbientParticles) {
        for (const blob of blobsRef.current) {
          const grad = sceneCtx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
          grad.addColorStop(0, blob.hue);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          sceneCtx.globalAlpha = cfg.theme === 'dark' ? 0.22 : 0.14;
          sceneCtx.fillStyle = grad;
          sceneCtx.beginPath();
          sceneCtx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
          sceneCtx.fill();
        }
      }

      if (isKoi) {
        for (const pellet of pelletsRef.current) {
          sceneCtx.globalAlpha = Math.min(1, pellet.life * 0.4);
          sceneCtx.fillStyle = palette.pollen;
          sceneCtx.beginPath();
          sceneCtx.arc(pellet.x, pellet.y, pellet.radius, 0, Math.PI * 2);
          sceneCtx.fill();
        }
      }

      for (const b of list) {
        if (cfg.showAmbientParticles && b.trail.length > 1) {
          for (let t = 0; t < b.trail.length; t++) {
            const pt = b.trail[t];
            const ratio = (t + 1) / b.trail.length;
            sceneCtx.globalAlpha = ratio * 0.26;
            sceneCtx.fillStyle = pt.color;
            sceneCtx.beginPath();
            sceneCtx.arc(pt.x, pt.y, b.size * cfg.scale * 0.26 * ratio, 0, Math.PI * 2);
            sceneCtx.fill();
          }
        }

        sceneCtx.globalAlpha = 1;
        if (isKoi) {
          drawKoiFish(
            sceneCtx,
            b.x,
            b.y,
            b.angle,
            b.size * cfg.scale * 1.25,
            b.swimPhase,
            koiPalettes[b.paletteKey],
          );
        } else {
          const pal = palettes[b.paletteKey][cfg.theme];
          const isGliding = b.glideTimer < 0 && b.excitement < 0.2;
          const flapCompression = isGliding ? 0.96 : 0.24 + 0.76 * ((Math.sin(b.flapPhase) + 1) * 0.5);
          drawButterflyShape(sceneCtx, b.x, b.y, b.angle, b.size * cfg.scale, flapCompression, pal);
        }
      }

      for (const rp of ripplesRef.current) {
        sceneCtx.globalAlpha = rp.alpha * 0.8;
        sceneCtx.strokeStyle = palette.accent;
        sceneCtx.lineWidth = Math.max(cs * 1.4, 14);
        sceneCtx.beginPath();
        sceneCtx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
        sceneCtx.stroke();
      }

      if (ptr.active && cfg.interactionMode !== 'calm') {
        // En vez de teñir la escena, la vaciamos: criaturas y estelas desaparecen
        // bajo el cursor y queda solo el papel con su grilla.
        const hole = sceneCtx.createRadialGradient(
          ptr.x,
          ptr.y,
          0,
          ptr.x,
          ptr.y,
          READING_HOLE_RADIUS,
        );
        hole.addColorStop(0, 'rgba(0,0,0,1)');
        hole.addColorStop(READING_HOLE_CORE, 'rgba(0,0,0,1)');
        hole.addColorStop(1, 'rgba(0,0,0,0)');
        sceneCtx.save();
        sceneCtx.globalAlpha = 1;
        sceneCtx.globalCompositeOperation = 'destination-out';
        sceneCtx.fillStyle = hole;
        sceneCtx.beginPath();
        sceneCtx.arc(ptr.x, ptr.y, READING_HOLE_RADIUS, 0, Math.PI * 2);
        sceneCtx.fill();
        sceneCtx.restore();
      }

      // 3. Matriz de píxeles + ASCII leyendo la escena de abajo.
      const imgData = sceneCtx.getImageData(0, 0, cols, rows).data;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      if (gridBackdropCtx) ctx.drawImage(gridBackdropCanvas, 0, 0, width, height);

      const showPixelBlocks = cfg.overlayMode !== 'ascii-only';
      const showAsciiChars = cfg.overlayMode !== 'pixels-only';
      const gap = cs >= 12 ? 1.5 : 1;
      const fontSize = Math.max(7, Math.floor(cs * 0.86));
      if (showAsciiChars) {
        ctx.font = `600 ${fontSize}px "IBM Plex Mono", ui-monospace, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
      }

      const isDark = cfg.theme === 'dark';
      for (let r = 0; r < rows; r++) {
        const py = r * cs;
        const cy = py + cs * 0.5;
        for (let c = 0; c < cols; c++) {
          const idx = (r * cols + c) * 4;
          const a = imgData[idx + 3];
          if (a < 10) continue;

          const red = imgData[idx];
          const green = imgData[idx + 1];
          const blue = imgData[idx + 2];
          const alphaNorm = a / 255;
          const lum = ((0.299 * red + 0.587 * green + 0.114 * blue) / 255) * alphaNorm;
          const px = c * cs;

          if (showPixelBlocks) {
            const blockAlpha =
              cfg.overlayMode === 'pixels-only'
                ? Math.min(0.9, alphaNorm * 0.85)
                : Math.min(0.52, alphaNorm * (isDark ? 0.4 : 0.34));
            ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${blockAlpha.toFixed(2)})`;
            ctx.fillRect(px, py, cs - gap, cs - gap);
          }

          if (showAsciiChars && (lum > 0.045 || alphaNorm > 0.16)) {
            const rampScore = Math.min(1, Math.max(0.08, lum * 0.8 + alphaNorm * 0.35));
            const charIdx = Math.min(
              ASCII_RAMP.length - 1,
              Math.max(1, Math.floor(rampScore * (ASCII_RAMP.length - 1))),
            );
            const charAlpha = Math.min(0.98, 0.34 + alphaNorm * 0.72);
            const boost = isDark ? 1.2 : 0.94;
            ctx.fillStyle = `rgba(${Math.min(255, Math.round(red * boost))}, ${Math.min(255, Math.round(green * boost))}, ${Math.min(255, Math.round(blue * boost))}, ${charAlpha.toFixed(2)})`;
            ctx.fillText(ASCII_RAMP[charIdx], px + cs * 0.5, cy);
          }
        }
      }
    };

    const tick = (now: number) => {
      raf = 0;
      if (disposed || document.hidden) return;
      const rawDt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      accumulator += rawDt;
      const frameInterval = 1 / Math.max(1, Math.min(60, configRef.current.fps));
      if (accumulator < frameInterval) {
        raf = window.requestAnimationFrame(tick);
        return;
      }
      const dt = accumulator * (reducedMotion.matches ? 0.25 : 1);
      accumulator = 0;
      render(dt);
      raf = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf || document.hidden) return;
      last = 0;
      raf = window.requestAnimationFrame(tick);
    };
    const stop = () => {
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
      accumulator = 0;
    };
    const syncMotion = () => {
      if (document.hidden || configRef.current.paused) {
        stop();
        render(0);
      } else {
        start();
      }
    };

    const onResize = () => {
      resize();
      render(0);
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else syncMotion();
    };

    syncMotion();
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    reducedMotion.addEventListener('change', syncMotion);
    void document.fonts.ready.then(() => {
      if (!disposed) render(0);
    });

    return () => {
      disposed = true;
      stop();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointerup', handlePointerEnd);
      window.removeEventListener('pointercancel', handlePointerEnd);
      window.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('visibilitychange', onVisibility);
      reducedMotion.removeEventListener('change', syncMotion);
    };
  }, [paused]);

  return (
    <motion.canvas
      ref={canvasRef}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, ease: 'easeInOut' }}
      className={`butterfly-backdrop pointer-events-none fixed inset-0 -z-10 h-full w-full ${className}`}
    />
  );
}
