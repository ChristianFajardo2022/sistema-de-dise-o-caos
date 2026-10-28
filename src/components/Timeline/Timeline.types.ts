import type { HTMLAttributes, LiHTMLAttributes, ReactNode } from 'react';

/** Orientation de Figma (set Indicator 13576:32508). */
export type TimelineOrientation = 'vertical' | 'horizontal';

/**
 * Type de Figma: lugar del paso en la línea. `initial` redondea el arranque de la barra, `finally` su final y
 * `middle` no redondea. Si no se pasa, sale de la posición del ítem dentro de su lista (primero, último o intermedio).
 */
export type TimelinePosition = 'initial' | 'middle' | 'finally';

/**
 * State de Figma: `incomplete` (Incomplete), `current` (Currently), `warning`, `error` y `complete` (Check).
 * Solo `current` lleva `aria-current="step"`; todos anuncian su estado en texto para lector de pantalla.
 */
export type TimelineStatus = 'incomplete' | 'current' | 'warning' | 'error' | 'complete';

/** Percentage de Figma: avance del segmento de línea de ese paso (0 %, 50 %, 100 %). */
export type TimelineProgress = 0 | 50 | 100;

/** Textos de estado para lector de pantalla (por defecto en español). */
export type TimelineStatusLabels = Partial<Record<TimelineStatus, string>>;

/** Contenido de un paso (props de texto del Indicator de Figma). */
export interface TimelineItemData {
  /** Title text */
  title: ReactNode;
  /** Description text. Sin descripción no se dibuja (prop Description de Figma). */
  description?: ReactNode;
  /** Date text, p. ej. "Hoy". */
  date?: ReactNode;
  /** Hour text, p. ej. "8:00pm". */
  time?: ReactNode;
  /** Fecha y hora en formato ISO para `<time dateTime>`. Sin ella, fecha y hora van en un `<span>`. */
  dateTime?: string;
  /** State del paso. */
  status: TimelineStatus;
  /** Avance del segmento. Por defecto sale del estado: incomplete 0, complete 100, el resto 50. */
  progress?: TimelineProgress;
  /** Texto de estado para lector de pantalla; reemplaza al de `statusLabels`. */
  statusLabel?: string;
}

export interface TimelineItemProps
  extends Omit<LiHTMLAttributes<HTMLLIElement>, 'title' | 'children'>,
    Omit<TimelineItemData, 'status'> {
  /** State del paso. Por defecto `incomplete`. */
  status?: TimelineStatus;
  /** Orientation. Por defecto hereda la de `Timeline` (o `vertical`). */
  orientation?: TimelineOrientation;
  /** Type de Figma; ver {@link TimelinePosition}. */
  position?: TimelinePosition;
}

export interface TimelineProps extends Omit<HTMLAttributes<HTMLOListElement>, 'children'> {
  /** Pasos como datos. Alternativa a `children` (composición con `TimelineItem`). */
  items?: TimelineItemData[];
  /** Composición libre con `TimelineItem` (el slot Espacio de Figma). Si hay `items`, se ignora. */
  children?: ReactNode;
  /** Orientation. Por defecto `vertical`. */
  orientation?: TimelineOrientation;
  /** Textos de estado para lector de pantalla, por estado. */
  statusLabels?: TimelineStatusLabels;
}

export interface StatusTrackerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Pasos del seguimiento (mínimo dos para que la barra tenga principio y final). */
  items: TimelineItemData[];
  /** Título del resumen (visible en móvil). Por defecto "Estado actual". */
  title?: ReactNode;
  /** Referencia o código del elemento seguido, a la derecha del título (visible en móvil). */
  reference?: ReactNode;
  /** Figura decorativa que acompaña al paso actual (la imagen la pone quien usa el componente). */
  marker?: ReactNode;
  /** Muestra el botón de historial (prop Button history de Figma) y lo llama al pulsarlo. */
  onShowHistory?: () => void;
  /** Texto del botón de historial. Por defecto "Ver historial". */
  historyLabel?: string;
  /** Slot que reemplaza al botón de historial (p. ej. un enlace). */
  historyAction?: ReactNode;
  /** Textos de estado para lector de pantalla, por estado. */
  statusLabels?: TimelineStatusLabels;
}
