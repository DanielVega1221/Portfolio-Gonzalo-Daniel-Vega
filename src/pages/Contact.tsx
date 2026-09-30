import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Check, AlertTriangle } from 'lucide-react';
import { useT } from '../i18n/useT';
import { ui } from '../i18n/translations';

export default function Contact() {
  const [contactName, setContactName] = useState('');
  const [contactReasonIdx, setContactReasonIdx] = useState<number | null>(null);
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);
  const t = useT();

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current !== null) {
        clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  const armFeedbackTimer = () => {
    if (feedbackTimerRef.current !== null) {
      clearTimeout(feedbackTimerRef.current);
    }
    feedbackTimerRef.current = window.setTimeout(() => setFeedback(null), 6000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (contactReasonIdx === null) {
      setFeedback({ type: 'error', text: t(ui.contact.errorReason) });
      armFeedbackTimer();
      return;
    }
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          reason: t(ui.contact.reasons[contactReasonIdx]),
          message: contactMessage,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t(ui.contact.errorFallback));
      }
      setFeedback({ type: 'success', text: t(ui.contact.success) });
      setContactName('');
      setContactReasonIdx(null);
      setContactEmail('');
      setContactMessage('');
    } catch (err) {
      setFeedback({ type: 'error', text: err instanceof Error ? err.message : t(ui.contact.errorGeneric) });
    } finally {
      setIsSubmitting(false);
      armFeedbackTimer();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto px-6 py-12 md:py-16"
    >
      <section id="contact-view" className="max-w-xl mx-auto space-y-12">
        <div className="space-y-4 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-[#a84432] font-bold">{t(ui.contact.chapter)}</p>
          <h2 className="text-serif text-3xl md:text-4xl font-light text-[#1a1a1a] tracking-tight leading-tight">
            {t(ui.contact.title)}
          </h2>
          <p className="text-[#555] font-light text-sm md:text-base leading-relaxed">
            {t(ui.contact.desc)}
          </p>
        </div>

        <div className="bg-[#fffef0] border border-[#e5e2de] p-8 md:p-12 rounded-sm shadow-xs relative">
          {feedback && (
            <div className={`mb-6 p-4 rounded-sm text-xs font-mono flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {feedback.type === 'success' ? <Check size={14} /> : <AlertTriangle size={14} />}
              {feedback.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="font-mono text-sm text-[#666] uppercase tracking-wider block">{t(ui.contact.reasonLabel)}</label>
              <div className="flex flex-wrap gap-2">
                {ui.contact.reasons.map((reason, idx) => (
                  <button
                    key={reason.es}
                    type="button"
                    onClick={() => setContactReasonIdx(idx)}
                    className={`px-3 py-1.5 rounded-sm text-xs font-mono border tracking-wide transition-all cursor-pointer ${
                      contactReasonIdx === idx
                        ? 'bg-[#a84432] border-[#a84432] text-[#f9f7f2]'
                        : 'bg-[#fffef0] border-[#e5e2de] text-[#666] hover:border-[#a84432]/40'
                    }`}
                  >
                    {t(reason)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="contact-name" className="font-mono text-sm text-[#666] uppercase tracking-wider block">{t(ui.contact.nameLabel)}</label>
              <input
                type="text"
                id="contact-name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder={t(ui.contact.namePlaceholder)}
                className="w-full bg-[#f9f7f2] border border-[#e5e2de] px-4 py-2.5 text-sm font-mono rounded-sm focus:outline-none focus:border-[#a84432] text-[#1a1a1a] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contact-email" className="font-mono text-sm text-[#666] uppercase tracking-wider block">{t(ui.contact.emailLabel)}</label>
              <input
                type="email"
                id="contact-email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder={t(ui.contact.emailPlaceholder)}
                className="w-full bg-[#f9f7f2] border border-[#e5e2de] px-4 py-2.5 text-sm font-mono rounded-sm focus:outline-none focus:border-[#a84432] text-[#1a1a1a] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contact-message" className="font-mono text-sm text-[#666] uppercase tracking-wider block">{t(ui.contact.messageLabel)}</label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder={t(ui.contact.messagePlaceholder)}
                className="w-full bg-[#f9f7f2] border border-[#e5e2de] px-4 py-2.5 text-sm font-light rounded-sm focus:outline-none focus:border-[#a84432] text-[#1a1a1a] transition-colors leading-relaxed"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#a84432] text-[#f9f7f2] font-mono text-xs uppercase tracking-widest py-3 hover:bg-[#a84432]/90 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? t(ui.contact.submitting) : t(ui.contact.submit)}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-[#fffef0] border border-[#e5e2de] p-8 rounded-sm shadow-xs text-center space-y-4">
          <p className="font-serif text-xl text-[#1a1a1a] font-light leading-relaxed">
            {t(ui.contact.casualTitle)}
          </p>
          <p className="font-sans text-sm text-[#666] leading-relaxed">
            {t(ui.contact.casualDesc)}
          </p>
          <a
            href="https://wa.me/5493834368748"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-sm font-mono text-xs uppercase tracking-wider font-semibold hover:bg-[#20bd5a] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            {t(ui.contact.casualBtn)}
          </a>
        </div>

        <div className="text-center space-y-4 pt-8 border-t border-[#1a1a1a]/10">
          <h3 className="font-serif text-2xl md:text-3xl font-light text-[#a84432] tracking-tight">
            {t(ui.contact.bottomTitle)}
          </h3>
          <div className="space-y-2">
            <p className="font-sans text-sm text-[#555] leading-relaxed">
              {t(ui.contact.bottom1)}
            </p>
            <p className="font-sans text-sm text-[#555] leading-relaxed">
              {t(ui.contact.bottom2)}
            </p>
            <p className="font-sans text-sm text-[#555] leading-relaxed pt-2">
              {t(ui.contact.bottom3)}
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
