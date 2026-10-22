import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Checkbox Variants
 *
 * Fuente: component sets "Selection" de Figma (9545:6413 control, 9558:6975 control + texto).
 *
 * - Control de 16×16, esquina radius/field/checkbox-radiobutton/sm (6), contorno stroke/xl (1.5) por dentro (box-shadow inset).
 * - Default: solo contorno. Select: relleno + check de 8.05×6. Disabled: tokens de disabled.
 * - Con texto: gap space/general/lg (8), 16/20 Helvetica Neue regular.
 * - El estado sale del input nativo (peer-checked / peer-disabled).
 * - Foco con teclado: no existe en Figma; se agrega un outline de 2px (WCAG 2.4.7).
 */
export const checkboxRowVariants = cva(
  'relative inline-flex items-center gap-ds-space-general-lg align-top',
  {
    variants: {
      disabled: {
        true: 'cursor-not-allowed',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: { disabled: false },
  }
);

const controlBase = [
  'box-border block size-4 shrink-0 rounded-ds-radius-field-checkbox-radiobutton-sm',
  // Contorno de 1.5 por dentro con box-shadow inset: el navegador redondea border-width a px enteros
  'bg-transparent [box-shadow:inset_0_0_0_var(--ds-primitives-stroke-xl)_var(--ring)]',
  'relative',
  // Check centrado de 8.05×6, oculto hasta que el input esté marcado
  '[&_svg]:absolute [&_svg]:top-1/2 [&_svg]:left-1/2 [&_svg]:h-[6px] [&_svg]:w-[8.05px]',
  '[&_svg]:-translate-x-1/2 [&_svg]:-translate-y-1/2 [&_svg]:opacity-0 peer-checked:[&_svg]:opacity-100',
  'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-solid peer-focus-visible:outline-ds-border-field-active',
].join(' ');

export const checkboxControlVariants = cva(controlBase, {
  variants: {
    contrast: {
      positive: [
        '[--ring:var(--color-ds-background-field-surface-tertiary)] text-ds-icon-general-black',
        'peer-checked:[--ring:var(--color-ds-background-field-active-high-contrast)] peer-checked:bg-ds-background-field-active-high-contrast',
        'peer-disabled:[--ring:var(--color-ds-background-field-disabled)]',
        'peer-checked:peer-disabled:[--ring:var(--color-ds-background-field-disabled)] peer-checked:peer-disabled:bg-ds-background-field-disabled',
      ],
      negative: [
        '[--ring:var(--color-ds-background-field-active-slow-contrast)] text-ds-icon-general-white',
        'peer-checked:[--ring:var(--color-ds-background-field-active-slow-contrast)] peer-checked:bg-ds-background-field-active-slow-contrast',
        'peer-disabled:[--ring:var(--color-ds-background-field-disabled)]',
        'peer-checked:peer-disabled:[--ring:var(--color-ds-background-field-disabled)] peer-checked:peer-disabled:bg-ds-background-field-disabled',
        // Disabled select: el check es negro en ambos contrastes
        'peer-checked:peer-disabled:text-ds-icon-general-black',
      ],
    },
  },
  defaultVariants: { contrast: 'positive' },
});

export const checkboxTextVariants = cva(
  [
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    '[font-weight:var(--ds-primitives-typography-weight-regular)]',
    'text-ds-typography-field-size-md leading-(--ds-responsive-typography-field-line-height-md)',
    'select-none',
  ].join(' '),
  {
    variants: {
      contrast: {
        positive: [
          'text-ds-text-neutral-white',
          'peer-disabled:text-ds-text-neutral-disabled-positive',
          'peer-checked:peer-disabled:text-ds-text-neutral-disabled-negative',
        ],
        negative: [
          'text-ds-text-neutral-black',
          'peer-disabled:text-ds-text-neutral-disabled-negative',
        ],
      },
    },
    defaultVariants: { contrast: 'positive' },
  }
);
