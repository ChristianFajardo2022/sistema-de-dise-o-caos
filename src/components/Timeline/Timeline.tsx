import { forwardRef, useMemo } from 'react';
import type { TimelineProps } from './Timeline.types';
import { timelineVariants } from './Timeline.variants';
import { TimelineContext } from './TimelineContext';
import { TimelineItem } from './TimelineItem';
import { cn } from '../../utils/cn';

/**
 * Línea de tiempo (Timeline de Figma, 13687:11466): lista ordenada de pasos con barra y nodo.
 * Pasa los pasos en `items` o compón con `TimelineItem` como `children`. Dale un nombre con `aria-label`
 * o `aria-labelledby` cuando la lista no tenga un encabezado alrededor.
 */
export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(
  ({ items, children, orientation = 'vertical', statusLabels, className, ...restProps }, ref) => {
    const value = useMemo(() => ({ orientation, statusLabels }), [orientation, statusLabels]);
    return (
      <TimelineContext value={value}>
        {/* role="list" explícito: con list-style: none Safari deja de anunciar la lista */}
        <ol {...restProps} ref={ref} role="list" className={cn(timelineVariants({ orientation }), className)}>
          {items
            ? items.map((item, index) => (
                <TimelineItem
                  key={index}
                  title={item.title}
                  description={item.description}
                  date={item.date}
                  time={item.time}
                  dateTime={item.dateTime}
                  status={item.status}
                  progress={item.progress}
                  statusLabel={item.statusLabel}
                  icon={item.icon}
                />
              ))
            : children}
        </ol>
      </TimelineContext>
    );
  }
);

Timeline.displayName = 'Timeline';
