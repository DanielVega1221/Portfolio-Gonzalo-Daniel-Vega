import { useCallback } from 'react';
import { useLanguage } from './useLanguage';

export type Translatable = { es: string; en: string };

export function useT() {
  const { lang } = useLanguage();
  return useCallback((p: Translatable) => p[lang], [lang]);
}