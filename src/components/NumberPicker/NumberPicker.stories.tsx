import { useState } from 'react';
import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { NumberPicker } from './NumberPicker';
import type { NumberPickerSize, NumberPickerState } from './NumberPicker.types';

const SIZE_OPTIONS: NumberPickerSize[] = ['sm', 'md'];
const STATE_OPTIONS: NumberPickerState[] = ['default', 'filled', 'active', 'burnt-in', 'disabled'];

const meta = {
  title: 'Form Controls/NumberPicker',
  component: NumberPicker,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      name: 'size',
      control: 'radio',
      options: SIZE_OPTIONS,
      type: { name: 'enum', value: SIZE_OPTIONS },
      description: 'Size de Figma: sm (alto 56) o md (alto 48)',
    },
    state: {
      name: 'state',
      control: 'select',
      options: [undefined, ...STATE_OPTIONS],
      type: { name: 'enum', value: STATE_OPTIONS },
      description: 'Fuerza el aspecto de un estado (solo documentación)',
    },
    min: { control: 'number', type: { name: 'number' } },
    max: { control: 'number', type: { name: 'number' } },
    step: { control: 'number', type: { name: 'number' } },
    largeStep: { control: 'number', type: { name: 'number' }, description: 'Incremento de RePág y AvPág (por defecto 10 × step)' },
    disabled: { name: 'disabled', control: 'boolean', type: { name: 'boolean' } },
    readOnly: { name: 'readOnly', control: 'boolean', type: { name: 'boolean' }, description: 'Estado Burnt-In (solo lectura)' },
    fullWidth: { name: 'fullWidth', control: 'boolean', type: { name: 'boolean' } },
  },
  args: { size: 'sm', 'aria-label': 'Cantidad', defaultValue: 1, min: 0, max: 10, step: 1 },
} satisfies Meta<typeof NumberPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

function ControlledDemo(args: ComponentProps<typeof NumberPicker>) {
  const [value, setValue] = useState<number | undefined>(2);
  return <NumberPicker {...args} defaultValue={undefined} value={value} onValueChange={setValue} />;
}

export const MediumControlled: Story = {
  args: { size: 'md', 'aria-label': 'Personas', min: 1, max: 8 },
  render: (args) => <ControlledDemo {...args} />,
};

const STATES: { state: NumberPickerState; figma: string }[] = [
  { state: 'default', figma: 'Default' },
  { state: 'filled', figma: 'Filled' },
  { state: 'active', figma: 'Active/Focus' },
  { state: 'burnt-in', figma: 'Burnt-In' },
  { state: 'disabled', figma: 'Disabled' },
];

/** Las 10 variantes de Figma (State × Size), cada una una vez, sobre la superficie del tema. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de NumberPicker" className="max-w-full overflow-x-auto">
        <div className="flex flex-col gap-4">
          {SIZE_OPTIONS.map((size) =>
            STATES.map((s) => (
              <div key={`${size}-${s.state}`} className="flex items-center gap-8">
                <span className="w-32 shrink-0 text-xs text-ds-text-neutral-body">{`${size} · ${s.state}`}</span>
                <div className="w-[650px] shrink-0">
                  <NumberPicker
                    rootProps={{ 'data-figma': `State=${s.figma}, Size=${size}` }}
                    fullWidth
                    size={size}
                    state={s.state}
                    defaultValue={0}
                    aria-label={`${s.figma} ${size}`}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  ),
};

/** Test: botones, nombre accesible, límites y que el foco no se pierda al llegar a un límite */
export const ButtonsTest: Story = {
  tags: ['!autodocs'],
  args: { defaultValue: 1, min: 0, max: 2, onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const spin = canvas.getByRole('spinbutton', { name: 'Cantidad' });
    const minus = canvas.getByRole('button', { name: 'Disminuir' });
    const plus = canvas.getByRole('button', { name: 'Aumentar' });
    await expect(spin).toHaveAttribute('aria-valuenow', '1');
    await expect(spin).toHaveAttribute('aria-valuemin', '0');
    await expect(spin).toHaveAttribute('aria-valuemax', '2');
    await userEvent.click(plus);
    await expect(spin).toHaveValue('2');
    await expect(plus).toBeDisabled();
    await expect(spin).toHaveFocus();
    await expect(args.onValueChange).toHaveBeenLastCalledWith(2);
    await userEvent.click(minus);
    await userEvent.click(minus);
    await expect(spin).toHaveValue('0');
    await expect(minus).toBeDisabled();
    await expect(plus).not.toBeDisabled();
  },
};

