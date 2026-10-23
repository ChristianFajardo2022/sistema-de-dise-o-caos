import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Textarea } from './Textarea';
import type { TextareaResize, TextareaState } from './Textarea.types';

const STATE_OPTIONS: TextareaState[] = ['default', 'filled', 'active', 'burnt-in', 'disabled', 'error', 'success'];
const RESIZE_OPTIONS: TextareaResize[] = ['none', 'vertical', 'horizontal', 'both'];

const meta = {
  title: 'Form Controls/Textarea',
  component: Textarea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    state: {
      name: 'state',
      control: 'select',
      options: STATE_OPTIONS,
      type: { name: 'enum', value: STATE_OPTIONS },
      description: 'State forzado (solo para visualización)',
    },
    resize: {
      name: 'resize',
      control: 'radio',
      options: RESIZE_OPTIONS,
      type: { name: 'enum', value: RESIZE_OPTIONS },
      description: 'Tirador de tamaño. Con autoResize siempre es none',
    },
    rows: { control: 'number', type: { name: 'number' }, description: 'Líneas visibles (mínimo con autoResize)' },
    maxRows: { control: 'number', type: { name: 'number' }, description: 'Con autoResize, líneas máximas antes del scroll' },
    maxLength: { control: 'number', type: { name: 'number' }, description: 'Límite de caracteres; muestra el contador' },
    autoResize: { name: 'autoResize', control: 'boolean', type: { name: 'boolean' } },
    optional: { name: 'optional', control: 'boolean', type: { name: 'boolean' } },
    disabled: { name: 'disabled', control: 'boolean', type: { name: 'boolean' } },
    readOnly: { name: 'readOnly', control: 'boolean', type: { name: 'boolean' }, description: 'Estado Burnt-In' },
    fullWidth: { name: 'fullWidth', control: 'boolean', type: { name: 'boolean' } },
  },
  args: {
    label: 'Comentario',
    placeholder: 'Escribe tu comentario',
    rows: 3,
    maxLength: 200,
    resize: 'vertical',
    autoResize: false,
    optional: false,
    disabled: false,
    readOnly: false,
    fullWidth: false,
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

export const AutoResize: Story = {
  args: { autoResize: true, rows: 2, maxRows: 6, helperText: 'Crece con el contenido hasta 6 líneas' },
};

export const WithoutCounter: Story = {
  args: { maxLength: undefined, optional: true, tooltip: 'Visible para todo el equipo' },
};

function ControlledDemo(args: ComponentProps<typeof Textarea>) {
  const [value, setValue] = useState('');
  const invalid = value.length > 0 && value.trim().length < 10;
  return (
    <Textarea
      {...args}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      errorText={invalid ? 'Escribe al menos 10 caracteres' : undefined}
      helperText="Mínimo 10 caracteres"
    />
  );
}

export const Controlled: Story = {
  render: (args) => <ControlledDemo {...args} />,
};

const MATRIX: {
  figma: string;
  state: TextareaState;
  props?: Partial<ComponentProps<typeof Textarea>>;
}[] = [
  { figma: 'Default', state: 'default' },
  { figma: 'Filled', state: 'filled' },
  { figma: 'Active/Focus', state: 'active' },
  { figma: 'Burnt-In', state: 'burnt-in' },
  { figma: 'Disabled', state: 'disabled' },
  { figma: 'Error', state: 'error', props: { errorText: 'Error text' } },
  { figma: 'Success', state: 'success', props: { successText: 'Confirmation text' } },
  { figma: 'Helper text', state: 'filled', props: { helperText: 'Helper text' } },
];

/** Los 8 states del tipo Coment de Figma, cada uno una vez, sobre la superficie del tema. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de Textarea" className="max-w-full overflow-x-auto">
        <div className="flex flex-col gap-6">
          {MATRIX.map(({ figma, state, props }) => (
            <div key={figma} className="flex items-start gap-8">
              <span className="w-32 shrink-0 pt-4 text-xs text-ds-text-neutral-body">{figma}</span>
              <div className="w-[495.38px] shrink-0">
                <Textarea
                  rootProps={{ 'data-figma': `Type=Coment, State=${figma}` }}
                  fullWidth
                  label="Label"
                  placeholder="Placeholder"
                  maxLength={200}
                  state={state}
                  {...props}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

/** Test: escribir actualiza el valor y el contador, y el label sigue asociado */
export const TypingTest: Story = {
  tags: ['!autodocs'],
  args: { label: 'Comentario', maxLength: 20 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const area = canvas.getByRole('textbox', { name: 'Comentario' });
    await expect(area.tagName).toBe('TEXTAREA');
    await expect(canvas.getByText('0/20')).toBeVisible();
    await userEvent.type(area, 'Hola{Enter}mundo');
    await expect(area).toHaveValue('Hola\nmundo');
    await expect(canvas.getByText('10/20')).toBeVisible();
    await userEvent.type(area, '12345678901234');
    // maxLength nativo: no pasa de 20
    await expect(area).toHaveValue('Hola\nmundo1234567890');
    await expect(canvas.getByText('20/20')).toBeVisible();
    // El contador es parte de la descripción del campo
    await expect(area).toHaveAccessibleDescription('20/20');
  },
};

/** Test: error con aria-invalid y descripción, éxito sin aria-invalid */
export const MessagesTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex flex-col gap-4">
      <Textarea label="Con error" errorText="Texto muy corto" defaultValue="ab" />
      <Textarea label="Con éxito" successText="Listo" defaultValue="Todo bien" />
      <Textarea label="Con ayuda" helperText="Cuéntanos más" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bad = canvas.getByRole('textbox', { name: 'Con error' });
    await expect(bad).toHaveAttribute('aria-invalid', 'true');
    await expect(bad).toHaveAccessibleDescription('Texto muy corto');
    const ok = canvas.getByRole('textbox', { name: 'Con éxito' });
    await expect(ok).not.toHaveAttribute('aria-invalid');
    await expect(ok).toHaveAccessibleDescription('Listo');
    await expect(canvas.getByRole('textbox', { name: 'Con ayuda' })).toHaveAccessibleDescription('Cuéntanos más');
  },
};

