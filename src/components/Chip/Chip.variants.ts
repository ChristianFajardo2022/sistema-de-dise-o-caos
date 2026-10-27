import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Chip Variants
 *
 * Fuente: component sets "Chips" (9347:46000: Type Primary / Primary avatar / Primary color / Primary box ×
 * State Default / Hover / Focus / Select / Inactive) y "Chips plus" (15236:72238, el "+N").
 *
 * - Cápsula (radius/button/full, 48). Primary: padding X space/button/xl (12), Y space/button/lg (8), gap 4,
 *   ícono de 14 y marco de texto de alto 16 con texto 12 regular (typography/button/size/sm) → 82 x 32.
 *   Avatar y color: padding [4, 8, 4, 4] (space/button/md y lg) con un círculo de 24 → alto 32.
 *   Box: radio radius/general/xl (16), mismo padding que Primary, texto de ancho completo que se parte
 *   (alto de línea 14) y contenido alineado arriba.
 * - Estados por variables CSS (--chip-bg, --chip-stroke, --chip-fg, --chip-ic): Default = sin relleno y trazo
 *   0.5 border/general/gray-fourth; Hover = background/general/gray-seventh + mismo trazo; Focus =
 *   gray-sixth + border/general/gray-tertiary; Select = gray-sixth sin trazo; Inactive =
 *   container/disabled-on-canva con trazo border/general/disabled y texto/ícono disabled-negative.
 * - Trazo fino como box-shadow inset (Chrome redondea border-width). Figma no dibuja anillo de foco: se
 *   añade un outline de 2px con border/field/active (WCAG 2.4.7).
 * - El ícono de cerrar es icon/general/white en todos los estados (también en Inactive, así lo dibuja Figma).
 */

export const chipVariants = cva(
  [
    'group/chip relative box-border inline-flex max-w-full shrink-0 align-middle select-none',
    'gap-ds-gap-button-internal-margin-md',
    '[--chip-bg:transparent] [--chip-stroke:var(--color-ds-border-general-gray-fourth)]',
    '[--chip-fg:var(--color-ds-text-neutral-white)] [--chip-ic:var(--color-ds-icon-general-white)]',
    'bg-(color:--chip-bg) text-(color:--chip-fg)',
    'shadow-[inset_0_0_0_var(--ds-responsive-border-general-md)_var(--chip-stroke)]',
    'text-ds-typography-button-size-sm',
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    '[font-weight:var(--ds-primitives-typography-weight-regular)]',
    // Foco del cuerpo o del botón de quitar: aspecto Focus de Figma + anillo propio
    'has-[:focus-visible]:[--chip-bg:var(--color-ds-background-general-gray-sixth)]',
    'has-[:focus-visible]:[--chip-stroke:var(--color-ds-border-general-gray-tertiary)]',
    'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-solid has-[:focus-visible]:outline-ds-border-field-active',
  ].join(' '),
  {
    variants: {
      type: {
        primary: 'items-center rounded-ds-radius-button-full px-ds-space-button-xl py-ds-space-button-lg',
        'primary-avatar':
          'items-center rounded-ds-radius-button-full py-ds-space-button-md pr-ds-space-button-lg pl-ds-space-button-md',
        'primary-color':
          'items-center rounded-ds-radius-button-full py-ds-space-button-md pr-ds-space-button-lg pl-ds-space-button-md',
        'primary-box': 'items-start rounded-ds-radius-general-xl px-ds-space-button-xl py-ds-space-button-lg',
      },
      // Forzado para documentación (o inactive / select reales)
      state: {
        default: '',
        hover: '[--chip-bg:var(--color-ds-background-general-gray-seventh)]',
        focus:
          '[--chip-bg:var(--color-ds-background-general-gray-sixth)] [--chip-stroke:var(--color-ds-border-general-gray-tertiary)] outline-2 outline-offset-2 outline-solid outline-ds-border-field-active',
        select: '[--chip-bg:var(--color-ds-background-general-gray-sixth)] [--chip-stroke:transparent]',
        inactive:
          '[--chip-bg:var(--color-ds-background-container-disabled-on-canva)] [--chip-stroke:var(--color-ds-border-general-disabled)] [--chip-fg:var(--color-ds-text-neutral-disabled-negative)] [--chip-ic:var(--color-ds-icon-general-disabled-negative)]',
      },
      interactive: {
        true: 'transition-[background-color,box-shadow] duration-200 ease-out',
        false: '',
      },
    },
    compoundVariants: [
      // Hover solo sobre el aspecto Default (Select y Focus mantienen el suyo)
      {
        interactive: true,
        state: 'default',
        class: 'hover:[--chip-bg:var(--color-ds-background-general-gray-seventh)]',
      },
    ],
    defaultVariants: { type: 'primary', state: 'default', interactive: false },
  }
);

