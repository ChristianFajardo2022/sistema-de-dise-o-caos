import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { NotificationPanel } from './NotificationPanel';
import { NotificationPanelHeading } from './NotificationPanelHeading';
import type { NotificationFilterValue, NotificationPanelProps, NotificationPanelTab } from './NotificationPanel.types';
import { NotificationBell } from '../NotificationBell';
import { NotificationCard } from '../NotificationCard';
import { NotificationGroup, NotificationGroupItem } from '../NotificationGroup';
import { NotificationItem } from '../NotificationItem';
import { FIGMA_LOREM } from '../NotificationItem/NotificationItem.shared';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { formatLiteral } from '../../docs/liveCode';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './NotificationPanel.doc';
import docsJson from './NotificationPanel.docs.json';

// ───────────────────────── datos de ejemplo ─────────────────────────

interface Note {
  id: number;
  title: string;
  description: string;
  unread: boolean;
}

const NOTES: Note[] = [
  { id: 1, title: 'Documento compartido', description: 'Ana Pérez compartió Informe anual contigo.', unread: true },
  { id: 2, title: 'Reunión reprogramada', description: 'La reunión de equipo pasó a las 3:00 p.m.', unread: true },
  { id: 3, title: 'Nuevo comentario', description: 'Hugo García comentó en Plan de trabajo.', unread: false },
  { id: 4, title: 'Ajustes guardados', description: 'Cambiaste el idioma de tu perfil.', unread: false },
];

const TABS: NotificationPanelTab[] = [
  { value: 'all', label: 'Todas', icon: 'notification', badge: 4, badgeLabel: 'notificaciones' },
  { value: 'docs', label: 'Documentos', icon: 'document', badge: 2, badgeLabel: 'sin leer' },
  { value: 'settings', 'aria-label': 'Ajustes', icon: 'setting' },
];

// ───────────────────────── Desarrollo (docsLive) ─────────────────────────

/**
 * Lienzo de Desarrollo (`docsLive.render`, recetas R1, R2 y R6): la campana y el panel, igual que el código copiable.
 * Arranca cerrado; la campana lo abre como diálogo no modal (`popup`): recibe el foco, Escape lo cierra y el foco vuelve a
 * la campana. El filtro cambia la lista. El clic fuera no lo cierra aquí (lo resuelve quien abre el panel; el código
 * copiable trae un ejemplo), para que tocar los controles de Personalizar no lo cierre.
 */
