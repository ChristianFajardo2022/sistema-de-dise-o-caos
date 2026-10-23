import { useState } from 'react';
import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { TripleSelect } from './TripleSelect';
import type { TripleSelectFields, TripleSelectState } from './TripleSelect.types';

const STATES: TripleSelectState[] = ['default', 'filled', 'active', 'burnt-in', 'disabled', 'error', 'success'];

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

/** Ejemplo realista: fecha de nacimiento. La API no depende de él: son tres listas cualesquiera. */
const BIRTH_FIELDS: TripleSelectFields = [
  {
    name: 'dia',
    label: 'Día',
    placeholder: 'Elige el día',
    options: Array.from({ length: 31 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })),
  },
  {
    name: 'mes',
    label: 'Mes',
    placeholder: 'Elige el mes',
    options: MONTHS.map((m, i) => ({ value: String(i + 1), label: m })),
  },
  {
    name: 'anio',
    label: 'Año',
    placeholder: 'Elige el año',
    options: Array.from({ length: 12 }, (_, i) => ({ value: String(2026 - i), label: String(2026 - i) })),
  },
];

const meta = {
  title: 'Form Controls/TripleSelect',
  component: TripleSelect,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    state: {
      name: 'state',
      control: 'select',
      options: [undefined, ...STATES],
      type: { name: 'enum', value: STATES },
      description: 'Fuerza el aspecto de un estado (solo documentación)',
    },
    disabled: { name: 'disabled', control: 'boolean', type: { name: 'boolean' } },
    readOnly: { name: 'readOnly', control: 'boolean', type: { name: 'boolean' }, description: 'Estado Burnt-In (solo lectura)' },
    fullWidth: { name: 'fullWidth', control: 'boolean', type: { name: 'boolean' } },
    helperText: { control: 'text', type: { name: 'string' } },
    errorText: { control: 'text', type: { name: 'string' } },
    successText: { control: 'text', type: { name: 'string' } },
  },
  args: { label: 'Fecha de nacimiento', fields: BIRTH_FIELDS },
} satisfies Meta<typeof TripleSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

/** Ejemplo de fecha de nacimiento con ayuda debajo. */
export const BirthDate: Story = {
  args: { helperText: 'Como aparece en tu documento' },
};

/** Otro uso con la misma API: departamento, ciudad y barrio (los valores no dependen entre sí aquí). */
export const Location: Story = {
  args: {
    label: 'Ubicación',
    fields: [
      { name: 'departamento', label: 'Departamento', placeholder: 'Elige', options: [{ value: 'a', label: 'Antioquia' }, { value: 'c', label: 'Cundinamarca' }] },
      { name: 'ciudad', label: 'Ciudad', placeholder: 'Elige', options: [{ value: 'm', label: 'Medellín' }, { value: 'b', label: 'Bogotá' }] },
      { name: 'barrio', label: 'Barrio', placeholder: 'Elige', optional: true, options: [{ value: 'p', label: 'El Poblado' }, { value: 'u', label: 'Usaquén' }] },
    ],
  },
};

function ControlledDemo(args: ComponentProps<typeof TripleSelect>) {
  const [day, setDay] = useState<string | null>('15');
  const [month, setMonth] = useState<string | null>('3');
  const [year, setYear] = useState<string | null>('2000');
  const [d, m, y] = args.fields;
  return (
    <div className="flex flex-col gap-4">
      <TripleSelect
        {...args}
        fields={[
          { ...d, value: day, onValueChange: setDay },
          { ...m, value: month, onValueChange: setMonth },
          { ...y, value: year, onValueChange: setYear },
        ]}
      />
      <output className="text-sm text-ds-text-neutral-body">
        Valor: {day ?? '-'} / {month ?? '-'} / {year ?? '-'}
      </output>
    </div>
  );
}

export const Controlled: Story = {
  render: (args) => <ControlledDemo {...args} />,
};

const STATE_PROPS: { figma: string; props: Partial<ComponentProps<typeof TripleSelect>> }[] = [
  { figma: 'Default', props: {} },
  { figma: 'Filled', props: { state: 'filled' } },
  { figma: 'Active/Focus', props: { state: 'active' } },
  { figma: 'Burnt-In', props: { readOnly: true } },
  { figma: 'Disabled', props: { disabled: true } },
  { figma: 'Error', props: { errorText: 'Error text' } },
  { figma: 'Success', props: { successText: 'Confirmation text' } },
  { figma: 'Helper text', props: { state: 'filled', helperText: 'Helper text' } },
];

/** Textos de muestra del archivo de Figma ("Label", "Placeholder"). */
const FIGMA_FIELDS: TripleSelectFields = [0, 1, 2].map((i) => ({
  label: 'Label',
  placeholder: 'Placeholder',
  options: [
    { value: `${i}a`, label: 'Text item' },
    { value: `${i}b`, label: 'Text item' },
  ],
})) as unknown as TripleSelectFields;

