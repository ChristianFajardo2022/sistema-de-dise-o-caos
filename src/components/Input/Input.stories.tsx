import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import type { InputState, InputVariant } from './Input.types';

const meta: Meta<typeof Input> = {
  title: 'Form Controls/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'password', 'search', 'search-header'],
      description: 'Type de Figma',
    },
    state: {
      control: 'select',
      options: [
        'default',
        'filled',
        'active',
        'burnt-in',
        'disabled',
        'error',
        'success',
      ],
      description: 'State forzado (solo para visualización)',
    },
    optional: {
      control: 'boolean',
      description: 'Agrega " | Opcional" al label',
    },
    disabled: { control: 'boolean', description: 'Estado disabled' },
    readOnly: { control: 'boolean', description: 'Estado Burnt-In' },
    fullWidth: {
      control: 'boolean',
      description: 'Ocupa el 100 % del contenedor',
    },
  },
  args: {
    label: 'Label',
    variant: 'text',
    state: 'default',
    optional: false,
    disabled: false,
    readOnly: false,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    label: 'Nombre completo',
    placeholder: 'Ej. Camilo Hernández',
    helperText: 'Como aparece en tu documento',
  },
};

export const Password: Story = {
  args: {
    variant: 'password',
    label: 'Contraseña',
    placeholder: 'Ingresa tu contraseña',
  },
};

export const Search: Story = {
  args: {
    variant: 'search',
    label: 'Buscar',
    placeholder: 'Buscar componente o token',
  },
};

export const SearchHeader: Story = {
  args: {
    variant: 'search-header',
    label: 'Buscar en el portal',
    placeholder: 'Escribe para buscar',
  },
};

export const OptionalWithTooltip: Story = {
  args: {
    label: 'Teléfono',
    optional: true,
    tooltip: 'Solo lo usamos para notificaciones',
    type: 'tel',
  },
};

export const Interactive: Story = {
  render: (args) => <InteractiveInput {...args} />,
};

function InteractiveInput(args: ComponentProps<typeof Input>) {
  const [value, setValue] = useState('');
  const invalid = value.length > 0 && !value.includes('@');
  return (
    <Input
      {...args}
      label="Correo electrónico"
      type="email"
      placeholder="correo@dominio.com"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      errorText={invalid ? 'Escribe un correo válido' : undefined}
      successText={value.includes('@') ? 'Correo válido' : undefined}
      helperText="Te enviaremos la confirmación"
    />
  );
}

const VARIANTS: InputVariant[] = [
  'text',
  'password',
  'search',
  'search-header',
];
const STATES: { id: string; state: InputState; helper?: boolean }[] = [
  { id: 'default', state: 'default' },
  { id: 'filled', state: 'filled' },
  { id: 'active', state: 'active' },
  { id: 'burnt-in', state: 'burnt-in' },
  { id: 'disabled', state: 'disabled' },
  { id: 'error', state: 'error' },
  { id: 'success', state: 'success' },
  { id: 'helper', state: 'filled', helper: true },
];

/** Los 4 tipos × 8 estados del component set de Figma. */
export const StatesMatrix: Story = {
  render: () => (
    <div className="grid grid-cols-[auto_repeat(4,minmax(240px,1fr))] items-start gap-x-6 gap-y-6">
      <span />
      {VARIANTS.map((v) => (
        <span key={v} className="text-xs text-neutral-400">
          {v}
        </span>
      ))}
      {STATES.map(({ id, state, helper }) => (
        <div key={id} className="contents">
          <span className="pt-4 text-xs text-neutral-400">{id}</span>
          {VARIANTS.map((v) => (
            <Input
              key={v}
              fullWidth
              variant={v}
              state={state}
              label="Label"
              placeholder="Placeholder"
              defaultValue={id === 'filled' ? 'Valor' : undefined}
              errorText={state === 'error' ? 'Error text' : undefined}
              successText={state === 'success' ? 'Success text' : undefined}
              helperText={helper ? 'Helper text' : undefined}
            />
          ))}
        </div>
      ))}
    </div>
  ),
};
