import type { InputState } from '../Input/Input.types';
import type { FieldMessageData, UseFieldOptions } from './Field.types';

/** Une ids para `aria-describedby`/`aria-labelledby` (sin vacíos ni repetidos). `undefined` si no queda ninguno. */
export function joinIds(...ids: (string | false | null | undefined)[]): string | undefined {
  const list = [...new Set(ids.flatMap((id) => (id ? id.split(/\s+/).filter(Boolean) : [])))];
  return list.length ? list.join(' ') : undefined;
}

/** Estado derivado de un campo. Prioridad visual: disabled > error > success > burnt-in (readOnly) > `state` forzado. */
export function resolveField({ errorText, successText, helperText, state = 'default', disabled, readOnly }: Omit<UseFieldOptions, 'id' | 'tooltip'>) {
  const isDisabled = Boolean(disabled) || state === 'disabled';
  const isReadOnly = Boolean(readOnly) || state === 'burnt-in';
  const isError = Boolean(errorText) || state === 'error';
  const isSuccess = !isError && (Boolean(successText) || state === 'success');
  const visualState: InputState = isDisabled ? 'disabled' : isError ? 'error' : isSuccess ? 'success' : isReadOnly ? 'burnt-in' : state;
  const message: FieldMessageData | null = errorText
    ? { kind: 'error', text: errorText }
    : successText
      ? { kind: 'confirmation', text: successText }
      : helperText
        ? { kind: 'helper', text: helperText }
        : null;
  return { isDisabled, isReadOnly, isError, isSuccess, visualState, message };
}

/** Ids de las partes de un campo a partir del id del control. */
export const fieldIds = (control: string) => ({
  control,
  label: `${control}-label`,
  message: `${control}-message`,
  tooltip: `${control}-tooltip`,
});

/** Hueco de ícono de 16 que toma el color de `--ico`. */
export const FIELD_ICON_SLOT = 'inline-flex size-4 shrink-0 items-center justify-center text-(color:--ico) [&>svg]:size-full';

/** Anillo de foco de teclado de los botones del campo: 2px con el borde activo. */
export const FIELD_FOCUS_RING =
  'outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active';
