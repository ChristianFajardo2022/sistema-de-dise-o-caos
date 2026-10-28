import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Pagination Variants
 *
 * Fuente: component set "Pagination" de Figma (12048:7622), Type numeric | input | More × Pages initial | middle | final.
 *
 * - Raíz: columna con gap space/general/2xl (16); en Type input una fila con el mismo gap, centrada.
 * - Texto de estado 14/18 regular centrado, color text/neutral/white.
 * - Fila de botones: gap 4 (space/general/sm); anterior y siguiente son Button secondary xs de solo ícono (32 × 32).
 * - Type More: Button primary md "Mostrar más"; en escritorio mide lo que su contenido, en móvil ocupa todo el ancho.
 */
export const paginationVariants = cva('flex', {
  variants: {
    type: {
      numeric: 'flex-col items-center gap-ds-space-general-2xl',
      input: 'flex-row items-center gap-ds-space-general-2xl',
      more: 'flex-col items-center gap-ds-space-general-2xl',
    },
  },
  defaultVariants: { type: 'numeric' },
});

export const paginationTextClass = [
  '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
  '[font-weight:var(--ds-primitives-typography-weight-regular)]',
  'text-ds-typography-body-size-md leading-(--ds-responsive-typography-body-line-height-short-md)',
  'text-ds-text-neutral-white text-center',
].join(' ');

export const paginationListClass = 'm-0 flex list-none items-center gap-ds-space-general-sm p-0';
