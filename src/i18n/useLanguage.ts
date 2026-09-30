import { createContext, useContext } from 'react';

export type Lang = 'es' | 'en';

export interface LangContextType {
  lang: Lang;
  toggleLang: () => void;
}

export const LangContext = createContext<LangContextType>({
  lang: 'es',
  toggleLang: () => {},
});

export function useLanguage() {
  return useContext(LangContext);
}

export function localizePath(path: string, targetLang: Lang): string {
  const base = path.replace(/^\/en(?=\/|$|\?|#)/, '') || '/';
  if (targetLang === 'es') return base;
  if (base === '/') return '/en';
  return `/en${base}`;
}