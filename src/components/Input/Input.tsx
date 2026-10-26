import { forwardRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { InputProps } from './Input.types';
import { inputControlVariants, inputFieldVariants } from './Input.variants';
import { EyeIcon } from '../../icons/EyeIcon';
import { EyeSlashIcon } from '../../icons/EyeSlashIcon';
import { InfoCircleIcon } from '../../icons/InfoCircleIcon';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import { FIELD_FOCUS_RING, FIELD_ICON_SLOT, FieldLabel, FieldMessage, FieldRow, useField } from '../Field';

/**
 * Campo de texto (set "General input": Text, Password, Search y Search header) y base visual de los demás controles
 * de formulario. El `ref` y los atributos nativos van al `<input>`; `className` y `rootProps` van a la raíz.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'text',
      label,
      optional = false,
      tooltip,
      helperText,
      errorText,
      successText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      state = 'default',
      disabled = false,
      readOnly = false,
      type,
      placeholder,
      className,
      rootProps,
      id,
      onChange,
      onValueChange,
      'aria-describedby': ariaDescribedBy,
      ...restProps
    },
    ref
  ) => {
    const field = useField({ id, helperText, errorText, successText, tooltip, state, disabled, readOnly });
    const { ids, message, isDisabled, isError, visualState } = field;
    const [showPassword, setShowPassword] = useState(false);

    // Estados forzados de documentación y burnt-in: el label siempre arriba
    const forceFloat = !isDisabled && (readOnly || ['filled', 'active', 'burnt-in', 'error', 'success'].includes(state));

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      onValueChange?.(event.target.value);
    };

    const isPassword = variant === 'password';
    const isSearch = variant === 'search' || variant === 'search-header';
    const nativeType = isPassword ? (showPassword ? 'text' : 'password') : isSearch ? 'search' : (type ?? 'text');
    // Lupa de Figma: "Icon Search", ícono `search` relleno de 16 de la biblioteca
    const leading = leftIcon ?? (isSearch ? <Icon name="search" size={16} variant="fill" /> : null);

    return (
      <div {...rootProps} className={cn('flex flex-col', fullWidth ? 'w-full' : 'w-[320px] max-w-full', rootProps?.className, className)}>
        <FieldRow always tooltip={tooltip ? { id: ids.tooltip, text: tooltip, disabled: isDisabled, icon: <InfoCircleIcon /> } : null}>
          <div className={inputFieldVariants({ variant, state: visualState })}>
            {leading && (
              <span
                data-slot="icon-left"
                data-figma-part={isSearch && !leftIcon ? 'Icon Search' : undefined}
                aria-hidden="true"
                className={FIELD_ICON_SLOT}
              >
                {leading}
              </span>
            )}

            <div className="relative h-[40px] min-w-0 flex-1">
              <input
                ref={ref}
                id={ids.control}
                type={nativeType}
                // " " mantiene :placeholder-shown para flotar el label sin estado en JS
                placeholder={placeholder || ' '}
                disabled={isDisabled}
                readOnly={readOnly}
                aria-invalid={isError || undefined}
                aria-describedby={field.describedBy(ariaDescribedBy)}
                className={inputControlVariants({ showPlaceholder: forceFloat && Boolean(placeholder) })}
                {...restProps}
                onChange={handleChange}
              />
              <FieldLabel htmlFor={ids.control} data-figma-part="Label" float={forceFloat} optional={optional}>
                {label}
              </FieldLabel>
            </div>

            {rightIcon && (
              <span data-slot="icon-right" aria-hidden="true" className={FIELD_ICON_SLOT}>
                {rightIcon}
              </span>
            )}

            {isPassword && (
              <button
                type="button"
                disabled={isDisabled}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-pressed={showPassword}
                aria-controls={ids.control}
                onClick={() => setShowPassword((v) => !v)}
                className={cn(FIELD_ICON_SLOT, 'cursor-pointer rounded-sm border-0 bg-transparent p-0', FIELD_FOCUS_RING, 'disabled:cursor-not-allowed')}
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            )}
          </div>
        </FieldRow>

        <FieldMessage id={ids.message} message={message} className="mt-ds-space-general-lg" />
      </div>
    );
  }
);

Input.displayName = 'Input';
