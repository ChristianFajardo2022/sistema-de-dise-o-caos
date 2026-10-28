import { Children, forwardRef, useId } from 'react';
import type { TableMobileFieldProps, TableMobileListProps, TableMobileRowProps } from './Table.types';
import {
  tableMobileCellClass,
  tableMobileDividerClass,
  tableMobileFieldClass,
  tableMobileHeaderClass,
  tableMobileLabelClass,
  tableMobileListClass,
  tableMobileRowVariants,
  tableMobileValueClass,
} from './Table.variants';
import { TableDisclosure } from './TableDisclosure';
import { TableItem } from './Table';
import { Checkbox } from '../Checkbox';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/controllableState';

/** Lista de filas para móvil (`<ul>` con nombre). Se pasa a `Table` en `mobile`. */
export const TableMobileList = forwardRef<HTMLUListElement, TableMobileListProps>(
  ({ className, ...restProps }, ref) => (
    <ul ref={ref} className={cn(tableMobileListClass, className)} {...restProps} />
  )
);
TableMobileList.displayName = 'TableMobileList';

/**
 * Campo de una fila móvil: el nombre de la columna y su valor, como término y definición (`<dt>` / `<dd>`).
 * Figma: Header table en modo Mobile (120 de ancho) + Cell table en modo Mobile.
 */
export const TableMobileField = forwardRef<HTMLDivElement, TableMobileFieldProps>(
  ({ label, children, className, ...restProps }, ref) => (
    <div ref={ref} className={cn(tableMobileFieldClass, className)} {...restProps}>
      <dt className={tableMobileLabelClass} data-figma-part="Header table (Atom)">
        <span data-figma-part="Filename">{label}</span>
      </dt>
      <dd className={tableMobileValueClass} data-figma-part="Cell table (Atom)">
        <TableItem className="flex-1">{children}</TableItem>
      </dd>
    </div>
  )
);
TableMobileField.displayName = 'TableMobileField';

/**
 * Fila de tabla para móvil (`Row mobile (Atom)` de Figma, 13544:69614): tarjeta con cabecera (casilla de selección,
 * etiqueta y acciones) y la lista de campos. Con `visibleFields` el resto se abre con la fila desplegable de abajo.
 */
export const TableMobileRow = forwardRef<HTMLLIElement, TableMobileRowProps>(
  (
    {
      selected,
      defaultSelected = false,
      onSelectedChange,
      selectionLabel = 'Seleccionar fila',
      tag,
      actions,
      children,
      visibleFields,
      expanded,
      defaultExpanded = false,
      onExpandedChange,
      expandLabel,
      state,
      className,
      ...restProps
    },
    ref
  ) => {
    const detailsId = useId();
    const selectable = selected !== undefined || onSelectedChange !== undefined || defaultSelected;
    const [isSelected, setSelected] = useControllableState(selected, defaultSelected, onSelectedChange, 'TableMobileRow');
    const [open, setOpen] = useControllableState(expanded, defaultExpanded, onExpandedChange, 'TableMobileRow');
    const looksSelected = state ? state === 'select' : selectable && isSelected;

    const fields = Children.toArray(children);
    const limit = visibleFields ?? fields.length;
    const collapsible = fields.length > limit;
    const shown = collapsible && !open ? fields.slice(0, limit) : fields;

    return (
      <li
        ref={ref}
        data-selected={looksSelected ? '' : undefined}
        className={cn(tableMobileRowVariants(), className)}
        {...restProps}
      >
        <div className={tableMobileHeaderClass} data-figma-part="Header">
          {selectable && (
            <div className={cn(tableMobileCellClass, 'shrink-0')}>
              <TableItem checkbox>
                <Checkbox
                  aria-label={selectionLabel}
                  checked={state ? state === 'select' : isSelected}
                  onChange={(event) => setSelected(event.target.checked)}
                  data-figma-part="Selection"
                />
              </TableItem>
            </div>
          )}
          <div className={cn(tableMobileCellClass, 'flex-1')}>{tag}</div>
          {actions != null && <div className={cn(tableMobileCellClass, 'flex-1 justify-end')}>{actions}</div>}
        </div>
        <dl id={detailsId} className={cn('m-0 flex flex-col', tableMobileDividerClass)} data-figma-part="Row">
          {shown}
        </dl>
        {collapsible && (
          <TableDisclosure
            expanded={open}
            onExpandedChange={setOpen}
            controls={detailsId}
            selected={looksSelected}
            label={expandLabel}
            data-figma-part="Dropdown table (Atom)"
          />
        )}
      </li>
    );
  }
);
TableMobileRow.displayName = 'TableMobileRow';