/** Test: teclado del patrón Spinbutton (flechas, RePág/AvPág, Inicio/Fin) y escritura acotada */
export const KeyboardTest: Story = {
  tags: ['!autodocs'],
  args: { defaultValue: 5, min: 0, max: 100, step: 1, largeStep: 10 },
  play: async ({ canvasElement }) => {
    const spin = within(canvasElement).getByRole('spinbutton', { name: 'Cantidad' });
    spin.focus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(spin).toHaveValue('6');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect(spin).toHaveValue('4');
    await userEvent.keyboard('{PageUp}');
    await expect(spin).toHaveValue('14');
    await userEvent.keyboard('{PageDown}{PageDown}');
    await expect(spin).toHaveValue('0');
    await userEvent.keyboard('{End}');
    await expect(spin).toHaveValue('100');
    await userEvent.keyboard('{Home}');
    await expect(spin).toHaveValue('0');
    await userEvent.clear(spin);
    await userEvent.type(spin, '250');
    // Mientras se escribe, el texto queda crudo y el valor confirmado no cambia
    await expect(spin).toHaveValue('250');
    await expect(spin).toHaveAttribute('aria-valuenow', '0');
    await userEvent.tab();
    await expect(spin).toHaveValue('100');
    await expect(spin).toHaveAttribute('aria-valuenow', '100');
    await userEvent.clear(spin);
    await userEvent.type(spin, '999{Enter}');
    await expect(spin).toHaveValue('100');
    await userEvent.clear(spin);
    await userEvent.type(spin, 'ab');
    await expect(spin).toHaveValue('');
  },
};

/** Test: con el campo vacío, el primer + confirma el mínimo y no min + step */
export const EmptyFirstStepTest: Story = {
  tags: ['!autodocs'],
  args: { defaultValue: undefined, min: 3, max: 10, step: 2 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const spin = canvas.getByRole('spinbutton', { name: 'Cantidad' });
    await userEvent.click(canvas.getByRole('button', { name: 'Aumentar' }));
    await expect(spin).toHaveValue('3');
  },
};

/** Test: solo lectura y deshabilitado no cambian el valor */
export const LockedTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div>
      <NumberPicker readOnly defaultValue={3} aria-label="Fijo" />
      <NumberPicker disabled defaultValue={3} aria-label="Apagado" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fixed = canvas.getByRole('spinbutton', { name: 'Fijo' });
    fixed.focus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(fixed).toHaveValue('3');
    await expect(fixed).toHaveAttribute('aria-readonly', 'true');
    const off = canvas.getByRole('spinbutton', { name: 'Apagado' });
    await expect(off).toBeDisabled();
    await expect(canvas.getAllByRole('button', { name: 'Aumentar' })[1]).toBeDisabled();
  },
};

/** Test: mensajes y tooltip de la base común (región viva, `aria-describedby` y `aria-invalid` con error). */
export const MessagesTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <NumberPicker aria-label="Personas" helperText="Máximo 8" tooltip="Incluye a los niños" min={1} max={8} />
      <NumberPicker aria-label="Habitaciones" errorText="Elige al menos una" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const people = canvas.getByRole('spinbutton', { name: 'Personas' });
    await expect(people).toHaveAccessibleDescription('Máximo 8 Incluye a los niños');
    await expect(people).not.toHaveAttribute('aria-invalid');
    const rooms = canvas.getByRole('spinbutton', { name: 'Habitaciones' });
    await expect(rooms).toHaveAttribute('aria-invalid', 'true');
    await expect(rooms).toHaveAccessibleDescription('Elige al menos una');
    await expect(canvasElement.querySelectorAll('[aria-live="polite"]')).toHaveLength(2);
  },
};
