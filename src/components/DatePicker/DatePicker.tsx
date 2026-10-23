import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, FocusEvent, KeyboardEvent, SyntheticEvent } from 'react';
import type { DatePickerProps } from './DatePicker.types';
import {
  formatRangeWithPattern,
  formatWithPattern,
  getDatePattern,
  maskDateText,
  parseWithPattern,
  RANGE_SEPARATOR,
  toIsoDate,
} from './DatePicker.utils';
import { datePickerButtonVariants, datePickerPanelVariants, datePickerVariants } from './DatePicker.variants';
import { Calendar } from '../Calendar';
import type { DateRange } from '../Calendar';
import { compareDays, startOfDay } from '../Calendar/Calendar.utils';
import { FieldLabel, FieldMessage, FieldRow, joinIds, resolveField, useField } from '../Field';
import { Icon } from '../Icon';
import { inputControlVariants, inputFieldVariants } from '../Input';
import type { InputState } from '../Input';
import { useAnchoredPosition } from '../../utils/anchoredPosition';
import { cn } from '../../utils/cn';
import { useMergedRefs } from '../../utils/refs';

/** Separación entre el campo y el calendario (Figma: 8). */
const OFFSET = 8;

const EMPTY_RANGE: DateRange = { start: null, end: null };

type Value = Date | null | DateRange;
type ValidationError = 'invalid' | 'unavailable' | null;

const sameDay = (a: Date | null, b: Date | null) => (a && b ? compareDays(a, b) === 0 : a === b);
const sameValue = (a: Value, b: Value, range: boolean) => {
  if (!range) return sameDay(a as Date | null, b as Date | null);
  const ra = (a as DateRange | null) ?? EMPTY_RANGE;
  const rb = (b as DateRange | null) ?? EMPTY_RANGE;
  return sameDay(ra.start, rb.start) && sameDay(ra.end, rb.end);
};

