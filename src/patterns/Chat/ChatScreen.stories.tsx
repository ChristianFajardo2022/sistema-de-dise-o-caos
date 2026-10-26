import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { ComponentProps, MutableRefObject, ReactNode, Ref } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Avatar } from '../../components/Avatar';
import { PHOTO_SRC } from '../../components/Avatar/Avatar.sample-data';
import type { PhotoName } from '../../components/Avatar/Avatar.sample-data';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { ButtonCorner } from '../../components/ButtonCorner';
import { ChatAudioPlayer } from '../../components/ChatAudioPlayer';
import { visibleBarCount } from '../../components/ChatAudioPlayer/ChatAudioPlayer.utils';
import { ChatCard } from '../../components/ChatCard';
import { ChatComposer } from '../../components/ChatComposer';
import {
  ChatDetailsGrid,
  ChatDetailsHeader,
  ChatDetailsLink,
  ChatDetailsPanel,
  ChatDetailsProfile,
} from '../../components/ChatDetailsPanel';
import { ChatMessage, ChatMessageList } from '../../components/ChatMessage';
import { FileCard } from '../../components/FileCard';
import { Icon } from '../../components/Icon';
import { Input } from '../../components/Input';
import { ScrollArea } from '../../components/ScrollArea';
import { Tab, TabList, TabPanel, Tabs } from '../../components/Tabs';
import { NotchedSurface } from '../../components/_internal/NotchedSurface';
import { cn } from '../../utils/cn';

/**
 * Pantalla de chat (component set "Chat" de Figma, 14562:57994, Desktop 1286×896 y Mobile 376×750).
 *
 * Es una **composición**, no un componente exportado: cada producto enlaza sus datos, su ruteo y su envío de forma
 * distinta, y un componente de pantalla terminaría siendo un monolito de props. Por eso vive en `Patterns`: muestra cómo
 * se arma con las piezas del sistema (ChatCard, Tabs, Input, ChatMessageList/ChatMessage, ChatAudioPlayer, ChatComposer,
 * ChatDetailsPanel, FileCard, ButtonCorner, Badge, Avatar) y cómo se resuelven el foco y los anuncios.
 *
 * - Escritorio: tres columnas (lista 300, conversación flexible, detalle 320) con gap space/general/lg (8).
 * - Móvil: la lista y la conversación son dos vistas. Al abrir una conversación el foco va a su encabezado; "Volver"
 *   regresa a la lista con el foco en la tarjeta de la conversación. La vista oculta no se monta: no hay foco atrapado
 *   ni contenido duplicado para lectores.
 * - Los mensajes son un `role="log"` (`aria-live="polite"`): los nuevos se anuncian sin interrumpir.
 */
