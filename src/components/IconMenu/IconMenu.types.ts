import type { SVGProps } from 'react';

/**
 * Property 1 de Figma: `menu` (1, tres rayas), `half` (2, fotograma intermedio con las rayas de arriba y abajo
 * inclinadas 15°) y `close` (3, dos rayas cruzadas, la X).
 */
export type IconMenuVariant = 'menu' | 'half' | 'close';

export interface IconMenuProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'width' | 'height' | 'viewBox' | 'ref'> {
  /** Property 1 de Figma. Por defecto `menu`. Al cambiar de valor las rayas se mueven (sin movimiento con `prefers-reduced-motion`). */
  variant?: IconMenuVariant;
  /** Nombre accesible. Sin él el dibujo es decorativo (`aria-hidden`), que es lo normal dentro de un botón con nombre. */
  'aria-label'?: string;
  /** Clases adicionales para el `<svg>`. */
  className?: string;
}
