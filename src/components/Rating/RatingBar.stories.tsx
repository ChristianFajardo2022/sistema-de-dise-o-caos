import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { RatingBar } from './RatingBar';
import type { RatingBarDisplay, RatingBarItem } from './Rating.types';

const DISPLAY_OPTIONS: RatingBarDisplay[] = ['percentage', 'count'];

/** Datos de muestra: 200 reseñas en total */
const DISTRIBUTION: RatingBarItem[] = [
  { stars: 5, count: 200 },
  { stars: 4, count: 150 },
  { stars: 3, count: 100 },
  { stars: 2, count: 50 },
  { stars: 1, count: 0 },
];

/** Ancho de Figma (312) */
const narrow: Decorator = (Story) => (
  <div className="w-[312px] max-w-full">
    <Story />
  </div>
);

const meta = {
  title: 'Data Display/Rating/RatingBar',
  component: RatingBar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    display: { name: 'display', control: 'radio', options: DISPLAY_OPTIONS, type: { name: 'enum', value: DISPLAY_OPTIONS }, description: 'Texto de cada fila' },
    label: { control: 'text', type: { name: 'string' }, description: 'Nombre accesible de la lista' },
  },
  args: { distribution: DISTRIBUTION, display: 'percentage', label: 'Reseñas por calificación' },
} satisfies Meta<typeof RatingBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = { decorators: [narrow] };

/** Con la cantidad de reseñas en lugar del porcentaje. */
export const Count: Story = {
  decorators: [narrow],
  args: {
    display: 'count',
    distribution: [
      { stars: 5, count: 1280 },
      { stars: 4, count: 640 },
      { stars: 3, count: 120 },
      { stars: 2, count: 30 },
      { stars: 1, count: 12 },
    ],
  },
};

/** Valores de muestra de Figma: 100 %, 75 %, 50 %, 25 % y 0 % (con `total` fijo, cada fila es independiente). */
export const FigmaMatrix: Story = {
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <RatingBar
        className="w-[312px]"
        label="Reseñas por calificación"
        total={4}
        distribution={[
          { stars: 5, count: 4 },
          { stars: 4, count: 3 },
          { stars: 3, count: 2 },
          { stars: 2, count: 1 },
          { stars: 1, count: 0 },
        ]}
        data-figma="Propiedad 1=Predeterminada"
      />
    </div>
  ),
};

/** Test: lista con nombre, una barra con nombre por fila y valores */
export const AccessibleNameTest: Story = {
  tags: ['!autodocs'],
  decorators: [narrow],
  render: (args) => <RatingBar {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('list', { name: 'Reseñas por calificación' })).toBeInTheDocument();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(5);
    const five = canvas.getByRole('progressbar', { name: '5 estrellas' });
    await expect(five).toHaveAttribute('aria-valuetext', '40%');
    await expect(canvas.getByRole('progressbar', { name: '1 estrella' })).toHaveAttribute('aria-valuetext', '0%');
  },
};
