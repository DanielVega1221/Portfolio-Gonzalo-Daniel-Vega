/**
 * Smoke test de las funciones de `api/`.
 *
 * Existe por un 500 en producción que llegó con el build en verde: `api/contact.ts`
 * hacía `import site from '../site.config.json'`. TypeScript lo acepta (tsconfig usa
 * `moduleResolution: bundler`) y Vite procesa ese import sin problema, así que lint,
 * `tsc` y `vite build` los dan por buenos. Pero en Vercel la función corre como ESM
 * nativo y Node 22+ rechaza un JSON importado sin `with { type: 'json' }`: la función
 * moría al cargar el módulo y todo POST devolvía 500.
 *
 * O sea: el build no puede ver esta clase de error. Este script sí.
 *
 * Lo que hace, en dos capas:
 *
 *   1. Guard estático: ningún archivo de `api/` puede importar un `.json` como módulo.
 *      Es la regresión concreta que rompiendo producción, y el mensaje dice por qué.
 *   2. Guard de runtime: se empaqueta cada handler con esbuild y se importa con el
 *      loader ESM real de Node. Si un módulo no carga, el test falla acá y no en Vercel.
 *
* Deliberadamente NO usa `tsx` para cargar los handlers: tsx resuelve los `.json` como
 * lo hace un bundler, o sea que no reproduciría el bug que estamos guarding.
 *
 * Las dos capas tienen trabajos distintos y complementarios:
 *   - La estática da el diagnóstico preciso del caso `.json`. El runtime la correría
 *     después, desde el directorio temporal, donde el specifier relativo resolvería a
 *     otra ruta y el error sería MODULE_NOT_FOUND en vez de
 *     ERR_IMPORT_ATTRIBUTE_MISSING. Para eso está la estática, que corre primero.
 *   - La de runtime es la red general: atrapa cualquier otro fallo al cargar un módulo.
 *
 * Los casos de Request no llegan a Resend: usan el honeypot y las validaciones que
 * cortan antes del envío, así que corren sin red y sin API keys.
 */

import { build } from 'esbuild';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Writable } from 'node:stream';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

const failures = [];
let checks = 0;

function check(name, ok, detail = '') {
  checks += 1;
  if (ok) {
    console.log(`  ok   ${name}`);
  } else {
    console.log(`  FAIL ${name}${detail ? ` -> ${detail}` : ''}`);
    failures.push(name);
  }
}

function fatal(message, hint = '') {
  console.error(`ERROR: ${message}`);
  if (hint) console.error(hint);
  process.exit(1);
}

/**
 * Capa 1. Un `.json` importado como módulo se ve bien en typecheck y en el build de
 * Vite, y explota en el runtime de la función. Si algún día vuelve a aparecer, este
 * guard lo dice en local en vez de dejar que lo descubra un POST en producción.
 */
function guardNoJsonModuleImports() {
  console.log('\n[1/2] Guard estático: api/ no importa .json como módulo');

  const offenders = [];

  for (const file of readdirSync(join(ROOT, 'api')).filter((f) => f.endsWith('.ts'))) {
    const source = readFileSync(join(ROOT, 'api', file), 'utf8');

    source.split('\n').forEach((line, index) => {
      const isModuleImport = /^\s*import\b[^;]*['"][^'"]+\.json['"]/.test(line);
      const isRequire = /\brequire\(\s*['"][^'"]+\.json['"]\s*\)/.test(line);
      if (isModuleImport || isRequire) offenders.push(`api/${file}:${index + 1}`);
    });
  }

  if (offenders.length === 0) {
    check('ningún archivo de api/ importa un .json', true);
    return;
  }

  console.error('ERROR: api/ importa un .json como módulo:');
  for (const where of offenders) console.error(`  - ${where}`);
  console.error('');
  console.error('TypeScript y Vite lo aceptan, pero en Vercel la función corre como ESM');
  console.error('nativo y Node 22+ exige `with { type: "json" }`. Sin eso la función muere al');
  console.error('cargar el módulo y todo request devuelve 500 aunque el build esté verde.');
  console.error('');
  console.error('Leelo con fs, como ya hacen scripts/sitemap.mjs, vite.config.ts y');
  console.error('scripts/preview-emails.ts:');
  console.error('  JSON.parse(readFileSync(join(process.cwd(), "site.config.json"), "utf8"))');
  process.exit(1);
}

/**
 * Empaqueta los handlers y los importa con el loader ESM real de Node. El `.mjs`
 * es obligatorio porque el archivo temporal queda fuera de todo package.json.
 *
 * El output va a `node_modules/.cache/` y no al temp del sistema a propósito: los
 * `external` quedan fuera del bundle igual que en Vercel, y desde ahí Node sube hasta
 * el `node_modules` del proyecto y los puede resolver. Si vivieran en el temp del
 * sistema, `import 'resend'` fallaría con MODULE_NOT_FOUND.
 */
