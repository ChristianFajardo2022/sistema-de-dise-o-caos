import { forwardRef, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { ChangeEvent, ClipboardEvent, FocusEvent, KeyboardEvent } from 'react';
import type { CodeInputProps } from './CodeInput.types';
import { codeInputLabelVariants, codeInputVariants } from './CodeInput.variants';
import { cn } from '../../utils/cn';
import { DigitInput } from '../DigitInput';
import type { DigitInputState } from '../DigitInput';
import { NotificationText } from '../NotificationText';

const onlyDigits = (s: string | undefined) => (s ?? '').replace(/\D/g, '');
const defaultDigitLabel = (index: number, length: number) => `Dígito ${index + 1} de ${length}`;

export const CodeInput = forwardRef<HTMLDivElement, CodeInputProps>(
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
      disabled = false,
      readOnly = false,
      fullWidth = false,
      size = '56',
      placeholder,
      name,
      autoFocus = false,
      getDigitLabel = defaultDigitLabel,
      state = 'default',
      id,
      className,
      ...restProps
    },
    ref
  ) => {
    const autoId = useId();
    const baseId = id ?? autoId;
    const labelId = `${baseId}-label`;
    const messageId = `${baseId}-message`;

    const isControlled = value !== undefined;
    const [inner, setInner] = useState(() => onlyDigits(defaultValue).slice(0, length));
    const current = (isControlled ? onlyDigits(value) : inner).slice(0, length);

    // Último valor conocido: los manejadores lo leen para no depender de un render intermedio
    const latest = useRef(current);
    useLayoutEffect(() => {
      latest.current = current;
    });

    const cells = useRef<(HTMLInputElement | null)[]>([]);

    const isDisabled = disabled || state === 'disabled';
    const isReadOnly = readOnly || state === 'burnt-in';
    const isError = Boolean(errorText) || state === 'error';
    const isSuccess = !isError && (Boolean(successText) || state === 'success');
    const editable = !isDisabled && !isReadOnly;

    // Mensaje: error > success > helper
    const message = errorText
      ? { kind: 'error' as const, text: errorText }
      : successText
        ? { kind: 'confirmation' as const, text: successText }
        : helperText
          ? { kind: 'helper' as const, text: helperText }
          : null;

    // Estado forzado de documentación que se pasa a cada casilla (los demás salen de las props)
    const forcedCellState: DigitInputState | undefined =
      state === 'active' ? 'active' : state === 'filled' ? 'filled' : undefined;

    // Casilla que recibe el Tab (roving tabindex): la primera libre, o la última si está lleno
    const activeIndex = Math.min(current.length, length - 1);

    // Con maxLength=1 el autocompletado del sistema (one-time-code) se corta al primer dígito.
    // DigitInput fija maxLength=1, así que en la primera casilla se quita el límite y el código se reparte aquí.
    useLayoutEffect(() => {
      cells.current[0]?.removeAttribute('maxlength');
    });

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
        ref={ref}
        id={id}
        className={cn(codeInputVariants({ fullWidth }), className)}
        {...restProps}
      >
        <label
          id={labelId}
          htmlFor={`${baseId}-0`}
          className={cn(codeInputLabelVariants({ disabled: isDisabled }), hideLabel && 'sr-only')}
        >
          {label}
        </label>

        <div
          role="group"
          aria-labelledby={labelId}
          data-figma-part="Input+Tooltip"
          className="flex w-full min-w-0 items-center gap-ds-space-general-lg"
        >
          {Array.from({ length }, (_, i) => (
            <DigitInput
              key={i}
              ref={(el) => {
                cells.current[i] = el;
              }}
              id={`${baseId}-${i}`}
              data-figma-part="Placeholder"
              size={size}
              state={forcedCellState}
              value={current[i] ?? ''}
              placeholder={placeholder}
              oneTimeCode={i === 0}
              invalid={isError}
              confirmed={isSuccess}
              disabled={isDisabled}
              readOnly={isReadOnly}
              tabIndex={i === activeIndex ? 0 : -1}
              aria-label={getDigitLabel(i, length)}
              aria-describedby={message ? messageId : undefined}
              onFocus={handleFocus(i)}
              onChange={handleChange(i)}
              onKeyDown={handleKeyDown(i)}
              onPaste={handlePaste(i)}
              className={cn('w-auto min-w-0 flex-1', isDisabled && 'border-ds-border-field-disabled')}
            />
          ))}
        </div>

        {name && <input type="hidden" name={name} value={current} disabled={isDisabled} />}

        {message && (
          <NotificationText id={messageId} data-figma-part="Message" state={message.kind}>
            {message.text}
          </NotificationText>
        )}
      </div>
    );
  }
);

CodeInput.displayName = 'CodeInput';
