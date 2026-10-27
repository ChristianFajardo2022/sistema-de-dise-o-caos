import { cva } from 'class-variance-authority';

/**
 * Popover — set "Atom tooltip" de Figma (11112:6700): Type Simple/Complex × Position (8 flechas) × Photo; 16 variantes
 * (Simple ⇔ Photo=no, Complex ⇔ Photo=yes).
 *
 * - Raíz transparente de 305 de ancho (FIXED en Figma): la flecha y el "Content" en columna (flecha arriba o abajo) o
 *   en fila (flecha a un lado), sin gap.
 * - Content: padding space/general/xl (12); radio radius/general/lg (12) en Simple y radius/general/2xl (24) en Complex,
 *   salvo la esquina de la flecha en las posiciones de esquina (radius/general/xs, 0).
 *   Relleno background/general/gray-sixth: el panel fuerza `data-theme="dark"`, así que es #45484d en los dos temas.
 * - Flechas (contenedor de 12 de alto o 14.31 de ancho): esquina = triángulo de 16 × 12; centro = 22 × 12;
 *   lateral = 14.31 × 22.63. Las centradas y laterales siguen al ancla con `--anchored-arrow-offset`.
 * - Inner Container: gap space/button/lg (8) en Simple y space/general/xl (12) en Complex. Bloque de medios de 169.47
 *   de alto: silueta "Subtract" de radius/general/xl (16) con la muesca sm del botón cerrar (Button corner sm de 32).
 * - Text: gap space/general/lg (8). Título Prospero Semibold heading/md (16/20) con 2 de aire arriba, sin ícono.
 *   Párrafo Helvetica Neue Regular typography/size/md con body/line-height-short/md (14/18).
 * - Description+link (solo Simple): fila con gap space/general/2xl (16): texto 14/18 text/neutral/white y Button link.
 * - Actions: padding [16, 0, 4, 0] (space/general/2xl, xs, md; con Photo el de arriba es xs), gap space/general/2xl
 *   (16); contador 12/16 text/neutral/body.
 */

export const popoverPanelVariants = cva('flex w-[305px] max-w-[calc(100vw-1rem)]', {
  variants: {
    arrow: {
      'top-left': 'flex-col-reverse',
      'top-right': 'flex-col-reverse',
      'center-top': 'flex-col-reverse',
      'bottom-left': 'flex-col',
      'bottom-right': 'flex-col',
      'center-bottom': 'flex-col',
      'middle-left': 'flex-row-reverse',
      'middle-right': 'flex-row',
    },
  },
  defaultVariants: { arrow: 'top-left' },
});

export const popoverContentVariants = cva(
  'flex min-w-0 flex-1 flex-col p-ds-space-general-xl bg-ds-background-general-gray-sixth',
  {
    variants: {
      type: { simple: 'rounded-ds-radius-general-lg', complex: 'rounded-ds-radius-general-2xl' },
      arrow: {
        'top-left': 'rounded-tl-ds-radius-general-xs',
        'top-right': 'rounded-tr-ds-radius-general-xs',
        'bottom-left': 'rounded-bl-ds-radius-general-xs',
        'bottom-right': 'rounded-br-ds-radius-general-xs',
        'center-top': '',
        'center-bottom': '',
        'middle-left': '',
        'middle-right': '',
      },
    },
    defaultVariants: { type: 'simple', arrow: 'top-left' },
  }
);

/** Contenedor de la flecha: ocupa su lugar en el flujo (como en Figma) y la flecha se coloca dentro. */
export const popoverArrowWrapVariants = cva('relative shrink-0 self-stretch', {
  variants: {
    arrow: {
      'top-left': 'h-3',
      'top-right': 'h-3',
      'bottom-left': 'h-3',
      'bottom-right': 'h-3',
      'center-top': 'h-3',
      'center-bottom': 'h-3',
      'middle-left': 'w-[14.31px]',
      'middle-right': 'w-[14.31px]',
    },
  },
  defaultVariants: { arrow: 'top-left' },
});

