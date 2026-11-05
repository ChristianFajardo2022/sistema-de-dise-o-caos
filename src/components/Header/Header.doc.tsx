import type { ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Header } from './Header';
import type { HeaderNavItem, HeaderProps } from './Header.types';
import { DropdownMenuItem } from '../DropdownMenu';
import { NotificationItem } from '../NotificationItem';
import { NotificationPanel } from '../NotificationPanel';

/*
 * Contenido de la página de documentación de Header (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Header.types.ts`, `Header.variants.ts`, `Header.tsx` y sus piezas internas `HeaderNav`, `HeaderMobileMenu`,
 * `HeaderBell` y `useHeaderFit`), luego `Header.docs.json`. Logo, Button menu, Icon menu, Input, NotificationBell,
 * NotificationPanel, Avatar menu y Dropdown menu son componentes aparte: aquí solo se nombran.
 *
 * Las muestras usan `openItem` y `menuOpen` controlados (sin manejador) para que el clic en otra parte de la página no
 * cierre su submenú. La banda de escritorio y la hoja móvil se colocan con `position: absolute` bajo la barra: el
 * envoltorio de cada muestra les reserva el alto. La hoja móvil va con `h-auto` (`menuClassName`) en lugar del alto de
 * la pantalla (en la anatomía, también sin `z-index`, para que no tape las cifras de las cotas). El panel de la campana
 * y el menú de perfil se abren en la capa superior y no se dibujan aquí.
 *
 * Diferencias con Figma: Logo no se puede ocultar (sin `logo` se dibuja el Logo icon sm); Logout y Button de Header
 * mobile no tienen prop propia (van en `actions`); el divisor de la hoja móvil usa el primitivo stroke/dm (0.5) porque
 * border/divider/md no está en tokens.css.
 */

// Figma: 13448:29988 (component set Header desktop), 13520:81850 (component set Header mobile), Status Bar (decorativa)

/** Secciones de ejemplo: dos con submenú, la actual y un enlace directo. */
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
    id: 'documentos',
    label: 'Documentos',
    items: [
      { label: 'Recientes', href: '#recientes' },
      { label: 'Compartidos', href: '#compartidos' },
    ],
  },
  { id: 'mensajes', label: 'Mensajes', href: '#mensajes', current: true },
  { id: 'ayuda', label: 'Ayuda', href: '#ayuda' },
];

/** Secciones sin submenú, para las muestras de la hoja móvil. */
const FLAT: HeaderNavItem[] = [
  { id: 'inicio', label: 'Inicio', href: '#inicio' },
  { id: 'proyectos', label: 'Proyectos', href: '#proyectos' },
  { id: 'mensajes', label: 'Mensajes', href: '#mensajes', current: true },
  { id: 'ayuda', label: 'Ayuda', href: '#ayuda' },
];

/** Otras secciones sin submenú, para que el par de la sección actual no repita la muestra de los nombres cortos. */
const SECTIONS: HeaderNavItem[] = [
  { id: 'inicio', label: 'Inicio', href: '#inicio' },
  { id: 'documentos', label: 'Documentos', href: '#documentos', current: true },
  { id: 'reuniones', label: 'Reuniones', href: '#reuniones' },
  { id: 'ajustes', label: 'Ajustes', href: '#ajustes' },
];

/** Panel de la campana: queda montado en su capa cerrada (no se ve en las muestras). */
const PANEL = (
  <NotificationPanel>
    <NotificationItem title="Documento compartido" description="Ana Pérez compartió Informe anual contigo." unread />
    <NotificationItem title="Reunión reprogramada" description="La reunión de equipo pasó a las 3:00 p.m." unread />
  </NotificationPanel>
);

const PROFILE = (
  <>
    <DropdownMenuItem>Mi perfil</DropdownMenuItem>
    <DropdownMenuItem>Ajustes</DropdownMenuItem>
  </>
);

/** Header de ejemplo con sesión: navegación, buscador, campana y avatar. */
const header = (props: Partial<HeaderProps> = {}) => (
  <Header
    homeHref="#inicio"
    items={ITEMS}
    notificationPanel={PANEL}
    notificationCount={2}
    user={{ name: 'Hugo García', email: 'hugo.garcia@ejemplo.com' }}
    profileMenu={PROFILE}
    onLogout={() => {}}
    {...props}
  />
);

/**
 * Dibuja la muestra a un ancho de diseño; la plantilla la reduce si no cabe. Como las vistas de la anatomía, las muestras
 * son ilustraciones (`inert`): diez cabeceras navegables repetirían en la página los landmarks navigation y search, que
 * no se pueden distinguir por nombre (el buscador no lleva uno propio). La cabecera interactiva es la de Desarrollo.
 */
