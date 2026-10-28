import { forwardRef, useContext } from 'react';
import type { AvatarProps } from './Avatar.types';
import {
  avatarBadgeSmClass,
  avatarCircleVariants,
  avatarLogoVariants,
  avatarPillVariants,
  avatarRingClass,
  avatarRootVariants,
  avatarTextVariants,
  avatarUserBodyVariants,
  avatarUserHeadVariants,
} from './Avatar.variants';
import { AvatarGroupContext } from './Avatar.context';
import { getInitials } from './Avatar.utils';
import { Badge } from '../Badge';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';

/**
 * Avatar: representa a una persona o entidad con iniciales, silueta, foto, logo o ícono.
 * No es interactivo, por eso es un `<span>`. Con nombre accesible (`name`, `label` o `alt`)
 * se expone como imagen con ese nombre; sin ninguno es decorativo (aria-hidden).
 * El indicador de estado es el `Badge` del sistema, fuera de la imagen para que su texto se lea.
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      variant = 'initials',
      size: sizeProp = 'lg',
      color = 'purple',
      contrast = 'on-canva',
      disabled = false,
      inactive = false,
      selected = false,
      state: stateProp = 'default',
      name,
      alt,
      src,
      children,
      logo,
      icon = 'folder',
      label,
      badge = false,
      badgeLabel,
      badgeState,
      ringed,
      className,
      ...restProps
    },
    ref
  ) => {
    const group = useContext(AvatarGroupContext);
    const size = group?.size ?? sizeProp;
    const withRing = ringed ?? group != null;
    const accessibleName = label ?? (variant === 'photo' ? alt : name);

    if (variant === 'brand' || variant === 'icon') {
      // `disabled` es el alias antiguo de `inactive`
      const state = inactive || disabled ? 'inactive' : selected ? 'select' : stateProp;
      return (
        <span
          {...restProps}
          ref={ref}
          role={accessibleName ? 'img' : undefined}
          aria-label={accessibleName}
          aria-hidden={accessibleName ? undefined : true}
          className={cn(avatarPillVariants({ variant, size, contrast, state: variant === 'brand' && state !== 'inactive' ? 'default' : state }), withRing && avatarRingClass, className)}
        >
          {variant === 'brand' ? (
            <span className={avatarLogoVariants({ size })} data-figma-part="Icon Right">
              {logo}
            </span>
          ) : (
            <Icon
              name={icon}
              size={size === 'xs' ? 16 : 24}
              variant="fill"
              data-figma-part="Icon-sizes"
            />
          )}
        </span>
      );
    }

    const tone = variant === 'photo' ? 'none' : disabled ? 'disabled' : color;
    // Figma: lg y md no lo dibujan en disabled; sm sí; xs nunca.
    const showBadge = badge && size !== 'xs' && (!disabled || size === 'sm');
    // Foto sin texto alternativo: decorativa. Initials y user sin nombre: también.
    const decorative = variant === 'photo' ? !alt && !label : !accessibleName;
    // Foto con `children`: el círculo es la imagen con nombre y los hijos quedan ocultos.
    // Foto con `src` sigue siendo un <img alt>.
    const asImage = !decorative && (variant !== 'photo' || children != null);

    return (
      <span {...restProps} ref={ref} className={cn(avatarRootVariants({ variant }), className)}>
        <span
          role={asImage ? 'img' : undefined}
          aria-label={asImage ? accessibleName : undefined}
          aria-hidden={decorative ? true : undefined}
          data-figma-part={variant === 'photo' ? 'Photos (Atom)' : 'Avatar'}
          className={cn(
            avatarCircleVariants({ size, tone }),
            variant === 'photo' && disabled && 'grayscale',
            withRing && avatarRingClass
          )}
        >
          {variant === 'initials' && (
            <span className={avatarTextVariants({ size })} data-figma-part="HG">
              {getInitials(name ?? '')}
            </span>
          )}
          {variant === 'user' && (
            <span aria-hidden="true" className="contents" data-figma-part="User">
              <span className={avatarUserHeadVariants({ size, tone: tone === 'none' ? 'purple' : tone })} data-figma-part="Ellipse 1" />
              <span className={avatarUserBodyVariants({ size, tone: tone === 'none' ? 'purple' : tone })} data-figma-part="Ellipse 2" />
            </span>
          )}
          {variant === 'photo' &&
            (children != null ? (
              <span aria-hidden="true" className="contents">
                {children}
              </span>
            ) : (
              <img src={src} alt={alt ?? label ?? ''} className="size-full object-cover" />
            ))}
        </span>
        {showBadge && (
          <Badge
            type="simple"
            state={badgeState}
            label={badgeLabel}
            className={cn('absolute right-0 bottom-0', size === 'sm' && avatarBadgeSmClass)}
            data-figma-part="Badge"
          />
        )}
      </span>
    );
  }
);

Avatar.displayName = 'Avatar';
