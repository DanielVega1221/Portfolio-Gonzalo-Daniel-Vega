import { lazy, Suspense, useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useLanguage, localizePath } from '../i18n/useLanguage';
import { useT } from '../i18n/useT';
import { ui } from '../i18n/translations';
import { useMood } from '../lib/mood/context';
import { AsciiButterflyBackground } from './AsciiButterflyBackground';
import type { ButterflySpecies, WildlifeCreature } from '../lib/mood/types';
import { profile } from '../data/profile';
import { Library, Layers, BookOpen, User, Mail, Menu, X } from 'lucide-react';

const StudioTapes = lazy(() => import('./StudioTapes'));
const MoodPanel = lazy(() => import('./MoodPanel'));

/** Fijos: MOOD ya no expone parámetros, solo elige el ecosistema. */
const ATMOSPHERE_SETTINGS: Record<
  WildlifeCreature,
  {
    count: number;
    compactCount: number;
    speed: number;
    scale: number;
    species: ButterflySpecies;
  }
> = {
  // Un 8% más lento que antes; en mobile se reduce el número de entidades.
  butterflies: { count: 10, compactCount: 3, speed: 0.92, scale: 1, species: 'mixed' },
  koi: { count: 10, compactCount: 2, speed: 0.78, scale: 1.05, species: 'mixed' },
  hummingbirds: { count: 9, compactCount: 3, speed: 1.05, scale: 0.95, species: 'mixed' },
  petals: { count: 14, compactCount: 5, speed: 0.8, scale: 1, species: 'mixed' },
  comets: { count: 9, compactCount: 3, speed: 1.15, scale: 1, species: 'mixed' },
  turtles: { count: 7, compactCount: 2, speed: 0.62, scale: 1.05, species: 'mixed' },
  rain: { count: 18, compactCount: 7, speed: 1.1, scale: 1, species: 'mixed' },
  snow: { count: 16, compactCount: 6, speed: 0.8, scale: 1, species: 'mixed' },
  jellyfish: { count: 8, compactCount: 3, speed: 0.7, scale: 1, species: 'mixed' },
};

const NORMAL_FPS = 30;
const OVERLAY_FPS = 18;
const RESUME_DELAY_MS = 260;

