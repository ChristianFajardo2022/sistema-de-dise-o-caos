import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — ButtonCorner Variants
 *
 * Fuente: component set "Button corner" de Figma (60 variantes, solo estado Default).
 *
 * - Círculo de 40 (md) o 32 (sm), radio radius/button/full.
 * - Padding: md space/general/xl (12), sm space/general/lg (8). Dots: md space/general/md (4) y sm 0,
 *   con un botón interno de 32 (ver ButtonCorner.tsx).
 * - Relleno por Status: default-on-canva, default-on-card o hover-unicolor.
 * - Stroke=Yes: borde exterior de border/general/lg (1px) en gray-fifth (gray-fifth-unicolor en Unicolor).
 *   Se dibuja con box-shadow para no cambiar las medidas, como el trazo OUTSIDE de Figma.
 * - Sombra effect/shadow sm: alfa 0 en oscuro y ~8-16 % de G06 sobre blanco en claro (invisible); no se agrega.
 * - Figma no define hover, press, seleccionado ni disabled: no se inventan.
 * - Foco con teclado: no existe en Figma; se agrega un outline de 2px (WCAG 2.4.7).
 */
export const buttonCornerVariants = cva(
  [
    'box-border inline-flex shrink-0 items-center justify-center appearance-none border-0',
    'rounded-ds-radius-button-full cursor-pointer disabled:cursor-not-allowed',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
  ].join(' '),
  {
    variants: {
      status: {
        'on-canva': 'bg-ds-background-container-default-on-canva text-ds-icon-general-white',
        'on-card': 'bg-ds-background-container-default-on-card text-ds-icon-general-white',
        'unicolor-canva': 'bg-ds-background-container-hover-unicolor text-ds-icon-general-white-unicolor',
      },
      size: {
        md: 'size-[40px]',
        sm: 'size-[32px]',
      },
      dots: { true: '', false: '' },
      stroke: { true: '', false: '' },
    },
    compoundVariants: [
      { size: 'md', dots: false, className: 'p-ds-space-general-xl' },
      { size: 'md', dots: true, className: 'p-ds-space-general-md' },
      { size: 'sm', dots: false, className: 'p-ds-space-general-lg' },
      { size: 'sm', dots: true, className: 'p-ds-space-general-xs' },
      {
        stroke: true,
        status: ['on-canva', 'on-card'],
        className:
          '[box-shadow:0_0_0_var(--ds-responsive-border-general-lg)_var(--color-ds-border-general-default-on-card)]',
      },
      {
        stroke: true,
        status: 'unicolor-canva',
        className:
          '[box-shadow:0_0_0_var(--ds-responsive-border-general-lg)_var(--color-ds-border-general-gray-fifth-unicolor)]',
      },
    ],
    defaultVariants: { status: 'on-canva', size: 'md', dots: false, stroke: false },
  }
);

/** Favorite: el trazo usa border/general/gray-secondary (white-unicolor en Unicolor), no el color de ícono */
export const buttonCornerFavoriteColor = {
  'on-canva': 'text-ds-border-general-gray-secondary',
  'on-card': 'text-ds-border-general-gray-secondary',
  'unicolor-canva': 'text-ds-border-general-white-unicolor',
} as const;

/** Checkbox y Radiobutton en Unicolor: el contorno del control pasa a icon/general/white-unicolor */
export const buttonCornerUnicolorRing = '[--ring:var(--color-ds-icon-general-white-unicolor)]';
