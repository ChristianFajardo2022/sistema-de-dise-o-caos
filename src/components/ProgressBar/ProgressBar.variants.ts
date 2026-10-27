import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — ProgressBar Variants
 *
 * Fuente: component set "Progress bar" de Figma (11210:8045, 60 variantes: Type × State × Progress).
 *
 * - Pista: background/general/gray-sixth, radius/general/full. Progreso: relleno sobre la pista.
 *   State: default = background/general/white; success/error/alert = background/semantic/<x>/tertiary.
 * - Linear text: fila con gap space/general/lg (8); barra de 8 de alto y pastilla de texto
 *   (padding 8×2, radius/field/full, typography/field/size/xs 12/16, padding inferior 2 en el texto).
 *   El relleno termina recto (radius/general/xs) salvo al 100 %.
 * - Text above: pista de 12 con 1 de margen vertical; burbuja de 26 (padding 8×4) centrada sobre la barra
 *   en el extremo del progreso.
 * - External text: barra de 4; burbuja de 22 arriba, puntero de 8 y punto de 8 sobre la barra (alto total 41).
 * - Posición de la burbuja: centrada en el progreso, alineada al borde en 0 % y 100 % (variable --r).
 * - El ancho de Figma es una muestra (347); el componente ocupa el ancho de su contenedor.
 */
export const progressBarVariants = cva('relative box-border w-full [--p:0] [--r:0]', {
  variants: {
    type: {
      'linear-text': 'flex items-center gap-ds-space-general-lg',
      'text-above': 'h-3.5 py-px',
      'external-text': 'h-[41px]',
    },
  },
  defaultVariants: { type: 'linear-text' },
});

export const progressBarTrackVariants = cva(
  'bg-ds-background-general-gray-sixth rounded-ds-radius-general-full',
  {
    variants: {
      type: {
        'linear-text': 'relative h-2 min-w-0 flex-1 overflow-hidden',
        'text-above': 'relative h-3 w-full overflow-hidden',
        'external-text': 'absolute inset-x-0 bottom-0 h-1 overflow-hidden',
      },
    },
    defaultVariants: { type: 'linear-text' },
  }
);

export const progressBarFillVariants = cva(
  [
    // Se anima con transform (scaleX desde la izquierda), no con width: el progreso llega por --p
    'h-full w-full origin-left [transform:scaleX(calc(var(--p)/100))] rounded-ds-radius-general-full',
    '[transition:transform_300ms_ease-out] motion-reduce:[transition-duration:0.01ms]',
  ].join(' '),
  {
    variants: {
      status: {
        default: 'bg-ds-background-general-white',
        success: 'bg-ds-background-semantic-success-tertiary',
        error: 'bg-ds-background-semantic-error-tertiary',
        alert: 'bg-ds-background-semantic-alert-tertiary',
      },
      // En Linear text el relleno termina recto, salvo al completarse
      squareEnd: {
        true: 'rounded-r-ds-radius-general-xs',
        false: '',
      },
    },
    defaultVariants: { status: 'default', squareEnd: false },
  }
);

/** Texto del porcentaje: Helvetica Semibold 12/16 (typography/field xs, typography/weight/Semibold). */
export const progressBarTextVariants = cva(
  [
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    '[font-weight:var(--ds-primitives-typography-weight-semibold)]',
    'text-ds-typography-field-size-xs leading-ds-typography-field-line-height-xs',
    'text-center text-ds-text-neutral-white select-none whitespace-nowrap',
    'pb-ds-space-general-sm',
  ].join(' '),
  {
    variants: {
      // Linear text: ancho mínimo de "100%" (2,75em) con cifras tabulares, para que la pista no cambie de largo al animar
      stable: { true: 'inline-block min-w-[2.75em] tabular-nums', false: '' },
    },
    defaultVariants: { stable: false },
  }
);

/** Pastilla del texto. Linear: 22 de alto; Text above: 26. */
export const progressBarBubbleVariants = cva(
  'box-border flex shrink-0 items-center justify-center bg-ds-background-general-gray-sixth',
  {
    variants: {
      type: {
        'linear-text': 'rounded-ds-radius-field-full px-ds-space-button-lg py-ds-space-general-sm',
        'text-above': [
          'absolute top-1/2 left-0 [translate:calc(var(--r)*-100%)_-50%] px-ds-space-button-lg py-ds-space-general-md',
          '[transition:translate_300ms_ease-out] motion-reduce:[transition-duration:0.01ms]',
          'rounded-ds-radius-field-full',
        ].join(' '),
        'external-text': 'rounded-ds-radius-field-full px-ds-space-button-lg py-ds-space-general-sm',
      },
    },
    defaultVariants: { type: 'linear-text' },
  }
);

/**
 * Capa de las burbujas flotantes: cubre la barra y se desplaza con translateX(--p %) (porcentaje de su propio ancho,
 * que es el de la barra). Así el movimiento es de transform y no de left. El desplazamiento -r × ancho va en cada burbuja.
 */
export const progressBarFloatingClasses = [
  'pointer-events-none absolute inset-0',
  '[transform:translateX(calc(var(--p)*1%))] [transition:transform_300ms_ease-out] motion-reduce:[transition-duration:0.01ms]',
].join(' ');

/** Transición del desplazamiento propio de cada burbuja (-r × ancho). */
export const progressBarMoveTransition =
  '[transition:translate_300ms_ease-out] motion-reduce:[transition-duration:0.01ms]';
