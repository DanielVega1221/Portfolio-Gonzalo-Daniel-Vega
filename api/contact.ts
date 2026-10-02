import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  buildAck,
  buildNotification,
  cvFilename,
  parseLang,
  parseReasonKey,
  reasonNeedsCv,
  type Lang,
  type ReasonKey,
} from './_emails';

/**
 * Formulario de contacto.
 *
 * Lo que cambió y por qué:
 *
 * - Límites de tamaño y formato. Antes solo se comprobaba que `email` y
 *   `message` vinieran presentes: un POST directo podía mandar un mensaje de
 *   varios megabytes y se reenviaba entero, con el costo de Resend de por medio.
 * - Honeypot. El campo `website` está oculto para una persona y es la primera
 *   casilla que llena un bot que recorre el DOM.
 * - Rate limit por IP.
 * - El error ya no viaja al cliente. Antes se devolvía `error.message` de
 *   Resend y del catch genérico, que en la práctica filtraba el nombre del
 *   remitente, el ID de la cuenta y mensajes de la API de terceros. Ahora el
 *   cliente recibe un código estable y el detalle queda en los logs.
 * - Remitente y destinatario por variable de entorno. Estaban fijos en el
 *   código, así que cambiar de casilla obligaba a desplegar.
 * - El motivo viaja como clave estable (`reasonKey`), no como texto. El backend
 *   elige con eso la variante del acuse y si adjunta el CV, así que un retoque
 *   de copy en los chips no puede desalinear lo que se le manda a quien escribe.
 * - Las plantillas y el copy de los correos viven en `api/_emails.ts`.
 *
 * Sobre el rate limit: es un `Map` en memoria, o sea que vale por instancia.
 * En Vercel cada función puede tener varias instancias y se reciclan, así que
 * esto frena el envío automatizado trivial, no a un atacante con un script
 * distribuido. Para eso hay que poner una regla en el WAF de Vercel; el límite
 * de 5 por hora aquí está para no gastar cuota de Resend por accidente.
 */

const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;
const MAX_REASON = 200;
const MAX_LANG = 2;

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Mismo origen que canonical, hreflang, sitemap y robots. Se lee el archivo y no
 * `src/data/site.ts` a propósito: ese archivo es código de cliente y no tiene por
 * qué entrar en el bundle de una función.
 *
 * Y no se importa como módulo JSON. `import site from '../site.config.json'`
 * compila sin quejarse (tsconfig usa `moduleResolution: bundler` y Vite procesa
 * el import), pero en Vercel la función corre como ESM nativo y Node 22+ exige
 * `with { type: 'json' }`. Sin el atributo la función moría al cargar el módulo
 * con ERR_IMPORT_ATTRIBUTE_MISSING y todo POST devolvía 500, con el build en
 * verde. Por eso se lee con fs, igual que scripts/sitemap.mjs, vite.config.ts y
 * scripts/preview-emails.ts.
 *
 * `scripts/smoke-api.mjs` existe para que este tipo de error de runtime no pueda
 * volver a llegar a producción.
 */
function readSiteConfig(): string {
  const path = join(process.cwd(), 'site.config.json');

  let raw: string;
  try {
    raw = readFileSync(path, 'utf8');
  } catch (error) {
    throw new Error(
      `No se pudo leer ${path} (cwd=${process.cwd()}): ${(error as Error).message}`,
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`${path} no es JSON válido: ${(error as Error).message}`);
  }

  const url = (parsed as { url?: unknown })?.url;
  if (typeof url !== 'string' || url.trim().length === 0) {
    throw new Error(`${path} no tiene un campo "url" string no vacío`);
  }

  return url.trim().replace(/\/+$/, '');
}

const SITE_URL = readSiteConfig();

// Los CV van por `includeFiles` en vercel.json. El link del cuerpo apunta al PDF
// servido como archivo y el adjunto va en base64, que es lo que pide Resend.
// El nombre sale de `cvFilename` para que el archivo que anuncia el callout del
// acuse y el que va adjunto sean siempre el mismo.
const CV_FILES: Record<Lang, { file: string; name: string }> = {
  es: { file: 'cv-es.pdf', name: cvFilename('es') },
  en: { file: 'cv-en.pdf', name: cvFilename('en') },
};


