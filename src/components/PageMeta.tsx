import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { caseStudies } from '../data/projects';
import { getProjectEn } from '../data/projects-en-lookup';
import { journalEntries } from '../data/journal';
import { SITE_URL as BASE_URL } from '../data/site';

type Lang = 'es' | 'en';

interface PageMetaInfo {
  title: string;
  description: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  type: 'website' | 'article';
}

/**
 * Preview para las rutas que no tienen una imagen propia (home, secciones y
 * notas del journal). Es 1200x630 porque el sitio declara
 * twitter:card="summary_large_image": con el 400x400 anterior la plataforma
 * recortaba la foto a un cuadrado chico y la mitad del preview quedaba vacía.
 * Los proyectos siguen usando su portada real de 1280x800, y
 * scripts/build-og-image.mjs genera este archivo en cada build.
 */
const SITE_PREVIEW = {
  image: `${BASE_URL}/og-cover.png`,
  imageWidth: 1200,
  imageHeight: 630,
};

const SITE_PREVIEW_ALT =
  'Gonzalo Daniel Vega, Full Stack Developer en Catamarca, Argentina';

const defaults: Record<string, { es: PageMetaInfo; en: PageMetaInfo }> = {
  '/': {
    es: {
      title: 'Gonzalo Daniel Vega — Full Stack Developer',
      description:
        'Portfolio profesional. Full Stack Developer con criterio de producto. React, Next.js, TypeScript, Node.js. De Catamarca, Argentina.',
      ...SITE_PREVIEW,
      type: 'website',
    },
    en: {
      title: 'Gonzalo Daniel Vega — Full Stack Developer',
      description:
        'Professional portfolio. Full Stack Developer with a product mindset. React, Next.js, TypeScript, Node.js. From Catamarca, Argentina.',
      ...SITE_PREVIEW,
      type: 'website',
    },
  },
  '/proyectos': {
    es: {
      title: 'Proyectos — Gonzalo Daniel Vega | Full Stack Developer',
      description:
        '15 proyectos de desarrollo web: demos conceptuales, herramientas, clientes reales. React, Next.js, Astro, Node.js, TypeScript, PostgreSQL.',
      ...SITE_PREVIEW,
      type: 'website',
    },
    en: {
      title: 'Projects — Gonzalo Daniel Vega | Full Stack Developer',
      description:
        '15 web development projects: concept demos, tools, real clients. React, Next.js, Astro, Node.js, TypeScript, PostgreSQL.',
      ...SITE_PREVIEW,
      type: 'website',
    },
  },
  '/journal': {
    es: {
      title: 'Journal — Gonzalo Daniel Vega | Notas de Campo',
      description:
        'Notas de campo sobre desarrollo web, arquitectura de software, experiencia de usuario y criterio técnico.',
      ...SITE_PREVIEW,
      type: 'website',
    },
    en: {
      title: 'Journal — Gonzalo Daniel Vega | Field Notes',
      description:
        'Field notes on web development, software architecture, user experience, and technical judgment.',
      ...SITE_PREVIEW,
      type: 'website',
    },
  },
  '/sobre-mi': {
    es: {
      title: 'Sobre mí — Gonzalo Daniel Vega | Full Stack Developer',
      description:
        'Full Stack Developer. Estudiante de Ingeniería en Informática. UXnicorp. Catamarca, Argentina.',
      ...SITE_PREVIEW,
      type: 'website',
    },
    en: {
      title: 'About me — Gonzalo Daniel Vega | Full Stack Developer',
      description:
        'Full Stack Developer. Computer Engineering student. UXnicorp. Catamarca, Argentina.',
      ...SITE_PREVIEW,
      type: 'website',
    },
  },
  '/dialogo': {
    es: {
      title: 'Contacto — Gonzalo Daniel Vega | Full Stack Developer',
      description:
        'Escribime para charlar sobre tu proyecto, idea o problema técnico. Respondo personalmente.',
      ...SITE_PREVIEW,
      type: 'website',
    },
    en: {
      title: 'Contact — Gonzalo Daniel Vega | Full Stack Developer',
      description:
        'Write to me to talk about your project, idea, or technical problem. I reply personally.',
      ...SITE_PREVIEW,
      type: 'website',
    },
  },
};

