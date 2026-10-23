import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { TimePicker } from './TimePicker';
import type { TimePickerProps, TimePickerState } from './TimePicker.types';

const STATE_OPTIONS: TimePickerState[] = ['default', 'filled', 'active', 'burnt-in', 'disabled', 'error', 'success'];

const meta = {
  title: 'Form Controls/TimePicker',
  component: TimePicker,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    hourCycle: {
      name: 'hourCycle',
      control: 'radio',
      options: [12, 24],
      type: { name: 'enum', value: [12, 24] },
      description: 'Ciclo horario visible; en 24 se oculta AM/PM',
    },
    state: {
      name: 'state',
      control: 'select',
      options: [undefined, ...STATE_OPTIONS],
      type: { name: 'enum', value: STATE_OPTIONS },
      description: 'Fuerza el aspecto de un estado (solo documentación)',
    },
    minuteStep: { control: 'number', type: { name: 'number' } },
    disabled: { name: 'disabled', control: 'boolean', type: { name: 'boolean' } },
    readOnly: { name: 'readOnly', control: 'boolean', type: { name: 'boolean' }, description: 'Estado Burnt-In (solo lectura)' },
    fullWidth: { name: 'fullWidth', control: 'boolean', type: { name: 'boolean' } },
    helperText: { control: 'text', type: { name: 'string' } },
    errorText: { control: 'text', type: { name: 'string' } },
    successText: { control: 'text', type: { name: 'string' } },
  },
  args: { hourCycle: 12, minuteStep: 1, label: 'Hora de la cita' },
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

export const TwentyFourHours: Story = {
  args: { hourCycle: 24, defaultValue: '17:45', label: 'Hora de salida' },
};

function ControlledDemo(args: TimePickerProps) {
  const [value, setValue] = useState('14:30');
  return (
    <div className="flex flex-col gap-4">
      <TimePicker {...args} value={value} onChange={setValue} />
      <output className="text-sm text-ds-text-neutral-body">Valor (24 h): {value || '(vacío)'}</output>
    </div>
  );
}

export const Controlled: Story = {
  render: (args) => <ControlledDemo {...args} />,
};

interface Fig {
  figma: string;
  props: Partial<TimePickerProps>;
  /** Nombre del nodo de Figma del texto del campo de hora (en dos estados es "00"). */
  hourPart?: string;
}

const FIGMA: Fig[] = [
  { figma: 'Default', props: {} },
  { figma: 'Filled', props: { state: 'filled', defaultValue: '09:30' } },
  { figma: 'Active/Focus', props: { state: 'active', defaultValue: '09:30' } },
  { figma: 'Burnt-In', props: { readOnly: true, defaultValue: '09:30' } },
  { figma: 'Disabled', props: { disabled: true } },
  { figma: 'Error', props: { errorText: 'Helper text', defaultValue: '09:30' } },
  { figma: 'Success', props: { successText: 'Helper text', defaultValue: '09:30' }, hourPart: '00' },
  { figma: 'Helper text', props: { helperText: 'Helper text', defaultValue: '09:30' }, hourPart: '00' },
];

/** Los 8 estados de Figma (Type=Time picker), cada uno una vez, sobre la superficie del tema. Usa los textos de muestra de Figma. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de TimePicker" className="max-w-full overflow-x-auto">
        <div className="flex flex-col gap-6">
          {FIGMA.map((f) => (
            <div key={f.figma} className="flex items-start gap-8">
              <span className="w-32 shrink-0 pt-4 text-xs text-ds-text-neutral-body">{f.figma}</span>
              <TimePicker
                data-figma={`Type=Time picker, State=${f.figma}`}
                label={`Hora ${f.figma}`}
                hourLabel="Label"
                minuteLabel="Label"
                hourPlaceholder="Placeholder"
                minutePlaceholder="Placeholder"
                hourInputProps={{ 'data-figma-part': f.hourPart ?? 'Placeholder' } as never}
                minuteInputProps={{ 'data-figma-part': 'Placeholder' } as never}
                {...f.props}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

/** Test: escritura, relleno a dos dígitos al salir, acotado al rango y valor en 24 h */
export const TypingTest: Story = {
  tags: ['!autodocs'],
  args: { onChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole('group', { name: 'Hora de la cita' });
    await expect(group).toBeInTheDocument();
    const hour = canvas.getByRole('spinbutton', { name: 'Hora' });
    const minute = canvas.getByRole('spinbutton', { name: 'Minutos' });
    await userEvent.type(hour, '7');
    await userEvent.tab();
    await expect(hour).toHaveValue('07');
    await userEvent.type(minute, '5');
    await userEvent.click(canvas.getByRole('radio', { name: 'PM' }));
    await userEvent.tab();
    await expect(minute).toHaveValue('05');
    await expect(args.onChange).toHaveBeenLastCalledWith('19:05');
    await userEvent.clear(hour);
    await userEvent.type(hour, '99');
    await expect(hour).toHaveAttribute('aria-invalid', 'true');
    await userEvent.tab();
    await expect(hour).toHaveValue('12');
    await expect(args.onChange).toHaveBeenLastCalledWith('12:05');
    await userEvent.clear(minute);
    await userEvent.type(minute, 'ab');
    await expect(minute).toHaveValue('');
    await expect(args.onChange).toHaveBeenLastCalledWith('');
  },
};

