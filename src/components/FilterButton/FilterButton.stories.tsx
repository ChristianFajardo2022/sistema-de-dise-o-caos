import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { FilterButton } from './FilterButton';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './FilterButton.doc';
import docsJson from './FilterButton.docs.json';

const meta = {
  title: 'Form Controls/FilterButton',
  component: FilterButton,
  parameters: { layout: 'centered', docs: componentDocsParameters(doc, docsJson) },
  tags: ['autodocs'],
  // Tipos explícitos en las uniones: sin ellos Storybook descarta los args de la URL
  argTypes: argTypesFromDocsJson(docsJson, {
    count: { control: 'number', type: { name: 'number' } },
    badge: { control: 'boolean', type: { name: 'boolean' } },
    disabled: { control: 'boolean', type: { name: 'boolean' } },
    layout: {
      control: 'radio',
      options: ['auto', 'desktop', 'mobile', 'icon'],
      type: { name: 'enum', value: ['auto', 'desktop', 'mobile', 'icon'] },
    },
    children: { control: 'text' },
  }),
  args: { children: 'Filtros', count: 3, badge: true, disabled: false, layout: 'auto', onClick: fn() },
} satisfies Meta<typeof FilterButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

export const WithoutFilters: Story = { args: { count: 0 } };

export const Mobile: Story = { args: { layout: 'mobile' } };

export const Icon: Story = { args: { layout: 'icon' } };

export const Inactive: Story = { args: { disabled: true } };

/** Type=Default e Inactive de Figma (marco Desktop; el marco Mobile está oculto en el set). */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-6 bg-ds-background-general-black p-6">
      {(['Default', 'Inactive'] as const).map((type) => (
        <div key={type} className="flex items-center gap-6">
          <span className="w-20 text-xs text-ds-text-neutral-body">Type={type}</span>
          <div data-figma={`Type=${type}`} className="inline-flex flex-col">
            <FilterButton layout="desktop" count="00" disabled={type === 'Inactive'} rootProps={{ 'data-figma-part': 'Desktop' }}>
              Button
            </FilterButton>
          </div>
          <span className="text-xs text-ds-text-neutral-body">Mobile</span>
          <FilterButton layout="mobile" count="00" disabled={type === 'Inactive'}>
            Button
          </FilterButton>
        </div>
      ))}
    </div>
  ),
};

/** Test: el número del badge describe al botón; clic y teclado lo activan. */
export const CountTest: Story = {
  tags: ['!autodocs'],
  args: { layout: 'desktop' },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Filtros' });
    await expect(button).toHaveAccessibleDescription('3 filtros aplicados');
    await userEvent.click(button);
    button.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

/** Test: en móvil es solo ícono pero conserva nombre y descripción; Inactive no se activa. */
export const MobileAndInactiveTest: Story = {
  tags: ['!autodocs'],
  args: { layout: 'mobile', disabled: true, count: 1 },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Filtros' });
    await expect(button).toHaveAccessibleDescription('1 filtro aplicado');
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

// Figma: 21923:89647
/** Type=Default e Icon+badge del set Icon button+Filters de Figma. */
export const FigmaMatrixIconButton: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex items-center gap-6 bg-ds-background-general-black p-6">
      <div data-figma="Type=Default" className="inline-flex">
        <FilterButton layout="icon" count={0} />
      </div>
      <div data-figma="Type=Icon+badge" className="inline-flex">
        <FilterButton layout="icon" count="99" />
      </div>
    </div>
  ),
};

/** Test: en layout icon el botón conserva nombre y descripción con el conteo. */
export const IconLayoutTest: Story = {
  tags: ['!autodocs'],
  args: { layout: 'icon', count: 3 },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Filtros' });
    await expect(button).toHaveAccessibleDescription('3 filtros aplicados');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalled();
  },
};

export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'FilterButton' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente FilterButton en Figma:']);
    await expect(canvas.getByRole('switch', { name: 'Modo oscuro' })).toBeInTheDocument();
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    // Con las flechas (activación automática)
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Desarrollo', 'Props', 'Ejemplos de uso']);
    // Sin Storybook no hay lienzo, código ni Personalizar: solo el bloque Props, de solo lectura
    const props = canvas.getByRole('table', { name: 'Props de FilterButton' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
    await expect(canvas.queryByRole('group', { name: 'Personalizar' })).not.toBeInTheDocument();
  },
};
