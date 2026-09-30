import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, '..', 'imagenes');
const DST = path.resolve(__dirname, '..', 'public', 'projects');

const FOLDER_MAP = {
  'BRNN': 'brunn-studio',
  'lumen': 'lumen',
  'marea': 'marea',
  'stro': 'stro-atelier',
  'zabira': 'zabira-studio',
  'content studio': 'content-studio',
  'UXnicorp Academy': 'uxnicorp-academy',
  'pagina UXnicorp': 'la-pagina-de-uxnicorp',
  'myvisor': 'myvisor',
  'jime nails': 'jimena-vilte',
  'patagenda': 'patagenda',
  'ducksale': 'ducksale',
  'Comercial Río Hondo': 'comercial-rio-hondo',
  'ISDEP': 'isdep',
};

async function main() {
  for (const [folder, projectId] of Object.entries(FOLDER_MAP)) {
    const srcDir = path.join(SRC, folder);
    const dstDir = path.join(DST, projectId);

    if (!fs.existsSync(srcDir)) {
      console.log(`  ✗ Missing: ${folder}`);
      continue;
    }

    fs.mkdirSync(dstDir, { recursive: true });

    const files = fs.readdirSync(srcDir).sort();
    for (let i = 0; i < files.length; i++) {
      const srcFile = path.join(srcDir, files[i]);
      const dstFile = path.join(dstDir, `${String(i + 1).padStart(2, '0')}.webp`);

      try {
        await sharp(srcFile)
          .resize({ width: 1200, withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(dstFile);
        console.log(`  ✓ ${projectId}/${path.basename(dstFile)}`);
      } catch (err) {
        console.log(`  ✗ ${projectId}/${path.basename(dstFile)}: ${err.message}`);
      }
    }
  }

  console.log('\nDone.');
}

main();
