import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

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

const SITE_URL = 'https://gonzalodanielvega.com';
const WHATSAPP_URL = 'https://wa.me/5493834368748';

/**
 * Acuse de recibo para quien escribió.
 *
 * Va acá y no en `src/i18n/translations.ts` a propósito: ese archivo es el bundle
 * del cliente, con 400+ líneas de textos de interfaz y etiquetas de proyecto, y no
 * tiene sentido arrastrarlo a una función serverless. El copy de un email
 * transaccional vive junto al email que lo envía.
 *
 * El idioma lo manda el cliente (`lang`), porque el servidor no sabe en qué
 *idioma estaba la página. Cualquier valor que no sea 'en' cae a español.
 */
const ACK = {
  es: {
    subject: 'Recibí tu mensaje',
    greeting: (name: string) => `Hola ${name}, gracias por escribir.`,
    intro:
      'Soy Gonzalo Daniel Vega, Full Stack Developer, y trabajo desde Catamarca, Argentina.',
    delivered: 'Tu mensaje ya llegó a mi correo y te respondo por acá personalmente.',
    urgent: 'Si es urgente o preferís que hablemos más rápido, escribime por WhatsApp:',
    sign: 'Saludos, Gonzalo.',
    links: `Portfolio: ${SITE_URL}`,
  },
  en: {
    subject: 'I received your message',
    greeting: (name: string) => `Hi ${name}, thanks for reaching out.`,
    intro:
      "I'm Gonzalo Daniel Vega, a Full Stack Developer based in Catamarca, Argentina.",
    delivered: "Your message reached my inbox and I'll reply here personally.",
    urgent: "If it's urgent or you'd rather talk faster, message me on WhatsApp:",
    sign: 'Best, Gonzalo.',
    links: `Portfolio: ${SITE_URL}`,
  },
} as const;

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

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
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
  const lang: 'es' | 'en' = asString(body.lang, MAX_LANG) === 'en' ? 'en' : 'es';

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
    const result = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `[Portfolio] ${stripCrLf(reason ?? 'Consulta')} — ${stripCrLf(name ?? email)}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #a84432;">Nueva consulta desde el portfolio</h2>
          <hr style="border: 1px solid #e5e2de;" />
          <p><strong>Nombre:</strong> ${escapeHtml(name ?? 'No especificado')}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Motivo:</strong> ${escapeHtml(reason ?? 'No especificado')}</p>
          <hr style="border: 1px solid #e5e2de;" />
          <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
          <hr style="border: 1px solid #e5e2de;" />
          <p style="color: #999; font-size: 12px;">Enviado desde el formulario de contacto del portfolio. Responde a ${escapeHtml(email)}.</p>
        </div>
      `,
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
    await sendAck(resend, { from, to, lang, name, email });

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
 * responde al acuse, tiene que llegarle a Gonzalo, no rebotarle a sí mismo.
 */
async function sendAck(
  resend: Resend,
  opts: { from: string; to: string; lang: 'es' | 'en'; name: string | null; email: string },
): Promise<void> {
  const { from, to, lang, name, email } = opts;
  const copy = ACK[lang];
  // El nombre va crudo acá: el `escapeHtml` de la plantilla es el único que
  // escapa. Pasarlo ya escapado y volver a escapar en la plantilla lo convierte
  // en `&amp;lt;` y el visitante lee la entities en vez de su nombre.
  const displayName = stripCrLf(name ?? '') || email;

  try {
    const ack = await resend.emails.send({
      from,
      to: email,
      replyTo: to,
      subject: copy.subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
          <p style="color: #999; font-size: 12px; font-family: monospace;">${escapeHtml(copy.links)}</p>
          <hr style="border: 1px solid #e5e2de;" />
          <p>${escapeHtml(copy.greeting(displayName))}</p>
          <p>${escapeHtml(copy.intro)}</p>
          <p>${escapeHtml(copy.delivered)}</p>
          <p>${escapeHtml(copy.urgent)}<br />
            <a href="${WHATSAPP_URL}" style="color: #a84432;">${WHATSAPP_URL}</a>
          </p>
          <p>${escapeHtml(copy.sign)}</p>
        </div>
      `,
    });

    if (ack.error) {
      console.error('[Contact] acuse no entregado (el mensaje principal sí salió):', ack.error);
    } else {
      console.log('[Contact] acuse enviado', ack.data?.id, '->', email, `(${lang})`);
    }
  } catch (error) {
    console.error('[Contact] el acuse lanzó excepción (el mensaje principal sí salió):', error);
  }
}