/** Los 8 estados de Figma (Type=Triple), cada uno una vez, sobre la superficie del tema. Usa los textos de muestra de Figma. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de TripleSelect" className="max-w-full overflow-x-auto">
        <div className="flex flex-col gap-6">
          {STATE_PROPS.map(({ figma, props }) => (
            <div key={figma} className="flex items-start gap-8">
              <span className="w-32 shrink-0 pt-4 text-xs text-ds-text-neutral-body">{figma}</span>
              <TripleSelect
                data-figma={`Type=Triple, State=${figma}`}
                label={`Triple ${figma}`}
                fields={FIGMA_FIELDS}
                {...props}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

// ───────────────────────── pruebas ─────────────────────────

const renderTest = (args: ComponentProps<typeof TripleSelect>) => (
  <form aria-label="Formulario" className="flex min-h-96 flex-col items-start gap-4 p-4">
    <TripleSelect {...args} />
    <button type="button">Siguiente</button>
  </form>
);

/** Grupo con nombre, tres comboboxes con nombre propio, descripción compartida y Tab entre secciones. */
export const KeyboardTest: Story = {
  tags: ['!autodocs'],
  args: { helperText: 'Como aparece en tu documento' },
  render: renderTest,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('group', { name: 'Fecha de nacimiento' })).toBeInTheDocument();
    const day = canvas.getByRole('combobox', { name: 'Día' });
    const month = canvas.getByRole('combobox', { name: 'Mes' });
    const year = canvas.getByRole('combobox', { name: 'Año' });
    for (const c of [day, month, year]) await expect(c).toHaveAccessibleDescription('Como aparece en tu documento');

    day.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(day).toHaveAttribute('aria-expanded', 'true'));
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await waitFor(() => expect(day).toHaveAttribute('aria-expanded', 'false'));
    await expect(day).toHaveTextContent('2');

    // Tab pasa a la sección siguiente y la lista se alinea al ancho del recuadro
    await userEvent.tab();
    await expect(month).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(month).toHaveAttribute('aria-expanded', 'true'));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(month).toHaveAttribute('aria-expanded', 'false'));
    await userEvent.tab();
    await expect(year).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect(month).toHaveFocus();
  },
};

/** Elegir en las tres secciones: onValueChange por campo y valores enviados con el formulario. */
export const SelectionTest: Story = {
  tags: ['!autodocs'],
  args: {
    fields: [
      { ...BIRTH_FIELDS[0], onValueChange: fn() },
      { ...BIRTH_FIELDS[1], onValueChange: fn() },
      { ...BIRTH_FIELDS[2], onValueChange: fn() },
    ] as unknown as TripleSelectFields,
  },
  render: renderTest,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const pick = async (name: string, option: string) => {
      const combo = canvas.getByRole('combobox', { name });
      await userEvent.click(combo);
      await waitFor(() => expect(combo).toHaveAttribute('aria-expanded', 'true'));
      await userEvent.click(canvas.getByRole('option', { name: option }));
      await waitFor(() => expect(combo).toHaveAttribute('aria-expanded', 'false'));
      await expect(combo).toHaveTextContent(option);
    };
    await pick('Día', '10');
    await pick('Mes', 'Marzo');
    await pick('Año', '2020');
    const [d, m, y] = args.fields;
    await expect(d.onValueChange).toHaveBeenCalledWith('10');
    await expect(m.onValueChange).toHaveBeenCalledWith('3');
    await expect(y.onValueChange).toHaveBeenCalledWith('2020');
    const data = new FormData(canvasElement.querySelector('form')!);
    await expect([data.get('dia'), data.get('mes'), data.get('anio')]).toEqual(['10', '3', '2020']);
  },
};

/** Error: aria-invalid y descripción en las tres secciones. Disabled y solo lectura. */
export const StatesTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex flex-col gap-6 p-4">
      <TripleSelect label="Con error" fields={BIRTH_FIELDS} errorText="Revisa la fecha" />
      <TripleSelect label="Deshabilitado" fields={BIRTH_FIELDS} disabled />
      <TripleSelect label="Solo lectura" fields={BIRTH_FIELDS} readOnly />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const error = within(canvas.getByRole('group', { name: 'Con error' }));
    for (const c of error.getAllByRole('combobox')) {
      await expect(c).toHaveAttribute('aria-invalid', 'true');
      await expect(c).toHaveAccessibleDescription('Revisa la fecha');
    }
    for (const c of within(canvas.getByRole('group', { name: 'Deshabilitado' })).getAllByRole('combobox')) await expect(c).toBeDisabled();
    const [first] = within(canvas.getByRole('group', { name: 'Solo lectura' })).getAllByRole('combobox');
    await expect(first).toHaveAttribute('aria-readonly', 'true');
    first.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(first).toHaveAttribute('aria-expanded', 'false');
  },
};
