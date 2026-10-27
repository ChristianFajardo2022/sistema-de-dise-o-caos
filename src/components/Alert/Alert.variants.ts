import { cva } from 'class-variance-authority';
import type { AlertType } from './Alert.types';
import type { IconName } from '../Icon/Icon.types';

/**
 * CAOS Design System — Alert Variants
 *
 * Fuente: component set "Alerts" de Figma (11521:9733), 8 variantes: Type × Background.
 *
 * - Raíz: fila que ocupa el ancho del contenedor (Figma la muestra a 344), gap 8 (space/lg), esquina radius/general/2xl (24).
 * - Background=True: padding 16 (space/2xl) más el grosor del contorno (Figma incluye el trazo en el layout: 75 de alto) y contorno border/general/md (0.5) por tipo,
 *   dibujado por dentro con box-shadow inset (Chrome redondea border-width). Sin relleno.
 * - Icon: 20×20 (Icon-sizes, relleno) con color icon/semantic/*.
 * - Information: columna con gap 4 (space/md); Subheading Prospero semibold 14/18 (Figma: heading/xs; en tokens.css xs es 12/16, se usa heading/sm que vale 14/18)
 *   (text/neutral/heading) con padding superior 2; Description Helvetica Neue regular body/sm,
 *   line-height-large (text/neutral/gray).
 * - Sin tokens responsive gap/general/md, gap/general/sm ni space/container/second-level en
 *   tokens.css: se usan sus primitivos space-lg, space-md y space-2xl (mismo valor).
 */
export const alertVariants = cva('box-border flex w-full items-start gap-ds-primitives-space-lg rounded-ds-radius-general-2xl', {
  variants: {
    type: {
      success: '',
      alert: '',
      error: '',
      info: '',
    },
    background: {
      true: 'p-[calc(var(--ds-primitives-space-2xl)+var(--ds-responsive-border-general-md))]',
      false: '',
    },
  },
  compoundVariants: [
    { background: true, type: 'success', class: '[box-shadow:inset_0_0_0_var(--ds-responsive-border-general-md)_var(--color-ds-border-semantic-success)]' },
    { background: true, type: 'alert', class: '[box-shadow:inset_0_0_0_var(--ds-responsive-border-general-md)_var(--color-ds-border-semantic-alert)]' },
    { background: true, type: 'error', class: '[box-shadow:inset_0_0_0_var(--ds-responsive-border-general-md)_var(--color-ds-border-semantic-error)]' },
    { background: true, type: 'info', class: '[box-shadow:inset_0_0_0_var(--ds-responsive-border-general-md)_var(--color-ds-border-semantic-information)]' },
  ],
  defaultVariants: { type: 'success', background: true },
});

/** Color del ícono por Type (tokens icon/semantic/*). */
export const alertIconVariants = cva('shrink-0', {
  variants: {
    type: {
      success: 'text-ds-icon-semantic-success-secondary',
      alert: 'text-ds-icon-semantic-alert-secondary',
      error: 'text-ds-icon-semantic-error-secondary',
      info: 'text-ds-icon-semantic-information-secondary',
    },
  },
  defaultVariants: { type: 'success' },
});

/** Ícono por defecto de cada Type, el de Figma. */
export const ALERT_DEFAULT_ICONS: Record<AlertType, IconName> = {
  success: 'tick-circle',
  alert: 'warning',
  error: 'forbidden-2',
  info: 'info-circle',
};

/** Subheading: Prospero semibold, 14/18 (heading/sm = valor de heading/xs en Figma), con padding superior space/sm (2). */
export const alertTitleClass = [
  'm-0 pt-ds-primitives-space-sm',
  'font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
  'text-ds-typography-heading-size-sm leading-ds-typography-heading-line-height-sm text-ds-text-neutral-heading',
].join(' ');

/** Description: Helvetica Neue regular, body/sm con line-height-large. */
export const alertDescriptionClass = [
  'm-0 font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
  'text-ds-typography-body-size-sm leading-ds-typography-body-line-height-large-sm text-ds-text-neutral-gray',
].join(' ');
