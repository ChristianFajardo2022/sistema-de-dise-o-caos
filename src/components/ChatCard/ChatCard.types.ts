import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { RootProps } from '../_internal/types';

export interface ChatCardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title' | 'children'> {
  /** Prop `Filename` de Figma: nombre de la conversación o la persona. Es el contenido del control y su nombre accesible. */
  title: ReactNode;
  /** Prop `Status` de Figma: vista previa del último mensaje. Descripción accesible del control. */
  description?: ReactNode;
  /** Avatar de 48 a la izquierda: normalmente `<Avatar variant="photo" size="md" … />`. */
  leading?: ReactNode;
  /**
   * Indicador de en línea: Badge simple Success abajo a la derecha del avatar (el Badge de `Avatar` no permite elegir el
   * color y sale morado, no verde como en Figma).
   */
  online?: boolean;
  /** Texto para lectores del indicador de en línea. Por defecto "En línea". */
  onlineLabel?: string;
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
