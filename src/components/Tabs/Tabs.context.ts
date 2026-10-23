import { createContext } from 'react';
import type { TabsActivationMode, TabsContrast, TabsSize } from './Tabs.types';

export interface TabsContextValue {
  size: TabsSize;
  contrast: TabsContrast;
  activationMode: TabsActivationMode;
  /** Pestaña seleccionada (puede no existir todavía, antes del primer efecto). */
  selected: string | undefined;
  /** Pestaña que entra en el orden de Tab (roving tabindex): la seleccionada o, si no se puede, la primera habilitada. */
  tabStop: string | undefined;
  setTabStop: (value: string | undefined) => void;
  /** Selecciona una pestaña. `notify=false` no llama a `onValueChange` (selección inicial automática). */
  select: (value: string, notify?: boolean) => void;
  /** Paneles montados: la pestaña solo pone `aria-controls` si su panel existe. */
  panels: ReadonlySet<string>;
  registerPanel: (value: string) => () => void;
  /** Lo pone `TabList` para sus pestañas. */
  fullWidth: boolean;
  tabId: (value: string) => string;
  panelId: (value: string) => string;
}

/** Contexto del grupo; una `Tab` suelta (documentación) no lo tiene. */
export const TabsContext = createContext<TabsContextValue | null>(null);
