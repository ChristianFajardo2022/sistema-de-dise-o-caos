import { createContext, useContext } from 'react';
import type { FilterValue, FilterValues } from './FilterPanel.types';

/** Lo que cada `FilterSection` registra en el panel al montarse. */
export interface FilterSectionInfo {
  id: string;
  /** Título en texto (para el resumen). */
  title: string;
  /** `true` si es plegable (variant `card`). */
  card: boolean;
}

export interface FilterPanelContextValue {
  values: FilterValues;
  /** Registra una sección; devuelve la función para darla de baja. */
  register: (info: FilterSectionInfo) => () => void;
  setSectionValue: (id: string, value: FilterValue) => void;
  clearSection: (id: string) => void;
}

/** Contexto del panel; una `FilterSection` suelta no lo tiene y lleva su propio estado. */
export const FilterPanelContext = createContext<FilterPanelContextValue | null>(null);

/** Valores y acciones del `FilterPanel` que envuelve al componente (o `null` fuera de un panel). */
export const useFilterPanel = () => useContext(FilterPanelContext);
