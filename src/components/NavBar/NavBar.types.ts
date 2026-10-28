import type { HTMLAttributes, ReactNode } from 'react';
import type { IconName } from '../Icon/Icon.types';

/** State del set "Options tab bar (Atom)" de Figma (`Propiedad 1`). Solo fuerza el aspecto (documentación). */
export type NavBarItemState = 'default' | 'select' | 'focus';

/** Opción de la barra (datos para la prop `items`). */
export interface NavBarItemData {
  /** Identificador de la opción; es el valor de `value` de la barra. */
  value: string;
  /** Texto bajo el ícono. Es también el nombre accesible. */
  label: string;
  /** Ícono de la biblioteca CAOS (20 px). Activa: relleno; inactiva: línea. */
  icon: IconName;
  /** Si existe, la opción es un enlace (`<a>`); si no, un botón. */
  href?: string;
}

/** Opción extra del menú "más" (Dropdown list de Figma: ícono de 16 + texto). */
export interface NavBarMoreItem {
  value: string;
  label: string;
  icon: IconName;
  disabled?: boolean;
  /** Se llama al activar el ítem (además de `onMoreSelect` de la barra). */
  onSelect?: () => void;
}

export interface NavBarItemProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Identificador de la opción. */
  value: string;
  /** Texto bajo el ícono. */
  label: string;
  /** Ícono de la biblioteca CAOS. */
  icon: IconName;
  /** Con `href` es un `<a>`; sin él, un `<button type="button">`. */
  href?: string;
  target?: string;
  rel?: string;
  /** Opción activa (`aria-current="page"`). Si se omite, sale de `value` de la barra. */
  current?: boolean;
  /**
   * Fuerza el aspecto de Figma (`Propiedad 1`): `default`, `select` o `focus`. Solo documentación; en uso normal el
   * estado sale de `current` y de `:focus-visible`.
   */
  state?: NavBarItemState;
}

export interface NavBarProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onChange'> {
  /** Nombre accesible de la región de navegación (obligatorio). */
  'aria-label': string;
  /**
   * Opciones. Con `moreItems` (estilo "3 options") caben 3; sin él (estilo "4 options"), 4. Si se pasa `children`,
   * estos mandan (composición con `NavBarItem`).
   */
  items?: NavBarItemData[];
  /** Composición manual con `NavBarItem` (en lugar de `items`). */
  children?: ReactNode;
  /** Opción activa (controlada). */
  value?: string;
  /** Opción activa inicial (no controlada). Por defecto, la primera. */
  defaultValue?: string;
  /** Se llama al elegir una opción. */
  onValueChange?: (value: string) => void;
  /**
   * Opciones extra. Si hay, la barra pasa al estilo "3 options": un botón redondo "más" al lado abre una hoja inferior
   * con estas opciones (Dropdown list de Figma).
   */
  moreItems?: NavBarMoreItem[];
  /** Nombre accesible del botón "más". Por defecto "Más opciones". */
  moreLabel?: string;
  /** Hoja "más" abierta (controlada). Corresponde a `Style=3 options, tab=4`. */
  moreOpen?: boolean;
  /** Hoja "más" abierta al inicio (no controlada). */
  defaultMoreOpen?: boolean;
  onMoreOpenChange?: (open: boolean) => void;
  /** Se llama al activar una opción del menú "más". */
  onMoreSelect?: (value: string) => void;
}