export const popoverArrowVariants = cva('absolute block bg-ds-background-general-gray-sixth', {
  variants: {
    arrow: {
      'top-left': 'bottom-0 left-0 h-3 w-4 [clip-path:polygon(0_0,0_100%,100%_100%)]',
      'top-right': 'bottom-0 right-0 h-3 w-4 [clip-path:polygon(100%_0,100%_100%,0_100%)]',
      'bottom-left': 'top-0 left-0 h-3 w-4 [clip-path:polygon(0_0,100%_0,0_100%)]',
      'bottom-right': 'top-0 right-0 h-3 w-4 [clip-path:polygon(0_0,100%_0,100%_100%)]',
      'center-top':
        'bottom-0 left-(--anchored-arrow-offset,50%) h-3 w-[22px] -translate-x-1/2 [clip-path:polygon(50%_0,100%_100%,0_100%)]',
      'center-bottom':
        'top-0 left-(--anchored-arrow-offset,50%) h-3 w-[22px] -translate-x-1/2 [clip-path:polygon(0_0,100%_0,50%_100%)]',
      'middle-left':
        'right-0 top-(--anchored-arrow-offset,50%) h-[22.63px] w-[14.31px] -translate-y-1/2 [clip-path:polygon(0_50%,100%_0,100%_100%)]',
      'middle-right':
        'left-0 top-(--anchored-arrow-offset,50%) h-[22.63px] w-[14.31px] -translate-y-1/2 [clip-path:polygon(0_0,100%_50%,0_100%)]',
    },
  },
  defaultVariants: { arrow: 'top-left' },
});

export const popoverInnerVariants = cva('flex flex-col', {
  variants: { type: { simple: 'gap-ds-space-button-lg', complex: 'gap-ds-space-general-xl' } },
  defaultVariants: { type: 'simple' },
});

/** Bloque de medios (Photo=yes): marco "Frame 6" de 169.47 con la forma "Subtract" (muesca del Button corner de 40). */
export const popoverMediaClass = 'relative isolate h-[169.47px] shrink-0';

export const popoverTextVariants = cva('flex flex-col gap-ds-space-general-lg', {
  variants: { media: { true: 'pb-ds-space-general-lg', false: '' } },
  defaultVariants: { media: false },
});

export const popoverTitleClass = [
  'm-0 min-w-0 flex-1 pt-ds-primitives-space-sm',
  'font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
  'text-ds-typography-heading-size-md leading-ds-typography-heading-line-height-md text-ds-text-neutral-white-unicolor',
].join(' ');

export const popoverDescriptionClass = [
  'm-0 font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
  'text-ds-primitives-typography-size-md leading-ds-typography-body-line-height-short-md text-ds-text-neutral-white-unicolor',
].join(' ');

/** Description+link (solo Simple): texto y Button link en fila, gap space/general/2xl (16), padding superior xs (0). */
export const popoverLinkRowClass = 'flex items-center gap-ds-space-general-2xl pt-ds-space-general-xs';

export const popoverLinkTextClass = [
  'm-0 min-w-0 flex-1 font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
  'text-ds-primitives-typography-size-md leading-ds-typography-body-line-height-short-md text-ds-text-neutral-white',
].join(' ');

export const popoverActionsVariants = cva(
  'flex items-center gap-ds-space-general-2xl px-ds-space-general-xs pb-ds-space-general-md',
  {
    variants: { media: { true: 'pt-ds-space-general-xs', false: 'pt-ds-space-general-2xl' } },
    defaultVariants: { media: false },
  }
);

export const popoverPageClass = [
  'm-0 min-w-0 flex-1 font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
  'text-ds-primitives-typography-size-sm leading-ds-typography-body-line-height-short-sm text-ds-text-neutral-body',
].join(' ');

/** Botón cerrar: Button corner sm (32) en la esquina superior derecha del bloque de medios (muesca sm). */
export const popoverCloseClass = 'absolute top-0 right-0';
