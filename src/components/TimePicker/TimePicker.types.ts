import type { HTMLAttributes, InputHTMLAttributes } from 'react';
import type { FieldRootProps } from '../Field/Field.types';
import type { InputState } from '../Input/Input.types';

/** Ciclo horario visible. En `24` se oculta el selector AM/PM. */
export type TimePickerHourCycle = 12 | 24;

/** State de Figma, el mismo de Input. Solo para forzar el aspecto en documentación. */
export type TimePickerState = InputState;

export interface TimePickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children' | 'aria-label'> {
  /**
   * Hora en formato 24 h `"HH:mm"` (p. ej. `"14:05"`), independiente del formato visible.
   * Cadena vacía = sin hora completa. Controlado cuando se pasa.
   */
  value?: string;
  /** Valor inicial (24 h `"HH:mm"`) en modo no controlado. */
  defaultValue?: string;
  /**
   * Se llama con `"HH:mm"` (24 h) cuando hora, minutos y (en 12 h) AM/PM forman una hora válida,
   * y con `""` cuando dejan de formarla.
   */
  onValueChange?: (value: string) => void;
  /** @deprecated Usar `onValueChange` (mismo valor). Se sigue llamando por compatibilidad. */
  onChange?: (value: string) => void;
  /** Ciclo horario: `12` (1-12 con AM/PM, por defecto) o `24` (0-23, sin AM/PM). */
  hourCycle?: TimePickerHourCycle;
  /** Salto de las flechas en los minutos (por defecto 1). Escribir acepta cualquier minuto 0-59. */
  minuteStep?: number;
  /**
   * Nombre accesible del grupo. Figma no lo dibuja: los campos tienen su propio label visible (`hourLabel`,
   * `minuteLabel`). Por defecto "Seleccionar hora".
   */
  label?: string;
  /** Label flotante del campo de hora. Por defecto "Hora". */
  hourLabel?: string;
  /** Label flotante del campo de minutos. Por defecto "Minutos". */
  minuteLabel?: string;
  /** Nombre accesible del par AM/PM. Por defecto "AM/PM". */
  periodLabel?: string;
  /** Placeholder del campo de hora (se ve con foco y vacío). */
  hourPlaceholder?: string;
  /** Placeholder del campo de minutos (se ve con foco y vacío). */
  minutePlaceholder?: string;
  /** Atributos extra para el `<input>` de la hora (p. ej. `data-*`). */
  hourInputProps?: InputHTMLAttributes<HTMLInputElement>;
  /** Atributos extra para el `<input>` de los minutos. */
  minuteInputProps?: InputHTMLAttributes<HTMLInputElement>;
  /** Mensaje de ayuda debajo del grupo. */
  helperText?: string;
  /** Mensaje de error (tiene prioridad sobre éxito y ayuda). */
  errorText?: string;
  /** Mensaje de éxito. */
  successText?: string;
  /** Texto de ayuda en un ícono de información a la derecha del grupo. */
  tooltip?: string;
  /** Obligatorio: `required` nativo en los campos de hora y minutos. */
  required?: boolean;
  /** Agrega " | Opcional" a los labels de hora y minutos. */
  optional?: boolean;
  /** Deshabilita los tres controles. */
  disabled?: boolean;
  /** Solo lectura = estado Burnt-In: se puede enfocar y leer, no cambiar. */
  readOnly?: boolean;
  /** Nombre para formularios: se envía un campo oculto con el valor `"HH:mm"`. */
  name?: string;
  /** Ocupa el 100 % del ancho del contenedor (por defecto 432 px, como Figma). */
  fullWidth?: boolean;
  /** Fuerza el aspecto de un estado (solo documentación). */
  state?: TimePickerState;
  /** Atributos para la raíz (`data-*`, `style`, `ref`…); se suman al resto de props, que también van a la raíz. */
  rootProps?: FieldRootProps;
}
