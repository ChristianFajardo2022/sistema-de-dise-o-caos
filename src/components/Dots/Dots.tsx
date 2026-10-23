import { forwardRef } from 'react';
import type { DotsProps } from './Dots.types';
import { dotsIconSize, dotsVariants } from './Dots.variants';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';

/**
 * Botón de ícono "más opciones" (tres puntos). Es un `<button>` nativo con nombre accesible por `label`.
 * Como disparador de menú, se pasa a `DropdownMenu` en `trigger`: reenvía `ref` y las props nativas
 * (`aria-*`, `popoverTarget`, `onKeyDown`) y el estado abierto (`aria-expanded`) lo dibuja como Press.
 */
export const Dots = forwardRef<HTMLButtonElement, DotsProps>(
  ({ size = 'md', label = 'Más opciones', state = 'default', disabled, className, type = 'button', ...restProps }, ref) => {
    const isInactive = disabled || state === 'inactive';
    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        disabled={isInactive}
        className={cn(dotsVariants({ size, state: isInactive ? 'inactive' : state }), className)}
        {...restProps}
      >
        <Icon name="3-dots-more" variant="fill" size={dotsIconSize[size]} data-figma-part="Icon-sizes" />
      </button>
    );
  }
);

Dots.displayName = 'Dots';
