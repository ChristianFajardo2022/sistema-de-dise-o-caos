import { Children, forwardRef, useId } from 'react';
import type { KeyboardEvent } from 'react';
import type { NotificationGroupProps } from './NotificationGroup.types';
import {
  notificationGroupBodyVariants,
  notificationGroupChevronVariants,
  notificationGroupContentVariants,
  notificationGroupHeadingRowVariants,
  notificationGroupListVariants,
  notificationGroupTimeRowVariants,
  notificationGroupTitleVariants,
  notificationGroupToggleVariants,
} from './NotificationGroup.variants';
import { notificationCardRootVariants } from '../NotificationCard/NotificationCard.variants';
import { deleteLabelFor, useRevealDelete } from '../NotificationCard/NotificationCard.delete';
import { NotificationDeleteAction } from '../NotificationCard/NotificationDeleteAction';
import { focusNeighborNotification, hasContent, notificationTimeClass } from '../NotificationItem/NotificationItem.shared';
import { Badge } from '../Badge';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/controllableState';

// Figma: 14963:6348
/**
 * Grupo de notificaciones con desplegable (set "Group notification (Atom)" de Figma, Type Group, Group
 * delete y Dropdown group). Es un `<li>`: va dentro de una lista (`<ul role="list">`).
 *
 * - Hora, título con el contador (Badge número) y la lista de `NotificationGroupItem`. Recogido muestra solo la
 *   primera; desplegado (`expanded`) las muestra todas.
 * - Patrón de divulgación: el botón con el chevron lleva `aria-expanded` y `aria-controls` (la lista), y su área de clic
 *   cubre toda la tarjeta (las filas con acción quedan por encima y se usan por separado). Su nombre es "Mostrar
 *   notificaciones" / "Ocultar notificaciones" más el título.
 * - Leído o no leído (`unread`): relleno de la tarjeta y texto "No leído" para lectores. Cada fila anuncia el suyo.
 * - `onDelete`, `revealed` y el foco al eliminar funcionan como en `NotificationCard` (elimina todo el grupo).
 * - `ref` y las props nativas van al botón de desplegar.
 */
export const NotificationGroup = forwardRef<HTMLButtonElement, NotificationGroupProps>(
  (
    {
      title,
      time,
      unread = false,
      unreadLabel = 'No leído',
      children,
      count,
      countLabel = 'notificaciones',
      expanded: expandedProp,
      defaultExpanded = false,
      onExpandedChange,
      expandLabel = 'Mostrar notificaciones',
      collapseLabel = 'Ocultar notificaciones',
      onDelete,
      deleteLabel,
      revealed: revealedProp,
      defaultRevealed,
      onRevealedChange,
      rootProps,
      contentProps,
      className,
      ...rest
    },
    ref
  ) => {
    const id = useId();
    const listId = `${id}-list`;
    const headingId = `${id}-heading`;
    const timeId = `${id}-time`;
    const unreadId = `${id}-unread`;
    const toggleId = rest.id ?? `${id}-toggle`;
    const items = Children.toArray(children);
    const total = count ?? items.length;
    const [expanded, setExpanded] = useControllableState(expandedProp, defaultExpanded, onExpandedChange, 'NotificationGroup');
    const hasTime = hasContent(time);
    const reveal = useRevealDelete({
      revealed: revealedProp,
      defaultRevealed,
      onRevealedChange,
      enabled: onDelete !== undefined,
    });
    const describedBy =
      [rest['aria-describedby'], hasTime ? timeId : null, unread ? unreadId : null].filter(Boolean).join(' ') || undefined;
    const label = expanded ? collapseLabel : expandLabel;

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      rest.onKeyDown?.(event);
      if (event.defaultPrevented || !onDelete || event.key !== 'Delete') return;
      event.preventDefault();
      focusNeighborNotification(event.currentTarget);
      onDelete();
    };
    const shown = expanded ? items : items.slice(0, 1);

    return (
      <li {...rootProps} className={cn(notificationCardRootVariants(), rootProps?.className, className)}>
        <div
          {...contentProps}
          {...reveal.handlers}
          data-figma-part="Content"
          style={{ touchAction: reveal.touchAction, ...contentProps?.style }}
          className={cn(notificationGroupContentVariants({ unread, expanded, revealed: reveal.revealed }), contentProps?.className)}
        >
          <div data-figma-part="Time" className={notificationGroupTimeRowVariants()}>
            {hasTime && (
              <p id={timeId} data-figma-part="Hace 22m" className={cn(notificationTimeClass, 'flex-1')}>
                {time}
              </p>
            )}
            {unread && (
              <span id={unreadId} className="sr-only">
                {unreadLabel}
              </span>
            )}
            <button
              {...rest}
              ref={ref}
              id={toggleId}
              type="button"
              data-notification-control=""
              aria-expanded={expanded}
              aria-controls={listId}
              aria-label={label}
              aria-labelledby={`${toggleId} ${headingId}`}
              aria-describedby={describedBy}
              onKeyDown={handleKeyDown}
              onClick={(event) => {
                rest.onClick?.(event);
                if (!event.defaultPrevented) setExpanded(!expanded);
              }}
              className={notificationGroupToggleVariants()}
            >
              <Icon
                name="chevron-down"
                size={16}
                variant="line"
                className={notificationGroupChevronVariants({ expanded })}
                data-figma-part="Icon-sizes"
              />
            </button>
          </div>
          <div data-figma-part="Content" className={notificationGroupBodyVariants()}>
            <div data-figma-part="Heading" className={notificationGroupHeadingRowVariants()}>
              <Badge type="number" state="success" label={countLabel} data-figma-part="Badge">
                <span data-figma-part="00">{total}</span>
              </Badge>
              <p id={headingId} data-figma-part="Heading" className={notificationGroupTitleVariants()}>
                {title}
              </p>
            </div>
            <ul
              id={listId}
              role="list"
              data-figma-part="List"
              data-preview={expanded ? undefined : ''}
              className={notificationGroupListVariants()}
            >
              {shown}
            </ul>
          </div>
        </div>
        {onDelete && (
          <NotificationDeleteAction
            revealed={reveal.revealed}
            label={deleteLabelFor(deleteLabel, title)}
            onDelete={onDelete}
          />
        )}
      </li>
    );
  }
);

NotificationGroup.displayName = 'NotificationGroup';
