import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — FileUploadSimple Variants
 *
 * Fuente: File upload simple-2 (21407:3920) y File upload simple (21412:4523) de Figma.
 *
 * - Raíz: columna de 304 de ancho con gap 8 (space/general/lg) entre el recuadro y el Alert opcional.
 * - Recuadro (Uploading y Loaded): mismas medidas que Input file upload (Atom): columna centrada, padding vertical
 *   space/field/2xl (40), gap space/field/xl (24), radius/field/lg, alto mínimo 234, trazo punteado border/field/disabled.
 *   Padding horizontal space/field/xl (24); en Hover y Focus space/field/lg (16, así está en Figma).
 * - Uploading: textos y trazo en gris apagado (los tokens disabled del FileDropzone) y fila de progreso de 32 de alto
 *   (barra + botón eliminar de ButtonCorner sm con ícono trash icon/semantic/error-firts).
 * - Loaded: ícono tick-circle icon/general/gray-high-contrast, nombre del archivo en text/neutral/white, "volver a
 *   cargar" en text/link/default y tamaño en semibold text/neutral/white.
 */

const frameBase = [
  'relative box-border flex min-h-[234px] w-full flex-col items-center justify-center',
  'gap-ds-space-field-xl rounded-ds-radius-field-lg py-ds-space-field-2xl',
].join(' ');

const activeLook = 'bg-ds-background-field-active-opacity-secondary text-ds-border-field-active px-ds-space-field-lg';

export const fileUploadSimpleFrameVariants = cva(frameBase, {
  variants: {
    visual: {
      // Cargando o inactivo: sin reacción al puntero
      static: 'px-ds-space-field-xl text-ds-border-field-disabled',
      // Cargado: reacciona al puntero, al arrastre (data-dragging) y al foco con teclado de sus botones
      auto: [
        'px-ds-space-field-xl text-ds-border-field-disabled',
        'hover:bg-ds-background-field-active-opacity-secondary hover:text-ds-border-field-active hover:px-ds-space-field-lg',
        'data-[dragging=true]:bg-ds-background-field-active-opacity-secondary data-[dragging=true]:text-ds-border-field-active data-[dragging=true]:px-ds-space-field-lg',
        'has-[:focus-visible]:text-ds-border-field-active has-[:focus-visible]:px-ds-space-field-lg',
      ].join(' '),
      hover: activeLook,
      focus: `${activeLook} bg-transparent`,
      disabled: 'cursor-not-allowed px-ds-space-field-lg text-ds-border-field-disabled',
    },
  },
  defaultVariants: { visual: 'static' },
});

/** SVG del trazo punteado, sobre todo el recuadro y sin interceptar el puntero. */
/** @deprecated El trazo lo dibuja `_internal/DashedStroke`; ya no se usa. */
export const fileUploadSimpleStrokeClass = 'pointer-events-none absolute inset-0 size-full overflow-visible';

export const fileUploadSimpleRootClass = 'flex w-full max-w-[304px] flex-col gap-ds-space-general-lg';

export const fileUploadSimpleIconVariants = cva('shrink-0', {
  variants: {
    tone: {
      loaded: 'text-ds-icon-general-gray-high-contrast',
      uploading: 'text-ds-icon-general-gray-high-contrast',
      disabled: 'text-ds-icon-general-disabled-negative',
    },
  },
  defaultVariants: { tone: 'loaded' },
});

/** Nombre del archivo: una sola línea con elipsis. */
export const fileUploadSimpleNameClass =
  'min-w-0 truncate font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)] text-ds-typography-field-size-md leading-ds-typography-field-line-height-md text-ds-text-neutral-white';

/** Botón "volver a cargar": texto de enlace, foco visible con el contorno del sistema. */
export const fileUploadSimpleLinkClass = [
  'shrink-0 cursor-pointer rounded-ds-radius-field-sm bg-transparent p-0',
  'font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
  'text-ds-typography-field-size-md leading-ds-typography-field-line-height-md text-ds-text-link-default',
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
  'disabled:cursor-not-allowed disabled:text-ds-text-link-inactive',
].join(' ');

/** Fila de progreso (Frame 1984080604): barra y botón eliminar, 32 de alto. */
export const fileUploadSimpleProgressRowClass = 'flex w-full items-center gap-ds-space-general-lg';
