import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { NotificationPanel } from './NotificationPanel';
import { NotificationFilter } from './NotificationFilter';
import { NotificationPanelHeading } from './NotificationPanelHeading';
import type { NotificationPanelTab } from './NotificationPanel.types';
import { NotificationBell } from '../NotificationBell';
import { NotificationCard } from '../NotificationCard';
import { NotificationGroup, NotificationGroupItem } from '../NotificationGroup';
import { NotificationItem } from '../NotificationItem';

/*
 * Contenido de la página de documentación de NotificationPanel (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el
 * código (`NotificationPanel.types.ts`, `NotificationPanel.variants.ts`, `NotificationPanel.tsx` y sus piezas
 * `NotificationFilter`, `NotificationTabStrip` y `NotificationPanelHeading`, que se documentan aquí), luego
 * `NotificationPanel.docs.json`. NotificationBell, NotificationItem, NotificationCard y NotificationGroup son componentes
 * aparte: aquí solo se nombran.
 *
 * Las muestras dibujan el panel en el flujo, sin `popup`: abierto como diálogo recibe el foco, y en la página lo
 * robaría. Cada muestra que no es ilustración lleva su propio `aria-label` para que las regiones no repitan nombre.
 *
 * Padding, como Figma: Simple space/container/on-canva (32 Desktop, 24 Tablet, 20 Mobile); Complex
 * space/container/on-card (24 Desktop y Tablet, 16 Mobile). Diferencias con Figma: trazo de la tarjeta, de los chips y divisor: 1 px (border/general/md); Figma enlaza border/general/sm (0.5). El
 * título usa los primitivos size/lg y line-height/xl (16/20), los mismos valores que typography/heading/size/md de Figma.
 * El set Mobile notifications no es este componente: es el patrón Patterns/Notifications/Screen.
 */

// Figma: 12602:6152 (component set Simple notifications), 15302:8832 (component set Complex notifications)

type PanelProps = Partial<ComponentProps<typeof NotificationPanel>>;

interface Note {
  title: string;
  description: string;
  unread?: boolean;
}

const NOTES: Note[] = [
  { title: 'Documento compartido', description: 'Ana Pérez compartió Informe anual contigo.', unread: true },
  { title: 'Reunión reprogramada', description: 'La reunión de equipo pasó a las 3:00 p.m.', unread: true },
  { title: 'Nuevo comentario', description: 'Hugo García comentó en Plan de trabajo.' },
];

const TABS: NotificationPanelTab[] = [
  { value: 'all', label: 'Todas', icon: 'notification', badge: 3, badgeLabel: 'notificaciones' },
  { value: 'docs', label: 'Documentos', icon: 'document', badge: 1, badgeLabel: 'sin leer' },
  { value: 'settings', icon: 'setting', 'aria-label': 'Ajustes' },
];

/** Filas de texto (NotificationItem) de la lista simple. */
const items = (notes: Note[] = NOTES) => notes.map((n) => <NotificationItem key={n.title} title={n.title} description={n.description} unread={n.unread} />);

/**
 * Panel simple en el flujo; `label` le da un nombre propio a la región de cada muestra. Las muestras usan un h3 para
 * seguir el orden de encabezados de la página; la anatomía (ilustración) deja el h2 por defecto.
 */
const simple = (label: string, props: PanelProps = {}, notes: Note[] = NOTES) => (
  <NotificationPanel aria-label={label} headingLevel={3} {...props}>
    {items(notes)}
  </NotificationPanel>
);

/** Contenido del panel complejo: secciones Hoy y Ayer (un nivel debajo del título), tarjetas y un grupo. */
const complexList = (level: 3 | 4) => [
  <NotificationPanelHeading key="hoy" headingLevel={level}>
    Hoy
  </NotificationPanelHeading>,
  <NotificationCard key="doc" time="Hace 20 min" title="Documento compartido" description="Ana Pérez compartió Informe anual contigo." unread />,
  <NotificationGroup key="grupo" time="Hace 1 h" title="Comentarios en Plan de trabajo" unread>
    <NotificationGroupItem time="Hace 1 h" description="Hugo García respondió tu comentario." unread />
    <NotificationGroupItem time="Hace 2 h" description="Ana Pérez agregó un comentario." />
  </NotificationGroup>,
  <NotificationPanelHeading key="ayer" headingLevel={level}>
    Ayer
  </NotificationPanelHeading>,
  <NotificationCard key="ajustes" time="4:00 p.m." title="Ajustes guardados" description="Cambiaste el idioma de tu perfil." />,
];

