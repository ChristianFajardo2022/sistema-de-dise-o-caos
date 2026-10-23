import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Rating Variants
 *
 * Fuentes (CAOS | Dev):
 * - Icon Star (Atom): set 11194:15685. state default/select/hover × size 16/20/32. Caja cuadrada del size;
 *   default y hover dibujan la estrella a 3/4 de la caja (12, 16, 24), select a caja completa.
 *   default: icon/general/gray-low-contrast; select y hover: icon/semantic/alert-firts.
 * - Star rating: set 11252:401. Size 20px/32px × State 0-5. Fila de 5 estrellas, gap space/general/md (4)
 *   en 20px y space/general/lg (8) en 32px.
 * - Rating bar: set 11569:947. Columna con gap space/general/lg (8); cada fila: estrella 16, gap 8, ProgressBar.
 * - Number rating: nodo 12745:16784. Número 14/18 medium + estrella 16, gap 4.
 */
export const iconStarVariants = cva('inline-flex shrink-0 items-center justify-center', {
  variants: {
    size: {
      16: 'size-4',
      20: 'size-5',
      32: 'size-8',
    },
    state: {
      default: 'text-ds-icon-general-gray-low-contrast',
      select: 'text-ds-icon-semantic-alert-firts',
      hover: 'text-ds-icon-semantic-alert-firts',
    },
  },
  defaultVariants: { size: 16, state: 'default' },
});

/** Lado del dibujo dentro de la caja: select llena la caja, default y hover quedan a 3/4. */
export const ICON_STAR_GLYPH: Record<'default' | 'select' | 'hover', Record<16 | 20 | 32, 12 | 16 | 20 | 24 | 32>> = {
  default: { 16: 12, 20: 16, 32: 24 },
  hover: { 16: 12, 20: 16, 32: 24 },
  select: { 16: 16, 20: 20, 32: 32 },
};

export const starRatingVariants = cva('inline-flex items-center', {
  variants: {
    size: {
      sm: 'gap-ds-space-general-md',
      md: 'gap-ds-space-general-lg',
    },
    disabled: { true: 'opacity-50', false: '' },
  },
  defaultVariants: { size: 'sm', disabled: false },
});

/** Etiqueta de cada estrella en modo interactivo: radio nativo oculto + estrella. */
export const starRatingItemClasses = [
  'relative inline-flex cursor-pointer rounded-full',
  'has-[:disabled]:cursor-not-allowed',
  'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-solid has-[:focus-visible]:outline-ds-border-field-active',
].join(' ');

export const ratingBarVariants = cva('m-0 flex list-none flex-col gap-ds-space-general-lg p-0');

export const ratingBarRowClasses = 'flex items-center gap-ds-space-general-lg';

export const numberRatingVariants = cva(
  [
    'inline-flex items-center gap-ds-space-general-md',
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    'text-ds-typography-body-size-md leading-ds-typography-body-line-height-short-md',
    'text-ds-text-neutral-white font-medium',
  ].join(' ')
);
