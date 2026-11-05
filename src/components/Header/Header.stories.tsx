import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Header } from './Header';
import type { HeaderNavItem, HeaderProps } from './Header.types';
import { Button } from '../Button';
import { DropdownMenuItem } from '../DropdownMenu';
import { NotificationCard } from '../NotificationCard';
import { NotificationItem } from '../NotificationItem';
import { NotificationPanel, NotificationPanelHeading } from '../NotificationPanel';
import type { NotificationPanelTab } from '../NotificationPanel';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { buildCode } from '../../docs/liveCode';
import { cn } from '../../utils/cn';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './Header.doc';
import docsJson from './Header.docs.json';

// ───────────────────────── Desarrollo (docsLive) ─────────────────────────

/**
 * Lienzo de Desarrollo. El Header ocupa el ancho del lienzo hasta 1440 (la columna de la grilla va de 0 a 1440: el
 * lienzo no lo reduce con `zoom` y lo deja crecer) y con `layout="auto"` decide la composición por ese ancho. La hoja
 * móvil se coloca bajo la barra con `position: absolute` y, en el lienzo, mide lo que su contenido (`h-auto`): mientras
 * está abierta, el lienzo reserva su alto (padding responsive `space/general/3xl`, buscador de 40 y enlaces de 34 con 8
 * entre filas) para que no la recorte. `menuOpen` lo maneja el botón de menú (R6).
 */
function DocsCanvas(args: Record<string, unknown>) {
  const { menuClassName, onMenuOpenChange, ...rest } = args as HeaderProps;
  const [menuOpen, setMenuOpen] = useState(false);
  const items = rest.items ?? [];
  const search = rest.search ?? true;
  const rows = items.reduce((n, item) => n + 1 + (item.items?.length ?? 0), 0);
  const list = items.length > 0 ? rows * 34 + (2 * items.length - 1) * 8 : 0;
  // Barra (2 paddings + 32) y hoja (2 paddings, buscador, un padding entre buscador y lista, lista)
  const pads = 4 + (search && items.length > 0 ? 1 : 0);
  const fixed = 32 + (search ? 40 : 0) + list;
  return (
    <div
      className="grid w-full items-start"
      style={{
        gridTemplateColumns: 'minmax(0, 1440px)',
        minHeight: menuOpen ? `calc(var(--ds-responsive-space-general-3xl) * ${pads} + ${fixed}px)` : undefined,
      }}
    >
      <Header
        {...rest}
        menuOpen={menuOpen}
        onMenuOpenChange={(open) => {
          setMenuOpen(open);
          onMenuOpenChange?.(open);
        }}
        menuClassName={cn('h-auto', menuClassName)}
      />
    </div>
  );
}

/** Manejadores de ejemplo de los ítems del menú de perfil, por su texto. */
const PROFILE_HANDLERS: Record<string, string> = { 'Mi perfil': 'openProfile', Ajustes: 'openSettings', Ayuda: 'openHelp' };

/** Código de Personalizar: el generado más las funciones que usa, declaradas arriba (`logout`, `openProfile`…). */
function docsCode(args: Record<string, unknown>): string {
  let code = buildCode('Header', args, {});
  const declarations: string[] = [];
  if (args.user) {
    declarations.push('const logout = () => {};');
    code = code.includes('<Header\n') ? code.replace('<Header\n', '<Header\n  onLogout={logout}\n') : code.replace('<Header', '<Header onLogout={logout}');
  }
  for (const [label, handler] of Object.entries(PROFILE_HANDLERS)) {
    const item = `<DropdownMenuItem>${label}</DropdownMenuItem>`;
    if (!code.includes(item)) continue;
    code = code.replace(item, `<DropdownMenuItem onSelect={${handler}}>${label}</DropdownMenuItem>`);
    declarations.push(`const ${handler} = () => {};`);
  }
  return declarations.length > 0 ? `${declarations.join('\n')}\n\n${code}` : code;
}