const at = (width: number, node: ReactNode) => (
  <div inert style={{ width }}>
    {node}
  </div>
);

/**
 * Reserva el alto de la banda o de la hoja, que se colocan bajo la barra con `position: absolute`. El alto depende del
 * padding responsive (`space/general/3xl`): `pads` veces ese token más lo fijo (filas de 32 o 48, buscador, enlaces).
 */
const room = (pads: number, fixed: number, node: ReactNode) => (
  <div inert className="w-full" style={{ height: `calc(var(--ds-responsive-space-general-3xl) * ${pads} + ${fixed}px)` }}>
    {node}
  </div>
);

/** Header desktop; con `open`, el submenú de esa sección en la banda (Type Menu list). */
const desktop = (open: string | null = null, props: Partial<HeaderProps> = {}) => {
  const bar = header({ layout: 'desktop', openItem: open, ...props });
  if (!open) return bar;
  // Barra (2 paddings + fila de 48) y banda (padding inferior + enlaces de 34)
  const links = ITEMS.find((item) => item.id === open)?.items?.length ?? 0;
  return room(3, 48 + links * 34, bar);
};

/** Hojas móviles de las muestras: alto fijo de su contenido (buscador de 40 y enlaces) y cuántos paddings llevan. */
const SHEET = {
  /** Solo el buscador: barra (2 paddings + 32) y hoja (2 paddings + 40). */
  search: { pads: 4, fixed: 72 },
  /** Cuatro enlaces sin submenú (4 × 34) y 7 huecos de 8; un padding más entre buscador y lista. */
  flat: { pads: 5, fixed: 72 + 4 * 34 + 7 * 8 },
  /** Las secciones de ejemplo con sus submenús: 9 filas de 34 y 7 huecos de 8. */
  full: { pads: 5, fixed: 72 + 9 * 34 + 7 * 8 },
};

/** Header mobile; con `sheet`, la hoja abierta con el buscador y los enlaces (Type Menu list), del alto de su contenido. */
const mobile = (sheet?: keyof typeof SHEET, props: Partial<HeaderProps> = {}) => {
  const bar = header({ layout: 'mobile', menuOpen: Boolean(sheet), menuClassName: 'h-auto', items: sheet === 'full' ? ITEMS : FLAT, ...props });
  return sheet ? room(SHEET[sheet].pads, SHEET[sheet].fixed, bar) : bar;
};

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: (
      <>
        Barra cerrada. En escritorio <code>openItem</code> es <code>null</code>; en móvil, <code>menuOpen</code> es <code>false</code>.
      </>
    ),
    samples: [at(1440, desktop()), at(376, mobile())],
  },
  {
    label: 'Menu list',
    tone: 'accent',
    description: (
      <>
        Submenú abierto. En escritorio la banda muestra los enlaces de la sección de <code>openItem</code> y su botón pasa a Press/select; en móvil, <code>menuOpen</code> despliega la hoja.
      </>
    ),
    samples: [at(1440, desktop('proyectos')), at(376, mobile('flat'))],
  },
];

