import { forwardRef, useId, useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import type { SwitchProps, SwitchTrackProps } from './Switch.types';
import {
  switchLabelVariants,
  switchRowVariants,
  switchThumbVariants,
  switchTrackTextVariants,
  switchTrackVariants,
} from './Switch.variants';
import { cn } from '../../utils/cn';

/**
 * Pista y ficha del interruptor (átomo "Toggle (Atom)"). Solo dibuja: el estado lo recibe por props
 * y se expone con `data-checked` y `data-disabled`. `Switch` la usa dentro de su fila.
 */
export const SwitchTrack = forwardRef<HTMLSpanElement, SwitchTrackProps>(
  ({ type = 'simple', checked = false, disabled = false, label, labelId, decorative = true, className, ...restProps }, ref) => (
    <span
      {...restProps}
      ref={ref}
      aria-hidden={decorative ? true : undefined}
      data-checked={checked ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-figma-part="Toggle (Atom)"
      className={cn(switchTrackVariants({ type }), className)}
    >
      <span data-figma-part="Rectangle 3" className={switchThumbVariants({ type })} />
      {type === 'complex' && label != null && label !== false && (
        <span data-figma-part="Text container" className={switchTrackTextVariants()}>
          <span id={labelId} data-figma-part="Text">
            {label}
          </span>
        </span>
      )}
    </span>
  )
);

SwitchTrack.displayName = 'SwitchTrack';

/**
 * Interruptible con patrón APG Switch: `input type="checkbox" role="switch"` oculto pero accesible
 * (Espacio nativo; Enter también alterna) y una pista dibujada al lado.
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      type = 'simple',
      checked: checkedProp,
      defaultChecked = false,
      onCheckedChange,
      trackLabel,
      disabled = false,
      children,
      className,
      id,
      onChange,
      onKeyDown,
      rootProps,
      ...restProps
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [inner, setInner] = useState(defaultChecked);
    const controlled = checkedProp !== undefined;
    const checked = controlled ? checkedProp : inner;
    const hasText = children != null && children !== false;
    // Sin descripción, el texto de la pista nombra al interruptor por aria-labelledby (que sí lee contenido
    // oculto): la pista queda aria-hidden y el texto no se lee dos veces
    const trackTextId = `${inputId}-track`;
    const namedByTrack =
      !hasText && trackLabel != null && trackLabel !== false && !restProps['aria-label'] && !restProps['aria-labelledby'];

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (!controlled) setInner(event.target.checked);
      onChange?.(event);
      onCheckedChange?.(event.target.checked);
    };
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || event.key !== 'Enter') return;
      // El switch no envía el formulario con Enter: lo alterna
      event.preventDefault();
      event.currentTarget.click();
    };

    return (
      <label
        {...rootProps}
        htmlFor={inputId}
        className={cn(switchRowVariants({ disabled }), rootProps?.className, className)}
      >
        <input
          {...restProps}
          ref={ref}
          id={inputId}
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          aria-checked={checked}
          aria-labelledby={namedByTrack ? trackTextId : restProps['aria-labelledby']}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="peer sr-only"
        />
        <SwitchTrack
          type={type}
          checked={checked}
          disabled={disabled}
          label={trackLabel}
          labelId={namedByTrack ? trackTextId : undefined}
        />
        {hasText && (
          <span
            data-figma-part="Text description"
            data-checked={checked ? '' : undefined}
            data-disabled={disabled ? '' : undefined}
            className={switchLabelVariants()}
          >
            {children}
          </span>
        )}
      </label>
    );
  }
);

Switch.displayName = 'Switch';