const meta = {
  title: 'Navigation/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: componentDocsParameters(doc, docsJson),
    docsLive: {
      // El panel de notificaciones es una capa del top layer (se pinta sobre la página, fuera del lienzo, y se cierra al
      // tocar fuera) y los default* solo cuentan al montar: sin control en Personalizar, siguen en Props
      exclude: ['notificationsOpen', 'defaultNotificationsOpen', 'defaultMenuOpen', 'menuOpen'],
      // Lienzo a todo el ancho y con el alto de la hoja móvil abierta (ver `DocsCanvas`)
      render: (args: Record<string, unknown>) => <DocsCanvas {...args} />,
      // El código se copia y compila tal cual: declara `logout` y los manejadores del menú de perfil (el código generado
      // omite las funciones)
      code: docsCode,
    },
    // Varias cabeceras en la misma página de historias: el landmark banner y el nav se repiten solo allí
    a11y: { config: { rules: [{ id: 'landmark-no-duplicate-banner', enabled: false }, { id: 'landmark-unique', enabled: false }] } },
  },
  // Tipos explícitos en las uniones: sin ellos Storybook descarta los args de la URL
  argTypes: argTypesFromDocsJson(docsJson, {
    layout: { control: 'radio', options: ['auto', 'desktop', 'mobile'], type: { name: 'enum', value: ['auto', 'desktop', 'mobile'] } },
    search: { control: 'boolean', type: { name: 'boolean' } },
    notificationCount: { control: { type: 'number', min: 0 }, type: { name: 'number' } },
  }),
  args: { layout: 'auto', search: true },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────── datos de ejemplo ─────────────────────────

const ITEMS: HeaderNavItem[] = [
  {
    id: 'proyectos',
    label: 'Proyectos',
    items: [
      { label: 'Activos', href: '#activos' },
      { label: 'Archivados', href: '#archivados' },
      { label: 'Plantillas', href: '#plantillas' },
    ],
  },
  {
    id: 'cuenta',
    label: 'Mi cuenta',
    items: [
      { label: 'Datos personales', href: '#datos' },
      { label: 'Seguridad', href: '#seguridad' },
    ],
  },
  { id: 'mensajes', label: 'Mensajes', href: '#mensajes', current: true },
  { id: 'ayuda', label: 'Ayuda', href: '#ayuda' },
];

const NOTES = [
  { id: 1, title: 'Documento compartido', description: 'Ana Pérez compartió Informe anual contigo.', unread: true },
  { id: 2, title: 'Mensaje nuevo', description: 'Hugo García respondió tu mensaje.', unread: true },
  { id: 3, title: 'Cuenta actualizada', description: 'Cambiaste el correo de tu cuenta.', unread: false },
];

const simplePanel = (
  <NotificationPanel>
    {NOTES.map((n) => (
      <NotificationItem key={n.id} title={n.title} description={n.description} unread={n.unread} />
    ))}
  </NotificationPanel>
);

const TABS: NotificationPanelTab[] = [
  { value: 'all', label: 'Todas' },
  { value: 'docs', label: 'Documentos' },
];

const complexPanel = (
  <NotificationPanel variant="complex" tabs={TABS} onSettingsClick={() => {}}>
    <NotificationPanelHeading>Hoy</NotificationPanelHeading>
    <NotificationCard time="Hace 22 min" title="Documento compartido" description="Ana Pérez compartió Informe anual contigo." unread />
    <NotificationCard time="Hace 2 h" title="Reunión reprogramada" description="La reunión de equipo pasó a las 3:00 p.m." />
  </NotificationPanel>
);

const profileItems = (
  <>
    <DropdownMenuItem>Mi perfil</DropdownMenuItem>
    <DropdownMenuItem>Ajustes</DropdownMenuItem>
    <DropdownMenuItem>Ayuda</DropdownMenuItem>
  </>
);

const FULL: Story['args'] = {
  items: ITEMS,
  homeHref: '#inicio',
  notificationPanel: simplePanel,
  notificationCount: 2,
  user: { name: 'Hugo García', email: 'hugo.garcia@ejemplo.com' },
  profileMenu: profileItems,
  onLogout: fn(),
};

