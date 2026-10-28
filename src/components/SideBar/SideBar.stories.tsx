import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { SideBar } from './SideBar';
import { SideBarItem, SideBarSubItem } from './SideBarItem';
import type { SideBarItemData, SideBarItemState, SideBarItemType } from './SideBar.types';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { NotificationBell } from '../NotificationBell';

const meta = {
  title: 'Navigation/Side bar',
  component: SideBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    // Varias barras en la misma página de documentación: los nav con el mismo nombre se repiten solo allí
    a11y: { config: { rules: [{ id: 'landmark-unique', enabled: false }] } },
  },
  argTypes: {
    layout: {
      control: 'radio',
      options: ['auto', 'desktop', 'mobile'],
      type: { name: 'enum', value: ['auto', 'desktop', 'mobile'] },
      description: 'Menu desktop, Menu mobile o según el ancho (48rem)',
    },
    collapsed: { control: 'boolean', type: { name: 'boolean' }, description: 'Type Default (contraída) de Menu desktop' },
    collapsible: { control: 'boolean', type: { name: 'boolean' }, description: 'Prop Arrow de Figma' },
    open: { control: 'boolean', type: { name: 'boolean' }, description: 'Móvil: Type Menu list (menú abierto)' },
  },
  args: { items: [], layout: 'desktop', collapsible: true, onValueChange: fn(), onCollapsedChange: fn(), onOpenChange: fn() },
  decorators: [
    (Story, { parameters }) =>
      parameters.matrix ? (
        <Story />
      ) : (
        <div className="h-[720px] bg-ds-background-general-black">
          <Story />
        </div>
      ),
  ],
} satisfies Meta<typeof SideBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────── datos de ejemplo ─────────────────────────

const ITEMS: SideBarItemData[] = [
  { id: 'inicio', label: 'Inicio', icon: 'home1', href: '#inicio' },
  { id: 'mensajes', label: 'Mensajes', icon: 'sms', href: '#mensajes', badge: 3, badgeLabel: 'sin leer' },
  {
    id: 'pagos',
    label: 'Pagos',
    icon: 'wallet',
    items: [
      { id: 'facturas', label: 'Facturas', href: '#facturas' },
      { id: 'metodos', label: 'Métodos de pago', href: '#metodos' },
      { id: 'historial', label: 'Historial', href: '#historial' },
    ],
  },
  { id: 'calendario', label: 'Calendario', icon: 'calendar', href: '#calendario' },
  {
    id: 'ajustes',
    label: 'Ajustes',
    icon: 'setting',
    items: [
      { id: 'perfil', label: 'Perfil', href: '#perfil' },
      { id: 'seguridad', label: 'Seguridad', href: '#seguridad' },
    ],
  },
];

const ThemeButton = () => (
  <Button iconOnly variant="secondary" contrast="low" size="xs" aria-label="Cambiar a modo claro" data-figma-part="Button">
    <Icon name="sun" size={16} variant="fill" />
  </Button>
);

const MOBILE_ACTIONS: ReactNode = (
  <>
    <NotificationBell count={0} />
    <Avatar variant="initials" size="sm" color="purple" name="Hugo García" />
  </>
);

const FULL = { items: ITEMS, defaultValue: 'mensajes', footer: <ThemeButton />, homeHref: '#inicio', mobileActions: MOBILE_ACTIONS };

/** Playground: escritorio expandida, con la sección actual y el pie (modo y flecha). */
export const Interactive: Story = { args: FULL };

/** Escritorio contraída a solo íconos: cada ítem se nombra con su texto y muestra un tooltip a la derecha. */
export const Collapsed: Story = { args: { ...FULL, defaultCollapsed: true } };

/** Subenlace actual: su sección arranca abierta y seleccionada. */
export const SubmenuCurrent: Story = { args: { ...FULL, defaultValue: 'metodos' } };

/** Móvil: barra con menú, logo, campana y avatar; el botón despliega el menú bajo la barra. */
export const Mobile: Story = {
  args: { ...FULL, layout: 'mobile' },
  decorators: [
    (Story) => (
      <div className="relative w-[376px] max-w-full">
        <Story />
      </div>
    ),
  ],
};

