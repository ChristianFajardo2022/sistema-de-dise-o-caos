import { forwardRef, use } from 'react';
import type { TimelineItemProps } from './Timeline.types';
import {
  DEFAULT_PROGRESS,
  timelineCoreVariants,
  timelineDateClass,
  timelineDescriptionClass,
  timelineDotVariants,
  timelineItemVariants,
  timelineRingVariants,
  timelineTextVariants,
  timelineTitleVariants,
  timelineTrackVariants,
} from './Timeline.variants';
import { DEFAULT_STATUS_LABELS, TimelineContext } from './TimelineContext';
import { cn } from '../../utils/cn';

/**
 * Paso de una línea de tiempo (Indicator de Figma): nodo, segmento de barra y texto.
 * Va dentro de `Timeline`. El nodo y la barra son decorativos (también el slot `icon`); el estado se anuncia en texto.
 */
export const TimelineItem = forwardRef<HTMLLIElement, TimelineItemProps>(
  (
    {
      title,
      description,
      date,
      time,
      dateTime,
      status = 'incomplete',
      progress,
      statusLabel,
      icon,
      orientation: orientationProp,
      position,
      className,
      ...restProps
    },
    ref
  ) => {
    const ctx = use(TimelineContext);
    const orientation = orientationProp ?? ctx.orientation;
    const label = statusLabel ?? ctx.statusLabels?.[status] ?? DEFAULT_STATUS_LABELS[status];
    const hasWhen = date != null || time != null;
    const when = (
      <>
        {date != null && <span data-figma-part="Hoy">{date}</span>}
        {time != null && <span data-figma-part="8:00pm">{time}</span>}
      </>
    );
    const nodeIcon =
      icon != null ? (
        <span className="absolute inset-0 flex items-center justify-center" data-figma-part="Icon">
          {icon}
        </span>
      ) : null;
    const isRing = status === 'current' || status === 'warning' || status === 'error';

    return (
      <li
        aria-current={status === 'current' ? 'step' : undefined}
        {...restProps}
        ref={ref}
        data-status={status}
        className={cn(timelineItemVariants({ orientation }), className)}
      >
        <div
          aria-hidden="true"
          data-figma-part="Indicator"
          className={cn(
            timelineTrackVariants({
              orientation,
              progress: progress ?? DEFAULT_PROGRESS[status],
              position: position ?? 'auto',
            })
          )}
        >
          {isRing ? (
            <span className={cn(timelineRingVariants({ status }), 'relative')} data-figma-part="Step indicator">
              <span className={timelineCoreVariants({ status })} />
              {nodeIcon}
            </span>
          ) : (
            <span className={cn(timelineDotVariants({ status }), 'relative')} data-figma-part="Step indicator">
              {nodeIcon}
            </span>
          )}
        </div>
        <div className={timelineTextVariants({ orientation })} data-figma-part="Text">
          <p className={timelineTitleVariants({ status })} data-figma-part="Title">
            <span className="sr-only">{label}: </span>
            {title}
          </p>
          {description != null && (
            <p className={timelineDescriptionClass} data-figma-part="Description">
              {description}
            </p>
          )}
          {hasWhen &&
            (dateTime ? (
              <time dateTime={dateTime} className={timelineDateClass} data-figma-part="Fecha">
                {when}
              </time>
            ) : (
              <span className={timelineDateClass} data-figma-part="Fecha">
                {when}
              </span>
            ))}
        </div>
      </li>
    );
  }
);

TimelineItem.displayName = 'TimelineItem';
