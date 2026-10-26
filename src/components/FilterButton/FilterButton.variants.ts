import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — FilterButton Variants
 *
 * Fuente: component set "Filter button" de la página Filter de Figma (14112:4253, Type=Default/Inactive).
 *
 * - Desktop: fila con gap 8 (gap/general/md ≈ space-general-lg), Badge Number (Info; Inactive en Type=Inactive)
 *   + Button Tertiary md con chevron-right a la derecha (93 × 56).
 * - Mobile: Badge + Button Tertiary icon-single con el ícono filter de 24, sin gap (gap/general/xs = 0).
 * - El badge va antes del botón, como en Figma; el botón lo referencia con aria-describedby.
 */
export const filterButtonVariants = cva('inline-flex items-center', {
  variants: {
    layout: {
      desktop: 'gap-ds-space-general-lg',
      mobile: 'gap-0',
    },
  },
  defaultVariants: { layout: 'desktop' },
});
