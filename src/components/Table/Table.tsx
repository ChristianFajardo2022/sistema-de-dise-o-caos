import { forwardRef } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import type {
  TableCellProps,
  TableEmptyProps,
  TableHeadProps,
  TableItemProps,
  TableProps,
  TableRowProps,
  TableSortDirection,
} from './Table.types';
import {
  tableCellFrameVariants,
  tableCellShellVariants,
  tableEmptyCellClass,
  tableHeadContentClass,
  tableHeadFrameVariants,
  tableItemVariants,
  tableRowVariants,
  tableSortButtonClass,
  tableSortIconClass,
} from './Table.variants';
import { Icon } from '../Icon';
import { ScrollArea } from '../ScrollArea';
import { cn } from '../../utils/cn';
import { useIsMobile } from '../../utils/useMediaQuery';

/** Distancia de la columna fija como variable CSS (la lee la clase `left-(--tbl-sticky-offset)`). */
function stickyStyle(offset: string | number | undefined, style: CSSProperties | undefined): CSSProperties | undefined {
  if (offset === undefined) return style;
  const value = typeof offset === 'number' ? `${offset}px` : offset;
  return { ['--tbl-sticky-offset' as string]: value, ...style };
}

// Figma: 13751:23691
/**
 * Tabla de datos de CAOS (set Table de Figma). Es un `<table>` real dentro de un `ScrollArea`
 * horizontal: si no cabe, el área se vuelve una región con nombre que recibe foco para desplazarse con las flechas.
 * Las filas se separan 8 (`border-spacing`); el margen negativo quita ese espacio por fuera de la primera y la última.
 * En móvil (`layout="auto"`) dibuja `mobile` si se pasa (Row mobile de Figma).
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ label, layout = 'auto', mobile, scrollClassName, className, children, ...restProps }, ref) => {
    const isMobile = useIsMobile();
    const showMobile = mobile !== undefined && (layout === 'mobile' || (layout === 'auto' && isMobile));
    if (showMobile) return <>{mobile}</>;

    return (
      <ScrollArea orientation="horizontal" aria-label={label} className={cn('w-full', scrollClassName)}>
        <table
          ref={ref}
          aria-label={label}
          className={cn(
            'w-full border-separate border-spacing-x-0 border-spacing-y-ds-space-general-lg -my-ds-space-general-lg',
            className
          )}
          {...restProps}
        >
          {children}
        </table>
      </ScrollArea>
    );
  }
);
Table.displayName = 'Table';

/** `<thead>` de la tabla. */
export const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...restProps }, ref) => <thead ref={ref} className={className} {...restProps} />
);
TableHeader.displayName = 'TableHeader';

/** `<tbody>` de la tabla. */
export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...restProps }, ref) => <tbody ref={ref} className={className} {...restProps} />
);
TableBody.displayName = 'TableBody';

/**
 * Fila. Sus celdas toman el aspecto Default, Hover (cursor o foco dentro de la fila) o Select (`selected`).
 * En la cabecera aplica igual (Header table tiene los mismos tres estados).
 */
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ selected = false, state, className, ...restProps }, ref) => (
    <tr
      ref={ref}
      data-selected={selected || state === 'select' ? '' : undefined}
      data-state={state}
      className={cn(tableRowVariants(), className)}
      {...restProps}
    />
  )
);
TableRow.displayName = 'TableRow';

const nextSort = (sort: TableSortDirection): Exclude<TableSortDirection, 'none'> =>
  sort === 'ascending' ? 'descending' : 'ascending';

/**
 * Encabezado de columna (`<th scope="col">`, Header table de Figma). Con `sort` el texto es un botón con el ícono
 * de orden y la celda anuncia el orden con `aria-sort`.
 */
export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  (
    { type = 'text', align = 'start', sticky, stickyOffset, sort, onSortChange, scope = 'col', className, style, children, ...restProps },
    ref
  ) => {
    const sortable = sort !== undefined && type === 'text';
    const icon = (
      <Icon name="transfer2" size={12} variant="line" className={tableSortIconClass} data-figma-part="Icon-sizes" />
    );
    let content: ReactNode = children;
    if (sortable) {
      content = (
        <button type="button" className={tableSortButtonClass} onClick={() => onSortChange?.(nextSort(sort))}>
          {icon}
          <span data-figma-part="Filename">{children}</span>
        </button>
      );
    } else if (type === 'text') {
      content = (
        <span className={tableHeadContentClass}>
          <span data-figma-part="Filename">{children}</span>
        </span>
      );
    }

    return (
      <th
        ref={ref}
        scope={scope}
        aria-sort={sortable && sort !== 'none' ? sort : undefined}
        style={stickyStyle(stickyOffset, style)}
        className={cn(tableCellShellVariants({ sticky: sticky ?? 'none', checkbox: type === 'checkbox' }), sticky && 'z-20', className)}
        {...restProps}
      >
        <div className={tableHeadFrameVariants({ type, align })} data-figma-part="Header table/Text">
          {content}
        </div>
      </th>
    );
  }
);
TableHead.displayName = 'TableHead';

/** Caja de contenido de la celda (`Item table (Atom)`): 40 de alto, gap 8. Sirve también fuera de la tabla. */
export const TableItem = forwardRef<HTMLDivElement, TableItemProps>(
  ({ align = 'start', checkbox = false, className, ...restProps }, ref) => (
    <div
      ref={ref}
      data-figma-part="Item table (Atom)"
      className={cn(tableItemVariants({ align, checkbox }), className)}
      {...restProps}
    />
  )
);
TableItem.displayName = 'TableItem';

/** Celda (`<td>`, Cell table de Figma). El contenido va dentro de un `TableItem`. */
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ type = 'default', align = 'start', sticky, stickyOffset, className, style, children, ...restProps }, ref) => (
    <td
      ref={ref}
      style={stickyStyle(stickyOffset, style)}
      className={cn(tableCellShellVariants({ sticky: sticky ?? 'none', checkbox: type === 'checkbox' }), className)}
      {...restProps}
    >
      <div className={tableCellFrameVariants()} data-figma-part="Cell table">
        <TableItem align={align} checkbox={type === 'checkbox'}>
          {children}
        </TableItem>
      </div>
    </td>
  )
);
TableCell.displayName = 'TableCell';

/**
 * Estado vacío (Type=Empty state de Figma): una fila con una sola celda que ocupa todas las columnas, debajo de la
 * cabecera, con un `EmptyState` dentro. Así la tabla conserva sus encabezados y el lector anuncia el contenido.
 */
export const TableEmpty = forwardRef<HTMLTableRowElement, TableEmptyProps>(
  ({ colSpan, className, children, ...restProps }, ref) => (
    <tr ref={ref} className={className} {...restProps}>
      <td colSpan={colSpan} className={tableEmptyCellClass}>
        {children}
      </td>
    </tr>
  )
);
TableEmpty.displayName = 'TableEmpty';
