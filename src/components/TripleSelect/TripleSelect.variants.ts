import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — TripleSelect Variants
 *
 * Fuente: tipo "Triple" del component set "General input" de Figma (7856:1485, 8 estados, ancho 496, alto 56 y 82
 * con mensaje). Un solo recuadro con tres secciones iguales separadas por una línea de 40.
 *
 * Reutiliza sin copiar la base de Input (`inputFieldVariants`: recuadro 56, padding 8/12, radio field/md, borde de 1 y
 * colores por estado) y `Select` con `frame="none"` para cada sección. Aquí solo vive lo que Triple agrega:
 * - Gap entre secciones y líneas: space/general/2xl (16).
 * - Línea: border/general/gray-sixth (gray-fifth en Burnt-In), 1 de ancho por 40 de alto.
 * - Disabled: Figma conserva border/field/default (Input usa border/field/disabled), por eso se fuerza.
 * - Mensaje: debajo, separado 8 (space/general/lg), con NotificationText.
 */
export const tripleSelectRootVariants = cva('flex min-w-0 flex-col gap-ds-space-general-lg', {
  variants: {
    fullWidth: {
      true: 'w-full',
      false: 'w-124 max-w-full',
    },
  },
  defaultVariants: { fullWidth: false },
});

/** Recuadro: se suma a `inputFieldVariants`. Con `!` porque cn() no ve como conflicto las utilidades ds-. */
export const tripleSelectFrameVariants = cva(
  'gap-ds-space-general-2xl [--input-field-gap:var(--ds-responsive-space-general-2xl)]',
  {
    variants: {
      disabled: { true: 'border-ds-border-field-default!', false: '' },
    },
    defaultVariants: { disabled: false },
  }
);

/** Línea entre secciones. */
export const tripleSelectDividerVariants = cva('h-10 w-px shrink-0', {
  variants: {
    burntIn: {
      true: 'bg-ds-border-general-gray-fifth',
      false: 'bg-ds-border-general-gray-sixth',
    },
  },
  defaultVariants: { burntIn: false },
});
