import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ChangeEvent, ClipboardEvent, FocusEvent, KeyboardEvent } from 'react';
import type { CodeInputProps } from './CodeInput.types';
import { codeInputLabelVariants, codeInputVariants } from './CodeInput.variants';
import { cn } from '../../utils/cn';
import { DigitInput } from '../DigitInput';
import type { DigitInputState } from '../DigitInput';
import { FieldMessage, FieldTooltip, useField } from '../Field';
import { assignRef } from '../../utils/refs';

const onlyDigits = (s: string | undefined) => (s ?? '').replace(/\D/g, '');
const defaultDigitLabel = (index: number, length: number) => `Dígito ${index + 1} de ${length}`;

/**
 * Código de verificación (Type=Code de "General input"): una casilla DigitInput por dígito en un `role="group"`
 * nombrado por `label`. El `ref` va a la primera casilla (el primer control enfocable); `className`, `rootProps` y el
 * resto de props van a la raíz.
 */
export const CodeInput = forwardRef<HTMLInputElement, CodeInputProps>(
  (
    {
      label,
      hideLabel = false,
      length = 6,
      value,
      defaultValue,
      onValueChange,
      onComplete,
      helperText,
      errorText,
      successText,
      tooltip,
      disabled = false,
      readOnly = false,
      required,
      optional = false,
      fullWidth = false,
      size = '56',
      placeholder,
      name,
      autoFocus = false,
      getDigitLabel = defaultDigitLabel,
      state = 'default',
      id,
      className,
      rootProps,
      ...restProps
    },
    ref
  ) => {
    const base = useField({ id, helperText, errorText, successText, tooltip, state, disabled, readOnly });
    const { ids, message, isDisabled, isReadOnly, isError, isSuccess } = base;
    const baseId = ids.control;

    const isControlled = value !== undefined;
    const [inner, setInner] = useState(() => onlyDigits(defaultValue).slice(0, length));
    const current = (isControlled ? onlyDigits(value) : inner).slice(0, length);

    // Último valor conocido: los manejadores lo leen para no depender de un render intermedio
    const latest = useRef(current);
    useLayoutEffect(() => {
      latest.current = current;
    });

    const cells = useRef<(HTMLInputElement | null)[]>([]);

    const editable = !isDisabled && !isReadOnly;

    // Estado forzado de documentación que se pasa a cada casilla (los demás salen de las props)
    const forcedCellState: DigitInputState | undefined =
      state === 'active' ? 'active' : state === 'filled' ? 'filled' : undefined;

    // Casilla que recibe el Tab (roving tabindex): la primera libre, o la última si está lleno
    const activeIndex = Math.min(current.length, length - 1);

    useEffect(() => {
      if (autoFocus) cells.current[Math.min(latest.current.length, length - 1)]?.focus();
      // Solo al montar
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const focusCell = (index: number) => {
      const el = cells.current[Math.max(0, Math.min(index, length - 1))];
      if (!el) return;
      el.focus();
      el.select();
    };

    const commit = (next: string) => {
      const prev = latest.current;
      const clean = next.slice(0, length);
      if (clean === prev) return;
      latest.current = clean;
      if (!isControlled) setInner(clean);
      onValueChange?.(clean);
      // Solo al pasar de incompleto a completo (reemplazar el último dígito no la repite)
      if (clean.length === length && prev.length !== length) onComplete?.(clean);
    };

    // Escribe `digits` desde la casilla `index`; un código completo siempre empieza en la primera
    const fillFrom = (index: number, digits: string) => {
      const cur = latest.current;
      const start = digits.length >= length ? 0 : Math.min(index, cur.length);
      const next = (cur.slice(0, start) + digits + cur.slice(start + digits.length)).slice(0, length);
      commit(next);
      focusCell(Math.min(start + digits.length, length - 1));
    };

    const setDigitAt = (index: number, digit: string) => {
      const cur = latest.current;
      const at = Math.min(index, cur.length);
      commit(cur.slice(0, at) + digit + cur.slice(at + 1));
      focusCell(at + 1);
    };

    const removeAt = (index: number) => {
      const cur = latest.current;
      commit(cur.slice(0, index) + cur.slice(index + 1));
    };

    const handleFocus = (index: number) => (e: FocusEvent<HTMLInputElement>) => {
      // Sin huecos: una casilla más allá de la primera libre manda el foco a esa
      const firstFree = Math.min(latest.current.length, length - 1);
      if (editable && index > firstFree) {
        focusCell(firstFree);
        return;
      }
      e.target.select();
    };

    const handleChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      if (!editable) return;
      // DigitInput ya descartó lo que no es dígito
      const digits = e.target.value;
      const cur = latest.current;
      if (digits === '') {
        removeAt(index);
        return;
      }
      if (digits.length === 1) {
        setDigitAt(index, digits);
        return;
      }
      // Varios dígitos en la primera casilla (sin maxlength): autocompletado del sistema o escritura con el cursor al final
      if (digits.length === 2 && cur[index] !== undefined && digits.length < length) {
        const caret = e.target.selectionStart ?? digits.length;
        setDigitAt(index, digits[Math.max(0, caret - 1)]);
        return;
      }
      fillFrom(index, digits);
    };

    const handleKeyDown = (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      const cur = latest.current;
      const lastReachable = editable ? Math.min(cur.length, length - 1) : length - 1;
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          focusCell(index - 1);
          return;
        case 'ArrowRight':
          e.preventDefault();
          focusCell(Math.min(index + 1, lastReachable));
          return;
        case 'Home':
          e.preventDefault();
          focusCell(0);
          return;
        case 'End':
          e.preventDefault();
          focusCell(lastReachable);
          return;
      }
      if (!editable) return;
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (cur[index] !== undefined) {
          removeAt(index);
          focusCell(index - 1);
        } else if (index > 0) {
          removeAt(index - 1);
          focusCell(index - 1);
        }
        return;
      }
      if (e.key === 'Delete') {
        e.preventDefault();
        if (cur[index] !== undefined) removeAt(index);
        return;
      }
      // Un dígito reemplaza el de la casilla aunque el cursor no lo tenga seleccionado
      if (/^\d$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setDigitAt(index, e.key);
      }
    };

    const handlePaste = (index: number) => (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (!editable) return;
      const digits = onlyDigits(e.clipboardData.getData('text'));
      if (digits) fillFrom(index, digits.slice(0, length));
    };

    return (
      <div
        id={id}
        {...restProps}
        {...rootProps}
        className={cn(codeInputVariants({ fullWidth }), rootProps?.className, className)}
      >
        <label
          id={ids.label}
          htmlFor={`${baseId}-0`}
          className={cn(codeInputLabelVariants({ disabled: isDisabled }), hideLabel && 'sr-only')}
        >
          {label}
          {optional && <span className="text-ds-text-acent-firts"> | Opcional</span>}
        </label>

        <div
          role="group"
          aria-labelledby={ids.label}
          data-figma-part="Input+Tooltip"
          className="flex w-full min-w-0 items-center gap-ds-space-general-lg"
        >
          {Array.from({ length }, (_, i) => (
            <DigitInput
              key={i}
              ref={(el) => {
                cells.current[i] = el;
                if (i === 0) assignRef(ref, el);
              }}
              id={`${baseId}-${i}`}
              data-figma-part="Placeholder"
              size={size}
              state={forcedCellState}
              value={current[i] ?? ''}
              placeholder={placeholder}
              oneTimeCode={i === 0}
              // La primera casilla acepta el código entero (autocompletado one-time-code) y lo reparte
              maxLength={i === 0 ? length : 1}
              required={required}
              invalid={isError}
              confirmed={isSuccess}
              disabled={isDisabled}
              readOnly={isReadOnly}
              tabIndex={i === activeIndex ? 0 : -1}
              aria-label={getDigitLabel(i, length)}
              aria-describedby={base.describedBy()}
              onFocus={handleFocus(i)}
              onChange={handleChange(i)}
              onKeyDown={handleKeyDown(i)}
              onPaste={handlePaste(i)}
              className={cn('w-auto min-w-0 flex-1', isDisabled && 'border-ds-border-field-disabled')}
            />
          ))}
          {tooltip && <FieldTooltip id={ids.tooltip} text={tooltip} disabled={isDisabled} />}
        </div>

        {name && <input type="hidden" name={name} value={current} disabled={isDisabled} />}

        <FieldMessage id={ids.message} message={message} data-figma-part="Message" />
      </div>
    );
  }
);

CodeInput.displayName = 'CodeInput';
