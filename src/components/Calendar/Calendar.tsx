import { forwardRef, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ButtonHTMLAttributes, KeyboardEvent } from 'react';
import type { CalendarLabels, CalendarProps, CalendarView, DateRange } from './Calendar.types';
import {
  addDays,
  addMonths,
  addYears,
  clampDate,
  compareDays,
  createFormatters,
  endOfMonth,
  isSameMonth,
  startOfDay,
  startOfMonth,
  yearPageStart,
} from './Calendar.utils';
import { calendarVariants, rangeFieldVariants, viewChipVariants } from './Calendar.variants';
import { DayGrid, PeriodGrid } from './CalendarGrids';
import type { PeriodItem } from './CalendarGrids';
import { Button } from '../Button';
import { DropdownMenu, DropdownMenuItem } from '../DropdownMenu';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';
import { useMediaQuery } from '../../utils/useMediaQuery';

const DEFAULT_LABELS: CalendarLabels = {
  calendar: 'Calendario',
  previous: { day: 'Mes anterior', month: 'Año anterior', year: 'Años anteriores' },
  next: { day: 'Mes siguiente', month: 'Año siguiente', year: 'Años siguientes' },
  views: { day: 'Día', month: 'Mes', year: 'Año' },
  changeView: 'cambiar vista',
  monthField: 'Mes',
  yearField: 'Año',
  monthList: 'Elegir mes',
  yearList: 'Elegir año',
  cancel: 'Limpiar',
  apply: 'Filtrar',
};

const EMPTY_RANGE: DateRange = { start: null, end: null };
/** Nombre del nodo del título en cada vista de `Only date` (Figma). */
const SINGLE_TITLE_PART: Record<CalendarView, string> = { day: 'Date Text', month: 'Month Text Only', year: 'Year Text Only' };
const NEXT_VIEW: Record<CalendarView, CalendarView> = { day: 'month', month: 'year', year: 'day' };
const YEARS_PER_PAGE = 20;
/** Años que ofrece la lista del campo Año cuando no hay minDate/maxDate. */
const YEAR_LIST_SPAN = 50;

/** Desde la tableta (48rem, el mismo corte de tokens.css) `range` muestra dos meses; en móvil, uno. */
const TABLET_QUERY = '(min-width: 48rem)';
const useTabletUp = () => useMediaQuery(TABLET_QUERY, true);

/** Botón anterior/siguiente: instancia de Button secondary xs con solo ícono (icono de 16, como Figma). */
function NavButton({
  direction,
  label,
  disabled,
  onClick,
}: {
  direction: 'prev' | 'next';
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant="secondary"
      size="xs"
      iconOnly
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      // Figma sobrescribe el color del chevron con icon/general/white (en claro, G13 y no el negro del botón).
      // Solo en reposo: hover e inactivo siguen con los tokens del botón
      className={disabled ? undefined : '[--btn-icon:var(--color-ds-icon-general-default)]'}
    >
      {/* El slot de Button dibuja el ícono a 20: el contenedor de 16 lo fija al tamaño de Figma (icon-single xs) */}
      <span data-figma-part="Icon-sizes" className="inline-flex size-4 items-center justify-center">
        <Icon name={direction === 'prev' ? 'chevron-left' : 'chevron-right'} size={16} variant="line" className="size-full" />
      </span>
    </Button>
  );
}

interface RangeFieldProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  value: string;
  active: boolean;
}

/**
 * Campo desplegable del encabezado de `range` ("Input general/Dropdown": etiqueta, valor y chevron).
 * El chevron mide 16 abierto y cerrado (Input general/Dropdown/Default).
 */
const RangeField = forwardRef<HTMLButtonElement, RangeFieldProps>(({ label, value, active, className, ...rest }, ref) => (
  <button ref={ref} type="button" className={cn(rangeFieldVariants({ active }), className)} {...rest}>
    <span className="flex min-w-0 grow flex-col gap-1">
      <span
        data-figma-part="Label"
        className="truncate text-ds-typography-field-size-xs leading-ds-typography-field-line-height-xs text-ds-text-field-label-secondary"
      >
        {label}
      </span>
      <span
        data-figma-part="Placeholder"
        className="truncate text-ds-typography-field-size-sm leading-ds-typography-field-line-height-sm text-ds-text-field-placeholder"
      >
        {value}
      </span>
    </span>
    <Icon
      name="chevron-down"
      size={16}
      variant="line"
      aria-hidden="true"
      data-figma-part="Icon Right"
      className="shrink-0 text-ds-icon-general-default"
    />
  </button>
));
RangeField.displayName = 'RangeField';

