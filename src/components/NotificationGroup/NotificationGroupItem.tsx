import { forwardRef, useId } from 'react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, KeyboardEvent, Ref } from 'react';
import type { NotificationGroupItemProps } from './NotificationGroup.types';
import {
  notificationGroupItemContentVariants,
  notificationGroupItemDescriptionVariants,
  notificationGroupItemRootVariants,
} from './NotificationGroup.variants';
import { notificationCardTimeRowVariants } from '../NotificationCard/NotificationCard.variants';
import { deleteLabelFor, useRevealDelete } from '../NotificationCard/NotificationCard.delete';
import { NotificationDeleteAction } from '../NotificationCard/NotificationDeleteAction';
import {
  CONTROL_ATTR,
  FIGMA_LOREM,
  focusNeighborNotification,
  hasContent,
  notificationTimeClass,
} from '../NotificationItem/NotificationItem.shared';
import { Badge } from '../Badge';
import { cn } from '../../utils/cn';

/**
 * Fila del desplegable de un grupo (set "Dropdown group notification (Atom)" de Figma, 14914:1288). Es un `<li>` de la
 * lista de un `NotificationGroup`.
 *
 * - Hora y descripción; `unread` añade el punto verde ("No leída" para lectores) y pone la descripción en semibold.
 * - Interactiva solo con `href` (descripción como enlace) u `onClick` (como botón), estirado sobre la fila. La hora y
 *   "No leída" son la descripción accesible del control.
 * - `onDelete`, `revealed` y el foco al eliminar funcionan como en `NotificationCard`.
 */
export const NotificationGroupItem = forwardRef<HTMLElement, NotificationGroupItemProps>(
  (
    {
      description,
      time,
      unread = false,
      unreadLabel = 'No leída',
      href,
      type = 'button',
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
    const timeId = `${id}-time`;
    const unreadId = `${id}-unread`;
    const hasTime = hasContent(time);
    const interactive = href !== undefined || typeof rest.onClick === 'function';
    const reveal = useRevealDelete({
      revealed: revealedProp,
      defaultRevealed,
      onRevealedChange,
      enabled: onDelete !== undefined,
    });
    const describedBy =
      [rest['aria-describedby'], hasTime ? timeId : null, unread ? unreadId : null].filter(Boolean).join(' ') || undefined;

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      rest.onKeyDown?.(event);
      if (event.defaultPrevented || !onDelete || event.key !== 'Delete') return;
      event.preventDefault();
      focusNeighborNotification(event.currentTarget);
      onDelete();
    };

    const textProps = {
      ...rest,
      'aria-describedby': describedBy,
      'data-figma-part': FIGMA_LOREM,
      onKeyDown: handleKeyDown,
      className: notificationGroupItemDescriptionVariants({ unread, interactive }),
    };

    return (
      <li {...rootProps} className={cn(notificationGroupItemRootVariants(), rootProps?.className, className)}>
        <div
          {...contentProps}
          {...reveal.handlers}
          data-figma-part="Content"
          style={{ touchAction: reveal.touchAction, ...contentProps?.style }}
          className={cn(notificationGroupItemContentVariants(), contentProps?.className)}
        >
          <div data-figma-part="Time" className={notificationCardTimeRowVariants()}>
            {unread && <Badge id={unreadId} type="simple" state="success" label={unreadLabel} data-figma-part="Badge" />}
            {hasTime && (
              <p id={timeId} data-figma-part="Hace 22m" className={cn(notificationTimeClass, 'flex-1')}>
                {time}
              </p>
            )}
          </div>
          {href !== undefined ? (
            <a {...(textProps as AnchorHTMLAttributes<HTMLAnchorElement>)} {...{ [CONTROL_ATTR]: '' }} ref={ref as Ref<HTMLAnchorElement>} href={href}>
              {description}
            </a>
          ) : typeof rest.onClick === 'function' ? (
            <button
              {...(textProps as ButtonHTMLAttributes<HTMLButtonElement>)}
              {...{ [CONTROL_ATTR]: '' }}
              ref={ref as Ref<HTMLButtonElement>}
              type={type}
            >
              {description}
            </button>
          ) : (
            <p {...textProps} ref={ref as Ref<HTMLParagraphElement>}>
              {description}
            </p>
          )}
        </div>
        {onDelete && (
          <NotificationDeleteAction
            revealed={reveal.revealed}
            label={deleteLabelFor(deleteLabel, typeof description === 'string' ? description : undefined)}
            onDelete={onDelete}
          />
        )}
      </li>
    );
  }
);

NotificationGroupItem.displayName = 'NotificationGroupItem';
