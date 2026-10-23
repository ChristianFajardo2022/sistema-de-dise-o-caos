import { forwardRef, useId, useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import type { InputState } from '../Input/Input.types';
import { inputControlVariants, inputFieldVariants, inputLabelVariants } from '../Input/Input.variants';
import { NotificationText } from '../NotificationText';
import { cn } from '../../utils/cn';
import type { TimePickerProps } from './TimePicker.types';
import { TIME_PICKER_MESSAGE_GAP, timePickerPeriodVariants, timePickerRootVariants, timePickerRowVariants } from './TimePicker.variants';

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

export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
  (
    {
      value,
      defaultValue,
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
      disabled = false,
      readOnly = false,
      name,
      fullWidth = false,
      state = 'default',
      className,
      id,
      'aria-describedby': ariaDescribedBy,
      ...restProps
    },
    ref
  ) => {
    const autoId = useId();
    const baseId = id ?? autoId;
    const hourId = `${baseId}-hour`;
    const minuteId = `${baseId}-minute`;
    const messageId = `${baseId}-message`;

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
      if (nextValue !== composed) onChange?.(nextValue);
    };

    const isDisabled = disabled || state === 'disabled';
    const isError = Boolean(errorText) || state === 'error';
    const isSuccess = !isError && (Boolean(successText) || state === 'success');
    const isReadOnly = readOnly || state === 'burnt-in';
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

    const message = errorText
      ? { kind: 'error' as const, text: errorText }
      : successText
        ? { kind: 'success' as const, text: successText }
        : helperText
          ? { kind: 'helper' as const, text: helperText }
          : null;
    const describedBy = cn(message && messageId, ariaDescribedBy) || undefined;

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
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={n ?? undefined}
                aria-valuetext={n === null ? undefined : pad(n)}
                aria-readonly={isReadOnly || undefined}
                aria-invalid={isError || outOfRange || undefined}
                className={inputControlVariants({ showPlaceholder: forceFloat && Boolean(placeholder) })}
                {...ownerProps}
                aria-describedby={cn(describedBy, userDescribedBy) || undefined}
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
              <label htmlFor={id} data-figma-part="Label" className={inputLabelVariants({ float: forceFloat ? 'always' : 'auto' })}>
                {isHour ? hourLabel : minuteLabel}
              </label>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div
        ref={ref}
        role="group"
        aria-label={label}
        aria-describedby={describedBy}
        className={cn(timePickerRootVariants({ fullWidth }), message && TIME_PICKER_MESSAGE_GAP, className)}
        {...restProps}
      >
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

        {name && <input type="hidden" name={name} value={composed} disabled={isDisabled} />}

        {/* Región viva siempre presente (debe existir antes de que cambie su texto) */}
        <div aria-live="polite">
          {message && (
            <NotificationText
              id={messageId}
              state={message.kind === 'success' ? 'confirmation' : message.kind}
              announce={false}
              data-figma-part="Helper text"
            >
              {message.text}
            </NotificationText>
          )}
        </div>
      </div>
    );
  }
);

TimePicker.displayName = 'TimePicker';
