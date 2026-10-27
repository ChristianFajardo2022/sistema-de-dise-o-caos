import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { NotificationBell } from './NotificationBell';

const meta = {
  title: 'General Controls/NotificationBell',
  component: NotificationBell,
  tags: ['autodocs'],
  argTypes: {
    count: { control: { type: 'number', min: 0 }, type: { name: 'number' }, description: 'Notificaciones sin leer' },
    max: { control: { type: 'number', min: 1 }, type: { name: 'number' }, description: 'Máximo del contador ("99+")' },
    size: {
      control: 'radio',
      options: ['xs', 'sm', 'md'],
      type: { name: 'enum', value: ['xs', 'sm', 'md'] },
      description: 'Size del Button de Figma (xs 32, sm 48, md 56)',
    },
    open: { control: 'boolean', type: { name: 'boolean' }, description: 'El panel que abre está a la vista (aria-expanded y Press)' },
    label: { control: 'text', type: { name: 'string' }, description: 'Nombre accesible base' },
  },
  args: { count: 3, size: 'xs' },
} satisfies Meta<typeof NotificationBell>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground. */
export const Interactive: Story = {
  args: { onClick: fn() },
};

/** Con el contador pasado del máximo se lee "99+" y el nombre dice "más de 99 sin leer". */
export const Overflow: Story = {
  args: { count: 150 },
};

/** Tamaños de los botones de Figma: 32 (átomo), 48 (paneles) y 56. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      <NotificationBell {...args} size="xs" />
      <NotificationBell {...args} size="sm" />
      <NotificationBell {...args} size="md" />
    </div>
  ),
};

/** Abre y cierra un panel: `open` expone `aria-expanded` y pinta Press. */
function OpenDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-start gap-3">
      <NotificationBell
        size="sm"
        count={5}
        open={open}
        aria-controls="panel-demo"
        aria-haspopup="dialog"
        onClick={() => setOpen(!open)}
      />
      {open && (
        <p id="panel-demo" className="m-0 text-ds-text-neutral-white">
          Aquí iría el panel de notificaciones.
        </p>
      )}
    </div>
  );
}
export const ControlsPanel: Story = { render: () => <OpenDemo /> };

const FIGMA = [
  { name: 'Type=Default', count: 0 },
  { name: 'Type=Icon+badge', count: 99 },
];

/** Las dos variantes de Figma (32×32). */
export const FigmaMatrix: Story = {
  render: () => (
    <div className="flex gap-6 bg-ds-background-general-black p-6">
      {FIGMA.map((v) => (
        <NotificationBell key={v.name} rootProps={{ 'data-figma': v.name }} count={v.count} size="xs" />
      ))}
    </div>
  ),
};

/** Test: el nombre incluye el conteo, el badge es decorativo y `aria-expanded` sigue a `open`. */
export const NameTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex items-center gap-6">
      <NotificationBell count={3} />
      <NotificationBell />
      <NotificationBell count={120} />
      <NotificationBell count={2} open aria-controls="p" />
      <div id="p" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Notificaciones, 3 sin leer' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Notificaciones' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Notificaciones, más de 99 sin leer' })).toBeInTheDocument();
    const open = canvas.getByRole('button', { name: 'Notificaciones, 2 sin leer' });
    await expect(open).toHaveAttribute('aria-expanded', 'true');
    await expect(open).toHaveAttribute('aria-controls', 'p');
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Notificaciones, 3 sin leer' })).toHaveFocus();
  },
};