/**
 * Cuerpo del chip: botón (o span) con ícono/avatar/punto y texto; sin estilo propio, la cápsula pinta.
 * Interactivo: el padding es de la cápsula (medida de Figma), así que el botón estira su área de clic a toda la cápsula
 * con un `::before` (el botón no es `relative`: el pseudo-elemento se coloca contra la cápsula). WCAG 2.5.8.
 */
export const chipBodyVariants = cva(
  'm-0 box-border inline-flex min-w-0 appearance-none gap-ds-gap-button-internal-margin-md border-0 bg-transparent p-0 text-left text-inherit outline-none [font:inherit]',
  {
    variants: {
      type: {
        primary: 'items-center',
        'primary-avatar': 'items-center',
        'primary-color': 'items-center',
        'primary-box': 'flex-1 items-start',
      },
      interactive: {
        true: "cursor-pointer disabled:cursor-not-allowed rounded-[inherit] before:absolute before:inset-0 before:rounded-[inherit] before:content-['']",
        false: '',
      },
    },
    defaultVariants: { type: 'primary', interactive: false },
  }
);

/** Marco de texto "Text-button": alto 16 con texto centrado; en box, texto que se parte con alto de línea 14. */
export const chipTextVariants = cva('', {
  variants: {
    type: {
      primary: 'flex h-ds-dimention-button-container-xs items-center whitespace-nowrap leading-none',
      'primary-avatar': 'flex h-ds-dimention-button-container-xs items-center whitespace-nowrap leading-none',
      'primary-color': 'flex h-ds-dimention-button-container-xs items-center whitespace-nowrap leading-none',
      'primary-box': 'min-w-0 flex-1 break-words whitespace-normal leading-ds-typography-body-line-height-short-xs',
    },
  },
  defaultVariants: { type: 'primary' },
});

/**
 * Punto de color de `primary-color` (Ellipse de 24).
 * - `soft` (set Chips): background/graphic/*-firts; azul usa background/tertiary/secondary, como Figma.
 * - `strong` (filtro "Chips colors", 13874:43337): background/graphic/*-secondary; azul, graphic/tertiary-secondary.
 * - `purple` (graphic/acent-firts) y `violet` (graphic/acent-secondary) son iguales en los dos tonos, como en Figma.
 */
export const chipDotVariants = cva('box-border size-6 shrink-0 rounded-full', {
  variants: {
    color: {
      purple: 'bg-ds-background-graphic-acent-firts',
      violet: 'bg-ds-background-graphic-acent-secondary',
      green: '',
      yellow: '',
      red: '',
      blue: '',
      cyan: '',
    },
    tone: { soft: '', strong: '' },
  },
  compoundVariants: [
    { tone: 'soft', color: 'green', class: 'bg-ds-background-graphic-success-firts' },
    { tone: 'soft', color: 'yellow', class: 'bg-ds-background-graphic-alert-firts' },
    { tone: 'soft', color: 'red', class: 'bg-ds-background-graphic-error-firts' },
    { tone: 'soft', color: 'blue', class: 'bg-ds-background-tertiary-secondary' },
    { tone: 'soft', color: 'cyan', class: 'bg-ds-background-graphic-information-firts' },
    { tone: 'strong', color: 'green', class: 'bg-ds-background-graphic-success-secondary' },
    { tone: 'strong', color: 'yellow', class: 'bg-ds-background-graphic-alert-secondary' },
    { tone: 'strong', color: 'red', class: 'bg-ds-background-graphic-error-secondary' },
    { tone: 'strong', color: 'blue', class: 'bg-ds-background-graphic-tertiary-secondary' },
    { tone: 'strong', color: 'cyan', class: 'bg-ds-background-graphic-information-secondary' },
  ],
  defaultVariants: { color: 'purple', tone: 'soft' },
});

