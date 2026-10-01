import { journalEntries } from '../data/journal';
import type { JournalEntry } from '../types';

export type Lang = 'es' | 'en';

/**
 * Las fechas viven en los datos como ISO ('2026-09-10') porque asi se pueden
 * ordenar y comparar. Antes se renderizaban crudas, y las cuatro notas mostraban
 * "2026-09-10" al lado de un icono de calendario.
 *
 * Se parsean a mano en UTC y no con `new Date(iso)`: el constructor de Date
 * trata un string sin zona horaria como hora local, y en Catamarca (UTC-3) eso
 * retrocedia la fecha un dia y hacia que la nota se ordenara en el dia
 * equivocado.
 */
function parseIsoDate(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

export function formatEntryDate(iso: string, lang: Lang): string {
  const date = parseIsoDate(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatEntryDateShort(iso: string, lang: Lang): string {
  const date = parseIsoDate(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'es-AR', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

const WORDS_PER_MINUTE = 220;

/**
 * Tiempo de lectura derivado del texto en vez de escrito a mano. Las cuatro
 * notas declaraban "5 min de lectura" y ninguna se acercaba: la mas corta
 * tiene ~430 palabras, la mas larga ~1.100.
 */
export function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function readingTimeLabel(entry: JournalEntry, lang: Lang): string {
  const content = lang === 'en' && entry.contentEn ? entry.contentEn : entry.content;
  const minutes = readingMinutes(content);
  return lang === 'en' ? `${minutes} min read` : `${minutes} min de lectura`;
}

/** Las notas se ordenan de mas nueva a mas vieja; el indice es estable. */
const sortedNewestFirst = [...journalEntries].sort(
  (a, b) => parseIsoDate(b.date).getTime() - parseIsoDate(a.date).getTime()
);

/**
 * Numeracion de cuaderno. Antes era el literal "CUADERNO No. 01" en las cuatro
 * notas, y "CUADERNO DE CAMPO — 2026" en el pie, aunque una nota es de 2025.
 * Ahora sale del orden real: la mas antigua es 001.
 */
export function notebookNumber(entryId: string): string {
  const index = sortedNewestFirst.findIndex((e) => e.id === entryId);
  if (index === -1) return '001';
  return String(sortedNewestFirst.length - index).padStart(3, '0');
}

export function fieldNotebookLabel(entry: JournalEntry, lang: Lang): string {
  const year = parseIsoDate(entry.date).getUTCFullYear();
  return lang === 'en' ? `FIELD NOTEBOOK — ${year}` : `CUADERNO DE CAMPO — ${year}`;
}