function DocsCanvas(args: Record<string, unknown>) {
  const { open: _open, popup: _popup, filter: _filter, tab: _tab, children: _children, ...rest } = args as Partial<NotificationPanelProps>;
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<NotificationFilterValue>(rest.defaultFilter ?? 'all');
  const complex = rest.variant === 'complex';
  const shown = filter === 'unread' ? NOTES.filter((n) => n.unread) : NOTES;
  return (
    <div className="flex w-100 flex-col items-end gap-ds-space-general-lg">
      <NotificationBell
        size="sm"
        count={NOTES.filter((n) => n.unread).length}
        open={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        onClick={() => setOpen(!open)}
      />
      <NotificationPanel
        {...rest}
        id={panelId}
        popup
        open={open}
        onOpenChange={setOpen}
        filter={filter}
        onFilterChange={setFilter}
        tabs={complex ? (rest.tabs ?? TABS) : rest.tabs}
        onSettingsClick={complex ? () => {} : undefined}
        empty={rest.empty || shown.length === 0}
      >
        {complex
          ? [
              <NotificationPanelHeading key="hoy">Hoy</NotificationPanelHeading>,
              ...shown.map((n) => <NotificationCard key={n.id} time="Hace 20 min" title={n.title} description={n.description} unread={n.unread} />),
            ]
          : shown.map((n) => <NotificationItem key={n.id} title={n.title} description={n.description} unread={n.unread} />)}
      </NotificationPanel>
    </div>
  );
}

/** Valor de una prop escrito como en JSX. */
const jsxProp = (name: string, value: unknown) =>
  typeof value === 'string' ? `${name}="${value.replace(/"/g, '&quot;')}"` : value === true ? name : `${name}={${formatLiteral(value, 4)}}`;

/**
 * Código de Desarrollo (R2), completo y listo para copiar (la plantilla muestra la importación encima): estado de apertura y de filtro, cierre con clic fuera
 * (el panel no lo trae: lo resuelve quien lo abre) y la lista filtrada.
 */
function docsCode(args: Record<string, unknown>) {
  const { open: _open, popup: _popup, filter: _filter, tab: _tab, children: _children, defaultFilter, empty, ...rest } = args;
  const complex = rest.variant === 'complex';
  const props = [
    'id="notifications"',
    'popup',
    'open={open}',
    'onOpenChange={setOpen}',
    'filter={filter}',
    'onFilterChange={setFilter}',
    empty === true ? 'empty' : 'empty={shown.length === 0}',
    ...Object.entries(rest).map(([name, value]) => jsxProp(name, value)),
    ...(complex && rest.tabs === undefined ? [`tabs={${formatLiteral(TABS, 4)}}`] : []),
    ...(complex ? ['onSettingsClick={() => openSettings()}'] : []),
  ];
  const item = complex
    ? '<NotificationCard key={n.id} time={n.time} title={n.title} description={n.description} unread={n.unread} />'
    : '<NotificationItem key={n.id} title={n.title} description={n.description} unread={n.unread} />';
  const notes = NOTES.slice(0, 3).map(
    (n) => `  { id: ${n.id}, ${complex ? "time: 'Hace 20 min', " : ''}title: '${n.title}', description: '${n.description}', unread: ${n.unread} },`
  );
  return [
    'const notes = [',
    ...notes,
    '];',
    '',
    'export function Notifications() {',
    '  const [open, setOpen] = useState(false);',
    `  const [filter, setFilter] = useState(${formatLiteral(defaultFilter ?? 'all')});`,
    '  const rootRef = useRef(null);',
    "  const shown = filter === 'unread' ? notes.filter((n) => n.unread) : notes;",
    ...(complex ? ['  // Lleva a los ajustes de notificaciones de tu producto', '  const openSettings = () => {};'] : []),
    '',
    '  // Clic fuera: el panel no lo trae; lo cierra quien lo abre',
    '  useEffect(() => {',
    '    if (!open) return;',
    '    const onPointerDown = (event) => {',
    '      if (!rootRef.current?.contains(event.target)) setOpen(false);',
    '    };',
    "    document.addEventListener('pointerdown', onPointerDown);",
    "    return () => document.removeEventListener('pointerdown', onPointerDown);",
    '  }, [open]);',
    '',
    '  return (',
    '    <div ref={rootRef}>',
    '      <NotificationBell',
    '        size="sm"',
    '        count={notes.filter((n) => n.unread).length}',
    '        open={open}',
    '        aria-controls="notifications"',
    '        aria-haspopup="dialog"',
    '        onClick={() => setOpen(!open)}',
    '      />',
    '      <NotificationPanel',
    ...props.map((p) => `        ${p}`),
    '      >',
    ...(complex ? ['        <NotificationPanelHeading>Hoy</NotificationPanelHeading>'] : []),
    `        {shown.map((n) => ${item})}`,
    '      </NotificationPanel>',
    '    </div>',
    '  );',
    '}',
  ].join('\n');
}

const VARIANTS = ['simple', 'complex'];
const HEADING_LEVELS = [2, 3, 4, 5, 6];
const FILTERS = ['all', 'unread'];

const meta = {
  title: 'Overlays/NotificationPanel',
  component: NotificationPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: componentDocsParameters(doc, docsJson),
    // El lienzo maneja apertura, filtro y lista (R1, R6); el código muestra campana, manejadores y filas (R2)
    docsLive: {
      render: DocsCanvas,
      code: docsCode,
      exclude: ['open', 'popup', 'onOpenChange', 'filter', 'onFilterChange', 'tab', 'defaultTab', 'onTabChange', 'onSettingsClick', 'children', 'rootProps'],
    },
  },
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
  // Las descripciones salen de NotificationPanel.docs.json; aquí solo los controles y los tipos explícitos
  argTypes: argTypesFromDocsJson(docsJson, {
    variant: { control: 'radio', options: VARIANTS, type: { name: 'enum', value: VARIANTS } },
    title: { control: 'text', type: { name: 'string' } },
    headingLevel: { control: 'select', options: HEADING_LEVELS, type: { name: 'enum', value: HEADING_LEVELS } },
    defaultFilter: { control: 'radio', options: FILTERS, type: { name: 'enum', value: FILTERS } },
    empty: { control: 'boolean', type: { name: 'boolean' } },
    popup: { control: 'boolean', type: { name: 'boolean' } },
    tabScrollButtons: { control: 'boolean', type: { name: 'boolean' } },
  }),
  args: { variant: 'simple' },
} satisfies Meta<typeof NotificationPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

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
              title={`Informe ${id}`}
              description={tab === 'docs' ? 'Documentos: Ana Pérez compartió un archivo.' : 'Todas: Ana Pérez compartió un archivo.'}
              unread
              onClick={() => {}}
              onDelete={() => setCards((all) => all.filter((x) => x !== id))}
            />
          ))}
          <NotificationGroup title="Comentarios en Plan de trabajo" time="Hace 1 h" unread>
            <NotificationGroupItem time="Hace 1 h" description="Hugo García respondió tu comentario." unread />
            <NotificationGroupItem time="Hace 3 h" description="Ana Pérez agregó un comentario." />
          </NotificationGroup>
          <NotificationPanelHeading>Ayer</NotificationPanelHeading>
          <NotificationCard time="Ayer" title="Ajustes guardados" description="Cambiaste el idioma de tu perfil." />
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
    <div className="flex min-h-[820px] w-full max-w-[400px] justify-end">
      <div data-figma={name} className={`relative box-border flex h-12 w-12 flex-col items-end ${open ? 'gap-2' : 'gap-0'}`}>
        <NotificationBell size="sm" count={notified ? 99 : 0} open={open ? true : undefined} />
        <div
          inert={!open}
          aria-hidden={!open}
          className={`absolute right-0 w-[400px] max-w-[calc(100vw-3rem)] ${open ? 'top-[calc(100%+0.5rem)]' : 'pointer-events-none top-full opacity-0'}`}
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
    <div className="grid w-full max-w-[872px] grid-cols-[repeat(auto-fill,minmax(min(100%,400px),400px))] gap-6 bg-ds-background-general-black p-6">
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

