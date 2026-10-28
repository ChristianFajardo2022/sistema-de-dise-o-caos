import { forwardRef } from 'react';
import type { PaginationPageProps } from './Pagination.types';
import { paginationPageVariants } from './PaginationPage.variants';
import { cn } from '../../utils/cn';

/**
 * Pieza Page (Atom) de Figma: botón circular con el número de una página. Es un `<button>` nativo;
 * la página actual lleva `aria-current="page"`. El nombre accesible por defecto es el propio número:
 * `Pagination` lo reemplaza por "Página n".
 */
export const PaginationPage = forwardRef<HTMLButtonElement, PaginationPageProps>(
  ({ number, selected = false, state, className, type = 'button', ...restProps }, ref) => {
    const isSelected = selected || state === 'select';
    const visual = isSelected ? 'select' : state === 'hover' ? 'hover' : 'default';
    return (
      <button
        {...restProps}
        ref={ref}
        type={type}
        aria-current={isSelected ? 'page' : undefined}
        className={cn(paginationPageVariants({ visual }), className)}
      >
        <span data-figma-part="Date">{number}</span>
      </button>
    );
  }
);

PaginationPage.displayName = 'PaginationPage';
