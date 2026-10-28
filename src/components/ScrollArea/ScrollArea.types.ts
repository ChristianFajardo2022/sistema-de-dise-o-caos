import type { HTMLAttributes, ReactNode } from 'react';

/** Espacio entre el contenido y la barra: tokens `space/general/*` (`none` 0, `md` 4, `lg` 8, `xl` 12). */
export type ScrollAreaGap = 'none' | 'md' | 'lg' | 'xl';

/** Ejes con desplazamiento: vertical, horizontal o ambos. */
export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';

export interface ScrollAreaProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Eje de desplazamiento. Por defecto vertical. */
  orientation?: ScrollAreaOrientation;
  /**
   * Espacio entre el contenido y la barra (el Scroll bar de Figma deja 8: `lg`). Solo se aplica cuando el eje
   * desborda, para no robar ancho a un contenido que no tiene barra. Por defecto `none`.
   */
  scrollbarGap?: ScrollAreaGap;
  /**
   * Alto máximo del área (cualquier valor CSS: "20rem", "314px", "50vh").
   * Sin él, el área crece con su contenido y no hay desplazamiento vertical
   * salvo que el contenedor padre limite el alto.
   */
  maxHeight?: string | number;
  /**
   * Nombre accesible de la región (obligatorio). Cuando el contenido desborda, el área es
   * `role="region"` con `tabIndex={0}` para poder desplazarla con el teclado, y una región necesita nombre.
   * Sin desborde no es región ni tabulable. Un `role` o `tabIndex` explícito se respeta.
   */
  'aria-label': string;
  /** Contenido desplazable. */
  children?: ReactNode;
  /** Clases adicionales para el elemento raíz */
  className?: string;
}
