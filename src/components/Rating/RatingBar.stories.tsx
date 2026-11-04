import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { RatingBar } from './RatingBar';
import type { RatingBarDisplay, RatingBarItem } from './Rating.types';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './RatingBar.doc';
import docsJson from './RatingBar.docs.json';

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
  parameters: { layout: 'padded', docs: componentDocsParameters(doc, docsJson), docsLive: { story: 'Interactive' } },
  tags: ['autodocs'],
  argTypes: argTypesFromDocsJson(docsJson, {
    display: { name: 'display', control: 'radio', options: DISPLAY_OPTIONS, type: { name: 'enum', value: DISPLAY_OPTIONS }, description: 'Texto de cada fila' },
    total: { control: { type: 'number', min: 1 }, description: 'Total que equivale al 100%. Al menos la suma de las filas' },
    label: { control: 'text', type: { name: 'string' }, description: 'Nombre accesible de la lista' },
  }),
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

/** Test: la página de documentación (plantilla v2) con sus pestañas y secciones */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'RatingBar' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente RatingBar en Figma:']);
    await userEvent.click(tabs[1]);
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de RatingBar' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
