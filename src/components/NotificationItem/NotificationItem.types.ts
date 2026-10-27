import type { HTMLAttributes, LiHTMLAttributes, ReactNode } from 'react';

/** Props de la raíz (`<li>`) de las notificaciones. Acepta atributos `data-*`. */
export type NotificationRootProps = LiHTMLAttributes<HTMLLIElement> & {
  [K in `data-${string}`]?: string | number | boolean;
};

export interface NotificationItemProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'children'> {
  /** Prop Notification de Figma: título de la notificación. Es el nombre accesible del control si la fila es interactiva. */
  title: ReactNode;
  /** Prop Description de Figma: texto bajo el título. Si se omite no se dibuja. */
  description?: ReactNode;
  /**
   * Type de Figma: `Active` = no leída (título medium y punto verde al final), `Default` = leída. El punto no informa
   * solo con color: lleva el texto `unreadLabel` para lectores de pantalla.
   */
  unread?: boolean;
  /** Texto para lectores de pantalla del punto de no leída. Por defecto "No leída". */
  unreadLabel?: string;
  /**
   * Con `href` el título es un enlace `<a>` estirado sobre toda la fila. Con `onClick` (y sin `href`) es un `<button>`.
   * Sin ninguno de los dos la fila es solo informativa (un `<p>`).
   */
  href?: string;
  /** Tipo del botón cuando el título es un `<button>`. Por defecto `button`. */
  type?: 'button' | 'submit' | 'reset';
  /** Atributos del `<li>` raíz (`data-*`, `id`...). `ref` y el resto de props van al control del título. */
  rootProps?: NotificationRootProps;
  /** Clases adicionales para el `<li>` raíz. */
  className?: string;
}