// Texto de muestra del contador (Tabs ya marca su capa como "00" para el comparador)
const figmaBadge = '00';
const COMPLEX_TABS: NotificationPanelTab[] = [
  { value: 'one', label: 'Text', icon: 'heart', badge: figmaBadge },
  { value: 'two', icon: 'heart', badge: figmaBadge, 'aria-label': 'Segunda' },
  { value: 'three', icon: 'heart', badge: figmaBadge, 'aria-label': 'Tercera' },
];

/** Las cuatro variantes de "Complex notifications" de Figma, con sus textos. */
export const FigmaMatrixComplex: Story = {
  parameters: { fullWidth: true },
  render: () => (
    <div className="grid w-full max-w-[872px] grid-cols-[repeat(auto-fill,minmax(min(100%,400px),400px))] gap-6 bg-ds-background-general-black p-6">
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
    const first = within(list).getByRole('button', { name: 'Documento compartido' });
    await expect(first).toHaveAccessibleDescription(/^No leída/);
    await userEvent.click(first);
    await waitFor(() => expect(within(list).getByRole('button', { name: 'Documento compartido' })).toHaveAccessibleDescription(/^Ana Pérez/));
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
    await userEvent.click(within(tablist).getByRole('tab', { name: /Documentos/ }));
    await waitFor(() => expect(canvas.getAllByText(/^Documentos: Ana Pérez/)).toHaveLength(2));
    // Eliminar la primera tarjeta con el botón: el foco pasa a la siguiente
    await userEvent.click(canvas.getAllByRole('button', { name: /^Eliminar notificación: Informe/ })[0]);
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Informe 2' })).toHaveFocus());
    // Desplegar el grupo
    const toggle = canvas.getByRole('button', { name: /^Mostrar notificaciones Comentarios/ });
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
      <NotificationItem title="Nuevo comentario" description="Hugo García comentó en Plan de trabajo." />
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

/** Página de documentación (plantilla v2): la revisan vitest y axe. */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', fullWidth: true },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'NotificationPanel' })).toBeInTheDocument();
    // Sin las pestañas de los paneles Complex de ejemplo
    const tabs = canvas.getAllByRole('tab').filter((t) => t.closest('[data-notification-panel]') === null);
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    // Sin los títulos de los paneles de ejemplo, que también son h2 (`data-figma-part`)
    const h2 = () =>
      canvas
        .getAllByRole('heading', { level: 2 })
        .filter((h) => !h.hasAttribute('data-figma-part'))
        .map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente NotificationPanel en Figma:']);
    // Marcadores de la anatomía: uno por pauta (6 del panel simple + 5 del complejo)
    await expect(canvasElement.querySelectorAll('[data-doc-mark]')).toHaveLength(11);
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de NotificationPanel' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