const meta = {
  title: 'Patterns/Chat/Screen',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────── datos de ejemplo ─────────────────────────

interface Message {
  id: number;
  mine: boolean;
  time: string;
  text?: string;
  audio?: number;
}

interface Conversation {
  id: string;
  name: string;
  photo: PhotoName;
  online: boolean;
  time: string;
  unread?: number;
  pending?: boolean;
  messages: Message[];
}

const ME: PhotoName = 'Men_4';

const CONVERSATIONS: Conversation[] = [
  {
    id: 'ana',
    name: 'Ana Pérez',
    photo: 'Woman_1',
    online: true,
    time: '20.00',
    unread: 2,
    pending: true,
    messages: [
      { id: 1, mine: false, time: '19:52', text: 'Hola, ¿llegó el pedido de esta mañana?' },
      { id: 2, mine: true, time: '19:53', text: 'Sí, ya está en bodega.' },
      { id: 3, mine: false, time: '19:55', text: '¿Me confirmas la factura?' },
      { id: 4, mine: true, time: '19:56', text: 'Te la envío en un momento.' },
      { id: 5, mine: true, time: '19:57', text: 'Ya quedó en tus documentos.' },
      { id: 6, mine: true, time: '19:58', audio: 42 },
    ],
  },
  {
    id: 'hugo',
    name: 'Hugo García',
    photo: 'Men_1',
    online: false,
    time: '18.30',
    messages: [{ id: 1, mine: false, time: '18:30', text: 'Te envío los archivos ahora.' }],
  },
  {
    id: 'sara',
    name: 'Sara Molina',
    photo: 'Woman_3',
    online: true,
    time: '17.05',
    unread: 5,
    pending: true,
    messages: [{ id: 1, mine: false, time: '17:05', text: '¿Pueden cambiar la dirección de entrega?' }],
  },
  {
    id: 'luis',
    name: 'Luis Romero',
    photo: 'Men_2',
    online: true,
    time: '15.40',
    messages: [{ id: 1, mine: false, time: '15:40', text: 'Gracias por la ayuda.' }],
  },
  {
    id: 'elena',
    name: 'Elena Ruiz',
    photo: 'Woman_2',
    online: false,
    time: '12.10',
    unread: 1,
    messages: [{ id: 1, mine: false, time: '12:10', text: 'Quedo atenta a la guía de envío.' }],
  },
  {
    id: 'diego',
    name: 'Diego Vega',
    photo: 'Men_3',
    online: false,
    time: '09.15',
    messages: [{ id: 1, mine: false, time: '09:15', text: '¿Tienen la talla M?' }],
  },
];

const lastText = (c: Conversation) => {
  const last = c.messages[c.messages.length - 1];
  return last?.audio ? 'Mensaje de voz' : (last?.text ?? '');
};

const photo = (name: PhotoName, size: 'sm' | 'md' = 'sm') => <Avatar variant="photo" size={size} src={PHOTO_SRC[name]} alt="" />;

/** Button xs con ícono de 16, como Figma (Button lo dibuja a 20). */
const SMALL_ICON = '[&_[data-slot=icon]]:size-4';

const iconButton = (icon: Parameters<typeof Icon>[0]['name'], label: string, touch = false) => (
  <Button iconOnly variant="secondary" size={touch ? 'sm' : 'xs'} aria-label={label} className={touch ? undefined : SMALL_ICON}>
    <Icon name={icon} size={touch ? 20 : 16} variant="fill" data-figma-part="Icon-sizes" />
  </Button>
);

/**
 * Reproductor de la matriz: Figma pinta siempre 10 barras reproducidas de la onda visible, así que la posición se calcula
 * con las barras que caben en el ancho real (la onda representa todo el audio).
 */
function FigmaAudioPlayer(props: Omit<ComponentProps<typeof ChatAudioPlayer>, 'duration' | 'currentTime' | 'defaultCurrentTime'>) {
  const ref = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(0);
  useLayoutEffect(() => {
    const wave = ref.current?.querySelector<HTMLElement>('[data-figma-part="Onda de audio"]');
    const visible = wave ? visibleBarCount(wave.clientWidth) : 0;
    if (visible > 0) setTime((1214 * 10) / Math.min(visible, 179));
  }, []);
  return (
    <div ref={ref} className="contents">
      <ChatAudioPlayer {...props} duration={1214} currentTime={time} />
    </div>
  );
}

// ───────────────────────── piezas de la composición ─────────────────────────

interface SidebarProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (id: string) => void;
  /** Refs de los controles de cada tarjeta (para devolver el foco en móvil). */
  cardRefs?: MutableRefObject<Record<string, HTMLElement | null>>;
  figma?: boolean;
  className?: string;
}