export const doc: ComponentDocContent = {
  name: 'Header',
  icon: 'homepage',
  classification: 'composicion',
  summary:
    'El Header es la composición que encabeza el producto: logo, navegación principal con submenús, buscador, notificaciones y menú de perfil. Cambia entre la barra de escritorio y la móvil según su propio ancho.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una barra en fila con tres zonas: logo y navegación, buscador y acciones. En móvil, la navegación y el buscador pasan a una hoja que abre el botón de menú.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Header desktop con un submenú abierto',
                  width: 1440,
                  preview: desktop('proyectos'),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Header desktop"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Logo "]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Menu list1"]', side: 'top' },
                    { n: 4, selector: '[data-figma-part="Options"]', side: 'right' },
                    { n: 5, selector: '[data-figma-part="General input"]', side: 'top' },
                    { n: 6, selector: '[data-figma-part="Avatar"]', side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Header desktop"]', side: 'left' },
                    { kind: 'padding', selector: '[data-figma-part="Header desktop"]', side: 'top' },
                    { kind: 'gap', from: '[data-figma-part="Logo "]', to: '[data-figma-part="Menu list1"]' },
                    { kind: 'padding', selector: '[data-figma-part="Dropdown"]', side: 'bottom' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Barra:</strong> <code>header</code> de todo el ancho con relleno <code>background/container/surface</code> y una fila de 48 al centro: mide 96 de alto. Padding vertical de 24 (<code>space/general/3xl</code>) y lateral de 56 (<code>space/canva/lateral</code>); son tokens responsive: 20 y 16 con ventana móvil, 24 y 24 en tablet. La cota muestra los de la ventana actual. Entre zonas hay 16 (<code>space/general/2xl</code>), que bajan a 12 cuando el Header mide menos de 48rem.
                </>,
                <>
                  <strong>Logo:</strong> Logo de tipo icon y tamaño sm (32), un componente aparte. Con <code>homeHref</code> es un enlace a inicio llamado &quot;Inicio&quot; (<code>homeLabel</code>).
                </>,
                <>
                  <strong>Navegación:</strong> <code>nav</code> llamado &quot;Navegación principal&quot; (<code>navLabel</code>), con un Button menu por sección a 16 del logo y 16 entre sí. Una sección con <code>items</code> es un botón con chevron y <code>aria-expanded</code>; una con <code>href</code>, un enlace.
                </>,
                <>
                  <strong>Submenú:</strong> banda de todo el ancho bajo la barra, con relleno <code>background/container/surface-opacity</code> (60%), efecto glass y padding inferior de 24. La lista mide 280 y empieza bajo su botón; sus enlaces son ítems de Dropdown menu de 34 de alto.
                </>,
                <>
                  <strong>Buscador:</strong> Input <code>search-header</code> de 48 de alto dentro de un <code>form</code> con <code>role=&quot;search&quot;</code>. Mide 334 y cede hasta 160 si falta espacio. Su label es &quot;Buscar&quot; (<code>searchLabel</code>) y Enter llama a <code>onSearch</code>.
                </>,
                <>
                  <strong>Acciones:</strong> NotificationBell de 48 (<code>notificationPanel</code>) y Avatar menu de 48 (<code>user</code>), a 8 entre sí. Sin sesión, los botones de <code>actions</code> ocupan este lugar.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Header mobile con la hoja abierta',
                  width: 376,
                  preview: mobile('full', { menuClassName: 'h-auto z-auto' }),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Header mobile"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Content"] > button', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Logo "]', side: 'top' },
                    { n: 4, selector: '[data-figma-part="Avatar"]', side: 'top' },
                    { n: 5, selector: '[data-figma-part="Dropdown"]', side: 'left' },
                    { n: 6, selector: 'li[data-figma-part="Dropdown list"]', index: -1, side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: '[data-figma-part="Content"] > button', to: '[data-figma-part="Logo "]' },
                    { kind: 'padding', selector: '[data-figma-part="Dropdown"]', side: 'left' },
                    { kind: 'gap', from: '[data-figma-part="Dropdown"] [data-figma-part="General input"]', to: '[data-figma-part="Dropdown"] nav', axis: 'y' },
                    { kind: 'gap', from: 'li[data-figma-part="Dropdown list"]', fromIndex: 2, to: 'li[data-figma-part="Dropdown list"]', toIndex: 3, axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Barra:</strong> fila de 32 con padding de 20 en Mobile y 24 desde Tablet (<code>space/general/3xl</code>): mide 72 de alto en Mobile. Entre zonas hay 12.
                </>,
                <>
                  <strong>Botón de menú:</strong> <code>button</code> de 32 sin marco con el Icon menu, un componente aparte, a 8 del logo. Lleva <code>aria-expanded</code> y se llama &quot;Abrir menú&quot; o &quot;Cerrar menú&quot; (<code>openMenuLabel</code>, <code>closeMenuLabel</code>).
                </>,
                <>
                  <strong>Logo:</strong> el mismo Logo icon sm de 32 que en escritorio.
                </>,
                <>
                  <strong>Acciones:</strong> NotificationBell xs y Avatar menu sm, los dos de 32, a 8 entre sí.
                </>,
                <>
                  <strong>Hoja:</strong> de todo el ancho bajo la barra y hasta el final de la pantalla, con relleno <code>background/container/surface</code>. Padding de 20 en Mobile y 24 desde Tablet, la misma separación entre el buscador (40 de alto) y la lista; la cota muestra los de la ventana actual. Se desplaza si no cabe.
                </>,
                <>
                  <strong>Enlaces:</strong> ítems de Dropdown menu de 34 de alto dentro de un <code>nav</code>; los de cada submenú van debajo con sangría de 16. Los separa un divisor de 0,5 (<code>border/general/default-on-card</code>) que no ocupa alto, con 8 a cada lado.
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
          Header tiene 2 estados, en escritorio y en móvil. No hay prop <code>state</code>: salen de <code>openItem</code> y <code>menuOpen</code>. Hover, Focus y Press de cada sección son de Button menu; los paneles de la campana y del avatar, de NotificationPanel y Avatar menu.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default de cada composición y de la banda del submenú. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Header desktop',
              preview: at(1440, desktop()),
              entries: [
                { part: 'Fondo de la barra', color: 'background-container-surface' },
                { part: 'Texto de las secciones', color: 'text-button-menu-default', text: 'typography-button-size-md-uniform' },
                { part: 'Borde del buscador', color: 'border-field-default' },
                { part: 'Contorno de foco del logo (aparece en Focus)', color: 'border-field-active' },
              ],
            },
            {
              title: 'Submenú',
              preview: at(1440, desktop('proyectos')),
              entries: [
                { part: 'Fondo de la banda', color: 'background-container-surface-opacity' },
                { part: 'Sección abierta', color: 'text-button-menu-focus-press-select' },
                { part: 'Texto de los enlaces', color: 'text-neutral-white', text: 'typography-field-size-sm' },
                { part: 'Fondo del enlace (aparece en Hover)', color: 'background-field-hover' },
              ],
            },
            {
              title: 'Header mobile',
              preview: at(376, mobile('flat')),
              entries: [
                { part: 'Fondo de la barra y de la hoja', color: 'background-container-surface' },
                { part: 'Ícono de menú', color: 'border-general-white' },
                { part: 'Texto de los enlaces', color: 'text-neutral-white', text: 'typography-field-size-sm' },
                { part: 'Divisor', color: 'border-general-default-on-card' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Header en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Header desktop o Header mobile en la librería de Assets. En código es un solo componente: <code>layout</code> elige la composición y por defecto (<code>auto</code>) la decide el ancho del propio Header.
            </>,
            <>
              <strong>Type:</strong> Default es la barra cerrada. Menu list1 a 6 abren el submenú de la sección 1 a 6: en código, <code>openItem</code> con el <code>id</code> de la sección. Menu list de Header mobile es la hoja abierta (<code>menuOpen</code>).
            </>,
            <>
              <strong>Menu list, Searcher, Icon buttons y Buttons:</strong> Menu list y su slot son <code>items</code>, y el slot Options de cada sección es <code>items[].items</code>. Searcher es <code>search</code>. Avatar es <code>user</code>; Simple notification y Complex notification son <code>notificationPanel</code> con un NotificationPanel <code>simple</code> o <code>complex</code>. Buttons es <code>actions</code>.
            </>,
            <>
              <strong>Lo que difiere:</strong> Logo no se puede ocultar en código; sin <code>logo</code> se dibuja el Logo icon sm. Logout y Button de Header mobile van en <code>actions</code>. La Status Bar (iOS o Android) es decorativa y no forma parte del componente.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Header es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Cabecera de la aplicación:</strong> una por página, arriba, con la navegación principal, el buscador y la cuenta. Fuera de <code>main</code>, <code>article</code> o <code>section</code> se anuncia como banner; dentro de ellos, pasa <code>role=&quot;banner&quot;</code>.
            </>,
            <>
              <strong>Secciones con submenú:</strong> en escritorio, el botón de la sección abre la banda y la lista sigue a su botón en el orden de Tab. Escape, el clic fuera o el foco que sale de la navegación la cierran; Escape devuelve el foco al botón.
            </>,
            <>
              <strong>Composición según el espacio:</strong> con <code>layout=&quot;auto&quot;</code> el Header mide su propio ancho, no el de la ventana. Dibuja la barra de escritorio si cabe entera y la móvil si no.
            </>,
            <>
              <strong>Menú móvil:</strong> el botón de menú despliega la hoja, que sigue al botón en el orden de Tab. Escape la cierra y devuelve el foco al botón; elegir un enlace también la cierra.
            </>,
            <>
              <strong>Notificaciones y cuenta:</strong> la campana abre el NotificationPanel como diálogo no modal anclado a ella, y el avatar abre el Avatar menu. Sin sesión, <code>actions</code> lleva los botones, como Iniciar sesión.
            </>,
          ],
          avoid: [
            <>
              <strong>Navegación con varios niveles:</strong> el submenú tiene un solo nivel de enlaces. (Alternativa: <code>SideBar</code>).
            </>,
            <>
              <strong>Título y acciones de una vista:</strong> el Header es de toda la aplicación, no de una página. (Alternativa: <code>PageHeader</code> o <code>TopAppBar</code>).
            </>,
            <>
              <strong>Cambiar de contenido dentro de una página:</strong> las secciones del Header llevan a otras páginas. (Alternativa: <code>Tabs</code>).
            </>,
            <>
              <strong>Barra de navegación inferior en móvil:</strong> el Header queda arriba y esconde las secciones en la hoja. (Alternativa: <code>NavBar</code>).
            </>,
          ],
        },
      ],
    },
    {
      title: 'Aplicaciones de breakpoints',
      description: (
        <>
          Cada vista se dibuja con los valores responsive de su breakpoint. Tablet comparte los tokens de Desktop salvo el padding lateral (<code>space/canva/lateral</code>), que baja de 56 a 24.
        </>
      ),
      blocks: [
        {
          type: 'breakpoints',
          desktop: {
            columns: [
              {
                title: 'Barra de escritorio',
                bullets: [
                  <>
                    <strong>Medidas:</strong> 96 de alto, padding de 24 arriba y abajo y de 56 a los lados. Campana y avatar de 48.
                  </>,
                  <>
                    <strong>Cuándo se dibuja:</strong> con <code>layout=&quot;auto&quot;</code>, cuando caben enteros el logo, las secciones, el buscador a su mínimo de 160 y las acciones.
                  </>,
                ],
                preview: at(1440, desktop()),
              },
              {
                title: 'Submenú abierto',
                bullets: [
                  <>
                    <strong>Banda de todo el ancho</strong> bajo la barra, con padding inferior de 24.
                  </>,
                  <>
                    <strong>Lista de 280</strong> alineada con el botón que la abrió. Sus enlaces miden 34 de alto.
                  </>,
                ],
                preview: at(1440, desktop('proyectos')),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Barra móvil:</strong> 72 de alto, padding de 20 y 12 entre zonas. Campana y avatar bajan a 32.
              </>,
              <>
                <strong>Hoja:</strong> el botón de menú la despliega bajo la barra hasta el final de la pantalla, con padding de 20 y el buscador de 40.
              </>,
              <>
                <strong>Enlaces:</strong> cada sección es un enlace de 34 de alto; los de su submenú van debajo con sangría de 16.
              </>,
            ],
            preview: at(376, mobile('flat')),
          },
          tablet: {
            bullets: [
              <>
                <strong>Barra de escritorio a 768:</strong> con las cuatro secciones de ejemplo, el buscador y las acciones, todo cabe y <code>layout=&quot;auto&quot;</code> dibuja la barra de escritorio.
              </>,
              <>
                <strong>Padding lateral de 24:</strong> baja de 56 (<code>space/canva/lateral</code>). El vertical sigue en 24 y la barra mide 96.
              </>,
              <>
                <strong>Con más secciones:</strong> si la barra no cabe en el ancho del Header, pasa a la composición móvil, con padding de 24 y 80 de alto.
              </>,
            ],
            preview: at(768, header()),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de la sección actual, los nombres de las secciones y el label del buscador.',
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
                  Marca con <code>current</code> la sección en la que está la persona: se ve seleccionada y se anuncia con <code>aria-current</code>.
                </>
              ),
              preview: mobile('flat', { items: SECTIONS }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Sin sección actual',
              description: 'No dejes la navegación sin sección actual: nadie sabe en qué página está.',
              preview: mobile('flat', { items: SECTIONS.map(({ current: _current, ...item }) => item) }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Secciones de una o dos palabras',
              description: 'Nombra cada sección con una o dos palabras, como Proyectos o Mensajes.',
              preview: mobile('flat'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Secciones con frases largas',
              description: 'No uses frases como nombre de sección: se cortan en la hoja y la barra de escritorio deja de caber antes.',
              preview: mobile('flat', {
                items: [
                  { id: 'inicio', label: 'Página de inicio de la aplicación y novedades', href: '#inicio' },
                  { id: 'proyectos', label: 'Todos los proyectos activos y archivados del equipo', href: '#proyectos' },
                  { id: 'mensajes', label: 'Mensajes recibidos, enviados y borradores', href: '#mensajes', current: true },
                  { id: 'ayuda', label: 'Centro de ayuda, preguntas frecuentes y contacto', href: '#ayuda' },
                ],
              }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Label que nombra la búsqueda',
              description: (
                <>
                  Di en <code>searchLabel</code> qué se busca, como Buscar documentos.
                </>
              ),
              preview: mobile('search', { items: [], searchLabel: 'Buscar documentos' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Label con una instrucción',
              description: 'No uses instrucciones como Escribe aquí: no dicen qué se puede buscar.',
              preview: mobile('search', { items: [], searchLabel: 'Escribe aquí' }),
            },
          ],
        },
      ],
    },
  ],
};
