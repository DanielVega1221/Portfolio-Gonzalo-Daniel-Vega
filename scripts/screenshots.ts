import { chromium } from 'playwright';
import { caseStudies } from '../src/data/projects.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '..', 'public', 'projects');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const VIEWPORT = { width: 1280, height: 800 };
const WAIT_MS = 10000;

const projectsWithUrl = caseStudies.filter(p => p.url);

console.log(`Taking screenshots for ${projectsWithUrl.length} projects...\n`);

const browser = await chromium.launch();

for (let i = 0; i < projectsWithUrl.length; i++) {
  const project = projectsWithUrl[i];
    const outPath = path.join(OUT_DIR, `${project.id}.jpg`);
    console.log(`[${i + 1}/${projectsWithUrl.length}] ${project.title} → ${project.url}`);

  try {
    const page = await browser.newPage();
    await page.setViewportSize(VIEWPORT);
    await page.goto(project.url!, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(WAIT_MS);
    await page.screenshot({ path: outPath, type: 'jpeg', quality: 85 });
    await page.close();
    console.log(`  ✓ Saved: ${path.basename(outPath)}`);
  } catch (err) {
    console.log(`  ✗ Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}

await browser.close();
console.log('\nDone.');