/** Columna "Mensajes": encabezado con ajustes en la muesca, búsqueda, pestañas y lista de conversaciones. */
function ChatSidebar({ conversations, selectedId, onSelect, cardRefs, figma = false, className }: SidebarProps) {
  const [query, setQuery] = useState('');
  const filter = (pendingOnly: boolean) =>
    conversations.filter((c) => (!pendingOnly || c.pending) && c.name.toLowerCase().includes(query.trim().toLowerCase()));
  const totalUnread = conversations.reduce((n, c) => n + (c.unread ?? 0), 0);
  const titleId = useId();

  // Las tarjetas son botones que eligen la conversación (no rutas): lista con nombre, sin landmark de navegación. Con
  // ChatCard como enlace (`href`, una ruta por conversación) sí correspondería un `nav`.
  const list = (items: Conversation[]) => {
    let lines = 0;
    return (
      <ScrollArea role="region" aria-label="Conversaciones" className="min-h-0 flex-1 pr-ds-space-general-lg" data-figma-part="List user">
        <ul className="m-0 flex list-none flex-col gap-ds-space-general-md p-0" data-figma-part="Container2">
          {items.flatMap((c, i) => {
            const next = items[i + 1];
            // Separador "Line N" de Figma entre dos tarjetas no seleccionadas (decorativo)
            const separator =
              next && c.id !== selectedId && next.id !== selectedId ? (
                <li
                  key={`${c.id}-line`}
                  aria-hidden="true"
                  data-figma-part={`Line ${(lines += 1) + 1}`}
                  className="h-(--ds-responsive-border-general-md) shrink-0 bg-ds-border-general-gray-sixth"
                />
              ) : null;
            return [
              <li key={c.id}>
                <ChatCard
                  ref={(node) => {
                    if (cardRefs) cardRefs.current[c.id] = node;
                  }}
                  title={figma ? 'Titulo' : c.name}
                  description={figma ? (c.id === 'ana' ? 'Descripción' : 'Tienda oficial del libro ') : lastText(c)}
                  descriptionLines={2}
                  time={figma ? '20.00' : c.time}
                  unread={figma ? '00' : c.unread}
                  presence={c.online ? 'online' : 'offline'}
                  selected={c.id === selectedId}
                  leading={photo(c.photo, 'md')}
                  onClick={() => onSelect(c.id)}
                />
              </li>,
              separator,
            ];
          })}
          {items.length === 0 && <li className="p-ds-space-general-xl text-ds-text-neutral-body">Sin resultados</li>}
        </ul>
      </ScrollArea>
    );
  };

  return (
    <section
      aria-labelledby={titleId}
      data-figma-part="Mensajes"
      className={cn('relative isolate box-border flex min-h-0 flex-col gap-ds-space-general-3xl p-ds-space-general-2xl', className)}
    >
      <NotchedSurface notch="md" shadow="on-canva" className="[--surface-fill:var(--color-ds-background-container-default-on-canva)]" />
      <ButtonCorner variant="icon" status="on-canva" size="md" aria-label="Ajustes del chat" icon={<Icon name="setting" size={16} variant="fill" data-figma-part="Icon-sizes" />} className="absolute top-0 right-0" />
      <div className="flex items-center gap-ds-space-general-lg pr-12">
        <h2
          id={titleId}
          className="m-0 font-ds-primitives-typography-family-secundary text-ds-typography-heading-size-lg leading-ds-typography-heading-line-height-lg text-ds-text-neutral-heading [font-weight:var(--ds-primitives-typography-weight-semibold)]"
        >
          Chat
        </h2>
        <Badge type="number" label="mensajes sin leer">
          {figma ? '10' : totalUnread}
        </Badge>
      </div>
      <Input variant="search" label={figma ? 'Label' : 'Buscar conversación'} fullWidth value={query} onValueChange={setQuery} />
      <Tabs defaultValue="all" className="flex min-h-0 flex-1 flex-col gap-ds-space-general-3xl">
        <TabList aria-label="Filtrar conversaciones" fullWidth>
          <Tab value="all" icon="heart" badge={figma ? '00' : conversations.length} badgeLabel="conversaciones">
            Todos
          </Tab>
          <Tab value="pending" icon="heart" badge={figma ? '00' : filter(true).length} badgeLabel="conversaciones">
            No gestionados
          </Tab>
        </TabList>
        <TabPanel value="all" focusable={false} className="flex min-h-0 flex-1 flex-col">
          {list(filter(false))}
        </TabPanel>
        <TabPanel value="pending" focusable={false} className="flex min-h-0 flex-1 flex-col">
          {list(filter(true))}
        </TabPanel>
      </Tabs>
    </section>
  );
}

interface ConversationViewProps {
  conversation: Conversation;
  onSend: (text: string) => void;
  touch?: boolean;
  /** Encabezado con volver (móvil). Figma no lo dibuja. */
  onBack?: () => void;
  headingRef?: Ref<HTMLHeadingElement>;
  figma?: boolean;
  className?: string;
}

