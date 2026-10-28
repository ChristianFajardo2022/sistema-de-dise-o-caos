import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — ProfileCard Variants
 *
 * Fuente: component set "Profile card" de Figma (12995:3291), Type Standar vertical / Standar horizontal / Full /
 * Qualification (`Full / Hero` pasó a `Full`; en el código `hero` es alias de `full`). Las cuatro comparten piezas (avatar con Badge de calificación, nombre, datos separados por "·",
 * etiquetas, descripción, acciones y contadores), así que es un solo componente con `layout`; la fila de estrellas
 * de Qualification es contenido (`stars`).
 *
 * - Standar vertical (352×330) y horizontal (352×278): raíz transparente, padding 24 (space/container/on-card) y gap 32 (space/general/4xl). Superficie Subtract en
 *   background/container/default-on-card, radius/general/2xl (24), sin trazo ni sombra, con muesca de 48 para el
 *   Button corner md (40) arriba a la derecha: `NotchedSurface notch="md"`. El Button corner (Checkbox, On canva) usa
 *   background/container/hover-on-canva en la instancia. En horizontal el bloque de nombre deja 56 a la derecha para
 *   no pasar bajo el Button corner.
 * - Full (ancho fluido × 210, nombre en una fila de 24 con padding superior 4): raíz con effect/shadow sm y el marco Desktop con background/container/default-on-canva,
 *   radio 24, padding 32 (space/container/on-canva) y gap 24. Fila 1: avatar brand, texto, acciones
 *   (Icon buttons, ocultas por defecto) y Dots-moreoptions sm (48), gap 16. Fila 2: etiquetas y contadores, gap 8.
 *   Bajo 42rem de contenedor: versión Mobile (avatar y acciones arriba, texto con nombre 20/24 y etiquetas debajo,
 *   contadores a todo el ancho).
 * - Qualification (317×438): centrada, superficie default-on-canva con radio 24 y effect/shadow sm, padding 32 (on-canva) y gap 24.
 * - Texto: nombre Prospero semibold heading/size/sm de Figma (16/20; en tokens.css es heading md), recortado a una línea
 *   en un cuadro de 18; datos 12/16 y descripción 14/18 en "text/neutral/gray 2" de Figma (G07), que en tokens.css es
 *   text/neutral/gray. Cifras de los contadores heading/size/md de Figma (20/24; en tokens.css heading lg).
 * - Contadores: columnas del mismo ancho (el de la etiqueta más larga), gap 8 + divisor de 1 (stroke/lg) en
 *   border/general/default-on-canva + gap 8.
 * - Las acciones ocupan todo el ancho bajo 48rem de pantalla (marco Mobile de Figma, variable responsive/general/mobile).
 */

const primary =
  'font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)] text-ds-text-neutral-gray';

/** Raíz (`<article>`). Vertical y horizontal: transparente (la superficie es `NotchedSurface`). */
export const profileCardVariants = cva('relative isolate box-border min-w-0 text-left', {
  variants: {
    layout: {
      vertical: 'flex w-full flex-col gap-ds-space-general-4xl p-ds-space-container-on-card',
      horizontal: 'flex w-full flex-row items-start gap-ds-space-general-4xl p-ds-space-container-on-card',
      hero: '@container flex w-full flex-col rounded-ds-radius-general-2xl shadow-ds-on-card',
      centered: [
        'flex w-full flex-col items-center gap-ds-space-general-3xl p-ds-space-container-on-canva text-center',
        'rounded-ds-radius-general-2xl bg-ds-background-container-default-on-canva shadow-ds-on-card',
      ].join(' '),
    },
  },
  defaultVariants: { layout: 'vertical' },
});

/** Full: marco Desktop de Figma (relleno, radio, padding 32 y gap 24). */
export const profileCardHeroFrameClass =
  'flex min-w-0 flex-col gap-ds-space-general-3xl rounded-ds-radius-general-2xl bg-ds-background-container-default-on-canva p-ds-space-container-on-canva';

/** Hero, fila 1: avatar, texto, acciones y más opciones. En Mobile el texto baja a su propia línea. */
export const profileCardHeroHeadClass = [
  'flex min-w-0 items-center gap-ds-space-general-2xl',
  '@max-2xl:flex-wrap @max-2xl:justify-between @max-2xl:gap-y-ds-space-general-3xl',
].join(' ');

/** Hero, fila 2: etiquetas y contadores. En Mobile se apilan y los contadores ocupan el ancho. */
export const profileCardHeroFootClass = [
  'flex min-w-0 items-center gap-ds-space-general-lg',
  '@max-2xl:flex-col @max-2xl:items-stretch @max-2xl:gap-ds-space-general-3xl',
].join(' ');

/** Columna de texto de horizontal (contenido y acciones, gap 32). */
export const profileCardColumnClass = 'flex min-w-0 flex-1 flex-col gap-ds-space-general-4xl';

/** Contenido de vertical y horizontal: bloque de nombre + etiquetas, y descripción (gap 16). */
export const profileCardContentClass = 'flex min-w-0 flex-col gap-ds-space-general-2xl';

/** Bloque de nombre y etiquetas (gap 8). */
export const profileCardHeadClass = 'flex min-w-0 flex-col gap-ds-space-general-lg';

