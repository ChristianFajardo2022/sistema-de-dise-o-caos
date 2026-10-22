import type { HTMLAttributes, ReactNode } from 'react';
import type { IconName } from '../Icon/Icon.types';

/** Type de Figma: punto, solo ícono, solo número o ícono + número. */
export type BadgeType = 'simple' | 'icon' | 'number' | 'icon-number';

/**
 * State de Figma. Es el color semántico del badge, no un estado de interacción
 * (el badge no es interactivo).
 */
export type BadgeState =
  | 'default'
  | 'success'
  | 'alert'
  | 'error'
  | 'info'
  | 'neutral'
  | 'negative'
  | 'positive'
  | 'inactive';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Type: simple (punto de 12), icon, number o icon-number. Por defecto simple. */
  type?: BadgeType;
  /** State: color semántico. Por defecto default. */
  state?: BadgeState;
  /** Prop Text de Figma: contenido del badge en los tipos number e icon-number (p. ej. 5, "99+"). */
  children?: ReactNode;
  /** Nombre del ícono de la biblioteca CAOS para los tipos icon e icon-number. Por defecto star (el de Figma). */
  icon?: IconName;
  /**
   * Texto para lectores de pantalla (p. ej. "notificaciones sin leer", "en línea").
   * Obligatorio para simple e icon si el badge informa algo: sin él son decorativos
   * (aria-hidden), porque el color solo no basta (WCAG 1.4.1). En number e icon-number
   * se lee después del número ("5 notificaciones").
   */
  label?: string;
  /** Clases adicionales para el elemento raíz */
  className?: string;
}
