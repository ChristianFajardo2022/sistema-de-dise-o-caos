import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentType } from 'react';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Calendar } from './Calendar';
import type { CalendarBaseProps, CalendarCellState, CalendarProps, CalendarRangeCellState, CalendarSingleProps, DateRange } from './Calendar.types';
import { CalendarDayCell, CalendarPeriodCell, CalendarRangeCell } from './CalendarCells';

/** Args de Storybook: props base más la selección, sin la unión por `mode` (los args son parciales). */
type CalendarArgs = CalendarBaseProps & {
  mode?: 'single' | 'range';
  value?: Date | null | DateRange;
  defaultValue?: Date | null | DateRange;
  onChange?: (value: Date | null | DateRange) => void;
};

/** Fechas fijas: las historias y las capturas no dependen del día en que se abren. */
const TODAY = new Date(2026, 9, 23);
const OCTOBER = new Date(2026, 9, 1);

const meta = {
  title: 'Form Controls/Calendar',
  component: Calendar as unknown as ComponentType<CalendarArgs>,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'radio',
      options: ['single', 'range'],
      type: { name: 'enum', value: ['single', 'range'] },
      description: 'Type de Figma: `single` = Only date, `range` = Date range',
    },
    view: {
      control: 'radio',
      options: ['day', 'month', 'year'],
      type: { name: 'enum', value: ['day', 'month', 'year'] },
      description: 'Date de Figma (Day, Month, Year). En `range` indica el campo activo (Mes o Año).',
    },
    locale: { control: 'text', type: { name: 'string' }, description: 'Idioma de los nombres de mes y día (Intl)' },
    weekStartsOn: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5, 6],
      type: { name: 'enum', value: [0, 1, 2, 3, 4, 5, 6] },
      description: 'Primer día de la semana: 0 domingo (Figma), 1 lunes…',
    },
    showOutsideDays: { control: 'boolean', type: { name: 'boolean' }, description: 'Días de los meses vecinos (atenuados)' },
    showActions: { control: 'boolean', type: { name: 'boolean' }, description: 'Pie con Cancelar y Aplicar' },
    minDate: { control: 'date', description: 'Fecha mínima seleccionable' },
    maxDate: { control: 'date', description: 'Fecha máxima seleccionable' },
  },
  args: {
    mode: 'single',
    defaultView: 'day',
    locale: 'es',
    weekStartsOn: 0,
    showOutsideDays: true,
    showActions: false,
    today: TODAY,
    defaultMonth: OCTOBER,
  },
} satisfies Meta<CalendarArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const asProps = (args: CalendarArgs) => args as CalendarProps;

export const Interactive: Story = {
  render: (args) => <Calendar key={args.mode} {...asProps(args)} className="mx-auto" />,
};

export const OnlyDate: Story = {
  args: { defaultValue: new Date(2026, 9, 14), showActions: true },
  render: (args) => <Calendar {...asProps(args)} className="mx-auto" />,
};

export const DateRangeSelection: Story = {
  args: { mode: 'range', defaultValue: { start: new Date(2026, 9, 12), end: new Date(2026, 10, 4) }, showActions: true },
  render: (args) => <Calendar {...asProps(args)} className="mx-auto" />,
};

/** `minDate`, `maxDate` e `isDateDisabled`: los días fuera de límites o bloqueados se atenúan y no se eligen. */
export const DisabledDates: Story = {
  args: {
    minDate: new Date(2026, 9, 8),
    maxDate: new Date(2026, 9, 27),
    isDateDisabled: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
  },
  render: (args) => <Calendar {...asProps(args)} className="mx-auto" />,
};

