import { forwardRef, useId } from 'react';
import type { StatusTrackerProps, TimelineItemData } from './Timeline.types';
import { Timeline } from './Timeline';
import { DEFAULT_STATUS_LABELS } from './TimelineContext';
import { Button } from '../Button';
import {
  statusTrackerHeaderClass,
  statusTrackerMarkerClass,
  statusTrackerMarkerRowClass,
  statusTrackerReferenceClass,
  statusTrackerRootClass,
  statusTrackerSummaryClass,
  statusTrackerTitleClass,
  timelineTitleVariants,
  timelineDateClass,
} from './Timeline.variants';
import { cn } from '../../utils/cn';

/** Paso que se está viviendo: el primero en curso, con advertencia o con error; si no hay, el siguiente al último completo. */
function currentIndex(items: TimelineItemData[]): number {
  const active = items.findIndex((i) => i.status === 'current' || i.status === 'warning' || i.status === 'error');
  if (active >= 0) return active;
  const lastDone = items.map((i) => i.status).lastIndexOf('complete');
  return Math.min(lastDone + 1, items.length - 1);
}

/**
 * Seguimiento de estado (Status tracker de Figma, 13770:10884): resumen del estado actual, línea de tiempo
 * horizontal y botón de historial opcional. En móvil la barra queda sin textos y se resume el paso actual debajo.
 * Los pasos van sin descripción (como en Figma). Con `live` anuncia los cambios de estado (región `aria-live`).
 */
export const StatusTracker = forwardRef<HTMLDivElement, StatusTrackerProps>(
  (
    {
      items,
      title = 'Estado actual',
      reference,
      marker,
      onShowHistory,
      historyLabel = 'Ver historial',
      historyAction,
      statusLabels,
      live,
      className,
      ...restProps
    },
    ref
  ) => {
    const titleId = useId();
    const current = Math.max(0, currentIndex(items));
    const step = items[current];
    const rows = items.map(({ description: _description, ...rest }) => rest);
    // Texto del anuncio: título + estado + paso actual (la región solo existe si se pide `live`)
    const announcement =
      live && step
        ? [
            typeof title === 'string' ? title : null,
            step.statusLabel ?? statusLabels?.[step.status] ?? DEFAULT_STATUS_LABELS[step.status],
            typeof step.title === 'string' ? step.title : null,
          ]
            .filter(Boolean)
            .join(': ')
        : null;
    const action =
      historyAction ??
      (onShowHistory ? (
        <Button variant="tertiary" size="md" onClick={onShowHistory} data-figma-part="Button">
          {historyLabel}
        </Button>
      ) : null);

    return (
      <div {...restProps} ref={ref} role="group" aria-labelledby={titleId} className={cn(statusTrackerRootClass, className)}>
        {/* Visible en móvil (Frame Mobile de Figma); en escritorio queda como nombre del grupo */}
        <div className={statusTrackerHeaderClass}>
          <span id={titleId} className={statusTrackerTitleClass}>
            {title}
          </span>
          {reference != null && <span className={statusTrackerReferenceClass}>{reference}</span>}
        </div>
        {marker != null && (
          <div className={statusTrackerMarkerRowClass} aria-hidden="true" data-figma-part="Car">
            <div
              className={statusTrackerMarkerClass}
              style={{ left: `${(current / items.length) * 100}%` }}
              data-current-index={current}
            >
              {marker}
            </div>
          </div>
        )}
        <Timeline orientation="horizontal" items={rows} statusLabels={statusLabels} aria-labelledby={titleId} data-figma-part="Timeline" />
        {step && (
          // Copia visual del paso actual para móvil; el lector ya lo tiene en la lista
          <div aria-hidden="true" className={statusTrackerSummaryClass} data-figma-part="Text">
            <p className={timelineTitleVariants({ status: step.status })}>{step.title}</p>
            {(step.date != null || step.time != null) && (
              <p className={timelineDateClass}>
                {step.date != null && <span>{step.date}</span>}
                {step.time != null && <span>{step.time}</span>}
              </p>
            )}
          </div>
        )}
        {live && (
          <p className="sr-only" aria-live={live} aria-atomic="true">
            {announcement}
          </p>
        )}
        {action}
      </div>
    );
  }
);

StatusTracker.displayName = 'StatusTracker';
