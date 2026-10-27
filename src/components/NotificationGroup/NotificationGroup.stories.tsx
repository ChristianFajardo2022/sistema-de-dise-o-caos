import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { NotificationGroup } from './NotificationGroup';
import { NotificationGroupItem } from './NotificationGroupItem';
import { NotificationCard } from '../NotificationCard';
import { FIGMA_LOREM } from '../NotificationItem/NotificationItem.shared';

const meta = {
  title: 'Data Display/NotificationGroup',
  component: NotificationGroup,
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
    time: { control: 'text', type: { name: 'string' }, description: 'Hora relativa de la última notificación' },
    unread: { control: 'boolean', type: { name: 'boolean' }, description: 'State=Unread de Figma' },
    count: { control: { type: 'number', min: 0 }, type: { name: 'number' }, description: 'Cantidad del Badge (por defecto, los hijos)' },
    expanded: { control: 'boolean', type: { name: 'boolean' }, description: 'Type=Dropdown group de Figma (controlado)' },
    revealed: { control: 'boolean', type: { name: 'boolean' }, description: 'Type=Group delete de Figma' },
  },
  args: {
    title: 'Actualizaciones de la cuenta',
    time: 'Hace 22 min',
    unread: true,
  },
} satisfies Meta<typeof NotificationGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = (unread: boolean[]) =>
  unread.map((u, i) => (
    <NotificationGroupItem
      key={i}
      time={`Hace ${22 + i * 20} min`}
      description={['Cambiaste tu contraseña.', 'Confirmamos tu correo nuevo.', 'Recibimos tu pago.'][i]}
      unread={u}
    />
  ));

/** Playground: recogido muestra la primera; el botón del chevron (o toda la tarjeta) lo despliega. */
export const Interactive: Story = {
  render: (args) => <NotificationGroup {...args}>{items([true, true, false])}</NotificationGroup>,
};

/** Desplegado (Type=Dropdown group). */
export const Expanded: Story = {
  args: { defaultExpanded: true },
  render: (args) => <NotificationGroup {...args}>{items([true, true, false])}</NotificationGroup>,
};

/** Leído (State=Read): sin relleno; recogido lleva trazo inferior. */
export const Read: Story = {
  args: { unread: false },
  render: (args) => <NotificationGroup {...args}>{items([false, false])}</NotificationGroup>,
};

/** Con `onDelete` el botón eliminar quita todo el grupo. */
function DeleteDemo() {
  const [groups, setGroups] = useState(['Pago de octubre', 'Pago de noviembre']);
  return (
    <ul role="list" className="m-0 flex w-[351px] list-none flex-col gap-2 p-0">
      {groups.map((g) => (
        <NotificationGroup
          key={g}
          title={g}
          time="Hace 22 min"
          unread
          onDelete={() => setGroups((all) => all.filter((x) => x !== g))}
        >
          {items([true, false])}
        </NotificationGroup>
      ))}
    </ul>
  );
}
export const Deletable: Story = { parameters: { bare: true }, render: () => <DeleteDemo /> };

const FIGMA: { name: string; kind: 'card' | 'group' | 'dropdown'; unread: boolean; delete: boolean }[] = [
  { name: 'Type=Simple, State=Unread', kind: 'card', unread: true, delete: false },
  { name: 'Type=Simple delete, State=Unread', kind: 'card', unread: true, delete: true },
  { name: 'Type=Simple, State=Read', kind: 'card', unread: false, delete: false },
  { name: 'Type=Simple delete, State=Read', kind: 'card', unread: false, delete: true },
  { name: 'Type=Group, State=Unread', kind: 'group', unread: true, delete: false },
  { name: 'Type=Group delete, State=Unread', kind: 'group', unread: true, delete: true },
  { name: 'Type=Group, State=Read', kind: 'group', unread: false, delete: false },
  { name: 'Type=Group delete, State=Read', kind: 'group', unread: false, delete: true },
  { name: 'Type=Dropdown group, State=Unread', kind: 'dropdown', unread: true, delete: false },
  { name: 'Type=Dropdown group, State=Read', kind: 'dropdown', unread: false, delete: false },
];

const lorem = FIGMA_LOREM;

/**
 * Las diez variantes del set "Group notification" de Figma: Simple y Simple delete son `NotificationCard`; Group,
 * Group delete y Dropdown group son `NotificationGroup` (351 de ancho; el desplegado, 348, mide la tarjeta).
 * Group y Dropdown group llevan filas leídas o no leídas como en Figma (la vista previa, regular).
 */
export const FigmaMatrix: Story = {
  parameters: { bare: true },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <ul role="list" className="m-0 flex w-[351px] list-none flex-col gap-6 p-0">
        {FIGMA.map((v) =>
          v.kind === 'card' ? (
            <NotificationCard
              key={v.name}
              rootProps={{ 'data-figma': v.name }}
              time="Hace 22m"
              title="Heading"
              description={lorem}
              unread={v.unread}
              onDelete={v.delete ? () => {} : undefined}
              revealed={v.delete ? true : undefined}
            />
          ) : v.kind === 'group' ? (
            <NotificationGroup
              key={v.name}
              rootProps={{ 'data-figma': v.name }}
              time="Hace 22m"
              title="Heading"
              count={2}
              unread={v.unread}
              onDelete={v.delete ? () => {} : undefined}
              revealed={v.delete ? true : undefined}
            >
              <NotificationGroupItem time="Hace 22m" description={lorem} />
              <NotificationGroupItem time="Hace 22m" description={lorem} />
            </NotificationGroup>
          ) : (
            <NotificationGroup
              key={v.name}
              className="w-[348px]"
              contentProps={{ 'data-figma': v.name }}
              time="Hace 22m"
              title="Heading"
              count={2}
              unread={v.unread}
              expanded
            >
              <NotificationGroupItem time="Hace 22m" description={lorem} unread />
              <NotificationGroupItem time="Hace 22m" description={lorem} unread />
              <NotificationGroupItem time="Hace 22m" description={lorem} />
            </NotificationGroup>
          )
        )}
      </ul>
    </div>
  ),
};

/** Test: el botón anuncia aria-expanded y aria-controls, y al desplegar aparecen todas las filas. */
export const DisclosureTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <NotificationGroup title="Pago de octubre" time="Hace 22 min" unread onExpandedChange={fn()}>
      {items([true, true, false])}
    </NotificationGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Mostrar notificaciones Pago de octubre' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveAccessibleDescription('Hace 22 min No leído');
    await expect(canvas.getAllByRole('listitem')).toHaveLength(2);
    await userEvent.click(toggle);
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Ocultar notificaciones Pago de octubre' })).toHaveAttribute('aria-expanded', 'true'));
    await expect(canvas.getAllByRole('listitem')).toHaveLength(4);
    await expect(toggle).toHaveAttribute('aria-controls', canvas.getAllByRole('list')[1].id);
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getAllByRole('listitem')).toHaveLength(2));
  },
};

/** Test: eliminar un grupo mueve el foco al siguiente. */
export const DeleteFocusTest: Story = {
  tags: ['!autodocs'],
  parameters: { bare: true },
  render: () => <DeleteDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Eliminar notificación: Pago de octubre' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Mostrar notificaciones Pago de noviembre' })).toHaveFocus());
  },
};
