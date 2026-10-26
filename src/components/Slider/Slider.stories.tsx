import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Slider } from './Slider';
import type { SliderProps, SliderValue } from './Slider.types';

const meta = {
  title: 'Form Controls/Slider',
  component: Slider,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [
    (Story, { name }) =>
      name === 'Figma Matrix' ? (
        <Story />
      ) : (
        <div className="w-full max-w-sm py-4">
          <Story />
        </div>
      ),
  ],
  argTypes: {
    min: { control: 'number', description: 'Valor mínimo', type: { name: 'number' } },
    max: { control: 'number', description: 'Valor máximo', type: { name: 'number' } },
    step: { control: 'number', description: 'Paso', type: { name: 'number' } },
    showValue: { control: 'boolean', description: 'Valor dentro del pulgar (Type "number")', type: { name: 'boolean' } },
    disabled: { control: 'boolean', description: 'Deshabilitado', type: { name: 'boolean' } },
    'aria-label': { control: 'text', description: 'Nombre accesible', type: { name: 'string' } },
    name: { control: 'text', description: 'Nombre para formularios', type: { name: 'string' } },
  },
  args: { 'aria-label': 'Volumen', min: 0, max: 100, step: 1, showValue: false, disabled: false },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

const LABEL = 'text-xs text-ds-text-neutral-gray';
const pesos = (v: number) => `$${v.toLocaleString('es-CO')}`;

function InteractiveDemo(args: Omit<SliderProps<SliderValue>, 'value' | 'defaultValue' | 'onValueChange'>) {
  const [value, setValue] = useState(40);
  return (
    <div className="flex flex-col gap-4">
      <Slider {...args} value={value} onValueChange={setValue} />
      <span className={LABEL}>Valor: {value}</span>
    </div>
  );
}

export const Interactive: Story = {
  render: (args) => <InteractiveDemo {...args} />,
};

export const WithValue: Story = {
  args: { 'aria-label': 'Brillo', defaultValue: 60, showValue: true },
};

function RangeDemo({ showValue = false }: { showValue?: boolean }) {
  const [value, setValue] = useState<[number, number]>([200_000, 600_000]);
  return (
    <div className="flex flex-col gap-4">
      <Slider
        aria-label="Precio"
        min={0}
        max={1_000_000}
        step={10_000}
        value={value}
        onValueChange={setValue}
        formatValue={pesos}
        showValue={showValue}
      />
      <span className={LABEL}>
        Entre {pesos(value[0])} y {pesos(value[1])}
      </span>
    </div>
  );
}

export const Range: Story = {
  render: () => <RangeDemo />,
};

export const RangeWithValue: Story = {
  render: () => (
    <Slider aria-label="Edad" min={18} max={99} defaultValue={[25, 40]} showValue thumbLabels={['Edad mínima', 'Edad máxima']} />
  ),
};

export const Disabled: Story = {
  args: { 'aria-label': 'Volumen', defaultValue: 30, disabled: true },
};

const TYPES = ['Simple', 'Simple number', 'Range', 'Range number'] as const;
const PERCENTS = [0, 25, 50, 75, 100] as const;

/**
 * Las 20 variantes de "Slide bar" (set 13839:56628): Type × Porcentage, con el texto "00" de Figma.
 * En Range, "Porcentage" es el ancho del tramo seleccionado, centrado (0 % = pulgares juntos al centro).
 * Va sobre la superficie del tema (background/general/black).
 */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de Slider" className="max-w-full overflow-x-auto">
        {/* Filas que se parten (ancho de Figma, 361.4): a 1440 no se corta ninguna columna */}
        <div className="flex flex-col gap-y-10 py-4">
          {TYPES.map((type) => (
            <div key={type} className="flex flex-col gap-y-4">
              <span className={LABEL}>{type}</span>
              <div className="flex flex-wrap gap-x-8 gap-y-6">
              {PERCENTS.map((p) => {
                const name = `Type=${type}, Porcentage=${p}%`;
                const range = type.startsWith('Range');
                return (
                  <div key={p} className="flex w-[361.4px] flex-col gap-y-3">
                    <span className={LABEL}>{`${p}%`}</span>
                    {range ? (
                      <Slider
                        data-figma={name}
                        aria-label={name}
                        defaultValue={[50 - p / 2, 50 + p / 2]}
                        showValue={type === 'Range number'}
                        formatValue={() => '00'}
                      />
                    ) : (
                      <Slider
                        data-figma={name}
                        aria-label={name}
                        defaultValue={p}
                        showValue={type === 'Simple number'}
                        formatValue={() => '00'}
                      />
                    )}
                  </div>
                );
              })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

/** Coordenada X de la pista para un valor de 0–100 (el centro del pulgar no sale de la pista). */
function clientXFor(root: HTMLElement, percent: number) {
  const track = root.querySelector<HTMLElement>('[data-figma-part="Shape"]')!.getBoundingClientRect();
  const thumb = root.querySelector<HTMLElement>('[role="slider"]')!.offsetHeight;
  return track.left + thumb / 2 + ((track.width - thumb) * percent) / 100;
}

function rootOf(canvasElement: HTMLElement) {
  return canvasElement.querySelector<HTMLElement>('[data-figma-part="Shape"]')!.parentElement!;
}

/** Test: rol slider con nombre y valores ARIA; flechas, RePág/AvPág, Inicio/Fin; onValueChange y onValueCommit */
export const KeyboardTest: Story = {
  tags: ['!autodocs'],
  args: { 'aria-label': 'Volumen', defaultValue: 40, onValueChange: fn(), onValueCommit: fn(), formatValue: (v: number) => `${v} %` },
  play: async ({ args, canvasElement }) => {
    const slider = within(canvasElement).getByRole('slider', { name: 'Volumen' });
    await expect(slider).toHaveAttribute('aria-valuemin', '0');
    await expect(slider).toHaveAttribute('aria-valuemax', '100');
    await expect(slider).toHaveAttribute('aria-valuenow', '40');
    await expect(slider).toHaveAttribute('aria-valuetext', '40 %');
    await userEvent.tab();
    await expect(slider).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(slider).toHaveAttribute('aria-valuenow', '41');
    await userEvent.keyboard('{ArrowUp}');
    await expect(slider).toHaveAttribute('aria-valuenow', '42');
    await userEvent.keyboard('{ArrowLeft}{ArrowDown}');
    await expect(slider).toHaveAttribute('aria-valuenow', '40');
    await userEvent.keyboard('{PageUp}');
    await expect(slider).toHaveAttribute('aria-valuenow', '50');
    await userEvent.keyboard('{PageDown}{PageDown}');
    await expect(slider).toHaveAttribute('aria-valuenow', '30');
    await userEvent.keyboard('{End}');
    await expect(slider).toHaveAttribute('aria-valuenow', '100');
    await userEvent.keyboard('{ArrowRight}');
    await expect(slider).toHaveAttribute('aria-valuenow', '100');
    await userEvent.keyboard('{Home}');
    await expect(slider).toHaveAttribute('aria-valuenow', '0');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(0);
    await expect(args.onValueCommit).toHaveBeenLastCalledWith(0);
    // El tope (ArrowRight en 100) no cuenta como cambio
    await expect(args.onValueChange).toHaveBeenCalledTimes(9);
  },
};

/** Test: rango con grupo nombrado, un nombre por pulgar y pulgares que no se cruzan */
export const RangeKeyboardTest: Story = {
  tags: ['!autodocs'],
  render: () => <Slider aria-label="Precio" defaultValue={[20, 60]} step={5} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('group', { name: 'Precio' })).toBeInTheDocument();
    const low = canvas.getByRole('slider', { name: 'Mínimo' });
    const high = canvas.getByRole('slider', { name: 'Máximo' });
    await expect(low).toHaveAttribute('aria-valuemax', '60');
    await expect(high).toHaveAttribute('aria-valuemin', '20');
    low.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(low).toHaveAttribute('aria-valuenow', '25');
    await expect(high).toHaveAttribute('aria-valuemin', '25');
    // Fin lleva el mínimo hasta el máximo, no más allá
    await userEvent.keyboard('{End}{PageUp}');
    await expect(low).toHaveAttribute('aria-valuenow', '60');
    await userEvent.tab();
    await expect(high).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(high).toHaveAttribute('aria-valuenow', '60');
    await userEvent.keyboard('{End}');
    await expect(high).toHaveAttribute('aria-valuenow', '100');
    await expect(low).toHaveAttribute('aria-valuemax', '100');
  },
};

/** Test: clic en la pista mueve el pulgar; el arrastre lo sigue y onValueCommit llega una vez al soltar */
export const PointerTest: Story = {
  tags: ['!autodocs'],
  args: { 'aria-label': 'Volumen', defaultValue: 10, onValueChange: fn(), onValueCommit: fn() },
  play: async ({ args, canvasElement }) => {
    const root = rootOf(canvasElement);
    const slider = within(canvasElement).getByRole('slider', { name: 'Volumen' });
    const y = root.getBoundingClientRect().top + 3;
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: root, coords: { clientX: clientXFor(root, 75), clientY: y } },
      { target: root, coords: { clientX: clientXFor(root, 30), clientY: y } },
      { target: root, coords: { clientX: clientXFor(root, 25), clientY: y } },
      { keys: '[/MouseLeft]', target: root, coords: { clientX: clientXFor(root, 25), clientY: y } },
    ]);
    await expect(args.onValueChange).toHaveBeenNthCalledWith(1, 75);
    await expect(args.onValueChange).toHaveBeenNthCalledWith(2, 30);
    await expect(slider).toHaveFocus();
    await expect(slider).toHaveAttribute('aria-valuenow', '25');
    await expect(args.onValueCommit).toHaveBeenCalledTimes(1);
    await expect(args.onValueCommit).toHaveBeenLastCalledWith(25);
    // Fuera de la pista el valor se queda en el extremo
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: root, coords: { clientX: clientXFor(root, 120), clientY: y } },
      { keys: '[/MouseLeft]', target: root, coords: { clientX: clientXFor(root, 120), clientY: y } },
    ]);
    await expect(slider).toHaveAttribute('aria-valuenow', '100');
  },
};

