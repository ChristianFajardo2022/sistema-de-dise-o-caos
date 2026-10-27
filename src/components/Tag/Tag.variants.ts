import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Tag Variants
 *
 * Fuente: component set "Tag" de Figma (id 9541:10661, 60 variantes: Type × State × Size).
 *
 * - Cápsula (radius/button/full) con padding X space/button/xl (12), gap 4, ícono de 14 y
 *   marco de texto de alto 16 (dimention/button/container/xs) con texto 12 regular
 *   (typography/button/size/sm).
 * - Size: md alto 32 (padding Y space/button/lg, 8) y sm alto 24 (padding Y space/button/md, 4).
 * - Type: define por variables CSS el color de fondo, texto e ícono de cada estado
 *   (--tag-bg, -hover, -press, --tag-fg, --tag-ic y sus -hover/-press; --tag-bg-focus solo en Default claro).
 * - Hover/Press con :hover/:active solo si es interactivo; Focus = mismo fondo que Hover + outline
 *   de 2px (no lo dibuja Figma; WCAG 2.4.7); Inactive = fondo gray-sixth y texto/ícono disabled-negative.
 * - Neutral difiere por tamaño en Figma (md: white/gray-firts-unicolor/gray-fourth-unicolor; sm:
 *   gray-firts/gray-tertiary/gray-fifth).
 * - Focus de Default usa la variable vieja "hover-focus" (sin token): oscuro = acent/firts, claro = acent/secondary.
 */