/**
 * Botón de quitar: ícono de 14 con área táctil de 24 (14 + 2×5; el margen negativo no altera la medida de Figma), por
 * encima del área estirada del cuerpo.
 */
export const chipCloseVariants = cva(
  'relative z-10 -m-[5px] box-border inline-flex shrink-0 appearance-none items-center justify-center rounded-full border-0 bg-transparent p-[5px] text-ds-icon-general-white outline-none disabled:cursor-not-allowed enabled:cursor-pointer focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
  { variants: { type: { primary: '', 'primary-avatar': '', 'primary-color': '', 'primary-box': 'self-start' } } }
);

/**
 * "+N" de "Chips plus": botón-cápsula de padding 8 (space/button/lg) con el número en un marco de 14 + 2 de
 * relleno inferior → 30 x 32. Estados con las mismas variables que el chip: Default = trazo
 * border/general/gray-fourth; Hover/Focus = background/general/gray-sixth + trazo; Select (menú abierto) =
 * gray-sixth sin trazo; Inactive = container/disabled-on-canva con texto disabled-negative.
 */
export const chipPlusVariants = cva(
  [
    'box-border inline-flex shrink-0 appearance-none items-center justify-center align-middle select-none',
    'm-0 rounded-ds-radius-button-full border-0 p-ds-space-button-lg',
    '[--chip-bg:transparent] [--chip-stroke:var(--color-ds-border-general-gray-fourth)] [--chip-fg:var(--color-ds-text-neutral-white)]',
    'bg-(color:--chip-bg) text-(color:--chip-fg)',
    'shadow-[inset_0_0_0_var(--ds-responsive-border-general-md)_var(--chip-stroke)]',
    'text-ds-typography-button-size-sm',
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    '[font-weight:var(--ds-primitives-typography-weight-regular)]',
    'cursor-pointer transition-[background-color,box-shadow] duration-200 ease-out outline-none',
    'hover:[--chip-bg:var(--color-ds-background-general-gray-sixth)]',
    'focus-visible:[--chip-bg:var(--color-ds-background-general-gray-sixth)]',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
    'aria-expanded:[--chip-bg:var(--color-ds-background-general-gray-sixth)] aria-expanded:[--chip-stroke:transparent]',
    'disabled:cursor-not-allowed disabled:[--chip-bg:var(--color-ds-background-container-disabled-on-canva)] disabled:[--chip-stroke:transparent] disabled:[--chip-fg:var(--color-ds-text-neutral-disabled-negative)]',
  ].join(' '),
  {
    variants: {
      state: {
        default: '',
        hover: '[--chip-bg:var(--color-ds-background-general-gray-sixth)]',
        focus:
          '[--chip-bg:var(--color-ds-background-general-gray-sixth)] outline-2 outline-offset-2 outline-solid outline-ds-border-field-active',
        select: '[--chip-bg:var(--color-ds-background-general-gray-sixth)] [--chip-stroke:transparent]',
        inactive:
          '[--chip-bg:var(--color-ds-background-container-disabled-on-canva)] [--chip-stroke:transparent] [--chip-fg:var(--color-ds-text-neutral-disabled-negative)] cursor-not-allowed',
      },
    },
    defaultVariants: { state: 'default' },
  }
);

/** Marco del número del "+N" (Frame de 14 x 16: texto de 14 de alto y 2 de relleno inferior). */
export const chipPlusTextVariants = cva('flex pb-0.5 leading-ds-typography-body-line-height-short-xs');
