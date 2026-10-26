import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Logo Variants
 *
 * Fuente: component set "Logo" de Figma (12946:2771, 8 variantes: Type × Size).
 *
 * - Medidas del componente (el SVG fija el ancho y el alto totales; el padding va con CSS y el viewBox recorta el dibujo):
 *   Logo lg 158×56, md 131×48, sm 101×32, xs 87×24; Icon lg 56, md 48, sm 32, xs 24 (cuadrados).
 *   Padding del logo: lg y md 8 en los cuatro lados; sm 4×8; xs 2×8 (space/general/lg, md y sm). Icon no tiene padding (el dibujo ya está centrado en el cuadrado).
 * - Color: background/logo/default (Dark #fefefe, Light #000000), enlazado al relleno de cada vector.
 *   Los rellenos del SVG son currentColor, de modo que `text-ds-background-logo-default` lo tiñe y el tema lo cambia solo.
 */
export const logoVariants = cva('box-border inline-block shrink-0 align-middle text-ds-background-logo-default', {
  variants: {
    type: { logo: '', icon: '' },
    size: { xs: '', sm: '', md: '', lg: '' },
  },
  compoundVariants: [
    // Padding del marco de Figma: lg y md 8 (space/general/lg), sm 4 y 2 en vertical (space/general/md y sm), 8 en horizontal
    { type: 'logo', size: 'lg', className: 'p-ds-space-general-lg' },
    { type: 'logo', size: 'md', className: 'p-ds-space-general-lg' },
    { type: 'logo', size: 'sm', className: 'px-ds-space-general-lg py-ds-space-general-md' },
    { type: 'logo', size: 'xs', className: 'px-ds-space-general-lg py-ds-space-general-sm' },
  ],
  defaultVariants: { type: 'logo', size: 'lg' },
});
