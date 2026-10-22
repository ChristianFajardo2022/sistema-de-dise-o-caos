import { Children, forwardRef, isValidElement } from 'react';
import type { AvatarGroupProps } from './Avatar.types';
import { avatarGroupVariants } from './Avatar.variants';
import { AvatarGroupContext } from './Avatar.context';
import { AvatarPlus } from './AvatarPlus';
import { cn } from '../../utils/cn';

/**
 * Grupo de avatares solapados (-8) con anillo blanco. Muestra hasta `max` y resume el resto en
 * un "+N" (botón con `aria-label` "Ver +N más"). Impone el tamaño a sus avatares.
 * Es un `role="group"` solo si se le da `aria-label` o `aria-labelledby`.
 */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ children, max = 5, size = 'sm', onOverflowClick, overflowLabel, className, ...restProps }, ref) => {
    const items = Children.toArray(children);
    const visible = items.slice(0, Math.max(0, max));
    const hidden = items.length - visible.length;
    const named = restProps['aria-label'] !== undefined || restProps['aria-labelledby'] !== undefined;

    return (
      <AvatarGroupContext value={{ size }}>
        <div
          role={named ? 'group' : undefined}
          {...restProps}
          ref={ref}
          className={cn(avatarGroupVariants(), className)}
        >
          <span className="inline-flex" data-figma-part="Avatar color">
            {visible.map((item, i) => (
              <span key={isValidElement(item) ? item.key : String(item)} className={cn('inline-flex', i > 0 && '-ml-2')}>
                {item}
              </span>
            ))}
          </span>
          {hidden > 0 && (
            <AvatarPlus
              count={hidden}
              size={size}
              className="-ml-4"
              label={overflowLabel?.(hidden)}
              onClick={onOverflowClick}
            />
          )}
        </div>
      </AvatarGroupContext>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';
