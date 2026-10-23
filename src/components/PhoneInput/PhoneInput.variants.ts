import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — PhoneInput Variants
 *
 * Fuente: component set "General input" de Figma (7856:1485), Type=Number (8 estados): un campo de prefijo con chevron
 * (83 de ancho, hug) y un campo de número que ocupa el resto, separados por 8 (space/general/lg), y debajo el mensaje
 * (Message) a 8. Cada campo es el de Input: alto 56, padding 8/12, radio field/md (16).
 *
 * Reutiliza sin copiar: `Select` (prefijo) y `Input` (número), con los colores por estado de Input.
 * Aquí solo vive la raíz y la fila.
 */

/** Raíz: fila de campos + mensaje, con 8 entre ellos. */
export const phoneInputRootVariants = cva('flex min-w-0 flex-col gap-ds-space-general-lg', {
  variants: {
    fullWidth: { true: 'w-full', false: 'w-80 max-w-full' },
  },
  defaultVariants: { fullWidth: false },
});

/** Ancho del campo de prefijo (Figma: 83). */
export const phoneInputPrefixClass = 'w-auto min-w-[83px] shrink-0';