/** Test: en un rango, el clic mueve el pulgar más cercano y el arrastre no lo deja cruzar al otro */
export const RangePointerTest: Story = {
  tags: ['!autodocs'],
  render: () => <Slider aria-label="Precio" defaultValue={[20, 60]} />,
  play: async ({ canvasElement }) => {
    const root = rootOf(canvasElement);
    const canvas = within(canvasElement);
    const low = canvas.getByRole('slider', { name: 'Mínimo' });
    const high = canvas.getByRole('slider', { name: 'Máximo' });
    const y = root.getBoundingClientRect().top + 3;
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: root, coords: { clientX: clientXFor(root, 70), clientY: y } },
      { keys: '[/MouseLeft]', target: root, coords: { clientX: clientXFor(root, 70), clientY: y } },
    ]);
    await expect(high).toHaveAttribute('aria-valuenow', '70');
    await expect(low).toHaveAttribute('aria-valuenow', '20');
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: root, coords: { clientX: clientXFor(root, 30), clientY: y } },
      { target: root, coords: { clientX: clientXFor(root, 90), clientY: y } },
      { keys: '[/MouseLeft]', target: root, coords: { clientX: clientXFor(root, 90), clientY: y } },
    ]);
    await expect(low).toHaveAttribute('aria-valuenow', '70');
    await expect(high).toHaveAttribute('aria-valuenow', '70');
  },
};

