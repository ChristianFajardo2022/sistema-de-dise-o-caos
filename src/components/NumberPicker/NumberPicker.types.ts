import type { InputHTMLAttributes } from 'react';
import type { FieldRootProps } from '../Field/Field.types';

/** Size de Figma (set 12609:18389): `sm` mide 56 de alto y `md` 48, tal como están en el archivo. */
export type NumberPickerSize = 'sm' | 'md';

/**
 * State de Figma. Solo para forzar el aspecto en documentación: en uso real el estado sale
 * del foco, `disabled` y `readOnly`. `active` cubre "Active/Focus" y `burnt-in` es el solo lectura.
 */
export type NumberPickerState = 'default' | 'filled' | 'active' | 'burnt-in' | 'disabled';

type NumberPickerBaseProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step' | 'children' | 'role'
> & {
  /** Size de Figma: `sm` (alto 56, por defecto) o `md` (alto 48). */
  size?: NumberPickerSize;
  /** Valor controlado. `undefined` deja el campo vacío. */
  value?: number;
  /** Valor inicial (no controlado). */
  defaultValue?: number;
  /** Se llama al cambiar el valor (botones, teclado o escritura). Recibe `undefined` si el campo queda vacío. */
  onValueChange?: (value: number | undefined) => void;
  /** Valor mínimo. Con él, el botón − se deshabilita al llegar. */
  min?: number;
  /** Valor máximo. Con él, el botón + se deshabilita al llegar. */
  max?: number;
  /** Incremento de los botones y de las flechas. Por defecto 1. */
  step?: number;
  /** Incremento de RePág y AvPág. Por defecto 10 × `step`. */
  largeStep?: number;
  /** Texto accesible del botón −. Por defecto "Disminuir". */
  decrementLabel?: string;
  /** Texto accesible del botón +. Por defecto "Aumentar". */
  incrementLabel?: string;
  /** Ocupa el 100 % del ancho del contenedor (en Figma el campo es FILL). Si no, mide 320. */
  fullWidth?: boolean;
  /** Fuerza el aspecto de un estado (solo documentación). */
  state?: NumberPickerState;
  /** Clases adicionales para el contenedor raíz (el resto de props nativas y el ref van al `<input>`). */
  className?: string;
  /** Mensaje de ayuda debajo del campo. */
  helperText?: string;
  /** Mensaje de error (tiene prioridad sobre éxito y ayuda). Marca el campo con `aria-invalid`. */
  errorText?: string;
  /** Mensaje de éxito. */
  successText?: string;
  /** Texto de ayuda en un ícono de información a la derecha del campo. */
  tooltip?: string;
  /**
   * Atributos para el contenedor raíz (`data-*`, `id`, `style`, `ref`…), p. ej. `data-figma` para medir contra Figma.
   * `className` se mezcla con el de la raíz; el `ref` del componente y los atributos nativos sueltos van al `<input>`.
   */
  rootProps?: FieldRootProps;
};

/** El campo necesita nombre accesible (p. ej. "Cantidad"): aria-label o aria-labelledby. */
export type NumberPickerProps = NumberPickerBaseProps &
  (
    | { 'aria-label': string; 'aria-labelledby'?: string }
    | { 'aria-labelledby': string; 'aria-label'?: string }
  );
