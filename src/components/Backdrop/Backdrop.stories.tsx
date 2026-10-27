import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Backdrop } from './Backdrop';

const meta = {
  title: 'Overlays/Backdrop',
  component: Backdrop,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean', description: 'Si es false no renderiza' },
    position: {
      control: 'radio',
      options: ['fixed', 'absolute'],
      description: 'fixed cubre la pantalla; absolute se contiene en el padre',
    },
  },
  args: { open: true, position: 'absolute' },
} satisfies Meta<typeof Backdrop>;

export default meta;
type Story = StoryObj<typeof meta>;

function Fondo({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-80 overflow-hidden bg-ds-background-general-black p-6 text-ds-text-neutral-body">
      <p>Contenido de la página detrás del backdrop. Se desenfoca y oscurece al abrir un overlay.</p>
      {children}
    </div>
  );
}

export const Interactive: Story = {
  render: (args) => (
    <Fondo>
      <Backdrop {...args} />
    </Fondo>
  ),
};

/** Una sola variante en Figma: Property 1=Predeterminada (1440×1080). */
export const FigmaMatrix: Story = {
  render: () => (
    <div className="w-[1440px] max-w-none bg-ds-background-general-black">
      <div className="relative h-[1080px] w-[1440px] shrink-0 p-6 text-ds-text-neutral-body">
        <p>Contenido detrás del backdrop.</p>
        <Backdrop position="absolute" data-figma="Property 1=Predeterminada" />
      </div>
    </div>
  ),
};

export const Closed: Story = {
  args: { open: false },
  render: (args) => (
    <Fondo>
      <Backdrop {...args} data-testid="backdrop" />
    </Fondo>
  ),
  tags: ['!autodocs'],
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByTestId('backdrop')).toBeNull();
  },
};

function ClickDemo({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState(true);
  return (
    <Fondo>
      <Backdrop
        open={open}
        position="absolute"
        data-testid="backdrop"
        onClick={() => {
          onClose();
          setOpen(false);
        }}
      />
    </Fondo>
  );
}

export const CloseOnClick: Story = {
  tags: ['!autodocs'],
  args: { onClick: fn() },
  render: () => {
    const spy = fn();
    return <ClickDemo onClose={spy} />;
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const el = c.getByTestId('backdrop');
    await expect(el).toHaveAttribute('aria-hidden', 'true');
    await userEvent.click(el);
    await expect(c.queryByTestId('backdrop')).toBeNull();
  },
};
