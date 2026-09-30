import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, '..', 'public');
const SRC = path.join(PUBLIC, 'foto.png');
const TMP_PNG = path.join(PUBLIC, '.foto.tmp.png');
const OUT_PNG = path.join(PUBLIC, 'foto.png');
const OUT_WEBP = path.join(PUBLIC, 'foto.webp');
const OUT_BADGE_WEBP = path.join(PUBLIC, 'foto-badge.webp');
const SIZE = 400;
const BADGE_W = 400;
const BADGE_H = 360;

const meta = await sharp(SRC).metadata();
console.log(`Source: ${meta.width}x${meta.height}, ${(fs.statSync(SRC).size / 1024).toFixed(0)} KiB`);

await sharp(SRC)
  .resize(SIZE, SIZE, { fit: 'cover', withoutEnlargement: true })
  .png({ compressionLevel: 9, palette: true })
  .toFile(TMP_PNG);
fs.renameSync(TMP_PNG, OUT_PNG);
console.log(`foto.png -> ${(fs.statSync(OUT_PNG).size / 1024).toFixed(0)} KiB`);

await sharp(SRC)
  .resize(SIZE, SIZE, { fit: 'cover', withoutEnlargement: true })
  .webp({ quality: 82 })
  .toFile(OUT_WEBP);
console.log(`foto.webp -> ${(fs.statSync(OUT_WEBP).size / 1024).toFixed(0)} KiB`);

// Badge crop: a fixed near-square band taken from the TOP, not a saliency crop.
// sharp's `attention` picked a band that left ~7px above the head, so the hair
// ran into the card's slot and header. Anchoring the top keeps the natural
// headroom and trims the dark torso at the bottom instead. BADGE_W/BADGE_H is
// tuned to the card's 254x230 photo slot, so the browser crops ~2px, not the face.
const badgeHeight = Math.min(BADGE_H, meta.height);
await sharp(SRC)
  .extract({ left: 0, top: 0, width: Math.min(BADGE_W, meta.width), height: badgeHeight })
  .webp({ quality: 82 })
  .toFile(OUT_BADGE_WEBP);
console.log(`foto-badge.webp -> ${(fs.statSync(OUT_BADGE_WEBP).size / 1024).toFixed(0)} KiB`);