/** Test: disabled no recibe foco por Tab ni cambia con teclado o puntero; los inputs ocultos no se envían */
export const DisabledTest: Story = {
  tags: ['!autodocs'],
  args: { 'aria-label': 'Volumen', defaultValue: 30, disabled: true, name: 'volumen', onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const root = rootOf(canvasElement);
    const slider = within(canvasElement).getByRole('slider', { name: 'Volumen' });
    await expect(slider).toHaveAttribute('aria-disabled', 'true');
    await expect(slider).toHaveAttribute('tabindex', '-1');
    slider.focus();
    await userEvent.keyboard('{ArrowRight}');
    const y = root.getBoundingClientRect().top + 3;
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: root, coords: { clientX: clientXFor(root, 80), clientY: y } },
      { keys: '[/MouseLeft]', target: root, coords: { clientX: clientXFor(root, 80), clientY: y } },
    ]);
    await expect(slider).toHaveAttribute('aria-valuenow', '30');
    await expect(args.onValueChange).not.toHaveBeenCalled();
    await expect(canvasElement.querySelector('input[name="volumen"]')).toBeDisabled();
  },
};

/** Test: `name` agrega un input oculto por pulgar con el valor vigente */
export const FormTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <form aria-label="Filtros">
      <Slider aria-label="Precio" name="precio" defaultValue={[20, 60]} />
    </form>
  ),
  play: async ({ canvasElement }) => {
    const form = within(canvasElement).getByRole('form', { name: 'Filtros' }) as HTMLFormElement;
    await expect(new FormData(form).getAll('precio')).toEqual(['20', '60']);
    within(canvasElement).getByRole('slider', { name: 'Máximo' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(new FormData(form).getAll('precio')).toEqual(['20', '61']));
  },
};

