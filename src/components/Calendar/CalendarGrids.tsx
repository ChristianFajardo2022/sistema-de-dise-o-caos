import type { KeyboardEventHandler } from 'react';
import type { CalendarRangeCellState, DateRange } from './Calendar.types';
import type { CalendarFormatters } from './Calendar.utils';
import { buildMonthWeeks, compareDays, daysInMonth, isSameDay } from './Calendar.utils';
import { CalendarDayCell, CalendarPeriodCell, CalendarRangeCell } from './CalendarCells';
import { dayCellVariants, rangeCellVariants, rangeItemVariants } from './Calendar.variants';
import { cn } from '../../utils/cn';

/** Cuadrículas internas del Calendar (días, meses y años). Patrón APG "Date Picker Dialog", parte de la grilla. */

interface DayGridProps {
  /** Mes que dibuja esta cuadrícula. */
  month: Date;
  weekStartsOn: number;
  fmt: CalendarFormatters;
  /** `range` usa columnas sin separación (la banda es continua) y 4 de separación entre filas. */
  mode: 'single' | 'range';
  ariaLabel?: string;
  ariaLabelledBy?: string;
  today: Date;
  /** Día que recibe el tabindex 0 (roving tabindex). */
  rovingDate: Date;
  selected: Date | null;
  range: DateRange;
  /** Fecha bajo el puntero o el foco: dibuja el tramo provisional mientras falta el fin. */
  previewDate: Date | null;
  isDisabled: (date: Date) => boolean;
  showOutsideDays: boolean;
  onSelect: (date: Date) => void;
  onPreview: (date: Date | null) => void;
  onKeyDown: KeyboardEventHandler<HTMLDivElement>;
}

/** Nombre del nodo de Figma de cada encabezado de día (por día de la semana, 0 = domingo). */
const WEEKDAY_PARTS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
  (d) => `Date Range ${d} Right`
);

/** Estado de una celda del rango según su posición respecto al inicio y al fin (o a la vista previa). */
function rangeState(
  date: Date,
  { range, previewDate, weekStartsOn, disabled }: { range: DateRange; previewDate: Date | null; weekStartsOn: number; disabled: boolean }
): CalendarRangeCellState {
  const start = range.start;
  const end = range.end ?? (start && previewDate && compareDays(previewDate, start) > 0 ? previewDate : null);
  if (start && isSameDay(date, start)) return end ? 'active-first' : 'select';
  if (end && isSameDay(date, end)) return 'active-finish';
  if (start && end && compareDays(date, start) > 0 && compareDays(date, end) < 0) {
    const dow = date.getDay();
    const left = dow === weekStartsOn || date.getDate() === 1;
    const right = dow === (weekStartsOn + 6) % 7 || date.getDate() === daysInMonth(date.getFullYear(), date.getMonth());
    if (left && right) return 'full-curve';
    if (left) return 'left-curve';
    if (right) return 'right-curve';
    return 'half-active';
  }
  return disabled ? 'disabled' : 'default';
}

