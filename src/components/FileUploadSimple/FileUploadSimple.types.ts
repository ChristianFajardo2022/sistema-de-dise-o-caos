import type { HTMLAttributes, ReactNode } from 'react';
import type { AlertProps } from '../Alert/Alert.types';
import type { FileRejection } from '../FileDropzone/FileDropzone.types';

// Figma: 21407:3920
/**
 * Type + State de Figma (File upload simple-2) como un solo estado:
 * - `idle`: zona para soltar (Type=Default, State=Default).
 * - `uploading`: progreso dentro del recuadro (Type=Uploading).
 * - `loaded`: archivo cargado (State=Loaded).
 * - `error`: aspecto de reposo; el motivo se muestra con `alert`.
 */
export type FileUploadSimpleStatus = 'idle' | 'uploading' | 'loaded' | 'error';

// Figma: 21412:4523
/**
 * State de los sets de Figma (File upload simple: Default, Hover, Focus, Inactive). Solo fuerza el aspecto
 * para documentación: en uso normal sale de `:hover`, `:focus-visible` y `disabled`.
 */
export type FileUploadSimpleState = 'default' | 'hover' | 'focus' | 'disabled';

/** Archivo mostrado: un `File` o cualquier objeto con nombre y, opcionalmente, tamaño en bytes. */
export interface FileUploadSimpleFile {
  name: string;
  /** Tamaño en bytes (se muestra como "100 KB"). */
  size?: number;
}

export interface FileUploadSimpleProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children' | 'defaultValue' | 'onChange'> {
  /** Tipos admitidos, con la sintaxis de `accept` nativo (`.pdf`, `image/*`). También se valida al soltar. */
  accept?: string;
  /** Tamaño máximo en bytes. Los archivos mayores se descartan y llegan a `onFilesRejected`. */
  maxSize?: number;
  /** Texto principal de la zona (prop Title de Figma). Por defecto "Selecciona tu". */
  title?: ReactNode;
  /** Texto en color de enlace tras el título (prop Document de Figma). Por defecto "archivo". */
  actionText?: ReactNode;
  /** Tipos admitidos como texto (prop Format de Figma). Por defecto sale de `accept`. */
  formatsText?: ReactNode;
  /** Límite como texto (prop Size de Figma). Por defecto sale de `maxSize`. */
  sizeText?: ReactNode;
  /** Archivo actual (controlado). `null` es "sin archivo". */
  file?: FileUploadSimpleFile | null;
  /** Archivo inicial (no controlado). */
  defaultFile?: FileUploadSimpleFile | null;
  /** Se llama con el archivo válido elegido o soltado, y con `null` al eliminar. */
  onFileChange?: (file: File | null) => void;
  /** Estado (controlado). Sin él, elegir un archivo pasa a `loaded` y eliminar vuelve a `idle`. */
  status?: FileUploadSimpleStatus;
  /** Estado inicial (no controlado). Por defecto `idle`, o `loaded` si hay `defaultFile`. */
  defaultStatus?: FileUploadSimpleStatus;
  /** Progreso de la carga, de 0 a 100 (solo en `uploading`). Por defecto 0. */
  progress?: number;
  /** Botón eliminar del progreso (cancela la carga). */
  onRemove?: () => void;
  /** Se llama con el archivo nuevo cuando reemplaza al cargado ("volver a cargar" o soltarlo encima). */
  onReplace?: (file: File) => void;
  /** Se llama con los archivos descartados y su motivo. */
  onFilesRejected?: (rejections: FileRejection[]) => void;
  /** Deshabilita la zona (State=Inactive de Figma). */
  disabled?: boolean;
  /** Fuerza un State de Figma para documentación. */
  state?: FileUploadSimpleState;
  /** Prop Alert de Figma: mensaje bajo el recuadro (éxito, error…). Sin él no se dibuja. */
  alert?: Omit<AlertProps, 'className'> | null;
  /** Texto del enlace del estado cargado. Por defecto "volver a cargar". */
  replaceText?: string;
  /** Nombre accesible del botón eliminar. Por defecto "Eliminar <archivo>". */
  removeLabel?: string;
  /** `name` del input de archivo. */
  name?: string;
  /** Clases adicionales para la raíz. */
  className?: string;
}
