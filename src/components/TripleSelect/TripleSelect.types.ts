import type { HTMLAttributes } from 'react';
import type { SelectOptionData } from '../Select/Select.types';

/** State de Figma (Type=Triple de "General input"). Solo para forzar el aspecto en documentación. */
export type TripleSelectState = 'default' | 'filled' | 'active' | 'burnt-in' | 'disabled' | 'error' | 'success';

/** Una de las tres secciones: un `Select` sin marco propio. */
export interface TripleSelectField {
  /** Nombre en el formulario: se envía el valor elegido con un input oculto. */
  name?: string;
  /** Label flotante de la sección. Es el nombre accesible de su combobox. */
  label: string;
  /** Texto que se ve con foco o abierto mientras no hay opción elegida. */
  placeholder?: string;
  /** Opciones de la lista de esta sección. */
  options: SelectOptionData[];
  /** Valor elegido (controlado). `null` = ninguno. */
  value?: string | null;
  /** Valor inicial (no controlado). */
  defaultValue?: string;
  /** Cambia al elegir una opción de esta sección. */
  onValueChange?: (value: string) => void;
  /** Agrega " | Opcional" después del label. */
  optional?: boolean;
}

/** Siempre tres secciones, como el tipo Triple de Figma. */
export type TripleSelectFields = readonly [TripleSelectField, TripleSelectField, TripleSelectField];

export interface TripleSelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'aria-label'> {
  /** Nombre accesible del grupo (no se dibuja). Obligatorio: describe qué se está eligiendo entre las tres secciones. */
  label: string;
  /** Las tres secciones, de izquierda a derecha. La API no depende de qué representen (fecha, lugar, rango…). */
  fields: TripleSelectFields;
  /** Mensaje de ayuda debajo del recuadro. */
  helperText?: string;
  /** Mensaje de error (tiene prioridad sobre éxito y ayuda). Marca `aria-invalid` en las tres secciones. */
  errorText?: string;
  /** Mensaje de éxito. */
  successText?: string;
  /** Deshabilita las tres secciones. */
  disabled?: boolean;
  /** Solo lectura = estado Burnt-In: se enfoca y se lee, no abre. */
  readOnly?: boolean;
  /** Ocupa el 100 % del ancho del contenedor (si no, 496, como Figma). */
  fullWidth?: boolean;
  /** Fuerza el aspecto de un estado (solo documentación). Nunca abre la lista. */
  state?: TripleSelectState;
}