const hits = new Map<string, number[]>();

function clientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress ?? 'unknown';
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

// El Map crece sin límite si nadie limpia. Un barrido barato por entrada.
if (typeof setInterval !== 'undefined') {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [ip, times] of hits) {
      const recent = times.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (recent.length === 0) hits.delete(ip);
      else hits.set(ip, recent);
    }
  }, RATE_LIMIT_WINDOW_MS);
  timer.unref?.();
}

function stripCrLf(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

function asString(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  return trimmed.slice(0, max);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'rate_limited' });
  }

  let body: Record<string, unknown>;
  try {
    const raw = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
      return res.status(400).json({ error: 'invalid_body' });
    }
    body = raw as Record<string, unknown>;
  } catch {
    return res.status(400).json({ error: 'invalid_json' });
  }

  // Honeypot: si viene con contenido, respondemos como si fuera un éxito para
  // que el bot no aprenda a probar de nuevo, pero no se envía nada.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    console.log('[Contact] honeypot triggered');
    return res.status(200).json({ success: true });
  }

  const message = asString(body.message, MAX_MESSAGE);
  if (!message) {
    return res.status(400).json({ error: 'message_required' });
  }

  const email = asString(body.email, MAX_EMAIL);
  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'email_invalid' });
  }

  const name = asString(body.name, MAX_NAME);
  const reason = asString(body.reason, MAX_REASON);
  // El servidor no sabe en qué idioma está la página; lo decide el cliente. Cualquier
  // cosa que no sea 'en' se trata como español.
  const lang = parseLang(asString(body.lang, MAX_LANG));
  // Clave estable del motivo. Si no viene o no es una conocida, se trata como
  // 'work': es el motivo más neutro y el único que no promete nada (ni CV ni
  // plazo de 48 h) si alguien mandó el formulario a mano o cacheó un cliente viejo.
  const reasonKey: ReasonKey = parseReasonKey(body.reasonKey) ?? 'work';
  const displayName = stripCrLf(name ?? '') || email;
  const displayReason = stripCrLf(reason ?? '');

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[Contact] RESEND_API_KEY no configurada');
    return res.status(500).json({ error: 'service_unavailable' });
  }

  // Remitente y destinatario.
  //
  // `to` es la casilla pública del portfolio, la misma que muestra `profile.email`.
  // `from` por defecto es `onboarding@resend.dev`, la casilla de pruebas de Resend,
  // y esa tiene una restricción dura: solo entrega al correo con el que la cuenta
  // de Resend está registrada. Si esa cuenta no está registrada con esta misma
  // casilla, todo envío rebota con
  //   "You can only send testing emails to your own email address (...)"
  // y el formulario no sirve. La salida es verificar el dominio del sitio en
  // resend.com/domains y setear `CONTACT_FROM` a una dirección de ese dominio; con
  // dominio verificado se puede entregar a cualquier destinatario.
  const usingTestSender = !process.env.CONTACT_FROM;
  const from = process.env.CONTACT_FROM ?? 'Portfolio GDV <onboarding@resend.dev>';
  const to = process.env.CONTACT_TO ?? 'dvega6442@gmail.com';

  console.log('[Contact] envío', { from, to, replyTo: email, testSender: usingTestSender });

  if (usingTestSender) {
    console.warn(
      '[Contact] remitente de pruebas sin verificar: Resend solo va a entregar si ' +
        `${to} es la casilla registrada en la cuenta de Resend. Para recibir desde ` +
        'cualquier destinatario hay que verificar el dominio y setear CONTACT_FROM.',
    );
  }

  try {
    const resend = new Resend(apiKey);
    const notification = buildNotification({
      name: displayName,
      email,
      reason: reasonKey,
      reasonLabel: displayReason,
      message,
      lang,
      siteUrl: SITE_URL,
      receivedAt: new Date(),
    });

    const result = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: notification.subject,
      html: notification.html,
      text: notification.text,
    });

    if (result.error) {
      console.error('[Contact] Resend error:', result.error);

      // Remitente no verificado: no es un fallo recuperable desde el formulario,
      // así que se distingue para no mandar al visitante un error genérico cuando
      // en realidad lo que falta es verificar el dominio. El detalle va al log; al
      // cliente solo el código.
      //
      // Resend se expresa distinto según el caso: con el remitente de pruebas
      // habla de "testing emails" y con un dominio sin verificar dice que el
      // dominio no está verificado. Los dos son la misma causa raíz y el mismo
      // arreglo, así que se mapean al mismo código.
      const detail = `${result.error.name ?? ''} ${result.error.message ?? ''}`;
      if (/testing emails|own email address|not verified|unverified|invalid_from/i.test(detail)) {
        console.error(
          '[Contact] Resend rechazó el envío: el remitente ' +
            `${from} todavía no puede enviar a ${to}. Si seguís con ` +
            'onboarding@resend.dev, Resend solo entrega a la casilla registrada en ' +
            'la cuenta. La solución en ambos casos es verificar un dominio en ' +
            'resend.com/domains y setear CONTACT_FROM con una dirección de ese dominio.',
        );
        return res.status(500).json({ error: 'sender_unverified' });
      }

      return res.status(500).json({ error: 'delivery_failed' });
    }

    console.log('[Contact] enviado', result.data?.id, 'desde', ip);

    // Acuse de recibo para quien escribió.
    //
    // Va después del envío principal y no en paralelo: si se mandaran juntos, un
    // fallo del principal dejaría al visitante leyendo un "recibí tu mensaje" de
    // algo que nunca llegó. El costo es una ida extra a la API.
    //
    // Si el acuse falla, no se devuelve error. El mensaje ya se entregó, así que
    // mostrarle un error al visitante por un acuse que no salió sería tirar la
    // información al piso. Queda solo en el log.
    await sendAck(resend, { from, to, lang, name: displayName, email, reasonKey });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[Contact] error inesperado:', error);
    return res.status(500).json({ error: 'service_unavailable' });
  }
}

