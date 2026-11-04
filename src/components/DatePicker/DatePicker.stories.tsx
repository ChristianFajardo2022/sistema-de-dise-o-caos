import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef, useState, type ComponentType } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { DatePicker } from './DatePicker';
import type { DatePickerBaseProps, DatePickerProps, DatePickerState } from './DatePicker.types';
import type { DateRange } from '../Calendar';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './DatePicker.doc';
import docsJson from './DatePicker.docs.json';

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

/** Idiomas válidos para Personalizar (texto libre rompe Intl). */
const LOCALES = ['es', 'es-CO', 'en-US'];

const meta = {
  title: 'Form Controls/DatePicker',
  component: DatePicker as unknown as ComponentType<DatePickerArgs>,
  parameters: {
    layout: 'padded',
    // La página Docs usa la plantilla de documentación (DatePicker.doc.tsx) con la referencia de código al final
    docs: componentDocsParameters(doc, docsJson),
    // `open` y `defaultOpen` abren el calendario en la capa superior, fuera del lienzo: sin control en Personalizar (el
    // calendario abierto se ve con `state="active"`). `name` e `id` remiten al formulario o a otros elementos
    docsLive: { exclude: ['open', 'defaultOpen', 'name', 'id'] },
  },
  tags: ['autodocs'],
  // Las descripciones salen de DatePicker.docs.json; aquí solo los controles y los tipos explícitos
  argTypes: argTypesFromDocsJson(docsJson, {
    mode: { control: 'radio', options: ['single', 'range'], type: { name: 'enum', value: ['single', 'range'] } },
    state: { control: 'select', options: STATES, type: { name: 'enum', value: STATES } },
    label: { control: 'text', type: { name: 'string', required: true } },
    placeholder: { control: 'text', type: { name: 'string' } },
    // Con texto libre, una etiqueta de idioma mal escrita rompe Intl (RangeError): solo idiomas válidos (R7)
    locale: { control: 'select', options: LOCALES, type: { name: 'enum', value: LOCALES } },
    helperText: { control: 'text', type: { name: 'string' } },
    errorText: { control: 'text', type: { name: 'string' } },
    successText: { control: 'text', type: { name: 'string' } },
    optional: { control: 'boolean', type: { name: 'boolean' } },
    showActions: { control: 'boolean', type: { name: 'boolean' } },
    disabled: { control: 'boolean', type: { name: 'boolean' } },
    readOnly: { control: 'boolean', type: { name: 'boolean' } },
    required: { control: 'boolean', type: { name: 'boolean' } },
    fullWidth: { control: 'boolean', type: { name: 'boolean' } },
    minDate: { control: 'date' },
    maxDate: { control: 'date' },
  }),
  args: {
    label: 'Fecha de inicio',
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
  // `max-w-full`: en un lienzo angosto el contenedor no crece al ancho del campo (320)
  render: (args) => (
    <div className="min-h-[640px] max-w-full">
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
  args: { onChange: fn(), name: 'inicio' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Fecha de inicio' });
    await userEvent.type(input, '14102026');
    await expect(input).toHaveValue('14/10/2026');
    await expect(args.onChange).toHaveBeenLastCalledWith(new Date(2026, 9, 14));
    await expect(canvas.getByRole('button', { name: 'Elegir fecha, miércoles, 14 de octubre de 2026' })).toBeVisible();
    await expect(canvasElement.querySelector('input[type="hidden"][name="inicio"]')).toHaveValue('2026-10-14');
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
    const input = canvas.getByRole('textbox', { name: 'Fecha de inicio' });
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
    await expect(canvas.getByRole('textbox', { name: 'Fecha de inicio' })).toHaveValue('31/10/2026');
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
    await expect(canvas.getByRole('textbox', { name: 'Fecha de inicio' })).toHaveValue('14/10/2026');
    // Alt + Flecha abajo en el campo también abre
    await userEvent.click(canvas.getByRole('textbox', { name: 'Fecha de inicio' }));
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
        label="Fecha de inicio"
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
    await userEvent.type(canvas.getByRole('textbox', { name: 'Fecha de inicio' }), '14102026');
    await expect(canvas.getByTestId('log')).toHaveTextContent('vc');
  },
};

/** Página de documentación (plantilla v2): encabezado, pestañas, secciones y tabla de props. */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'DatePicker' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente DatePicker en Figma:']);
    // Anatomía: un marcador por pauta (5 + 5), y las vistas son ilustraciones (inert)
    const views = canvasElement.querySelectorAll('[data-doc-anatomy-view="marks"]');
    await expect(views).toHaveLength(2);
    for (const view of views) await expect(view).toHaveAttribute('inert');
    await waitFor(() => expect(canvasElement.querySelectorAll('[data-doc-mark]')).toHaveLength(10));
    // El calendario de la anatomía va en el flujo (state="active"), no en la capa superior
    await expect(views[1].querySelector('[role="dialog"]')).not.toHaveAttribute('popover');
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    // Con las flechas (activación automática) se llega a Desarrollo
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de DatePicker' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
