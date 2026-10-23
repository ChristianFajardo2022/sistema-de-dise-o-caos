import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — NotificationText Variants
 *
 * Fuente: component set "Notification text" de Figma (7851:2638), State = Error · Helper text · Confirmation · Information.
 *
 * - Fila horizontal, alto según el texto (18), gap gap/field/lg (alias de space/lg = 8; tokens.css no lo publica, se usa space/general/lg), ancho 100 % del contenedor.
 * - Ícono de 14 (Icon-sizes 14, relleno) + texto Helvetica Neue regular, typography/field/size/sm (14) y line-height/sm (18).
 * - Colores por state (texto · ícono):
 *   error text/semantic/error-secondary · icon/semantic/error-firts,
 *   helper text/semantic/information-secondary · icon/semantic/information-neutral,
 *   confirmation text/semantic/success-secondary · icon/semantic/success-secondary,
 *   information text/neutral/white · icon/general/white.
 * - El color del ícono sale de la variable local --msg-ico.
 */
export const notificationTextVariants = cva(
  [
    'flex w-full items-center gap-ds-space-general-lg',
    'text-ds-typography-field-size-sm leading-(--ds-responsive-typography-field-line-height-sm)',
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    '[font-weight:var(--ds-primitives-typography-weight-regular)]',
  ].join(' '),
  {
    variants: {
      state: {
        error: 'text-ds-text-semantic-error-secondary [--msg-ico:var(--color-ds-icon-semantic-error-firts)]',
        helper: 'text-ds-text-semantic-information-secondary [--msg-ico:var(--color-ds-icon-semantic-information-neutral)]',
        confirmation: 'text-ds-text-semantic-success-secondary [--msg-ico:var(--color-ds-icon-semantic-success-secondary)]',
        information: 'text-ds-text-neutral-white [--msg-ico:var(--color-ds-icon-general-white)]',
      },
    },
    defaultVariants: { state: 'helper' },
  }
);
