import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — FilterTabs Variants
 *
 * Fuente: component set "Filter tabs" de la página Filter de Figma (14033:24874, Type=3/2/1 = pestaña seleccionada).
 *
 * - Raíz en columna con gap 16 (gap/general/xl ≈ space-general-2xl), ancho del contenedor (Figma 304 fijo).
 * - Tab de tres opciones, Size Md, Contrast On canva, pestañas FILL (TabList fullWidth).
 * - Slot List: columna con gap 16 de filas Selection (Checkbox con texto, positive).
 */
export const filterTabsVariants = cva('flex w-full flex-col gap-ds-space-general-2xl');

export const filterTabsListClass = 'flex flex-col gap-ds-space-general-2xl';
