import type { SVGProps } from 'react';
import type { IconName } from '../../icons/caos/registry.generated';
import type { CaosIconData } from '../../icons/caos/types';

export type { IconName, CaosIconData };

/**
 * Tamaños de Figma (component set "Icon-sizes": 12, 14, 16, 20, 24, 32, 56) más los 40 y 48
 * que la página de Iconografía define para íconos informativos.
 */
export const ICON_SIZES = [12, 14, 16, 20, 24, 32, 40, 48, 56] as const;
export type IconSize = (typeof ICON_SIZES)[number];

/** Variante de dibujo: Bold line icon (line) o Fill icon (fill) */
export type IconVariant = 'line' | 'fill';

export interface IconBaseProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'width' | 'height' | 'viewBox' | 'ref'> {
  /** Tamaño en px (alto y ancho). Por defecto 24 */
  size?: IconSize;
  /**
   * Línea o relleno. Por defecto se elige según size: relleno por debajo de 24, línea desde 24.
   * Se puede forzar cualquiera de las dos.
   */
  variant?: IconVariant;
  /** Nombre accesible. Sin él, el ícono es decorativo (aria-hidden) */
  'aria-label'?: string;
  /** Clases adicionales */
  className?: string;
}

/** Con `icon` (datos importados suelto) el bundler solo incluye los íconos usados */
export interface IconBareProps extends IconBaseProps {
  icon: CaosIconData;
}

export interface IconProps extends IconBaseProps {
  /** Nombre del ícono en la biblioteca (usa el registro completo) */
  name?: IconName;
  /** Datos de un ícono importado suelto, p. ej. `searchIcon`; tiene prioridad sobre name */
  icon?: CaosIconData;
}

/** Regla por defecto del plan: relleno por debajo de 24 px, línea desde 24 px */
export function defaultIconVariant(size: number): IconVariant {
  return size < 24 ? 'fill' : 'line';
}