function roundPath(pathname: string): string {
  return pathname.replace(/^\/en/, '') || '/';
}

// Unknown paths render NotFound but still answer with a 200 status, because the SPA
// catch-all rewrite in vercel.json sends everything to index.html. Without noindex,
// typo'd URLs get indexed as duplicates of the page they fall back to.
function isIndexable(pathname: string): boolean {
  const base = roundPath(pathname);
  if (base === '/' || ['/proyectos', '/journal', '/sobre-mi', '/dialogo'].includes(base)) return true;
  if (base.startsWith('/proyectos/')) return caseStudies.some(p => p.id === base.slice('/proyectos/'.length));
  if (base.startsWith('/journal/')) return journalEntries.some(e => e.id === base.slice('/journal/'.length));
  return false;
}

function getMeta(pathname: string, lang: Lang): PageMetaInfo {
  const base = roundPath(pathname);
  const localized = (key: string) => defaults[key]?.[lang] ?? defaults['/'][lang];

  if (base === '/') return localized('/');

  if (base.startsWith('/proyectos/')) {
    const id = base.replace('/proyectos/', '');
    const project = lang === 'en' ? (getProjectEn(id) || caseStudies.find(p => p.id === id)) : caseStudies.find(p => p.id === id);
    if (project) {
      // La portada se resuelve siempre contra los datos en español: `screenshot` es
      // la captura propia del proyecto y `url` la captura automatica. No cambia con
      // el idioma, asi que no tiene por qué leerse del set en inglés.
      const esProject = caseStudies.find(p => p.id === id);
      const cover = esProject?.screenshot ?? (esProject?.url ? `/projects/${id}.jpg` : null);
      return {
        title: `${project.title} — Gonzalo Daniel Vega`,
        description: `${project.tagline} | ${project.tools.join(', ')}`,
        image: cover ? `${BASE_URL}${cover}` : SITE_PREVIEW.image,
        imageWidth: cover ? 1280 : SITE_PREVIEW.imageWidth,
        imageHeight: cover ? 800 : SITE_PREVIEW.imageHeight,
        type: 'website',
      };
    }
    return localized('/proyectos');
  }
  if (base === '/proyectos') return localized('/proyectos');

  if (base.startsWith('/journal/')) {
    const id = base.replace('/journal/', '');
    const entry = journalEntries.find(e => e.id === id);
    if (entry) {
      const title = lang === 'en' && entry.titleEn ? entry.titleEn : entry.title;
      const description = lang === 'en' && entry.taglineEn ? entry.taglineEn : entry.tagline;
      return {
        title: `${title} — Gonzalo Daniel Vega`,
        description,
        image: SITE_PREVIEW.image,
        imageWidth: SITE_PREVIEW.imageWidth,
        imageHeight: SITE_PREVIEW.imageHeight,
        type: 'article',
      };
    }
    return localized('/journal');
  }
  if (base === '/journal') return localized('/journal');

  if (base === '/sobre-mi') return localized('/sobre-mi');
  if (base === '/dialogo') return localized('/dialogo');

  return localized('/');
}

/**
 * Texto alternativo del preview. Para un proyecto es su nombre (la imagen es su
 * portada); para el resto, la tarjeta de presentación del sitio.
 */
