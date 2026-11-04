import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { RatingFilter } from './RatingFilter';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { buildCode } from '../../docs/liveCode';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './RatingFilter.doc';
import docsJson from './RatingFilter.docs.json';

const NO_FILTER = 'Sin filtro';
const INITIAL_OPTIONS = [NO_FILTER, '2', '3', '4', '5'];
/** El control ofrece "Sin filtro" y 2 a 5 como texto; el componente recibe `null` o el número. */
const toValue = (initial: unknown): number | null => (typeof initial === 'string' && initial !== NO_FILTER ? Number(initial) : typeof initial === 'number' ? initial : null);

const meta = {
  title: 'Form Controls/RatingFilter',
  component: RatingFilter,
  // Personalizar usa Interactive: `defaultValue` es la calificación inicial (null = sin filtro) y `value` queda fuera
  // porque volvería controlado al componente
  parameters: {
    layout: 'centered',
    docs: componentDocsParameters(doc, docsJson),
    docsLive: {
      story: 'Interactive',
      args: ({ defaultValue, ...rest }: Record<string, unknown>) => ({ ...rest, defaultValue: toValue(defaultValue) }),
      code: ({ defaultValue, ...args }: Record<string, unknown>) =>
        buildCode('RatingFilter', defaultValue === null ? args : { ...args, defaultValue }, { label: 'Calificación mínima', disabled: false }).replace(
          '<RatingFilter',
          '<RatingFilter onValueChange={(value) => setValue(value)}'
        ),
      exclude: ['value', 'onValueChange', 'aria-labelledby'],
    },
  },
  tags: ['autodocs'],
  decorators: [(Story, { parameters }) => (parameters.sinMarco ? <Story /> : <div className="w-76"><Story /></div>)],
  argTypes: argTypesFromDocsJson(docsJson, {
    defaultValue: {
      control: 'select',
      options: INITIAL_OPTIONS,
      type: { name: 'enum', value: INITIAL_OPTIONS },
      description: 'Calificación mínima inicial (no controlado): "Sin filtro" es null; de 2 a 5 estrellas (Type de Figma: Default, 1 a 4)',
    },
    disabled: { control: 'boolean', type: { name: 'boolean' } },
    label: { control: 'text', type: { name: 'string' } },
  }),
  args: { label: 'Calificación mínima', disabled: false },
} satisfies Meta<typeof RatingFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Alimenta el lienzo de Desarrollo: `defaultValue` es la calificación inicial; arranca sin filtro. */
export const Interactive: Story = {
  args: { defaultValue: NO_FILTER as unknown as null },
  render: ({ defaultValue, ...args }) => <RatingFilter key={String(defaultValue)} {...args} defaultValue={toValue(defaultValue)} />,
};

export const WithoutFilter: Story = { args: { defaultValue: null } };

/** Type=Default (sin filtro) y Type=1…4 de Figma (= 2…5 estrellas). */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded', sinMarco: true },
  render: () => (
    <div className="flex flex-wrap gap-8 bg-ds-background-general-black p-6">
      {(['Default', '1', '2', '3', '4'] as const).map((type) => (
        <div key={type} className="flex flex-col gap-2">
          <span className="text-xs text-ds-text-neutral-body">Type={type}</span>
          <RatingFilter
            className="w-75 max-w-full"
            value={type === 'Default' ? null : Number(type) + 1}
            label={`Calificación ${type}`}
            data-figma={`Type=${type}`}
          />
        </div>
      ))}
    </div>
  ),
};

/** Test: el slider es el control (flechas, Inicio, Fin) y las estrellas se pueden pulsar con el puntero. */
export const KeyboardTest: Story = {
  tags: ['!autodocs'],
  args: { defaultValue: null, onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const slider = within(canvasElement).getByRole('slider', { name: 'Calificación mínima' });
    await expect(slider).toHaveAttribute('aria-valuetext', 'Sin filtro');
    slider.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(2);
    await expect(slider).toHaveAttribute('aria-valuetext', '2 estrellas o más');
    await userEvent.keyboard('{End}');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(5);
    // Inicio vuelve a "Sin filtro" (no existe "1 estrella o más": toda calificación es ≥ 1)
    await userEvent.keyboard('{Home}');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(null);
    await expect(slider).toHaveAttribute('aria-valuetext', 'Sin filtro');
    // Clic en una estrella: atajo con puntero
    const stars = canvasElement.querySelector('[data-figma-part="Star rating"]')!;
    await userEvent.click(stars.children[2] as HTMLElement);
    await expect(args.onValueChange).toHaveBeenLastCalledWith(3);
    await expect(slider).toHaveAttribute('aria-valuetext', '3 estrellas o más');
    // La primera estrella equivale a la primera posición: sin filtro
    await userEvent.click(stars.children[0] as HTMLElement);
    await expect(args.onValueChange).toHaveBeenLastCalledWith(null);
    await expect(slider).toHaveAttribute('aria-valuetext', 'Sin filtro');
  },
};

export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', sinMarco: true },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'RatingFilter' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente RatingFilter en Figma:']);
    // Marcadores de la anatomía: uno por pauta (4 + 2)
    await expect(canvasElement.querySelectorAll('[data-doc-mark]')).toHaveLength(6);
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de RatingFilter' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
