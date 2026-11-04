import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { NumberRating } from './NumberRating';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './NumberRating.doc';
import docsJson from './NumberRating.docs.json';

/** Un `value` vacío o no numérico (campo borrado en Personalizar) se dibuja como 0, no como "NaN". */
function safeArgs<T extends { value?: unknown }>(args: T): T {
  return { ...args, value: typeof args.value === 'number' && Number.isFinite(args.value) ? args.value : 0 };
}

const meta = {
  title: 'Data Display/Rating/NumberRating',
  component: NumberRating,
  parameters: { layout: 'padded', docs: componentDocsParameters(doc, docsJson), docsLive: { args: safeArgs } },
  tags: ['autodocs'],
  argTypes: argTypesFromDocsJson(docsJson, {
    value: { control: { type: 'range', min: 0, max: 5, step: 0.1 }, type: { name: 'number' }, min: 0, max: 5, step: 0.1 },
    total: { control: 'number', type: { name: 'number' } },
    label: { control: 'text', type: { name: 'string' } },
  }),
  args: { value: 4.5 },
} satisfies Meta<typeof NumberRating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = { render: (args) => <NumberRating {...safeArgs(args)} /> };

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

export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'NumberRating' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente NumberRating en Figma:']);
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Desarrollo', 'Props', 'Ejemplos de uso']);
    const props = canvas.getByRole('table', { name: 'Props de NumberRating' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
