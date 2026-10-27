import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — InlineField Variants
 *
 * Fuente: component set "Text field 2" de Figma (id 18445:46293): Type (Label | Label+Placeholder) ×
 * State (Default, Active/Filled, Success, Success placeholder, Error) × Size (sm | md) × Inactive (Off | On | O).
 *
 * - Campo en línea, sin borde ni fondo. Alto 40 (sm) o 56 (md). Label 12/16 arriba, 4 de separación y el texto
 *   debajo: 14/18 en sm y 32/36 (field size 3xl) en md. Vacío y sin foco, el label va dentro (14/18).
 * - Chip a la derecha: radius general/full, fondo background/general/gray-seventh, texto 12/16;
 *   padding 0/8 en sm y 4/8 en md. Alineado abajo; gap 4 (sm) u 8 (md).
 * - Colores por variables locales que fija cada estado: --lbl-in, --lbl-up, --val, --opt, --chip-bg, --chip-fg.
 */

/** Fila del campo: control + chip. */
export const inlineFieldRowVariants = cva(
  [
    'relative flex w-full min-w-0 items-end rounded-ds-radius-field-sm',
    'focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-solid focus-within:outline-ds-border-field-active',
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    '[font-weight:var(--ds-primitives-typography-weight-regular)]',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'h-10 gap-ds-space-general-md',
        md: 'h-14 gap-ds-space-general-lg',
      },
      state: {
        default: [
          '[--lbl-in:var(--color-ds-text-field-label)] [--lbl-up:var(--color-ds-text-field-label-secondary)]',
          '[--val:var(--color-ds-text-field-placeholder)] [--opt:var(--color-ds-text-acent-firts)]',
          '[--chip-bg:var(--color-ds-background-general-gray-seventh)] [--chip-fg:var(--color-ds-text-field-placeholder)]',
        ],
        active: [
          '[--lbl-in:var(--color-ds-text-field-label)] [--lbl-up:var(--color-ds-text-field-label-secondary)]',
          '[--val:var(--color-ds-text-field-placeholder)] [--opt:var(--color-ds-text-acent-firts)]',
          '[--chip-bg:var(--color-ds-background-general-gray-seventh)] [--chip-fg:var(--color-ds-text-field-placeholder)]',
        ],
        success: [
          '[--lbl-in:var(--color-ds-text-field-label)] [--lbl-up:var(--color-ds-text-semantic-success-secondary)]',
          '[--val:var(--color-ds-text-field-placeholder)] [--opt:var(--color-ds-text-acent-firts)]',
          '[--chip-bg:var(--color-ds-background-general-gray-seventh)] [--chip-fg:var(--color-ds-text-field-placeholder)]',
        ],
        'success-value': [
          '[--lbl-in:var(--color-ds-text-field-label)] [--lbl-up:var(--color-ds-text-field-label-secondary)]',
          '[--val:var(--color-ds-text-semantic-success-secondary)] [--opt:var(--color-ds-text-acent-firts)]',
          '[--chip-bg:var(--color-ds-background-general-gray-seventh)] [--chip-fg:var(--color-ds-text-field-placeholder)]',
        ],
        error: [
          '[--lbl-in:var(--color-ds-text-field-label)] [--lbl-up:var(--color-ds-text-semantic-error-secondary)]',
          '[--val:var(--color-ds-text-field-placeholder)] [--opt:var(--color-ds-text-acent-firts)]',
          '[--chip-bg:var(--color-ds-background-general-gray-seventh)] [--chip-fg:var(--color-ds-text-field-placeholder)]',
        ],
        disabled: [
          'cursor-not-allowed',
          '[--lbl-in:var(--color-ds-text-field-disabled-negative)] [--lbl-up:var(--color-ds-text-field-label-secondary)]',
          '[--val:var(--color-ds-text-field-disabled-negative)] [--opt:var(--color-ds-text-field-disabled-negative)]',
          '[--chip-bg:var(--color-ds-background-container-disabled-on-canva)] [--chip-fg:var(--color-ds-text-field-disabled-positive)]',
        ],
      },
    },
    defaultVariants: { size: 'sm', state: 'default' },
  }
);

