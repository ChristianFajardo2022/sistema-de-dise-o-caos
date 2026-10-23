import { forwardRef } from 'react';
import type { ChangeEvent } from 'react';
import type { DigitInputProps } from './DigitInput.types';
import { digitInputVariants } from './DigitInput.variants';
import { cn } from '../../utils/cn';

export const DigitInput = forwardRef<HTMLInputElement, DigitInputProps>(
  (
    {
      size = '56',
      state,
      invalid = false,
      confirmed = false,
      oneTimeCode = false,
      disabled = false,
      readOnly = false,
      inputMode = 'numeric',
      pattern = '[0-9]',
      maxLength = 1,
      className,
      onChange,
      ...restProps
    },
    ref
  ) => {
    const isDisabled = disabled || state === 'disabled';
    const isReadOnly = readOnly || state === 'burnt-in';
    const isInvalid = invalid || state === 'error';
    const isConfirmed = !isInvalid && (confirmed || state === 'confirmation');

    // Prioridad visual: disabled > error > confirmation > burnt-in (readOnly) > active forzado
    const visual = isDisabled
      ? 'disabled'
      : isInvalid
        ? 'error'
        : isConfirmed
          ? 'confirmation'
          : isReadOnly
            ? 'burnt-in'
            : state === 'active'
              ? 'active'
              : 'default';

    // Con teclado numérico solo se aceptan dígitos: lo que no lo es se descarta antes de avisar al consumidor
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (inputMode === 'numeric') {
        const digits = e.target.value.replace(/\D/g, '');
        if (digits !== e.target.value) e.target.value = digits;
      }
      onChange?.(e);
    };

    return (
      <input
        {...restProps}
        ref={ref}
        type="text"
        inputMode={inputMode}
        pattern={pattern}
        maxLength={maxLength}
        autoComplete={oneTimeCode ? 'one-time-code' : 'off'}
        disabled={isDisabled}
        readOnly={isReadOnly}
        aria-invalid={isInvalid || undefined}
        onChange={handleChange}
        className={cn(digitInputVariants({ size, visual }), className)}
      />
    );
  }
);

DigitInput.displayName = 'DigitInput';
