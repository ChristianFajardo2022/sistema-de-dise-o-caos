import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Dropdown Variants
 *
 * Fuente: component sets "Dropdown" (11673:7804, el panel, visible en el lienzo; reemplaza al viejo "Dropdown menu" 5331:1745) y "Dropdown list" (el ítem) de Figma.
 *
 * Panel:
 * - Fondo background/field/surface, trazo de 1 por dentro (border/general/default-on-card), radio field/md (16),
 *   sombra effect/shadow md (0 12 28 -2), ancho 310.
 * - Simple: padding 8 (lados space/field/sm), gap 8; Search: padding y gap space/field/sm (8, mobile 4), campo arriba.
 * - Área de ítems: 280 + gap 8 + riel de 6 (prop Scroll bar). Ítems separados 4 (Simple) u 8 (Search).
 * Ítem:
 * - Alto 34 natural (8 + 18 + 8; avatar 40), sin alto mínimo, padding 8, gap 8, radio field/sm (12), texto 14/18 field/size/sm.
 * - Default sin relleno, Hover background/field/hover, Select background/field/active-slow-contrast,
 *   Disabled texto text/neutral/disabled-positive.
 * - Control checkbox/radio de 16 (como Selection): anillo de 1.5 con box-shadow inset.
 * - Foco con teclado: no existe en Figma; outline de 2px por dentro con el token de borde activo (WCAG 2.4.7).
 */

const panelStroke =
  '[box-shadow:inset_0_0_0_var(--ds-primitives-stroke-lg)_var(--color-ds-border-general-default-on-card),0_12px_28px_-2px_var(--color-ds-responsive-effect-shadow-on-canva-md)]';

export const dropdownMenuPanelVariants = cva(
  [
    'box-border flex w-[310px] max-w-full min-w-0 bg-ds-background-field-surface',
    'rounded-ds-radius-field-md',
    panelStroke,
  ].join(' '),
  {
    variants: {
      type: {
        simple: 'flex-col gap-ds-space-general-lg px-ds-space-field-sm py-ds-space-general-lg',
        search: 'flex-col gap-ds-space-field-sm p-ds-space-field-sm',
      },
    },
    defaultVariants: { type: 'simple' },
  }
);

/** Área con scroll: ítems + riel. El relleno derecho de 8 es el gap entre ítems y riel. */
/** Gap entre ítems del panel Simple: 4, o 8 cuando hay ítems con avatar (en Figma Item=Avatar separa 8). */
export const dropdownMenuSimpleGap = 'gap-1 has-[[data-item-type=avatar]]:gap-ds-space-general-lg';

export const dropdownMenuScrollVariants = cva(
  'min-w-0',
  {
    variants: {
      type: { simple: dropdownMenuSimpleGap, search: 'gap-ds-space-field-sm' },
      // Menú: los ítems son hijos directos. Lista: el `ul` los envuelve.
      list: { true: '', false: 'flex flex-col' },
      scrollbar: {
        true: 'overflow-y-scroll pr-ds-space-general-lg',
        false: '[&::-webkit-scrollbar]:hidden [scrollbar-width:none]',
      },
    },
    defaultVariants: { type: 'simple', list: false, scrollbar: true },
  }
);

/**
 * Campo de búsqueda: usa los ganchos de CSS de Input (sin depender de su DOM interno). Borde en reposo
 * border/general/gray-fourth, gap ícono→texto de 12 (space/field/md) y label en reposo 16/20 a 10 del borde
 * (typography/field/size/md, line-height/md); flotando conserva el 12/16 de Input.
 */
export const dropdownMenuSearchClass = [
  'w-full [--input-border:var(--color-ds-border-general-gray-fourth)] [--input-field-gap:var(--ds-responsive-space-field-md)]',
  '[--input-label-rest-top:10px] [--input-label-rest-size:var(--ds-responsive-typography-field-size-md)]',
  '[--input-label-rest-leading:var(--ds-responsive-typography-field-line-height-md)]',
].join(' ');

