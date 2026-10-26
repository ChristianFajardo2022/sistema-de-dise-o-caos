import type { HTMLAttributes, InputHTMLAttributes, ReactNode, Ref } from 'react';

/**
 * State de Figma (Input file upload 11438:5774). Solo fuerza el aspecto para documentación: en uso normal Hover sale
 * de `:hover` (o de arrastrar un archivo encima), Focus del foco con teclado del input y Disabled de `disabled`.
 * `default` fija el aspecto en reposo (sin reaccionar al puntero).
 */
export type FileDropzoneState = 'default' | 'hover' | 'focus' | 'disabled';

/** Motivo por el que se descarta un archivo: tipo no admitido, tamaño mayor al máximo o más de un archivo sin `multiple`. */
export type FileRejectionReason = 'type' | 'size' | 'count';

/** Archivo descartado y su motivo. */
export interface FileRejection {
  file: File;
  reason: FileRejectionReason;
}

/** Atributos de la raíz (`<label>`): `data-*`, `id`, `style`, `ref`… */
export type FileDropzoneRootProps = HTMLAttributes<HTMLLabelElement> & {
  ref?: Ref<HTMLLabelElement>;
} & { [K in `data-${string}`]?: string | number | boolean };

export interface FileDropzoneProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'className' | 'children' | 'title' | 'size' | 'value' | 'defaultValue' | 'accept' | 'multiple' | 'onChange'
  > {
  /**
   * Tipos admitidos, con la sintaxis del atributo `accept` nativo: extensiones (`.pdf`), tipos MIME (`application/pdf`)
   * o comodines (`image/*`), separados por comas. Se valida también al soltar archivos (el diálogo nativo solo filtra
   * la lista). Sin él se admite cualquier tipo.
   */
  accept?: string;
  /** Tamaño máximo por archivo, en bytes. Los archivos mayores se descartan con motivo `size`. Sin él no hay límite. */
  maxSize?: number;
  /** Permite elegir o soltar varios archivos. Por defecto `false`: con varios se toma el primero. */
  multiple?: boolean;
  /** State de Figma forzado (solo documentación). */
  state?: FileDropzoneState;
  /** Texto principal (capa Heading de Figma). Por defecto "Selecciona tu". */
  title?: ReactNode;
  /** Texto en color de enlace tras el título (segunda capa Heading). Por defecto "archivo". */
  actionText?: ReactNode;
  /**
   * Tipos admitidos como texto (capa Specifications, p. ej. "PDF, JPG. "). Por defecto sale de `accept`
   * ("PDF, JPG."); sin `accept` no se muestra.
   */
  specifications?: ReactNode;
  /**
   * Límite como texto (capa "Máx. 23 GB"). Por defecto sale de `maxSize` ("Máx. 23 GB"); sin `maxSize` no se muestra.
   */
  maxSizeLabel?: ReactNode;
  /** Se llama con los archivos válidos, ya filtrados por tipo, tamaño y cantidad (al elegirlos o al soltarlos). */
  onFilesSelected?: (files: File[]) => void;
  /** Se llama con los archivos descartados y su motivo. */
  onFilesRejected?: (rejections: FileRejection[]) => void;
  /**
   * Texto que se anuncia a lectores de pantalla cuando se descartan archivos (región aria-live polite).
   * Por defecto: "<n> archivo(s) no se agregó: …" con el motivo.
   */
  rejectionMessage?: (rejections: FileRejection[]) => string;
  /** Atributos de la raíz. */
  rootProps?: FileDropzoneRootProps;
  /** Clases adicionales para la raíz. */
  className?: string;
}
