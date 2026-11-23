import { useCallback, useEffect, useRef, useState } from 'react';
import { KOI_VARIETIES, type KoiBehavior } from '../data/koi';
import { ui } from '../i18n/translations';
import { useT } from '../i18n/useT';

/**
 * Estanque Koi jugable. Vive en /zen: comparte la idea del fondo MOOD "koi"
 * pero con canvas propio y sin tocar AsciiButterflyBackground.
 *
 * Decisiones deliberadas:
 * - La rampa ASCII es fija (classic). No hay selector: ya lo sacamos del sitio.
 * - La paleta es cálida (terracota / ámbar) para no chocar con el resto del portfolio.
 * - Todo el HUD se lee de `ui.zen`, así /zen y /en/zen muestran lo mismo en su idioma.
 * - El juego se monta solo en esta ruta, así que su rAF no corre en el resto del sitio.
 */

type SizeTierKey = 'small' | 'medium' | 'large';

const BEHAVIOR_LABELS: Record<KoiBehavior, keyof typeof ui.zen> = {
  calm: 'behaviorCalm',
  smooth: 'behaviorSmooth',
  riser: 'behaviorRiser',
  dart: 'behaviorDart',
};

interface KoiFishingGameProps {
  className?: string;
}

interface KoiPalette {
  body: string;
  patchPrimary: string;
  patchSecondary: string;
  fins: string;
  glow: string;
}

// Cuatro variedades, siempre cálidas. El Asagi tradicional es azul; acá va
// arena/ámbar para que el estanque no introduca un frío que no existe en el sitio.
const MIXED_KOI_DARK: KoiPalette[] = [
  {
    body: '#F8FAFC',
    patchPrimary: '#EF4444',
    patchSecondary: '#F97316',
    fins: 'rgba(241, 245, 249, 0.72)',
    glow: 'rgba(249, 115, 22, 0.26)',
  },
  {
    body: '#FDE047',
    patchPrimary: '#F59E0B',
    patchSecondary: '#FEF9C3',
    fins: 'rgba(254, 240, 138, 0.7)',
    glow: 'rgba(250, 204, 21, 0.28)',
  },
  {
    body: '#F1F5F9',
    patchPrimary: '#FB7185',
    patchSecondary: '#8C4A3A',
    fins: 'rgba(226, 232, 240, 0.68)',
    glow: 'rgba(244, 63, 94, 0.22)',
  },
  {
    body: '#F5E6C8',
    patchPrimary: '#C2703D',
    patchSecondary: '#7A4B2A',
    fins: 'rgba(245, 230, 200, 0.7)',
    glow: 'rgba(194, 112, 61, 0.24)',
  },
];

const ACTIVE_RAMP = ' .,:;~=+*#%@';
const WATER_COLOR = '#E0A24A';
const WATER_COLOR_SOFT = '#F2C879';
const STORAGE_KEY = 'koi_fishing_zen_save_v1';

interface SavedStats {
  highScore: number;
  totalCaught: number;
  bestCatchId: string;
  bestCatchTier: SizeTierKey | '';
  bestCatchPoints: number;
  discoveredIds: string[];
}

const DEFAULT_SAVED: SavedStats = {
  highScore: 0,
  totalCaught: 0,
  bestCatchId: '',
  bestCatchTier: '',
  bestCatchPoints: 0,
  discoveredIds: [],
};

const SIZE_TIER_KEYS: Record<SizeTierKey, keyof typeof ui.zen> = {
  small: 'sizeSmall',
  medium: 'sizeMedium',
  large: 'sizeLarge',
};

function loadStats(): SavedStats {
  if (typeof window === 'undefined') return DEFAULT_SAVED;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SAVED;
    const parsed = JSON.parse(raw) as Partial<SavedStats>;
    const tier = parsed.bestCatchTier;
    return {
      highScore: typeof parsed.highScore === 'number' ? parsed.highScore : 0,
      totalCaught: typeof parsed.totalCaught === 'number' ? parsed.totalCaught : 0,
      bestCatchId: typeof parsed.bestCatchId === 'string' ? parsed.bestCatchId : '',
      bestCatchTier: tier === 'small' || tier === 'medium' || tier === 'large' ? tier : '',
      bestCatchPoints: typeof parsed.bestCatchPoints === 'number' ? parsed.bestCatchPoints : 0,
      discoveredIds: Array.isArray(parsed.discoveredIds) ? parsed.discoveredIds : [],
    };
  } catch {
    return DEFAULT_SAVED;
  }
}

function saveStats(stats: SavedStats) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Modo privado o cuota llena: el juego sigue andando sin persistir.
  }
}

interface KoiEntity {
  id: number;
  x: number;
  y: number;
  angle: number;
  baseSpeed: number;
  size: number;
  variantIdx: number;
  phase: number;
  phaseRate: number;
  seedA: number;
  seedB: number;
  boostVx: number;
  boostVy: number;
  excitement: number;
  trail: Array<{ x: number; y: number }>;
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
  color: string;
}

interface FloatingPopup {
  x: number;
  y: number;
  text: string;
  subtext?: string;
  color: string;
  life: number;
  maxLife: number;
}

type FishingPhase = 'idle' | 'casting' | 'waiting' | 'nibble' | 'bite' | 'reeling' | 'gameover';

