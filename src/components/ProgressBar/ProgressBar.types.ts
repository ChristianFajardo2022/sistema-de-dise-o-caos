import type { HTMLAttributes } from 'react';

/**
 * Type de Figma: dónde va el texto del porcentaje.
 * - `linear-text`: en línea, a la derecha de la barra (Linear text).
 * - `text-above`: burbuja sobre la barra, en el extremo del progreso (Text above).
 * - `external-text`: burbuja con puntero encima de una barra fina (External text).
 */
export type ProgressBarType = 'linear-text' | 'text-above' | 'external-text';

/** State de Figma: color del progreso. No es un estado de interacción. */
export type ProgressBarStatus = 'default' | 'success' | 'error' | 'alert';

type ProgressBarBaseProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'aria-label' | 'aria-labelledby' | 'aria-valuenow' | 'aria-valuemin' | 'aria-valuemax' | 'aria-valuetext' | 'role'
> & {
    /** Progreso actual, continuo entre 0 y `max`. Los valores fuera de rango se recortan. Por defecto 0. */
    value?: number;
    /** Valor que equivale al 100 %. Por defecto 100. */
    max?: number;
    /** Type: dónde va el texto del porcentaje. Por defecto `linear-text`. */
    type?: ProgressBarType;
    /** State: color del progreso. Por defecto `default`. */
    status?: ProgressBarStatus;
    /** Muestra el texto del porcentaje. Por defecto true; en false queda solo la barra. */
    showValue?: boolean;
    /**
     * Formato del texto (visible y `aria-valuetext`). Recibe el valor recortado y el porcentaje 0-100.
     * Por defecto `${Math.round(percent)}%`.
     */
    formatValue?: (value: number, percent: number) => string;
    /**
     * Texto del estado para lectores de pantalla (p. ej. "con error"). Se añade a `aria-valuetext`,
     * porque el color solo no basta para informar el estado.
     */
    statusLabel?: string;
    /** Clases adicionales para la raíz */
    className?: string;
};

/**
 * El nombre accesible es obligatorio por tipos: `label` (qué está progresando, p. ej. "Carga del archivo")
 * o `aria-labelledby` con el id de un texto visible.
 */
export type ProgressBarProps = ProgressBarBaseProps &
  (
    | {
        /** Nombre accesible de la barra. Obligatorio si no se pasa `aria-labelledby`. */
        label: string;
        'aria-labelledby'?: string;
      }
    | {
        label?: string;
        /** Id de un texto visible que nombra la barra. Obligatorio si no se pasa `label`. */
        'aria-labelledby': string;
      }
  );