async function loadHandlers() {
  const cacheDir = join(ROOT, 'node_modules', '.cache');
  mkdirSync(cacheDir, { recursive: true });
  const outdir = mkdtempSync(join(cacheDir, 'smoke-api-'));

  await build({
    entryPoints: [
      join(ROOT, 'api', 'contact.ts'),
      join(ROOT, 'api', 'cv.ts'),
      join(ROOT, 'api', '_emails.ts'),
    ],
    outdir,
    outExtension: { '.js': '.mjs' },
    format: 'esm',
    platform: 'node',
    target: 'node20',
    bundle: true,
    // `*.json` queda externo a propósito: es como se packaging las funciones de
    // Vercel, y es exactamente el caso que hay que verificar con el loader real.
    external: ['node:*', 'resend', '*.json'],
    logLevel: 'silent',
  });

  const load = async (name) => {
    const file = join(outdir, `${name}.mjs`);
    try {
      return await import(pathToFileURL(file).href);
    } catch (error) {
      rmSync(outdir, { recursive: true, force: true });
      fatal(
        `api/${name}.ts no carga en el runtime ESM de Node`,
        [
          `  ${error?.message ?? error}`,
          '',
          '  Si el error es ERR_IMPORT_ATTRIBUTE_MISSING, volviste a importar un .json',
          '  como módulo. Ver el guard estático de arriba.',
        ].join('\n'),
      );
    }
  };

  return {
    contact: await load('contact'),
    cv: await load('cv'),
    emails: await load('_emails'),
    cleanup: () => rmSync(outdir, { recursive: true, force: true }),
  };
}

/** VercelResponse mínima. Extiende Writable para que `cv.ts` pueda hacer stream.pipe(res). */
class FakeResponse extends Writable {
  constructor() {
    super();
    this.statusCode = 200;
    this.headers = {};
    this.payload = undefined;
    this.chunks = [];
  }

  setHeader(name, value) {
    this.headers[name.toLowerCase()] = value;
  }

  getHeader(name) {
    return this.headers[name.toLowerCase()];
  }

  status(code) {
    this.statusCode = code;
    return this;
  }

  json(value) {
    this.payload = value;
    this.end();
    return this;
  }

  _write(chunk, _encoding, callback) {
    this.chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    callback();
  }

  get body() {
    return Buffer.concat(this.chunks);
  }

  get finished() {
    if (this.writableFinished) return Promise.resolve();
    return new Promise((resolve) => this.once('close', resolve));
  }
}

function fakeRequest({ method = 'GET', query = {}, body = undefined, ip = '203.0.113.1' } = {}) {
  return { method, query, body, headers: { 'x-forwarded-for': ip } };
}

async function call(handler, request) {
  const res = new FakeResponse();
  await handler(request, res);
  await res.finished;
  return res;
}

async function runRuntimeChecks(contact, cv, emails) {
  console.log('\n[2/2] Runtime: los handlers cargan y responden');

  // Cargar `contact.ts` ya ejecutó `readSiteConfig()` a nivel de módulo, así que si
  // SITE_URL estuviera roto o faltara el archivo, el import de arriba ya falló.
  check('api/contact.ts carga y SITE_URL resuelve', typeof contact.default === 'function');

  const notAllowed = await call(contact.default, fakeRequest({ method: 'GET' }));
  check(
    'GET /api/contact -> 405',
    notAllowed.statusCode === 405 && notAllowed.payload?.error === 'method_not_allowed',
    `status=${notAllowed.statusCode} body=${JSON.stringify(notAllowed.payload)}`,
  );

  // Honeypot: cortamos antes de Resend, así que esto corre sin red y sin API key.
  const honeypot = await call(
    contact.default,
    fakeRequest({ method: 'POST', body: { website: 'https://spam.example' }, ip: '203.0.113.1' }),
  );
  check(
    'POST honeypot -> 200 sin enviar',
    honeypot.statusCode === 200 && honeypot.payload?.success === true,
    `status=${honeypot.statusCode} body=${JSON.stringify(honeypot.payload)}`,
  );

  const noMessage = await call(
    contact.default,
    fakeRequest({ method: 'POST', body: { email: 'a@b.co' }, ip: '203.0.113.2' }),
  );
  check(
    'POST sin mensaje -> 400 message_required',
    noMessage.statusCode === 400 && noMessage.payload?.error === 'message_required',
    `status=${noMessage.statusCode} body=${JSON.stringify(noMessage.payload)}`,
  );

  const badEmail = await call(
    contact.default,
    fakeRequest({
      method: 'POST',
      body: { message: 'hola', email: 'no-es-un-mail' },
      ip: '203.0.113.3',
    }),
  );
  check(
    'POST email inválido -> 400 email_invalid',
    badEmail.statusCode === 400 && badEmail.payload?.error === 'email_invalid',
    `status=${badEmail.statusCode} body=${JSON.stringify(badEmail.payload)}`,
  );

  // `cv.ts` toma el nombre del `cvFilename` compartido. Si el archivo se renombra en un
  // lado y no en el otro, el header de descarga miente; esto lo ata a la fuente única.
  check('cvFilename("es") en español', /-ES\.pdf$/.test(emails.cvFilename('es')), emails.cvFilename('es'));
  check('cvFilename("en") en inglés', /-EN\.pdf$/.test(emails.cvFilename('en')), emails.cvFilename('en'));

  for (const lang of ['es', 'en']) {
    const res = await call(cv.default, fakeRequest({ query: { lang } }));
    const disposition = res.getHeader('content-disposition') ?? '';
    const expected = emails.cvFilename(lang);

    check(
      `GET /api/cv?lang=${lang} -> 200 con ${expected}`,
      res.statusCode === 200 &&
        res.getHeader('content-type') === 'application/pdf' &&
        disposition.includes(expected) &&
        res.body.subarray(0, 4).toString() === '%PDF',
      `status=${res.statusCode} disposition=${disposition} bytes=${res.body.length}`,
    );
  }
}

guardNoJsonModuleImports();

const handlers = await loadHandlers();

try {
  await runRuntimeChecks(handlers.contact, handlers.cv, handlers.emails);
} finally {
  handlers.cleanup();
}

console.log('');
if (failures.length > 0) {
  console.error(`ERROR: fallaron ${failures.length} de ${checks} checks de api/:`);
  for (const name of failures) console.error(`  - ${name}`);
  process.exit(1);
}

console.log(`api/ ok: ${checks} checks.`);