/**
 * Campo de fecha (set "Date picker" de Figma): el campo de Input con un botón de calendario a la derecha que abre el
 * Calendar debajo, en un popover nativo no modal.
 *
 * - Se puede escribir la fecha en el formato del idioma (dd/mm/aaaa en español) con una máscara ligera; se valida al
 *   salir del campo o con Enter (formato, fecha real, `minDate`/`maxDate` e `isDateDisabled`).
 * - Patrón WAI-ARIA APG "Date Picker Dialog": botón "Elegir fecha" (con la fecha actual en el nombre accesible),
 *   `aria-haspopup="dialog"` y `aria-expanded`; al abrir, el foco va al día elegido o a hoy; Esc cierra y devuelve el
 *   foco al botón; Aplicar confirma y Cancelar descarta (con `showActions`). Alt + Flecha abajo en el campo también abre.
 * - El `ref` va al input de texto (como Input); `className`, `rootProps` y el resto de props van a la raíz.
 */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>((props, ref) => {
  const {
    mode = 'single',
    value: valueProp,
    defaultValue,
    onValueChange,
    onChange,
    label,
    optional = false,
    tooltip,
    helperText,
    errorText,
    successText,
    placeholder,
    locale = 'es',
    format: formatProp,
    parse: parseProp,
    minDate,
    maxDate,
    isDateDisabled,
    showActions = true,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    calendarProps,
    pickerLabel,
    invalidDateText,
    unavailableDateText,
    state = 'default',
    disabled = false,
    readOnly = false,
    required,
    fullWidth = false,
    name,
    id,
    inputProps,
    inputRef,
    rootProps,
    className,
    onBlur: onRootBlur,
    ...rest
  } = props as Omit<DatePickerProps, 'value' | 'defaultValue' | 'onChange' | 'onValueChange' | 'mode'> & {
    mode?: 'single' | 'range';
    value?: Value;
    defaultValue?: Value;
    onValueChange?: (value: Value) => void;
    onChange?: (value: Value) => void;
  };

  const isRange = mode === 'range';
  const { ids } = useField({ id });
  const inputId = ids.control;
  const hintId = `${inputId}-hint`;
  const panelId = `${inputId}-calendar`;

  // ── Formato ──
  const pattern = useMemo(() => getDatePattern(locale), [locale]);
  const format = useCallback((d: Date) => (formatProp ? formatProp(d) : formatWithPattern(d, pattern)), [formatProp, pattern]);
  const parse = useCallback(
    (text: string) => {
      const d = parseProp ? parseProp(text) : parseWithPattern(text, pattern);
      return d ? startOfDay(d) : null;
    },
    [parseProp, pattern]
  );
  const longDate = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    [locale]
  );

  // ── Valor (controlado o no) ──
  const [innerValue, setInnerValue] = useState<Value>(defaultValue ?? (isRange ? EMPTY_RANGE : null));
  const value: Value = valueProp !== undefined ? valueProp : innerValue;
  const single = isRange ? null : ((value as Date | null) ?? null);
  const range = isRange ? ((value as DateRange | null) ?? EMPTY_RANGE) : EMPTY_RANGE;
  const commit = (next: Value) => {
    if (sameValue(next, value, isRange)) return;
    if (valueProp === undefined) setInnerValue(next);
    onValueChange?.(next);
    onChange?.(next);
  };

  const toText = useCallback(
    (v: Value) => (isRange ? formatRangeWithPattern((v as DateRange | null) ?? EMPTY_RANGE, format) : v ? format(v as Date) : ''),
    [isRange, format]
  );

  // ── Texto del campo ──
  const [text, setText] = useState(() => toText(value));
  const [validation, setValidation] = useState<ValidationError>(null);

  const isUnavailable = (d: Date) =>
    (!!minDate && compareDays(d, minDate) < 0) || (!!maxDate && compareDays(d, maxDate) > 0) || !!isDateDisabled?.(d);

  /** Lee el texto: el valor si es válido, o el tipo de error. Vacío = sin fecha. */
  const readText = (raw: string): { value: Value; error: ValidationError } => {
    const t = raw.trim();
    if (!t) return { value: isRange ? EMPTY_RANGE : null, error: null };
    if (!isRange) {
      const d = parse(t);
      if (!d) return { value: null, error: 'invalid' };
      return isUnavailable(d) ? { value: null, error: 'unavailable' } : { value: d, error: null };
    }
    const pieces = t.split(/\s*[–—]\s*|\s+-\s+/);
    if (pieces.length !== 2) return { value: EMPTY_RANGE, error: 'invalid' };
    const [start, end] = pieces.map(parse);
    if (!start || !end || compareDays(end, start) < 0) return { value: EMPTY_RANGE, error: 'invalid' };
    if (isUnavailable(start) || isUnavailable(end)) return { value: EMPTY_RANGE, error: 'unavailable' };
    return { value: { start, end }, error: null };
  };

  const valueKey = isRange ? `${range.start?.getTime()}-${range.end?.getTime()}` : `${single?.getTime()}`;
  // Si el valor cambia por fuera (prop, calendario), el texto lo sigue; no pisa lo que se está escribiendo si ya equivale.
  // Se ajusta durante el render (patrón de React para estado derivado de props), sin efecto
  const [syncedKey, setSyncedKey] = useState(`${valueKey}|${mode}`);
  if (syncedKey !== `${valueKey}|${mode}`) {
    setSyncedKey(`${valueKey}|${mode}`);
    const read = readText(text);
    if (read.error || !sameValue(read.value, value, isRange)) setText(toText(value));
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const el = event.target;
    const native = event.nativeEvent as InputEvent;
    let next = el.value;
    const atEnd = el.selectionStart === next.length;
    // Máscara solo al escribir al final: editar en medio o borrar no mueve el cursor
    if (!parseProp && native.inputType === 'insertText' && atEnd) next = maskDateText(next, pattern, isRange);
    setText(next);
    // Una fecha completa y válida se aplica al momento; los errores se muestran al salir del campo
    const read = readText(next);
    if (!read.error) {
      setValidation(null);
      commit(read.value);
    }
  };

  const validateText = () => {
    const read = readText(text);
    setValidation(read.error);
    if (!read.error) {
      commit(read.value);
      setText(toText(read.value));
    }
  };

  // ── Apertura ──
  const [openState, setOpenState] = useState(defaultOpen);
  const open = openProp ?? openState;
  const isDisabled = disabled || state === 'disabled';
  const isBurntIn = !isDisabled && (readOnly || state === 'burnt-in');
  const inline = state === 'active' && !isDisabled && !isBurntIn;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const focusOnOpen = useRef(false);
  // El calendario recibe el foco al montar si se abrió con el botón o el teclado
  const [focusCalendar, setFocusCalendar] = useState(false);

  const setRootRef = useMergedRefs(rootRef, rootProps?.ref);
  // `inputRef` (obsoleto) sigue recibiendo el input, igual que `ref`
  const setInputRef = useMergedRefs(ref, inputRef);

  // Selección en curso dentro del calendario (se confirma con Aplicar) y mes visible
  const [draft, setDraft] = useState<Value>(value);
  const anchorOf = (v: Value) => (isRange ? ((v as DateRange | null)?.start ?? null) : ((v as Date | null) ?? null));
  const [month, setMonth] = useState<Date>(() => anchorOf(value) ?? calendarProps?.defaultMonth ?? calendarProps?.today ?? new Date());

  // Estado controlado o inicial -> popover nativo
  useEffect(() => {
    const pop = panelRef.current;
    if (inline || !pop || typeof pop.showPopover !== 'function') return;
    const isOpen = pop.matches(':popover-open');
    if (open && !isOpen) pop.showPopover();
    else if (!open && isOpen) pop.hidePopover();
  }, [open, inline]);

  // Mientras esté abierto, seguir al campo: alineado a su borde derecho, 8 por debajo (arriba si no cabe; si no cabe en
  // ningún lado, el lado con más espacio con el alto limitado, así Aplicar y Cancelar siempre se alcanzan)
  const getAnchor = useCallback(() => fieldRef.current, []);
  useAnchoredPosition(open && !inline, panelRef, getAnchor, { align: 'end', offset: OFFSET });

  const handleBeforeToggle = (event: SyntheticEvent<HTMLDivElement>) => {
    // React propaga el toggle de los popovers internos (Mes/Año del rango): solo cuenta el propio
    if (event.target !== event.currentTarget || (event.nativeEvent as ToggleEvent).newState !== 'open') return;
    // Oculto hasta medir y colocar; el calendario parte de la fecha actual
    panelRef.current!.style.visibility = 'hidden';
    setDraft(value);
    setMonth(anchorOf(value) ?? calendarProps?.defaultMonth ?? calendarProps?.today ?? new Date());
  };

  const handleToggle = (event: SyntheticEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    const next = (event.nativeEvent as ToggleEvent).newState === 'open';
    // La posición se calcula en el efecto de `open`, cuando el calendario ya está montado
    if (next) {
      setFocusCalendar(focusOnOpen.current);
    } else if (panelRef.current?.contains(document.activeElement) || document.activeElement === document.body) {
      // Cierre con el foco dentro (o perdido): vuelve al botón
      buttonRef.current?.focus();
    }
    focusOnOpen.current = false;
    setOpenState(next);
    if (next !== open) onOpenChange?.(next);
  };

  const close = (returnFocus: boolean) => {
    if (inline) {
      if (returnFocus) buttonRef.current?.focus();
      return;
    }
    const pop = panelRef.current;
    if (pop?.matches(':popover-open')) pop.hidePopover();
    if (returnFocus) buttonRef.current?.focus();
  };

  const openFromKeyboard = () => {
    const pop = panelRef.current;
    if (!pop || inline || pop.matches(':popover-open')) return;
    focusOnOpen.current = true;
    pop.showPopover();
  };

  const handlePanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    // Un desplegable interno (Mes/Año del rango) ya consumió el Esc
    if (event.key !== 'Escape' || event.defaultPrevented) return;
    event.preventDefault();
    close(true);
  };

  // Foco fuera del campo y del calendario (Tab): el diálogo no modal se cierra sin mover el foco
  const handleRootBlur = (event: FocusEvent<HTMLDivElement>) => {
    onRootBlur?.(event);
    if (event.defaultPrevented) return;
    const to = event.relatedTarget as Node | null;
    if (!open || inline) return;
    if (!to) {
      // Sin destino: el foco salió del documento (barra del navegador, otra ventana) o se pulsó algo no enfocable.
      // Se cierra si el documento perdió el foco o si el foco acabó en un elemento ajeno al campo.
      requestAnimationFrame(() => {
        const active = document.activeElement;
        const outside = active && active !== document.body && !rootRef.current?.contains(active);
        if (!document.hasFocus() || outside) close(false);
      });
      return;
    }
    if (rootRef.current?.contains(to)) return;
    close(false);
  };

  const applyValue = (next: Value) => {
    commit(next);
    setValidation(null);
    setText(toText(next));
    close(true);
  };

  const handleCalendarChange = (next: Value) => {
    setDraft(next);
    if (showActions) return;
    if (!isRange || (next as DateRange).end) applyValue(next);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    inputProps?.onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === 'Enter') validateText();
    if (event.key === 'ArrowDown' && event.altKey && !isBurntIn) {
      event.preventDefault();
      openFromKeyboard();
    }
  };

  // ── Estado visual ──
  const validationText =
    validation === 'invalid'
      ? (invalidDateText ?? `Escribe una fecha válida (${isRange ? `${pattern.hint}${RANGE_SEPARATOR}${pattern.hint}` : pattern.hint})`)
      : validation === 'unavailable'
        ? (unavailableDateText ?? 'Esa fecha no está disponible')
        : undefined;
  const shownError = errorText ?? validationText;
  // La validación interna es un error más: se resuelve con la base común
  const { message, isError, isSuccess, visualState } = resolveField({ errorText: shownError, successText, helperText, state, disabled, readOnly });
  const isOpen = open || inline;
  const fieldState: InputState = isDisabled || isError || isSuccess || isBurntIn ? visualState : isOpen ? 'active' : state;

  const forceFloat = !isDisabled && (isBurntIn || isOpen || ['filled', 'active', 'error', 'success'].includes(state));

  const hint = isRange ? `${pattern.hint}${RANGE_SEPARATOR}${pattern.hint}` : pattern.hint;
  const shownPlaceholder = placeholder ?? hint;

  // Nombre accesible del botón: la acción y, si la hay, la fecha actual (APG)
  const baseLabel = pickerLabel ?? (isRange ? 'Elegir fechas' : 'Elegir fecha');
  const currentLabel = isRange
    ? range.start && range.end
      ? `${longDate.format(range.start)} – ${longDate.format(range.end)}`
      : ''
    : single
      ? longDate.format(single)
      : '';
  const buttonLabel = currentLabel ? `${baseLabel}, ${currentLabel}` : baseLabel;

  const hiddenValue = isRange
    ? range.start && range.end
      ? `${toIsoDate(range.start)}/${toIsoDate(range.end)}`
      : ''
    : single
      ? toIsoDate(single)
      : '';

  const calendar = (
    <Calendar
      key={mode}
      weekStartsOn={calendarProps?.weekStartsOn}
      showOutsideDays={calendarProps?.showOutsideDays}
      today={calendarProps?.today}
      defaultView={calendarProps?.defaultView}
      {...(isRange
        ? { mode: 'range' as const, value: (draft as DateRange | null) ?? EMPTY_RANGE, onChange: handleCalendarChange }
        : { mode: 'single' as const, value: (draft as Date | null) ?? null, onChange: handleCalendarChange })}
      month={month}
      onMonthChange={setMonth}
      locale={locale}
      minDate={minDate}
      maxDate={maxDate}
      isDateDisabled={isDateDisabled}
      showActions={showActions}
      autoFocus={focusCalendar}
      labels={{ cancel: 'Cancelar', apply: 'Aplicar', ...calendarProps?.labels }}
      onApply={(v) => applyValue(v)}
      onCancel={() => close(true)}
      className={cn(!isRange && 'w-120 max-w-full', calendarProps?.className)}
    />
  );

  return (
    <div
      {...rest}
      {...rootProps}
      ref={setRootRef}
      className={cn(datePickerVariants({ fullWidth }), rootProps?.className, className)}
      onBlur={handleRootBlur}
    >
      <FieldRow always tooltip={tooltip ? { id: ids.tooltip, text: tooltip, disabled: isDisabled } : null}>
        <div ref={fieldRef} className={inputFieldVariants({ variant: 'text', state: fieldState })}>
          <div
            className={cn(
              'relative h-10 min-w-0 flex-1',
              fieldState === 'burnt-in' && '[--lbl-up:var(--color-ds-text-field-disabled-negative)]'
            )}
          >
            <input
              {...inputProps}
              ref={setInputRef}
              id={inputId}
              type="text"
              inputMode="numeric"
              autoComplete={inputProps?.autoComplete ?? 'off'}
              data-figma-part="00/00/0000"
              value={text}
              // " " mantiene :placeholder-shown para flotar el label sin estado en JS (como Input)
              placeholder={shownPlaceholder || ' '}
              disabled={isDisabled}
              readOnly={isBurntIn}
              required={required}
              aria-invalid={isError || undefined}
              aria-describedby={joinIds(message && ids.message, hintId, tooltip && ids.tooltip, inputProps?.['aria-describedby'])}
              onChange={handleInputChange}
              onBlur={(e) => {
                inputProps?.onBlur?.(e);
                validateText();
              }}
              onKeyDown={handleInputKeyDown}
              className={cn(
                inputControlVariants({ showPlaceholder: forceFloat && Boolean(shownPlaceholder) && !isBurntIn }),
                inputProps?.className
              )}
            />
            <FieldLabel htmlFor={inputId} data-figma-part="Label" float={forceFloat} optional={optional}>
              {label}
            </FieldLabel>
            <span id={hintId} className="sr-only">
              {`Formato ${hint}`}
            </span>
          </div>

          <button
            ref={buttonRef}
            type="button"
            aria-label={buttonLabel}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-controls={panelId}
            popoverTarget={inline ? undefined : panelId}
            disabled={isDisabled || isBurntIn}
            onClick={() => {
              focusOnOpen.current = true;
            }}
            className={datePickerButtonVariants({ muted: isDisabled || isBurntIn })}
          >
            <span data-figma-part="Icon Right" aria-hidden="true" className="inline-flex size-4 items-center justify-center">
              <Icon name="calendar" size={16} variant="fill" className="size-full" />
            </span>
          </button>
        </div>

      </FieldRow>

      <FieldMessage id={ids.message} message={message} />

      {name && <input type="hidden" name={name} value={hiddenValue} disabled={isDisabled} />}

      <div
        ref={panelRef}
        id={panelId}
        role="dialog"
        aria-label={`${baseLabel}: ${label}`}
        popover={inline ? undefined : 'auto'}
        onBeforeToggle={inline ? undefined : handleBeforeToggle}
        onToggle={inline ? undefined : handleToggle}
        onKeyDown={handlePanelKeyDown}
        className={datePickerPanelVariants({ placement: inline ? 'inline' : 'popover' })}
      >
        {/* Cerrado, el popover no se ve: el calendario solo se monta abierto para no fijar su estado interno */}
        {isOpen && calendar}
      </div>
    </div>
  );
});

DatePicker.displayName = 'DatePicker';
