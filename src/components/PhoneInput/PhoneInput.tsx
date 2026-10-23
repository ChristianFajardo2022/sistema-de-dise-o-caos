import { forwardRef, useCallback, useId, useLayoutEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { PhoneInputProps, PhoneInputState } from './PhoneInput.types';
import { phoneInputPrefixClass, phoneInputRootVariants } from './PhoneInput.variants';
import { Input } from '../Input';
import type { InputState } from '../Input/Input.types';
import { NotificationText } from '../NotificationText';
import { ScrollArea } from '../ScrollArea';
import { Select } from '../Select';
import { DEFAULT_PHONE_COUNTRIES } from './PhoneInput.countries';
import {
  dropdownMenuItemTextVariants,
  dropdownMenuItemVariants,
  dropdownMenuPanelVariants,
  dropdownMenuScrollVariants,
} from '../DropdownMenu/DropdownMenu.variants';
import { cn } from '../../utils/cn';

const GROUPS = [3, 3, 4];

const onlyDigits = (text: string) => text.replace(/\D/g, '');

/** Agrupa los dígitos con espacios (3, 3, 4 y el resto junto). */
function formatDigits(digits: string): string {
  const parts: string[] = [];
  let at = 0;
  for (const size of GROUPS) {
    if (at >= digits.length) break;
    parts.push(digits.slice(at, at + size));
    at += size;
  }
  if (at < digits.length) parts.push(digits.slice(at));
  return parts.join(' ');
}

/** Posición en `formatted` justo después de `count` dígitos. */
function caretAfterDigits(formatted: string, count: number): number {
  if (count <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) seen++;
    if (seen === count) return i + 1;
  }
  return formatted.length;
}

/**
 * PhoneInput del sistema de diseño CAOS: Type=Number de "General input". Compone `Select` (indicativo) e `Input`
 * (número) dentro de un `role="group"`; la lista del prefijo se alinea bajo todo el control. El mensaje de ayuda,
 * error o éxito es uno solo y lo describen (`aria-describedby`) ambos campos.
 *
 * El valor del número son solo dígitos (con `groupDigits` se muestran agrupados). Con `name`, un input oculto envía
 * `+<indicativo><número>` (E.164), o vacío si no hay número. El `ref` apunta al `<input>` del número; `className` y el
 * resto de props van a la raíz.
 */
