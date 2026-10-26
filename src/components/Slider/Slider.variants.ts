import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Slider Variants
 *
 * Fuente: component set "Slide bar" (13839:56628) de Figma. Type Simple / Simple number / Range / Range number
 * × Porcentage 0/25/50/75/100 %.
 *
 * - Raíz: ancho FILL × 6, padding 1 arriba y abajo (sin token: escala de Tailwind `py-px`).
 * - Pista ("Shape"): 4 de alto, radius/general/full, background/general/gray-sixth.
 * - Tramo seleccionado ("Form"): background/general/gray-secondary. En Simple va del inicio al pulgar;
 *   en Range, entre los dos pulgares.
 * - Pulgar: background/general/white-unicolor con contorno border/general/gray-fourth por dentro (box-shadow inset,
 *   porque el navegador redondea border-width). Simple 16 con border/general/xl (1.5); Range 8 con border/general/lg (1);
 *   "number" 22 con padding space/general/sm (2), border/general/xl y el valor en 10/14 (typography/body xs),
 *   text/neutral/black-unicolor.
 * - El centro del pulgar recorre la pista sin salirse: a 0 % el pulgar toca el borde izquierdo y a 100 % el derecho.
 * - Área táctil: la raíz y cada pulgar crecen a ≥ 24 px con un pseudo-elemento invisible (WCAG 2.5.8).
 * - Foco con teclado: no existe en Figma; se agrega un outline de 2px (WCAG 2.4.7).
 * - Disabled: no existe en Figma; se atenúa con opacidad (como Rating) y el cursor indica que no responde.
 */
export const sliderRootVariants = cva(
  [
    'relative flex w-full flex-col py-px select-none touch-pan-y',
    // Área táctil de la pista: 6 + 2×10 = 26 px de alto
    "before:absolute before:inset-x-0 before:-inset-y-2.5 before:content-['']",
  ].join(' '),
  {
    variants: {
      appearance: {
        simple: '[--slider-thumb:--spacing(4)]',
        range: '[--slider-thumb:--spacing(2)]',
        number: '[--slider-thumb:--spacing(5.5)]',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-50',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: { appearance: 'simple', disabled: false },
  }
);

/** Pista completa ("Shape"). */
export const sliderTrackVariants = cva(
  'relative h-1 w-full overflow-hidden rounded-ds-radius-general-full bg-ds-background-general-gray-sixth'
);

/** Tramo seleccionado ("Form" con relleno). */
export const sliderRangeVariants = cva('absolute inset-y-0 bg-ds-background-general-gray-secondary');

export const sliderThumbVariants = cva(
  [
    // El centro sobre su posición (desde el inicio de la pista; de derecha a izquierda, desde la derecha)
    'absolute top-1/2 box-border flex -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 items-center justify-center',
    'rounded-ds-radius-general-full bg-ds-background-general-white-unicolor',
    '[box-shadow:inset_0_0_0_var(--slider-thumb-stroke)_var(--color-ds-border-general-gray-fourth)]',
    // Área táctil mínima de 24 px aunque el pulgar se vea más chico
    "before:absolute before:top-1/2 before:left-1/2 before:size-6 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
    'aria-disabled:cursor-not-allowed',
  ].join(' '),
  {
    variants: {
      appearance: {
        simple: 'size-4 [--slider-thumb-stroke:var(--ds-responsive-border-general-xl)]',
        range: 'size-2 [--slider-thumb-stroke:var(--ds-responsive-border-general-lg)]',
        number: 'h-5.5 min-w-5.5 p-ds-space-general-sm [--slider-thumb-stroke:var(--ds-responsive-border-general-xl)]',
      },
      disabled: {
        true: '',
        false: 'cursor-grab active:cursor-grabbing',
      },
    },
    defaultVariants: { appearance: 'simple', disabled: false },
  }
);

/** Valor dentro del pulgar ("00" en Figma), con 1 px de aire abajo como el Container de Figma. */
export const sliderValueTextVariants = cva(
  [
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    '[font-weight:var(--ds-primitives-typography-weight-regular)]',
    'text-ds-typography-body-size-xs leading-ds-typography-body-line-height-short-xs',
    'text-ds-text-neutral-black-unicolor whitespace-nowrap tabular-nums pb-px',
  ].join(' ')
);
