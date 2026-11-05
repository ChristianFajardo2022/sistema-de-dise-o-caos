import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { AvatarMenu } from './AvatarMenu';
import { AvatarMenuPanel } from './AvatarMenuPanel';
import { DropdownMenuItem } from '../DropdownMenu';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './AvatarMenu.doc';
import docsJson from './AvatarMenu.docs.json';

/** Código de Desarrollo: el mismo menú del lienzo, listo para copiar (recetas R2 y R6). */
function docsCode(args: Record<string, unknown>) {
  const { children: _children, onLogout: _onLogout, open: _open, defaultOpen: _defaultOpen, ...rest } = args;
  const props = Object.entries(rest).map(([name, value]) => `  ${name}=${typeof value === 'string' ? `"${value.replace(/"/g, '&quot;')}"` : `{${String(value)}}`}`);
  return [
    'const logout = () => {};',
    'const openProfile = () => {};',
    'const openSettings = () => {};',
    'const openHelp = () => {};',
    '',
    '<AvatarMenu',
    ...props,
    '  onLogout={logout}',
    '>',
    '  <DropdownMenuItem type="icon" icon="user" onSelect={openProfile}>Mi perfil</DropdownMenuItem>',
    '  <DropdownMenuItem type="icon" icon="setting" onSelect={openSettings}>Ajustes</DropdownMenuItem>',
    '  <DropdownMenuItem type="icon" icon="message-question" onSelect={openHelp}>Ayuda</DropdownMenuItem>',
    '</AvatarMenu>',
  ].join('\n');
}

const meta = {
  title: 'Navigation/Avatar menu',
  component: AvatarMenu,
  tags: ['autodocs'],
  // Las descripciones salen de AvatarMenu.docs.json; aquí solo los controles y los tipos explícitos
  argTypes: argTypesFromDocsJson(docsJson, {
    name: { control: 'text', type: { name: 'string' } },
    email: { control: 'text', type: { name: 'string' } },
    size: { control: 'radio', options: ['sm', 'md'], type: { name: 'enum', value: ['sm', 'md'] } },
    logoutLabel: { control: 'text', type: { name: 'string' } },
    label: { control: 'text', type: { name: 'string' } },
    menuLabel: { control: 'text', type: { name: 'string' } },
    open: { control: 'boolean', type: { name: 'boolean' } },
    defaultOpen: { control: 'boolean', type: { name: 'boolean' } },
    avatar: { control: false },
    children: { control: false },
    onLogout: { control: false },
    onOpenChange: { control: false },
    rootProps: { control: false },
  }),
  args: { name: 'Hugo García', email: 'hugo.garcia@ejemplo.com', size: 'md' },
  // Espacio para la tarjeta, que se abre debajo del avatar
  decorators: [
    (Story) => (
      <div className="flex min-h-[26rem] w-full items-start justify-end bg-ds-background-container-surface p-6">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: componentDocsParameters(doc, docsJson),
    // El lienzo abre y cierra el menú de verdad (capa superior): `open` y `defaultOpen` los maneja el propio menú (R6).
    // El código muestra los ítems y sus manejadores (R2)
    docsLive: { story: 'Interactive', code: docsCode, exclude: ['open', 'defaultOpen'] },
  },
} satisfies Meta<typeof AvatarMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = (
  <>
    <DropdownMenuItem type="icon" icon="user">
      Mi perfil
    </DropdownMenuItem>
    <DropdownMenuItem type="icon" icon="setting">
      Ajustes
    </DropdownMenuItem>
    <DropdownMenuItem type="icon" icon="message-question">
      Ayuda
    </DropdownMenuItem>
  </>
);

/** Playground: abre con clic, Enter, Espacio o las flechas; Escape y el clic fuera cierran y el foco vuelve al avatar. */
export const Interactive: Story = {
  args: { children: items, onLogout: fn() },
};

/** Type Dropdown de Figma: abierto desde el montaje. */
export const Open: Story = {
  args: { children: items, onLogout: fn(), defaultOpen: true },
};

function ControlledDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-end gap-3">
      <button type="button" onClick={() => setOpen(!open)} className="cursor-pointer text-ds-text-neutral-white">
        {open ? 'Cerrar desde fuera' : 'Abrir desde fuera'}
      </button>
      <AvatarMenu name="Ana Pérez" email="Analista" open={open} onOpenChange={setOpen} onLogout={() => setOpen(false)}>
        {items}
      </AvatarMenu>
    </div>
  );
}

