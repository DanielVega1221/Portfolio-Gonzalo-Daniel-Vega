import { useState } from 'react';
import { useT } from '../i18n/useT';
import { ui } from '../i18n/translations';
import type { CaseStudy } from '../types';

interface ProjectImageProps {
  title: string;
  subtitle: string;
  chapterNumber: string;
  type: CaseStudy['type'];
  projectId: string;
  url?: string;
  screenshot?: string;
  /** Only for the first card above the fold: that one is the LCP candidate. */
  priority?: boolean;
  className?: string;
}

// El badge de la card usa el mismo diccionario que los filtros de /proyectos.
// Antes tenia su propio mapa interno ("CLIENTE" / "HERRAMIENTA" / "DEMO"), y el
// mismo proyecto seitania con dos palabras distintas segun donde se lo mire.
const TYPE_LABELS: Record<CaseStudy['type'], keyof typeof ui.portfolio.filters> = {
  real: 'real',
  tool: 'tool',
  personal: 'personal',
  particular: 'particular',
  career: 'career',
};

export default function ProjectImage({ title, subtitle, chapterNumber, type, projectId, url, screenshot, priority = false, className = '' }: ProjectImageProps) {
  const t = useT();
  // `screenshot` cubre los proyectos sin sitio web publico; si no, la captura
  // automatica que vivia en la URL del proyecto.
  const screenshotPath = screenshot ?? (url ? `/projects/${projectId}.jpg` : null);
  // Si el archivo no llega, caemos al placeholder tipografico: antes se
  // dibujaba el icono de imagen rota del navegador.
  const [coverFailed, setCoverFailed] = useState(false);
  const showCover = screenshotPath !== null && !coverFailed;

  return (
    <div className={`relative w-full aspect-[16/10] overflow-hidden bg-[#efede8] border border-[#e5e2de] rounded-sm group-hover:border-[#1a1a1a]/30 transition-colors ${className}`}>
      {showCover ? (
        <img
          src={screenshotPath}
          alt={title}
          width={640}
          height={400}
          className="w-full h-full object-cover object-top"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onError={() => setCoverFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#efede8] to-[#e5e2de]">
          <span className="font-mono text-5xl font-light text-[#1a1a1a]/10 tracking-tighter mb-3">
            {chapterNumber}
          </span>
          <h4 className="font-serif text-xl font-light text-[#666] tracking-tight text-center leading-tight">
            {title}
          </h4>
          <p className="font-mono text-[10px] text-[#999] uppercase tracking-wider mt-2">
            {subtitle}
          </p>
        </div>
      )}

      <div className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#555] bg-[#f9f7f2]/90 backdrop-blur-xs px-2 py-1 border border-[#e5e2de] rounded-xs max-w-[60%] truncate">
        {t(ui.portfolio.filters[TYPE_LABELS[type]])}
      </div>

      <div className="absolute top-3 right-3 font-mono text-xs font-bold text-[#a84432] bg-[#f9f7f2]/90 backdrop-blur-xs w-7 h-7 rounded-full border border-[#e5e2de] flex items-center justify-center">
        {chapterNumber}
      </div>
    </div>
  );
}
