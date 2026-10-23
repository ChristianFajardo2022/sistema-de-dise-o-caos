import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

/** Size de Figma (set 18445:46293): `sm` mide 40 de alto (texto 14/18) y `md` 56 (texto 32/36). */
export type InlineFieldSize = 'sm' | 'md';

/**
 * State de Figma. Solo para forzar el aspecto en documentación: en uso real el estado sale del foco,
 * `disabled` y de los mensajes.
 * - `active`: "Active/Filled".
 * - `success-value`: "Success placeholder" (label neutro y texto en verde).
 */
export type InlineFieldState = 'default' | 'active' | 'success' | 'success-value' | 'error' | 'disabled';

export interface InlineFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** Texto del label flotante (obligatorio). Es la prop `Label` de Figma. */
  label: string;
  /** Agrega " | Opcional" después del label. */
  optional?: boolean;
  /** Size de Figma: `sm` (alto 40, por defecto) o `md` (alto 56, texto grande). */
  size?: InlineFieldSize;
  /**
   * Chip a la derecha del texto (el "Container text" de Figma): una unidad, moneda o etiqueta corta
   * ("COP", "kg", "%"). Se asocia al campo con `aria-describedby`.
   */
  suffix?: ReactNode;
  /** Mensaje de ayuda debajo del campo (la prop `Help text` de Figma). */
  helperText?: string;
  /** Mensaje de error (tiene prioridad sobre éxito y ayuda). */
  errorText?: string;
  /** Mensaje de éxito. */
  successText?: string;
  /** Ocupa el 100 % del ancho del contenedor. Si no, mide 320. */
  fullWidth?: boolean;
  /** Fuerza el aspecto de un estado (solo documentación). */
  state?: InlineFieldState;
  /**
   * Atributos para el contenedor raíz (`data-*`, `id`, `style`, etc.), p. ej. `data-figma` para medir contra Figma.
   * `className` se mezcla con el de la raíz; los atributos nativos sueltos siguen yendo al `<input>`.
   */
  rootProps?: HTMLAttributes<HTMLDivElement> & { [K in `data-${string}`]?: string | number | boolean };
}
