import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — TimePicker Variants
 *
 * Fuente: tipo "Time picker" del component set "General input" de Figma (8 estados, ancho 432, alto 56
 * y 82 con mensaje). Los campos de hora y minutos usan la base de Input (inputFieldVariants,
 * inputLabelVariants, inputControlVariants).
 *
 * - Fila: gap space/general/lg (8); hora, minutos y el par AM/PM ocupan un tercio cada uno.
 * - Par AM/PM: gap space/general/md (4); cada botón con alto de campo, padding X 16, radio field/sm (12),
 *   borde de 1px por dentro y texto 12/16. El seleccionado lleva el borde activo (border/field/active).
 * - El mensaje va debajo con NotificationText, separado 8 (row-gap de la rejilla raíz, solo con mensaje).
 */
export const timePickerRootVariants = cva('grid gap-x-ds-space-general-lg', {
  variants: {
    fullWidth: {
      true: 'w-full',
      false: 'w-108 max-w-full',
    },
  },
  defaultVariants: { fullWidth: false },
});

/** Separación (8) entre la fila y el mensaje; solo existe cuando hay mensaje. */
export const TIME_PICKER_MESSAGE_GAP = 'gap-y-ds-space-general-lg';

/** Fila con los tres controles. */
export const timePickerRowVariants = cva('flex items-center gap-ds-space-general-lg');

/** Opción AM/PM (el recuadro visible); el radio nativo va oculto como hermano anterior (`peer`). */
export const timePickerPeriodVariants = cva(
  [
    'justify-center cursor-pointer rounded-ds-radius-field-sm px-ds-space-general-2xl select-none',
    'text-ds-typography-field-size-xs leading-(--ds-responsive-typography-field-line-height-xs) text-(color:--val)',
    // Anillo de foco de teclado (no está en Figma): 2px con el token de borde activo
    'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-solid peer-focus-visible:outline-ds-border-field-active',
  ].join(' ')
);
