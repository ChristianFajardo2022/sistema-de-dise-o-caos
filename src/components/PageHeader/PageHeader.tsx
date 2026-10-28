import { forwardRef } from 'react';
import type { PageHeaderProps } from './PageHeader.types';
import {
  pageHeaderBackVariants,
  pageHeaderDescriptionVariants,
  pageHeaderRowVariants,
  pageHeaderTitleVariants,
  pageHeaderVariants,
} from './PageHeader.variants';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';

export const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(
  (
    {
      title,
      headingLevel = 1,
      description,
      onBack,
      backLabel = 'Volver',
      breadcrumb,
      actions,
      className,
      ...restProps
    },
    ref
  ) => {
    const Heading = `h${headingLevel}` as const;
    return (
      <header {...restProps} ref={ref} data-figma="Property 1=Default" className={cn(pageHeaderVariants(), className)}>
        {breadcrumb}
        <div className={pageHeaderRowVariants()} data-figma-part="Header">
          {onBack && (
            <button type="button" aria-label={backLabel} onClick={onBack} className={pageHeaderBackVariants()}>
              <Icon name="chevron-left" variant="line" size={24} data-figma-part="Icon Search" />
            </button>
          )}
          <Heading className={pageHeaderTitleVariants()} data-figma-part="Tittle">
            {title}
          </Heading>
          {actions && <div className="flex shrink-0 items-center gap-ds-space-general-xl">{actions}</div>}
        </div>
        {description && (
          <p className={pageHeaderDescriptionVariants()} data-figma-part="Text description">
            {description}
          </p>
        )}
      </header>
    );
  }
);

PageHeader.displayName = 'PageHeader';
