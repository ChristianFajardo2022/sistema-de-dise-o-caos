import { useSyncExternalStore } from 'react';

/** Corte móvil: menos de 48rem, el mismo que la variante `mobile:` de tokens.css (modo Mobile de Figma). */
export const MOBILE_QUERY = '(width < 48rem)';
/** Reducir movimiento (WCAG 2.3.3): quien lo activa no quiere desplazamientos animados. */
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** Lectura puntual (para manejadores de eventos): `false` si no hay `window` o `matchMedia`. */
export function matchesMedia(query: string): boolean {
  return typeof window !== 'undefined' && Boolean(window.matchMedia?.(query).matches);
}

/**
 * Suscribe un componente a una media query. En servidor (y en la hidratación) devuelve `serverValue`
 * (por defecto `false`); en el cliente se actualiza solo cuando la consulta cambia.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (notify) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener('change', notify);
      return () => mql.removeEventListener('change', notify);
    },
    () => matchesMedia(query),
    () => serverValue
  );
}

/** `true` en viewport móvil (menos de 48rem). */
export const useIsMobile = (): boolean => useMediaQuery(MOBILE_QUERY);
