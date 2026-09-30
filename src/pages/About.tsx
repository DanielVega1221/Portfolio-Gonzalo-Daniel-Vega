import { motion } from 'motion/react';
import { Palette, Code, Users, Megaphone, GraduationCap, Briefcase, MapPin } from 'lucide-react';
import DevBadge from '../components/DevBadge';
import { profile, absoluteCvDownloadUrl } from '../data/profile';
import { useLanguage } from '../i18n/useLanguage';
import { useT } from '../i18n/useT';
import { ui } from '../i18n/translations';

export default function About() {
  const t = useT();
  const { lang } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto px-6 py-12 md:py-16"
    >
      <div id="about-view" className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

        {/* Left Column: Headline and Credential */}
        <div className="lg:col-span-5 space-y-8">
          <p className="font-mono text-xs uppercase tracking-widest text-[#a84432] font-bold">{t(ui.about.chapter)}</p>

          <h2 className="text-serif text-4xl sm:text-5xl font-light text-[#1a1a1a] tracking-tight leading-[1.1]">
            {t(ui.about.headline)}
          </h2>

          <p className="text-sm font-mono text-[#666] uppercase tracking-wider leading-relaxed">
            {t(ui.about.tag)}
          </p>

          {/* Credential: click to flip it, click the lanyard to swing it */}
          <DevBadge
            profile={{
              name: profile.name,
              role: t(ui.badge.role),
              company: t(ui.badge.company),
              location: t(ui.badge.location),
              isOpenToWork: profile.isOpenToWork,
              avatarUrl: profile.avatarUrl,
              shortQuote: t(ui.about.pullQuote),
              resumeUrl: absoluteCvDownloadUrl(lang),
              linkedin: profile.linkedin,
              email: profile.email,
            }}
          />
        </div>

        {/* Right Column: Content */}
        <div className="lg:col-span-7 space-y-12">

          <div className="border-b border-[#1a1a1a]/10 pb-4">
            <span className="font-mono text-[11px] text-[#a84432] font-bold uppercase tracking-widest">{t(ui.about.logbook)}</span>
          </div>

          {/* Section 0: De dónde vengo */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#a84432] font-semibold">
              <span>§ 00</span>
              <span className="opacity-30">/</span>
              <span>{t(ui.about.section00)}</span>
            </div>
            <h3 className="text-serif text-2xl md:text-3xl font-light text-[#1a1a1a] tracking-tight">
              {t(ui.about.section00Title)}
            </h3>
            <div className="text-[#333] font-light leading-relaxed text-sm md:text-base">
              <p>{t(ui.about.section00p1)}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-[#fffef0] border border-[#e5e2de] p-5 rounded-xs space-y-2">
                <div className="flex items-center gap-2">
                  <GraduationCap size={14} className="text-[#a84432]" />
                  <span className="font-mono text-[11px] text-[#a84432] font-bold uppercase tracking-wider">{t(ui.about.section00Card1Title)}</span>
                </div>
                <p className="text-xs text-[#555] font-light leading-relaxed">{t(ui.about.section00Card1Text)}</p>
              </div>

              <div className="bg-[#fffef0] border border-[#e5e2de] p-5 rounded-xs space-y-2">
                <div className="flex items-center gap-2">
                  <Briefcase size={14} className="text-[#a84432]" />
                  <span className="font-mono text-[11px] text-[#a84432] font-bold uppercase tracking-wider">{t(ui.about.section00Card2Title)}</span>
                </div>
                <p className="text-xs text-[#555] font-light leading-relaxed">{t(ui.about.section00Card2Text)}</p>
              </div>

              <div className="bg-[#fffef0] border border-[#e5e2de] p-5 rounded-xs space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-[#a84432]" />
                  <span className="font-mono text-[11px] text-[#a84432] font-bold uppercase tracking-wider">{t(ui.about.section00Card3Title)}</span>
                </div>
                <p className="text-xs text-[#555] font-light leading-relaxed">{t(ui.about.section00Card3Text)}</p>
              </div>
            </div>
          </section>

          {/* Section 1: UXnicorp */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#a84432] font-semibold">
              <span>§ 01</span>
              <span className="opacity-30">/</span>
              <span>{t(ui.about.section01)}</span>
            </div>
            <h3 className="text-serif text-2xl md:text-3xl font-light text-[#1a1a1a] tracking-tight">
              {t(ui.about.section01Title)}
            </h3>
            <div className="text-[#333] font-light leading-relaxed text-sm md:text-base space-y-4">
              <p>{t(ui.about.section01p1)}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#fffef0] border border-[#e5e2de] p-5 rounded-xs space-y-2">
                <div className="flex items-center gap-2">
                  <Palette size={14} className="text-[#a84432]" />
                  <span className="font-mono text-[11px] text-[#a84432] font-bold uppercase tracking-wider">{t(ui.about.section01Design)}</span>
                </div>
                <p className="text-xs text-[#555] font-light leading-relaxed">{t(ui.about.section01DesignText)}</p>
              </div>

              <div className="bg-[#fffef0] border border-[#e5e2de] p-5 rounded-xs space-y-2">
                <div className="flex items-center gap-2">
                  <Code size={14} className="text-[#a84432]" />
                  <span className="font-mono text-[11px] text-[#a84432] font-bold uppercase tracking-wider">{t(ui.about.section01Dev)}</span>
                </div>
                <p className="text-xs text-[#555] font-light leading-relaxed">{t(ui.about.section01DevText)}</p>
              </div>

              <div className="bg-[#fffef0] border border-[#e5e2de] p-5 rounded-xs space-y-2">
                <div className="flex items-center gap-2">
                  <Megaphone size={14} className="text-[#a84432]" />
                  <span className="font-mono text-[11px] text-[#a84432] font-bold uppercase tracking-wider">{t(ui.about.section01Clients)}</span>
                </div>
                <p className="text-xs text-[#555] font-light leading-relaxed">
                  {t(ui.about.section01ClientsText)}
                  <span className="block mt-1 text-[#a84432] font-medium">{t(ui.about.section01Leads)} {t(ui.about.section01LeadsText)}</span>
                </p>
              </div>

              <div className="bg-[#fffef0] border border-[#e5e2de] p-5 rounded-xs space-y-2">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-[#a84432]" />
                  <span className="font-mono text-[11px] text-[#a84432] font-bold uppercase tracking-wider">{t(ui.about.section01Team)}</span>
                </div>
                <p className="text-xs text-[#555] font-light leading-relaxed">{t(ui.about.section01TeamText)}</p>
              </div>
            </div>

            <div className="text-[#333] font-light leading-relaxed text-sm md:text-base">
              <p>{t(ui.about.section01Close)}</p>
            </div>
          </section>

          {/* Pull Quote */}
          <div className="bg-[#fffef0] border-l-4 border-[#a84432] border-y border-r border-[#e5e2de] py-6 px-6 my-8 rounded-r-sm shadow-2xs">
            <p className="text-serif text-lg md:text-xl italic text-[#2a2a2a] font-light leading-relaxed">
              "{t(ui.about.pullQuote)}"
            </p>
          </div>

          {/* Section 2: Cómo pienso */}
          <section className="space-y-6 pt-6 border-t border-[#1a1a1a]/10">
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#a84432] font-semibold">
              <span>§ 02</span>
              <span className="opacity-30">/</span>
              <span>{t(ui.about.section02)}</span>
            </div>
            <h3 className="text-serif text-2xl md:text-3xl font-light text-[#1a1a1a] tracking-tight">
              {t(ui.about.section02Title)}
            </h3>
            <p className="text-sm text-[#555] font-light italic">
              {t(ui.about.section02Sub)}
            </p>

            <div className="grid grid-cols-1 gap-4">
              {(['p01', 'p02', 'p03'] as const).map((key, idx) => {
                const n = idx + 1;
                const pk = ui.about.principles as Record<string, { es: string; en: string }>;
                return (
                  <div key={key} className="bg-[#fffef0] border border-[#e5e2de] p-5 rounded-xs space-y-2">
                    <span className="font-mono text-[10px] text-[#a84432] font-bold uppercase tracking-wider block">{`${t(ui.about.principleLabel)} ${String(n).padStart(2, '0')}`}</span>
                    <h4 className="font-serif text-base font-semibold text-[#1a1a1a]">{t(pk[`${key}Title`])}</h4>
                    <p className="text-sm text-[#444] font-light leading-relaxed">{t(pk[`${key}Text`])}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#a84432] font-semibold">
              <span>§ 03</span>
              <span className="opacity-30">/</span>
              <span>{t(ui.about.section03)}</span>
            </div>
            <h3 className="text-serif text-2xl md:text-3xl font-light text-[#1a1a1a] tracking-tight">
              {t(ui.about.section03Title)}
            </h3>
            <div className="text-[#333] font-light leading-relaxed text-sm md:text-base">
              <p>{t(ui.about.section03p1)}</p>
            </div>
          </section>

          <section className="bg-[#fffef0] border border-[#e5e2de] p-8 rounded-sm shadow-xs space-y-4 mt-8">
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#a84432] font-semibold">
              <span>{t(ui.about.philosophyTitle)}</span>
            </div>
            <p className="font-serif text-lg md:text-xl text-[#1a1a1a] font-light leading-snug">
              {t(ui.about.philosophyText)}
            </p>
          </section>

          <section className="relative bg-[#fffef0] border-l-4 border-[#a84432] border-y border-r border-[#e5e2de] p-8 rounded-r-sm shadow-xs">
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#a84432] font-semibold mb-4">
              <span>§ 04</span>
              <span className="opacity-30">/</span>
              <span>{t(ui.about.section04)}</span>
            </div>
            <p className="text-[#333] font-light leading-relaxed text-sm md:text-base">
              {t(ui.about.section04Text)}
            </p>
          </section>

          {/* Footer */}
          <div className="pt-8 border-t border-[#1a1a1a]/10 flex justify-between items-center text-xs font-mono text-[#888]">
            <span>{t(ui.about.footerBiography)}</span>
            <span className="text-[#a84432] font-bold">G. D. V.</span>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
