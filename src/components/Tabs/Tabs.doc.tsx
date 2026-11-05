import type { ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { DropdownMenuItem } from '../DropdownMenu';
import type { IconName } from '../Icon/Icon.types';
import { Tab, TabList, TabOverflow, Tabs } from './Tabs';
import type { TabState, TabsContrast, TabsSize } from './Tabs.types';

/*
 * Contenido de la página de documentación de Tabs (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Tabs.types.ts`, `Tabs.variants.ts`, `Tabs.tsx`), luego `Tabs.docs.json`. Diferencias con Figma: Figma dibuja Hover
 * y Focus con el mismo relleno y el código agrega un anillo de 2 px en el foco con teclado; Figma no tiene panel ni
 * navegación con teclado; a Tab (Atom) le falta la variante Single Icon Yes, Size sm, State Inactive, Contrast On card.
 */

// Figma: 11793:14729 (component set Tab) y 11666:4226 (component set Tab (Atom))

/** Secciones de ejemplo: temas neutros de un espacio de trabajo. */
interface Seccion {
  value: string;
  label: string;
  icon: IconName;
  badge?: number;
}

const SECCIONES: Seccion[] = [
  { value: 'inicio', label: 'Inicio', icon: 'homepage', badge: 3 },
  { value: 'documentos', label: 'Documentos', icon: 'document', badge: 12 },
  { value: 'proyectos', label: 'Proyectos', icon: 'folder' },
];

const MAS_SECCIONES = ['Equipos', 'Calendario', 'Reportes', 'Perfil', 'Ajustes'];

interface TabsOpciones {
  size?: TabsSize;
  contrast?: TabsContrast;
  /** Pestaña seleccionada. */
  value?: string;
  /** Con ícono en cada pestaña. */
  icons?: boolean;
  /** Con contador donde el ejemplo lo trae. */
  badges?: boolean;
  /** Las pestañas se reparten el ancho. */
  fullWidth?: boolean;
  /** Con botón de desborde. */
  overflow?: boolean;
  /** Pestañas de la lista (por defecto, `SECCIONES`). */
  labels?: string[];
  /** Suma cinco pestañas más a la lista, para el ejemplo de lo que no se debe hacer. */
  all?: boolean;
  /** Sin la tarjeta de fondo de `on-card`: la muestra va sobre el marco del dispositivo. */
  bare?: boolean;
  /** Marca para que Anatomía encuentre cada lista. */
  slot?: string;
  label?: string;
}

/** Superficie de `on-card`: la tarjeta sobre la que va esa variante. */
const onSurface = (contrast: TabsContrast | undefined, node: ReactNode) =>
  contrast === 'on-card' ? (
    <div className="rounded-ds-radius-container-on-canva bg-ds-background-container-default-on-canva p-ds-space-general-2xl">{node}</div>
  ) : (
    node
  );

/** Lista de pestañas de ejemplo con su `Tabs`, sin paneles (las muestras son de solo lectura). */
const tabs = ({ size, contrast, value = 'inicio', icons = false, badges = false, fullWidth = false, overflow = false, labels, all = false, bare = false, slot, label = 'Secciones' }: TabsOpciones = {}) => {
  const items: Seccion[] = labels ? labels.map((l) => ({ value: l.toLowerCase(), label: l, icon: 'document' })) : SECCIONES;
  const extra: Seccion[] = all ? MAS_SECCIONES.map((l) => ({ value: l.toLowerCase(), label: l, icon: 'document' })) : [];
  return onSurface(
    bare ? undefined : contrast,
    <Tabs size={size} contrast={contrast} defaultValue={value} data-doc={slot}>
      <TabList
        aria-label={label}
        fullWidth={fullWidth}
        rootProps={{ 'data-slot': 'list' }}
        overflow={
          overflow ? (
            <TabOverflow label="Más secciones">
              {MAS_SECCIONES.slice(0, 3).map((s) => (
                <DropdownMenuItem key={s}>{s}</DropdownMenuItem>
              ))}
            </TabOverflow>
          ) : undefined
        }
      >
        {[...items, ...extra].map((s) => (
          <Tab key={s.value} value={s.value} icon={icons ? s.icon : undefined} badge={badges ? s.badge : undefined} badgeLabel="sin leer">
            {s.label}
          </Tab>
        ))}
      </TabList>
    </Tabs>,
  );
};

/** Pestañas de solo ícono, cada una con su `aria-label`. */
const soloIcono = () => (
  <Tabs defaultValue="buscar">
    <TabList aria-label="Vistas" rootProps={{ 'data-slot': 'list' }}>
      <Tab value="buscar" icon="search" aria-label="Buscar" badge={2} badgeLabel="nuevos" />
      <Tab value="calendario" icon="calendar" aria-label="Calendario" />
      <Tab value="ajustes" icon="setting" aria-label="Ajustes" />
    </TabList>
  </Tabs>
);

/**
 * Una pestaña con el aspecto de un estado, dentro de su propio `Tabs`: sin él, la lista tomaría el contexto de las
 * pestañas de la página y se pelearían por el orden de Tab. `defaultValue` apunta a una pestaña que no existe para
 * que ninguna quede seleccionada por la lista; el aspecto lo da `state`.
 */
const stateSample = (state: TabState, name: string) => (
  <Tabs defaultValue="ninguna">
    <TabList aria-label={`Pestaña ${name}`}>
      <Tab value={state} state={state} icon="document" badge={3} badgeLabel="sin leer">
        Documentos
      </Tab>
    </TabList>
  </Tabs>
);

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo. Sin relleno: la pestaña se funde con el contenedor y solo se ven su ícono, su texto y su Badge.',
    samples: [stateSample('default', 'en reposo')],
  },
  {
    label: 'Hover',
    tone: 'accent',
    description: (
      <>
        Al pasar el puntero sobre una pestaña sin seleccionar. Toma el relleno <code>background/tab/hover-on-canva</code>.
      </>
    ),
    samples: [stateSample('hover', 'con el puntero encima')],
  },
  {
    label: 'Focus',
    tone: 'accent',
    description: 'Al llegar con el teclado. Lleva el mismo relleno que Hover y un anillo de 2 px que Figma no dibuja.',
    samples: [stateSample('focus', 'con el foco')],
  },
  {
    label: 'Select',
    tone: 'accent',
    description: (
      <>
        La pestaña activa (<code>aria-selected</code>). Toma el relleno <code>background/tab/select-on-canva</code> y su panel es el visible.
      </>
    ),
    samples: [stateSample('select', 'seleccionada')],
  },
  {
    label: 'Inactive',
    tone: 'neutral',
    description: (
      <>
        Una pestaña con <code>disabled</code>. Se atenúa, su Badge pasa a neutral, no recibe el foco con las flechas y no se selecciona.
      </>
    ),
    samples: [stateSample('inactive', 'no disponible')],
  },
];

