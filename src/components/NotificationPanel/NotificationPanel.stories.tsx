import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { NotificationPanel } from './NotificationPanel';
import { NotificationPanelHeading } from './NotificationPanelHeading';
import type { NotificationFilterValue, NotificationPanelTab } from './NotificationPanel.types';
import { NotificationBell } from '../NotificationBell';
import { NotificationCard } from '../NotificationCard';
import { NotificationGroup, NotificationGroupItem } from '../NotificationGroup';
import { NotificationItem } from '../NotificationItem';
import { FIGMA_LOREM } from '../NotificationItem/NotificationItem.shared';

const meta = {
  title: 'Overlays/NotificationPanel',
  component: NotificationPanel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story, { parameters }) =>
      parameters.fullWidth ? (
        <Story />
      ) : (
        <div className="w-full max-w-[400px]">
          <Story />
        </div>
      ),
  ],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['simple', 'complex'],
      type: { name: 'enum', value: ['simple', 'complex'] },
      description: 'Type de Figma: simple (filas de texto) o complex (pestañas, tarjetas y grupos)',
    },
    title: { control: 'text', type: { name: 'string' }, description: 'Texto del encabezado' },
    empty: { control: 'boolean', type: { name: 'boolean' }, description: 'Type "No notification" de Figma: estado vacío' },
    popup: { control: 'boolean', type: { name: 'boolean' }, description: 'role="dialog" no modal (se abre desde la campana)' },
    tabScrollButtons: { control: 'boolean', type: { name: 'boolean' }, description: 'Left y Right chevron tab de Figma' },
  },
  args: { variant: 'simple' },
} satisfies Meta<typeof NotificationPanel>;

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
  { id: 3, title: 'Cuenta actualizada', description: 'Cambiaste el correo de tu cuenta.', unread: false },
  { id: 4, title: 'Nueva factura', description: 'Ya puedes descargar tu factura de noviembre.', unread: false },
];

const TABS: NotificationPanelTab[] = [
  { value: 'all', label: 'Todas', icon: 'notification', badge: 4, badgeLabel: 'notificaciones' },
  { value: 'payments', label: 'Pagos', icon: 'document', badge: 2, badgeLabel: 'sin leer' },
  { value: 'account', 'aria-label': 'Cuenta', icon: 'setting' },
];

// ───────────────────────── historias ─────────────────────────

/** Playground del panel simple: el filtro y la lista funcionan; el panel avisa de los cambios. */
function SimpleDemo({ empty = false }: { empty?: boolean }) {
  const [notes, setNotes] = useState(empty ? [] : NOTES);
  const [filter, setFilter] = useState<NotificationFilterValue>('all');
  const shown = filter === 'unread' ? notes.filter((n) => n.unread) : notes;
  return (
    <NotificationPanel
      filter={filter}
      onFilterChange={setFilter}
      empty={shown.length === 0}
    >
      {shown.map((n) => (
        <NotificationItem
          key={n.id}
          title={n.title}
          description={n.description}
          unread={n.unread}
          onClick={() => setNotes((all) => all.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))}
        />
      ))}
    </NotificationPanel>
  );
}
export const Simple: Story = { render: () => <SimpleDemo /> };

/** Sin notificaciones: el `EmptyState` ocupa el lugar de la lista. */
export const Empty: Story = { render: () => <SimpleDemo empty /> };

/** Panel complejo: pestañas con contador, secciones "Hoy" y "Ayer", tarjetas con eliminar y un grupo desplegable. */
function ComplexDemo({ scroll = false }: { scroll?: boolean }) {
  const [filter, setFilter] = useState<NotificationFilterValue>('all');
  const [cards, setCards] = useState([1, 2]);
  return (
    <NotificationPanel
      variant="complex"
      filter={filter}
      onFilterChange={setFilter}
      onSettingsClick={() => {}}
      tabs={TABS}
      tabScrollButtons={scroll}
    >
      {(tab) => (
        <>
          <NotificationPanelHeading>Hoy</NotificationPanelHeading>
          {cards.map((id) => (
            <NotificationCard
              key={id}
              time="Hace 22 min"
              title={`Factura ${1040 + id}`}
              description={tab === 'payments' ? 'Pagos: tu pago fue confirmado.' : 'Todas: tu pago fue confirmado.'}
              unread
              onClick={() => {}}
              onDelete={() => setCards((all) => all.filter((x) => x !== id))}
            />
          ))}
          <NotificationGroup title="Actualizaciones de la cuenta" time="Hace 1 h" unread>
            <NotificationGroupItem time="Hace 1 h" description="Cambiaste tu contraseña." unread />
            <NotificationGroupItem time="Hace 3 h" description="Iniciaste sesión en un equipo nuevo." />
          </NotificationGroup>
          <NotificationPanelHeading>Ayer</NotificationPanelHeading>
          <NotificationCard time="Ayer" title="Factura lista" description="Ya puedes descargarla." />
        </>
      )}
    </NotificationPanel>
  );
}
export const Complex: Story = { render: () => <ComplexDemo /> };

