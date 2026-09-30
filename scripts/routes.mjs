// Single source of truth for routes shared by sitemap.mjs and prerender.mjs.
// Keep in sync with src/data/projects.ts, src/data/projects-en-lookup.ts and src/data/journal.ts.

export const PAGES = [
  '',
  '/proyectos',
  '/journal',
  '/sobre-mi',
  '/dialogo',
];

export const PROJECTS = [
  'brunn-studio', 'lumen', 'marea', 'stro-atelier', 'zabira-studio',
  'content-studio', 'uxnicorp-academy', 'la-pagina-de-uxnicorp', 'myvisor',
  'electropower', 'jimena-vilte', 'patagenda', 'ducksale', 'comercial-rio-hondo', 'isdep',
];

export const JOURNAL = [
  'el-problema-de-terminar',
  'como-empece-a-programar',
  'de-la-facultad-a-productos',
  'hablar-con-clientes',
];

// Projects without a published cover .jpg: PageMeta.tsx falls back to /foto.png
// for their og:image (NO_COVER_PROJECTS must match this list).
export const NO_COVER_PROJECTS = new Set(['content-studio']);

export const ROUTES = [
  ...PAGES,
  ...PROJECTS.map(p => `/proyectos/${p}`),
  ...JOURNAL.map(j => `/journal/${j}`),
];