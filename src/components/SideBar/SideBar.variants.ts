import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — SideBar Variants
 *
 * Fuente: página "Side bar" de Figma, sets "Hamburguer menu (Atom)" (13328:3609, el ítem), "Menu desktop" (13328:3630,
 * Type = Default contraída | Select expandida) y "Menu mobile" (13738:92956, Type = Default | Menu list).
 *
 * Ítem ("Hamburguer menu"):
 * - Fila de 44: padding space/general/xl (12), gap 12, radio radius/general/md (8), ícono de 20 y texto 16/20
 *   (typography/field/size/md, line-height/md, peso Regular).
 * - Default: sin relleno, ícono icon/general/gray-high-contrast, texto text/neutral/body.
 * - Hover: background/field/hover, ícono icon/general/default, texto text/neutral/white.
 * - Select: background/field/active-slow-contrast, ícono icon/acent/firts y texto text/acent/firts. En Dropdown y
 *   Single icon, barra "Select" de 4×44 a la izquierda (background/acent/tertiary, radio radius/general/sm a la
 *   izquierda); Single icon pasa a radio 4/8/8/4. With text no la dibuja.
 * - Dropdown: chevron-down de 20 a la derecha; con la lista abierta, gap 8 (space/general/lg) y "List items" con
 *   padding 12/12/12/32 (space/general/xl, 4xl a la izquierda), gap 8, filas "Dropdown list" de 34 y divisor de 0.5
 *   (border/general/default-on-card) tras cada fila.
 * - Badge Number (State Default) tras el texto; en Single icon (Figma no lo dibuja) va en la esquina del ícono.
 * Escritorio ("Menu desktop"):
 * - Relleno background/container/default-on-canva, sombra effect/shadow-on-canva-md (0 12 32 -2), alto completo.
 * - Contraída 63 de ancho, expandida 298. Logo: marco de 80 con padding space/general/2xl (16), Logo md (icon / logo).
 * - Opciones: padding vertical 16, gap 8; expandida padding 16 izquierda y 8 derecha (space/general/2xl, lg).
 * - Pie: padding 24/16 sin variables, gap 10, botones Button Secondary Low xs solo ícono; centrados contraída y a la
 *   derecha expandida.
 * Móvil ("Menu mobile"):
 * - Barra de 72: relleno default-on-canva, padding space/container/on-canva (20 en Mobile), gap 12; Icon menu (32) +
 *   Logo icon sm (32), gap 8; a la derecha campana y avatar (32), gap 8.
 * - Menú abierto: hoja de todo el ancho bajo la barra, relleno default-on-canva con efecto GLASS (`ds-effect-glass`),
 *   padding space/container/on-card (16 en Mobile), gap 20; ítems With text a todo el ancho, gap 8.
 * - Foco con teclado: no existe en Figma; outline de 2px con el token de borde activo (WCAG 2.4.7).
 */

const focusRing =
  'outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active';
/** Anillo por fuera, para controles sin relleno propio (logo, botón de menú). */
const focusRingOutside =
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active';

/** Raíz del ítem (`<li>`): fila y, debajo, la lista del submenú. */
export const sideBarItemVariants = cva('relative m-0 flex list-none flex-col p-0', {
  variants: {
    type: {
      'with-text': 'w-full',
      dropdown: 'w-full',
      'single-icon': 'w-fit',
    },
  },
  defaultVariants: { type: 'with-text' },
});

/** Gap de 8 entre la fila y la lista, solo con la lista abierta (cerrada, el ítem es la fila sola). */
export const sideBarItemOpenClass = 'gap-ds-space-general-lg';

/** Fila del ítem (`<a>` o `<button>`). */
export const sideBarItemRowVariants = cva(
  [
    'group/sidebar-row relative m-0 box-border flex min-w-0 cursor-pointer items-center border-0 text-left no-underline',
    'p-ds-space-general-xl rounded-ds-radius-general-md',
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    '[font-weight:var(--ds-primitives-typography-weight-regular)]',
    'text-ds-typography-field-size-md leading-ds-typography-field-line-height-md',
    focusRing,
  ].join(' '),
  {
    variants: {
      type: {
        'with-text': 'w-full gap-ds-space-general-xl',
        dropdown: 'w-full gap-ds-space-general-xl',
        'single-icon': 'size-11 shrink-0 justify-center gap-ds-space-general-lg',
      },
      state: {
        default: [
          'bg-transparent text-ds-text-neutral-body [--sidebar-icon:var(--color-ds-icon-general-gray-high-contrast)]',
          'hover:bg-ds-background-field-hover hover:text-ds-text-neutral-white hover:[--sidebar-icon:var(--color-ds-icon-general-default)]',
        ].join(' '),
        hover: 'bg-ds-background-field-hover text-ds-text-neutral-white [--sidebar-icon:var(--color-ds-icon-general-default)]',
        select: 'bg-ds-background-field-active-slow-contrast text-ds-text-acent-firts [--sidebar-icon:var(--color-ds-icon-acent-firts)]',
      },
    },
    compoundVariants: [
      // Single icon seleccionado: esquinas izquierdas de 4 junto a la barra
      { type: 'single-icon', state: 'select', class: 'rounded-l-ds-radius-general-sm' },
    ],
    defaultVariants: { type: 'with-text', state: 'default' },
  }
);

