import { forwardRef, useState } from 'react';
import type { MouseEvent } from 'react';
import type { ThemeSwitchProps, ThemeSwitchValue } from './ThemeSwitch.types';
import { themeSwitchCellVariants, themeSwitchVariants } from './ThemeSwitch.variants';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';

/**
 * Interruptor de modo claro u oscuro (set "Switch dark/light" de Figma). Patrón APG Switch sobre un `button`
 * con `role="switch"`: encendido (`aria-checked`) es el modo oscuro. Espacio y Enter alternan (nativo).
 */
export const ThemeSwitch = forwardRef<HTMLButtonElement, ThemeSwitchProps>(
  (
    {
      value: valueProp,
      defaultValue = 'light',
      onValueChange,
      contrast = 'on-canva',
      'aria-label': ariaLabel = 'Modo oscuro',
      className,
      onClick,
      ...restProps
    },
    ref
  ) => {
    const [inner, setInner] = useState<ThemeSwitchValue>(defaultValue);
    const controlled = valueProp !== undefined;
    const value = controlled ? valueProp : inner;
    const dark = value === 'dark';

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      const next: ThemeSwitchValue = dark ? 'light' : 'dark';
      if (!controlled) setInner(next);
      onValueChange?.(next);
    };

    return (
      <button
        {...restProps}
        ref={ref}
        type="button"
        role="switch"
        aria-checked={dark}
        aria-label={ariaLabel}
        onClick={handleClick}
        className={cn(themeSwitchVariants({ contrast }), className)}
      >
        <span data-figma-part="Sun" data-active={!dark ? '' : undefined} className={themeSwitchCellVariants()}>
          <Icon name="sun" size={24} variant="line" aria-hidden="true" />
        </span>
        <span data-figma-part="Moon" data-active={dark ? '' : undefined} className={themeSwitchCellVariants()}>
          <Icon name="moon" size={24} variant="fill" aria-hidden="true" />
        </span>
      </button>
    );
  }
);

ThemeSwitch.displayName = 'ThemeSwitch';
