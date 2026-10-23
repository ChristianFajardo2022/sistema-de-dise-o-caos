import { forwardRef } from 'react';
import type { ChangeEvent } from 'react';
import type { InlineFieldProps, InlineFieldState } from './InlineField.types';
import {
  inlineFieldChipVariants,
  inlineFieldControlWrapVariants,
  inlineFieldInputVariants,
  inlineFieldLabelVariants,
  inlineFieldRowVariants,
} from './InlineField.variants';
import { cn } from '../../utils/cn';
import { FieldMessage, FieldRow, useField } from '../Field';

/**
 * Campo de texto "en línea" (set Text field 2 de Figma): sin recuadro, con label flotante, texto
 * que puede ser grande (`size="md"`) y un chip opcional a la derecha para unidad, moneda o etiqueta.
 * El `ref` y los atributos nativos (`required`, `readOnly`…) van al `<input>`; `className` y `rootProps` van a la raíz.
 */
export const InlineField = forwardRef<HTMLInputElement, InlineFieldProps>(
  (
    {
      label,
      optional = false,
      size = 'sm',
      suffix,
      tooltip,
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
      onChange,
      onValueChange,
      'aria-describedby': ariaDescribedBy,
      ...restProps
    },
    ref
  ) => {
    // `success-value` y `active` no son estados de la base: se resuelven aquí
    const field = useField({
      id,
      helperText,
      errorText,
      successText,
      tooltip,
      state: state === 'disabled' || state === 'error' || state === 'success' ? state : 'default',
      disabled,
    });
    const { ids, message, isDisabled, isError, isSuccess } = field;
    const suffixId = `${ids.control}-suffix`;

    // Prioridad visual: disabled > error > success > state forzado
    const computedState: InlineFieldState = isDisabled ? 'disabled' : isError ? 'error' : isSuccess ? 'success' : state;

    // Estados forzados de documentación: el label siempre arriba y el placeholder visible
    const forceFloat = state !== 'default' && state !== 'disabled';
    const hasSuffix = suffix !== undefined && suffix !== null && suffix !== false;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      onValueChange?.(event.target.value);
    };

    return (
      <div
        {...rootProps}
        className={cn('flex flex-col gap-ds-space-general-md', fullWidth ? 'w-full' : 'w-[320px] max-w-full', rootProps?.className, className)}
      >
        <FieldRow tooltip={tooltip ? { id: ids.tooltip, text: tooltip, disabled: isDisabled } : null}>
          <div className={inlineFieldRowVariants({ size, state: computedState })}>
            <div data-figma-part="Text field" className={inlineFieldControlWrapVariants()}>
              <input
                ref={ref}
                id={ids.control}
                data-figma-part="Placeholder"
                type={type ?? 'text'}
                // " " mantiene :placeholder-shown para flotar el label sin estado en JS
                placeholder={placeholder || ' '}
                disabled={isDisabled}
                aria-invalid={isError || undefined}
                aria-describedby={field.describedBy(hasSuffix && suffixId, ariaDescribedBy)}
                className={inlineFieldInputVariants({ size, showPlaceholder: forceFloat && Boolean(placeholder) })}
                {...restProps}
                onChange={handleChange}
              />
              <label
                htmlFor={ids.control}
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
        </FieldRow>

        <FieldMessage id={ids.message} message={message} className="mt-ds-space-general-md" />
      </div>
    );
  }
);

InlineField.displayName = 'InlineField';
