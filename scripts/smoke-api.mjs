/**
 * Smoke test de las funciones de `api/`.
 *
 * Existe por dos 500 en producción, ambos con el build en verde. Y los dos tienen la
 * misma causa de fondo: `api/` estaba escrito asumiendo que un bundler resuelve los
 * imports, y Vercel no empaqueta.
 *
 *   - `api/contact.ts` hacía `import site from '../site.config.json'`. TypeScript lo
 *     acepta (tsconfig usa `moduleResolution: bundler`) y Vite lo procesa sin
 *     problema, pero Node 24 rechaza un JSON importado sin `with { type: 'json' }`.
 *     ERR_IMPORT_ATTRIBUTE_MISSING al cargar el módulo, 500 en cada POST.
 *   - `api/contact.ts` y `api/cv.ts` importaban `'./_emails'` sin extensión. ESM
 *     nativo nunca resuelve un specifier sin extensión:
 *     ERR_MODULE_NOT_FOUND al cargar el módulo, 500 en cada POST.
 *
 * El dato que las dos veces pasó por alto: los logs del despliegue muestran
 * `imported from /var/task/api/contact.js`. Hay un `.js` compilado en el lugar, no un
 * bundle. Vercel corre cada función como ESM nativo, y ahí las reglas son las de Node,
 * no las del bundler.
 *
 * La lección que quedó: el build no puede ver esta clase de error, ni `tsc` ni `vite
 * build` ni `eslint`. Por eso este script compila los handlers SIN bundle y los carga
 * con el loader ESM real de Node, que es exactamente lo que hace el runtime.
 *
 * Las capas, y por qué están separadas:
 *
 *   1. Guard estático. Le pone nombre al problema del `.json`, que desde el directorio
 *      temporal el runtime vería como un MODULE_NOT_FOUND genérico. Barato y exacto.
 *   2. Runtime sin bundle. LA CAPA QUE IMPORTA: es el deployment real. Compila archivo
 *      por archivo como Vercel y deja los specifiers sin tocar, así que Node los
 *      resuelve con semántica nativa. Acá viven las aserciones de comportamiento.
 *   3. Runtime con bundle. Barata y no es lo que se despliega. Falla si alguna vez se
 *      cambia la estrategia de build, y cubre lo que se mostró en el preview de emails.
 *
 * El punto ciego anterior: la capa 2 corría con `bundle: true`, o sea resolvía los
 * specifiers en build time. Daba 10/10 con producción rota.
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
 * Devuelve las líneas de código de un archivo, sin comentarios.
 *
 * Hace falta porque los dos guards buscan specifiers por regex, y los comentarios
 * documentan justamente los errores que previenen: el ejemplo de `import ... from
 * '../site.config.json'` dentro del JSDoc de contact.ts matcheaba como si fuera código
 * real y frenaba el build con un falso positivo.
 *
 * Se borran bloques `/* ... *\/` y las líneas que son sólo comentario. Los comentarios
 * al final de una línea de código no se tocan, para no romper strings con `//`, que en
 * este repo son URLs.
 */
