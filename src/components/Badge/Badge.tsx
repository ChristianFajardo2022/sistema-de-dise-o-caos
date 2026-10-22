import { forwardRef } from 'react';
import type { BadgeProps } from './Badge.types';
import { badgeDotVariants, badgeIconVariants, badgeTextVariants, badgeVariants } from './Badge.variants';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';

/**
 * Badge: indicador de estado o contador. No es interactivo, por eso es un `<span>`.
 * Sin `label` y sin texto es decorativo (aria-hidden); con `label` ese texto se
 * añade como sr-only para lectores de pantalla.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ type = 'simple', state = 'default', children, icon = 'star', label, className, ...restProps }, ref) => {
    const hasIcon = type === 'icon' || type === 'icon-number';
    const hasText = (type === 'number' || type === 'icon-number') && children != null && children !== false && children !== '';
    // Sin contenido que un lector pueda decir, el badge es solo decoración
    const decorative = !label && !hasText && restProps['aria-label'] === undefined;

    return (
      <span
        aria-hidden={decorative ? true : undefined}
        {...restProps}
        ref={ref}
        className={cn(badgeVariants({ type, state: type === 'simple' ? null : state }), className)}
      >
        {type === 'simple' && <span className={badgeDotVariants({ state })} data-figma-part="Badge" />}
        {hasIcon && (
          <Icon
            name={icon}
            size={12}
            variant="fill"
            className={badgeIconVariants({ state })}
            data-figma-part="Icon-sizes"
          />
        )}
        {hasText && (
          <span className={badgeTextVariants()} data-figma-part="Container">
            {children}
          </span>
        )}
        {label && <span className="sr-only">{hasText ? ` ${label}` : label}</span>}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
