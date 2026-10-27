import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import type { ButtonCornerProps } from './ButtonCorner.types';
import {
  buttonCornerFavoriteColor,
  buttonCornerFavoritePressed,
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
function IconSlot({
  className,
  children,
  ...rest
}: { className?: string; children?: ReactNode; 'data-figma-part'?: string }) {
  return (
    <span
      {...rest}
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
      contrast: contrastProp,
      status,
      state = 'default',
      size = 'md',
      stroke = false,
      icon,
      pressed,
      className,
      ...restProps
    },
    ref
  ) => {
    // `status` es el nombre viejo de Contrast (deprecado); si llegan los dos, manda `contrast`
    const contrast = contrastProp ?? status ?? 'on-canva';
    const unicolor = contrast === 'unicolor-canva';
    const hasPressed = variant === 'checkbox' || variant === 'radiobutton' || variant === 'favorite';

    let content: ReactNode;
    switch (variant) {
      case 'dots':
        // Botón interno de 32 con padding space/button/lg (8) y ícono de 16
        content = (
          <span
            aria-hidden="true"
            data-figma-part="Dots-moreoptions"
            className="inline-flex size-[32px] shrink-0 items-center justify-center rounded-ds-radius-button-full p-ds-space-button-lg"
          >
            <IconSlot>
              <Icon name="3-dots-more" variant="fill" size={16} data-figma-part="Icon-sizes" />
            </IconSlot>
          </span>
        );
        break;
      case 'favorite':
        content = (
          <IconSlot className={buttonCornerFavoriteColor[contrast]} data-figma-part="Favorite (Atom)">
            <FavoriteIcon />
          </IconSlot>
        );
        break;
      case 'checkbox':
        // Selection Default Positive, decorativo
        content = (
          <span
            aria-hidden="true"
            data-figma-part="Selection"
            className={cn(checkboxControlVariants({ contrast: 'positive' }), unicolor && buttonCornerUnicolorRing)}
          />
        );
        break;
      case 'radiobutton':
        content = (
          <span
            aria-hidden="true"
            data-figma-part="Selection"
            className={cn(radioControlVariants({ contrast: 'positive' }), unicolor && buttonCornerUnicolorRing)}
          />
        );
        break;
      default:
        content = (
          <IconSlot data-figma-part="Icon-sizes">
            {icon ?? <Icon name="arrow-diagonal-right" variant="line" size={16} />}
          </IconSlot>
        );
    }

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={hasPressed ? pressed : undefined}
        className={cn(
          buttonCornerVariants({ contrast, state, size, stroke, dots: variant === 'dots' }),
          // Favorito presionado: corazón relleno con icon/general/default (Favorite (Atom) variante 3)
          variant === 'favorite' && buttonCornerFavoritePressed[contrast],
          className
        )}
        {...restProps}
      >
        {content}
      </button>
    );
  }
);

ButtonCorner.displayName = 'ButtonCorner';
