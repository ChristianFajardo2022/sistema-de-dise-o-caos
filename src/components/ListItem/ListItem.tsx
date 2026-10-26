import { forwardRef, useId } from 'react';
import type { Ref } from 'react';
import type { ListItemProps } from './ListItem.types';
import {
  listItemActionsClass,
  listItemCategoryVariants,
  listItemChevronClass,
  listItemControlClass,
  listItemDescriptionVariants,
  listItemDividerClass,
  listItemHeadClass,
  listItemNavigableClass,
  listItemRowVariants,
  listItemTextBlockClass,
  listItemTitleVariants,
  listItemVariants,
} from './ListItem.variants';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Dots } from '../Dots';
import { DropdownMenu } from '../DropdownMenu';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';

/**
 * Fila de una lista (set "List (Atom)" de Figma). Es un `<li>`: va dentro de un `<ul>` u `<ol>`.
 * Lo opcional de Figma se resuelve así: `leading` es un slot (avatar, grupo de avatares, ícono),
 * y los controles de la derecha aparecen solo si se pasa su callback o su contenido
 * (`onEdit`, `onDelete`, `menu`), en vez de un booleano por cada pieza. Con `onNavigate` o `href` la fila es una
 * acción de navegación: el título es el control (botón o enlace) estirado sobre la fila y lleva `chevron-right`.
 */
export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  (
    {
      variant = 'complex',
      title,
      description,
      category,
      leading,
      selectable = false,
      selected,
      defaultSelected,
      onSelectedChange,
      onEdit,
      onDelete,
      editLabel,
      deleteLabel,
      menu,
      menuLabel,
      onNavigate,
      href,
      controlRef,
      disabled = false,
      className,
      ...restProps
    },
    ref
  ) => {
    const titleId = useId();
    const isComplex = variant === 'complex';
    const navigable = onNavigate !== undefined || href !== undefined;
    const hasActions = Boolean(onEdit || onDelete || menu || navigable);
    const hasDescription = description != null && description !== false;
    const hasCategory = isComplex && category != null && category !== false;
    const nameForMenu = menuLabel ?? `Más opciones de ${title}`;

    const titleClass = listItemTitleVariants({ variant, disabled });
    const titleNode = !navigable ? (
      <span id={titleId} title={title} data-figma-part="Filename" className={titleClass}>
        {title}
      </span>
    ) : href !== undefined ? (
      <a
        ref={controlRef as Ref<HTMLAnchorElement>}
        id={titleId}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        onClick={disabled ? undefined : onNavigate}
        data-list-control=""
        data-figma-part="Filename"
        className={cn(titleClass, listItemControlClass)}
      >
        {title}
      </a>
    ) : (
      <button
        ref={controlRef as Ref<HTMLButtonElement>}
        id={titleId}
        type="button"
        disabled={disabled}
        onClick={onNavigate}
        data-list-control=""
        data-figma-part="Filename"
        className={cn(titleClass, listItemControlClass)}
      >
        {title}
      </button>
    );
    const descriptionNode = hasDescription ? (
      <span data-figma-part="Status" className={listItemDescriptionVariants({ variant, disabled })}>
        {description}
      </span>
    ) : null;

    return (
      <li
        {...restProps}
        ref={ref}
        className={cn(listItemVariants({ disabled }), navigable && listItemNavigableClass, className)}
      >
        <div data-figma-part="Desktop" className={listItemRowVariants({ variant })}>
          {selectable && (
            <Checkbox
              data-figma-part="Selection"
              aria-labelledby={titleId}
              disabled={disabled}
              checked={selected}
              defaultChecked={defaultSelected}
              onChange={(event) => onSelectedChange?.(event.target.checked)}
            />
          )}
          {isComplex ? (
            <>
              {leading != null && leading !== false && (
                <span data-figma-part="Avatar" className="inline-flex shrink-0">
                  {leading}
                </span>
              )}
              <div data-figma-part="Container" className={listItemTextBlockClass}>
                <div data-figma-part="Filename and Category" className={listItemHeadClass}>
                  {titleNode}
                  {hasCategory && (
                    <span data-figma-part="Item Category" className="flex min-w-0 items-center gap-ds-space-general-lg">
                      <span aria-hidden="true" data-figma-part="Line 1" className={listItemDividerClass} />
                      <span
                        data-figma-part="Status"
                        title={typeof category === 'string' ? category : undefined}
                        className={listItemCategoryVariants({ disabled })}
                      >
                        {category}
                      </span>
                    </span>
                  )}
                </div>
                {descriptionNode}
              </div>
            </>
          ) : (
            <>
              {titleNode}
              {descriptionNode}
            </>
          )}
          {hasActions && (
            <div data-figma-part="Actions Block" className={cn(listItemActionsClass, navigable && 'relative')}>
              {onEdit && (
                <Button
                  data-figma-part="Button"
                  variant="tertiary"
                  size="xs"
                  iconOnly
                  disabled={disabled}
                  aria-label={editLabel ?? `Editar ${title}`}
                  onClick={onEdit}
                >
                  <Icon name="edit" variant="fill" size={20} data-figma-part="Icon-sizes" />
                </Button>
              )}
              {onDelete && (
                <Button
                  data-figma-part="Button"
                  variant="tertiary"
                  size="xs"
                  state="delete"
                  iconOnly
                  disabled={disabled}
                  aria-label={deleteLabel ?? `Eliminar ${title}`}
                  onClick={onDelete}
                >
                  <Icon name="trash" variant="fill" size={20} data-figma-part="Icon-sizes" />
                </Button>
              )}
              {menu != null && menu !== false && (
                <DropdownMenu
                  aria-label={nameForMenu}
                  align="end"
                  trigger={<Dots size="xs" label={nameForMenu} disabled={disabled} data-figma-part="Dots-moreoptions" />}
                >
                  {menu}
                </DropdownMenu>
              )}
              {navigable && (
                <span aria-hidden="true" data-figma-part="Button" className={listItemChevronClass}>
                  <Icon name="chevron-right" size={20} variant="fill" data-figma-part="Icon-sizes" />
                </span>
              )}
            </div>
          )}
        </div>
      </li>
    );
  }
);

ListItem.displayName = 'ListItem';
