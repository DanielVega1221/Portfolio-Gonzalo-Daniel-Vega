// Plantillas de los correos del formulario de contacto.
//
// Sin imports a propósito: este archivo lo usan tanto el handler
// (api/contact.ts) como scripts/preview-emails.ts, que corre con tsx fuera de
// Vercel. Si alguna vez necesitara algo de node, quedaría atado al bundler de la
// función y el preview dejaría de correr fuera de Vercel.
//
// Decisión de diseño: el servidor elige la variante por `reasonKey`, nunca por
// el texto del motivo. Los textos de los chips se tocan seguido (son copy de la
// UI) y si el backend descompusiera esas cadenas, un cambio de redacción mandaría
// el CV equivocado o el acuse equivocado sin que nadie lo note.

export type Lang = 'es' | 'en';
export type ReasonKey = 'work' | 'product' | 'hiring' | 'hi';

export const REASON_KEYS: readonly ReasonKey[] = ['work', 'product', 'hiring', 'hi'];

export function parseReasonKey(value: unknown): ReasonKey | null {
  return typeof value === 'string' && (REASON_KEYS as readonly string[]).includes(value)
    ? (value as ReasonKey)
    : null;
}

export function parseLang(value: unknown): Lang {
  return value === 'en' ? 'en' : 'es';
}

// El CV solo se manda a quien escribe por un equipo. Mandárselo a un colega que
// quiere charlar de producto lo convierte en ruido y gasta cuota de adjuntos.
export function reasonNeedsCv(reason: ReasonKey): boolean {
  return reason === 'hiring';
}

/**
 * Nombre visible del CV, en la fuente de verdad. El callout del acuse muestra
 * este nombre y contact.ts lo usa para nombrar el adjunto, así que el archivo
 * que se anuncia y el que se adjuntan no pueden dejar de coincidir.
 */
export function cvFilename(lang: Lang): string {
  return lang === 'en' ? 'CV-Gonzalo-Daniel-Vega-EN.pdf' : 'CV-Gonzalo-Daniel-Vega-ES.pdf';
}

const C = {
  accent: '#a84432',
  accentSoft: '#f7ebe5',
  paper: '#fffef0',
  bg: '#f4f1ea',
  ink: '#1a1a1a',
  body: '#4f4d49',
  muted: '#6b6862',
  border: '#e5e2de',
} as const;

// Las webfonts no cargan en clientes de correo, así que se declara la pila del
// sitio y cae a una serif/sans/mono del sistema.
const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";

const WHATSAPP_NUMBER = '5493834368748';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
const LINKEDIN_URL = 'https://www.linkedin.com/in/gonzalo-daniel-vega/';
const LOCATION = 'San Fernando del Valle de Catamarca, Argentina';

const REASON_LABEL: Record<ReasonKey, Record<Lang, string>> = {
  work: { es: 'Problema complejo', en: 'Complex problem' },
  product: { es: 'Conversación de producto', en: 'Product talk' },
  hiring: { es: 'Sumar criterio a un equipo', en: 'Adding judgment to a team' },
  hi: { es: 'Solo saludar', en: 'Saying hi' },
};

interface Bilingual {
  es: string;
  en: string;
}

interface Variant {
  subject: Bilingual;
  preheader: Bilingual;
  paragraphs: Bilingual[];
  close: Bilingual;
  /** `{wa}` se reemplaza por un link real; el rótulo lo aporta `UI.whatsappLink`. */
  badges?: Bilingual;
}

