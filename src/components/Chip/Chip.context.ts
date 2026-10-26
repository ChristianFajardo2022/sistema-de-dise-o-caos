import { createContext, useContext } from 'react';
import type { ChipGroupSelectionMode } from './Chip.types';

/** Lo que `ChipGroup` ofrece a sus chips: selección, tabulación única (roving) y foco al quitar. */
export interface ChipGroupContextValue {
  mode: ChipGroupSelectionMode;
  isSelected: (value: string) => boolean;
  toggle: (value: string) => void;
  /** Valor del chip que es la parada de tabulación (solo con selección). */
  tabValue: string | undefined;
  setFocusValue: (value: string) => void;
  /** Mueve el foco al chip vecino de la raíz dada (antes de quitar uno). */
  focusNeighbor: (root: Element | null) => void;
}

export const ChipGroupContext = createContext<ChipGroupContextValue | null>(null);

export const useChipGroup = () => useContext(ChipGroupContext);