export default function Layout() {
  const location = useLocation();
  const { lang, toggleLang } = useLanguage();
  const t = useT();
  const { mode } = useMood();

  const navItems = [
    { path: '/', label: t(ui.nav.home), icon: BookOpen },
    { path: '/proyectos', label: t(ui.nav.projects), icon: Layers },
    { path: '/journal', label: t(ui.nav.journal), icon: Library },
    { path: '/sobre-mi', label: t(ui.nav.about), icon: User },
    { path: '/dialogo', label: t(ui.nav.contact), icon: Mail },
  ] as const;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(() => window.matchMedia('(max-width: 767px)').matches);
  const [openPanels, setOpenPanels] = useState({ mood: false, tapes: false });
  const [atmosphereFps, setAtmosphereFps] = useState(NORMAL_FPS);
  const overlayOpen = openPanels.mood || openPanels.tapes;

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)');
    const update = () => setIsCompact(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const onMoodOpen = () => setOpenPanels((prev) => ({ ...prev, mood: true }));
    const onMoodClose = () => setOpenPanels((prev) => ({ ...prev, mood: false }));
    const onTapesOpen = () => setOpenPanels((prev) => ({ ...prev, tapes: true }));
    const onTapesClose = () => setOpenPanels((prev) => ({ ...prev, tapes: false }));

    window.addEventListener('gdv:mood-open', onMoodOpen);
    window.addEventListener('gdv:mood-close', onMoodClose);
    window.addEventListener('gdv:tapes-open', onTapesOpen);
    window.addEventListener('gdv:tapes-close', onTapesClose);

    return () => {
      window.removeEventListener('gdv:mood-open', onMoodOpen);
      window.removeEventListener('gdv:mood-close', onMoodClose);
      window.removeEventListener('gdv:tapes-open', onTapesOpen);
      window.removeEventListener('gdv:tapes-close', onTapesClose);
    };
  }, []);

  useEffect(() => {
    if (overlayOpen) {
      setAtmosphereFps(OVERLAY_FPS);
      return;
    }
    const timer = window.setTimeout(() => setAtmosphereFps(NORMAL_FPS), RESUME_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [overlayOpen]);

  // Precargar los chunks de los paneles en idle para que el primer click no espere.
  useEffect(() => {
    const prefetch = () => {
      void import('./MoodPanel');
      void import('./StudioTapes');
    };
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(prefetch);
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(prefetch, 1);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="isolate min-h-screen relative flex flex-col selection:bg-amber-100 selection:text-amber-900"
      id="app-root"
    >
      {/* Crossfade: el fondo saliente se desvanece mientras el entrante aparece. */}
      <AnimatePresence mode="sync">
        {mode !== 'none' && (
          <AsciiButterflyBackground
            key={mode}
            theme="light"
            creature={mode}
            count={
              isCompact ? ATMOSPHERE_SETTINGS[mode].compactCount : ATMOSPHERE_SETTINGS[mode].count
            }
            speed={ATMOSPHERE_SETTINGS[mode].speed}
            scale={ATMOSPHERE_SETTINGS[mode].scale}
            species={ATMOSPHERE_SETTINGS[mode].species}
            interactionMode="breeze"
            cellSize={11}
            overlayMode="ascii-pixels"
            showAmbientParticles
            paused={false}
            fps={atmosphereFps}
            opacity={1}
            spawnOnClick={false}
          />
        )}
      </AnimatePresence>
      <div className="grain-overlay"></div>

      <header className="border-b border-[#1a1a1a]/10 sticky top-0 bg-[#f9f7f2]/95 backdrop-blur-md z-40 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row md:items-baseline gap-3">
            <Link
              to={localizePath('/', lang)}
              className="text-serif text-lg font-bold tracking-tighter uppercase hover:opacity-80 transition-opacity text-[#1a1a1a]"
            >
              GONZALO DANIEL VEGA
            </Link>
          </div>

          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#555] hover:text-[#1a1a1a]"
              aria-expanded={mobileMenuOpen}
              aria-controls="primary-navigation"
              aria-label={mobileMenuOpen ? t(ui.nav.closeMenu) : t(ui.nav.openMenu)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav
            id="primary-navigation"
            className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-wrap justify-center gap-1 sm:gap-2`}
            role="navigation"
          >
            {navItems.map((item) => {
              const IconComp = item.icon;
              const linkTo = localizePath(item.path, lang);
              const isActive = location.pathname === linkTo;
              return (
                <Link
                  key={item.path}
                  to={linkTo}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-1.5 rounded-sm text-xs font-mono tracking-wider transition-all duration-200 uppercase flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#a84432] text-[#f9f7f2]'
                      : 'text-[#666] hover:text-[#1a1a1a] hover:bg-[#a84432]/5'
                  }`}
                >
                  <IconComp size={12} />
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={toggleLang}
              className="font-mono text-xs uppercase tracking-wider text-[#555] hover:text-[#a84432] transition-colors cursor-pointer ml-2"
              aria-label={`${lang === 'es' ? 'EN' : 'ES'} — ${t(ui.nav.switchLang)}`}
            >
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
          </nav>
        </div>
      </header>

      <main className="relative z-10 flex-grow">
        <Outlet />
      </main>

      <footer className="border-t border-[#1a1a1a]/10 py-12 bg-[#efede8]/50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-[#555] font-mono">
          <div>
            <p>{t(ui.footer.copyright).replace('{year}', String(new Date().getFullYear()))}</p>
            <p className="text-xs text-[#444] mt-1">{t(ui.footer.made)}</p>
          </div>
          <div className="flex gap-4">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#a84432] transition-colors"
            >
              LINKEDIN
            </a>
            {/* GITHUB: sacar este comentario para volver a mostrar el link del footer.
            {(
              <>
                <span>•</span>
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#a84432] transition-colors">GITHUB</a>
              </>
            )} */}
            <span>•</span>
            <a
              href={lang === 'es' ? '/cv-es.pdf' : '/cv-en.pdf'}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#a84432] transition-colors"
            >
              {t(ui.footer.cv)}
            </a>
            <span>•</span>
            <Link
              to={localizePath('/zen', lang)}
              className="hover:text-[#a84432] transition-colors"
            >
              ZEN
            </Link>
            <span>•</span>
            <a href={`mailto:${profile.email}`} className="hover:text-[#a84432] transition-colors">
              EMAIL
            </a>
          </div>
        </div>
      </footer>

      <Suspense fallback={null}>
        <MoodPanel />
        <StudioTapes />
      </Suspense>
    </div>
  );
}
