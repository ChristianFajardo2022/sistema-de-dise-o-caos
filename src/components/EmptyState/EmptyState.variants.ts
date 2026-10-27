import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — EmptyState Variants
 *
 * Fuente: component set "Empty states" 12304:6287 de Figma (Type First Use, No Results, Errors & Issues y No Content).
 *
 * - Raíz: columna centrada, ancho fluido (326 en Figma), gap space/general/3xl (24, 20 en Mobile).
 * - Composición de cuadros (102 × 107.95): cuadro de 80 con contorno border/general/gray-fourth (1) al 70 %, cuadro de 80
 *   con contorno punteado 5/5 (desplazado 22, 27.95) y cuadro de 60 (radius/general/lg 12, background/container/hover-on-canva)
 *   con el ícono de 32 (line, icon/acent/firts) centrado, desplazado 21, 23.97.
 * - Texto: columna centrada, gap 10. Título Prospero semibold heading/md de Figma (20/24, 18/22 en Mobile; en tokens.css
 *   ese par se llama heading/lg) text/neutral/heading; descripción Helvetica Neue regular body/md 14/20 text/neutral/body.
 * - Botones: Desktop y Tablet en fila (gap space/general/2xl 16), secundario a la izquierda; Mobile en columna a ancho completo
 *   con el principal arriba (variables responsive/general/desktop y mobile).
 */
export const emptyStateVariants = cva(
  'box-border flex w-full flex-col items-center justify-center gap-ds-space-general-3xl'
);

/** Grupo de la composición de cuadros (102 × 107.95). */
export const emptyStateArtClass = 'relative h-[107.95px] w-[102px] shrink-0';

const squareBase = 'absolute box-border size-20 rounded-ds-radius-general-2xl opacity-70';

/** Cuadro de contorno sólido (Rectangle 4). */
export const emptyStateSquareSolidClass = `${squareBase} top-0 left-0 border border-solid border-ds-border-general-gray-fourth`;

/** Cuadro de contorno punteado 5/5 (Rectangle 5): el SVG dibuja los guiones porque el borde CSS no admite el patrón. */
export const emptyStateSquareDashedClass = `${squareBase} top-[27.95px] left-[22px] text-ds-border-general-gray-fourth`;

/** Cuadro del ícono (Frame 12). */
export const emptyStateIconBoxClass =
  'absolute top-[23.97px] left-[21px] box-border flex size-[60px] items-center justify-center rounded-ds-radius-general-lg bg-ds-background-container-hover-on-canva text-ds-icon-acent-firts';

export const emptyStateTextsClass = 'flex w-full flex-col items-center justify-center gap-2.5';

export const emptyStateTitleClass = [
  'm-0 w-full text-center',
  'font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
  'text-ds-typography-heading-size-lg leading-ds-typography-heading-line-height-lg text-ds-text-neutral-heading',
].join(' ');

export const emptyStateDescriptionClass = [
  'm-0 w-full text-center',
  'font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
  'text-ds-typography-body-size-md leading-ds-typography-body-line-height-large-md text-ds-text-neutral-body',
].join(' ');

/** Contenedor de botones: el DOM sigue el orden de Figma Desktop (secundario, principal); en Mobile se invierte para dejar el principal arriba. */
export const emptyStateActionsClass =
  'flex w-full flex-row items-center justify-center gap-ds-space-general-2xl mobile:flex-col-reverse';

export const emptyStateButtonClass = 'mobile:w-full';
