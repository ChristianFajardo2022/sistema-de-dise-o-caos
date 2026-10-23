import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — InformationCard Variants
 *
 * Fuente: component set "Information card" de Figma (14195:31274), Type Option 1, 2 y 3 (498 de ancho).
 * Las tres opciones son la misma tarjeta con secciones distintas, así que aquí es un solo componente por slots
 * sobre la superficie interna común de las tarjetas (`NotchedSurface`, sin muesca); las opciones quedan como composiciones
 * documentadas.
 *
 * - Raíz transparente, columna, padding space/container/default (24/24/20 → space/general/3xl), gap space/general/4xl (32).
 *   Superficie background/container/default-on-canva, radius/general/2xl (24). Sombras como en Figma: effect/shadow sm en la
 *   capa Canva (`shadow-ds-on-card`) y md con spread −2 en la forma Subtract (`shadow-ds-on-canva`); alfa 0 en oscuro.
 * - Encabezado: `leading` y etiquetas en fila (gap 8, etiquetas a la derecha si hay `leading`).
 * - Contenido: título Prospero semibold (heading/size/sm de Figma = 16/20, en tokens.css heading md), text/neutral/heading,
 *   truncado; subtítulo 12/16 (size/sm, body/line-height-short/sm); gap 4. Descripción 14/18 (size/md, line-height-short/md).
 *   Los dos en "text/neutral/gray 2" de Figma (G07), que en tokens.css es text/neutral/gray.
 *   Gap título/descripción: 8 (space/general/lg); con etiquetas bajo el título, 16 (space/general/2xl).
 * - Título: el cuadro de Figma mide 18 (line-height 20, truncado).
 * - Pie: línea de 0.5 (border/general/md) en border/general/gray-fifth y fila con gap 24 (space/general/3xl), separadas 32;
 *   botones con gap 8 alineados a la derecha.
 */

const primary =
  'font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)] text-ds-text-neutral-gray';

/** Raíz (`<article>`): transparente; el relleno lo pone la superficie con `--surface-fill`. */
export const informationCardVariants = cva(
  [
    'relative isolate box-border flex w-full min-w-0 flex-col justify-center gap-ds-space-general-4xl p-ds-space-general-3xl',
    '[--surface-fill:var(--color-ds-background-container-default-on-canva)]',
  ].join(' ')
);

/** Encabezado: `leading` y etiquetas en fila; las etiquetas van a la derecha si hay `leading`. */
export const informationCardHeaderVariants = cva('flex min-w-0 items-center gap-ds-space-general-lg', {
  variants: { hasLeading: { true: 'justify-between', false: 'justify-start' } },
  defaultVariants: { hasLeading: false },
});

export const informationCardTagsVariants = cva('flex flex-wrap items-center gap-ds-space-general-lg');

/** Contenido: gap 8 entre título y descripción; 16 cuando las etiquetas van bajo el título. */
export const informationCardContentVariants = cva('flex min-w-0 flex-col', {
  variants: { tagsPosition: { header: 'gap-ds-space-general-lg', content: 'gap-ds-space-general-2xl' } },
  defaultVariants: { tagsPosition: 'header' },
});

export const informationCardTitleBlockVariants = cva('flex min-w-0 flex-col gap-ds-space-general-md');

export const informationCardTitleVariants = cva(
  [
    // Figma fija el cuadro en 18 con line-height 20 (texto truncado): -my-px deja el mismo alto
    '-my-px min-w-0 truncate font-ds-primitives-typography-family-secundary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
    'text-ds-typography-heading-size-md leading-ds-typography-heading-line-height-md text-ds-text-neutral-heading',
  ].join(' ')
);

export const informationCardSubtitleVariants = cva(
  `m-0 min-w-0 ${primary} text-ds-primitives-typography-size-sm leading-ds-typography-body-line-height-short-sm`
);

export const informationCardDescriptionVariants = cva(
  `m-0 min-w-0 ${primary} text-ds-primitives-typography-size-md leading-ds-typography-body-line-height-short-md`
);

export const informationCardFooterVariants = cva('flex min-w-0 flex-col gap-ds-space-general-4xl');

/** Línea de Figma: alto 0 y trazo centrado de 0.5 (box-shadow, porque Chrome redondea border-width). */
export const informationCardDividerVariants = cva(
  'm-0 h-0 w-full shrink-0 border-0 [box-shadow:0_0_0_calc(var(--ds-responsive-border-general-md)/2)_var(--color-ds-border-general-gray-fifth)]'
);

export const informationCardFooterRowVariants = cva('flex min-w-0 flex-wrap items-center gap-ds-space-general-3xl');

export const informationCardFooterStartVariants = cva('flex min-w-0 flex-1 items-center');

export const informationCardActionsVariants = cva('flex flex-1 flex-wrap items-center justify-end gap-ds-space-general-lg');
