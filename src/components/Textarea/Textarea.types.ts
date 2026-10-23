import type { HTMLAttributes, TextareaHTMLAttributes } from 'react';
import type { InputState } from '../Input/Input.types';

/**
 * State de Figma (tipo Coment de General input). Solo para forzar el aspecto en documentación:
 * en uso real el estado sale del foco, `disabled`, `readOnly` y de los mensajes.
 */
export type TextareaState = InputState;

/** Valores de la propiedad CSS `resize` que expone el componente. */
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> {
  /** Texto del label flotante (obligatorio). */
  label: string;
  /** Agrega " | Opcional" después del label. */
  optional?: boolean;
  /** Texto de ayuda en un ícono de información fuera del campo. */
  tooltip?: string;
  /** Mensaje de ayuda debajo del campo. */
  helperText?: string;
  /** Mensaje de error (tiene prioridad sobre éxito y ayuda). */
  errorText?: string;
  /** Mensaje de éxito. */
  successText?: string;
  /** Ocupa el 100 % del ancho del contenedor. Si no, mide 320. */
  fullWidth?: boolean;
  /** Fuerza el aspecto de un estado (solo documentación). */
  state?: TextareaState;
  /**
   * Líneas visibles. Con `autoResize` es el mínimo. Por defecto 1: con el contador, el campo mide
   * 88 de alto, como en Figma.
   */
  rows?: number;
  /** Con `autoResize`, número de líneas a partir del cual deja de crecer y aparece el scroll. */
  maxRows?: number;
  /**
   * El campo crece con el contenido. Usa `field-sizing: content` si el navegador lo soporta y,
   * si no, lo calcula en JavaScript. Desactiva `resize`.
   */
  autoResize?: boolean;
  /** Control del tirador de tamaño. Por defecto `vertical`; con `autoResize` siempre es `none`. */
  resize?: TextareaResize;
  /**
   * Atributos para el contenedor raíz (`data-*`, `id`, `style`, etc.), p. ej. `data-figma` para medir contra Figma.
   * `className` se mezcla con el de la raíz; los atributos nativos sueltos siguen yendo al `<textarea>`.
   */
  rootProps?: HTMLAttributes<HTMLDivElement> & { [K in `data-${string}`]?: string | number | boolean };
}