// ───────────────────────── FigmaMatrix ─────────────────────────

const ATOM_VARIANTS: { type: SideBarItemType; figma: string; width: number }[] = [
  { type: 'with-text', figma: 'With text', width: 260 },
  { type: 'dropdown', figma: 'Dropdown', width: 260 },
  { type: 'single-icon', figma: 'Single icon', width: 44 },
];
const ATOM_STATES: { state: SideBarItemState; figma: string }[] = [
  { state: 'default', figma: 'Default' },
  { state: 'hover', figma: 'Hover' },
  { state: 'select', figma: 'Select' },
];

const FIGMA_SUBMENU = Array.from({ length: 7 }, (_, i) => (
  <SideBarSubItem key={i} href={`#text-item-${i}`}>
    Text item
  </SideBarSubItem>
));

/**
 * Las 9 variantes de "Hamburguer menu (Atom)" (Type × State). El Badge está oculto en Figma (prop Badge en false). En
 * Dropdown Select la lista está abierta (siete "Text item" con su divisor), como en Figma; su ancho es 275.
 */
export const FigmaMatrixHamburguerMenu: Story = {
  parameters: { matrix: true },
  render: () => (
    <div className="flex flex-col gap-6 bg-ds-background-general-black p-6">
      {ATOM_STATES.map((s) => (
        <div key={s.state} className="flex items-start gap-8">
          {ATOM_VARIANTS.map((v) => {
            const open = v.type === 'dropdown' && s.state === 'select';
            return (
              <ul key={v.type} className="m-0 list-none p-0" style={{ width: open ? 275 : v.width }}>
                <SideBarItem
                  data-figma={`Type=${v.figma}, State=${s.figma}`}
                  type={v.type}
                  state={s.state}
                  icon="home1"
                  href={v.type === 'dropdown' ? undefined : '#opcion-1'}
                  expanded={open}
                  submenu={v.type === 'dropdown' ? FIGMA_SUBMENU : undefined}
                >
                  Opción 1
                </SideBarItem>
              </ul>
            );
          })}
        </div>
      ))}
    </div>
  ),
};

const FIGMA_ITEMS: SideBarItemData[] = Array.from({ length: 10 }, (_, i) => ({
  id: `o${i + 1}`,
  label: 'Opción 1',
  icon: 'home1',
  href: `#opcion-${i + 1}`,
}));

/** Los dos Type de "Menu desktop" (1080 de alto): Default contraída (63) y Select expandida (298), con Mode y Arrow. */
export const FigmaMatrixDesktop: Story = {
  parameters: { matrix: true },
  render: () => (
    <div className="flex items-start gap-15 bg-ds-background-general-black">
      {[
        { name: 'Type=Default', collapsed: true },
        { name: 'Type=Select', collapsed: false },
      ].map((v) => (
        <div key={v.name} className="h-[1080px]">
          <SideBar
            layout="desktop"
            data-figma={v.name}
            items={FIGMA_ITEMS}
            collapsed={v.collapsed}
            footer={<ThemeButton />}
            navLabel={`Navegación principal (${v.name})`}
          />
        </div>
      ))}
    </div>
  ),
};

/** Los dos Type de "Menu mobile" (376 de ancho): Default (barra) y Menu list (menú abierto, 740 de alto, nueve ítems). */
export const FigmaMatrixMobile: Story = {
  parameters: { matrix: true },
  render: () => (
    <div className="flex w-[376px] flex-col gap-5 bg-ds-background-general-black">
      {[
        { name: 'Type=Default', open: false, height: 72 },
        { name: 'Type=Menu list', open: true, height: 812 },
      ].map((v) => (
        <div key={v.name} style={{ height: v.height }} className="relative">
          <SideBar
            layout="mobile"
            data-figma={v.name}
            items={FIGMA_ITEMS.slice(0, 9)}
            open={v.open}
            mobileActions={MOBILE_ACTIONS}
            menuClassName="h-[740px]"
            navLabel={`Navegación principal (${v.name})`}
          />
        </div>
      ))}
    </div>
  ),
};

