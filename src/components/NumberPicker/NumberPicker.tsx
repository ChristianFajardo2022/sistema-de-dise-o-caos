import { forwardRef, useRef, useState } from 'react';
import type { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent } from 'react';
import type { NumberPickerProps } from './NumberPicker.types';
import {
  numberPickerFieldVariants,
  numberPickerInputVariants,
  numberPickerRootVariants,
} from './NumberPicker.variants';
import { cn } from '../../utils/cn';
import { useMergedRefs } from '../../utils/refs';
import { Button } from '../Button';
import { FieldMessage, FieldRow, useField } from '../Field';
import { Icon } from '../Icon';

const decimalsOf = (n: number) => (String(n).split('.')[1] ?? '').length;

/**
 * Campo de cantidad con botones − y +. Patrón APG "Spinbutton": el campo de texto lleva
 * role="spinbutton" con aria-valuenow/min/max; flechas ±step, RePág/AvPág ±largeStep, Inicio/Fin
 * llevan al mínimo y al máximo. Los botones quedan fuera del orden de tabulación (el teclado usa el campo).
 * El `ref` y los atributos nativos van al `<input>`; `className` y `rootProps` van a la raíz. Mensajes y tooltip con la
 * base común de los campos (Figma no los dibuja en este set).
 */
