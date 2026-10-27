import type { HTMLAttributes, ReactNode } from 'react';
import type { NotificationRootProps } from '../NotificationItem/NotificationItem.types';

/** Atributos de un bloque interno del que se pueden fijar `data-*` (p. ej. la tarjeta visual). */
export type NotificationContentProps = HTMLAttributes<HTMLDivElement> & {
  [K in `data-${string}`]?: string | number | boolean;
};

/** Eliminar por deslizamiento: el marco "Eliminate" de Figma (Type = "… delete"). Lo comparten tarjeta, grupo y fila de grupo. */
export interface NotificationDeleteProps {
  /**
   * Eliminar la notificación. Con esta prop se dibuja el botón "Eliminar" (trash sobre fondo rojo, 48 de ancho) a la
   * derecha: oculto hasta que se desliza la fila a la izquierda, se pasa `revealed` o el botón recibe el foco con el
   * teclado (siempre está en el DOM, con su nombre accesible). El foco pasa antes a la fila vecina.
   */
  onDelete?: () => void;
  /** Nombre accesible del botón eliminar. Por defecto "Eliminar notificación" y, si el título es texto, ": título". */
  deleteLabel?: string;
  /** Type de Figma "… delete": el botón eliminar está a la vista (controlado). */
  revealed?: boolean;
  /** El botón eliminar está a la vista al inicio (no controlado). */
  defaultRevealed?: boolean;
  /** Se llama al deslizar la fila para mostrar u ocultar el botón eliminar. */
  onRevealedChange?: (revealed: boolean) => void;
}

export interface NotificationCardProps
  extends NotificationDeleteProps,
    Omit<HTMLAttributes<HTMLElement>, 'title' | 'children'> {
  /** Prop Heading de Figma: título. Es el nombre accesible del control si la tarjeta es interactiva. */
  title: ReactNode;
  /** Prop Description de Figma: texto del mensaje. */
  description?: ReactNode;
  /** Hora relativa de la notificación ("Hace 22m"), sobre el título. */
  time?: ReactNode;
  /** State de Figma: `Unread` = tarjeta con relleno y punto verde; `Read` = sin relleno, con trazo inferior. */
  unread?: boolean;
  /** Texto para lectores de pantalla del punto de no leída. Por defecto "No leída". */
  unreadLabel?: string;
  /** Con `href` el título es un enlace estirado sobre la tarjeta; con `onClick`, un botón; sin ninguno es informativa. */
  href?: string;
  /** Tipo del botón cuando el título es un `<button>`. Por defecto `button`. */
  type?: 'button' | 'submit' | 'reset';
  /** Atributos del `<li>` raíz (el marco con la tarjeta y el botón eliminar). `ref` y el resto de props van al control. */
  rootProps?: NotificationRootProps;
  /** Atributos de la tarjeta visual (el marco "Content" de Figma). */
  contentProps?: NotificationContentProps;
  /** Clases adicionales para el `<li>` raíz. */
  className?: string;
}