/** Semana desde el lunes e inglés: nombres de mes y día salen de `Intl`; los textos de la interfaz se pasan en `labels`. */
export const LocaleAndWeekStart: Story = {
  args: {
    locale: 'en',
    weekStartsOn: 1,
    showActions: true,
    labels: {
      calendar: 'Calendar',
      previous: { day: 'Previous month', month: 'Previous year', year: 'Previous years' },
      next: { day: 'Next month', month: 'Next year', year: 'Next years' },
      views: { day: 'Day', month: 'Month', year: 'Year' },
      changeView: 'change view',
      cancel: 'Cancel',
      apply: 'Apply',
    },
  },
  render: (args) => <Calendar {...asProps(args)} className="mx-auto" />,
};

function ControlledDemo(args: CalendarArgs) {
  const [value, setValue] = useState<Date | null>(null);
  const [view, setView] = useState<'day' | 'month' | 'year'>('day');
  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">
      <Calendar {...(asProps({ ...args, mode: 'single' }) as CalendarSingleProps)} value={value} onChange={setValue} view={view} onViewChange={setView} />
      <p className="text-ds-text-neutral-body text-sm">
        Vista: {view} · Elegido: {value ? value.toLocaleDateString('es') : 'ninguno'}
      </p>
    </div>
  );
}

export const Controlled: Story = { render: (args) => <ControlledDemo {...args} /> };

/* ───────────── FigmaMatrix ───────────── */

/*
 * Datos de la matriz: reproducen la muestra de Figma celda por celda con el componente real.
 * - Only date / Day: un mes de 30 días que empieza en miércoles (abril de 2026): 3 días del mes anterior,
 *   30 del mes y 2 del siguiente, sin selección.
 * - Date range: Figma dibuja dos veces el mismo mes (3 + 30 + 2), algo que dos meses seguidos no pueden dar.
 *   Lo más cercano: febrero y marzo de 2034 (los dos empiezan en miércoles y ocupan 5 filas). El 31 de marzo
 *   se deshabilita para que la última fila coincida (en Figma, dos días atenuados). Quedan dos celdas distintas:
 *   en Figma los días 29 y 30 del primer mes, aquí el 1 y el 2 de marzo (mes vecino, atenuados).
 * - Ninguna variante tiene selección ni "hoy" visible (Figma no los dibuja): hoy queda fuera de los meses visibles.
 */
const MATRIX_SINGLE_MONTH = new Date(2026, 3, 1);
const MATRIX_RANGE_MONTH = new Date(2034, 1, 1);
const MATRIX_RANGE_BLOCKED = new Date(2034, 2, 31);
const isMatrixRangeBlocked = (d: Date) => d.getTime() === MATRIX_RANGE_BLOCKED.getTime();

const CALENDAR_VARIANTS = [
  { name: 'Type=Only date, Date=Day', mode: 'single', view: 'day' },
  { name: 'Type=Only date, Date=Month', mode: 'single', view: 'month' },
  { name: 'Type=Only date, Date=Year', mode: 'single', view: 'year' },
  { name: 'Type=Date range, Date=Day', mode: 'range', view: 'day' },
  { name: 'Type=Date range, Date=Month', mode: 'range', view: 'month' },
  { name: 'Type=Date range, Date=Year', mode: 'range', view: 'year' },
] as const;

// Figma: 8098:2263
/**
 * Las 6 variantes del set "Calendar" con el pie visible y los datos de arriba.
 * `Only date` mide 413 de ancho; `Date range` toma 740 de calendar min/max desde la tableta.
 * En `Date range`, Month y Year no cambian el cuerpo (siempre días, como Figma): activan el campo Mes o Año.
 */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-wrap items-start gap-8 bg-ds-background-general-black p-6">
      {CALENDAR_VARIANTS.map((v) =>
        v.mode === 'single' ? (
          <Calendar
            key={v.name}
            data-figma={v.name}
            defaultView={v.view}
            defaultMonth={MATRIX_SINGLE_MONTH}
            today={TODAY}
            showActions
            className="w-[413.33px] max-w-full"
          />
        ) : (
          // El calendario de rango mide 740 como mínimo: si el lienzo es más angosto, se desplaza dentro de su caja
          <div key={v.name} className="max-w-full overflow-x-auto">
            <Calendar
              data-figma={v.name}
              mode="range"
              view={v.view}
              defaultMonth={MATRIX_RANGE_MONTH}
              isDateDisabled={isMatrixRangeBlocked}
              today={TODAY}
              showActions
            />
          </div>
        )
      )}
    </div>
  ),
};

