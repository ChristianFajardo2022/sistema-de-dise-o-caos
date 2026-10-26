import type { HTMLAttributes } from 'react';

/** Punto de un trazo, normalizado: `[x, y]` entre 0 y 1 respecto al ancho y alto del área de dibujo. */
export type SignaturePoint = [x: number, y: number];

/** Un trazo: los puntos entre que se apoya el puntero y se levanta. */
export type SignatureStroke = SignaturePoint[];

/** Valor de la firma: la lista de trazos, en el orden en que se dibujaron. Vacío = sin firma. */
export type SignatureValue = SignatureStroke[];

/** Orientación de Figma (`Position`): `horizontal` es una tarjeta; `vertical` es la pantalla de celular con la interfaz girada. */
export type SignaturePadOrientation = 'horizontal' | 'vertical';

/** Opciones al exportar la firma como imagen. */
export interface SignatureExportOptions {
  /** Color del trazo. Por defecto `#000000` (la firma exportada no depende del tema). */
  strokeColor?: string;
  /** Fondo de la imagen. Por defecto transparente. */
  background?: string;
  /** Ancho en px de la imagen. Por defecto 600. */
  width?: number;
  /** Alto en px de la imagen. Por defecto 200. */
  height?: number;
  /** Grosor del trazo en px de la imagen. Por defecto 3. */
  lineWidth?: number;
  /** Formato (`image/png` por defecto). */
  type?: string;
  /** Calidad 0–1 para formatos con pérdida. */
  quality?: number;
}

/** Métodos que expone el `ref` de SignaturePad. */
export interface SignaturePadHandle {
  /** Borra toda la firma (equivale al botón de la papelera). */
  clear: () => void;
  /** Quita el último trazo (equivale al botón de deshacer). */
  undo: () => void;
  /** `true` si no hay ningún trazo. */
  isEmpty: () => boolean;
  /** Los trazos actuales. */
  getValue: () => SignatureValue;
  /** La firma como data URL, o `null` si está vacía. */
  toDataURL: (options?: SignatureExportOptions) => string | null;
  /** El elemento raíz. */
  element: HTMLDivElement | null;
}

/** Textos de la interfaz (nombres accesibles incluidos). Todos tienen valor en español por defecto. */
export interface SignaturePadLabels {
  /** Texto guía visible sobre el área vacía. */
  placeholder?: string;
  /** Nombre accesible del área cuando está vacía. */
  empty?: string;
  /** Nombre accesible del área cuando hay firma. */
  signed?: string;
  /** Aviso (región de estado) al borrar. */
  cleared?: string;
  undo?: string;
  clear?: string;
  maximize?: string;
  close?: string;
  cancel?: string;
  create?: string;
}

export interface SignaturePadProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'children'> {
  /** Position de Figma. `horizontal` por defecto. */
  orientation?: SignaturePadOrientation;
  /** Trazos (controlado). Usar con `onValueChange`. */
  value?: SignatureValue;
  /** Trazos iniciales (no controlado). */
  defaultValue?: SignatureValue;
  /** Se llama con la lista completa de trazos al terminar un trazo, al deshacer y al borrar. */
  onValueChange?: (value: SignatureValue) => void;
  /** Deshabilitado: no se puede dibujar y los botones no actúan. */
  disabled?: boolean;
  /** Grosor del trazo en px (por defecto 2.5). */
  strokeWidth?: number;
  /** Textos de la interfaz; el español neutro es el valor por defecto. */
  labels?: SignaturePadLabels;
  /** Nombre del firmante (solo `vertical`, bloque "Name,cc"). */
  signerName?: string;
  /** Documento del firmante (solo `vertical`). */
  signerId?: string;
  /** Muestra el botón de maximizar (prop `Maximize` de Figma, apagada por defecto). */
  maximizable?: boolean;
  onMaximize?: () => void;
  /** Solo `vertical`: cierra la pantalla (el botón de cerrar de la columna). */
  onClose?: () => void;
  /** Solo `vertical`: botón "Cancelar". */
  onCancel?: () => void;
  /** Solo `vertical`: botón "Crear firma"; recibe los trazos. */
  onCreate?: (value: SignatureValue) => void;
  /** Solo `vertical`: con `true` (por defecto) "Crear firma" está inactivo mientras no haya firma. */
  requireSignature?: boolean;
  /** Clases adicionales para la raíz. */
  className?: string;
}
