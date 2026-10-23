import type { ButtonHTMLAttributes } from 'react';

/** Size del set "Dots-moreoptions" de Figma: xs 32 (ícono 16), sm 48 y md 56 (ícono 24). */
export type DotsSize = 'xs' | 'sm' | 'md';

/** State de Figma. Solo fuerza el aspecto (documentación); en uso normal sale de CSS, `disabled` y `aria-expanded`. */
export type DotsState = 'default' | 'hover' | 'focus' | 'press' | 'inactive';

export interface DotsProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> {
  /** Size de Figma. Por defecto `md`. */
  size?: DotsSize;
  /** Nombre accesible del botón (el ícono es decorativo). Por defecto "Más opciones". */
  label?: string;
  /** `Inactive` de Figma: botón deshabilitado nativo. */
  disabled?: boolean;
  /**
   * Fuerza el aspecto de un State, solo para documentación. Sin esta prop, Hover, Focus y Press salen de
   * `:hover`, `:focus-visible` y `:active` / `aria-expanded="true"` (lo que pone `DropdownMenu` al disparador).
   */
  state?: DotsState;
  className?: string;
}
