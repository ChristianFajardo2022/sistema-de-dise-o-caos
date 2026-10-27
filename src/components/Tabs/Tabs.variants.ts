import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Tabs
 *
 * Fuente: component sets "Tab (Atom)" (11666:4226) y "Tab" (11793:14729) de Figma.
 *
 * Tab (Atom), la pestaña:
 * - Píldora (radius/general/full) de alto dimention/tabs/tabs md (48 escritorio, 40 móvil) o tabs sm (32),
 *   padding space/button/xl (12 escritorio, 8 móvil) y gap space/general/lg (8).
 * - Ícono de 16 (icon/general/white), texto Helvetica Neue regular typography/size/md (14) con alto de línea
 *   typography/body/line-height-short/md (18) en text/neutral/white, y Badge Number (Default).
 * - Default: sin relleno. Hover y Focus: background/tab/hover-on-canva | hover-on-card.
 *   Select: background/tab/select-on-canva | select-on-card.
 * - Inactive: background/container/disabled-on-canva, ícono icon/general/disabled-negative, texto
 *   text/neutral/disabled-negative y Badge Neutral.
 * - Foco con teclado: Figma lo dibuja igual que Hover; se agrega un outline de 2px (WCAG 2.4.7).
 *
 * Tab, el contenedor:
 * - Píldora de alto dimention/tabs/container md (56 escritorio, 48 móvil) o container sm (40), padding
 *   space/general/md (4), gap space/general/lg (8), fondo background/tab/container on canva | on card y sombra
 *   0 12 32 -2 effect/shadow md (shadow-ds-on-canva-md; transparente en modo oscuro).
 * - "More options": botón Dots-moreoptions xs (32) a la derecha de las pestañas.
 */
export const tabListVariants = cva(
  [
    'box-border inline-flex max-w-full items-center gap-ds-space-general-lg rounded-ds-radius-general-full p-ds-space-general-md',
    // box-shadow directo: la utilidad shadow-* antepone las sombras vacías de ring e inset de Tailwind
    '[box-shadow:var(--shadow-ds-on-canva-md)]',
  ].join(' '),
  {
    variants: {
      size: {
        md: 'h-ds-dimention-tabs-container-md',
        sm: 'h-ds-dimention-tabs-container-sm',
      },
      contrast: {
        'on-canva': 'bg-ds-background-tab-container-on-canva',
        'on-card': 'bg-ds-background-tab-container-on-card',
      },
      fullWidth: {
        true: 'flex w-full',
        false: '',
      },
    },
    defaultVariants: { size: 'md', contrast: 'on-canva', fullWidth: false },
  }
);

/**
 * El `tablist` dentro del contenedor (frame "tabs" de Figma). Si las pestañas no caben (360 px, WCAG 1.4.10)
 * hace scroll horizontal dentro de la píldora, sin barra visible. El `py-1 -my-1` y `px-1 -mx-1` (space/general/md)
 * dan sitio al outline del foco (2 + 2 de offset) para que el scroll no lo recorte y no cambian la medida.
 */
export const tabListInnerVariants = cva(
  '-mx-ds-space-general-md -my-ds-space-general-md flex min-w-0 items-center gap-ds-space-general-lg overflow-x-auto overscroll-x-contain px-ds-space-general-md py-ds-space-general-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
  {
  variants: {
    fullWidth: { true: 'flex-1', false: '' },
  },
  defaultVariants: { fullWidth: false },
  }
);

/**
 * Los colores de Hover y Select cambian con Contrast: se guardan en variables locales y el State las usa.
 * Los prefijos (hover:, focus-visible:, aria-selected:, disabled:) solo aplican con state="default".
 */
export const tabVariants = cva(
  [
    'group box-border inline-flex shrink-0 items-center justify-center gap-ds-space-general-lg',
    'rounded-ds-radius-general-full border-0 bg-transparent p-ds-space-button-xl whitespace-nowrap select-none',
    'font-ds-primitives-typography-family-primary text-ds-text-neutral-white',
    'cursor-pointer outline-offset-2 outline-ds-border-field-active',
    'transition-[background-color,color] duration-300 ease-out motion-reduce:transition-none',
    'disabled:cursor-not-allowed',
  ].join(' '),
  {
    variants: {
      size: {
        md: 'h-ds-dimention-tabs-tabs-md',
        sm: 'h-ds-dimention-tabs-tabs-sm',
      },
      contrast: {
        'on-canva':
          '[--tab-hover:var(--color-ds-background-tab-hover-on-canva)] [--tab-select:var(--color-ds-background-tab-select-on-canva)]',
        'on-card':
          '[--tab-hover:var(--color-ds-background-tab-hover-on-card)] [--tab-select:var(--color-ds-background-tab-select-on-card)]',
      },
      state: {
        default: [
          'enabled:aria-[selected=false]:hover:bg-(--tab-hover)',
          'enabled:aria-[selected=false]:focus-visible:bg-(--tab-hover)',
          'focus-visible:outline-2 focus-visible:outline-solid',
          'aria-selected:bg-(--tab-select)',
          'disabled:bg-ds-background-container-disabled-on-canva disabled:text-ds-text-neutral-disabled-negative',
        ].join(' '),
        hover: 'bg-(--tab-hover)',
        focus: 'bg-(--tab-hover) outline-2 outline-solid',
        select: 'bg-(--tab-select)',
        inactive: 'bg-ds-background-container-disabled-on-canva text-ds-text-neutral-disabled-negative',
      },
      fullWidth: {
        true: 'min-w-0 flex-1',
        false: '',
      },
    },
    defaultVariants: { size: 'md', contrast: 'on-canva', state: 'default', fullWidth: false },
  }
);

/** Ícono de la pestaña: icon/general/white; deshabilitada, icon/general/disabled-negative. */
export const tabIconClass = 'shrink-0 text-ds-icon-general-white group-disabled:text-ds-icon-general-disabled-negative';

/** Texto de la pestaña (frame "Text-button"). */
export const tabLabelClass =
  'min-w-0 truncate text-ds-primitives-typography-size-md leading-ds-typography-body-line-height-short-md [font-weight:var(--ds-primitives-typography-weight-regular)]';

/** Panel (`tabpanel`): sin estilo propio; solo el foco visible, porque es enfocable. */
export const tabPanelClass = 'outline-offset-2 outline-ds-border-field-active focus-visible:outline-2 focus-visible:outline-solid';