/** Panel complejo en el flujo, con pestañas y ajustes. */
const complex = (label: string, props: PanelProps = {}) => {
  const level = props.headingLevel ?? 3;
  return (
    <NotificationPanel aria-label={label} variant="complex" tabs={TABS} onSettingsClick={() => {}} listMaxHeight="40rem" headingLevel={level} {...props}>
      {complexList(level === 2 ? 3 : 4)}
    </NotificationPanel>
  );
};

/** Ancho de la capa del Header (400, `w-100`). */
const wide = (node: ReactNode) => <div className="w-100">{node}</div>;

/** Campana sola: el panel cerrado. */
const bell = (open = false) => <NotificationBell size="sm" count={2} open={open} aria-haspopup="dialog" />;

/** Panel abierto bajo la campana, alineado a la derecha y a 8 px, como lo coloca la capa del Header. */
const opened = (label: string, props: PanelProps = {}) => (
  <div className="flex w-100 flex-col items-end gap-ds-space-general-lg">
    {bell(true)}
    {simple(label, props)}
  </div>
);

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: (
      <>
        Cerrado: solo se ve la campana con su contador. Con <code>open={'{false}'}</code> el panel no se dibuja.
      </>
    ),
    samples: [bell()],
  },
  {
    label: 'Dropdown',
    tone: 'accent',
    description: (
      <>
        Abierto bajo la campana. Con <code>popup</code> recibe el foco y, si se abrió con teclado, dibuja un contorno de 2 px.
      </>
    ),
    samples: [opened('Notificaciones, estado Dropdown')],
  },
  {
    label: 'No notification',
    tone: 'neutral',
    description: (
      <>
        Sin notificaciones (<code>empty</code>), un EmptyState ocupa el lugar de la lista. Con el filtro No leídos dice &quot;No tienes notificaciones sin leer.&quot;
      </>
    ),
    samples: [wide(simple('Notificaciones, estado No notification', { empty: true }))],
  },
];

