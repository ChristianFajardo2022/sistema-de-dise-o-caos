import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — ScrollArea Variants
 *
 * Fuente: componente suelto "Scroll bar" de Figma (id 11189:8771, 6×314, slot Scroll).
 * - Riel: 6 de ancho, radio radius/button/full (48), relleno background/general/gray-sixth.
 * - Pulgar ("Bar"): 6 de ancho, mismo radio, relleno background/general/gray-firts.
 * - Chrome/Safari: ::-webkit-scrollbar* con esas medidas y tokens.
 * - Firefox: scrollbar-width thin + scrollbar-color con los mismos tokens (sin radio ni ancho exacto).
 * - Limitación: el alto del pulgar (71 en Figma) lo calcula el navegador según contenido/área visible.
 * - Foco con teclado: no existe en Figma; outline de 2px con el token de borde activo (WCAG 2.4.7).
 */
export const scrollAreaVariants = cva(
  [
    'box-border max-w-full',
    // Foco con teclado: el área recibe tabIndex 0 para poder desplazarla con flechas
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
    // Chrome / Safari: riel y pulgar de 6 con radio completo
    '[&::-webkit-scrollbar]:size-1.5',
    '[&::-webkit-scrollbar-track]:rounded-ds-radius-button-full [&::-webkit-scrollbar-track]:bg-ds-background-general-gray-sixth',
    '[&::-webkit-scrollbar-thumb]:rounded-ds-radius-button-full [&::-webkit-scrollbar-thumb]:bg-ds-background-general-gray-firts',
    '[&::-webkit-scrollbar-corner]:bg-transparent',
    // Firefox y navegadores sin ::-webkit-scrollbar (la propiedad estándar desactivaría los pseudo-elementos en Chrome)
    'supports-[not(selector(::-webkit-scrollbar))]:[scrollbar-width:thin]',
    'supports-[not(selector(::-webkit-scrollbar))]:[scrollbar-color:var(--color-ds-background-general-gray-firts)_var(--color-ds-background-general-gray-sixth)]',
  ].join(' '),
  {
    variants: {
      orientation: {
        vertical: 'overflow-y-auto overflow-x-hidden',
        horizontal: 'overflow-x-auto overflow-y-hidden',
        both: 'overflow-auto',
      },
    },
    defaultVariants: { orientation: 'vertical' },
  }
);
