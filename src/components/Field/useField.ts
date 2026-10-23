import { useId } from 'react';
import type { UseFieldOptions } from './Field.types';
import { fieldIds, joinIds, resolveField } from './Field.utils';

/**
 * Ids (control, label, mensaje, tooltip), estado visual con la misma prioridad en todos los campos
 * (disabled > error > success > burnt-in > `state`), el mensaje (error > éxito > ayuda) y `describedBy`.
 */
export function useField({ id, tooltip, ...options }: UseFieldOptions) {
  const autoId = useId();
  const ids = fieldIds(id ?? autoId);
  const resolved = resolveField(options);
  /** `aria-describedby` del control: el mensaje, el tooltip y lo que se agregue. */
  const describedBy = (...extra: (string | false | null | undefined)[]) =>
    joinIds(resolved.message && ids.message, tooltip && ids.tooltip, ...extra);
  return { ids, ...resolved, describedBy };
}
