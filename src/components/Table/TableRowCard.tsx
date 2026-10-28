import { forwardRef, useId } from 'react';
import type { TableRowCardProps } from './Table.types';
import {
  tableRowCardDetailsClass,
  tableRowCardFieldsClass,
  tableRowCardFooterClass,
  tableRowCardSummaryClass,
  tableRowCardToggleClass,
  tableRowCardVariants,
} from './Table.variants';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/controllableState';

/**
 * Tarjeta de fila (`Card tabla` de Figma, 20231:8418): una fila presentada como tarjeta, con los campos del
 * resumen siempre visibles y un detalle que se abre con el chevron. Default = cerrada; Variant2 = abierta.
 * Patrón APG Disclosure: el chevron es un `<button>` con `aria-expanded` y `aria-controls`.
 */
export const TableRowCard = forwardRef<HTMLDivElement, TableRowCardProps>(
  (
    {
      summary,
      children,
      footer,
      expanded,
      defaultExpanded = false,
      onExpandedChange,
      toggleLabel = 'Ver detalle',
      className,
      ...restProps
    },
    ref
  ) => {
    const detailsId = useId();
    const [open, setOpen] = useControllableState(expanded, defaultExpanded, onExpandedChange, 'TableRowCard');
    return (
      <div ref={ref} className={cn(tableRowCardVariants({ expanded: open }), className)} {...restProps}>
        <div className={tableRowCardSummaryClass}>
          <div className={tableRowCardFieldsClass}>{summary}</div>
          <button
            type="button"
            aria-label={toggleLabel}
            aria-expanded={open}
            aria-controls={detailsId}
            onClick={() => setOpen(!open)}
            className={tableRowCardToggleClass}
          >
            <Icon name={open ? 'chevron-up' : 'chevron-down'} size={24} variant="line" data-figma-part={open ? 'chevron-up' : 'chevron-down'} />
          </button>
        </div>
        <div id={detailsId} hidden={!open} className={cn(open && tableRowCardDetailsClass)}>
          {children}
        </div>
        {open && footer != null && <div className={tableRowCardFooterClass}>{footer}</div>}
      </div>
    );
  }
);
TableRowCard.displayName = 'TableRowCard';