function codeLines(file) {
  const source = readFileSync(join(ROOT, 'api', file), 'utf8');
  const withoutBlocks = source.replace(/\/\*[\s\S]*?\*\//g, (block) => '\n'.repeat(block.split('\n').length - 1));

  return withoutBlocks.split('\n').filter((line) => {
    const trimmed = line.trim();
    return trimmed.length > 0 && !trimmed.startsWith('//') && !trimmed.startsWith('*');
  });
}

/**
 * Capa 1a. Un `.json` importado como módulo se ve bien en typecheck y en el build de
 * Vite, y explota en el runtime de la función. Si algún día vuelve a aparecer, este
 * guard lo dice en local en vez de dejar que lo descubra un POST en producción.
 */
function guardNoJsonModuleImports() {
  const offenders = [];

  for (const file of readdirSync(join(ROOT, 'api')).filter((f) => f.endsWith('.ts'))) {
    for (const line of codeLines(file)) {
      const isModuleImport = /^\s*import\b[^;]*['"][^'"]+\.json['"]/.test(line);
      const isRequire = /\brequire\(\s*['"][^'"]+\.json['"]\s*\)/.test(line);
      if (isModuleImport || isRequire) offenders.push(`api/${file} -> ${line.trim()}`);
    }
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
 * Capa 1b. Todo relative import dentro de `api/` tiene que llevar extensión `.js`.
 *
 * Mismo motivo que el guard de `.json`: Vercel no empaqueta, así que los specifiers los
 * resuelve Node con ESM nativo, que no acepta `./_emails` a secas. TypeScript lo deja
 * pasar porque tsconfig usa `moduleResolution: bundler`, y Vite/esbuild lo resuelven al
 * compilar, así que ni `tsc` ni `vite build` lo ven.
 *
 * Solo se aceptan `.js` porque es lo que existe en `/var/task/api/` después de compilar.
 */
function guardRelativeImportsHaveExtensions() {
  const offenders = [];

  for (const file of readdirSync(join(ROOT, 'api')).filter((f) => f.endsWith('.ts'))) {
    for (const line of codeLines(file)) {
      for (const match of line.matchAll(/(?:from|import|require\()\s*['"](\.[^'"]*)['"]/g)) {
        if (!match[1].endsWith('.js')) offenders.push(`api/${file} -> ${line.trim()}`);
      }
    }
  }

  if (offenders.length === 0) {
    check('todo relative import de api/ termina en .js', true);
    return;
  }

  console.error('ERROR: relative import sin extensión .js en api/:');
  for (const where of offenders) console.error(`  - ${where}`);
  console.error('');
  console.error('Vercel no empaqueta esta función: la compila a .js y la corre como ESM');
  console.error('nativo. Node no resuelve un specifier relativo sin extensión y la función');
  console.error('muere al cargar el módulo con ERR_MODULE_NOT_FOUND, o sea 500 en cada');
  console.error('request, con el build en verde.');
  console.error('');
  console.error("Escribí './_emails.js' y no './_emails': TypeScript mapea el .js al .ts");
  console.error('al compilar, así que el typecheck sigue funcionando.');
  process.exit(1);
}

/**
 * Compila los handlers y los importa con el loader ESM real de Node.
 *
 * `mode: 'unbundled'` es el que importa: replica el deployment. Vercel compila cada
 * `.ts` a `.js` en el mismo lugar y corre eso como ESM nativo, sin bundle. Acá
 * `bundle: false` deja los specifiers exactamente como están, así que Node los resuelve
 * con las reglas reales: extensión obligatoria, sin JSON modules, sin `__dirname`. Un
 * `./_emails` sin `.js` falla acá exactamente como falló en producción.
 *
 * `mode: 'bundled'` es el secundario y NO es lo que se despliega. Falla si alguna vez se
 * cambia la estrategia de build de `api/`, y cubre que los handlers también anden
 * empaquetados.
 *
 * El output va a `node_modules/.cache/` y no al temp del sistema a propósito: las deps
 * sueltas quedan fuera igual que en Vercel, y desde ahí Node sube hasta el `node_modules`
 * del proyecto y las resuelve. En el temp del sistema, `import 'resend'` fallaría con
 * MODULE_NOT_FOUND y el test mediría lo que no es el bug.
 *
 * El `.js` no se renombra a `.mjs`. `/var/task/api/_emails.js` es el nombre real, y el
 * source importa `./_emails.js`: si el harness emitiera `_emails.mjs` el import no
 *ritionaría y el test fallaría por un motivo que Vercel nunca va a tener. El temporal
 * queda dentro del repo, así que Node hereda el `"type": "module"` del package.json raíz
 * y lo trata como ESM igual.
 */
async function loadHandlers(mode) {
  const cacheDir = join(ROOT, 'node_modules', '.cache');
  mkdirSync(cacheDir, { recursive: true });
  const outdir = mkdtempSync(join(cacheDir, 'smoke-api-'));

  const isBundled = mode === 'bundled';

  await build({
    entryPoints: [
      join(ROOT, 'api', 'contact.ts'),
      join(ROOT, 'api', 'cv.ts'),
      join(ROOT, 'api', '_emails.ts'),
    ],
    outdir,
    format: 'esm',
    platform: 'node',
    target: 'node20',
    // La diferencia que importa entre las dos capas. Con bundle, esbuild resuelve los
    // specifiers acá y el bug deja de existir; sin bundle, quedan intactos y es Node el
    // que los resuelve, igual que en producción.
    bundle: isBundled,
    // `external` solo tiene sentido con `bundle`; esbuild lo rechaza si no.
    ...(isBundled ? { external: ['node:*', 'resend', '*.json'] } : {}),
    logLevel: 'silent',
  });

  const load = async (name) => {
    const file = join(outdir, `${name}.js`);
    try {
      return await import(pathToFileURL(file).href);
    } catch (error) {
      rmSync(outdir, { recursive: true, force: true });
      fatal(
        `api/${name}.ts no carga en el runtime ESM de Node (${mode})`,
        [
          `  ${error?.message ?? error}`,
          '',
          '  Vercel no empaqueta esta función: la compila a .js y la corre como ESM',
          '  nativo. Por lo tanto todo lo que un bundler te perdona es un 500 en prod:',
          '',
          "  - Relative imports sin extensión ('./_emails') -> ERR_MODULE_NOT_FOUND",
          '    Usá "./_emails.js". TypeScript lo resuelve igual.',
          '',
          '  - .json importado como módulo -> ERR_IMPORT_ATTRIBUTE_MISSING',
          '    Leelo con fs. Ver el guard estático de arriba.',
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

async function runRuntimeChecks(contact, cv, emails, mode) {
  console.log(`\n[2/3] Runtime sin bundle (${mode}): los handlers cargan y responden`);

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

console.log('\n[1/3] Guards estáticos de api/');
guardNoJsonModuleImports();
guardRelativeImportsHaveExtensions();

// Capa 2: sin bundle. Es el deployment real, así que acá van las aserciones de
// comportamiento. Acá es donde tiene que valer el 100% de los checks.
const unbundled = await loadHandlers('unbundled');
try {
  await runRuntimeChecks(unbundled.contact, unbundled.cv, unbundled.emails, 'unbundled');
} finally {
  unbundled.cleanup();
}

// Capa 3: con bundle. No es lo que se despliega; se verifica que los handlers también
// anden empaquetados, por si alguna vez se cambia la estrategia de build de api/.
const bundled = await loadHandlers('bundled');
try {
  console.log('\n[3/3] Runtime con bundle: los handlers también empaquetan');
  check(
    'api/*.ts empaqueta sin romper',
    typeof bundled.contact.default === 'function' && typeof bundled.cv.default === 'function',
  );
} finally {
  bundled.cleanup();
}

console.log('');
if (failures.length > 0) {
  console.error(`ERROR: fallaron ${failures.length} de ${checks} checks de api/:`);
  for (const name of failures) console.error(`  - ${name}`);
  process.exit(1);
}

console.log(`api/ ok: ${checks} checks.`);