import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — RatingFilter Variants
 *
 * Fuente: component set "Rating" de la página Filter de Figma (13725:72539, Type=Default/1/2/3/4).
 *
 * - Raíz en columna con gap 16 (sin variable en Figma: space-general-2xl), ancho del contenedor (Figma 300 fijo).
 * - Slide bar Simple (0/25/50/75/100 %) + Star rating de 32 con las estrellas repartidas (SPACE_BETWEEN).
 */
export const ratingFilterVariants = cva('flex w-full flex-col gap-ds-space-general-2xl');

/** Fila de estrellas: todo el ancho y repartidas como en Figma. */
export const ratingFilterStarsClass = 'flex w-full justify-between';
