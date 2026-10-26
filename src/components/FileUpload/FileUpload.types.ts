import type { HTMLAttributes, ReactNode } from 'react';
import type { FileDropzoneProps } from '../FileDropzone/FileDropzone.types';
import type { FileUploadStatus } from '../FileUploadItem/FileUploadItem.types';
import type { IconName } from '../Icon/Icon.types';

/** Un archivo de la lista: lo que necesita un FileUploadItem más un `id` estable. */
export interface FileUploadEntry {
  /** Identificador estable del archivo. Se entrega en `onRemove`, `onRetry` y `onDownload`. */
  id: string;
  /** Nombre del archivo (prop `title` del FileUploadItem). */
  name: ReactNode;
  /** Estado de la carga: `loading`, `complete`, `error`, `loading-error` o `alert`. Por defecto `loading`. */
  status?: FileUploadStatus;
  /** Progreso de 0 a 100 (`loading` y `alert`). */
  progress?: number;
  /** Texto del estado bajo el nombre. Por defecto el de cada estado del FileUploadItem. */
  message?: ReactNode;
  /** Ícono del avatar en `loading`. Por defecto `folder`. */
  icon?: IconName;
}

type DropzoneForwardedProps = Pick<
  FileDropzoneProps,
  | 'accept'
  | 'maxSize'
  | 'multiple'
  | 'disabled'
  | 'title'
  | 'actionText'
  | 'specifications'
  | 'maxSizeLabel'
  | 'onFilesSelected'
  | 'onFilesRejected'
  | 'rejectionMessage'
>;

export interface FileUploadProps extends DropzoneForwardedProps, Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children' | 'onSelect'> {
  /** Archivos de la lista (slot Container de Figma). Sin archivos la lista no se dibuja (prop File card de Figma). */
  items?: FileUploadEntry[];
  /** Se llama con el `id` al pulsar Eliminar de un archivo; el foco vuelve al área para soltar. Sin él no hay botón Eliminar. */
  onRemove?: (id: string) => void;
  /** Se llama con el `id` al pulsar Reintentar (`loading-error` y `alert`). Sin él no hay botón. */
  onRetry?: (id: string) => void;
  /** Se llama con el `id` al pulsar Descargar (`complete` y `error`). Sin él no hay botón. */
  onDownload?: (id: string) => void;
  /** Nombre accesible de la lista de archivos. Por defecto "Archivos". */
  listLabel?: string;
  /** Props del FileDropzone que no tienen prop propia aquí (`name`, `id`, `aria-*`, `rootProps`…). */
  dropzoneProps?: Omit<FileDropzoneProps, keyof DropzoneForwardedProps | 'ref' | 'className' | 'state'>;
  /** Clases adicionales para la raíz. */
  className?: string;
}
