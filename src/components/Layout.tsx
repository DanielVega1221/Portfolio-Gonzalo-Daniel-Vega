import { lazy, Suspense, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useLanguage, localizePath } from '../i18n/useLanguage';
import { useT } from '../i18n/useT';
import { ui } from '../i18n/translations';
// GITHUB: import { profile } from '../data/profile';  <- Importar de nuevo al reactivar el link del footer.
import {
  Library, Layers, BookOpen, User, Mail,
  Menu, X,
} from 'lucide-react';

const StudioTapes = lazy(() => import('./StudioTapes'));

export default function Layout() {
  const location = useLocation();
  const { lang, toggleLang } = useLanguage();
  const t = useT();

  const navItems = [
    { path: '/', label: t(ui.nav.home), icon: BookOpen },
    { path: '/proyectos', label: t(ui.nav.projects), icon: Layers },
    { path: '/journal', label: t(ui.nav.journal), icon: Library },
    { path: '/sobre-mi', label: t(ui.nav.about), icon: User },
    { path: '/dialogo', label: t(ui.nav.contact), icon: Mail },
  ] as const;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen relative flex flex-col selection:bg-amber-100 selection:text-amber-900" id="app-root">
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
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#555] hover:text-[#1a1a1a]"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-wrap justify-center gap-1 sm:gap-2`} role="navigation">
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
            <button onClick={toggleLang} className="font-mono text-xs uppercase tracking-wider text-[#555] hover:text-[#a84432] transition-colors cursor-pointer ml-2" aria-label={lang === 'es' ? 'Switch to English' : 'Cambiar a español'}>
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="border-t border-[#1a1a1a]/10 py-12 bg-[#efede8]/50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-[#555] font-mono">
          <div>
            <p>
              {t(ui.footer.copyright)}
            </p>
            <p className="text-xs text-[#444] mt-1">{t(ui.footer.made)}</p>
          </div>
          <div className="flex gap-4">
            <a href="https://www.linkedin.com/in/gonzalo-daniel-vega/" target="_blank" rel="noopener noreferrer" className="hover:text-[#a84432] transition-colors">LINKEDIN</a>
            {/* GITHUB: sacar este comentario para volver a mostrar el link del footer.
            {(
              <>
                <span>•</span>
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#a84432] transition-colors">GITHUB</a>
              </>
            )} */}
            <span>•</span>
            <a href={lang === 'es' ? '/cv-es.pdf' : '/cv-en.pdf'} target="_blank" rel="noopener noreferrer" className="hover:text-[#a84432] transition-colors">{t(ui.footer.cv)}</a>
            <span>•</span>
            <a href="mailto:dvega6442@gmail.com" className="hover:text-[#a84432] transition-colors">EMAIL</a>
          </div>
        </div>
      </footer>

      <Suspense fallback={null}>
        <StudioTapes />
      </Suspense>
    </div>
  );
}
