import type { HTMLAttributes, ReactElement, ReactNode, RefObject } from 'react';

/**
 * Type de Figma: dónde está la flecha. El panel aparece del lado opuesto del ancla (`top-left` = flecha en la esquina
 * superior izquierda, panel debajo y hacia la derecha; `middle-right` = flecha a la derecha, panel a la izquierda).
 */
export type PopoverArrow =
  | 'top-left'
  | 'top-right'
  | 'middle-left'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center-top'
  | 'center-bottom';

export interface PopoverPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Type de Figma: dónde está la flecha. Por defecto `top-left`. */
  arrow?: PopoverArrow;
  /** Text title de Figma (con Title). Sin título, el panel necesita `aria-label`. */
  title?: ReactNode;
  /** Nivel del título (`none` = párrafo). Por defecto 2. */
  headingLevel?: 2 | 3 | 4 | 5 | 6 | 'none';
  /** Icon de Figma: info-circle antes del título. Por defecto `true` sin `media` y `false` con `media` (como en Figma). */
  icon?: boolean;
  /** Text de Figma: descripción. */
  children?: ReactNode;
  /**
   * Photo=yes de Figma: bloque de medios (imagen, avatares, una acción) con la muesca del botón cerrar. Lo interactivo
   * que se ponga aquí debe tener su propio nombre accesible.
   */
  media?: ReactNode;
  /** Botón cerrar (Button corner) en la muesca del bloque de medios. Sin `onClose` no se dibuja. */
  onClose?: () => void;
  /** Nombre accesible del botón cerrar. Por defecto "Cerrar". */
  closeLabel?: string;
  /** Page de Figma: contador del recorrido ("1 de 2"). */
  page?: ReactNode;
  /** Actions de Figma: botones del pie (Button xs tertiary y secondary, unicolor). */
  actions?: ReactNode;
  /** Id del título (para `aria-labelledby`). */
  titleId?: string;
  /** Id de la descripción (para `aria-describedby`). */
  descriptionId?: string;
}

export interface PopoverProps extends Omit<PopoverPanelProps, 'onClose' | 'titleId' | 'descriptionId'> {
  /**
   * Disparador: un único botón. Recibe `popovertarget`, `aria-expanded`, `aria-controls` y `aria-haspopup="dialog"`;
   * abrir y cerrar con él lo resuelve el navegador.
   */
  trigger?: ReactElement;
  /**
   * Ancla sin disparador (p. ej. el elemento que señala cada paso de un recorrido). Con `anchor`, el estado se controla
   * con `open`/`onOpenChange`. Si hay `trigger`, se ignora.
   */
  anchor?: HTMLElement | null | RefObject<HTMLElement | null>;
  /** Abierto (controlado). */
  open?: boolean;
  /** Abierto al montar (no controlado). */
  defaultOpen?: boolean;
  /** Se llama al abrir o cerrar (disparador, Escape, clic fuera, botón cerrar o fin del recorrido). */
  onOpenChange?: (open: boolean) => void;
  /** Dibuja el botón cerrar en el bloque de medios (solo con `media`). Por defecto `true`. */
  closeButton?: boolean;
  /** Paso actual del recorrido (desde 1). Con `totalSteps` muestra el contador. */
  step?: number;
  /** Total de pasos del recorrido. */
  totalSteps?: number;
  /**
   * Cambio de paso. Con `step`, `totalSteps` y sin `actions`, el pie trae Anterior (desde el paso 2) y Siguiente
   * (Finalizar en el último).
   */
  onStepChange?: (step: number) => void;
  /** Se llama al pulsar Finalizar en el último paso; después el panel se cierra. */
  onFinish?: () => void;
  /** Texto del contador. Por defecto "1 de 2". */
  formatStep?: (step: number, total: number) => ReactNode;
  /** Texto del botón Anterior. Por defecto "Anterior". */
  previousLabel?: string;
  /** Texto del botón Siguiente. Por defecto "Siguiente". */
  nextLabel?: string;
  /** Texto del botón del último paso. Por defecto "Finalizar". */
  finishLabel?: string;
}