/** Estado controlado con `open` y `onOpenChange`. */
export const Controlled: Story = { render: () => <ControlledDemo /> };

/** Solo el panel, en línea (documentación y medición): no abre ni cierra nada. */
export const PanelOnly: Story = {
  render: () => (
    <AvatarMenuPanel name="Hugo García" email="hugo.garcia@ejemplo.com" onLogout={() => {}}>
      {items}
    </AvatarMenuPanel>
  ),
};

/**
 * Los dos Type de Figma. Dropdown es el avatar con la tarjeta abierta debajo; en Default la tarjeta existe pero está
 * cerrada (como en Figma, donde queda recortada). Los textos de la persona son genéricos, con las iniciales "HG".
 */
export const FigmaMatrix: Story = {
  decorators: [
    (Story) => (
      <div className="flex min-h-[26rem] w-[30rem] items-start justify-between bg-ds-background-container-surface p-6">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <>
      <AvatarMenu name="Hugo García" email="hugo.garcia@ejemplo.com" onLogout={() => {}} rootProps={{ 'data-figma': 'Type=Default' }}>
        <DropdownMenuItem>Text item</DropdownMenuItem>
        <DropdownMenuItem>Text item</DropdownMenuItem>
        <DropdownMenuItem>Text item</DropdownMenuItem>
      </AvatarMenu>
      <AvatarMenu name="Hugo García" email="hugo.garcia@ejemplo.com" defaultOpen onLogout={() => {}} rootProps={{ 'data-figma': 'Type=Dropdown' }}>
        <DropdownMenuItem>Text item</DropdownMenuItem>
        <DropdownMenuItem>Text item</DropdownMenuItem>
        <DropdownMenuItem>Text item</DropdownMenuItem>
      </AvatarMenu>
    </>
  ),
};

/** Test: Menu Button (aria-*), foco al primer ítem, flechas, Escape y foco de vuelta, cierre de sesión. */
export const KeyboardTest: Story = {
  tags: ['!autodocs'],
  args: { children: items, onLogout: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'HG, menú de perfil de Hugo García' });
    await expect(button).toHaveAttribute('aria-haspopup', 'menu');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(button);
    const menu = await within(document.body).findByRole('menu', { name: 'Menú de perfil' });
    await waitFor(() => expect(within(menu).getByRole('menuitem', { name: 'Mi perfil' })).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await expect(within(menu).getByRole('menuitem', { name: 'Ajustes' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(within(menu).getByRole('menuitem', { name: 'Cerrar sesión' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(button).toHaveFocus());
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(button);
    await userEvent.click(await within(document.body).findByRole('menuitem', { name: 'Cerrar sesión' }));
    await expect(args.onLogout).toHaveBeenCalled();
  },
};

/** Página de documentación (plantilla v2): encabezado, pestañas, secciones, marcadores de anatomía y tabla de props. */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Avatar menu' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Avatar menu en Figma:']);
    // Anatomía: un marcador por pauta (6 + 2 + 3) y las vistas son ilustraciones (inert)
    const views = canvasElement.querySelectorAll('[data-doc-anatomy-view="marks"]');
    await expect(views).toHaveLength(3);
    for (const view of views) await expect(view).toHaveAttribute('inert');
    await waitFor(() => expect(canvasElement.querySelectorAll('[data-doc-mark]')).toHaveLength(11));
    await userEvent.click(tabs[1]);
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de AvatarMenu' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
