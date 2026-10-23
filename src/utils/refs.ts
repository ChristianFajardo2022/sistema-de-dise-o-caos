import { useCallback } from 'react';
import type { Ref, RefCallback } from 'react';

/** Asigna un nodo a un ref de callback o de objeto (o no hace nada si no hay ref). */
export function assignRef<T>(ref: Ref<T> | undefined | null, node: T | null) {
  if (typeof ref === 'function') ref(node);
  else if (ref) (ref as { current: T | null }).current = node;
}

/** Un solo ref de callback que reparte el nodo entre varios refs (el del consumidor y los internos). */
export function useMergedRefs<T>(...refs: (Ref<T> | undefined | null)[]): RefCallback<T> {
  // Los refs se comparan uno a uno: el callback solo cambia si cambia alguno
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback((node: T | null) => refs.forEach((ref) => assignRef(ref, node)), refs);
}
