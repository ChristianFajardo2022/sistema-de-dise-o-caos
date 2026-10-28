import { forwardRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { useDropdownMenu } from './DropdownMenu.context';
import type { DropdownMenuItemProps, DropdownMenuItemState } from './DropdownMenu.types';
import {
  dropdownMenuItemControlVariants,
  dropdownMenuItemIconVariants,
  dropdownMenuItemTextVariants,
  dropdownMenuItemVariants,
} from './DropdownMenu.variants';
import { CheckmarkIcon } from '../../icons/CheckmarkIcon';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';

/**
 * Ítem del menú ("Dropdown list" de Figma).
 * - Modo `menu` (por defecto): `<button role="menuitem | menuitemcheckbox | menuitemradio">`, activable. Con `href`
 *   (solo `simple`, `icon`, `avatar`) es un `<a href role="menuitem">`: enlace real, Enter o Espacio lo siguen y cierra.
 * - Modo `list` (dentro de un panel `mode="list"`): `<li>` informativo, sin acción ni foco.
 * - Dentro de `DropdownMenuNavList`: enlace de navegación `<a href>` sin rol de menú (o `<button>` sin `href`), en el
 *   orden de Tab; `selected` = `aria-current="page"`. El `<li>` lo pone quien compone.
 */
export const DropdownMenuItem = forwardRef<HTMLElement, DropdownMenuItemProps>(
  (
    {
      type = 'simple',
      icon = 'add-circle',
      avatar,
      checked,
      defaultChecked = false,
      onCheckedChange,
      selected = false,
      state,
      disabled = false,
      onSelect,
      closeOnSelect,
      href,
      target,
      rel,
      children,
      className,
      onClick,
      ...restProps
    },
    ref
  ) => {
    const { mode, close } = useDropdownMenu();
    const isList = mode === 'list';
    const isNav = mode === 'navigation';
    const isToggle = type === 'checkbox' || type === 'radio';
    const [innerChecked, setInnerChecked] = useState(defaultChecked);
    const isChecked = isToggle && (state ? state === 'select' : (checked ?? innerChecked));
    const isDisabled = disabled || state === 'disabled';
    const visualState: DropdownMenuItemState = state ?? (isDisabled ? 'disabled' : selected || isChecked ? 'select' : 'default');
    const interactive = !isList && !isDisabled;

    const handleClick = (event: MouseEvent<HTMLElement>) => {
      onClick?.(event);
      if (!interactive || event.defaultPrevented) return;
      if (isToggle) {
        const next = type === 'radio' ? true : !isChecked;
        if (checked === undefined) setInnerChecked(next);
        onCheckedChange?.(next);
      }
      onSelect?.();
      if (!isNav && (closeOnSelect ?? type !== 'checkbox')) close();
    };

    const content = (
      <>
        {type === 'icon' && (
          <Icon
            name={icon}
            size={16}
            variant="fill"
            aria-hidden="true"
            data-figma-part="Icon-sizes"
            className={dropdownMenuItemIconVariants({ disabled: isDisabled })}
          />
        )}
        {isToggle && (
          <span
            aria-hidden="true"
            data-figma-part="Selection"
            className={dropdownMenuItemControlVariants({ kind: type, checked: isChecked, disabled: isDisabled })}
          >
            {type === 'checkbox' && <CheckmarkIcon width={undefined} height={undefined} />}
          </span>
        )}
        {type === 'avatar' && avatar != null && (
          <span data-figma-part="Avatar" className="inline-flex shrink-0">
            {avatar}
          </span>
        )}
        <span data-figma-part="Text item" className={dropdownMenuItemTextVariants()}>
          {children}
        </span>
        {type === 'dropdown' && (
          <Icon
            name="chevron-down"
            size={16}
            variant="fill"
            aria-hidden="true"
            data-figma-part="Icon-sizes"
            className={dropdownMenuItemIconVariants({ disabled: isDisabled })}
          />
        )}
      </>
    );

    const classes = cn(dropdownMenuItemVariants({ state: visualState, interactive: !isList }), className);

    if (isList) {
      return (
        <li
          {...restProps}
          ref={ref as React.Ref<HTMLLIElement>}
          data-item-type={type}
          aria-current={selected || undefined}
          className={classes}
        >
          {content}
        </li>
      );
    }

    const isLink = href !== undefined && !isToggle;
    if (isNav) {
      const current = selected ? ('page' as const) : undefined;
      if (isLink) {
        return (
          <a
            {...(restProps as object)}
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={isDisabled ? undefined : href}
            target={target}
            rel={rel}
            data-item-type={type}
            aria-current={current}
            aria-disabled={isDisabled || undefined}
            onClick={handleClick}
            className={classes}
          >
            {content}
          </a>
        );
      }
      return (
        <button
          {...(restProps as object)}
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          data-item-type={type}
          aria-current={current}
          disabled={isDisabled || undefined}
          onClick={handleClick}
          className={classes}
        >
          {content}
        </button>
      );
    }

    if (isLink) {
      // Un enlace no se activa con Espacio por sí solo; en un menú sí (como los demás ítems)
      const handleLinkKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
        (restProps.onKeyDown as ((e: KeyboardEvent<HTMLAnchorElement>) => void) | undefined)?.(event);
        if (event.defaultPrevented || event.key !== ' ') return;
        event.preventDefault();
        event.currentTarget.click();
      };
      return (
        <a
          {...(restProps as object)}
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={isDisabled ? undefined : href}
          target={target}
          rel={rel}
          role="menuitem"
          data-item-type={type}
          tabIndex={-1}
          aria-current={selected ? 'true' : undefined}
          aria-disabled={isDisabled || undefined}
          onClick={handleClick}
          onKeyDown={handleLinkKeyDown}
          className={classes}
        >
          {content}
        </a>
      );
    }

    const role = type === 'checkbox' ? 'menuitemcheckbox' : type === 'radio' ? 'menuitemradio' : 'menuitem';
    return (
      <button
        {...(restProps as object)}
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        role={role}
        data-item-type={type}
        tabIndex={-1}
        aria-checked={isToggle ? isChecked : undefined}
        aria-current={!isToggle && selected ? 'true' : undefined}
        aria-disabled={isDisabled || undefined}
        onClick={handleClick}
        className={classes}
      >
        {content}
      </button>
    );
  }
);

DropdownMenuItem.displayName = 'DropdownMenuItem';
