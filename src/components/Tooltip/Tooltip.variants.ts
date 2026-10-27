import { cva } from 'class-variance-authority';

/**
 * Tooltip — set "Tooltip (Atom)" de Figma (11097:4782): 7 variantes, Solid No/Yes × Position Bottom/Left/Right/Top
 * (Figma no tiene Solid=No con Position=Bottom; el código lo admite).
 *
 * - Raíz transparente (como el componente de Figma): la flecha y el "Content" en columna (flecha arriba o abajo) o
 *   en fila (flecha a un lado), sin gap. 81 × 42 con flecha arriba/abajo; 89 × 34 con flecha lateral (texto de muestra).
 * - Content: padding space/general/lg (8), gap space/general/md (4), radius/general/md (8).
 * - Relleno: Solid=Yes background/general/gray-sixth (#45484d; la burbuja fuerza Dark, así que no cambia con el tema); Solid=No
 *   background/field/active-opacity (40 %). BACKGROUND_BLUR de 12 (backdrop-blur-md) en el Content y en la flecha.
 * - Flecha: triángulo de 16 × 8 (8 × 16 a los lados) del mismo relleno. Centrada; cuando la burbuja se corre para no
 *   salirse de la pantalla, sigue al disparador con la variable `--anchored-arrow-offset` (`utils/anchoredPosition`).
 * - Solid=Yes: superficie unicolor (no cambia con el tema), así que la burbuja fuerza `data-theme="dark"`.
 * - Sin ícono (Figma lo quitó). Texto Semibold 12/16 (typography/size/sm, body/line-height-short/sm,
 *   typography/weight/Semibold), text/neutral/white-unicolor, con 2 de aire abajo (marco "Text" de Figma).
 */

export const tooltipBubbleVariants = cva('flex w-max max-w-72 items-center', {
  variants: {
    arrow: {
      top: 'flex-col-reverse',
      bottom: 'flex-col',
      left: 'flex-row-reverse',
      right: 'flex-row',
    },
  },
  defaultVariants: { arrow: 'bottom' },
});

const fill = {
  true: 'bg-ds-background-general-gray-sixth',
  false: 'bg-ds-background-field-active-opacity',
};

export const tooltipContentVariants = cva(
  [
    'flex min-w-0 items-center gap-ds-space-general-md p-ds-space-general-lg rounded-ds-radius-general-md backdrop-blur-md',
    'text-ds-text-neutral-white-unicolor',
  ],
  { variants: { solid: fill }, defaultVariants: { solid: true } }
);

/** Contenedor de la flecha: ocupa su lugar en el flujo (como en Figma) y la flecha se coloca dentro. */
export const tooltipArrowWrapVariants = cva('relative shrink-0', {
  variants: {
    arrow: {
      top: 'h-2 self-stretch',
      bottom: 'h-2 self-stretch',
      left: 'w-2 self-stretch',
      right: 'w-2 self-stretch',
    },
  },
  defaultVariants: { arrow: 'bottom' },
});

export const tooltipArrowVariants = cva('absolute block backdrop-blur-md', {
  variants: {
    arrow: {
      top: 'bottom-0 left-(--anchored-arrow-offset,50%) h-2 w-4 -translate-x-1/2 [clip-path:polygon(50%_0,100%_100%,0_100%)]',
      bottom: 'top-0 left-(--anchored-arrow-offset,50%) h-2 w-4 -translate-x-1/2 [clip-path:polygon(0_0,100%_0,50%_100%)]',
      left: 'right-0 top-(--anchored-arrow-offset,50%) h-4 w-2 -translate-y-1/2 [clip-path:polygon(0_50%,100%_0,100%_100%)]',
      right: 'left-0 top-(--anchored-arrow-offset,50%) h-4 w-2 -translate-y-1/2 [clip-path:polygon(0_0,100%_50%,0_100%)]',
    },
    solid: fill,
  },
  defaultVariants: { arrow: 'bottom', solid: true },
});

export const tooltipTextClass = [
  'pb-ds-primitives-space-sm text-center',
  'font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
  'text-ds-primitives-typography-size-sm leading-ds-typography-body-line-height-short-sm text-ds-text-neutral-white-unicolor',
].join(' ');
