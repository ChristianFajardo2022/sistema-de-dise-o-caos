import { forwardRef } from 'react';
import type { NotificationPanelHeadingProps } from './NotificationPanel.types';
import { notificationPanelHeadingVariants } from './NotificationPanel.variants';
import { cn } from '../../utils/cn';

/**
 * Título de sección dentro de la lista del `NotificationPanel` ("Hoy", "Ayer"): un `<li>` con un encabezado (h3 por
 * defecto), para que la lista siga siendo válida y los lectores encuentren las secciones por encabezados.
 */
export const NotificationPanelHeading = forwardRef<HTMLLIElement, NotificationPanelHeadingProps>(
  ({ headingLevel = 3, children, className, ...rest }, ref) => {
    const Heading = `h${headingLevel}` as const;
    return (
      <li {...rest} ref={ref} className="m-0 list-none p-0">
        <Heading data-figma-part={typeof children === 'string' ? children : undefined} className={cn(notificationPanelHeadingVariants(), 'm-0', className)}>
          {children}
        </Heading>
      </li>
    );
  }
);

NotificationPanelHeading.displayName = 'NotificationPanelHeading';
