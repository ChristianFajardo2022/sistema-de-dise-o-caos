import { cva } from 'class-variance-authority';
import type { AlertType } from './Alert.types';
import type { IconName } from '../Icon/Icon.types';

/**
 * CAOS Design System — Alert Variants
 *
 * Fuente: component set "Alerts" de Figma (11521:9733), 8 variantes: Type × Background.
 *
 * - Raíz: fila que ocupa el ancho del contenedor (Figma la muestra a 344), gap 8 (space/lg).
 * - Background=True: radius/general/xl (16), padding space/container/on-card-stretch (16 en Desktop/Tablet, 12 en Mobile) y contorno border/general/sm (0.5) por tipo,
 *   dibujado por dentro con box-shadow inset (Chrome redondea border-width). Sin relleno. Figma suma el trazo al alto (75); aquí el trazo no ocupa layout (74).
 * - Background=False: radius/general/2xl (24), sin padding ni contorno.
 * - Icon: 20×20 (Icon-sizes, relleno) con color icon/semantic/*.
 * - Information: columna con gap 4 (space/md); Subheading Prospero semibold heading/xs (12/16) (text/neutral/heading) con padding superior 4 (space/general/md);
 *   Description Helvetica Neue regular body/sm, line-height-large (text/neutral/body).
 * - Sin tokens responsive gap/general/md ni gap/general/sm en tokens.css: se usan sus primitivos
 *   space-lg y space-md (mismo valor).
 */
export const alertVariants = cva('box-border flex w-full items-start gap-ds-primitives-space-lg', {
  variants: {
    type: {
      success: '',
      alert: '',
      error: '',
      info: '',
    },
    background: {
      true: 'rounded-ds-radius-general-xl p-ds-space-container-on-card-stretch',
      false: 'rounded-ds-radius-general-2xl',
    },
  },
  compoundVariants: [
    { background: true, type: 'success', class: '[box-shadow:inset_0_0_0_var(--ds-responsive-border-general-sm)_var(--color-ds-border-semantic-success)]' },
    { background: true, type: 'alert', class: '[box-shadow:inset_0_0_0_var(--ds-responsive-border-general-sm)_var(--color-ds-border-semantic-alert)]' },
    { background: true, type: 'error', class: '[box-shadow:inset_0_0_0_var(--ds-responsive-border-general-sm)_var(--color-ds-border-semantic-error)]' },
    { background: true, type: 'info', class: '[box-shadow:inset_0_0_0_var(--ds-responsive-border-general-sm)_var(--color-ds-border-semantic-information)]' },
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

/** Subheading: Prospero semibold, heading/xs (12/16), con padding superior space/general/md (4). */
export const alertTitleClass = [
  'm-0 pt-ds-space-general-md',
  'font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
  'text-ds-typography-heading-size-xs leading-ds-typography-heading-line-height-xs text-ds-text-neutral-heading',
].join(' ');

/** Description: Helvetica Neue regular, body/sm con line-height-large. */
export const alertDescriptionClass = [
  'm-0 font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
  'text-ds-typography-body-size-sm leading-ds-typography-body-line-height-large-sm text-ds-text-neutral-body',
].join(' ');
