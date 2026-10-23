import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef, useState, type ComponentType } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { DatePicker } from './DatePicker';
import type { DatePickerBaseProps, DatePickerProps, DatePickerState } from './DatePicker.types';
import type { DateRange } from '../Calendar';

/** Args de Storybook: props base más la selección, sin la unión por `mode`. */
type DatePickerArgs = DatePickerBaseProps & {
  mode?: 'single' | 'range';
  value?: Date | null | DateRange;
  defaultValue?: Date | null | DateRange;
  onChange?: (value: Date | null | DateRange) => void;
};

/** Fechas fijas: las historias, los tests y las capturas no dependen del día en que se abren. */
const TODAY = new Date(2026, 9, 23);
const SAMPLE = new Date(2026, 9, 14);
/** Mes del calendario abierto en la matriz (el mismo de la matriz de Calendar). */
const MATRIX_MONTH = new Date(2026, 3, 1);

const STATES: DatePickerState[] = ['default', 'filled', 'active', 'burnt-in', 'disabled', 'error', 'success'];

const meta = {
  title: 'Form Controls/DatePicker',
  component: DatePicker as unknown as ComponentType<DatePickerArgs>,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'radio',
      options: ['single', 'range'],
      type: { name: 'enum', value: ['single', 'range'] },
      description: 'Una fecha o un rango ("dd/mm/aaaa – dd/mm/aaaa")',
    },
    state: {
      control: 'select',
      options: STATES,
      type: { name: 'enum', value: STATES },
      description: 'State forzado (solo documentación); `active` dibuja el calendario abierto en el flujo',
    },
    label: { control: 'text', type: { name: 'string', required: true }, description: 'Label flotante' },
    placeholder: { control: 'text', type: { name: 'string' }, description: 'Por defecto, la pista del idioma (dd/mm/aaaa)' },
    locale: { control: 'text', type: { name: 'string' }, description: 'Idioma del formato y del calendario' },
    helperText: { control: 'text', type: { name: 'string' }, description: 'Mensaje de ayuda' },
    errorText: { control: 'text', type: { name: 'string' }, description: 'Mensaje de error' },
    successText: { control: 'text', type: { name: 'string' }, description: 'Mensaje de éxito' },
    optional: { control: 'boolean', type: { name: 'boolean' }, description: 'Agrega " | Opcional"' },
    showActions: { control: 'boolean', type: { name: 'boolean' }, description: 'Pie con Cancelar y Aplicar' },
    disabled: { control: 'boolean', type: { name: 'boolean' }, description: 'Deshabilitado' },
    readOnly: { control: 'boolean', type: { name: 'boolean' }, description: 'Burnt-In (solo lectura)' },
    fullWidth: { control: 'boolean', type: { name: 'boolean' }, description: 'Ocupa el 100 % del contenedor' },
    minDate: { control: 'date', description: 'Fecha mínima' },
    maxDate: { control: 'date', description: 'Fecha máxima' },
  },
  args: {
    label: 'Fecha de entrega',
    mode: 'single',
    state: 'default',
    locale: 'es',
    showActions: true,
    optional: false,
    disabled: false,
    readOnly: false,
    fullWidth: false,
    calendarProps: { today: TODAY },
  },
} satisfies Meta<DatePickerArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const asProps = (args: DatePickerArgs) => args as DatePickerProps;

export const Interactive: Story = {
  render: (args) => (
    <div className="min-h-[640px]">
      <DatePicker key={args.mode} {...asProps(args)} />
    </div>
  ),
};

/** Rango: el texto es "dd/mm/aaaa – dd/mm/aaaa" y el calendario muestra dos meses desde la tableta. */
export const Range: Story = {
  args: { mode: 'range', label: 'Periodo', defaultValue: { start: new Date(2026, 9, 12), end: new Date(2026, 10, 4) } },
  render: (args) => (
    <div className="min-h-[640px]">
      <DatePicker {...asProps(args)} />
    </div>
  ),
};

/** Con límites: lo escrito fuera de `minDate`/`maxDate` muestra "Esa fecha no está disponible". */
export const WithLimits: Story = {
  args: {
    label: 'Fecha de la cita',
    minDate: new Date(2026, 9, 5),
    maxDate: new Date(2026, 10, 20),
    isDateDisabled: (d: Date) => d.getDay() === 0,
    helperText: 'Entre el 5 de octubre y el 20 de noviembre, sin domingos',
  },
  render: (args) => (
    <div className="min-h-[640px]">
      <DatePicker {...asProps(args)} />
    </div>
  ),
};

/**
 * Los 8 estados del set "Date picker" (8096:3344). Active/Focus dibuja el calendario abierto en el flujo
 * (8 por debajo y alineado a la derecha del campo), con fecha fija.
 */
