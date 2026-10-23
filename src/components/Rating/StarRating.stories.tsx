import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, fn } from 'storybook/test';
import { StarRating } from './StarRating';
import type { StarRatingSize } from './Rating.types';

const SIZES: { size: StarRatingSize; figma: string }[] = [
  { size: 'sm', figma: '20px' },
  { size: 'md', figma: '32px' },
];
const SIZE_OPTIONS: StarRatingSize[] = ['sm', 'md'];

function Controlled(args: React.ComponentProps<typeof StarRating>) {
  const [v, setV] = useState(3);
  return (
    <div className="flex flex-col gap-3">
      <StarRating {...args} value={v} onChange={setV} />
      <span className="text-xs text-ds-text-neutral-body">Valor: {v}</span>
    </div>
  );
}

const meta = {
  title: 'Data Display/Rating/StarRating',
  component: StarRating,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    size: { name: 'size', control: 'radio', options: SIZE_OPTIONS, type: { name: 'enum', value: SIZE_OPTIONS }, description: 'Size de Figma: sm = 20px, md = 32px' },
    value: { control: { type: 'range', min: 0, max: 5, step: 1 }, type: { name: 'number' }, description: 'Puntaje de 0 a 5 (State de Figma)' },
    readOnly: { control: 'boolean', type: { name: 'boolean' }, description: 'Fuerza el modo de solo lectura' },
    disabled: { control: 'boolean', type: { name: 'boolean' }, description: 'Deshabilita (modo interactivo)' },
    label: { control: 'text', type: { name: 'string' }, description: 'Nombre accesible' },
  },
  args: { size: 'sm', value: 4 },
} satisfies Meta<typeof StarRating>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Solo lectura: `role="img"` con "4 de 5 estrellas". */
export const Interactive: Story = {};

/** Modo interactivo controlado: grupo de radios con previsualización al pasar el puntero. */
export const Selectable: Story = {
  render: (args) => <Controlled {...args} size="md" />,
};

export const Disabled: Story = {
  args: { defaultValue: 2, disabled: true, size: 'md' },
};

/** Un promedio decimal se dibuja redondeado, pero el nombre accesible conserva el valor real. */
export const Decimal: Story = {
  args: { value: 4.5, size: 'md' },
};

/** Las 12 variantes de Figma (Size × State), cada una una vez. */
export const FigmaMatrix: Story = {
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div className="flex flex-col items-start gap-6">
        {SIZES.map((s) =>
          [0, 1, 2, 3, 4, 5].map((n) => (
            <StarRating
              key={`${s.size}-${n}`}
              size={s.size}
              value={n}
              data-figma={`Size=${s.figma}, State=${n}`}
            />
          ))
        )}
      </div>
    </div>
  ),
};

/** Test: solo lectura con rol img y nombre accesible */
export const ReadOnlyTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex flex-col gap-3">
      <StarRating value={4} />
      <StarRating value={4.5} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('img', { name: '4 de 5 estrellas' })).toBeInTheDocument();
    await expect(canvas.getByRole('img', { name: '4,5 de 5 estrellas' })).toBeInTheDocument();
  },
};

/** Test: teclado como Radio Group (Tab entra, flechas seleccionan) y clic */
export const KeyboardTest: Story = {
  tags: ['!autodocs'],
  render: () => <StarRating label="Tu calificación" onChange={fn()} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole('radiogroup', { name: 'Tu calificación' });
    await expect(group).toBeInTheDocument();
    const radios = canvas.getAllByRole('radio');
    await expect(radios).toHaveLength(5);
    await userEvent.tab();
    await expect(radios[0]).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    await expect(canvas.getByRole('radio', { name: '3 estrellas' })).toBeChecked();
    await userEvent.click(canvas.getByRole('radio', { name: '5 estrellas' }));
    await expect(canvas.getByRole('radio', { name: '5 estrellas' })).toBeChecked();
  },
};

/** Test: deshabilitado no responde */
export const DisabledTest: Story = {
  tags: ['!autodocs'],
  render: () => <StarRating defaultValue={2} disabled />,
  play: async ({ canvasElement }) => {
    const radios = within(canvasElement).getAllByRole('radio');
    for (const r of radios) await expect(r).toBeDisabled();
    await expect(radios[1]).toBeChecked();
  },
};
