import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { ChatMessage } from './ChatMessage';
import { ChatMessageList } from './ChatMessageList';
import type { ChatMessageDirection, ChatMessageType } from './ChatMessage.types';
import { Avatar } from '../Avatar';
import { PHOTO_SRC } from '../Avatar/Avatar.sample-data';
import type { PhotoName } from '../Avatar/Avatar.sample-data';
import { Button } from '../Button';
import { ChatAudioPlayer } from '../ChatAudioPlayer';

const meta = {
  title: 'Data Display/ChatMessage',
  component: ChatMessage,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'inline-radio',
      options: ['incoming', 'outgoing'],
      type: { name: 'enum', value: ['incoming', 'outgoing'] },
      description: 'Property 1 de Figma: Default = incoming; Variant2 y Variant3 = outgoing',
    },
    type: {
      control: 'inline-radio',
      options: ['text', 'audio'],
      type: { name: 'enum', value: ['text', 'audio'] },
      description: 'Variant3 de Figma = audio',
    },
    author: { control: 'text', type: { name: 'string' }, description: 'Autor (solo para lectores)' },
    time: { control: 'text', type: { name: 'string' }, description: 'Hora (solo para lectores)' },
    children: { control: 'text', type: { name: 'string' } },
  },
  args: {
    direction: 'incoming',
    type: 'text',
    author: 'Ana Pérez',
    time: '20:14',
    children: '¿Llegó el pedido de esta mañana?',
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-[618px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

const avatar = (photo: PhotoName) => <Avatar variant="photo" size="sm" src={PHOTO_SRC[photo]} alt="" />;

/** Playground. Un `ChatMessage` es un `<li>`: aquí va dentro de un `<ul>`. */
export const Interactive: Story = {
  render: ({ children, ...args }) => (
    <ul className="m-0 list-none p-0">
      <ChatMessage {...args} avatar={avatar(args.direction === 'outgoing' ? 'Men_4' : 'Woman_1')}>
        {args.type === 'audio' ? <ChatAudioPlayer duration={74} /> : children}
      </ChatMessage>
    </ul>
  ),
};

interface Item {
  id: number;
  direction: ChatMessageDirection;
  author: string;
  time: string;
  text?: string;
  audio?: number;
}

const SEED: Item[] = [
  { id: 1, direction: 'incoming', author: 'Ana Pérez', time: '09:12', text: 'Hola, ¿llegó el pedido de esta mañana?' },
  { id: 2, direction: 'outgoing', author: 'Tú', time: '09:13', text: 'Sí, ya está en bodega.' },
  { id: 3, direction: 'incoming', author: 'Ana Pérez', time: '09:14', text: 'Perfecto. ¿Me confirmas la factura?' },
  { id: 4, direction: 'outgoing', author: 'Tú', time: '09:15', text: 'Te la envío en un momento.' },
  { id: 5, direction: 'outgoing', author: 'Tú', time: '09:16', audio: 42 },
];

/** Registro de mensajes (`role="log"`): los nuevos se anuncian y la lista baja sola si ya estaba abajo. */
function ConversationDemo() {
  const [items, setItems] = useState(SEED);
  const add = () =>
    setItems((list) => [
      ...list,
      { id: list.length + 1, direction: 'incoming', author: 'Ana Pérez', time: '09:20', text: `Mensaje nuevo ${list.length + 1}` },
    ]);
  return (
    <div className="flex h-[360px] flex-col gap-4">
      <ChatMessageList aria-label="Mensajes con Ana Pérez" className="flex-1">
        {items.map((m) => (
          <ChatMessage
            key={m.id}
            direction={m.direction}
            type={m.audio ? 'audio' : 'text'}
            author={m.author}
            time={m.time}
            avatar={avatar(m.direction === 'incoming' ? 'Woman_1' : 'Men_4')}
          >
            {m.audio ? <ChatAudioPlayer duration={m.audio} /> : m.text}
          </ChatMessage>
        ))}
      </ChatMessageList>
      <Button variant="secondary" size="xs" onClick={add} className="self-start">
        Simular mensaje recibido
      </Button>
    </div>
  );
}

export const Conversation: Story = { render: () => <ConversationDemo /> };

const FIGMA: { name: string; direction: ChatMessageDirection; type: ChatMessageType; photo: PhotoName }[] = [
  { name: 'Property 1=Default', direction: 'incoming', type: 'text', photo: 'Woman_1' },
  { name: 'Property 1=Variant2', direction: 'outgoing', type: 'text', photo: 'Men_4' },
  { name: 'Property 1=Variant3', direction: 'outgoing', type: 'audio', photo: 'Men_4' },
];

/** Las tres variantes de Figma (266 de ancho), con los textos de Figma. La onda marca 10 barras reproducidas. */
export const FigmaMatrix: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <ul className="m-0 flex w-[266px] list-none flex-col gap-6 p-0">
        {FIGMA.map((v) => (
          <ChatMessage
            key={v.name}
            data-figma={v.name}
            direction={v.direction}
            type={v.type}
            author={v.direction === 'incoming' ? 'Ana Pérez' : 'Hugo García'}
            time="20:14"
            avatar={avatar(v.photo)}
          >
            {v.type === 'audio' ? <ChatAudioPlayer duration={1214} defaultCurrentTime={(1214 * 10) / 179} /> : 'Tienda oficial del libro '}
          </ChatMessage>
        ))}
      </ul>
    </div>
  ),
};

/** Test: registro con nombre, cada mensaje lee autor y hora antes del contenido; el audio se reproduce y se pausa. */
export const AccessibilityTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex h-[300px] flex-col">
      <ChatMessageList aria-label="Mensajes con Ana Pérez" className="flex-1">
        <ChatMessage author="Ana Pérez" time="09:12" avatar={avatar('Woman_1')}>
          Hola
        </ChatMessage>
        <ChatMessage direction="outgoing" type="audio" author="Tú" time="09:13" avatar={avatar('Men_4')}>
          <ChatAudioPlayer duration={20} />
        </ChatMessage>
      </ChatMessageList>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const log = canvas.getByRole('log', { name: 'Mensajes con Ana Pérez' });
    await expect(log).toHaveAttribute('aria-live', 'polite');
    const items = within(log).getAllByRole('listitem');
    await expect(items).toHaveLength(2);
    await expect(items[0]).toHaveTextContent(/^Ana Pérez, 09:12: Hola$/);
    await expect(items[0].querySelector('time')).toHaveTextContent('09:12');
    const play = canvas.getByRole('button', { name: 'Reproducir audio' });
    await userEvent.click(play);
    await expect(canvas.getByRole('button', { name: 'Pausar audio' })).toHaveFocus();
    const seek = canvas.getByRole('slider', { name: 'Posición del audio' });
    await expect(seek).toHaveAttribute('aria-valuetext', '0:00 de 0:20');
  },
};
