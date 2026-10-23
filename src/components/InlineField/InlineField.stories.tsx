import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { InlineField } from './InlineField';
import type { InlineFieldSize, InlineFieldState } from './InlineField.types';

const SIZE_OPTIONS: InlineFieldSize[] = ['sm', 'md'];
const STATE_OPTIONS: InlineFieldState[] = ['default', 'active', 'success', 'success-value', 'error', 'disabled'];

const meta = {
  title: 'Form Controls/InlineField',
  component: InlineField,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      name: 'size',
      control: 'radio',
      options: SIZE_OPTIONS,
      type: { name: 'enum', value: SIZE_OPTIONS },
      description: 'Size de Figma: sm (alto 40) o md (alto 56, texto grande)',
    },
    state: {
      name: 'state',
      control: 'select',
      options: STATE_OPTIONS,
      type: { name: 'enum', value: STATE_OPTIONS },
      description: 'State forzado (solo para visualización)',
    },
    optional: { name: 'optional', control: 'boolean', type: { name: 'boolean' } },
    disabled: { name: 'disabled', control: 'boolean', type: { name: 'boolean' } },
    fullWidth: { name: 'fullWidth', control: 'boolean', type: { name: 'boolean' } },
    suffix: { control: 'text', type: { name: 'string' }, description: 'Chip a la derecha (unidad, moneda o etiqueta)' },
  },
  args: {
    label: 'Monto',
    placeholder: '0',
    suffix: 'COP',
    size: 'sm',
    state: 'default',
    optional: false,
    disabled: false,
    fullWidth: false,
  },
} satisfies Meta<typeof InlineField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

export const Large: Story = {
  args: { size: 'md', label: 'Peso', placeholder: '0,0', suffix: 'kg', optional: true },
};

function ControlledDemo(args: ComponentProps<typeof InlineField>) {
  const [value, setValue] = useState('');
  const invalid = value.length > 0 && Number.isNaN(Number(value));
  return (
    <InlineField
      {...args}
      inputMode="decimal"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      errorText={invalid ? 'Escribe solo números' : undefined}
      helperText="Sin puntos ni comas de miles"
    />
  );
}

export const Controlled: Story = {
  render: (args) => <ControlledDemo {...args} />,
};

type Variant = {
  figma: string;
  state: InlineFieldState;
  size: InlineFieldSize;
  chip?: boolean;
  disabled?: boolean;
  /** El set tiene la opción "O" (probable error de Figma): se renderiza como inactivo */
  placeholder?: boolean;
};

const V = (
  type: 'Label' | 'Label+Placeholder',
  figmaState: string,
  state: InlineFieldState,
  size: InlineFieldSize,
  inactive: 'Off' | 'On' | 'O'
): Variant => ({
  figma: `Type=${type}, State=${figmaState}, Size=${size}, Inactive=${inactive}`,
  state,
  size,
  chip: type === 'Label+Placeholder',
  placeholder: type === 'Label+Placeholder',
  // Error md con Inactive=On se ve en Figma como un Error normal (mismos colores): no se desactiva
  disabled: inactive !== 'Off' && figmaState !== 'Error',
});

/** Las 14 variantes que existen en el set de Figma (Type × State × Size × Inactive), cada una una vez. */
const VARIANTS: Variant[] = [
  V('Label', 'Default', 'default', 'sm', 'Off'),
  V('Label', 'Default', 'default', 'sm', 'On'),
  V('Label+Placeholder', 'Active/Filled', 'active', 'sm', 'Off'),
  V('Label+Placeholder', 'Active/Filled', 'active', 'sm', 'On'),
  V('Label+Placeholder', 'Error', 'error', 'sm', 'Off'),
  V('Label+Placeholder', 'Success', 'success', 'sm', 'Off'),
  V('Label+Placeholder', 'Success placeholder', 'success-value', 'sm', 'Off'),
  V('Label', 'Default', 'default', 'md', 'Off'),
  V('Label', 'Default', 'default', 'md', 'On'),
  V('Label+Placeholder', 'Active/Filled', 'active', 'md', 'Off'),
  V('Label+Placeholder', 'Active/Filled', 'active', 'md', 'O'),
  V('Label+Placeholder', 'Error', 'error', 'md', 'On'),
  V('Label+Placeholder', 'Success', 'success', 'md', 'Off'),
  V('Label+Placeholder', 'Success placeholder', 'success-value', 'md', 'Off'),
];

/**
 * Cada variante de Figma una vez, sobre la superficie del tema. `Inactive=On` es disabled; `Inactive=O`
 * (solo existe en Active/Filled md) parece un error de nombre y en Figma se ve como inactiva.
 * Error md con Inactive=On se pinta como Error normal: así está en Figma (colores idénticos a Inactive=Off).
 */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de InlineField" className="max-w-full overflow-x-auto">
        <div className="flex flex-col gap-6">
          {VARIANTS.map((v) => (
            <div key={v.figma} className="flex items-center gap-8">
              <span className="w-80 shrink-0 text-xs text-ds-text-neutral-body">{v.figma}</span>
              <div className="w-[247.57px] shrink-0">
                <InlineField
                  rootProps={{ 'data-figma': v.figma }}
                  fullWidth
                  label="Label"
                  optional
                  size={v.size}
                  state={v.state}
                  disabled={v.disabled}
                  placeholder={v.placeholder ? 'Placeholder' : undefined}
                  suffix={v.chip ? 'Text' : undefined}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

/** Test: escribir actualiza el valor y el label sigue asociado */
export const TypingTest: Story = {
  tags: ['!autodocs'],
  args: { label: 'Monto', suffix: 'COP' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: /Monto/ });
    await userEvent.type(input, '12500');
    await expect(input).toHaveValue('12500');
    // El chip describe el campo
    await expect(input).toHaveAccessibleDescription('COP');
  },
};

/** Test: error con aria-invalid y descripción; deshabilitado no acepta escritura */
export const StatesTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex flex-col gap-4">
      <InlineField label="Con error" errorText="Valor no válido" defaultValue="x" />
      <InlineField label="Con ayuda" helperText="Solo números" suffix="kg" />
      <InlineField label="Apagado" disabled defaultValue="fijo" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bad = canvas.getByRole('textbox', { name: 'Con error' });
    await expect(bad).toHaveAttribute('aria-invalid', 'true');
    await expect(bad).toHaveAccessibleDescription('Valor no válido');
    await expect(canvas.getByRole('textbox', { name: 'Con ayuda' })).toHaveAccessibleDescription('Solo números kg');
    const off = canvas.getByRole('textbox', { name: 'Apagado' });
    await expect(off).toBeDisabled();
  },
};