/** Test: el valor visible del pulgar usa formatValue y no se lee dos veces (aria-valuetext ya lo anuncia) */
export const ValueTextTest: Story = {
  tags: ['!autodocs'],
  args: { 'aria-label': 'Brillo', defaultValue: 60, showValue: true, formatValue: (v: number) => `${v}` },
  play: async ({ canvasElement }) => {
    const slider = within(canvasElement).getByRole('slider', { name: 'Brillo' });
    const text = slider.querySelector('[data-figma-part="00"]')!;
    await expect(text).toHaveTextContent('60');
    await expect(text).toHaveAttribute('aria-hidden', 'true');
    await expect(slider).toHaveAttribute('aria-valuetext', '60');
  },
};

/** Test: con los dos pulgares juntos, el arrastre mueve el del lado hacia el que va (C3). */
export const TiedThumbsTest: Story = {
  tags: ['!autodocs'],
  render: () => <Slider aria-label="Precio" defaultValue={[60, 60]} />,
  play: async ({ canvasElement }) => {
    const root = rootOf(canvasElement);
    const canvas = within(canvasElement);
    const low = canvas.getByRole('slider', { name: 'Mínimo' });
    const high = canvas.getByRole('slider', { name: 'Máximo' });
    const y = root.getBoundingClientRect().top + 3;
    // Desde el punto donde están los dos, hacia la derecha: el máximo
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: low, coords: { clientX: clientXFor(root, 60), clientY: y } },
      { target: root, coords: { clientX: clientXFor(root, 80), clientY: y } },
      { keys: '[/MouseLeft]', target: root, coords: { clientX: clientXFor(root, 80), clientY: y } },
    ]);
    await expect(low).toHaveAttribute('aria-valuenow', '60');
    await expect(high).toHaveAttribute('aria-valuenow', '80');
    await expect(high).toHaveFocus();
    // Juntos otra vez (en 80) y hacia la izquierda: el mínimo
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: low, coords: { clientX: clientXFor(root, 60), clientY: y } },
      { target: root, coords: { clientX: clientXFor(root, 80), clientY: y } },
      { keys: '[/MouseLeft]', target: root, coords: { clientX: clientXFor(root, 80), clientY: y } },
    ]);
    await expect(low).toHaveAttribute('aria-valuenow', '80');
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: high, coords: { clientX: clientXFor(root, 80), clientY: y } },
      { target: root, coords: { clientX: clientXFor(root, 30), clientY: y } },
      { keys: '[/MouseLeft]', target: root, coords: { clientX: clientXFor(root, 30), clientY: y } },
    ]);
    await expect(low).toHaveAttribute('aria-valuenow', '30');
    await expect(high).toHaveAttribute('aria-valuenow', '80');
    await expect(low).toHaveFocus();
  },
};

/** Test: de derecha a izquierda, la flecha derecha baja el valor y el pulgar se coloca desde la derecha (C21). */
export const RtlTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div dir="rtl" className="w-80">
      <Slider aria-label="Volumen" defaultValue={25} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const slider = within(canvasElement).getByRole('slider', { name: 'Volumen' });
    const track = rootOf(canvasElement).getBoundingClientRect();
    const thumb = slider.getBoundingClientRect();
    // A 25 % el centro del pulgar está más cerca del borde derecho
    await expect(track.right - (thumb.left + thumb.width / 2)).toBeLessThan(track.width / 2);
    slider.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(slider).toHaveAttribute('aria-valuenow', '24');
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    await expect(slider).toHaveAttribute('aria-valuenow', '26');
  },
};
