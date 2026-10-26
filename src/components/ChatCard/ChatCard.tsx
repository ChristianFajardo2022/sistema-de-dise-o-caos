import { forwardRef, useId } from 'react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, Ref } from 'react';
import type { ChatCardProps } from './ChatCard.types';
import {
  chatCardActionsVariants,
  chatCardControlVariants,
  chatCardDescriptionVariants,
  chatCardLeadingVariants,
  chatCardMainVariants,
  chatCardMetaVariants,
  chatCardTextVariants,
  chatCardTimeVariants,
  chatCardVariants,
} from './ChatCard.variants';
import { Badge } from '../Badge';
import { cn } from '../../utils/cn';

const has = (node: unknown) => node != null && node !== false && node !== '';

/**
 * Tarjeta de conversación (set "Chat card" de Figma, 14857:9704). El control es el título: un `<button>` o, con `href`,
 * un `<a>`, estirado sobre toda la tarjeta. La conversación seleccionada (State=Active) lleva `aria-current="true"`.
 * El estado en línea, la descripción, la hora y los mensajes sin leer son la descripción accesible del control (una
 * referencia por pieza). El título es el control, así que no hay `headingLevel`. En una lista, envolver cada tarjeta
 * en `<li>` dentro de un `<ul>`.
 */
export const ChatCard = forwardRef<HTMLElement, ChatCardProps>(
  (
    {
      title,
      description,
      leading,
      online = false,
      onlineLabel = 'En línea',
      time,
      unread,
      unreadLabel = 'sin leer',
      selected = false,
      href,
      actions,
      rootProps,
      className,
      type = 'button',
      ...rest
    },
    ref
  ) => {
    const id = useId();
    const descriptionId = `${id}-description`;
    const onlineId = `${id}-online`;
    const timeId = `${id}-time`;
    const unreadId = `${id}-unread`;
    const hasUnread = has(unread) && unread !== 0;
    const hasMeta = has(time) || hasUnread;
    // Una referencia por pieza: el cálculo de la descripción las une con espacios ("20.00 3 sin leer")
    const describedBy =
      [
        rest['aria-describedby'],
        online ? onlineId : null,
        has(description) ? descriptionId : null,
        has(time) ? timeId : null,
        hasUnread ? unreadId : null,
      ]
        .filter(Boolean)
        .join(' ') || undefined;
    const controlProps = {
      ...rest,
      'data-chat-control': '',
      'data-figma-part': 'Filename',
      'aria-current': selected ? ('true' as const) : undefined,
      'aria-describedby': describedBy,
      className: chatCardControlVariants(),
    };

    return (
      <div
        {...rootProps}
        data-selected={selected ? '' : undefined}
        className={cn(chatCardVariants({ selected }), rootProps?.className, className)}
      >
        <div data-figma-part="Frame 1984080547" className={chatCardMainVariants()}>
          {(has(leading) || online) && (
            <div className={chatCardLeadingVariants()}>
              {leading}
              {online && (
                <Badge id={onlineId} type="simple" state="success" label={onlineLabel} className="absolute right-0 bottom-0" data-figma-part="Badge" />
              )}
            </div>
          )}
          <div data-figma-part="Frame 1984080546" className={chatCardTextVariants()}>
            {href !== undefined ? (
              <a {...(controlProps as AnchorHTMLAttributes<HTMLAnchorElement>)} ref={ref as Ref<HTMLAnchorElement>} href={href}>
                {title}
              </a>
            ) : (
              <button
                {...(controlProps as ButtonHTMLAttributes<HTMLButtonElement>)}
                ref={ref as Ref<HTMLButtonElement>}
                type={type}
              >
                {title}
              </button>
            )}
            {has(description) && (
              <p id={descriptionId} data-figma-part="Status" className={chatCardDescriptionVariants()}>
                {description}
              </p>
            )}
          </div>
          {has(actions) && (
            <div data-figma-part="Frame 1984080549" className={chatCardActionsVariants()}>
              {actions}
            </div>
          )}
        </div>
        {hasMeta && (
          <div data-figma-part="Frame 1984080546" className={chatCardMetaVariants()}>
            {has(time) && (
              <p id={timeId} data-figma-part="Status" className={chatCardTimeVariants()}>
                {time}
              </p>
            )}
            {hasUnread && (
              <Badge id={unreadId} type="number" label={unreadLabel} data-figma-part="Badge">
                <span data-figma-part="00">{unread}</span>
              </Badge>
            )}
          </div>
        )}
      </div>
    );
  }
);

ChatCard.displayName = 'ChatCard';
