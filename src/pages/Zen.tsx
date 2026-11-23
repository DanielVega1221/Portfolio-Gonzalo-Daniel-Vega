import { lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { KOI_VARIETIES, type KoiBehavior } from '../data/koi';
import { useLanguage, localizePath } from '../i18n/useLanguage';
import { useT } from '../i18n/useT';
import { ui } from '../i18n/translations';

const KoiFishingGame = lazy(() => import('../components/KoiFishingGame'));

const BEHAVIOR_LABELS: Record<KoiBehavior, keyof typeof ui.zen> = {
  calm: 'behaviorCalm',
  smooth: 'behaviorSmooth',
  riser: 'behaviorRiser',
  dart: 'behaviorDart',
};

export default function Zen() {
  const t = useT();
  const { lang } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="zen-page max-w-6xl mx-auto px-6 py-12 md:py-16 space-y-12"
    >
      <header className="zen-header space-y-5">
        <p className="font-mono text-xs uppercase tracking-widest text-[#a84432] font-bold">
          {t(ui.zen.chapter)}
        </p>
        <h1 className="text-serif text-4xl sm:text-5xl font-light text-[#1a1a1a] tracking-tight leading-[1.1]">
          {t(ui.zen.title)}
        </h1>
      </header>

      <section
        aria-label={t(ui.zen.pondLabel)}
        className="rounded-sm border border-[#e5e2de] bg-[#fffef0] shadow-xs overflow-hidden"
      >
        <div className="zen-pond h-[min(70vh,640px)] min-h-[420px] w-full">
          <Suspense
            fallback={
              <div className="h-full w-full bg-[#123f6b] flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-[#c47a38] border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <KoiFishingGame className="h-full w-full" />
          </Suspense>
        </div>

        <p className="zen-keyboard-hint border-t border-[#e5e2de] px-4 py-3 font-mono text-[10px] text-[#777] tracking-wide">
          {t(ui.zen.keyboard)}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-mono text-[11px] text-[#a84432] font-bold uppercase tracking-widest">
          {t(ui.zen.controlsTitle)}
        </h2>
        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[ui.zen.control1, ui.zen.control2, ui.zen.control3, ui.zen.control4].map((step, i) => (
            <li key={i} className="bg-[#fffef0] border border-[#e5e2de] p-5 rounded-xs space-y-2">
              <span className="font-mono text-[10px] text-[#a84432] font-semibold">0{i + 1}</span>
              <p className="text-sm text-[#333] font-light leading-relaxed">{t(step)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="font-mono text-[11px] text-[#a84432] font-bold uppercase tracking-widest">
          {t(ui.zen.valuesTitle)}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-sm border border-[#e5e2de] bg-[#e5e2de]">
          {KOI_VARIETIES.map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between gap-3 bg-[#fffef0] px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-2">
                <img
                  src={v.sprite}
                  width={24}
                  height={24}
                  alt=""
                  aria-hidden="true"
                  className="h-6 w-6 shrink-0 rounded-xs object-contain"
                />
                <div className="min-w-0">
                  <span className="block truncate text-xs text-[#333]">{v.name}</span>
                  <span className="block font-mono text-[9px] uppercase tracking-wider text-[#777]">
                    {t(ui.zen[BEHAVIOR_LABELS[v.behavior]])}
                  </span>
                </div>
              </div>
              <span className="font-mono text-xs font-semibold tabular-nums text-[#a84432]">
                {v.basePoints} <span className="text-[9px] text-[#777]">pts</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#1a1a1a]/10 pt-6 flex flex-wrap gap-6 font-mono text-xs text-[#666]">
        <Link
          to={localizePath('/proyectos', lang)}
          className="hover:text-[#a84432] transition-colors"
        >
          → {t(ui.zen.backProjects)}
        </Link>
        <Link
          to={localizePath('/dialogo', lang)}
          className="hover:text-[#a84432] transition-colors"
        >
          → {t(ui.nav.contact)}
        </Link>
      </footer>
    </motion.div>
  );
}
