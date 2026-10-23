import type { HTMLAttributes, ReactNode, Ref } from 'react';
import type { InputState } from '../Input/Input.types';
import type { NotificationTextState } from '../NotificationText/NotificationText.types';

/**
 * Atributos para el contenedor raíz de un control de formulario (`data-*`, `id`, `style`, `ref`…), p. ej. `data-figma`
 * para medir contra Figma o `ref` para medir la raíz. `className` se mezcla con el de la raíz.
 *
 * Regla común de los controles de formulario: el `ref` del componente va al control enfocable (el `<input>`, el
 * `<textarea>` o el combobox; en los grupos, el primero) y la raíz se alcanza con `rootProps` (y `className`).
 */
export type FieldRootProps = HTMLAttributes<HTMLDivElement> & {
  ref?: Ref<HTMLDivElement>;
} & { [K in `data-${string}`]?: string | number | boolean };

/** Mensaje bajo el campo: error > éxito > ayuda (el `state` de NotificationText). */
export interface FieldMessageData {
  kind: Extract<NotificationTextState, 'error' | 'confirmation' | 'helper'>;
  text: ReactNode;
}

/** Entradas de `useField`: lo que todos los controles de formulario comparten. */
export interface UseFieldOptions {
  /** id del control enfocable; si no, se genera. Los demás ids salen de este. */
  id?: string;
  helperText?: ReactNode;
  errorText?: ReactNode;
  successText?: ReactNode;
  tooltip?: string;
  /** Estado forzado de documentación. */
  state?: InputState;
  disabled?: boolean;
  readOnly?: boolean;
}