// `paragraphs[0]` abre siempre con el acuse de recibo. Por eso no hay un campo
// `lead`: antes lo había, decía "Gracias por escribir" en las cuatro variantes,
// y las cuatro arrancaban el primer párrafo con "Recibí tu mensaje". En `hi` el
// mensaje terminaba con tres agradecimientos seguidos.
const COPY: Record<ReasonKey, Variant> = {
  work: {
    subject: { es: 'Recibí tu mensaje', en: 'I got your message' },
    preheader: { es: 'Lo leí. Te cuento cómo lo encararía.', en: 'Read it. Here is how I would approach it.' },
    paragraphs: [
      {
        es: 'Recibí tu mensaje y lo leí. Cuando el problema viene de negocio y no de una pantalla, el primer paso casi nunca es escribir código: es entender qué está roto, quién lo usa y cómo se mide cuando quedó arreglado.',
        en: 'I got your message and read it. When the problem comes from the business and not from a screen, the first step is almost never writing code: it is understanding what is broken, who uses it, and how you measure it once it is fixed.',
      },
      {
        es: 'Antes de proponer nada necesito el contexto completo: cómo funciona hoy, qué probaron y qué les gustaría que pasara.',
        en: 'Before suggesting anything I need the full context: how it works today, what you have tried, and what you would like to happen.',
      },
      {
        // El rótulo de `{wa}` es una frase completa ("escribime por WhatsApp"), así
        // que la oración no debe volver a nombrar WhatsApp antes del marcador.
        es: 'Si te sirve, hacemos una llamada breve de 20 minutos y lo ordenamos ahí mismo: {wa}.',
        en: 'If you like, we can have a 20-minute call and sort it out there: {wa}.',
      },
    ],
    close: { es: 'Quedo atento.', en: 'Looking forward to hearing from you.' },
  },
  product: {
    subject: { es: 'Recibí tu mensaje', en: 'I got your message' },
    preheader: { es: 'Me interesa comparar notas.', en: 'I would like to compare notes.' },
    paragraphs: [
      {
        es: 'Recibí tu mensaje y lo leí. La parte de producto es lo que más me gusta de mi trabajo, y charlarlo con alguien que está armando algo me resulta más interesante que contestarle a una plantilla.',
        en: 'I got your message and read it. The product side of this is what I enjoy most about my work, and talking it through with someone who is building something interests me far more than replying from a template.',
      },
      {
        es: 'Contame qué estás armando y en qué punto estás. Si tengo algo para sumar, te lo digo con franqueza: {wa}.',
        en: 'Tell me what you are building and where you are at. If I have something to add, I will say so honestly: {wa}.',
      },
    ],
    close: { es: 'Saludos.', en: 'Best,' },
  },
  hiring: {
    subject: {
      es: 'Recibí tu mensaje — te respondo en 48 horas hábiles',
      en: 'I got your message — I reply within 48 business hours',
    },
    preheader: {
      es: 'Te adjunto mi CV. Respondo personalmente en 48 horas hábiles.',
      en: 'My CV is attached. I reply personally within 48 business hours.',
    },
    paragraphs: [
      {
        es: 'Recibí tu consulta y ya está en mi bandeja. Leo todo personalmente, sin filtros ni formularios de candidatura.',
        en: 'Your message landed in my inbox. I read everything personally, no filters and no application forms.',
      },
      {
        es: 'Diseño y desarrollo productos web de punta a punta. En cada proyecto documento las decisiones: qué se resolvió, qué se descartó y por qué. Es lo primero que muestro cuando entro a un equipo, porque se nota rápido si alguien puede explicar sus propios trade-offs.',
        en: 'I design and build web products end to end. On every project I document the decisions: what got solved, what got dropped, and why. That is the first thing I show when I join a team, because it shows quickly whether someone can explain their own trade-offs.',
      },
      {
        // "y la prefiero antes" no tenía objeto y quedaba incompleto.
        es: 'Voy a responderte personalmente en un plazo de 48 horas hábiles. Si la búsqueda tiene fecha límite y te sirve que te responda antes, decímelo en el mensaje y la acelero.',
        en: 'I will reply to you personally within 48 business hours. If the search has a deadline and it would help you to hear from me earlier, say so in your message and I will move faster.',
      },
      {
        // El link del CV no va acá: lo lleva el callout, para no repetir la URL.
        es: 'Te adjunto mi CV en PDF y más abajo te dejo el archivo por si querés abrirlo en el navegador.',
        en: 'I attached my CV as a PDF, and the file is further down if you would rather open it in the browser.',
      },
      {
        es: 'Si te resulta más cómodo, {wa}.',
        en: 'If it is easier, {wa}.',
      },
    ],
    close: { es: 'Gracias de nuevo.', en: 'Thanks again.' },
  },
  hi: {
    subject: { es: 'Recibí tu mensaje', en: 'I got your message' },
    preheader: { es: 'Gracias por escribir.', en: 'Thanks for reaching out.' },
    paragraphs: [
      {
        es: 'Recibí tu mensaje y está en mi bandeja. Gracias por tomarte el tiempo.',
        en: 'I got your message and it is in my inbox. Thanks for taking the time.',
      },
      {
        // "escribime por acá o {wa}" se leía "escribime por acá o escribime por WhatsApp".
        // Y "por acá" no significaba nada: la persona ya está respondiendo por email.
        es: 'Si en algún momento querés contarme qué estás armando, {wa}.',
        en: 'If you ever want to tell me what you are building, {wa}.',
      },
    ],
    close: { es: 'Saludos.', en: 'Best,' },
  },
};

