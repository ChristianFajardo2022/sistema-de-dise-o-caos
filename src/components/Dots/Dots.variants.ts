import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Dots (botón "más opciones")
 *
 * Fuente: component set "Dots-moreoptions" de Figma (11194:12200). Es un Button tertiary de solo ícono:
 * círculo (radius/button/full) de 56 (md), 48 (sm) o 32 (xs) con el ícono 3-dots-more centrado
 * (24 en md y sm, 16 en xs; Outline=No, es decir relleno).
 *
 * - Default y Focus: sin relleno. Hover y Press: relleno background/button/tertiary/hover.
 * - Ícono: icon/button/tertiary/default | hover | focus-press, y /inactive (deshabilitado). Excepción de Figma:
 *   Size=xs Default usa icon/general/white (md y sm no).
 * - Foco con teclado: no existe en Figma; se agrega un outline de 2px (WCAG 2.4.7).
 * - Press: `:active` o `aria-expanded="true"` (panel abierto, como en Figma).
 *
 * Los prefijos (hover:, focus-visible:, active:, aria-expanded:) solo aplican con state="default";
 * el resto de valores de state fuerza el aspecto.
 */
export const dotsVariants = cva(
  [
    'box-border inline-flex shrink-0 items-center justify-center rounded-ds-radius-button-full border-0 p-0',
    'bg-transparent text-ds-icon-button-tertiary-default select-none',
    'cursor-pointer outline-offset-2 outline-ds-border-field-active',
    'transition-[background-color,color] duration-300 ease-out motion-reduce:transition-none',
    'disabled:cursor-not-allowed',
  ].join(' '),
  {
    variants: {
      size: {
        md: 'size-ds-primitives-dimention-5xl',
        sm: 'size-ds-primitives-dimention-4xl',
        xs: 'size-ds-primitives-dimention-2xl',
      },
      state: {
        default: [
          'hover:bg-ds-background-button-tertiary-hover hover:text-ds-icon-button-tertiary-hover',
          'focus-visible:text-ds-icon-button-tertiary-focus-press focus-visible:outline-2 focus-visible:outline-solid',
          'active:bg-ds-background-button-tertiary-hover active:text-ds-icon-button-tertiary-hover',
          'aria-expanded:bg-ds-background-button-tertiary-hover aria-expanded:text-ds-icon-button-tertiary-hover',
          'disabled:bg-transparent disabled:text-ds-icon-button-tertiary-inactive',
        ].join(' '),
        hover: 'bg-ds-background-button-tertiary-hover text-ds-icon-button-tertiary-hover',
        focus: 'text-ds-icon-button-tertiary-focus-press outline-2 outline-solid',
        press: 'bg-ds-background-button-tertiary-hover text-ds-icon-button-tertiary-hover',
        inactive: 'cursor-not-allowed text-ds-icon-button-tertiary-inactive',
      },
    },
    compoundVariants: [
      // Figma pinta Size=xs Default con icon/general/white; md y sm usan icon/button/tertiary/default
      { size: 'xs', state: 'default', class: 'text-ds-icon-general-default' },
    ],
    defaultVariants: { size: 'md', state: 'default' },
  }
);

/** Tamaño del ícono por Size (Icon-sizes de Figma). */
export const dotsIconSize = { xs: 16, sm: 24, md: 24 } as const;