/** Con los botones de desplazamiento de las pestañas (Left y Right chevron tab de Figma). */
export const ComplexWithTabScroll: Story = { render: () => <ComplexDemo scroll /> };

/** Se abre desde la campana: diálogo no modal. Escape lo cierra y el foco vuelve a la campana. */
function PopupDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-[28rem] w-[400px] flex-col items-end gap-2">
      <NotificationBell
        size="sm"
        count={2}
        open={open}
        aria-controls="notifications-panel"
        aria-haspopup="dialog"
        onClick={() => setOpen(!open)}
      />
      <NotificationPanel id="notifications-panel" popup open={open} onOpenChange={setOpen}>
        {NOTES.map((n) => (
          <NotificationItem key={n.id} title={n.title} description={n.description} unread={n.unread} />
        ))}
      </NotificationPanel>
    </div>
  );
}
export const FromBell: Story = { render: () => <PopupDemo /> };

// ───────────────────────── FigmaMatrix ─────────────────────────

const LOREM = FIGMA_LOREM;

const SIMPLE_VARIANTS = [
  { name: 'Type=No notification, State=Default', notified: false, open: false },
  { name: 'Type=No notification, State=Dropdown', notified: false, open: true },
  { name: 'Type=Notification, State=Default', notified: true, open: false },
  { name: 'Type=Notification, State=Dropdown', notified: true, open: true },
];

/**
 * Raíz de cada variante de Figma: la campana de 48×48 con el panel debajo, alineado a la derecha (x = -352, a 8 de la
 * campana en Dropdown y a 0 en Default, donde es transparente). El panel cerrado se deja en el DOM (opacidad 0,
 * `inert`) solo para medirlo como Figma.
 */
