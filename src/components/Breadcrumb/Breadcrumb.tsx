import { forwardRef } from 'react';
import type { BreadcrumbItemProps, BreadcrumbProps } from './Breadcrumb.types';
import {
  breadcrumbContentVariants,
  breadcrumbItemVariants,
  breadcrumbListVariants,
  breadcrumbTextVariants,
} from './Breadcrumb.variants';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ 'aria-label': ariaLabel = 'Ruta de navegación', className, children, ...restProps }, ref) => (
    <nav
      {...restProps}
      ref={ref}
      aria-label={ariaLabel}
      className={cn('inline-flex max-w-full items-center', className)}
    >
      <ol className={breadcrumbListVariants()} data-figma-part="List">
        {children}
      </ol>
    </nav>
  )
);

Breadcrumb.displayName = 'Breadcrumb';

export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  (
    { href, current = false, home = false, homeLabel = 'Inicio', chevron, truncate = false, linkProps, className, children, ...restProps },
    ref
  ) => {
    const hasText = children != null && children !== false && children !== '';
    const isLink = !current && href !== undefined;
    const title = truncate && typeof children === 'string' ? children : undefined;

    const content = (
      <>
        {home && <Icon name="home1" size={16} variant="fill" className="text-ds-icon-general-default" data-figma-part="Icon-sizes" />}
        {home && !hasText && <span className="sr-only">{homeLabel}</span>}
        {hasText && (
          <span className={breadcrumbTextVariants({ truncate })} title={title} data-figma-part="Text">
            {children}
          </span>
        )}
      </>
    );

    const contentClass = breadcrumbContentVariants({ type: current ? 'select' : 'default', link: isLink });

    return (
      <li
        {...restProps}
        ref={ref}
        className={cn(breadcrumbItemVariants(), className)}
        data-figma-part="Text Breadcrumb (Atom)"
      >
        {isLink ? (
          <a {...linkProps} href={href} className={cn(contentClass, linkProps?.className)}>
            {content}
          </a>
        ) : (
          <span className={contentClass} aria-current={current ? 'page' : undefined}>
            {content}
          </span>
        )}
        <Icon
          name="chevron-right"
          size={14}
          variant="line"
          className={cn(
            'text-ds-icon-general-default',
            chevron === false && 'hidden',
            chevron === undefined && 'group-last/item:hidden'
          )}
          data-separator=""
          data-figma-part="Icon-sizes"
        />
      </li>
    );
  }
);

BreadcrumbItem.displayName = 'BreadcrumbItem';
