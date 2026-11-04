import { createContext, useContext, useSyncExternalStore } from 'react';

/** Corte móvil: menos de 48rem, el mismo que la variante `mobile:` de tokens.css (modo Mobile de Figma). */
export const MOBILE_QUERY = '(width < 48rem)';
/** Reducir movimiento (WCAG 2.3.3): quien lo activa no quiere desplazamientos animados. */
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** Lectura puntual (para manejadores de eventos): `false` si no hay `window` o `matchMedia`. */
export function matchesMedia(query: string): boolean {
  return typeof window !== 'undefined' && Boolean(window.matchMedia?.(query).matches);
}

/**
 * Ancho simulado para las media queries de ancho (`width < …`, `min-width: …`). Lo provee el marco de breakpoint de la
 * documentación para que un componente se dibuje como en ese breakpoint aunque la ventana mida otra cosa. Sin
 * proveedor (uso normal) es `null` y manda la ventana.
 */
export const MediaWidthContext = createContext<number | null>(null);

/** Evalúa una media query de ancho simple contra un ancho en px; `undefined` si no es de ancho (p. ej. movimiento). */
function matchesWidth(query: string, width: number): boolean | undefined {
  const toPx = (value: string, unit: string) => parseFloat(value) * (unit === 'rem' || unit === 'em' ? 16 : 1);
  const m = /^\(\s*(?:width\s*(<|<=|>|>=)|(min|max)-width\s*:)\s*([\d.]+)(px|rem|em)\s*\)$/.exec(query.trim());
  if (!m) return undefined;
  const limit = toPx(m[3], m[4]);
  const op = m[1] ?? (m[2] === 'min' ? '>=' : '<=');
  return op === '<' ? width < limit : op === '<=' ? width <= limit : op === '>' ? width > limit : width >= limit;
}

/**
 * Suscribe un componente a una media query. En servidor (y en la hidratación) devuelve `serverValue`
 * (por defecto `false`); en el cliente se actualiza solo cuando la consulta cambia.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  const simulatedWidth = useContext(MediaWidthContext);
  const real = useSyncExternalStore(
    (notify) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener('change', notify);
      return () => mql.removeEventListener('change', notify);
    },
    () => matchesMedia(query),
    () => serverValue
  );
  const simulated = simulatedWidth === null ? undefined : matchesWidth(query, simulatedWidth);
  return simulated ?? real;
}

/** `true` en viewport móvil (menos de 48rem). */
export const useIsMobile = (): boolean => useMediaQuery(MOBILE_QUERY);