/** Texto: nombre y datos. Gap 4 en vertical y horizontal; 8 en hero y centered (todo el texto en una columna). */
export const profileCardTextVariants = cva('flex min-w-0 flex-col', {
  variants: {
    layout: {
      vertical: 'gap-ds-space-general-md',
      horizontal: 'gap-ds-space-general-md',
      hero: 'flex-1 gap-ds-space-general-lg @max-2xl:order-last @max-2xl:basis-full',
      centered: 'w-full items-center gap-ds-space-general-lg',
    },
    /** Horizontal con Button corner: 56 libres a la derecha. */
    corner: { true: '', false: '' },
  },
  compoundVariants: [{ layout: 'horizontal', corner: true, class: 'pr-ds-primitives-space-7xl' }],
  defaultVariants: { layout: 'vertical', corner: false },
});

/** Nombre. El cuadro de Figma mide 18 con line-height 20 (texto recortado): -my-px deja el mismo alto. */
export const profileCardTitleVariants = cva(
  [
    'm-0 -my-px w-full min-w-0 truncate font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
    'text-ds-typography-heading-size-md leading-ds-typography-heading-line-height-md text-ds-text-neutral-heading',
  ].join(' '),
  {
    variants: {
      layout: {
        vertical: '',
        horizontal: '',
        // Desktop: el nombre va en un marco con padding superior space/general/md (4) y cuadro de 20 (fila de 24 junto
        // al "Icon tooltip"). Mobile: heading/size/md de Figma (20/24) sin recorte de cuadro
        hero: 'my-0 pt-ds-space-general-md @max-2xl:pt-0 @max-2xl:text-ds-typography-heading-size-lg @max-2xl:leading-ds-typography-heading-line-height-lg',
        centered: '',
      },
    },
    defaultVariants: { layout: 'vertical' },
  }
);

/** Datos bajo el nombre ("Bogotá D.C · Bogotá D.C"): 12/16, gap 4. */
export const profileCardSubtitleVariants = cva(
  `m-0 flex min-w-0 flex-wrap items-center gap-ds-space-general-md ${primary} text-ds-primitives-typography-size-sm leading-ds-typography-body-line-height-short-sm`,
  {
    variants: { centered: { true: 'justify-center', false: '' } },
    defaultVariants: { centered: false },
  }
);

/** Descripción: 14/18. */
export const profileCardDescriptionClass = `m-0 min-w-0 ${primary} text-ds-primitives-typography-size-md leading-ds-typography-body-line-height-short-md`;

/** Etiquetas (gap 8). En hero Mobile van 8 bajo la descripción (el gap de la fila es 24). */
export const profileCardTagsVariants = cva('flex min-w-0 flex-wrap items-center gap-ds-space-general-lg', {
  variants: {
    layout: {
      vertical: '',
      horizontal: '',
      hero: 'flex-1 @max-2xl:flex-none @max-2xl:mt-[calc(var(--ds-responsive-space-general-lg)-var(--ds-responsive-space-general-3xl))]',
      centered: 'justify-center',
    },
  },
  defaultVariants: { layout: 'vertical' },
});

/** Acciones. Bajo 48rem de pantalla ocupan todo el ancho, una debajo de otra (marco Mobile). */
export const profileCardActionsVariants = cva('flex gap-ds-space-general-lg', {
  variants: {
    layout: {
      vertical: 'flex-col items-start max-md:items-stretch',
      horizontal: 'flex-col items-start max-md:items-stretch',
      hero: 'items-center',
      centered: 'w-full flex-col items-center max-md:items-stretch',
    },
  },
  defaultVariants: { layout: 'vertical' },
});

/** Button corner con el control de selección (instancia On canva con relleno hover-on-canva). */
export const profileCardCornerClass = 'absolute top-0 right-0 z-20 bg-ds-background-container-hover-on-canva';

/** Avatar con el Badge de calificación abajo a la derecha. */
export const profileCardLeadingClass = 'relative inline-flex w-fit shrink-0';

/** Contadores: columnas del mismo ancho (el de la etiqueta más larga); en hero Mobile, a todo el ancho. */
export const profileCardStatsVariants = cva(
  'm-0 inline-grid shrink-0 auto-cols-fr grid-flow-col gap-x-ds-space-general-2xl p-0',
  {
    variants: { layout: { vertical: '', horizontal: '', hero: '@max-2xl:grid @max-2xl:w-full', centered: '' } },
    defaultVariants: { layout: 'vertical' },
  }
);

/**
 * Un contador: cifra arriba y etiqueta abajo (en el DOM la etiqueta va primero: `<dt>` antes de `<dd>`).
 * Del segundo en adelante, divisor de 1 (stroke/lg) centrado en el gap de 16.
 */
export const profileCardStatClass = [
  'relative flex min-w-0 flex-col-reverse items-center gap-ds-space-general-lg',
  'not-first:before:absolute not-first:before:inset-y-0 not-first:before:w-(--ds-primitives-stroke-lg) not-first:before:bg-ds-border-general-default-on-canva',
  "not-first:before:left-[calc(-1*var(--ds-responsive-space-general-lg)-var(--ds-primitives-stroke-lg)/2)] not-first:before:content-['']",
].join(' ');

export const profileCardStatValueClass = [
  'm-0 flex min-w-0 items-center justify-center gap-ds-space-general-md',
  'font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
  'text-ds-typography-heading-size-lg leading-ds-typography-heading-line-height-lg text-ds-text-neutral-heading',
].join(' ');

export const profileCardStatLabelClass = `m-0 whitespace-nowrap ${primary} text-ds-primitives-typography-size-sm leading-ds-typography-body-line-height-short-sm`;
