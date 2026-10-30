import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { ChatMessage } from './ChatMessage';
import { ChatMessageList } from './ChatMessageList';
import type { ChatMessageDirection, ChatMessageType } from './ChatMessage.types';
import { Avatar } from '../Avatar';
import { PHOTO_SRC } from '../Avatar/Avatar.sample-data';
import type { PhotoName } from '../Avatar/Avatar.sample-data';
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
      description: 'Property 1 de Figma: Default = incoming; Variant5 = incoming audio; Variant2 y Variant4 = outgoing',
    },
    type: {
      control: 'inline-radio',
      options: ['text', 'audio'],
      type: { name: 'enum', value: ['text', 'audio'] },
      description: 'Variant4 y Variant5 de Figma = audio',
    },
    author: { control: 'text', type: { name: 'string' }, description: 'Autor (solo para lectores)' },
    time: { control: 'text', type: { name: 'string' }, description: 'Hora visible bajo el contenido' },
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
        {args.type === 'audio' ? <ChatAudioPlayer duration={74} timePosition="start" buttonPosition="end" /> : children}
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

/** Mensajes que llegan solos en la demo, uno cada 4 s. */
const INCOMING = ['¿Te llegó mi correo?', 'Quedo atenta.', 'Gracias.'];

/**
 * Registro de mensajes (`role="log"`): los nuevos se anuncian y la lista baja sola si ya estaba abajo. La demo recibe
 * tres mensajes, uno cada 4 s, sin controles dentro de la muestra.
 */
function ConversationDemo() {
  const [items, setItems] = useState(SEED);
  useEffect(() => {
    let sent = 0;
    const timer = setInterval(() => {
      const text = INCOMING[sent];
      sent += 1;
      if (sent >= INCOMING.length) clearInterval(timer);
      setItems((list) => [
        ...list,
        { id: list.length + 1, direction: 'incoming', author: 'Ana Pérez', time: `09:${20 + sent}`, text },
      ]);
    }, 4000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="flex h-[360px] flex-col">
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
            {m.audio ? <ChatAudioPlayer duration={m.audio} timePosition="start" buttonPosition="end" /> : m.text}
          </ChatMessage>
        ))}
      </ChatMessageList>
    </div>
  );
}

export const Conversation: Story = { render: () => <ConversationDemo /> };

const FIGMA: { name: string; direction: ChatMessageDirection; type: ChatMessageType; photo: PhotoName }[] = [
  { name: 'Property 1=Default', direction: 'incoming', type: 'text', photo: 'Woman_1' },
  { name: 'Property 1=Variant2', direction: 'outgoing', type: 'text', photo: 'Men_4' },
  { name: 'Property 1=Variant4', direction: 'outgoing', type: 'audio', photo: 'Men_4' },
  { name: 'Property 1=Variant5', direction: 'incoming', type: 'audio', photo: 'Woman_1' },
];

/** Las cuatro variantes de Figma (266 de ancho), con los textos de Figma. La onda marca 10 barras reproducidas. */
export const FigmaMatrix: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <ul className="m-0 flex w-[381px] list-none flex-col gap-6 p-0">
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
            {v.type === 'audio' ? <ChatAudioPlayer duration={1214} defaultCurrentTime={(1214 * 10) / 179} timePosition="start" buttonPosition="end" /> : 'Tienda oficial del libro '}
          </ChatMessage>
        ))}
      </ul>
    </div>
  ),
};

/** Test: registro con nombre, cada mensaje lee el autor antes del contenido y muestra la hora; el audio se reproduce y se pausa. */
export const AccessibilityTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex h-[300px] flex-col">
      <ChatMessageList aria-label="Mensajes con Ana Pérez" className="flex-1">
        <ChatMessage author="Ana Pérez" time="09:12" avatar={avatar('Woman_1')}>
          Hola
        </ChatMessage>
        <ChatMessage direction="outgoing" type="audio" author="Tú" time="09:13" avatar={avatar('Men_4')}>
          <ChatAudioPlayer duration={20} timePosition="start" buttonPosition="end" />
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
    await expect(items[0]).toHaveTextContent(/^Ana Pérez: Hola, 09:12$/);
    await expect(items[0].querySelector('time')).toHaveTextContent('09:12');
    const play = canvas.getByRole('button', { name: 'Reproducir audio' });
    await userEvent.click(play);
    await expect(canvas.getByRole('button', { name: 'Pausar audio' })).toHaveFocus();
    const seek = canvas.getByRole('slider', { name: 'Posición del audio' });
    await expect(seek).toHaveAttribute('aria-valuetext', '0:00 de 0:20');
  },
};
