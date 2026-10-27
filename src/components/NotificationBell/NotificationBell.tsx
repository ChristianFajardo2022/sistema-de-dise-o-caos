import { forwardRef } from 'react';
import type { NotificationBellProps } from './NotificationBell.types';
import { notificationBellBadgeClass, notificationBellButtonVariants, notificationBellVariants } from './NotificationBell.variants';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';

/**
 * Botón de campana con contador de no leídas (set "Icon button+badge (Atom)" de Figma, 12978:19007). Abre el panel de
 * notificaciones (`NotificationPanel`).
 *
 * - Nombre accesible con la cantidad: "Notificaciones, 3 sin leer" ("más de 99 sin leer" si pasa del máximo). El Badge
 *   visible es decorativo (`aria-hidden`) para no leer la cantidad dos veces.
 * - Si abre un panel: `open` expone `aria-expanded` y pinta el botón en Press; `aria-controls` (el id del panel) y
 *   `aria-haspopup` se pasan como props del botón. Con el panel como diálogo no modal, `aria-haspopup="dialog"`.
 * - `ref` y las props nativas van al `<button>`; `className` y `rootProps`, al contenedor.
 */
export const NotificationBell = forwardRef<HTMLButtonElement, NotificationBellProps>(
  (
    { count = 0, max = 99, size = 'xs', label = 'Notificaciones', unreadLabel = 'sin leer', open, rootProps, className, ...rest },
    ref
  ) => {
    const overflow = count > max;
    const shown = overflow ? `${max}+` : String(count);
    const name = count > 0 ? `${label}, ${overflow ? `más de ${max}` : count} ${unreadLabel}` : label;
    const iconSize = size === 'xs' ? 16 : 20;

    return (
      <span {...rootProps} className={cn(notificationBellVariants(), rootProps?.className, className)}>
        <Button
          aria-expanded={open}
          {...rest}
          ref={ref}
          iconOnly
          variant="secondary"
          contrast="low"
          size={size}
          state={open ? 'press' : undefined}
          aria-label={name}
          className={notificationBellButtonVariants({ size })}
        >
          <Icon name="notification" size={iconSize} variant="fill" data-figma-part="Icon-sizes" />
        </Button>
        {count > 0 && (
          <Badge type="number" state="error" aria-hidden="true" className={notificationBellBadgeClass} data-figma-part="Badge">
            <span data-figma-part="00">{shown}</span>
          </Badge>
        )}
      </span>
    );
  }
);

NotificationBell.displayName = 'NotificationBell';
