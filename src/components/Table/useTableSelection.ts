import { useCallback, useMemo } from 'react';
import { useControllableState } from '../../utils/controllableState';

/** Opciones de `useTableSelection`. */
export interface TableSelectionOptions<Id extends string | number> {
  /** Ids seleccionados (controlado). */
  selected?: readonly Id[];
  /** Ids seleccionados al inicio (no controlado). */
  defaultSelected?: readonly Id[];
  /** Se llama con la nueva selección. */
  onSelectedChange?: (selected: Id[]) => void;
}

/** Lo que devuelve `useTableSelection`. */
export interface TableSelection<Id extends string | number> {
  /** Ids seleccionados, en el orden de `ids`. */
  selected: Id[];
  /** `true` si la fila está seleccionada. */
  isSelected: (id: Id) => boolean;
  /** Marca o desmarca una fila. */
  toggle: (id: Id, next?: boolean) => void;
  /** Selecciona todas las filas, o ninguna si ya estaban todas. */
  toggleAll: () => void;
  /** Todas seleccionadas (casilla de la cabecera marcada). */
  allSelected: boolean;
  /** Algunas pero no todas (casilla de la cabecera en estado mixto). */
  someSelected: boolean;
}

/**
 * Estado de la selección por filas: lo usan la casilla de la cabecera (`checked={allSelected}`,
 * `indeterminate={someSelected}`) y la de cada fila (`checked={isSelected(id)}`). Funciona controlado o no.
 */
export function useTableSelection<Id extends string | number>(
  ids: readonly Id[],
  { selected, defaultSelected = [], onSelectedChange }: TableSelectionOptions<Id> = {}
): TableSelection<Id> {
  const [current, setCurrent] = useControllableState<readonly Id[]>(
    selected,
    defaultSelected,
    onSelectedChange as ((next: readonly Id[]) => void) | undefined,
    'useTableSelection'
  );

  const set = useMemo(() => new Set(current), [current]);
  const ordered = useMemo(() => ids.filter((id) => set.has(id)), [ids, set]);
  const allSelected = ids.length > 0 && ordered.length === ids.length;
  const someSelected = ordered.length > 0 && !allSelected;

  const isSelected = useCallback((id: Id) => set.has(id), [set]);
  const toggle = useCallback(
    (id: Id, next?: boolean) => {
      const on = next ?? !set.has(id);
      setCurrent(on ? ids.filter((x) => x === id || set.has(x)) : ordered.filter((x) => x !== id));
    },
    [ids, ordered, set, setCurrent]
  );
  const toggleAll = useCallback(() => setCurrent(allSelected ? [] : [...ids]), [allSelected, ids, setCurrent]);

  return { selected: ordered, isSelected, toggle, toggleAll, allSelected, someSelected };
}
