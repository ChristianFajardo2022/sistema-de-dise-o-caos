import type { HTMLAttributes } from 'react';
import type { ProgressBarProps } from '../ProgressBar/ProgressBar.types';

/** state de Figma (Icon Star): default (gris), select (relleno amarillo) y hover (previsualización). */
export type IconStarState = 'default' | 'select' | 'hover';

/** size de Figma (Icon Star): lado de la caja en px. */
export type IconStarSize = 16 | 20 | 32;

export interface IconStarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** state: `default` gris, `select` amarillo a caja completa, `hover` amarillo con el tamaño de `default`. Por defecto `default`. */
  state?: IconStarState;
  /** size: lado de la caja en px (16, 20 o 32). Por defecto 16. */
  size?: IconStarSize;
}

/** Size de Figma (StarRating): `sm` = 20px, `md` = 32px. */
export type StarRatingSize = 'sm' | 'md';

/** Cantidad de estrellas del componente. Figma define 0 a 5. */
export const STAR_RATING_MAX = 5;

interface StarRatingBaseProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role' | 'onChange' | 'defaultValue' | 'aria-label'> {
  /** Size de Figma: `sm` (20px) o `md` (32px). Por defecto `sm`. */
  size?: StarRatingSize;
  /**
   * Nombre accesible. En solo lectura es el texto leído por el lector de pantalla
   * (por defecto "4 de 5 estrellas"); en modo interactivo nombra el grupo (por defecto "Calificación").
   */
  label?: string;
}

export interface StarRatingProps extends StarRatingBaseProps {
  /**
   * Puntaje de 0 a 5. Figma solo dibuja estrellas completas: los decimales se redondean al entero
   * más cercano para dibujar, pero el nombre accesible conserva el valor real (p. ej. "4,5 de 5 estrellas").
   * Con `onChange` es el valor controlado.
   */
  value?: number;
  /** Valor inicial en modo interactivo no controlado. Su presencia activa el modo interactivo. */
  defaultValue?: number;
  /** Activa el modo interactivo (grupo de radios). Recibe el nuevo puntaje de 1 a 5. */
  onChange?: (value: number) => void;
  /** Dibuja el estado de solo lectura aunque haya `onChange`. */
  readOnly?: boolean;
  /** Deshabilita las estrellas (solo en modo interactivo). */
  disabled?: boolean;
  /** `name` de los radios nativos, para participar en un formulario. */
  name?: string;
}

/** Fila de la distribución: cuántas reseñas tienen esa cantidad de estrellas. */
export interface RatingBarItem {
  /** Estrellas de la fila (1 a 5). */
  stars: number;
  /** Cantidad de reseñas con esa calificación. */
  count: number;
}

/** Qué se escribe dentro de la píldora de cada fila. */
export type RatingBarDisplay = 'percentage' | 'count';

export interface RatingBarProps extends Omit<HTMLAttributes<HTMLUListElement>, 'children'> {
  /** Distribución de reseñas, en el orden en que se dibujan las filas (típicamente 5 a 1). */
  distribution: RatingBarItem[];
  /** Total que equivale al 100 %. Por defecto, la suma de `count` de todas las filas. */
  total?: number;
  /** Texto de cada fila: porcentaje sobre el total (Figma) o cantidad. Por defecto `percentage`. */
  display?: RatingBarDisplay;
  /** Nombre accesible de la lista (p. ej. "Reseñas por calificación"). */
  label?: string;
  /** Props extra para cada `ProgressBar` (p. ej. `status`). El `value`, `max`, `label` y `formatValue` los controla el componente. */
  barProps?: Omit<ProgressBarProps, 'value' | 'max' | 'label' | 'formatValue' | 'showValue' | 'type'>;
}

export interface NumberRatingProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'role' | 'aria-label'> {
  /** Promedio de 0 a 5. Se formatea con `Intl.NumberFormat('es')`, como máximo un decimal ("4,5"). */
  value: number;
  /** Total de reseñas. Si se pasa, se escribe junto al promedio ("128 reseñas"). */
  total?: number;
  /** Nombre accesible. Por defecto "4,5 de 5 estrellas, 128 reseñas". */
  label?: string;
}
