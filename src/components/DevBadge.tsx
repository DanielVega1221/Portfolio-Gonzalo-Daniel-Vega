import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useReducedMotion } from 'motion/react';
import QRCode from 'qrcode';
import {
  MapPin,
  Briefcase,
  Linkedin,
  Mail,
  Check,
  ExternalLink,
  Download,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { useT } from '../i18n/useT';
import { ui } from '../i18n/translations';

export interface DevBadgeProfile {
  name: string;
  role: string;
  company: string;
  location: string;
  isOpenToWork: boolean;
  avatarUrl: string;
  shortQuote: string;
  /** Absolute URL: a QR code is useless to a phone if the link is relative. */
  resumeUrl: string;
  linkedin?: string;
  email?: string;
}

export interface DevBadgeProps {
  profile: DevBadgeProfile;
  lanyardColor?: string;
  lanyardLength?: number;
  lanyardText?: string;
  allowShake?: boolean;
}

// 2.25in x 3.5in is the real conference badge ratio.
const CARD = 'w-64 h-[400px]';
const RADIUS = 'rounded-[10px]';
const CARD_FACE = `absolute inset-0 w-full h-full ${RADIUS} border border-[#ded9cf] overflow-hidden text-[#1a1a1a] shadow-[0_1px_1px_rgba(26,26,26,0.05),0_6px_12px_-4px_rgba(26,26,26,0.13),0_18px_30px_-14px_rgba(26,26,26,0.20)] transition-shadow duration-300 hover:shadow-[0_1px_1px_rgba(26,26,26,0.06),0_10px_18px_-6px_rgba(26,26,26,0.18),0_26px_40px_-16px_rgba(26,26,26,0.24)]`;
// The slot is a die-cut: it shows the page paper, not a drawn hole.
const SLOT =
  'absolute top-2 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full bg-[#f7f4ec] border border-[#1a1a1a]/10 shadow-[inset_0_1.5px_2px_rgba(26,26,26,0.16),0_1px_0_rgba(255,255,255,0.9)] flex items-center justify-center pointer-events-none z-30';
const HEADER =
  'px-2.5 pt-3 pb-2 flex items-center justify-between bg-[#faf7ec] border-b border-[#1a1a1a]/10 shrink-0';
// Every tone below already exists somewhere in the site palette.
const METAL = 'bg-linear-to-b from-[#efece7] via-[#cfcbc2] to-[#9d998f]';
const METAL_RING =
  'rounded-full border border-[#a9a59b] bg-linear-to-b from-[#f2efea] via-[#d3cfc6] to-[#a5a199] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(26,26,26,0.25)]';
// Paper grain: one tiled fractal-noise SVG, multiplied over the print.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23g)'/%3E%3C/svg%3E\")";
const WEAVE = `repeating-linear-gradient(90deg, rgba(255,255,255,0.10) 0 1px, rgba(255,255,255,0) 1px 3px), repeating-linear-gradient(0deg, rgba(0,0,0,0.09) 0 1px, rgba(0,0,0,0) 1px 3px), linear-gradient(90deg, rgba(0,0,0,0.16) 0%, rgba(255,255,255,0.10) 34%, rgba(255,255,255,0.10) 66%, rgba(0,0,0,0.16) 100%)`;
const STRAP_SHADOW = `inset ${'7px'} 0 9px -7px rgba(26,26,26,0.55), inset -7px 0 9px -7px rgba(26,26,26,0.55), inset 0 0 0 1px rgba(26,26,26,0.18)`;
const BARCODE = '1101001000010110110010101101011100101101001';

function Barcode({ className = '' }: { className?: string }) {
  return (
    <svg viewBox={`0 0 ${BARCODE.length} 24`} preserveAspectRatio="none" className={className} aria-hidden="true">
      {BARCODE.split('').map((bit, i) =>
        bit === '1' ? <rect key={i} x={i} y={0} width={1} height={24} fill="#1a1a1a" /> : null
      )}
    </svg>
  );
}

/**
 * Interactive conference badge: photo + identity on the front, resume QR +
 * LinkedIn + email on the back. Click the card to flip it, click the lanyard to
 * shake it. Materials are drawn, not photographed: grain, lamination edge,
 * woven strap and brushed metal.
 */
export default function DevBadge({
  profile,
  lanyardColor = '#a84432',
  lanyardLength = 110,
  lanyardText,
  allowShake = true,
}: DevBadgeProps) {
  const t = useT();
  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [qrSvg, setQrSvg] = useState<string | null>(null);

  const copyTimerRef = useRef<number | null>(null);

  const prefersReducedMotion = useReducedMotion();
  const lanyardControls = useAnimation();
  const cardControls = useAnimation();

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  // Entrance swing. Kept subtle so the prerendered HTML never captures a badge
  // that is far out of place.
  useEffect(() => {
    if (prefersReducedMotion) return;

    lanyardControls.set({ y: -24, rotate: -6 });
    cardControls.set({ rotate: -7 });

    lanyardControls.start({
      y: [-24, 10, -5, 2, 0],
      rotate: [-6, 5, -3, 1.5, 0],
      transition: { duration: 1.5, ease: 'easeOut' },
    });

    cardControls.start({
      rotate: [-7, 4, -2, 1, 0],
      transition: { duration: 1.6, ease: 'easeOut' },
    });
  }, [prefersReducedMotion, lanyardControls, cardControls]);

  useEffect(() => {
    let active = true;

    QRCode.toString(profile.resumeUrl, {
      type: 'svg',
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#1a1a1a', light: '#ffffff' },
    })
      .then((svg) => {
        if (active) setQrSvg(svg);
      })
      .catch(() => {
        if (active) setQrSvg(null);
      });

    return () => {
      active = false;
    };
  }, [profile.resumeUrl]);

  const shake = () => {
    if (prefersReducedMotion || !allowShake) return;

    lanyardControls.start({
      rotate: [0, -8, 5.5, -2.5, 1, 0],
      transition: { duration: 0.9, ease: 'easeOut' },
    });
    cardControls.start({
      rotate: [0, 4.5, -2.5, 1.2, 0],
      transition: { duration: 1.1, ease: 'easeOut' },
    });
  };

  const toggleFlip = () => {
    setIsFlipped((flipped) => !flipped);
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profile.email) return;

    navigator.clipboard?.writeText(profile.email).catch(() => {});
    setCopiedEmail(true);
    if (copyTimerRef.current !== null) {
      window.clearTimeout(copyTimerRef.current);
    }
    copyTimerRef.current = window.setTimeout(() => setCopiedEmail(false), 2000);
  };

  const grain = <div className={`absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-multiply`} style={{ backgroundImage: GRAIN }} />;
  // Lamination edge: a hairline of light just inside the trim.
  const laminate = <div className={`absolute inset-0 ${RADIUS} shadow-[inset_0_0_0_1px_rgba(255,255,255,0.75)] pointer-events-none z-20`} />;
  // The strap drops a soft shadow on the top of the credential.
  const castShadow = (
    <div
      className="absolute inset-x-0 top-0 h-8 pointer-events-none z-20"
      style={{ background: 'linear-gradient(to bottom, rgba(26,26,26,0.16), rgba(26,26,26,0))' }}
    />
  );

  return (
    <div className="relative flex flex-col items-center select-none w-full max-w-xs mx-auto">
      {/* 1. PENDULUM NODE */}
      <motion.div animate={lanyardControls} style={{ transformOrigin: 'top center' }} className="flex flex-col items-center relative">
        {/* Strap: click to shake */}
        <div
          role="button"
          tabIndex={0}
          aria-label={t(ui.badge.shakeAria)}
          onClick={shake}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              shake();
            }
          }}
          className="flex flex-col items-center rounded-t-sm -mt-2 pt-2 cursor-pointer outline-offset-4"
        >
          {/* Eyelet: the ring the strap is folded through */}
          <div className={`w-7 h-7 ${METAL_RING} flex items-center justify-center -mb-0.5`}>
            <div className="w-3.5 h-3.5 rounded-full bg-[#f3f0ea] shadow-[inset_0_1px_2px_rgba(26,26,26,0.3)]" />
          </div>

          {/* Ribbon with a woven texture and shaded edges */}
          <div style={{ height: `${lanyardLength}px` }} className="w-11 relative flex justify-center">
            <div
              style={{ height: `${lanyardLength}px`, backgroundColor: lanyardColor, backgroundImage: WEAVE, boxShadow: STRAP_SHADOW }}
              className="w-10 absolute rounded-xs flex items-center justify-center overflow-hidden shadow-[3px_3px_8px_-2px_rgba(26,26,26,0.45)]"
            >
              <div className="text-[7px] tracking-[0.26em] font-mono uppercase text-[#fffef0]/90 whitespace-nowrap rotate-90">
                {lanyardText ?? t(ui.badge.lanyardText)}
              </div>
            </div>
          </div>

          {/* Clasp: the credential overlaps its lower third, the slot stays visible */}
          <div className={`w-11 h-3.5 ${METAL} rounded-b-sm border border-[#a9a59b] border-t-0 flex items-start justify-center -mt-0.5`}>
            <div className="w-6 h-1 rounded-full bg-[#8f8b81] shadow-[inset_0_1px_1px_rgba(26,26,26,0.4),0_1px_0_rgba(255,255,255,0.65)]" />
          </div>
          <div className="h-1.5" aria-hidden="true" />
        </div>

        {/* 2. INTERACTIVE CREDENTIAL */}
        <motion.div
          animate={cardControls}
          // preserve-3d hands the parent's perspective down to the flipping card,
          // so it foreshortens like a real badge instead of turning flat.
          style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
          className="relative -mt-3 z-20"
        >
          <div
            tabIndex={0}
            role="button"
            aria-pressed={isFlipped}
            aria-label={t(ui.badge.flipAria)}
            onClick={toggleFlip}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                toggleFlip();
              }
            }}
            className={`${CARD} cursor-pointer relative ${RADIUS}`}
            style={{ perspective: '1400px' }}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformStyle: 'preserve-3d', transformOrigin: 'top center' }}
              className="w-full h-full relative"
            >
              {/* FRONT: photo to the edges, gradient into the paper */}
              <div style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }} className={`${CARD_FACE} flex flex-col`}>
                <div className={SLOT} />
                {castShadow}
                {grain}
                {laminate}

                {/* Header */}
                <div className={HEADER}>
                  <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-[#a84432] font-bold uppercase">
                    
                    <span>{t(ui.badge.headerLabel)}</span>
                  </div>
                  {profile.isOpenToWork && (
                    <div className="flex items-center gap-1 font-mono text-[9.5px] pl-1.5 pr-1.5 py-0.5 rounded-full border border-emerald-600/30 bg-emerald-50 text-emerald-800 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_1.5px_rgba(16,185,129,0.18)]" />
                      <span>{t(ui.badge.openToWork)}</span>
                    </div>
                  )}
                </div>

                {/* Photo */}
                <div className="relative w-full h-[230px] shrink-0 overflow-hidden bg-[#efede8]">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    width={400}
                    height={360}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 pointer-events-none mix-blend-soft-light" style={{ background: 'linear-gradient(160deg, #fff4d6 0%, #ffffff 45%, #3a3026 100%)', opacity: 0.4 }} />
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(120% 90% at 50% 30%, rgba(26,26,26,0) 55%, rgba(26,26,26,0.16) 100%)' }} />
                  <div
                    className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(to bottom, transparent 0%, rgba(255,254,240,0.25) 30%, rgba(255,254,240,0.75) 62%, #fffef0 100%)',
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-px bg-[#1a1a1a]/10" />
                </div>

                {/* Identity */}
                <div className="px-4 pb-2.5 -mt-6 flex-1 flex flex-col justify-between relative">
                  <div className="text-center space-y-1">
                    <h3 className="text-serif text-[22px] font-light tracking-tight text-[#1a1a1a] leading-none pt-1">
                      {profile.name}
                    </h3>
                    <p className="flex items-center justify-center gap-1.5 text-[10px] font-mono font-semibold text-[#a84432] uppercase tracking-wider">
                      <span className="h-px w-4 bg-[#a84432]/30" />
                      {profile.role}
                      <span className="h-px w-4 bg-[#a84432]/30" />
                    </p>
                    <div className="flex items-center justify-center gap-1.5 text-[9.5px] font-mono text-[#6b6862] tracking-wide">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-2.5 h-2.5 shrink-0 text-[#a8a49b]" />
                        {profile.company}
                      </span>
                      <span className="text-[#cbc8bf]">|</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 shrink-0 text-[#a8a49b]" />
                        {profile.location}
                      </span>
                    </div>
                  </div>

                  {/* Echoes the pull-quote treatment used on the page */}
                  <p className="my-1 pl-2.5 border-l-2 border-[#a84432] text-center font-serif text-[10.5px] italic leading-snug text-[#2a2a2a] text-pretty">
                    "{profile.shortQuote}"
                  </p>

                  <div className="pt-1.5 border-t border-[#1a1a1a]/10 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-[8px] font-mono text-[#9a968c] tracking-[0.14em] uppercase">
                      <Barcode className="h-3 w-14" />
                    </span>
                    <p className="flex items-center gap-1.5 text-[9.5px] font-mono text-[#a84432] whitespace-nowrap">
                      <RefreshCw className="w-2.5 h-2.5 opacity-70" />
                      {isFlipped ? t(ui.badge.flipBack) : t(ui.badge.flipFront)}
                    </p>
                  </div>
                </div>
              </div>

              {/* BACK: resume QR + LinkedIn + email */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
                className={`${CARD_FACE} flex flex-col p-4`}
              >
                <div className={SLOT} />
                {castShadow}
                {grain}
                {laminate}

                <div className={`${HEADER} pt-4`}>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#a84432] font-bold uppercase">
                    <FileText className="w-3 h-3 shrink-0" />
                    <span className="whitespace-nowrap">{t(ui.badge.cvTitle)}</span>
                  </div>
                  <span className="text-[9px] font-mono text-[#8a8680] whitespace-nowrap">{t(ui.badge.scanLabel)}</span>
                </div>

                {/* QR on a printed plate: the server sends Content-Disposition, so it downloads */}
                <div className="flex-1 flex flex-col items-center justify-center gap-2 pt-3">
                  <a
                    href={profile.resumeUrl}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2.5 bg-white rounded-sm border border-[#e5e2de] shadow-[0_1px_2px_rgba(26,26,26,0.06),0_6px_14px_-6px_rgba(26,26,26,0.16)] hover:border-[#a84432] transition-colors"
                    aria-label={t(ui.badge.openResume)}
                  >
                    {qrSvg ? (
                      <span
                        className="block w-[100px] h-[100px] [&>svg]:w-full [&>svg]:h-full"
                        dangerouslySetInnerHTML={{ __html: qrSvg }}
                      />
                    ) : (
                      <span className="block w-[100px] h-[100px]" />
                    )}
                  </a>
                  <a
                    href={profile.resumeUrl}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-[9.5px] font-mono font-medium text-[#a84432] hover:underline"
                  >
                    {t(ui.badge.openResume)}
                    <Download className="w-2.5 h-2.5" />
                  </a>
                </div>

                {/* Direct actions: stopPropagation so the badge does not flip */}
                <div className="space-y-1.5">
                  {profile.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-full flex items-center gap-2 py-1.5 px-2.5 bg-white/70 border border-[#e5e2de] hover:border-[#a84432] text-[#1a1a1a] rounded-xs transition-colors"
                    >
                      <Linkedin className="w-3.5 h-3.5 shrink-0 text-[#555]" />
                      <span className="text-[8px] font-mono text-[#9a968c] uppercase tracking-[0.14em] shrink-0">
                        {t(ui.badge.linkedinLabel)}
                      </span>
                      <span className="text-[10px] font-mono font-medium truncate">{t(ui.badge.linkedinCta)}</span>
                      <ExternalLink className="w-2.5 h-2.5 shrink-0 text-[#cbc8bf] ml-auto" />
                    </a>
                  )}

                  {profile.email && (
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="w-full flex items-center gap-2 py-1.5 px-2.5 bg-white/70 border border-[#e5e2de] hover:border-[#a84432] text-[#1a1a1a] rounded-xs transition-colors cursor-pointer"
                    >
                      {copiedEmail ? (
                        <Check className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                      ) : (
                        <Mail className="w-3.5 h-3.5 shrink-0 text-[#a84432]" />
                      )}
                      <span className="text-[8px] font-mono text-[#9a968c] uppercase tracking-[0.14em] shrink-0">
                        {t(ui.badge.emailLabel)}
                      </span>
                      <span className="text-[10px] font-mono text-[#555] truncate">
                        {copiedEmail ? t(ui.badge.copiedEmail) : profile.email}
                      </span>
                      <span className="text-[8px] font-mono text-[#a84432] bg-[#a84432]/10 px-1.5 py-0.5 rounded-xs ml-auto shrink-0">
                        {t(ui.badge.copyEmail)}
                      </span>
                    </button>
                  )}
                </div>

                <div className="mt-2.5 pt-1.5 border-t border-[#1a1a1a]/10 flex items-center justify-between gap-2">
                  <Barcode className="h-4 w-24" />
                  <p className="flex items-center gap-1.5 text-[9.5px] font-mono text-[#a84432] whitespace-nowrap">
                    <RefreshCw className="w-2.5 h-2.5 opacity-70" />
                    {t(ui.badge.flipBack)}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
