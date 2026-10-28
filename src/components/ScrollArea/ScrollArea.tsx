import { forwardRef, useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { ScrollAreaProps } from './ScrollArea.types';
import { scrollAreaGapVariants, scrollAreaVariants } from './ScrollArea.variants';
import { cn } from '../../utils/cn';

/**
 * ScrollArea: contenedor con scroll nativo y barra estilizada como el componente
 * "Scroll bar" de Figma. Solo cuando el contenido desborda se vuelve una región con nombre
 * y `tabIndex={0}`, para poder desplazarlo con el teclado aunque el contenido no sea enfocable;
 * sin desborde no es tabulable ni se anuncia. Un `role` o `tabIndex` explícito se respeta.
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    { orientation = 'vertical', maxHeight, scrollbarGap = 'none', className, style, children, role, tabIndex, 'aria-label': ariaLabel, ...restProps },
    ref
  ) => {
    const innerRef = useRef<HTMLDivElement | null>(null);
    const [overflow, setOverflow] = useState({ vertical: false, horizontal: false });

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        innerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    useLayoutEffect(() => {
      const el = innerRef.current;
      if (!el) return;
      const measure = () => {
        const vertical = el.scrollHeight > el.clientHeight;
        const horizontal = el.scrollWidth > el.clientWidth;
        setOverflow((prev) =>
          prev.vertical === vertical && prev.horizontal === horizontal ? prev : { vertical, horizontal }
        );
      };
      measure();
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(measure);
      observer.observe(el);
      Array.from(el.children).forEach((child) => observer.observe(child));
      return () => observer.disconnect();
    }, [orientation, maxHeight, children]);

    const overflows =
      orientation === 'vertical' ? overflow.vertical : orientation === 'horizontal' ? overflow.horizontal : overflow.vertical || overflow.horizontal;
    const vertical = orientation !== 'horizontal' && overflow.vertical;
    const horizontal = orientation !== 'vertical' && overflow.horizontal;
    const gapAxis = vertical && horizontal ? 'both' : vertical ? 'vertical' : horizontal ? 'horizontal' : 'none';
    const resolvedRole = role ?? (overflows ? 'region' : undefined);
    const resolvedTabIndex = tabIndex ?? (overflows ? 0 : undefined);

    return (
      <div
        {...restProps}
        ref={setRefs}
        role={resolvedRole}
        tabIndex={resolvedTabIndex}
        aria-label={resolvedRole ? ariaLabel : undefined}
        style={maxHeight === undefined ? style : { maxHeight, ...style }}
        className={cn(
          scrollAreaVariants({ orientation }),
          scrollAreaGapVariants({
            gap: scrollbarGap,
            axis: gapAxis,
          }),
          className
        )}
      >
        {children}
      </div>
    );
  }
);

ScrollArea.displayName = 'ScrollArea';
