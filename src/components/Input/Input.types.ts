import type { InputHTMLAttributes, ReactNode } from 'react';
import type { FieldRootProps } from '../Field/Field.types';

/** Type de Figma: Text, Password, Search y Search header. */
export type InputVariant = 'text' | 'password' | 'search' | 'search-header';

/** State de Figma. Solo para forzar el aspecto en documentación. */
export type InputState = 'default' | 'filled' | 'active' | 'burnt-in' | 'disabled' | 'error' | 'success';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** Type de Figma. Para `text` se puede pasar el `type` nativo (email, tel, url). */
  variant?: InputVariant;
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
  /** Ícono opcional de 16px a la izquierda. */
  leftIcon?: ReactNode;
  /** Ícono opcional de 16px a la derecha. */
  rightIcon?: ReactNode;
  /** Ocupa el 100 % del ancho del contenedor. */
  fullWidth?: boolean;
  /** Fuerza el aspecto de un estado (solo documentación). */
  state?: InputState;
  /** Cambia el valor (recibe el texto). Se llama junto con el `onChange` nativo. */
  onValueChange?: (value: string) => void;
  /** Atributos para la raíz (`data-*`, `style`, `ref`…). El `ref` del componente y los atributos nativos van al `<input>`. */
  rootProps?: FieldRootProps;
}
