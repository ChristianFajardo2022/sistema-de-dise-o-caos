import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Button Variants
 *
 * Fuente: component set "Button" de Figma (nodo 155:1315). Todos los colores,
 * espacios, radios y bordes salen de tokens (src/styles/tokens.css).
 *
 * - Type: primary · secondary · tertiary (link queda como variante heredada).
 * - Contrats (contrast): low · high, solo para secondary.
 * - Unicolor: solo secondary y tertiary sin icon-single.
 * - Size: md 56 · sm 48 · xs 32. Padding X 24/24/16, padding Y 8, min-width 92 en md y sm.
 * - State: default · hover · focus · press · inactive · delete · load (tertiary sin load).
 * - Tipografía: Helvetica Neue (typography/family/Primary), peso 400,
 *   typography/button/size/md, interlineado 100 %.
 * - Sin anillo de foco ni escala al presionar: cada estado usa sus propios tokens.
 *
 * Los colores de ícono se pasan por la variable local --btn-icon, que leen
 * el slot de ícono y el spinner; el color del trazo de Primary, por --btn-stroke.
 *
 * Los estados con prefijo (hover:, focus-visible:, active:) solo se aplican en
 * state="default"; el resto de valores de state fuerza el aspecto del estado.
 */
export const buttonVariants = cva(
  [
    'group relative box-border inline-flex shrink-0 items-center justify-center overflow-hidden',
    'cursor-pointer select-none whitespace-nowrap outline-none',
    'transition-[background-color,border-color,color,min-width] duration-300 ease-out',
    'disabled:cursor-not-allowed',
    // Button/Button-md-600: Helvetica Neue, peso 400, tracking 0 (tamaño e interlineado en `unicolor`)
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    '[font-weight:var(--ds-primitives-typography-weight-regular)]',
    'tracking-normal',
  ].join(' '),
  {
    variants: {
      variant: {
        // El trazo de 0.5px se dibuja en Button.tsx con una sombra interior: Chrome redondea a 1px los bordes de 0.5px
        primary: 'rounded-ds-radius-button-full border-0 [--btn-stroke:transparent]',
        secondary: 'rounded-ds-radius-button-full border-solid border-(length:--ds-primitives-stroke-lg)',
        tertiary: 'rounded-none border-0',
        /** @deprecated Button link es un componente aparte en Figma; pendiente de migrar. */
        link: 'rounded-ds-radius-button-full border-0',
      },

      contrast: {
        low: '',
        high: '',
      },

      unicolor: {
        // leading-none va después del tamaño: tailwind-merge descarta un leading anterior a un text-size
        true: 'text-(length:--ds-responsive-typography-button-size-md-uniform) leading-none',
        false: 'text-(length:--ds-responsive-typography-button-size-md) leading-none',
      },

      size: {
        md: 'h-ds-primitives-dimention-5xl',
        sm: 'h-ds-primitives-dimention-4xl',
        xs: 'h-ds-primitives-dimention-2xl',
      },

      state: {
        default: '',
        hover: '',
        focus: '',
        press: '',
        inactive: '',
        delete: '',
        load: 'disabled:cursor-wait',
      },

      iconOnly: {
        true: 'aspect-square p-0',
        false: '',
      },
    },

    compoundVariants: [
      /* ── Medidas ─────────────────────────────────────────────── */
      {
        variant: ['primary', 'secondary', 'link'],
        size: ['md', 'sm'],
        iconOnly: false,
        class: 'min-w-[92px] px-ds-space-button-4xl py-ds-space-button-lg',
      },
      {
        variant: ['primary', 'secondary', 'link'],
        size: 'xs',
        iconOnly: false,
        class: 'px-ds-space-button-2xl py-ds-space-button-lg',
      },
      {
        variant: 'tertiary',
        iconOnly: false,
        class: 'px-ds-space-button-xs py-ds-space-button-lg',
      },
      // Tertiary: ancho 41 en Default y 44 en el resto de estados
      {
        variant: 'tertiary',
        iconOnly: false,
        state: 'default',
        class: 'min-w-[41px] hover:min-w-[44px] focus-visible:min-w-[44px] active:min-w-[44px]',
      },
      {
        variant: 'tertiary',
        iconOnly: false,
        state: ['hover', 'focus', 'press', 'inactive', 'delete'],
        class: 'min-w-[44px]',
      },
      // Tertiary: subrayado sólido 6 %; en Default el color es fijo, en el resto sigue al texto
      {
        variant: 'tertiary',
        iconOnly: false,
        class: 'underline decoration-solid [text-decoration-thickness:6%] [text-underline-offset:46%] [text-decoration-skip-ink:auto]',
      },
      {
        variant: 'tertiary',
        iconOnly: false,
        state: 'default',
        class: 'decoration-ds-border-general-gray-fourth hover:decoration-current focus-visible:decoration-current active:decoration-current',
      },
      {
        variant: 'tertiary',
        iconOnly: false,
        state: ['hover', 'focus', 'press', 'inactive', 'delete'],
        class: 'decoration-current',
      },

      /* ── Primary ─────────────────────────────────────────────── */
      {
        variant: 'primary',
        state: 'default',
        class: [
          'bg-ds-background-button-primary-default text-ds-text-button-primary-default',
          '[--btn-icon:var(--color-ds-icon-button-primary-default)]',
          'hover:[--btn-stroke:var(--color-ds-border-button-primary-default)] hover:bg-ds-background-button-primary-hover hover:text-ds-text-button-primary-hover-focus-press',
          'hover:[--btn-icon:var(--color-ds-icon-button-primary-hover-focus-press)]',
          'focus-visible:[--btn-stroke:var(--color-ds-border-button-primary-focus-press)] focus-visible:bg-ds-background-button-primary-focus focus-visible:text-ds-text-button-primary-hover-focus-press',
          'focus-visible:[--btn-icon:var(--color-ds-icon-button-primary-hover-focus-press)]',
          'active:[--btn-stroke:var(--color-ds-border-button-primary-focus-press)] active:bg-ds-background-button-primary-press active:text-ds-text-button-primary-hover-focus-press',
          'active:[--btn-icon:var(--color-ds-icon-button-primary-hover-focus-press)]',
        ],
      },
      {
        variant: 'primary',
        state: 'hover',
        class: '[--btn-stroke:var(--color-ds-border-button-primary-default)] bg-ds-background-button-primary-hover text-ds-text-button-primary-hover-focus-press [--btn-icon:var(--color-ds-icon-button-primary-hover-focus-press)]',
      },
      {
        variant: 'primary',
        state: 'focus',
        class: '[--btn-stroke:var(--color-ds-border-button-primary-focus-press)] bg-ds-background-button-primary-focus text-ds-text-button-primary-hover-focus-press [--btn-icon:var(--color-ds-icon-button-primary-hover-focus-press)]',
      },
      {
        variant: 'primary',
        state: 'press',
        class: '[--btn-stroke:var(--color-ds-border-button-primary-focus-press)] bg-ds-background-button-primary-press text-ds-text-button-primary-hover-focus-press [--btn-icon:var(--color-ds-icon-button-primary-hover-focus-press)]',
      },
      {
        variant: 'primary',
        state: 'inactive',
        class: 'bg-ds-background-button-primary-inactive text-ds-text-button-primary-inactive [--btn-icon:var(--color-ds-icon-button-primary-inactive)]',
      },
      {
        variant: 'primary',
        state: 'delete',
        class: 'bg-ds-background-button-primary-delete text-ds-text-button-primary-delete [--btn-icon:var(--color-ds-icon-button-primary-delete)]',
      },
      {
        variant: 'primary',
        state: 'load',
        class: 'bg-ds-background-button-primary-load [--btn-icon:var(--color-ds-icon-button-primary-load)]',
      },

      /* ── Secondary low (sin fondo, solo borde) ───────────────── */
      {
        variant: 'secondary',
        contrast: 'low',
        state: 'default',
        class: [
          'border-ds-border-button-secondary-low-default',
          'hover:border-ds-border-button-secondary-low-hover',
          'focus-visible:border-ds-border-button-secondary-low-focus',
          'active:border-ds-border-button-secondary-low-press',
        ],
      },
      {
        variant: 'secondary',
        contrast: 'low',
        state: 'default',
        unicolor: false,
        class: [
          'text-ds-text-button-secondary-low-default [--btn-icon:var(--color-ds-icon-button-secondary-low-default)]',
          'hover:text-ds-text-button-secondary-low-hover-focus-press hover:[--btn-icon:var(--color-ds-icon-button-secondary-low-hover-focus-press)]',
          'focus-visible:text-ds-text-button-secondary-low-hover-focus-press focus-visible:[--btn-icon:var(--color-ds-icon-button-secondary-low-hover-focus-press)]',
          'active:text-ds-text-button-secondary-low-hover-focus-press active:[--btn-icon:var(--color-ds-icon-button-secondary-low-hover-focus-press)]',
        ],
      },
      { variant: 'secondary', contrast: 'low', state: 'hover', class: 'border-ds-border-button-secondary-low-hover' },
      { variant: 'secondary', contrast: 'low', state: 'focus', class: 'border-ds-border-button-secondary-low-focus' },
      { variant: 'secondary', contrast: 'low', state: 'press', class: 'border-ds-border-button-secondary-low-press' },
      { variant: 'secondary', contrast: 'low', state: 'inactive', class: 'border-ds-border-button-secondary-low-inactive' },
      { variant: 'secondary', contrast: 'low', state: 'delete', class: 'border-ds-border-button-secondary-low-delete' },
      { variant: 'secondary', contrast: 'low', state: 'load', class: 'border-ds-border-button-secondary-low-load [--btn-icon:var(--color-ds-icon-button-secondary-low-load)]' },
      {
        variant: 'secondary',
        contrast: 'low',
        state: ['hover', 'focus', 'press'],
        unicolor: false,
        class: 'text-ds-text-button-secondary-low-hover-focus-press [--btn-icon:var(--color-ds-icon-button-secondary-low-hover-focus-press)]',
      },
      {
        variant: 'secondary',
        contrast: 'low',
        state: 'inactive',
        unicolor: false,
        class: 'text-ds-text-button-secondary-low-inactive [--btn-icon:var(--color-ds-icon-button-secondary-low-inactive)]',
      },
      {
        variant: 'secondary',
        contrast: 'low',
        state: 'delete',
        unicolor: false,
        class: 'text-ds-text-button-secondary-low-delete [--btn-icon:var(--color-ds-icon-button-secondary-low-delete)]',
      },
      {
        variant: 'secondary',
        contrast: 'low',
        state: ['default', 'hover', 'focus', 'press', 'inactive', 'delete'],
        unicolor: true,
        class: 'text-ds-text-button-secondary-low-unicolor [--btn-icon:var(--color-ds-icon-button-secondary-low-unicolor)]',
      },

      /* ── Secondary high (sin fondo, solo borde) ──────────────── */
      {
        variant: 'secondary',
        contrast: 'high',
        state: 'default',
        class: [
          'border-ds-border-button-secondary-high-default',
          'hover:border-ds-border-button-secondary-high-hover',
          'focus-visible:border-ds-border-button-secondary-high-focus',
          'active:border-ds-border-button-secondary-high-press',
        ],
      },
      {
        variant: 'secondary',
        contrast: 'high',
        state: 'default',
        unicolor: false,
        class: [
          'text-ds-text-button-secondary-high-default [--btn-icon:var(--color-ds-icon-button-secondary-high-default)]',
          'hover:text-ds-text-button-secondary-high-hover-focus-press hover:[--btn-icon:var(--color-ds-icon-button-secondary-high-hover-focus-press)]',
          'focus-visible:text-ds-text-button-secondary-high-hover-focus-press focus-visible:[--btn-icon:var(--color-ds-icon-button-secondary-high-hover-focus-press)]',
          'active:text-ds-text-button-secondary-high-hover-focus-press active:[--btn-icon:var(--color-ds-icon-button-secondary-high-hover-focus-press)]',
        ],
      },
      { variant: 'secondary', contrast: 'high', state: 'hover', class: 'border-ds-border-button-secondary-high-hover' },
      { variant: 'secondary', contrast: 'high', state: 'focus', class: 'border-ds-border-button-secondary-high-focus' },
      { variant: 'secondary', contrast: 'high', state: 'press', class: 'border-ds-border-button-secondary-high-press' },
      { variant: 'secondary', contrast: 'high', state: 'inactive', class: 'border-ds-border-button-secondary-high-inactive' },
      { variant: 'secondary', contrast: 'high', state: 'delete', class: 'border-ds-border-button-secondary-high-delete' },
      { variant: 'secondary', contrast: 'high', state: 'load', class: 'border-ds-border-button-secondary-high-load [--btn-icon:var(--color-ds-icon-button-secondary-high-load)]' },
      {
        variant: 'secondary',
        contrast: 'high',
        state: ['hover', 'focus', 'press'],
        unicolor: false,
        class: 'text-ds-text-button-secondary-high-hover-focus-press [--btn-icon:var(--color-ds-icon-button-secondary-high-hover-focus-press)]',
      },
      {
        variant: 'secondary',
        contrast: 'high',
        state: 'inactive',
        unicolor: false,
        class: 'text-ds-text-button-secondary-high-inactive [--btn-icon:var(--color-ds-icon-button-secondary-high-inactive)]',
      },
      {
        variant: 'secondary',
        contrast: 'high',
        state: 'delete',
        unicolor: false,
        class: 'text-ds-text-button-secondary-high-delete [--btn-icon:var(--color-ds-icon-button-secondary-high-delete)]',
      },
      {
        variant: 'secondary',
        contrast: 'high',
        state: ['default', 'hover', 'focus', 'press', 'inactive', 'delete'],
        unicolor: true,
        class: 'text-ds-text-button-secondary-high-unicolor [--btn-icon:var(--color-ds-icon-button-secondary-high-unicolor)]',
      },

      /* ── Tertiary (sin borde ni radio; fondo en hover, focus y press) ── */
      {
        variant: 'tertiary',
        state: 'default',
        class: [
          'hover:bg-ds-background-button-tertiary-hover',
          'focus-visible:bg-ds-background-button-tertiary-focus-press',
          'active:bg-ds-background-button-tertiary-focus-press',
        ],
      },
      {
        variant: 'tertiary',
        state: 'default',
        unicolor: false,
        class: [
          'text-ds-text-button-tertiary-default [--btn-icon:var(--color-ds-icon-button-tertiary-default)]',
          'hover:text-ds-text-button-tertiary-hover hover:[--btn-icon:var(--color-ds-icon-button-tertiary-hover)]',
          'focus-visible:text-ds-text-button-tertiary-focus-press focus-visible:[--btn-icon:var(--color-ds-icon-button-tertiary-focus-press)]',
          'active:text-ds-text-button-tertiary-focus-press active:[--btn-icon:var(--color-ds-icon-button-tertiary-focus-press)]',
        ],
      },
      { variant: 'tertiary', state: 'hover', class: 'bg-ds-background-button-tertiary-hover' },
      { variant: 'tertiary', state: ['focus', 'press'], class: 'bg-ds-background-button-tertiary-focus-press' },
      {
        variant: 'tertiary',
        state: 'hover',
        unicolor: false,
        class: 'text-ds-text-button-tertiary-hover [--btn-icon:var(--color-ds-icon-button-tertiary-hover)]',
      },
      {
        variant: 'tertiary',
        state: ['focus', 'press'],
        unicolor: false,
        class: 'text-ds-text-button-tertiary-focus-press [--btn-icon:var(--color-ds-icon-button-tertiary-focus-press)]',
      },
      {
        variant: 'tertiary',
        state: 'inactive',
        unicolor: false,
        class: 'text-ds-text-button-tertiary-inactive [--btn-icon:var(--color-ds-icon-button-tertiary-inactive)]',
      },
      {
        variant: 'tertiary',
        state: 'delete',
        unicolor: false,
        class: 'text-ds-text-button-tertiary-delete [--btn-icon:var(--color-ds-icon-button-tertiary-delete)]',
      },
      {
        variant: 'tertiary',
        unicolor: true,
        class: 'text-ds-text-button-tertiary-unicolor [--btn-icon:var(--color-ds-icon-button-tertiary-unicolor)]',
      },

      /* ── Link (heredado; pendiente de pasar a componente propio) ── */
      {
        variant: 'link',
        state: 'default',
        class: [
          'text-ds-text-button-link-default [--btn-icon:var(--color-ds-icon-button-link-default)]',
          'hover:underline hover:text-ds-text-button-link-hover hover:[--btn-icon:var(--color-ds-icon-button-link-hover)]',
          'focus-visible:text-ds-text-button-link-focus-press focus-visible:[--btn-icon:var(--color-ds-icon-button-link-focus-press)]',
          'active:text-ds-text-button-link-focus-press active:[--btn-icon:var(--color-ds-icon-button-link-focus-press)]',
        ],
      },
      { variant: 'link', state: 'hover', class: 'underline text-ds-text-button-link-hover [--btn-icon:var(--color-ds-icon-button-link-hover)]' },
      { variant: 'link', state: ['focus', 'press'], class: 'text-ds-text-button-link-focus-press [--btn-icon:var(--color-ds-icon-button-link-focus-press)]' },
      { variant: 'link', state: ['inactive', 'load', 'delete'], class: 'text-ds-text-button-link-inactive [--btn-icon:var(--color-ds-icon-button-link-inactive)]' },
    ],

    defaultVariants: {
      variant: 'primary',
      contrast: 'low',
      unicolor: false,
      size: 'md',
      state: 'default',
      iconOnly: false,
    },
  }
);