// ───────────────────────── historias ─────────────────────────

/**
 * Header desktop: submenús en banda, buscador, campana con panel simple y menú de perfil. Con `layout="auto"` (por
 * defecto), si el lienzo es más angosto que lo que necesita la barra de escritorio, se ve la móvil.
 */
export const Desktop: Story = { args: FULL };

/** Con el panel complejo (pestañas, tarjetas y grupos) en la campana. */
export const ComplexNotifications: Story = { args: { ...FULL, notificationPanel: complexPanel } };

/** Header mobile: el botón de menú despliega el buscador y los enlaces; la campana y el avatar quedan en la barra. */
export const Mobile: Story = {
  args: { ...FULL, layout: 'mobile' },
  decorators: [
    (Story) => (
      <div className="h-[44rem] w-[376px] overflow-hidden">
        <Story />
      </div>
    ),
  ],
};

/**
 * `layout="auto"` (por defecto): la cabecera mide su propio ancho, no el de la ventana. Escritorio cuando cabe entera
 * (logo, navegación, buscador a su mínimo y acciones), móvil cuando no. Cambia el tamaño del lienzo.
 */
export const Responsive: Story = { args: { ...FULL, layout: 'auto' } };

/** Sin sesión: sin campana ni avatar, con acciones al final (prop Buttons de Figma). */
export const SignedOut: Story = {
  args: {
    items: ITEMS,
    homeHref: '#inicio',
    // Prop Buttons de Figma: Button secondary y primary sm
    actions: (
      <>
        <Button variant="secondary" size="sm">
          Crear cuenta
        </Button>
        <Button size="sm">Iniciar sesión</Button>
      </>
    ),
  },
};

function ControlledDemo() {
  const [open, setOpen] = useState<string | null>('proyectos');
  return (
    <div className="min-h-64">
      <Header items={ITEMS} openItem={open} onOpenItemChange={setOpen} homeHref="#inicio" />
      <p className="px-6 py-4 text-ds-text-neutral-white">Abierto: {open ?? 'ninguno'}</p>
    </div>
  );
}

/** Submenú controlado con `openItem` y `onOpenItemChange`. */
export const Controlled: Story = { render: () => <ControlledDemo /> };

// ───────────────────────── FigmaMatrix ─────────────────────────

/** Botones del Header de Figma: seis con submenú de tres "Text item" y dos enlaces, todos con el texto "Button". */
const FIGMA_ITEMS: HeaderNavItem[] = [
  ...[1, 2, 3, 4, 5, 6].map((n) => ({
    id: `b${n}`,
    label: 'Button',
    items: [1, 2, 3].map((i) => ({ label: 'Text item', href: `#b${n}-${i}` })),
  })),
  { id: 'b7', label: 'Button', href: '#b7' },
  { id: 'b8', label: 'Button', href: '#b8' },
];

const FIGMA_USER = { name: 'Hugo García', email: 'hugo.garcia@ejemplo.com' };

/**
 * Lo que traen cerradas las instancias de Figma: la campana es Simple notifications Type "No notification" (panel con
 * chips y estado vacío) y el avatar, Avatar+dropdown con tres "Text item" y Cerrar sesión. En el código los paneles
 * quedan montados en su capa cerrada; en Figma quedan recortados. Ninguno se ve en la captura.
 */
const FIGMA_PANEL = <NotificationPanel empty emptyDescription="Text description" />;
const FIGMA_PROFILE_ITEMS = (
  <>
    <DropdownMenuItem>Text item</DropdownMenuItem>
    <DropdownMenuItem>Text item</DropdownMenuItem>
    <DropdownMenuItem>Text item</DropdownMenuItem>
  </>
);

const DESKTOP_VARIANTS = [
  { name: 'Type=Default', open: null, height: 96 },
  ...[1, 2, 3, 4, 5, 6].map((n) => ({ name: `Type=Menu list${n}`, open: `b${n}`, height: 222 })),
];

