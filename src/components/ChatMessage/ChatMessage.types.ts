import type { LiHTMLAttributes, ReactNode } from 'react';
import type { ScrollAreaProps } from '../ScrollArea/ScrollArea.types';

/**
 * Lado del mensaje (Property 1 de Figma).
 * - `incoming` (Default y Variant5): mensaje recibido, avatar a la izquierda y burbuja background/general/gray-seventh.
 * - `outgoing` (Variant2 y Variant4): mensaje enviado, burbuja background/acent/secondary y avatar a la derecha.
 */
export type ChatMessageDirection = 'incoming' | 'outgoing';

/**
 * Contenido de la burbuja. `text` ajusta la burbuja al texto; `audio` (Variant4 y Variant5 de Figma) la estira al ancho libre
 * para el `ChatAudioPlayer`.
 */
export type ChatMessageType = 'text' | 'audio';

export interface ChatMessageProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'children'> {
  /** Lado del mensaje. Por defecto `incoming`. */
  direction?: ChatMessageDirection;
  /** Contenido de la burbuja. Por defecto `text`. */
  type?: ChatMessageType;
  /** Contenido: el texto del mensaje (capa "Status" de Figma) o un `<ChatAudioPlayer />`. */
  children: ReactNode;
  /**
   * Autor del mensaje. No se ve (Figma no lo dibuja): se lee antes del contenido ("Ana Pérez: …") para que cada
   * mensaje del registro diga quién lo escribió.
   */
  author: string;
  /** Hora del mensaje (p. ej. "20:14"). Se ve bajo el contenido (10/14), en un `<time>`. */
  time?: string;
  /** Valor `dateTime` del `<time>` (ISO 8601), si se conoce. */
  dateTime?: string;
  /** Avatar de 32: normalmente `<Avatar variant="photo" size="sm" alt="" />`. Es decorativo (el autor ya se lee). */
  avatar?: ReactNode;
  /** Clases adicionales para el `<li>` raíz. */
  className?: string;
}

export interface ChatMessageListProps extends Omit<ScrollAreaProps, 'role'> {
  /** Nombre accesible del registro (obligatorio), p. ej. "Mensajes con Ana Pérez". */
  'aria-label': string;
  /**
   * Baja sola al último mensaje cuando llega uno nuevo, si la lista ya estaba abajo (no interrumpe a quien está leyendo
   * mensajes anteriores). Por defecto `true`.
   */
  stickToBottom?: boolean;
  /**
   * Fuerza bajar al final cada vez que cambia, aunque la lista no estuviera abajo. Cámbialo cuando la persona envía un
   * mensaje (p. ej. el número de mensajes propios o el id del último enviado): quien escribe siempre ve lo que envió.
   */
  scrollToBottomKey?: unknown;
  /** `ChatMessage`. Se envuelven en un `<ol>`. */
  children?: ReactNode;
}