export const doc: ComponentDocContent = {
  name: 'NotificationPanel',
  icon: 'notification',
  classification: 'composicion',
  summary:
    'El NotificationPanel es la composición que reúne las notificaciones en una tarjeta: título, filtro Todas o No leídos, pestañas opcionales y la lista. Incluye NotificationFilter, NotificationTabStrip y NotificationPanelHeading. Se abre desde NotificationBell como diálogo no modal.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una tarjeta en columna: encabezado con título y filtro, divisor y lista desplazable. Complex suma ajustes, pestañas y secciones por fecha.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Simple, abierto desde la campana',
                  preview: opened('Notificaciones', { headingLevel: 2 }),
                  marks: [
                    { n: 1, selector: 'button[aria-haspopup="dialog"]', side: 'top' },
                    { n: 2, selector: 'section', side: 'left' },
                    { n: 3, selector: '[data-figma-part="Notificaciones"]', side: 'top' },
                    { n: 4, selector: '[role="radiogroup"]', side: 'right' },
                    { n: 5, selector: '[data-figma-part="Divider"]', side: 'right' },
                    { n: 6, selector: 'ul[role="list"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: 'button[aria-haspopup="dialog"]', to: 'section', axis: 'y' },
                    { kind: 'padding', selector: 'section', side: 'left' },
                    { kind: 'gap', from: 'section > [data-figma-part="Container"]', to: '[data-figma-part="Divider"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Campana:</strong> NotificationBell, un componente aparte, abre el panel. Abierto, expone <code>aria-expanded</code> y se pinta en Press. La capa del Header deja el panel 8 px debajo, alineado a la derecha.
                </>,
                <>
                  <strong>Contenedor:</strong> tarjeta de ancho completo (400 en la capa del Header) con radio de 24 (<code>radius/container/on-card</code>) y trazo de 1 px. Padding de 32 en Simple (<code>space/container/on-canva</code>) y 24 en Complex (<code>space/container/on-card</code>); 16 entre zonas.
                </>,
                <>
                  <strong>Título:</strong> Prospero semibold de 16/20, un h2 (<code>headingLevel</code>). Por defecto &quot;Notificaciones&quot; (<code>title</code>); nombra la región o el diálogo.
                </>,
                <>
                  <strong>Filtro:</strong> NotificationFilter, dos Chip sin ícono (Todas y No leídos) en un ChipGroup de selección única, a 8 entre sí. Queda a 24 del título (<code>space/general/3xl</code>).
                </>,
                <>
                  <strong>Divisor:</strong> línea de 1 px (<code>border/general/md</code>) a todo el ancho. Es decorativa: no se anuncia.
                </>,
                <>
                  <strong>Lista:</strong> <code>ul</code> llamada &quot;Lista de notificaciones&quot; (<code>listLabel</code>) dentro de un ScrollArea, que se desplaza desde 24rem (<code>listMaxHeight</code>). En Simple, filas NotificationItem a 16 entre sí.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Complex con pestañas y secciones',
                  preview: wide(complex('Notificaciones', { headingLevel: 2 })),
                  marks: [
                    { n: 1, selector: 'button[aria-label="Ajustes de notificaciones"]', side: 'right' },
                    { n: 2, selector: '[role="tablist"]', side: 'left' },
                    { n: 3, selector: 'ul[role="list"] > li > h3', side: 'left' },
                    { n: 4, selector: 'ul[role="list"] > li', index: 1, side: 'right' },
                    { n: 5, selector: 'ul[role="list"] > li', index: 2, side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: 'section', side: 'left' },
                    { kind: 'gap', from: 'ul[role="list"] > li', fromIndex: 1, to: 'ul[role="list"] > li', toIndex: 2, axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Ajustes:</strong> Button Tertiary xs de solo ícono (setting de 20), junto al filtro. Solo en Complex y con <code>onSettingsClick</code>; su nombre es &quot;Ajustes de notificaciones&quot; (<code>settingsLabel</code>).
                </>,
                <>
                  <strong>Pestañas:</strong> NotificationTabStrip, unas Tabs sm On card de 40 de alto con ícono y contador (<code>tabs</code>). Con <code>tabScrollButtons</code> suma una flecha a cada lado.
                </>,
                <>
                  <strong>Título de sección:</strong> NotificationPanelHeading, un <code>li</code> con un h3 en Helvetica Neue regular de 14/18. Agrupa por fecha: Hoy, Ayer.
                </>,
                <>
                  <strong>Tarjeta:</strong> NotificationCard, un componente aparte, con hora, título y descripción.
                </>,
                <>
                  <strong>Grupo:</strong> NotificationGroup, un componente aparte, que reúne varias notificaciones y se despliega. Las filas de Complex quedan a 8 entre sí (<code>space/general/lg</code>).
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
          NotificationPanel tiene 3 estados. Default y Dropdown son el panel cerrado y abierto; No notification es el panel sin notificaciones. No hay prop <code>state</code>: salen de <code>open</code> y <code>empty</code>.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Dropdown. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Panel',
              preview: wide(simple('Notificaciones, tokens del panel')),
              entries: [
                { part: 'Fondo', color: 'background-container-default-on-canva' },
                { part: 'Trazo y divisor', color: 'border-general-default-on-card' },
                { part: 'Título', color: 'text-neutral-white', text: 'primitives-typography-size-lg' },
                { part: 'Contorno de foco (aparece en Focus)', color: 'border-field-active' },
              ],
            },
            {
              title: 'Filtro',
              preview: <NotificationFilter aria-label="Filtrar notificaciones de ejemplo" />,
              entries: [
                { part: 'Chip seleccionado', color: 'background-general-gray-sixth' },
                { part: 'Trazo del chip sin seleccionar', color: 'border-general-gray-fourth' },
                { part: 'Texto de los chips', color: 'text-neutral-white', text: 'typography-button-size-sm' },
              ],
            },
            {
              title: 'Complex',
              preview: wide(complex('Notificaciones, tokens de Complex')),
              entries: [
                { part: 'Fondo de las pestañas', color: 'background-tab-container-on-card' },
                { part: 'Pestaña activa', color: 'background-tab-select-on-card' },
                { part: 'Ícono de ajustes', color: 'icon-button-tertiary-default' },
                { part: 'Título de sección', color: 'text-neutral-white', text: 'primitives-typography-size-md' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente NotificationPanel en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Simple notifications o Complex notifications en la librería de Assets. Cada set incluye la campana y el panel; sus propiedades son Type y State, y la lista es un slot (List o List content). En código es <code>variant=&quot;simple&quot;</code> o <code>variant=&quot;complex&quot;</code>.
            </>,
            <>
              <strong>Type y State:</strong> Type No notification es <code>empty</code> y Notification, la lista. State Default es la campana sola y Dropdown, el panel abierto (<code>open</code> con <code>popup</code>). La campana es NotificationBell.
            </>,
            <>
              <strong>Scroll, Scroll bar y chevrons:</strong> la barra no es una prop; aparece sola cuando la lista pasa de <code>listMaxHeight</code>. Left chevron tab y Right chevron tab son <code>tabScrollButtons</code>, que dibuja las dos flechas a la vez.
            </>,
            <>
              <strong>Lo que no es este componente:</strong> el set Mobile notifications, una pantalla completa con volver y la vista Profile, es el patrón Notifications/Screen, armado con las piezas de este panel. Las filas del slot son NotificationItem, NotificationCard y NotificationGroup, componentes aparte.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el NotificationPanel es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Bandeja desde la campana:</strong> con <code>popup</code> es un diálogo no modal (<code>aria-modal=&quot;false&quot;</code>) nombrado por su título. El foco pasa al panel al abrir y vuelve a la campana al cerrar.
            </>,
            <>
              <strong>Cerrar:</strong> Escape llama a <code>onOpenChange(false)</code>. El clic fuera y la posición los resuelve quien lo abre: la capa del Header lo cierra con clic fuera; el lienzo de Desarrollo no, y su código trae un ejemplo. No atrapa el foco ni bloquea el scroll de la página.
            </>,
            <>
              <strong>Filtrar:</strong> los chips Todas y No leídos son un <code>radiogroup</code> (una parada de Tab; las flechas cambian el filtro). El panel no filtra: avisa con <code>onFilterChange</code> y recibe los <code>children</code> ya filtrados.
            </>,
            <>
              <strong>Categorías y fechas (Complex):</strong> <code>tabs</code> con contador; <code>children</code> puede ser una función de la pestaña activa. NotificationPanelHeading separa Hoy y Ayer con encabezados.
            </>,
            <>
              <strong>Eliminar:</strong> al quitar una notificación, el foco pasa a la vecina o, si era la última, al panel.
            </>,
          ],
          avoid: [
            <>
              <strong>Pantalla completa en móvil:</strong> el panel es una tarjeta y no tiene volver ni vista de perfil. (Alternativa: el patrón Notifications/Screen).
            </>,
            <>
              <strong>Avisos que exigen una respuesta:</strong> el panel no es modal y no interrumpe. (Alternativa: <code>AlertModal</code>).
            </>,
            <>
              <strong>Confirmar una acción recién hecha:</strong> nadie abre la bandeja para eso. (Alternativa: <code>Toast</code>).
            </>,
            <>
              <strong>Mensajes sobre el contenido de una vista:</strong> se pierden detrás de la campana. (Alternativa: <code>Alert</code>).
            </>,
          ],
        },
      ],
    },
    {
      title: 'Aplicaciones de breakpoints',
      description: 'Cada vista se dibuja con los valores responsive de su breakpoint. Tablet comparte los tokens de Desktop salvo el padding de Simple, que baja a 24.',
      blocks: [
        {
          type: 'breakpoints',
          desktop: {
            columns: [
              {
                title: 'Simple',
                bullets: [
                  <>
                    <strong>Medidas:</strong> padding de 32 (<code>space/container/on-canva</code>), radio de 24 y 24 entre título y filtro.
                  </>,
                  <>
                    <strong>Ancho:</strong> ocupa el de su contenedor. La capa del Header lo fija en 400, bajo la campana.
                  </>,
                ],
                preview: wide(simple('Notificaciones, vista Desktop Simple')),
              },
              {
                title: 'Complex',
                bullets: [
                  <>
                    <strong>Padding de 24</strong> (<code>space/container/on-card</code>) y 8 entre filas.
                  </>,
                  <>
                    <strong>Pestañas:</strong> Tabs sm de 40 de alto. Si no caben, se desplazan con las flechas del teclado o con <code>tabScrollButtons</code>.
                  </>,
                ],
                preview: wide(complex('Notificaciones, vista Desktop Complex')),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Medidas:</strong> padding de 20 en Simple y 16 en Complex, radio de 16. El título queda a 20 del filtro (<code>space/general/3xl</code>).
              </>,
              <>
                <strong>Ancho:</strong> la capa del Header deja 8 px de margen con cada borde de la pantalla.
              </>,
              <>
                <strong>Pantalla completa:</strong> el set Mobile notifications es el patrón Notifications/Screen, no este panel.
              </>,
            ],
            preview: simple('Notificaciones, vista Mobile'),
          },
          tablet: {
            bullets: [
              <>
                <strong>Simple:</strong> desde 48rem, padding de 24 (32 desde 64rem), radio de 24 y 24 entre título y filtro.
              </>,
              <>
                <strong>Complex:</strong> padding de 24, igual que en Desktop.
              </>,
              <>
                <strong>Lista larga:</strong> se desplaza dentro del panel desde 24rem; con teclado, el ScrollArea es tabulable.
              </>,
            ],
            preview: wide(simple('Notificaciones, vista Tablet')),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de contenido, filtro y lista vacía.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Títulos que dicen qué pasó',
              description: 'Escribe en el título lo que cambió y deja el detalle para la descripción.',
              preview: simple('Notificaciones, ejemplo de títulos claros', {}, NOTES.slice(0, 2)),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Títulos genéricos',
              description: 'Evita títulos como Aviso o Novedad: obligan a leer cada descripción.',
              preview: simple('Notificaciones, ejemplo de títulos genéricos', {}, [
                { title: 'Aviso', description: 'Ana Pérez compartió Informe anual contigo.', unread: true },
                { title: 'Novedad', description: 'La reunión de equipo pasó a las 3:00 p.m.', unread: true },
              ]),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Filtro que cambia la lista',
              description: (
                <>
                  Con No leídos, pasa en <code>children</code> solo las notificaciones sin leer.
                </>
              ),
              preview: simple(
                'Notificaciones, ejemplo de filtro aplicado',
                { defaultFilter: 'unread' },
                NOTES.filter((n) => n.unread)
              ),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Filtro sin efecto',
              description: 'No dejes el filtro sin manejar: el panel no filtra por su cuenta y la lista no cambia.',
              preview: simple('Notificaciones, ejemplo de filtro sin manejar', { defaultFilter: 'unread' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Vacío con mensaje',
              description: (
                <>
                  Pasa <code>empty</code> cuando no hay notificaciones: el EmptyState lo dice con palabras.
                </>
              ),
              preview: simple('Notificaciones, ejemplo de lista vacía con mensaje', { empty: true }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Lista vacía en blanco',
              description: 'No dejes la lista sin filas ni mensaje: no se sabe si falta cargar o no hay nada.',
              preview: simple('Notificaciones, ejemplo de lista vacía en blanco', {}, []),
            },
          ],
        },
      ],
    },
  ],
};
