import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { ScanPoints } from './ScanPoints';

const STEPS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const meta = {
  title: 'Feedback/Scan/ScanPoints',
  component: ScanPoints,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    step: { control: { type: 'range', min: 0, max: 8, step: 1 }, type: { name: 'number' }, description: 'Fotograma fijo 0-8 (Propiedad 1 de Figma)' },
    animated: { control: 'boolean', type: { name: 'boolean' }, description: 'Recorre los fotogramas en bucle; se apaga con prefers-reduced-motion' },
    label: { control: 'text', type: { name: 'string' }, description: 'Texto para lectores de pantalla (sin él es decorativo)' },
  },
  args: { step: 8, animated: true },
  // Las piezas son blancas fijas (unicolor): van sobre la vista oscura de la cámara, en ambos temas
  decorators: [
    (Story) => (
      <div data-theme="dark" className="bg-ds-background-general-black p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScanPoints>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

/** Fotograma fijo, como queda con reducción de movimiento. */
export const Static: Story = { args: { animated: false, step: 4 } };

// Figma: 19548:38784
/** Los 9 fotogramas del set de Figma, uno por variante. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div data-theme="dark" className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de ScanPoints" className="max-w-full overflow-x-auto">
        <div className="flex gap-8">
          {STEPS.map((n) => (
            <div key={n} className="flex flex-col items-start gap-ds-space-general-md">
              <span className="text-xs text-ds-text-neutral-body">{n}</span>
              <ScanPoints data-figma={`Propiedad 1=${n}`} step={n} animated={false} />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

/** Test: con label es una imagen con nombre; sin label es decorativo (oculto al lector). */
export const AccessibleNameTest: Story = {
  tags: ['!autodocs'],
  args: { label: 'Puntos de captura del rostro', animated: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('img', { name: 'Puntos de captura del rostro' })).toBeInTheDocument();
  },
};

export const DecorativeTest: Story = {
  tags: ['!autodocs'],
  args: { animated: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('img')).toBeNull();
    await expect(canvasElement.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  },
};