/**
 * Los siete Type de "Header desktop" de Figma (1440 de ancho): Default y Menu list1 a 6, cada uno con el submenú de la
 * sección 1 a 6 abierto en la banda (tres "Text item"). Los paneles de la campana y del avatar están cerrados, como en
 * Figma. Con `layout="auto"`: en un lienzo más angosto que lo que necesita la barra (unos 1015 con ocho secciones) se
 * ve la composición móvil.
 */
export const FigmaMatrixDesktop: Story = {
  parameters: { fullWidth: true },
  render: () => (
    <div className="flex w-full max-w-[1440px] flex-col gap-6 bg-ds-background-general-black">
      {DESKTOP_VARIANTS.map((v) => (
        <div key={v.name} style={{ height: v.height }} className="relative">
          <Header
            data-figma={v.name}
            items={FIGMA_ITEMS}
            openItem={v.open}
            searchLabel="Label"
            notificationPanel={FIGMA_PANEL}
            user={FIGMA_USER}
            profileMenu={FIGMA_PROFILE_ITEMS}
            onLogout={() => {}}
            navLabel={`Navegación principal (${v.name})`}
          />
        </div>
      ))}
    </div>
  ),
};

const MOBILE_ITEMS: HeaderNavItem[] = Array.from({ length: 10 }, (_, i) => ({ id: `m${i}`, label: 'Text item', href: `#m${i}` }));

/** Los dos Type de "Header mobile" de Figma (376 de ancho): Default y Menu list (el menú abierto, 740 de alto). */
export const FigmaMatrixMobile: Story = {
  render: () => (
    <div className="flex w-[376px] flex-col gap-6 bg-ds-background-general-black">
      {[
        { name: 'Type=Default', open: false, height: 72 },
        { name: 'Type=Menu list', open: true, height: 812 },
      ].map((v) => (
        <div key={v.name} style={{ height: v.height }} className="relative">
          <Header
            layout="mobile"
            data-figma={v.name}
            items={MOBILE_ITEMS}
            menuOpen={v.open}
            menuClassName="h-[740px]"
            searchLabel="Label"
            notificationPanel={<NotificationPanel aria-label="Notificaciones" />}
            user={FIGMA_USER}
            navLabel={`Navegación principal (${v.name})`}
          />
        </div>
      ))}
    </div>
  ),
};

// ───────────────────────── pruebas ─────────────────────────

