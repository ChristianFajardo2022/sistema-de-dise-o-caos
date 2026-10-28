import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Scan (variantes)
 *
 * Fuentes: sets de Figma `points-scan` (19548:38784, 129×175), `progress-scan` (21258:21640, 60×60) y
 * `animation-scan` (20889:54087, 334×140). Son piezas para colocar sobre la vista de la cámara: los puntos y el
 * porcentaje van en tokens unicolor (blanco fijo), por eso la pantalla que los aloja debe ser oscura.
 */

/** Texto del porcentaje: heading sm 14/18, Prospero (family/secondary) semibold. */
export const scanProgressValueVariants = cva(
  [
    'absolute inset-0 grid place-items-center select-none',
    'font-ds-primitives-typography-family-secondary font-ds-primitives-typography-weight-semibold',
    'text-ds-typography-heading-size-sm leading-ds-typography-heading-line-height-sm',
    'text-ds-text-neutral-white-unicolor',
  ].join(' ')
);

/** Raíz del progreso: 60×60 (medida sin token). */
export const scanProgressVariants = cva('relative inline-block size-15 shrink-0');
