import { forwardRef, useCallback, useId, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import type { ChangeEvent, CSSProperties } from 'react';
import type { TextareaProps, TextareaState } from './Textarea.types';
import { textareaControlVariants, textareaCounterVariants } from './Textarea.variants';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import { inputFieldVariants, inputLabelVariants } from '../Input';
import { NotificationText } from '../NotificationText';

/** Espacio vertical que ocupan el label y su separación sobre la primera línea (21) más el pie (1). */
const PAD_Y = 22;
const LINE = 'var(--ds-responsive-typography-field-line-height-sm)';
const ICON_SLOT = 'inline-flex size-4 shrink-0 items-center justify-center text-(color:--ico) [&>svg]:size-full';

const supportsFieldSizing = () =>
  typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('field-sizing', 'content');

/**
 * Área de texto con la base visual de Input (tipo Coment de General input): label flotante,
 * mensajes con NotificationText y contador `n/máx` cuando hay `maxLength`.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      optional = false,
      tooltip,
      helperText,
      errorText,
      successText,
      fullWidth = false,
      state = 'default',
      disabled = false,
      readOnly = false,
      rows = 1,
      maxRows,
      autoResize = false,
      resize = 'vertical',
      maxLength,
      placeholder,
      className,
      rootProps,
      id,
      value,
      defaultValue,
      onChange,
      style,
      'aria-describedby': ariaDescribedBy,
      ...restProps
    },
    ref
  ) => {
    const autoId = useId();
    const textId = id ?? autoId;
    const messageId = `${textId}-message`;
    const tooltipId = `${textId}-tooltip`;
    const counterId = `${textId}-counter`;
    const areaRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(ref, () => areaRef.current as HTMLTextAreaElement);

    const [innerLength, setInnerLength] = useState(String(defaultValue ?? '').length);
    const length = value !== undefined ? String(value).length : innerLength;

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setInnerLength(e.target.value.length);
      onChange?.(e);
    };

    // Respaldo cuando el navegador no tiene field-sizing: la altura sale del contenido
    const fit = useCallback(() => {
      const el = areaRef.current;
      if (!el || !autoResize || supportsFieldSizing()) return;
      const line = parseFloat(getComputedStyle(el).lineHeight) || 18;
      el.style.height = 'auto';
      const min = PAD_Y + rows * line;
      const max = maxRows ? PAD_Y + maxRows * line : Infinity;
      el.style.height = `${Math.min(Math.max(el.scrollHeight, min), max)}px`;
    }, [autoResize, rows, maxRows]);
    useLayoutEffect(fit, [fit, length, value]);

    const isDisabled = disabled || state === 'disabled';
    const isError = Boolean(errorText) || state === 'error';
    const isSuccess = !isError && (Boolean(successText) || state === 'success');

    // Prioridad visual: disabled > error > success > burnt-in (readOnly) > state forzado
    const computedState: TextareaState = isDisabled
      ? 'disabled'
      : isError
        ? 'error'
        : isSuccess
          ? 'success'
          : readOnly || state === 'burnt-in'
            ? 'burnt-in'
            : state;

    // Estados forzados de documentación y burnt-in: el label siempre arriba
    const forceFloat = !isDisabled && (readOnly || ['filled', 'active', 'burnt-in', 'error', 'success'].includes(state));

    // Mensaje: error > success > helper
    const message = errorText
      ? { kind: 'error' as const, text: errorText }
      : successText
        ? { kind: 'success' as const, text: successText }
        : helperText
          ? { kind: 'helper' as const, text: helperText }
          : null;

    const showCounter = maxLength !== undefined;
    const mutedCounter = computedState === 'disabled' || computedState === 'burnt-in' || computedState === 'error';

    // Con autoResize el alto mínimo y máximo salen de las líneas; sin él manda el atributo rows
    const autoStyle: CSSProperties | undefined = autoResize
      ? {
          minHeight: `calc(${PAD_Y}px + ${rows} * ${LINE})`,
          maxHeight: maxRows ? `calc(${PAD_Y}px + ${maxRows} * ${LINE})` : undefined,
        }
      : undefined;

    return (
      <div
        {...rootProps}
        className={cn('flex flex-col gap-ds-space-general-lg', fullWidth ? 'w-full' : 'w-[320px] max-w-full', rootProps?.className, className)}
      >
        <div className="flex items-center gap-ds-space-general-lg">
          <div
            className={cn(
              inputFieldVariants({ variant: 'text', state: computedState }),
              'h-auto! py-[calc(var(--ds-responsive-space-field-sm)-1px)]! flex-col items-stretch [--input-field-gap:var(--ds-responsive-space-general-2xl)]'
            )}
          >
            <div
              data-figma-part="Text field"
              className="relative min-w-0 [--input-label-rest-top:0px]"
            >
              <textarea
                ref={areaRef}
                id={textId}
                data-figma-part="Placeholder"
                rows={rows}
                maxLength={maxLength}
                value={value}
                defaultValue={defaultValue}
                // " " mantiene :placeholder-shown para flotar el label sin estado en JS
                placeholder={placeholder || ' '}
                disabled={isDisabled}
                readOnly={readOnly}
                aria-invalid={isError || undefined}
                aria-describedby={
                  cn(message && messageId, tooltip && tooltipId, showCounter && counterId, ariaDescribedBy) || undefined
                }
                style={{ ...autoStyle, ...style }}
                className={textareaControlVariants({
                  resize: autoResize || isDisabled || readOnly ? 'none' : resize,
                  showPlaceholder: forceFloat && Boolean(placeholder),
                  auto: autoResize,
                })}
                {...restProps}
                onChange={handleChange}
              />
              <label
                htmlFor={textId}
                data-figma-part="Label"
                className={inputLabelVariants({ float: forceFloat ? 'always' : 'auto' })}
              >
                {label}
                {optional && (
                  <span data-figma-part="| Opcional" className="text-ds-text-acent-firts text-ds-typography-field-size-xs leading-(--ds-responsive-typography-field-line-height-xs)">
                    {' '}
                    | Opcional
                  </span>
                )}
              </label>
            </div>
            {showCounter && (
              <span
                id={counterId}
                data-figma-part="0/200"
                className={textareaCounterVariants({ tone: mutedCounter ? 'muted' : 'secondary' })}
              >
                {`${length}/${maxLength}`}
              </span>
            )}
          </div>

          {tooltip && (
            <>
              {/* Texto del tooltip para lectores de pantalla; lo referencia aria-describedby del campo */}
              <span id={tooltipId} className="sr-only">
                {tooltip}
              </span>
              <button
                type="button"
                aria-label={tooltip}
                title={tooltip}
                className={cn(
                  ICON_SLOT,
                  'cursor-help rounded-sm border-0 bg-transparent p-0 outline-hidden',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
                  '[--ico:var(--color-ds-icon-general-white)]',
                  isDisabled && '[--ico:var(--color-ds-icon-general-disabled-positive)]'
                )}
              >
                <Icon name="info-circle" size={16} variant="fill" />
              </button>
            </>
          )}
        </div>

        {/* Región viva siempre montada; vacía sale del flujo (sr-only) para que no sume gap */}
        <div aria-live="polite" className={message ? undefined : 'sr-only'}>
          {message && (
            <NotificationText
              id={messageId}
              state={message.kind === 'success' ? 'confirmation' : message.kind}
              announce={false}
            >
              {message.text}
            </NotificationText>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
