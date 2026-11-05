import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { SideBar } from './SideBar';
import { SideBarItem, SideBarSubItem } from './SideBarItem';
import type { SideBarItemData, SideBarItemState, SideBarItemType, SideBarProps } from './SideBar.types';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { NotificationBell } from '../NotificationBell';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { buildCode } from '../../docs/liveCode';
import { componentDocsParameters } from '../../docs/storybook';
import { cn } from '../../utils/cn';
import { useIsMobile } from '../../utils/useMediaQuery';
import { doc } from './SideBar.doc';
import docsJson from './SideBar.docs.json';

// ───────────────────────── Desarrollo (docsLive) ─────────────────────────

/**
 * Lienzo de Desarrollo. Con `layout="auto"` la barra decide por el ancho de la ventana (48rem): escritorio a 1440 y
 * móvil a 390. La barra de escritorio ocupa el alto de su contenedor (`h-full`): aquí mide 640. La móvil ocupa el ancho
 * disponible (grilla `minmax(0, 1440px)`) y su hoja se coloca bajo la barra con `position: absolute`: en el lienzo mide
 * lo que su contenido (`h-auto`) y, mientras está abierta, el lienzo reserva el alto de la barra más el de la hoja
 * (medidos con `offsetHeight`, que no cambia con el `zoom` del lienzo). `open` lo maneja el botón de menú (R6).
 */
function DocsCanvas(args: Record<string, unknown>) {
  const props = args as unknown as SideBarProps;
  const isMobileViewport = useIsMobile();
  const mobile = props.layout === 'mobile' || (props.layout !== 'desktop' && isMobileViewport);
  const ref = useRef<HTMLDivElement>(null);
  const [room, setRoom] = useState(0);
  useEffect(() => {
    const root = ref.current;
    if (!root || !mobile) return;
    const measure = () => {
      const bar = root.querySelector<HTMLElement>('[data-figma-part="Header mobile"]');
      const sheet = root.querySelector<HTMLElement>('[data-figma-part="Dropdown"]');
      setRoom(bar && sheet ? bar.offsetHeight + sheet.offsetHeight : 0);
    };
    measure();
    // Abrir o cerrar la hoja o un submenú cambia el DOM; cambiar el ancho de la ventana, los paddings responsive
    const observer = new MutationObserver(measure);
    observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'aria-expanded'] });
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [mobile]);
  return (
    <div
      ref={ref}
      className={cn('w-full', mobile ? 'grid items-start' : 'flex h-160 justify-center')}
      style={mobile ? { gridTemplateColumns: 'minmax(0, 1440px)', minHeight: room > 0 ? room : undefined } : undefined}
    >
      <SideBar {...props} menuClassName={cn('h-auto', props.menuClassName)} />
    </div>
  );
}

/**
 * Código de Personalizar: el generado más los manejadores que usan las acciones de ejemplo (el botón de modo y la
 * campana), declarados arriba. La barra maneja sola su valor, sus submenús, si está contraída y su menú móvil.
 */
function docsCode(args: Record<string, unknown>): string {
  let code = buildCode('SideBar', args, {});
  const declarations: string[] = [];
  // El manejador va en su propia línea si el elemento se escribe en varias, o junto al atributo si va en una
  const handlers: [RegExp, string][] = [
    [/(\n *)?aria-label="Cambiar a modo claro"/, 'toggleTheme'],
    [/<NotificationBell/, 'openNotifications'],
  ];
  for (const [marker, handler] of handlers) {
    if (!marker.test(code)) continue;
    code = code.replace(marker, (match, indent: unknown) => `${match}${typeof indent === 'string' ? indent : ' '}onClick={${handler}}`);
    declarations.push(`const ${handler} = () => {};`);
  }
  return declarations.length > 0 ? `${declarations.join('\n')}\n\n${code}` : code;
}

/** Ids de los ítems y subenlaces de ejemplo (lista de `defaultValue` en Personalizar). */
const ITEM_IDS = ['inicio', 'mensajes', 'proyectos', 'activos', 'archivados', 'plantillas', 'documentos', 'ajustes', 'perfil', 'seguridad', 'ayuda'];

