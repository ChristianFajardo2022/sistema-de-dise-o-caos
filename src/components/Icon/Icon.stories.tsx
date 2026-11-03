import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Icon } from './Icon';
import { ICON_SIZES } from './Icon.types';
import { caosIcons } from '../../icons/caos/registry.generated';
import type { IconName } from '../../icons/caos/registry.generated';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './Icon.doc';
import docsJson from './Icon.docs.json';

const NAMES = Object.keys(caosIcons) as IconName[];

const meta: Meta<typeof Icon> = {
  title: 'General Controls/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: { docs: componentDocsParameters(doc, docsJson) },
  argTypes: argTypesFromDocsJson(docsJson, {
    name: { control: 'select', options: NAMES, description: 'Nombre del ícono (409)' },
    // Tipos explícitos: sin ellos el docgen muestra `unknown[number]` para size
    size: {
      type: { name: 'enum', value: [...ICON_SIZES] },
      control: 'select',
      options: [...ICON_SIZES],
      description: 'Tamaño de Figma. Por defecto 24',
    },
    variant: {
      type: { name: 'enum', value: ['line', 'fill'] },
      control: 'radio',
      options: [undefined, 'line', 'fill'],
      description: 'Por defecto: relleno por debajo de 24 px, línea desde 24 px',
    },
    'aria-label': { control: 'text', description: 'Sin él, el ícono es decorativo' },
  }),
  args: { name: 'search', size: 24 },
  decorators: [
    (Story) => (
      <div className="text-ds-text-neutral-body">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

/** Tamaños de Figma con la variante por defecto (relleno < 24, línea desde 24) */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-x-ds-space-general-4xl gap-y-ds-space-general-2xl">
      {ICON_SIZES.map((size) => (
        <div key={size} className="flex flex-col items-center gap-ds-space-general-md">
          <Icon name="search" size={size} />
          <span className="text-ds-primitives-typography-size-sm">{size}</span>
        </div>
      ))}
    </div>
  ),
};

/** Línea frente a relleno en tres íconos y varios tamaños */
export const LineVsFill: Story = {
  render: () => (
    <div className="grid grid-cols-[auto_repeat(3,auto)] items-center gap-x-ds-space-general-6xl gap-y-ds-space-general-2xl">
      <span />
      {(['search', 'add', 'trash'] as const).map((n) => (
        <span key={n} className="text-ds-primitives-typography-size-sm">{n}</span>
      ))}
      {(['line', 'fill'] as const).flatMap((variant) =>
        [16, 24, 32].map((size) => (
          <div key={`${variant}-${size}`} className="contents">
            <span className="text-ds-primitives-typography-size-sm">{variant} · {size}</span>
            {(['search', 'add', 'trash'] as const).map((n) => (
              <Icon key={n} name={n} size={size as 16 | 24 | 32} variant={variant} />
            ))}
          </div>
        ))
      )}
    </div>
  ),
};

/** Test: decorativo por defecto, con el path dibujado */
export const DecorativeTest: Story = {
  tags: ['!autodocs'],
  render: () => <div data-testid="w"><Icon name="search" /></div>,
  play: async ({ canvasElement }) => {
    const svg = within(canvasElement).getByTestId('w').querySelector('svg')!;
    await expect(svg).toHaveAttribute('aria-hidden', 'true');
    await expect(svg).toHaveAttribute('focusable', 'false');
    await expect(svg.querySelector('path')).not.toBeNull();
  },
};

/** Test: con aria-label es role=img */
export const LabelledTest: Story = {
  tags: ['!autodocs'],
  args: { name: 'trash', 'aria-label': 'Eliminar' },
  play: async ({ canvasElement }) => {
    const img = within(canvasElement).getByRole('img', { name: 'Eliminar' });
    await expect(img).not.toHaveAttribute('aria-hidden');
  },
};

/** Test: la variante por defecto sigue el tamaño y variant la sobrescribe */
export const VariantRuleTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div data-testid="w">
      <Icon name="add" size={16} />
      <Icon name="add" size={24} />
      <Icon name="add" size={16} variant="line" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    // El navegador reserializa el marcado: se comparan los trazados (atributo d)
    const paths = (markup: string) => Array.from(markup.matchAll(/ d="([^"]*)"/g), (m) => m[1]);
    const ds = (svg: SVGSVGElement) => Array.from(svg.querySelectorAll('path'), (p) => p.getAttribute('d'));
    const [a, b, c] = Array.from(canvasElement.querySelectorAll('svg'));
    await expect(ds(a)).toEqual(paths(caosIcons.add.fill));
    await expect(ds(b)).toEqual(paths(caosIcons.add.line));
    await expect(ds(c)).toEqual(paths(caosIcons.add.line));
  },
};

/** Test: la página de documentación (plantilla v2) con sus pestañas y secciones */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Icon' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Icon en Figma:']);
    await expect(canvas.getByRole('switch', { name: 'Modo oscuro' })).toBeInTheDocument();
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Desarrollo', 'Props', 'Ejemplos de uso']);
    const props = canvas.getByRole('table', { name: 'Props de Icon' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
    await expect(within(props).queryByRole('switch')).not.toBeInTheDocument();
  },
};
