import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Breadcrumb Variants
 *
 * Fuente: component sets "Breadcrumb" (11679:10314, slot List) y "Text Breadcrumb" (11679:10460).
 *
 * - Fila con gap 4 (gap/general/sm = primitivo space-md) entre ícono home 16, chevron 14 y la lista.
 * - Texto 14/20 Helvetica Neue (typography/body/size/md, line-height-large/md).
 * - Default: regular, text/neutral/gray. Select: semibold, text/neutral/white, marco con padding
 *   inferior space/general/sm (2) que lo deja en 22 de alto.
 * - Chevron y home: icon/general/white; chevron en variante line (Outline Yes), home en fill.
 * - Hover/Press de enlace: Figma no los define; se usan los tokens de link (para diseño).
 * - Foco con teclado: no existe en Figma; outline de 2px (WCAG 2.4.7).
 */
export const breadcrumbListVariants = cva(
  'm-0 flex list-none flex-wrap items-center gap-ds-primitives-space-md p-0'
);

export const breadcrumbItemVariants = cva(
  'group/item m-0 inline-flex min-w-0 items-center gap-ds-primitives-space-md p-0'
);

const textBase = [
  '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
  'text-ds-typography-body-size-md leading-ds-typography-body-line-height-large-md',
].join(' ');

export const breadcrumbContentVariants = cva(
  ['inline-flex min-w-0 items-center gap-ds-primitives-space-md', textBase].join(' '),
  {
    variants: {
      type: {
        default: [
          'font-ds-primitives-typography-weight-regular text-ds-text-neutral-gray',
          'no-underline',
        ],
        select: [
          'font-ds-primitives-typography-weight-semibold text-ds-text-neutral-white',
          // Marco de Figma: padding inferior de 2
          'pb-ds-space-general-sm',
        ],
      },
      link: {
        true: [
          'cursor-pointer rounded-sm outline-none',
          'hover:text-ds-text-link-hover hover:underline active:text-ds-text-link-focus-press',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
        ],
        false: '',
      },
    },
    defaultVariants: { type: 'default', link: false },
  }
);

export const breadcrumbTextVariants = cva('block', {
  variants: {
    truncate: {
      true: 'max-w-48 truncate',
      false: '[overflow-wrap:anywhere]',
    },
  },
  defaultVariants: { truncate: false },
});
