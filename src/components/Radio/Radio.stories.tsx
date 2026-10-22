import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Radio } from './Radio';
import type { RadioProps, RadioContrast, RadioState } from './Radio.types';

const meta = {
  title: 'Form Controls/Radio',
  component: Radio,
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
    checked: { control: 'boolean', description: 'Seleccionado (controlado)' },
    disabled: { control: 'boolean', description: 'Deshabilitado' },
  },
  args: { contrast: 'positive', disabled: false },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveDemo(args: RadioProps) {
  const [checked, setChecked] = useState(false);
  return (
    <Radio
      {...args}
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
      aria-label="Opción"
    />
  );
}

export const Interactive: Story = {
  render: (args) => <InteractiveDemo {...args} />,
};

export const WithText: Story = {
  args: { children: 'Opción', defaultChecked: true },
};

export const Disabled: Story = {
  args: { children: 'Opción no disponible', disabled: true },
};

/** Grupo con name compartido: el teclado mueve la selección con las flechas. */
function GroupDemo({ contrast }: RadioProps) {
  const [value, setValue] = useState('b');
  return (
    <div role="radiogroup" aria-label="Plan" className="flex flex-col gap-3">
      {[
        ['a', 'Básico'],
        ['b', 'Estándar'],
        ['c', 'Premium'],
      ].map(([v, label]) => (
        <Radio key={v} contrast={contrast} name="plan" value={v} checked={value === v} onChange={() => setValue(v)}>
          {label}
        </Radio>
      ))}
    </div>
  );
}

/** Grupo con name compartido: el teclado mueve la selección con las flechas. */
export const Group: Story = {
  render: (args) => <GroupDemo {...args} />,
};

const STATES: RadioState[] = ['default', 'disabled-default', 'select', 'disabled-select'];
const CONTRASTS: RadioContrast[] = ['positive', 'negative'];

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
              <Radio key={s} contrast={contrast} state={s} aria-label={`${contrast} ${s}`} />
            ))}
            <span className="text-xs text-ds-text-neutral-body">Con texto</span>
            {STATES.map((s) => (
              <Radio key={s} contrast={contrast} state={s}>Label</Radio>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