export function DayGrid({
  month,
  weekStartsOn,
  fmt,
  mode,
  ariaLabel,
  ariaLabelledBy,
  today,
  rovingDate,
  selected,
  range,
  previewDate,
  isDisabled,
  showOutsideDays,
  onSelect,
  onPreview,
  onKeyDown,
}: DayGridProps) {
  const weeks = buildMonthWeeks(month, weekStartsOn);
  const dows = Array.from({ length: 7 }, (_, i) => (weekStartsOn + i) % 7);
  const isRange = mode === 'range';
  const colGap = isRange ? 'gap-x-0' : 'gap-x-2';

  return (
    <div
      role="grid"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className="flex flex-col gap-2"
      onKeyDown={onKeyDown}
      onPointerLeave={() => onPreview(null)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onPreview(null);
      }}
    >
      <div role="row" className={cn('grid grid-cols-7', colGap)}>
        {dows.map((dow) => (
          <div
            key={dow}
            role="columnheader"
            aria-label={fmt.weekdayLong(dow)}
            data-figma-part={WEEKDAY_PARTS[dow]}
            className={cn(
              'text-center text-ds-typography-field-size-xs leading-ds-typography-field-line-height-xs',
              // Token de tema en ambos modos (en light el primitivo G08 daba 2,16:1). Figma enlaza el primitivo en Only date: para diseño
              'text-ds-text-neutral-gray-2'
            )}
          >
            {fmt.weekdayShort(dow)}
          </div>
        ))}
      </div>
      <div role="rowgroup" className={cn('flex flex-col', isRange ? 'gap-y-1' : 'gap-y-2')}>
        {weeks.map((week) => (
          <div key={week[0].getTime()} role="row" className={cn('grid grid-cols-7', colGap)}>
            {week.map((date) => {
              if (date.getMonth() !== month.getMonth()) {
                // Día de un mes vecino: celda Disabled de Figma, atenuada, no se elige y no se anuncia
                const text = <span data-figma-part="00">{fmt.dayNumber(date)}</span>;
                return (
                  <div key={date.getTime()} role="gridcell" aria-hidden="true">
                    {!showOutsideDays ? (
                      <span className="block aspect-square w-full" />
                    ) : isRange ? (
                      <span className={cn(rangeCellVariants({ state: 'disabled' }), 'cursor-default')}>
                        <span className={rangeItemVariants({ state: 'disabled' })}>{text}</span>
                      </span>
                    ) : (
                      <span className={cn(dayCellVariants({ state: 'disabled' }), 'cursor-default')}>{text}</span>
                    )}
                  </div>
                );
              }
              const disabled = isDisabled(date);
              const isToday = isSameDay(date, today);
              const common = {
                'data-cal-cell': '',
                'data-date': date.getTime(),
                tabIndex: isSameDay(date, rovingDate) ? 0 : -1,
                'aria-label': fmt.dayLabel(date),
                'aria-current': isToday ? ('date' as const) : undefined,
                'aria-disabled': disabled || undefined,
                today: isToday,
                onClick: () => onSelect(date),
                onPointerEnter: () => !disabled && onPreview(date),
                onFocus: () => onPreview(date),
              };
              if (isRange) {
                const state = rangeState(date, { range, previewDate, weekStartsOn, disabled });
                const inRange = state !== 'default' && state !== 'disabled';
                return (
                  <div key={date.getTime()} role="gridcell" aria-selected={inRange}>
                    <CalendarRangeCell state={state} {...common}>
                      {fmt.dayNumber(date)}
                    </CalendarRangeCell>
                  </div>
                );
              }
              const isSelected = !!selected && isSameDay(date, selected);
              return (
                <div key={date.getTime()} role="gridcell" aria-selected={isSelected}>
                  <CalendarDayCell state={isSelected ? 'select' : disabled ? 'disabled' : 'default'} {...common}>
                    {fmt.dayNumber(date)}
                  </CalendarDayCell>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export interface PeriodItem {
  key: number;
  text: string;
  label: string;
  selected: boolean;
  disabled: boolean;
  roving: boolean;
}

interface PeriodGridProps {
  period: 'month' | 'year';
  items: PeriodItem[];
  /** Columnas: 3 meses por fila, 4 años por fila. */
  columns: 3 | 4;
  ariaLabelledBy?: string;
  onSelect: (key: number) => void;
  onKeyDown: KeyboardEventHandler<HTMLDivElement>;
}

/** Cuadrícula de meses (3×4) o de años (4×5), con la misma semántica de grilla y roving tabindex que los días. */
export function PeriodGrid({ period, items, columns, ariaLabelledBy, onSelect, onKeyDown }: PeriodGridProps) {
  const rows: PeriodItem[][] = [];
  for (let i = 0; i < items.length; i += columns) rows.push(items.slice(i, i + columns));
  return (
    <div role="grid" aria-labelledby={ariaLabelledBy} className="flex flex-col gap-2" onKeyDown={onKeyDown}>
      {rows.map((row) => (
        <div
          key={row[0].key}
          role="row"
          className={cn('grid gap-2', columns === 3 ? 'grid-cols-3' : 'grid-cols-4')}
        >
          {row.map((item) => (
            <div key={item.key} role="gridcell" aria-selected={item.selected}>
              <CalendarPeriodCell
                period={period}
                className={period === 'month' ? 'text-ds-typography-field-size-xs' : undefined}
                state={item.selected ? 'select' : item.disabled ? 'disabled' : 'default'}
                data-cal-cell=""
                tabIndex={item.roving ? 0 : -1}
                aria-label={item.label}
                aria-disabled={item.disabled || undefined}
                onClick={() => onSelect(item.key)}
              >
                {item.text}
              </CalendarPeriodCell>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
