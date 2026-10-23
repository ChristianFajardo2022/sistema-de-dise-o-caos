import { forwardRef, useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { ChangeEvent, CSSProperties } from 'react';
import type { TextareaProps } from './Textarea.types';
import { textareaControlVariants, textareaCounterVariants } from './Textarea.variants';
import { cn } from '../../utils/cn';
import { useMergedRefs } from '../../utils/refs';
import { FieldLabel, FieldMessage, FieldRow, useField } from '../Field';
import { inputFieldVariants } from '../Input';

/** Espacio vertical que ocupan el label y su separación sobre la primera línea (21) más el pie (1). */
const PAD_Y = 22;
const LINE = 'var(--ds-responsive-typography-field-line-height-sm)';

const supportsFieldSizing = () =>
  typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('field-sizing', 'content');

/**
 * Área de texto con la base visual de Input (tipo Coment de General input): label flotante,
 * mensajes con NotificationText y contador `n/máx` cuando hay `maxLength`.
 * El `ref` y los atributos nativos van al `<textarea>`; `className` y `rootProps` van a la raíz.
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
      onValueChange,
      style,
      'aria-describedby': ariaDescribedBy,
      ...restProps
    },
    ref
  ) => {
    const field = useField({ id, helperText, errorText, successText, tooltip, state, disabled, readOnly });
    const { ids, message, isDisabled, isError, visualState } = field;
    const counterId = `${ids.control}-counter`;
    const areaRef = useRef<HTMLTextAreaElement>(null);
    const setAreaRef = useMergedRefs(areaRef, ref);

    const [innerLength, setInnerLength] = useState(String(defaultValue ?? '').length);
    const length = value !== undefined ? String(value).length : innerLength;

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setInnerLength(e.target.value.length);
      onChange?.(e);
      onValueChange?.(e.target.value);
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

    // Estados forzados de documentación y burnt-in: el label siempre arriba
    const forceFloat = !isDisabled && (readOnly || ['filled', 'active', 'burnt-in', 'error', 'success'].includes(state));

    const showCounter = maxLength !== undefined;
    const mutedCounter = visualState === 'disabled' || visualState === 'burnt-in' || visualState === 'error';

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
        <FieldRow always tooltip={tooltip ? { id: ids.tooltip, text: tooltip, disabled: isDisabled } : null}>
          <div
            className={cn(
              inputFieldVariants({ variant: 'text', state: visualState }),
              // Alto según el contenido y padding vertical 1 menos (el bloque de texto mide 41 con la primera línea)
              'h-auto py-[calc(var(--ds-responsive-space-field-sm)-1px)] flex-col items-stretch [--input-field-gap:var(--ds-responsive-space-general-2xl)]'
            )}
          >
            <div data-figma-part="Text field" className="relative min-w-0 [--input-label-rest-top:0px]">
              <textarea
                ref={setAreaRef}
                id={ids.control}
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
                aria-describedby={field.describedBy(showCounter && counterId, ariaDescribedBy)}
                style={{ ...autoStyle, ...style }}
                className={textareaControlVariants({
                  resize: autoResize || isDisabled || readOnly ? 'none' : resize,
                  showPlaceholder: forceFloat && Boolean(placeholder),
                  auto: autoResize,
                })}
                {...restProps}
                onChange={handleChange}
              />
              <FieldLabel
                htmlFor={ids.control}
                data-figma-part="Label"
                float={forceFloat}
                optional={optional}
                optionalClassName="text-ds-typography-field-size-xs leading-(--ds-responsive-typography-field-line-height-xs)"
              >
                {label}
              </FieldLabel>
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
        </FieldRow>

        <FieldMessage id={ids.message} message={message} />
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
