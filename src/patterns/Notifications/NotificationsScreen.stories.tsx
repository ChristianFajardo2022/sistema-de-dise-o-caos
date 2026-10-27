import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { ButtonCorner } from '../../components/ButtonCorner';
import { EmptyState } from '../../components/EmptyState';
import { Icon } from '../../components/Icon';
import { NotificationCard } from '../../components/NotificationCard';
import { NotificationGroup, NotificationGroupItem } from '../../components/NotificationGroup';
import { NotificationItem } from '../../components/NotificationItem';
import { FIGMA_LOREM } from '../../components/NotificationItem/NotificationItem.shared';
import {
  NotificationFilter,
  NotificationPanelHeading,
  NotificationTabStrip,
  notificationPanelDividerVariants,
  notificationPanelListVariants,
} from '../../components/NotificationPanel';
import type { NotificationFilterValue, NotificationPanelTab } from '../../components/NotificationPanel';
import { ScrollArea } from '../../components/ScrollArea';
import { Tabs } from '../../components/Tabs';

/**
 * Pantalla móvil de notificaciones (set "Simple mobile notifications template" de Figma, 13539:83437, 375×798).
 *
 * Es una **composición**, no un componente exportado: cada producto decide a dónde vuelve la flecha, qué trae cada
 * pestaña y cómo se cargan los datos. Se arma con las piezas del sistema: `ButtonCorner` (volver), `NotificationFilter`
 * (chips "Todas" / "No leídos"), `NotificationTabStrip` dentro de `Tabs`, `NotificationItem`, `NotificationCard`,
 * `NotificationGroup`, `EmptyState`, `ScrollArea`, `Avatar` y `Button`.
 *
 * - Tres vistas (Type): sin notificaciones (`EmptyState`), con notificaciones y perfil (cuenta y cerrar sesión).
 *   Dos estados (State): simple (filas de texto) y complejo (pestañas, secciones "Hoy" y "Ayer", tarjetas y grupos).
 * - Es una región nombrada por su título (`<h1>`); la lista es `<ul role="list">` y se desplaza dentro del `ScrollArea`.
 * - Eliminar una notificación mueve el foco a la vecina; si era la última, a la pantalla.
 * - Pensada para viewport móvil (< 48rem): los espacios y los chips usan los tokens responsive.
 */
