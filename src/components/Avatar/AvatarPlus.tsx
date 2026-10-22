import { forwardRef } from 'react';
import type { AvatarPlusProps } from './Avatar.types';
import { avatarPlusButtonVariants, avatarPlusRootVariants, avatarPlusTextVariants } from './Avatar.variants';
import { cn } from '../../utils/cn';

/**
 * "+N" de un grupo de avatares: botón accesible. Su nombre por defecto es "Ver +N más", que
 * contiene el texto visible "+N" (WCAG 2.5.3). `ref` y el resto de props nativas van al `<button>`,
 * para que un Dropdown pueda pasar `aria-haspopup`, `aria-expanded`, `aria-controls` o `disabled`.
 * El menú con la lista de los restantes que Figma abre en Hover (Dropdown) todavía no existe.
 */
export const AvatarPlus = forwardRef<HTMLButtonElement, AvatarPlusProps>(
  ({ count, size = 'sm', state = 'default', label, className, ...restProps }, ref) => (
    <span className={cn(avatarPlusRootVariants({ state }), className)}>
      <button
        type="button"
        aria-label={label ?? `Ver +${count} más`}
        {...restProps}
        ref={ref}
        data-figma-part="Button"
        className={avatarPlusButtonVariants({ size, state })}
      >
        <span className={avatarPlusTextVariants({ size })} data-figma-part="Frame 1984079334">
          <span data-figma-part="+2">+{count}</span>
        </span>
      </button>
    </span>
  )
);

AvatarPlus.displayName = 'AvatarPlus';
