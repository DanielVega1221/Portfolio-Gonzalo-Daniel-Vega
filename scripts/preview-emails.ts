/**
 * Renderiza los correos del formulario de contacto a archivos HTML para
 * revisarlos en el navegador.
 *
 * Por qué existe: probar el diseño de un correo pasando por la API de Resend es
 * un ciclo lentísimo (mandar, abrir el mail, corregir, mandar). Acá se generan
 * todas las variantes de una y se abren en el navegador.
 *
 *   npm run preview:emails
 *
 * Escribe en .preview-emails/ (ignorado por git) más un index.html con links a
 * todo, para pasar de una a otra.
 */
import { mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPreview, REASON_KEYS, type Lang } from '../api/_emails';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const OUT = join(ROOT, '.preview-emails');

// El origen sale del mismo config que canonical, sitemap y robots, así que el
// preview no puede mostrar un link que difiera del que va en producción.
const site = JSON.parse(await readFile(join(ROOT, 'site.config.json'), 'utf8')) as { url: string };
const SITE_URL = site.url.replace(/\/+$/, '');

const LANGS: Lang[] = ['es', 'en'];

async function main() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const sections: string[] = [];

  for (const reason of REASON_KEYS) {
    for (const lang of LANGS) {
      const { ack, notification } = buildPreview(reason, lang, SITE_URL);
      const base = `${reason}-${lang}`;

      await writeFile(join(OUT, `${base}-ack.html`), ack.html, 'utf8');
      await writeFile(join(OUT, `${base}-ack.txt`), ack.text, 'utf8');
      await writeFile(join(OUT, `${base}-notif.html`), notification.html, 'utf8');
      await writeFile(join(OUT, `${base}-notif.txt`), notification.text, 'utf8');

      sections.push(
        `<h2>${reason} / ${lang} <small>&mdash; ${ack.subject}</small></h2>`,
        `<p><a href="${base}-ack.html">acuse (HTML)</a> &middot; <a href="${base}-ack.txt">acuse (texto)</a> &middot; ` +
          `<a href="${base}-notif.html">notificaci&oacute;n (HTML)</a> &middot; <a href="${base}-notif.txt">notificaci&oacute;n (texto)</a></p>`,
      );
    }
  }

  const combos = REASON_KEYS.length * LANGS.length;
  const index = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">
<title>Correos del formulario</title>
<style>
  body { font: 15px/1.6 -apple-system, system-ui, sans-serif; max-width: 780px; margin: 40px auto; padding: 0 20px; color: #1a1a1a; }
  h1 { font-size: 24px; }
  h2 { font-size: 16px; margin: 28px 0 6px; padding-top: 14px; border-top: 1px solid #e5e2de; }
  small { font-weight: normal; color: #6b6862; }
  a { color: #a84432; }
</style></head><body>
<h1>Correos del formulario de contacto</h1>
<p>${REASON_KEYS.length} motivos &times; ${LANGS.length} idiomas = ${combos} combinaciones, cada una con su acuse y su notificaci&oacute;n.</p>
<p>El <strong>acuse</strong> es el que recibe quien escribe. La <strong>notificaci&oacute;n</strong> es la que te llega a vos.</p>
${sections.join('\n')}
</body></html>`;

  await writeFile(join(OUT, 'index.html'), index, 'utf8');

  console.log(`${combos * 4} archivos en ${OUT}`);
  console.log(`Abri ${join(OUT, 'index.html')}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
