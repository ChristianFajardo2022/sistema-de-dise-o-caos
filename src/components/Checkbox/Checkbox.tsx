import { forwardRef, useEffect, useRef } from 'react';
import type { CheckboxProps } from './Checkbox.types';
import { checkboxContainerVariants, checkboxControlVariants } from './Checkbox.variants';
import { CheckIcon } from '../../icons/CheckIcon';
import { DashIcon } from '../../icons/DashIcon';
import { cn } from '../../utils/cn';

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      defaultChecked,
      label,
      description,
      size = 'md',
      error,
      disabled = false,
      align = 'top',
      onCheckedChange,
      className,
      id,
      ...restProps
    },
    forwardedRef
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync indeterminate state to the native input element
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = checked === 'indeterminate';
      }
    }, [checked]);

    const isChecked = checked === true || defaultChecked === true;
    const isIndeterminate = checked === 'indeterminate';
    const hasError = !!error;

    // Determine the visual state for styling
    let state: 'unchecked' | 'checked' | 'indeterminate' | 'disabled' | 'error' = 'unchecked';
    if (disabled) state = 'disabled';
    else if (hasError) state = 'error';
    else if (isIndeterminate) state = 'indeterminate';
    else if (isChecked) state = 'checked';

    const handleContainerClick = (e: React.MouseEvent) => {
      // Allow clicking the container to toggle the checkbox if not clicking the input/label directly
      if (disabled || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('label')) {
        return;
      }
      inputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      onCheckedChange?.(e.target.checked);
    };

    // Use a fallback ID if none is provided, useful for associating label
    const fallbackId = useRef(`checkbox-${Math.random().toString(36).substr(2, 9)}`).current;
    const inputId = id || fallbackId;

    return (
      <div
        className={cn(checkboxContainerVariants({ align, disabled }), className)}
        onClick={handleContainerClick}
      >
        <div className="relative flex items-center justify-center shrink-0">
          <input
            type="checkbox"
            id={inputId}
            ref={(node) => {
              // Handle both local ref and forwarded ref
              inputRef.current = node;
              if (typeof forwardedRef === 'function') {
                forwardedRef(node);
              } else if (forwardedRef) {
                forwardedRef.current = node;
              }
            }}
            checked={checked === 'indeterminate' ? false : checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            aria-invalid={hasError}
            aria-errormessage={typeof error === 'string' ? `${inputId}-error` : undefined}
            aria-describedby={description ? `${inputId}-desc` : undefined}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer peer z-10 m-0 p-0"
            {...restProps}
          />
          <div
            className={checkboxControlVariants({ size, state })}
            aria-hidden="true"
          >
            {isIndeterminate ? (
              <DashIcon
                className={cn(
                  'text-current transition-transform duration-200',
                  size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4',
                  isIndeterminate ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                )}
              />
            ) : (
              <CheckIcon
                className={cn(
                  'text-current transition-transform duration-200',
                  size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4',
                  isChecked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                )}
              />
            )}
          </div>
        </div>

        {(label || description) && (
          <div className="ml-3 flex flex-col justify-center">
            {label && (
              <label
                htmlFor={inputId}
                className={cn(
                  'font-medium text-[var(--text-field-label)] select-none',
                  disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                  size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <span
                id={`${inputId}-desc`}
                className={cn(
                  'text-[var(--text-field-label-secondary)] select-none mt-0.5',
                  size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-sm' : 'text-xs'
                )}
              >
                {description}
              </span>
            )}
            {typeof error === 'string' && (
              <span
                id={`${inputId}-error`}
                className={cn(
                  'text-[var(--text-alert-error,#E53935)] select-none mt-0.5',
                  size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-sm' : 'text-xs'
                )}
              >
                {error}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