const UI = {
  greeting: { es: 'Hola', en: 'Hi' },
  // Rótulo de `{wa}`. Es una frase completa a propósito: si fuera la palabra
  // "WhatsApp", las oraciones que ya decían "por WhatsApp: {wa}" se leían como
  // "por WhatsApp: WhatsApp".
  whatsappLink: { es: 'escribime por WhatsApp', en: 'message me on WhatsApp' },
  viewPortfolio: { es: 'Ver el portfolio', en: 'View the portfolio' },
  openWhatsapp: { es: 'Escribir por WhatsApp', en: 'Message on WhatsApp' },
  openLinkedin: { es: 'Ver LinkedIn', en: 'Open LinkedIn' },
  cvAttached: { es: 'CV en PDF', en: 'CV as PDF' },
  cvOpen: { es: 'Ver el CV', en: 'Open the CV' },
  // La firma antes vivía partida entre `signature` y `signatureBlock()`.
  signatureRole: {
    es: 'Gonzalo Daniel Vega · Full Stack Developer',
    en: 'Gonzalo Daniel Vega · Full Stack Developer',
  },
  footerNote: {
    es: 'Este mensaje se envió desde el formulario de gonzalodanielvega.com. Respondé a este correo y me llega directo.',
    en: 'This message was sent from the contact form at gonzalodanielvega.com. Replying to this email reaches me directly.',
  },
} satisfies Record<string, Bilingual>;

const NOTIF_LABELS = {
  from: { es: 'Nombre', en: 'Name' },
  email: { es: 'Email', en: 'Email' },
  reason: { es: 'Motivo', en: 'Reason' },
  language: { es: 'Idioma del mensaje', en: 'Message language' },
  received: { es: 'Recibido', en: 'Received' },
  message: { es: 'Mensaje', en: 'Message' },
  replyCta: { es: 'Responder ahora', en: 'Reply now' },
  portfolioCta: { es: 'Ver el portfolio', en: 'View the portfolio' },
  whatsappCta: { es: 'WhatsApp', en: 'WhatsApp' },
  visitor: { es: 'Mensaje nuevo desde el portfolio', en: 'New message from the portfolio' },
  title: { es: 'Mensaje de {name}', en: 'Message from {name}' },
  /** Pie de la notificación: deja explícito a dónde va la respuesta. */
  replyHint: {
    es: 'Si le das "Responder", el correo llega directo a {email}.',
    en: 'If you hit reply, the email goes straight to {email}.',
  },
} satisfies Record<string, Bilingual>;