const RANGE_CELLS: [string, CalendarRangeCellState][] = [
  ['State=Default', 'default'],
  ['State=Hover', 'hover'],
  ['State=Active firts', 'active-first'],
  ['State=Half active', 'half-active'],
  ['State=Left curve', 'left-curve'],
  ['State=Right curve', 'right-curve'],
  ['State=Active finish', 'active-finish'],
  ['State=Disabled', 'disabled'],
];

/** Set "Number cell (Date range)(Atom)": 8 estados, cada uno de 56×56. */
export const FigmaMatrixNumberCellRange: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6 bg-ds-background-general-black p-6">
      {RANGE_CELLS.map(([name, state]) => (
        <div key={name} className="w-[56px]">
          <CalendarRangeCell data-figma={name} state={state} >
            00
          </CalendarRangeCell>
        </div>
      ))}
    </div>
  ),
};

const DAY_CELLS: [string, CalendarCellState][] = [
  ['State=Default', 'default'],
  ['State=Hover', 'hover'],
  ['State=Select', 'select'],
  ['State=Disabled', 'disabled'],
];

/** Set "Number cell (Only day)(Atom)": 4 estados, cada uno de 61×61. */
export const FigmaMatrixNumberCellDay: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6 bg-ds-background-general-black p-6">
      {DAY_CELLS.map(([name, state]) => (
        <div key={name} className="w-[61px]">
          <CalendarDayCell data-figma={name} state={state} >
            00
          </CalendarDayCell>
        </div>
      ))}
    </div>
  ),
};

const PERIOD_CELLS: [string, CalendarCellState][] = [
  ['_state=Default', 'default'],
  ['_state=Hover', 'hover'],
  ['_state=Select', 'select'],
  ['_state=Disabled', 'disabled'],
];

/** Set "Month cell (Atom)": 4 estados, cada uno de 57×42. */
export const FigmaMatrixMonthCell: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6 bg-ds-background-general-black p-6">
      {PERIOD_CELLS.map(([name, state]) => (
        <div key={name} className="w-[57px]">
          <CalendarPeriodCell data-figma={name} period="month" state={state} >
            Month
          </CalendarPeriodCell>
        </div>
      ))}
    </div>
  ),
};

/** Set "Year cell (Atom)": 4 estados, cada uno de 44×42. */
export const FigmaMatrixYearCell: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6 bg-ds-background-general-black p-6">
      {PERIOD_CELLS.map(([name, state]) => (
        <div key={name} className="w-[44px]">
          <CalendarPeriodCell data-figma={name} period="year" state={state} >
            Year
          </CalendarPeriodCell>
        </div>
      ))}
    </div>
  ),
};

/* ───────────── Tests ───────────── */

/** Test: rol de grilla, nombre accesible de los días, hoy con aria-current y título como región viva. */
export const SemanticsTest: Story = {
  tags: ['!autodocs'],
  args: { defaultMonth: new Date(2026, 10, 1), today: new Date(2026, 10, 3) },
  render: (args) => <Calendar {...asProps(args)} className="mx-auto" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('group', { name: 'Calendario' })).toBeInTheDocument();
    const grid = canvas.getByRole('grid', { name: 'Noviembre de 2026' });
    await expect(within(grid).getAllByRole('columnheader')).toHaveLength(7);
    const today = canvas.getByRole('button', { name: 'martes, 3 de noviembre de 2026' });
    await expect(today).toHaveAttribute('aria-current', 'date');
    await expect(today).toHaveAttribute('tabindex', '0');
    await expect(canvas.getByRole('button', { name: 'miércoles, 4 de noviembre de 2026' })).toHaveAttribute('tabindex', '-1');
    await expect(canvas.getByText('Noviembre de 2026')).toHaveAttribute('aria-live', 'polite');
  },
};

