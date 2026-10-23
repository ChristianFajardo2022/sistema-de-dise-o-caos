import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — ListItem Variants
 *
 * Fuente: component set "List (Atom)" de Figma (12174:13893): Type (Simple, Complex) × State (Default, Disabled).
 * El marco `Desktop` y el `Mobile` (oculto en Figma) se resuelven con una sola estructura y container queries.
 *
 * - Raíz: padding space/general/lg (8) lateral y space/general/2xl (16) arriba y abajo; borde superior de
 *   border/general/lg (1) en border/general/gray-sixth. El trazo de Figma es INSIDE y no suma alto: se dibuja
 *   con un box-shadow inset (no ocupa espacio, así que el padding y el alto coinciden con Figma). Es el contenedor de consulta (`@container`): el layout vive en el hijo.
 * - Desktop (contenedor >= 18rem de contenido, lo que mide la fila con avatar, texto y dos botones; no el corte de viewport de 48rem, que no aplica a un container query): una fila, gap 16 (complex) u 8 (simple).
 * - Mobile (< 18rem): la fila lleva casilla, avatar, título (con la categoría encima) y acciones;
 *   la descripción baja a todo el ancho, con gap 8.
 * - Disabled: textos en text/neutral/disabled-*; los controles se deshabilitan por su propia API.
 */
export const listItemVariants = cva(
  '@container list-none bg-transparent [box-shadow:inset_0_var(--ds-responsive-border-general-lg)_0_0_var(--color-ds-border-general-gray-sixth)] px-ds-space-general-lg py-ds-space-general-2xl',
  {
    variants: {
      disabled: { true: 'cursor-not-allowed', false: '' },
    },
    defaultVariants: { disabled: false },
  }
);

/** Marco `Desktop` / `Mobile`: una fila que en pantallas angostas deja bajar la descripción. */
export const listItemRowVariants = cva(
  'flex flex-wrap items-center gap-y-ds-space-general-lg @2xs:flex-nowrap',
  {
    variants: {
      variant: {
        complex: 'gap-x-ds-space-general-2xl',
        simple: 'gap-x-ds-space-general-lg @2xs:h-8',
      },
    },
    defaultVariants: { variant: 'complex' },
  }
);

/** `Container` de Figma (complex): título + categoría y descripción. En angosto se disuelve (`contents`). */
export const listItemTextBlockClass =
  'contents @2xs:flex @2xs:min-w-0 @2xs:flex-1 @2xs:flex-col @2xs:justify-center @2xs:gap-ds-space-general-sm';

/**
 * `Filename and Category`: en angosto la categoría va sobre el título (`flex-col-reverse`). Su base de 8rem
 * (mínimo 6rem) hace que, si no cabe, las acciones bajen a otra línea en vez de aplastar el título.
 */
export const listItemHeadClass =
  'flex min-w-24 flex-[1_1_8rem] flex-col-reverse gap-ds-space-general-sm @2xs:min-w-0 @2xs:flex-none @2xs:flex-row @2xs:items-center @2xs:gap-ds-space-general-lg';

const fontPrimary = 'font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]';

/**
 * `Filename`: Prospero semibold 14/18. Figma enlaza typography/heading/size/xs (alias de size/md = 14), pero en
 * tokens.css ese token vale 12: se usan los primitivos size/md y line-height/lg, que sí dan 14/18.
 */
export const listItemTitleVariants = cva(
  'min-w-0 truncate font-ds-primitives-typography-family-secundary [font-weight:var(--ds-primitives-typography-weight-semibold)] text-(length:--ds-primitives-typography-size-md) leading-(--ds-primitives-typography-line-height-lg)',
  {
    variants: {
      variant: {
        complex: '',
        // En Figma el título simple mide 100 de ancho fijo en Desktop y se trunca; en angosto ocupa el espacio libre
        simple: 'flex-1 @2xs:w-25 @2xs:flex-none',
      },
      disabled: { true: '', false: 'text-ds-text-neutral-heading' },
    },
    compoundVariants: [
      { variant: 'complex', disabled: true, class: 'text-ds-text-neutral-disabled-positive' },
      { variant: 'simple', disabled: true, class: 'text-ds-text-neutral-disabled-negative' },
    ],
    defaultVariants: { variant: 'complex', disabled: false },
  }
);

/**
 * `Status` de la descripción: complex 14/18; simple 16/20 en body. La variable de Figma se llama
 * "text/neutral/gray 2" pero resuelve a G07/G11, que en tokens.css es `text-neutral-gray`
 * (`gray-2` no cumple el contraste en light).
 */
export const listItemDescriptionVariants = cva(
  `order-last basis-full ${fontPrimary} @2xs:order-none @2xs:basis-auto`,
  {
    variants: {
      variant: {
        complex: 'text-ds-typography-body-size-md leading-ds-typography-body-line-height-short-md',
        simple:
          'min-w-0 text-ds-typography-body-size-lg leading-ds-typography-body-line-height-short-lg @2xs:flex-1',
      },
      disabled: { true: '', false: '' },
    },
    compoundVariants: [
      { variant: 'complex', disabled: false, class: 'text-ds-text-neutral-gray' },
      { variant: 'complex', disabled: true, class: 'text-ds-text-neutral-disabled-positive' },
      { variant: 'simple', disabled: false, class: 'text-ds-text-neutral-body' },
      { variant: 'simple', disabled: true, class: 'text-ds-text-neutral-disabled-negative' },
    ],
    defaultVariants: { variant: 'complex', disabled: false },
  }
);

/** `Item Category`: texto de acento 14/18 con la línea vertical de 0.5 antes (solo en Desktop). */
export const listItemCategoryVariants = cva(
  `min-w-0 truncate ${fontPrimary} text-ds-typography-body-size-md leading-ds-typography-body-line-height-short-md`,
  {
    variants: {
      disabled: { true: 'text-ds-text-neutral-disabled-negative', false: 'text-ds-text-acent-firts' },
    },
    defaultVariants: { disabled: false },
  }
);

/** `Line 1`: 10 de alto, trazo border/divider/md (0.5) en border/general/gray-secondary. */
export const listItemDividerClass =
  'hidden h-2.5 w-(--ds-responsive-border-general-md) shrink-0 bg-ds-border-general-gray-secondary @2xs:block';

/** `Actions Block`: botones de ícono y menú, gap space/general/md (4). */
export const listItemActionsClass = 'ml-auto flex shrink-0 items-center gap-ds-space-general-md';
