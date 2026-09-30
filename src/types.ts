export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  chapterNumber: string;
  tagline: string;
  type: 'personal' | 'real' | 'tool' | 'particular' | 'career';
  url?: string;
  screenshot?: string;
  pointOfDeparture: string; // El punto de partida
  investigation: string; // Qué investigué
  insight: string; // Qué entendí
  options?: Array<{ title: string; pros?: string; cons?: string; text?: string }>; // Opciones consideradas
  decision: string; // La decisión
  workedWell: string; // Lo que funcionó
  tradeoffs: string; // Límites y tradeoffs
  differentToday: string; // Qué haría distinto hoy
  demonstrates?: string; // Qué demuestra o Aprendizajes
  criteriaLevel?: string; // Nivel de entrega: Demo, Producción, etc.
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
  date: string;
  readingTime: string;
  readingTimeEn?: string;
  category: string;
  categoryEn?: string;
  tagline: string;
  taglineEn?: string;
  content: string;
  contentEn?: string;
}
