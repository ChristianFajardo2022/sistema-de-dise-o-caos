import { cva } from 'class-variance-authority';
import type { IconName } from '../Icon/Icon.types';
import type { AlertModalType } from './Modal.types';

/**
 * CAOS Design System — AlertModal (Simple modal) Variants
 *
 * Fuente: set "Simple modal" de Figma (11946:10227), Type = Info / Error / Alert / Success. Marcos Desktop y Mobile.
 * - Desktop (480, HUG): columna centrada, padding 40 (space/general/5xl), gap 32 (space/general/4xl). Silueta "Canva" /
 *   "Subtract": background/container/default-on-canva, radio 24 (radius/general/2xl) con muesca de 48 arriba a la
 *   derecha para el Button corner md On canva (40, ícono close 16).
 * - Ícono semántico de 56 (dimention/icono/M, 48 en móvil), en línea, color icon/semantic/<tipo>-firts:
 *   Info info-circle (9512:2282) · Error close-circle (9477:24834) · Alert warning (9546:5846) · Success tick-circle (9544:4073).
 * - Info: gap 8 (gap/general/md). Heading: Secondary semibold heading/lg (20/24), text/neutral/heading, centrado.
 *   Description group: gap 4 (space/general/md; 8 en móvil). Descripción 1: Primary semibold body/lg (16/22,
 *   line-height-large). Descripción 2: Primary regular body/md (14/20). Las dos en text/neutral/body, centradas.
 * - CTA: fila centrada con gap 16 (space/general/2xl): Tertiary · Secondary · Primary md.
 * - Mobile (376): hoja inferior con background/container/surface, radios 24 arriba (radius/general/2xl) y 0 abajo,
 *   padding 16 / 20 / 32 / 20 (space/general/2xl, 3xl, 5xl), asa de 48 × 2 (background/general/gray-fifth) en el flujo,
 *   sin Button corner y botones apilados a todo el ancho (Primary · Secondary · Tertiary).
 */

export const ALERT_MODAL_ICONS: Record<AlertModalType, IconName> = {
  info: 'info-circle',
  error: 'close-circle',
  alert: 'warning',
  success: 'tick-circle',
};

/** Raíz (el componente de Figma): transparente, mide lo que el marco. */
export const alertModalPanelVariants = cva('flex w-120 max-w-full min-h-0 flex-col mobile:w-full');

/** Marco "desktop" (y "mobile" en móvil): transparente en escritorio (la silueta va detrás); hoja en móvil. */
export const alertModalFrameClass = [
  'relative isolate box-border flex min-h-0 w-full flex-col items-center',
  'gap-ds-space-general-4xl p-ds-space-general-5xl',
  'font-ds-primitives-typography-family-primary',
  // Superficie para la variable de NotchedSurface
  '[--surface-fill:var(--color-ds-background-container-default-on-canva)]',
  // Móvil: hoja inferior
  'mobile:bg-ds-background-container-surface mobile:pt-ds-space-general-2xl mobile:px-ds-space-general-3xl',
  'mobile:rounded-t-ds-radius-general-2xl mobile:rounded-b-ds-radius-general-xs',
].join(' ');

/** Silueta con muesca: solo en escritorio. */
export const alertModalSurfaceClass = 'mobile:hidden';

/** Asa de la hoja (solo móvil), en el flujo como en Figma. */
export const alertModalHandleClass =
  'hidden h-0.5 w-12 shrink-0 rounded-ds-radius-general-3xl bg-ds-background-general-gray-fifth mobile:block';

export const alertModalIconVariants = cva('size-ds-dimention-icono-m shrink-0', {
  variants: {
    type: {
      info: 'text-ds-icon-semantic-information-firts',
      error: 'text-ds-icon-semantic-error-firts',
      alert: 'text-ds-icon-semantic-alert-firts',
      success: 'text-ds-icon-semantic-success-firts',
    },
  },
  defaultVariants: { type: 'success' },
});

/** Bloque "Info": título y descripciones. Se desplaza si el texto no cabe en el alto disponible. */
export const alertModalInfoClass = 'flex w-full min-h-0 flex-col gap-ds-space-general-lg overflow-y-auto text-center';

export const alertModalTitleClass = [
  'm-0 font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
  'text-ds-typography-heading-size-lg leading-ds-typography-heading-line-height-lg text-ds-text-neutral-heading',
].join(' ');

export const alertModalDescriptionGroupClass = 'flex flex-col gap-ds-space-general-md mobile:gap-ds-space-general-lg';

export const alertModalLeadClass = [
  'm-0 [font-weight:var(--ds-primitives-typography-weight-semibold)]',
  'text-ds-typography-body-size-lg leading-ds-typography-body-line-height-large-lg text-ds-text-neutral-body',
].join(' ');

export const alertModalBodyClass = [
  'm-0 [font-weight:var(--ds-primitives-typography-weight-regular)]',
  'text-ds-typography-body-size-md leading-ds-typography-body-line-height-large-md text-ds-text-neutral-body',
].join(' ');

/** CTA: fila centrada; en móvil, columna a todo el ancho con Primary arriba (orden del DOM: Tertiary, Secondary, Primary). */
export const alertModalActionsClass = [
  'flex w-full shrink-0 flex-wrap items-center justify-center gap-ds-space-general-2xl',
  'mobile:flex-col-reverse mobile:flex-nowrap mobile:items-stretch',
].join(' ');

/** Button corner en la muesca (arriba a la derecha); en móvil no se dibuja. */
export const alertModalCloseClass = 'absolute top-0 right-0 mobile:hidden';
