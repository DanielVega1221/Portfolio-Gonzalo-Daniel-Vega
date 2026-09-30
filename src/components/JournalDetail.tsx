import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Calendar, Quote, Info, Feather } from 'lucide-react';
import { useLanguage, localizePath } from '../i18n/useLanguage';
import { useT } from '../i18n/useT';
import { ui } from '../i18n/translations';
import { journalEntries } from '../data/journal';

export default function JournalDetail() {
  const { lang } = useLanguage();
  const t = useT();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const entry = journalEntries.find(e => e.id === id);

  if (!entry) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="font-mono text-sm text-[#777]">{t(ui.journal.notFound)}</p>
        <button
          onClick={() => navigate(localizePath('/journal', lang))}
          className="mt-4 font-mono text-xs text-[#a84432] underline uppercase tracking-wider"
        >
          {t(ui.journal.backToJournal)}
        </button>
      </div>
    );
  }

  const onBack = () => navigate(localizePath('/journal', lang));

  const renderParagraphs = (text: string) => {
    return text.split('\n\n').map((paragraph, index) => {
      const trimmed = paragraph.trim();

      if (trimmed.startsWith('*') && !trimmed.startsWith('**')) {
        const items = paragraph.split('\n').map(item => item.replace('*', '').trim());
        return (
          <ul key={index} className="list-disc pl-6 space-y-3 text-[#333] leading-relaxed font-light my-8">
            {items.map((item, i) => (
              <li key={i} className="pl-1">
                {item.split('**').map((chunk, j) => {
                  if (j % 2 === 1) {
                    return <strong key={j} className="font-semibold text-[#1a1a1a]">{chunk}</strong>;
                  }
                  return chunk;
                })}
              </li>
            ))}
          </ul>
        );
      }

      if (trimmed.startsWith('###')) {
        return (
          <h4 key={index} className="text-serif text-2xl font-light text-[#1a1a1a] mt-12 mb-6 tracking-tight border-b border-[#1a1a1a]/10 pb-2">
            <span className="text-[#a84432] mr-2">§</span>
            {trimmed.replace('###', '').trim()}
          </h4>
        );
      }

      if (trimmed.startsWith('>')) {
        return (
          <blockquote key={index} className="border-l-4 border-[#a84432] bg-[#fffef0] p-6 md:p-8 my-10 rounded-r-sm italic font-serif text-[#2a2a2a] text-lg shadow-xs leading-relaxed relative">
            <Quote className="text-[#a84432]/5 absolute -top-2 right-4 w-12 h-12" />
            {trimmed.replace('>', '').trim()}
          </blockquote>
        );
      }

      const formattedText = trimmed.split('**').map((chunk, i) => {
        if (i % 2 === 1) {
          return (
            <strong key={i} className="font-semibold text-[#a84432] bg-[#a84432]/5 px-1 py-0.5 rounded-sm">
              {chunk}
            </strong>
          );
        }
        return chunk;
      });

      return (
        <p key={index} className="text-[#333] leading-relaxed font-light text-base md:text-lg mb-6 first-letter:font-serif">
          {formattedText}
        </p>
      );
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16"
    >
      <div className="flex justify-between items-center border-b border-[#1a1a1a]/10 pb-6 mb-12">
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#a84432] hover:text-[#1a1a1a] transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          {t(ui.journal.backToNotes)}
        </button>
        <span className="font-mono text-[10px] text-[#888] uppercase tracking-[0.2em]">
          {t(ui.journal.journalHeader)}
        </span>
      </div>

      <div className="space-y-6 mb-12">
        <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-[#777]">
          <span className="text-[#a84432] font-semibold tracking-widest">{t(ui.journal.notebook)}</span>
          <span className="opacity-30">•</span>
          <span className="bg-[#1a1a1a]/5 px-2 py-0.5 rounded-xs text-[11px] uppercase font-semibold text-[#555]">
            {lang === 'en' && entry.categoryEn ? entry.categoryEn : entry.category}
          </span>
          <span className="opacity-30">•</span>
          <span className="flex items-center gap-1">
            <Calendar size={12} className="opacity-70" /> {entry.date}
          </span>
          <span className="opacity-30">•</span>
          <span className="flex items-center gap-1">
            <Clock size={12} className="opacity-70" /> {lang === 'en' && entry.readingTimeEn ? entry.readingTimeEn : entry.readingTime}
          </span>
        </div>

        <h1 className="text-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-[#1a1a1a] leading-tight pr-4">
          {lang === 'en' && entry.titleEn ? entry.titleEn : entry.title}
        </h1>

        <div className="bg-[#fffef0] border border-[#e5e2de] p-6 rounded-sm mt-8 relative">
          <div className="absolute top-4 right-4 text-[#a84432]/30">
            <Info size={16} />
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#a84432] font-bold mb-2">{t(ui.journal.abstract)}</p>
          <p className="text-base text-[#333] font-serif italic leading-relaxed">
            "{lang === 'en' && entry.taglineEn ? entry.taglineEn : entry.tagline}"
          </p>
        </div>
      </div>

      <div className="prose prose-neutral max-w-none mb-16 font-sans">
        {renderParagraphs(lang === 'en' && entry.contentEn ? entry.contentEn : entry.content)}
      </div>

      <div className="border-t border-[#1a1a1a]/10 pt-8 mt-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 font-mono text-xs text-[#a84432] font-bold uppercase tracking-wider">
            <Feather size={14} /> {t(ui.journal.author)}
          </div>
          <p className="text-serif text-base font-semibold text-[#1a1a1a]">{t(ui.journal.authorName)}</p>
          <p className="font-mono text-[11px] text-[#555] uppercase tracking-widest">{t(ui.journal.authorRole)}</p>
        </div>
      </div>

      <div className="border-t border-b border-[#1a1a1a]/10 py-10 my-12 text-center relative">
        <Quote className="text-[#a84432]/5 absolute top-4 left-4" size={48} />
        <p className="text-serif text-lg italic text-[#444] max-w-lg mx-auto">
          {t(ui.journal.quote)}
        </p>
      </div>

      <div className="flex justify-between items-center text-xs font-mono">
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#a84432] hover:text-[#1a1a1a] transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          {t(ui.journal.backToJournal)}
        </button>
        <span className="text-[#999]">{t(ui.journal.fieldNotebook)}</span>
      </div>
    </motion.article>
  );
}
