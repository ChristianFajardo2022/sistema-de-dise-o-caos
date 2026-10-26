import { forwardRef } from 'react';
import type { ChipPlusProps } from './Chip.types';
import { chipPlusTextVariants, chipPlusVariants } from './Chip.variants';
import { cn } from '../../utils/cn';

/**
 * "+N" de un grupo de chips ("Chips plus" de Figma): botón accesible. Su nombre por defecto es "Ver +N más", que
 * contiene el texto visible "+N" (WCAG 2.5.3). `ref` y el resto de props nativas van al `<button>`, para que un
 * `DropdownMenu` pueda pasar `aria-haspopup`, `aria-expanded` o `aria-controls`; con `aria-expanded` toma el aspecto Select.
 * `ChipGroup` lo envuelve en un `DropdownMenu` con los chips ocultos.
 */
export const ChipPlus = forwardRef<HTMLButtonElement, ChipPlusProps>(function ChipPlus(
  { count, state = 'default', disabled = false, label, className, ...rest },
  ref
) {
  return (
    <button
      type="button"
      aria-label={label ?? `Ver +${count} más`}
      {...rest}
      ref={ref}
      disabled={disabled || state === 'inactive'}
      data-figma-part="Button"
      className={cn(chipPlusVariants({ state: disabled ? 'inactive' : state }), className)}
    >
      <span className={chipPlusTextVariants()} data-figma-part="Frame 1984079912">
        <span data-figma-part="+2">+{count}</span>
      </span>
    </button>
  );
});

ChipPlus.displayName = 'ChipPlus';