/**
 * Normaliza finales de línea a `\n`.
 *
 * El mensaje del visitante se convierte con `replace(/\n/g, '<br>')`, que no
 * toca un `\r` suelto: si mandan el texto con CRLF, el `\r` quedaba vivo en el
 * HTML. No es un problema de seguridad (un `\r` en el cuerpo es espacio en
 * blanco para el parser), pero es un caracter de control basura.
 */
function normalizeNewlines(value: string): string {
  return value.replace(/\r\n?/g, '\n');
}

export function escapeHtml(value: string): string {
  return normalizeNewlines(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Oculta la línea de vista previa del cliente de correo, sin este hack Gmail la muestra en blanco. */
function preheaderBlock(text: string): string {
  return `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;color:${C.bg};">${escapeHtml(
    text,
  )}</div>`;
}

/** Rótulo mono en mayúsculas: el mismo patrón que los "chapter" del sitio. */
function sectionLabel(text: string): string {
  return `<p class="muted" style="margin:0;font-family:${MONO};font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:${C.muted};">${escapeHtml(
    text,
  )}</p>`;
}

function button(href: string, label: string, primary = false): string {
  const bg = primary ? C.accent : 'transparent';
  const fg = primary ? '#f9f7f2' : C.accent;
  // El href se escapa porque el `mailto:` del botón "Responder ahora" lleva
  // `?subject=...&body=...`. Con la `&` cruda el atributo queda mal formado, y
  // un parser estricto puede cortar el enlace justo antes del body.
  return `<a class="btn" href="${escapeHtml(href)}" style="display:inline-block;padding:12px 22px;border:1px solid ${C.accent};border-radius:2px;background:${bg};color:${fg};font-family:${MONO};font-size:11px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;margin:0 8px 10px 0;">${escapeHtml(
    label,
  )}</a>`;
}

/**
 * Identidad del remitente dibujada en HTML, sin una sola imagen.
 *
 * El dominio de Resend tiene `open_tracking=False`, así que los assets servidos
 * por URL no pasan por proxy, y Gmail bloquea las imágenes remotas por defecto.
 * Un logo por URL se vería como un recuadro vacío en la mayoría de los clientes,
 * así que la marca se resuelve con tipografía.
 */
function monogram(): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;"><tr><td align="center" style="border:1px solid ${C.accent};padding:10px 8px 9px 8px;font-family:${MONO};font-size:14px;font-weight:500;letter-spacing:0.1em;color:${C.accent};line-height:1;white-space:nowrap;">GDV</td></tr></table>`;
}

/** Hairline. Va como celda con bgcolor porque Outlook ignora `border` en divs. */
function divider(): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;"><tr><td height="1" bgcolor="${C.border}" style="height:1px;line-height:1px;font-size:0;">&nbsp;</td></tr></table>`;
}

/**
 * Panel con barra de acento a la izquierda. Mismo criterio que `divider`: la
 * barra es una celda de 3px con bgcolor, no un `border-left`, porque el motor de
 * Word de Outlook no lo aplica a divs.
 */
