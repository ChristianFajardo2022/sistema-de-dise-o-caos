import type { HTMLAttributes } from 'react';
import type { DigitInputSize } from '../DigitInput';

/**
 * State de Figma (Type=Code de "General input"). Solo para forzar el aspecto en documentación:
 * en uso real el estado sale de la interacción (foco, `disabled`, `readOnly`) y de los mensajes.
 * `active` cubre "Active/Focus", `burnt-in` es solo lectura y "Helper text" es `default` con `helperText`.
 */
export type CodeInputState = 'default' | 'filled' | 'active' | 'burnt-in' | 'disabled' | 'error' | 'success';

export interface CodeInputProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'children' | 'role'> {
  /** Nombre del grupo (obligatorio). Se ve encima de las casillas salvo con `hideLabel`. */
  label: string;
  /** Oculta el label a la vista y lo deja para lectores de pantalla (Figma no lo dibuja en Type=Code). */
  hideLabel?: boolean;
  /** Número de casillas. Por defecto 6. */
  length?: number;
  /** Valor controlado: solo dígitos, sin huecos (la casilla N muestra el carácter N). */
  value?: string;
  /** Valor inicial (no controlado). */
  defaultValue?: string;
  /** Se llama con el código completo (solo dígitos) cada vez que cambia. */
  onValueChange?: (value: string) => void;
  /** Se llama una vez cuando se llenan todas las casillas (al pasar de incompleto a completo). */
  onComplete?: (code: string) => void;
  /** Mensaje de ayuda debajo de las casillas. */
  helperText?: string;
  /** Mensaje de error (tiene prioridad sobre éxito y ayuda). Marca las casillas con aria-invalid. */
  errorText?: string;
  /** Mensaje de éxito (State=Success). */
  successText?: string;
  /** Deshabilita todas las casillas. */
  disabled?: boolean;
  /** Solo lectura (State=Burnt-In): el código se lee y se recorre con flechas, pero no se edita. */
  readOnly?: boolean;
  /** Ocupa el 100 % del ancho del contenedor (por defecto 320px, como Input). */
  fullWidth?: boolean;
  /** Size de las casillas (átomo DigitInput). Por defecto 56. */
  size?: DigitInputSize;
  /** Carácter que se ve en cada casilla vacía (p. ej. "0"). Opcional. */
  placeholder?: string;
  /** Si se pasa, el código viaja en el formulario en un input oculto con este `name`. */
  name?: string;
  /** Enfoca la primera casilla libre al montar. */
  autoFocus?: boolean;
  /** Nombre accesible de cada casilla. Por defecto "Dígito N de M". */
  getDigitLabel?: (index: number, length: number) => string;
  /** Fuerza el aspecto de un estado (solo documentación). */
  state?: CodeInputState;
}
