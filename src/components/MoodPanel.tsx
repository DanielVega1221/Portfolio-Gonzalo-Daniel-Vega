import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useT } from '../i18n/useT';
import { ui } from '../i18n/translations';
import { useMood } from '../lib/mood/context';
import { MOOD_MODES } from '../lib/mood/presets';
import type { MoodMode } from '../lib/mood/types';
import { useFocusTrap } from '../lib/useFocusTrap';

const MODE_LABELS: Record<MoodMode, keyof typeof ui.mood> = {
  butterflies: 'butterflies',
  koi: 'koi',
  none: 'none',
};

const MODE_HINTS: Record<MoodMode, keyof typeof ui.mood> = {
  butterflies: 'butterfliesHint',
  koi: 'koiHint',
  none: 'noneHint',
};

const MODE_DOTS: Record<MoodMode, string> = {
  butterflies: 'bg-[#a84432]',
  koi: 'bg-[#c47a38]',
  none: 'bg-[#cbc8bf]',
};

const MODE_ACTIVE: Record<MoodMode, string> = {
  butterflies: 'border-[#a84432] bg-[#a84432]/10 text-[#a84432]',
  koi: 'border-[#c47a38] bg-[#c47a38]/12 text-[#9a5a22]',
  none: 'border-[#cbc8bf] bg-[#cbc8bf]/25 text-[#4a4844]',
};

export default function MoodPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const t = useT();
  const { mode, setMode } = useMood();

  useFocusTrap(panelRef, isOpen);

  const closePanel = useCallback(() => {
    window.dispatchEvent(new Event('gdv:mood-close'));
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('gdv:tapes-open', closePanel);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('gdv:tapes-open', closePanel);
    };
  }, [isOpen, closePanel]);

  const togglePanel = () => {
    if (isOpen) {
      closePanel();
      return;
    }
    window.dispatchEvent(new Event('gdv:mood-open'));
    setIsOpen(true);
  };

  return (
    <>
      <div className="fixed bottom-[4.75rem] right-4 md:bottom-[5.5rem] md:right-6 z-50">
        <button
          type="button"
          onClick={togglePanel}
          aria-label={t(ui.mood.ariaLabel)}
          aria-expanded={isOpen}
          aria-controls="mood-panel"
          id="mood-trigger"
          className="flex items-center gap-2 bg-[#f9f7f2] hover:bg-[#fffef0] border border-[#e5e2de] hover:border-[#a84432]/40 px-2.5 md:px-3.5 py-2 md:py-2.5 rounded-sm shadow-xs transition-all duration-300"
        >
          <span className="w-2 h-2 rounded-full bg-[#c47a38]" aria-hidden="true" />
          <span className="font-mono text-[9px] md:text-[10px] tracking-widest text-[#1a1a1a] font-medium">
            {t(ui.mood.label)}
          </span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mood-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closePanel}
            className="fixed inset-0 z-40 bg-[#1a1a1a]/10"
            aria-hidden="true"
          />
        )}
        {isOpen && (
          <motion.div
            key="mood-panel"
            ref={panelRef}
            id="mood-panel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: 'transform, opacity' }}
            role="dialog"
            aria-modal="true"
            aria-label={t(ui.mood.title)}
            data-interactive-surface
            className="fixed bottom-[8.5rem] right-4 md:bottom-[9.5rem] md:right-6 z-50 w-[min(92vw,20rem)] max-h-[min(65vh,26rem)] overflow-y-auto bg-[#f9f7f2] border border-[#e5e2de] rounded-sm shadow-xl"
          >
            <div className="h-1 bg-gradient-to-r from-[#a84432] via-[#c47a38] to-[#cbc8bf]" />
            <div className="p-3 md:p-4 space-y-4">
              <div className="flex items-start justify-between gap-3 border-b border-[#1a1a1a]/10 pb-2">
                <div className="space-y-0.5">
                  <h2 className="font-serif text-base font-light tracking-tight text-[#1a1a1a]">
                    {t(ui.mood.title)}
                  </h2>
                  <p className="font-mono text-[8px] text-[#777] uppercase tracking-widest">
                    {t(ui.mood.subtitle)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closePanel}
                  aria-label={t(ui.a11y.close)}
                  className="w-5 h-5 shrink-0 rounded-full border border-[#1a1a1a]/10 flex items-center justify-center text-[#666] hover:text-[#1a1a1a] hover:bg-[#1a1a1a]/5 text-[9px] transition-all"
                >
                  ✕
                </button>
              </div>

              <section className="space-y-2">
                <h3 className="font-mono text-[9px] text-[#a84432] font-semibold tracking-wider uppercase">
                  {t(ui.mood.options)}
                </h3>
                <div className="space-y-2">
                  {MOOD_MODES.map((option) => {
                    const isActive = mode === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setMode(option)}
                        aria-pressed={isActive}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm border text-left transition-all ${
                          isActive
                            ? MODE_ACTIVE[option]
                            : 'bg-[#fffef0] border-[#e5e2de] text-[#1a1a1a] hover:border-[#a84432]/40'
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 shrink-0 rounded-full ${MODE_DOTS[option]}`} aria-hidden="true" />
                        <span className="min-w-0">
                          <span className="block font-serif text-sm leading-none">
                            {t(ui.mood[MODE_LABELS[option]])}
                          </span>
                          <span className={`block mt-1 font-mono text-[8px] leading-none tracking-wide ${isActive ? 'opacity-70' : 'text-[#888]'}`}>
                            {t(ui.mood[MODE_HINTS[option]])}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
