import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from './Checkbox';
import type { CheckboxProps, SelectionContrast, SelectionState } from './Checkbox.types';

const meta = {
  title: 'Form Controls/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    contrast: {
      control: 'radio',
      options: ['positive', 'negative'],
      description: 'Contrast: positive sobre superficies oscuras, negative sobre claras',
    },
    state: {
      control: 'select',
      options: [undefined, 'default', 'select', 'disabled-default', 'disabled-select'],
      description: 'State forzado, solo para documentación',
    },
    checked: { control: 'boolean', description: 'Marcado (controlado)' },
    disabled: { control: 'boolean', description: 'Deshabilitado' },
  },
  args: { contrast: 'positive', disabled: false },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveDemo(args: CheckboxProps) {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      {...args}
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
      aria-label="Aceptar"
    />
  );
}

export const Interactive: Story = {
  render: (args) => <InteractiveDemo {...args} />,
};

export const WithText: Story = {
  args: { children: 'Acepto los términos y condiciones', defaultChecked: true },
};

export const Disabled: Story = {
  args: { children: 'Opción no disponible', disabled: true },
};

export const Negative: Story = {
  args: { contrast: 'negative', children: 'Sobre superficie clara', defaultChecked: true },
  decorators: [
    (Story) => (
      <div className="bg-ds-background-general-white p-6">
        <Story />
      </div>
    ),
  ],
};

const STATES: SelectionState[] = ['default', 'disabled-default', 'select', 'disabled-select'];
const CONTRASTS: SelectionContrast[] = ['positive', 'negative'];

/**
 * Matriz de Contrast × State, con y sin texto.
 * Positive va sobre la superficie del tema (background/general/black: oscura en modo oscuro
 * y clara en claro) y negative sobre la inversa (background/general/white), así cada fila
 * se lee en ambos temas, igual que el texto: text/neutral/white y black cambian con el tema.
 */
export const StatesMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-4">
      {CONTRASTS.map((contrast) => (
        <div
          key={contrast}
          className={
            contrast === 'positive'
              ? 'bg-ds-background-general-black p-6'
              : 'bg-ds-background-general-white p-6'
          }
        >
          <div className="grid grid-cols-[auto_repeat(4,auto)] items-center gap-x-8 gap-y-4">
            <span className="text-xs text-ds-text-neutral-body">{contrast}</span>
            {STATES.map((s) => (
              <span key={s} className="text-xs text-ds-text-neutral-body">{s}</span>
            ))}
            <span className="text-xs text-ds-text-neutral-body">Control</span>
            {STATES.map((s) => (
              <Checkbox key={s} contrast={contrast} state={s} aria-label={`${contrast} ${s}`} />
            ))}
            <span className="text-xs text-ds-text-neutral-body">Con texto</span>
            {STATES.map((s) => (
              <Checkbox key={s} contrast={contrast} state={s}>Label</Checkbox>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
