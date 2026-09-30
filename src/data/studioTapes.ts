export interface Tape {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  durationSeconds: number; // For fallback simulation of progress if audio fails to load or for direct calculation
  description: string;
  descriptionEn?: string;
  coverColor: string; // Tailored beautiful terracotta, slate, warm amber, moss green shades
  audioFile: string;
  suggestedPages: string[];
}

export const studioTapes: Tape[] = [
  {
    id: 'tape-01',
    title: 'FIELD NOTES 01',
    subtitle: 'Late Night Coding',
    duration: '3:14',
    durationSeconds: 194,
    description: 'Textura lo-fi, sintetizadores lentos y un pulso constante diseñado para sostener la concentración en la oscuridad.',
    descriptionEn: 'Lo-fi textures, slow synthesizers, and a steady pulse designed to sustain concentration in the dark.',
    coverColor: '#a84432', // Terracotta
    audioFile: '/audio/field-notes-01.mp3',
    suggestedPages: ['home']
  },
  {
    id: 'tape-02',
    title: 'FIELD NOTES 02',
    subtitle: 'Reading Session',
    duration: '2:54',
    durationSeconds: 174,
    description: 'Guitarras acústicas con sutil eco y grabaciones de campo que invitan a la lectura lenta y la asimilación conceptual.',
    descriptionEn: 'Acoustic guitars with subtle echo and field recordings that invite slow reading and conceptual absorption.',
    coverColor: '#2b3a4a', // Slate Blue
    audioFile: '/audio/field-notes-02.mp3',
    suggestedPages: ['journal']
  },
  {
    id: 'tape-03',
    title: 'FIELD NOTES 03',
    subtitle: 'Building Products',
    duration: '4:28',
    durationSeconds: 268,
    description: 'Piano relajado y melodías con saxofón que combinan calma y movimiento. Perfecta para sesiones de prototipado con ritmo pero sin ansiedad.',
    descriptionEn: 'Relaxed piano and saxophone melodies that blend calm and movement. Perfect for prototyping sessions with rhythm but without anxiety.',
    coverColor: '#cbc8bf', // Warm Gray
    audioFile: '/audio/field-notes-03.mp3',
    suggestedPages: ['portfolio']
  },
  {
    id: 'tape-04',
    title: 'FIELD NOTES 04',
    subtitle: 'Sunday Morning',
    duration: '4:33',
    durationSeconds: 273,
    description: 'Jazz ambiental melancólico y piano pausado. Ideal para asimilar retrospectivas y escribir notas personales.',
    descriptionEn: 'Melancholic ambient jazz and paused piano. Ideal for assimilating retrospectives and writing personal notes.',
    coverColor: '#e0ccb6', // Sand Warm
    audioFile: '/audio/field-notes-04.mp3',
    suggestedPages: ['about']
  },
  {
    id: 'tape-05',
    title: 'FIELD NOTES 05',
    subtitle: 'Viernes al Fin',
    duration: '3:12',
    durationSeconds: 192,
    description: 'Bachata instrumental cálida y envolvente. La banda sonora perfecta para cerrar la semana productiva y recibir el fin de semana con buena energía.',
    descriptionEn: 'Warm and enveloping instrumental bachata. The perfect soundtrack to close a productive week and welcome the weekend with good energy.',
    coverColor: '#c47a38', // Warm amber/orange
    audioFile: '/audio/field-notes-05.mp3',
    suggestedPages: ['contact']
  }
];