/** Test: flechas, Inicio, Fin, RePág/AvPág (mes), Mayús+RePág (año) y Enter para elegir. */
export const KeyboardTest: Story = {
  tags: ['!autodocs'],
  args: { defaultMonth: new Date(2026, 10, 1), today: new Date(2026, 10, 3), onChange: fn() },
  render: (args) => <Calendar {...asProps(args)} className="mx-auto" />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button', { name: 'martes, 3 de noviembre de 2026' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', { name: 'miércoles, 4 de noviembre de 2026' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('button', { name: 'miércoles, 11 de noviembre de 2026' })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(canvas.getByRole('button', { name: 'domingo, 8 de noviembre de 2026' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('button', { name: 'sábado, 14 de noviembre de 2026' })).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(canvas.getByRole('button', { name: 'sábado, 7 de noviembre de 2026' })).toHaveFocus();
    await userEvent.keyboard('{PageDown}');
    await expect(canvas.getByText('Diciembre de 2026')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'lunes, 7 de diciembre de 2026' })).toHaveFocus();
    await userEvent.keyboard('{Shift>}{PageUp}{/Shift}');
    await expect(canvas.getByText('Diciembre de 2025')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'domingo, 7 de diciembre de 2025' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onChange).toHaveBeenCalledTimes(1);
    const picked = (args.onChange as ReturnType<typeof fn>).mock.calls[0][0] as Date;
    await expect([picked.getFullYear(), picked.getMonth(), picked.getDate()]).toEqual([2025, 11, 7]);
    await expect(canvas.getByRole('button', { name: 'domingo, 7 de diciembre de 2025' }).closest('[role="gridcell"]')).toHaveAttribute(
      'aria-selected',
      'true'
    );
  },
};

/**
 * Test: el chip cambia de vista (día, mes, año); elegir un año lleva a meses y elegir un mes, a días.
 * En meses y años, el marcado como elegido es el de la fecha elegida (`value`), no el mes visible.
 */
export const ViewSwitchTest: Story = {
  tags: ['!autodocs'],
  args: { onViewChange: fn(), defaultValue: new Date(2026, 9, 14) },
  render: (args) => <Calendar {...asProps(args)} className="mx-auto" />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Día, cambiar vista' }));
    await expect(canvas.getByRole('button', { name: 'Mes, cambiar vista' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'octubre de 2026' }).closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('button', { name: 'noviembre de 2026' }).closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'false');
    await userEvent.click(canvas.getByRole('button', { name: 'Mes, cambiar vista' }));
    await expect(canvas.getByText('2020 – 2039')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: '2026' }).closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(canvas.getByRole('button', { name: '2028' }));
    await expect(canvas.getByRole('button', { name: 'Mes, cambiar vista' })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'marzo de 2028' }));
    await expect(canvas.getByText('Marzo de 2028')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Día, cambiar vista' })).toBeInTheDocument();
    await expect(args.onViewChange).toHaveBeenCalledTimes(4);
    // Siguiente mes
    await userEvent.click(canvas.getByRole('button', { name: 'Mes siguiente' }));
    await expect(canvas.getByText('Abril de 2028')).toBeInTheDocument();
  },
};

