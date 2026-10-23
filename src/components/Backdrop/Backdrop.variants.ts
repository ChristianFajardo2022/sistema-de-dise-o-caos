import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Backdrop Variants
 *
 * Fuente: component set "Backdrop" de Figma (11443:12074, 1 variante "Property 1=Predeterminada").
 *
 * - Relleno: background/effect/backdrop (Dark: primary g12 al 60 %, Light: g11 al 40 %).
 * - BACKGROUND_BLUR de 12 (backdrop-blur-md = 12px).
 * - Efecto NOISE (textura): sin recurso ni token de ruido en el sistema; pendiente para diseño.
 */
export const backdropVariants = cva(
  'inset-0 bg-ds-background-effect-backdrop backdrop-blur-md',
  {
    variants: {
      position: {
        fixed: 'fixed',
        absolute: 'absolute',
      },
    },
    defaultVariants: { position: 'fixed' },
  }
);
