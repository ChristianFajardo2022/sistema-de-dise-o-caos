import { forwardRef } from 'react';
import type { ChatMessageProps } from './ChatMessage.types';
import {
  chatMessageAvatarVariants,
  chatMessageBubbleVariants,
  chatMessageTimeVariants,
  chatMessageVariants,
} from './ChatMessage.variants';
import { cn } from '../../utils/cn';

/**
 * Mensaje de una conversación (set "Conversacion (Atom)" de Figma, 14948:8400): avatar y burbuja. Es un `<li>`: va
 * dentro de `ChatMessageList` (o de un `<ol>`). El autor no se dibuja, pero se lee antes del contenido
 * ("Ana Pérez: Hola"); la hora se ve bajo el contenido, dentro de la burbuja. El avatar es decorativo.
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
        <div data-figma-part={type === 'audio' ? 'Frame 1984080545' : 'Frame 1984080546'}
          className={chatMessageBubbleVariants({ direction, type })}>
          <span className="sr-only">{author}: </span>
          {type === 'text' ? <span data-figma-part="Status">{children}</span> : children}
          {time && <span className="sr-only">, </span>}
          {time && (
            <time dateTime={dateTime} data-figma-part="Hora" className={chatMessageTimeVariants({ direction })}>
              {time}
            </time>
          )}
        </div>
        {direction === 'outgoing' && avatarNode}
      </li>
    );
  }
);

ChatMessage.displayName = 'ChatMessage';
