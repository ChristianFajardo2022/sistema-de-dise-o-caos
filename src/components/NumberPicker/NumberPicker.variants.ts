import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — NumberPicker Variants
 *
 * Fuente: component set "Number picker" de Figma (12609:18389), State Default · Filled · Active/Focus · Burnt-In · Disabled × Size sm | md.
 *
 * - Contenedor: columna con gap space/general/lg (8) que envuelve la píldora "Input".
 * - Píldora: alto 56 (sm) o 48 (md), padding X space/general/2xl (16) y Y space/field/sm, gap space/field/sm,
 *   radio radius/general/full y borde de 1px por dentro border/field/disabled (en todos los estados, como en Figma).
 * - Active/Focus: borde border/field/active (en uso real sale de :focus-within).
 * - Burnt-In (solo lectura): relleno background/field/burnt-in y texto text/field/disabled-positive.
 * - Texto: Helvetica Neue regular 14/18 centrado, color text/field/label; deshabilitado y burnt-in text/field/disabled-positive.
 * - Botones − y +: Button tertiary xs con ícono (minus y add-2, 20px).
 */
export const numberPickerRootVariants = cva('flex flex-col gap-ds-space-general-lg', {
  variants: {
    fullWidth: {
      true: 'w-full',
      false: 'w-[320px] max-w-full',
    },
  },
  defaultVariants: { fullWidth: false },
});

export const numberPickerFieldVariants = cva(
  [
    'box-border flex w-full items-center gap-ds-space-field-sm border border-solid',
    'px-ds-space-general-2xl py-ds-space-field-sm rounded-ds-radius-general-full',
    'transition-colors duration-150 motion-reduce:transition-none',
    // Anillo de foco de teclado (no está en Figma): 2px con el token de borde activo
    'has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-solid has-[input:focus-visible]:outline-ds-border-field-active',
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    '[font-weight:var(--ds-primitives-typography-weight-regular)]',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'h-14',
        md: 'h-12',
      },
      visual: {
        default: 'border-ds-border-field-disabled focus-within:border-ds-border-field-active [--val:var(--color-ds-text-field-label)]',
        active: 'border-ds-border-field-active [--val:var(--color-ds-text-field-label)]',
        'burnt-in': 'border-ds-border-field-disabled bg-ds-background-field-burnt-in [--val:var(--color-ds-text-field-disabled-positive)]',
        disabled: 'border-ds-border-field-disabled cursor-not-allowed [--val:var(--color-ds-text-field-disabled-positive)]',
      },
    },
    defaultVariants: { size: 'sm', visual: 'default' },
  }
);

/** El campo de texto con rol spinbutton: ocupa el espacio entre los botones. */
export const numberPickerInputVariants = cva(
  [
    'min-w-0 flex-1 self-stretch appearance-none border-0 bg-transparent p-0 text-center outline-none',
    'text-ds-typography-field-size-sm leading-(--ds-responsive-typography-field-line-height-sm) text-(color:--val)',
    '[font-family:inherit] [font-weight:inherit]',
    'placeholder:text-(color:--val) disabled:cursor-not-allowed',
  ].join(' ')
);
