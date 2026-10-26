import type { HTMLAttributes } from 'react';

export interface RatingFilterProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'children'> {
  /**
   * Calificación mínima elegida, de 2 a 5 (controlado). `null` = sin filtro (Type=Default de Figma: pulgar al inicio y
   * ninguna estrella encendida), que es la primera posición del slider; un 1 se trata como `null` (toda calificación es
   * ≥ 1). Type=1…4 de Figma equivalen a 2…5.
   */
  value?: number | null;
  /** Calificación mínima inicial (no controlado). Por defecto `null`. */
  defaultValue?: number | null;
  /** Se llama con la nueva calificación mínima (2 a 5) o `null` al volver a la primera posición ("Sin filtro"). */
  onValueChange?: (value: number | null) => void;
  /** Nombre accesible del slider. Por defecto "Calificación mínima". Se ignora si hay `aria-labelledby`. */
  label?: string;
  /** Id de una etiqueta visible que nombra el slider (p. ej. el título de la sección de filtro). */
  'aria-labelledby'?: string;
  /** Deshabilitado: el slider no responde y las estrellas no se pueden pulsar. */
  disabled?: boolean;
  /** Nombre para formularios (input oculto con el valor del slider). */
  name?: string;
  /** Clases adicionales para la raíz. */
  className?: string;
}
