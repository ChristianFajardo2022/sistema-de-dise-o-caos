import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — FileUploadItem Variants
 *
 * Fuente: component set "File card" 11557:17694 de la página Card de Figma (State Loading, Complete, Error,
 * Loading error y Alert).
 *
 * - Raíz: columna, padding 16 (space/container/second-level -> space/general/2xl), gap 16 (gap/general/xl ->
 *   space/general/2xl), radius/general/2xl (24), relleno background/container/default-on-card. Ancho fluido (287.6 en Figma);
 *   alto 108 con barra y 70 sin ella.
 * - Fila: grupo (Avatar icon de 32 + textos, gap 8 space/general/lg) y acciones (Button tertiary xs solo ícono, gap 0
 *   gap/general/xs), gap 16.
 * - Nombre: Helvetica regular 14/18 (typography/size/md, field/line-height/sm) text/neutral/heading, una línea.
 * - Estado: Helvetica Neue regular 14/20 (body/md, body/line-height-large/md): success-secondary en Loading y Complete,
 *   error-secondary en Error y Loading error, alert-secondary en Alert.
 * - Ícono del Avatar: folder (blanco) en Loading; tick-circle icon/semantic/success-firts; close-circle error-firts;
 *   warning alert-firts.
 * - Barra: Progress bar Linear text, Success en Loading y Alert en Alert.
 */
export const fileUploadItemVariants = cva(
  'box-border flex w-full flex-col gap-ds-space-general-2xl rounded-ds-radius-general-2xl bg-ds-background-container-default-on-card p-ds-space-general-2xl text-left'
);

export const fileUploadRowClass = 'flex min-w-0 items-center gap-ds-space-general-2xl';
export const fileUploadGroupClass = 'flex min-w-0 flex-1 items-center gap-ds-space-general-lg';
export const fileUploadTextsClass = 'flex min-w-0 flex-1 flex-col justify-center';
export const fileUploadActionsClass = 'flex shrink-0 items-center gap-0';

export const fileUploadNameClass = [
  'm-0 min-w-0 truncate',
  'font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
  'text-ds-primitives-typography-size-md leading-ds-typography-field-line-height-sm text-ds-text-neutral-heading',
].join(' ');

export const fileUploadMessageVariants = cva(
  [
    'm-0 min-w-0',
    'font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
    'text-ds-typography-body-size-md leading-ds-typography-body-line-height-large-md',
  ].join(' '),
  {
    variants: {
      status: {
        loading: 'text-ds-text-semantic-success-secondary',
        complete: 'text-ds-text-semantic-success-secondary',
        error: 'text-ds-text-semantic-error-secondary',
        'loading-error': 'text-ds-text-semantic-error-secondary',
        alert: 'text-ds-text-semantic-alert-secondary',
      },
    },
    defaultVariants: { status: 'loading' },
  }
);

/** Color del ícono del Avatar por estado (sobre el icon/general/white del Avatar). */
export const fileUploadIconColor = {
  loading: '',
  complete: 'text-ds-icon-semantic-success-firts',
  error: 'text-ds-icon-semantic-error-firts',
  'loading-error': 'text-ds-icon-semantic-error-firts',
  alert: 'text-ds-icon-semantic-alert-firts',
} as const;
