import { useEffect, useRef, useState } from 'react';

/**
 * Estado controlado o no controlado: si `value` no es `undefined`, manda `value`;
 * si no, el estado interno parte de `defaultValue`. `onChange` se llama siempre.
 * Si el valor controlado pasa a `undefined`, el estado interno continúa desde el último valor controlado.
 * En desarrollo avisa con `console.warn` al cambiar entre controlado y no controlado.
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void
): [T, (next: T) => void] {
  const [inner, setInner] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const lastControlled = useRef<T>(defaultValue);
  const needsSync = useRef(false);
  const wasControlled = useRef(isControlled);

  if (isControlled) {
    lastControlled.current = value;
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
      console.warn(
        `Accordion: el componente pasó de ${wasControlled.current ? 'controlado a no controlado' : 'no controlado a controlado'}. Elige un modo durante toda su vida.`
      );
    }
    wasControlled.current = isControlled;
  }, [isControlled]);

  const set = (next: T) => {
    if (!isControlled) setInner(next);
    onChange?.(next);
  };

  return [isControlled ? value : needsSync.current ? lastControlled.current : inner, set];
}
