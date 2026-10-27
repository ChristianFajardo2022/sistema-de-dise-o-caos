import { forwardRef } from 'react';
import type { AnchorHTMLAttributes, Ref } from 'react';
import type { ButtonMenuProps, ButtonMenuState } from './ButtonMenu.types';
import { buttonMenuIconClass, buttonMenuTextClass, buttonMenuVariants } from './ButtonMenu.variants';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';

/**
 * Botón de la navegación principal ("Button menu (Atom)" de Figma, 12419:5959).
 *
 * - Es un componente propio y no una variante de `Button` ni de `ButtonLink`: usa los tokens `text/button/menu/*` e
 *   `icon/button/menu/*` (gris que se aclara hasta blanco), no tiene fondo ni trazo y su caja es de 32 de alto sin
 *   padding horizontal; ninguna variante de Button o ButtonLink pinta eso.
 * - Sin `href` es un `<button type="button">` que abre un submenú: `iconRight` dibuja el chevron y el botón expone
 *   `aria-expanded` (lo inyectan `DropdownMenu` o el Header). Con `href` es un enlace `<a>`.
 * - Press/select: `selected` (sección actual, con `aria-current`) o `aria-expanded="true"` (submenú abierto).
 * - Inactive: `disabled`. En un enlace se quita el `href`, se expone `aria-disabled` y no entra en el orden de Tab.
 * - `ref` y las props nativas van al elemento raíz (botón o enlace).
 */
export const ButtonMenu = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonMenuProps>(
  ({ children, iconLeft, iconRight = false, selected = false, href, state, disabled = false, className, type, ...rest }, ref) => {
    const expanded = rest['aria-expanded'] === true || rest['aria-expanded'] === 'true';
    const visual: ButtonMenuState = state ?? (disabled ? 'inactive' : selected || expanded ? 'press' : 'default');
    const classes = cn(buttonMenuVariants({ state: visual }), className);
    const content = (
      <>
        {iconLeft && <Icon name={iconLeft} size={16} variant="line" aria-hidden="true" className={buttonMenuIconClass} data-figma-part="Icon-sizes" />}
        <span className={buttonMenuTextClass} data-figma-part="Text-button">
          <span data-figma-part="Button">{children}</span>
        </span>
        {iconRight && <Icon name="chevron-down" size={16} variant="line" aria-hidden="true" className={buttonMenuIconClass} data-figma-part="Icon-sizes" />}
      </>
    );

    if (href !== undefined) {
      const link = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
      return (
        <a
          {...link}
          ref={ref as Ref<HTMLAnchorElement>}
          href={disabled ? undefined : href}
          aria-disabled={disabled || undefined}
          aria-current={selected ? 'page' : link['aria-current']}
          tabIndex={disabled ? -1 : link.tabIndex}
          role={disabled ? 'link' : link.role}
          className={classes}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        {...rest}
        ref={ref as Ref<HTMLButtonElement>}
        type={type ?? 'button'}
        disabled={disabled}
        aria-current={selected ? 'true' : rest['aria-current']}
        className={classes}
      >
        {content}
      </button>
    );
  }
);

ButtonMenu.displayName = 'ButtonMenu';
