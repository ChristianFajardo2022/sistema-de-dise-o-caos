import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { Icon } from '../Icon';
import type { IconName } from '../Icon/Icon.types';
import { cn } from '../../utils/cn';

export interface ItemCardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Con `icon` es el marcador de éxito de Figma (círculo de 56 con ícono, decorativo). Sin `icon` es solo el contenedor
   * de 56×56 relativo para un avatar y lo que se le superponga (p. ej. una calificación).
   */
  icon?: IconName;
}

/**
 * "Item card" de Figma (pieza interna, no se exporta desde el paquete): contenedor de 56×56.
 * - Con `icon` (tipo Icon, md): círculo `radius/general/full` con fondo de éxito translúcido y el ícono relleno de 24.
 *   Es decorativo (`aria-hidden`): el significado lo da el texto de al lado.
 * - Sin `icon`: aloja `children` (avatar, insignias). Lo usan ContactCard y el estado de éxito del Code OTP.
 */
export const ItemCard = forwardRef<HTMLDivElement, ItemCardProps>(({ icon, className, children, ...rest }, ref) => (
  <div
    ref={ref}
    data-figma-part="Item card"
    {...(icon ? { 'aria-hidden': true } : {})}
    {...rest}
    className={cn(
      'relative flex size-14 shrink-0 items-center justify-center',
      icon &&
        'rounded-ds-radius-general-full bg-ds-background-graphic-success-firts-opacity text-ds-icon-semantic-success-secondary',
      className
    )}
  >
    {icon ? <Icon name={icon} size={24} variant="fill" data-figma-part="Icon Right" /> : children}
  </div>
));

ItemCard.displayName = 'ItemCard';
