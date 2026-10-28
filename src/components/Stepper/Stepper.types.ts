import type { HTMLAttributes, LiHTMLAttributes, OlHTMLAttributes, ReactNode } from 'react';

/** Estado de un paso. `Propiedad 1` de Figma: Incomplete | In progress | Complete | Error. */
export type StepperStatus = 'incomplete' | 'in-progress' | 'complete' | 'error';

/** Orientación (`Orientation` de Figma): Vertical lista los pasos en columna con barra a la izquierda; Horizontal, en fila con barra arriba. */
export type StepperOrientation = 'vertical' | 'horizontal';

/** Textos legibles por lector de pantalla para cada estado. El color y el ícono solos no bastan (WCAG 1.4.1). */
export type StepperStatusLabels = Record<StepperStatus, string>;

export interface StepperStepProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'title' | 'onClick'> {
  /** Estado del paso. Dentro de Stepper lo deriva `current` salvo que se fuerce aquí. */
  status?: StepperStatus;
  /** Orientación. Dentro de Stepper la hereda. */
  orientation?: StepperOrientation;
  /** Título (fila con ícono, `Title` de Figma). Sin título no se dibuja la fila. */
  title?: ReactNode;
  /** Texto de apoyo bajo el título (`Text` de Figma). */
  description?: ReactNode;
  /** Marca el paso actual con `aria-current="step"`. Por defecto lo es el paso `in-progress`. */
  current?: boolean;
  /** Texto del estado para lectores de pantalla; por defecto el de `statusLabels` de Stepper. */
  statusLabel?: string;
  /** Si existe, el contenido del paso es un botón (paso navegable). */
  onClick?: () => void;
}

export interface StepperItem {
  /** Título del paso. */
  title?: ReactNode;
  /** Texto de apoyo. */
  description?: ReactNode;
  /** Fuerza el estado (p. ej. `error`); si falta, lo deriva `current`. */
  status?: StepperStatus;
}

export interface StepperProps extends Omit<OlHTMLAttributes<HTMLOListElement>, 'children'> {
  /** Pasos como datos. Alternativa: pasar `StepperStep` como `children`. */
  steps?: StepperItem[];
  /** Pasos en composición. Se ignora si hay `steps`. */
  children?: ReactNode;
  /** Índice (desde 0) del paso en curso: los anteriores quedan completos y los siguientes incompletos. */
  current?: number;
  /** Orientación. Por defecto vertical. */
  orientation?: StepperOrientation;
  /** Vuelve navegables los pasos: cada uno es un botón que llama con su índice. */
  onStepClick?: (index: number) => void;
  /** Textos de estado para lectores de pantalla (por defecto en español). */
  statusLabels?: Partial<StepperStatusLabels>;
}

export type StepperIndicatorProps = HTMLAttributes<HTMLSpanElement>;
