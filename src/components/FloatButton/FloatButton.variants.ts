import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — FloatButton Variants
 *
 * Fuente: component set "Float button" de la página Button de Figma (21900:67738, Status=Icon single / With text).
 *
 * - Icon single: 48×48, padding space/general/xl (12), ícono de 24.
 * - With text: alto 48, padding 8/24 (space/general/lg · 3xl), gap 10, ícono de 24 + texto 14 Medium.
 * - Forma radius/button/full, fondo background/acent/tertiary, texto e ícono unicolor (blancos fijos en ambos temas).
 * - Sombra effect/shadow-on-canva-sm: 0 12 blur 32 spread -2.
 * - Hover, press y foco no existen en Figma (para diseño): hover = tertiary M04, press = M05, foco = outline 2px
 *   con border/field/active separado 2px.
 */
export const floatButtonVariants = cva(
  [
    'relative box-border inline-flex h-12 shrink-0 cursor-pointer select-none items-center justify-center',
    'rounded-ds-radius-button-full border-0 bg-ds-background-acent-tertiary',
    'text-ds-text-button-secondary-low-unicolor',
    'shadow-[0_12px_32px_-2px_var(--color-ds-background-effect-shadow-shadow-on-canva-sm-desktop)]',
    'transition-colors duration-150 ease-out motion-reduce:transition-none',
    'hover:bg-(--color-ds-primitives-color-tertiary-m04) active:bg-(--color-ds-primitives-color-tertiary-m05)',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    'text-ds-typography-button-size-md',
    '[font-weight:var(--ds-primitives-typography-weight-semibold)]',
  ].join(' '),
  {
    variants: {
      extended: {
        false: 'w-12 p-ds-space-general-xl',
        true: 'gap-2.5 px-ds-space-general-3xl py-ds-space-general-lg',
      },
      state: {
        default: '',
        hover: 'bg-(--color-ds-primitives-color-tertiary-m04)',
        press: 'bg-(--color-ds-primitives-color-tertiary-m05)',
        focus: 'outline-2 outline-offset-2 outline-solid outline-ds-border-field-active',
      },
    },
    defaultVariants: { extended: false, state: 'default' },
  }
);
