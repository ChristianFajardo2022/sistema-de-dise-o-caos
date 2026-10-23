import { forwardRef, useId, useState } from 'react';
import type { InputProps, InputState } from './Input.types';
import {
  inputControlVariants,
  inputFieldVariants,
  inputLabelVariants,
} from './Input.variants';
import { EyeIcon } from '../../icons/EyeIcon';
import { EyeSlashIcon } from '../../icons/EyeSlashIcon';
import { InfoCircleIcon } from '../../icons/InfoCircleIcon';
import { SearchIcon } from '../../icons/SearchIcon';
import { cn } from '../../utils/cn';
import { NotificationText } from '../NotificationText';

const ICON_SLOT = 'inline-flex size-4 shrink-0 items-center justify-center text-(color:--ico) [&>svg]:size-full';

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
      id,
      'aria-describedby': ariaDescribedBy,
      ...restProps
    },
    ref
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const messageId = `${inputId}-message`;
    const tooltipId = `${inputId}-tooltip`;
    const [showPassword, setShowPassword] = useState(false);

    const isDisabled = disabled || state === 'disabled';
    const isError = Boolean(errorText) || state === 'error';
    const isSuccess = !isError && (Boolean(successText) || state === 'success');

    // Prioridad visual: disabled > error > success > burnt-in (readOnly) > state forzado
    const computedState: InputState = isDisabled
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

    const isPassword = variant === 'password';
    const isSearch = variant === 'search' || variant === 'search-header';
    const nativeType = isPassword ? (showPassword ? 'text' : 'password') : isSearch ? 'search' : (type ?? 'text');
    const leading = leftIcon ?? (isSearch ? <SearchIcon /> : null);

    return (
      <div className={cn('flex flex-col', fullWidth ? 'w-full' : 'w-[320px] max-w-full', className)}>
        <div className="flex items-center gap-ds-space-general-lg">
          <div
            className={inputFieldVariants({ variant, state: computedState })}
          >
            {leading && (
              <span data-slot="icon-left" aria-hidden="true" className={ICON_SLOT}>
                {leading}
              </span>
            )}

            <div className="relative h-[40px] min-w-0 flex-1">
              <input
                ref={ref}
                id={inputId}
                type={nativeType}
                // " " mantiene :placeholder-shown para flotar el label sin estado en JS
                placeholder={placeholder || ' '}
                disabled={isDisabled}
                readOnly={readOnly}
                aria-invalid={isError || undefined}
                aria-describedby={cn(message && messageId, tooltip && tooltipId, ariaDescribedBy) || undefined}
                className={inputControlVariants({ showPlaceholder: forceFloat && Boolean(placeholder) })}
                {...restProps}
              />
              <label htmlFor={inputId} className={inputLabelVariants({ float: forceFloat ? 'always' : 'auto' })}>
                {label}
                {optional && (
                  <span className="text-ds-text-acent-firts"> | Opcional</span>
                )}
              </label>
            </div>

            {rightIcon && (
              <span data-slot="icon-right" aria-hidden="true" className={ICON_SLOT}>
                {rightIcon}
              </span>
            )}

            {isPassword && (
              <button
                type="button"
                disabled={isDisabled}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-pressed={showPassword}
                aria-controls={inputId}
                onClick={() => setShowPassword((v) => !v)}
                className={cn(
                  ICON_SLOT,
                  'cursor-pointer rounded-sm border-0 bg-transparent p-0 outline-hidden',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
                  'disabled:cursor-not-allowed'
                )}
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            )}
          </div>

          {tooltip && (
            <>
            {/* Texto del tooltip para lectores de pantalla; lo referencia aria-describedby del input */}
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
              <InfoCircleIcon />
            </button>
            </>
          )}
        </div>

        <div aria-live="polite">
          {message && (
            <NotificationText
              id={messageId}
              state={message.kind === 'success' ? 'confirmation' : message.kind}
              announce={false}
              className="mt-ds-space-general-lg"
            >
              {message.text}
            </NotificationText>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
