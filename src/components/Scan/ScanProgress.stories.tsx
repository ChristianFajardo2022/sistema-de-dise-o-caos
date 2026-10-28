import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { ScanProgress } from './ScanProgress';

const VALUES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

const meta = {
  title: 'Feedback/Scan/ScanProgress',
  component: ScanProgress,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 }, type: { name: 'number' }, description: 'Avance 0-100' },
    complete: { control: 'boolean', type: { name: 'boolean' }, description: 'Estado terminado (Variante12 de Figma)' },
    label: { control: 'text', type: { name: 'string' }, description: 'Nombre accesible' },
    showValue: { control: 'boolean', type: { name: 'boolean' }, description: 'Porcentaje visible en el centro' },
  },
  args: { value: 60, complete: false, showValue: true, label: 'Progreso del escaneo' },
  // Texto blanco fijo (unicolor): se muestra sobre fondo oscuro en ambos temas
  decorators: [
    (Story) => (
      <div data-theme="dark" className="bg-ds-background-general-black p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScanProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

export const Complete: Story = { args: { complete: true } };

/** Las 12 variantes del set 21258:21640: 0 a 100 % y el estado terminado (Variante12). */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div data-theme="dark" className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de ScanProgress" className="max-w-full overflow-x-auto">
        <div className="grid grid-cols-[repeat(6,auto)] justify-start gap-8">
          {VALUES.map((v) => (
            <ScanProgress key={v} data-figma={`Propiedad 1=${v}`} value={v} label={`Progreso ${v} %`} />
          ))}
          <ScanProgress data-figma="Propiedad 1=Variante12" complete label="Escaneo completado" />
        </div>
      </div>
    </div>
  ),
};

/** Test: rol progressbar con nombre, valor y texto de valor. */
export const ProgressbarTest: Story = {
  tags: ['!autodocs'],
  args: { value: 45.4 },
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole('progressbar', { name: 'Progreso del escaneo' });
    await expect(bar).toHaveAttribute('aria-valuenow', '45');
    await expect(bar).toHaveAttribute('aria-valuemin', '0');
    await expect(bar).toHaveAttribute('aria-valuemax', '100');
    await expect(bar).toHaveAttribute('aria-valuetext', '45 %');
  },
};

export const CompleteTest: Story = {
  tags: ['!autodocs'],
  args: { complete: true, value: 10 },
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole('progressbar');
    await expect(bar).toHaveAttribute('aria-valuenow', '100');
    await expect(bar).toHaveAttribute('aria-valuetext', 'Completado');
  },
};