/** Contenedor del <input> y su label (el "Text field" de Figma). Ocupa el ancho libre. */
export const inlineFieldControlWrapVariants = cva('relative h-full min-w-0 flex-1');

/** El <input> real, superpuesto al label (hermano anterior: `peer`). */
export const inlineFieldInputVariants = cva(
  [
    'peer absolute inset-0 h-full w-full min-w-0 appearance-none border-0 bg-transparent p-0 outline-none',
    'text-(color:--val) [font-family:inherit] [font-weight:inherit]',
    'disabled:cursor-not-allowed',
    // El placeholder del consumidor solo se ve con foco (vacío); el " " interno nunca se ve
    'placeholder:text-(color:--ph) [--ph:transparent] focus:[--ph:var(--val)]',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'pt-[21px] text-ds-typography-field-size-sm leading-(--ds-responsive-typography-field-line-height-sm)',
        md: 'pt-[20px] text-ds-typography-field-size-3xl leading-(--ds-responsive-typography-field-line-height-3xl)',
      },
      showPlaceholder: {
        // Estados forzados de documentación: el placeholder se ve siempre
        true: '[--ph:var(--val)]',
        false: '',
      },
    },
    defaultVariants: { size: 'sm', showPlaceholder: false },
  }
);

/**
 * Label flotante. `float`:
 * - auto: sube con foco o valor (peer = el <input> hermano anterior).
 * - always: siempre arriba (estados forzados).
 */
export const inlineFieldLabelVariants = cva(
  [
    'pointer-events-none absolute left-0 right-0 truncate whitespace-nowrap',
    'transition-[top,font-size,line-height] duration-150 ease-out motion-reduce:transition-none',
    // Flotando: 12/16 arriba
    'text-ds-typography-field-size-xs leading-(--ds-responsive-typography-field-line-height-xs)',
    'text-(color:--lbl-up)',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'top-[1px]',
        md: 'top-0',
      },
      float: {
        auto: [
          'peer-[:placeholder-shown:not(:focus)]:text-ds-typography-field-size-sm',
          'peer-[:placeholder-shown:not(:focus)]:leading-(--ds-responsive-typography-field-line-height-sm)',
          'peer-[:placeholder-shown:not(:focus)]:text-(color:--lbl-in)',
          // Autocompletado del navegador: el label sube como si hubiera valor
          'peer-autofill:text-ds-typography-field-size-xs peer-autofill:leading-(--ds-responsive-typography-field-line-height-xs)',
          'peer-autofill:text-(color:--lbl-up)',
        ].join(' '),
        always: '',
      },
    },
    compoundVariants: [
      // Vacío y sin foco: dentro del campo, centrado (18 de línea en 40 y en 56)
      { size: 'sm', float: 'auto', class: 'peer-[:placeholder-shown:not(:focus)]:top-[11px] peer-autofill:top-[1px]' },
      { size: 'md', float: 'auto', class: 'peer-[:placeholder-shown:not(:focus)]:top-[19px] peer-autofill:top-0' },
    ],
    defaultVariants: { size: 'sm', float: 'auto' },
  }
);

/** Chip de la derecha. */
export const inlineFieldChipVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center rounded-ds-radius-general-full px-ds-space-general-lg',
    'bg-(--chip-bg) text-(color:--chip-fg)',
    'text-ds-typography-field-size-xs leading-(--ds-responsive-typography-field-line-height-xs)',
  ].join(' '),
  {
    variants: {
      size: {
        // Centrado sobre la línea de 18 (1 de margen inferior + 1 por el desfase del bloque de 38 en 40)
        sm: 'py-ds-space-general-xs mb-0.5',
        md: 'py-ds-space-general-md',
      },
    },
    defaultVariants: { size: 'sm' },
  }
);
