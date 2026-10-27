import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — SignaturePad Variants
 *
 * Fuente: component set "Firm" (17805:32039) de Figma. Position Horizontal / Vertical × Propiedad 1 Default / Filled
 * (Filled = hay firma dibujada; en el código sale del valor, no es una prop).
 *
 * Horizontal (1102 × 178): tarjeta background/container/default-on-card, radius/general/xl (16), trazo de 1 border/general/default-on-canva
 * por dentro (box-shadow inset: Chrome redondea border-width), padding space/general/2xl (16) arriba y abajo y
 * space/general/xl (12) a los lados, gap 10. Filas de 24 con los íconos al final: arriba "maximize" (oculto por defecto),
 * abajo "rotate-left" y "trash" (24; blancos icon/general/white con firma, y grises sin ella: Figma usa
 * background/container/disabled-on-card, #7e8187 en Dark y #f0f2f4 en Light; aquí text/neutral/disabled-positive, el mismo gris en Dark y legible en Light). Texto guía 16/22 (typography/body size lg, line-height-large lg) en
 * text/neutral/disabled-positive, centrado en una franja de 76.
 *
 * Vertical (376 × 812): la interfaz horizontal girada −90° dentro de una pantalla de celular, sin relleno; padding
 * space/container/default (24; no existe en tokens.css, se usa `p-6`) y space/general/5xl (40) a la izquierda, gap 10. Cuatro columnas de izquierda a derecha:
 * íconos (24), firma (174), línea con "close" (28; línea de 1 en border/general/default-on-card) y CTA (56: bloque nombre/documento
 * 16/20 en text/neutral/white y los botones Cancelar y Crear firma, gap space/general/xl (12)). Las columnas giradas miden
 * con container query units (cqh/cqw) para ocupar su largo real.
 *
 * Trazo: color icon/general/white (el tema), 2.5 px por defecto, extremos y uniones redondeados.
 * Foco: no existe en Figma; outline de 2px border/field/active (WCAG 2.4.7). Disabled: no existe en Figma; opacidad.
 */
export const signaturePadRootVariants = cva(
  'relative box-border flex select-none',
  {
    variants: {
      orientation: {
        horizontal: [
          'h-44.5 w-full flex-col justify-end gap-2.5 overflow-hidden rounded-ds-radius-general-xl',
          'bg-ds-background-container-default-on-card px-ds-space-general-xl py-ds-space-general-2xl',
          // Trazo de 1 px por dentro (el lienzo es transparente y lo deja ver)
          'shadow-[inset_0_0_0_1px_var(--color-ds-border-general-default-on-canva)]',
        ].join(' '),
        vertical: [
          'h-203 w-94 max-w-full flex-row gap-2.5',
          'py-6 pr-6 pl-ds-space-general-5xl',
        ].join(' '),
      },
      disabled: { true: 'opacity-50', false: '' },
    },
    defaultVariants: { orientation: 'horizontal', disabled: false },
  }
);

/** Lienzo: ocupa toda el área de dibujo; `touch-action: none` evita que el dedo desplace la página al firmar. */
export const signaturePadCanvasVariants = cva(
  'absolute inset-0 size-full touch-none text-ds-icon-general-white',
  {
    variants: {
      orientation: { horizontal: 'rounded-[inherit]', vertical: '' },
      disabled: { true: 'cursor-not-allowed', false: 'cursor-crosshair' },
    },
    defaultVariants: { orientation: 'horizontal', disabled: false },
  }
);

/** Texto guía "Dibuja tu firma aquí": 16/22, text/neutral/disabled-positive, centrado, sin capturar el puntero. */
export const signaturePadPlaceholderVariants = cva(
  [
    'pointer-events-none flex items-center justify-center text-center',
    'font-ds-primitives-typography-family-primary text-ds-typography-body-size-lg leading-ds-typography-body-line-height-large-lg',
    'text-ds-text-neutral-disabled-positive',
  ].join(' '),
  {
    variants: {
      orientation: { horizontal: 'relative h-19 w-full', vertical: 'absolute inset-0' },
    },
    defaultVariants: { orientation: 'horizontal' },
  }
);

/** Botón de ícono desnudo de 24 (deshacer, borrar, maximizar, cerrar), con foco visible. */
export const signaturePadIconButtonVariants = cva(
  [
    'pointer-events-auto inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-ds-radius-general-xs border-0 bg-transparent p-0',
    'text-ds-icon-general-white',
    'outline-offset-2 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
    "relative before:absolute before:-inset-2 before:content-['']", // área táctil de 40 px (WCAG 2.5.8)
    // Sin firma (o deshabilitado) los íconos de acción se apagan, como en Figma Default
    'aria-disabled:cursor-default aria-disabled:text-ds-text-neutral-disabled-positive',
  ].join(' ')
);

/** Fila de 24 de alto con los íconos al final (Frame 1984080548 / 1984080547). */
export const signaturePadRowVariants = cva('pointer-events-none flex h-6 w-full shrink-0 items-center justify-end gap-2.5');

/** Texto de nombre y documento del firmante: 16/20 en text/neutral/white. */
export const signaturePadSignerVariants = cva(
  'min-w-0 truncate font-ds-primitives-typography-family-primary text-ds-typography-body-size-lg leading-ds-typography-body-line-height-short-lg text-ds-text-neutral-white'
);
