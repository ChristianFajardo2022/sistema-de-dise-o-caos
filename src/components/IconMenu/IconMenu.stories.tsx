import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { IconMenu } from './IconMenu';
import type { IconMenuVariant } from './IconMenu.types';

const meta = {
  title: 'Navigation/Icon menu',
  component: IconMenu,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['menu', 'half', 'close'],
      type: { name: 'enum', value: ['menu', 'half', 'close'] },
      description: 'Property 1 de Figma: 1 menu, 2 half, 3 close',
    },
  },
  args: { variant: 'menu' },
  decorators: [
    (Story) => (
      <div className="bg-ds-background-container-surface p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof IconMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground. */
export const Interactive: Story = {};

function ToggleDemo() {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className="inline-flex size-8 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
    >
      <IconMenu variant={open ? 'close' : 'menu'} />
    </button>
  );
}

/** Dentro de un botón con nombre: el dibujo es decorativo y las rayas se mueven al cambiar de estado. */
export const Toggle: Story = { render: () => <ToggleDemo /> };

const VARIANTS: { name: string; variant: IconMenuVariant }[] = [
  { name: '1', variant: 'menu' },
  { name: '2', variant: 'half' },
  { name: '3', variant: 'close' },
];

/** Los tres Property 1 del set de Figma. */
export const FigmaMatrix: Story = {
  render: () => (
    <div className="flex items-center gap-8 bg-ds-background-container-surface p-6">
      {VARIANTS.map((v) => (
        <div key={v.name} data-figma={`Property 1=${v.name}`} className="size-8">
          <IconMenu variant={v.variant} />
        </div>
      ))}
    </div>
  ),
};

/** Test: decorativo por defecto, y con `aria-label` es una imagen con nombre; el botón cambia su nombre. */
export const AccessibilityTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex items-center gap-4 bg-ds-background-container-surface p-6">
      <ToggleDemo />
      <IconMenu aria-label="Menú" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('img', { name: 'Menú' })).toBeVisible();
    const button = canvas.getByRole('button', { name: 'Abrir menú' });
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(button);
    await expect(canvas.getByRole('button', { name: 'Cerrar menú' })).toHaveAttribute('aria-expanded', 'true');
  },
};
