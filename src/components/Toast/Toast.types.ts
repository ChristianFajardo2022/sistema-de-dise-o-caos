import type { HTMLAttributes, ReactNode } from 'react';
import type { IconName } from '../Icon/Icon.types';

/** Type de Figma: color semántico e ícono */
export type ToastType = 'success' | 'alert' | 'error' | 'info';

/** Rol de la región viva: `status` (aviso cortés) o `alert` (interrumpe al lector). */
export type ToastRole = 'status' | 'alert';

/** Props comunes de Toast y Snackbar (contenido, ícono, cierre automático). */
export interface ToastBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'role'> {
  /** Type de Figma (por defecto `success`) */
  type?: ToastType;
  /** Subheading de Figma */
  title?: ReactNode;
  /** Description de Figma (el booleano Description de Figma lo decide la presencia de esta prop) */
  description?: ReactNode;
  /** Sobrescribe el ícono del type */
  icon?: IconName;
  /** Texto sr-only con el tipo (Éxito, Advertencia, Error, Información). Cadena vacía lo desactiva. */
  label?: string;
  /**
   * Rol de la región viva. Por defecto `status` en success e info y `alert` en error y alert.
   * El aviso se anuncia sin mover el foco.
   */
  role?: ToastRole;
  /**
   * Cierre automático en milisegundos. Sin valor no se cierra solo. Se pausa con el puntero encima o con el foco
   * dentro, y se reinicia al salir. Al cumplirse llama a `onClose`. No lo uses en avisos con acción o de error
   * que el usuario deba poder leer con calma (WCAG 2.2.1).
   */
  duration?: number;
  /** Cierre: botón de cierre del Toast, Escape con el foco dentro y fin de `duration` */
  onClose?: () => void;
}

export interface ToastProps extends ToastBaseProps {
  /** Nombre accesible del botón de cierre (por defecto "Cerrar notificación") */
  closeLabel?: string;
}

/** Acción del Snackbar: botón (con `onClick`) o enlace (con `href`) */
export interface SnackbarAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface SnackbarProps extends ToastBaseProps {
  /** Primer botón (Button de Figma). Con `{ label, onClick }` o un nodo propio. */
  action?: SnackbarAction | ReactNode;
  /** Segundo botón (Button 2 de Figma) */
  secondaryAction?: SnackbarAction | ReactNode;
  /**
   * Al activar una acción del tipo `{ label, onClick }` se llama también a `onClose` (por defecto `true`), porque el
   * Snackbar de Figma no tiene botón de cierre: la acción es la salida.
   */
  closeOnAction?: boolean;
}

export type ToasterPlacement = 'top-start' | 'top-center' | 'top-end' | 'bottom-start' | 'bottom-center' | 'bottom-end';

export interface ToasterProps extends HTMLAttributes<HTMLElement> {
  /** Esquina o borde donde se apilan los avisos (por defecto `bottom-end`) */
  placement?: ToasterPlacement;
  /** `fixed` al viewport (por defecto) o `absolute` dentro de un contenedor `relative` (documentación) */
  position?: 'fixed' | 'absolute';
  /** Nombre accesible de la región (por defecto "Notificaciones") */
  label?: string;
  children?: ReactNode;
}