export const dropdownMenuItemVariants = cva(
  [
    'box-border flex w-full min-w-0 items-center gap-ds-space-general-lg p-ds-space-general-lg m-0 border-0',
    'rounded-ds-radius-field-sm text-left list-none no-underline',
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    '[font-weight:var(--ds-primitives-typography-weight-regular)]',
    'text-ds-typography-field-size-sm leading-(--ds-responsive-typography-field-line-height-sm)',
    'outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
  ].join(' '),
  {
    variants: {
      state: {
        default: 'bg-transparent text-ds-text-neutral-white hover:bg-ds-background-field-hover focus-visible:bg-ds-background-field-hover',
        hover: 'bg-ds-background-field-hover text-ds-text-neutral-white',
        select: 'bg-ds-background-field-active-slow-contrast text-ds-text-neutral-white',
        disabled: 'bg-transparent text-ds-text-neutral-disabled-on-canva',
      },
      interactive: {
        true: 'cursor-pointer',
        false: 'cursor-default',
      },
    },
    compoundVariants: [{ state: 'disabled', interactive: true, class: 'cursor-not-allowed' }],
    defaultVariants: { state: 'default', interactive: true },
  }
);

/** Lista de navegación (`DropdownMenuNavList`): `ul` sin estilos de lista; el gap y el ancho los pone quien la usa. */
export const dropdownMenuNavListClass = 'm-0 flex list-none flex-col p-0';

export const dropdownMenuItemTextVariants = cva('min-w-0 flex-1 truncate select-none');

export const dropdownMenuItemIconVariants = cva('shrink-0', {
  variants: {
    disabled: {
      true: 'text-ds-icon-general-disabled-positive',
      false: 'text-ds-icon-general-default',
    },
  },
  defaultVariants: { disabled: false },
});

const controlBase =
  'relative box-border block size-4 shrink-0 bg-no-repeat [box-shadow:inset_0_0_0_var(--ds-primitives-stroke-xl)_var(--ring)]';

/** Control de 16 de `checkbox` y `radio` (el "Selection" de Figma, contraste positive). */
export const dropdownMenuItemControlVariants = cva(controlBase, {
  variants: {
    kind: {
      checkbox: [
        'rounded-ds-radius-field-checkbox-radiobutton-sm text-ds-icon-general-black',
        // Check de 8.05×6 centrado
        '[&_svg]:absolute [&_svg]:top-1/2 [&_svg]:left-1/2 [&_svg]:h-[6px] [&_svg]:w-[8.05px] [&_svg]:-translate-x-1/2 [&_svg]:-translate-y-1/2',
      ],
      radio: 'rounded-full',
    },
    checked: { true: '', false: '' },
    disabled: { true: '', false: '' },
  },
  compoundVariants: [
    { disabled: false, checked: false, class: '[--ring:var(--color-ds-background-field-surface-tertiary)]' },
    { disabled: false, checked: true, class: '[--ring:var(--color-ds-background-field-active-high-contrast)]' },
    { disabled: true, class: '[--ring:var(--color-ds-background-field-disabled)]' },
    { kind: 'checkbox', checked: false, class: '[&_svg]:hidden' },
    { kind: 'checkbox', checked: true, disabled: false, class: 'bg-ds-background-field-active-high-contrast' },
    { kind: 'checkbox', checked: true, disabled: true, class: 'bg-ds-background-field-disabled' },
    // Radio marcado: disco con hueco de 6.4
    {
      kind: 'radio',
      checked: true,
      disabled: false,
      class: '[box-shadow:none] [background-image:radial-gradient(circle,transparent_3.2px,var(--ring)_3.5px)]',
    },
    // Radio marcado y deshabilitado: anillo + punto de 8
    {
      kind: 'radio',
      checked: true,
      disabled: true,
      class: '[background-image:radial-gradient(circle,var(--ring)_3.8px,transparent_4.1px)]',
    },
  ],
  defaultVariants: { kind: 'checkbox', checked: false, disabled: false },
});
