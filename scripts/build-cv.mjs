import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const OUT_DIR = path.resolve('public');
const ACCENT = rgb(0.66, 0.27, 0.2);
const INK = rgb(0.1, 0.1, 0.1);
const MUTED = rgb(0.35, 0.35, 0.35);
const LIGHT = rgb(0.9, 0.89, 0.86);

const copy = {
  es: {
    file: 'cv-es.pdf',
    name: 'Gonzalo Daniel Vega',
    role: 'Full Stack Developer',
    location: 'San Fernando del Valle de Catamarca, Catamarca, Argentina',
    contact: 'dvega6442@gmail.com | +54 9 383 4368748 | linkedin.com/in/gonzalo-daniel-vega',
    summaryTitle: 'RESUMEN PROFESIONAL',
    summary:
      'Full Stack Developer con 2 años de experiencia y proyectos entregados en React, Next.js, TypeScript y Node.js para clientes reales de rubros industriales, educativos y comerciales. Formo parte de UXnicorp, un equipo de tres desarrolladores, donde manejo el ciclo completo de cada proyecto: relevamiento de requerimientos, diseño de interfaces, desarrollo frontend y backend, y comunicación directa con el cliente. Busco incorporarme de forma estable a un equipo de desarrollo remoto para LATAM o proyectos internacionales; UXnicorp continúa funcionando como proyecto paralelo. Disponible, GMT-3 (Argentina). Estudiante avanzado de Ingeniería en Informática en la UNCA.',
    stackTitle: 'STACK TÉCNICO',
    stack: [
      'Frontend: React, Next.js, Astro, Vite, TypeScript, JavaScript (Vanilla), React Router, TanStack Query',
      'Estilos: Tailwind CSS, CSS Modules, CSS vanilla',
      'Backend: Node.js, Express, REST APIs',
      'Bases de datos: PostgreSQL, MongoDB',
      'ORMs: Prisma, Drizzle',
      'Auth: JWT (httpOnly cookies), rate limiting',
      'Animación: Framer Motion / Motion, GSAP, Lenis',
      'Herramientas: Git, Vercel, Playwright, Cypress, Postman, Sharp, Resend, Cloudinary, MercadoPago SDK',
    ],
    experienceTitle: 'EXPERIENCIA',
    experienceRole: 'Full Stack Developer — UXnicorp',
    experienceMeta: '2024 — Presente | Catamarca, Argentina (remoto)',
    experienceIntro:
      'Equipo de desarrollo formado por 3 programadores, en proceso de formalización. Participo en todas las etapas del proyecto, tanto de forma individual como en colaboración directa con mis compañeros:',
    experience: [
      'Trabajo en equipo: nos organizamos en pareja o rotando según el proyecto, repartiendo módulos entre los tres y después integrando el trabajo en conjunto. Usamos un flujo de Git con ramas y revisión cruzada, con un proceso entre formal e informal.',
      'Desarrollo frontend y backend: React, Next.js, Astro, TypeScript, Node.js, Express, PostgreSQL, MongoDB. Desde landings editoriales hasta sistemas full-stack con autenticación, bases de datos y pasarelas de pago.',
      'Decisiones técnicas: elijo stacks, defino arquitecturas y metodologías para cada proyecto en función del problema real, no de modas.',
      'Diseño de interfaces: defino paletas, tipografías, jerarquías visuales y maqueto las interfaces completas antes de escribir código.',
      'Comunicación con clientes: levanto requerimientos, explico decisiones técnicas sin jerga, gestiono expectativas sobre plazos y alcances.',
      'Gestión de proyecto y liderazgo informal: sin ostentar el título, suelo ser quien define prioridades, ayuda a organizar la gestión del equipo y destraba decisiones cuando hace falta avanzar.',
      'Búsqueda de clientes: identifico negocios que se beneficiarían de lo que hacemos, los contacto y presento propuestas. 5 clientes reales con resultados medibles.',
    ],
    deliveredTitle: 'PROYECTOS ENTREGADOS',
    delivered: [
      [
        'PATAgenda — Agenda de sumarios docentes — Mayo 2026',
        'Cliente: Docente del Ministerio de Educación | React, Vite, TanStack Query, Express, Prisma ORM, PostgreSQL, JWT httpOnly',
        'Impacto: pasó de papel y Excel sin trazabilidad a un sistema web con cero vencimientos legales olvidados.',
      ],
      [
        'ElectroPower — Presencia digital industrial — Noviembre 2025',
        'Cliente: Empresa de servicios eléctricos industriales | React, Vite, React Router, GSAP, CSS vanilla',
        'Impacto: pasó de no tener presencia digital a un sitio con posicionamiento local y flujo directo de contacto vía WhatsApp.',
      ],
      [
        'Jimena Vilte Nail Artist — Landing editorial — Mayo 2026',
        'Cliente: Marca personal de nail art | Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Lenis',
        'Impacto: pasó de competir solo en Instagram a una landing editorial propia que le permitió subir sus tarifas.',
      ],
      [
        'Instituto ISDEP — Plataforma educativa — Diciembre 2025 — Presente',
        'Cliente: Instituto de grafología y ciencias forenses | React, Vite, React Router, Framer Motion, SwiperJS, Cloudinary, Resend',
        'Impacto: pasó de no tener presencia digital a un catálogo online de 17 cursos con SEO posicionado en su nicho.',
      ],
      [
        'Comercial Río Hondo — Web de cantera — Febrero 2026',
        'Cliente: Cantera santiagueña de áridos para construcción | React, Vite, CSS vanilla, WhatsApp',
        'Impacto: pasó de no tener presencia online a su primera web, con catálogo de productos y posicionamiento local.',
      ],
    ],
    personalTitle: 'PROYECTOS PERSONALES',
    personal: [
      [
        'Zabira Studio — Demo funcional / prueba de concepto (2026)',
        'React, Vite, Node.js, Express, MongoDB, MercadoPago SDK, JWT, CSS vanilla',
        'Landing pública de marca separada de un dashboard interno con roles. Motor de reservas atómico con operaciones de MongoDB ($expr, findOneAndUpdate, subdocumentos embebidos) para resolver concurrencia. Membresías vía webhooks de MercadoPago y autenticación JWT. Cliente se bajó por presupuesto: quedó como demo, sin usuarios reales.',
      ],
      [
        'Content Studio — Motor de plantillas (2026)',
        'React, TypeScript, Express, Drizzle ORM, libSQL, Monaco Editor, html-to-image, JSZip, Zustand',
        'Herramienta interna de UXnicorp para crear y exportar carruseles e imágenes de redes. Templates tipados, renderizado en iframe aislado y exportación 100% client-side.',
      ],
      [
        'MyVisor — Lector de Markdown (2026)',
        'Vanilla JS, Vite, File System Access API, marked, DOMPurify',
        'Lector de Markdown sin backend ni cuentas, con foco en la ergonomía de lectura prolongada.',
      ],
      [
        'UXnicorp Academy — Curso de desarrollo web (2025)',
        'Astro (Islands Architecture), React, Tailwind CSS, MDX',
        'Plataforma educativa Zero-JS para onboardear desarrolladores con carga instantánea y componentes interactivos aislados.',
      ],
      [
        'La Página de UXnicorp — Sitio de la agencia (2026)',
        'Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Lenis',
        'Sitio de la agencia con UX Score, una herramienta interactiva de diagnóstico que funciona como lead magnet.',
      ],
    ],
    educationTitle: 'EDUCACIÓN',
    education:
      'Ingeniería en Informática — Universidad Nacional de Catamarca (UNCA)\n2018 — Presente (3er año en curso)\nFormación autodidacta complementaria: React, Next.js, TypeScript, Node.js, Express, PostgreSQL, MongoDB, Tailwind CSS, Astro, y testing manual y automatizado (QA) con Cypress y Postman. Aprendidos mediante proyectos reales y documentación técnica. Sin cursos formales ni certificaciones externas.',
    skillsTitle: 'COMPETENCIAS',
    skills: [
      'Desarrollo full-stack de extremo a extremo (frontend, backend, base de datos, deploy).',
      'Toma de decisiones de arquitectura y stack en función del problema, no de tendencias.',
      'Modelado de dominio: requisitos de negocio complejos a estructuras de datos y flujos de usuario.',
      'Diseño de sistemas concurrentes con operaciones atómicas de base de datos, sin colas ni locks.',
      'Integración de pagos: webhooks y SDKs de MercadoPago para activación de membresías y control de acceso.',
      'SEO técnico: meta tags dinámicos, JSON-LD, prerendering y Core Web Vitals.',
      'Performance web: code splitting, lazy loading, optimización de imágenes y fuentes self-hosted.',
      'Accesibilidad: contraste WCAG AA, navegación por teclado, aria labels, reduced motion.',
      'Internacionalización (i18n): portfolio bilingüe español-inglés.',
      'Testing y QA: Cypress, testing exploratorio y APIs con Postman, en aplicación progresiva a proyectos de clientes.',
      'Comunicación con no técnicos y propiedad del proyecto: explico decisiones sin jerga y me importa que el resultado tenga sentido para el negocio.',
    ],
    languagesTitle: 'IDIOMAS',
    languages:
      'Español — Nativo | Inglés — Inglés de trabajo: entiendo y escribo con soltura y participo en reuniones técnicas sin problema. La fluidez al hablar es lo que sigo mejorando.',
    testimonialsTitle: 'TESTIMONIOS',
    testimonials: [
      '"Gonzalo me armó una web que transmite exactamente lo que quería. Mis clientas entran y ya entienden de qué se trata mi trabajo. Me diferencia de todas las cuentas de Instagram que hacen lo mismo." — Jimena Vilte, Nail Artist',
      '"Muchas gracias por la página, estoy muy conforme con su trabajo, muy serio." — Comercial Río Hondo, Cantera · Áridos · Construcción',
    ],
    linksTitle: 'PORTFOLIO Y ENLACES',
    links:
      'Portfolio: gonzalodanielvega.com | GitHub: github.com/DanielVega1221 | LinkedIn: linkedin.com/in/gonzalo-daniel-vega',
  },
  en: {
    file: 'cv-en.pdf',
    name: 'Gonzalo Daniel Vega',
    role: 'Full Stack Developer',
    location: 'San Fernando del Valle de Catamarca, Catamarca, Argentina',
    contact: 'dvega6442@gmail.com | +54 9 383 4368748 | linkedin.com/in/gonzalo-daniel-vega',
    summaryTitle: 'PROFESSIONAL SUMMARY',
    summary:
      'Full Stack Developer with 2 years of experience delivering projects in React, Next.js, TypeScript and Node.js for real clients across industrial, educational and commercial sectors. Part of UXnicorp, a three-person development team, where I handle the full project cycle: requirements gathering, interface design, frontend and backend development, and direct client communication. Looking for a stable Full Stack role on a remote LATAM or international team; UXnicorp continues as a parallel project. Available, GMT-3 (Argentina). Advanced Computer Engineering student at UNCA.',
    stackTitle: 'TECHNICAL STACK',
    stack: [
      'Frontend: React, Next.js, Astro, Vite, TypeScript, JavaScript (Vanilla), React Router, TanStack Query',
      'Styling: Tailwind CSS, CSS Modules, vanilla CSS',
      'Backend: Node.js, Express, REST APIs',
      'Databases: PostgreSQL, MongoDB',
      'ORMs: Prisma, Drizzle',
      'Auth: JWT (httpOnly cookies), rate limiting',
      'Animation: Framer Motion / Motion, GSAP, Lenis',
      'Tools: Git, Vercel, Playwright, Cypress, Postman, Sharp, Resend, Cloudinary, MercadoPago SDK',
    ],
    experienceTitle: 'EXPERIENCE',
    experienceRole: 'Full Stack Developer — UXnicorp',
    experienceMeta: '2024 — Present | Catamarca, Argentina (remote)',
    experienceIntro:
      'Development team made up of 3 programmers, currently formalizing as a company. I take part in every stage of the project, both individually and in direct collaboration with my teammates:',
    experience: [
      'Team collaboration: we pair up or rotate depending on the project, splitting modules and then integrating the work together. We use a Git workflow with branches and cross-reviews.',
      'Frontend and backend development: React, Next.js, Astro, TypeScript, Node.js, Express, PostgreSQL, MongoDB. From editorial landing pages to full-stack systems with authentication, databases and payment gateways.',
      'Technical decisions: I choose stacks and define architectures based on the real problem, not on trends.',
      'Interface design: I define palettes, typography and visual hierarchy, and lay out full interfaces before writing code.',
      'Client communication: I gather requirements, explain technical decisions without jargon, and manage expectations around timelines and scope.',
      'Project management and informal leadership: without holding the title, I usually set priorities, help organize the team, and unblock decisions when needed.',
      'Client outreach: I identify businesses that would benefit from what we do and present proposals. 5 real clients with measurable results.',
    ],
    deliveredTitle: 'DELIVERED PROJECTS',
    delivered: [
      [
        'PATAgenda — Teacher disciplinary case tracker — May 2026',
        'Client: Ministry of Education teacher | React, Vite, TanStack Query, Express, Prisma ORM, PostgreSQL, JWT httpOnly',
        'Impact: went from paper and Excel with no traceability to a web system with zero missed legal deadlines.',
      ],
      [
        'ElectroPower — Industrial digital presence — November 2025',
        'Client: Industrial electrical services company | React, Vite, React Router, GSAP, vanilla CSS',
        'Impact: went from no digital presence to a site with local search ranking and a direct WhatsApp contact flow.',
      ],
      [
        'Jimena Vilte Nail Artist — Editorial landing page — May 2026',
        'Client: Personal nail art brand | Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Lenis',
        'Impact: went from competing only on Instagram to an editorial landing page that let her raise her rates.',
      ],
      [
        'Instituto ISDEP — Educational platform — December 2025 — Present',
        'Client: Graphology and forensic sciences institute | React, Vite, React Router, Framer Motion, SwiperJS, Cloudinary, Resend',
        'Impact: went from no digital presence to an online catalog of 17 courses with SEO ranking in its niche.',
      ],
      [
        'Comercial Río Hondo — Quarry website — February 2026',
        'Client: Santiago del Estero aggregates quarry | React, Vite, vanilla CSS, WhatsApp',
        'Impact: went from no online presence to its first website, with a product catalog and local search ranking.',
      ],
    ],
    personalTitle: 'PERSONAL PROJECTS',
    personal: [
      [
        'Zabira Studio — Functional demo / proof of concept (2026)',
        'React, Vite, Node.js, Express, MongoDB, MercadoPago SDK, JWT, vanilla CSS',
        'Public brand landing separate from an internal dashboard with roles. Atomic booking engine using MongoDB operations ($expr, findOneAndUpdate, embedded subdocuments) to solve concurrency. Memberships via MercadoPago webhooks and JWT authentication. The client pulled out for budget reasons: it stayed as a demo with no real users.',
      ],
      [
        'Content Studio — Template engine (2026)',
        'React, TypeScript, Express, Drizzle ORM, libSQL, Monaco Editor, html-to-image, JSZip, Zustand',
        'Internal UXnicorp tool to create and export social media carousels. Typed templates, isolated iframe rendering and fully client-side export.',
      ],
      [
        'MyVisor — Markdown reader (2026)',
        'Vanilla JS, Vite, File System Access API, marked, DOMPurify',
        'Markdown reader with no backend and no accounts, focused on the ergonomics of prolonged reading.',
      ],
      [
        'UXnicorp Academy — Web development course (2025)',
        'Astro (Islands Architecture), React, Tailwind CSS, MDX',
        'Zero-JS educational platform to onboard developers with instant loading and isolated interactive components.',
      ],
      [
        "UXnicorp's own website (2026)",
        'Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Lenis',
        "The agency's site, featuring UX Score, an interactive diagnostic tool that works as a lead magnet.",
      ],
    ],
    educationTitle: 'EDUCATION',
    education:
      'Computer Engineering — Universidad Nacional de Catamarca (UNCA)\n2018 — Present (3rd year in progress)\nSelf-taught training: React, Next.js, TypeScript, Node.js, Express, PostgreSQL, MongoDB, Tailwind CSS, Astro, and manual and automated testing (QA) with Cypress and Postman. Learned through real projects and documentation. No formal courses or external certifications.',
    skillsTitle: 'COMPETENCIES',
    skills: [
      'End-to-end full-stack development (frontend, backend, database, deploy).',
      'Architecture and stack decision-making based on the problem, not trends.',
      'Domain modeling: complex business requirements into data structures and user flows.',
      'Concurrent systems design with atomic database operations, no queues or locks.',
      'Payment integration: MercadoPago webhooks and SDKs for membership activation and access control.',
      'Technical SEO: dynamic meta tags, JSON-LD, prerendering and Core Web Vitals.',
      'Web performance: code splitting, lazy loading, image optimization and self-hosted fonts.',
      'Accessibility: WCAG AA contrast, keyboard navigation, aria labels, reduced motion.',
      'Internationalization (i18n): bilingual Spanish-English portfolio.',
      'Testing and QA: Cypress, exploratory testing and APIs with Postman, progressively applied to client projects.',
      'Communicating with non-technical people and project ownership: plain language and business-conscious results.',
    ],
    languagesTitle: 'LANGUAGES',
    languages:
      "Spanish — Native | English — Working English: I read and write comfortably and take part in technical calls. Speaking fluency is what I'm still polishing.",
    testimonialsTitle: 'TESTIMONIALS',
    testimonials: [
      '"Gonzalo built me a website that communicates exactly what I wanted. My clients come in and immediately understand what my work is about. It sets me apart from all the Instagram accounts doing the same thing." — Jimena Vilte, Nail Artist',
      '"Thank you very much for the website, I\'m very satisfied with your work, very professional." — Comercial Río Hondo, Quarry · Aggregates · Construction',
    ],
    linksTitle: 'PORTFOLIO & LINKS',
    links:
      'Portfolio: gonzalodanielvega.com | GitHub: github.com/DanielVega1221 | LinkedIn: linkedin.com/in/gonzalo-daniel-vega',
  },
};

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 42;
const CONTENT_W = PAGE_W - MARGIN * 2;

