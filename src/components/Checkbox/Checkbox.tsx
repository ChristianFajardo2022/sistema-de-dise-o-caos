import { forwardRef, useId } from 'react';
import type { CheckboxProps } from './Checkbox.types';
import {
  checkboxControlVariants,
  checkboxRowVariants,
  checkboxTextVariants,
} from './Checkbox.variants';
import { CheckmarkIcon } from '../../icons/CheckmarkIcon';
import { cn } from '../../utils/cn';

const noop = () => {};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { contrast = 'positive', state, disabled = false, children, className, id, onChange, ...restProps },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    // Con state forzado el aspecto sale de state; si no, del input nativo
    const forced = state !== undefined;
    const isDisabled = disabled || state === 'disabled-default' || state === 'disabled-select';
    const forcedProps = forced
      ? { checked: state === 'select' || state === 'disabled-select', onChange: onChange ?? noop }
      : { onChange };

    return (
      <label htmlFor={inputId} className={cn(checkboxRowVariants({ disabled: isDisabled }), className)}>
        <input
          {...restProps}
          {...forcedProps}
          ref={ref}
          id={inputId}
          type="checkbox"
          disabled={isDisabled}
          className="peer sr-only"
        />
        <span aria-hidden="true" className={checkboxControlVariants({ contrast })}>
          <CheckmarkIcon width={undefined} height={undefined} />
        </span>
        {children != null && children !== false && (
          <span className={checkboxTextVariants({ contrast })}>{children}</span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
