import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ChatCard } from './ChatCard';
import { Avatar } from '../Avatar';
import { PHOTO_SRC } from '../Avatar/Avatar.sample-data';
import type { PhotoName } from '../Avatar/Avatar.sample-data';
import { Button } from '../Button';
import { Icon } from '../Icon';

const meta = {
  title: 'Data Display/ChatCard',
  component: ChatCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [
    (Story, { parameters }) =>
      parameters.fullWidth ? (
        <Story />
      ) : (
        <div className="w-full max-w-[767px]">
          <Story />
        </div>
      ),
  ],
  argTypes: {
    title: { control: 'text', type: { name: 'string' }, description: 'Prop Filename de Figma' },
    description: { control: 'text', type: { name: 'string' }, description: 'Prop Status de Figma (último mensaje)' },
    time: { control: 'text', type: { name: 'string' }, description: 'Hora del último mensaje' },
    unread: { control: 'text', type: { name: 'string' }, description: 'Mensajes sin leer' },
    selected: { control: 'boolean', type: { name: 'boolean' }, description: 'State=Active de Figma' },
  },
  args: {
    title: 'Ana Pérez',
    description: 'Nos vemos mañana en la reunión de diseño.',
    time: '20.00',
    unread: '3',
    selected: false,
  },
} satisfies Meta<typeof ChatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const avatar = (photo: PhotoName = 'Woman_1') => <Avatar variant="photo" size="md" src={PHOTO_SRC[photo]} alt="" />;

/** Playground */
export const Interactive: Story = {
  args: { onClick: fn() },
  render: (args) => <ChatCard {...args} leading={avatar()} />,
};

/** Lista de conversaciones: la seleccionada cambia al hacer clic. */
function ConversationListDemo() {
  const items: { name: string; text: string; time: string; unread?: number; photo: PhotoName }[] = [
    { name: 'Ana Pérez', text: 'Nos vemos mañana en la reunión.', time: '20.00', unread: 3, photo: 'Woman_1' },
    { name: 'Hugo García', text: 'Te envío los archivos ahora.', time: '18.30', photo: 'Men_1' },
    { name: 'Sara Molina', text: 'Gracias por la ayuda.', time: '09.15', unread: 12, photo: 'Woman_3' },
  ];
  const [active, setActive] = useState(0);
  return (
    <nav aria-label="Conversaciones">
      <ul className="m-0 flex list-none flex-col gap-ds-space-general-md p-0">
        {items.map((c, i) => (
          <li key={c.name}>
            <ChatCard
              title={c.name}
              description={c.text}
              time={c.time}
              unread={c.unread}
              online={i === 0}
              selected={active === i}
              leading={avatar(c.photo)}
              onClick={() => setActive(i)}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}

export const ConversationList: Story = { render: () => <ConversationListDemo /> };

/** Con `href` el control es un enlace. */
export const AsLink: Story = {
  render: (args) => <ChatCard {...args} href="#conversacion" leading={avatar()} selected />,
};

/** Con `actions` (los botones de la fila de Figma, que el set no muestra). */
export const WithActions: Story = {
  render: (args) => (
    <ChatCard
      {...args}
      leading={avatar()}
      actions={
        <>
          <Button iconOnly variant="secondary" size="sm" aria-label="Exportar conversación con Ana Pérez">
            <Icon name="export2" size={20} variant="fill" />
          </Button>
          <Button iconOnly variant="secondary" size="sm" aria-label="Editar conversación con Ana Pérez">
            <Icon name="edit" size={20} variant="fill" />
          </Button>
        </>
      }
    />
  ),
};

const FIGMA: { name: string; selected: boolean }[] = [
  { name: 'State=Default', selected: false },
  { name: 'State=Active', selected: true },
];

function MatrixCards({ figma }: { figma: boolean }) {
  return (
    <>
      {FIGMA.map((v) => (
        <ChatCard
          key={v.name}
          rootProps={{ 'data-figma': figma ? v.name : undefined }}
          title="Titulo"
          description="Descripción"
          time="20.00"
          unread="00"
          selected={v.selected}
          leading={avatar('Woman_1')}
          online
        />
      ))}
    </>
  );
}

/** Las dos variantes de Figma (767 de ancho), con los textos de Figma. */
export const FigmaMatrix: Story = {
  parameters: { fullWidth: true },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de ChatCard" className="max-w-full overflow-x-auto">
        <div className="flex w-[767px] flex-col gap-6">
          <MatrixCards figma />
        </div>
        <p className="mt-6 mb-2 text-xs text-ds-text-neutral-body">Revisión a ojo sobre background/container/default-on-card (sin data-figma)</p>
        <div className="flex w-[815px] flex-col gap-6 bg-ds-background-container-default-on-card p-6">
          <MatrixCards figma={false} />
        </div>
      </div>
    </div>
  ),
};

/** Test: el control tiene el nombre del título, la selección se expone con aria-current y el clic funciona. */
export const SelectionTest: Story = {
  tags: ['!autodocs'],
  args: { onClick: fn() },
  render: (args) => (
    <div className="flex w-[767px] flex-col gap-4">
      <ChatCard {...args} title="Ana Pérez" description="Hola" time="20.00" unread="3" leading={avatar()} online selected />
      <ChatCard title="Hugo García" description="Buenas" leading={avatar('Men_1')} />
      <ChatCard title="Sara Molina" href="#sara" leading={avatar('Woman_3')} />
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const ana = canvas.getByRole('button', { name: 'Ana Pérez' });
    await expect(ana).toHaveAttribute('aria-current', 'true');
    // Una pieza por referencia: en línea, mensaje, hora y no leídos, separados (no "20.003 sin leer")
    await expect(ana).toHaveAccessibleDescription(/^En línea Hola 20\.00 3 sin leer$/);
    await expect(canvas.getByRole('button', { name: 'Hugo García' })).not.toHaveAttribute('aria-current');
    await expect(canvas.getByRole('link', { name: 'Sara Molina' })).toHaveAttribute('href', '#sara');
    await userEvent.click(ana);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await expect(ana).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Hugo García' })).toHaveFocus();
  },
};