const MATRIX: { name: string; props: Partial<DatePickerArgs> }[] = [
  { name: 'State=Dafault', props: {} },
  { name: 'State=Filled', props: { state: 'filled', defaultValue: SAMPLE } },
  { name: 'State=Burnt-In', props: { readOnly: true, defaultValue: SAMPLE } },
  { name: 'State=Disabled', props: { disabled: true } },
  { name: 'State=Error', props: { state: 'error', defaultValue: SAMPLE, errorText: 'Error text' } },
  { name: 'State=Success', props: { state: 'success', defaultValue: SAMPLE, successText: 'Confirmation text' } },
  { name: 'State=Helper text', props: { state: 'filled', defaultValue: SAMPLE, helperText: 'Helper text' } },
  { name: 'State=Active/Focus', props: { state: 'active', calendarProps: { today: TODAY, defaultMonth: MATRIX_MONTH } } },
];

export const FigmaMatrix: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-x-8 gap-y-10 bg-ds-background-general-black p-6">
      {MATRIX.map(({ name, props }) => (
        <div key={name} className={name === 'State=Active/Focus' ? 'w-[495.38px] pb-[530px]' : 'w-[495.38px]'}>
          <span className="mb-2 block text-ds-typography-body-size-xs leading-ds-typography-body-line-height-short-xs text-ds-text-neutral-gray-2">
            {name}
          </span>
          <DatePicker
            data-figma={name}
            fullWidth
            calendarProps={{ today: TODAY }}
            {...asProps({ ...props, label: 'Label' } as DatePickerArgs)}
          />
        </div>
      ))}
    </div>
  ),
};

// ───────────────────────── Tests ─────────────────────────

/** Test: escribir la fecha con la máscara la aplica y el botón anuncia la fecha */
export const TypeDateTest: Story = {
  tags: ['!autodocs'],
  args: { onChange: fn(), name: 'entrega' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Fecha de entrega' });
    await userEvent.type(input, '14102026');
    await expect(input).toHaveValue('14/10/2026');
    await expect(args.onChange).toHaveBeenLastCalledWith(new Date(2026, 9, 14));
    await expect(canvas.getByRole('button', { name: 'Elegir fecha, miércoles, 14 de octubre de 2026' })).toBeVisible();
    await expect(canvasElement.querySelector('input[type="hidden"][name="entrega"]')).toHaveValue('2026-10-14');
    // Un separador escrito antes de tiempo completa con cero
    await userEvent.clear(input);
    await userEvent.type(input, '3/1/2027');
    await expect(input).toHaveValue('03/01/2027');
  },
};

/**
 * Test: una fecha imposible marca error al salir del campo; una fuera de límites, "no disponible". El error se anuncia
 * por la región viva común de los campos (`aria-live="polite"`, sin `role="alert"`) y describe el campo.
 */
export const InvalidDateTest: Story = {
  tags: ['!autodocs'],
  args: { maxDate: new Date(2026, 11, 31) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Fecha de entrega' });
    await userEvent.type(input, '31022026');
    await userEvent.tab();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(canvas.queryByRole('alert')).toBeNull();
    await expect(input).toHaveAccessibleDescription(expect.stringContaining('Escribe una fecha válida (dd/mm/aaaa)'));
    const region = canvasElement.querySelector('[aria-live="polite"]');
    await expect(region).toHaveTextContent('Escribe una fecha válida (dd/mm/aaaa)');
    await userEvent.clear(input);
    await userEvent.type(input, '15012027');
    await userEvent.tab();
    await expect(region).toHaveTextContent('Esa fecha no está disponible');
    await userEvent.clear(input);
    await userEvent.type(input, '15122026');
    await userEvent.tab();
    await expect(input).not.toHaveAttribute('aria-invalid');
  },
};

/** Test: abrir con teclado, foco en hoy, elegir con flechas y Aplicar */
export const KeyboardSelectTest: Story = {
  tags: ['!autodocs'],
  args: { onChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Elegir fecha' });
    await expect(button).toHaveAttribute('aria-haspopup', 'dialog');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    button.focus();
    await userEvent.keyboard('{Enter}');
    const dialog = await canvas.findByRole('dialog');
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    // Sin fecha, el foco va a hoy
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'viernes, 23 de octubre de 2026' })).toHaveFocus());
    await userEvent.keyboard('{ArrowRight}{ArrowDown}');
    await expect(within(dialog).getByRole('button', { name: 'sábado, 31 de octubre de 2026' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    // Elegir no aplica todavía (hay pie de acciones)
    await expect(args.onChange).not.toHaveBeenCalled();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Aplicar' }));
    await expect(args.onChange).toHaveBeenLastCalledWith(new Date(2026, 9, 31));
    await waitFor(() => expect(dialog).not.toBeVisible());
    await expect(canvas.getByRole('textbox', { name: 'Fecha de entrega' })).toHaveValue('31/10/2026');
    const changed = canvas.getByRole('button', { name: 'Elegir fecha, sábado, 31 de octubre de 2026' });
    await expect(changed).toHaveFocus();
    // Al reabrir, el foco va al día elegido
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'sábado, 31 de octubre de 2026' })).toHaveFocus());
  },
};

