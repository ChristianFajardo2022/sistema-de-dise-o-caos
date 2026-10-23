import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — DatePicker Variants
 *
 * Fuente: component set "Date picker" de Figma (8096:3344; State: Dafault, Filled, Active/Focus, Burnt-In, Disabled,
 * Error, Success, Helper text).
 *
 * - El campo es el de Input (`inputFieldVariants`, label flotante y NotificationText): alto dimention/field/Input/default
 *   (56, móvil 48), padding 8/12, gap 8, borde de 1 por dentro y radio field/md (16).
 * - Ícono a la derecha: calendar (fill) de 16 con icon/general/gray-high-contrast (no el white de Input);
 *   en Burnt-In y Disabled, icon/general/disabled-positive. Va dentro del botón "Elegir fecha" de 24 (área táctil
 *   WCAG 2.5.8) con margen negativo, así ocupa los 16 de Figma.
 * - Burnt-In: el label usa text/field/disabled-negative (Input usa label-secondary).
 * - Raíz: columna con gap space/general/lg (8) entre el campo y el mensaje.
 * - Active/Focus: el Calendar (Only date, Day) sale 8 por debajo y alineado a la derecha del campo, 480 de ancho
 *   (en Figma es 480: `w-120` de la escala de Tailwind).
 */

/** Raíz: campo + mensaje. */
export const datePickerVariants = cva('relative flex flex-col gap-ds-space-general-lg', {
  variants: {
    fullWidth: { true: 'w-full', false: 'w-80 max-w-full' },
  },
  defaultVariants: { fullWidth: false },
});

/** Botón del ícono de calendario ("Elegir fecha"). */
export const datePickerButtonVariants = cva(
  [
    'relative -m-1 inline-flex size-6 shrink-0 cursor-pointer items-center justify-center',
    'rounded-ds-radius-field-full border-0 bg-transparent p-0',
    'outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
    'disabled:cursor-not-allowed',
  ].join(' '),
  {
    variants: {
      muted: {
        true: 'text-ds-icon-general-disabled-positive',
        false: 'text-ds-icon-general-gray-high-contrast',
      },
    },
    defaultVariants: { muted: false },
  }
);

/** Contenedor del calendario: popover nativo (capa superior) o, en `state="active"`, en el flujo bajo el campo. */
export const datePickerPanelVariants = cva('m-0 border-0 bg-transparent p-0 overflow-visible', {
  variants: {
    placement: {
      popover: 'max-w-[calc(100vw-2*0.5rem)] [inset:auto]',
      inline: 'absolute right-0 top-full z-10 mt-ds-space-general-lg max-w-[calc(100vw-2*0.5rem)]',
    },
  },
  defaultVariants: { placement: 'popover' },
});
