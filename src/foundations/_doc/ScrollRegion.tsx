import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface ScrollRegionProps {
  /** Nombre accesible de la región; solo se expone cuando hay desbordamiento */
  label: string;
  children: ReactNode;
  className?: string;
}

/**
 * Contenedor con scroll horizontal propio. Solo es una región enfocable (tabIndex 0, role="region" y aria-label)
 * cuando su contenido de verdad desborda, medido con ResizeObserver: así el teclado no para en cajas que no se desplazan.
 */
export function ScrollRegion({ label, children, className }: ScrollRegionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setOverflow(el.scrollWidth > el.clientWidth + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    for (const child of Array.from(el.children)) observer.observe(child);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      role={overflow ? 'region' : undefined}
      aria-label={overflow ? label : undefined}
      tabIndex={overflow ? 0 : undefined}
      className={cn('overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ds-text-neutral-heading', className)}
    >
      {children}
    </div>
  );
}
