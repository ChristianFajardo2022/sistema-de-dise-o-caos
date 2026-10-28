import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — InteractiveCard Variants
 *
 * Fuente: component set "Interactive card" de Figma (13219:38332): Type (Simple, Complex) × State (Default, Hover,
 * Select, Inactive).
 *
 * - Raíz transparente; el relleno vive en la superficie interna común (`NotchedSurface`, marco "Canva" de Figma),
 *   radius/general/2xl (24), con las variables `--surface-fill` y `--surface-edge`.
 * - Simple: fila, padding space/container/second-level (16 → space/general/2xl), gap space/general/2xl (16), alto 80.
 *   Avatar icon de 40 (default-on-canva; default-on-card en Hover y Select), título (heading 16/20) y subtítulo (body 14/20) con gap space/badge/sm (2); radio de 16.
 *   Default background/container/default-on-card · Hover hover-on-card + effect/shadow md (box-shadow
 *   `shadow-ds-on-canva-md`, con el spread −2 de Figma) · Select select-on-card +
 *   trazo interior de 1 (border/general/lg) en border/general/default-on-card · Inactive default-on-card y textos
 *   text/neutral/disabled-positive.
 * - Complex: columna, padding space/container/on-canva (32), gap space/general/3xl (24).
 *   Grupo "Content" con gap space/general/2xl (16). Silueta con muesca de 48 y Button corner md (40) arriba a la derecha.
 *   Default background/container/default-on-canva · Hover + trazo de 1 en border/general/default-on-card (y Button corner
 *   con trazo) · Select background/general/gray-seventh + trazo en border/general/gray-tertiary (Button corner On card
 *   con trazo) · Inactive default-on-canva y textos deshabilitados. Avatar del encabezado: icon/default-on-card en
 *   Default y Hover, default-on-canva en Select e Inactive.
 * - Bloques de dato (Box text): padding 24 (space/container/on-card) sobre background/container/hover-on-canva.
 * - Complex: sombra effect/shadow sm (0 4 12) en la superficie: drop-shadow si hay muesca (sigue la silueta) y
 *   box-shadow `shadow-ds-on-card` si no. Alfa 0 en oscuro.
 * - Los estados salen de CSS: `:hover` (o `data-state="hover"` para documentación), `:checked` del input de la tarjeta
 *   (`[data-card-control]`) y `data-disabled`. Seleccionada manda sobre hover; deshabilitada no tiene hover.
 * - Encabezado: Figma pone un padding derecho de 56 (space/general/6xl) al bloque de texto que hace desbordar el subtítulo
 *   destacado sobre su ícono; no se replica (el texto usa el ancho libre hasta las etiquetas).
 * - Tipografía: Figma enlaza heading/size/xs, sm y md (12/16, 16/20, 20/24), que en tokens.css son heading xs, md y lg.
 * - Foco con teclado: anillo de 2px alrededor de la tarjeta (no está en Figma), a `--ring-gap` (4) del borde. En simple
 *   se apaga el anillo propio del Radio para que no se vean dos.
 * - Controles internos: los que llevan `data-card-action` (Button corner, acciones de `InteractiveCardList`) quedan sobre
 *   el área de clic estirada; el resto del contenido no se toca.
 */

// Las clases van escritas enteras (Tailwind no detecta clases armadas con plantillas).
// Hover = `[&:is(:hover,[data-state=hover]):not([data-disabled]):not(:has([data-card-control]:checked))]` (real o forzado,
// sin selección ni deshabilitado). Seleccionada = `has-[[data-card-control]:checked]`.

