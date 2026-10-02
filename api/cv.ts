import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import { cvFilename } from './_emails';

// Vercel route rules cannot match a query string, so the download header has to
// come from a serverless function. The plain /cv-es.pdf and /cv-en.pdf URLs
// keep previewing inline, which is what the header and footer want.
//
// The filename comes from `cvFilename` so that the download here and the name
// announced in the email attachments can never drift apart.
const CVS = {
  es: { file: 'cv-es.pdf', name: cvFilename('es') },
  en: { file: 'cv-en.pdf', name: cvFilename('en') },
} as const;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const lang = req.query.lang === 'en' ? 'en' : 'es';
  const cv = CVS[lang];
  const filePath = join(process.cwd(), 'public', cv.file);

  try {
    const info = await stat(filePath);

    res.status(200);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', String(info.size));
    res.setHeader('Content-Disposition', `attachment; filename="${cv.name}"`);
    res.setHeader('Cache-Control', 'public, max-age=86400');

    const stream = createReadStream(filePath);
    stream.on('error', () => {
      if (!res.headersSent) {
        res.status(500).end();
      }
    });
    stream.pipe(res);
  } catch {
    res.status(404).end('CV no encontrado');
  }
}