import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execFileSync } from 'child_process';
import { PAGES, PROJECTS, JOURNAL, NO_COVER_PROJECTS } from './routes.mjs';

const site = JSON.parse(readFileSync(new URL('../site.config.json', import.meta.url), 'utf8'));
const BASE = site.url.replace(/\/+$/, '');

/**
 * `lastmod` no es la fecha del build. Con `new Date()`, cada despliegue
 * reescribía las 48 fechas, así que Google veía que todas las páginas cambiaban
 * en cada push aunque el contenido fuera idéntico. Va la fecha del último
 * commit que tocó contenido publicable; si no hay git (build en tarball) cae al
 * build date, que es mejor que romper.
 */
function lastmod() {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs'], {
      cwd: new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'),
      stdio: ['ignore', 'pipe', 'ignore'],
      encoding: 'utf8',
    }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(out)) return out;
  } catch {
    // sin git: seguimos con la fecha del build
  }
  return new Date().toISOString().slice(0, 10);
}

const LASTMOD = lastmod();

// Guard: every project must have a cover .jpg or an explicit no-cover fallback,
// otherwise its og:image would 404 in the prerendered HTML.
function verifyCovers() {
  const dir = 'public/projects';
  const missing = PROJECTS.filter(id => {
    if (NO_COVER_PROJECTS.has(id)) return false;
    return !existsSync(`${dir}/${id}.jpg`);
  });
  if (missing.length > 0) {
    console.error(`ERROR: project cover(s) missing or not declared in NO_COVER_PROJECTS: ${missing.join(', ')}`);
    console.error('Add the cover as public/projects/<id>.jpg, or declare it in scripts/routes.mjs NO_COVER_PROJECTS.');
    process.exit(1);
  }
}

/**
 * Guard de galerías. `src/data/gallery.ts` declara cuántos screenshots tiene
 * cada proyecto y el componente construye las rutas a partir de ese número, así
 * que un conteo inflado produce botones que abren un 404. Este es el único
 * lugar donde se puede detectar sin abrir el navegador.
 */
function verifyGalleries() {
  const source = readFileSync('src/data/gallery.ts', 'utf8');
  const block = source.match(/GALLERY_COUNTS[^=]*=\s*\{([^}]*)\}/);
  if (!block) {
    console.error('ERROR: no se pudo leer GALLERY_COUNTS de src/data/gallery.ts');
    process.exit(1);
  }

  const declared = new Map();
  for (const line of block[1].split('\n')) {
    const match = line.match(/^\s*'([^']+)'\s*:\s*(\d+)\s*,?\s*$/);
    if (match) declared.set(match[1], Number(match[2]));
  }

  const problems = [];

  for (const [id, count] of declared) {
    if (!PROJECTS.includes(id)) {
      problems.push(`galería declarada para "${id}", que no está en PROJECTS`);
    }
    for (let i = 1; i <= count; i++) {
      const file = `public/projects/${id}/${String(i).padStart(2, '0')}.webp`;
      if (!existsSync(file)) problems.push(`falta ${file}`);
    }
  }

  for (const id of PROJECTS) {
    if (!declared.has(id)) problems.push(`"${id}" no declara galería en gallery.ts`);
  }

  if (problems.length > 0) {
    console.error('ERROR: inconsistencias entre src/data/gallery.ts y public/projects/:');
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
}

verifyCovers();
verifyGalleries();

const esPaths = [
  ...PAGES,
  ...PROJECTS.map(p => `/proyectos/${p}`),
  ...JOURNAL.map(j => `/journal/${j}`),
];

function urlEntry(path) {
  const basePath = path === '' ? '' : path;
  const esUrl = `${BASE}${basePath}`;
  const enUrl = `${BASE}/en${basePath}`;
  const xDefaultUrl = esUrl;

  const alternates = [
    ['es', esUrl],
    ['en', enUrl],
    ['x-default', xDefaultUrl],
  ]
    .map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />`)
    .join('\n');

  const priority = path === '' ? '1.0' : path.startsWith('/proyectos/') ? '0.8' : '0.8';
  const changefreq = path.startsWith('/proyectos/') ? 'weekly' : 'monthly';

  return `  <url>
    <loc>${esUrl}</loc>
    ${alternates}
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
  <url>
    <loc>${enUrl}</loc>
    ${alternates}
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${esPaths.map(urlEntry).join('\n')}
</urlset>
`;

writeFileSync('public/sitemap.xml', sitemap);
console.log('Sitemap generated.');

// Generated next to the sitemap so the domain can never drift from site.config.json.
const robots = `User-agent: *
Allow: /
Disallow: /api/

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${BASE}/sitemap.xml
`;

writeFileSync('public/robots.txt', robots);
console.log('robots.txt generated.');