export const doc: ComponentDocContent = {
  name: 'Tabs',
  icon: 'task',
  classification: 'molecula',
  summary:
    'El Tabs es la molécula para cambiar entre secciones de una misma vista. Une pestañas con ícono, texto y contador (los átomos Icon y Badge) en un contenedor, y un panel por pestaña. Lo que no cabe pasa a un menú.',
  definition: [
    {
      title: 'Anatomía',
      description:
        'Un contenedor en píldora reúne las pestañas y, si hace falta, el botón de desborde. Cada pestaña une ícono, texto y contador. El panel de cada pestaña no se dibuja aquí: no tiene estilo propio y solo muestra su foco.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Pestañas con texto y desborde',
                  preview: tabs({ icons: true, badges: true, overflow: true }),
                  marks: [
                    { n: 1, selector: '[data-slot="list"]', side: 'left' },
                    { n: 2, selector: '[role="tab"]', index: 0, side: 'top' },
                    { n: 3, selector: '[data-figma-part="Icon-sizes"]', index: 1, side: 'top' },
                    { n: 4, selector: '[data-figma-part="Text-button"]', index: 2, side: 'bottom' },
                    { n: 5, selector: '[data-figma-part="Badge"]', index: 1, side: 'bottom' },
                    { n: 6, selector: '[data-figma-part="Dots-moreoptions"]', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-slot="list"]', side: 'left' },
                    { kind: 'padding', selector: '[role="tab"]', index: 1, side: 'left' },
                    { kind: 'gap', from: '[data-figma-part="Icon-sizes"]', fromIndex: 1, to: '[data-figma-part="Text-button"]', toIndex: 1 },
                  ],
                },
                {
                  label: 'Pestañas de solo ícono',
                  preview: soloIcono(),
                  marks: [
                    { n: 1, selector: '[data-slot="list"]', side: 'left' },
                    { n: 2, selector: '[role="tab"]', index: 1, side: 'top' },
                    { n: 3, selector: '[data-figma-part="Icon-sizes"]', index: 2, side: 'bottom' },
                    { n: 5, selector: '[data-figma-part="Badge"]', index: 0, side: 'top' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> píldora (<code>radius/general/full</code>) de 56 px de alto en Desktop y Tablet, y de 48 px en Mobile. Padding de 4 px (<code>space/general/md</code>), gap de 8 px (<code>space/general/lg</code>) y sombra <code>effect/shadow-on-canva-md</code>. Lleva un nombre accesible con <code>aria-label</code>.
                </>,
                <>
                  <strong>Pestaña:</strong> botón con rol <code>tab</code> de 48 px de alto en Desktop y Tablet, y de 40 px en Mobile. Padding de 12 px (8 px en Mobile, <code>space/button/xl</code>). La seleccionada lleva el relleno <code>background/tab/select-on-canva</code>.
                </>,
                <>
                  <strong>Ícono:</strong> 16 px de relleno, a la izquierda del texto y a 8 px de él (<code>icon</code>). Una pestaña de solo ícono exige <code>aria-label</code>.
                </>,
                <>
                  <strong>Texto:</strong> 14/18 px regular (<code>typography/size/md</code>) en una sola línea. Es el contenido de la pestaña (<code>children</code>).
                </>,
                <>
                  <strong>Badge:</strong> contador de tipo number, después del texto (<code>badge</code>). Su texto para lectores de pantalla, como &quot;sin leer&quot;, va en <code>badgeLabel</code>.
                </>,
                <>
                  <strong>Desborde:</strong> botón Dots <code>xs</code> de 32 px a la derecha, fuera del <code>tablist</code>. Abre un menú con las pestañas que no caben (<code>TabOverflow</code>).
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Tamaños md y sm',
                  preview: (
                    <div className="flex flex-col gap-ds-space-general-2xl">
                      {tabs({ size: 'md', slot: 'md', label: 'Secciones md' })}
                      {tabs({ size: 'sm', slot: 'sm', label: 'Secciones sm' })}
                    </div>
                  ),
                  marks: [
                    { n: 1, selector: '[data-doc="md"] [data-slot="list"]', side: 'left' },
                    { n: 2, selector: '[data-doc="sm"] [data-slot="list"]', side: 'left' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[data-doc="md"] [data-slot="list"]' },
                    { kind: 'height', selector: '[data-doc="sm"] [data-slot="list"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Size md:</strong> contenedor de 56 px y pestaña de 48 px en Desktop y Tablet; de 48 px y 40 px en Mobile (<code>dimention/tabs/container md</code> y <code>dimention/tabs/tabs md</code>).
                </>,
                <>
                  <strong>Size sm:</strong> contenedor de 40 px y pestaña de 32 px en los tres breakpoints (<code>dimention/tabs/container sm</code> y <code>dimention/tabs/tabs sm</code>).
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
          Tabs tiene 5 estados y todos son de la pestaña (<code>Tab</code>). Hover, Focus y Select se fuerzan con <code>state</code> solo para documentar: en uso salen del puntero, el teclado y la selección.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default y de lo que cambia al apuntar, seleccionar o deshabilitar. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Pestañas sobre el lienzo',
              preview: tabs({ icons: true, badges: true }),
              entries: [
                { part: 'Fondo del contenedor', color: 'background-tab-container-on-canva' },
                { part: 'Fondo de la pestaña seleccionada', color: 'background-tab-select-on-canva' },
                { part: 'Fondo (aparece en Hover y Focus)', color: 'background-tab-hover-on-canva' },
                { part: 'Texto', color: 'text-neutral-white', text: 'primitives-typography-size-md' },
                { part: 'Ícono', color: 'icon-general-default' },
                { part: 'Badge', color: 'background-acent-tertiary' },
                { part: 'Texto del Badge', color: 'text-neutral-white-unicolor' },
                { part: 'Anillo de foco (aparece en Focus)', color: 'border-field-active' },
              ],
            },
            {
              title: 'Pestañas sobre tarjeta',
              preview: tabs({ contrast: 'on-card', icons: true, badges: true }),
              entries: [
                { part: 'Fondo del contenedor', color: 'background-tab-container-on-card' },
                { part: 'Fondo de la pestaña seleccionada', color: 'background-tab-select-on-card' },
                { part: 'Fondo (aparece en Hover y Focus)', color: 'background-tab-hover-on-card' },
              ],
            },
            {
              title: 'Pestaña no disponible',
              preview: stateSample('inactive', 'no disponible'),
              entries: [
                { part: 'Fondo', color: 'background-container-disabled-on-canva' },
                { part: 'Texto', color: 'text-neutral-disabled-on-card' },
                { part: 'Ícono', color: 'icon-general-disabled-negative' },
                { part: 'Fondo del Badge', color: 'background-general-gray-fifth' },
                { part: 'Texto del Badge', color: 'text-neutral-white' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Tabs en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Tab en la librería de Assets. Es el contenedor con las pestañas y sus propiedades son Options, Size y Contrast. La pestaña suelta es Tab (Atom).
            </>,
            <>
              <strong>Options:</strong> two a six es la cantidad de pestañas. more options agrega el botón Dots al final. En código, cada pestaña es un <code>Tab</code> dentro de <code>TabList</code> y el botón es <code>TabOverflow</code> en <code>overflow</code>.
            </>,
            <>
              <strong>Size y Contrast:</strong> Md y Sm son <code>size=&quot;md&quot;</code> y <code>size=&quot;sm&quot;</code>. On canva y On card son <code>contrast=&quot;on-canva&quot;</code> y <code>contrast=&quot;on-card&quot;</code>.
            </>,
            <>
              <strong>Tab (Atom):</strong> Text es <code>children</code>; Icon y Badge son <code>icon</code> y <code>badge</code>. Single Icon Yes es una pestaña sin texto, con <code>aria-label</code>. State Default, Hover, Focus, Select e Inactive se fuerzan con <code>state</code>, y en uso salen del puntero, el teclado, la selección y <code>disabled</code>.
            </>,
            <>
              <strong>Lo que difiere de Figma:</strong> Figma dibuja Hover y Focus iguales, y el código agrega un anillo de 2 px en el foco. Figma no dibuja los paneles ni el teclado (<code>activationMode</code>). A Tab (Atom) le falta Single Icon Yes, Size sm, State Inactive y Contrast On card, que el código sí admite.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Tabs es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Secciones de una misma vista:</strong> cada pestaña muestra su panel sin salir de la página. Solo es visible el panel de la pestaña seleccionada.
            </>,
            <>
              <strong>Contenido del mismo nivel:</strong> las secciones tienen el mismo peso y se consultan una a la vez, como Inicio, Documentos y Proyectos.
            </>,
            <>
              <strong>Cantidades a la vista:</strong> el Badge de cada pestaña cuenta lo que hay dentro sin abrirla (<code>badge</code>).
            </>,
            <>
              <strong>Más secciones que espacio:</strong> pasa el resto a un menú con <code>TabOverflow</code>. Sin desborde, la lista se desplaza dentro de la píldora.
            </>,
            <>
              <strong>Panel costoso de mostrar:</strong> con <code>activationMode=&quot;manual&quot;</code> las flechas solo mueven el foco y se selecciona con Enter o Espacio.
            </>,
          ],
          avoid: [
            <>
              <strong>Navegar entre páginas:</strong> las pestañas cambian el panel de una vista, no la ruta. (Alternativa: <code>NavBar</code>, <code>SideBar</code> o <code>Header</code>).
            </>,
            <>
              <strong>Filtrar con casillas:</strong> cada pestaña es una sola sección, no una categoría con opciones. (Alternativa: <code>FilterTabs</code>).
            </>,
            <>
              <strong>Pasos en orden:</strong> las pestañas se pueden abrir en cualquier orden. (Alternativa: <code>Stepper</code>).
            </>,
            <>
              <strong>Contenido que se lee de corrido:</strong> con las secciones en pestañas, la persona no ve el conjunto. (Alternativa: <code>Accordion</code>).
            </>,
          ],
        },
      ],
    },
    {
      title: 'Aplicaciones de breakpoints',
      description: 'Cada vista se dibuja con los valores responsive de su breakpoint. Tablet comparte los tokens de Desktop.',
      blocks: [
        {
          type: 'breakpoints',
          desktop: {
            columns: [
              {
                title: 'Size md',
                bullets: [
                  <>
                    <strong>Medidas:</strong> contenedor de 56 px de alto y pestañas de 48 px, con padding de 12 px (<code>space/button/xl</code>).
                  </>,
                  <>
                    <strong>Texto:</strong> 14 px regular en una línea. El ancho de cada pestaña depende de su texto.
                  </>,
                ],
                preview: tabs({ contrast: 'on-card', bare: true, icons: true, badges: true }),
              },
              {
                title: 'Size sm',
                bullets: [
                  <>
                    <strong>Medidas:</strong> contenedor de 40 px de alto y pestañas de 32 px, con el mismo padding de 12 px.
                  </>,
                  <>
                    <strong>Texto:</strong> igual que md: 14 px regular en una línea.
                  </>,
                ],
                preview: tabs({ size: 'sm', contrast: 'on-card', bare: true, icons: true, badges: true }),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Medidas:</strong> md baja a 48 px de contenedor y 40 px de pestaña. El padding de la pestaña baja a 8 px. sm conserva sus 40 px y 32 px, y también baja el padding.
              </>,
              <>
                <strong>Sin cambios:</strong> el padding de 4 px del contenedor, el gap de 8 px, el ícono de 16 px y el texto de 14 px.
              </>,
              <>
                <strong>Ancho:</strong> con <code>fullWidth</code> las pestañas se reparten todo el ancho, como en el marco mobile de Figma. Si no caben, el texto de cada pestaña se corta con puntos suspensivos. Sin <code>fullWidth</code>, la pestaña mide lo que su texto y la lista se desplaza dentro de la píldora, sin barra visible.
              </>,
            ],
            preview: <div className="w-72 max-w-full">{tabs({ fullWidth: true, contrast: 'on-card', bare: true, labels: ['Inicio', 'Archivos', 'Equipo'] })}</div>,
          },
          tablet: {
            bullets: [
              <>
                <strong>Medidas:</strong> igual que Desktop: contenedor de 56 px, pestañas de 48 px y padding de 12 px en md; 40 px y 32 px en sm.
              </>,
              <>
                <strong>Sin cambios:</strong> el padding de 4 px del contenedor, el gap de 8 px, el ícono de 16 px y el texto de 14 px.
              </>,
              <>
                <strong>Ancho:</strong> el contenedor ocupa el ancho de sus pestañas, o todo el disponible con <code>fullWidth</code>.
              </>,
            ],
            preview: tabs({ contrast: 'on-card', bare: true, badges: true }),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de longitud de las etiquetas, desborde y contadores.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Etiquetas breves',
              description: 'Usa una o dos palabras por pestaña.',
              preview: tabs({ contrast: 'on-card', bare: true, labels: ['Resumen', 'Archivos', 'Equipo'] }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Etiquetas extensas',
              description: 'No escribas frases: la pestaña se ensancha y la lista se desplaza.',
              preview: tabs({ contrast: 'on-card', bare: true, labels: ['Resumen general del mes', 'Archivos compartidos', 'Equipo de trabajo'] }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Con desborde',
              description: (
                <>
                  Deja tres o cuatro pestañas y pasa el resto a <code>TabOverflow</code>.
                </>
              ),
              preview: tabs({ contrast: 'on-card', bare: true, labels: ['Inicio', 'Documentos', 'Proyectos'], overflow: true }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Sin desborde',
              description: 'No juntes ocho pestañas: la lista se desplaza dentro de la píldora.',
              preview: tabs({ contrast: 'on-card', bare: true, labels: ['Inicio', 'Documentos', 'Proyectos'], all: true }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Contador selectivo',
              description: 'Pon contador solo donde el número ayuda a decidir.',
              preview: (
                <Tabs defaultValue="inicio" contrast="on-card">
                  <TabList aria-label="Secciones con un contador">
                    <Tab value="inicio">Inicio</Tab>
                    <Tab value="documentos" badge={12} badgeLabel="sin leer">
                      Documentos
                    </Tab>
                    <Tab value="proyectos">Proyectos</Tab>
                  </TabList>
                </Tabs>
              ),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Contador en todas',
              description: 'No pongas contador en cada pestaña: ninguno destaca.',
              preview: (
                <Tabs defaultValue="inicio" contrast="on-card">
                  <TabList aria-label="Secciones con contador">
                    <Tab value="inicio" badge={3} badgeLabel="sin leer">
                      Inicio
                    </Tab>
                    <Tab value="documentos" badge={12} badgeLabel="sin leer">
                      Documentos
                    </Tab>
                    <Tab value="proyectos" badge={5} badgeLabel="activos">
                      Proyectos
                    </Tab>
                  </TabList>
                </Tabs>
              ),
            },
          ],
        },
      ],
    },
  ],
};
