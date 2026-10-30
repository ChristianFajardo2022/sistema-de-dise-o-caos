import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Accordion Variants
 *
 * Fuente: component set "Card accordion (Atom)" de Figma (State × Contrast, 4 variantes) y componente
 * suelto "Accordion" (lista de tarjetas con gap 8, space/general/lg).
 *
 * - Raíz de la tarjeta: columna, padding 16 (space/container/second-level = space-general-2xl), ocupa el ancho del contenedor
 *   (Figma muestra 1286 y 1328). La silueta (Subtract de Figma) se dibuja con tres capas del color de superficie:
 *   cuerpo (radius/general/2xl 24), pie con la muesca y relleno cóncavo. La muesca es de 40×40 con esquinas de 20,
 *   donde va el Button corner (sm, 32).
 * - Contrast: On canva = background/container/default-on-canva; On card = default-on-card.
 * - Encabezado: fila con padding derecho space/general/3xl (24) cerrado y space/general/5xl (40) abierto, gap 16.
 *   Avatar icon (32) + columna con Filename (Prospero semibold, heading/md 16/20) y Status (Helvetica, weight/Semibold enlazado, body/md 14/20,
 *   text/semantic/success-secondary). Alto mínimo de 38 aunque no haya Status.
 * - Panel: row-gap de 24 (space/general/3xl) bajo el encabezado cuando está abierto (cerrado 0, no hay panel visible) y slot Container en columna con gap 16, alineado al final.
 * - Sombra effect/shadow md (0 12 32, spread -2): drop-shadow sobre la silueta (el box-shadow no sigue la muesca); sin spread. Alfa 0 en oscuro.
 * - Apertura: grid-template-rows 0fr -> 1fr; con prefers-reduced-motion la altura salta y no se desplaza nada.
 * - Tokens sin equivalente exacto: Figma usa heading/size/sm (16/20) y tokens.css lo resuelve a 14/18; se usa heading/md (16/20).
 * - Foco con teclado: outline de 2px (no está en Figma).
 */
export const accordionItemVariants = cva(
  [
    'relative isolate box-border flex w-full flex-col',
    '[transition:row-gap_300ms_ease-out] motion-reduce:[transition-duration:0.01ms]',
  ].join(' '),
  {
  variants: {
    open: { true: '', false: 'gap-y-0' },
    /** Normal: padding space/container/on-card (24), fila de 24 al abrir. Table: padding y fila de 16 (space/general/2xl). */
    type: { normal: 'p-ds-space-container-on-card', table: 'p-ds-space-general-2xl' },
    contrast: {
      'on-canva': '[--accordion-surface:var(--color-ds-background-container-default-on-canva)]',
      'on-card': '[--accordion-surface:var(--color-ds-background-container-default-on-card)]',
    },
  },
  defaultVariants: { contrast: 'on-card', open: false, type: 'normal' },
  compoundVariants: [
    { open: true, type: 'normal', className: 'gap-y-ds-space-general-3xl' },
    { open: true, type: 'table', className: 'gap-y-ds-space-general-2xl' },
  ],
  }
);

/** Capas de la silueta (Subtract). Todas pintan `--accordion-surface`. */
export const accordionShapeClasses = {
  wrapper:
    'pointer-events-none absolute inset-0 -z-10 [filter:drop-shadow(0_12px_32px_var(--color-ds-responsive-effect-shadow-on-canva-md))]',
  /** Cuerpo: todo el ancho menos la muesca, con esquinas de 24 y la de la muesca de 20. */
  body:
    'absolute top-0 bottom-0 left-0 right-10 bg-(--accordion-surface) rounded-tl-ds-radius-general-2xl rounded-bl-ds-radius-general-2xl rounded-tr-[20px]',
  /** Pie bajo la muesca (empieza 40 abajo), con la esquina convexa de 20 y la de abajo de 24. */
  foot:
    'absolute top-10 right-0 bottom-0 left-[calc(100%-41px)] bg-(--accordion-surface) rounded-tr-[20px] rounded-br-ds-radius-general-2xl',
  /** Esquina cóncava de la muesca: cuadrado de 21 con un círculo de 20 recortado. */
  fillet:
    'absolute top-5 right-5 size-[21px] [background:radial-gradient(circle_at_100%_0,transparent_19.5px,var(--accordion-surface)_20.5px)]',
};

