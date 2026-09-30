import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
// GITHUB: sacar este comentario del import para volver a usar el icono.
// import { Search, HelpCircle, ChevronDown, Github } from 'lucide-react';
import { Search, HelpCircle, ChevronDown } from 'lucide-react';
import { caseStudies } from '../data/projects';
import { getProjectEn } from '../data/projects-en-lookup';
import ProjectImage from '../components/ProjectImage';
import type { CaseStudy } from '../types';
import { useLanguage, localizePath } from '../i18n/useLanguage';
import { useT } from '../i18n/useT';
import { ui } from '../i18n/translations';

type TypeFilter = 'all' | 'personal' | 'tool' | 'real' | 'particular' | 'career';

export default function Portfolio() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [displayCount, setDisplayCount] = useState(6);

  const { lang } = useLanguage();
  const t = useT();

  const filterOptions = useMemo(() => [
    { id: 'all' as const, label: t(ui.portfolio.filters.all) },
    { id: 'personal' as const, label: t(ui.portfolio.filters.personal) },
    { id: 'tool' as const, label: t(ui.portfolio.filters.tool) },
    { id: 'real' as const, label: t(ui.portfolio.filters.real) },
    { id: 'particular' as const, label: t(ui.portfolio.filters.particular) },
    { id: 'career' as const, label: t(ui.portfolio.filters.career) },
  ], [t]);

  const typeLabelMap: Record<CaseStudy['type'], string> = useMemo(() => ({
    personal: t(ui.portfolio.filters.personal),
    tool: t(ui.portfolio.filters.tool),
    real: t(ui.portfolio.filters.real),
    particular: t(ui.portfolio.filters.particular),
    career: t(ui.portfolio.filters.career),
  }), [t]);

  const allProjects = useMemo(() =>
    caseStudies.map(p => lang === 'en' ? (getProjectEn(p.id) || p) : p),
    [lang]
  );

  const filteredProjects = useMemo(() => {
    return allProjects.filter(project => {
      const matchesType = typeFilter === 'all' || project.type === typeFilter;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        project.title.toLowerCase().includes(query) ||
        project.subtitle.toLowerCase().includes(query) ||
        project.tagline.toLowerCase().includes(query) ||
        project.tools.some(t => t.toLowerCase().includes(query)) ||
        project.pointOfDeparture.toLowerCase().includes(query) ||
        project.investigation.toLowerCase().includes(query);
      return matchesType && matchesSearch;
    });
  }, [searchQuery, typeFilter, allProjects]);

  const shownProjects = useMemo(
    () => filteredProjects.slice(0, displayCount),
    [filteredProjects, displayCount]
  );

  const hasMore = displayCount < filteredProjects.length;

  const resetDisplay = () => setDisplayCount(6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto px-6 py-12 md:py-16"
    >
      <section id="portfolio-view" className="space-y-16">
        <div className="max-w-3xl space-y-4">
          <p className="font-mono text-xs uppercase tracking-widest text-[#a84432] font-bold">{t(ui.portfolio.chapter)}</p>
          <h2 className="text-serif text-3xl md:text-5xl lg:text-6xl font-light text-[#1a1a1a] tracking-tight leading-tight">
            {t(ui.portfolio.title)}
          </h2>
          <p className="text-[#555] font-light text-base md:text-lg leading-relaxed">
            {t(ui.portfolio.desc)}
          </p>
        </div>

        <div className="border-t border-b border-[#1a1a1a]/10 py-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a84432]" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  resetDisplay();
                }}
                placeholder={t(ui.portfolio.searchPlaceholder)}
                className="w-full bg-[#fffef0] border border-[#e5e2de] pl-10 pr-4 py-2.5 text-sm font-mono rounded-sm focus:outline-none focus:border-[#a84432] text-[#1a1a1a] transition-colors"
              />
          </div>

          <div className="md:col-span-7 flex flex-wrap gap-2 justify-start md:justify-end">
            {filterOptions.map((filter) => (
              <button
                key={filter.id}
                onClick={() => {
                  setTypeFilter(filter.id);
                  resetDisplay();
                }}
                className={`px-3 py-1.5 rounded-sm text-xs font-mono tracking-wider transition-all duration-150 uppercase cursor-pointer ${
                  typeFilter === filter.id
                    ? 'bg-[#a84432] text-[#f9f7f2]'
                    : 'bg-[#fffef0] border border-[#e5e2de] text-[#666] hover:text-[#a84432] hover:border-[#a84432]/30'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-20">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20 bg-[#fffef0] border border-dashed border-[#e5e2de] rounded-sm">
              <HelpCircle className="mx-auto text-[#a84432] mb-4" size={32} />
              <p className="font-mono text-sm text-[#777]">{t(ui.portfolio.emptyTitle)}</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('all');
                  resetDisplay();
                }}
                className="mt-4 text-xs font-mono uppercase tracking-wider underline text-[#a84432] hover:opacity-80"
              >
                {t(ui.portfolio.resetButton)}
              </button>
            </div>
          ) : (
            shownProjects.map((project, idx) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                style={{ opacity: 1 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
              >
                <div className="lg:col-span-6 group cursor-pointer">
                  <Link to={localizePath(`/proyectos/${project.id}`, lang)}>
                    <ProjectImage
                      title={project.title}
                      subtitle={project.subtitle}
                      chapterNumber={project.chapterNumber}
                      type={project.type}
                      projectId={project.id}
                      url={project.url}
                      className="shadow-xs hover:shadow-md transition-shadow duration-300"
                    />
                  </Link>
                </div>

                <div className="lg:col-span-6 space-y-6">
                  <div className="flex items-center gap-3 font-mono text-[11px] text-[#666] uppercase tracking-widest">
                    <span className="font-bold text-[#a84432]">{t(ui.portfolio.chapterLabel)} {project.chapterNumber}</span>
                    <span>•</span>
                    <span>{t(ui.portfolio.yearLabel)} {project.year}</span>
                    <span>•</span>
                    <span className="text-[#444] font-semibold">{typeLabelMap[project.type]}</span>
                  </div>

                  <Link to={localizePath(`/proyectos/${project.id}`, lang)}>
                    <h3 className="text-serif text-3xl sm:text-4xl font-light text-[#1a1a1a] hover:text-[#a84432] tracking-tight leading-tight transition-colors cursor-pointer">
                      {project.title}
                    </h3>
                  </Link>

                  <p className="font-mono text-xs text-[#a84432] uppercase tracking-[0.15em]">
                    {project.subtitle}
                  </p>

                  <p className="text-[#333] leading-relaxed font-light text-sm md:text-base">
                    {project.tagline}
                  </p>

                  {project.metric && (() => {
                    const antesMatch = project.metric.match(/Antes:\s*(.+?)(?:\s*Después:|\s*After:)/);
                    const beforeMatch = project.metric.match(/Before:\s*(.+?)(?:\s*After:)/);
                    const antes = antesMatch?.[1] || beforeMatch?.[1] || '';
                    const despues = project.metric.split(/Despu.s:\s*|After:\s*/)[1]?.replace(/\.$/, '') || '';
                    return (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="bg-red-50/50 border border-red-200/60 rounded-xs p-2">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-red-400 font-bold block mb-0.5">{t(ui.portfolio.before)}</span>
                          <p className="font-mono text-[10px] text-[#666] leading-relaxed">{antes}</p>
                        </div>
                        <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-xs p-2">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-600 font-bold block mb-0.5">{t(ui.portfolio.after)}</span>
                          <p className="font-mono text-[10px] text-emerald-800 leading-relaxed">{despues}</p>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tools.map(t => (
                      <span key={t} className="text-[10px] font-mono bg-[#efede8] text-[#444] px-2 py-0.5 rounded-sm">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#1a1a1a]/10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-[#888] uppercase tracking-widest">
                        REG-{project.id.substring(0, 8).toUpperCase()}
                      </span>
                      {/* GITHUB: sacar este comentario para volver a mostrar los repos.
                      {project.repoFront && (
                        <a href={project.repoFront} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[10px] text-[#a84432] hover:text-[#1a1a1a] font-semibold uppercase tracking-wider transition-colors">
                          <Github size={11} /> Front
                        </a>
                      )}
                      {project.repoBack && (
                        <a href={project.repoBack} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[10px] text-[#a84432] hover:text-[#1a1a1a] font-semibold uppercase tracking-wider transition-colors">
                          <Github size={11} /> Back
                        </a>
                      )} */}
                    </div>
                    <Link
                      to={localizePath(`/proyectos/${project.id}`, lang)}
                      className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-[#a84432] hover:text-[#1a1a1a] hover:underline font-bold"
                    >
                      {t(ui.portfolio.studyLink)}
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))
          )}

          {filteredProjects.length > 0 && hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setDisplayCount(d => d + 6)}
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#f9f7f2] bg-[#a84432] hover:bg-[#a84432]/90 px-6 py-3 rounded-sm transition-colors"
              >
                {t(ui.portfolio.loadMore)}
                <ChevronDown size={14} />
              </button>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
