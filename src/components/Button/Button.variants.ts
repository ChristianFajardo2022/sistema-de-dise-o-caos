import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Button Variants
 *
 * Especificación exacta de Figma (Hover Primary, Secondary, Tertiary):
 *
 * Primary (Light & Dark):
 *   - Default:
 *       Light: bg #000000, text #FEFEFE, border ninguno (0.5px transparente)
 *       Dark:  bg #FEFEFE, text #2E3033, border ninguno (0.5px transparente)
 *   - Hover:
 *       Light & Dark: bg #5E6165, text #FEFEFE, border 0.5px interior #7E8187
 *       Efecto interior: Unión booleana de dos círculos con blur 24 y textura de ruido,
 *       reproduciendo ciclo de 4 estados con disolución (Dissolve) de 1s por paso.
 *   - Transición: Dissolve 300 ms, Ease out al entrar y salir.
 *
 * Secondary (Light & Dark):
 *   - Fondo transparente en ambos estados.
 *   - Borde 1px:
 *       Light: #CFD1D5 (Default) → #ADB0B4 (Hover)
 *       Dark:  #ADB0B4 (Default) → #FEFEFE (Hover)
 *   - Texto:
 *       Light: #000000 (no cambia en hover)
 *       Dark:  #FEFEFE (no cambia en hover)
 *   - Transición: Dissolve 300 ms, Ease out.
 *
 * Tertiary (Light & Dark):
 *   - Fondo transparente, sin borde, radio 0 (rounded-none), px-0.
 *   - Dimensiones: 41x56 (Default) → 44x56 (Hover).
 *   - Subrayado:
 *       Existe desde Default: solid, 6% (~1px), offset 46% (~6px), skip-ink activo.
 *       Color Default: #CFD1D5 (Light) / #7E8187 (Dark) independiente del texto.
 *       Color Hover: Automático (sigue el color del texto).
 *   - Texto:
 *       Light: #000000 (Default) → #5E6165 (Hover)
 *       Dark:  #FEFEFE (Default) → #ADB0B4 (Hover)
 *   - Transición: Dissolve 300 ms, Ease out.
 */
export const buttonVariants = cva(
  [
    // Base estructural común
    'inline-flex items-center justify-center gap-2',
    'relative overflow-hidden transition-all duration-300 ease-out group',
    'cursor-pointer select-none',
    'box-border',
    'outline-none',
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--border-field-active,#aa3bff)]',
    'disabled:cursor-not-allowed disabled:pointer-events-none',
    // Tipografía Helvetica Regular 400, 14px, auto leading, 0% tracking
    '[font-family:Helvetica,Arial,sans-serif]',
    'font-normal text-[14px] leading-normal tracking-normal',
  ].join(' '),
  {
    variants: {
      variant: {
        /**
         * Primary — Fondo base y texto según tokens de modo, borde 0.5px.
         * En hover cambia a #5E6165 con texto #FEFEFE y borde #7E8187 + efecto 4 fases.
         */
        primary: [
          'bg-ds-background-button-primary-default',
          'text-ds-text-button-primary-default',
          'border-[0.5px] border-transparent',
          'hover:bg-ds-background-button-primary-hover',
          'hover:text-ds-text-button-primary-hover-focus-press',
          'hover:border-ds-border-button-primary-default',
          'active:bg-ds-background-button-primary-press',
          'active:text-ds-text-button-primary-hover-focus-press',
          'active:border-ds-border-button-primary-focus-press',
          'active:scale-[0.98]',
          'focus-visible:bg-ds-background-button-primary-focus',
          'focus-visible:text-ds-text-button-primary-hover-focus-press',
        ],

        /**
         * Secondary — Fondo transparente, solo cambia el borde de 1px.
         * El texto no cambia de color en hover.
         */
        secondary: [
          'bg-transparent hover:bg-transparent',
          'text-ds-text-button-secondary-low-default hover:text-ds-text-button-secondary-low-default',
          'border border-solid border-ds-border-button-secondary-low-default',
          'hover:border-ds-border-button-secondary-low-hover',
          'active:bg-ds-background-button-secondary-low-press',
          'active:scale-[0.98]',
        ],

        /**
         * Tertiary — Fondo transparente, sin borde, radio 0, subrayado presente en Default.
         * Dimensiones 41px Default → 44px Hover.
         */
        tertiary: [
          'bg-transparent hover:bg-transparent',
          'text-ds-text-button-tertiary-default hover:text-ds-text-button-tertiary-hover',
          'border-0 border-transparent',
          'rounded-none',
          'px-0',
          'min-w-[41px] hover:min-w-[44px]',
          'underline decoration-solid decoration-[1px] underline-offset-[6px] [text-decoration-skip-ink:auto]',
          'decoration-ds-border-general-gray-fourth hover:decoration-current',
          'active:bg-transparent active:scale-[0.98]',
        ],

        /**
         * Destructive — Acción irreversible con fondo rojo.
         */
        destructive: [
          'bg-ds-background-button-primary-delete',
          'text-ds-text-button-primary-delete',
          'border border-solid border-ds-border-button-secondary-low-delete',
          'hover:brightness-110',
          'active:brightness-90 active:scale-[0.98]',
        ],

        /**
         * Link — Enlace interactivo.
         */
        link: [
          'bg-transparent',
          'text-ds-text-button-link-default',
          'border-0 border-transparent',
          'underline-offset-4 hover:underline',
          'hover:text-ds-text-button-link-hover',
          'active:text-ds-text-button-link-focus-press',
        ],
      },

      contrast: {
        low: '',
        high: 'brightness-110',
      },

      size: {
        xs: [
          'h-[40px] min-w-[80px]',
          'px-4',
          'text-[12px]',
          'rounded-[48px]',
        ],
        sm: [
          'h-[40px] min-w-[96px]',
          'px-5',
          'text-[12px]',
          'rounded-[48px]',
        ],
        md: [
          'min-h-[56px] min-w-[92px]',
          'py-2 px-6',
          'text-[14px]',
          'rounded-[48px]',
        ],
        lg: [
          'h-[64px] min-w-[148px]',
          'py-2 px-8',
          'text-[14px]',
          'rounded-[48px]',
        ],
      },

      state: {
        default: '',
        hover: '',
        press: 'scale-[0.98]',
        focus: 'ring-2 ring-[var(--border-field-active)] ring-offset-2',
        disabled: [
          'opacity-50 cursor-not-allowed pointer-events-none',
          'bg-ds-background-button-primary-inactive',
          'text-ds-text-button-primary-inactive',
          'border-ds-border-button-primary-inactive',
        ],
        delete: [
          'bg-ds-background-button-primary-delete',
          'text-ds-text-button-primary-delete',
          'border-ds-border-button-secondary-low-delete',
        ],
        load: [
          'cursor-wait opacity-80 pointer-events-none',
          'bg-ds-background-button-primary-load',
          'text-ds-text-button-primary-inactive',
        ],
      },

      iconOnly: {
        true: [
          'px-0 min-w-0',
          'aspect-square',
          'rounded-full',
        ],
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      contrast: 'low',
      size: 'md',
      state: 'default',
      iconOnly: false,
    },
  }
);