function accentPanel(content: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
      <tr>
        <td width="3" bgcolor="${C.accent}" style="width:3px;font-size:0;line-height:0;">&nbsp;</td>
        <td bgcolor="${C.accentSoft}" style="padding:14px 16px;font-family:${SANS};font-size:14px;line-height:1.65;color:${C.ink};">${content}</td>
      </tr>
    </table>`;
}

/** Callout del CV, solo para `hiring`. Reemplaza la línea suelta de "Adjunto:". */
function cvCallout(lang: Lang, filename: string, cvUrl: string): string {
  return accentPanel(`
      ${sectionLabel(UI.cvAttached[lang])}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;margin-top:8px;">
        <tr>
          <td valign="middle" class="muted" style="font-family:${MONO};font-size:12px;color:${C.muted};word-break:break-all;">${escapeHtml(filename)}</td>
          <td valign="middle" align="right" style="padding-left:12px;font-family:${MONO};font-size:11px;letter-spacing:0.06em;text-transform:uppercase;white-space:nowrap;"><a href="${escapeHtml(cvUrl)}" style="color:${C.accent};text-decoration:none;font-weight:500;">${escapeHtml(
            UI.cvOpen[lang],
          )} &rarr;</a></td>
        </tr>
      </table>`);
}

function documentShell(lang: Lang, title: string, preheader: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="${lang}" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<meta name="x-apple-disable-message-reformatting">
<title>${escapeHtml(title)}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
  :root { color-scheme: light; supported-color-schemes: light; }
  body { margin:0; padding:0; width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table { border-collapse: collapse; }
  img { border:0; outline:none; text-decoration:none; }
  a { color:${C.accent}; }
  @media only screen and (max-width:620px) {
    .container { width:100% !important; }
    .gutter { padding-left:22px !important; padding-right:22px !important; }
    .h1 { font-size:25px !important; line-height:1.25 !important; }
    .btn { display:block !important; text-align:center !important; }
  }
  @media (prefers-color-scheme: dark) {
    .paper { background:${C.paper} !important; }
    .ink { color:${C.ink} !important; }
    .body-text { color:${C.body} !important; }
    .muted { color:${C.muted} !important; }
    .card, .rule { background:${C.bg} !important; border-color:${C.border} !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.bg};">
${preheaderBlock(preheader)}
<table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;margin:0 auto;background:${C.bg};">
  <tr><td style="height:24px;line-height:24px;font-size:0;">&nbsp;</td></tr>
  <tr>
    <td class="gutter" style="padding:0 34px 0 34px;">
      <table role="presentation" class="paper" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.paper};border:1px solid ${C.border};">
        <tr>
          <td class="gutter" style="padding:28px 34px 0 34px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
              <tr>
                <td valign="middle" style="padding-right:15px;">${monogram()}</td>
                <td valign="middle">
                  <p style="margin:0;font-family:${MONO};font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${C.accent};font-weight:bold;">gonzalodanielvega.com</p>
                  <p class="muted" style="margin:5px 0 0 0;font-family:${MONO};font-size:11px;letter-spacing:0.04em;color:${C.muted};">Portfolio 2026 &middot; Full Stack Developer</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td class="gutter" style="padding:18px 34px 0 34px;">
            <div style="height:3px;width:44px;background:${C.accent};font-size:0;line-height:0;">&nbsp;</div>
          </td>
        </tr>
        <tr>
          <td class="gutter" style="padding:22px 34px 30px 34px;">
            ${body}
          </td>
        </tr>
        <tr>
          <td class="gutter" style="padding:0 34px 26px 34px;">
            ${divider()}
          </td>
        </tr>
        <tr>
          <td class="gutter" style="padding:14px 34px 30px 34px;">
            <p class="muted" style="margin:0;font-family:${SANS};font-size:11px;line-height:1.7;color:${C.muted};">${escapeHtml(
              UI.footerNote[lang],
            )}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr><td style="height:24px;line-height:24px;font-size:0;">&nbsp;</td></tr>
</table>
</body>
</html>`;
}

/**
 * Firma única. Antes el HTML cerraba con `variant.close` + `UI.signature` y
 * después llamaba a esta función, así que el nombre y la ubicación salían dos
 * veces. Tampoco lleva una línea con el nombre suelto: el bloque ya dice
 * "Gonzalo Daniel Vega", y "Gonzalo" justo arriba volvía a ser redundante.
 */
function signatureBlock(lang: Lang): string {
  return `
      <p class="muted" style="margin:26px 0 0 0;font-family:${MONO};font-size:11px;letter-spacing:0.03em;color:${C.muted};">${escapeHtml(
        UI.signatureRole[lang],
      )}</p>
      <p class="muted" style="margin:3px 0 0 0;font-family:${MONO};font-size:11px;letter-spacing:0.03em;color:${C.muted};">${escapeHtml(
        LOCATION,
      )}</p>`;
}

