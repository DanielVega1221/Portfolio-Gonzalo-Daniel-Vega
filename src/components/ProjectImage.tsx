import { useLanguage } from '../i18n/useLanguage';

interface ProjectImageProps {
  title: string;
  subtitle: string;
  chapterNumber: string;
  type: 'personal' | 'real' | 'tool' | 'particular' | 'career';
  projectId: string;
  url?: string;
  className?: string;
}

function getTypeLabel(type: ProjectImageProps['type'], lang: 'es' | 'en') {
  const labels: Record<string, { es: string; en: string }> = {
    real: { es: 'CLIENTE', en: 'CLIENT' },
    tool: { es: 'HERRAMIENTA', en: 'TOOL' },
    personal: { es: 'DEMO', en: 'DEMO' },
    particular: { es: 'PARTICULAR', en: 'PRIVATE' },
    career: { es: 'CARRERA', en: 'CAREER' },
  };
  return labels[type]?.[lang] || type.toUpperCase();
}

export default function ProjectImage({ title, subtitle, chapterNumber, type, projectId, url, className = '' }: ProjectImageProps) {
  const { lang } = useLanguage();
  const screenshotPath = url ? `/projects/${projectId}.jpg` : null;

  return (
    <div className={`relative w-full aspect-[16/10] overflow-hidden bg-[#efede8] border border-[#e5e2de] rounded-sm group-hover:border-[#1a1a1a]/30 transition-colors ${className}`}>
      {screenshotPath ? (
        <img
          src={screenshotPath}
          alt={title}
          width={640}
          height={400}
          className="w-full h-full object-cover object-top"
          loading="lazy"
          decoding="async"
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

      <div className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#777] bg-[#f9f7f2]/90 backdrop-blur-xs px-2 py-1 border border-[#e5e2de] rounded-xs">
        {getTypeLabel(type, lang)}
      </div>

      <div className="absolute top-3 right-3 font-mono text-xs font-bold text-[#a84432] bg-[#f9f7f2]/90 backdrop-blur-xs w-7 h-7 rounded-full border border-[#e5e2de] flex items-center justify-center">
        {chapterNumber}
      </div>
    </div>
  );
}
