import type { ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { SideBar } from './SideBar';
import { SideBarItem, SideBarSubItem } from './SideBarItem';
import type { SideBarItemData, SideBarItemState, SideBarItemType, SideBarProps } from './SideBar.types';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { NotificationBell } from '../NotificationBell';

/*
 * Contenido de la página de documentación de Side bar (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`SideBar.types.ts`, `SideBar.variants.ts`, `SideBar.tsx`, `SideBarItem.tsx`), luego `SideBar.docs.json`. Logo, Button,
 * Icon menu, Badge, Tooltip, ScrollArea, Dropdown menu (los subenlaces), NotificationBell y Avatar son componentes
 * aparte: aquí solo se nombran.
 *
 * La barra de escritorio ocupa el alto de su contenedor (`h-full`): cada muestra le da uno fijo. La hoja móvil se
 * coloca bajo la barra con `position: absolute` y va con `h-auto` (`menuClassName`) en lugar del alto de la pantalla; el
 * envoltorio de la muestra le reserva el alto (en la anatomía, también sin `z-index`, para que no tape las cifras de las
 * cotas). Las muestras son ilustraciones (`inert`): varias barras navegables repetirían en la página el landmark
 * navigation con el mismo nombre. La barra interactiva es la de Desarrollo.
 *
 * Diferencias con Figma: Figma no dibuja el Badge en Single icon (el código lo pone en la esquina del ícono) ni el foco;
 * el Logo no se puede ocultar en código; la prop Buttons de Menu mobile no tiene prop propia (va en `mobileActions`); el
 * divisor de los subenlaces usa el primitivo stroke/dm (0,5) porque border/divider/md no está en tokens.css.
 */

// Figma: 13328:3630 (component set Menu desktop), 13738:92956 (component set Menu mobile), 13328:3609 (component set Hamburguer menu (Atom))

/** Secciones de ejemplo: una con badge, dos con submenú y enlaces directos. */
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

/** Cinco secciones sin submenú (filas de alto conocido), para las hojas móviles y los Do and Dont’s. */
const FLAT: SideBarItemData[] = [
  { id: 'inicio', label: 'Inicio', icon: 'home1', href: '#inicio' },
  { id: 'documentos', label: 'Documentos', icon: 'document', href: '#documentos' },
  { id: 'proyectos', label: 'Proyectos', icon: 'folder', href: '#proyectos' },
  { id: 'ajustes', label: 'Ajustes', icon: 'setting', href: '#ajustes' },
  { id: 'ayuda', label: 'Ayuda', icon: 'message-question', href: '#ayuda' },
];

/** Otras secciones sin submenú, para que el par de la sección actual no repita la muestra de los nombres cortos. */
const SECTIONS: SideBarItemData[] = [
  { id: 'inicio', label: 'Inicio', icon: 'home1', href: '#inicio' },
  { id: 'reuniones', label: 'Reuniones', icon: 'calendar', href: '#reuniones' },
  { id: 'documentos', label: 'Documentos', icon: 'document', href: '#documentos' },
  { id: 'perfil', label: 'Perfil', icon: 'user', href: '#perfil' },
  { id: 'ayuda', label: 'Ayuda', icon: 'message-question', href: '#ayuda' },
];

/** Botón de modo del pie (prop Mode de Figma). */
const THEME = (
  <Button iconOnly variant="secondary" contrast="low" size="xs" aria-label="Cambiar a modo claro">
    <Icon name="sun" size={16} variant="fill" />
  </Button>
);

/** Acciones de la barra móvil (prop Avatar+icon button de Figma). */
const ACTIONS = (
  <>
    <NotificationBell count={2} />
    <Avatar variant="initials" size="sm" color="purple" name="Hugo García" />
  </>
);

/** Barra de escritorio a un alto fijo (ocupa el alto de su contenedor). */
const desktop = (props: Partial<SideBarProps> = {}, height = 640) => (
  <div inert className="flex" style={{ height }}>
    <SideBar layout="desktop" items={ITEMS} homeHref="#inicio" footer={THEME} {...props} />
  </div>
);

/** Barra de escritorio de los Do and Dont’s: sin pie, para que quepa entera en el marco de teléfono. */
const plain = (props: Partial<SideBarProps>) => desktop({ items: FLAT, footer: undefined, collapsible: false, ...props }, 380);

/**
 * Barra móvil a 376 de ancho. Con `defaultOpen`, la hoja abierta con las cinco secciones sin submenú, del alto de su contenido:
 * barra (2 paddings `space/container/on-canva` + 32) y hoja (2 paddings `space/container/on-card` + 5 filas de 44 y 4
 * huecos de 8). Los paddings son responsive: el envoltorio los lee de sus tokens.
 */
const mobile = (props: Partial<SideBarProps> = {}, width = 376) => {
  const open = Boolean(props.defaultOpen);
  return (
    <div
      inert
      className="relative"
      style={{
        width,
        height: open ? 'calc(var(--ds-responsive-space-container-on-canva) * 2 + var(--ds-responsive-space-container-on-card) * 2 + 284px)' : undefined,
      }}
    >
      <SideBar layout="mobile" items={FLAT} homeHref="#inicio" mobileActions={ACTIONS} menuClassName="h-auto" {...props} />
    </div>
  );
};

/** Dibuja la muestra a un ancho de diseño; la plantilla la reduce si no cabe. */
const at = (width: number, node: ReactNode) => (
  <div inert style={{ width }}>
    {node}
  </div>
);

/** Ítem suelto (Hamburguer menu) con un State forzado, a su ancho de Figma (260 o 44). */
const item = (type: SideBarItemType, state: SideBarItemState, extra: { expanded?: boolean; badge?: number } = {}) => (
  <ul inert className="m-0 list-none p-0" style={{ width: type === 'single-icon' ? 44 : 260 }}>
    <SideBarItem
      type={type}
      state={state}
      icon="folder"
      badge={extra.badge}
      href={type === 'dropdown' ? undefined : '#proyectos'}
      expanded={extra.expanded}
      submenu={
        type === 'dropdown' ? (
          <>
            <SideBarSubItem href="#activos">Activos</SideBarSubItem>
            <SideBarSubItem href="#archivados">Archivados</SideBarSubItem>
          </>
        ) : undefined
      }
    >
      Proyectos
    </SideBarItem>
  </ul>
);

/** Las tres Type del ítem en un State. */
const types = (state: SideBarItemState) => [item('with-text', state), item('dropdown', state), item('single-icon', state)];

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Ítem en reposo: sin relleno, con el ícono y el texto en sus tokens de reposo.',
    samples: types('default'),
  },
  {
    label: 'Hover',
    tone: 'accent',
    description: 'Al pasar el puntero, la fila se rellena y el texto y el ícono suben de contraste.',
    samples: types('hover'),
  },
  {
    label: 'Select',
    tone: 'accent',
    description: (
      <>
        Sección actual (<code>value</code>): relleno de selección, texto e ícono de acento y <code>aria-current=&quot;page&quot;</code>. Dropdown y Single icon suman la barra de 4 a la izquierda.
      </>
    ),
    samples: [item('with-text', 'select'), item('dropdown', 'select', { expanded: true }), item('single-icon', 'select')],
  },
  {
    label: 'Menu list',
    tone: 'accent',
    description: (
      <>
        Menú móvil abierto (<code>open</code>): la hoja baja bajo la barra, el Icon menu pasa a X y las acciones se ocultan.
      </>
    ),
    samples: [mobile({ defaultOpen: true, defaultValue: 'documentos' })],
  },
];

