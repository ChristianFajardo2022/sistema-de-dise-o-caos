import type { HTMLAttributes } from 'react';

/** Selección: una fecha (`Only date` en Figma) o un rango (`Date range`). */
export type CalendarMode = 'single' | 'range';

/**
 * Vista (`Date` de Figma: Day, Month, Year).
 * En `single` cambia lo que se dibuja (días, meses o años). En `range` el cuerpo siempre son los días y la vista
 * indica qué campo del encabezado (Mes o Año) está activo, como en Figma.
 */
export type CalendarView = 'day' | 'month' | 'year';

/** Rango de fechas. `end` es `null` mientras solo se eligió el inicio. */
export interface DateRange {
  start: Date | null;
  end: Date | null;
}

/**
 * Estado de la celda de día de `Date range` (set "Number cell (Date range)").
 * `select` y `full-curve` son internos (inicio sin fin y banda de un solo día en su fila): Figma no los define.
 */
export type CalendarRangeCellState =
  | 'default'
  | 'hover'
  | 'active-first'
  | 'half-active'
  | 'left-curve'
  | 'right-curve'
  | 'active-finish'
  | 'disabled'
  | 'select'
  | 'full-curve';

/** Estado de las celdas de `Only date`: día (`State`), mes y año (`_state`). */
export type CalendarCellState = 'default' | 'hover' | 'select' | 'disabled';

/** Textos de la interfaz (español por defecto). Pasar `labels` parcial para otro idioma. */
export interface CalendarLabels {
  /** Nombre accesible del calendario (grupo). */
  calendar: string;
  /** Botón anterior según la vista. */
  previous: { day: string; month: string; year: string };
  /** Botón siguiente según la vista. */
  next: { day: string; month: string; year: string };
  /** Texto del chip que muestra la vista actual. */
  views: { day: string; month: string; year: string };
  /** Complemento del nombre accesible del chip ("Día, cambiar vista"). */
  changeView: string;
  /** Campos del encabezado de `range`. */
  monthField: string;
  yearField: string;
  /** Nombre de las listas de los campos Mes y Año. */
  monthList: string;
  yearList: string;
  /** Botones del pie (Figma: "Limpiar" y "Filtrar"). */
  cancel: string;
  apply: string;
}

export interface CalendarBaseProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** Vista actual (controlada). */
  view?: CalendarView;
  /** Vista inicial (no controlada). Por defecto `day`. */
  defaultView?: CalendarView;
  /** Cambia la vista (chip, selección de mes o año, campos del rango). */
  onViewChange?: (view: CalendarView) => void;
  /** Mes visible (controlado): cualquier fecha de ese mes. En `range` es el mes de la izquierda. */
  month?: Date;
  /** Mes visible inicial (no controlado). Por defecto, el de la selección o el de hoy. */
  defaultMonth?: Date;
  /** Cambia el mes visible (primer día del mes). */
  onMonthChange?: (month: Date) => void;
  /** Código de idioma para nombres de mes y días (`Intl.DateTimeFormat`). Por defecto `es`. */
  locale?: string;
  /** Primer día de la semana: 0 domingo (Figma), 1 lunes… 6 sábado. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Fecha mínima seleccionable (inclusive). */
  minDate?: Date;
  /** Fecha máxima seleccionable (inclusive). */
  maxDate?: Date;
  /** Deshabilita días puntuales (se atenúan y no se pueden elegir). */
  isDateDisabled?: (date: Date) => boolean;
  /** Dibuja atenuados los días de los meses vecinos. Con `false` quedan vacíos. Nunca se pueden elegir. */
  showOutsideDays?: boolean;
  /** Fecha de hoy (`aria-current="date"`). Por defecto, la del sistema; pasarla hace los tests y capturas deterministas. */
  today?: Date;
  /** Dibuja el pie con los botones Cancelar/Aplicar (Figma: "Limpiar" y "Filtrar"). */
  showActions?: boolean;
  /** Se pulsa Aplicar (el de Figma, "Filtrar"). Recibe la selección actual. */
  onApply?: (value: Date | null | DateRange) => void;
  /** Se pulsa Cancelar (el de Figma, "Limpiar"). */
  onCancel?: () => void;
  /** Textos de la interfaz; se mezclan con los de español. */
  labels?: Partial<Omit<CalendarLabels, 'previous' | 'next' | 'views'>> & {
    previous?: Partial<CalendarLabels['previous']>;
    next?: Partial<CalendarLabels['next']>;
    views?: Partial<CalendarLabels['views']>;
  };
  className?: string;
}

/** `Type=Only date`: una fecha. */
export interface CalendarSingleProps extends CalendarBaseProps {
  mode?: 'single';
  /** Fecha elegida (controlada). */
  value?: Date | null;
  /** Fecha inicial (no controlada). */
  defaultValue?: Date | null;
  onChange?: (value: Date | null) => void;
}

/** `Type=Date range`: dos meses lado a lado desde la tableta (uno solo en móvil). */
export interface CalendarRangeProps extends CalendarBaseProps {
  mode: 'range';
  /** Rango elegido (controlado). */
  value?: DateRange;
  /** Rango inicial (no controlado). */
  defaultValue?: DateRange;
  /** Se llama en cada clic: primero con solo `start`, luego con `start` y `end`. */
  onChange?: (value: DateRange) => void;
}

export type CalendarProps = CalendarSingleProps | CalendarRangeProps;
