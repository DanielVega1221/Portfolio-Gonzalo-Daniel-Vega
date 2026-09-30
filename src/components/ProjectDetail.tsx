import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
// GITHUB: sacar este comentario del import para volver a usar el icono.
// import { ArrowLeft, Calendar, CheckCircle2, AlertTriangle, RefreshCw, Award, Anchor, ExternalLink, Github, FolderKanban, X } from 'lucide-react';
import { ArrowLeft, Calendar, CheckCircle2, AlertTriangle, RefreshCw, Award, Anchor, ExternalLink, FolderKanban, X } from 'lucide-react';
import { caseStudies } from '../data/projects';
import { CaseStudy } from '../types';
import { useLanguage, localizePath } from '../i18n/useLanguage';
import { useT } from '../i18n/useT';
import { ui } from '../i18n/translations';
import { getProjectEn } from '../data/projects-en-lookup';
import ProjectImage from './ProjectImage';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const pid = id ?? '';
  const navigate = useNavigate();
  const project = caseStudies.find(p => p.id === pid);
  const { lang } = useLanguage();
  const t = useT();
  const projectData = (lang === 'en' ? (getProjectEn(pid) || project) : project) ?? null;
  const [showGallery, setShowGallery] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (lightboxIndex !== null) {
        setLightboxIndex(null);
      } else if (showGallery) {
        setShowGallery(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showGallery, lightboxIndex]);

  if (!project || !projectData) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <p className="font-mono text-sm text-[#777]">{t(ui.projectDetail.notFound)}</p>
        <button
          onClick={() => navigate(localizePath('/proyectos', lang))}
          className="mt-4 font-mono text-xs text-[#a84432] underline uppercase tracking-wider"
        >
          {t(ui.projectDetail.back)}
        </button>
      </div>
    );
  }

  const typeBadgeLabels: Record<CaseStudy['type'], string> = {
    personal: t(ui.portfolio.filters.personal),
    real: t(ui.portfolio.filters.real),
    tool: t(ui.portfolio.filters.tool),
    particular: t(ui.portfolio.filters.particular),
    career: t(ui.portfolio.filters.career),
  };
  const badgeColor = projectData.type === 'personal'
    ? 'border-[#a84432]/20 text-[#a84432] bg-[#a84432]/5'
    : 'border-[#1a1a1a]/10 text-[#444] bg-[#1a1a1a]/5';
  const onBack = () => navigate(localizePath('/proyectos', lang));

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16"
    >
      <div className="flex justify-between items-center border-b border-[#1a1a1a]/10 pb-6 mb-12">
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#a84432] hover:text-[#1a1a1a] transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          {t(ui.projectDetail.back)}
        </button>
        <span className="font-mono text-[11px] text-[#888] uppercase tracking-[0.2em]">
          {t(ui.projectDetail.journal)} {projectData.year}
        </span>
      </div>

      <header className="space-y-6 mb-12">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[#777]">
          <span className="text-[#a84432] font-semibold tracking-wider">{t(ui.portfolio.chapterLabel)} {projectData.chapterNumber}</span>
          <span className="opacity-30">•</span>
          <span className="flex items-center gap-1">
            <Calendar size={12} className="opacity-70" /> {projectData.year}
          </span>
          <span className="opacity-30">•</span>
           <span className={`px-2 py-0.5 border rounded-xs text-[10px] uppercase tracking-wider font-semibold ${badgeColor}`}>
             {typeBadgeLabels[projectData.type]}
           </span>
        </div>

        <h1 className="text-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-[#1a1a1a] leading-[1.05]">
          {projectData.title}
        </h1>

        <p className="font-mono text-xs text-[#666] uppercase tracking-[0.2em] max-w-xl">
          {projectData.subtitle}
        </p>

        {projectData.metric && (() => {
          const antesMatch = projectData.metric.match(/Antes:\s*(.+?)(?:\s*Después:|\s*After:)/);
          const beforeMatch = projectData.metric.match(/Before:\s*(.+?)(?:\s*After:)/);
          const antes = antesMatch?.[1] || beforeMatch?.[1] || '';
          const despues = projectData.metric.split(/Despu.s:\s*|After:\s*/)[1]?.replace(/\.$/, '') || '';
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div className="bg-red-50/40 border border-red-200/50 rounded-xs p-5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-red-400 font-bold block mb-1.5">{t(ui.portfolio.before)}</span>
                <p className="font-mono text-sm text-[#666] leading-relaxed">{antes}</p>
              </div>
              <div className="bg-emerald-50/40 border border-emerald-200/50 rounded-xs p-5 relative">
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-600 font-bold block mb-1.5">{t(ui.portfolio.after)}</span>
                <p className="font-mono text-sm text-emerald-800 leading-relaxed">{despues}</p>
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">✓</span>
                </div>
              </div>
            </div>
          );
        })()}

        <div className="border-l-4 border-[#a84432] pl-6 py-2 my-8">
          <p className="text-xl md:text-2xl font-light text-[#2a2a2a] font-serif italic leading-relaxed">
            "{projectData.tagline}"
          </p>
        </div>
      </header>

      <div className="mb-16">
        <ProjectImage
          title={projectData.title}
          subtitle={projectData.subtitle}
          chapterNumber={projectData.chapterNumber}
          type={projectData.type}
          projectId={projectData.id}
          url={projectData.url}
          className="shadow-xs"
        />
        <div className="flex justify-between items-center mt-3 text-[11px] font-mono text-[#888] px-1 uppercase tracking-widest">
          <span>{t(ui.projectDetail.figure)}</span>
          <span>© Gonzalo Daniel Vega</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-start">
        <div className="lg:col-span-8 space-y-16">
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs font-semibold text-[#a84432]">{t(ui.projectDetail.sectionContext)}</span>
              <div className="flex-1 h-[1px] bg-[#1a1a1a]/10"></div>
            </div>
            <h3 className="text-serif text-2xl md:text-3xl font-light text-[#1a1a1a] tracking-tight">
              {t(ui.projectDetail.contextTitle)}
            </h3>
            <div className="text-[#333] leading-relaxed font-light whitespace-pre-line text-base md:text-lg">
              {projectData.pointOfDeparture}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs font-semibold text-[#a84432]">{t(ui.projectDetail.sectionInvestigation)}</span>
              <div className="flex-1 h-[1px] bg-[#1a1a1a]/10"></div>
            </div>
            <h3 className="text-serif text-2xl md:text-3xl font-light text-[#1a1a1a] tracking-tight">
              {t(ui.projectDetail.investigationTitle)}
            </h3>
            <div className="text-[#333] leading-relaxed font-light space-y-4 whitespace-pre-line text-base md:text-lg">
              {projectData.investigation.split('\n\n').map((paragraph, index) => {
                if (paragraph.trim().startsWith('-')) {
                  const items = paragraph.split('\n').map(item => item.replace('-', '').trim());
                  return (
                    <ul key={index} className="list-disc pl-6 space-y-2 text-[#444] leading-relaxed font-light my-6">
                      {items.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  );
                }
                return (
                  <p key={index} className="text-[#333] leading-relaxed font-light">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </section>

          <section className="relative bg-[#fffef0] border-l-4 border-[#a84432] border-y border-r border-[#e5e2de] p-8 md:p-10 rounded-r-sm shadow-xs">
            <div className="absolute top-4 right-6 font-mono text-[10px] uppercase tracking-widest text-[#a84432] font-semibold flex items-center gap-1">
              <Award size={12} /> {t(ui.projectDetail.insightRevealed)}
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#888] block mb-2">{t(ui.projectDetail.synthesis)}</span>
            <h4 className="text-serif text-xl md:text-2xl font-light text-[#1a1a1a] leading-relaxed italic mb-4">
              "{projectData.insight}"
            </h4>
            <p className="font-sans text-xs text-[#666] leading-relaxed">
              {t(ui.projectDetail.synthesisText)}
            </p>
          </section>

          {projectData.options && projectData.options.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-xs font-semibold text-[#a84432]">{t(ui.projectDetail.sectionTactics)}</span>
                <div className="flex-1 h-[1px] bg-[#1a1a1a]/10"></div>
              </div>
              <h3 className="text-serif text-2xl md:text-3xl font-light text-[#1a1a1a] tracking-tight">
                {t(ui.projectDetail.tacticsTitle)}
              </h3>
              <p className="text-sm text-[#555] font-light italic">
                {t(ui.projectDetail.tacticsSub)}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {projectData.options.map((opt, idx) => (
                  <div key={idx} className="bg-[#efede8]/40 border border-[#e5e2de]/80 p-5 rounded-xs space-y-2">
                    <span className="font-mono text-[10px] text-[#a84432] font-bold uppercase tracking-wider block">{t(ui.projectDetail.option)} {idx + 1}</span>
                    <h5 className="font-serif text-base font-semibold text-[#1a1a1a]">{opt.title}</h5>
                    <p className="text-[#555] font-light text-xs leading-relaxed">{opt.text}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs font-semibold text-[#a84432]">{t(ui.projectDetail.sectionDetermination)}</span>
              <div className="flex-1 h-[1px] bg-[#1a1a1a]/10"></div>
            </div>
            <h3 className="text-serif text-2xl md:text-3xl font-light text-[#1a1a1a] tracking-tight">
              {t(ui.projectDetail.decisionTitle)}
            </h3>
            <div className="text-[#333] leading-relaxed font-light space-y-4 whitespace-pre-line text-base md:text-lg">
              {projectData.decision}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#1a1a1a]/10">
            <div className="space-y-3">
              <h4 className="font-mono text-xs uppercase tracking-widest text-emerald-800 font-bold flex items-center gap-1.5">
                <CheckCircle2 size={14} /> {t(ui.projectDetail.workedWell)}
              </h4>
              <p className="text-sm text-[#444] leading-relaxed font-light whitespace-pre-line">
                {projectData.workedWell}
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-mono text-xs uppercase tracking-widest text-[#a84432] font-bold flex items-center gap-1.5">
                <AlertTriangle size={14} /> {t(ui.projectDetail.tradeoffs)}
              </h4>
              <p className="text-sm text-[#444] leading-relaxed font-light whitespace-pre-line">
                {projectData.tradeoffs}
              </p>
            </div>
          </section>

          <section className="relative bg-[#fffef0] p-8 border border-[#e5e2de] shadow-sm -rotate-1 max-w-2xl mx-auto mt-12 overflow-hidden">
            <div className="absolute -top-3 left-12 w-24 h-6 bg-[#cbc8bf]/40 border-x border-[#e5e2de]/50 opacity-60 rotate-2"></div>
            <div className="absolute -bottom-3 right-12 w-20 h-6 bg-[#cbc8bf]/40 border-x border-[#e5e2de]/50 opacity-60 -rotate-3"></div>

            <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#a84432] font-bold mb-4 flex items-center gap-2">
              <RefreshCw size={12} /> {t(ui.projectDetail.differentTitle)}
            </h4>

            <p className="font-serif text-base italic text-[#4a4a4a] leading-relaxed whitespace-pre-line">
              "{projectData.differentToday}"
            </p>
            <span className="block mt-4 font-mono text-[10px] text-[#555] uppercase tracking-widest">
              {t(ui.projectDetail.differentSub)}
            </span>
          </section>
        </div>

        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-8">
          <div className="bg-[#fffef0] border border-[#e5e2de] p-6 shadow-xs rounded-sm">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#555] border-b border-[#1a1a1a]/10 pb-3 mb-4 flex items-center gap-2">
              <Anchor size={14} className="text-[#a84432]" /> {t(ui.projectDetail.ficha)}
            </h4>

            <div className="space-y-5 text-sm">
              <div>
                <span className="font-mono text-[11px] text-[#555] uppercase tracking-wider block mb-1">{t(ui.projectDetail.project)}</span>
                <p className="font-serif text-sm font-semibold text-[#1a1a1a]">{projectData.title}</p>
              </div>

              <div>
                <span className="font-mono text-[11px] text-[#555] uppercase tracking-wider block mb-1">{t(ui.projectDetail.rubro)}</span>
                <p className="font-sans text-[#1a1a1a] font-medium">{projectData.subtitle}</p>
              </div>

              <div>
                <span className="font-mono text-[11px] text-[#555] uppercase tracking-wider block mb-1">{t(ui.projectDetail.year)}</span>
                <p className="font-sans text-[#1a1a1a] font-medium">{projectData.year}</p>
              </div>

              <div>
                <span className="font-mono text-[11px] text-[#555] uppercase tracking-wider block mb-1">{t(ui.projectDetail.scope)}</span>
                <p className="font-sans text-[#a84432] font-semibold uppercase tracking-wider">{projectData.criteriaLevel}</p>
              </div>

              <div className="pt-4 border-t border-[#1a1a1a]/10">
                <span className="font-mono text-[11px] text-[#555] uppercase tracking-wider block mb-2">{t(ui.projectDetail.tools)}</span>
                <div className="flex flex-wrap gap-1.5">
                  {projectData.tools.map((tool) => (
                    <span
                      key={tool}
                      className="font-mono text-[11px] bg-[#efede8] px-2 py-0.5 text-[#444] rounded-sm"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {(projectData.url || projectData.repoFront || projectData.repoBack) && (
                <div className="pt-4 border-t border-[#1a1a1a]/10 space-y-2">
                  <span className="font-mono text-[11px] text-[#555] uppercase tracking-wider block mb-1">{t(ui.projectDetail.links)}</span>
                  {projectData.url && (
                    <a href={projectData.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-mono text-[11px] text-[#a84432] hover:text-[#1a1a1a] font-semibold uppercase tracking-wider transition-colors">
                      <ExternalLink size={11} /> {t(ui.projectDetail.viewProject)}
                    </a>
                  )}
                  {/* GITHUB: sacar este comentario para volver a mostrar los repos.
                  {projectData.repoFront && (
                    <a href={projectData.repoFront} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-mono text-[11px] text-[#a84432] hover:text-[#1a1a1a] font-semibold uppercase tracking-wider transition-colors">
                      <Github size={11} /> {t(ui.projectDetail.repoFront)}
                    </a>
                  )}
                  {projectData.repoBack && (
                    <a href={projectData.repoBack} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-mono text-[11px] text-[#a84432] hover:text-[#1a1a1a] font-semibold uppercase tracking-wider transition-colors">
                      <Github size={11} /> {t(ui.projectDetail.repoBack)}
                    </a>
                  )} */}
                </div>
              )}

              <div className="pt-4 border-t border-[#1a1a1a]/10">
                <button
                  onClick={() => setShowGallery(true)}
                  className="flex items-center gap-1.5 font-mono text-[11px] text-[#a84432] hover:text-[#1a1a1a] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <FolderKanban size={11} /> {t(ui.projectDetail.gallery)}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#efede8]/60 p-6 rounded-sm border-l-2 border-[#a84432] space-y-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#a84432] font-semibold block">{t(ui.projectDetail.criteria)}</span>
            <p className="text-sm text-[#555] leading-relaxed font-light italic">
              "{projectData.criteriaInsight}"
            </p>
          </div>

          <div className="font-mono text-[10px] text-[#555] uppercase text-center tracking-widest pt-4">
            {t(ui.projectDetail.register)}{projectData.id.toUpperCase()}
          </div>
        </aside>
      </div>

      {showGallery && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1a1a]/60 backdrop-blur-sm"
          onClick={() => setShowGallery(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t(ui.projectDetail.galleryTitle)}
        >
          <div className="bg-[#fffef0] border border-[#e5e2de] rounded-sm p-6 md:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#a84432] font-semibold block">{t(ui.projectDetail.galleryTitle)}</span>
                <h3 className="font-serif text-xl font-light text-[#1a1a1a]">{projectData.title}</h3>
              </div>
              <button
                onClick={() => setShowGallery(false)}
                aria-label={t(ui.a11y.close)}
                autoFocus
                className="text-[#888] hover:text-[#1a1a1a] cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[1, 2, 3].map((n) => {
                const failed = failedImages.has(n);
                return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setLightboxIndex(n - 1)}
                  aria-label={`${t(ui.a11y.openImage)} ${projectData.title} ${String(n).padStart(2, '0')}`}
                  className="aspect-[4/3] bg-[#efede8] border border-[#e5e2de] rounded-xs flex items-center justify-center relative overflow-hidden cursor-pointer hover:border-[#a84432]/40 transition-colors group p-0"
                >
                  <div className="absolute inset-0 bg-[#1a1a1a]/0 group-hover:bg-[#1a1a1a]/5 transition-colors z-10 flex items-center justify-center pointer-events-none">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[11px] uppercase tracking-wider bg-[#1a1a1a]/60 px-2 py-1 rounded-xs">
                      {t(ui.projectDetail.amplify)}
                    </span>
                  </div>
                  {!failed && (
                    <img
                      src={`/projects/${projectData.id}/${String(n).padStart(2, '0')}.webp`}
                      alt={`${projectData.title} — ${String(n).padStart(2, '0')}`}
                      width={640}
                      height={480}
                      className="absolute inset-0 w-full h-full object-cover object-top"
                      loading="lazy"
                      decoding="async"
                      onError={() =>
                        setFailedImages(prev => {
                          const next = new Set(prev);
                          next.add(n);
                          return next;
                        })
                      }
                    />
                  )}
                  {failed && (
                    <div className="text-center space-y-2 pointer-events-none">
                      <FolderKanban size={24} className="text-[#1a1a1a]/15 mx-auto" />
                      <p className="font-mono text-[10px] text-[#1a1a1a]/20 uppercase tracking-wider">
                        {projectData.title} — {String(n).padStart(2, '0')}
                      </p>
                    </div>
                  )}
                </button>
                );
              })}
            </div>

            <p className="mt-5 font-mono text-[10px] text-[#555] text-center uppercase tracking-wider">
              {t(ui.projectDetail.galleryCaption)}
            </p>
          </div>
        </div>
      )}

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1a1a1a]/90 backdrop-blur-sm"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${projectData.title} — ${lightboxIndex + 1} / 3`}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            aria-label={t(ui.a11y.close)}
            autoFocus
            className="absolute top-4 right-4 text-white/60 hover:text-white z-10 cursor-pointer"
          >
            <X size={28} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => Math.max(0, (i ?? 0) - 1)); }}
            aria-label={t(ui.a11y.previous)}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white disabled:opacity-20 z-10 cursor-pointer"
            disabled={lightboxIndex === 0}
          >
            <ArrowLeft size={36} />
          </button>

          <img
            src={`/projects/${projectData.id}/${String(lightboxIndex + 1).padStart(2, '0')}.webp`}
            alt={`${projectData.title} — ${String(lightboxIndex + 1).padStart(2, '0')}`}
            width={1200}
            height={900}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => Math.min(2, (i ?? 0) + 1)); }}
            aria-label={t(ui.a11y.next)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white disabled:opacity-20 z-10 cursor-pointer"
            disabled={lightboxIndex === 2}
          >
            <span className="block rotate-180"><ArrowLeft size={36} /></span>
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs text-white/40 uppercase tracking-wider">
            {lightboxIndex + 1} / 3
          </div>
        </div>
      )}

      <div className="border-t border-[#1a1a1a]/10 mt-20 pt-10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#a84432] hover:text-[#1a1a1a] transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          {t(ui.projectDetail.back)}
        </button>
<span className="font-mono text-xs text-[#999]">
            {t(ui.projectDetail.footer)} {projectData.year} — SFV Catamarca, Catamarca
          </span>
      </div>
    </motion.article>
  );
}
