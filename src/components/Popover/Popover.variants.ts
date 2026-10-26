import { cva } from 'class-variance-authority';

/**
 * Popover — set "Tooltip" de Figma (11112:6700): Type (8 posiciones de flecha) × Photo yes/no.
 *
 * - Raíz transparente de 305 de ancho (FIXED en Figma): la flecha y el "Content" en columna (flecha arriba o abajo) o
 *   en fila (flecha a un lado), sin gap.
 * - Content: padding space/container/second-level (16; no está en tokens.css, se usa space/general/2xl, mismo valor),
 *   radius/general/2xl (24) salvo la esquina de la flecha en los Type de esquina (radius/general/xs, 0).
 *   Relleno background/container/default-unicolor (igual en los dos temas): el panel fuerza `data-theme="dark"`.
 * - Flechas: esquina = triángulo rectángulo de 16 × 16; centro = 22.63 × 11.31 (cuadrado de 16 girado 45°);
 *   lateral = 11.31 × 22.63 en una columna de 14.31. Las centradas y laterales siguen al ancla con
 *   `--anchored-arrow-offset`.
 * - Inner Container: gap space/button/lg (8); con Photo, space/button/2xl (16 en Desktop, 12 en Mobile) con el bloque de
 *   medios de 169.47 de alto: silueta "Subtract" de radius/general/xl (16) con la muesca del botón cerrar.
 * - Title Wrapper: gap space/general/md (4), ícono info-circle de 20; título Prospero semibold heading/sm (16/20) con
 *   2 de aire arriba. Texto Helvetica Neue regular body/lg con line-height-large/lg (14/20).
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
  'flex min-w-0 flex-1 flex-col p-ds-space-general-2xl rounded-ds-radius-general-2xl bg-ds-background-container-default-unicolor',
  {
    variants: {
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
    defaultVariants: { arrow: 'top-left' },
  }
);

/** Contenedor de la flecha: ocupa su lugar en el flujo (como en Figma) y la flecha se coloca dentro. */
export const popoverArrowWrapVariants = cva('relative shrink-0 self-stretch', {
  variants: {
    arrow: {
      'top-left': 'h-4',
      'top-right': 'h-4',
      'bottom-left': 'h-4',
      'bottom-right': 'h-4',
      'center-top': 'h-[11.31px]',
      'center-bottom': 'h-[11.31px]',
      'middle-left': 'w-[14.31px]',
      'middle-right': 'w-[14.31px]',
    },
  },
  defaultVariants: { arrow: 'top-left' },
});

export const popoverArrowVariants = cva('absolute block bg-ds-background-container-default-unicolor', {
  variants: {
    arrow: {
      'top-left': 'bottom-0 left-0 size-4 [clip-path:polygon(0_0,0_100%,100%_100%)]',
      'top-right': 'bottom-0 right-0 size-4 [clip-path:polygon(100%_0,100%_100%,0_100%)]',
      'bottom-left': 'top-0 left-0 size-4 [clip-path:polygon(0_0,100%_0,0_100%)]',
      'bottom-right': 'top-0 right-0 size-4 [clip-path:polygon(0_0,100%_0,100%_100%)]',
      'center-top':
        'bottom-0 left-(--anchored-arrow-offset,50%) h-[11.31px] w-[22.63px] -translate-x-1/2 [clip-path:polygon(50%_0,100%_100%,0_100%)]',
      'center-bottom':
        'top-0 left-(--anchored-arrow-offset,50%) h-[11.31px] w-[22.63px] -translate-x-1/2 [clip-path:polygon(0_0,100%_0,50%_100%)]',
      'middle-left':
        'right-0 top-(--anchored-arrow-offset,50%) h-[22.63px] w-[11.31px] -translate-y-1/2 [clip-path:polygon(0_50%,100%_0,100%_100%)]',
      'middle-right':
        'left-0 top-(--anchored-arrow-offset,50%) h-[22.63px] w-[11.31px] -translate-y-1/2 [clip-path:polygon(0_0,100%_50%,0_100%)]',
    },
  },
  defaultVariants: { arrow: 'top-left' },
});

export const popoverInnerVariants = cva('flex flex-col', {
  variants: { media: { true: 'gap-ds-space-button-2xl', false: 'gap-ds-space-button-lg' } },
  defaultVariants: { media: false },
});

/** Bloque de medios (Photo=yes): marco "Frame 6" de 169.47 con la forma "Subtract" (muesca del Button corner de 40). */
export const popoverMediaClass = 'relative isolate h-[169.47px] shrink-0';

export const popoverTextVariants = cva('flex flex-col gap-ds-space-general-lg', {
  variants: { media: { true: 'pb-ds-space-general-lg', false: '' } },
  defaultVariants: { media: false },
});

export const popoverTitleClass = [
  'm-0 min-w-0 flex-1 pt-ds-primitives-space-sm',
  'font-ds-primitives-typography-family-secundary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
  'text-ds-typography-heading-size-sm leading-ds-typography-heading-line-height-sm text-ds-text-neutral-white-unicolor',
].join(' ');

export const popoverDescriptionClass = [
  'm-0 font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
  'text-ds-typography-body-size-lg leading-ds-typography-body-line-height-large-lg text-ds-text-neutral-white-unicolor',
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

/** Botón cerrar: Button corner md (40) en la esquina superior derecha del bloque de medios. */
export const popoverCloseClass = 'absolute top-0 right-0';
