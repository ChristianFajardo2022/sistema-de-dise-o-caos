import { cva } from 'class-variance-authority';
import type { TimelineProgress, TimelineStatus } from './Timeline.types';

/**
 * CAOS Design System — Timeline / Indicator Variants
 *
 * Fuente: component set "Indicator (Atom)" de Figma (13576:32508, 30 variantes: Orientation × Type × Percentage × State)
 * y Timeline (13687:11466, Propiedad 1=Vertical).
 *
 * - Vertical: fila con gap space/general/2xl (16); barra de 16 de ancho con padding superior 16 y el nodo arriba;
 *   texto con padding Y space/general/xl (12) y gap space/general/md (4).
 * - Horizontal: columna con gap space/general/xl (12); barra de 16 de alto con padding X md (4) y el nodo a la izquierda.
 *   En móvil el texto de Figma se oculta (responsive/general/desktop): aquí queda solo para lector de pantalla.
 * - Barra: 0 % background/general/gray-seventh; 50 % degradado seventh → white; 100 % background/general/white.
 *   Extremos redondeados con radius/general/full según Type.
 * - Nodo: 8 (incomplete: gray-fifth; complete: background/general/black) o anillo de 12 con núcleo de 8
 *   (current: acent secondary/tertiary; error y warning: semantic firts + tertiary/fourth).
 * - Título: Helvetica Neue semibold 14/18, color por estado. Descripción regular 14/20 y fecha regular 10/14, text/neutral/body.
 */

/** Avance del segmento por defecto, según el estado (Percentage de Figma). */
export const DEFAULT_PROGRESS: Record<TimelineStatus, TimelineProgress> = {
  incomplete: 0,
  current: 50,
  warning: 50,
  error: 50,
  complete: 100,
};

const font = '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]';

export const timelineVariants = cva('m-0 flex list-none p-0', {
  variants: {
    orientation: {
      vertical: 'w-full flex-col',
      horizontal: 'w-full flex-row',
    },
  },
  defaultVariants: { orientation: 'vertical' },
});

export const timelineItemVariants = cva('relative m-0 list-none p-0', {
  variants: {
    orientation: {
      vertical: 'group/item flex w-full flex-row items-stretch gap-ds-space-general-2xl',
      horizontal: 'group/item flex min-w-0 flex-1 flex-col gap-ds-space-general-xl',
    },
  },
  defaultVariants: { orientation: 'vertical' },
});

/** Barra del paso: relleno según avance y extremos según Type (o según la posición en la lista si no hay Type). */
export const timelineTrackVariants = cva('box-border flex shrink-0', {
  variants: {
    orientation: {
      vertical: 'w-4 flex-col items-center self-stretch pt-ds-space-general-2xl',
      horizontal: 'h-4 w-full flex-row items-center justify-start pl-ds-space-general-md pr-ds-space-general-md',
    },
    progress: {
      0: 'bg-ds-background-general-gray-seventh',
      50: '',
      100: 'bg-ds-background-general-white',
    },
    position: {
      initial: '',
      middle: '',
      finally: '',
      auto: '',
    },
  },
  compoundVariants: [
    { progress: 50, orientation: 'vertical', className: 'bg-linear-to-b from-ds-background-general-gray-seventh to-ds-background-general-white' },
    { progress: 50, orientation: 'horizontal', className: 'bg-linear-to-r from-ds-background-general-white to-ds-background-general-gray-seventh' },
    { position: 'initial', orientation: 'vertical', className: 'rounded-t-ds-radius-general-full' },
    { position: 'finally', orientation: 'vertical', className: 'rounded-b-ds-radius-general-full' },
    { position: 'initial', orientation: 'horizontal', className: 'rounded-l-ds-radius-general-full' },
    { position: 'finally', orientation: 'horizontal', className: 'rounded-r-ds-radius-general-full' },
    {
      position: 'auto',
      orientation: 'vertical',
      className: 'group-first/item:rounded-t-ds-radius-general-full group-last/item:rounded-b-ds-radius-general-full',
    },
    {
      position: 'auto',
      orientation: 'horizontal',
      className: 'group-first/item:rounded-l-ds-radius-general-full group-last/item:rounded-r-ds-radius-general-full',
    },
  ],
  defaultVariants: { orientation: 'vertical', progress: 0, position: 'auto' },
});

