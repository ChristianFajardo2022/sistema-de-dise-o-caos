import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { CalendarCellState, CalendarRangeCellState } from './Calendar.types';
import {
  dayCellVariants,
  periodCellVariants,
  rangeBandVariants,
  rangeCellVariants,
  rangeCircleVariants,
  rangeItemVariants,
} from './Calendar.variants';
import { cn } from '../../utils/cn';

/** Celdas internas del Calendar. Son botones; el calendario los pone dentro de `gridcell`. */

interface CellBaseProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Texto de la celda (el número, el mes o el año). */
  children?: ReactNode;
  /** Marca el día de hoy con un anillo (no existe en Figma). */
  today?: boolean;
  className?: string;
}

export interface CalendarDayCellProps extends CellBaseProps {
  /** State de Figma (Default, Hover, Select, Disabled). Hover y Disabled también salen de CSS y `aria-disabled`. */
  state?: CalendarCellState;
}

/** "Number cell (Only day)(Atom)": círculo con el número del día. */
export const CalendarDayCell = forwardRef<HTMLButtonElement, CalendarDayCellProps>(
  ({ state = 'default', today = false, className, children, type = 'button', ...rest }, ref) => (
    <button
      ref={ref}
      type={type}
      data-figma-state={state}
      className={cn(dayCellVariants({ state, today }), className)}
      {...rest}
    >
      <span data-figma-part="00">{children}</span>
    </button>
  )
);
CalendarDayCell.displayName = 'CalendarDayCell';

export interface CalendarRangeCellProps extends CellBaseProps {
  /** State de Figma (8 estados) más `select` y `full-curve`, internos. */
  state?: CalendarRangeCellState;
}

/** "Number cell (Date range)(Atom)": marco con el círculo del día y, según el estado, la banda del rango. */
export const CalendarRangeCell = forwardRef<HTMLButtonElement, CalendarRangeCellProps>(
  ({ state = 'default', today = false, className, children, type = 'button', ...rest }, ref) => {
    const text = <span data-figma-part="00">{children}</span>;
    let inner: ReactNode;

    if (state === 'default' || state === 'hover' || state === 'select' || state === 'disabled') {
      inner = (
        <span data-figma-part="Number Item" className={rangeItemVariants({ state, today })}>
          {text}
        </span>
      );
    } else if (state === 'half-active' || state === 'full-curve') {
      inner = (
        <span data-figma-part="Number Item" className={rangeBandVariants({ state })}>
          {text}
        </span>
      );
    } else {
      // Con círculo: Active firts / Active finish lo llevan púrpura; Left / Right curve, transparente
      const filled = state === 'active-first' || state === 'active-finish';
      const circle = (
        <span data-figma-part="Frame 1984079989" className={rangeCircleVariants({ filled, today })}>
          {text}
        </span>
      );
      const toLeft = state === 'active-finish' || state === 'right-curve';
      inner = (
        <span
          data-figma-part="Number Item"
          className={cn(rangeBandVariants({ state }), toLeft && 'flex-row-reverse justify-start')}
        >
          {circle}
        </span>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        data-figma-state={state}
        className={cn(rangeCellVariants({ state }), className)}
        {...rest}
      >
        {inner}
      </button>
    );
  }
);
CalendarRangeCell.displayName = 'CalendarRangeCell';

export interface CalendarPeriodCellProps extends Omit<CellBaseProps, 'today'> {
  /** `_state` de Figma (Default, Hover, Select, Disabled). */
  state?: CalendarCellState;
  /** Qué dibuja: mes ("Month cell") o año ("Year cell"). Solo cambia el nombre de la parte para Figma. */
  period?: 'month' | 'year';
}

/** "Month cell (Atom)" y "Year cell (Atom)": píldora con el nombre del mes o el año. */
export const CalendarPeriodCell = forwardRef<HTMLButtonElement, CalendarPeriodCellProps>(
  ({ state = 'default', period = 'month', className, children, type = 'button', ...rest }, ref) => (
    <button
      ref={ref}
      type={type}
      data-figma-state={state}
      className={cn(periodCellVariants({ state }), className)}
      {...rest}
    >
      <span data-figma-part={period === 'month' ? 'Month' : 'Year'}>{children}</span>
    </button>
  )
);
CalendarPeriodCell.displayName = 'CalendarPeriodCell';
