import type { HTMLAttributes, InputHTMLAttributes, Ref } from 'react';
import type { CalendarBaseProps, DateRange } from '../Calendar';
import type { FieldRootProps } from '../Field/Field.types';
import type { InputState } from '../Input/Input.types';

// Figma: 8096:3344
/** State de Figma, el mismo de Input. Solo para forzar el aspecto en documentación; `active` dibuja el calendario abierto en el flujo. */
export type DatePickerState = InputState;

/** Props del Calendar que se pueden afinar desde el DatePicker (la selección, el mes y la apertura los maneja el DatePicker). */
export type DatePickerCalendarProps = Pick<
  CalendarBaseProps,
  'weekStartsOn' | 'showOutsideDays' | 'today' | 'defaultMonth' | 'labels' | 'defaultView' | 'className'
>;

export interface DatePickerBaseProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children' | 'placeholder'> {
  /** Texto del label flotante (obligatorio). */
  label: string;
  /** Agrega " | Opcional" después del label. */
  optional?: boolean;
  /** Texto de ayuda en un ícono de información fuera del campo. */
  tooltip?: string;
  /** Mensaje de ayuda debajo del campo. */
  helperText?: string;
  /** Mensaje de error (tiene prioridad sobre la validación interna, el éxito y la ayuda). */
  errorText?: string;
  /** Mensaje de éxito. */
  successText?: string;
  /** Placeholder (se ve con foco). Por defecto, la pista del idioma: "dd/mm/aaaa" en español. */
  placeholder?: string;
  /** Idioma del formato y del calendario (`Intl`). Por defecto `es` (dd/mm/aaaa). */
  locale?: string;
  /** Formato propio de una fecha. Si se pasa, conviene pasar también `parse`. */
  format?: (date: Date) => string;
  /** Lectura propia del texto escrito. Devuelve `null` si no es una fecha válida. */
  parse?: (text: string) => Date | null;
  /** Fecha mínima (inclusive). Pasa al Calendar y valida lo escrito. */
  minDate?: Date;
  /** Fecha máxima (inclusive). Pasa al Calendar y valida lo escrito. */
  maxDate?: Date;
  /** Deshabilita días puntuales. Pasa al Calendar y valida lo escrito. */
  isDateDisabled?: (date: Date) => boolean;
  /** Pie con Cancelar y Aplicar (como Figma). Sin él, elegir un día (o el fin del rango) aplica y cierra. Por defecto `true`. */
  showActions?: boolean;
  /** Calendario abierto (controlado). */
  open?: boolean;
  /** Calendario abierto al montar (no controlado). */
  defaultOpen?: boolean;
  /** Se abre o se cierra el calendario. */
  onOpenChange?: (open: boolean) => void;
  /** Ajustes del Calendar: `today`, `defaultMonth` (mes al abrir sin fecha), `weekStartsOn`, `labels`… */
  calendarProps?: DatePickerCalendarProps;
  /** Nombre accesible del botón del calendario. Por defecto "Elegir fecha" ("Elegir fechas" en rango). */
  pickerLabel?: string;
  /** Mensaje cuando lo escrito no es una fecha. Por defecto "Escribe una fecha válida (dd/mm/aaaa)". */
  invalidDateText?: string;
  /** Mensaje cuando la fecha escrita está fuera de `minDate`/`maxDate` o deshabilitada. */
  unavailableDateText?: string;
  /** Fuerza el aspecto de un estado (solo documentación). */
  state?: DatePickerState;
  /** Deshabilitado: no se escribe ni se abre. */
  disabled?: boolean;
  /** Solo lectura (Burnt-In de Figma): muestra el valor y no se abre. */
  readOnly?: boolean;
  /** Obligatorio (va al input de texto). */
  required?: boolean;
  /** Ocupa el 100 % del ancho del contenedor. */
  fullWidth?: boolean;
  /** Nombre del campo en el formulario: se envía en un input oculto en ISO (`2026-10-14`; rango `2026-10-12/2026-11-04`). */
  name?: string;
  /** id del input de texto (el label lo usa). */
  id?: string;
  /** Props extra del input de texto (autoComplete, onBlur…). */
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'type'>;
  /** @deprecated El `ref` del componente ya va al input de texto. Se conserva como alias: recibe el mismo nodo. */
  inputRef?: Ref<HTMLInputElement>;
  /** Atributos para la raíz (`data-*`, `style`, `ref`…); se suman al resto de props, que también van a la raíz. */
  rootProps?: FieldRootProps;
}

/** Una fecha. */
export interface DatePickerSingleProps extends DatePickerBaseProps {
  mode?: 'single';
  /** Fecha elegida (controlada). */
  value?: Date | null;
  /** Fecha inicial (no controlada). */
  defaultValue?: Date | null;
  /** Cambia la fecha (al aplicar en el calendario o al escribir una fecha completa y válida). */
  onValueChange?: (value: Date | null) => void;
  /** @deprecated Usar `onValueChange` (mismo valor). Se sigue llamando por compatibilidad. */
  onChange?: (value: Date | null) => void;
}

/** Rango de fechas: el texto es "dd/mm/aaaa – dd/mm/aaaa" y el calendario muestra dos meses. */
export interface DatePickerRangeProps extends DatePickerBaseProps {
  mode: 'range';
  value?: DateRange;
  defaultValue?: DateRange;
  /** Cambia el rango (al aplicar o al escribir un rango completo y válido). */
  onValueChange?: (value: DateRange) => void;
  /** @deprecated Usar `onValueChange` (mismo valor). Se sigue llamando por compatibilidad. */
  onChange?: (value: DateRange) => void;
}

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;
