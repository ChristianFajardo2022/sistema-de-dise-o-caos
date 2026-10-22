import { createContext, useContext } from 'react';
import type { DropdownMenuMode } from './DropdownMenu.types';

export interface DropdownMenuContextValue {
  mode: DropdownMenuMode;
  /** Cierra el panel y devuelve el foco al disparador. No hace nada sin disparador (panel suelto). */
  close: () => void;
}

export const DropdownMenuContext = createContext<DropdownMenuContextValue>({ mode: 'menu', close: () => {} });

export const useDropdownMenu = () => useContext(DropdownMenuContext);