export async function buildCv(lang) {
  const c = copy[lang];
  const doc = await PDFDocument.create();
  doc.setTitle(`${c.name} — ${c.role}`);
  doc.setAuthor(c.name);
  doc.setSubject(c.role);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page = doc.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - 42;
  const size = 9;
  const leading = 12;

  const newPage = () => {
    page = doc.addPage([PAGE_W, PAGE_H]);
    y = PAGE_H - 42;
  };
  const ensure = (height) => {
    if (y - height < 40) newPage();
  };
  const wrap = (text, font, fontSize, width) => {
    const words = text.split(/\s+/);
    const lines = [];
    let line = '';
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, fontSize) <= width || !line) {
        line = candidate;
      } else {
        lines.push(line);
        line = word;
      }
    }
    if (line) lines.push(line);
    return lines;
  };
  const text = (str, opts = {}) => {
    const font = opts.bold ? bold : regular;
    const fontSize = opts.size || size;
    const fontLeading = opts.leading || leading;
    const lines = wrap(str, font, fontSize, opts.width || CONTENT_W);
    ensure(lines.length * fontLeading + (opts.after || 0));
    for (const line of lines) {
      page.drawText(line, {
        x: opts.x || MARGIN,
        y,
        font,
        size: fontSize,
        color: opts.color || INK,
      });
      y -= fontLeading;
    }
    y -= opts.after || 0;
  };
  const rule = () => {
    ensure(12);
    y -= 3;
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_W - MARGIN, y },
      thickness: 0.6,
      color: LIGHT,
    });
    y -= 9;
  };
  const section = (title) => {
    ensure(28);
    y -= 4;
    text(title, { bold: true, size: 10, color: ACCENT, after: 6 });
  };

  text(c.name, { bold: true, size: 18, color: INK, after: 2 });
  text(c.role, { size: 11, color: ACCENT, after: 2 });
  text(c.location, { size: 8.5, color: MUTED, after: 1 });
  text(c.contact, { size: 8.5, color: MUTED, after: 1 });
  text('gonzalodanielvega.com', { size: 8.5, color: MUTED, after: 6 });
  rule();

  section(c.summaryTitle);
  text(c.summary, { after: 6 });

  section(c.stackTitle);
  for (const item of c.stack) text(`• ${item}`, { size: 8.8, leading: 11.5, after: 1 });

  section(c.experienceTitle);
  text(c.experienceRole, { bold: true, size: 10, after: 1 });
  text(c.experienceMeta, { size: 8.5, color: MUTED, after: 4 });
  text(c.experienceIntro, { after: 3 });
  for (const item of c.experience) text(`• ${item}`, { size: 8.8, leading: 11.5, after: 2 });

  section(c.deliveredTitle);
  for (const [title, meta, impact] of c.delivered) {
    text(title, { bold: true, size: 9.5, after: 1 });
    text(meta, { size: 8.3, color: MUTED, after: 2 });
    text(impact, { size: 8.8, leading: 11.5, after: 4 });
  }

  section(c.personalTitle);
  for (const [title, stack, desc] of c.personal) {
    text(title, { bold: true, size: 9.5, after: 1 });
    text(stack, { size: 8.3, color: MUTED, after: 2 });
    text(desc, { size: 8.8, leading: 11.5, after: 4 });
  }

  section(c.educationTitle);
  for (const line of c.education.split('\n')) text(line, { size: 8.8, leading: 11.5, after: 1 });

  section(c.skillsTitle);
  for (const line of c.skills) text(`• ${line}`, { size: 8.8, leading: 11.5, after: 1 });

  section(c.languagesTitle);
  text(c.languages, { after: 6 });

  section(c.testimonialsTitle);
  for (const item of c.testimonials) text(item, { size: 8.8, leading: 11.5, after: 4 });

  section(c.linksTitle);
  text(c.links, { size: 8.5, after: 2 });

  const out = path.join(OUT_DIR, c.file);
  fs.writeFileSync(out, await doc.save());
  console.log(`${c.file}: ${doc.getPageCount()} páginas`);
}

await buildCv('es');
await buildCv('en');
