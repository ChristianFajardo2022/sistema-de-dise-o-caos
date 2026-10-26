import type { FilterValue, FilterValues } from './FilterPanel.types';

const isEmptyScalar = (v: unknown) => v === undefined || v === null || v === '' || v === false || (typeof v === 'number' && Number.isNaN(v));

/**
 * Cuántos filtros representa el valor de una sección.
 * - Lista de textos (chips, casillas, árbol): uno por elemento.
 * - Cualquier otra lista (rango `[a, b]`) u objeto (`{ from, to }`): 1 si alguno de sus valores cuenta.
 * - Fecha válida, número, texto no vacío o `true`: 1.
 * - `undefined`, `null`, `''`, `false` o lista vacía: 0.
 */
export function countFilterValue(value: FilterValue): number {
  if (isEmptyScalar(value)) return 0;
  if (Array.isArray(value)) {
    if (value.every((v) => typeof v === 'string')) return value.filter((v) => v !== '').length;
    return value.some((v) => countFilterValue(v) > 0) ? 1 : 0;
  }
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? 0 : 1;
  if (typeof value === 'object') return Object.values(value as Record<string, unknown>).some((v) => countFilterValue(v) > 0) ? 1 : 0;
  return 1;
}

/** Total de filtros de todas las secciones (lo que muestra el badge de `FilterButton`). */
export function countFilters(values: FilterValues | undefined): number {
  if (!values) return 0;
  return Object.values(values).reduce<number>((total, v) => total + countFilterValue(v), 0);
}

/** Quita una sección del objeto de valores (sin mutarlo). */
export function omitFilter(values: FilterValues, id: string): FilterValues {
  const next = { ...values };
  delete next[id];
  return next;
}