/** Test: deshabilitado y solo lectura no aceptan escritura */
export const LockedTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex flex-col gap-4">
      <Textarea label="Apagado" disabled defaultValue="fijo" />
      <Textarea label="Solo lectura" readOnly defaultValue="fijo" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const off = canvas.getByRole('textbox', { name: 'Apagado' });
    await expect(off).toBeDisabled();
    const ro = canvas.getByRole('textbox', { name: 'Solo lectura' });
    await userEvent.type(ro, 'x');
    await expect(ro).toHaveValue('fijo');
    await expect(ro).toHaveAttribute('readonly');
  },
};

/** Test: autoResize crece con el contenido y respeta maxRows */
export const AutoResizeTest: Story = {
  tags: ['!autodocs'],
  args: { autoResize: true, rows: 1, maxRows: 3, maxLength: undefined, label: 'Notas' },
  play: async ({ canvasElement }) => {
    const area = within(canvasElement).getByRole('textbox', { name: 'Notas' });
    const h0 = area.getBoundingClientRect().height;
    await userEvent.type(area, 'a{Enter}b{Enter}c');
    await waitFor(() => expect(area.getBoundingClientRect().height).toBeGreaterThan(h0));
    const h3 = area.getBoundingClientRect().height;
    await userEvent.type(area, '{Enter}d{Enter}e{Enter}f');
    // Tope en 3 líneas: ya no crece y aparece el scroll
    await waitFor(() => expect(area.getBoundingClientRect().height).toBeCloseTo(h3, 0));
    await expect(area.scrollHeight).toBeGreaterThan(area.clientHeight);
  },
};
