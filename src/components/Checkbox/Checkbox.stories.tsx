import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Checkbox } from './Checkbox';
import { Radio } from '../Radio';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './Checkbox.doc';
import docsJson from './Checkbox.docs.json';
import type { CheckboxProps, CheckboxState, SelectionContrast, SelectionState } from './Checkbox.types';

const meta = {
  title: 'Form Controls/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered', docs: componentDocsParameters(doc, docsJson),
    // La demo guarda su propio estado marcado: defaultChecked no tendría efecto (y chocaría con checked)
    docsLive: { exclude: ['defaultChecked'] },
  },
  tags: ['autodocs'],
  // Tipos explícitos en las uniones: sin ellos Storybook descarta los args de la URL
  argTypes: argTypesFromDocsJson(docsJson, {
    contrast: {
      control: 'radio',
      options: ['positive', 'negative'],
      type: { name: 'enum', value: ['positive', 'negative'] },
    },
    state: {
      control: 'select',
      options: [undefined, 'default', 'select', 'disabled-default', 'disabled-select', 'indeterminate', 'disabled-indeterminate'],
      type: { name: 'enum', value: ['default', 'select', 'disabled-default', 'disabled-select', 'indeterminate', 'disabled-indeterminate'] },
    },
    checked: { control: 'boolean', type: { name: 'boolean' } },
    indeterminate: { control: 'boolean', type: { name: 'boolean' } },
    disabled: { control: 'boolean', type: { name: 'boolean' } },
    children: { control: 'text', type: { name: 'string' } },
  }),
  args: { contrast: 'positive', disabled: false },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Con el control `checked` el valor arranca en ese arg (la clave del `render` reinicia el estado al cambiarlo). */
function InteractiveDemo(args: CheckboxProps) {
  const [checked, setChecked] = useState(Boolean(args.checked));
  return <Checkbox {...args} checked={checked} onChange={(e) => setChecked(e.target.checked)} />;
}

export const Interactive: Story = {
  args: { children: 'Recibir avisos' },
  render: (args) => <InteractiveDemo key={String(args.checked)} {...args} />,
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

// Los cuatro de Figma y el mixto (no está en Figma)
const STATES: CheckboxState[] = ['default', 'disabled-default', 'select', 'disabled-select', 'indeterminate', 'disabled-indeterminate'];
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
          <div className="max-w-full overflow-x-auto">
          <div className="grid w-max min-w-full grid-cols-[auto_repeat(6,auto)] items-center gap-x-8 gap-y-4">
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
        </div>
      ))}
    </div>
  ),
};

const FIGMA_STATES: { figma: string; state: SelectionState }[] = [
  { figma: 'Default', state: 'default' },
  { figma: 'Disabled Default', state: 'disabled-default' },
  { figma: 'Select', state: 'select' },
  { figma: 'Disabled Select', state: 'disabled-select' },
];

/**
 * Los sets `selection/selection-1` (solo el control, 16×16) y `selection/selection-2` (control + `Text description`):
 * ambos traen Checkbox y Radio button × State × Contrast (16 variantes). Positive va sobre `background/general/black`
 * y Negative sobre `background/general/white`. El `data-figma` va en un contenedor, porque el input nativo está oculto.
 */
function FigmaSelectionMatrix({ withText }: { withText: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      {CONTRASTS.map((contrast) => (
        <div
          key={contrast}
          className={contrast === 'positive' ? 'bg-ds-background-general-black p-6' : 'bg-ds-background-general-white p-6'}
        >
          <div className="max-w-full overflow-x-auto">
          <div className="grid w-max min-w-full grid-cols-[auto_repeat(4,auto)] items-center gap-x-8 gap-y-4">
            <span className="text-xs text-ds-text-neutral-body">{contrast}</span>
            {FIGMA_STATES.map((s) => (
              <span key={s.figma} className="text-xs text-ds-text-neutral-body">{s.figma}</span>
            ))}
            {(['Checkbox', 'Radio button'] as const).map((type) => (
              <div key={type} className="contents">
                <span className="text-xs text-ds-text-neutral-body">{type}</span>
                {FIGMA_STATES.map((s) => {
                  const Control = type === 'Checkbox' ? Checkbox : Radio;
                  return (
                    <div
                      key={s.figma}
                      className="inline-flex w-fit"
                      data-figma={`Type=${type}, State=${s.figma}, Contrast=${cap(contrast)}`}
                    >
                      <Control contrast={contrast} state={s.state} aria-label={`${type} ${contrast} ${s.figma}`}>
                        {withText ? <span data-figma-part="Text description">Text description</span> : undefined}
                      </Control>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** `selection/selection-1`: Checkbox y Radio button sin texto (16 variantes). */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => <FigmaSelectionMatrix withText={false} />,
};

/** `selection/selection-2`: Checkbox y Radio button con `Text description` (16 variantes). */
export const FigmaMatrixText: Story = {
  parameters: { layout: 'padded' },
  render: () => <FigmaSelectionMatrix withText />,
};

/** Test: clic y Espacio alternan checked y llaman onChange; el label está asociado */
export const ToggleTest: Story = {
  tags: ['!autodocs'],
  args: { children: 'Acepto los términos', onChange: fn() },
  play: async ({ args, canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', { name: 'Acepto los términos' });
    await expect(within(canvasElement).getByLabelText('Acepto los términos')).toBe(checkbox);
    await expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
    await expect(args.onChange).toHaveBeenCalledTimes(1);
    await userEvent.click(within(canvasElement).getByText('Acepto los términos'));
    await expect(checkbox).not.toBeChecked();
    checkbox.focus();
    await expect(checkbox).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(checkbox).toBeChecked();
    await expect(args.onChange).toHaveBeenCalledTimes(3);
  },
};

/** Test: disabled no cambia ni llama onChange */
export const DisabledTest: Story = {
  tags: ['!autodocs'],
  args: { children: 'No disponible', disabled: true, onChange: fn() },
  play: async ({ args, canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', { name: 'No disponible' });
    await expect(checkbox).toBeDisabled();
    await userEvent.click(checkbox);
    await userEvent.click(within(canvasElement).getByText('No disponible'));
    await expect(checkbox).not.toBeChecked();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

/** Test: `indeterminate` da el estado mixto real (lo lee el lector) y se vuelve a fijar tras pulsar si sigue en `true`. */
export const IndeterminateTest: Story = {
  tags: ['!autodocs'],
  args: { children: 'Todas las categorías', indeterminate: true, onChange: fn() },
  play: async ({ args, canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', { name: 'Todas las categorías' }) as HTMLInputElement;
    await expect(checkbox.indeterminate).toBe(true);
    await expect(checkbox).toBePartiallyChecked();
    await userEvent.click(checkbox);
    await expect(args.onChange).toHaveBeenCalledTimes(1);
    // La prop sigue en true: el componente lo vuelve a fijar
    await expect(checkbox.indeterminate).toBe(true);
  },
};

export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Checkbox' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Checkbox en Figma:']);
    await expect(canvas.getByRole('group', { name: 'Modo de color' })).toBeInTheDocument();
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    // Con las flechas (activación automática)
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Desarrollo', 'Props', 'Ejemplos de uso']);
    // Sin Storybook no hay lienzo, código ni Personalizar: solo el bloque Props, de solo lectura
    const props = canvas.getByRole('table', { name: 'Props de Checkbox' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
    await expect(canvas.queryByRole('group', { name: 'Personalizar' })).not.toBeInTheDocument();
  },
};
