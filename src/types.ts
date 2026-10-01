/**
 * Nivel de entrega del proyecto. Es un union y no un `string` a proposito: los
 * 7 valores viven en español en los datos (asi se escribieron una vez) pero se
 * renderizan traducidos via i18n/translations.ts. Con `string` libre, un valor
 * nuevo se colaba en las 15 paginas del sitio sin traduccion y salia en
 * español en la version inglesa.
 */
export type CriteriaLevel =
  | 'Demo Conceptual'
  | 'Demo Funcional'
  | 'Herramienta Interna'
  | 'Herramienta Personal'
  | 'Recurso Abierto'
  | 'Sistema en Producción'
  | 'Producción Real';

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  chapterNumber: string;
  tagline: string;
  type: 'personal' | 'real' | 'tool' | 'particular' | 'career';
  url?: string;
  screenshot?: string; // Portada propia cuando el proyecto no tiene sitio web publico
  pointOfDeparture: string; // El punto de partida
  investigation: string; // Qué investigué
  insight: string; // Qué entendí
  options?: Array<{ title: string; pros?: string; cons?: string; text?: string }>; // Opciones consideradas
  decision: string; // La decisión
  workedWell: string; // Lo que funcionó
  tradeoffs: string; // Límites y tradeoffs
  differentToday: string; // Qué haría distinto hoy
  demonstrates?: string; // Qué demuestra o aprendizajes
  criteriaLevel?: CriteriaLevel; // Nivel de entrega: demo, herramienta, producción
  criteriaInsight?: string; // Frase de criterio única por proyecto
  metric?: string; // Resultado en formato Antes/Después (solo si aplica)
  repoFront?: string; // Repositorio frontend
  repoBack?: string; // Repositorio backend (si aplica)
  tools: string[]; // Herramientas elegidas
}

export interface JournalEntry {
  id: string;
  title: string;
  titleEn?: string;
  /** ISO 'YYYY-MM-DD'. Se formatea al renderizar con formatEntryDate(). */
  date: string;
  category: string;
  categoryEn?: string;
  tagline: string;
  taglineEn?: string;
  content: string;
  contentEn?: string;
}
