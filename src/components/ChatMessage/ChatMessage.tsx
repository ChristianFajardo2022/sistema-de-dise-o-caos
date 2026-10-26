import { forwardRef } from 'react';
import type { ChatMessageProps } from './ChatMessage.types';
import { chatMessageAvatarVariants, chatMessageBubbleVariants, chatMessageVariants } from './ChatMessage.variants';
import { cn } from '../../utils/cn';

/**
 * Mensaje de una conversación (set "Conversacion (Atom)" de Figma, 14948:8400): avatar y burbuja. Es un `<li>`: va
 * dentro de `ChatMessageList` (o de un `<ol>`). El autor y la hora no se dibujan, pero se leen antes del contenido
 * ("Ana Pérez, 20:14: Hola"). El avatar es decorativo.
 */
export const ChatMessage = forwardRef<HTMLLIElement, ChatMessageProps>(
  ({ direction = 'incoming', type = 'text', children, author, time, dateTime, avatar, className, ...rest }, ref) => {
    const avatarNode = avatar ? (
      <span aria-hidden="true" data-figma-part="Avatar" className={chatMessageAvatarVariants()}>
        {avatar}
      </span>
    ) : null;

    return (
      <li {...rest} ref={ref} data-direction={direction} className={cn(chatMessageVariants({ direction }), className)}>
        {direction === 'incoming' && avatarNode}
        <div data-figma-part="Frame 1984080545" className={chatMessageBubbleVariants({ direction, type })}>
          <span className="sr-only">
            {author}
            {time && (
              <>
                {', '}
                <time dateTime={dateTime}>{time}</time>
              </>
            )}
            {': '}
          </span>
          {type === 'text' ? <span data-figma-part="Status">{children}</span> : children}
        </div>
        {direction === 'outgoing' && avatarNode}
      </li>
    );
  }
);

ChatMessage.displayName = 'ChatMessage';
