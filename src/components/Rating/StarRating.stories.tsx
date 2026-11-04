import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, fn } from 'storybook/test';
import { StarRating } from './StarRating';
import type { StarRatingSize } from './Rating.types';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './StarRating.doc';
import docsJson from './StarRating.docs.json';

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
  // El lienzo de Desarrollo usa Interactive: `value` pasa a `defaultValue` para que `readOnly` y `disabled` se noten
  parameters: {
    layout: 'padded',
    docs: componentDocsParameters(doc, docsJson),
    docsLive: {
      story: 'Interactive',
      args: ({ value, ...rest }: Record<string, unknown>) => ({ ...rest, defaultValue: value ?? 0 }),
      exclude: ['defaultValue', 'onChange'],
    },
  },
  tags: ['autodocs'],
  argTypes: argTypesFromDocsJson(docsJson, {
    size: { name: 'size', control: 'radio', options: SIZE_OPTIONS, type: { name: 'enum', value: SIZE_OPTIONS }, description: 'Size de Figma: sm = 20 px, md = 32 px' },
    value: { control: { type: 'range', min: 0, max: 5, step: 1 }, type: { name: 'number' }, description: 'Puntaje de 0 a 5 (State de Figma)' },
    readOnly: { control: 'boolean', type: { name: 'boolean' }, description: 'Fuerza el modo de solo lectura' },
    disabled: { control: 'boolean', type: { name: 'boolean' }, description: 'Deshabilita las estrellas. Solo aplica en modo interactivo: con readOnly no cambia nada' },
    label: { control: 'text', type: { name: 'string' }, description: 'Nombre accesible' },
  }),
  args: { size: 'sm', value: 4 },
} satisfies Meta<typeof StarRating>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Alimenta el lienzo de Desarrollo: `value` es el puntaje inicial de un grupo interactivo (cambia al hacer clic y al
 * mover el control). Con `readOnly` queda en solo lectura (`role="img"`).
 */
export const Interactive: Story = {
  render: ({ value, ...args }) => <StarRating key={value} {...args} defaultValue={value ?? 0} />,
};

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

export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'StarRating' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente StarRating en Figma:']);
    // Marcadores de la anatomía: uno por pauta (3 + 2 + 4)
    await expect(canvasElement.querySelectorAll('[data-doc-mark]')).toHaveLength(9);
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de StarRating' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
