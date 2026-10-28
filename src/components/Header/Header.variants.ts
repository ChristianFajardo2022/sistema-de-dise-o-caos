import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Header Variants
 *
 * Fuente: component sets "Header desktop" (13448:29988, Type = Default | Menu list1..6, 1440×96) y "Header mobile"
 * (13520:81850, Type = Default | Menu list, 376×72) de Figma.
 *
 * Escritorio:
 * - Barra: relleno background/container/surface, padding vertical space/general/3xl (24) y lateral
 *   space/container/canva/lateral (56; token `space-canva-lateral`), gap gap/general/xl (16; 12 en móvil) entre las tres
 *   zonas, todas centradas en una fila de 48.
 * - Izquierda ("Logo+options", ocupa lo que sobra): Logo icon sm (32) + navegación con gap 16. Centro: buscador de 334.
 *   Derecha: campana de 48 y avatar de 48, gap 8.
 * - Submenú: banda de todo el ancho bajo la barra, relleno background/container/surface-opacity (60 %) con el efecto GLASS
 *   de Figma (utilidad `ds-effect-glass` de index.css), padding inferior
 *   24; la lista (280 de ancho, ítems "Dropdown list" de 34) empieza donde empieza el botón que la abrió.
 * Móvil:
 * - Barra: padding 20 (space/general/3xl, token que vale lo mismo que space/container/default), gap 12, fila de 32:
 *   Icon menu (32) + Logo (32), a la derecha campana xs (32) y avatar sm (32), gap 8.
 * - Menú desplegable: hoja de todo el ancho bajo la barra con padding 20, gap 20; buscador de 40 y la lista de enlaces
 *   (34 de alto) separados por divisores (border/divider/md de 0.5 que no ocupa alto, `_internal/Divider`), gap 8.
 */
export const headerVariants = cva('relative box-border block w-full');

export const headerBarVariants = cva('box-border flex w-full items-center bg-ds-background-container-surface', {
  variants: {
    layout: {
      desktop: 'gap-ds-space-general-2xl px-ds-space-canva-lateral py-ds-space-general-3xl max-md:gap-ds-space-general-xl',
      mobile: 'gap-ds-space-general-2xl p-ds-space-general-3xl max-md:gap-ds-space-general-xl',
    },
  },
  defaultVariants: { layout: 'desktop' },
});

/** Zona izquierda: logo + navegación (desktop) o ícono de menú + logo (mobile). */
export const headerStartVariants = cva('flex min-w-0 flex-1 items-center', {
  variants: {
    layout: {
      desktop: 'gap-ds-space-general-2xl max-md:gap-ds-space-general-xl',
      mobile: 'gap-ds-space-general-lg',
    },
  },
  defaultVariants: { layout: 'desktop' },
});

export const headerNavListClass = 'm-0 flex list-none items-center p-0 gap-ds-space-general-2xl max-md:gap-ds-space-general-xl';

/** Buscador de escritorio: 334 de ancho que cede si falta sitio. */
export const headerSearchClass = 'm-0 w-83.5 min-w-40 shrink';

/** Campana, avatar y acciones: gap 8. */
export const headerEndClass = 'flex shrink-0 items-center gap-ds-space-general-lg';

export const headerLogoLinkClass =
  'inline-flex shrink-0 rounded-ds-radius-field-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active';

/** Botón del ícono de menú (móvil): 32, sin marco. */
export const headerMenuButtonClass =
  'm-0 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-ds-radius-field-sm border-0 bg-transparent p-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active';

/** Banda del submenú de escritorio. */
export const headerBandClass =
  'absolute inset-x-0 top-full z-10 box-border pb-ds-space-general-3xl bg-ds-background-container-surface-opacity ds-effect-glass';

export const headerBandListClass = 'm-0 flex w-70 max-w-full list-none flex-col p-0';

/** Hoja del menú móvil: de todo el ancho bajo la barra. */
export const headerSheetClass =
  'absolute inset-x-0 top-full z-10 box-border flex h-[calc(100dvh-100%)] flex-col gap-ds-space-general-3xl overflow-y-auto bg-ds-background-container-surface p-ds-space-general-3xl';

export const headerSheetListClass = 'm-0 flex w-full list-none flex-col gap-ds-space-general-lg p-0';

/**
 * Enlace de submenú (Dropdown list).
 * @deprecated Los enlaces de submenú son `DropdownMenuItem` dentro de `DropdownMenuNavList` (el ítem ya quita el subrayado).
 */
export const headerLinkClass = 'no-underline';
