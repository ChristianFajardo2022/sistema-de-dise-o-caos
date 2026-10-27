import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { NotificationCard } from './NotificationCard';
import { FIGMA_LOREM } from '../NotificationItem/NotificationItem.shared';

const meta = {
  title: 'Data Display/NotificationCard',
  component: NotificationCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story, { parameters }) =>
      parameters.bare ? (
        <Story />
      ) : (
        <ul role="list" className="m-0 w-full max-w-[351px] list-none p-0">
          <Story />
        </ul>
      ),
  ],
  argTypes: {
    title: { control: 'text', type: { name: 'string' }, description: 'Prop Heading de Figma' },
    description: { control: 'text', type: { name: 'string' }, description: 'Prop Description de Figma' },
    time: { control: 'text', type: { name: 'string' }, description: 'Hora relativa' },
    unread: { control: 'boolean', type: { name: 'boolean' }, description: 'State=Unread de Figma' },
    revealed: { control: 'boolean', type: { name: 'boolean' }, description: 'Type "… delete" de Figma: botón eliminar a la vista' },
    href: { control: 'text', type: { name: 'string' }, description: 'Con href el título es un enlace' },
  },
  args: {
    title: 'Nuevo mensaje de Ana Pérez',
    description: 'Te escribió sobre la reunión de mañana.',
    time: 'Hace 22 min',
    unread: true,
  },
} satisfies Meta<typeof NotificationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground. Con `onClick` el título es un botón estirado sobre la tarjeta. */
export const Interactive: Story = { args: { onClick: fn() } };

/** Leída (State=Read): sin relleno, con trazo inferior. */
export const Read: Story = { args: { unread: false } };

/** Con `onDelete` aparece el botón eliminar: desliza la tarjeta a la izquierda o enfócalo con Tab. */
function DeleteDemo() {
  const [items, setItems] = useState([
    { id: 1, title: 'Pago recibido', unread: true },
    { id: 2, title: 'Factura lista', unread: true },
    { id: 3, title: 'Cuenta actualizada', unread: false },
  ]);
  return (
    <ul role="list" className="m-0 flex w-[351px] list-none flex-col gap-2 p-0">
      {items.map((n) => (
        <NotificationCard
          key={n.id}
          title={n.title}
          description="Revisa el detalle en tu cuenta."
          time="Hace 5 min"
          unread={n.unread}
          onClick={() => {}}
          onDelete={() => setItems((all) => all.filter((x) => x.id !== n.id))}
        />
      ))}
    </ul>
  );
}
export const Deletable: Story = { parameters: { bare: true }, render: () => <DeleteDemo /> };

const FIGMA: { name: string; unread: boolean; delete: boolean }[] = [
  { name: 'Type=Simple, State=Unread', unread: true, delete: false },
  { name: 'Type=Simple delete, State=Unread', unread: true, delete: true },
  { name: 'Type=Simple, State=Read', unread: false, delete: false },
  { name: 'Type=Simple delete, State=Read', unread: false, delete: true },
];

/** Las cuatro variantes Simple de Figma (351 de ancho). Las de grupo están en `NotificationGroup`. */
export const FigmaMatrix: Story = {
  parameters: { bare: true },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <ul role="list" className="m-0 flex w-[351px] list-none flex-col gap-6 p-0">
        {FIGMA.map((v) => (
          <NotificationCard
            key={v.name}
            rootProps={{ 'data-figma': v.name }}
            time="Hace 22m"
            title="Heading"
            description={FIGMA_LOREM}
            unread={v.unread}
            onDelete={v.delete ? () => {} : undefined}
            revealed={v.delete ? true : undefined}
          />
        ))}
      </ul>
    </div>
  ),
};

/** Test: nombre y descripción accesibles, y eliminar con el botón mueve el foco a la vecina. */
export const DeleteTest: Story = {
  tags: ['!autodocs'],
  parameters: { bare: true },
  render: () => <DeleteDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pago = canvas.getByRole('button', { name: 'Pago recibido' });
    await expect(pago).toHaveAccessibleDescription('Hace 5 min No leída Revisa el detalle en tu cuenta.');
    const remove = canvas.getByRole('button', { name: 'Eliminar notificación: Pago recibido' });
    await userEvent.click(remove);
    await waitFor(() => expect(canvas.queryByRole('button', { name: 'Pago recibido' })).not.toBeInTheDocument());
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Factura lista' })).toHaveFocus());
    // Con Supr sobre el control también se elimina y el foco sigue a la vecina
    await userEvent.keyboard('{Delete}');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Cuenta actualizada' })).toHaveFocus());
    await expect(canvas.getAllByRole('listitem')).toHaveLength(1);
  },
};

/** Test: sin acción la tarjeta es informativa y `revealed` muestra el botón eliminar con su nombre. */
export const RevealedTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <NotificationCard title="Aviso" description="Hola" unread revealed onDelete={fn()} deleteLabel="Quitar aviso" />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const remove = canvas.getByRole('button', { name: 'Quitar aviso' });
    await waitFor(() => expect(remove.parentElement!.getBoundingClientRect().width).toBeGreaterThanOrEqual(47));
    await expect(canvas.getByText('No leída')).toBeInTheDocument();
  },
};

const swipeClickSpy = fn();

/** Test: deslizar a la izquierda muestra el botón eliminar sin disparar el clic de la tarjeta; un clic normal sí. */
export const SwipeNoClickTest: Story = {
  tags: ['!autodocs'],
  render: () => <NotificationCard title="Pago recibido" description="Hola" unread onClick={swipeClickSpy} onDelete={fn()} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    swipeClickSpy.mockClear();
    const card = canvas.getByRole('button', { name: 'Pago recibido' });
    const box = card.getBoundingClientRect();
    const y = box.top + box.height / 2;
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: card, coords: { clientX: box.right - 20, clientY: y } },
      { target: card, coords: { clientX: box.right - 120, clientY: y } },
      { keys: '[/MouseLeft]', target: card, coords: { clientX: box.right - 120, clientY: y } },
    ]);
    await expect(swipeClickSpy).not.toHaveBeenCalled();
    await userEvent.click(card);
    await expect(swipeClickSpy).toHaveBeenCalledTimes(1);
  },
};
