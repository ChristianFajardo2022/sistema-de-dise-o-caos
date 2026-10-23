import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — CodeInput Variants
 *
 * Fuente: component set "General input" de Figma (7856:1485), Type=Code × State
 * Default · Filled · Active/Focus · Burnt-In · Disabled · Error · Success · Helper text.
 *
 * - Raíz en columna, gap space/general/lg (8) entre casillas y mensaje (NotificationText).
 * - Fila de casillas: átomo DigitInput (Input number, 12070:15078) Size 56, gap space/general/lg (8),
 *   cada casilla ocupa el mismo ancho (FILL en Figma: 75.9 px en un ancho de 495).
 * - Disabled: Figma usa border/field/disabled en Type=Code (el átomo usa border/field/default).
 * - Label: Figma no lo dibuja en Type=Code; se pinta encima en 14/18 text/field/label (o sr-only con `hideLabel`).
 */
export const codeInputVariants = cva('flex flex-col gap-ds-space-general-lg', {
  variants: {
    fullWidth: {
      true: 'w-full',
      false: 'w-[320px] max-w-full',
    },
  },
  defaultVariants: { fullWidth: false },
});

/** Label visible del grupo. */
export const codeInputLabelVariants = cva(
  [
    'text-ds-typography-field-size-sm leading-(--ds-responsive-typography-field-line-height-sm)',
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    '[font-weight:var(--ds-primitives-typography-weight-regular)]',
  ].join(' '),
  {
    variants: {
      disabled: {
        true: 'text-ds-text-field-disabled-negative',
        false: 'text-ds-text-field-label',
      },
    },
    defaultVariants: { disabled: false },
  }
);
