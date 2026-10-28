import { forwardRef, useId } from 'react';
import type { MouseEvent } from 'react';
import type { SideBarItemProps, SideBarSubItemProps } from './SideBar.types';
import {
  sideBarItemCornerBadgeClass,
  sideBarItemIconClass,
  sideBarItemLabelClass,
  sideBarItemOpenClass,
  sideBarItemRowVariants,
  sideBarItemSelectBarClass,
  sideBarItemVariants,
  sideBarSubItemClass,
  sideBarSubmenuClass,
} from './SideBar.variants';
import { Badge } from '../Badge';
import { DropdownMenuItem, DropdownMenuNavList } from '../DropdownMenu';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import { Divider } from '../_internal/Divider';
import { cn } from '../../utils/cn';

/**
 * Ítem de la barra lateral (set "Hamburguer menu (Atom)" de Figma, 13328:3609). Es un `<li>`: va dentro de la lista de
 * `SideBar` (o de un `<ul>` propio).
 *
 * - Sin submenú: la fila es un `<a href>` (navegación real, con Cmd/Ctrl/clic medio) o un `<button>`; la sección actual
 *   lleva `aria-current="page"` (`selected`).
 * - Con submenú (Type `dropdown`): la fila es un botón disclosure (`aria-expanded`, `aria-controls`) y la lista de
 *   `SideBarSubItem` (una `DropdownMenuNavList`) va justo debajo, en el orden de Tab.
 * - `single-icon`: solo el ícono; el texto pasa a ser el nombre accesible y un `Tooltip` a la derecha (con puntero o
 *   foco). El badge se dibuja en la esquina del ícono y su cantidad entra en el nombre.
 */
export const SideBarItem = forwardRef<HTMLLIElement, SideBarItemProps>(
  (
    {
      type: typeProp,
      state,
      children,
      icon,
      badge,
      badgeLabel = 'nuevos',
      selected = false,
      href,
      onSelect,
      expanded = false,
      onExpandedChange,
      submenu,
      controlProps,
      className,
      ...rest
    },
    ref
  ) => {
    const uid = useId();
    const hasSubmenu = submenu != null && submenu !== false;
    const type = typeProp ?? (hasSubmenu ? 'dropdown' : 'with-text');
    const single = type === 'single-icon';
    const visualState = state ?? (selected ? 'select' : 'default');
    const hasBadge = badge !== undefined && badge !== null && badge !== '';
    const showBar = visualState === 'select' && type !== 'with-text';
    // La lista solo existe fuera de Single icon (la barra contraída no la dibuja)
    const renderSubmenu = hasSubmenu && !single;
    const submenuId = `${uid}-submenu`;

    const handleClick = (event: MouseEvent<HTMLElement>) => {
      (controlProps?.onClick as ((e: MouseEvent<HTMLElement>) => void) | undefined)?.(event);
      if (event.defaultPrevented) return;
      if (hasSubmenu) onExpandedChange?.(!expanded);
      onSelect?.();
    };

    const content = (
      <>
        {showBar && <span aria-hidden="true" className={sideBarItemSelectBarClass} data-figma-part="Select" />}
        {icon && <Icon name={icon} size={20} variant="line" aria-hidden="true" className={sideBarItemIconClass} data-figma-part="Icon-sizes" />}
        {!single && (
          <span className={sideBarItemLabelClass} data-figma-part="Nombre de la opción">
            <span data-figma-part="Texto default">{children}</span>
          </span>
        )}
        {hasBadge && (
          <Badge
            type="number"
            label={single ? undefined : badgeLabel}
            aria-hidden={single ? true : undefined}
            className={cn('shrink-0', single && sideBarItemCornerBadgeClass)}
            data-figma-part="Badge"
          >
            {badge}
          </Badge>
        )}
        {hasSubmenu && !single && (
          <Icon name="chevron-down" size={20} variant="line" aria-hidden="true" className={sideBarItemIconClass} data-figma-part="Icon-sizes" />
        )}
      </>
    );

    const rowClass = cn(sideBarItemRowVariants({ type, state: visualState }), controlProps?.className);
    const current = selected ? ('page' as const) : undefined;
    const control =
      href && !hasSubmenu ? (
        <a {...controlProps} href={href} aria-current={current} onClick={handleClick} className={rowClass} data-figma-part="Drop">
          {content}
        </a>
      ) : (
        <button
          {...controlProps}
          type="button"
          aria-current={hasSubmenu ? undefined : current}
          aria-expanded={hasSubmenu ? expanded && !single : undefined}
          aria-controls={renderSubmenu ? submenuId : undefined}
          onClick={handleClick}
          className={rowClass}
          data-figma-part="Drop"
        >
          {content}
        </button>
      );

    return (
      <li {...rest} ref={ref} className={cn(sideBarItemVariants({ type }), renderSubmenu && expanded && sideBarItemOpenClass, className)} data-item-type={type}>
        {/* Siempre envuelto (desactivado fuera de Single icon) para que la fila no se vuelva a montar y conserve el foco
            al contraer o expandir la barra */}
        <Tooltip
          arrow="left"
          describes="label"
          disabled={!single}
          content={
            <>
              {children}
              {hasBadge && `, ${badge} ${badgeLabel}`}
            </>
          }
        >
          {control}
        </Tooltip>
        {renderSubmenu && (
          <DropdownMenuNavList id={submenuId} hidden={!expanded} className={sideBarSubmenuClass} data-figma-part="List items">
            {submenu}
          </DropdownMenuNavList>
        )}
      </li>
    );
  }
);

SideBarItem.displayName = 'SideBarItem';

/**
 * Subenlace del submenú (fila "Dropdown list" de Figma con su divisor). Es un `DropdownMenuItem` dentro de la
 * `DropdownMenuNavList` del ítem: un `<a>` (o `<button>` sin `href`) de navegación, no un `menuitem`, porque la barra
 * es una navegación con disclosure, no un menú. El divisor es el compartido (`_internal/Divider`, 0.5 sin alto).
 */
export const SideBarSubItem = forwardRef<HTMLLIElement, SideBarSubItemProps>(
  ({ children, href, selected = false, onSelect, className, ...rest }, ref) => (
    <li {...rest} ref={ref} className={cn(sideBarSubItemClass, className)}>
      <DropdownMenuItem href={href} selected={selected} onSelect={onSelect} data-figma-part="Dropdown list">
        {children}
      </DropdownMenuItem>
      <Divider data-figma-part="Vector" />
    </li>
  )
);

SideBarSubItem.displayName = 'SideBarSubItem';
