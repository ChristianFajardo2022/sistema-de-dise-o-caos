import type { HTMLAttributes, ReactNode, RefObject } from 'react';
import type { IconName } from '../Icon/Icon.types';
import type { InputState } from '../Input/Input.types';
import type { FieldRootProps } from '../Field/Field.types';

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
  /** Texto de la opción en la lista. Es su nombre accesible y sirve para saltar escribiendo (typeahead). */
  label: string;
  /** Texto en el campo cuando está elegida, si es distinto del de la lista (p. ej. "+57" para "Colombia +57"). */
  displayLabel?: string;
  /** Opción no seleccionable: se ve atenuada y las flechas la saltan. */
  disabled?: boolean;
  /** Ícono de 16 de la biblioteca CAOS a la izquierda del texto (el "Icono" del ítem "Dropdown list"). */
  icon?: IconName;
}

/** Props de `SelectOption`: forma declarativa de una opción como hijo de `Select`. */
export interface SelectOptionProps {
  /** Valor de la opción. */
  value: string;
  /** Texto de la opción en la lista (solo texto). */
  children: string;
  /** Texto en el campo cuando está elegida, si es distinto del de la lista. */
  displayLabel?: string;
  /** Opción no seleccionable. */
  disabled?: boolean;
  /** Ícono de 16 a la izquierda. */
  icon?: IconName;
}

/** Atributos del chevron de un campo (un `<span>`). */
export type FieldChevronProps = HTMLAttributes<HTMLSpanElement> & { [K in `data-${string}`]?: string | number | boolean };

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
  /** Lista abierta (controlado). Deshabilitado o en solo lectura no abre aunque sea `true`. */
  open?: boolean;
  /** Lista abierta al montar (no controlado). */
  defaultOpen?: boolean;
  /** Cambia al abrir o cerrar la lista (teclado, puntero, elegir, Esc o perder el foco). */
  onOpenChange?: (open: boolean) => void;
  /** Nombre del campo en el formulario: se envía el `value` con un input oculto. */
  name?: string;
  /** Id del combobox (si no, se genera). */
  id?: string;
  /** Deshabilitado: no se enfoca ni se envía. */
  disabled?: boolean;
  /** Solo lectura (estado Burnt-In): se enfoca y se lee, pero no abre. Sin valor, el label se queda dentro. */
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
  /**
   * Atributos del chevron (`data-*`, `className`…). Sirve a los compuestos para nombrar la parte de Figma
   * (`data-figma-part`, por defecto `Icon Right`; TripleSelect usa `Icon 1`, `Icon 2` e `Icon 3`).
   */
  chevronProps?: FieldChevronProps;
  /** Atributos para la raíz (`data-*`, `style`, `ref`…); se suman al resto de props, que también van a la raíz. */
  rootProps?: FieldRootProps;
}
