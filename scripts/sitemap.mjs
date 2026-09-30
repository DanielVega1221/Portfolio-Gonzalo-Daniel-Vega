import { readFileSync, writeFileSync, existsSync } from 'fs';
import { PAGES, PROJECTS, JOURNAL, NO_COVER_PROJECTS } from './routes.mjs';

const site = JSON.parse(readFileSync(new URL('../site.config.json', import.meta.url), 'utf8'));
const BASE = site.url.replace(/\/+$/, '');
const LASTMOD = new Date().toISOString().slice(0, 10);

// Guard: every project must have a cover .jpg or an explicit no-cover fallback,
// otherwise its og:image would 404 in the prerendered HTML.
function verifyCovers() {
  const dir = 'public/projects';
  const missing = PROJECTS.filter(id => {
    if (NO_COVER_PROJECTS.has(id)) return false;
    return !existsSync(`${dir}/${id}.jpg`);
  });
  if (missing.length > 0) {
    console.log(`ERROR: project cover(s) missing or not declared in NO_COVER_PROJECTS: ${missing.join(', ')}`);
    console.log('Add the cover as public/projects/<id>.jpg, or declare it in scripts/routes.mjs NO_COVER_PROJECTS.');
    process.exit(1);
  }
}

verifyCovers();

const esPaths = [
  ...PAGES,
  ...PROJECTS.map(p => `/proyectos/${p}`),
  ...JOURNAL.map(j => `/journal/${j}`),
];

function hangul(path) {
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
${esPaths.map(hangul).join('\n')}
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