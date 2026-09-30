import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Download } from 'lucide-react';
import { caseStudies } from '../data/projects';
import { getProjectEn } from '../data/projects-en-lookup';
import ProjectImage from '../components/ProjectImage';
import { journalEntries } from '../data/journal';
import { useLanguage, localizePath } from '../i18n/useLanguage';
import { useT } from '../i18n/useT';
import { ui } from '../i18n/translations';
import type { CaseStudy } from '../types';

const FEATURED_IDS = ['zabira-studio', 'patagenda', 'electropower'];

export default function Home() {
  const { lang } = useLanguage();
  const t = useT();

  const featuredProjects = useMemo(
    () => FEATURED_IDS
      .map(id => {
        const project = caseStudies.find(p => p.id === id);
        if (!project) return null;
        return lang === 'en' ? (getProjectEn(project.id) || project) : project;
      })
      .filter((p): p is CaseStudy => p !== null),
    [lang]
  );

  const latestJournalEntry = useMemo(() => {
    if (journalEntries.length === 0) return null;
    return [...journalEntries].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto px-6 py-12 md:py-16"
    >
      <div className="space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start" id="home-view">
          <section className="lg:col-span-7 space-y-10 lg:border-r lg:border-[#1a1a1a]/10 lg:pr-12">
            <div className="space-y-4">
              <div className="flex gap-6 items-center mb-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] font-medium text-[#666]">{t(ui.home.edition)}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] font-medium text-[#a84432] font-semibold">{t(ui.home.editorial)}</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#f9f7f2] bg-emerald-600/80 px-2 py-0.5 rounded-xs">{t(ui.home.available)}</span>
              </div>

              <h1 className="sr-only">Gonzalo Daniel Vega — Full Stack Developer</h1>

              <h2 className="text-serif text-4xl sm:text-5xl md:text-6xl font-light leading-[1.05] text-[#1a1a1a] tracking-tight pr-4">
                {t(ui.home.heroTitle)}
              </h2>

              <p className="text-serif text-lg italic text-[#a84432] font-light mt-1">
                {t(ui.home.heroTag)}
              </p>

              <p className="font-mono text-sm text-[#a84432] tracking-wider mt-2">
                {t(ui.home.heroTech)}
              </p>

              <p className="font-mono text-xs text-[#666] tracking-wider mt-1">
                {t(ui.home.experienceText)}
              </p>
            </div>

            <div className="max-w-md">
              <p className="font-sans text-sm leading-relaxed text-[#444] tracking-wider">
                {t(ui.home.heroBody)}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={lang === 'es' ? '/cv-es.pdf' : '/cv-en.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#f9f7f2] bg-[#a84432] hover:bg-[#a84432]/90 px-4 py-2.5 rounded-sm transition-colors"
              >
                <Download size={14} />
                {t(ui.home.downloadCV)}
              </a>
              <Link
                to={localizePath('/proyectos', lang)}
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#a84432] border border-[#a84432] hover:bg-[#a84432]/5 px-4 py-2.5 rounded-sm transition-colors"
              >
                {t(ui.nav.projects)}
              </Link>
              <Link
                to={localizePath('/dialogo', lang)}
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#555] border border-[#1a1a1a]/20 hover:border-[#a84432]/40 px-4 py-2.5 rounded-sm transition-colors"
              >
                {t(ui.nav.contact)}
              </Link>
            </div>

            <section className="space-y-4 pt-6 border-t border-[#1a1a1a]/10">
              <p className="font-mono text-[11px] text-[#a84432] font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                <span>●</span> {t(ui.home.exchange)}
              </p>
              <p className="text-sm text-[#555] leading-relaxed font-light mb-4">
                {t(ui.home.exchangeDesc)}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {featuredProjects.map((project) => (
                  <Link
                    key={project.id}
                    to={localizePath(`/proyectos/${project.id}`, lang)}
                    className="group bg-[#fffef0] border border-[#e5e2de] hover:border-[#a84432]/40 rounded-xs overflow-hidden transition-all duration-200 hover:shadow-xs"
                  >
                    <ProjectImage
                      title={project.title}
                      subtitle={project.subtitle}
                      chapterNumber={project.chapterNumber}
                      type={project.type}
                      projectId={project.id}
                      url={project.url}
                      className="border-0 rounded-none"
                    />
                    <div className="p-4">
                      <h4 className="font-serif text-base font-semibold text-[#1a1a1a] group-hover:text-[#a84432] transition-colors leading-snug mb-1">
                        {project.title}
                      </h4>
                      <p className="font-mono text-[10px] text-[#a84432] uppercase tracking-wider mb-2">
                        {project.subtitle}
                      </p>
                    <p className="text-xs text-[#555] leading-relaxed font-light mb-2 line-clamp-2">
                      {project.tagline}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {project.tools.slice(0, 3).map(tool => (
                        <span key={tool} className="text-[10px] font-mono bg-[#efede8] text-[#555] px-1.5 py-0.5 rounded-xs">
                          {tool}
                        </span>
                      ))}
                    </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="pt-1">
                <Link
                  to={localizePath('/proyectos', lang)}
                  className="inline-flex items-center gap-1 font-mono text-xs text-[#a84432] hover:text-[#1a1a1a] font-bold uppercase tracking-wider"
                >
                  {t(ui.home.featuredViewAll)}
                </Link>
            </div>

            <div className="pt-8 space-y-4">
              <p className="font-mono text-[11px] uppercase tracking-widest font-bold text-[#a84432]">{t(ui.home.testimonials)}</p>

              <div className="bg-[#fffef0] border border-[#e5e2de] p-5 rounded-xs space-y-3">
                <p className="text-sm text-[#333] font-serif italic leading-relaxed">
                  {t(ui.home.testimonial1)}
                </p>
                <p className="font-mono text-[11px] text-[#a84432] font-semibold">{t(ui.home.testimonial1Name)}</p>
                <p className="font-mono text-[10px] text-[#555] uppercase tracking-wider">{t(ui.home.testimonial1Role)}</p>
              </div>

              <div className="bg-[#fffef0] border border-[#e5e2de] p-5 rounded-xs space-y-3">
                <p className="text-sm text-[#333] font-serif italic leading-relaxed">
                  {t(ui.home.testimonial2)}
                </p>
                <p className="font-mono text-[11px] text-[#a84432] font-semibold">{t(ui.home.testimonial2Name)}</p>
                <p className="font-mono text-[10px] text-[#555] uppercase tracking-wider">{t(ui.home.testimonial2Role)}</p>
              </div>
            </div>
          </section>

            <div className="pt-4 border-t border-[#1a1a1a]/10">
              <p className="font-mono text-[11px] text-[#888] uppercase tracking-widest mb-1">{t(ui.home.base)}</p>
              <p className="text-sm font-serif text-[#1a1a1a] font-medium">{t(ui.home.location)}</p>
            </div>
          </section>

          <section className="lg:col-span-5 flex flex-col justify-between lg:border-l lg:border-[#1a1a1a]/10 lg:pl-12 space-y-12">
            <div className="space-y-10">
              <p className="font-mono text-xs uppercase tracking-widest text-[#a84432] font-bold">{t(ui.home.index)}</p>

              <nav className="flex flex-col gap-6">
                <Link to={localizePath('/proyectos', lang)} className="group cursor-pointer flex justify-between items-baseline text-left w-full border-none bg-transparent p-0 text-[#1a1a1a] focus:outline-none">
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#a84432] font-semibold">01.</span>
                  <span className="text-2xl font-light border-b border-transparent group-hover:border-[#a84432] pb-1 transition-all text-serif">{t(ui.nav.projects)}</span>
                  <span className="flex-1 border-b border-dotted border-[#1a1a1a]/20 mx-4"></span>
                  <span className="font-mono text-[11px] uppercase opacity-50">{t(ui.home.indexProjects)}</span>
                </Link>

                <Link to={localizePath('/journal', lang)} className="group cursor-pointer flex justify-between items-baseline text-left w-full border-none bg-transparent p-0 text-[#1a1a1a] focus:outline-none">
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#a84432] font-semibold">02.</span>
                  <span className="text-2xl font-light border-b border-transparent group-hover:border-[#a84432] pb-1 transition-all text-serif">{t(ui.nav.journal)}</span>
                  <span className="flex-1 border-b border-dotted border-[#1a1a1a]/20 mx-4"></span>
                  <span className="font-mono text-[11px] uppercase opacity-50">{t(ui.home.indexJournal)}</span>
                </Link>

                <Link to={localizePath('/sobre-mi', lang)} className="group cursor-pointer flex justify-between items-baseline text-left w-full border-none bg-transparent p-0 text-[#1a1a1a] focus:outline-none">
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#a84432] font-semibold">03.</span>
                  <span className="text-2xl font-light border-b border-transparent group-hover:border-[#a84432] pb-1 transition-all text-serif">{t(ui.nav.about)}</span>
                  <span className="flex-1 border-b border-dotted border-[#1a1a1a]/20 mx-4"></span>
                  <span className="font-mono text-[11px] uppercase opacity-50">{t(ui.home.indexAbout)}</span>
                </Link>

                <Link to={localizePath('/dialogo', lang)} className="group cursor-pointer flex justify-between items-baseline text-left w-full border-none bg-transparent p-0 text-[#1a1a1a] focus:outline-none">
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#a84432] font-semibold">04.</span>
                  <span className="text-2xl font-light border-b border-transparent group-hover:border-[#a84432] pb-1 transition-all text-serif">{t(ui.nav.contact)}</span>
                  <span className="flex-1 border-b border-dotted border-[#1a1a1a]/20 mx-4"></span>
                  <span className="font-mono text-[11px] uppercase opacity-50">{t(ui.home.indexContact)}</span>
                </Link>
              </nav>

              {latestJournalEntry && (
                <div className="bg-[#efede8] p-8 rounded-xs border-l-4 border-[#a84432] border-y border-r border-[#1a1a1a]/5 space-y-4">
                  <span className="font-mono text-[11px] uppercase tracking-widest font-bold block text-[#a84432]">
                    {t(ui.home.latestJournal)}
                  </span>
                  <h3 className="text-xl text-serif font-normal text-[#1a1a1a] leading-tight">
                    {lang === 'en' && latestJournalEntry.titleEn ? latestJournalEntry.titleEn : latestJournalEntry.title}
                  </h3>
                  <p className="font-sans text-sm text-[#555] leading-relaxed font-light">
                    {lang === 'en' && latestJournalEntry.taglineEn ? latestJournalEntry.taglineEn : latestJournalEntry.tagline}
                  </p>
                  <div className="pt-2">
                    <Link
                      to={localizePath(`/journal/${latestJournalEntry.id}`, lang)}
                      className="font-mono text-[11px] text-[#a84432] hover:text-[#1a1a1a] font-bold uppercase tracking-wider underline flex items-center gap-1 cursor-pointer"
                    >
                      {t(ui.home.readNote)}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
