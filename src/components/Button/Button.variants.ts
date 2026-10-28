import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Button Variants
 *
 * Fuente: component set "Button" de Figma (nodo 155:1315). Todos los colores,
 * espacios, radios y bordes salen de tokens (src/styles/tokens.css).
 *
 * - Type: primary · secondary · tertiary. Button link es un componente aparte (ButtonLink).
 * - Contrats (contrast): low · high, solo para secondary.
 * - Unicolor: solo secondary y tertiary sin icon-single.
 * - Size: md 56 · sm 48 · xs 32. Padding X 24/24/16, padding Y 8, min-width 92 en md y sm. Con texto el alto es mínimo
 *   (min-height): un ícono más grande que la línea (iconSize 20 en xs) lo estira como el HUG de Figma (xs 36).
 * - Icon-single sin alto fijo, como Figma: padding Y space/button/lg (8), padding X space/button/3xl · 2xl · lg
 *   (md · sm · xs) y caja de contenido de 16 de ancho por dimention/button/container/lg · md · xs de alto (ver
 *   Button.tsx). Sale md 56 · sm 48 · xs 32 en escritorio y md 48 · sm 40 · xs 32 en móvil (tokens responsive).
 * - `touchTarget` (Icon-single de 44×44, Top App Bar iOS: `tittle-header/top-app-bar`): cuadrado de 44 con el ícono de 20
 *   centrado y sin padding; `fullWidth` pone el botón al ancho del contenedor.
 * - State: default · hover · focus · press · inactive · delete · load (tertiary sin load).
 * - Tipografía: Helvetica Neue (typography/family/Primary), peso Semibold (600),
 *   typography/button/size/md-uniform (14px fijo en todos los breakpoints), interlineado 100 %.
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
    'cursor-pointer select-none whitespace-nowrap no-underline outline-none',
    // Gap de Figma (space/button/lg) también en la raíz: el único hijo en flujo es el contenido, no cambia el dibujo
    'gap-ds-space-button-lg',
    'transition-[background-color,border-color,color] duration-300 ease-out',
    'disabled:cursor-not-allowed',
    // Button/Button-md-600: Helvetica Neue, peso Semibold (600 = archivo Medium en fonts.css), 14px fijo (md-uniform, no el responsive), tracking 0
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    '[font-weight:var(--ds-primitives-typography-weight-semibold)]',
    // leading-none va después del tamaño: tailwind-merge descarta un leading anterior a un text-size
    'text-(length:--ds-responsive-typography-button-size-md-uniform) leading-none',
    'tracking-normal',
  ].join(' '),
  {
    variants: {
      variant: {
        // El trazo de 0.5px se dibuja en Button.tsx con una sombra interior: Chrome redondea a 1px los bordes de 0.5px
        primary: 'rounded-ds-radius-button-full border-0 [--btn-stroke:transparent]',
        secondary: 'rounded-ds-radius-button-full border-solid border-(length:--ds-primitives-stroke-lg)',
        // Sin radio con texto; Icon-single lleva radio completo (ver compoundVariants)
        tertiary: 'border-0',
      },

      contrast: {
        low: '',
        high: '',
      },

      // Unicolor solo cambia colores (ver compoundVariants); el tamaño de texto es el mismo
      unicolor: {
        true: '',
        false: '',
      },

      // Las medidas van en compoundVariants: con texto alto mínimo fijo, Icon-single por padding y caja de contenido
      size: {
        md: '',
        sm: '',
        xs: '',
      },

      state: {
        default: '',
        hover: '',
        focus: '',
        press: '',
        inactive: '',
        delete: '',
        load: 'cursor-wait',
      },

      iconOnly: {
        true: 'py-ds-space-button-lg',
        false: '',
      },

      // Ancho completo: ocupa el ancho del contenedor (en móvil, p. ej., "Mostrar más" de Pagination)
      fullWidth: {
        true: 'w-full',
        false: '',
      },

      // Icon-single de 44×44 (botones de Top App Bar iOS): ver compoundVariants
      touchTarget: {
        true: '',
        false: '',
      },
    },

    compoundVariants: [
      /* ── Medidas ─────────────────────────────────────────────── */
      // Con texto: alto mínimo (el contenido puede estirarlo, p. ej. xs con ícono de 20 → 36)
      // Alto mínimo = dimention/button/container + 2 × space/button/lg, como Icon-single: 56/48 en escritorio, 48/40 en móvil
      { iconOnly: false, size: 'md', class: 'min-h-[calc(var(--ds-responsive-dimention-button-container-lg)+var(--ds-responsive-space-button-lg)*2)]' },
      { iconOnly: false, size: 'sm', class: 'min-h-[calc(var(--ds-responsive-dimention-button-container-md)+var(--ds-responsive-space-button-lg)*2)]' },
      { iconOnly: false, size: 'xs', class: 'min-h-ds-primitives-dimention-2xl' },
      // Icon-single: padding X de Figma por tamaño (space/button/3xl · 2xl · lg, responsive)
      { iconOnly: true, size: 'md', class: 'px-ds-space-button-3xl' },
      { iconOnly: true, size: 'sm', class: 'px-ds-space-button-2xl' },
      { iconOnly: true, size: 'xs', class: 'px-ds-space-button-lg' },
      {
        variant: ['primary', 'secondary'],
        size: ['md', 'sm'],
        iconOnly: false,
        class: 'min-w-[92px] px-ds-space-button-4xl py-ds-space-button-lg',
      },
      {
        variant: ['primary', 'secondary'],
        size: 'xs',
        iconOnly: false,
        class: 'px-ds-space-button-2xl py-ds-space-button-lg',
      },
      // Load xs: Figma lo dibuja con ancho 92 (como md y sm), aunque en reposo mida 76
      { variant: ['primary', 'secondary'], size: 'xs', state: 'load', iconOnly: false, class: 'min-w-[92px]' },
      // Secondary: el trazo de Figma es interior y no suma a la caja; el borde de CSS sí, así que se descuenta del padding
      // (también el vertical: con alto mínimo, xs quedaría en 34)
      {
        variant: 'secondary',
        size: ['md', 'sm'],
        iconOnly: false,
        class: 'px-[calc(var(--ds-responsive-space-button-4xl)-var(--ds-primitives-stroke-lg))] py-[calc(var(--ds-responsive-space-button-lg)-var(--ds-primitives-stroke-lg))]',
      },
      {
        variant: 'secondary',
        size: 'xs',
        iconOnly: false,
        class: 'px-[calc(var(--ds-responsive-space-button-2xl)-var(--ds-primitives-stroke-lg))] py-[calc(var(--ds-responsive-space-button-lg)-var(--ds-primitives-stroke-lg))]',
      },
      // Secondary Icon-single: mismo descuento del borde en los cuatro lados (32/48/56 como Figma, no +2)
      {
        variant: 'secondary',
        size: 'md',
        iconOnly: true,
        class: 'px-[calc(var(--ds-responsive-space-button-3xl)-var(--ds-primitives-stroke-lg))] py-[calc(var(--ds-responsive-space-button-lg)-var(--ds-primitives-stroke-lg))]',
      },
      {
        variant: 'secondary',
        size: 'sm',
        iconOnly: true,
        class: 'px-[calc(var(--ds-responsive-space-button-2xl)-var(--ds-primitives-stroke-lg))] py-[calc(var(--ds-responsive-space-button-lg)-var(--ds-primitives-stroke-lg))]',
      },
      {
        variant: 'secondary',
        size: 'xs',
        iconOnly: true,
        class: 'px-[calc(var(--ds-responsive-space-button-lg)-var(--ds-primitives-stroke-lg))] py-[calc(var(--ds-responsive-space-button-lg)-var(--ds-primitives-stroke-lg))]',
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
          'focus-visible:[--btn-stroke:var(--color-ds-border-button-primary-focus-press)] focus-visible:[--btn-stroke-w:var(--ds-primitives-stroke-lg)] focus-visible:bg-ds-background-button-primary-focus focus-visible:text-ds-text-button-primary-hover-focus-press',
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
        // Focus es el único estado con trazo de 1px (stroke/lg); el resto usa stroke/dm
        class: '[--btn-stroke:var(--color-ds-border-button-primary-focus-press)] [--btn-stroke-w:var(--ds-primitives-stroke-lg)] bg-ds-background-button-primary-focus text-ds-text-button-primary-hover-focus-press [--btn-icon:var(--color-ds-icon-button-primary-hover-focus-press)]',
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
        class: 'bg-ds-background-button-primary-load text-ds-icon-button-primary-load [--btn-icon:var(--color-ds-icon-button-primary-load)]',
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
      { variant: 'secondary', contrast: 'low', state: 'load', class: 'border-ds-border-button-secondary-low-load text-ds-icon-button-secondary-low-load [--btn-icon:var(--color-ds-icon-button-secondary-low-load)]' },
      {
        variant: 'secondary',
        contrast: 'low',
        state: ['hover', 'focus', 'press'],
        unicolor: false,
        class: 'text-ds-text-button-secondary-low-hover-focus-press [--btn-icon:var(--color-ds-icon-button-secondary-low-hover-focus-press)]',
      },
      // Inactive y Delete usan sus colores también con Unicolor
      {
        variant: 'secondary',
        contrast: 'low',
        state: 'inactive',
        class: 'text-ds-text-button-secondary-low-inactive [--btn-icon:var(--color-ds-icon-button-secondary-low-inactive)]',
      },
      {
        variant: 'secondary',
        contrast: 'low',
        state: 'delete',
        class: 'text-ds-text-button-secondary-low-delete [--btn-icon:var(--color-ds-icon-button-secondary-low-delete)]',
      },
      {
        variant: 'secondary',
        contrast: 'low',
        state: ['default', 'hover', 'focus', 'press'],
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
      { variant: 'secondary', contrast: 'high', state: 'load', class: 'border-ds-border-button-secondary-high-load text-ds-icon-button-secondary-high-load [--btn-icon:var(--color-ds-icon-button-secondary-high-load)]' },
      {
        variant: 'secondary',
        contrast: 'high',
        state: ['hover', 'focus', 'press'],
        unicolor: false,
        class: 'text-ds-text-button-secondary-high-hover-focus-press [--btn-icon:var(--color-ds-icon-button-secondary-high-hover-focus-press)]',
      },
      // Inactive y Delete usan sus colores también con Unicolor
      {
        variant: 'secondary',
        contrast: 'high',
        state: 'inactive',
        class: 'text-ds-text-button-secondary-high-inactive [--btn-icon:var(--color-ds-icon-button-secondary-high-inactive)]',
      },
      {
        variant: 'secondary',
        contrast: 'high',
        state: 'delete',
        class: 'text-ds-text-button-secondary-high-delete [--btn-icon:var(--color-ds-icon-button-secondary-high-delete)]',
      },
      {
        variant: 'secondary',
        contrast: 'high',
        state: ['default', 'hover', 'focus', 'press'],
        unicolor: true,
        class: 'text-ds-text-button-secondary-high-unicolor [--btn-icon:var(--color-ds-icon-button-secondary-high-unicolor)]',
      },

      /* ── Tertiary (sin borde; fondo y radio solo en Icon-single) ── */
      // Unicolor solo cambia el reposo: hover, focus, press, inactive y delete usan los colores de tertiary
      {
        variant: 'tertiary',
        state: 'default',
        class: [
          'text-ds-text-button-tertiary-default [--btn-icon:var(--color-ds-icon-button-tertiary-default)]',
          'hover:text-ds-text-button-tertiary-hover hover:[--btn-icon:var(--color-ds-icon-button-tertiary-hover)]',
          'focus-visible:text-ds-text-button-tertiary-focus-press focus-visible:[--btn-icon:var(--color-ds-icon-button-tertiary-focus-press)]',
          'active:text-ds-text-button-tertiary-focus-press active:[--btn-icon:var(--color-ds-icon-button-tertiary-focus-press)]',
        ],
      },
      {
        variant: 'tertiary',
        state: 'hover',
        class: 'text-ds-text-button-tertiary-hover [--btn-icon:var(--color-ds-icon-button-tertiary-hover)]',
      },
      {
        variant: 'tertiary',
        state: ['focus', 'press'],
        class: 'text-ds-text-button-tertiary-focus-press [--btn-icon:var(--color-ds-icon-button-tertiary-focus-press)]',
      },
      {
        variant: 'tertiary',
        state: 'inactive',
        class: 'text-ds-text-button-tertiary-inactive [--btn-icon:var(--color-ds-icon-button-tertiary-inactive)]',
      },
      {
        variant: 'tertiary',
        state: 'delete',
        class: 'text-ds-text-button-tertiary-delete [--btn-icon:var(--color-ds-icon-button-tertiary-delete)]',
      },
      // Va después del default para ganarle al color base; los hover:/focus-visible:/active: del default siguen aplicando
      {
        variant: 'tertiary',
        state: 'default',
        unicolor: true,
        class: 'text-ds-text-button-tertiary-unicolor [--btn-icon:var(--color-ds-icon-button-tertiary-unicolor)]',
      },
      // Icon-single: radio completo y fondo en hover, focus y press
      { variant: 'tertiary', iconOnly: true, class: 'rounded-ds-radius-button-full' },
      {
        variant: 'tertiary',
        iconOnly: true,
        state: 'default',
        class: 'hover:bg-ds-background-button-tertiary-hover focus-visible:bg-ds-background-button-tertiary-focus-press active:bg-ds-background-button-tertiary-focus-press',
      },
      { variant: 'tertiary', iconOnly: true, state: 'hover', class: 'bg-ds-background-button-tertiary-hover' },
      { variant: 'tertiary', iconOnly: true, state: ['focus', 'press'], class: 'bg-ds-background-button-tertiary-focus-press' },
      // Icon-single de 44×44 (Top App Bar iOS): Figma fija 44 con padding 8/16 y recorta la caja de contenido; aquí el
      // ícono (20) queda centrado en un cuadrado de 44 sin padding. Va al final para ganar a los paddings de arriba.
      { iconOnly: true, touchTarget: true, class: 'size-11 p-0' },
    ],

    defaultVariants: {
      variant: 'primary',
      contrast: 'low',
      unicolor: false,
      size: 'md',
      state: 'default',
      iconOnly: false,
      fullWidth: false,
      touchTarget: false,
    },
  }
);
