import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import type { ButtonCornerProps } from './ButtonCorner.types';
import {
  buttonCornerFavoriteColor,
  buttonCornerUnicolorRing,
  buttonCornerVariants,
} from './ButtonCorner.variants';
import { checkboxControlVariants } from '../Checkbox/Checkbox.variants';
import { radioControlVariants } from '../Radio/Radio.variants';
import { Icon } from '../Icon';
// "Favorite (Atom)" de Figma es un vector propio (no una instancia de Icon-sizes): no está en la biblioteca
import { FavoriteIcon } from '../../icons/FavoriteIcon';
import { cn } from '../../utils/cn';

/** Slot de ícono de 16×16: el SVG lo llena y hereda el color del slot */
function IconSlot({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <span
      data-slot="icon"
      aria-hidden="true"
      className={cn('inline-flex size-[16px] shrink-0 items-center justify-center [&>svg]:size-full', className)}
    >
      {children}
    </span>
  );
}

export const ButtonCorner = forwardRef<HTMLButtonElement, ButtonCornerProps>(
  (
    {
      variant = 'icon',
      status = 'on-canva',
      size = 'md',
      stroke = false,
      icon,
      pressed,
      className,
      ...restProps
    },
    ref
  ) => {
    const unicolor = status === 'unicolor-canva';
    const hasPressed = variant === 'checkbox' || variant === 'radiobutton' || variant === 'favorite';

    let content: ReactNode;
    switch (variant) {
      case 'dots':
        // Botón interno de 32 con padding space/button/lg (8) y ícono de 16
        content = (
          <span
            aria-hidden="true"
            className="inline-flex size-[32px] shrink-0 items-center justify-center rounded-ds-radius-button-full p-ds-space-button-lg"
          >
            <IconSlot>
              <Icon name="3-dots-more" variant="fill" size={16} />
            </IconSlot>
          </span>
        );
        break;
      case 'favorite':
        content = (
          <IconSlot className={buttonCornerFavoriteColor[status]}>
            <FavoriteIcon />
          </IconSlot>
        );
        break;
      case 'checkbox':
        // Selection Default Positive, decorativo
        content = (
          <span
            aria-hidden="true"
            className={cn(checkboxControlVariants({ contrast: 'positive' }), unicolor && buttonCornerUnicolorRing)}
          />
        );
        break;
      case 'radiobutton':
        content = (
          <span
            aria-hidden="true"
            className={cn(radioControlVariants({ contrast: 'positive' }), unicolor && buttonCornerUnicolorRing)}
          />
        );
        break;
      default:
        content = <IconSlot>{icon ?? <Icon name="arrow-diagonal-right" variant="line" size={16} />}</IconSlot>;
    }

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={hasPressed ? pressed : undefined}
        className={cn(buttonCornerVariants({ status, size, stroke, dots: variant === 'dots' }), className)}
        {...restProps}
      >
        {content}
      </button>
    );
  }
);

ButtonCorner.displayName = 'ButtonCorner';
