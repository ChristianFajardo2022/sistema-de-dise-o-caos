import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — NavBar Variants
 *
 * Fuente: component set "Nav bar" (14259:44045) y "Options tab bar (Atom)" (14018:26460) de Figma.
 *
 * - Raíz 376 de ancho (fluida), padding space/general/2xl (16). Cerrada: degradado vertical background/degrade/nav bar
 *   (0 % → 100 %). Con la hoja "más" abierta la raíz no tiene relleno; la hoja y la fila de la barra llevan background/container/surface.
 * - Barra: 64 de alto, píldora radius/general/full, relleno background/container/default-on-canva, padding 12 × 16,
 *   opciones separadas space/general/md (4). Muesca circular sobre la opción activa con un punto de 8
 *   (background/acent/tertiary).
 * - Opción: 40 de alto (ícono 20 + texto 10/14, gap 2). Default: ícono línea gray-high-contrast y texto body.
 *   Select: ícono relleno y texto blanco. Focus: píldora background/general/gray-seventh.
 * - Botón "más": 64 × 64 redondo; abierto: fondo background/general/white y el "+" girado 45° (X).
 * - Hoja inferior: surface, esquinas superiores radius/general/2xl (24), padding 16 16 4 16, ítems separados 10.
 * - Foco con teclado: outline de 2px con el token de borde activo (no está en Figma).
 */
export const navBarVariants = cva('relative isolate box-border block w-full', {
  variants: {
    open: {
      true: '',
      false: 'bg-linear-to-b from-ds-background-degrade-nav-bar-0 to-ds-background-degrade-nav-bar-100',
    },
  },
  defaultVariants: { open: false },
});

export const navBarSheetVariants = cva(
  'box-border flex flex-col gap-2.5 rounded-t-ds-radius-general-2xl bg-ds-background-container-surface px-ds-space-general-2xl pt-ds-space-general-2xl pb-ds-space-general-md'
);

export const navBarRowVariants = cva('box-border flex items-center gap-ds-space-general-lg p-ds-space-general-2xl', {
  variants: { open: { true: 'bg-ds-background-container-surface', false: '' } },
  defaultVariants: { open: false },
});

// --nx: centro de la opción activa = 16 de padding − 2 + (2i+1)·(ancho útil + gap) / 2n; --i y --n llegan por style
export const navBarBarVariants = cva(
  'relative min-w-0 flex-1 px-ds-space-general-2xl py-ds-space-general-xl [--i:0] [--n:1] [--nx:calc(14px_+_(2_*_var(--i)_+_1)_*_(100%_-_28px)_/_(2_*_var(--n)))]'
);

export const navBarItemVariants = cva(
  [
    'box-border flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-ds-space-general-sm py-ds-space-general-sm',
    'rounded-ds-radius-general-full border-0 no-underline',
    'font-ds-primitives-typography-family-primary font-ds-primitives-typography-weight-regular text-center',
    'text-ds-typography-body-size-xs leading-ds-typography-body-line-height-short-xs',
    'outline-offset-0 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
  ].join(' '),
  {
    variants: {
      state: {
        default: 'bg-transparent text-ds-text-neutral-body [&_svg]:text-ds-icon-general-gray-high-contrast',
        select: 'bg-transparent text-ds-text-neutral-white [&_svg]:text-ds-icon-general-default',
        focus: 'bg-ds-background-general-gray-seventh text-ds-text-neutral-body [&_svg]:text-ds-icon-general-gray-high-contrast',
      },
    },
    defaultVariants: { state: 'default' },
  }
);

export const navBarMoreButtonVariants = cva(
  [
    'box-border flex size-16 shrink-0 cursor-pointer items-center justify-center rounded-ds-radius-button-full border-0 p-0',
    'outline-offset-2 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
  ].join(' '),
  {
    variants: {
      open: {
        true: 'bg-ds-background-general-white text-ds-icon-general-black',
        false: 'bg-ds-background-container-default-on-canva text-ds-icon-general-default',
      },
    },
    defaultVariants: { open: false },
  }
);
