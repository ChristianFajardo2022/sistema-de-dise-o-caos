import { Children, cloneElement, forwardRef, isValidElement, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type { AvatarGroupProps, AvatarProps } from './Avatar.types';
import { avatarGroupVariants } from './Avatar.variants';
import { AvatarGroupContext } from './Avatar.context';
import { AvatarPlus } from './AvatarPlus';
import { DropdownMenu, DropdownMenuItem } from '../DropdownMenu';
import { cn } from '../../utils/cn';

/** Texto del ítem cuando el avatar oculto no trae `name`, `alt` ni `label`. */
const UNNAMED = 'Persona sin nombre';

function hiddenName(item: ReactNode): string {
  if (!isValidElement(item)) return UNNAMED;
  const { name, alt, label } = (item as ReactElement<AvatarProps>).props;
  return name ?? alt ?? label ?? UNNAMED;
}

/**
 * Grupo de avatares solapados (-8) con anillo blanco. Muestra hasta `max` y resume el resto en
 * un "+N" (botón con `aria-label` "Ver +N más"). Impone el tamaño a sus avatares.
 * Es un `role="group"` solo si se le da `aria-label` o `aria-labelledby`.
 * El "+N" abre (clic, Enter o Espacio) una lista con los avatares ocultos a tamaño `xs` y su nombre
 * (`name` ?? `alt` ?? `label`, o "Persona sin nombre"); con `overflowMenu={false}` solo llama a `onOverflowClick`.
 */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({
      children,
      max = 5,
      size = 'sm',
      onOverflowClick,
      overflowLabel,
      overflowMenu = true,
      overflowMenuLabel = 'Personas ocultas',
      className,
      ...restProps
    },
    ref
  ) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const items = Children.toArray(children);
    const visible = items.slice(0, Math.max(0, max));
    const hidden = items.length - visible.length;
    const hiddenItems = items.slice(visible.length);
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
          {hidden > 0 &&
            (overflowMenu ? (
              <DropdownMenu
                mode="list"
                aria-label={overflowMenuLabel}
                onOpenChange={(open) => {
                  setMenuOpen(open);
                  if (open) onOverflowClick?.();
                }}
                trigger={
                  <AvatarPlus
                    count={hidden}
                    size={size}
                    state={menuOpen ? 'hover' : 'default'}
                    className="-ml-4"
                    label={overflowLabel?.(hidden)}
                  />
                }
              >
                {/* Los ítems no heredan el tamaño ni el anillo del grupo */}
                <AvatarGroupContext value={null}>
                  {hiddenItems.map((item, i) => (
                    <DropdownMenuItem
                      key={isValidElement(item) && item.key != null ? item.key : i}
                      type="avatar"
                      avatar={
                        <span aria-hidden="true" className="inline-flex">
                          {isValidElement(item)
                            ? cloneElement(item as ReactElement<AvatarProps>, { size: 'xs', ringed: false })
                            : item}
                        </span>
                      }
                    >
                      {hiddenName(item)}
                    </DropdownMenuItem>
                  ))}
                </AvatarGroupContext>
              </DropdownMenu>
            ) : (
              <AvatarPlus
                count={hidden}
                size={size}
                className="-ml-4"
                label={overflowLabel?.(hidden)}
                onClick={onOverflowClick}
              />
            ))}
        </div>
      </AvatarGroupContext>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';
