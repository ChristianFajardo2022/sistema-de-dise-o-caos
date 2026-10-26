// El último valor controlado vive en un ref y se lee durante el render a propósito: guardarlo en estado con un efecto
// entraría en bucle con valores que cambian de identidad en cada render (p. ej. el arreglo que arma Accordion)
/* oxlint-disable react/refs */
import { useEffect, useRef, useState } from 'react';

/** Opciones de `useControllableState`. */
export interface ControllableStateOptions {
  /** Nombre del componente para el aviso de desarrollo. Por defecto `useControllableState`. */
  name?: string;
  /**
   * Fuerza el modo. Úsalo cuando `undefined` es un valor válido del estado controlado (p. ej. "sin filtro"):
   * pasa `controlled: 'value' in props`. Si se omite, el modo es controlado cuando `value !== undefined`.
   */
  controlled?: boolean;
}

/** `true` si el estado es controlado: manda `controlled` si se pasa; si no, `value !== undefined`. */
export function isControlledState(value: unknown, controlled?: boolean): boolean {
  return controlled ?? value !== undefined;
}

/** Texto del aviso al cambiar de modo durante la vida del componente. */
export function controllableModeWarning(name: string, wasControlled: boolean): string {
  return `${name}: el componente pasó de ${wasControlled ? 'controlado a no controlado' : 'no controlado a controlado'}. Elige un modo durante toda su vida.`;
}

/**
 * Estado controlado o no controlado: si es controlado manda `value`; si no, el estado interno parte de `defaultValue`.
 * `onChange` se llama siempre.
 *
 * - Controlado por defecto cuando `value !== undefined`. Con `{ controlled: true }`, `undefined` también es un valor
 *   controlado (se devuelve tal cual).
 * - Si el valor controlado pasa a no controlado, el estado interno continúa desde el último valor controlado.
 * - En desarrollo avisa con `console.warn` al cambiar entre modos; el 4.º argumento da el nombre del componente
 *   (texto u opciones).
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
  options?: string | ControllableStateOptions
): [T, (next: T) => void] {
  const opts: ControllableStateOptions = typeof options === 'string' ? { name: options } : (options ?? {});
  const name = opts.name ?? 'useControllableState';
  const [inner, setInner] = useState<T>(defaultValue);
  const isControlled = isControlledState(value, opts.controlled);
  const lastControlled = useRef<T>(defaultValue);
  const needsSync = useRef(false);
  const wasControlled = useRef(isControlled);

  if (isControlled) {
    lastControlled.current = value as T;
    needsSync.current = true;
  }

  useEffect(() => {
    if (!isControlled && needsSync.current) {
      needsSync.current = false;
      setInner(lastControlled.current);
    }
  }, [isControlled, value]);

  useEffect(() => {
    if (import.meta.env.DEV && wasControlled.current !== isControlled) {
      console.warn(controllableModeWarning(name, wasControlled.current));
    }
    wasControlled.current = isControlled;
  }, [isControlled, name]);

  const set = (next: T) => {
    if (!isControlled) setInner(next);
    onChange?.(next);
  };

  return [isControlled ? (value as T) : needsSync.current ? lastControlled.current : inner, set];
}