function Harness({
  name,
  notified,
  open,
  children,
}: {
  name: string;
  notified: boolean;
  open: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-[820px] w-[400px] justify-end">
      <div data-figma={name} className={`relative box-border flex h-12 w-12 flex-col items-end ${open ? 'gap-2' : 'gap-0'}`}>
        <NotificationBell size="sm" count={notified ? 99 : 0} open={open ? true : undefined} />
        <div
          inert={!open}
          aria-hidden={!open}
          className={`absolute right-0 w-[400px] ${open ? 'top-[calc(100%+0.5rem)]' : 'pointer-events-none top-full opacity-0'}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/** Las cuatro variantes de "Simple notifications" de Figma, con sus textos. */
export const FigmaMatrixSimple: Story = {
  parameters: { fullWidth: true },
  render: () => (
    <div className="grid w-fit grid-cols-2 gap-6 bg-ds-background-general-black p-6">
      {SIMPLE_VARIANTS.map((v) => (
        <Harness key={v.name} {...v}>
          <NotificationPanel
            aria-label={`Notificaciones (${v.name})`}
            empty={!v.notified}
            emptyDescription="Text description"
            filterLabels={{ all: 'Todas', unread: 'No leídos' }}
          >
            <NotificationItem title="Text notification" description="Text description" unread />
            <NotificationItem title="Text notification" description="Text description" unread />
            <NotificationItem title="Text notification" description="Text description" />
          </NotificationPanel>
        </Harness>
      ))}
    </div>
  ),
};

// Figma nombra "00" la capa de texto del contador de cada pestaña: el comparador la empareja por ese nombre
const figmaBadge = <span data-figma-part="00">00</span>;
const COMPLEX_TABS: NotificationPanelTab[] = [
  { value: 'one', label: 'Text', icon: 'heart', badge: figmaBadge },
  { value: 'two', icon: 'heart', badge: figmaBadge, 'aria-label': 'Segunda' },
  { value: 'three', icon: 'heart', badge: figmaBadge, 'aria-label': 'Tercera' },
];

/** Las cuatro variantes de "Complex notifications" de Figma, con sus textos. */
export const FigmaMatrixComplex: Story = {
  parameters: { fullWidth: true },
  render: () => (
    <div className="grid w-fit grid-cols-2 gap-6 bg-ds-background-general-black p-6">
      {SIMPLE_VARIANTS.map((v) => (
        <Harness key={v.name} {...v}>
          <NotificationPanel
            variant="complex"
            aria-label={`Notificaciones (${v.name})`}
            empty={!v.notified}
            emptyDescription="Text description"
            onSettingsClick={() => {}}
            tabs={COMPLEX_TABS}
            listMaxHeight="40rem"
          >
            <NotificationPanelHeading>Hoy</NotificationPanelHeading>
            <NotificationCard time="Hace 22m" title="Heading" description={LOREM} unread />
            <NotificationCard time="Hace 22m" title="Heading" description={LOREM} unread />
            <NotificationGroup time="Hace 22m" title="Heading" count={2} unread>
              <NotificationGroupItem time="Hace 22m" description={LOREM} />
              <NotificationGroupItem time="Hace 22m" description={LOREM} />
            </NotificationGroup>
            <NotificationPanelHeading>Ayer</NotificationPanelHeading>
            <NotificationGroup time="Hace 22m" title="Heading" count={2} unread>
              <NotificationGroupItem time="Hace 22m" description={LOREM} />
              <NotificationGroupItem time="Hace 22m" description={LOREM} />
            </NotificationGroup>
          </NotificationPanel>
        </Harness>
      ))}
    </div>
  ),
};

// ───────────────────────── tests ─────────────────────────

/** Test: región con nombre, lista nombrada, filtro como radiogroup y eliminar mueve el foco. */
export const StructureTest: Story = {
  tags: ['!autodocs'],
  render: () => <SimpleDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('region', { name: 'Notificaciones' })).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { level: 2, name: 'Notificaciones' })).toBeInTheDocument();
    const list = canvas.getByRole('list', { name: 'Lista de notificaciones' });
    await expect(within(list).getAllByRole('listitem')).toHaveLength(4);
    const filter = canvas.getByRole('radiogroup', { name: 'Filtrar notificaciones' });
    await userEvent.click(within(filter).getByRole('radio', { name: 'No leídos' }));
    await waitFor(() => expect(within(list).getAllByRole('listitem')).toHaveLength(2));
    await userEvent.click(within(filter).getByRole('radio', { name: 'Todas' }));
    await waitFor(() => expect(within(list).getAllByRole('listitem')).toHaveLength(4));
    // Abrir una notificación la marca como leída
    const first = within(list).getByRole('button', { name: 'Pago recibido' });
    await expect(first).toHaveAccessibleDescription(/^No leída/);
    await userEvent.click(first);
    await waitFor(() => expect(within(list).getByRole('button', { name: 'Pago recibido' })).toHaveAccessibleDescription(/^Recibimos/));
  },
};

/** Test: vacío con EmptyState y descripción según el filtro. */
export const EmptyTest: Story = {
  tags: ['!autodocs'],
  render: () => <SimpleDemo empty />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('No tienes notificaciones.')).toBeInTheDocument();
    await expect(canvas.queryByRole('list')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('radio', { name: 'No leídos' }));
    await expect(canvas.getByText('No tienes notificaciones sin leer.')).toBeInTheDocument();
  },
};

/** Test: en el complejo las pestañas cambian el contenido y los grupos y tarjetas se manejan por teclado. */
export const ComplexTest: Story = {
  tags: ['!autodocs'],
  render: () => <ComplexDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tablist = canvas.getByRole('tablist', { name: 'Categorías de notificaciones' });
    await expect(within(tablist).getAllByRole('tab')).toHaveLength(3);
    await expect(canvas.getByRole('button', { name: 'Ajustes de notificaciones' })).toBeInTheDocument();
    await expect(canvas.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['Hoy', 'Ayer']);
    await userEvent.click(within(tablist).getByRole('tab', { name: /Pagos/ }));
    await waitFor(() => expect(canvas.getAllByText(/^Pagos: tu pago/)).toHaveLength(2));
    // Eliminar la primera tarjeta con el botón: el foco pasa a la siguiente
    await userEvent.click(canvas.getAllByRole('button', { name: /^Eliminar notificación: Factura/ })[0]);
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Factura 1042' })).toHaveFocus());
    // Desplegar el grupo
    const toggle = canvas.getByRole('button', { name: /^Mostrar notificaciones Actualizaciones/ });
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  },
};

/** Test: como diálogo no modal, el foco entra al abrir, Escape cierra y el foco vuelve a la campana. */
export const PopupTest: Story = {
  tags: ['!autodocs'],
  render: () => <PopupDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bell = canvas.getByRole('button', { name: 'Notificaciones, 2 sin leer' });
    await expect(bell).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(bell);
    const dialog = await canvas.findByRole('dialog', { name: 'Notificaciones' });
    await expect(dialog).toHaveAttribute('aria-modal', 'false');
    await waitFor(() => expect(dialog).toHaveFocus());
    await expect(bell).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(bell).toHaveFocus());
    await expect(bell).toHaveAttribute('aria-expanded', 'false');
  },
};

/** Test: `onOpenChange` recibe `false` con Escape. */
export const EscapeTest: Story = {
  tags: ['!autodocs'],
  args: { popup: true, onOpenChange: fn() },
  render: (args) => (
    <NotificationPanel {...args}>
      <NotificationItem title="Aviso" description="Hola" />
    </NotificationPanel>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const dialog = canvas.getByRole('dialog', { name: 'Notificaciones' });
    await waitFor(() => expect(dialog).toHaveFocus());
    await userEvent.keyboard('{Escape}');
    await expect(args.onOpenChange).toHaveBeenCalledWith(false);
  },
};
