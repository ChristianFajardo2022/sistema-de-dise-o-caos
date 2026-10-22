import type { HTMLAttributes, ReactNode } from 'react';

/** Ejes con desplazamiento: vertical, horizontal o ambos. */
export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';

export interface ScrollAreaProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Eje de desplazamiento. Por defecto vertical. */
  orientation?: ScrollAreaOrientation;
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
