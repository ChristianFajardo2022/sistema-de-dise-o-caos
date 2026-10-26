import type { SVGProps } from 'react';

/** Type de Figma: marca completa (símbolo + nombre) o solo el símbolo. */
export type LogoType = 'logo' | 'icon';

/** Size de Figma: alto del componente en px (xs 24, sm 32, md 48, lg 56). */
export type LogoSize = 'xs' | 'sm' | 'md' | 'lg';

export interface LogoProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'width' | 'height' | 'viewBox' | 'ref' | 'title' | 'type'> {
  /** Type: `logo` (símbolo + nombre) o `icon` (solo el símbolo). Por defecto `logo`. */
  type?: LogoType;
  /** Size: xs, sm, md o lg. Por defecto `lg` (el de Figma). */
  size?: LogoSize;
  /**
   * Nombre accesible. Por defecto, el nombre de la marca tal como se lee en el logo ("Inter Rapidísimo").
   * Si el nombre ya está en el texto contiguo, usa `decorative`.
   */
  title?: string;
  /** Oculta el logo a lectores de pantalla (`aria-hidden`), p. ej. cuando va junto al nombre escrito. */
  decorative?: boolean;
  /** Clases adicionales para el `<svg>` raíz. */
  className?: string;
}
