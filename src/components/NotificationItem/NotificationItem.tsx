import { forwardRef, useId } from 'react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, Ref } from 'react';
import type { NotificationItemProps } from './NotificationItem.types';
import {
  notificationItemDescriptionVariants,
  notificationItemHeadingVariants,
  notificationItemTitleVariants,
  notificationItemVariants,
} from './NotificationItem.variants';
import { CONTROL_ATTR, hasContent } from './NotificationItem.shared';
import { Badge } from '../Badge';
import { cn } from '../../utils/cn';

// Figma: 12571:4812
/**
 * Fila de notificación de texto (set "Text notification (Atom)" de Figma). Es un `<li>`: va dentro de una
 * lista (`<ul role="list">`, como la del `NotificationPanel`).
 *
 * - Interactiva solo si se pasa `href` (título como enlace) u `onClick` (título como botón), estirado sobre toda la fila.
 *   Sin ninguno es informativa: el título es un `<p>`.
 * - Leída o no leída (`unread`): el punto verde lleva el texto "No leída" para lectores de pantalla. Si la fila es
 *   interactiva, ese texto y la descripción forman la descripción accesible del control.
 * - No confundir con `NotificationText`, que son los mensajes de ayuda o error de los campos de formulario.
 */
export const NotificationItem = forwardRef<HTMLElement, NotificationItemProps>(
  ({ title, description, unread = false, unreadLabel = 'No leída', href, type = 'button', rootProps, className, ...rest }, ref) => {
    const id = useId();
    const unreadId = `${id}-unread`;
    const descriptionId = `${id}-description`;
    const hasDescription = hasContent(description);
    const interactive = href !== undefined || typeof rest.onClick === 'function';
    const describedBy =
      [rest['aria-describedby'], unread ? unreadId : null, hasDescription ? descriptionId : null].filter(Boolean).join(' ') ||
      undefined;
    const titleClass = notificationItemTitleVariants({ unread, interactive });
    const common = { ...rest, 'aria-describedby': describedBy, 'data-figma-part': 'Text notification', className: titleClass };

    return (
      <li {...rootProps} className={cn(notificationItemVariants(), rootProps?.className, className)}>
        <div data-figma-part="Heading" className={notificationItemHeadingVariants()}>
          {href !== undefined ? (
            <a {...(common as AnchorHTMLAttributes<HTMLAnchorElement>)} {...{ [CONTROL_ATTR]: '' }} ref={ref as Ref<HTMLAnchorElement>} href={href}>
              {title}
            </a>
          ) : typeof rest.onClick === 'function' ? (
            <button
              {...(common as ButtonHTMLAttributes<HTMLButtonElement>)}
              {...{ [CONTROL_ATTR]: '' }}
              ref={ref as Ref<HTMLButtonElement>}
              type={type}
            >
              {title}
            </button>
          ) : (
            <p {...common} ref={ref as Ref<HTMLParagraphElement>}>
              {title}
            </p>
          )}
          {unread && (
            <Badge id={unreadId} type="simple" state="success" label={unreadLabel} data-figma-part="Badge" />
          )}
        </div>
        {hasDescription && (
          <p id={descriptionId} data-figma-part="Text description" className={notificationItemDescriptionVariants()}>
            {description}
          </p>
        )}
      </li>
    );
  }
);

NotificationItem.displayName = 'NotificationItem';