/** Test: flechas, Inicio/Fin y salto de minutos del patrón Spinbutton, con vuelta en los extremos */
export const ArrowsTest: Story = {
  tags: ['!autodocs'],
  args: { defaultValue: '08:50', minuteStep: 15 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const hour = canvas.getByRole('spinbutton', { name: 'Hora' });
    const minute = canvas.getByRole('spinbutton', { name: 'Minutos' });
    hour.focus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(hour).toHaveValue('09');
    await userEvent.keyboard('{End}{ArrowUp}');
    await expect(hour).toHaveValue('01');
    await userEvent.keyboard('{ArrowDown}');
    await expect(hour).toHaveValue('12');
    await expect(hour).toHaveAttribute('aria-valuemax', '12');
    minute.focus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(minute).toHaveValue('00');
    await userEvent.keyboard('{ArrowUp}');
    await expect(minute).toHaveValue('15');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect(minute).toHaveValue('45');
    await expect(minute).toHaveAttribute('aria-valuenow', '45');
  },
};

/** Test: AM/PM como radiogroup (flechas y un solo Tab) y conversión a 24 h */
export const PeriodTest: Story = {
  tags: ['!autodocs'],
  args: { defaultValue: '09:30', onChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('radiogroup', { name: 'AM/PM' })).toBeInTheDocument();
    const am = canvas.getByRole('radio', { name: 'AM' });
    const pm = canvas.getByRole('radio', { name: 'PM' });
    await expect(am).toBeChecked();
    await userEvent.click(pm);
    await expect(pm).toBeChecked();
    await expect(args.onChange).toHaveBeenLastCalledWith('21:30');
    am.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(pm).toBeChecked();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(am).toBeChecked();
    await expect(args.onChange).toHaveBeenLastCalledWith('09:30');
  },
};

/** Test: en 24 h no hay AM/PM y el valor sale tal cual */
export const TwentyFourTest: Story = {
  tags: ['!autodocs'],
  args: { hourCycle: 24, defaultValue: '00:05', onChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('radio')).toBeNull();
    const hour = canvas.getByRole('spinbutton', { name: 'Hora' });
    await expect(hour).toHaveValue('00');
    await expect(hour).toHaveAttribute('aria-valuemax', '23');
    hour.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(hour).toHaveValue('23');
    await expect(args.onChange).toHaveBeenLastCalledWith('23:05');
  },
};

/** Test: solo lectura y deshabilitado no cambian el valor; el mensaje se asocia por aria-describedby */
export const LockedTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex flex-col gap-4">
      <TimePicker readOnly defaultValue="10:15" label="Fija" />
      <TimePicker disabled defaultValue="10:15" label="Apagada" />
      <TimePicker errorText="Elige una hora válida" label="Con error" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fixed = within(canvas.getByRole('group', { name: 'Fija' }));
    const hour = fixed.getByRole('spinbutton', { name: 'Hora' });
    hour.focus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(hour).toHaveValue('10');
    await expect(hour).toHaveAttribute('aria-readonly', 'true');
    await userEvent.click(fixed.getByRole('radio', { name: 'PM' }));
    await expect(fixed.getByRole('radio', { name: 'AM' })).toBeChecked();
    const off = within(canvas.getByRole('group', { name: 'Apagada' }));
    await expect(off.getByRole('spinbutton', { name: 'Hora' })).toBeDisabled();
    await expect(off.getByRole('radio', { name: 'AM' })).toBeDisabled();
    const bad = within(canvas.getByRole('group', { name: 'Con error' }));
    const field = bad.getByRole('spinbutton', { name: 'Hora' });
    await expect(field).toHaveAttribute('aria-invalid', 'true');
    await expect(field).toHaveAccessibleDescription('Elige una hora válida');
  },
};

function TimePickerApiDemo() {
  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  const [refs, setRefs] = useState('');
  useEffect(() => setRefs(`${ref.current?.id.endsWith('-hour')}`), []);
  return (
    <div className="flex flex-col gap-4">
      <TimePicker ref={ref} label="Hora de llegada" helperText="Hora local" tooltip="Formato de 12 horas" required optional onValueChange={setValue} />
      <output data-testid="valor">{value}</output>
      <output data-testid="refs">{refs}</output>
    </div>
  );
}

/**
 * API común: `ref` al campo de la hora, `onValueChange`, `required` nativo, " | Opcional", tooltip y el mensaje en cada
 * control (no en el grupo, para no leerlo dos veces).
 */
export const ApiTest: Story = {
  tags: ['!autodocs'],
  render: () => <TimePickerApiDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('refs')).toHaveTextContent('true');
    const group = canvas.getByRole('group', { name: 'Hora de llegada' });
    await expect(group).not.toHaveAttribute('aria-describedby');
    const hour = canvas.getByRole('spinbutton', { name: /^Hora ?\| Opcional$/ });
    const minute = canvas.getByRole('spinbutton', { name: /^Minutos ?\| Opcional$/ });
    await expect(hour).toBeRequired();
    await expect(minute).toBeRequired();
    await expect(hour).toHaveAccessibleDescription('Hora local Formato de 12 horas');
    await expect(canvas.getByRole('button', { name: 'Formato de 12 horas' })).toBeVisible();
    await userEvent.type(hour, '9');
    await userEvent.type(minute, '30');
    await userEvent.click(canvas.getByRole('radio', { name: 'PM' }));
    await expect(canvas.getByTestId('valor')).toHaveTextContent('21:30');
  },
};
