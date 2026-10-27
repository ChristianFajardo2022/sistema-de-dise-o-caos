import { forwardRef, useId } from 'react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, KeyboardEvent, Ref } from 'react';
import type { NotificationCardProps } from './NotificationCard.types';
import {
  notificationCardContentVariants,
  notificationCardDescriptionVariants,
  notificationCardHeadingRowVariants,
  notificationCardRootVariants,
  notificationCardTimeRowVariants,
  notificationCardTitleVariants,
} from './NotificationCard.variants';
import { deleteLabelFor, useRevealDelete } from './NotificationCard.delete';
import { NotificationDeleteAction } from './NotificationDeleteAction';
import { CONTROL_ATTR, FIGMA_LOREM, focusNeighborNotification, hasContent, notificationTimeClass } from '../NotificationItem/NotificationItem.shared';
import { Badge } from '../Badge';
import { cn } from '../../utils/cn';

/**
 * Tarjeta de notificación (set "Group notification (Atom)" de Figma, 14963:6348, Type Simple y Simple delete). Es un
 * `<li>`: va dentro de una lista (`<ul role="list">`, como la del `NotificationPanel`).
 *
 * - Hora, título y descripción; `unread` pinta la tarjeta con relleno y el punto verde ("No leída" para lectores).
 * - Interactiva solo con `href` (título como enlace) u `onClick` (título como botón), estirado sobre la tarjeta. La hora,
 *   "No leída" y la descripción son la descripción accesible del control.
 * - `onDelete` dibuja el botón eliminar a la derecha: se muestra al deslizar a la izquierda, con `revealed` o al enfocarlo
 *   con Tab; con la fila enfocada, Supr también elimina. El foco pasa a la fila vecina antes de llamar a `onDelete`.
 * - Para varias notificaciones agrupadas con un desplegable, `NotificationGroup`.
 */
export const NotificationCard = forwardRef<HTMLElement, NotificationCardProps>(
  (
    {
      title,
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
    const descriptionId = `${id}-description`;
    const hasTime = hasContent(time);
    const hasDescription = hasContent(description);
    const interactive = href !== undefined || typeof rest.onClick === 'function';
    const reveal = useRevealDelete({
      revealed: revealedProp,
      defaultRevealed,
      onRevealedChange,
      enabled: onDelete !== undefined,
    });
    const describedBy =
      [rest['aria-describedby'], hasTime ? timeId : null, unread ? unreadId : null, hasDescription ? descriptionId : null]
        .filter(Boolean)
        .join(' ') || undefined;

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      rest.onKeyDown?.(event);
      if (event.defaultPrevented || !onDelete || event.key !== 'Delete') return;
      event.preventDefault();
      focusNeighborNotification(event.currentTarget);
      onDelete();
    };

    const titleProps = {
      ...rest,
      'aria-describedby': describedBy,
      'data-figma-part': 'Heading',
      onKeyDown: handleKeyDown,
      className: notificationCardTitleVariants({ interactive }),
    };

    return (
      <li {...rootProps} className={cn(notificationCardRootVariants(), rootProps?.className, className)}>
        <div
          {...contentProps}
          {...reveal.handlers}
          data-figma-part="Content"
          style={{ touchAction: reveal.touchAction, ...contentProps?.style }}
          className={cn(notificationCardContentVariants({ unread, revealed: reveal.revealed }), contentProps?.className)}
        >
          {hasTime && (
            <div data-figma-part="Time" className={notificationCardTimeRowVariants()}>
              <p id={timeId} data-figma-part="Hace 22m" className={cn(notificationTimeClass, 'flex-1')}>
                {time}
              </p>
            </div>
          )}
          <div data-figma-part="Heading" className={notificationCardHeadingRowVariants()}>
            {unread && <Badge id={unreadId} type="simple" state="success" label={unreadLabel} data-figma-part="Badge" />}
            {href !== undefined ? (
              <a {...(titleProps as AnchorHTMLAttributes<HTMLAnchorElement>)} {...{ [CONTROL_ATTR]: '' }} ref={ref as Ref<HTMLAnchorElement>} href={href}>
                {title}
              </a>
            ) : typeof rest.onClick === 'function' ? (
              <button
                {...(titleProps as ButtonHTMLAttributes<HTMLButtonElement>)}
                {...{ [CONTROL_ATTR]: '' }}
                ref={ref as Ref<HTMLButtonElement>}
                type={type}
              >
                {title}
              </button>
            ) : (
              <p {...titleProps} ref={ref as Ref<HTMLParagraphElement>}>
                {title}
              </p>
            )}
          </div>
          {hasDescription && (
            <p id={descriptionId} data-figma-part={FIGMA_LOREM} className={notificationCardDescriptionVariants()}>
              {description}
            </p>
          )}
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

NotificationCard.displayName = 'NotificationCard';
