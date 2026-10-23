import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Switch Variants
 *
 * Fuente: component sets "Toggle (Atom)" (9504:6567) y "Toggle" (9335:5863) de Figma.
 *
 * Átomo (pista):
 * - Simple: 48×32, padding space/field/xs (4), radio de píldora, ficha de 24.
 * - Complex: ancho según texto × 38, padding 4 con space/field/md (12) del lado del texto, gap 8,
 *   ficha de 30 y texto 16/20 con space/text/sm (2) abajo. Al encender, la ficha pasa a la derecha y el texto a la izquierda.
 * - Off background/general/gray-fifth; On background/semantic/success/fourth;
 *   Disabled background/general/gray-seventh con ficha icon/general/disabled-negative.
 *
 * Fila (Toggle): pista + descripción con gap 8 (Type=Text); sin descripción la fila es la pista (Type=Only).
 * Foco con teclado: no existe en Figma; se agrega un outline de 2px (WCAG 2.4.7).
 */
export const switchRowVariants = cva('relative inline-flex items-center gap-ds-space-general-lg align-top', {
  variants: {
    disabled: {
      true: 'cursor-not-allowed',
      false: 'cursor-pointer',
    },
  },
  defaultVariants: { disabled: false },
});

export const switchTrackVariants = cva(
  [
    'group box-border flex shrink-0 items-center',
    'rounded-ds-radius-button-full',
    'bg-ds-background-general-gray-fifth',
    'data-checked:bg-ds-background-semantic-success-fourth',
    'data-disabled:bg-ds-background-general-gray-seventh',
    'data-checked:data-disabled:bg-ds-background-general-gray-seventh',
    'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-solid peer-focus-visible:outline-ds-border-field-active',
  ].join(' '),
  {
    variants: {
      type: {
        simple: 'w-12 p-ds-space-field-xs data-checked:justify-end',
        complex: [
          'gap-ds-space-general-lg py-ds-space-field-xs pl-ds-space-field-xs pr-ds-space-field-md',
          'data-checked:flex-row-reverse data-checked:pr-ds-space-field-xs data-checked:pl-ds-space-field-md',
        ].join(' '),
      },
    },
    defaultVariants: { type: 'simple' },
  }
);

export const switchThumbVariants = cva(
  [
    'block shrink-0 rounded-ds-radius-button-full',
    'bg-ds-icon-general-white-unicolor group-data-disabled:bg-ds-icon-general-disabled-negative',
  ].join(' '),
  {
    variants: {
      type: {
        simple: 'size-6',
        complex: 'size-7.5',
      },
    },
    defaultVariants: { type: 'simple' },
  }
);

const textBase = [
  '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
  '[font-weight:var(--ds-primitives-typography-weight-regular)]',
  'text-ds-typography-field-size-md leading-(--ds-responsive-typography-field-line-height-md)',
  'whitespace-nowrap select-none',
].join(' ');

/** Texto dentro de la pista (Text container con space/text/sm abajo). */
export const switchTrackTextVariants = cva(
  [
    'flex items-center justify-center pb-ds-space-text-sm',
    textBase,
    'text-ds-text-neutral-white',
    'group-data-checked:text-ds-text-field-placeholder',
    'group-data-disabled:text-ds-text-neutral-disabled-positive',
    'group-data-checked:group-data-disabled:text-ds-text-neutral-disabled-positive',
  ].join(' ')
);

/** Descripción junto a la pista. */
export const switchLabelVariants = cva(
  [
    textBase,
    'text-ds-text-neutral-white',
    'data-disabled:text-ds-text-neutral-disabled-positive',
    'data-checked:data-disabled:text-ds-text-neutral-disabled-negative',
  ].join(' ')
);