export interface AckInput {
  name: string;
  reason: ReasonKey;
  lang: Lang;
  siteUrl: string;
}

export interface BuiltMail {
  subject: string;
  html: string;
  text: string;
}

export function buildAck(input: AckInput): BuiltMail {
  const { name, reason, lang, siteUrl } = input;
  const variant = COPY[reason];
  const origin = siteUrl.replace(/\/+$/, '');
  const plainName = normalizeNewlines(name).trim();
  const safeName = escapeHtml(plainName);
  const cvUrl = `${origin}/cv-${lang}.pdf`;

  const links = {
    wa: `<a href="${escapeHtml(WHATSAPP_URL)}" style="color:${C.accent};text-decoration:underline;">${escapeHtml(
      UI.whatsappLink[lang],
    )}</a>`,
  };

  const paragraphs = variant.paragraphs.map((p) => {
    const withLinks = p[lang].replace('{wa}', links.wa).replace(/\{wa\}/g, '');
    return `<p class="body-text" style="margin:0 0 16px 0;font-family:${SANS};font-size:15px;line-height:1.7;color:${C.body};">${withLinks}</p>`;
  });

  // El CV se anuncia una sola vez: acá va el callout con el archivo y el link. La
  // prosa dice "te adjunto el CV" sin volver a poner la URL, que antes quedaba
  // dos veces en el mismo correo.
  const cvBlock = reasonNeedsCv(reason)
    ? `<div style="margin:20px 0 0 0;">${cvCallout(lang, cvFilename(lang), cvUrl)}</div>`
    : '';

  const body = `
    <h1 class="h1 ink" style="margin:0 0 16px 0;font-family:${SERIF};font-size:30px;line-height:1.2;font-weight:normal;color:${C.ink};letter-spacing:-0.01em;">
      ${escapeHtml(UI.greeting[lang])}${plainName ? `, ${safeName}` : ''}
    </h1>
    ${paragraphs.join('')}
    ${cvBlock}
    <p style="margin:24px 0 0 0;">
      ${button(origin, UI.viewPortfolio[lang], true)}
      ${button(WHATSAPP_URL, UI.openWhatsapp[lang])}
    </p>
    <p class="body-text" style="margin:22px 0 0 0;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.body};">${escapeHtml(
      variant.close[lang],
    )}</p>
    ${signatureBlock(lang)}
  `;

  const subject = `${variant.subject[lang]}${plainName ? `, ${plainName}` : ''}`;

  const textLines = [
    `${UI.greeting[lang]}${plainName ? ` ${plainName},` : ''}`,
    '',
    // El rótulo de `{wa}` va con la URL entre paréntesis. Apendearla con ": " chocaba
    // con las oraciones que ya terminan en ": {wa}" y salía "there: message me on
    // WhatsApp: https://wa.me/...".
    ...variant.paragraphs.map((p) =>
      p[lang].replace(/\{wa\}/g, `${UI.whatsappLink[lang]} (${WHATSAPP_URL})`),
    ),
    '',
    variant.close[lang],
    UI.signatureRole[lang],
    LOCATION,
    '',
    reasonNeedsCv(reason) ? `${UI.cvAttached[lang]}: ${cvUrl}` : '',
    `${UI.viewPortfolio[lang]}: ${origin}`,
    `${UI.openWhatsapp[lang]}: ${WHATSAPP_URL}`,
    `${UI.openLinkedin[lang]}: ${LINKEDIN_URL}`,
  ].filter((l) => l !== '');

  return {
    subject,
    html: documentShell(lang, subject, variant.preheader[lang], body),
    text: textLines.join('\n'),
  };
}

export interface NotificationInput {
  name: string;
  email: string;
  reason: ReasonKey;
  reasonLabel: string;
  message: string;
  lang: Lang;
  siteUrl: string;
  receivedAt: Date;
}

