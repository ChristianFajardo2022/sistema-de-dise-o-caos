import { createContext } from 'react';
import type { TimelineOrientation, TimelineStatusLabels } from './Timeline.types';

export interface TimelineContextValue {
  orientation: TimelineOrientation;
  statusLabels?: TimelineStatusLabels;
}

/** Orientación y textos de estado compartidos entre `Timeline` y sus `TimelineItem`. */
export const TimelineContext = createContext<TimelineContextValue>({ orientation: 'vertical' });

/** Textos de estado para lector de pantalla por defecto. */
export const DEFAULT_STATUS_LABELS = {
  incomplete: 'Pendiente',
  current: 'En curso',
  warning: 'Con advertencia',
  error: 'Con error',
  complete: 'Completado',
} as const;
