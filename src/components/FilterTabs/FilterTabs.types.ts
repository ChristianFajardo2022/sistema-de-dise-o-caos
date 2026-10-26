import type { HTMLAttributes, ReactNode } from 'react';
import type { IconName } from '../Icon/Icon.types';
import type { TabsContrast } from '../Tabs/Tabs.types';
import type { SelectionContrast } from '../Checkbox/Checkbox.types';

/** Opción de la lista de una pestaña (fila Selection de Figma). */
export interface FilterTabsOption {
  /** Valor único en todas las pestañas. Es lo que se guarda en `value`. */
  value: string;
  /** Texto de la fila ("Text description" de Figma). */
  label: ReactNode;
  /** Opción no disponible. */
  disabled?: boolean;
}

/** Pestaña con su lista de casillas. */
export interface FilterTabsTab {
  /** Identificador de la pestaña. */
  value: string;
  /** Texto de la pestaña (prop Text del Tab). */
  label: ReactNode;
  /** Ícono de 16 antes del texto (Figma usa `heart` de muestra). Sin él, la pestaña va sin ícono. */
  icon?: IconName;
  /** Casillas del slot List de esta pestaña. */
  options: FilterTabsOption[];
  /** Pestaña deshabilitada. */
  disabled?: boolean;
}

export interface FilterTabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'children'> {
  /** Pestañas (Figma dibuja tres; Type=1/2/3 es la pestaña seleccionada). */
  tabs: FilterTabsTab[];
  /** Opciones marcadas de todas las pestañas (controlado). */
  value?: string[];
  /** Opciones marcadas al inicio (no controlado). */
  defaultValue?: string[];
  /** Se llama con la nueva lista de opciones marcadas. */
  onValueChange?: (value: string[]) => void;
  /** Pestaña visible (controlado). */
  tab?: string;
  /** Pestaña visible al inicio (no controlado). Por defecto la primera. */
  defaultTab?: string;
  /** Se llama al cambiar de pestaña. */
  onTabChange?: (tab: string) => void;
  /** Muestra en cada pestaña cuántas opciones suyas están marcadas (prop Badge del Tab). Por defecto `true`. */
  showCounts?: boolean;
  /** Contrast de las pestañas (Figma: On canva). */
  contrast?: TabsContrast;
  /** Contrast de las casillas. Por defecto `positive`. */
  checkboxContrast?: SelectionContrast;
  /** `name` de las casillas para enviar en un formulario. */
  name?: string;
  /** Nombre accesible de la lista de pestañas. Por defecto "Categorías". */
  'aria-label'?: string;
  /** Clases adicionales para la raíz. */
  className?: string;
}