// ───────────────────────── pruebas ─────────────────────────

/** En las pruebas los enlaces no navegan (un cambio de URL corta la conexión del ejecutor de pruebas). */
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

/** Test: navegación con nombre, sección actual, submenú disclosure con teclado y subenlace que cambia el valor. */
export const NavigationKeyboardTest: Story = {
  tags: ['!autodocs'],
  decorators: noNavigation,
  args: FULL,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation', { name: 'Navegación principal' });
    await expect(within(nav).getByRole('link', { name: 'Mensajes 3 sin leer' })).toHaveAttribute('aria-current', 'page');
    const trigger = within(nav).getByRole('button', { name: 'Pagos' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const list = canvasElement.ownerDocument.getElementById(trigger.getAttribute('aria-controls') ?? '');
    await expect(list).toBeVisible();
    // La lista sigue a su botón en el orden de Tab
    await userEvent.tab();
    const facturas = within(nav).getByRole('link', { name: 'Facturas' });
    await expect(facturas).toHaveFocus();
    await userEvent.click(facturas);
    await expect(args.onValueChange).toHaveBeenCalledWith('facturas');
    await expect(facturas).toHaveAttribute('aria-current', 'page');
    // Espacio cierra la lista
    trigger.focus();
    await userEvent.keyboard(' ');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(list).not.toBeVisible();
  },
};

/** Test: la flecha contrae la barra a íconos (nombres por tooltip) y un ítem con submenú la vuelve a expandir abierto. */
export const CollapseTest: Story = {
  tags: ['!autodocs'],
  decorators: noNavigation,
  args: FULL,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Contraer menú' });
    await userEvent.click(toggle);
    await expect(args.onCollapsedChange).toHaveBeenCalledWith(true);
    // El foco se queda en la flecha, que cambia de nombre
    await expect(toggle).toHaveFocus();
    await expect(toggle).toHaveAccessibleName('Expandir menú');
    const nav = canvas.getByRole('navigation', { name: 'Navegación principal' });
    await expect(within(nav).getByRole('link', { name: 'Mensajes, 3 sin leer' })).toBeVisible();
    // Contraída no hay textos visibles en las filas
    await expect(nav.querySelector('[data-figma-part="Texto default"]')).toBeNull();
    const pagos = within(nav).getByRole('button', { name: 'Pagos' });
    await expect(pagos).toHaveAttribute('aria-expanded', 'false');
    pagos.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(pagos).toHaveAttribute('aria-expanded', 'true'));
    await expect(args.onCollapsedChange).toHaveBeenLastCalledWith(false);
    await expect(pagos).toHaveFocus();
    await expect(within(nav).getByRole('link', { name: 'Facturas' })).toBeVisible();
  },
};

/** Test: el botón del menú móvil alterna el menú, Tab entra a la hoja y Escape la cierra con el foco en el botón. */
export const MobileMenuTest: Story = {
  tags: ['!autodocs'],
  decorators: noNavigation,
  args: { ...FULL, layout: 'mobile' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Abrir menú' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.getByRole('button', { name: 'Notificaciones' })).toBeVisible();
    await userEvent.click(toggle);
    await expect(toggle).toHaveAccessibleName('Cerrar menú');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const nav = canvas.getByRole('navigation', { name: 'Navegación principal' });
    // La hoja sigue al botón en el orden de Tab
    await userEvent.tab();
    await expect(within(nav).getByRole('link', { name: 'Inicio' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(toggle).toHaveFocus();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('navigation', { name: 'Navegación principal' })).toBeNull();
    // Activar un enlace también cierra el menú
    await userEvent.click(toggle);
    await userEvent.click(canvas.getByRole('link', { name: 'Calendario' }));
    await expect(args.onValueChange).toHaveBeenCalledWith('calendario');
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    await expect(canvas.queryByRole('navigation', { name: 'Navegación principal' })).toBeNull();
  },
};
