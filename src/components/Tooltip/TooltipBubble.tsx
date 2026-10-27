import { forwardRef } from 'react';
import type { TooltipBubbleProps } from './Tooltip.types';
import {
  tooltipArrowVariants,
  tooltipArrowWrapVariants,
  tooltipBubbleVariants,
  tooltipContentVariants,
  tooltipTextClass,
} from './Tooltip.variants';
import { cn } from '../../utils/cn';

/**
 * Burbuja del tooltip (dibujo del set "Tooltip (Atom)" de Figma), sin comportamiento. La usa `Tooltip` en la capa
 * superior; suelta sirve para documentación o para componer otro patrón. No tiene rol: `Tooltip` le pone
 * `role="tooltip"` y el `id` que enlaza con el disparador. Con `solid` la superficie es unicolor (igual en los dos temas):
 * el contenido usa siempre los tokens de Dark (`data-theme="dark"`, como MediaScrim).
 */
export const TooltipBubble = forwardRef<HTMLDivElement, TooltipBubbleProps>(
  // `icon` está obsoleto (Figma quitó el ícono): se descarta para que no llegue al DOM
  ({ arrow = 'bottom', solid = true, icon: _icon, children, className, ...rest }, ref) => (
    <div data-theme={solid ? 'dark' : undefined} {...rest} ref={ref} className={cn(tooltipBubbleVariants({ arrow }), className)}>
      <div data-figma-part="Content" className={tooltipContentVariants({ solid })}>
        <span data-figma-part="Supporting text" className={tooltipTextClass}>
          {children}
        </span>
      </div>
      <span aria-hidden="true" data-figma-part="div" className={tooltipArrowWrapVariants({ arrow })}>
        <span data-figma-part={arrow === 'top' ? 'Polygon 1' : 'Arrow'} className={tooltipArrowVariants({ arrow, solid })} />
      </span>
    </div>
  )
);

TooltipBubble.displayName = 'TooltipBubble';
