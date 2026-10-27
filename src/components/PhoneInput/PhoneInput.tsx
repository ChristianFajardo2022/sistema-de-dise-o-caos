import { forwardRef, useLayoutEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { PhoneInputCountry, PhoneInputProps, PhoneInputState } from './PhoneInput.types';
import { phoneInputPrefixClass, phoneInputRootVariants } from './PhoneInput.variants';
import { FieldMessage, FieldRow, useField } from '../Field';
import { Input } from '../Input';
import { Select } from '../Select';
import { DEFAULT_PHONE_COUNTRIES } from './PhoneInput.countries';
import { cn } from '../../utils/cn';
import { useMergedRefs } from '../../utils/refs';

const GROUPS = [3, 3, 4];

const onlyDigits = (text: string) => text.replace(/\D/g, '');
const defaultCountryLabel = (country: PhoneInputCountry) => `${country.label} ${country.dialCode}`;

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
 * (número) dentro de un `role="group"`; la lista del prefijo se alinea bajo todo el control y muestra el país con su
 * indicativo ("Colombia +57"); el campo muestra solo el indicativo ("+57") y se salta escribiendo el país. El mensaje de
 * ayuda, error o éxito es uno solo y lo describen (`aria-describedby`) ambos campos.
 *
 * El valor del número son solo dígitos (con `groupDigits` se muestran agrupados). Con `name`, un input oculto envía
 * `+<indicativo><número>` (E.164), o vacío si no hay número. El `ref` apunta al `<input>` del número; `className`,
 * `rootProps` y el resto de props van a la raíz.
 */
export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      label,
      prefixLabel = 'Indicativo',
      placeholder,
      countries = DEFAULT_PHONE_COUNTRIES,
      getCountryLabel = defaultCountryLabel,
      countryCode: countryCodeProp,
      defaultCountryCode,
      onCountryCodeChange,
      value: valueProp,
      defaultValue = '',
      onValueChange,
      groupDigits = false,
      maxDigits = 15,
      open,
      defaultOpen,
      onOpenChange,
      helperText,
      errorText,
      successText,
      tooltip,
      optional = false,
      name,
      id,
      autoComplete = 'tel-national',
      disabled = false,
      readOnly = false,
      required = false,
      fullWidth = false,
      state = 'default',
      className,
      rootProps,
      ...restProps
    },
    ref
  ) => {
    const base = useField({ id, helperText, errorText, successText, tooltip, state, disabled, readOnly });
    const { ids, message, isDisabled, isReadOnly, visualState: visual } = base;
    const rowRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const caretRef = useRef<number | null>(null);
    const setInputRef = useMergedRefs(inputRef, ref);

    const [innerCountry, setInnerCountry] = useState<string | null>(
      defaultCountryCode !== undefined ? defaultCountryCode : (countries[0]?.code ?? null)
    );
    const countryCode = countryCodeProp !== undefined ? countryCodeProp : innerCountry;
    const country = countries.find((c) => c.code === countryCode);
    const dial = country ? onlyDigits(country.dialCode) : '';

    const [innerValue, setInnerValue] = useState(() => onlyDigits(defaultValue));
    const digits = valueProp !== undefined ? onlyDigits(valueProp) : innerValue;
    const shown = groupDigits ? formatDigits(digits) : digits;

    // El prefijo no usa los estados forzados de Select (que subirían su label sin valor ni dibujarían la lista en el flujo):
    // Active, Error y Success se pintan con el gancho `--input-border` de Input, Burnt-In pasa como `readOnly` (sin valor,
    // el label se queda dentro) y Disabled pasa tal cual.
    const prefixState: PhoneInputState = visual === 'disabled' ? 'disabled' : 'default';
    const prefixBorder =
      visual === 'active'
        ? '[--input-border:var(--color-ds-border-field-active)]'
        : visual === 'error'
          ? '[--input-border:var(--color-ds-border-semantic-error)]'
          : visual === 'success'
            ? '[--input-border:var(--color-ds-border-semantic-success)]'
            : undefined;

    // Mensaje y tooltip: en ambos campos (no en el grupo, que lo repetiría al entrar)
    const describedBy = base.describedBy();

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
        {...rootProps}
        className={cn(phoneInputRootVariants({ fullWidth }), rootProps?.className, className)}
      >
        <FieldRow tooltip={tooltip ? { id: ids.tooltip, text: tooltip, disabled: isDisabled } : null}>
          <div ref={rowRef} className="flex items-start gap-ds-space-general-lg">
            <Select
              anchorRef={rowRef}
              label={prefixLabel}
              optional={optional}
              options={countries.map((c) => ({ value: c.code, label: getCountryLabel(c), displayLabel: c.dialCode }))}
              value={countryCode}
              onValueChange={(code) => {
                if (countryCodeProp === undefined) setInnerCountry(code);
                onCountryCodeChange?.(code);
              }}
              // `state="active"` (documentación): la lista real del prefijo abierta bajo todo el control
              open={state === 'active' ? true : open}
              defaultOpen={defaultOpen}
              onOpenChange={onOpenChange}
              disabled={isDisabled}
              readOnly={isReadOnly}
              required={required}
              state={prefixState}
              aria-describedby={describedBy}
              className={cn(phoneInputPrefixClass, prefixBorder)}
            />
            <Input
              ref={setInputRef}
              id={ids.control}
              label={label}
              optional={optional}
              placeholder={placeholder}
              type="tel"
              inputMode="tel"
              autoComplete={autoComplete}
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
        </FieldRow>

        <FieldMessage id={ids.message} message={message} />

        {name && <input type="hidden" name={name} value={e164} disabled={isDisabled} />}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';
