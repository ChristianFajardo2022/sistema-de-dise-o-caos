import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — BlogCard Variants
 *
 * Fuente: component set "Cards" de Figma (17080:14028), Propiedad 1 = Blog card × Propiedad 2 = Blog vertical /
 * Blog horizontal (prop `orientation`).
 *
 * - Raíz: radius/general/2xl (24) salvo arriba a la derecha (0, la esquina de la muesca). Sombra effect/shadow sm
 *   (alfa 0 en oscuro): en vertical, drop-shadow de la silueta con muesca; en horizontal, la utilidad shadow-ds-on-card (box-shadow) en la raíz.
 * - vertical (344×444): lienzo de 272 con la superficie interna común (`NotchedSurface`, muesca de 48) que recorta la
 *   foto, Button corner md On canva en la muesca y franja inferior del autor (64: padding 16/8 = space/general/2xl y lg,
 *   gap 8, radio inferior 24, degradado blanco 0 → 100 % con desenfoque de fondo de 12). Bloque de texto montado 20 px
 *   sobre el lienzo (gap −20 de Figma) con padding superior 40 (space/general/5xl) y gap 12 (space/general/xl): fecha,
 *   título 20/24 (heading/size/md de Figma = heading-lg de tokens.css), resumen 14/18 y Button terciario sm.
 * - horizontal (497×266): foto a la izquierda (radio 24) con etiquetas arriba (padding 8) y franja del autor abajo
 *   (48: padding 12/8); a la derecha, bloque de 16 de padding (space/container/second-level → space/general/2xl) con
 *   gap 16: fecha y bloque "Information" (gap 4 = gap/general/sm → space/general/md): título 14/18 (heading/size/xs de
 *   Figma = heading-sm de tokens.css), resumen 12/18 (body/size/sm, body/line-height-large/sm) y Button terciario xs.
 *   Gap 16 entre las dos columnas (space/general/2xl). Figma reparte 224,5 / 256,5 con las dos en FILL: aquí mitades.
 * - Autor: Helvetica Neue 14/18 (vertical; Figma pide Medium, sin token de peso 500 → regular) o 12/16 (horizontal) en
 *   text/neutral/black. Degradado de Figma en blanco sin variable → background/general/white; con el tema oscuro
 *   forzado de `MediaScrim` son siempre blanco y negro, como en Figma.
 * - Fecha (las dos): 10/14 en text/neutral/body con ícono calendar de 12 (icon/general/gray-high-contrast), gap 4.
 * - Colores del texto: text/neutral/heading y "gray 2" (G07 = text/neutral/gray de tokens.css) en las dos. Figma pone
 *   text/neutral/white-unicolor en el título y el resumen de horizontal, que no van sobre la foto sino sobre la página
 *   (ilegible en claro): se usan los de vertical (para diseño).
 * - Lo que va sobre la foto (franja del autor; etiquetas en horizontal) es un `MediaScrim`: tokens de Dark siempre.
 */

const primary = 'font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]';
const semibold = 'font-ds-primitives-typography-family-secundary [font-weight:var(--ds-primitives-typography-weight-semibold)]';
const corners = 'rounded-tl-ds-radius-general-2xl rounded-bl-ds-radius-general-2xl rounded-br-ds-radius-general-2xl';

/** Raíz (`<article>`). */
export const blogCardVariants = cva(`relative isolate box-border flex w-full min-w-0 text-left ${corners}`, {
  variants: {
    orientation: {
      vertical: 'flex-col',
      horizontal: 'min-h-66.5 flex-row gap-ds-space-general-2xl shadow-ds-on-card',
    },
  },
  defaultVariants: { orientation: 'vertical' },
});

/**
 * Enlace principal (en el título): se estira sobre toda la tarjeta con `::after` (la raíz es `relative`). El foco se
 * dibuja en esa capa, con la silueta de la tarjeta.
 */
const stretched = [
  "after:absolute after:inset-0 after:z-10 after:content-['']",
  'after:rounded-ds-radius-general-2xl after:rounded-tr-none',
  'focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-solid focus-visible:after:outline-ds-border-field-active',
].join(' ');

export const blogCardLinkClass = `text-inherit no-underline outline-none ${stretched}`;

/**
 * "Leer más" como enlace principal: aspecto de Button terciario, pero sin `relative` ni recorte para que el `::after`
 * se estire sobre toda la tarjeta.
 */
export const blogCardLabelLinkClass = `static overflow-visible ${stretched}`;

/** Imagen (rellena su capa). */
export const blogCardImageClass = 'block size-full object-cover';

/** Marcador neutro cuando no hay imagen. */
export const blogCardPlaceholderClass =
  'flex size-full items-center justify-center bg-ds-background-container-default-on-card text-ds-icon-general-gray-high-contrast';

/**
 * Franja del autor (un `MediaScrim`, tema oscuro forzado): velo blanco (background/general/white de Dark) y desenfoque
 * de fondo 12, radio inferior 24. Figma pinta el degradado de 0 a 100 % en toda la franja; aquí el velo es opaco desde
 * el padding superior (donde empieza el nombre), para que el texto negro se lea sobre cualquier foto.
 */
