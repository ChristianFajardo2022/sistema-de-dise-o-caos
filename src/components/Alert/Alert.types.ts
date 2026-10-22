import type { HTMLAttributes, ReactNode } from 'react';
import type { IconName } from '../Icon/Icon.types';

/** Type de Figma: define el color semántico y el ícono por defecto. */
export type AlertType = 'success' | 'alert' | 'error' | 'info';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children' | 'role'> {
  /** Type: success, alert, error o info. Por defecto success. */
  type?: AlertType;
  /** Background de Figma: con contorno y padding (true) o sin ellos (false). Por defecto true. */
  background?: boolean;
  /** Prop Tittle de Figma: título (Subheading). Si se omite, no se dibuja. */
  title?: ReactNode;
  /** Prop Description de Figma: descripción. Si se omite, no se dibuja. */
  children?: ReactNode;
  /** Ícono de la biblioteca CAOS. Por defecto el de Figma según el type (tick-circle, warning, forbidden-2, info-circle). */
  icon?: IconName;
  /**
   * Texto sr-only que antepone el tipo para lectores de pantalla, porque color e ícono
   * no bastan (WCAG 1.4.1). Por defecto: Éxito, Advertencia, Error o Información.
   * Cadena vacía lo desactiva.
   */
  label?: string;
  /**
   * Semántica ARIA. `status` (por defecto): mensaje en línea que ya estaba en la página
   * o que no urge; se anuncia con cortesía. `alert`: solo para errores o avisos urgentes
   * que aparecen de forma dinámica (p. ej. tras enviar un formulario); interrumpe al lector.
   */
  role?: 'status' | 'alert';
  /** Clases adicionales para el elemento raíz */
  className?: string;
}