function formatTimestamp(date: Date, lang: Lang): string {
  try {
    return new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'es-AR', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'America/Argentina/Catamarca',
    }).format(date);
  } catch {
    return date.toISOString();
  }
}

export function buildNotification(input: NotificationInput): BuiltMail {
  const { name, email, reason, reasonLabel, message, lang, siteUrl, receivedAt } = input;
  const origin = siteUrl.replace(/\/+$/, '');
  // El `.txt` inserta estos valores sin pasar por `escapeHtml` (en texto plano no
  // hay que escapar), así que hay que normalizarlos por separado.
  const plainName = normalizeNewlines(name).trim();
  const plainMessage = normalizeNewlines(message);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
  const subject = `[Portfolio] ${REASON_LABEL[reason][lang]} — ${plainName}`;
  const label = reasonLabel || REASON_LABEL[reason][lang];

  // Botón "Responder ahora": antes solo prellenaba el asunto y el cliente abría
  // en blanco. Con el saludo ya escrito, la diferencia entre contestar y que el
  // mensaje muera en el limbo es un click.
  const greeting = lang === 'en' ? `Hi ${plainName},\r\n\r\n` : `Hola ${plainName},\r\n\r\n`;
  const mailto = `mailto:${email}?subject=${encodeURIComponent(`Re: ${subject}`)}&body=${encodeURIComponent(greeting)}`;

  // El prefijo de WhatsApp ahora saluda a Gonzalo, que es quien lo va a clickear.
  // Antes decía "Hola <nombre del visitante>", como si fuera él el que escribía.
  const waText =
    lang === 'en'
      ? `Hi Gonzalo, I am writing about "${label}" from your portfolio.`
      : `Hola Gonzalo, te escribo por "${label}" desde tu portfolio.`;
  const waUrl = `${WHATSAPP_URL}?text=${encodeURIComponent(waText)}`;

  const rows: Array<[string, string]> = [
    [NOTIF_LABELS.from[lang], escapeHtml(name)],
    [NOTIF_LABELS.email[lang], `<a href="mailto:${escapeHtml(email)}" style="color:${C.accent};">${escapeHtml(email)}</a>`],
    [NOTIF_LABELS.reason[lang], escapeHtml(label)],
    [NOTIF_LABELS.language[lang], lang === 'en' ? 'English' : 'Español'],
    [NOTIF_LABELS.received[lang], formatTimestamp(receivedAt, lang)],
  ];

  // Hairline entre filas: le da a la ficha la lectura de "datos", no de párrafo.
  const table = rows
    .map(([rowLabel, value], i) => {
      const rule = i < rows.length - 1 ? `border-bottom:1px solid ${C.border};` : '';
      return `<tr>
        <td class="muted" style="padding:9px 16px 9px 0;${rule}font-family:${MONO};font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:${C.muted};white-space:nowrap;vertical-align:top;">${rowLabel}</td>
        <td class="body-text" style="padding:9px 0;${rule}font-family:${SANS};font-size:14px;line-height:1.5;color:${C.body};word-break:break-word;vertical-align:top;">${value}</td>
      </tr>`;
    })
    .join('');

  const body = `
    ${sectionLabel(NOTIF_LABELS.visitor[lang])}
    <h1 class="h1 ink" style="margin:10px 0 14px 0;font-family:${SERIF};font-size:28px;line-height:1.2;font-weight:normal;color:${C.ink};letter-spacing:-0.01em;">
      ${escapeHtml(
        NOTIF_LABELS.title[lang].replace('{name}', name),
      )}
    </h1>
    <p style="margin:0 0 22px 0;">
      <span style="display:inline-block;background:${C.accentSoft};border:1px solid ${C.accent};color:${C.accent};font-family:${MONO};font-size:10px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;padding:5px 10px;border-radius:2px;">${escapeHtml(
        REASON_LABEL[reason][lang],
      )}</span>
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;margin:20px 0 0 0;">
      ${table}
    </table>
    <div style="margin:22px 0 0 0;">${sectionLabel(NOTIF_LABELS.message[lang])}</div>
    <div style="margin:8px 0 0 0;">${accentPanel(safeMessage)}</div>
    <p style="margin:24px 0 0 0;">
      ${button(mailto, NOTIF_LABELS.replyCta[lang], true)}
      ${button(waUrl, NOTIF_LABELS.whatsappCta[lang])}
    </p>
    <p class="muted" style="margin:14px 0 0 0;font-family:${SANS};font-size:11px;line-height:1.7;color:${C.muted};">${escapeHtml(
      NOTIF_LABELS.replyHint[lang].replace('{email}', email),
    )}</p>
  `;

  const text = [
    NOTIF_LABELS.visitor[lang],
    '',
    NOTIF_LABELS.title[lang].replace('{name}', plainName),
    '',
    `${NOTIF_LABELS.from[lang]}: ${plainName}`,
    `${NOTIF_LABELS.email[lang]}: ${email}`,
    `${NOTIF_LABELS.reason[lang]}: ${label}`,
    `${NOTIF_LABELS.language[lang]}: ${lang === 'en' ? 'English' : 'Español'}`,
    `${NOTIF_LABELS.received[lang]}: ${formatTimestamp(receivedAt, lang)}`,
    '',
    `${NOTIF_LABELS.message[lang]}`,
    '-'.repeat(48),
    plainMessage,
    '-'.repeat(48),
    '',
    `${NOTIF_LABELS.replyCta[lang]}: ${mailto}`,
    `${NOTIF_LABELS.whatsappCta[lang]}: ${waUrl}`,
    NOTIF_LABELS.replyHint[lang].replace('{email}', email),
    `${NOTIF_LABELS.portfolioCta[lang]}: ${origin}`,
  ].join('\n');

  return {
    subject,
    html: documentShell(lang, subject, `${NOTIF_LABELS.visitor[lang]} — ${plainName}`, body),
    text,
  };
}