/** Columna "Conversación": registro de mensajes y composer. */
function ConversationView({ conversation, onSend, touch = false, onBack, headingRef, figma = false, className }: ConversationViewProps) {
  const [recorded, setRecorded] = useState(touch && figma);
  const titleId = useId();
  return (
    <section
      aria-labelledby={titleId}
      data-figma-part="Conversación"
      className={cn('box-border flex min-h-0 min-w-0 flex-col gap-ds-space-general-2xl p-ds-space-general-2xl', className)}
    >
      <div className={cn('flex items-center gap-ds-space-general-lg', !onBack && 'sr-only')}>
        {onBack && (
          <Button variant="tertiary" size="xs" onClick={onBack} leftIcon={<Icon name="chevron-left" size={20} variant="fill" />}>
            Conversaciones
          </Button>
        )}
        <h2
          id={titleId}
          ref={headingRef}
          tabIndex={-1}
          className="m-0 min-w-0 flex-1 truncate text-right font-ds-primitives-typography-family-secundary text-ds-typography-heading-size-sm leading-ds-typography-heading-line-height-sm text-ds-text-neutral-heading outline-none [font-weight:var(--ds-primitives-typography-weight-semibold)]"
        >
          {conversation.name}
        </h2>
      </div>
      {/* Al enviar, la lista baja siempre (aunque se hubiera subido a leer): quien escribe ve su mensaje */}
      <ChatMessageList
        aria-label={`Mensajes con ${conversation.name}`}
        scrollToBottomKey={conversation.messages.filter((m) => m.mine).length}
        className="flex-1"
        data-figma-part="Container3"
      >
        {conversation.messages.map((m) => (
          <ChatMessage
            key={m.id}
            direction={m.mine ? 'outgoing' : 'incoming'}
            type={m.audio ? 'audio' : 'text'}
            author={m.mine ? 'Tú' : conversation.name}
            time={m.time}
            avatar={photo(m.mine ? ME : conversation.photo)}
          >
            {m.audio ? (
              figma ? <FigmaAudioPlayer /> : <ChatAudioPlayer duration={m.audio} />
            ) : figma ? (
              'Tienda oficial del libro '
            ) : (
              m.text
            )}
          </ChatMessage>
        ))}
      </ChatMessageList>
      <ChatComposer
        touch={touch}
        label={`Mensaje para ${conversation.name}`}
        onSend={onSend}
        onRecord={() => setRecorded(true)}
        attachments={touch ? (recorded ? iconButton('add-2', 'Adjuntar', true) : undefined) : undefined}
        audio={
          recorded ? (
            figma ? (
              <FigmaAudioPlayer buttonVariant={touch ? 'primary' : 'secondary'} />
            ) : (
              <ChatAudioPlayer duration={9} buttonVariant={touch ? 'primary' : 'secondary'} />
            )
          ) : undefined
        }
        onSendAudio={() => {
          setRecorded(false);
          onSend('Mensaje de voz');
        }}
      />
    </section>
  );
}

type DetailsView = 'profile' | 'documents' | 'photos';

/**
 * Columna de detalle: perfil, documentos y fotografías. Cambiar de vista desmonta el botón pulsado: al abrir una vista el
 * foco va a "Anterior" y al volver, a la fila de la vista que se cerró.
 */
