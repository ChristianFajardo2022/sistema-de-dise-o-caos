import type { HTMLAttributes, ReactNode, RefObject } from 'react';
import type { IconName } from '../Icon/Icon.types';
import type { InputState } from '../Input/Input.types';

/** State de Figma (Type=Dropdown de "General input"). Solo para forzar el aspecto en documentación. */
export type SelectState = InputState;

/**
 * Marco del campo.
 * - `field`: el campo completo (recuadro con borde, mensajes y tooltip), como Input.
 * - `none`: solo el disparador (label, valor y chevron) sin recuadro ni mensajes, para meterlo en un control compuesto
 *   (p. ej. los tres selectores de un mismo recuadro del Type=Triple). El contenedor pinta el borde y los mensajes.
 */
export type SelectFrame = 'field' | 'none';

/** Una opción de la lista. */
export interface SelectOptionData {
  /** Valor que se guarda y se envía con el formulario. Único en la lista. */
  value: string;
  /** Texto visible. También sirve para saltar escribiendo (typeahead). */
  label: string;
  /** Opción no seleccionable: se ve atenuada y las flechas la saltan. */
  disabled?: boolean;
  /** Ícono de 16 de la biblioteca CAOS a la izquierda del texto (el "Icono" del ítem "Dropdown list"). */
  icon?: IconName;
}

/** Props de `SelectOption`: forma declarativa de una opción como hijo de `Select`. */
export interface SelectOptionProps {
  /** Valor de la opción. */
  value: string;
  /** Texto visible (solo texto). */
  children: string;
  /** Opción no seleccionable. */
  disabled?: boolean;
  /** Ícono de 16 a la izquierda. */
  icon?: IconName;
}

export interface SelectProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange' | 'id' | 'placeholder'> {
  /** Texto del label flotante (obligatorio): es el nombre accesible del combobox y de la lista. */
  label: string;
  /** Agrega " | Opcional" después del label. */
  optional?: boolean;
  /** Texto que se ve en el campo, con foco o abierto, mientras no hay opción elegida. */
  placeholder?: string;
  /** Texto de ayuda en un ícono de información fuera del campo. */
  tooltip?: string;
  /** Mensaje de ayuda debajo del campo. */
  helperText?: string;
  /** Mensaje de error (tiene prioridad sobre éxito y ayuda). */
  errorText?: string;
  /** Mensaje de éxito. */
  successText?: string;
  /** Opciones como datos. Se suman (después) a las que lleguen como hijos `SelectOption`. */
  options?: SelectOptionData[];
  /** Opciones declarativas (`<SelectOption value="…">Texto</SelectOption>`). */
  children?: ReactNode;
  /** Valor elegido (controlado). `null` = ninguno. */
  value?: string | null;
  /** Valor inicial (no controlado). */
  defaultValue?: string;
  /** Cambia al elegir una opción (clic, Enter, Espacio, Tab o Alt + Flecha arriba). */
  onValueChange?: (value: string) => void;
  /** Cambia al abrir o cerrar la lista. */
  onOpenChange?: (open: boolean) => void;
  /** Nombre del campo en el formulario: se envía el `value` con un input oculto. */
  name?: string;
  /** Id del combobox (si no, se genera). */
  id?: string;
  /** Deshabilitado: no se enfoca ni se envía. */
  disabled?: boolean;
  /** Solo lectura (estado Burnt-In): se enfoca y se lee, pero no abre. */
  readOnly?: boolean;
  /** Marca el campo como obligatorio para tecnologías de apoyo (`aria-required`). La validación es de quien lo usa. */
  required?: boolean;
  /** Ocupa el 100 % del ancho del contenedor (si no, 320). */
  fullWidth?: boolean;
  /** Fuerza el aspecto de un estado (solo documentación). `active` dibuja la lista abierta en el flujo, debajo del campo. */
  state?: SelectState;
  /** Ver `SelectFrame`. Por defecto `field`. */
  frame?: SelectFrame;
  /**
   * Elemento al que se alinea y del que toma el ancho la lista (por defecto, el propio campo). Útil en controles
   * compuestos: PhoneInput (prefijo + número) o Triple (tres selectores en un recuadro) abren la lista bajo todo el control.
   */
  anchorRef?: RefObject<HTMLElement | null>;
  /** Prop "Scroll bar" del panel Dropdown: dibuja el riel de 6. Por defecto `true`, como Figma. */
  scrollbar?: boolean;
  /** Alto máximo de la lista (CSS). Por defecto `20rem`. */
  maxHeight?: string | number;
  /** Clases del elemento raíz. */
  className?: string;
}