export const doc: ComponentDocContent = {
  name: 'Side bar',
  icon: 'menu',
  classification: 'composicion',
  summary:
    'Side bar es la composición de la navegación principal en una barra lateral: logo, secciones con ícono, submenús y acciones del pie. Se contrae a solo íconos en escritorio y pasa a una barra con menú desplegable en móvil.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una columna con tres zonas: logo, lista de secciones y pie. En móvil, la lista pasa a una hoja que abre el botón de menú.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Menu desktop expandida con un submenú abierto',
                  preview: desktop({ 'data-figma': 'Type=Select', defaultValue: 'mensajes', defaultOpenItems: ['proyectos'] } as Partial<SideBarProps>, 720),
                  marks: [
                    { n: 1, selector: '[data-figma="Type=Select"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Logo"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Drop"]', index: 0, side: 'right' },
                    { n: 4, selector: '[data-figma-part="Badge"]', side: 'right' },
                    { n: 5, selector: '[data-figma-part="List items"]', index: 0, side: 'right' },
                    { n: 6, selector: '[data-figma-part="Frame 1984079668"]', side: 'left' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Logo"]', side: 'left' },
                    { kind: 'padding', selector: '[data-figma-part="Drop"]', index: 0, side: 'right' },
                    { kind: 'gap', from: '[data-figma-part="Drop"]', fromIndex: 0, to: '[data-figma-part="Drop"]', toIndex: 1, axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> 298 de ancho y el alto de su contenedor, con relleno <code>background/container/default-on-canva</code> y sombra <code>effect/shadow-on-canva-md</code> (0 12 32 −2), transparente en modo oscuro.
                </>,
                <>
                  <strong>Logo:</strong> marco de 80 de alto con padding de 16 (<code>space/general/2xl</code>) y el Logo md completo, un componente aparte. Con <code>homeHref</code> es un enlace llamado &quot;Inicio&quot; (<code>homeLabel</code>).
                </>,
                <>
                  <strong>Ítem:</strong> SideBarItem (Hamburguer menu) dentro de un <code>nav</code> llamado &quot;Navegación principal&quot; (<code>navLabel</code>). Fila de 44 con padding de 12 (<code>space/general/xl</code>), gap de 12, radio de 8 (<code>radius/general/md</code>), ícono de 20 y texto de 16/20 (<code>typography/field/size/md</code>). Hay 8 entre filas (<code>space/general/lg</code>). El texto va en una sola línea: si no cabe, se corta con puntos suspensivos. Es un límite del componente; el nombre accesible conserva el texto completo.
                </>,
                <>
                  <strong>Badge:</strong> Badge de número tras el texto (<code>badge</code>). Su cantidad entra en el nombre del enlace con <code>badgeLabel</code>: &quot;Mensajes 3 sin leer&quot;.
                </>,
                <>
                  <strong>Submenú:</strong> un ítem con <code>items</code> es un botón con chevron y <code>aria-expanded</code>. Su lista va debajo con padding de 12 y 32 a la izquierda (<code>space/general/4xl</code>); los subenlaces son ítems de Dropdown menu de 34 de alto con un divisor de 0,5.
                </>,
                <>
                  <strong>Pie:</strong> las acciones de <code>footer</code> (como el botón de modo) y la flecha de <code>collapsible</code>, Buttons secondary low xs de solo ícono a 10 entre sí. Padding de 24 arriba y abajo y de 16 a los lados; alineados a la derecha.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Menu desktop contraída',
                  preview: desktop({ 'data-figma': 'Type=Default', defaultCollapsed: true, defaultValue: 'documentos' } as Partial<SideBarProps>, 560),
                  marks: [
                    { n: 1, selector: '[data-figma="Type=Default"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Logo"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Drop"]', index: 0, side: 'right' },
                    { n: 4, selector: '[data-figma-part="Select"]', side: 'left' },
                    { n: 5, selector: '[data-figma-part="Badge"]', side: 'right' },
                    { n: 6, selector: '[data-figma-part="Button"]', index: -1, side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[data-figma-part="Drop"]', index: 0 },
                    { kind: 'padding', selector: '[data-figma-part="Logo"]', side: 'top' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> 63 de ancho, con el mismo relleno y sombra. El ancho cambia en 200 ms, sin animación con movimiento reducido.
                </>,
                <>
                  <strong>Logo:</strong> el Logo md de tipo icon (solo el símbolo), centrado en el marco de 80.
                </>,
                <>
                  <strong>Ítem:</strong> Type Single icon, de 44 × 44. Su texto es el nombre accesible y aparece en un Tooltip a la derecha con puntero o foco. Un ítem con submenú expande la barra con su lista abierta.
                </>,
                <>
                  <strong>Selección:</strong> barra de 4 a la izquierda en <code>background/acent/tertiary</code>, con radio de 4 (<code>radius/general/sm</code>) junto a la fila.
                </>,
                <>
                  <strong>Badge:</strong> en la esquina superior derecha del ícono. Su cantidad entra en el nombre: &quot;Mensajes, 3 sin leer&quot;.
                </>,
                <>
                  <strong>Flecha:</strong> Button con <code>chevron-right</code>, centrado, llamado &quot;Expandir menú&quot; (<code>expandLabel</code>). Expandida muestra <code>chevron-left</code> y se llama &quot;Contraer menú&quot; (<code>collapseLabel</code>).
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Menu mobile cerrada',
                  width: 376,
                  preview: mobile(),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Header mobile"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Content"] > button', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Logo "]', side: 'top' },
                    { n: 4, selector: '[data-figma-part="Avatar"]', side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Header mobile"]', side: 'left' },
                    { kind: 'gap', from: '[data-figma-part="Content"] > button', to: '[data-figma-part="Logo "]' },
                  ],
                },
                {
                  label: 'Menu mobile con el menú abierto',
                  width: 376,
                  preview: mobile({ defaultOpen: true, defaultValue: 'documentos', menuClassName: 'h-auto z-auto' }),
                  marks: [
                    { n: 2, selector: '[data-figma-part="Content"] > button', side: 'top' },
                    { n: 5, selector: '[data-figma-part="Dropdown"]', side: 'left' },
                    { n: 6, selector: '[data-figma-part="Drop"]', index: 0, side: 'right' },
                  ],
                  dimensions: [{ kind: 'padding', selector: '[data-figma-part="Dropdown"]', side: 'left' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Barra:</strong> fila de 32 con relleno <code>background/container/default-on-canva</code> y padding <code>space/container/on-canva</code>: 20 en Mobile (72 de alto), 24 en Tablet y 32 en Desktop. La cota muestra el de la ventana actual. Hay 12 entre zonas.
                </>,
                <>
                  <strong>Botón de menú:</strong> <code>button</code> de 32 sin marco con el Icon menu, un componente aparte, a 8 del logo. Lleva <code>aria-expanded</code> y se llama &quot;Abrir menú&quot; o &quot;Cerrar menú&quot; (<code>openMenuLabel</code>, <code>closeMenuLabel</code>); abierto, el dibujo pasa a X.
                </>,
                <>
                  <strong>Logo:</strong> Logo icon sm de 32.
                </>,
                <>
                  <strong>Acciones:</strong> lo que pasa <code>mobileActions</code>, como NotificationBell y Avatar de 32, a 8 entre sí. Con el menú abierto no se ven.
                </>,
                <>
                  <strong>Hoja:</strong> de todo el ancho bajo la barra y hasta el final de la pantalla, con el mismo relleno. Padding <code>space/container/on-card</code>: 16 en Mobile y 24 desde Tablet; la cota muestra el de la ventana actual. Se desplaza si no cabe.
                </>,
                <>
                  <strong>Ítems:</strong> Type With text a todo el ancho, de 44 de alto y a 8 entre sí. Los submenús llevan una sangría de 24 en Mobile y de 32 desde Tablet (<code>space/general/4xl</code>).
                </>,
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Estados',
      description: (
        <>
          Side bar tiene 4 estados. Default, Hover y Select son del ítem y se fuerzan con <code>state</code> solo para documentar; Menu list es de la barra móvil (<code>open</code>). El foco con teclado no se fuerza: es un contorno de 2 px en <code>border/field/active</code>.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default del ítem, de la selección y de las dos barras. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Ítem',
              preview: (
                <div className="flex flex-col gap-ds-space-general-lg">
                  {item('with-text', 'default')}
                  {item('with-text', 'hover')}
                </div>
              ),
              entries: [
                { part: 'Texto', color: 'text-neutral-body', text: 'typography-field-size-md' },
                { part: 'Ícono', color: 'icon-general-gray-high-contrast' },
                { part: 'Fondo (aparece en Hover)', color: 'background-field-hover' },
                { part: 'Texto (aparece en Hover)', color: 'text-neutral-white' },
                { part: 'Ícono (aparece en Hover)', color: 'icon-general-default' },
                { part: 'Contorno de foco (aparece en Focus)', color: 'border-field-active' },
              ],
            },
            {
              title: 'Select',
              preview: item('dropdown', 'select', { expanded: true }),
              entries: [
                { part: 'Fondo', color: 'background-field-active-slow-contrast' },
                { part: 'Texto', color: 'text-acent-firts' },
                { part: 'Ícono', color: 'icon-acent-firts' },
                { part: 'Barra de selección', color: 'background-acent-tertiary' },
                { part: 'Divisor de los subenlaces', color: 'border-general-default-on-card' },
              ],
            },
            {
              title: 'Menu desktop',
              preview: desktop({ defaultCollapsed: true, items: FLAT }, 420),
              entries: [
                { part: 'Fondo', color: 'background-container-default-on-canva' },
                { part: 'Sombra', color: 'responsive-effect-shadow-on-canva-md' },
                { part: 'Borde de la flecha', color: 'border-button-secondary-low-default' },
                { part: 'Ícono de la flecha', color: 'icon-button-secondary-low-default' },
              ],
            },
            {
              title: 'Menu mobile',
              preview: mobile(),
              entries: [
                { part: 'Fondo de la barra y de la hoja', color: 'background-container-default-on-canva' },
                { part: 'Icon menu', color: 'border-general-white' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Side bar en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Menu desktop, Menu mobile o Hamburguer menu (Atom) en la librería de Assets. En código, las dos barras son un solo <code>SideBar</code>: <code>layout</code> elige la composición y por defecto (<code>auto</code>) la decide el ancho de la ventana. El ítem suelto es <code>SideBarItem</code>.
            </>,
            <>
              <strong>Type de Menu desktop:</strong> Default es la barra contraída (<code>collapsed</code> o <code>defaultCollapsed</code>) y Select, la expandida. Arrow es <code>collapsible</code>; Mode y Options bottom son <code>footer</code>; el slot Espacio es <code>items</code>.
            </>,
            <>
              <strong>Type de Menu mobile:</strong> Default es la barra cerrada y Menu list, el menú abierto (<code>open</code> o <code>defaultOpen</code>). Avatar+icon button es <code>mobileActions</code> y el slot List items es <code>items</code>.
            </>,
            <>
              <strong>Hamburguer menu:</strong> Type With text, Dropdown y Single icon es <code>type</code> de SideBarItem; en <code>SideBar</code> sale solo (Dropdown con <code>items[].items</code>, Single icon contraída). State es <code>state</code> (solo para documentar); en uso, Select es <code>value</code>. Option es <code>label</code> y Badge, <code>badge</code>.
            </>,
            <>
              <strong>Lo que difiere:</strong> Logo no se puede ocultar en código. Scroll y Scroll bar no tienen prop: la lista siempre se desplaza dentro de un ScrollArea si no cabe. Buttons de Menu mobile va en <code>mobileActions</code>. Figma no dibuja el Badge en Single icon; el código lo pone en la esquina del ícono.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo Side bar es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Navegación principal con muchas secciones:</strong> una barra a la izquierda con un <code>nav</code> con nombre. Los ítems con <code>href</code> son enlaces reales y la sección actual lleva <code>aria-current=&quot;page&quot;</code>.
            </>,
            <>
              <strong>Secciones con subpáginas:</strong> un ítem con <code>items</code> es un botón disclosure; Enter o Espacio abren su lista, que sigue al botón en el orden de Tab. La sección del valor inicial arranca abierta.
            </>,
            <>
              <strong>Más espacio para el contenido:</strong> la flecha contrae la barra a íconos de 44. Cada ítem se nombra con su texto y muestra un Tooltip; el foco se queda en el control pulsado.
            </>,
            <>
              <strong>Pantallas angostas:</strong> con <code>layout=&quot;auto&quot;</code> pasa a la barra móvil por debajo de 48rem. Escape cierra la hoja y devuelve el foco al botón; elegir un enlace también la cierra.
            </>,
            <>
              <strong>Pendientes por sección:</strong> <code>badge</code> muestra la cantidad y <code>badgeLabel</code> la explica a los lectores de pantalla (&quot;3 sin leer&quot;).
            </>,
          ],
          avoid: [
            <>
              <strong>Pocas secciones y una barra arriba:</strong> la barra lateral ocupa una columna entera. (Alternativa: <code>Header</code>).
            </>,
            <>
              <strong>Navegación inferior en móvil:</strong> la barra móvil queda arriba y esconde las secciones en la hoja. (Alternativa: <code>NavBar</code>).
            </>,
            <>
              <strong>Cambiar de contenido dentro de una página:</strong> los ítems llevan a otras páginas. (Alternativa: <code>Tabs</code>).
            </>,
            <>
              <strong>Lista de acciones:</strong> los ítems navegan; para acciones como Duplicar o Eliminar usa un menú. (Alternativa: <code>DropdownMenu</code>).
            </>,
          ],
        },
      ],
    },
    {
      title: 'Aplicaciones de breakpoints',
      description: (
        <>
          Cada vista se dibuja con los valores responsive de su breakpoint. Tablet usa los mismos tokens que Desktop en la barra lateral; la barra móvil, si se fuerza con <code>layout=&quot;mobile&quot;</code>, baja su padding de 32 a 24.
        </>
      ),
      blocks: [
        {
          type: 'breakpoints',
          desktop: {
            columns: [
              {
                title: 'Barra expandida',
                bullets: [
                  <>
                    <strong>298 de ancho</strong> y el alto de su contenedor. Ítems de 44 a 8 entre sí; los submenús con sangría de 32.
                  </>,
                  <>
                    <strong>Cuándo se dibuja:</strong> con <code>layout=&quot;auto&quot;</code>, desde 48rem de ventana.
                  </>,
                ],
                preview: at(1440, desktop({ layout: 'auto', defaultValue: 'mensajes' })),
              },
              {
                title: 'Barra contraída',
                bullets: [
                  <>
                    <strong>63 de ancho</strong> con ítems Single icon de 44 × 44 y el Logo de solo símbolo.
                  </>,
                  <>
                    <strong>Se expande</strong> con la flecha del pie o al pulsar un ítem con submenú.
                  </>,
                ],
                preview: at(1440, desktop({ layout: 'auto', defaultCollapsed: true, defaultValue: 'mensajes' })),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Barra móvil</strong> por debajo de 48rem: 72 de alto, padding de 20 y el botón de menú, el logo y las acciones de 32.
              </>,
              <>
                <strong>Hoja:</strong> baja bajo la barra hasta el final de la pantalla, con padding de 16.
              </>,
              <>
                <strong>Ítems a todo el ancho</strong>, de 44 de alto; los submenús con sangría de 24.
              </>,
            ],
            preview: mobile({ layout: 'auto', defaultOpen: true, defaultValue: 'documentos' }),
          },
          tablet: {
            bullets: [
              <>
                <strong>Barra lateral a 768:</strong> 768 es 48rem, así que <code>layout=&quot;auto&quot;</code> ya dibuja la barra de escritorio.
              </>,
              <>
                <strong>Mismas medidas que Desktop:</strong> 298 expandida, 63 contraída, ítems de 44 y submenús con sangría de 32.
              </>,
              <>
                <strong>Barra móvil forzada:</strong> con <code>layout=&quot;mobile&quot;</code> mide 80 de alto (padding de 24) y la hoja tiene padding de 24.
              </>,
            ],
            preview: at(768, desktop({ layout: 'auto', defaultValue: 'mensajes' })),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de la sección actual, los íconos y los nombres de las secciones.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Sección actual marcada',
              description: (
                <>
                  Pasa en <code>value</code> la sección en la que está la persona: se ve seleccionada y se anuncia con <code>aria-current</code>.
                </>
              ),
              preview: plain({ items: SECTIONS, value: 'reuniones' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Sin sección actual',
              description: 'No dejes la barra sin sección actual: nadie sabe en qué página está.',
              preview: plain({ items: SECTIONS }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Un ícono por sección',
              description: 'Da a cada sección un ícono propio: en la barra contraída es lo único que se ve.',
              preview: plain({ value: 'documentos', defaultCollapsed: true }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'El mismo ícono en todas',
              description: 'No repitas el ícono: contraída, las secciones no se distinguen.',
              preview: plain({ items: FLAT.map((section) => ({ ...section, icon: 'home1' as const })), value: 'documentos', defaultCollapsed: true }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Secciones de una o dos palabras',
              description: 'Nombra cada sección con una o dos palabras, como Proyectos o Ajustes.',
              preview: plain({ value: 'documentos' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Secciones con frases largas',
              description: 'No uses frases como nombre de sección: la fila no ajusta línea y las corta.',
              preview: plain({
                  value: 'documentos',
                  items: [
                    { id: 'inicio', label: 'Página de inicio con las novedades', icon: 'home1', href: '#inicio' },
                    { id: 'documentos', label: 'Documentos recientes y compartidos', icon: 'document', href: '#documentos' },
                    { id: 'proyectos', label: 'Proyectos activos y archivados del equipo', icon: 'folder', href: '#proyectos' },
                    { id: 'ajustes', label: 'Ajustes de la cuenta y de las notificaciones', icon: 'setting', href: '#ajustes' },
                    { id: 'ayuda', label: 'Centro de ayuda y preguntas frecuentes', icon: 'message-question', href: '#ayuda' },
                  ],
                }),
            },
          ],
        },
      ],
    },
  ],
};
