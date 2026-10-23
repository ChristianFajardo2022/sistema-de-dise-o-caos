import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import type { IconName } from '../Icon/Icon.types';

/**
 * State de Figma (File card 11557:17694). No es un estado de interacción: es el estado de la carga.
 * - `loading`: subiendo, con barra de progreso verde y acción Eliminar.
 * - `complete`: terminada (tick verde), Descargar y Eliminar.
 * - `error`: archivo con error (cruz roja), Descargar y Eliminar.
 * - `loading-error`: la carga falló (cruz roja), Reintentar y Eliminar.
 * - `alert`: carga con advertencia (aviso amarillo), barra amarilla, Reintentar y Eliminar.
 */
export type FileUploadStatus = 'loading' | 'complete' | 'error' | 'loading-error' | 'alert';

export interface FileUploadItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** Nombre del archivo (prop Tittle de Figma). Se recorta a una línea y nombra la barra y las acciones. */
  title: ReactNode;
  /** State de Figma. Por defecto `loading`. */
  status?: FileUploadStatus;
  /**
   * Texto del estado bajo el nombre (props Alert, Error state y Loading error de Figma). Se anuncia a lectores de
   * pantalla al cambiar (aria-live polite). Por defecto: "Cargando", "Carga completa", "Error", "Error de carga" o
   * "Carga con advertencias" según `status`.
   */
  message?: ReactNode;
  /** Progreso de 0 a 100 de la barra (solo `loading` y `alert`). Por defecto 0. */
  progress?: number;
  /** Ícono del Avatar en `loading`. Por defecto `folder`. Los demás estados usan su ícono de estado. */
  icon?: IconName;
  /** Acción Eliminar (todas las variantes). Se dibuja si se pasa. */
  onDelete?: MouseEventHandler<HTMLButtonElement>;
  /** Acción Descargar (prop Download de Figma; `complete` y `error`). Se dibuja si se pasa. */
  onDownload?: MouseEventHandler<HTMLButtonElement>;
  /** Acción Reintentar (`loading-error` y `alert`). Se dibuja si se pasa. */
  onRetry?: MouseEventHandler<HTMLButtonElement>;
  /**
   * Nombre accesible completo de Eliminar. Por defecto "Eliminar <título>" si el título es texto; si no, "Eliminar"
   * con el título como descripción.
   */
  deleteLabel?: string;
  /** Nombre accesible completo de Descargar. Por defecto "Descargar <título>" (mismo criterio que `deleteLabel`). */
  downloadLabel?: string;
  /** Nombre accesible completo de Reintentar. Por defecto "Reintentar <título>" (mismo criterio que `deleteLabel`). */
  retryLabel?: string;
  /** Clases adicionales para la raíz. */
  className?: string;
}