export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      label,
      prefixLabel = 'Indicativo',
      placeholder,
      countries = DEFAULT_PHONE_COUNTRIES,
      countryCode: countryCodeProp,
      defaultCountryCode,
      onCountryCodeChange,
      value: valueProp,
      defaultValue = '',
      onValueChange,
      groupDigits = false,
      maxDigits = 15,
      helperText,
      errorText,
      successText,
      optional = false,
      name,
      id,
      disabled = false,
      readOnly = false,
      required = false,
      fullWidth = false,
      state = 'default',
      className,
      ...restProps
    },
    ref
  ) => {
    const uid = useId();
    const messageId = `${uid}-message`;
    const rowRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const caretRef = useRef<number | null>(null);

    const setInputRef = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const [innerCountry, setInnerCountry] = useState<string | null>(
      defaultCountryCode !== undefined ? defaultCountryCode : (countries[0]?.code ?? null)
    );
    const countryCode = countryCodeProp !== undefined ? countryCodeProp : innerCountry;
    const country = countries.find((c) => c.code === countryCode);
    const dial = country ? onlyDigits(country.dialCode) : '';

    const [innerValue, setInnerValue] = useState(() => onlyDigits(defaultValue));
    const digits = valueProp !== undefined ? onlyDigits(valueProp) : innerValue;
    const shown = groupDigits ? formatDigits(digits) : digits;

    const isDisabled = disabled || state === 'disabled';
    const isError = Boolean(errorText) || state === 'error';
    const isSuccess = !isError && (Boolean(successText) || state === 'success');
    const message = errorText
      ? { kind: 'error' as const, text: errorText }
      : successText
        ? { kind: 'success' as const, text: successText }
        : helperText
          ? { kind: 'helper' as const, text: helperText }
          : null;

    // Estado visual de ambos campos. Los mensajes son de PhoneInput, así que se fuerza `state` en lugar de pasar textos.
    const visual: InputState = isDisabled
      ? 'disabled'
      : isError
        ? 'error'
        : isSuccess
          ? 'success'
          : readOnly || state === 'burnt-in'
            ? 'burnt-in'
            : state;
    // El prefijo no usa los estados forzados de Select (que subirían su label sin valor ni dibujarían la lista en el flujo):
    // Active, Error y Success se pintan con el gancho `--input-border` de Input; el resto (Burnt-In, Disabled) sí pasa.
    const prefixState: PhoneInputState = ['filled', 'active', 'error', 'success'].includes(visual) ? 'default' : visual;
    const prefixBorder =
      visual === 'active'
        ? '[--input-border:var(--color-ds-border-field-active)]'
        : visual === 'error'
          ? '[--input-border:var(--color-ds-border-semantic-error)]'
          : visual === 'success'
            ? '[--input-border:var(--color-ds-border-semantic-success)]'
            : undefined;

    const describedBy = message ? messageId : undefined;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value;
      const caret = event.target.selectionStart ?? raw.length;
      const next = onlyDigits(raw).slice(0, Math.max(0, maxDigits));
      caretRef.current = onlyDigits(raw.slice(0, caret)).slice(0, next.length).length;
      if (valueProp === undefined) setInnerValue(next);
      if (next !== digits) onValueChange?.(next);
    };

    // Con agrupación, devuelve el cursor a su sitio tras reformatear
    useLayoutEffect(() => {
      const count = caretRef.current;
      caretRef.current = null;
      const input = inputRef.current;
      if (count === null || !input || document.activeElement !== input) return;
      const pos = caretAfterDigits(shown, count);
      input.setSelectionRange(pos, pos);
    }, [shown]);

    const e164 = digits ? `+${dial}${digits}` : '';

    return (
      <div
        role="group"
        aria-label={label}
        {...restProps}
        className={cn(phoneInputRootVariants({ fullWidth }), className)}
      >
        <div ref={rowRef} className="flex items-start gap-ds-space-general-lg">
          <Select
            anchorRef={rowRef}
            label={prefixLabel}
            optional={optional}
            options={countries.map((c) => ({ value: c.code, label: c.dialCode }))}
            value={countryCode}
            onValueChange={(code) => {
              if (countryCodeProp === undefined) setInnerCountry(code);
              onCountryCodeChange?.(code);
            }}
            disabled={isDisabled}
            readOnly={readOnly}
            required={required}
            state={prefixState}
            aria-describedby={describedBy}
            className={cn(phoneInputPrefixClass, prefixBorder)}
          />
          <Input
            ref={setInputRef}
            id={id}
            label={label}
            optional={optional}
            placeholder={placeholder}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            value={shown}
            onChange={handleChange}
            disabled={isDisabled}
            readOnly={readOnly}
            required={required}
            state={visual}
            fullWidth
            aria-describedby={describedBy}
            className="min-w-0 flex-1"
          />
        </div>

        {visual === 'active' && (
          // Lista de muestra del estado Active/Focus (solo documentación)
          <div aria-hidden="true" data-figma-part="Dropdown" className={cn(dropdownMenuPanelVariants({ type: 'simple' }), 'w-full')}>
            <ScrollArea aria-label={label} maxHeight="20rem" data-figma-part="Check List" className={dropdownMenuScrollVariants({ type: 'simple', scrollbar: true, list: false })}>
              {['Text item', 'Text item'].map((text, i) => (
                <div key={i} data-figma-part="Dropdown list" className={dropdownMenuItemVariants({ state: 'default' })}>
                  <span data-figma-part="Text item" className={dropdownMenuItemTextVariants()}>
                    {text}
                  </span>
                </div>
              ))}
            </ScrollArea>
          </div>
        )}

        <div aria-live="polite" className="empty:absolute">
          {message && (
            <NotificationText id={messageId} state={message.kind === 'success' ? 'confirmation' : message.kind} announce={false}>
              {message.text}
            </NotificationText>
          )}
        </div>

        {name && <input type="hidden" name={name} value={e164} disabled={isDisabled} />}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';
