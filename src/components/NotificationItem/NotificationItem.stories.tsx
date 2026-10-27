import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { NotificationItem } from './NotificationItem';

const meta = {
  title: 'Data Display/NotificationItem',
  component: NotificationItem,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story, { parameters }) =>
      parameters.bare ? (
        <Story />
      ) : (
        <ul role="list" className="m-0 w-full max-w-[333px] list-none p-0">
          <Story />
        </ul>
      ),
  ],
  argTypes: {
    title: { control: 'text', type: { name: 'string' }, description: 'Prop Notification de Figma' },
    description: { control: 'text', type: { name: 'string' }, description: 'Prop Description de Figma' },
    unread: { control: 'boolean', type: { name: 'boolean' }, description: 'Type=Active de Figma (no leída)' },
    unreadLabel: { control: 'text', type: { name: 'string' }, description: 'Texto para lectores del punto' },
    href: { control: 'text', type: { name: 'string' }, description: 'Con href el título es un enlace' },
  },
  args: {
    title: 'Factura lista',
    description: 'Ya puedes descargar tu factura de octubre.',
    unread: true,
  },
} satisfies Meta<typeof NotificationItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground. Con `onClick` el título pasa a ser un botón estirado sobre la fila. */
export const Interactive: Story = {
  args: { onClick: fn() },
};

/** Leída (Type=Default) y no leída (Type=Active), una junto a la otra. */
export const ReadAndUnread: Story = {
  render: () => (
    <>
      <NotificationItem title="Pago confirmado" description="Recibimos tu pago de la factura de octubre." unread />
      <NotificationItem title="Factura disponible" description="Ya puedes descargar tu factura." />
    </>
  ),
};

/** Solo informativa (sin `href` ni `onClick`): el título es un párrafo, sin control. */
export const Informative: Story = {
  args: { unread: false },
};

/** Con `href` el título es un enlace. */
export const AsLink: Story = {
  args: { href: '#detalle' },
};

const FIGMA = [
  { name: 'Type=Default', unread: false },
  { name: 'Type=Active', unread: true },
];

/** Las dos variantes de Figma (333 de ancho) con los textos de Figma. */
export const FigmaMatrix: Story = {
  parameters: { bare: true },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <ul role="list" className="m-0 flex w-[333px] list-none flex-col gap-6 p-0">
        {FIGMA.map((v) => (
          <NotificationItem
            key={v.name}
            rootProps={{ 'data-figma': v.name }}
            title="Text notification"
            description="Text description"
            unread={v.unread}
          />
        ))}
      </ul>
    </div>
  ),
};

/** Test: nombre accesible del control, "No leída" en la descripción y el clic. */
export const RoleTest: Story = {
  tags: ['!autodocs'],
  args: { onClick: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole('button', { name: 'Factura lista' });
    await expect(control).toHaveAccessibleDescription('No leída Ya puedes descargar tu factura de octubre.');
    await userEvent.click(control);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await userEvent.tab();
    await expect(control).not.toHaveFocus();
  },
};

/** Test: sin acción la fila no es un control y el punto de no leída se anuncia. */
export const InformativeTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <>
      <NotificationItem title="Aviso" description="Mantenimiento programado." unread />
      <NotificationItem title="Resumen" description="Tienes 3 tareas." />
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
    const items = canvas.getAllByRole('listitem');
    await expect(items).toHaveLength(2);
    await expect(items[0]).toHaveTextContent('No leída');
    await expect(items[1]).not.toHaveTextContent('No leída');
  },
};