function DetailsColumn({ conversation, figma = false }: { conversation: Conversation; figma?: boolean }) {
  const [view, setView] = useState<DetailsView>('profile');
  const backRef = useRef<HTMLButtonElement>(null);
  const documentsRef = useRef<HTMLElement>(null);
  const photosRef = useRef<HTMLElement>(null);
  const closedView = useRef<DetailsView>('profile');
  const moved = useRef(false);

  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    if (view !== 'profile') backRef.current?.focus();
    else (closedView.current === 'documents' ? documentsRef : photosRef).current?.focus();
  }, [view]);

  const go = (next: DetailsView) => {
    if (next === 'profile') closedView.current = view;
    moved.current = true;
    setView(next);
  };
  const tiles = (count: number) =>
    Array.from({ length: count }, (_, i) => (
      <FileCard key={i} type="thumbnail" title={`Fotografía ${i + 1}`} selection="checkbox" className="size-auto aspect-square w-full" />
    ));
  return (
    <ChatDetailsPanel
      aria-label={`Detalles de ${conversation.name}`}
      collapsible={view === 'profile'}
      data-figma-part="Laterales (Atom)"
      className="h-full shrink-0"
    >
      {({ collapsed }) =>
        collapsed ? (
          <>
            <Avatar variant="photo" size="sm" src={PHOTO_SRC[conversation.photo]} alt="" />
            <div className="flex flex-col gap-ds-space-general-2xl">
              <ChatDetailsLink compact icon="folder">
                Documentos
              </ChatDetailsLink>
              <ChatDetailsLink compact icon="gallery">
                Fotografías
              </ChatDetailsLink>
            </div>
          </>
        ) : view === 'profile' ? (
          <>
            <ChatDetailsProfile
              avatar={
                <Avatar
                  variant="photo"
                  size="md"
                  src={PHOTO_SRC[conversation.photo]}
                  alt=""
                  badge={conversation.online}
                  badgeState="success"
                  badgeLabel="En línea"
                />
              }
              name={figma ? 'Heading' : conversation.name}
              description={figma ? 'Lorem ipsum dolor sit amet.' : 'Cliente desde 2021'}
              headingLevel={3}
            />
            <ul className="m-0 list-none p-0">
              <ChatDetailsLink ref={documentsRef} icon="folder" onClick={() => go('documents')}>
                Documentos
              </ChatDetailsLink>
              <ChatDetailsLink ref={photosRef} icon="gallery" onClick={() => go('photos')}>
                Fotografías
              </ChatDetailsLink>
            </ul>
            <ChatDetailsGrid aria-label="Fotografías recientes">{tiles(10)}</ChatDetailsGrid>
          </>
        ) : (
          <>
            <ChatDetailsHeader
              backRef={backRef}
              onBack={() => go('profile')}
              actions={
                <Button iconOnly variant="secondary" size="xs" aria-label="Descargar seleccionados" className={SMALL_ICON}>
                  <Icon name="download" size={16} variant="fill" />
                </Button>
              }
            />
            <ChatDetailsGrid aria-label={view === 'documents' ? 'Documentos' : 'Fotografías'}>
              {view === 'documents'
                ? Array.from({ length: 6 }, (_, i) => (
                    <FileCard key={i} type="icon" title={`Factura ${i + 1}.pdf`} description="Tamaño de archivo: 23 KB" selection="checkbox" />
                  ))
                : tiles(12)}
            </ChatDetailsGrid>
          </>
        )
      }
    </ChatDetailsPanel>
  );
}

// ───────────────────────── estado de la pantalla ─────────────────────────

function useConversations() {
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const send = (id: string, text: string) =>
    setConversations((list) =>
      list.map((c) => {
        if (c.id !== id) return c;
        const now = new Date();
        const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        return { ...c, messages: [...c.messages, { id: c.messages.length + 1, mine: true, time, text }] };
      })
    );
  return { conversations, send };
}

function DesktopScreen({ figma = false, frame }: { figma?: boolean; frame?: string }) {
  const { conversations, send } = useConversations();
  const [selectedId, setSelectedId] = useState('ana');
  const current = conversations.find((c) => c.id === selectedId) ?? conversations[0];
  return (
    <div data-figma={frame} className="box-border flex h-[896px] w-[1286px] gap-ds-space-general-lg">
      <ChatSidebar conversations={conversations} selectedId={selectedId} onSelect={setSelectedId} figma={figma} className="w-[300px] shrink-0" />
      <ConversationView
        key={current.id}
        conversation={current}
        onSend={(text) => send(current.id, text)}
        figma={figma}
        className="flex-1 rounded-ds-radius-container-on-card bg-ds-background-container-default-on-canva shadow-ds-on-canva"
      />
      <DetailsColumn key={`details-${current.id}`} conversation={current} figma={figma} />
    </div>
  );
}

function MobileScreen({ figma = false, frame, initialView = 'list' }: { figma?: boolean; frame?: string; initialView?: 'list' | 'conversation' }) {
  const { conversations, send } = useConversations();
  const [selectedId, setSelectedId] = useState('ana');
  const [view, setView] = useState(initialView);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const current = conversations.find((c) => c.id === selectedId) ?? conversations[0];

  // Foco al cambiar de vista (no en la carga inicial)
  useEffect(() => {
    if (!moved.current) return;
    if (view === 'conversation') headingRef.current?.focus();
    else cardRefs.current[selectedId]?.focus();
  }, [view, selectedId]);

  const go = (next: 'list' | 'conversation') => {
    moved.current = true;
    setView(next);
  };

  return (
    <div data-figma={frame} className="box-border flex h-[750px] w-[376px] flex-col">
      {view === 'list' ? (
        <ChatSidebar
          conversations={conversations}
          selectedId={selectedId}
          cardRefs={cardRefs}
          onSelect={(id) => {
            setSelectedId(id);
            go('conversation');
          }}
          className="h-full"
        />
      ) : (
        <ConversationView
          // En la matriz conviven las dos pantallas: el nombre de la región no puede repetirse
          conversation={figma ? { ...current, name: `${current.name} (móvil)` } : current}
          onSend={(text) => send(current.id, text)}
          touch
          figma={figma}
          onBack={figma ? undefined : () => go('list')}
          headingRef={headingRef}
          className="h-full bg-ds-background-container-surface"
        />
      )}
    </div>
  );
}

