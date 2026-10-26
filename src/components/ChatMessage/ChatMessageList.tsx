import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import type { UIEvent } from 'react';
import type { ChatMessageListProps } from './ChatMessage.types';
import { chatMessageListVariants } from './ChatMessage.variants';
import { ScrollArea } from '../ScrollArea';
import { cn } from '../../utils/cn';
import { useMergedRefs } from '../../utils/refs';

/** Distancia al final (px) por debajo de la cual se considera que la lista "está abajo". */
const BOTTOM_THRESHOLD = 48;

/**
 * Registro de mensajes (slot Container3 de la pantalla Chat de Figma). Es un `ScrollArea` con `role="log"` y
 * `aria-live="polite"`: los lectores anuncian los mensajes nuevos sin interrumpir, y el área se desplaza con el teclado
 * cuando desborda. Los `ChatMessage` van en un `<ol>`.
 *
 * - `stickToBottom`: con un mensaje nuevo baja al final si ya estaba abajo; también re-ancla cuando el contenido crece
 *   después del render (una imagen que carga), observando el `<ol>`.
 * - `scrollToBottomKey`: al cambiar, baja siempre (el mensaje propio recién enviado).
 */
export const ChatMessageList = forwardRef<HTMLDivElement, ChatMessageListProps>(
  ({ stickToBottom = true, scrollToBottomKey, children, className, onScroll, ...rest }, ref) => {
    const innerRef = useRef<HTMLDivElement | null>(null);
    const listRef = useRef<HTMLOListElement>(null);
    const atBottom = useRef(true);
    const lastKey = useRef(scrollToBottomKey);

    const setRefs = useMergedRefs(innerRef, ref);

    const handleScroll = (event: UIEvent<HTMLDivElement>) => {
      const el = event.currentTarget;
      atBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight <= BOTTOM_THRESHOLD;
      onScroll?.(event);
    };

    useLayoutEffect(() => {
      const el = innerRef.current;
      if (!el) return;
      const forced = !Object.is(lastKey.current, scrollToBottomKey);
      lastKey.current = scrollToBottomKey;
      if (forced || (stickToBottom && atBottom.current)) {
        el.scrollTop = el.scrollHeight;
        atBottom.current = true;
      }
    }, [children, stickToBottom, scrollToBottomKey]);

    // Contenido que crece después del render (imágenes, audio): re-ancla si la lista estaba abajo
    useEffect(() => {
      const el = innerRef.current;
      const list = listRef.current;
      if (!stickToBottom || !el || !list || typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(() => {
        if (atBottom.current) el.scrollTop = el.scrollHeight;
      });
      observer.observe(list);
      return () => observer.disconnect();
    }, [stickToBottom]);

    return (
      <ScrollArea
        {...rest}
        ref={setRefs}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        onScroll={handleScroll}
        className={cn('min-h-0', className)}
      >
        <ol ref={listRef} className={chatMessageListVariants()}>
          {children}
        </ol>
      </ScrollArea>
    );
  }
);

ChatMessageList.displayName = 'ChatMessageList';