/** Test: selección de rango en dos clics, tramo con aria-selected y reinicio al tercer clic. */
export const RangeSelectionTest: Story = {
  tags: ['!autodocs'],
  args: { mode: 'range', onChange: fn() },
  render: (args) => <Calendar {...asProps(args)} className="mx-auto" />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const cell = (day: number) => canvas.getByRole('button', { name: new RegExp(`^[^,]+, ${day} de octubre de 2026$`) });
    const onChange = args.onChange as ReturnType<typeof fn>;
    await userEvent.click(cell(12));
    await expect(onChange).toHaveBeenLastCalledWith({ start: new Date(2026, 9, 12), end: null });
    await userEvent.click(cell(16));
    await expect(onChange).toHaveBeenLastCalledWith({ start: new Date(2026, 9, 12), end: new Date(2026, 9, 16) });
    for (const day of [12, 13, 14, 15, 16]) {
      await expect(cell(day).closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'true');
    }
    await expect(cell(17).closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'false');
    await expect(cell(11).closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'false');
    // Un clic anterior al inicio mientras hay fin reinicia el rango
    await userEvent.click(cell(5));
    await expect(onChange).toHaveBeenLastCalledWith({ start: new Date(2026, 9, 5), end: null });
    await expect(cell(13).closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'false');
    // Clic anterior al inicio sin fin: el inicio se mueve
    await userEvent.click(cell(2));
    await expect(onChange).toHaveBeenLastCalledWith({ start: new Date(2026, 9, 2), end: null });
  },
};

/** Test: los días fuera de minDate/maxDate o bloqueados quedan aria-disabled y no cambian la selección. */
export const DisabledDatesTest: Story = {
  tags: ['!autodocs'],
  args: {
    minDate: new Date(2026, 9, 8),
    maxDate: new Date(2026, 9, 27),
    isDateDisabled: (date: Date) => date.getDay() === 0,
    onChange: fn(),
  },
  render: (args) => <Calendar {...asProps(args)} className="mx-auto" />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const onChange = args.onChange as ReturnType<typeof fn>;
    const early = canvas.getByRole('button', { name: 'martes, 6 de octubre de 2026' });
    const sunday = canvas.getByRole('button', { name: 'domingo, 11 de octubre de 2026' });
    const late = canvas.getByRole('button', { name: 'miércoles, 28 de octubre de 2026' });
    for (const el of [early, sunday, late]) {
      await expect(el).toHaveAttribute('aria-disabled', 'true');
      await userEvent.click(el);
    }
    await expect(onChange).not.toHaveBeenCalled();
    await userEvent.click(canvas.getByRole('button', { name: 'lunes, 12 de octubre de 2026' }));
    await expect(onChange).toHaveBeenCalledTimes(1);
  },
};

/** Test: el pie llama onApply con la selección y onCancel. */
export const ActionsTest: Story = {
  tags: ['!autodocs'],
  args: { showActions: true, defaultValue: new Date(2026, 9, 14), onApply: fn(), onCancel: fn() },
  render: (args) => <Calendar {...asProps(args)} className="mx-auto" />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Filtrar' }));
    await expect(args.onApply).toHaveBeenCalledWith(new Date(2026, 9, 14));
    await userEvent.click(canvas.getByRole('button', { name: 'Limpiar' }));
    await expect(args.onCancel).toHaveBeenCalledTimes(1);
  },
};

/** Test: `autoFocus` enfoca el día activo al montar; en `range`, el desplegable Mes abre con el foco en el mes elegido. */
export const FocusTest: Story = {
  tags: ['!autodocs'],
  render: (args) => (
    <div className="flex flex-col gap-6">
      <Calendar today={args.today} autoFocus defaultValue={new Date(2026, 9, 14)} />
      <Calendar today={args.today} mode="range" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getAllByRole('button', { name: 'miércoles, 14 de octubre de 2026' })[0]).toHaveFocus());
    await userEvent.click(canvas.getByRole('button', { name: /^Mes ?octubre/i }));
    const menu = await canvas.findByRole('menu', { name: 'Elegir mes' });
    await waitFor(() => expect(within(menu).getByRole('menuitem', { name: /octubre/i })).toHaveFocus());
  },
};