/** Escritorio (1286×896): lista, conversación y detalle. */
export const Desktop: Story = {
  render: () => (
    <div className="min-h-screen bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Pantalla de chat" className="max-w-full overflow-x-auto">
        <DesktopScreen />
      </div>
    </div>
  ),
};

/** Móvil (376×750): lista y conversación como dos vistas, con el foco gestionado al cambiar. */
export const Mobile: Story = {
  render: () => (
    <div className="min-h-screen bg-ds-background-general-black p-6">
      <MobileScreen />
    </div>
  ),
};

const FrameLabel = ({ children }: { children: ReactNode }) => <p className="m-0 mb-2 text-xs text-ds-text-neutral-body">{children}</p>;

/** Las dos variantes de Figma con sus textos, para el comparador (la móvil abre directamente la conversación). */
export const FigmaMatrix: Story = {
  render: () => (
    // Sin padding en pantallas angostas: el comparador abre el marco móvil (376) en una vista de 390
    <div className="bg-ds-background-general-black p-6 mobile:p-0">
      <div role="region" tabIndex={0} aria-label="Matriz de la pantalla de chat" className="flex max-w-full flex-col gap-10 overflow-x-auto">
        <div>
          <FrameLabel>Type=Desktop</FrameLabel>
          <DesktopScreen figma frame="Type=Desktop" />
        </div>
        <div>
          <FrameLabel>Type=Mobile</FrameLabel>
          <MobileScreen figma frame="Type=Mobile" initialView="conversation" />
        </div>
      </div>
    </div>
  ),
};

/** Test: enviar con Enter agrega el mensaje al registro; en móvil, abrir y volver mueve el foco sin trampas. */
export const FlowTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex gap-6 bg-ds-background-general-black p-6">
      <MobileScreen />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole('button', { name: 'Sara Molina' });
    await userEvent.click(card);
    const heading = await canvas.findByRole('heading', { name: 'Sara Molina' });
    await waitFor(() => expect(heading).toHaveFocus());
    const log = canvas.getByRole('log', { name: 'Mensajes con Sara Molina' });
    const field = canvas.getByRole('textbox', { name: 'Mensaje para Sara Molina' });
    await userEvent.click(field);
    await userEvent.keyboard('Sí, claro{Enter}');
    await expect(within(log).getAllByRole('listitem').at(-1)).toHaveTextContent(/^Tú, \d\d:\d\d: Sí, claro$/);
    await userEvent.click(canvas.getByRole('button', { name: 'Conversaciones' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Sara Molina' })).toHaveFocus());
    await expect(canvas.queryByRole('log')).not.toBeInTheDocument();
  },
};

/** Test: el mensaje propio baja la lista aunque se haya subido a leer; las vistas del detalle no pierden el foco. */
export const ScrollAndFocusTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <DesktopScreen />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const log = canvas.getByRole('log', { name: 'Mensajes con Ana Pérez' });
    const field = canvas.getByRole('textbox', { name: 'Mensaje para Ana Pérez' });
    await userEvent.click(field);
    for (let i = 1; i <= 10; i++) await userEvent.keyboard(`Mensaje ${i}{Enter}`);
    await waitFor(() => expect(log.scrollHeight).toBeGreaterThan(log.clientHeight));
    log.scrollTop = 0;
    log.dispatchEvent(new Event('scroll'));
    await userEvent.click(field);
    await userEvent.keyboard('Propio tras subir{Enter}');
    await waitFor(() => expect(log.scrollHeight - log.scrollTop - log.clientHeight).toBeLessThanOrEqual(1));

    // Detalle: abrir Documentos lleva el foco a "Anterior"; volver, a "Documentos"
    await userEvent.click(canvas.getByRole('button', { name: 'Documentos' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Anterior' })).toHaveFocus());
    await userEvent.click(canvas.getByRole('button', { name: 'Anterior' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Documentos' })).toHaveFocus());
  },
};
