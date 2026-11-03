import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — ThemeSwitch Variants
 *
 * Fuente: component set "Switch dark/light" (22357:25378) de Figma. 4 variantes de 104 × 56:
 * State (Light | Dark) × Contrast (On canva | On card).
 *
 * Contenedor: botón de píldora (radius/button/full), padding space/field/sm (8), gap space/general/lg (8),
 * fondo background/container/default-on-canva u default-on-card según Contrast, sombra "Shadow on card"
 * (0 4 12) y overflow-clip.
 * Casillas: 40 × 40 (padding space/general/lg 8 + ícono 24), radio radius/general/full. La del modo activo lleva
 * background/general/white con el ícono en icon/general/black; la inactiva no lleva fondo y su ícono va en
 * icon/general/default. Sol (line) a la izquierda y luna (fill) a la derecha.
 * Foco con teclado: no existe en Figma; se agrega un outline de 2px (WCAG 2.4.7).
 */
export const themeSwitchVariants = cva(
  [
    'box-border inline-flex shrink-0 cursor-pointer items-center overflow-clip',
    'gap-ds-space-general-lg p-ds-space-field-sm',
    'rounded-ds-radius-button-full shadow-ds-on-card',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
  ].join(' '),
  {
    variants: {
      contrast: {
        'on-canva': 'bg-ds-background-container-default-on-canva',
        'on-card': 'bg-ds-background-container-default-on-card',
      },
    },
    defaultVariants: { contrast: 'on-canva' },
  }
);

/** Casilla de ícono de 40 × 40; `data-active` pinta el fondo blanco y el ícono en negro. */
export const themeSwitchCellVariants = cva(
  [
    'flex size-10 shrink-0 items-center justify-center p-ds-space-general-lg',
    'rounded-ds-radius-general-full text-ds-icon-general-default',
    'transition-colors duration-150 motion-reduce:transition-none',
    'data-active:bg-ds-background-general-white data-active:text-ds-icon-general-black',
  ].join(' ')
);
