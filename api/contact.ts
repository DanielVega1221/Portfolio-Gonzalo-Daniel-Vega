import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { name, email, reason, message } = body || {};

    if (!email || !message) {
      return res.status(400).json({ error: 'Email y mensaje requeridos' });
    }

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ error: 'RESEND_API_KEY no configurada en Vercel' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: 'Portfolio GDV <onboarding@resend.dev>',
      to: 'dvega6442@gmail.com',
      subject: `[Portfolio] ${stripCrLf(reason || 'Consulta')} — ${stripCrLf(name || email)}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #a84432;">Nueva consulta desde el portfolio</h2>
          <hr style="border: 1px solid #e5e2de;" />
          <p><strong>Nombre:</strong> ${escapeHtml(name || 'No especificado')}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Motivo:</strong> ${escapeHtml(reason || 'No especificado')}</p>
          <hr style="border: 1px solid #e5e2de;" />
          <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
          <hr style="border: 1px solid #e5e2de;" />
          <p style="color: #999; font-size: 12px;">Enviado desde el formulario de contacto del portfolio.</p>
        </div>
      `,
    });

    if (result.error) {
      console.error('[Contact] Resend error:', result.error);
      return res.status(500).json({ error: result.error.message || 'Error de Resend' });
    }

    console.log('[Contact] Email sent:', result.data?.id);
    return res.status(200).json({ success: true, id: result.data?.id });
  } catch (error) {
    console.error('[Contact] Error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Error al enviar',
    });
  }
}
