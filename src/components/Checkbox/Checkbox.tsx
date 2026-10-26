import { forwardRef, useId, useLayoutEffect, useRef } from 'react';
import type { CheckboxProps } from './Checkbox.types';
import {
  checkboxControlVariants,
  checkboxRowVariants,
  checkboxTextVariants,
} from './Checkbox.variants';
import { CheckmarkIcon } from '../../icons/CheckmarkIcon';
import { useMergedRefs } from '../../utils/refs';
import { cn } from '../../utils/cn';

const noop = () => {};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { contrast = 'positive', state, indeterminate = false, disabled = false, children, className, id, onChange, ...restProps },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const inputRef = useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRefs(inputRef, ref);

    // Con state forzado el aspecto sale de state; si no, del input nativo
    const forced = state !== undefined;
    const isDisabled = disabled || state === 'disabled-default' || state === 'disabled-select' || state === 'disabled-indeterminate';
    const isIndeterminate = forced ? state === 'indeterminate' || state === 'disabled-indeterminate' : indeterminate;
    // El navegador quita `indeterminate` al pulsar: si la prop sigue en true y nadie vuelve a renderizar, se repone aquí
    const handleChange: typeof onChange = (event) => {
      onChange?.(event);
      if (inputRef.current) inputRef.current.indeterminate = isIndeterminate;
    };
    const forcedProps = forced
      ? { checked: state === 'select' || state === 'disabled-select', onChange: onChange ?? noop }
      : { onChange: handleChange };

    // `indeterminate` solo existe como propiedad del DOM (no hay atributo): se fija en cada render, porque el navegador
    // lo quita al pulsar
    useLayoutEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = isIndeterminate;
    });

    return (
      <label htmlFor={inputId} className={cn(checkboxRowVariants({ disabled: isDisabled }), className)}>
        <input
          {...restProps}
          {...forcedProps}
          ref={mergedRef}
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
