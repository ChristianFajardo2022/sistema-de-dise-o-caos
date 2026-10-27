import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — NotificationBell Variants
 *
 * Fuente: component set "Icon button+badge (Atom)" de Figma (12978:19007), Type = Default | Icon+badge (32×32), y el
 * botón de campana de los paneles (`Icon + badge`, 48×48).
 *
 * - Botón: `Button` secondary low de solo ícono con el ícono `notification` (relleno, 16 en xs y 20 en sm).
 * - Contador: `Badge` número Error (background/semantic/error/fourth), 16 de alto, en la esquina inferior derecha del
 *   botón (x = y = 16 en el de 32, 32 en el de 48). Es decorativo: la cantidad va en el nombre accesible del botón.
 */
export const notificationBellVariants = cva('relative box-border inline-flex shrink-0 align-middle');

/**
 * @deprecated Ya no hace falta: Button dibuja el ícono de Icon-single a 16 en xs y 20 en sm y md, como Figma. Se
 * mantiene (sin clases) para no romper importaciones.
 */
export const notificationBellButtonVariants = cva('', {
  variants: {
    size: {
      xs: '',
      sm: '',
      md: '',
    },
  },
  defaultVariants: { size: 'xs' },
});

export const notificationBellBadgeClass = 'pointer-events-none absolute right-0 bottom-0';
