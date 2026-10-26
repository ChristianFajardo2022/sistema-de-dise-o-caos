import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — CheckboxTree Variants
 *
 * Fuente: tipo "Selection tree" del set "Atoms" de la página Filter de Figma (13874:43337, variante 14015:46215).
 *
 * - Slot List en columna con gap 16 (gap/general/xl ≈ space-general-2xl) entre grupos.
 * - Grupo en columna con gap 16: fila madre y filas hijas con padding izquierdo de 24 (space/general/3xl).
 * - Cada fila es una instancia de Selection (Checkbox con texto, gap 8, 16/20).
 * - Estado mixto: Figma no lo dibuja. Lo da `Checkbox indeterminate` (relleno de Select y raya de 8 × 1.5).
 */
export const checkboxTreeVariants = cva('flex flex-col gap-ds-space-general-2xl');

export const checkboxTreeGroupClass = 'flex flex-col gap-ds-space-general-2xl';

/** Contenedor de los hijos: sangría de 24. */
export const checkboxTreeChildrenClass = 'flex flex-col gap-ds-space-general-2xl pl-ds-space-general-3xl';

/** Fila: ocupa todo el ancho (FILL en Figma). */
export const checkboxTreeRowClass = 'flex w-full';
