import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — ProductCard Variants
 *
 * Fuente: component set "Card producto" 15863:66763 de la página Card de Figma (State Default / Hover / +), 337×413.
 * - Silueta "Subtract": foto (relleno IMAGE) con esquinas radius/general/2xl (24) y muesca de 48 arriba a la derecha
 *   para el Button corner Favorite md (40, On card, effect/shadow sm). Se dibuja con `NotchedSurface`, sin trazo.
 * - Bloque "Text" abajo: velo sobre la foto (`MediaScrim`). Figma dibuja un degradado de #fefefe al 0 % a G11 (#5e6165;
 *   G12 #45484d en Hover) sin variable, que no llega a 4,5:1 bajo el texto con fotos claras: aquí el velo es opaco
 *   desde el padding superior (40) y G12 cuando se ve la descripción. Padding 40/16/16/16 (space/general/5xl y 2xl), gap 24
 *   (space/general/3xl), radio inferior 24. En Default abraza el contenido; en Hover y "+" mide 361 (empieza a 52 del
 *   borde superior) y apila el contenido abajo.
 * - Textos (gap 8, space/general/lg): título en Prospero semibold, heading/size/xs y heading/line-height/xs de Figma
 *   (14/18), recortado a una línea; descripción en Helvetica Neue regular 14/18 (typography/size/md y
 *   body/line-height-short/md) en text/neutral/gray 2; fila de precio (Prospero semibold, heading/size/sm de Figma,
 *   16/20) y Number rating, gap 10. Título y precio en text/neutral/white-unicolor.
 *   tokens.css corre la escala de heading un paso (heading/xs = 12/16, heading/sm = 14/18): se usan heading/sm (14/18)
 *   para el título y heading/md (16/20) para el precio. text/neutral/gray 2 de Figma (G07) es text/neutral/gray aquí.
 * - Acciones (Hover, frame "Desktop", gap 8, alineado a la derecha): Button primary sm "Agregar al carrito" (FILL) y
 *   Button secondary sm solo ícono (`edit`). En "+": Number picker input sm (FILL, 56 de alto).
 * - El bloque Text es un `MediaScrim` (`data-theme="dark"`): el velo oscuro no cambia con el tema, así que su contenido
 *   (textos, Button, Number picker, Number rating) usa siempre los tokens del modo Dark, el único que Figma dibuja.
 */

/** Raíz: proporción 337×413 de Figma como alto mínimo; el bloque de texto queda abajo. */
export const productCardVariants = cva(
  'group/product-card relative isolate box-border flex aspect-[337/413] w-full flex-col justify-end text-left'
);

/**
 * Bloque "Text" (va dentro de `MediaScrim edge="bottom"`: tema oscuro forzado y velo opaco desde el padding superior
 * de 40). `auto` = se expande con hover, foco dentro o en pantallas táctiles; `expanded` = siempre (Hover forzado o
 * producto agregado); `collapsed` = nunca (Default forzado).
 * Color del velo (`--scrim`): G11 plegado (como Figma; solo título, precio y calificación, en blanco ≥ 6:1) y G12
 * expandido, donde también se ve la descripción en text/neutral/gray (G12 da ~6:1; G11 no llega a 4,5:1). Expandido,
 * el velo es opaco desde donde empieza el texto y `--scrim-tint` repite el degradado de Figma sobre la foto de arriba.
 */
export const productCardOverlayVariants = cva(
  [
    'flex flex-col justify-end gap-ds-space-general-3xl',
    'rounded-b-ds-radius-general-2xl px-ds-space-general-2xl pt-ds-space-general-5xl pb-ds-space-general-2xl',
  ].join(' '),
  {
    variants: {
      reveal: {
        auto: [
          '[--scrim:var(--color-ds-primitives-color-primary-g11)]',
          'group-hover/product-card:mt-13 group-hover/product-card:flex-1',
          'group-focus-within/product-card:mt-13 group-focus-within/product-card:flex-1',
          '[@media(hover:none)]:mt-13 [@media(hover:none)]:flex-1',
          'group-hover/product-card:[--scrim:var(--color-ds-primitives-color-primary-g12)]',
          'group-focus-within/product-card:[--scrim:var(--color-ds-primitives-color-primary-g12)]',
          '[@media(hover:none)]:[--scrim:var(--color-ds-primitives-color-primary-g12)]',
          'group-hover/product-card:[--scrim-tint:var(--scrim)] group-focus-within/product-card:[--scrim-tint:var(--scrim)]',
          '[@media(hover:none)]:[--scrim-tint:var(--scrim)]',
        ].join(' '),
        expanded: 'mt-13 flex-1 [--scrim:var(--color-ds-primitives-color-primary-g12)] [--scrim-tint:var(--scrim)]',
        collapsed: '[--scrim:var(--color-ds-primitives-color-primary-g11)]',
      },
    },
    defaultVariants: { reveal: 'auto' },
  }
);

/** Partes que solo se ven con la tarjeta expandida. Plegadas quedan para lectores de pantalla y el foco las abre. */
export const productCardRevealVariants = cva('', {
  variants: {
    reveal: {
      auto: 'sr-only group-hover/product-card:not-sr-only group-focus-within/product-card:not-sr-only [@media(hover:none)]:not-sr-only',
      expanded: '',
      // Aspecto forzado plegado: si el foco llega a una parte plegada, se muestra (foco visible, 2.4.7)
      collapsed: 'sr-only focus-within:not-sr-only',
    },
  },
  defaultVariants: { reveal: 'auto' },
});

/** Grupo de textos (Frame 1984080535): gap 8. */
export const productCardTextGroupClass = 'flex flex-col gap-ds-space-general-lg';

/** Título (Filename): Prospero semibold 12/16 (heading xs), una línea. */
export const productCardTitleClass = [
  'm-0 truncate font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
  'text-ds-typography-heading-size-xs leading-ds-typography-heading-line-height-xs text-ds-text-neutral-white-unicolor',
].join(' ');

/** Descripción (Status): Helvetica Neue regular 14/18. */
export const productCardDescriptionClass = [
  'm-0 font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
  'text-ds-typography-body-size-md leading-ds-typography-body-line-height-short-md text-ds-text-neutral-gray',
].join(' ');

/** Fila de precio (Description Block): precio y Number rating, gap 10. */
export const productCardPriceRowClass = 'flex items-center gap-2.5';

/** Precio (Filename): Prospero semibold 16/20, una línea. */
export const productCardPriceClass = [
  'm-0 min-w-0 flex-1 truncate font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
  'text-ds-typography-heading-size-md leading-ds-typography-heading-line-height-md text-ds-text-neutral-white-unicolor',
].join(' ');

/** Fila de acciones (frame Desktop): gap 8, alineada a la derecha. */
export const productCardActionsClass = 'flex items-center justify-end gap-ds-space-general-lg';

/** Button corner Favorite: arriba a la derecha, encima del enlace estirado (la sombra es `cornerShadowClass`). */
export const productCardFavoriteClass = 'absolute top-0 right-0 z-20';

/**
 * Enlace estirado: el `::after` del enlace del título cubre toda la tarjeta. Los controles van encima (`relative z-10`).
 * El foco se dibuja en toda la tarjeta.
 */
export const productCardLinkClass = [
  'text-inherit no-underline outline-none',
  'after:absolute after:inset-0 after:z-0 after:rounded-ds-radius-general-2xl after:content-[""]',
  'focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-solid focus-visible:after:outline-ds-border-field-active',
].join(' ');

/** Fotografía dentro de la silueta. */
export const productCardImageClass = 'block size-full object-cover';
