import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Radio Variants
 *
 * Fuente: component sets "Selection" de Figma (9545:6413 control, 9558:6975 control + texto).
 *
 * - Control circular de 16×16.
 * - Default: anillo de 1.5 (stroke/xl) con box-shadow inset.
 * - Select: disco con hueco transparente de 6.4 (borde de 4.8).
 * - Disabled select: anillo de 1.5 + punto central de 8 (padding 2.5 y relleno solo del contenido).
 * - Con texto: gap space/general/lg (8), 16/20 Helvetica Neue regular.
 * - Foco con teclado: no existe en Figma; se agrega un outline de 2px (WCAG 2.4.7).
 */
export const radioRowVariants = cva(
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

// Anillo, hueco y punto se dibujan con box-shadow y gradientes: el navegador redondea border-width a px enteros
const controlBase = [
  'block size-4 shrink-0 rounded-full bg-transparent bg-no-repeat',
  '[box-shadow:inset_0_0_0_var(--ds-primitives-stroke-xl)_var(--ring)]',
  // Select: disco de 16 con hueco transparente de 6.4
  'peer-checked:[box-shadow:none] peer-checked:[background-image:radial-gradient(circle,transparent_3.2px,var(--ring)_3.5px)]',
  // Disabled select: anillo de 1.5 + punto de 8
  'peer-checked:peer-disabled:[box-shadow:inset_0_0_0_var(--ds-primitives-stroke-xl)_var(--ring)]',
  'peer-checked:peer-disabled:[background-image:radial-gradient(circle,var(--ring)_3.8px,transparent_4.1px)]',
  'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-solid peer-focus-visible:outline-ds-border-field-active',
].join(' ');

export const radioControlVariants = cva(controlBase, {
  variants: {
    contrast: {
      positive: [
        '[--ring:var(--color-ds-background-field-surface-tertiary)]',
        'peer-checked:[--ring:var(--color-ds-background-field-active-high-contrast)]',
        'peer-disabled:[--ring:var(--color-ds-background-field-disabled)]',
        'peer-checked:peer-disabled:[--ring:var(--color-ds-background-field-disabled)]',
      ],
      negative: [
        '[--ring:var(--color-ds-background-field-active-slow-contrast)]',
        'peer-checked:[--ring:var(--color-ds-background-field-active-slow-contrast)]',
        'peer-disabled:[--ring:var(--color-ds-background-field-disabled-negative)]',
        'peer-checked:peer-disabled:[--ring:var(--color-ds-background-field-disabled-negative)]',
      ],
    },
  },
  defaultVariants: { contrast: 'positive' },
});

export const radioTextVariants = cva(
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
          'peer-disabled:text-ds-text-neutral-disabled-on-canva',
          'peer-checked:peer-disabled:text-ds-text-neutral-disabled-on-card',
        ],
        negative: [
          'text-ds-text-neutral-black',
          'peer-disabled:text-ds-text-neutral-disabled-on-card',
        ],
      },
    },
    defaultVariants: { contrast: 'positive' },
  }
);