export const interactiveCardVariants = cva(
  [
    'group/card relative isolate box-border flex min-w-0 text-left',
    'font-ds-primitives-typography-family-primary',
    // Anillo de foco: pseudo-elemento redondeado (la raíz es rectangular, como en Figma)
    '[--ring-gap:--spacing(1)]',
    "before:pointer-events-none before:absolute before:-inset-(--ring-gap) before:rounded-[calc(var(--ds-responsive-radius-general-2xl)+var(--ring-gap))] before:content-['']",
    'has-[[data-card-control]:focus-visible]:before:outline-2 has-[[data-card-control]:focus-visible]:before:outline-solid has-[[data-card-control]:focus-visible]:before:outline-ds-border-field-active',
    // Un solo anillo: el del Radio de la simple se apaga (queda el de la tarjeta)
    '[&_[data-card-control]:focus-visible+span]:outline-none',
    // Los controles marcados (Button corner, acciones de la lista o los del consumidor) quedan sobre el área de clic
    '[&_[data-card-action]]:relative [&_[data-card-action]]:z-[1]',
  ].join(' '),
  {
    variants: {
      variant: {
        simple: [
          'w-full items-center gap-ds-space-general-2xl p-ds-space-general-2xl',
          '[--surface-fill:var(--color-ds-background-container-default-on-card)]',
          '[&:is(:hover,[data-state=hover]):not([data-disabled]):not(:has([data-card-control]:checked))]:[--surface-fill:var(--color-ds-background-container-hover-on-card)]',
          'has-[[data-card-control]:checked]:[--surface-fill:var(--color-ds-background-container-select-on-card)]',
          'has-[[data-card-control]:checked]:[--surface-edge:var(--color-ds-border-general-default-on-card)]',
        ].join(' '),
        complex: [
          'w-full flex-col justify-center gap-ds-space-general-3xl p-ds-space-container-on-canva',
          '[--surface-fill:var(--color-ds-background-container-default-on-canva)]',
          // Button corner: On canva sin trazo
          '[--corner-bg:var(--color-ds-background-container-default-on-canva)] [--corner-ring:transparent]',
          '[&:is(:hover,[data-state=hover]):not([data-disabled]):not(:has([data-card-control]:checked))]:[--surface-edge:var(--color-ds-border-general-default-on-card)]',
          '[&:is(:hover,[data-state=hover]):not([data-disabled]):not(:has([data-card-control]:checked))]:[--corner-ring:var(--color-ds-border-general-hover-on-canva)]',
          'has-[[data-card-control]:checked]:[--surface-fill:var(--color-ds-background-general-gray-seventh)]',
          'has-[[data-card-control]:checked]:[--surface-edge:var(--color-ds-border-general-gray-tertiary)]',
          'has-[[data-card-control]:checked]:[--corner-bg:var(--color-ds-background-container-default-on-card)]',
          'has-[[data-card-control]:checked]:[--corner-ring:var(--color-ds-border-general-hover-on-card)]',
        ].join(' '),
      },
      disabled: {
        true: 'cursor-not-allowed',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: { variant: 'simple', disabled: false },
  }
);

/**
 * Avatar de la Simple: background/icon/default-on-canva en Default e Inactive (contrast on-canva) y default-on-card en
 * Hover y Select.
 */
export const interactiveCardSimpleAvatarClass = [
  'group-[:is(:hover,[data-state=hover]):not([data-disabled]):not(:has([data-card-control]:checked))]/card:bg-ds-background-icon-default-on-card',
  'group-has-[[data-card-control]:checked]/card:bg-ds-background-icon-default-on-card',
].join(' ');

/** Simple: sombra effect/shadow md solo en hover (real o forzado), sobre la superficie. */
export const interactiveCardHoverShadowClass =
  'group-[:is(:hover,[data-state=hover]):not([data-disabled]):not(:has([data-card-control]:checked))]/card:shadow-ds-on-canva-md';

/**
 * Acciones de `InteractiveCardList` (botones de ListItem): quedan sobre el área de clic de la tarjeta. Se limita a los
 * controles de la lista para no pisar el `position` del contenido del consumidor.
 */
export const interactiveCardActionsClass =
  '[&_:is(button,a,[tabindex])]:relative [&_:is(button,a,[tabindex])]:z-[1]';

/** Button corner de la Complex: colores por estado desde las variables de la tarjeta. */
export const interactiveCardCornerClass =
  'bg-(color:--corner-bg) [box-shadow:0_0_0_var(--ds-responsive-border-general-lg)_var(--corner-ring)]';

/** Posición del Button corner: arriba a la derecha, dentro de la muesca de 48. */
export const interactiveCardCornerSlotClass = 'absolute top-0 right-0 z-[1] flex';

/**
 * Avatar del encabezado de la Complex: background/icon/default-on-card en Default y Hover; default-on-canva en Select
 * (esta clase) e Inactive (contrast on-canva).
 */
export const interactiveCardAvatarCheckedClass = 'group-has-[[data-card-control]:checked]/card:bg-ds-background-icon-default-on-canva';

const semibold = '[font-weight:var(--ds-primitives-typography-weight-semibold)]';
const regular = '[font-weight:var(--ds-primitives-typography-weight-regular)]';
const secondary = `font-ds-primitives-typography-family-secondary ${semibold}`;
const primary = `font-ds-primitives-typography-family-primary ${regular}`;

/** Textos de la tarjeta. `strong` = blanco, `body` = gris de cuerpo; con `disabled` todos pasan a disabled-positive. */
export const interactiveCardTextVariants = cva('m-0 min-w-0', {
  variants: {
    kind: {
      /** heading/size/sm de Figma (16/20): título de la Simple */
      'title-sm': `${secondary} text-ds-typography-heading-size-md leading-ds-typography-heading-line-height-md`,
      /** heading/size/md de Figma (20/24): título del encabezado de la Complex */
      'title-md': `${secondary} text-ds-typography-heading-size-lg leading-ds-typography-heading-line-height-lg`,
      /** heading/size/xs de Figma (12/16): término de los pares título/descripción */
      'title-xs': `${secondary} text-ds-typography-heading-size-xs leading-ds-typography-heading-line-height-xs`,
      /** body/md 14/20 */
      body: `${primary} text-ds-typography-body-size-md leading-ds-typography-body-line-height-large-md`,
      /** size/md 14 con line-height-short/md 18: descripción */
      description: `${primary} text-ds-primitives-typography-size-md leading-ds-typography-body-line-height-short-md`,
      /** size/2xl 20 con line-height/3xl 24: dato de los bloques */
      value: `${primary} text-ds-primitives-typography-size-2xl leading-ds-primitives-typography-line-height-3xl`,
    },
    tone: { strong: '', body: '' },
    disabled: { true: 'text-ds-text-neutral-disabled-on-canva', false: '' },
  },
  compoundVariants: [
    { tone: 'strong', disabled: false, class: 'text-ds-text-neutral-white' },
    { tone: 'body', disabled: false, class: 'text-ds-text-neutral-body' },
  ],
  defaultVariants: { kind: 'body', tone: 'body', disabled: false },
});

/**
 * Bloque de dato (marco "Text" del slot Box text de Figma): padding space/container/on-card (24), gap 4,
 * radius/general/xl (16), background/container/hover-on-canva.
 */
export const interactiveCardStatClass =
  'flex min-w-0 flex-1 flex-col gap-ds-space-general-md rounded-ds-radius-general-xl bg-ds-background-container-hover-on-canva p-ds-space-container-on-card';
