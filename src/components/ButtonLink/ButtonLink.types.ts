import type { AnchorHTMLAttributes, ReactNode } from 'react';

/**
 * State de Figma. hover, focus y press solo fuerzan el aspecto (para documentación);
 * en uso normal salen de la interacción.
 */
export type ButtonLinkState = 'default' | 'hover' | 'focus' | 'press' | 'inactive';

export interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** State forzado */
  state?: ButtonLinkState;
  /** Estado inactive: quita el href y marca aria-disabled */
  disabled?: boolean;
  /** "Icon right" de Figma: muestra el ícono de enlace externo después del texto */
  iconRight?: boolean;
  /** Reemplaza el ícono de enlace externo. Se dibuja a 12px con el color del estado. */
  icon?: ReactNode;
  /** Clases adicionales */
  className?: string;
  children?: ReactNode;
}
