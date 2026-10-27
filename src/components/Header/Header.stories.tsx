import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Header } from './Header';
import type { HeaderNavItem } from './Header.types';
import { Button } from '../Button';
import { DropdownMenuItem } from '../DropdownMenu';
import { NotificationCard } from '../NotificationCard';
import { NotificationItem } from '../NotificationItem';
import { NotificationPanel, NotificationPanelHeading } from '../NotificationPanel';
import type { NotificationPanelTab } from '../NotificationPanel';

const meta = {
  title: 'Navigation/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    // Varias cabeceras en la misma página de documentación: el landmark banner y el nav se repiten solo allí
    a11y: { config: { rules: [{ id: 'landmark-no-duplicate-banner', enabled: false }, { id: 'landmark-unique', enabled: false }] } },
  },
  argTypes: {
    layout: {
      control: 'radio',
      options: ['auto', 'desktop', 'mobile'],
      type: { name: 'enum', value: ['auto', 'desktop', 'mobile'] },
      description: 'Header desktop, Header mobile o según el ancho (64rem)',
    },
    search: { control: 'boolean', type: { name: 'boolean' }, description: 'Prop Searcher de Figma' },
    notificationCount: { control: { type: 'number', min: 0 }, type: { name: 'number' }, description: 'No leídas en la campana' },
  },
  args: { layout: 'desktop', search: true },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────── datos de ejemplo ─────────────────────────

const ITEMS: HeaderNavItem[] = [
  {
    id: 'pagos',
    label: 'Pagos',
    items: [
      { label: 'Facturas', href: '#facturas' },
      { label: 'Métodos de pago', href: '#metodos' },
      { label: 'Historial de pagos', href: '#historial' },
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
  { id: 1, title: 'Pago recibido', description: 'Recibimos tu pago de la factura de octubre.', unread: true },
  { id: 2, title: 'Mensaje nuevo', description: 'Tienes una respuesta sobre tu solicitud de soporte.', unread: true },
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
  { value: 'payments', label: 'Pagos' },
];

const complexPanel = (
  <NotificationPanel variant="complex" tabs={TABS} onSettingsClick={() => {}}>
    <NotificationPanelHeading>Hoy</NotificationPanelHeading>
    <NotificationCard time="Hace 22 min" title="Factura lista" description="Ya puedes descargar la factura de octubre." unread />
    <NotificationCard time="Hace 2 h" title="Pago recibido" description="Recibimos tu pago de la factura de octubre." />
  </NotificationPanel>
);

const profileItems = (
  <>
    <DropdownMenuItem>Mi perfil</DropdownMenuItem>
    <DropdownMenuItem>Configuración</DropdownMenuItem>
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

/** Header desktop: submenús en banda, buscador, campana con panel simple y menú de perfil. */
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

/** `layout="auto"` (por defecto): escritorio desde 64rem de ancho, móvil por debajo. Cambia el tamaño de la ventana. */
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
  const [open, setOpen] = useState<string | null>('pagos');
  return (
    <div className="min-h-64">
      <Header layout="desktop" items={ITEMS} openItem={open} onOpenItemChange={setOpen} homeHref="#inicio" />
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
 * Figma.
 */
export const FigmaMatrixDesktop: Story = {
  parameters: { fullWidth: true },
  render: () => (
    <div className="flex w-[1440px] flex-col gap-6 bg-ds-background-general-black">
      {DESKTOP_VARIANTS.map((v) => (
        <div key={v.name} style={{ height: v.height }} className="relative">
          <Header
            layout="desktop"
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
  args: FULL,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('banner')).toBeVisible();
    const nav = canvas.getByRole('navigation', { name: 'Navegación principal' });
    await expect(within(nav).getByRole('link', { name: 'Mensajes' })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('search')).toBeVisible();
    const trigger = within(nav).getByRole('button', { name: 'Pagos' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    // La lista es parte de la navegación y sigue a su botón: Tab entra a sus enlaces
    await expect(within(nav).getByRole('link', { name: 'Historial de pagos' })).toBeVisible();
    await userEvent.tab();
    await expect(within(nav).getByRole('link', { name: 'Facturas' })).toHaveFocus();
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
  args: FULL,
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
  args: FULL,
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
  args: FULL,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'HG, menú de perfil de Hugo García' }));
    const logout = await within(document.body).findByRole('menuitem', { name: 'Cerrar sesión' });
    await userEvent.click(logout);
    await expect(args.onLogout).toHaveBeenCalled();
  },
};

/** Test: el botón del menú móvil alterna el menú, Tab entra a la hoja y Escape la cierra con el foco en el botón. */
export const MobileMenuTest: Story = {
  tags: ['!autodocs'],
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
  },
};