function imageAltFor(pathname: string, meta: PageMetaInfo): string {
  const base = roundPath(pathname);
  if (base.startsWith('/proyectos/')) {
    const project = caseStudies.find(p => p.id === base.slice('/proyectos/'.length));
    if (project) return `Portada de ${project.title}`;
  }
  if (meta.image === SITE_PREVIEW.image) return SITE_PREVIEW_ALT;
  return meta.title;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertAlternate(hreflang: string, href: string) {
  const selector = `link[rel="alternate"][hreflang="${hreflang}"]`;
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'alternate');
    el.setAttribute('hreflang', hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(json: object) {
  const selector = 'script[data-pagemeta="route"]';
  document.querySelectorAll(selector).forEach(el => el.remove());
  if (!json) return;
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-pagemeta', 'route');
  script.textContent = JSON.stringify(json);
  document.head.appendChild(script);
}

function buildJsonLd(pathname: string, lang: Lang, meta: PageMetaInfo) {
  const url = pathname === '/' ? BASE_URL : `${BASE_URL}${pathname}`;
  const base = roundPath(pathname);

  if (base.startsWith('/journal/')) {
    const id = base.replace('/journal/', '');
    const entry = journalEntries.find(e => e.id === id);
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: meta.title,
      description: meta.description,
      datePublished: entry?.date,
      author: { '@type': 'Person', name: 'Gonzalo Daniel Vega', url: BASE_URL },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    };
  }

  if (base.startsWith('/proyectos/')) {
    const id = base.replace('/proyectos/', '');
    const project = caseStudies.find(p => p.id === id);
    return {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project?.title,
      description: meta.description,
      image: meta.image,
      url,
      author: { '@type': 'Person', name: 'Gonzalo Daniel Vega', url: BASE_URL },
      inLanguage: lang === 'en' ? 'en' : 'es',
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: meta.title,
    description: meta.description,
    url,
    inLanguage: lang === 'en' ? 'en' : 'es',
    isPartOf: { '@type': 'WebSite', name: 'Gonzalo Daniel Vega', url: BASE_URL },
  };
}

export default function PageMeta() {
  const location = useLocation();
  const lang: Lang = location.pathname.startsWith('/en') ? 'en' : 'es';

  useEffect(() => {
    const pathname = location.pathname;
    const meta = getMeta(pathname, lang);
    const indexable = isIndexable(pathname);
    // Unknown paths collapse onto the homepage, so no self-referencing canonical
    // and no hreflang pointing at a URL that should not exist.
    const base = indexable ? roundPath(pathname) : '/';
    const canonicalUrl = !indexable || pathname === '/' ? BASE_URL : `${BASE_URL}${pathname}`;
    const alternateEs = base === '/' ? BASE_URL : `${BASE_URL}${base}`;
    const alternateEn = base === '/' ? `${BASE_URL}/en` : `${BASE_URL}/en${base}`;

    document.documentElement.lang = lang;
    document.title = meta.title;

    upsertMeta('name', 'description', meta.description);
    upsertMeta('name', 'robots', isIndexable(pathname) ? 'index, follow' : 'noindex, follow');
    upsertMeta('property', 'og:title', meta.title);
    upsertMeta('property', 'og:description', meta.description);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', meta.image);
    upsertMeta('property', 'og:image:width', String(meta.imageWidth));
    upsertMeta('property', 'og:image:height', String(meta.imageHeight));
    // Sin alt, el preview se publica como imagen vacia: los lectores de
    // pantalla no tienen nada que leer y las plataformas lo adivinan.
    const imageAlt = imageAltFor(pathname, meta);
    upsertMeta('property', 'og:image:alt', imageAlt);
    upsertMeta('property', 'og:type', meta.type);
    upsertMeta('property', 'og:locale', lang === 'es' ? 'es_AR' : 'en_US');
    upsertMeta('property', 'og:locale:alternate', lang === 'es' ? 'en_US' : 'es_AR');
    upsertMeta('name', 'twitter:title', meta.title);
    upsertMeta('name', 'twitter:description', meta.description);
    upsertMeta('name', 'twitter:image', meta.image);
    upsertMeta('name', 'twitter:image:alt', imageAlt);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', canonicalUrl);

    upsertAlternate('es', alternateEs);
    upsertAlternate('en', alternateEn);
    upsertAlternate('x-default', alternateEs);

    upsertJsonLd(buildJsonLd(pathname, lang, meta));
  }, [location.pathname, lang]);

  return null;
}