import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — DataCard Variants
 *
 * Fuente: component set "Data card" de Figma (14043:59910), una sola variante.
 *
 * - Fila: padding space/container/second-level (16, sin token: se usa space/general/2xl), gap space/general/3xl (24), centrada verticalmente, ancho completo.
 * - Fondo background/container/default-on-card con esquina radius/general/2xl (24) en la superficie interna común
 *   (`NotchedSurface`, capa "Canva" de Figma, con `--surface-fill`); la raíz es transparente.
 * - Avatar icon de 48 (Contrast On Card), texto en columna con gap space/badge/sm (2) y slot gráfico que reparte el ancho con el texto.
 * - Título: Prospero (family/secundary) semibold 48/52 con text/neutral/heading. Descripción: 16/22 con text/neutral/body.
 */
export const dataCardVariants = cva(
  [
    'relative isolate box-border flex w-full items-center',
    'gap-ds-space-general-3xl p-ds-space-general-2xl',
    '[--surface-fill:var(--color-ds-background-container-default-on-card)]',
  ].join(' ')
);

export const dataCardTextVariants = cva('flex min-w-0 flex-1 flex-col gap-ds-space-badge-sm');

export const dataCardTitleVariants = cva(
  [
    'm-0 font-ds-primitives-typography-family-secundary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
    'text-ds-primitives-typography-size-6xl leading-ds-typography-heading-line-height-3xl',
    'text-ds-text-neutral-heading',
  ].join(' ')
);

export const dataCardDescriptionVariants = cva(
  [
    'm-0 [font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    '[font-weight:var(--ds-primitives-typography-weight-regular)]',
    'text-ds-typography-body-size-lg leading-ds-typography-body-line-height-large-lg',
    'text-ds-text-neutral-body',
  ].join(' ')
);

export const dataCardGraphicVariants = cva('flex min-w-0 flex-1 items-center');

export const dataCardActionVariants = cva('flex shrink-0 items-center');
