// Única fuente de verdad de las galerías de cada proyecto.
//
// Antes el componente asumía `[1, 2, 3]` y un contador `/ 3` para todos los
// proyectos. Eso producía tres bugs: un proyecto sin imágenes mostraba slots
// vacíos, el contador mentía, y `failedImages` (que nunca se reseteaba al
// cambiar de proyecto) dejaba los placeholders pegados en los proyectos
// siguientes. Declarar el conteo acá hace que un proyecto sin galería oculte
// el disparador en vez de prometer imágenes que no existen.
//
// FORMATO ESTRICTO: una entrada por línea, clave entre comillas simples,
// valor entero. `scripts/sitemap.mjs` parsea este archivo para verificar en
// build que 01.webp..NN.webp existan de verdad; si cambiás el formato, hay que
// actualizar el regex de ese script.

export const GALLERY_COUNTS: Record<string, number> = {
  'brunn-studio': 3,
  'lumen': 3,
  'marea': 3,
  'stro-atelier': 3,
  'zabira-studio': 3,
  'content-studio': 3,
  'uxnicorp-academy': 3,
  'la-pagina-de-uxnicorp': 3,
  'myvisor': 3,
  'electropower': 3,
  'jimena-vilte': 3,
  'patagenda': 3,
  'ducksale': 3,
  'comercial-rio-hondo': 3,
  'isdep': 3,
};

/** Rutas de las capturas de un proyecto, en orden. Vacío si no tiene galería. */
export function galleryImages(projectId: string): string[] {
  const count = GALLERY_COUNTS[projectId] ?? 0;
  return Array.from({ length: count }, (_, i) => `/projects/${projectId}/${String(i + 1).padStart(2, '0')}.webp`);
}