/** Ícono de la fila: toma el color del estado de la fila. */
export const sideBarItemIconClass = 'shrink-0 text-(--sidebar-icon)';

/** Texto de la fila. */
export const sideBarItemLabelClass = 'min-w-0 flex-1 truncate select-none';

/** Barra "Select" de 4 a la izquierda (Dropdown y Single icon seleccionados). */
export const sideBarItemSelectBarClass =
  'pointer-events-none absolute inset-y-0 left-0 w-1 rounded-l-ds-radius-general-sm bg-ds-background-acent-tertiary';

/** Badge en Single icon: sobre la esquina superior derecha del ícono. */
export const sideBarItemCornerBadgeClass = 'pointer-events-none absolute top-1 right-1';

/** Lista del submenú ("List items"). */
export const sideBarSubmenuClass = [
  'm-0 box-border flex w-full list-none flex-col gap-ds-space-general-lg',
  'pt-ds-space-general-xl pr-ds-space-general-xl pb-ds-space-general-xl pl-ds-space-general-4xl',
].join(' ');

/** Subenlace: fila del Dropdown list y su divisor. */
export const sideBarSubItemClass = 'm-0 flex list-none flex-col gap-ds-space-general-lg p-0';

/**
 * Divisor de 0.5 bajo cada subenlace (border/divider/md de Figma no está en tokens.css: stroke dm de 0.5). Como en
 * Figma, la línea no ocupa alto: la caja mide 0 y la raya es un pseudo-elemento centrado en ella.
 */
export const sideBarDividerClass = [
  'relative block h-0 w-full shrink-0',
  'before:absolute before:inset-x-0 before:top-0 before:h-(--ds-primitives-stroke-dm) before:-translate-y-1/2',
  "before:bg-ds-border-general-default-on-card before:content-['']",
].join(' ');

// ───────────────────────── escritorio ─────────────────────────

export const sideBarDesktopVariants = cva(
  [
    'box-border flex h-full max-h-full shrink-0 flex-col overflow-hidden',
    'bg-ds-background-container-default-on-canva shadow-[0_12px_32px_-2px_var(--color-ds-responsive-effect-shadow-on-canva-md)]',
    'motion-safe:transition-[width] motion-safe:duration-200 motion-safe:ease-out',
  ].join(' '),
  {
    variants: {
      collapsed: {
        // 63 y 298 de Figma (sin token de dimensión)
        true: 'w-15.75',
        false: 'w-74.5',
      },
    },
    defaultVariants: { collapsed: false },
  }
);

export const sideBarLogoVariants = cva('box-border flex h-20 shrink-0 items-center p-ds-space-general-2xl', {
  variants: { collapsed: { true: 'justify-center', false: 'justify-start' } },
  defaultVariants: { collapsed: false },
});

export const sideBarLogoLinkClass = `inline-flex shrink-0 rounded-ds-radius-field-sm ${focusRingOutside}`;

export const sideBarOptionsVariants = cva('box-border flex min-h-0 w-full flex-1 flex-col py-ds-space-general-2xl', {
  variants: {
    collapsed: {
      true: 'items-center px-0',
      false: 'pl-ds-space-general-2xl pr-ds-space-general-lg',
    },
  },
  defaultVariants: { collapsed: false },
});

export const sideBarListVariants = cva('m-0 flex list-none flex-col gap-ds-space-general-lg p-0', {
  variants: { collapsed: { true: 'items-center', false: 'w-full' } },
  defaultVariants: { collapsed: false },
});

/** Pie (sin variables en Figma: 24 / 16 de los primitivos, gap 10). */
export const sideBarFooterVariants = cva(
  'box-border flex w-full shrink-0 flex-col gap-2.5 px-ds-primitives-space-2xl py-ds-primitives-space-4xl',
  {
    variants: { collapsed: { true: 'items-center', false: 'items-end' } },
    defaultVariants: { collapsed: false },
  }
);

// ───────────────────────── móvil ─────────────────────────

export const sideBarMobileClass = 'relative box-border block w-full';

export const sideBarMobileBarClass =
  'box-border flex w-full items-center gap-ds-space-general-xl bg-ds-background-container-default-on-canva p-ds-space-container-on-canva';

export const sideBarMobileStartClass = 'flex min-w-0 flex-1 items-center gap-ds-space-general-lg';

export const sideBarMobileEndClass = 'flex shrink-0 items-center gap-ds-space-general-lg';

/** Botón del ícono de menú: 32, sin marco. */
export const sideBarMenuButtonClass = `m-0 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-ds-radius-field-sm border-0 bg-transparent p-0 text-ds-icon-general-default ${focusRingOutside}`;

/** Hoja del menú abierto: de todo el ancho bajo la barra hasta el final de la pantalla. */
export const sideBarSheetClass = [
  'absolute inset-x-0 top-full z-10 box-border flex h-[calc(100dvh-100%)] flex-col gap-ds-space-general-3xl',
  'bg-ds-background-container-default-on-canva ds-effect-glass p-ds-space-container-on-card',
].join(' ');