export function buildPreview(reason: ReasonKey, lang: Lang, siteUrl: string): { ack: BuiltMail; notification: BuiltMail } {
  const name = 'Alex Rivera';
  const email = 'alex.rivera@example.com';
  const message =
    lang === 'en'
      ? 'Hi Gonzalo, we are building a booking platform for clinics and I saw your Content Studio case study. Our main problem is that the team cannot keep the design system consistent across 3 products. Are you available for a call next week?'
      : 'Hola Gonzalo, estamos armando una plataforma de turnos para clínicas y vi tu caso de Content Studio. Nuestro problema es que no podemos mantener consistente el sistema de diseño entre 3 productos. ¿Tenés disponibilidad para una llamada la semana que viene?';
  // Textos exactos de los chips, copiados de `contact.reasons` en
  // src/i18n/translations.ts. Si el preview los hardcodea en uno solo, la
  // notificación de "equipo" sale diciendo "Motivo: Tengo un problema complejo".
  // Viven acá y no se importan porque este archivo no importa nada, a propósito.
  const PREVIEW_REASON_LABEL: Record<ReasonKey, Bilingual> = {
    work: { es: 'Tengo un problema complejo', en: 'I have a complex problem' },
    product: { es: 'Quiero conversar sobre producto', en: 'I want to talk about product' },
    hiring: { es: 'Quiero sumar tu criterio a un equipo', en: 'I want to add your judgment to a team' },
    hi: { es: 'Solo quería saludar', en: 'I just wanted to say hi' },
  };

  return {
    ack: buildAck({ name, reason, lang, siteUrl }),
    notification: buildNotification({
      name,
      email,
      reason,
      reasonLabel: PREVIEW_REASON_LABEL[reason][lang],
      message,
      lang,
      siteUrl,
      receivedAt: new Date('2026-03-18T14:32:00Z'),
    }),
  };
}
