import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { ScrollArea } from './ScrollArea';
import type { ScrollAreaOrientation } from './ScrollArea.types';

const ORIENTATION_OPTIONS: ScrollAreaOrientation[] = ['vertical', 'horizontal', 'both'];

const LINES = Array.from({ length: 24 }, (_, i) => `Línea ${i + 1} del contenido desplazable`);

const Content = ({ wide }: { wide?: boolean }) => (
  <ul className={`m-0 list-none p-0 text-sm text-ds-text-neutral-body ${wide ? 'w-[60rem]' : ''}`}>
    {LINES.map((line) => (
      <li key={line} className="py-1">{line}</li>
    ))}
  </ul>
);

const meta = {
  title: 'Layout/Scroll area',
  component: ScrollArea,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      name: 'orientation',
      control: 'radio',
      options: ORIENTATION_OPTIONS,
      type: { name: 'enum', value: ORIENTATION_OPTIONS },
      description: 'Eje de desplazamiento',
    },
    maxHeight: { control: 'text', type: { name: 'string' }, description: 'Alto máximo (CSS)' },
    'aria-label': { control: 'text', type: { name: 'string' }, description: 'Nombre accesible de la región' },
  },
  args: { orientation: 'vertical', maxHeight: '314px', 'aria-label': 'Contenido desplazable' },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: (args) => (
    <ScrollArea {...args} className="w-72 max-w-full bg-ds-background-general-black p-ds-space-general-md">
      <Content wide={args.orientation !== 'vertical'} />
    </ScrollArea>
  ),
};

/**
 * Figma define un único componente "Scroll bar" (6×314, riel + pulgar de 71).
 * El primer bloque es una muestra estática con esas medidas (lo que mide el comparador);
 * el segundo es el ScrollArea real con la barra nativa estilizada. En el real, el alto
 * del pulgar lo calcula el navegador y no se puede fijar en 71.
 */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="max-w-full bg-ds-background-general-black p-6">
     <div role="region" tabIndex={0} aria-label="Matriz de Scroll area" className="max-w-full overflow-x-auto">
      <div className="flex items-start gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-ds-text-neutral-body">muestra Figma</span>
        <div
          data-figma="Scroll bar"
          aria-hidden="true"
          className="h-78.5 w-1.5 rounded-ds-radius-button-full bg-ds-background-general-gray-sixth"
        >
          <div data-figma-part="Scroll" className="h-17.75 w-1.5">
            <div
              data-figma-part="Bar"
              className="size-full rounded-ds-radius-button-full bg-ds-background-general-gray-firts"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-ds-text-neutral-body">ScrollArea</span>
        <ScrollArea maxHeight="314px" aria-label="Ejemplo de área con scroll" className="w-72 max-w-full p-ds-space-general-md">
          <Content />
        </ScrollArea>
      </div>
      </div>
     </div>
    </div>
  ),
};

export const Horizontal: Story = {
  args: { orientation: 'horizontal', maxHeight: undefined },
  render: (args) => (
    <ScrollArea {...args} className="w-72 max-w-full">
      <Content wide />
    </ScrollArea>
  ),
};

export const Both: Story = {
  args: { orientation: 'both' },
  render: (args) => (
    <ScrollArea {...args} className="w-72 max-w-full">
      <Content wide />
    </ScrollArea>
  ),
};

/** Test: sin desborde no es tabulable ni región */
export const NoOverflowTest: Story = {
  tags: ['!autodocs'],
  args: { 'aria-label': 'Lista corta' },
  render: (args) => (
    <div>
      <button type="button">Antes</button>
      <ScrollArea {...args} className="w-72 max-w-full" data-testid="short">
        <p className="m-0 text-sm text-ds-text-neutral-body">Contenido corto</p>
      </ScrollArea>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const area = canvas.getByTestId('short');
    await expect(area).not.toHaveAttribute('tabindex');
    await expect(canvas.queryByRole('region')).toBeNull();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Antes' })).toHaveFocus();
    await userEvent.tab();
    await expect(area).not.toHaveFocus();
  },
};

/** Test: con desborde es región con nombre, enfocable y desplazable con el teclado */
export const KeyboardScrollTest: Story = {
  tags: ['!autodocs'],
  args: { maxHeight: '8rem', 'aria-label': 'Lista larga' },
  render: (args) => (
    <ScrollArea {...args} className="w-72 max-w-full">
      <Content />
    </ScrollArea>
  ),
  play: async ({ canvasElement }) => {
    const region = await within(canvasElement).findByRole('region', { name: 'Lista larga' });
    await expect(region).toHaveAttribute('tabindex', '0');
    await userEvent.tab();
    await expect(region).toHaveFocus();
    await userEvent.keyboard('{PageDown}');
    await expect(region.scrollHeight).toBeGreaterThan(region.clientHeight);
  },
};