export const blogCardAuthorBarVariants = cva(
  [
    'flex min-w-0 items-center gap-ds-space-general-lg px-ds-space-general-lg',
    'rounded-bl-ds-radius-general-2xl rounded-br-ds-radius-general-2xl backdrop-blur-md',
    '[--scrim:var(--color-ds-background-general-white)]',
  ].join(' '),
  {
    variants: {
      orientation: {
        vertical: 'absolute inset-x-0 bottom-0 py-ds-space-general-2xl [--scrim-fade:var(--ds-responsive-space-general-2xl)]',
        horizontal: 'relative mt-auto py-ds-space-general-xl [--scrim-fade:var(--ds-responsive-space-general-xl)]',
      },
    },
    defaultVariants: { orientation: 'vertical' },
  }
);

/** Capa "Container": avatar y nombre, gap 8. */
export const blogCardAuthorClass = 'flex min-w-0 flex-1 items-center gap-ds-space-general-lg';

export const blogCardAuthorNameVariants = cva(`min-w-0 truncate ${primary} text-ds-text-neutral-black`, {
  variants: {
    orientation: {
      vertical: 'text-ds-primitives-typography-size-md leading-ds-typography-body-line-height-short-md',
      horizontal: 'text-ds-primitives-typography-size-sm leading-ds-typography-body-line-height-short-sm',
    },
  },
  defaultVariants: { orientation: 'vertical' },
});

/** Vertical: lienzo de 272 (capa "canva"). */
export const blogCardCanvaClass = 'relative h-68 w-full shrink-0';

/** Button corner (decorativo o la acción): arriba a la derecha; la sombra effect/shadow sm es `cornerShadowClass`. */
export const blogCardCornerClass = 'absolute top-0 right-0 flex';

/** Vertical: bloque de texto montado 20 px sobre el lienzo, padding superior 40. */
export const blogCardTextClass = '-mt-(--ds-primitives-space-3xl) flex min-w-0 flex-col gap-ds-space-general-3xl pt-ds-space-general-5xl';

/** Vertical: capa "Title/state", gap 12. */
export const blogCardTitleStateClass = 'flex min-w-0 flex-col items-start gap-ds-space-general-xl';

/** Horizontal: capa "Text" (la foto, con las etiquetas arriba y el autor abajo). */
export const blogCardMediaClass =
  'relative flex min-w-0 flex-1 basis-0 flex-col overflow-hidden rounded-ds-radius-general-2xl bg-ds-background-container-default-on-card';

/** Horizontal: la imagen ocupa toda la capa, detrás de etiquetas y autor. */
export const blogCardMediaFillClass = 'absolute inset-0';

/** Horizontal: etiquetas sobre la foto, padding 8. */
export const blogCardTagsClass = 'relative flex flex-wrap items-center gap-ds-space-general-lg p-ds-space-general-lg';

/** Vertical: etiquetas a la derecha del autor. */
export const blogCardInlineTagsClass = 'flex shrink-0 flex-wrap items-center gap-ds-space-general-lg';

/** Horizontal: capa "info", padding 16 y gap 16. */
export const blogCardInfoClass = 'flex min-w-0 flex-1 basis-0 flex-col gap-ds-space-general-2xl p-ds-space-general-2xl';

/** Horizontal: capa "Information", gap 4. */
export const blogCardInformationClass = 'flex min-w-0 flex-1 flex-col items-start gap-ds-space-general-md';

/** Fila de la fecha: ícono de 12 y texto 10/14, gap 4. */
export const blogCardDateClass = [
  `m-0 flex min-w-0 items-center gap-ds-space-general-md ${primary}`,
  'text-ds-typography-body-size-xs leading-ds-typography-body-line-height-short-xs text-ds-text-neutral-body',
  '[&_svg]:text-ds-icon-general-gray-high-contrast',
].join(' ');

export const blogCardTitleVariants = cva(`m-0 min-w-0 ${semibold}`, {
  variants: {
    orientation: {
      vertical: 'text-ds-typography-heading-size-lg leading-ds-typography-heading-line-height-lg text-ds-text-neutral-heading',
      horizontal: 'text-ds-typography-heading-size-sm leading-ds-typography-heading-line-height-sm text-ds-text-neutral-heading',
    },
  },
  defaultVariants: { orientation: 'vertical' },
});

export const blogCardDescriptionVariants = cva(`m-0 min-w-0 ${primary}`, {
  variants: {
    orientation: {
      vertical: 'text-ds-primitives-typography-size-md leading-ds-typography-body-line-height-short-md text-ds-text-neutral-gray',
      horizontal: 'text-ds-typography-body-size-sm leading-ds-typography-body-line-height-large-sm text-ds-text-neutral-gray',
    },
  },
  defaultVariants: { orientation: 'vertical' },
});