/** Botón del encabezado: fila con el padding derecho que deja sitio al Button corner. */
export const accordionTriggerVariants = cva(
  [
    'relative z-10 m-0 box-border flex w-full cursor-pointer appearance-none items-center border-0 bg-transparent p-0 text-left',
    '[transition:padding-right_300ms_ease-out] motion-reduce:[transition-duration:0.01ms]',
    // Área de clic hasta el borde de la tarjeta
    "before:absolute before:-inset-ds-space-general-2xl before:content-['']",
    'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
  ].join(' '),
  {
    variants: {
      open: { true: '', false: '' },
      // Table: las celdas ocupan todo el ancho, sin padding derecho
      type: { normal: '', table: 'pr-0' },
    },
    compoundVariants: [
      { type: 'normal', open: true, className: 'pr-ds-space-general-5xl' },
      { type: 'normal', open: false, className: 'pr-ds-space-general-3xl' },
    ],
    defaultVariants: { open: false, type: 'normal' },
  }
);

export const accordionTitleClass = [
  '-my-px block min-h-[18px] min-w-0 break-words',
  'font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
  'text-ds-typography-heading-size-md leading-ds-typography-heading-line-height-md text-ds-text-neutral-heading',
].join(' ');

export const accordionDescriptionClass = [
  'block min-w-0',
  'font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
  'text-ds-typography-body-size-md leading-ds-typography-body-line-height-large-md text-ds-text-semantic-success-secondary',
].join(' ');

/**
 * Panel: grid que pasa de 0fr a 1fr. Cerrado queda `invisible` (fuera del árbol de accesibilidad y del orden de tabulación)
 * una vez termina la animación. Propiedades de transición sueltas para poder acortarlas con reduced-motion.
 */
export const accordionPanelVariants = cva(
  [
    'relative z-10 grid',
    '[transition-property:grid-template-rows,visibility] [transition-timing-function:ease-out]',
    'motion-reduce:[transition-duration:0.01ms,0.01ms] motion-reduce:[transition-delay:0s,0s]',
  ].join(' '),
  {
    variants: {
      open: {
        true: 'visible grid-rows-[1fr] [transition-duration:300ms,0s] [transition-delay:0s,0s]',
        false: 'invisible grid-rows-[0fr] [transition-duration:300ms,0s] [transition-delay:0s,300ms]',
      },
    },
    defaultVariants: { open: false },
  }
);

/**
 * Fundido del contenido (Tier 3: se conserva con prefers-reduced-motion, más corto). El recorte del 0fr se extiende 8 px
 * sobre el contenido (margen negativo + padding iguales) para no cortar anillos de foco ni pulgares que sobresalen.
 */
export const accordionPanelInnerVariants = cva(
  'min-h-0 overflow-hidden -m-ds-space-general-lg p-ds-space-general-lg [transition-property:opacity] [transition-duration:300ms] motion-reduce:[transition-duration:150ms]',
  {
    variants: { open: { true: 'opacity-100', false: 'opacity-0' } },
    defaultVariants: { open: false },
  }
);

/** Slot Container: columna con gap 16 alineada al final. */
export const accordionSlotClass = 'flex flex-col items-end gap-ds-space-general-2xl';

/** Type=Table, fila de celdas (Table de Figma): celdas de igual ancho. */
export const accordionTableRowClass = 'flex min-w-0 flex-1 items-stretch';

/**
 * Celda de la fila: padding horizontal 12 (space/general/xl), alto 42, Helvetica regular body/md 14/20. Si la celda es
 * más angosta que una palabra larga (un número de guía, un código), la palabra se parte en vez de invadir la vecina.
 */
export const accordionCellClass = [
  'flex min-h-10.5 min-w-0 flex-1 items-center px-ds-space-general-xl [overflow-wrap:anywhere]',
  'font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
  'text-ds-typography-body-size-md leading-ds-typography-body-line-height-large-md text-ds-text-neutral-white',
].join(' ');

/** Type=Table abierto: marco interior con trazo de 1 px, radio 24, padding 24 y gap 24 (usa box-shadow inset: Chrome redondea border-width). */
export const accordionTableCardClass = [
  'flex flex-col gap-ds-space-general-3xl rounded-ds-radius-general-2xl p-ds-space-general-3xl',
  'shadow-[inset_0_0_0_1px_var(--color-ds-border-general-default-on-card)]',
].join(' ');