interface HudSnapshot {
  phase: FishingPhase;
  score: number;
  highScore: number;
  isNewRecord: boolean;
  luresLeft: number;
  streak: number;
  caughtCount: number;
  isInsideBar: boolean;
  isPerfect: boolean;
  activeFishIdx: number;
  notice: string | null;
  lastCatch: {
    id: string;
    name: string;
    sizeKey: SizeTierKey;
    points: number;
    accentColor: string;
    wasPerfect: boolean;
  } | null;
  discoveredIds: string[];
  bestCatchId: string;
  bestCatchTier: SizeTierKey | '';
  bestCatchPoints: number;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function createKoi(
  id: number,
  width: number,
  height: number,
  variantIdx: number,
  spawnAtEdge = false,
): KoiEntity {
  const size = 76 + Math.random() * 68;
  const isGold = variantIdx % 4 === 1;
  const baseSpeed = (isGold ? 42 : 34) + Math.random() * 26;

  let x = Math.random() * width;
  let y = Math.random() * height;
  let angle = Math.random() * Math.PI * 2;

  if (spawnAtEdge) {
    const edge = Math.floor(Math.random() * 4);
    const pad = 95;
    if (edge === 0) {
      x = -pad;
      y = Math.random() * height;
      angle = (Math.random() - 0.5) * 0.9;
    } else if (edge === 1) {
      x = width + pad;
      y = Math.random() * height;
      angle = Math.PI + (Math.random() - 0.5) * 0.9;
    } else if (edge === 2) {
      x = Math.random() * width;
      y = -pad;
      angle = Math.PI * 0.5 + (Math.random() - 0.5) * 0.9;
    } else {
      x = Math.random() * width;
      y = height + pad;
      angle = -Math.PI * 0.5 + (Math.random() - 0.5) * 0.9;
    }
  }

  return {
    id,
    x,
    y,
    angle,
    baseSpeed,
    size,
    variantIdx,
    phase: Math.random() * Math.PI * 2,
    phaseRate: 5.2 + Math.random() * 2.8,
    seedA: Math.random() * 100,
    seedB: Math.random() * 100,
    boostVx: 0,
    boostVy: 0,
    excitement: 0,
    trail: [],
  };
}

function getKoiPalette(variantIdx: number): KoiPalette {
  return MIXED_KOI_DARK[variantIdx % MIXED_KOI_DARK.length];
}

function getSizeTier(size: number): { key: SizeTierKey; mult: number } {
  if (size >= 122) return { key: 'large', mult: 1.6 };
  if (size >= 98) return { key: 'medium', mult: 1.25 };
  return { key: 'small', mult: 1 };
}

/** Próximo objetivo vertical del Koi dentro de la barra, según su especie. */
function pickNextFishTarget(
  behavior: KoiBehavior,
  currentPos: number,
): { target: number; delay: number } {
  if (behavior === 'calm') {
    return {
      target: clamp(currentPos + (Math.random() - 0.5) * 0.45, 0.08, 0.88),
      delay: 1.1 + Math.random() * 0.9,
    };
  }
  if (behavior === 'smooth') {
    return {
      target: clamp(currentPos + (Math.random() - 0.5) * 0.6, 0.08, 0.92),
      delay: 0.85 + Math.random() * 0.75,
    };
  }
  if (behavior === 'riser') {
    const bias = Math.random() < 0.65 ? 0.52 + Math.random() * 0.4 : 0.14 + Math.random() * 0.35;
    return { target: clamp(bias, 0.1, 0.93), delay: 0.65 + Math.random() * 0.65 };
  }
  const jump = (Math.random() < 0.5 ? -1 : 1) * (0.16 + Math.random() * 0.28);
  const next = currentPos + jump;
  return {
    target: clamp(next < 0.08 || next > 0.92 ? currentPos - jump : next, 0.08, 0.92),
    delay: 0.7 + Math.random() * 0.5,
  };
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

export default function KoiFishingGame({ className = '' }: KoiFishingGameProps) {
  const t = useT();
  const tRef = useRef(t);
  tRef.current = t;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // La barra se anima a 60 fps por DOM: no queremos un render de React por frame.
  const greenBarRef = useRef<HTMLDivElement | null>(null);
  const fishMarkerRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const initialSaved = useRef<SavedStats>(loadStats());
  const [hud, setHud] = useState<HudSnapshot>(() => ({
    phase: 'idle',
    score: 0,
    highScore: initialSaved.current.highScore,
    isNewRecord: false,
    luresLeft: 3,
    streak: 0,
    caughtCount: 0,
    isInsideBar: true,
    isPerfect: true,
    activeFishIdx: -1,
    notice: null,
    lastCatch: null,
    discoveredIds: initialSaved.current.discoveredIds,
    bestCatchId: initialSaved.current.bestCatchId,
    bestCatchTier: initialSaved.current.bestCatchTier,
    bestCatchPoints: initialSaved.current.bestCatchPoints,
  }));

  const settingsRef = useRef({
    count: undefined as number | undefined,
    speed: 0.9,
    cellSize: 11,
    scale: 1.05,
  });

  const gameRef = useRef({
    phase: 'idle' as FishingPhase,
    lureX: 0,
    lureY: 0,
    castStartX: 0,
    castStartY: 0,
    castTargetX: 0,
    castTargetY: 0,
    castTimer: 0,
    hookedFishId: -1,
    nibbleTimer: 0,
    biteTimer: 0,

    // Física de la barra verde: 0 = abajo, 1 = arriba.
    barHeight: 0.3,
    barPos: 0.18,
    barVel: 0.15,
    fishPos: 0.33,
    fishTarget: 0.5,
    fishVel: 0,
    fishPatternTimer: 0.8,
    reelProgress: 0.32,
    isInsideBar: true,
    isPerfect: true,
    perfectGraceTimer: 0.45,
    activeFishIdx: -1,
    isPressed: false,
    score: 0,
    highScore: initialSaved.current.highScore,
    isNewRecord: false,
    luresLeft: 3,
    streak: 0,
    caughtCount: 0,
    totalCaughtAllTime: initialSaved.current.totalCaught,
    bestCatchId: initialSaved.current.bestCatchId,
    bestCatchTier: initialSaved.current.bestCatchTier,
    bestCatchPoints: initialSaved.current.bestCatchPoints,
    discoveredIds: [...initialSaved.current.discoveredIds],
    notice: null as string | null,
    noticeTimer: 0,
    lastCatch: null as HudSnapshot['lastCatch'],
    lastCatchTimer: 0,
    nextFishId: 100,
    viewportW: 800,
    viewportH: 600,
  });

  const creaturesRef = useRef<KoiEntity[]>([]);
  const blobsRef = useRef<AmbientBlob[]>([]);
  const ripplesRef = useRef<RippleWave[]>([]);
  const popupsRef = useRef<FloatingPopup[]>([]);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });

  const syncHud = useCallback(() => {
    const g = gameRef.current;
    setHud({
      phase: g.phase,
      score: g.score,
      highScore: g.highScore,
      isNewRecord: g.isNewRecord,
      luresLeft: g.luresLeft,
      streak: g.streak,
      caughtCount: g.caughtCount,
      isInsideBar: g.isInsideBar,
      isPerfect: g.isPerfect,
      activeFishIdx: g.activeFishIdx,
      notice: g.notice,
      lastCatch: g.lastCatch,
      discoveredIds: [...g.discoveredIds],
      bestCatchId: g.bestCatchId,
      bestCatchTier: g.bestCatchTier,
      bestCatchPoints: g.bestCatchPoints,
    });
  }, []);

  const resetRun = useCallback(() => {
    const g = gameRef.current;
    g.phase = 'idle';
    g.hookedFishId = -1;
    g.barHeight = 0.3;
    g.barPos = 0.18;
    g.barVel = 0.15;
    g.fishPos = 0.33;
    g.fishTarget = 0.5;
    g.fishVel = 0;
    g.fishPatternTimer = 0.8;
    g.reelProgress = 0.32;
    g.isInsideBar = true;
    g.isPerfect = true;
    g.perfectGraceTimer = 0.45;
    g.activeFishIdx = -1;
    g.isPressed = false;
    g.castTimer = 0;
    g.nibbleTimer = 0;
    g.biteTimer = 0;
    g.score = 0;
    g.highScore = 0;
    g.isNewRecord = false;
    g.luresLeft = 3;
    g.streak = 0;
    g.caughtCount = 0;
    g.totalCaughtAllTime = 0;
    g.discoveredIds = [];
    g.bestCatchId = '';
    g.bestCatchTier = '';
    g.bestCatchPoints = 0;
    g.lastCatch = null;
    g.lastCatchTimer = 0;
    g.notice = tRef.current(ui.zen.resetNotice);
    g.noticeTimer = 2.2;
    saveStats(DEFAULT_SAVED);
    ripplesRef.current.length = 0;
    popupsRef.current.length = 0;
    syncHud();
  }, [syncHud]);

  const handleResetClick = useCallback(() => {
    resetRun();
    containerRef.current?.focus({ preventScroll: true });
  }, [resetRun]);

