import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { DigitInput } from './DigitInput';
import type { DigitInputSize, DigitInputState } from './DigitInput.types';

const SIZE_OPTIONS: DigitInputSize[] = ['56', '32'];
const STATE_OPTIONS: DigitInputState[] = ['default', 'filled', 'active', 'burnt-in', 'disabled', 'error', 'confirmation'];

const meta = {
  title: 'Form Controls/DigitInput',
  component: DigitInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      name: 'size',
      control: 'radio',
      options: SIZE_OPTIONS,
      type: { name: 'enum', value: SIZE_OPTIONS },
      description: 'Size de Figma: alto de la casilla (56 o 32)',
    },
    state: {
      name: 'state',
      control: 'select',
      options: [undefined, ...STATE_OPTIONS],
      type: { name: 'enum', value: STATE_OPTIONS },
      description: 'Fuerza el aspecto de un estado (solo documentación)',
    },
    invalid: { name: 'invalid', control: 'boolean', type: { name: 'boolean' }, description: 'Estado Error (aria-invalid)' },
    confirmed: { name: 'confirmed', control: 'boolean', type: { name: 'boolean' }, description: 'Estado Confirmation' },
    oneTimeCode: { name: 'oneTimeCode', control: 'boolean', type: { name: 'boolean' }, description: 'autoComplete="one-time-code"' },
    disabled: { name: 'disabled', control: 'boolean', type: { name: 'boolean' } },
    readOnly: { name: 'readOnly', control: 'boolean', type: { name: 'boolean' }, description: 'Estado Burnt-In (solo lectura)' },
  },
  args: { size: '56', 'aria-label': 'Dígito 1 de 6' },
} satisfies Meta<typeof DigitInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

export const Size32: Story = { args: { size: '32', 'aria-label': 'Dígito 1 de 6' } };

const STATES: { state: DigitInputState; figma: string }[] = [
  { state: 'default', figma: 'Default' },
  { state: 'filled', figma: 'Filled' },
  { state: 'active', figma: 'Active/Focus' },
  { state: 'burnt-in', figma: 'Burnt-In' },
  { state: 'disabled', figma: 'Disabled' },
  { state: 'error', figma: 'Error' },
  { state: 'confirmation', figma: 'Confirmation' },
];

/** Las 14 variantes de Figma (Size × State), cada una una vez, sobre la superficie del tema. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de DigitInput" className="max-w-full overflow-x-auto">
        <div className="grid grid-cols-[auto_repeat(7,auto)] items-center justify-items-start gap-x-8 gap-y-4">
          <span />
          {STATES.map((s) => (
            <span key={s.state} className="text-xs text-ds-text-neutral-body">{s.state}</span>
          ))}
          {SIZE_OPTIONS.map((size) => (
            <div key={size} className="contents">
              <span className="text-xs text-ds-text-neutral-body">{size}</span>
              {STATES.map((s) => (
                <DigitInput
                  key={s.state}
                  size={size}
                  state={s.state}
                  defaultValue={s.state === 'default' ? undefined : '0'}
                  aria-label={`Size ${size} ${s.figma}`}
                  data-figma={`Size=${size}, State=${s.figma}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

/** Test: un solo carácter, teclado numérico y nombre accesible */
export const TypingTest: Story = {
  tags: ['!autodocs'],
  args: { 'aria-label': 'Dígito 1 de 6', oneTimeCode: true },
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole('textbox', { name: 'Dígito 1 de 6' });
    await expect(box).toHaveAttribute('inputmode', 'numeric');
    await expect(box).toHaveAttribute('maxlength', '1');
    await expect(box).toHaveAttribute('autocomplete', 'one-time-code');
    await userEvent.type(box, '78');
    await expect(box).toHaveValue('7');
  },
};

/** Test: error expone aria-invalid; burnt-in no admite escritura; disabled no recibe foco */
export const StatesTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div>
      <DigitInput invalid aria-label="Con error" />
      <DigitInput readOnly defaultValue="4" aria-label="Solo lectura" />
      <DigitInput disabled aria-label="Deshabilitada" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox', { name: 'Con error' })).toHaveAttribute('aria-invalid', 'true');
    const ro = canvas.getByRole('textbox', { name: 'Solo lectura' });
    await userEvent.type(ro, '9');
    await expect(ro).toHaveValue('4');
    const off = canvas.getByRole('textbox', { name: 'Deshabilitada' });
    await expect(off).toBeDisabled();
  },
};