/** Nodo simple (incomplete y complete). */
export const timelineDotVariants = cva('block size-2 shrink-0 rounded-ds-radius-general-full', {
  variants: {
    status: {
      incomplete: 'bg-ds-background-general-gray-fifth',
      complete: 'bg-ds-background-general-black',
    },
  },
  defaultVariants: { status: 'incomplete' },
});

/** Anillo de 12 (current, warning, error) y su núcleo de 8. */
export const timelineRingVariants = cva('flex size-3 shrink-0 items-center justify-center rounded-ds-radius-general-full', {
  variants: {
    status: {
      current: 'bg-ds-background-acent-secondary',
      warning: 'bg-ds-background-semantic-alert-firts',
      error: 'bg-ds-background-semantic-error-firts',
    },
  },
  defaultVariants: { status: 'current' },
});

export const timelineCoreVariants = cva('block size-2 rounded-ds-radius-general-full', {
  variants: {
    status: {
      current: 'bg-ds-background-acent-tertiary',
      warning: 'bg-ds-background-semantic-alert-fourth',
      error: 'bg-ds-background-semantic-error-tertiary',
    },
  },
  defaultVariants: { status: 'current' },
});

export const timelineTextVariants = cva('box-border flex min-w-0 flex-col gap-ds-space-general-md', {
  variants: {
    orientation: {
      vertical: 'flex-1 justify-center py-ds-space-general-xl',
      // En móvil Figma oculta el texto: queda solo para lector de pantalla
      horizontal: 'w-full mobile:sr-only',
    },
  },
  defaultVariants: { orientation: 'vertical' },
});

export const timelineTitleVariants = cva(
  [
    font,
    'm-0 [font-weight:var(--ds-primitives-typography-weight-semibold)]',
    'text-ds-typography-body-size-md leading-ds-typography-body-line-height-short-md',
  ],
  {
    variants: {
      status: {
        incomplete: 'text-ds-text-neutral-body',
        current: 'text-ds-text-acent-firts',
        warning: 'text-ds-text-semantic-alert-secondary',
        error: 'text-ds-text-semantic-error-secondary',
        complete: 'text-ds-text-neutral-white',
      },
    },
    defaultVariants: { status: 'incomplete' },
  }
);

export const timelineDescriptionClass = [
  font,
  'm-0 text-ds-text-neutral-body [font-weight:var(--ds-primitives-typography-weight-regular)]',
  'text-ds-typography-body-size-md leading-ds-typography-body-line-height-large-md',
].join(' ');

export const timelineDateClass = [
  font,
  'm-0 flex gap-ds-space-general-md text-ds-text-neutral-body [font-weight:var(--ds-primitives-typography-weight-regular)]',
  'text-ds-typography-body-size-xs leading-ds-typography-body-line-height-short-xs',
].join(' ');

/**
 * Status tracker (13770:10884): columna con gap space/general/2xl (16). Escritorio: figura sobre la barra horizontal
 * (cada paso con título y fecha) y botón de historial. Móvil (Frame Mobile): fila con "Estado actual" y la
 * referencia, la barra sin textos y el resumen del paso actual debajo.
 */
export const statusTrackerRootClass = 'box-border flex w-full flex-col gap-ds-space-general-2xl';

// Escritorio: solo para lector de pantalla (da nombre al grupo); móvil: fila visible
export const statusTrackerHeaderClass =
  'sr-only mobile:not-sr-only mobile:flex mobile:items-center mobile:gap-ds-space-general-lg';

export const statusTrackerTitleClass = [
  font,
  'min-w-0 flex-1 text-ds-text-neutral-white [font-weight:var(--ds-primitives-typography-weight-semibold)]',
  'text-ds-typography-body-size-md leading-ds-typography-body-line-height-short-md',
].join(' ');

export const statusTrackerReferenceClass = [
  font,
  'min-w-0 flex-1 text-ds-text-neutral-body [font-weight:var(--ds-primitives-typography-weight-semibold)]',
  'text-ds-typography-body-size-md leading-ds-typography-body-line-height-short-md',
].join(' ');

export const statusTrackerMarkerRowClass = 'relative h-[41px] w-full';

// Se mueve entre pasos; con prefers-reduced-motion salta sin animar
export const statusTrackerMarkerClass =
  'absolute top-0 flex h-full items-center transition-[left] duration-500 ease-out motion-reduce:transition-none';

// Solo móvil: resumen del paso actual (título + fecha)
export const statusTrackerSummaryClass = 'hidden mobile:flex mobile:flex-col mobile:gap-ds-space-general-md';
