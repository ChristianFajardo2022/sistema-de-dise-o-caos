import type { HTMLAttributes } from 'react';
import type { InputState } from '../Input/Input.types';

/** State de Figma (Type=Number de "General input"). Solo para forzar el aspecto en documentación. */
export type PhoneInputState = InputState;

/** Un país de la lista de indicativos. */
export interface PhoneInputCountry {
  /** Identificador único del país (p. ej. código ISO `CO`). Es el valor del selector: dos países pueden compartir indicativo. */
  code: string;
  /** Indicativo internacional, con o sin `+` (`+57` o `57`). Es lo que se ve en el campo de prefijo. */
  dialCode: string;
  /** Nombre del país. Hoy no se muestra ni se anuncia: las opciones del prefijo usan solo `dialCode`. */
  label: string;
}

export interface PhoneInputProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'id' | 'placeholder'> {
  /** Label flotante del campo de número (obligatorio). También da nombre al grupo. */
  label: string;
  /** Label del campo de prefijo; es su nombre accesible. Por defecto `Indicativo`. */
  prefixLabel?: string;
  /** Texto del número que se ve con foco mientras está vacío. */
  placeholder?: string;
  /** Lista de países del selector. Por defecto una lista corta de ejemplo (+57, +1, +52, +34, +54). */
  countries?: PhoneInputCountry[];
  /** `code` del país elegido (controlado). `null` = ninguno. */
  countryCode?: string | null;
  /** `code` inicial (no controlado). Por defecto, el primero de `countries`. */
  defaultCountryCode?: string | null;
  /** Cambia al elegir otro país. Recibe el `code`. */
  onCountryCodeChange?: (code: string) => void;
  /** Número (controlado): solo dígitos, sin indicativo. */
  value?: string;
  /** Número inicial (no controlado). */
  defaultValue?: string;
  /** Cambia al escribir. Recibe solo los dígitos, sin espacios de agrupación. */
  onValueChange?: (value: string) => void;
  /** Muestra el número agrupado con espacios (3, 3, 4…). El valor entregado sigue siendo solo dígitos. */
  groupDigits?: boolean;
  /** Máximo de dígitos del número. Por defecto 15. */
  maxDigits?: number;
  /** Mensaje de ayuda debajo del control. */
  helperText?: string;
  /** Mensaje de error (tiene prioridad sobre éxito y ayuda). */
  errorText?: string;
  /** Mensaje de éxito. */
  successText?: string;
  /** Agrega " | Opcional" a los labels. */
  optional?: boolean;
  /** Nombre del campo en el formulario: un input oculto envía `+<indicativo><número>` (E.164). */
  name?: string;
  /** Id del campo de número (si no, se genera). */
  id?: string;
  /** Deshabilitado: no se enfoca ni se envía. */
  disabled?: boolean;
  /** Solo lectura (estado Burnt-In). */
  readOnly?: boolean;
  /** Marca el número como obligatorio (`required` nativo en el input y `aria-required` en el prefijo). */
  required?: boolean;
  /** Ocupa el 100 % del ancho del contenedor (si no, 320). */
  fullWidth?: boolean;
  /** Fuerza el aspecto de un estado (solo documentación). `active` dibuja además la lista de muestra debajo. */
  state?: PhoneInputState;
  /** Clases del elemento raíz. */
  className?: string;
}
