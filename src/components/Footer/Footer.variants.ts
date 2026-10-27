import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Footer Variants
 *
 * Fuente: component set "Footer" de Figma (13408:32915), Type=Portals y Type=Web. Cada variante trae un marco
 * Desktop y uno Mobile (se alterna con responsive/general/*); aquí es un solo DOM responsivo (corte 48rem).
 *
 * - Marco: fondo background/container/surface; padding vertical 32 (space/container/on-canva) y lateral 56 (space/general/6xl); móvil 32 en los cuatro lados,
 *   gap 24 entre contenedor y barra inferior (móvil 32 / 24 según el marco).
 * - Contenedor: fila, gap 16 (space/general/2xl). Portals: space-between con columnas a su contenido (marca 300 fijo);
 *   Web: columnas flex-1 (231.2 a 1328) y botón al final; sellos absolutos abajo a la derecha.
 * - Grupo: columna gap 16; título Helvetica Neue Semibold 16/20 (size/lg, line-height-short/lg); filas gap 8.
 *   Fila: viñeta de 8 px (Ellipse, background/general/gray-fifth) en marco de 8×12 con padding superior 4, gap 8,
 *   texto 14/18 (size/md, line-height-short/md) en text/neutral/white; rótulo en medium; rótulo+valor con gap 4.
 * - Divider: trazo 0.5 (border/general/md) en border/general/default-on-card, dibujado con borde superior de la barra inferior.
 * - Barra inferior: Portals, copyright a la izquierda y nota legal a la derecha; Web, marca 32 + copyright (gap 8) y redes a la derecha.
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
    'max-md:gap-ds-space-general-4xl max-md:p-ds-space-container-on-canva',
    text,
  ].join(' ')
);

export const footerContainerVariants = cva(
  'relative flex flex-col gap-ds-primitives-space-5xl md:flex-row md:gap-ds-space-general-2xl',
  {
    variants: {
      type: { portals: 'md:justify-between', web: 'md:justify-start' },
    },
    defaultVariants: { type: 'portals' },
  }
);

export const footerColumnVariants = cva('flex min-w-0 flex-col gap-ds-space-general-2xl max-md:gap-ds-space-general-xl', {
  variants: {
    type: { portals: '', web: 'md:flex-1' },
  },
  defaultVariants: { type: 'portals' },
});

export const footerBrandClass =
  'flex w-full flex-col gap-ds-space-general-3xl md:w-75 md:shrink-0';
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
