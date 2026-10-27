import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { IconName } from '../Icon/Icon.types';

/**
 * State de Figma. `hover`, `focus` y `press` solo fuerzan el aspecto (documentación); en uso normal salen de la
 * interacción, de `selected` y de `aria-expanded`. `inactive` es el botón deshabilitado.
 */
export type ButtonMenuState = 'default' | 'hover' | 'focus' | 'press' | 'inactive';

export interface ButtonMenuProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Prop Text de Figma: el texto del botón. */
  children?: ReactNode;
  /** Prop Icon-left de Figma: ícono de la biblioteca CAOS antes del texto (16). Sin valor no se dibuja. */
  iconLeft?: IconName;
  /** Prop Icon-rigth de Figma: chevron hacia abajo después del texto (16). Úsalo cuando el botón abre un submenú. */
  iconRight?: boolean;
  /**
   * Sección actual: aspecto Press/select y `aria-current="page"` (si es un enlace; en un botón, `aria-current="true"`).
   * Un botón con `aria-expanded="true"` (el que abrió su submenú) también se pinta en Press/select.
   */
  selected?: boolean;
  /**
   * Con `href` el componente es un enlace `<a>` (navegación); sin él, un `<button type="button">` (abre un submenú).
   */
  href?: string;
  /** Fuerza el aspecto de un State de Figma, solo para documentación. */
  state?: ButtonMenuState;
  /** Clases adicionales. */
  className?: string;
}
