import { useEffect, type RefObject } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Atrapa el foco dentro de un dialogo mientras esta abierto y lo devuelve al
 * elemento que lo abrio al cerrarse.
 *
 * Antes los tres overlays del sitio (galeria, lightbox y el cajon de Studio
 * Tapes) tenian `role="dialog"` y `aria-modal="true"` pero nada que sujetara el
 * foco: el Tab se escapaba al contenido de fondo y sebia el document scrollando
 * por detras, asi que un lector de pantalla con el foco liberado leia el
 * cuerpo de la pagina en vez del dialogo. `aria-modal` no lo arregla por si
 * solo, es una declaracion; hace falta mover el foco de verdad.
 *
 * Se captura la fase para ganarle al resto de handlers de teclado de la pagina.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean
) {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
      );

    // Al abrir, el foco entra al primer control util del dialogo.
    const initial = focusables()[0];
    if (initial) initial.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;

      // Si el foco esta fuera del dialogo (por un click o por un click en el
      // fondo), lo metemos de vuelta antes de decidir en que borde estamos.
      if (!container.contains(current)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }

      if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      // Devolver el foco a donde estaba evita que al cerrarse el dialogo el
      // usuario quede en document.body y el siguiente Tab arranque desde arriba.
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, [active, containerRef]);
}
