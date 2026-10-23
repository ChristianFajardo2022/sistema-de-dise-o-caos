import { forwardRef, useId } from 'react';
import type { InlineFieldProps, InlineFieldState } from './InlineField.types';
import {
  inlineFieldChipVariants,
  inlineFieldControlWrapVariants,
  inlineFieldInputVariants,
  inlineFieldLabelVariants,
  inlineFieldRowVariants,
} from './InlineField.variants';
import { cn } from '../../utils/cn';
import { NotificationText } from '../NotificationText';

/**
 * Campo de texto "en línea" (set Text field 2 de Figma): sin recuadro, con label flotante, texto
 * que puede ser grande (`size="md"`) y un chip opcional a la derecha para unidad, moneda o etiqueta.
 */
export const InlineField = forwardRef<HTMLInputElement, InlineFieldProps>(
  (
    {
      label,
      optional = false,
      size = 'sm',
      suffix,
      helperText,
      errorText,
      successText,
      fullWidth = false,
      state = 'default',
      disabled = false,
      placeholder,
      className,
      rootProps,
      id,
      type,
      'aria-describedby': ariaDescribedBy,
      ...restProps
    },
    ref
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const messageId = `${inputId}-message`;
    const suffixId = `${inputId}-suffix`;

    const isDisabled = disabled || state === 'disabled';
    const isError = Boolean(errorText) || state === 'error';
    const isSuccess = !isError && (Boolean(successText) || state === 'success');

    // Prioridad visual: disabled > error > success > state forzado
    const computedState: InlineFieldState = isDisabled
      ? 'disabled'
      : isError
        ? 'error'
        : isSuccess
          ? 'success'
          : state === 'success-value'
            ? 'success-value'
            : state;

    // Estados forzados de documentación: el label siempre arriba y el placeholder visible
    const forceFloat = state !== 'default' && state !== 'disabled';
    const hasSuffix = suffix !== undefined && suffix !== null && suffix !== false;

    // Mensaje: error > success > helper
    const message = errorText
      ? { kind: 'error' as const, text: errorText }
      : successText
        ? { kind: 'success' as const, text: successText }
        : helperText
          ? { kind: 'helper' as const, text: helperText }
          : null;

    return (
      <div
        {...rootProps}
        className={cn('flex flex-col gap-ds-space-general-md', fullWidth ? 'w-full' : 'w-[320px] max-w-full', rootProps?.className, className)}
      >
        <div className={inlineFieldRowVariants({ size, state: computedState })}>
          <div data-figma-part="Text field" className={inlineFieldControlWrapVariants()}>
            <input
              ref={ref}
              id={inputId}
              data-figma-part="Placeholder"
              type={type ?? 'text'}
              // " " mantiene :placeholder-shown para flotar el label sin estado en JS
              placeholder={placeholder || ' '}
              disabled={isDisabled}
              aria-invalid={isError || undefined}
              aria-describedby={cn(message && messageId, hasSuffix && suffixId, ariaDescribedBy) || undefined}
              className={inlineFieldInputVariants({ size, showPlaceholder: forceFloat && Boolean(placeholder) })}
              {...restProps}
            />
            <label
              htmlFor={inputId}
              data-figma-part="Label"
              className={inlineFieldLabelVariants({ size, float: forceFloat ? 'always' : 'auto' })}
            >
              {label}
              {optional && (
                <span data-figma-part="| Opcional" className="text-(color:--opt) text-ds-typography-field-size-xs leading-(--ds-responsive-typography-field-line-height-xs)">
                  {' '}
                  | Opcional
                </span>
              )}
            </label>
          </div>
          {hasSuffix && (
            <span id={suffixId} data-figma-part="Container text" className={inlineFieldChipVariants({ size })}>
              <span data-figma-part="Text">{suffix}</span>
            </span>
          )}
        </div>

        {/* Región viva siempre montada; vacía sale del flujo (sr-only) para que no sume gap */}
        <div aria-live="polite" className={message ? undefined : 'sr-only'}>
          {message && (
            <NotificationText
              id={messageId}
              state={message.kind === 'success' ? 'confirmation' : message.kind}
              announce={false}
              className="mt-ds-space-general-md"
            >
              {message.text}
            </NotificationText>
          )}
        </div>
      </div>
    );
  }
);

InlineField.displayName = 'InlineField';
