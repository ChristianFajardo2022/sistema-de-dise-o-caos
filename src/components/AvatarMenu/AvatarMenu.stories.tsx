import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { AvatarMenu } from './AvatarMenu';
import { AvatarMenuPanel } from './AvatarMenuPanel';
import { DropdownMenuItem } from '../DropdownMenu';

const meta = {
  title: 'Navigation/Avatar menu',
  component: AvatarMenu,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text', type: { name: 'string' }, description: 'Nombre de la persona (iniciales del avatar y de la tarjeta)' },
    email: { control: 'text', type: { name: 'string' }, description: 'Correo o cargo bajo el nombre' },
    size: { control: 'radio', options: ['sm', 'md'], type: { name: 'enum', value: ['sm', 'md'] }, description: 'Diámetro del avatar: 32 o 48' },
    open: { control: 'boolean', type: { name: 'boolean' }, description: 'Type Dropdown de Figma (abierto)' },
  },
  args: { name: 'Hugo García', email: 'hugo.garcia@ejemplo.com', size: 'md' },
  // Espacio para la tarjeta, que se abre debajo del avatar
  decorators: [
    (Story) => (
      <div className="flex min-h-[26rem] w-full items-start justify-end bg-ds-background-container-surface p-6">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AvatarMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = (
  <>
    <DropdownMenuItem>Mi perfil</DropdownMenuItem>
    <DropdownMenuItem>Configuración</DropdownMenuItem>
    <DropdownMenuItem>Ayuda</DropdownMenuItem>
  </>
);

/** Playground: abre con clic, Enter, Espacio o las flechas; Escape y el clic fuera cierran y el foco vuelve al avatar. */
export const Interactive: Story = {
  args: { children: items, onLogout: fn() },
};

/** Type Dropdown de Figma: abierto desde el montaje. */
export const Open: Story = {
  args: { children: items, onLogout: fn(), defaultOpen: true },
};

function ControlledDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-end gap-3">
      <button type="button" onClick={() => setOpen(!open)} className="cursor-pointer text-ds-text-neutral-white">
        {open ? 'Cerrar desde fuera' : 'Abrir desde fuera'}
      </button>
      <AvatarMenu name="Ana Pérez" email="Analista" open={open} onOpenChange={setOpen} onLogout={() => setOpen(false)}>
        {items}
      </AvatarMenu>
    </div>
  );
}

/** Estado controlado con `open` y `onOpenChange`. */
export const Controlled: Story = { render: () => <ControlledDemo /> };

/** Solo el panel, en línea (documentación y medición): no abre ni cierra nada. */
export const PanelOnly: Story = {
  render: () => (
    <AvatarMenuPanel name="Hugo García" email="hugo.garcia@ejemplo.com" onLogout={() => {}}>
      {items}
    </AvatarMenuPanel>
  ),
};

/**
 * Los dos Type de Figma. Dropdown es el avatar con la tarjeta abierta debajo; en Default la tarjeta existe pero está
 * cerrada (como en Figma, donde queda recortada). Los textos de la persona son genéricos, con las iniciales "HG".
 */
export const FigmaMatrix: Story = {
  decorators: [
    (Story) => (
      <div className="flex min-h-[26rem] w-[30rem] items-start justify-between bg-ds-background-container-surface p-6">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <>
      <AvatarMenu name="Hugo García" email="hugo.garcia@ejemplo.com" onLogout={() => {}} rootProps={{ 'data-figma': 'Type=Default' }}>
        <DropdownMenuItem>Text item</DropdownMenuItem>
        <DropdownMenuItem>Text item</DropdownMenuItem>
        <DropdownMenuItem>Text item</DropdownMenuItem>
      </AvatarMenu>
      <AvatarMenu name="Hugo García" email="hugo.garcia@ejemplo.com" defaultOpen onLogout={() => {}} rootProps={{ 'data-figma': 'Type=Dropdown' }}>
        <DropdownMenuItem>Text item</DropdownMenuItem>
        <DropdownMenuItem>Text item</DropdownMenuItem>
        <DropdownMenuItem>Text item</DropdownMenuItem>
      </AvatarMenu>
    </>
  ),
};

/** Test: Menu Button (aria-*), foco al primer ítem, flechas, Escape y foco de vuelta, cierre de sesión. */
export const KeyboardTest: Story = {
  tags: ['!autodocs'],
  args: { children: items, onLogout: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'HG, menú de perfil de Hugo García' });
    await expect(button).toHaveAttribute('aria-haspopup', 'menu');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(button);
    const menu = await within(document.body).findByRole('menu', { name: 'Menú de perfil' });
    await waitFor(() => expect(within(menu).getByRole('menuitem', { name: 'Mi perfil' })).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await expect(within(menu).getByRole('menuitem', { name: 'Configuración' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(within(menu).getByRole('menuitem', { name: 'Cerrar sesión' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(button).toHaveFocus());
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(button);
    await userEvent.click(await within(document.body).findByRole('menuitem', { name: 'Cerrar sesión' }));
    await expect(args.onLogout).toHaveBeenCalled();
  },
};
