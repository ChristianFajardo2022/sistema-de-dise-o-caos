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
      width,
      placeholder,
      className,
      style,
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

    // Ancho: `width` explícito manda; si no, una casilla de un carácter mide lo de Figma (clase del tamaño) y una de
    // varios crece con los caracteres que admite (o con el placeholder, si es más largo): 24 de padding + n dígitos
    const chars = Math.max(maxLength, placeholder?.length ?? 0);
    const minWidth = size === '32' ? '2.5rem' : '37px';
    const resolvedWidth =
      width !== undefined
        ? typeof width === 'number'
          ? `${width}px`
          : width
        : chars > 1
          ? `max(${minWidth}, calc(1.5rem + ${chars}ch + 0.25rem))`
          : undefined;

    return (
      <input
        {...restProps}
        placeholder={placeholder}
        style={resolvedWidth ? { width: resolvedWidth, ...style } : style}
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
