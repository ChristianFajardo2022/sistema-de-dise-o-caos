import { forwardRef, useId } from 'react';
import type { RadioProps } from './Radio.types';
import { radioControlVariants, radioRowVariants, radioTextVariants } from './Radio.variants';
import { cn } from '../../utils/cn';

const noop = () => {};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
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
      <label htmlFor={inputId} className={cn(radioRowVariants({ disabled: isDisabled }), className)}>
        <input
          {...restProps}
          {...forcedProps}
          ref={ref}
          id={inputId}
          type="radio"
          disabled={isDisabled}
          className="peer sr-only"
        />
        <span aria-hidden="true" className={radioControlVariants({ contrast })} />
        {children != null && children !== false && (
          <span className={radioTextVariants({ contrast })}>{children}</span>
        )}
      </label>
    );
  }
);

Radio.displayName = 'Radio';
