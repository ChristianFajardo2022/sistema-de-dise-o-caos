import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Footer Variants
 *
 * Fuente: component set "Footer" de Figma (13408:32915), Type=Portals y Type=Web. Cada variante trae un marco
 * Desktop y uno Mobile (se alterna con responsive/general/*); aquí es un solo DOM que sigue el ancho del propio
 * `<footer>` (container query, `@container` en el `<footer>`), no el de la ventana: composición de escritorio desde
 * 64rem de ancho del footer, la móvil por debajo. Figma no tiene marco Tablet; 64rem es donde tokens.css pasa al modo
 * Desktop y donde caben las cinco columnas de Web con los sellos sin montarse (decisión de código, no de Figma).
 *
 * - Marco: fondo background/container/surface; padding vertical 32 (space/container/on-canva) y lateral 56 (space/general/6xl); móvil 32 en los cuatro lados,
 *   gap 24 entre contenedor y barra inferior (móvil 32 / 24 según el marco).
 * - Contenedor: fila, gap 16 (space/general/2xl). Portals: space-between con columnas a su contenido (marca 300 fijo);
 *   Web: columnas flex-1 (231.2 a 1328) y botón al final; sellos absolutos abajo a la derecha.
 * - Grupo: columna gap 16; título Helvetica Neue Semibold 16/20 (size/lg, line-height-short/lg); filas gap 8.
 *   Fila: viñeta de 8 px (Ellipse, background/general/gray-fifth) en marco de 8×12 con padding superior 4, gap 8,
 *   texto 14/18 (size/md, line-height-short/md) en text/neutral/white; rótulo en medium; rótulo+valor con gap 4.
 * - Divider: trazo 0.5 (border/general/md) en border/general/default-on-card, dibujado con borde superior de la barra inferior.
 * - Barra inferior: Portals, copyright a la izquierda y nota legal a la derecha (en Mobile, los dos centrados); Web, marca 32 +
 *   copyright (gap 8) y redes a la derecha.
 * - Tokens sin equivalente en tokens.css: gap/general/xl (16, móvil 12) no existe como utilidad; se usa
 *   space-general-2xl y en móvil space-general-xl (para diseño).
 * - Foco con teclado: outline de 2px (no está en Figma).
 */
const text = [
  '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
  'text-ds-primitives-typography-size-md leading-ds-typography-body-line-height-short-md',
  'text-ds-text-neutral-white',
].join(' ');

export const footerRootVariants = cva(
  [
    'box-border flex w-full flex-col bg-ds-background-container-surface',
    'gap-ds-space-general-3xl px-ds-space-general-6xl py-ds-space-container-on-canva',
    '@max-5xl:gap-ds-space-general-4xl @max-5xl:p-ds-space-container-on-canva',
    text,
  ].join(' ')
);

/**
 * Contenedor en rejilla de una sola celda: en escritorio las columnas y los sellos comparten la celda (los sellos van
 * abajo a la derecha, como en Figma, sin posición absoluta); en la composición compacta los sellos pasan a una segunda fila.
 */
export const footerContainerVariants = cva('grid grid-cols-1 gap-ds-primitives-space-5xl @5xl:gap-0');

/** Columnas del pie (marca, grupos de enlaces y acción). */
export const footerContentVariants = cva(
  'col-start-1 row-start-1 flex flex-col gap-ds-primitives-space-5xl @5xl:flex-row @5xl:gap-ds-space-general-2xl',
  {
    variants: {
      type: { portals: '@5xl:justify-between', web: '@5xl:justify-start' },
    },
    defaultVariants: { type: 'portals' },
  }
);

/** Sellos (Logos gov): fila 2 en móvil; en escritorio, en la celda de las columnas, abajo a la derecha. */
export const footerBadgesClass =
  'col-start-1 row-start-2 flex flex-wrap items-center gap-ds-primitives-space-5xl @5xl:row-start-1 @5xl:flex-nowrap @5xl:items-center @5xl:justify-center @5xl:self-end @5xl:justify-self-end';

export const footerColumnVariants = cva('flex min-w-0 flex-col gap-ds-space-general-2xl @max-5xl:gap-ds-space-general-xl', {
  variants: {
    type: { portals: '', web: '@5xl:flex-1' },
  },
  defaultVariants: { type: 'portals' },
});

export const footerBrandClass =
  'flex w-full flex-col gap-ds-space-general-3xl @5xl:w-75 @5xl:shrink-0';
export const footerTitleClass =
  'm-0 [font-weight:var(--ds-primitives-typography-weight-semibold)] text-ds-primitives-typography-size-lg leading-ds-typography-body-line-height-short-lg';
export const footerListClass = 'm-0 flex list-none flex-col gap-ds-space-general-lg p-0';
export const footerItemClass = 'm-0 flex flex-col gap-ds-space-general-md p-0';
export const footerRowClass = 'flex items-start gap-ds-space-general-lg';
export const footerBulletBoxClass = 'flex h-3 w-2 shrink-0 pt-ds-space-general-md';
export const footerBulletClass = 'size-2 rounded-full bg-ds-background-general-gray-fifth';
export const footerLabelClass = 'font-medium';
export const footerLinkClass = [
  'rounded-sm no-underline outline-none',
  'hover:underline',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
].join(' ');
export const footerBottomClass =
  // Divider de 0.5: sombra interior (no suma alto ni se redondea como un borde)
  'flex pt-ds-space-general-3xl shadow-[inset_0_0.5px_0_0_var(--color-ds-border-general-default-on-card)]';
