import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — ChatDetailsPanel Variants
 *
 * Fuente: component set "Laterales (Atom)" de Figma (14894:12557), Type = Photo | Type4 | Document | Phot | Type6 | Type5
 * (320×749; en la pantalla Chat 14562:57994 ocupa todo el alto). Nombres de Figma a medias; aquí son vistas:
 * Photo = perfil · Type4 = riel plegado · Document = documentos · Phot = fotografías · Type6 = documentos con acciones
 * (eliminar, descargar) · Type5 = fotografías con acciones.
 *
 * - Panel: background/container/default-on-canva, radius/container/On card (24), sombra effect/shadow md
 *   (`shadow-ds-on-canva-md`), padding 24 (space/container/on-card), gap space/general/3xl (24),
 *   320 de ancho. Riel: ancho 80 (padding 24 y botones de 32), gap space/general/6xl (56), centrado.
 *   Type6 y Type5 traen además un trazo de 1 (border/general/default-on-canva) y Type6 gap 32: no se hace variante (ver docs).
 * - Encabezado de vistas: fila de 36, justify-between: Button tertiary xs con `chevron-left` ("Anterior") y acciones
 *   Button secondary xs (gap space/general/lg 8).
 * - Perfil: avatar md (48) y bloque de texto con gap space/general/3xl (24); texto centrado con gap 4 (gap/general/sm ->
 *   space/general/md). Nombre Prospero semibold 16/20 (heading/size/sm de Figma = heading/md en tokens.css), descripción
 *   14/20 (body/size/md, body/line-height-large/md) en text/neutral/body.
 * - Fila de sección (List (Atom) Complex): padding 16/8, trazo superior de 1 en border/general/default-on-canva, Avatar icon
 *   xs (32) On Canva, título Prospero semibold 14/18 (heading/size/xs de Figma = heading/sm en tokens.css) y
 *   `chevron-right` de 20 a la derecha.
 * - Cuadrícula: 2 columnas, gap space/general/lg (8), con Scroll bar (ScrollArea).
 */
export const chatDetailsPanelVariants = cva(
  [
    'box-border flex min-h-0 flex-col rounded-ds-radius-container-on-card bg-ds-background-container-default-on-canva',
    'shadow-ds-on-canva-md p-ds-space-container-on-card',
  ].join(' '),
  {
    variants: {
      collapsed: {
        false: 'w-80 gap-ds-space-general-3xl',
        true: 'w-20 items-center gap-ds-space-general-6xl',
      },
    },
    defaultVariants: { collapsed: false },
  }
);

/**
 * Contenido del panel (lo que controla el botón de plegar): `display: contents`, así sus hijos son hijos flex del panel
 * y comparten su gap (un `className` con otro gap en el panel lo cambia para todos).
 */
export const chatDetailsPanelContentVariants = cva('contents');

/**
 * Fila del botón de plegar. Figma lo separa menos que el gap del panel: 8 del perfil (24 − 16) y 16 del avatar en el
 * riel (56 − 40), con margen negativo de tokens.
 */
export const chatDetailsPanelToggleVariants = cva('flex w-full', {
  variants: {
    collapsed: {
      false: '-mb-ds-space-general-2xl',
      true: 'justify-center -mb-ds-space-general-5xl',
    },
  },
  defaultVariants: { collapsed: false },
});

export const chatDetailsHeaderVariants = cva('flex min-h-9 w-full items-center justify-between gap-ds-space-general-lg');

export const chatDetailsActionsVariants = cva('flex shrink-0 items-center gap-ds-space-general-lg');

export const chatDetailsProfileVariants = cva('flex w-full flex-col items-center gap-ds-space-general-3xl text-center');

export const chatDetailsProfileNameVariants = cva(
  [
    'm-0 font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
    'text-ds-typography-heading-size-md leading-ds-typography-heading-line-height-md text-ds-text-neutral-heading',
  ].join(' ')
);

export const chatDetailsProfileDescriptionVariants = cva(
  [
    'm-0 font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
    'text-ds-typography-body-size-md leading-ds-typography-body-line-height-large-md text-ds-text-neutral-body',
  ].join(' ')
);

/** Avatar icon de la fila en el riel: el botón es el círculo de 32. */
export const chatDetailsLinkCompactVariants = cva(
  [
    'inline-flex shrink-0 cursor-pointer appearance-none items-center justify-center rounded-full border-0 bg-transparent p-0',
    'outline-none transition-opacity duration-300 ease-out hover:opacity-80 motion-reduce:transition-none',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
  ].join(' ')
);

export const chatDetailsGridVariants = cva('m-0 grid list-none grid-cols-2 gap-ds-space-general-lg p-0');