export const NumberPicker = forwardRef<HTMLInputElement, NumberPickerProps>(
  (
    {
      size = 'sm',
      state,
      value: valueProp,
      defaultValue,
      onValueChange,
      min,
      max,
      step = 1,
      largeStep,
      decrementLabel = 'Disminuir',
      incrementLabel = 'Aumentar',
      fullWidth = false,
      disabled = false,
      readOnly = false,
      helperText,
      errorText,
      successText,
      tooltip,
      className,
      rootProps,
      id,
      'aria-describedby': ariaDescribedBy,
      onKeyDown,
      onBlur,
      ...restProps
    },
    ref
  ) => {
    const field = useField({ id, helperText, errorText, successText, tooltip, disabled, readOnly });
    const inputId = field.ids.control;
    const inputRef = useRef<HTMLInputElement>(null);
    const setInputRef = useMergedRefs(inputRef, ref);

    const isControlled = valueProp !== undefined;
    const [inner, setInner] = useState<number | undefined>(defaultValue);
    const value = isControlled ? valueProp : inner;
    // Texto mientras se escribe; null = se muestra el valor confirmado
    const [draft, setDraft] = useState<string | null>(null);

    const isDisabled = disabled || state === 'disabled';
    const isReadOnly = readOnly || state === 'burnt-in';
    const decimals = Math.max(decimalsOf(step), largeStep === undefined ? 0 : decimalsOf(largeStep));
    const canNegative = min === undefined || min < 0;

    const clamp = (n: number) => {
      let r = n;
      if (max !== undefined) r = Math.min(max, r);
      if (min !== undefined) r = Math.max(min, r);
      return Number(r.toFixed(decimals));
    };

    const commit = (next: number | undefined) => {
      if (next !== value) {
        if (!isControlled) setInner(next);
        onValueChange?.(next);
      }
    };

    // Convierte el texto en un valor; null si todavía no es un número (vacío, "-" o ".")
    const parseText = (text: string): number | undefined => {
      const n = Number(text);
      return text === '' || text === '-' || text === '.' || Number.isNaN(n) ? undefined : n;
    };

    // Acota y confirma el texto que se estaba escribiendo
    const commitDraft = () => {
      if (draft === null) return;
      const n = parseText(draft);
      setDraft(null);
      commit(n === undefined ? undefined : clamp(n));
    };

    const move = (delta: number) => {
      if (isDisabled || isReadOnly) return;
      const base = draft !== null ? parseText(draft) : value;
      setDraft(null);
      // Con el campo vacío, el primer paso confirma el punto de partida (min o 0), sin sumar el paso
      commit(base === undefined ? clamp(min ?? 0) : clamp(base + delta));
    };

    // Si el valor controlado cambia desde fuera, se descarta el texto a medio escribir
    const [seenProp, setSeenProp] = useState(valueProp);
    if (seenProp !== valueProp) {
      setSeenProp(valueProp);
      if (draft !== null) setDraft(null);
    }

    const display = draft ?? (value === undefined ? '' : String(value));
    const atMin = value !== undefined && min !== undefined && value <= min;
    const atMax = value !== undefined && max !== undefined && value >= max;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value.replace(',', '.');
      const pattern = decimals > 0 ? /^-?\d*\.?\d*$/ : /^-?\d*$/;
      if (!pattern.test(text) || (!canNegative && text.includes('-'))) return;
      // Mientras se escribe solo se guarda el texto crudo; se acota y confirma al salir o con Enter
      setDraft(text);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      // Al salir se acota y confirma; el texto pasa a ser el valor confirmado
      commitDraft();
      onBlur?.(e);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || isDisabled || isReadOnly) return;
      const big = largeStep ?? step * 10;
      switch (e.key) {
        case 'ArrowUp':
          move(step);
          break;
        case 'ArrowDown':
          move(-step);
          break;
        case 'PageUp':
          move(big);
          break;
        case 'PageDown':
          move(-big);
          break;
        case 'Home':
          if (min === undefined) return;
          setDraft(null);
          commit(min);
          break;
        case 'End':
          if (max === undefined) return;
          setDraft(null);
          commit(max);
          break;
        case 'Enter':
          commitDraft();
          return;
        default:
          return;
      }
      e.preventDefault();
    };

    // El botón no roba el foco: así el campo sigue activo aunque el botón se deshabilite al llegar al límite
    const keepFocus = (e: MouseEvent) => {
      e.preventDefault();
      inputRef.current?.focus();
    };

    const visual = isDisabled ? 'disabled' : isReadOnly ? 'burnt-in' : state === 'active' ? 'active' : 'default';

    return (
      <div {...rootProps} className={cn(numberPickerRootVariants({ fullWidth }), rootProps?.className, className)}>
        <FieldRow tooltip={tooltip ? { id: field.ids.tooltip, text: tooltip, disabled: isDisabled } : null}>
          <div data-figma-part="Input" className={numberPickerFieldVariants({ size, visual })}>
            <Button
              variant="tertiary"
              size="xs"
              iconOnly
              tabIndex={-1}
              aria-label={decrementLabel}
              aria-controls={inputId}
              disabled={isDisabled || isReadOnly || atMin}
              onMouseDown={keepFocus}
              onClick={() => move(-step)}
              data-figma-part="Button"
            >
              <Icon name="minus" size={20} data-figma-part="Icon-sizes" />
            </Button>
            <input
              data-figma-part="00"
              {...restProps}
              ref={setInputRef}
              id={inputId}
              type="text"
              role="spinbutton"
              inputMode={decimals > 0 ? 'decimal' : 'numeric'}
              autoComplete="off"
              value={display}
              disabled={isDisabled}
              readOnly={isReadOnly}
              aria-valuenow={value}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-readonly={isReadOnly || undefined}
              aria-invalid={field.isError || undefined}
              aria-describedby={field.describedBy(ariaDescribedBy)}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className={numberPickerInputVariants()}
            />
            <Button
              variant="tertiary"
              size="xs"
              iconOnly
              tabIndex={-1}
              aria-label={incrementLabel}
              aria-controls={inputId}
              disabled={isDisabled || isReadOnly || atMax}
              onMouseDown={keepFocus}
              onClick={() => move(step)}
              data-figma-part="Button"
            >
              <Icon name="add-2" size={20} data-figma-part="Icon-sizes" />
            </Button>
          </div>
        </FieldRow>

        <FieldMessage id={field.ids.message} message={field.message} />
      </div>
    );
  }
);

NumberPicker.displayName = 'NumberPicker';