export const tagVariants = cva(
  [
    'group box-border relative inline-flex shrink-0 items-center justify-center align-middle select-none',
    'rounded-ds-radius-button-full px-ds-space-button-xl gap-ds-gap-button-internal-margin-md',
    'bg-(color:--tag-bg) text-(color:--tag-fg)',
    'border-0 outline-none whitespace-nowrap',
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    '[font-weight:var(--ds-primitives-typography-weight-regular)]',
  ].join(' '),
  {
    variants: {
      type: {
        default:
          'light:[--tag-bg-focus:var(--color-ds-background-acent-secondary)] [--tag-bg:var(--color-ds-background-acent-secondary)] [--tag-bg-hover:var(--color-ds-background-acent-firts)] [--tag-bg-press:var(--color-ds-background-acent-tertiary)] [--tag-fg:var(--color-ds-text-acent-secondary)] [--tag-fg-press:var(--color-ds-text-neutral-white-unicolor)] [--tag-ic:var(--color-ds-icon-acent-tertiary)] [--tag-ic-press:var(--color-ds-icon-general-white-unicolor)]',
        success:
          '[--tag-bg:var(--color-ds-background-semantic-success-secondary)] [--tag-bg-hover:var(--color-ds-background-semantic-success-firts)] [--tag-bg-press:var(--color-ds-background-semantic-success-tertiary)] [--tag-fg:var(--color-ds-text-semantic-success)] [--tag-fg-press:var(--color-ds-text-semantic-success)] [--tag-ic:var(--color-ds-icon-semantic-success-tertiary)] [--tag-ic-press:var(--color-ds-icon-semantic-success-tertiary)]',
        alert:
          '[--tag-bg:var(--color-ds-background-semantic-alert-secondary)] [--tag-bg-hover:var(--color-ds-background-semantic-alert-firts)] [--tag-bg-press:var(--color-ds-background-semantic-alert-tertiary)] [--tag-fg:var(--color-ds-text-semantic-alert)] [--tag-fg-press:var(--color-ds-text-semantic-alert)] [--tag-ic:var(--color-ds-icon-semantic-alert-tertiary)] [--tag-ic-press:var(--color-ds-icon-semantic-alert-tertiary)]',
        error:
          '[--tag-bg:var(--color-ds-background-semantic-error-secondary)] [--tag-bg-hover:var(--color-ds-background-semantic-error-firts)] [--tag-bg-press:var(--color-ds-background-semantic-error-tertiary)] [--tag-fg:var(--color-ds-text-semantic-error)] [--tag-fg-press:var(--color-ds-text-neutral-white-unicolor)] [--tag-ic:var(--color-ds-icon-semantic-error-tertiary)] [--tag-ic-press:var(--color-ds-icon-general-white-unicolor)]',
        info:
          '[--tag-bg:var(--color-ds-background-semantic-information-secondary)] [--tag-bg-hover:var(--color-ds-background-semantic-information-firts)] [--tag-bg-press:var(--color-ds-background-semantic-information-tertiary)] [--tag-fg:var(--color-ds-text-semantic-information)] [--tag-fg-press:var(--color-ds-text-semantic-information)] [--tag-ic:var(--color-ds-icon-semantic-information-tertiary)] [--tag-ic-press:var(--color-ds-icon-semantic-information-tertiary)]',
        neutral: '',
      },
      size: {
        md: 'h-8 py-ds-space-button-lg',
        sm: 'h-6 py-ds-space-button-md',
      },
      // Forzado para documentación (o inactive real): el estado reasigna las variables efectivas
      state: {
        default: '',
        hover: `bg-(color:--tag-bg-hover) text-[color:var(--tag-fg-hover,var(--tag-fg))]`,
        focus: `bg-[color:var(--tag-bg-focus,var(--tag-bg-hover))] text-[color:var(--tag-fg-hover,var(--tag-fg))] outline-2 outline-offset-2 outline-solid outline-ds-border-field-active`,
        press: 'bg-(color:--tag-bg-press) text-(color:--tag-fg-press)',
        inactive:
          'bg-ds-background-general-gray-sixth text-ds-text-neutral-disabled-negative cursor-not-allowed',
      },
      interactive: {
        true: [
          'cursor-pointer transition-[background-color,color] duration-200 ease-out',
          'hover:bg-(color:--tag-bg-hover) hover:text-[color:var(--tag-fg-hover,var(--tag-fg))] active:bg-(color:--tag-bg-press) active:text-(color:--tag-fg-press)',
          'focus-visible:bg-[color:var(--tag-bg-focus,var(--tag-bg-hover))] focus-visible:text-[color:var(--tag-fg-hover,var(--tag-fg))]',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
          'disabled:cursor-not-allowed',
          'disabled:bg-ds-background-general-gray-sixth disabled:text-ds-text-neutral-disabled-negative',
        ].join(' '),
        false: '',
      },
    },
    compoundVariants: [
      {
        type: 'neutral',
        size: 'md',
        class:
          '[--tag-bg:var(--color-ds-background-general-white)] [--tag-bg-hover:var(--color-ds-background-general-gray-firts-unicolor)] [--tag-bg-press:var(--color-ds-background-general-gray-fourth-unicolor)] [--tag-fg:var(--color-ds-text-neutral-black)] [--tag-fg-hover:var(--color-ds-text-neutral-black-unicolor)] [--tag-fg-press:var(--color-ds-text-neutral-black-unicolor)] [--tag-ic:var(--color-ds-icon-general-black)] [--tag-ic-hover:var(--color-ds-icon-general-black-unicolor)] [--tag-ic-press:var(--color-ds-icon-general-black-unicolor)]',
      },
      {
        type: 'neutral',
        size: 'sm',
        class:
          '[--tag-bg:var(--color-ds-background-general-gray-firts)] [--tag-bg-hover:var(--color-ds-background-general-gray-tertiary)] [--tag-bg-press:var(--color-ds-background-general-gray-fifth)] [--tag-fg:var(--color-ds-text-neutral-black)] [--tag-fg-press:var(--color-ds-text-neutral-white)] [--tag-ic:var(--color-ds-icon-general-black)] [--tag-ic-press:var(--color-ds-icon-general-white)]',
      },
    ],
    defaultVariants: { type: 'default', size: 'md', state: 'default', interactive: false },
  }
);

/** Ícono: color de icon/* por Type; en press (real o forzado) usa --tag-ic-press; inactive usa disabled-negative. */
export const tagIconVariants = cva('shrink-0 text-(color:--tag-ic)', {
  variants: {
    state: {
      default: '',
      hover: 'text-[color:var(--tag-ic-hover,var(--tag-ic))]',
      focus: 'text-[color:var(--tag-ic-hover,var(--tag-ic))]',
      press: 'text-(color:--tag-ic-press)',
      inactive: 'text-ds-icon-general-disabled-negative',
    },
    interactive: {
      true: 'group-hover:text-[color:var(--tag-ic-hover,var(--tag-ic))] group-focus-visible:text-[color:var(--tag-ic-hover,var(--tag-ic))] group-active:text-(color:--tag-ic-press) group-disabled:text-ds-icon-general-disabled-negative',
      false: '',
    },
  },
  defaultVariants: { state: 'default', interactive: false },
});

/** Marco de texto de Figma "Text-button": alto 16, texto 12 regular centrado. */
export const tagTextVariants = cva(
  [
    'flex h-ds-dimention-button-container-xs items-center justify-center',
    'text-ds-typography-button-size-sm leading-none',
  ].join(' ')
);
