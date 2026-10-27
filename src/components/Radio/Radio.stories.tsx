import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
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

const FIGMA_STATES: { figma: string; state: RadioState }[] = [
  { figma: 'Default', state: 'default' },
  { figma: 'Disabled Default', state: 'disabled-default' },
  { figma: 'Select', state: 'select' },
  { figma: 'Disabled Select', state: 'disabled-select' },
];

function FigmaRadioMatrix({ withText }: { withText: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      {CONTRASTS.map((contrast) => (
        <div
          key={contrast}
          className={contrast === 'positive' ? 'bg-ds-background-general-black p-6' : 'bg-ds-background-general-white p-6'}
        >
          <div className="grid grid-cols-[repeat(4,auto)] items-center gap-x-8 gap-y-4">
            {FIGMA_STATES.map((s) => (
              <div
                key={s.figma}
                className="inline-flex w-fit"
                data-figma={`Type=Radio button, State=${s.figma}, Contrast=${contrast === 'positive' ? 'Positive' : 'Negative'}`}
              >
                <Radio contrast={contrast} state={s.state} aria-label={`Radio button ${contrast} ${s.figma}`}>
                  {withText ? <span data-figma-part="Text description">Text description</span> : undefined}
                </Radio>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Solo las 8 variantes `Type=Radio button` de `selection/selection-1` (sin texto). Las 8 de Checkbox del mismo set
 * están en `Form Controls/Checkbox` (`FigmaMatrix`): aquí el comparador las marca como FALTA, es esperable.
 */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => <FigmaRadioMatrix withText={false} />,
};

/** Solo las 8 variantes `Type=Radio button` de `selection/selection-2` (con `Text description`). */
export const FigmaMatrixText: Story = {
  parameters: { layout: 'padded' },
  render: () => <FigmaRadioMatrix withText />,
};

/** Test: las flechas mueven la selección, solo uno queda marcado y disabled se omite */
export const ArrowKeysTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div role="radiogroup" aria-label="Plan" className="flex flex-col gap-3">
      <Radio name="plan-test" value="a" defaultChecked>
        Básico
      </Radio>
      <Radio name="plan-test" value="b" disabled>
        Estándar
      </Radio>
      <Radio name="plan-test" value="c">
        Premium
      </Radio>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const basic = canvas.getByRole('radio', { name: 'Básico' });
    const standard = canvas.getByRole('radio', { name: 'Estándar' });
    const premium = canvas.getByRole('radio', { name: 'Premium' });
    await userEvent.tab();
    await expect(basic).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(premium).toBeChecked();
    await expect(premium).toHaveFocus();
    await expect(basic).not.toBeChecked();
    await expect(standard).not.toBeChecked();
    await userEvent.keyboard('{ArrowUp}');
    await expect(basic).toBeChecked();
    await expect(canvas.getAllByRole('radio').filter((r) => (r as HTMLInputElement).checked)).toHaveLength(1);
  },
};

/** Test: clic en el label selecciona y desmarca el anterior; disabled no se selecciona */
export const SelectionTest: Story = {
  tags: ['!autodocs'],
  render: () => <GroupDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('radio', { name: 'Estándar' })).toBeChecked();
    await userEvent.click(canvas.getByText('Premium'));
    await expect(canvas.getByRole('radio', { name: 'Premium' })).toBeChecked();
    await expect(canvas.getByRole('radio', { name: 'Estándar' })).not.toBeChecked();
  },
};

/** Test: disabled no se puede seleccionar */
export const DisabledTest: Story = {
  tags: ['!autodocs'],
  args: { children: 'No disponible', disabled: true, onChange: fn() },
  play: async ({ args, canvasElement }) => {
    const radio = within(canvasElement).getByRole('radio', { name: 'No disponible' });
    await userEvent.click(radio);
    await expect(radio).toBeDisabled();
    await expect(radio).not.toBeChecked();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};
