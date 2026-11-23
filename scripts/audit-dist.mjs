import fs from 'fs';
import path from 'path';

const DIST = 'dist';
const { ROUTES } = await import('./routes.mjs');

const files = [];
for (const prefix of ['', 'en']) {
  for (const route of ROUTES) {
    const p = path.join(DIST, prefix, route, 'index.html');
    const rel = `${prefix ? `/${prefix}` : ''}${route || '/'}`;
    files.push({ rel, p });
  }
}

let problems = 0;
const check = (cond, msg, rel) => {
  if (!cond) {
    problems++;
    console.log(`  ✗ ${rel}: ${msg}`);
  }
};

for (const { rel, p } of files) {
  const html = fs.readFileSync(p, 'utf8');
  const lang = rel.startsWith('/en') ? 'en' : 'es';
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] || '';
  const expectedCanonical = `https://www.gonzalodanielvega.com${rel === '/' ? '' : rel.replace(/\/$/, '')}`;
  check(canonical === expectedCanonical, `canonical ${canonical} != ${expectedCanonical}`, rel);
  const robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1] || '';
  check(robots.includes('index'), `robots ${robots}`, rel);
  check(html.includes('<html lang="' + lang + '"'), `html lang no es ${lang}`, rel);
  check(html.includes('rel="alternate" hreflang="es"'), 'falta hreflang es', rel);
  check(html.includes('rel="alternate" hreflang="en"'), 'falta hreflang en', rel);
  check(html.includes('rel="alternate" hreflang="x-default"'), 'falta hreflang x-default', rel);
  check(/<title>[^<]{10,}<\/title>/.test(html), 'title vacío', rel);
  const alt = html.match(/<meta property="og:image:alt" content="([^"]+)"/)?.[1] || '';
  if (rel.includes('/proyectos/')) {
    check(
      alt.startsWith(lang === 'en' ? 'Cover of' : 'Portada de'),
      `og:image:alt inesperado: ${alt}`,
      rel,
    );
  } else if (lang === 'en') {
    check(alt.includes('working remotely'), `og:image:alt en es: ${alt}`, rel);
  } else {
    check(alt.includes('remoto'), `og:image:alt en es: ${alt}`, rel);
  }
  const person =
    html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)?.[1] || '';
  if (lang === 'en') {
    check(person.includes('working remotely for LATAM'), 'Person JSON-LD en español', rel);
  } else {
    check(person.includes('remoto para LATAM'), 'Person JSON-LD en español no encontrado', rel);
  }
}

const checks = [
  ['/', 'Full Stack remoto', 'Busco incorporarme a un equipo Full Stack remoto'],
  ['/en', 'remote Full Stack', 'Looking for a remote Full Stack role'],
  ['/', 'INGLÉS DE TRABAJO', 'INGLÉS DE TRABAJO'],
  ['/en', 'WORKING ENGLISH', 'WORKING ENGLISH'],
  ['/sobre-mi', 'Inglés de trabajo', 'Inglés de trabajo: entiendo y escribo con soltura'],
  ['/en/sobre-mi', 'Working English', 'Working English: I read and write comfortably'],
  ['/dialogo', 'recruiter block', 'PARA RECRUITERS Y EQUIPOS'],
  ['/en/dialogo', 'recruiter block EN', 'FOR RECRUITERS AND TEAMS'],
  ['/proyectos/zabira-studio', 'Zabira demo', 'Demo funcional / Prueba de concepto'],
  ['/en/proyectos/zabira-studio', 'Zabira demo EN', 'Functional demo / Proof of concept'],
  [
    '/journal/el-problema-de-terminar',
    'journal title',
    'Por qué 15 proyectos bien explicados valen más que 70 demos',
  ],
  [
    '/en/journal/el-problema-de-terminar',
    'journal title EN',
    'Why 15 well-explained projects beat 70 demos',
  ],
  ['/proyectos/brunn-studio', 'outro CTA', '¿Querés ver cómo trabajo en equipo?'],
  ['/en/journal/hablar-con-clientes', 'outro CTA EN', 'Want to see how I work on a team?'],
  ['/zen', 'zen title', 'Un estanque para bajar el ritmo'],
  ['/en/zen', 'zen title EN', 'A pond to slow down'],
  ['/zen', 'zen HUD', 'Puntos'],
  ['/en/zen', 'zen HUD EN', 'Points'],
];

for (const [route, label, needle] of checks) {
  const html = fs.readFileSync(path.join(DIST, route, 'index.html'), 'utf8');
  check(html.includes(needle), `falta texto: ${label}`, route);
}

console.log(`\nAudit: ${files.length} rutas, ${problems} problemas.`);
process.exit(problems ? 1 : 0);
