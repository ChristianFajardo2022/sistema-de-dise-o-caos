import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — DataCard Variants
 *
 * Fuente: component set "Data card" de Figma (14043:59910): Default, Hover, Select e Inactive (357.5×129).
 *
 * - Fila: padding space/container/on-card (24), gap space/general/3xl (24), centrada verticalmente, ancho completo.
 * - Fondo background/container/default-on-card con esquina radius/general/2xl (24) en la superficie interna común
 *   (`NotchedSurface`, capa "Canva" de Figma, con `--surface-fill`); la raíz es transparente.
 * - Estados: Default background/container/default-on-card con avatar background/icon/default-on-canva · Hover superficie
 *   hover-on-card y avatar default-on-card · Select superficie hover-on-card + trazo default-on-card (md en Figma; la
 *   superficie común lo dibuja de 1) y avatar default-on-card · Inactive textos text/neutral/disabled-positive y avatar
 *   default-on-card con glifo gris. En Figma Inactive pinta la superficie como Hover y con trazo (parece un error: se
 *   confunde con Select), aquí queda como Default.
 * - Avatar icon de 48, texto en columna con gap space/badge/sm (2) y slot gráfico que reparte el ancho con el texto.
 * - Título: Prospero (family/secondary) semibold 48/52 con text/neutral/heading. Descripción: 16/22 con text/neutral/body.
 */
export const dataCardVariants = cva(
  [
    'group/data-card relative isolate box-border flex w-full items-center',
    'gap-ds-space-general-3xl p-ds-space-container-on-card',
    '[--surface-fill:var(--color-ds-background-container-default-on-card)]',
  ].join(' '),
  {
    variants: {
      /**
       * `auto`: hover real por CSS. `default`, `hover`, `select` e `inactive` fuerzan el aspecto (`select` e `inactive` salen
       * de las props `selected` e `inactive`; `state` solo para documentación).
       */
      state: {
        auto: 'hover:[--surface-fill:var(--color-ds-background-container-hover-on-card)]',
        default: '',
        hover: '[--surface-fill:var(--color-ds-background-container-hover-on-card)]',
        select: [
          '[--surface-fill:var(--color-ds-background-container-hover-on-card)]',
          '[--surface-edge:var(--color-ds-border-general-default-on-card)]',
        ].join(' '),
        inactive: '',
      },
    },
    defaultVariants: { state: 'auto' },
  }
);

/** Avatar en `auto`: pasa de default-on-canva a default-on-card con el hover de la tarjeta. */
export const dataCardAvatarHoverClass = 'group-hover/data-card:bg-ds-background-icon-default-on-card';

export const dataCardTextVariants = cva('flex min-w-0 flex-1 flex-col gap-ds-space-badge-sm');

export const dataCardTitleVariants = cva(
  [
    'm-0 font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
    'text-ds-primitives-typography-size-6xl leading-ds-typography-heading-line-height-3xl',
  ].join(' '),
  {
    variants: { inactive: { true: 'text-ds-text-neutral-disabled-positive', false: 'text-ds-text-neutral-heading' } },
    defaultVariants: { inactive: false },
  }
);

export const dataCardDescriptionVariants = cva(
  [
    'm-0 [font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    '[font-weight:var(--ds-primitives-typography-weight-regular)]',
    'text-ds-typography-body-size-lg leading-ds-typography-body-line-height-large-lg',
  ].join(' '),
  {
    variants: { inactive: { true: 'text-ds-text-neutral-disabled-positive', false: 'text-ds-text-neutral-body' } },
    defaultVariants: { inactive: false },
  }
);

export const dataCardGraphicVariants = cva('flex min-w-0 flex-1 items-center');

export const dataCardActionVariants = cva('flex shrink-0 items-center');