  const handleActionDown = useCallback(
    (clientX?: number, clientY?: number) => {
      const g = gameRef.current;
      const canvas = canvasRef.current;
      g.isPressed = true;

      if (g.phase === 'gameover') return;

      if (g.phase === 'idle') {
        if (!canvas || clientX === undefined || clientY === undefined) {
          const w = g.viewportW;
          const h = g.viewportH;
          g.castTargetX = w * (0.3 + Math.random() * 0.4);
          g.castTargetY = h * (0.28 + Math.random() * 0.34);
        } else {
          const rect = canvas.getBoundingClientRect();
          const rawX = clientX - rect.left;
          const rawY = clientY - rect.top;
          g.castTargetX = clamp(rawX, 34, Math.max(40, g.viewportW - 34));
          g.castTargetY = clamp(rawY, 82, Math.max(96, g.viewportH - 115));
        }
        g.castStartX = g.viewportW * 0.5;
        g.castStartY = g.viewportH - 14;
        g.lureX = g.castStartX;
        g.lureY = g.castStartY;
        g.castTimer = 0;
        g.hookedFishId = -1;
        g.phase = 'casting';
        syncHud();
        return;
      }

      if (g.phase === 'waiting') {
        ripplesRef.current.push({
          x: g.lureX,
          y: g.lureY,
          radius: 4,
          maxRadius: 90,
          alpha: 0.55,
          color: WATER_COLOR_SOFT,
        });
        g.phase = 'idle';
        g.hookedFishId = -1;
        syncHud();
        return;
      }

      if (g.phase === 'nibble') {
        const fish = creaturesRef.current.find((f) => f.id === g.hookedFishId);
        if (fish) {
          fish.excitement = 0.7;
          fish.angle += Math.PI * 0.85;
        }
        ripplesRef.current.push({
          x: g.lureX,
          y: g.lureY,
          radius: 6,
          maxRadius: 120,
          alpha: 0.65,
          color: '#94A3B8',
        });
        g.phase = 'idle';
        g.hookedFishId = -1;
        g.notice = tRef.current(ui.zen.tooEarly);
        g.noticeTimer = 1.6;
        syncHud();
        return;
      }

      if (g.phase === 'bite') {
        const hooked = creaturesRef.current.find((f) => f.id === g.hookedFishId);
        const fishIdx = hooked ? hooked.variantIdx % KOI_VARIETIES.length : 0;
        const variety = KOI_VARIETIES[fishIdx];
        const firstStep = pickNextFishTarget(variety.behavior, 0.33);

        g.phase = 'reeling';
        g.activeFishIdx = fishIdx;
        g.barHeight = 0.3;
        g.barPos = 0.18;
        g.barVel = 0.15;
        g.fishPos = 0.33;
        g.fishTarget = firstStep.target;
        g.fishVel = 0;
        g.fishPatternTimer = firstStep.delay;
        g.reelProgress = 0.32;
        g.isInsideBar = true;
        g.isPerfect = true;
        // Margen de cortesía al arranque: no se pierde "perfecta" por reaccionar.
        g.perfectGraceTimer = 0.45;
        g.notice = null;

        ripplesRef.current.push({
          x: g.lureX,
          y: g.lureY,
          radius: 6,
          maxRadius: 170,
          alpha: 0.9,
          color: '#FDE047',
        });

        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(25);
        }
        syncHud();
      }
    },
    [syncHud],
  );

  const handleActionUp = useCallback(() => {
    gameRef.current.isPressed = false;
  }, []);

  // Teclado. Los controles del HUD se respetan a propósito: si el foco está en
  // "Reiniciar", la barra espaciadora debe activar ese botón, no lanzar la boya.
  useEffect(() => {
    const isActionKey = (code: string) =>
      code === 'Space' || code === 'Enter' || code === 'ArrowUp' || code === 'KeyW';

    const onKeyDown = (e: KeyboardEvent) => {
      if (!isActionKey(e.code)) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'BUTTON' || tag === 'A' || tag === 'INPUT') return;
      // Mantener una tecla dispara keydown repetidos: cancelar el scroll antes
      // de descartar las repeticiones.
      e.preventDefault();
      if (e.repeat) return;
      handleActionDown();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (isActionKey(e.code)) handleActionUp();
    };
    const onWindowUp = () => {
      gameRef.current.isPressed = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('pointerup', onWindowUp);
    window.addEventListener('pointercancel', onWindowUp);
    window.addEventListener('blur', onWindowUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('pointerup', onWindowUp);
      window.removeEventListener('pointercancel', onWindowUp);
      window.removeEventListener('blur', onWindowUp);
    };
  }, [handleActionDown, handleActionUp]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sceneCanvas = document.createElement('canvas');
    const sceneCtx = sceneCanvas.getContext('2d', { willReadFrequently: true });
    if (!sceneCtx) return;

    const gridBackdropCanvas = document.createElement('canvas');
    const gridBackdropCtx = gridBackdropCanvas.getContext('2d');
    if (!gridBackdropCtx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cols = 1;
    let rows = 1;
    let lastBackdropKey = '';

    const rebuildGridBackdrop = () => {
      const cs = settingsRef.current.cellSize;
      const key = `${width}x${height}:${cs}:${dpr}`;
      if (key === lastBackdropKey) return;
      lastBackdropKey = key;

      gridBackdropCanvas.width = Math.floor(width * dpr);
      gridBackdropCanvas.height = Math.floor(height * dpr);
      gridBackdropCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gridBackdropCtx.clearRect(0, 0, width, height);

      gridBackdropCtx.fillStyle = 'rgba(255, 255, 255, 0.024)';
      const gap = cs >= 12 ? 1.5 : 1;
      for (let r = 0; r < rows; r++) {
        const py = r * cs;
        for (let c = 0; c < cols; c++) {
          const px = c * cs;
          gridBackdropCtx.fillRect(px, py, cs - gap, cs - gap);
        }
      }

      const fontSize = Math.max(7, Math.floor(cs * 0.82));
      gridBackdropCtx.font = `400 ${fontSize}px "JetBrains Mono", ui-monospace, monospace`;
      gridBackdropCtx.textAlign = 'center';
      gridBackdropCtx.textBaseline = 'middle';
      gridBackdropCtx.fillStyle = 'rgba(148, 163, 184, 0.13)';

      for (let r = 0; r < rows; r++) {
        const cy = r * cs + cs * 0.5;
        for (let c = 0; c < cols; c++) {
          if ((r + c) % 2 === 0) {
            const cx = c * cs + cs * 0.5;
            gridBackdropCtx.fillText((r * 7 + c * 13) % 11 === 0 ? '~' : '·', cx, cy);
          }
        }
      }
    };

    const syncFishCount = () => {
      const defaultResponsiveCount = width < 640 ? 8 : 11;
      const target = clamp(settingsRef.current.count ?? defaultResponsiveCount, 3, 24);
      const list = creaturesRef.current;
      if (list.length < target) {
        while (list.length < target) {
          const id = gameRef.current.nextFishId++;
          list.push(createKoi(id, width, height, list.length));
        }
      } else if (list.length > target) {
        for (let i = list.length - 1; i >= 0 && list.length > target; i--) {
          if (list[i].id !== gameRef.current.hookedFishId) list.splice(i, 1);
        }
      }
    };

    const resize = () => {
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      gameRef.current.viewportW = width;
      gameRef.current.viewportH = height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const cs = Math.max(7, settingsRef.current.cellSize);
      cols = Math.max(1, Math.ceil(width / cs));
      rows = Math.max(1, Math.ceil(height / cs));
      sceneCanvas.width = cols;
      sceneCanvas.height = rows;
      lastBackdropKey = '';

      syncFishCount();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    if (blobsRef.current.length === 0) {
      const hues = ['#A84432', '#C47A38', '#D9913F', '#E8B866', '#8C4A3A'];
      for (let i = 0; i < 5; i++) {
        blobsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 14,
          vy: (Math.random() - 0.5) * 14,
          radius: 180 + Math.random() * 170,
          hue: hues[i % hues.length],
        });
      }
    }

    let rafId = 0;
    let lastTime = performance.now();
    let elapsed = 0;

    const renderFrame = (now: number) => {
      const rawDt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const settings = settingsRef.current;
      const g = gameRef.current;
      const isMobile = width < 640;
      const responsiveScale = isMobile ? settings.scale * 0.8 : settings.scale;
      const cs = clamp(settings.cellSize, 7, 22);

      const nextCols = Math.max(1, Math.ceil(width / cs));
      const nextRows = Math.max(1, Math.ceil(height / cs));
      if (nextCols !== cols || nextRows !== rows) {
        cols = nextCols;
        rows = nextRows;
        sceneCanvas.width = cols;
        sceneCanvas.height = rows;
      }

      rebuildGridBackdrop();

      const motionFactor = prefersReducedMotion ? 0.35 : 1;
      const dt = rawDt * settings.speed * motionFactor;
      elapsed += dt;
      let hudDirty = false;

      if (g.noticeTimer > 0) {
        g.noticeTimer -= rawDt;
        if (g.noticeTimer <= 0) {
          g.notice = null;
          hudDirty = true;
        }
      }
      if (g.lastCatchTimer > 0) {
        g.lastCatchTimer -= rawDt;
        if (g.lastCatchTimer <= 0) {
          g.lastCatch = null;
          hudDirty = true;
        }
      }

      if (g.phase === 'casting') {
        g.castTimer += rawDt / 0.28;
        const tProgress = Math.min(1, g.castTimer);
        const easeOut = 1 - Math.pow(1 - tProgress, 3);
        g.lureX = g.castStartX + (g.castTargetX - g.castStartX) * easeOut;
        g.lureY =
          g.castStartY +
          (g.castTargetY - g.castStartY) * easeOut -
          Math.sin(tProgress * Math.PI) * 55;

        if (tProgress >= 1) {
          g.lureX = g.castTargetX;
          g.lureY = g.castTargetY;
          g.phase = 'waiting';
          ripplesRef.current.push({
            x: g.lureX,
            y: g.lureY,
            radius: 4,
            maxRadius: 155,
            alpha: 0.85,
            color: WATER_COLOR,
          });
          hudDirty = true;
        }
      } else if (g.phase === 'nibble') {
        g.nibbleTimer -= rawDt;
        if (Math.random() < rawDt * 4) {
          ripplesRef.current.push({
            x: g.lureX,
            y: g.lureY,
            radius: 3,
            maxRadius: 58,
            alpha: 0.55,
            color: WATER_COLOR_SOFT,
          });
        }
        if (g.nibbleTimer <= 0) {
          g.phase = 'bite';
          g.biteTimer = 1.8;
          ripplesRef.current.push({
            x: g.lureX,
            y: g.lureY,
            radius: 5,
            maxRadius: 145,
            alpha: 0.92,
            color: '#FDE047',
          });
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(35);
          }
          hudDirty = true;
        }
      } else if (g.phase === 'bite') {
        g.biteTimer -= rawDt;
        if (g.biteTimer <= 0) {
          const fish = creaturesRef.current.find((f) => f.id === g.hookedFishId);
          if (fish) {
            fish.angle += Math.PI;
            fish.excitement = 0;
          }
          g.hookedFishId = -1;
          g.luresLeft -= 1;
          g.streak = 0;
          g.isPressed = false;
          g.lastCatch = null;

          ripplesRef.current.push({
            x: g.lureX,
            y: g.lureY,
            radius: 6,
            maxRadius: 130,
            alpha: 0.75,
            color: WATER_COLOR_SOFT,
          });

          if (g.luresLeft <= 0) {
            g.phase = 'gameover';
            g.notice = null;
          } else {
            g.phase = 'idle';
            g.notice = tRef.current(ui.zen.missedBite);
            g.noticeTimer = 2.4;
          }
          hudDirty = true;
        }
      } else if (g.phase === 'reeling') {
        const hooked = creaturesRef.current.find((f) => f.id === g.hookedFishId);
        if (!hooked) {
          g.phase = 'idle';
          g.activeFishIdx = -1;
          hudDirty = true;
        } else {
          const variety = KOI_VARIETIES[hooked.variantIdx % KOI_VARIETIES.length];

          // 1) Barra verde con inercia, gravedad suave y rebote abajo.
          // Valores más tranquilos que la versión que pasaste: la zona cruza la columna
          // en ~1 s, alcanzable sin apurar el pulgar.
          const accel = g.isPressed ? 1.25 : -0.95;
          g.barVel += accel * rawDt;
          g.barVel *= Math.pow(0.22, rawDt);
          g.barPos += g.barVel * rawDt;

          const maxBarPos = 1 - g.barHeight;
          if (g.barPos <= 0) {
            g.barPos = 0;
            if (g.barVel < 0) {
              g.barVel = Math.abs(g.barVel) > 0.14 ? -g.barVel * 0.24 : 0;
            }
          } else if (g.barPos >= maxBarPos) {
            g.barPos = maxBarPos;
            if (g.barVel > 0) g.barVel = 0;
          }

          // 2) Cada especie tiene su patrón vertical dentro de la columna.
          g.fishPatternTimer -= rawDt;
          if (g.fishPatternTimer <= 0) {
            const next = pickNextFishTarget(variety.behavior, g.fishPos);
            g.fishTarget = next.target;
            g.fishPatternTimer = next.delay;
          }

          const stiffness =
            variety.behavior === 'calm'
              ? 3.6
              : variety.behavior === 'smooth'
                ? 4.6
                : variety.behavior === 'riser'
                  ? 5.4
                  : 6.2;
          const damping = variety.behavior === 'dart' ? 0.08 : 0.04;
          g.fishVel += (g.fishTarget - g.fishPos) * stiffness * rawDt;
          g.fishVel *= Math.pow(damping, rawDt);
          g.fishPos = clamp(g.fishPos + g.fishVel * rawDt, 0.04, 0.96);

          // 3) El avance depende de mantener al pez dentro de la zona verde.
          const pad = 0.025;
          const insideNow =
            g.fishPos >= g.barPos - pad && g.fishPos <= g.barPos + g.barHeight + pad;

          if (insideNow !== g.isInsideBar) {
            g.isInsideBar = insideNow;
            hudDirty = true;
          }
          if (g.perfectGraceTimer > 0) {
            g.perfectGraceTimer -= rawDt;
          } else if (!insideNow && g.isPerfect) {
            g.isPerfect = false;
            hudDirty = true;
          }

          // Avanza más despacio de lo que retrocede: es un juguete, no un castigo.
          g.reelProgress = clamp(g.reelProgress + (insideNow ? 0.25 : -0.14) * rawDt, 0, 1);

          // DOM directo: 60 fps sin un render de React por frame.
          if (greenBarRef.current) {
            greenBarRef.current.style.bottom = `${g.barPos * 100}%`;
            greenBarRef.current.style.height = `${g.barHeight * 100}%`;
          }
          if (fishMarkerRef.current) {
            fishMarkerRef.current.style.bottom = `calc(${g.fishPos * 100}% - 10px)`;
          }
          if (progressFillRef.current) {
            progressFillRef.current.style.height = `${g.reelProgress * 100}%`;
          }

          // El Koi sigue chapoteando cerca de la boya mientras peleamos.
          const sway = Math.sin(elapsed * 8) * 18;
          g.lureX = g.castTargetX + sway;
          g.lureY = g.castTargetY + Math.cos(elapsed * 6) * 8;
          hooked.x += (g.lureX - hooked.x) * Math.min(1, rawDt * 8);
          hooked.y += (g.lureY - hooked.y) * Math.min(1, rawDt * 8);
          hooked.angle += Math.sin(elapsed * 5) * 2.2 * rawDt;
          hooked.excitement = insideNow ? 0.5 : 0.95;
          hooked.phase += hooked.phaseRate * 1.9 * rawDt;

          if (Math.random() < rawDt * (insideNow ? 2.5 : 5.5)) {
            ripplesRef.current.push({
              x: g.lureX,
              y: g.lureY,
              radius: 4,
              maxRadius: insideNow ? 65 : 95,
              alpha: 0.65,
              color: insideNow ? WATER_COLOR : '#FB923C',
            });
          }

          if (g.reelProgress <= 0) {
            hooked.excitement = 0.9;
            hooked.angle += Math.PI;
            g.hookedFishId = -1;
            g.activeFishIdx = -1;
            g.isPressed = false;
            g.streak = 0;
            g.luresLeft -= 1;

            ripplesRef.current.push({
              x: g.lureX,
              y: g.lureY,
              radius: 8,
              maxRadius: 160,
              alpha: 0.85,
              color: WATER_COLOR_SOFT,
            });

            if (g.luresLeft <= 0) {
              g.phase = 'gameover';
              g.notice = null;
            } else {
              g.phase = 'idle';
              g.notice = tRef.current(ui.zen.fishEscaped);
              g.noticeTimer = 2.4;
            }
            hudDirty = true;
          } else if (g.reelProgress >= 1) {
            const sizeTier = getSizeTier(hooked.size);
            const streakBonus = Math.min(g.streak, 6) * 20;
            const perfectMult = g.isPerfect ? 1.5 : 1;
            const points =
              Math.round(((variety.basePoints * sizeTier.mult + streakBonus) * perfectMult) / 5) *
              5;

            g.score += points;
            g.streak += 1;
            g.caughtCount += 1;
            g.totalCaughtAllTime += 1;
            g.isPressed = false;

            if (!g.discoveredIds.includes(variety.id)) {
              g.discoveredIds.push(variety.id);
            }

            if (points > g.bestCatchPoints) {
              g.bestCatchPoints = points;
              g.bestCatchId = variety.id;
              g.bestCatchTier = sizeTier.key;
            }

            if (g.score > g.highScore) {
              g.highScore = g.score;
              g.isNewRecord = true;
            }

            saveStats({
              highScore: g.highScore,
              totalCaught: g.totalCaughtAllTime,
              bestCatchId: g.bestCatchId,
              bestCatchTier: g.bestCatchTier,
              bestCatchPoints: g.bestCatchPoints,
              discoveredIds: g.discoveredIds,
            });

            g.lastCatch = {
              id: variety.id,
              name: variety.name,
              sizeKey: sizeTier.key,
              points,
              accentColor: variety.accentColor,
              wasPerfect: g.isPerfect,
            };
            g.lastCatchTimer = 3;
            g.notice = null;

            popupsRef.current.push({
              x: g.lureX,
              y: g.lureY - 14,
              text: g.isPerfect ? `★ +${points}` : `+${points}`,
              subtext: `${variety.name} · ${tRef.current(ui.zen[SIZE_TIER_KEYS[sizeTier.key]])}${
                g.isPerfect ? ` · ${tRef.current(ui.zen.perfectShort)}` : ''
              }`,
              color: g.isPerfect ? '#FDE047' : variety.accentColor,
              life: 1.9,
              maxLife: 1.9,
            });

            ripplesRef.current.push({
              x: g.lureX,
              y: g.lureY,
              radius: 8,
              maxRadius: 215,
              alpha: 0.95,
              color: g.isPerfect ? '#FDE047' : variety.accentColor,
            });

            const idx = creaturesRef.current.findIndex((f) => f.id === hooked.id);
            if (idx !== -1) {
              const newId = g.nextFishId++;
              creaturesRef.current[idx] = createKoi(newId, width, height, hooked.variantIdx, true);
            }

            g.hookedFishId = -1;
            g.activeFishIdx = -1;
            g.phase = 'idle';
            g.reelProgress = 0.32;
            hudDirty = true;
          }
        }
      }

      const list = creaturesRef.current;
      const ptr = pointerRef.current;

      let closestId = -1;
      let closestD2 = Infinity;
      if (g.phase === 'waiting') {
        for (const f of list) {
          const dx = g.lureX - f.x;
          const dy = g.lureY - f.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < closestD2) {
            closestD2 = d2;
            closestId = f.id;
          }
        }
      }

      for (const b of list) {
        if (b.id === g.hookedFishId && g.phase === 'reeling') continue;

        if (b.id === g.hookedFishId && (g.phase === 'nibble' || g.phase === 'bite')) {
          const targetAngle = Math.atan2(g.lureY - b.y, g.lureX - b.x);
          const dist = Math.hypot(g.lureX - b.x, g.lureY - b.y);
          b.angle = targetAngle;
          const desiredDist = g.phase === 'bite' ? 14 : 26;
          if (dist > desiredDist) {
            b.x += Math.cos(targetAngle) * 45 * dt;
            b.y += Math.sin(targetAngle) * 45 * dt;
          }
          b.phase += b.phaseRate * (g.phase === 'bite' ? 1.5 : 0.9) * dt;
          continue;
        }

        const turn =
          Math.sin(elapsed * 0.7 + b.seedA) * 0.78 + Math.cos(elapsed * 0.35 + b.seedB) * 0.5;
        b.angle += turn * dt;

        let attracted = false;
        if (g.phase === 'waiting') {
          const dx = g.lureX - b.x;
          const dy = g.lureY - b.y;
          const distSq = dx * dx + dy * dy;
          const attractRadius = b.id === closestId ? 900 : 340;

          if (distSq < attractRadius * attractRadius) {
            const targetAngle = Math.atan2(dy, dx);
            let diff = targetAngle - b.angle;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            b.angle += diff * (b.id === closestId ? 3.0 : 1.9) * dt;
            b.excitement = Math.min(0.65, b.excitement + dt * 0.9);
            attracted = true;

            if (distSq < 34 * 34 && g.hookedFishId === -1) {
              g.hookedFishId = b.id;
              g.phase = 'nibble';
              g.nibbleTimer = 0.65 + Math.random() * 0.55;
              hudDirty = true;
            }
          }
        }

        if (ptr.active && !attracted && g.phase === 'idle') {
          const dx = b.x - ptr.x;
          const dy = b.y - ptr.y;
          const distSq = dx * dx + dy * dy;
          const radius = 165;
          if (distSq < radius * radius && distSq > 4) {
            const dist = Math.sqrt(distSq);
            const strength = 1 - dist / radius;
            const push = 160 * strength * dt;
            b.boostVx += (dx / dist) * push;
            b.boostVy += (dy / dist) * push;
            b.excitement = Math.min(0.85, b.excitement + strength * 2 * dt);
          }
        }

        b.excitement = Math.max(0, b.excitement - dt * 0.65);
        b.boostVx *= Math.pow(0.18, dt);
        b.boostVy *= Math.pow(0.18, dt);

        const speedBoost = 1 + b.excitement * 0.38;
        const vx = Math.cos(b.angle) * b.baseSpeed * speedBoost + b.boostVx;
        const vy = Math.sin(b.angle) * b.baseSpeed * speedBoost + b.boostVy;

        b.x += vx * dt;
        b.y += vy * dt;

        const margin = b.size * responsiveScale + 55;
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
        if (wrapped) b.trail = [];

        if (Math.floor((elapsed * 24) % 2) === 0 || b.trail.length === 0) {
          b.trail.push({ x: b.x, y: b.y });
          if (b.trail.length > 10) b.trail.shift();
        }

        b.phase += b.phaseRate * (1 + b.excitement * 0.7) * dt;
      }

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
        rp.radius += 170 * rawDt;
        rp.alpha = Math.max(0, 1 - rp.radius / rp.maxRadius);
        if (rp.radius >= rp.maxRadius) ripplesRef.current.splice(i, 1);
      }

      for (let i = popupsRef.current.length - 1; i >= 0; i--) {
        const pp = popupsRef.current[i];
        pp.life -= rawDt;
        pp.y -= 28 * rawDt;
        if (pp.life <= 0) popupsRef.current.splice(i, 1);
      }

      if (hudDirty) syncHud();

      sceneCtx.setTransform(1 / cs, 0, 0, 1 / cs, 0, 0);
      sceneCtx.clearRect(0, 0, width, height);

      for (const blob of blobsRef.current) {
        const grad = sceneCtx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
        grad.addColorStop(0, blob.hue);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        sceneCtx.globalAlpha = 0.13;
        sceneCtx.fillStyle = grad;
        sceneCtx.beginPath();
        sceneCtx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        sceneCtx.fill();
      }

      for (const b of list) {
        if (b.trail.length > 1) {
          for (let i = 0; i < b.trail.length; i++) {
            const pt = b.trail[i];
            const ratio = (i + 1) / b.trail.length;
            sceneCtx.globalAlpha = ratio * 0.17;
            sceneCtx.fillStyle = '#C47A38';
            sceneCtx.beginPath();
            sceneCtx.arc(pt.x, pt.y, b.size * responsiveScale * 0.18 * ratio, 0, Math.PI * 2);
            sceneCtx.fill();
          }
        }

        sceneCtx.globalAlpha = 1;
        drawKoiFish(
          sceneCtx,
          b.x,
          b.y,
          b.angle,
          b.size * responsiveScale * 1.25,
          b.phase,
          getKoiPalette(b.variantIdx),
        );
      }

      if (
        g.phase === 'waiting' ||
        g.phase === 'nibble' ||
        g.phase === 'bite' ||
        g.phase === 'reeling'
      ) {
        const pulse = 1 + Math.sin(elapsed * (g.phase === 'bite' ? 14 : 4)) * 0.2;
        const glowRadius = (g.phase === 'bite' ? 52 : 28) * pulse;
        const lureGrad = sceneCtx.createRadialGradient(
          g.lureX,
          g.lureY,
          0,
          g.lureX,
          g.lureY,
          glowRadius,
        );
        const lureColor =
          g.phase === 'bite'
            ? '#FDE047'
            : g.phase === 'reeling' && !g.isInsideBar
              ? '#FB923C'
              : WATER_COLOR;
        lureGrad.addColorStop(0, lureColor);
        lureGrad.addColorStop(1, 'rgba(0,0,0,0)');
        sceneCtx.globalAlpha = g.phase === 'bite' ? 0.95 : 0.72;
        sceneCtx.fillStyle = lureGrad;
        sceneCtx.beginPath();
        sceneCtx.arc(g.lureX, g.lureY, glowRadius, 0, Math.PI * 2);
        sceneCtx.fill();
      }

      for (const rp of ripplesRef.current) {
        sceneCtx.globalAlpha = rp.alpha * 0.75;
        sceneCtx.strokeStyle = rp.color;
        sceneCtx.lineWidth = Math.max(cs * 1.3, 12);
        sceneCtx.beginPath();
        sceneCtx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
        sceneCtx.stroke();
      }

      const imgData = sceneCtx.getImageData(0, 0, cols, rows).data;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(gridBackdropCanvas, 0, 0, width, height);

      const gap = cs >= 12 ? 1.5 : 1;
      const fontSize = Math.max(7, Math.floor(cs * 0.86));
      ctx.font = `600 ${fontSize}px "JetBrains Mono", ui-monospace, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let r = 0; r < rows; r++) {
        const py = r * cs;
        const cy = py + cs * 0.5;
        const rowOffset = r * cols;

        for (let c = 0; c < cols; c++) {
          const idx = (rowOffset + c) * 4;
          const a = imgData[idx + 3];
          if (a < 10) continue;

          const red = imgData[idx];
          const green = imgData[idx + 1];
          const blue = imgData[idx + 2];
          const alphaNorm = a / 255;
          const lum = ((0.299 * red + 0.587 * green + 0.114 * blue) / 255) * alphaNorm;
          const px = c * cs;

          const blockAlpha = Math.min(0.42, alphaNorm * 0.34);
          ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${blockAlpha.toFixed(2)})`;
          ctx.fillRect(px, py, cs - gap, cs - gap);

          if (lum > 0.035 || alphaNorm > 0.15) {
            const rampScore = Math.min(1, Math.max(0.08, lum * 0.8 + alphaNorm * 0.35));
            const charIdx = Math.min(
              ACTIVE_RAMP.length - 1,
              Math.max(1, Math.floor(rampScore * (ACTIVE_RAMP.length - 1))),
            );
            const ch = ACTIVE_RAMP[charIdx];

            const charAlpha = Math.min(0.98, 0.28 + alphaNorm * 0.72);
            const boost = 1.18;
            const cr = Math.min(255, Math.round(red * boost));
            const cg = Math.min(255, Math.round(green * boost));
            const cb = Math.min(255, Math.round(blue * boost));

            ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${charAlpha.toFixed(2)})`;
            ctx.fillText(ch, px + cs * 0.5, cy);
          }
        }
      }

      if (
        g.phase === 'casting' ||
        g.phase === 'waiting' ||
        g.phase === 'nibble' ||
        g.phase === 'bite' ||
        g.phase === 'reeling'
      ) {
        const rodX = width * 0.5;
        const rodY = height - 8;
        const bobY =
          g.phase === 'waiting'
            ? Math.sin(elapsed * 2.8) * 3
            : g.phase === 'nibble'
              ? Math.sin(elapsed * 12) * 3.5
              : g.phase === 'bite'
                ? Math.sin(elapsed * 22) * 4.5 + 3
                : 0;

        const lx = g.lureX;
        const ly = g.lureY + bobY;
        const midX = (rodX + lx) * 0.5;
        const slack = g.phase === 'reeling' && g.isPressed ? 6 : 26;
        const midY = (rodY + ly) * 0.5 + slack;

        ctx.save();
        ctx.strokeStyle =
          g.phase === 'reeling' && !g.isInsideBar
            ? 'rgba(251, 146, 60, 0.75)'
            : 'rgba(226, 232, 240, 0.42)';
        ctx.lineWidth = g.phase === 'reeling' ? 1.6 : 1.15;
        ctx.beginPath();
        ctx.moveTo(rodX, rodY);
        ctx.quadraticCurveTo(midX, midY, lx, ly);
        ctx.stroke();

        const bobberColor =
          g.phase === 'bite'
            ? '#FDE047'
            : g.phase === 'nibble'
              ? '#F2C879'
              : g.phase === 'reeling' && !g.isInsideBar
                ? '#FB923C'
                : WATER_COLOR;

        ctx.fillStyle = bobberColor;
        ctx.beginPath();
        ctx.arc(lx, ly, g.phase === 'bite' ? 6.5 : 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = bobberColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(lx, ly, g.phase === 'bite' ? 14 + Math.sin(elapsed * 14) * 3 : 10, 0, Math.PI * 2);
        ctx.stroke();

        if (g.phase === 'bite' || g.phase === 'nibble') {
          const label = g.phase === 'bite' ? tRef.current(ui.zen.biteCanvas) : '···';
          const pillY = Math.max(76, ly - 26);
          ctx.font = '700 13px "JetBrains Mono", ui-monospace, monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = g.phase === 'bite' ? '#FDE047' : 'rgba(226, 232, 240, 0.85)';
          ctx.fillText(label, lx, pillY);
        }

        ctx.restore();
      }

      for (const pp of popupsRef.current) {
        const alpha = clamp(pp.life / pp.maxLife, 0, 1);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '700 18px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillStyle = pp.color;
        ctx.fillText(pp.text, clamp(pp.x, 70, width - 70), pp.y);
        if (pp.subtext) {
          ctx.font = '500 11px ui-sans-serif, system-ui, sans-serif';
          ctx.fillStyle = '#E2E8F0';
          ctx.fillText(pp.subtext, clamp(pp.x, 85, width - 85), pp.y + 18);
        }
        ctx.restore();
      }

      rafId = requestAnimationFrame(renderFrame);
    };

    rafId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [syncHud]);

  const bestCatchName = KOI_VARIETIES.find((v) => v.id === hud.bestCatchId)?.name;
  const activeFish = hud.activeFishIdx >= 0 ? KOI_VARIETIES[hud.activeFishIdx] : null;
  const lastCatchVariety = hud.lastCatch
    ? KOI_VARIETIES.find((v) => v.id === hud.lastCatch?.id)
    : null;

  const hudCard =
    'pointer-events-auto rounded-sm border border-[#e5e2de] bg-[#fffef0]/95 shadow-sm';
  const hudLabel = 'font-mono text-[9px] uppercase tracking-widest text-[#666]';
  const hudValue = 'font-mono text-base font-semibold tabular-nums text-[#1a1a1a] sm:text-lg';

  return (
    <div
      ref={containerRef}
      role="application"
      tabIndex={0}
      aria-label={t(ui.zen.canvasLabel)}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        pointerRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          active: true,
        };
      }}
      onPointerLeave={() => {
        pointerRef.current.active = false;
      }}
      onPointerDown={(e) => {
        const target = e.target as HTMLElement | null;
        if (target?.closest('[data-hud-control]')) return;
        containerRef.current?.focus({ preventScroll: true });
        handleActionDown(e.clientX, e.clientY);
      }}
      className={`relative select-none overflow-hidden touch-none bg-[#123f6b] bg-linear-to-b from-[#1b5486] via-[#123f6b] to-[#0b2849] outline-none focus-visible:ring-2 focus-visible:ring-[#c47a38] ${className}`}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="block h-full w-full cursor-crosshair" />

      <div className="zen-hud pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-wrap items-center justify-between gap-2 p-3 sm:p-5">
        <div
          data-hud-control
          className={`${hudCard} flex items-center gap-3 px-3.5 py-2 sm:gap-5 sm:px-4`}
        >
          <div>
            <div className={hudLabel}>{t(ui.zen.score)}</div>
            <div className={hudValue}>{hud.score}</div>
          </div>

          <div className="h-6 w-px bg-[#e5e2de]" />

          <div>
            <div className="flex items-center gap-1.5">
              <span className={hudLabel}>{t(ui.zen.record)}</span>
              {hud.isNewRecord && (
                <span className="rounded-xs bg-[#a84432]/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-[#a84432]">
                  {t(ui.zen.newRecord)}
                </span>
              )}
            </div>
            <div className={`${hudValue} text-[#a84432]`}>{hud.highScore}</div>
          </div>

          {hud.streak > 1 && (
            <>
              <div className="hidden h-6 w-px bg-[#e5e2de] sm:block" />
              <div className="hidden sm:block">
                <div className={hudLabel}>{t(ui.zen.streak)}</div>
                <div className="font-mono text-sm font-semibold text-[#c47a38]">x{hud.streak}</div>
              </div>
            </>
          )}
        </div>

        <div
          data-hud-control
          className={`${hudCard} flex items-center gap-1.5 px-1.5 py-2 sm:gap-3 sm:px-4`}
        >
          <div className="flex flex-col gap-1" title={t(ui.zen.lures)}>
            <span className={`${hudLabel} text-[8px] sm:text-[9px]`}>
              {t(ui.zen.luresShort)} {hud.luresLeft}/3
            </span>
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((idx) => (
                <span
                  key={idx}
                  aria-hidden="true"
                  className={`inline-block h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                    idx < hud.luresLeft
                      ? 'scale-100 bg-[#c47a38] shadow-[0_0_6px_rgba(196,122,56,0.4)]'
                      : 'scale-75 bg-[#e5e2de]'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="h-8 w-px bg-[#e5e2de]" />

          <div className="flex flex-col gap-1" title={t(ui.zen.species)}>
            <span className={`${hudLabel} whitespace-nowrap text-[8px] sm:text-[9px]`}>
              {t(ui.zen.speciesShort)} {hud.discoveredIds.length}/{KOI_VARIETIES.length}
            </span>
            <div className="flex items-center gap-1 sm:gap-1.5">
              {KOI_VARIETIES.map((v) => {
                const found = hud.discoveredIds.includes(v.id);
                const label = `${v.name} — ${
                  found ? t(ui.zen.speciesFound) : t(ui.zen.speciesHidden)
                }`;
                return (
                  <img
                    key={v.id}
                    src={v.sprite}
                    width={24}
                    height={24}
                    alt={label}
                    title={label}
                    className={`h-4 w-4 rounded-xs object-contain transition-all duration-300 sm:h-6 sm:w-6 ${
                      found ? 'opacity-100' : 'opacity-25 grayscale'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetClick}
            className="rounded-xs border border-[#e5e2de] px-1 py-1 font-mono text-[8px] font-semibold uppercase tracking-widest text-[#a84432] transition hover:bg-[#f9f7f2] active:scale-95 sm:ml-1 sm:px-2 sm:text-[9px]"
          >
            {t(ui.zen.reset)}
          </button>
        </div>
      </div>

      {hud.phase === 'reeling' && (
        <div className="zen-reel-panel pointer-events-none absolute right-3 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-2 sm:right-8">
          {hud.isPerfect && (
            <div className="rounded-xs border border-[#c47a38]/40 bg-[#fff8e7] px-2.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-[#8a5a1f] shadow-sm">
              {t(ui.zen.perfect)}
            </div>
          )}

          <div className={`${hudCard} flex items-stretch gap-2 rounded-sm p-2.5 shadow-md`}>
            <div className="flex flex-col items-center gap-1">
              <span className={`zen-reel-label ${hudLabel}`}>{t(ui.zen.greenZone)}</span>
              <div
                role="img"
                aria-label={t(ui.zen.reelBarLabel)}
                className="zen-reel-track relative h-48 w-8 overflow-hidden rounded-xs border border-[#e5e2de] bg-[#0b2849]/80 sm:h-60 sm:w-9"
              >
                <div
                  ref={greenBarRef}
                  style={{ bottom: '18%', height: '30%' }}
                  className={`absolute inset-x-0.5 rounded-xs border transition-colors duration-100 ${
                    hud.isInsideBar
                      ? 'border-[#6f8f83] bg-[#8fb7a6]/70'
                      : 'border-[#6f8f83]/50 bg-[#8fb7a6]/30'
                  }`}
                />
                <div
                  ref={fishMarkerRef}
                  style={{ bottom: 'calc(33% - 10px)' }}
                  className="absolute inset-x-0 flex h-5 items-center justify-center"
                >
                  <span
                    aria-hidden="true"
                    style={{ backgroundColor: activeFish?.accentColor ?? '#c47a38' }}
                    className="flex h-4 w-5 items-center justify-center rounded-full border border-[#fffef0]/80 font-mono text-[9px] font-bold text-[#1a1a1a] shadow-sm"
                  >
                    ◈
                  </span>
                </div>
              </div>
              <span className={`zen-reel-label ${hudLabel}`}>{t(ui.zen.fishMarker)}</span>
            </div>

            <div className="flex w-12 flex-col items-center gap-1 sm:w-14">
              <span className={`zen-reel-label ${hudLabel}`}>{t(ui.zen.catchProgress)}</span>
              <div className="zen-reel-track relative h-48 w-3 overflow-hidden rounded-full bg-[#e5e2de] sm:h-60">
                <div
                  ref={progressFillRef}
                  style={{ height: '32%' }}
                  className="absolute inset-x-0 bottom-0 rounded-full bg-linear-to-t from-[#a84432] via-[#c47a38] to-[#6f8f83]"
                />
              </div>
              <span
                aria-hidden="true"
                className={`font-mono text-[10px] font-semibold ${
                  hud.isInsideBar ? 'text-[#6f8f83]' : 'text-[#a84432]'
                }`}
              >
                {hud.isInsideBar ? '↑' : '↓'}
              </span>
            </div>
          </div>

          {activeFish && (
            <div
              className={`zen-reel-label ${hudCard} rounded-xs px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#666]`}
            >
              {t(ui.zen[BEHAVIOR_LABELS[activeFish.behavior]])}
            </div>
          )}
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex flex-col items-center gap-2 px-4 sm:bottom-6">
        {hud.lastCatch && hud.phase !== 'reeling' && (
          <div
            className={`${hudCard} flex items-center gap-2 rounded-sm px-3.5 py-1.5 text-xs text-[#1a1a1a]`}
          >
            {lastCatchVariety && (
              <img
                src={lastCatchVariety.sprite}
                width={32}
                height={32}
                alt=""
                aria-hidden="true"
                className="h-8 w-8 shrink-0 rounded-xs object-contain"
              />
            )}
            <span className="font-medium">
              {t(ui.zen.caughtPrefix)} {hud.lastCatch.name}
            </span>
            <span className="text-[#666]">
              · {t(ui.zen[SIZE_TIER_KEYS[hud.lastCatch.sizeKey]])}
            </span>
            <span className="font-mono font-semibold text-[#a84432]">+{hud.lastCatch.points}</span>
            {hud.lastCatch.wasPerfect && (
              <span className="rounded-xs bg-[#c47a38]/15 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-[#8a5a1f]">
                {t(ui.zen.perfectShort)}
              </span>
            )}
          </div>
        )}

        {hud.notice && hud.phase !== 'reeling' && (
          <div
            className={`${hudCard} rounded-sm px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[#1a1a1a]`}
          >
            {hud.notice}
          </div>
        )}

        {hud.phase === 'reeling' ? (
          <div
            className={`zen-action-hint ${hudCard} rounded-sm px-4 py-1.5 text-center font-mono text-[10px] uppercase tracking-wider text-[#1a1a1a]`}
          >
            {t(ui.zen.reelingHint)}
          </div>
        ) : (
          hud.phase !== 'gameover' && (
            <div
              className={`zen-action-hint ${hudCard} rounded-sm px-4 py-1.5 text-center font-mono text-[10px] uppercase tracking-wider text-[#1a1a1a]`}
            >
              {hud.phase === 'idle' && t(ui.zen.idle)}
              {hud.phase === 'casting' && t(ui.zen.casting)}
              {hud.phase === 'waiting' && t(ui.zen.waiting)}
              {hud.phase === 'nibble' && t(ui.zen.nibble)}
              {hud.phase === 'bite' && (
                <span className="font-semibold text-[#a84432]">{t(ui.zen.bite)}</span>
              )}
            </div>
          )
        )}
      </div>

      {hud.phase === 'gameover' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0b2849]/65 p-4 backdrop-blur-sm">
          <div
            data-hud-control
            className="w-full max-w-sm rounded-sm border border-[#e5e2de] bg-[#fffef0] p-6 text-center text-[#1a1a1a] shadow-xl"
          >
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#a84432]">
              {t(ui.zen.session)}
            </div>
            <h2 className="mt-1 text-serif text-2xl font-light">
              {hud.isNewRecord
                ? t(ui.zen.newRecordTitle)
                : hud.score > 0
                  ? t(ui.zen.congratsTitle)
                  : t(ui.zen.zeroTitle)}
            </h2>
            <p className="mx-auto mt-2 max-w-[17rem] text-xs leading-relaxed text-[#555]">
              {hud.score > 0
                ? t(ui.zen.congratsScore).replace('{score}', String(hud.score))
                : t(ui.zen.zeroScore)}{' '}
              {hud.isNewRecord && t(ui.zen.congratsRecord)}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 text-left">
              <div className="rounded-xs border border-[#e5e2de] bg-[#f9f7f2] p-3">
                <div className={hudLabel}>{t(ui.zen.pointsShort)}</div>
                <div className="font-mono text-xl font-semibold">{hud.score}</div>
              </div>
              <div className="rounded-xs border border-[#e5e2de] bg-[#f9f7f2] p-3">
                <div className={hudLabel}>{t(ui.zen.bestRecord)}</div>
                <div className="font-mono text-xl font-semibold text-[#a84432]">
                  {hud.highScore}
                </div>
              </div>
              <div className="rounded-xs border border-[#e5e2de] bg-[#f9f7f2] p-3">
                <div className={hudLabel}>{t(ui.zen.caught)}</div>
                <div className="font-mono text-lg font-medium">{hud.caughtCount}</div>
              </div>
              <div className="rounded-xs border border-[#e5e2de] bg-[#f9f7f2] p-3">
                <div className={hudLabel}>{t(ui.zen.speciesShort)}</div>
                <div className="font-mono text-lg font-medium">
                  {hud.discoveredIds.length}/{KOI_VARIETIES.length}
                </div>
              </div>
            </div>

            {bestCatchName && hud.bestCatchTier && (
              <p className="mt-3 text-xs text-[#555]">
                {t(ui.zen.bestCatchEver)}{' '}
                <span className="font-medium text-[#1a1a1a]">
                  {bestCatchName} ({t(ui.zen[SIZE_TIER_KEYS[hud.bestCatchTier]])})
                </span>{' '}
                ({hud.bestCatchPoints} pts)
              </p>
            )}

            <button
              type="button"
              onClick={handleResetClick}
              className="mt-5 w-full rounded-sm bg-[#a84432] px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#fffef0] transition hover:bg-[#8f3829] active:scale-95"
            >
              {t(ui.zen.playAgain)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