/** Test: landmarks, navegación con nombre, sección actual, buscador y submenú con teclado (disclosure). */
export const LandmarksAndNavigationTest: Story = {
  tags: ['!autodocs'],
  args: { ...FULL, layout: 'desktop' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('banner')).toBeVisible();
    const nav = canvas.getByRole('navigation', { name: 'Navegación principal' });
    await expect(within(nav).getByRole('link', { name: 'Mensajes' })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('search')).toBeVisible();
    const trigger = within(nav).getByRole('button', { name: 'Proyectos' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    // La lista es parte de la navegación y sigue a su botón: Tab entra a sus enlaces
    await expect(within(nav).getByRole('link', { name: 'Plantillas' })).toBeVisible();
    await userEvent.tab();
    await expect(within(nav).getByRole('link', { name: 'Activos' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveFocus();
    // Enter abre; un clic fuera cierra
    await userEvent.keyboard('{Enter}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(canvasElement.ownerDocument.body);
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
  },
};

/** Test: el submenú se cierra cuando el foco sale de la navegación (Tab después del último enlace). */
export const SubmenuFocusOutTest: Story = {
  tags: ['!autodocs'],
  args: { ...FULL, layout: 'desktop' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation', { name: 'Navegación principal' });
    const trigger = within(nav).getByRole('button', { name: 'Mi cuenta' });
    await userEvent.click(trigger);
    await userEvent.tab();
    await userEvent.tab();
    await expect(within(nav).getByRole('link', { name: 'Seguridad' })).toHaveFocus();
    await userEvent.tab();
    await expect(within(nav).getByRole('link', { name: 'Mensajes' })).toHaveFocus();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    // Fuera de la navegación (el buscador): se cierra
    canvas.getByRole('searchbox').focus();
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
  },
};

/** Test: la campana abre el panel como diálogo; Escape lo cierra y el foco vuelve a la campana. */
export const NotificationsTest: Story = {
  tags: ['!autodocs'],
  args: { ...FULL, layout: 'desktop' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bell = canvas.getByRole('button', { name: 'Notificaciones, 2 sin leer' });
    await expect(bell).toHaveAttribute('aria-haspopup', 'dialog');
    await userEvent.click(bell);
    const dialog = await within(document.body).findByRole('dialog', { name: 'Notificaciones' });
    await expect(bell).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() => expect(dialog).toHaveFocus());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(bell).toHaveFocus());
    await expect(bell).toHaveAttribute('aria-expanded', 'false');
    await expect(within(document.body).queryByRole('dialog', { name: 'Notificaciones' })).toBeNull();
    // Un clic fuera cierra el panel
    await userEvent.click(bell);
    await within(document.body).findByRole('dialog', { name: 'Notificaciones' });
    await userEvent.click(canvasElement.ownerDocument.body);
    await waitFor(() => expect(bell).toHaveAttribute('aria-expanded', 'false'));
  },
};

/** Test: el menú de perfil abre desde el avatar (nombre que empieza con las iniciales visibles) y cierra sesión. */
export const ProfileTest: Story = {
  tags: ['!autodocs'],
  args: { ...FULL, layout: 'desktop' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'HG, menú de perfil de Hugo García' }));
    const logout = await within(document.body).findByRole('menuitem', { name: 'Cerrar sesión' });
    await userEvent.click(logout);
    await expect(args.onLogout).toHaveBeenCalled();
  },
};

/** Los enlaces de ejemplo no navegan en los tests (el iframe del test se cerraría). */
const noNavigation: Story['decorators'] = [
  (Story) => (
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      onClick={(event) => {
        if ((event.target as HTMLElement).closest('a[href]')) event.preventDefault();
      }}
    >
      <Story />
    </div>
  ),
];

/** Test: el botón del menú móvil alterna el menú, Tab entra a la hoja y Escape la cierra con el foco en el botón. */
export const MobileMenuTest: Story = {
  tags: ['!autodocs'],
  decorators: noNavigation,
  args: { ...FULL, layout: 'mobile' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Abrir menú' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(toggle);
    await expect(toggle).toHaveAccessibleName('Cerrar menú');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('link', { name: 'Mensajes' })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('search')).toBeVisible();
    // La hoja sigue al botón en el orden de Tab: primero el buscador
    await userEvent.tab();
    await expect(canvas.getByRole('searchbox')).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(toggle).toHaveFocus();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('link', { name: 'Mensajes' })).toBeNull();
    await userEvent.click(toggle);
    await userEvent.click(canvas.getByRole('button', { name: 'Cerrar menú' }));
    await expect(canvas.queryByRole('link', { name: 'Mensajes' })).toBeNull();
    // Activar un enlace de la hoja también la cierra; los enlaces no son ítems de menú
    await userEvent.click(toggle);
    await expect(canvas.queryByRole('menuitem')).toBeNull();
    await userEvent.click(canvas.getByRole('link', { name: 'Activos' }));
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('link', { name: 'Activos' })).toBeNull();
  },
};

// ───────────────────────── página de documentación ─────────────────────────

/** Test: la página de documentación (plantilla v2) con sus tres pestañas, secciones y la tabla de props. */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Header' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Header en Figma:']);
    // Marcadores: uno por pauta en cada lienzo de la anatomía
    await expect(canvasElement.querySelectorAll('[data-doc-mark]').length).toBeGreaterThanOrEqual(10);
    await userEvent.click(tabs[1]);
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de Header' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
