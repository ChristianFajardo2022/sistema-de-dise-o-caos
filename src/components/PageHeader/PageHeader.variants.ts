import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — PageHeader Variants
 *
 * Fuente: component set "Page Header" de Figma (17265:93494, 1 variante).
 * - Raíz vertical, gap space/general/xl (12; Figma lo enlaza a gap/general/lg, que no existe en tokens.css), sin relleno ni padding.
 * - Fila Header: gap 12, ícono chevron-left 24 (line) + título Prospero semibold, heading 2xl (32/36; móvil 24/32).
 * - Descripción: Helvetica Neue regular, body lg (16/22; móvil 14/20), text/neutral/body.
 * - Foco del botón de volver: outline de 2px (agregado, no está en Figma).
 */
export const pageHeaderVariants = cva('box-border flex w-full flex-col gap-ds-space-general-xl');

export const pageHeaderRowVariants = cva('flex w-full items-center gap-ds-space-general-xl');

export const pageHeaderBackVariants = cva(
  [
    'inline-flex size-6 shrink-0 cursor-pointer appearance-none items-center justify-center border-0 bg-transparent p-0',
    'text-ds-icon-general-default',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
  ].join(' ')
);

export const pageHeaderTitleVariants = cva(
  [
    'm-0 min-w-0 flex-1 text-ds-text-neutral-heading',
    'font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
    'text-ds-typography-heading-size-2xl leading-ds-typography-heading-line-height-2xl',
  ].join(' ')
);

export const pageHeaderDescriptionVariants = cva(
  [
    'm-0 w-full text-ds-text-neutral-body',
    'font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
    'text-ds-typography-body-size-lg leading-ds-typography-body-line-height-large-lg',
  ].join(' ')
);