const meta = {
  title: 'Navigation/Side bar',
  component: SideBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: componentDocsParameters(doc, docsJson),
    docsLive: {
      story: 'Interactive',
      // Lienzo con el alto de la barra de escritorio y el de la hoja móvil abierta (ver `DocsCanvas`)
      render: (args: Record<string, unknown>) => <DocsCanvas {...args} />,
      // El código se copia y compila tal cual: declara los manejadores de las acciones de ejemplo
      code: docsCode,
      // Controladas (el lienzo deja que la barra las maneje sola): siguen en Props. Sus equivalentes no controlados
      // (`defaultValue`, `defaultCollapsed`, `defaultOpen`) sí tienen control
      exclude: ['value', 'openItems', 'defaultOpenItems', 'collapsed', 'open'],
    },
    // Varias barras en la misma página de historias: los nav con el mismo nombre se repiten solo allí
    a11y: { config: { rules: [{ id: 'landmark-unique', enabled: false }] } },
  },
  // Tipos explícitos en las uniones: sin ellos Storybook descarta los args de la URL
  argTypes: argTypesFromDocsJson(docsJson, {
    items: { control: false },
    layout: { control: 'radio', options: ['auto', 'desktop', 'mobile'], type: { name: 'enum', value: ['auto', 'desktop', 'mobile'] } },
    defaultValue: { control: 'select', options: ITEM_IDS, type: { name: 'enum', value: ITEM_IDS } },
    collapsed: { control: 'boolean', type: { name: 'boolean' } },
    defaultCollapsed: { control: 'boolean', type: { name: 'boolean' } },
    collapsible: { control: 'boolean', type: { name: 'boolean' } },
    open: { control: 'boolean', type: { name: 'boolean' } },
    defaultOpen: { control: 'boolean', type: { name: 'boolean' } },
  }),
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
    id: 'proyectos',
    label: 'Proyectos',
    icon: 'folder',
    items: [
      { id: 'activos', label: 'Activos', href: '#activos' },
      { id: 'archivados', label: 'Archivados', href: '#archivados' },
      { id: 'plantillas', label: 'Plantillas', href: '#plantillas' },
    ],
  },
  { id: 'documentos', label: 'Documentos', icon: 'document', href: '#documentos' },
  {
    id: 'ajustes',
    label: 'Ajustes',
    icon: 'setting',
    items: [
      { id: 'perfil', label: 'Perfil', href: '#perfil' },
      { id: 'seguridad', label: 'Seguridad', href: '#seguridad' },
    ],
  },
  { id: 'ayuda', label: 'Ayuda', icon: 'message-question', href: '#ayuda' },
];

/** Botón de modo del pie (prop Mode de Figma). Un elemento y no un componente: el código generado lo escribe tal cual. */
const THEME_BUTTON: ReactNode = (
  <Button iconOnly variant="secondary" contrast="low" size="xs" aria-label="Cambiar a modo claro">
    <Icon name="sun" size={16} variant="fill" />
  </Button>
);

/** El mismo botón con su nodo de Figma, para el comparador de las matrices. */
const FIGMA_THEME_BUTTON: ReactNode = (
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

const FULL = { items: ITEMS, defaultValue: 'mensajes', footer: THEME_BUTTON, homeHref: '#inicio', mobileActions: MOBILE_ACTIONS };

/**
 * Playground: con `layout="auto"`, escritorio expandida (con la sección actual y el pie: modo y flecha) o, por debajo de
 * 48rem, la barra móvil.
 */
export const Interactive: Story = { args: { ...FULL, layout: 'auto' } };

/** Escritorio contraída a solo íconos: cada ítem se nombra con su texto y muestra un tooltip a la derecha. */
export const Collapsed: Story = { args: { ...FULL, defaultCollapsed: true } };

/** Subenlace actual: su sección arranca abierta y seleccionada. */
export const SubmenuCurrent: Story = { args: { ...FULL, defaultValue: 'archivados' } };

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
            footer={FIGMA_THEME_BUTTON}
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
    const trigger = within(nav).getByRole('button', { name: 'Proyectos' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const list = canvasElement.ownerDocument.getElementById(trigger.getAttribute('aria-controls') ?? '');
    await expect(list).toBeVisible();
    // La lista sigue a su botón en el orden de Tab
    await userEvent.tab();
    const activos = within(nav).getByRole('link', { name: 'Activos' });
    await expect(activos).toHaveFocus();
    await userEvent.click(activos);
    await expect(args.onValueChange).toHaveBeenCalledWith('activos');
    await expect(activos).toHaveAttribute('aria-current', 'page');
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
    const proyectos = within(nav).getByRole('button', { name: 'Proyectos' });
    await expect(proyectos).toHaveAttribute('aria-expanded', 'false');
    proyectos.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(proyectos).toHaveAttribute('aria-expanded', 'true'));
    await expect(args.onCollapsedChange).toHaveBeenLastCalledWith(false);
    await expect(proyectos).toHaveFocus();
    await expect(within(nav).getByRole('link', { name: 'Activos' })).toBeVisible();
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
    await userEvent.click(canvas.getByRole('link', { name: 'Documentos' }));
    await expect(args.onValueChange).toHaveBeenCalledWith('documentos');
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    await expect(canvas.queryByRole('navigation', { name: 'Navegación principal' })).toBeNull();
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
    await expect(canvas.getByRole('heading', { level: 1, name: 'Side bar' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Side bar en Figma:']);
    // Marcadores: uno por pauta en cada lienzo de la anatomía
    await expect(canvasElement.querySelectorAll('[data-doc-mark]').length).toBeGreaterThanOrEqual(14);
    await userEvent.click(tabs[1]);
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de SideBar' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