/**
 * Calendario en línea (set "Calendar" de Figma): vistas de día, mes y año, selección de una fecha o de un rango,
 * y pie opcional con Cancelar y Aplicar. No incluye el campo ni el popover (eso es el Date picker).
 *
 * Teclado (APG "Date Picker Dialog", grilla): flechas mueven el día, Inicio y Fin van al principio y al final de la
 * semana, RePág y AvPág cambian de mes y Mayús + RePág/AvPág de año. Enter y Espacio eligen. Un solo tabindex 0 en la
 * cuadrícula (roving tabindex). El título del mes visible es una región `aria-live="polite"`.
 */
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>((props, ref) => {
  const {
    mode = 'single',
    value,
    defaultValue,
    onChange,
    view: viewProp,
    defaultView = 'day',
    onViewChange,
    month: monthProp,
    defaultMonth,
    onMonthChange,
    locale = 'es',
    weekStartsOn = 0,
    minDate,
    maxDate,
    isDateDisabled,
    showOutsideDays = true,
    today: todayProp,
    showActions = false,
    onApply,
    onCancel,
    labels: labelsProp,
    autoFocus = false,
    className,
    ...rest
  } = props as Omit<CalendarProps, 'value' | 'defaultValue' | 'onChange' | 'mode'> & {
    mode?: 'single' | 'range';
    value?: Date | null | DateRange;
    defaultValue?: Date | null | DateRange;
    onChange?: (value: Date | null | DateRange) => void;
  };

  const isRange = mode === 'range';
  const uid = useId();
  const titleId = `${uid}-title`;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  const labels: CalendarLabels = {
    ...DEFAULT_LABELS,
    ...labelsProp,
    previous: { ...DEFAULT_LABELS.previous, ...labelsProp?.previous },
    next: { ...DEFAULT_LABELS.next, ...labelsProp?.next },
    views: { ...DEFAULT_LABELS.views, ...labelsProp?.views },
  };
  const fmt = useMemo(() => createFormatters(locale), [locale]);

  // ── Hoy ──
  const [now] = useState(() => new Date());
  const today = startOfDay(todayProp ?? now);

  // ── Selección (controlada o no) ──
  const [innerValue, setInnerValue] = useState<Date | null | DateRange>(defaultValue ?? (isRange ? EMPTY_RANGE : null));
  const current = value !== undefined ? value : innerValue;
  const single = isRange ? null : ((current as Date | null) ?? null);
  const range = isRange ? ((current as DateRange | null) ?? EMPTY_RANGE) : EMPTY_RANGE;
  const commit = (next: Date | null | DateRange) => {
    if (value === undefined) setInnerValue(next);
    onChange?.(next);
  };

  // ── Mes visible ──
  const [innerMonth, setInnerMonth] = useState(() => startOfMonth(defaultMonth ?? (isRange ? range.start : single) ?? today));
  const month = monthProp ? startOfMonth(monthProp) : innerMonth;
  const setMonth = (next: Date) => {
    const first = startOfMonth(next);
    if (monthProp === undefined) setInnerMonth(first);
    onMonthChange?.(first);
  };

  // ── Vista ──
  const [innerView, setInnerView] = useState<CalendarView>(defaultView);
  const view = viewProp ?? innerView;
  const setView = (next: CalendarView) => {
    if (viewProp === undefined) setInnerView(next);
    onViewChange?.(next);
  };

  // ── Paneles de días ──
  const wide = useTabletUp();
  const panels = isRange && wide ? [month, addMonths(month, 1)] : [month];
  const inPanels = (d: Date) => panels.some((p) => isSameMonth(p, d));

  // ── Foco de la grilla (roving tabindex) ──
  const [focusDate, setFocusDate] = useState<Date | null>(null);
  const pendingFocus = useRef(false);
  const selectedAnchor = isRange ? range.start : single;
  const rovingDate =
    focusDate && inPanels(focusDate)
      ? focusDate
      : selectedAnchor && inPanels(selectedAnchor)
        ? selectedAnchor
        : inPanels(today)
          ? today
          : startOfMonth(month);

  const focusRoving = () => rootRef.current?.querySelector<HTMLElement>('[data-cal-cell][tabindex="0"]')?.focus();

  useLayoutEffect(() => {
    if (!pendingFocus.current) return;
    pendingFocus.current = false;
    focusRoving();
  });

  // autoFocus: el día activo (elegido, hoy o el primero del mes) recibe el foco al montar. Va en un efecto pasivo para
  // que corra después de que un popover contenedor se coloque y se haga visible (DatePicker).
  useEffect(() => {
    if (autoFocus) focusRoving();
    // Solo al montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moveDayFocus = (date: Date) => {
    const target = clampDate(startOfDay(date), minDate, maxDate);
    setFocusDate(target);
    if (!inPanels(target)) {
      if (compareDays(target, panels[0]) < 0) setMonth(target);
      else setMonth(addMonths(target, -(panels.length - 1)));
    }
    pendingFocus.current = true;
  };

  const isDayDisabled = (d: Date) =>
    (!!minDate && compareDays(d, minDate) < 0) || (!!maxDate && compareDays(d, maxDate) > 0) || !!isDateDisabled?.(d);

  const [previewDate, setPreviewDate] = useState<Date | null>(null);

  const selectDay = (date: Date) => {
    if (isDayDisabled(date)) return;
    setFocusDate(date);
    if (!isRange) {
      commit(date);
      return;
    }
    const { start, end } = range;
    if (!start || end || compareDays(date, start) < 0) commit({ start: date, end: null });
    else commit({ start, end: date });
  };

  const handleDayKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const base = rovingDate;
    const weekStart = addDays(base, -((base.getDay() - weekStartsOn + 7) % 7));
    let next: Date | null = null;
    switch (event.key) {
      case 'ArrowLeft':
        next = addDays(base, -1);
        break;
      case 'ArrowRight':
        next = addDays(base, 1);
        break;
      case 'ArrowUp':
        next = addDays(base, -7);
        break;
      case 'ArrowDown':
        next = addDays(base, 7);
        break;
      case 'Home':
        next = weekStart;
        break;
      case 'End':
        next = addDays(weekStart, 6);
        break;
      case 'PageUp':
        next = event.shiftKey ? addYears(base, -1) : addMonths(base, -1);
        break;
      case 'PageDown':
        next = event.shiftKey ? addYears(base, 1) : addMonths(base, 1);
        break;
    }
    if (!next) return;
    event.preventDefault();
    moveDayFocus(next);
  };

  // ── Meses y años (single): el mes visible es el elemento activo, así las flechas lo cambian en vivo ──
  const monthDisabled = (y: number, m: number) =>
    (!!minDate && compareDays(endOfMonth(new Date(y, m, 1)), minDate) < 0) || (!!maxDate && compareDays(new Date(y, m, 1), maxDate) > 0);
  const yearDisabled = (y: number) =>
    (!!minDate && y < minDate.getFullYear()) || (!!maxDate && y > maxDate.getFullYear());

  const goToMonth = (next: Date) => {
    if (monthDisabled(next.getFullYear(), next.getMonth())) return;
    setMonth(next);
    pendingFocus.current = true;
  };
  const goToYear = (next: Date) => {
    if (yearDisabled(next.getFullYear())) return;
    setMonth(next);
    pendingFocus.current = true;
  };

  const handlePeriodKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const isMonths = view === 'month';
    const columns = isMonths ? 3 : 4;
    const pageSize = isMonths ? 12 : YEARS_PER_PAGE;
    const index = isMonths ? month.getMonth() : month.getFullYear() - yearPageStart(month.getFullYear());
    const rowStart = index - (index % columns);
    let delta: number | null = null;
    switch (event.key) {
      case 'ArrowLeft':
        delta = -1;
        break;
      case 'ArrowRight':
        delta = 1;
        break;
      case 'ArrowUp':
        delta = -columns;
        break;
      case 'ArrowDown':
        delta = columns;
        break;
      case 'Home':
        delta = rowStart - index;
        break;
      case 'End':
        delta = rowStart + columns - 1 - index;
        break;
      case 'PageUp':
        delta = -pageSize;
        break;
      case 'PageDown':
        delta = pageSize;
        break;
    }
    if (delta === null) return;
    event.preventDefault();
    if (isMonths) goToMonth(addMonths(month, delta));
    else goToYear(addYears(month, delta));
  };

  // ── Encabezado ──
  const pageStart = yearPageStart(month.getFullYear());
  const first = panels[0];
  const last = panels[panels.length - 1];
  const title =
    view === 'year' && !isRange
      ? `${fmt.yearText(pageStart)} – ${fmt.yearText(pageStart + YEARS_PER_PAGE - 1)}`
      : view === 'month' && !isRange
        ? fmt.yearText(month.getFullYear())
        : panels.length === 2
          ? first.getFullYear() === last.getFullYear()
            ? `${fmt.monthName(first.getMonth())} – ${fmt.monthTitle(last)}`
            : `${fmt.monthTitle(first)} – ${fmt.monthTitle(last)}`
          : fmt.monthTitle(month);

  const navView: CalendarView = isRange ? 'day' : view;
  const periodBefore =
    navView === 'day'
      ? addDays(startOfMonth(first), -1)
      : navView === 'month'
        ? new Date(month.getFullYear() - 1, 11, 31)
        : new Date(pageStart - 1, 11, 31);
  const periodAfter =
    navView === 'day'
      ? addMonths(startOfMonth(last), 1)
      : navView === 'month'
        ? new Date(month.getFullYear() + 1, 0, 1)
        : new Date(pageStart + YEARS_PER_PAGE, 0, 1);
  const prevDisabled = !!minDate && compareDays(periodBefore, minDate) < 0;
  const nextDisabled = !!maxDate && compareDays(periodAfter, maxDate) > 0;
  const goPrev = () => setMonth(navView === 'day' ? addMonths(month, -1) : addYears(month, navView === 'month' ? -1 : -YEARS_PER_PAGE));
  const goNext = () => setMonth(navView === 'day' ? addMonths(month, 1) : addYears(month, navView === 'month' ? 1 : YEARS_PER_PAGE));

  const prevButton = <NavButton direction="prev" label={labels.previous[navView]} disabled={prevDisabled} onClick={goPrev} />;
  const nextButton = <NavButton direction="next" label={labels.next[navView]} disabled={nextDisabled} onClick={goNext} />;
  // Región viva: al cambiar de mes, año o página el lector anuncia el nuevo título
  const titleNode = (className: string, part: string) => (
    <div id={titleId} aria-live="polite" aria-atomic="true" data-figma-part={part} className={className}>
      {title}
    </div>
  );

  // ── Cuadrículas ──
  const dayGrid = (panel: Date, labelled: boolean) => (
    <DayGrid
      key={panel.getTime()}
      month={panel}
      weekStartsOn={weekStartsOn}
      fmt={fmt}
      mode={isRange ? 'range' : 'single'}
      ariaLabelledBy={labelled ? titleId : undefined}
      ariaLabel={labelled ? undefined : fmt.monthTitle(panel)}
      today={today}
      rovingDate={rovingDate}
      selected={single}
      range={range}
      previewDate={previewDate}
      isDisabled={isDayDisabled}
      showOutsideDays={showOutsideDays}
      onSelect={selectDay}
      onPreview={setPreviewDate}
      onKeyDown={handleDayKeyDown}
    />
  );

  const monthItems: PeriodItem[] = Array.from({ length: 12 }, (_, m) => ({
    key: m,
    text: fmt.monthName(m),
    label: fmt.monthLabel(new Date(month.getFullYear(), m, 1)),
    selected: !!single && single.getFullYear() === month.getFullYear() && single.getMonth() === m,
    disabled: monthDisabled(month.getFullYear(), m),
    roving: m === month.getMonth(),
  }));
  const yearItems: PeriodItem[] = Array.from({ length: YEARS_PER_PAGE }, (_, i) => {
    const y = pageStart + i;
    return {
      key: y,
      text: fmt.yearText(y),
      label: fmt.yearText(y),
      selected: !!single && single.getFullYear() === y,
      disabled: yearDisabled(y),
      roving: y === month.getFullYear(),
    };
  });

  let body;
  if (!isRange) {
    const header = (
      <div className="flex items-center gap-3">
        <div className="flex min-w-0 grow items-center gap-1">
          <Icon
            name="calendar"
            size={16}
            variant="fill"
            aria-hidden="true"
            data-figma-part="Icon-sizes"
            className="shrink-0 text-ds-icon-acent-secondary"
          />
          {titleNode(
            'min-w-0 truncate text-ds-typography-field-size-md leading-ds-typography-field-line-height-md text-ds-text-neutral-white',
            SINGLE_TITLE_PART[view]
          )}
        </div>
        <div className="flex items-center gap-2">
          {prevButton}
          {/* "Chips/Secondary/Default/off" en Figma: no existe en la biblioteca, va como marcador interno */}
          <button
            type="button"
            className={viewChipVariants()}
            aria-label={`${labels.views[view]}, ${labels.changeView}`}
            onClick={() => setView(NEXT_VIEW[view])}
          >
            <span className="flex h-ds-dimention-button-container-xs items-center">
              <span data-figma-part="Text">{labels.views[view]}</span>
            </span>
          </button>
          {nextButton}
        </div>
      </div>
    );
    body = (
      <div className="flex flex-col gap-6">
        {header}
        {view === 'day' && dayGrid(month, true)}
        {view === 'month' && (
          <PeriodGrid
            period="month"
            items={monthItems}
            columns={3}
            ariaLabelledBy={titleId}
            onSelect={(m) => {
              goToMonth(new Date(month.getFullYear(), m, 1));
              setView('day');
            }}
            onKeyDown={handlePeriodKeyDown}
          />
        )}
        {view === 'year' && (
          <PeriodGrid
            period="year"
            items={yearItems}
            columns={4}
            ariaLabelledBy={titleId}
            onSelect={(y) => {
              goToYear(new Date(y, month.getMonth(), 1));
              setView('month');
            }}
            onKeyDown={handlePeriodKeyDown}
          />
        )}
      </div>
    );
  } else {
    const minYear = minDate?.getFullYear() ?? month.getFullYear() - YEAR_LIST_SPAN;
    const maxYear = maxDate?.getFullYear() ?? month.getFullYear() + YEAR_LIST_SPAN;
    const years = Array.from({ length: Math.max(0, maxYear - minYear + 1) }, (_, i) => minYear + i);
    body = (
      <div className="flex flex-col gap-6">
        <div className="flex items-stretch gap-3">
          <DropdownMenu
            align="start"
            aria-label={labels.monthList}
            maxHeight="16rem"
            scrollbar={false}
            onOpenChange={(open) => setView(open ? 'month' : 'day')}
            trigger={
              <RangeField
                label={labels.monthField}
                value={fmt.monthName(month.getMonth())}
                active={view === 'month'}
                className="grow-[396] basis-0"
              />
            }
          >
            {Array.from({ length: 12 }, (_, m) => (
              <DropdownMenuItem
                key={m}
                selected={m === month.getMonth()}
                disabled={monthDisabled(month.getFullYear(), m)}
                onSelect={() => setMonth(new Date(month.getFullYear(), m, 1))}
              >
                {fmt.monthName(m)}
              </DropdownMenuItem>
            ))}
          </DropdownMenu>
          <DropdownMenu
            align="start"
            aria-label={labels.yearList}
            maxHeight="16rem"
            scrollbar={false}
            onOpenChange={(open) => setView(open ? 'year' : 'day')}
            trigger={
              <RangeField
                label={labels.yearField}
                value={fmt.yearText(month.getFullYear())}
                active={view === 'year'}
                className="grow-[300] basis-0"
              />
            }
          >
            {years.map((y) => (
              <DropdownMenuItem
                key={y}
                selected={y === month.getFullYear()}
                onSelect={() => setMonth(new Date(y, month.getMonth(), 1))}
              >
                {fmt.yearText(y)}
              </DropdownMenuItem>
            ))}
          </DropdownMenu>
        </div>
        <div className="flex items-center justify-end gap-2">
          {prevButton}
          {titleNode(
            'text-ds-typography-body-size-lg leading-ds-typography-body-line-height-large-lg text-ds-text-neutral-white',
            'Date Range Button Text'
          )}
          {nextButton}
        </div>
        <div className="flex gap-4">
          {panels.map((panel, i) => (
            <div key={panel.getTime()} className="contents">
              {i > 0 && (
                <div aria-hidden="true" className="relative w-0 self-stretch">
                  <span className="absolute inset-y-0 left-0 w-px -translate-x-1/2 bg-ds-border-general-default-on-card" />
                </div>
              )}
              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <div
                  aria-hidden="true"
                  data-figma-part="Date Range Text"
                  className="text-ds-typography-field-size-sm leading-ds-typography-field-line-height-sm text-ds-text-neutral-white"
                >
                  {fmt.monthTitle(panel)}
                </div>
                {dayGrid(panel, false)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setRootRef}
      role="group"
      aria-label={labels.calendar}
      data-mode={mode}
      data-view={view}
      className={cn(calendarVariants({ mode: isRange ? 'range' : 'single' }), className)}
      {...rest}
    >
      {body}
      {showActions && (
        <div className="flex justify-end gap-2 max-tablet:flex-col-reverse">
          <Button variant="secondary" contrast="high" size="sm" onClick={() => onCancel?.()}>
            <span data-figma-part="Button">{labels.cancel}</span>
          </Button>
          <Button variant="primary" size="sm" onClick={() => onApply?.(isRange ? range : single)}>
            <span data-figma-part="Button">{labels.apply}</span>
          </Button>
        </div>
      )}
    </div>
  );
});

Calendar.displayName = 'Calendar';
