import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — DigitInput Variants
 *
 * Fuente: component set "Input number" de Figma (12070:15078), Size 56 | 32 × State
 * Default · Filled · Active/Focus · Burnt-In · Disabled · Error · Confirmation.
 *
 * - Casilla de un carácter: padding X space/field/md (12), radio radius/field/sm (12), borde de 1px por dentro (border/general/lg).
 * - Size 56: 37×56. Size 32: 40×32 (en Figma el contenido mide 13×40 y 16×16). Texto 14/18 centrado.
 * - Default y Filled se ven igual (solo cambia que haya valor); borde border/field/default.
 * - Active/Focus: border/field/active (en uso real sale de :focus; se agrega además un outline de 2px, no está en Figma).
 * - Burnt-In (solo lectura): relleno background/field-burnt-in, texto text/field/disabled-negative.
 * - Disabled: borde border/field/default (como en Figma), texto text/field/disabled-positive.
 * - Error: border/semantic/error. Confirmation: border/semantic/success.
 * - El color del texto sale de --val; el estado visual lo fija `visual`.
 */
export const digitInputVariants = cva(
  [
    'box-border block appearance-none border border-solid bg-transparent px-ds-space-field-md py-ds-space-field-sm text-center outline-none',
    'rounded-ds-radius-field-sm transition-colors duration-150 motion-reduce:transition-none',
    'text-ds-typography-field-size-sm leading-(--ds-responsive-typography-field-line-height-sm) text-(color:--val)',
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    '[font-weight:var(--ds-primitives-typography-weight-regular)]',
    'placeholder:text-(color:--val)',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
  ].join(' '),
  {
    variants: {
      size: {
        '56': 'h-14 w-[37px]',
        '32': 'h-8 w-10',
      },
      visual: {
        default: [
          'border-ds-border-field-default focus:border-ds-border-field-active',
          '[--val:var(--color-ds-text-field-placeholder)]',
        ],
        active: 'border-ds-border-field-active [--val:var(--color-ds-text-field-placeholder)]',
        'burnt-in': [
          'border-ds-border-field-default bg-ds-background-field-burnt-in',
          '[--val:var(--color-ds-text-field-disabled-negative)]',
        ],
        disabled: [
          'cursor-not-allowed border-ds-border-field-default',
          '[--val:var(--color-ds-text-field-disabled-positive)]',
        ],
        error: 'border-ds-border-semantic-error [--val:var(--color-ds-text-field-placeholder)]',
        confirmation: 'border-ds-border-semantic-success [--val:var(--color-ds-text-field-placeholder)]',
      },
    },
    defaultVariants: { size: '56', visual: 'default' },
  }
);