/** Test: Esc cierra sin aplicar y devuelve el foco al botón */
export const EscapeTest: Story = {
  tags: ['!autodocs'],
  args: { onChange: fn(), defaultValue: SAMPLE },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Elegir fecha, miércoles, 14 de octubre de 2026' });
    await userEvent.click(button);
    const dialog = await canvas.findByRole('dialog');
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'miércoles, 14 de octubre de 2026' })).toHaveFocus());
    await userEvent.keyboard('{ArrowLeft}{Enter}{Escape}');
    await waitFor(() => expect(dialog).not.toBeVisible());
    await expect(button).toHaveFocus();
    await expect(args.onChange).not.toHaveBeenCalled();
    await expect(canvas.getByRole('textbox', { name: 'Fecha de entrega' })).toHaveValue('14/10/2026');
    // Alt + Flecha abajo en el campo también abre
    await userEvent.click(canvas.getByRole('textbox', { name: 'Fecha de entrega' }));
    await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.click(within(dialog).getByRole('button', { name: 'Cancelar' }));
    await waitFor(() => expect(dialog).not.toBeVisible());
    await expect(button).toHaveFocus();
  },
};

/** Test: rango sin pie de acciones (se aplica al elegir el fin) y rango escrito */
export const RangeTest: Story = {
  tags: ['!autodocs'],
  args: { mode: 'range', label: 'Periodo', showActions: false, onChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Elegir fechas' });
    await userEvent.click(button);
    const dialog = await canvas.findByRole('dialog');
    await waitFor(() => expect(dialog).toBeVisible());
    // Esc en el desplegable Mes cierra solo el desplegable; el segundo Esc cierra el calendario y vuelve al botón
    await userEvent.click(within(dialog).getByRole('button', { name: /^Mes\s*Octubre/ }));
    await waitFor(() => expect(within(dialog).queryAllByRole('menuitemradio').length + within(dialog).queryAllByRole('menuitem').length).toBeGreaterThan(0));
    await userEvent.keyboard('{Escape}');
    await expect(dialog).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(dialog).not.toBeVisible());
    await expect(button).toHaveFocus();
    await userEvent.click(button);
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.click(within(dialog).getAllByRole('button', { name: 'lunes, 12 de octubre de 2026' })[0]);
    await expect(dialog).toBeVisible();
    await userEvent.click(within(dialog).getAllByRole('button', { name: 'martes, 20 de octubre de 2026' })[0]);
    await expect(args.onChange).toHaveBeenLastCalledWith({ start: new Date(2026, 9, 12), end: new Date(2026, 9, 20) });
    await waitFor(() => expect(dialog).not.toBeVisible());
    const input = canvas.getByRole('textbox', { name: 'Periodo' });
    await expect(input).toHaveValue('12/10/2026 – 20/10/2026');
    await userEvent.clear(input);
    await userEvent.type(input, '0111202615112026');
    await expect(input).toHaveValue('01/11/2026 – 15/11/2026');
    await expect(args.onChange).toHaveBeenLastCalledWith({ start: new Date(2026, 10, 1), end: new Date(2026, 10, 15) });
  },
};

/** Test: deshabilitado y solo lectura no abren el calendario */
export const DisabledTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex flex-col gap-6">
      <DatePicker label="Deshabilitado" disabled />
      <DatePicker label="Solo lectura" readOnly defaultValue={SAMPLE} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox', { name: 'Deshabilitado' })).toBeDisabled();
    await expect(canvas.getByRole('textbox', { name: 'Solo lectura' })).toHaveAttribute('readonly');
    for (const b of canvas.getAllByRole('button', { name: /Elegir fecha/ })) await expect(b).toBeDisabled();
  },
};

function DatePickerApiDemo() {
  const ref = useRef<HTMLInputElement>(null);
  const alias = useRef<HTMLInputElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const [log, setLog] = useState('');
  const [refs, setRefs] = useState('');
  useEffect(() => setRefs(`${ref.current?.tagName}|${alias.current === ref.current}|${root.current?.dataset.testid}`), []);
  return (
    <div className="flex flex-col gap-4">
      <DatePicker
        ref={ref}
        inputRef={alias}
        rootProps={{ ref: root, 'data-testid': 'raiz' }}
        label="Fecha de entrega"
        calendarProps={{ today: TODAY }}
        onValueChange={() => setLog((l) => `${l}v`)}
        onChange={() => setLog((l) => `${l}c`)}
      />
      <output data-testid="log">{log}</output>
      <output data-testid="refs">{refs}</output>
    </div>
  );
}

/** API común: `ref` al input (y `inputRef`, obsoleto, recibe el mismo nodo), `rootProps.ref` a la raíz, `onValueChange` y el alias `onChange`. */
export const ApiTest: Story = {
  tags: ['!autodocs'],
  render: () => <DatePickerApiDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('refs')).toHaveTextContent('INPUT|true|raiz');
    await userEvent.type(canvas.getByRole('textbox', { name: 'Fecha de entrega' }), '14102026');
    await expect(canvas.getByTestId('log')).toHaveTextContent('vc');
  },
};
