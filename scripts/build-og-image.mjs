/**
 * Genera la imagen de preview para redes (1200x630), que es la que se ve
 * cuando alguien comparte el link en LinkedIn, WhatsApp o Slack.
 *
 * El sitio usaba public/foto.png, que son 400x400. Declarado con
 * twitter:card="summary_large_image", que espera una imagen apaisada de al
 * menos 1200x630: la plataforma la recorta a un cuadrado chiquito y queda
 * una miniatura con la cara de al lado de un borde vacío. El mismo archivo
 * seguia sirviendo de fallback de og:image para los proyectos sin portada,
 * asi que conviven las dos: 400x400 para el fallback y 1200x630 para el
 * preview del sitio raiz.
 *
 * Corre dentro de `npm run build`, antes de vite build, porque se sirve desde
 * /public y no pasa por el optimizador de assets de Vite.
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, '..', 'public');
const SRC = path.join(PUBLIC, 'foto.png');
const OUT = path.join(PUBLIC, 'og-cover.png');
const OUT_WEBP = path.join(PUBLIC, 'og-cover.webp');

const W = 1200;
const H = 630;

const BG = '#f9f7f2';
const INK = '#1a1a1a';
const MUTED = '#555555';
const ACCENT = '#a84432';
const RULE = '#e5e2de';

// El marco y la tipografia se dibujan como SVG y se componen sobre la foto con
// sharp: no hay una fuente que carregar ni dependencias de canvas.
const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function overlay() {
  const lines = [
    'Gonzalo Daniel Vega',
    'Full Stack Developer',
    'React · TypeScript · Node · PostgreSQL',
    'Catamarca, Argentina',
  ];

  const text = lines
    .map((line, i) => {
      const sizes = [64, 34, 24, 22];
      const colors = [INK, ACCENT, MUTED, MUTED];
      const weights = [600, 500, 400, 400];
      const tracking = [0, 2, 0, 3];
      const y = 150 + i * 72;
      return `<text x="80" y="${y}" font-family="Georgia, 'Times New Roman', serif" font-size="${sizes[i]}" font-weight="${weights[i]}" fill="${colors[i]}" letter-spacing="${tracking[i]}">${esc(line)}</text>`;
    })
    .join('\n    ');

  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect x="0" y="0" width="${W}" height="10" fill="${ACCENT}"/>
  <text x="80" y="86" font-family="ui-monospace, 'Courier New', monospace" font-size="20" fill="${ACCENT}" letter-spacing="5">PORTFOLIO</text>
  <line x1="80" y1="108" x2="${W - 80}" y2="108" stroke="${RULE}" stroke-width="2"/>
  <g>
    ${text}
  </g>
  <line x1="80" y1="${H - 96}" x2="${W - 80}" y2="${H - 96}" stroke="${RULE}" stroke-width="2"/>
  <text x="80" y="${H - 56}" font-family="ui-monospace, 'Courier New', monospace" font-size="20" fill="${MUTED}" letter-spacing="3">CONSTRUYO SOFTWARE QUE ENTIENDE EL NEGOCIO ANTES QUE LA TECNOLOGIA</text>
</svg>`);
}

if (!fs.existsSync(SRC)) {
  console.error(`ERROR: falta ${SRC}, no se puede generar la imagen OG.`);
  process.exit(1);
}

const portrait = await sharp(SRC)
  .resize(300, 380, { fit: 'cover', position: 'top' })
  .png()
  .toBuffer();

const portraitPadded = await sharp({
  create: { width: 320, height: 420, channels: 4, background: '#efede8' },
})
  .composite([{ input: portrait, top: 10, left: 10 }])
  .png()
  .toBuffer();

await sharp(overlay())
  .composite([{ input: portraitPadded, top: (H - 420) / 2, left: W - 320 - 90 }])
  .png({ compressionLevel: 9 })
  .toFile(OUT);

await sharp(OUT).webp({ quality: 88 }).toFile(OUT_WEBP);

console.log(
  `og-cover.png -> ${(fs.statSync(OUT).size / 1024).toFixed(0)} KiB (${W}x${H})`
);
console.log(
  `og-cover.webp -> ${(fs.statSync(OUT_WEBP).size / 1024).toFixed(0)} KiB`
);

// Icono de iOS: 180x180, opaco y sin esquinas redondeadas (iOS las aplica solo).
// Sin esto Safari usa una captura de la pagina y el icono del Dock termina
// siendo un rectangulo con la barra del navegador pegada.
const APPLE = 180;
await sharp(SRC)
  .resize(APPLE, APPLE, { fit: 'cover', position: 'top' })
  .png({ compressionLevel: 9 })
  .toFile(path.join(PUBLIC, 'apple-touch-icon.png'));

console.log(
  `apple-touch-icon.png -> ${(fs.statSync(path.join(PUBLIC, 'apple-touch-icon.png')).size / 1024).toFixed(0)} KiB (${APPLE}x${APPLE})`
);
