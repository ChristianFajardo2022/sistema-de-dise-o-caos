import { createContext, useContext } from 'react';

export interface NavBarContextValue {
  value: string | undefined;
  /** Falso mientras la hoja "más" está abierta: ninguna opción se dibuja como activa (Figma, tab=4). */
  showActive: boolean;
  select: (value: string) => void;
}

export const NavBarContext = createContext<NavBarContextValue | null>(null);

export function useNavBar(): NavBarContextValue | null {
  return useContext(NavBarContext);
}
