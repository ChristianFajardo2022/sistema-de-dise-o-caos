import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Badge Variants
 *
 * Fuente: component set "Badge" de Figma (36 variantes: Type × State).
 *
 * - Simple: marco transparente de 12×12 con una elipse "Badge" de 12×12 dentro (badgeDotVariants).
 * - Icon: 16×16, padding space/general/sm (2), ícono de 12, esquina radius/container/On canva.
 * - Number: alto 16, padding X space/badge/sm (2), texto Helvetica Neue regular 10/14
 *   (typography/body/size/xs y line-height-short/xs) con padding inferior space/text/sm (2).
 * - Icon + number: alto 16, padding X space/general/sm (2), gap space/general/md (4).
 * - State: fondo, color de texto y color de ícono por token; cada tipo usa su propio token de color.
 * - Excepción de Figma: Simple + Negative usa background/general/white-unicolor (no cambia con el tema).
 * - En simple el fondo va en la elipse, no en el marco, así que badgeVariants se llama con state null.
 */
export const badgeVariants = cva(
  'box-border relative inline-flex shrink-0 items-center justify-center align-middle select-none',
  {
    variants: {
      type: {
        simple: 'size-3',
        icon: 'size-4 p-ds-space-general-sm rounded-ds-radius-container-on-canva',
        number: [
          'min-h-4 min-w-4 px-ds-space-badge-sm py-ds-space-badge-xs rounded-ds-radius-container-on-canva',
        ].join(' '),
        'icon-number': [
          'min-h-4 min-w-4 gap-ds-space-general-md px-ds-space-general-sm py-ds-space-general-xs',
          'rounded-ds-radius-container-on-canva',
        ].join(' '),
      },
      state: {
        default: 'bg-ds-background-acent-tertiary text-ds-text-neutral-white-unicolor',
        success: 'bg-ds-background-semantic-success-tertiary text-ds-text-semantic-success',
        alert: 'bg-ds-background-semantic-alert-tertiary text-ds-text-semantic-alert',
        error: 'bg-ds-background-semantic-error-fourth text-ds-text-neutral-white-unicolor',
        info: 'bg-ds-background-semantic-information-tertiary text-ds-text-semantic-information',
        neutral: 'bg-ds-background-general-gray-fifth text-ds-text-neutral-white',
        negative: 'bg-ds-background-general-white text-ds-text-neutral-black',
        positive: 'bg-ds-background-general-black text-ds-text-neutral-white',
        inactive: 'bg-ds-background-general-gray-seventh text-ds-text-neutral-disabled-positive',
      },
    },
    defaultVariants: { type: 'simple', state: 'default' },
  }
);

/** Elipse del tipo simple: fondo por State. Simple + Negative usa white-unicolor, como en Figma. */
export const badgeDotVariants = cva('block size-3 rounded-full', {
  variants: {
    state: {
      default: 'bg-ds-background-acent-tertiary',
      success: 'bg-ds-background-semantic-success-tertiary',
      alert: 'bg-ds-background-semantic-alert-tertiary',
      error: 'bg-ds-background-semantic-error-fourth',
      info: 'bg-ds-background-semantic-information-tertiary',
      neutral: 'bg-ds-background-general-gray-fifth',
      negative: 'bg-ds-background-general-white-unicolor',
      positive: 'bg-ds-background-general-black',
      inactive: 'bg-ds-background-general-gray-seventh',
    },
  },
  defaultVariants: { state: 'default' },
});

/** Color del ícono por State (tokens icon/*). */
export const badgeIconVariants = cva('', {
  variants: {
    state: {
      default: 'text-ds-icon-general-white-unicolor',
      success: 'text-ds-icon-semantic-success-tertiary',
      alert: 'text-ds-icon-semantic-alert-tertiary',
      error: 'text-ds-icon-general-white-unicolor',
      info: 'text-ds-icon-semantic-information-tertiary',
      neutral: 'text-ds-icon-general-white',
      negative: 'text-ds-icon-general-black',
      positive: 'text-ds-icon-general-white',
      inactive: 'text-ds-icon-general-disabled-positive',
    },
  },
  defaultVariants: { state: 'default' },
});

/** Contenedor del texto: 10/14 regular, centrado, padding inferior space/text/sm (Figma "Container"). */
export const badgeTextVariants = cva(
  [
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    '[font-weight:var(--ds-primitives-typography-weight-regular)]',
    'text-ds-typography-body-size-xs leading-ds-typography-body-line-height-short-xs',
    'min-w-3 pb-ds-space-text-sm text-center whitespace-nowrap',
  ].join(' ')
);
