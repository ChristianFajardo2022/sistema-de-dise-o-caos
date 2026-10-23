import { forwardRef, useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import type { InputState } from '../Input/Input.types';
import { inputControlVariants, inputFieldVariants } from '../Input/Input.variants';
import { FieldLabel, FieldMessage, FieldRow, joinIds, useField } from '../Field';
import { cn } from '../../utils/cn';
import type { TimePickerProps } from './TimePicker.types';
import { timePickerPeriodVariants, timePickerRootVariants, timePickerRowVariants } from './TimePicker.variants';

type Period = 'AM' | 'PM';

/** Lo que el usuario ve y escribe: texto de cada campo y AM/PM elegido (puede estar incompleto). */
interface Draft {
  hour: string;
  minute: string;
  period: Period | null;
}

const EMPTY: Draft = { hour: '', minute: '', period: null };
const VALUE_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;
const pad = (n: number) => String(n).padStart(2, '0');

function fromValue(value: string | undefined, cycle: 12 | 24): Draft {
  const m = value ? VALUE_RE.exec(value) : null;
  if (!m) return EMPTY;
  const h = Number(m[1]);
  if (cycle === 24) return { hour: pad(h), minute: m[2], period: null };
  return { hour: pad(h % 12 || 12), minute: m[2], period: h >= 12 ? 'PM' : 'AM' };
}

/** Hora entera válida del texto, o null. */
function parsePart(text: string, min: number, max: number): number | null {
  if (!/^\d{1,2}$/.test(text)) return null;
  const n = Number(text);
  return n >= min && n <= max ? n : null;
}

function toValue(d: Draft, cycle: 12 | 24): string {
  const h = parsePart(d.hour, cycle === 12 ? 1 : 0, cycle === 12 ? 12 : 23);
  const m = parsePart(d.minute, 0, 59);
  if (h === null || m === null) return '';
  if (cycle === 24) return `${pad(h)}:${pad(m)}`;
  if (!d.period) return '';
  return `${pad((h % 12) + (d.period === 'PM' ? 12 : 0))}:${pad(m)}`;
}

/** Siguiente valor del spinbutton con vuelta al llegar al extremo. */
function stepValue(current: number | null, dir: 1 | -1, min: number, max: number, step: number): number {
  if (current === null) return dir === 1 ? min : max - ((max - min) % step);
  const next = dir === 1 ? (Math.floor((current - min) / step) + 1) * step + min : (Math.ceil((current - min) / step) - 1) * step + min;
  if (next > max) return min;
  if (next < min) return max - ((max - min) % step);
  return next;
}

/**
 * Selector de hora (tipo "Time picker" de General input): campos de hora y minutos (spinbutton) y el par AM/PM.
 * `label` es el nombre accesible del grupo (Figma no lo dibuja; cada campo tiene su label visible).
 * El `ref` va al campo de la hora (el primer control); `className`, `rootProps` y el resto de props van a la raíz.
 * El mensaje se asocia (`aria-describedby`) a cada control, no al grupo, para que no se lea dos veces.
 */
export const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      onChange,
      hourCycle = 12,
      minuteStep = 1,
      label = 'Seleccionar hora',
      hourLabel = 'Hora',
      minuteLabel = 'Minutos',
      periodLabel = 'AM/PM',
      hourPlaceholder,
      minutePlaceholder,
      hourInputProps,
      minuteInputProps,
      helperText,
      errorText,
      successText,
      tooltip,
      disabled = false,
      readOnly = false,
      required,
      optional = false,
      name,
      fullWidth = false,
      state = 'default',
      className,
      rootProps,
      id,
      'aria-describedby': ariaDescribedBy,
      ...restProps
    },
    ref
  ) => {
    const base = useField({ id, helperText, errorText, successText, tooltip, state, disabled, readOnly });
    const { ids, message, isDisabled, isError, isSuccess, isReadOnly } = base;
    const baseId = ids.control;
    const hourId = `${baseId}-hour`;
    const minuteId = `${baseId}-minute`;

    const is12 = hourCycle === 12;
    const hMin = is12 ? 1 : 0;
    const hMax = is12 ? 12 : 23;
    const step = Math.max(1, Math.floor(minuteStep));

    const isControlled = value !== undefined;
    const [draft, setDraft] = useState<Draft>(() => fromValue(isControlled ? value : defaultValue, hourCycle));
    const composed = toValue(draft, hourCycle);

    // Controlado: si el padre fija un valor distinto del que forman los campos, los campos lo siguen
    // (un valor con formato inválido se ignora)
    if (isControlled && value !== composed && (value === '' || VALUE_RE.test(value))) {
      setDraft(fromValue(value, hourCycle));
    }

    const commit = (next: Draft) => {
      setDraft(next);
      const nextValue = toValue(next, hourCycle);
      if (nextValue !== composed) {
        onValueChange?.(nextValue);
        onChange?.(nextValue);
      }
    };

    const locked = isDisabled || isReadOnly;

    // Prioridad visual: disabled > error > success > burnt-in (readOnly) > state forzado
    const baseState: InputState = isDisabled
      ? 'disabled'
      : isError
        ? 'error'
        : isSuccess
          ? 'success'
          : isReadOnly
            ? 'burnt-in'
            : state === 'active' || state === 'filled'
              ? state
              : 'default';
    // "Active/Focus" forzado solo marca el primer campo, como Figma
    const minuteState: InputState = baseState === 'active' ? 'default' : baseState;

    const forceFloat = !isDisabled && (isReadOnly || ['filled', 'active', 'error', 'success'].includes(state) || isError || isSuccess);

    // Mensaje y tooltip: en cada control (no en el grupo, que lo repetiría al entrar)
    const describedBy = base.describedBy(ariaDescribedBy);

    const radioName = `${baseId}-period`;

    const onText = (key: 'hour' | 'minute') => (e: ChangeEvent<HTMLInputElement>) => {
      if (locked) return;
      let digits = e.target.value.replace(/\D/g, '');
      // Con dos dígitos ya escritos, un dígito nuevo reemplaza el valor (sin tener que borrar primero)
      if (digits.length > 2 && draft[key].length === 2) {
        const typed = String((e.nativeEvent as InputEvent).data ?? '').replace(/\D/g, '');
        if (typed) digits = typed;
      }
      commit({ ...draft, [key]: digits.slice(0, 2) });
    };

    // Al salir: se acota al rango y se rellena a dos dígitos
    const onBlur = (key: 'hour' | 'minute') => () => {
      const text = draft[key];
      if (locked || text === '') return;
      const min = key === 'hour' ? hMin : 0;
      const max = key === 'hour' ? hMax : 59;
      const n = Math.min(max, Math.max(min, Number(text)));
      if (pad(n) !== text) commit({ ...draft, [key]: pad(n) });
    };

    const onKeyDown = (key: 'hour' | 'minute') => (e: KeyboardEvent<HTMLInputElement>) => {
      if (locked) return;
      const min = key === 'hour' ? hMin : 0;
      const max = key === 'hour' ? hMax : 59;
      const current = parsePart(draft[key], min, max);
      const s = key === 'minute' ? step : 1;
      let next: number | null = null;
      if (e.key === 'ArrowUp') next = stepValue(current, 1, min, max, s);
      else if (e.key === 'ArrowDown') next = stepValue(current, -1, min, max, s);
      else if (e.key === 'Home') next = min;
      else if (e.key === 'End') next = max;
      if (next === null) return;
      e.preventDefault();
      commit({ ...draft, [key]: pad(next) });
    };

    const field = (key: 'hour' | 'minute') => {
      const isHour = key === 'hour';
      const min = isHour ? hMin : 0;
      const max = isHour ? hMax : 59;
      const text = draft[key];
      const placeholder = isHour ? hourPlaceholder : minutePlaceholder;
      const n = parsePart(text, min, max);
      const outOfRange = /^\d+$/.test(text) && n === null;
      const id = isHour ? hourId : minuteId;
      // Los manejadores del consumidor se llaman primero y los internos después (salvo defaultPrevented)
      const {
        onChange: userChange,
        onBlur: userBlur,
        onKeyDown: userKeyDown,
        'aria-describedby': userDescribedBy,
        ...ownerProps
      } = (isHour ? hourInputProps : minuteInputProps) ?? {};
      return (
        <div className="min-w-0 flex-1" data-figma-part={isHour ? 'Input hora' : 'Input minutos'}>
          <div className={inputFieldVariants({ variant: 'text', state: isHour ? baseState : minuteState })}>
            <div className="relative h-10 min-w-0 flex-1">
              <input
                ref={isHour ? ref : undefined}
                id={id}
                type="text"
                role="spinbutton"
                inputMode="numeric"
                autoComplete="off"
                value={text}
                // " " mantiene :placeholder-shown para flotar el label sin estado en JS
                placeholder={placeholder || ' '}
                disabled={isDisabled}
                readOnly={isReadOnly}
                required={required}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={n ?? undefined}
                aria-valuetext={n === null ? undefined : pad(n)}
                aria-readonly={isReadOnly || undefined}
                aria-invalid={isError || outOfRange || undefined}
                className={inputControlVariants({ showPlaceholder: forceFloat && Boolean(placeholder) })}
                {...ownerProps}
                aria-describedby={joinIds(describedBy, userDescribedBy)}
                onChange={(e) => {
                  userChange?.(e);
                  if (!e.defaultPrevented) onText(key)(e);
                }}
                onBlur={(e) => {
                  userBlur?.(e);
                  if (!e.defaultPrevented) onBlur(key)();
                }}
                onKeyDown={(e) => {
                  userKeyDown?.(e);
                  if (!e.defaultPrevented) onKeyDown(key)(e);
                }}
              />
              <FieldLabel htmlFor={id} data-figma-part="Label" float={forceFloat} optional={optional}>
                {isHour ? hourLabel : minuteLabel}
              </FieldLabel>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div
        role="group"
        aria-label={label}
        {...restProps}
        {...rootProps}
        className={cn(timePickerRootVariants({ fullWidth }), rootProps?.className, className)}
      >
        <FieldRow tooltip={tooltip ? { id: ids.tooltip, text: tooltip, disabled: isDisabled } : null}>
          <div className={timePickerRowVariants()}>
            {field('hour')}
            {field('minute')}
            {is12 && (
              // Radiogroup nativo: AM/PM son una elección excluyente, y los radios traen flechas y Tab (un solo
              // punto de tabulación) sin código propio. `form` apunta a un id inexistente para que no se envíen:
              // el valor del formulario es el campo oculto `name`.
              <div role="radiogroup" aria-label={periodLabel} className="flex min-w-0 flex-1 gap-ds-space-general-md" data-figma-part="Container AM/PM">
                {(['AM', 'PM'] as const).map((p) => {
                  const selected = draft.period === p;
                  const periodState: InputState = isDisabled ? 'disabled' : isReadOnly ? 'burnt-in' : selected ? 'active' : 'default';
                  return (
                    <label key={p} className="block min-w-0 flex-1">
                      <input
                        type="radio"
                        name={radioName}
                        form={`${baseId}-sin-formulario`}
                        value={p}
                        checked={selected}
                        disabled={isDisabled}
                        aria-describedby={describedBy}
                        onChange={() => {
                          if (!locked) commit({ ...draft, period: p });
                        }}
                        onClick={(e) => {
                          // Solo lectura: se enfoca pero no cambia
                          if (isReadOnly) e.preventDefault();
                        }}
                        className="peer sr-only"
                      />
                      <span
                        data-figma-part="Label"
                        className={cn(inputFieldVariants({ variant: 'text', state: periodState }), timePickerPeriodVariants(), isDisabled && 'cursor-not-allowed')}
                      >
                        {p}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </FieldRow>

        {name && <input type="hidden" name={name} value={composed} disabled={isDisabled} />}

        <FieldMessage id={ids.message} message={message} data-figma-part="Helper text" />
      </div>
    );
  }
);

TimePicker.displayName = 'TimePicker';
