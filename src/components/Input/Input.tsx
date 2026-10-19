import { forwardRef, useId, useState } from 'react';
import { Eye, EyeOff, Search, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import type { InputProps } from './Input.types';
import {
  inputContainerVariants,
  inputWrapperVariants,
  inputFieldVariants,
  labelVariants,
  helperTextVariants,
} from './Input.variants';
import { cn } from '../../utils/cn';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id: externalId,
      label,
      secondaryLabel,
      helperText,
      errorText,
      successText,
      inputType = 'text',
      state = 'default',
      sizeVariant = 'md',
      leftIcon,
      rightIcon,
      tooltip,
      fullWidth = true,
      className,
      disabled,
      required,
      value,
      onChange,
      placeholder,
      'aria-describedby': ariaDescribedBy,
      ...restProps
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = externalId || generatedId;
    const helperTextId = `${inputId}-helper`;
    const errorTextId = `${inputId}-error`;

    const [showPassword, setShowPassword] = useState(false);

    // Compute effective input type (handling password toggle)
    const effectiveType = inputType === 'password' ? (showPassword ? 'text' : 'password') : inputType;

    // Compute effective state (error state takes precedence if errorText is provided)
    const computedState = errorText ? 'error' : state;
    const isDisabled = disabled || computedState === 'disabled';

    // Toggle password visibility
    const handleTogglePassword = () => {
      setShowPassword((prev) => !prev);
    };

    // Determine left icon fallback for search type
    const renderedLeftIcon = leftIcon || (inputType === 'search' ? <Search className="w-4 h-4 text-gray-400" /> : null);

    // Determine right icon fallback for password toggle or status indicators
    let renderedRightIcon = rightIcon;
    if (inputType === 'password') {
      renderedRightIcon = (
        <button
          type="button"
          onClick={handleTogglePassword}
          tabIndex={-1}
          disabled={isDisabled}
          className="p-1 focus:outline-none text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      );
    } else if (!rightIcon && computedState === 'error') {
      renderedRightIcon = <AlertCircle className="w-4 h-4 text-[var(--border-semantic-alert,#e53935)]" />;
    } else if (!rightIcon && computedState === 'success') {
      renderedRightIcon = <CheckCircle2 className="w-4 h-4 text-[var(--border-semantic-success,#43a047)]" />;
    }

    const describedBy = [
      ariaDescribedBy,
      helperText ? helperTextId : null,
      errorText ? errorTextId : null,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={cn(inputContainerVariants({ fullWidth }), className)}>
        {/* Header Label Row */}
        {(label || secondaryLabel || tooltip) && (
          <div className={labelVariants({ sizeVariant })}>
            <label htmlFor={inputId} className="flex items-center gap-1 cursor-pointer font-medium">
              {label}
              {required && <span className="text-[var(--border-semantic-alert,#e53935)]">*</span>}
              {tooltip && (
                <span className="cursor-help text-gray-400 hover:text-gray-600 transition-colors" title={tooltip}>
                  <HelpCircle className="w-3.5 h-3.5 inline" />
                </span>
              )}
            </label>
            {secondaryLabel && (
              <span className="text-xs text-[var(--text-neutral-body,#898e98)] font-normal">{secondaryLabel}</span>
            )}
          </div>
        )}

        {/* Input Wrapper Field */}
        <div className={inputWrapperVariants({ state: computedState, sizeVariant })}>
          {renderedLeftIcon && <div className="flex items-center pr-2 shrink-0">{renderedLeftIcon}</div>}

          <input
            ref={ref}
            id={inputId}
            type={effectiveType}
            disabled={isDisabled}
            required={required}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            aria-invalid={computedState === 'error'}
            aria-disabled={isDisabled}
            aria-describedby={describedBy || undefined}
            className={inputFieldVariants({ sizeVariant })}
            {...restProps}
          />

          {renderedRightIcon && <div className="flex items-center pl-2 shrink-0">{renderedRightIcon}</div>}
        </div>

        {/* Helper Text / Feedback Message */}
        {errorText ? (
          <p id={errorTextId} className={helperTextVariants({ state: 'error' })} role="alert">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errorText}
          </p>
        ) : successText ? (
          <p className={helperTextVariants({ state: 'success' })}>
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            {successText}
          </p>
        ) : helperText ? (
          <p id={helperTextId} className={helperTextVariants({ state: computedState })}>
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
