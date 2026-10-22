import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Button link Variants
 *
 * Fuente: component set "Button link" de Figma (nodo 13215:4751, página Button).
 *
 * - Alto 32: padding Y 8 (space/button/lg) + línea de 16 (dimention/button/container/xs). Padding X 0.
 * - Gap 4 entre texto e ícono (gap/button/internal-margin-md).
 * - Texto: Helvetica Neue 400, 14px fijo (md-uniform, igual que Button), subrayado sólido 6 %.
 * - Ícono de 12px (Icon-sizes 12) con color por token del estado (--link-icon).
 * - State: default · hover · focus · press · inactive. Sin anillo de foco: cada estado usa sus tokens.
 *
 * Los estados con prefijo (hover:, focus-visible:, active:) solo se aplican en
 * state="default"; el resto de valores de state fuerza el aspecto del estado.
 */
export const buttonLinkVariants = cva(
  [
    'inline-flex shrink-0 items-center gap-ds-gap-button-internal-margin-md px-0 py-ds-space-button-lg',
    'cursor-pointer select-none whitespace-nowrap no-underline outline-none',
    'transition-colors duration-300 ease-out',
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    '[font-weight:var(--ds-primitives-typography-weight-regular)]',
    'text-(length:--ds-responsive-typography-button-size-md-uniform) leading-none',
    'tracking-normal',
  ].join(' '),
  {
    variants: {
      state: {
        default: [
          'text-ds-text-button-link-default [--link-icon:var(--color-ds-icon-button-link-default)]',
          'hover:text-ds-text-button-link-hover hover:[--link-icon:var(--color-ds-icon-button-link-hover)]',
          'focus-visible:text-ds-text-button-link-focus-press focus-visible:[--link-icon:var(--color-ds-icon-button-link-focus-press)]',
          'active:text-ds-text-button-link-focus-press active:[--link-icon:var(--color-ds-icon-button-link-focus-press)]',
        ],
        hover: 'text-ds-text-button-link-hover [--link-icon:var(--color-ds-icon-button-link-hover)]',
        focus: 'text-ds-text-button-link-focus-press [--link-icon:var(--color-ds-icon-button-link-focus-press)]',
        press: 'text-ds-text-button-link-focus-press [--link-icon:var(--color-ds-icon-button-link-focus-press)]',
        inactive: 'cursor-not-allowed text-ds-text-button-link-inactive [--link-icon:var(--color-ds-icon-button-link-inactive)]',
      },
    },

    defaultVariants: {
      state: 'default',
    },
  }
);
