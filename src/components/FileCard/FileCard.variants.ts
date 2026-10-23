import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — FileCard Variants
 *
 * Fuente: dos component sets "File card" de la página Card de Figma.
 * - 14043:59452 (Type Icon/Photo × State Default/Hover/Select):
 *   - Photo: 344×240 (ancho fluido). Lienzo de 160 con la silueta Subtract (radius/general/2xl 24, muesca de 48 para el
 *     Button corner md de 40) y trazo interior border/general/lg (1) en gray-fifth. Bloque de texto debajo, montado 20 px
 *     bajo el lienzo (gap -20 de Figma: margin-top negativo), padding 40/16/16 (space/general/5xl y 2xl), radio inferior 24.
 *     Avatar icon de 48 centrado cuando no hay foto. Sombra effect/shadow sm (0 4 12): drop-shadow en una capa de superficie con la silueta entera (lienzo y texto), no en la raíz.
 *   - Icon: ancho fluido (498 en Figma) × 148. Padding 16 (space/container/second-level -> space/general/2xl), gap 24
 *     (space/general/3xl). Silueta con muesca de 40 para el Button corner sm de 32. Avatar icon de 48 arriba a la izquierda.
 * - 15005:15958 (Thumbnail): 160×160, padding 56/16 (space/general/6xl y 2xl), Avatar icon de 32 centrado, muesca de 40 y
 *   Button corner de 34 con trazo interior gray-sixth. Hover: Backdrop (background/effect/backdrop) con Button primary
 *   Descargar y Button primary delete Eliminar (xs, solo ícono, gap 8).
 * - Texto: Filename en Prospero semibold 14/18 text/neutral/heading, recortado a una línea; Status en Helvetica
 *   Neue regular 14/18 (typography/size/md y body/line-height-short/md). Gap 8 (space/general/lg).
 *   Tokens sin equivalente exacto: Figma usa heading/size/xs y heading/line-height/xs (14/18) y tokens.css los resuelve a
 *   12/16: se usan heading/sm (14/18). Figma usa text/neutral/gray 2 con alias G07 (#cfd1d5 / #5e6165), que en tokens.css
 *   es text/neutral/gray (gray-2 apunta a G08/G10): se usa text/neutral/gray.
 * - Colores por State (variables CSS en la raíz, las consumen la silueta, el Button corner y el Avatar):
 *   Default background/container/default-on-card · Hover hover-on-card · Select select-on-card (select-on-canva en
 *   Thumbnail). Trazo de la silueta: Photo gray-fifth siempre; Icon gray-sixth en Hover y Select; Thumbnail gray-sixth en Hover.
 *   Hover cambia el Button corner a hover-on-canva con trazo exterior gray-fifth (Photo e Icon) y el Avatar a low-contrast
 *   (Icon y Thumbnail).
 */

/**
 * Raíz: posición, aislamiento (la silueta va en -z-10) y tipografía de cada Type. La silueta es la superficie interna
 * común (`NotchedSurface`), que lee `--surface-fill` y `--surface-edge`.
 */
export const fileCardVariants = cva('group/file-card relative isolate box-border text-left', {
  variants: {
    type: {
      photo: 'flex w-full flex-col rounded-tl-ds-radius-general-2xl rounded-bl-ds-radius-general-2xl rounded-br-ds-radius-general-2xl',
      icon: 'flex w-full flex-col gap-ds-space-general-3xl p-ds-space-general-2xl',
      thumbnail:
        'flex size-40 shrink-0 flex-col items-center justify-center gap-ds-space-general-3xl px-ds-space-general-2xl py-ds-space-general-6xl',
    },
  },
  defaultVariants: { type: 'icon' },
});

/**
 * Colores por Type y State. `auto` = el estado sale de :hover y del control marcado; `default`, `hover` y `select`
 * fuerzan el aspecto (documentación). Hover no se aplica si el control está marcado (manda Select).
 */
export const fileCardStateVariants = cva('', {
  variants: {
    type: { photo: '', icon: '', thumbnail: '' },
    state: { auto: '', default: '', hover: '', select: '' },
  },
  compoundVariants: [
    // ── Photo ──
    {
      type: 'photo',
      class: [
        '[--surface-fill:var(--color-ds-background-container-default-on-card)]',
        '[--surface-edge:var(--color-ds-border-general-gray-fifth)]',
        '[--fc-text-ring:transparent]',
        '[--fc-corner-bg:var(--color-ds-background-container-default-on-card)]',
        '[--fc-corner-ring:0_0_0_0_transparent]',
        '[--fc-avatar:var(--color-ds-background-icon-high-contrast)]',
      ],
    },
    {
      type: 'photo',
      state: 'auto',
      class: [
        'hover:not-has-checked:[--surface-fill:var(--color-ds-background-container-hover-on-card)]',
        'hover:not-has-checked:[--fc-text-ring:var(--color-ds-border-general-gray-fifth)]',
        'hover:not-has-checked:[--fc-corner-bg:var(--color-ds-background-container-hover-on-canva)]',
        'hover:not-has-checked:[--fc-corner-ring:0_0_0_var(--ds-responsive-border-general-lg)_var(--color-ds-border-general-gray-fifth)]',
        'has-checked:[--surface-fill:var(--color-ds-background-container-select-on-card)]',
      ],
    },
    {
      type: 'photo',
      state: 'hover',
      class: [
        '[--surface-fill:var(--color-ds-background-container-hover-on-card)]',
        '[--fc-text-ring:var(--color-ds-border-general-gray-fifth)]',
        '[--fc-corner-bg:var(--color-ds-background-container-hover-on-canva)]',
        '[--fc-corner-ring:0_0_0_var(--ds-responsive-border-general-lg)_var(--color-ds-border-general-gray-fifth)]',
      ],
    },
    { type: 'photo', state: 'select', class: '[--surface-fill:var(--color-ds-background-container-select-on-card)]' },

    // ── Icon ──
    {
      type: 'icon',
      class: [
        '[--surface-fill:var(--color-ds-background-container-default-on-card)]',
        '[--fc-corner-bg:var(--color-ds-background-container-default-on-card)]',
        '[--fc-corner-ring:0_0_0_0_transparent]',
        '[--fc-avatar:var(--color-ds-background-icon-high-contrast)]',
      ],
    },
    {
      type: 'icon',
      state: 'auto',
      class: [
        'hover:not-has-checked:[--surface-fill:var(--color-ds-background-container-hover-on-card)]',
        'hover:not-has-checked:[--surface-edge:var(--color-ds-border-general-gray-sixth)]',
        'hover:not-has-checked:[--fc-corner-bg:var(--color-ds-background-container-hover-on-canva)]',
        'hover:not-has-checked:[--fc-corner-ring:0_0_0_var(--ds-responsive-border-general-lg)_var(--color-ds-border-general-gray-fifth)]',
        'hover:not-has-checked:[--fc-avatar:var(--color-ds-background-icon-low-contrast)]',
        'has-checked:[--surface-fill:var(--color-ds-background-container-select-on-card)]',
        'has-checked:[--surface-edge:var(--color-ds-border-general-gray-sixth)]',
      ],
    },
    {
      type: 'icon',
      state: 'hover',
      class: [
        '[--surface-fill:var(--color-ds-background-container-hover-on-card)]',
        '[--surface-edge:var(--color-ds-border-general-gray-sixth)]',
        '[--fc-corner-bg:var(--color-ds-background-container-hover-on-canva)]',
        '[--fc-corner-ring:0_0_0_var(--ds-responsive-border-general-lg)_var(--color-ds-border-general-gray-fifth)]',
        '[--fc-avatar:var(--color-ds-background-icon-low-contrast)]',
      ],
    },
    {
      type: 'icon',
      state: 'select',
      class: [
        '[--surface-fill:var(--color-ds-background-container-select-on-card)]',
        '[--surface-edge:var(--color-ds-border-general-gray-sixth)]',
      ],
    },

    // ── Thumbnail ──
    {
      type: 'thumbnail',
      class: [
        '[--surface-fill:var(--color-ds-background-container-default-on-card)]',
        '[--fc-corner-bg:var(--color-ds-background-container-default-on-card)]',
        '[--fc-corner-ring:inset_0_0_0_var(--ds-responsive-border-general-lg)_var(--color-ds-border-general-gray-sixth)]',
        '[--fc-avatar:var(--color-ds-background-icon-high-contrast)]',
      ],
    },
    {
      type: 'thumbnail',
      state: 'auto',
      class: [
        'hover:not-has-checked:[--surface-fill:var(--color-ds-background-container-hover-on-card)]',
        'hover:not-has-checked:[--surface-edge:var(--color-ds-border-general-gray-sixth)]',
        'hover:[--fc-avatar:var(--color-ds-background-icon-low-contrast)]',
        'has-checked:[--surface-fill:var(--color-ds-background-container-select-on-canva)]',
        'has-checked:[--fc-avatar:var(--color-ds-background-icon-low-contrast)]',
      ],
    },
    {
      type: 'thumbnail',
      state: 'hover',
      class: [
        '[--surface-fill:var(--color-ds-background-container-hover-on-card)]',
        '[--surface-edge:var(--color-ds-border-general-gray-sixth)]',
        '[--fc-avatar:var(--color-ds-background-icon-low-contrast)]',
      ],
    },
    {
      type: 'thumbnail',
      state: 'select',
      class: [
        '[--surface-fill:var(--color-ds-background-container-select-on-canva)]',
        '[--fc-avatar:var(--color-ds-background-icon-low-contrast)]',
      ],
    },
  ],
  defaultVariants: { type: 'icon', state: 'auto' },
});

/** Bloque de texto de Photo (capa Text de Figma): se monta 20 px bajo el lienzo. */
export const fileCardPhotoTextClass = [
  'relative -mt-(--ds-primitives-space-3xl) flex flex-col gap-ds-space-general-3xl',
  'px-ds-space-general-2xl pt-ds-space-general-5xl pb-ds-space-general-2xl',
  'rounded-bl-ds-radius-general-2xl rounded-br-ds-radius-general-2xl bg-(--surface-fill)',
  '[box-shadow:inset_0_0_0_var(--ds-responsive-border-general-lg)_var(--fc-text-ring)]',
].join(' ');

/** Capa Title/state: título y metadatos con gap 8. */
export const fileCardTextGroupClass = 'flex min-w-0 flex-col gap-ds-space-general-lg';

export const fileCardTitleClass = [
  'm-0 min-w-0 truncate',
  'font-ds-primitives-typography-family-secundary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
  'text-ds-typography-heading-size-sm leading-ds-typography-heading-line-height-sm text-ds-text-neutral-heading',
].join(' ');

export const fileCardDescriptionClass = [
  'm-0 min-w-0',
  'font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
  'text-ds-primitives-typography-size-md leading-ds-typography-body-line-height-short-md text-ds-text-neutral-gray',
].join(' ');

/**
 * Button corner: posición arriba a la derecha y colores del State (variables de la raíz). El círculo y el padding
 * salen de `buttonCornerVariants`.
 */
export const fileCardCornerClass =
  'absolute top-0 right-0 z-20 bg-(--fc-corner-bg) [box-shadow:var(--fc-corner-ring)]';

/**
 * Photo: sombra effect/shadow sm del Button corner (Figma la pone en la instancia). Antes la daba el filtro de la raíz;
 * ahora la sombra de la tarjeta vive en su capa de superficie y el corner lleva la suya.
 */
export const fileCardPhotoCornerShadowClass = '[filter:drop-shadow(0_4px_12px_var(--ds-responsive-effect-shadow-sm))]';

/** Thumbnail: el Button corner mide 34 en Figma (instancia sm de 32 estirada con trazo interior de 1). */
export const fileCardThumbnailCornerClass = 'size-8.5';

/** Capa de acciones de Thumbnail (Backdrop + botones). Visible con hover, con foco dentro o en pantallas táctiles. */
export const fileCardOverlayVariants = cva(
  'absolute inset-0 z-10 flex items-center justify-center gap-ds-space-general-lg transition-opacity duration-150 ease-out motion-reduce:transition-none',
  {
    variants: {
      state: {
        auto: 'opacity-0 group-hover/file-card:opacity-100 group-focus-within/file-card:opacity-100 [@media(hover:none)]:opacity-100',
        default: 'opacity-0',
        hover: 'opacity-100',
        select: 'opacity-0',
      },
    },
    defaultVariants: { state: 'auto' },
  }
);
