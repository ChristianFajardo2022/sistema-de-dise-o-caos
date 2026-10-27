import type { HTMLAttributes, ReactNode } from 'react';
import type { NotificationContentProps, NotificationDeleteProps } from '../NotificationCard/NotificationCard.types';
import type { NotificationRootProps } from '../NotificationItem/NotificationItem.types';

export interface NotificationGroupProps
  extends NotificationDeleteProps,
    Omit<HTMLAttributes<HTMLElement>, 'title' | 'children'> {
  /** Prop Heading de Figma: título del grupo (p. ej. el remitente o el tema). */
  title: ReactNode;
  /** Hora relativa de la última notificación ("Hace 22m"), sobre el título. */
  time?: ReactNode;
  /** State de Figma: `Unread` = tarjeta con relleno; `Read` = sin relleno (con trazo inferior mientras está recogido). */
  unread?: boolean;
  /** Texto para lectores de pantalla de un grupo no leído. Por defecto "No leído". */
  unreadLabel?: string;
  /** `NotificationGroupItem` del grupo, de la más reciente a la más antigua. Recogido muestra solo la primera. */
  children?: ReactNode;
  /** Cantidad del Badge número. Por defecto, la cantidad de hijos. */
  count?: number;
  /** Texto para lectores que sigue al número del Badge. Por defecto "notificaciones". */
  countLabel?: string;
  /** Type `Dropdown group` de Figma: grupo desplegado (controlado). */
  expanded?: boolean;
  /** Desplegado al inicio (no controlado). */
  defaultExpanded?: boolean;
  /** Se llama al desplegar o recoger. */
  onExpandedChange?: (expanded: boolean) => void;
  /** Nombre accesible del botón cuando el grupo está recogido (se le añade el título). Por defecto "Mostrar notificaciones". */
  expandLabel?: string;
  /** Nombre accesible del botón cuando el grupo está desplegado. Por defecto "Ocultar notificaciones". */
  collapseLabel?: string;
  /** Atributos del `<li>` raíz (el marco con la tarjeta y el botón eliminar). `ref` y el resto de props van al botón de desplegar. */
  rootProps?: NotificationRootProps;
  /** Atributos de la tarjeta visual (el marco "Content" de Figma). En `Dropdown group` es la raíz que mide Figma. */
  contentProps?: NotificationContentProps;
  /** Clases adicionales para el `<li>` raíz. */
  className?: string;
}

export interface NotificationGroupItemProps
  extends NotificationDeleteProps,
    Omit<HTMLAttributes<HTMLElement>, 'title' | 'children'> {
  /** Prop Description de Figma: texto del mensaje. Es el nombre accesible del control si la fila es interactiva. */
  description: ReactNode;
  /** Prop Time de Figma: hora relativa ("Hace 22m"). */
  time?: ReactNode;
  /** State de Figma: `Unread` = punto verde y descripción en semibold; `Read` = sin punto, descripción regular. */
  unread?: boolean;
  /** Texto para lectores de pantalla del punto de no leída. Por defecto "No leída". */
  unreadLabel?: string;
  /** Con `href` la descripción es un enlace estirado sobre la fila; con `onClick`, un botón; sin ninguno es informativa. */
  href?: string;
  /** Tipo del botón cuando la descripción es un `<button>`. Por defecto `button`. */
  type?: 'button' | 'submit' | 'reset';
  /** Atributos del `<li>` raíz. `ref` y el resto de props van al control de la descripción. */
  rootProps?: NotificationRootProps;
  /** Atributos del bloque visual (el marco "Content" de Figma). */
  contentProps?: NotificationContentProps;
  /** Clases adicionales para el `<li>` raíz. */
  className?: string;
}
