import { cva } from 'class-variance-authority';
import type { ToastType } from './Toast.types';
import type { IconName } from '../Icon/Icon.types';

/**
 * CAOS Design System — Toast y Snackbar: estilos comunes.
 *
 * Fuentes: component sets Toast (11198:12704) y Snackbar (11844:10443) de Figma, 4 variantes cada uno (Type).
 * - Raíz: 344 de ancho (`w-86`), fila con gap space/general/lg (8) y padding space/container/on-card (24 en
 *   Desktop/Tablet, 16 en Mobile) arriba, abajo e izquierda; a la derecha space/general/5xl (40, 32 en Mobile),
 *   que deja sitio al Button corner de la muesca.
 * - Superficie: `NotchedSurface` con relleno background/container/default-unicolor y trazo
 *   border/general/gray-fifth-unicolor (Toast, muesca de 40 con radius 24) o relleno plano radius/general/2xl (Snackbar).
 *   Todo es unicolor: no cambia con el tema; el contenedor fuerza Dark para el color de los íconos.
 * - Ícono: círculo de 24 (background/general/gray-sixth-unicolor, #45484d) con padding 2 y glifo de 20 relleno
 *   en icon/semantic/*-firts.
 * - Information: columna con gap 4; Subheading Prospero semibold heading/xs (12/16) con padding superior 4;
 *   Description Helvetica Neue regular body/sm line-height-large (12/18). Texto text/neutral/white-unicolor.
 * - Entrada: opacidad y desplazamiento de 8 px solo con `motion-safe` (sin movimiento reducido, aparece de golpe).
 * - Salida (`open={false}`, `data-state="closed"`): `animate-caos-toast-out` (200 ms, 150 ms solo fundido con movimiento reducido).
 */
export const toastVariants = cva(
  [
    'relative isolate box-border flex w-86 max-w-full items-start gap-ds-space-general-lg',
    'pt-ds-space-container-on-card pb-ds-space-container-on-card pl-ds-space-container-on-card pr-ds-space-general-5xl',
    'text-ds-text-neutral-white-unicolor',
    'motion-safe:transition-[opacity,translate] motion-safe:duration-200 motion-safe:ease-out',
    'motion-safe:starting:translate-y-2 motion-safe:starting:opacity-0',
    // Salida: ver `animate-caos-toast-out` en index.css; mientras sale ya no recibe puntero
    'data-[state=closed]:pointer-events-none data-[state=closed]:animate-caos-toast-out',
  ],
  {
    variants: {
      surface: {
        notched:
          '[--surface-fill:var(--color-ds-background-container-default-unicolor)] [--surface-edge:var(--color-ds-border-general-gray-fifth-unicolor)]',
        flat: '',
      },
    },
    defaultVariants: { surface: 'notched' },
  }
);

/** Color del glifo por Type (icon/semantic/*-firts, en Dark). */
export const toastIconVariants = cva('shrink-0', {
  variants: {
    type: {
      success: 'text-ds-icon-semantic-success-firts',
      alert: 'text-ds-icon-semantic-alert-firts',
      error: 'text-ds-icon-semantic-error-firts',
      info: 'text-ds-icon-semantic-information-firts',
    },
  },
  defaultVariants: { type: 'success' },
});

/** Ícono por defecto de cada Type, el de Figma (confirmado por figmaSetId contra el manifest). */
export const TOAST_DEFAULT_ICONS: Record<ToastType, IconName> = {
  success: 'tick-circle',
  alert: 'warning',
  error: 'forbidden-2',
  info: 'info-circle',
};

/** Círculo de 24 detrás del glifo (frame Icon de Figma, padding 2). */
export const toastIconCircleClass =
  'inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-ds-background-general-gray-sixth-unicolor';

export const toastInformationClass = 'flex min-w-0 flex-1 flex-col gap-ds-primitives-space-md';

/** Subheading: Prospero semibold, heading/xs (12/16), padding superior 4. */
export const toastTitleClass = [
  'm-0 pt-ds-space-general-md',
  'font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
  'text-ds-typography-heading-size-xs leading-ds-typography-heading-line-height-xs text-ds-text-neutral-white-unicolor',
].join(' ');

/** Description: Helvetica Neue regular, body/sm con line-height-large (12/18). */
export const toastDescriptionClass = [
  'm-0 font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
  'text-ds-typography-body-size-sm leading-ds-typography-body-line-height-large-sm text-ds-text-neutral-white-unicolor',
].join(' ');

/** Fila de acciones del Snackbar (CTA de Figma): gap/general/xl = 16 (sin token responsive equivalente en tokens.css: se usa space-2xl). */
export const snackbarActionsClass = 'flex flex-wrap items-center gap-ds-primitives-space-2xl';
