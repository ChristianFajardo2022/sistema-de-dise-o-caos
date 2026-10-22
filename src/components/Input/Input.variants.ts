import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Input Variants
 *
 * Fuente: component set "General input" de Figma (Type: Text, Password, Search y Search header).
 *
 * - Campo: alto dimention/field/Input/default (56, mobile 48), padding 8/12, gap 8,
 *   borde de 1px por dentro y radio field/md (16). Search header: alto 48 y radio field/sm (12).
 * - Label flotante: vacío y sin foco va dentro en 14/18; con foco o valor sube a 12/16
 *   y el valor (14/18) queda debajo, separado 4. Se resuelve en CSS con `placeholder-shown`.
 * - Los colores salen de variables locales (--lbl-*, --ico, --val) que fija cada estado.
 */

/** Contenedor del campo (el recuadro con borde). */
export const inputFieldVariants = cva(
  [
    'relative flex w-full min-w-0 items-center gap-ds-space-general-lg',
    'px-ds-space-field-md py-ds-space-field-sm border border-solid',
    'transition-colors duration-150',
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    '[font-weight:var(--ds-primitives-typography-weight-regular)]',
  ].join(' '),
  {
    variants: {
      variant: {
        text: 'h-ds-dimention-field-input-default rounded-ds-radius-field-md',
        password: 'h-ds-dimention-field-input-default rounded-ds-radius-field-md',
        search: 'h-ds-dimention-field-input-default rounded-ds-radius-field-md',
        'search-header': 'h-[48px] rounded-ds-radius-field-sm',
      },
      state: {
        default: [
          'border-ds-border-field-default focus-within:border-ds-border-field-active',
          '[--lbl-in:var(--color-ds-text-field-label)] [--lbl-up:var(--color-ds-text-field-label-secondary)]',
          '[--val:var(--color-ds-text-field-placeholder)] [--ico:var(--color-ds-icon-general-white)]',
        ],
        filled: [
          'border-ds-border-field-default focus-within:border-ds-border-field-active',
          '[--lbl-in:var(--color-ds-text-field-label)] [--lbl-up:var(--color-ds-text-field-label-secondary)]',
          '[--val:var(--color-ds-text-field-placeholder)] [--ico:var(--color-ds-icon-general-white)]',
        ],
        active: [
          'border-ds-border-field-active',
          '[--lbl-in:var(--color-ds-text-field-label)] [--lbl-up:var(--color-ds-text-field-label-secondary)]',
          '[--val:var(--color-ds-text-field-placeholder)] [--ico:var(--color-ds-icon-general-white)]',
        ],
        'burnt-in': [
          'border-ds-border-field-default bg-ds-background-field-burnt-in',
          '[--lbl-in:var(--color-ds-text-field-label)] [--lbl-up:var(--color-ds-text-field-label-secondary)]',
          '[--val:var(--color-ds-text-field-disabled-negative)] [--ico:var(--color-ds-icon-general-disabled-positive)]',
        ],
        disabled: [
          'cursor-not-allowed border-ds-border-field-disabled',
          '[--lbl-in:var(--color-ds-text-field-disabled-negative)] [--lbl-up:var(--color-ds-text-field-disabled-negative)]',
          '[--val:var(--color-ds-text-field-disabled-negative)] [--ico:var(--color-ds-icon-general-disabled-positive)]',
        ],
        error: [
          'border-ds-border-semantic-error',
          '[--lbl-in:var(--color-ds-text-field-label)] [--lbl-up:var(--color-ds-text-semantic-error-secondary)]',
          '[--val:var(--color-ds-text-field-placeholder)] [--ico:var(--color-ds-icon-general-white)]',
        ],
        success: [
          'border-ds-border-semantic-success',
          '[--lbl-in:var(--color-ds-text-field-label)] [--lbl-up:var(--color-ds-text-semantic-success-secondary)]',
          '[--val:var(--color-ds-text-field-placeholder)] [--ico:var(--color-ds-icon-general-white)]',
        ],
      },
    },
    defaultVariants: { variant: 'text', state: 'default' },
  }
);

/**
 * Label flotante. `float`:
 * - auto: sube con foco o valor (peer = el <input> hermano anterior).
 * - always: siempre arriba (estados active, filled y burnt-in forzados).
 */
export const inputLabelVariants = cva(
  [
    'pointer-events-none absolute left-0 right-0 truncate whitespace-nowrap',
    'transition-[top,font-size,line-height] duration-150 ease-out motion-reduce:transition-none',
    // Flotando: 12/16 arriba (stack de 16 + 4 + 18 centrado en 40)
    'top-[1px] text-ds-typography-field-size-xs leading-(--ds-responsive-typography-field-line-height-xs)',
    'text-(color:--lbl-up)',
  ].join(' '),
  {
    variants: {
      float: {
        // Vacío y sin foco: dentro del campo en 14/18, centrado
        auto: [
          'peer-[:placeholder-shown:not(:focus)]:top-[11px]',
          'peer-[:placeholder-shown:not(:focus)]:text-ds-typography-field-size-sm',
          'peer-[:placeholder-shown:not(:focus)]:leading-(--ds-responsive-typography-field-line-height-sm)',
          'peer-[:placeholder-shown:not(:focus)]:text-(color:--lbl-in)',
          // Autocompletado del navegador: el label sube como si hubiera valor
          'peer-autofill:top-[1px] peer-autofill:text-ds-typography-field-size-xs',
          'peer-autofill:leading-(--ds-responsive-typography-field-line-height-xs) peer-autofill:text-(color:--lbl-up)',
        ].join(' '),
        always: '',
      },
    },
    defaultVariants: { float: 'auto' },
  }
);

/** El <input> real, superpuesto al label. */
export const inputControlVariants = cva(
  [
    'peer absolute inset-0 h-[40px] w-full min-w-0 appearance-none border-0 bg-transparent p-0 outline-none',
    'pt-[21px] pb-[1px] text-ds-typography-field-size-sm leading-(--ds-responsive-typography-field-line-height-sm)',
    'text-(color:--val) [font-family:inherit] [font-weight:inherit]',
    'disabled:cursor-not-allowed',
    // El placeholder del consumidor solo se ve con foco (vacío); el " " interno nunca se ve
    'placeholder:text-(color:--ph) [--ph:transparent] focus:[--ph:var(--val)]',
    // Quita la "x" nativa del type=search
    '[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',
  ].join(' '),
  {
    variants: {
      showPlaceholder: {
        // Estados forzados de documentación: el placeholder se ve siempre
        true: '[--ph:var(--val)]',
        false: '',
      },
    },
    defaultVariants: { showPlaceholder: false },
  }
);

/** Fila de mensaje debajo del campo: ícono de 14 + texto 14/18. */
export const inputMessageVariants = cva(
  [
    'mt-ds-space-general-lg flex items-center gap-ds-space-general-lg',
    'text-ds-typography-field-size-sm leading-(--ds-responsive-typography-field-line-height-sm)',
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    '[font-weight:var(--ds-primitives-typography-weight-regular)]',
  ].join(' '),
  {
    variants: {
      kind: {
        error: 'text-ds-text-semantic-error-secondary [--msg-ico:var(--color-ds-icon-semantic-error-firts)]',
        success: 'text-ds-text-semantic-success-secondary [--msg-ico:var(--color-ds-icon-semantic-success-secondary)]',
        helper: 'text-ds-text-semantic-information-secondary [--msg-ico:var(--color-ds-icon-semantic-information-neutral)]',
      },
    },
    defaultVariants: { kind: 'helper' },
  }
);