const meta = {
  title: 'Patterns/Notifications/Screen',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────── datos de ejemplo ─────────────────────────

interface Note {
  id: number;
  title: string;
  description: string;
  unread: boolean;
}

const NOTES: Note[] = [
  { id: 1, title: 'Pago recibido', description: 'Recibimos tu pago de la factura de octubre.', unread: true },
  { id: 2, title: 'Factura lista', description: 'Ya puedes descargar tu factura de octubre.', unread: true },
  { id: 3, title: 'Mensaje nuevo', description: 'Ana te escribió sobre la reunión.', unread: true },
  { id: 4, title: 'Cuenta actualizada', description: 'Cambiaste el correo de tu cuenta.', unread: false },
  { id: 5, title: 'Nueva factura', description: 'Ya puedes descargar la de noviembre.', unread: false },
];

const TABS: NotificationPanelTab[] = [
  { value: 'all', label: 'Todas', icon: 'notification', badge: 5, badgeLabel: 'notificaciones' },
  { value: 'payments', label: 'Pagos', icon: 'document', badge: 2, badgeLabel: 'sin leer' },
  { value: 'account', 'aria-label': 'Cuenta', icon: 'setting' },
];

// Figma nombra "00" la capa de texto del contador de cada pestaña: el comparador la empareja por ese nombre
const figmaBadge = <span data-figma-part="00">00</span>;
const FIGMA_TABS: NotificationPanelTab[] = [
  { value: 'one', label: 'Text', icon: 'heart', badge: figmaBadge },
  { value: 'two', icon: 'box-2', badge: figmaBadge, 'aria-label': 'Segunda' },
  { value: 'three', icon: 'box-2', badge: figmaBadge, 'aria-label': 'Tercera' },
];

const MENU = ['Mi cuenta', 'Mis pagos', 'Métodos de pago', 'Ayuda', 'Privacidad'];

// ───────────────────────── piezas de la pantalla ─────────────────────────

const titleClass =
  'm-0 font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)] text-ds-typography-heading-size-xs leading-ds-typography-heading-line-height-xs text-ds-text-neutral-heading';

function Frame({ frame, titleId, children }: { frame?: string; titleId: string; children: ReactNode }) {
  return (
    <section
      data-figma={frame}
      // En la matriz hay cinco pantallas con el mismo título: cada región lleva el nombre de su variante
      aria-label={frame}
      aria-labelledby={frame ? undefined : titleId}
      tabIndex={-1}
      className="box-border flex h-[798px] w-[375.33px] max-w-full flex-col gap-ds-space-general-3xl overflow-hidden bg-ds-background-container-surface p-ds-space-general-3xl outline-none"
    >
      {children}
    </section>
  );
}

function BackButton() {
  return (
    <ButtonCorner
      variant="icon"
      status="on-canva"
      size="md"
      aria-label="Volver"
      className="size-11 px-ds-space-general-xl py-ds-space-general-lg [&_[data-slot=icon]]:size-5"
      icon={<Icon name="chevron-left" size={20} variant="fill" data-figma-part="Icon-sizes" />}
      data-figma-part="Button"
    />
  );
}

function TopBar({ titleId, children }: { titleId: string; children?: ReactNode }) {
  return (
    <div data-figma-part="Container" className="flex shrink-0 items-center gap-ds-space-general-lg">
      <div data-figma-part="Top App Bar" className="flex min-w-0 flex-1 items-center gap-ds-space-general-xl">
        <BackButton />
        <div data-figma-part="Tittle" className="min-w-0">
          <h1 id={titleId} data-figma-part="Notificaciones" className={titleClass}>
            Notificaciones
          </h1>
        </div>
      </div>
      {children}
    </div>
  );
}

const Divider = ({ part }: { part: string }) => (
  <div data-figma-part={part} aria-hidden="true" className={notificationPanelDividerVariants()} />
);

function SettingsButton() {
  return (
    <Button iconOnly variant="tertiary" size="xs" aria-label="Ajustes de notificaciones" data-figma-part="Button">
      <Icon name="setting" size={20} variant="fill" data-figma-part="Icon-sizes" />
    </Button>
  );
}

interface ListScreenProps {
  complex: boolean;
  empty?: boolean;
  figma?: boolean;
  frame?: string;
}

/** Pantallas "No notifications" y "Notifications" (simple y complejo). */
function ListScreen({ complex, empty = false, figma = false, frame }: ListScreenProps) {
  const titleId = useId();
  const [filter, setFilter] = useState<NotificationFilterValue>('all');
  const [notes, setNotes] = useState(NOTES);
  const [tab, setTab] = useState(complex ? (figma ? 'one' : 'all') : '');
  const [cards, setCards] = useState([1, 2]);
  const shown = filter === 'unread' ? notes.filter((n) => n.unread) : notes;
  const noData = empty || (!complex && shown.length === 0);
  const markRead = (id: number) => setNotes((all) => all.map((n) => (n.id === id ? { ...n, unread: false } : n)));

  const filterRow = (
    <div data-figma-part="Chips" className="flex shrink-0 items-center gap-ds-space-general-lg">
      <NotificationFilter value={filter} onValueChange={setFilter} />
      {complex && <SettingsButton />}
    </div>
  );

  const simpleList = figma ? (
    <ul role="list" aria-label="Lista de notificaciones" className={notificationPanelListVariants({ variant: 'simple' })}>
      {Array.from({ length: 9 }, (_, i) => (
        <NotificationItem key={i} title="Text notification" description="Text description" unread={i < 7} />
      ))}
    </ul>
  ) : (
    <ul role="list" aria-label="Lista de notificaciones" className={notificationPanelListVariants({ variant: 'simple' })}>
      {shown.map((n) => (
        <NotificationItem key={n.id} title={n.title} description={n.description} unread={n.unread} onClick={() => markRead(n.id)} />
      ))}
    </ul>
  );

  const complexList = (
    <ul role="list" aria-label="Lista de notificaciones" className={notificationPanelListVariants({ variant: 'complex' })}>
      <NotificationPanelHeading headingLevel={2}>Hoy</NotificationPanelHeading>
      {figma ? (
        <>
          <NotificationCard time="Hace 22m" title="Heading" description={FIGMA_LOREM} unread />
          <NotificationCard time="Hace 22m" title="Heading" description={FIGMA_LOREM} unread />
        </>
      ) : (
        cards.map((id) => (
          <NotificationCard
            key={id}
            time="Hace 22 min"
            title={`Factura ${1040 + id}`}
            description="Tu pago fue confirmado."
            unread
            onClick={() => {}}
            onDelete={() => setCards((all) => all.filter((x) => x !== id))}
          />
        ))
      )}
      <NotificationGroup time={figma ? 'Hace 22m' : 'Hace 1 h'} title={figma ? 'Heading' : 'Cuenta'} count={2} unread>
        <NotificationGroupItem time="Hace 22m" description={figma ? FIGMA_LOREM : 'Cambiaste tu contraseña.'} />
        <NotificationGroupItem time="Hace 22m" description={figma ? FIGMA_LOREM : 'Iniciaste sesión en un equipo nuevo.'} />
      </NotificationGroup>
      <NotificationPanelHeading headingLevel={2}>Ayer</NotificationPanelHeading>
      <NotificationGroup time={figma ? 'Hace 22m' : 'Ayer'} title={figma ? 'Heading' : 'Facturas'} count={2} unread>
        <NotificationGroupItem time="Hace 22m" description={figma ? FIGMA_LOREM : 'Tu factura de octubre está lista.'} />
        <NotificationGroupItem time="Hace 22m" description={figma ? FIGMA_LOREM : 'Tu factura de septiembre está lista.'} />
      </NotificationGroup>
    </ul>
  );

  const body = noData ? (
    <div data-figma-part="Content" className="flex min-h-0 flex-1 items-center justify-center">
      <EmptyState
        type="no-content"
        icon={complex && !figma ? 'notification' : 'document'}
        description={figma ? 'Text description' : filter === 'unread' ? 'No tienes notificaciones sin leer.' : 'No tienes notificaciones.'}
      />
    </div>
  ) : (
    <div data-figma-part="Content" className="min-h-0 flex-1">
      <ScrollArea aria-label="Lista de notificaciones" className="h-full">
        {complex ? complexList : simpleList}
      </ScrollArea>
    </div>
  );

  return (
    <Frame frame={frame} titleId={titleId}>
      <TopBar titleId={titleId}>{filterRow}</TopBar>
      {complex && (
        <Tabs size="md" contrast="on-canva" value={tab} onValueChange={setTab} className="shrink-0">
          <NotificationTabStrip tabs={figma ? FIGMA_TABS : TABS} scrollButtons />
        </Tabs>
      )}
      <Divider part="Vector 1" />
      {body}
    </Frame>
  );
}

/** Pantalla "Profile": cuenta de la persona, accesos y cerrar sesión. */
function ProfileScreen({ figma = false, frame }: { figma?: boolean; frame?: string }) {
  const titleId = useId();
  return (
    <Frame frame={frame} titleId={titleId}>
      <TopBar titleId={titleId} />
      <div data-figma-part="Container" className="flex shrink-0 items-center gap-ds-space-general-lg">
        <Avatar variant="initials" name="Ana Pérez" size="sm" color="purple" />
        <div data-figma-part="Name" className="flex min-w-0 flex-1 flex-col">
          <p
            data-figma-part="User name"
            className="m-0 truncate font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-semibold)] text-ds-primitives-typography-size-lg leading-ds-typography-body-line-height-short-lg text-ds-text-neutral-white"
          >
            Ana Pérez
          </p>
          <p
            data-figma-part="User email"
            className="m-0 truncate font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)] text-ds-primitives-typography-size-sm leading-ds-typography-body-line-height-short-sm text-ds-text-acent-firts"
          >
            ana.perez@ejemplo.com
          </p>
        </div>
        <Button iconOnly variant="tertiary" size="sm" aria-label="Cerrar sesión" className="[&_[data-slot=icon]]:size-6" data-figma-part="Button">
          <Icon name="logout2" size={24} variant="fill" data-figma-part="Icon-sizes" />
        </Button>
      </div>
      <Divider part="Vector 2" />
      <div data-figma-part="Content" className="min-h-0 flex-1">
        <ScrollArea aria-label="Accesos de la cuenta" className="h-full">
          <nav aria-label="Cuenta">
            <ul role="list" className="m-0 flex list-none flex-col gap-ds-space-general-lg p-0">
              {MENU.map((item, i) => (
                <li
                  key={item}
                  className={
                    i < MENU.length - 1
                      ? 'pb-ds-space-general-lg [box-shadow:inset_0_calc(var(--ds-responsive-border-general-md)_*_-1)_0_0_var(--color-ds-border-general-default-on-card)]'
                      : ''
                  }
                >
                  <a
                    href="#cuenta"
                    className="box-border flex w-full items-center rounded-ds-radius-general-lg p-ds-space-general-lg font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)] text-ds-primitives-typography-size-md leading-ds-typography-body-line-height-short-md text-ds-text-neutral-white no-underline outline-offset-2 outline-ds-border-field-active hover:bg-ds-background-container-hover-on-canva focus-visible:outline-2 focus-visible:outline-solid"
                  >
                    <span data-figma-part="Text item">{figma ? 'Text item' : item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </ScrollArea>
      </div>
    </Frame>
  );
}

// ───────────────────────── historias ─────────────────────────

const Stage = ({ children }: { children: ReactNode }) => (
  <div className="flex justify-center bg-ds-background-general-black p-6 max-md:p-0">{children}</div>
);

/** Móvil, simple: filas de texto con filtro. Abrir una notificación la marca como leída. */
export const Simple: Story = {
  render: () => (
    <Stage>
      <ListScreen complex={false} />
    </Stage>
  ),
};

/** Móvil, complejo: pestañas con desplazamiento, secciones, tarjetas con eliminar y grupos. */
export const Complex: Story = {
  render: () => (
    <Stage>
      <ListScreen complex />
    </Stage>
  ),
};

/** Móvil sin notificaciones (`EmptyState`). */
export const Empty: Story = {
  render: () => (
    <Stage>
      <ListScreen complex={false} empty />
    </Stage>
  ),
};

/** Móvil, perfil: cuenta y accesos. */
export const Profile: Story = {
  render: () => (
    <Stage>
      <ProfileScreen />
    </Stage>
  ),
};

const FrameLabel = ({ children }: { children: ReactNode }) => (
  <p className="m-0 mb-2 text-xs text-ds-text-neutral-body">{children}</p>
);

const FIGMA: { name: string; render: (name: string) => ReactNode }[] = [
  { name: 'Type=No notifications, State=Simple', render: (n) => <ListScreen figma complex={false} empty frame={n} /> },
  { name: 'Type=Notifications, State=Simple', render: (n) => <ListScreen figma complex={false} frame={n} /> },
  { name: 'Type=Profile, State=Simple', render: (n) => <ProfileScreen figma frame={n} /> },
  { name: 'Type=No notifications, State=Complex', render: (n) => <ListScreen figma complex empty frame={n} /> },
  { name: 'Type=Notifications, State=Complex', render: (n) => <ListScreen figma complex frame={n} /> },
];

/** Las cinco pantallas de Figma con sus textos (apiladas: el comparador las abre con vista de 390). */
export const FigmaMatrix: Story = {
  render: () => (
    <div className="bg-ds-background-general-black p-6 max-md:p-0">
      <div role="region" tabIndex={0} aria-label="Matriz de la pantalla de notificaciones" className="flex max-w-full flex-col gap-10 overflow-x-auto">
        {FIGMA.map((v) => (
          <div key={v.name}>
            <FrameLabel>{v.name}</FrameLabel>
            {v.render(v.name)}
          </div>
        ))}
      </div>
    </div>
  ),
};

/** Test: región con título, filtro, abrir y eliminar con el foco en la vecina, y pestañas en el complejo. */
export const FlowTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <Stage>
      <ListScreen complex={false} />
    </Stage>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('region', { name: 'Notificaciones' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Volver' })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('radio', { name: 'No leídos' }));
    await waitFor(() => expect(canvas.getAllByRole('listitem')).toHaveLength(3));
    // Abrir una notificación la marca como leída: sale del filtro "No leídos"
    await userEvent.click(canvas.getByRole('button', { name: 'Pago recibido' }));
    await waitFor(() => expect(canvas.getAllByRole('listitem')).toHaveLength(2));
    await userEvent.click(canvas.getByRole('radio', { name: 'Todas' }));
    await waitFor(() => expect(canvas.getAllByRole('listitem')).toHaveLength(5));
    await expect(canvas.getByRole('button', { name: 'Pago recibido' })).toHaveAccessibleDescription(/^Recibimos/);
  },
};

/** Test: el complejo trae pestañas, secciones con encabezado y el botón eliminar con foco a la vecina. */
export const ComplexFlowTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <Stage>
      <ListScreen complex />
    </Stage>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('tab')).toHaveLength(3);
    await expect(canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(['Hoy', 'Ayer']);
    await userEvent.click(canvas.getByRole('button', { name: 'Eliminar notificación: Factura 1041' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Factura 1042' })).toHaveFocus());
  },
};

/** Test: el perfil expone la cuenta y los accesos como navegación con nombre. */
export const ProfileTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <Stage>
      <ProfileScreen />
    </Stage>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('navigation', { name: 'Cuenta' })).toBeInTheDocument();
    await expect(canvas.getAllByRole('link')).toHaveLength(5);
    await expect(canvas.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument();
  },
};