/**
 * Manda el acuse al visitante. Nunca lanza: su único efecto es el log.
 *
 * `replyTo` apunta a la casilla del autor, no a la del visitante. Si el visitante
 * responde al acuse, tiene que llegarle a Gonzalo, no rebotarle a sí mismo. Y esa
 * casilla es `dvega6442@gmail.com`, la pública del portfolio, no su correo
 * personal: el `from` visible es el dominio verificado porque Resend no puede
 * enviar desde una casilla de gmail.com, y el `replyTo` es lo que decide a dónde
 * aterriza la respuesta.
 *
 * El CV solo se adjunta para `hiring` (ver `reasonNeedsCv`).
 */
async function loadCvAttachment(lang: Lang): Promise<{ filename: string; content: string } | null> {
  const cv = CV_FILES[lang];
  try {
    const buffer = await readFile(join(process.cwd(), 'public', cv.file));
    return { filename: cv.name, content: buffer.toString('base64') };
  } catch (error) {
    // El link al PDF sigue en el cuerpo, así que un CV que no se pudo leer no
    // puede romper el acuse. Solo se pierde el adjunto.
    console.error('[Contact] no se pudo leer el CV para adjuntar:', error);
    return null;
  }
}

async function sendAck(
  resend: Resend,
  opts: {
    from: string;
    to: string;
    lang: Lang;
    name: string;
    email: string;
    reasonKey: ReasonKey;
  },
): Promise<void> {
  const { from, to, lang, name, email, reasonKey } = opts;

  const attachment = reasonNeedsCv(reasonKey) ? await loadCvAttachment(lang) : null;
  const ack = buildAck({ name, reason: reasonKey, lang, siteUrl: SITE_URL });

  try {
    const result = await resend.emails.send({
      from,
      to: email,
      replyTo: to,
      subject: ack.subject,
      html: ack.html,
      text: ack.text,
      ...(attachment ? { attachments: [attachment] } : {}),
    });

    if (result.error) {
      console.error('[Contact] acuse no entregado (el mensaje principal sí salió):', result.error);
    } else {
      console.log(
        '[Contact] acuse enviado',
        result.data?.id,
        '->',
        email,
        `(${lang}, ${reasonKey}${attachment ? ', con CV' : ''})`,
      );
    }
  } catch (error) {
    console.error('[Contact] el acuse lanzó excepción (el mensaje principal sí salió):', error);
  }
}
