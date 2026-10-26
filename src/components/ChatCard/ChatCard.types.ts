import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { RootProps } from '../_internal/types';

/** Presencia de la persona de la conversación. */
export type ChatCardPresence = 'online' | 'offline';

/** Líneas de la descripción (vista previa del último mensaje). */
export type ChatCardDescriptionLines = 1 | 2;

export interface ChatCardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title' | 'children'> {
  /** Prop `Filename` de Figma: nombre de la conversación o la persona. Es el contenido del control y su nombre accesible. */
  title: ReactNode;
  /** Prop `Status` de Figma: vista previa del último mensaje. Descripción accesible del control. */
  description?: ReactNode;
  /** Avatar de 48 a la izquierda: normalmente `<Avatar variant="photo" size="md" … />`. */
  leading?: ReactNode;
  /**
   * Indicador de presencia abajo a la derecha del avatar: `online` = Badge simple Success (verde), `offline` = Badge
   * simple Neutral (gris), como las tarjetas desconectadas de la pantalla Chat de Figma. Sin valor no se dibuja.
   * (El Badge de `Avatar` no permite elegir el color.)
   */
  presence?: ChatCardPresence;
  /** @deprecated Usar `presence="online"`. Se mantiene como alias: `online` equivale a `presence="online"`. */
  online?: boolean;
  /** Texto para lectores del indicador en línea. Por defecto "En línea". */
  onlineLabel?: string;
  /** Texto para lectores del indicador fuera de línea. Por defecto "Fuera de línea". */
  offlineLabel?: string;
  /**
   * Líneas visibles de la descripción antes de cortar con puntos suspensivos. Por defecto 1 (el átomo "Chat card" de
   * Figma, 18 de alto); la lista de la pantalla Chat usa 2 (36 de alto).
   */
  descriptionLines?: ChatCardDescriptionLines;
  /** Hora o fecha del último mensaje (texto pequeño arriba a la derecha). */
  time?: ReactNode;
  /** Mensajes sin leer (Badge número). Sin valor (o el número 0) no se dibuja. */
  unread?: number | string;
  /** Texto para lectores que sigue al número de mensajes sin leer. Por defecto "sin leer". */
  unreadLabel?: string;
  /**
   * State=Active de Figma: conversación seleccionada. Expone `aria-current="true"` en el control y pinta el relleno
   * background/container/select-on-card.
   */
  selected?: boolean;
  /**
   * Con `href` el control es un enlace (`<a>`); sin él, un `<button>`. Los atributos nativos (`onClick`, `target`…)
   * van al control.
   */
  href?: string;
  /**
   * Controles extra a la derecha del texto (botones de la fila de Figma: p. ej. `Button` secundarios de ícono).
   * Quedan por encima del área clicable de la tarjeta, con su propio foco.
   */
  actions?: ReactNode;
  /** Props del elemento raíz (el `ref` y el resto de props van al control). */
  rootProps?: RootProps;
  /** Clases del elemento raíz (se aplican después de `rootProps.className`). */
  className?: string;
}
