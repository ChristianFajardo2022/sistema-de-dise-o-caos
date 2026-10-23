import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { NumberRating } from './NumberRating';

const meta = {
  title: 'Data Display/Rating/NumberRating',
  component: NumberRating,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 5, step: 0.1 }, type: { name: 'number' }, description: 'Promedio de 0 a 5' },
    total: { control: 'number', type: { name: 'number' }, description: 'Total de reseñas (opcional)' },
    label: { control: 'text', type: { name: 'string' }, description: 'Nombre accesible' },
  },
  args: { value: 4.5 },
} satisfies Meta<typeof NumberRating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

export const WithTotal: Story = { args: { value: 4.5, total: 1280 } };

/** Nodo Number rating de Figma (4,5 + estrella). */
export const FigmaMatrix: Story = {
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <NumberRating value={4.5} data-figma="Number rating" />
    </div>
  ),
};

/** Test: una sola frase accesible con formato es */
export const AccessibleNameTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex flex-col gap-3">
      <NumberRating value={4.5} />
      <NumberRating value={4} total={1280} />
      <NumberRating value={5} total={1} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('img', { name: '4,5 de 5 estrellas' })).toBeInTheDocument();
    await expect(canvas.getByRole('img', { name: '4 de 5 estrellas, 1280 reseñas' })).toBeInTheDocument();
    await expect(canvas.getByRole('img', { name: '5 de 5 estrellas, 1 reseña' })).toBeInTheDocument();
  },
};
