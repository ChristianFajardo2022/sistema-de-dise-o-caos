import type { ComponentProps } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { FilterTabs } from './FilterTabs';
import type { FilterTabsTab } from './FilterTabs.types';

/*
 * Contenido de la página de documentación de FilterTabs (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`FilterTabs.types.ts`, `FilterTabs.variants.ts`, `FilterTabs.tsx`), luego `FilterTabs.docs.json`. Diferencias con
 * Figma: Figma dibuja el Badge de cada pestaña siempre y el código solo lo muestra con opciones marcadas (`showCounts`);
 * Figma no dibuja el anillo de foco y el código agrega uno de 2 px; Figma no tiene pestañas ni opciones deshabilitadas.
 */

// Figma: 14033:24874 (component set Filter tabs)

type FilterTabsProps = Partial<ComponentProps<typeof FilterTabs>>;

/** Pestañas de ejemplo: categorías neutras de un listado de documentos. */
const FILTROS: FilterTabsTab[] = [
  {
    value: 'fecha',
    label: 'Fecha',
    icon: 'calendar',
    options: [
      { value: 'hoy', label: 'Hoy' },
      { value: 'semana', label: 'Esta semana' },
      { value: 'mes', label: 'Este mes' },
    ],
  },
  {
    value: 'estado',
    label: 'Estado',
    icon: 'tag',
    options: [
      { value: 'pendiente', label: 'Pendiente' },
      { value: 'aprobado', label: 'Aprobado' },
      { value: 'rechazado', label: 'Rechazado' },
    ],
  },
  {
    value: 'tipo',
    label: 'Tipo',
    icon: 'document',
    options: [
      { value: 'informe', label: 'Informe' },
      { value: 'acta', label: 'Acta' },
      { value: 'presentacion', label: 'Presentación' },
    ],
  },
];

/** Lista con una opción deshabilitada. */
const FILTROS_OPCION_NO_DISPONIBLE: FilterTabsTab[] = [
  {
    ...FILTROS[0],
    options: [FILTROS[0].options[0], { ...FILTROS[0].options[1], disabled: true }, FILTROS[0].options[2]],
  },
  FILTROS[1],
  FILTROS[2],
];

/** Lista con la última pestaña deshabilitada. */
const FILTROS_PESTANA_NO_DISPONIBLE: FilterTabsTab[] = [FILTROS[0], FILTROS[1], { ...FILTROS[2], disabled: true }];

/** Opciones con frases largas, para el ejemplo de lo que no se debe hacer. */
const FILTROS_LARGOS: FilterTabsTab[] = [
  {
    ...FILTROS[1],
    options: [
      { value: 'pendiente', label: 'Documentos pendientes de revisión por el equipo' },
      { value: 'aprobado', label: 'Documentos aprobados durante el último mes' },
    ],
  },
];

/** Seis pestañas, para el ejemplo de lo que no se debe hacer. */
const FILTROS_MUCHOS: FilterTabsTab[] = [
  ...FILTROS,
  { value: 'autor', label: 'Autor', icon: 'calendar', options: [{ value: 'ana', label: 'Ana Pérez' }] },
  { value: 'area', label: 'Área', icon: 'tag', options: [{ value: 'diseno', label: 'Diseño' }] },
  { value: 'etiqueta', label: 'Etiqueta', icon: 'document', options: [{ value: 'interno', label: 'Interno' }] },
];

/**
 * Filtro de ejemplo con las pestañas de `FILTROS` salvo que se pasen otras. Sin ícono, porque con Badge el texto no cabe
 * en 288 px; `icons` los deja y ensancha el filtro.
 */
const filtros = (props: FilterTabsProps = {}, icons = false) => {
  const tabs = (props.tabs ?? FILTROS).map((t) => (icons ? t : { ...t, icon: undefined }));
  return <FilterTabs className={icons ? 'w-96 max-w-full' : 'w-72 max-w-full'} aria-label="Categorías" {...props} tabs={tabs} />;
};

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo. Sin opciones marcadas: las pestañas no muestran conteo y las casillas van vacías.',
    samples: [filtros()],
  },
  {
    label: 'Con selección',
    tone: 'accent',
    description: 'Hay opciones marcadas. La pestaña muestra un Badge con cuántas lleva y la casilla se rellena.',
    samples: [filtros({ defaultValue: ['hoy', 'semana', 'informe'] })],
  },
  {
    label: 'Opción no disponible',
    tone: 'neutral',
    description: (
      <>
        Una opción con <code>disabled</code>. La casilla y su texto se atenúan y no responden.
      </>
    ),
    samples: [filtros({ tabs: FILTROS_OPCION_NO_DISPONIBLE, defaultValue: ['hoy'] })],
  },
  {
    label: 'Pestaña no disponible',
    tone: 'neutral',
    description: (
      <>
        Una pestaña con <code>disabled</code>. Se atenúa y las flechas la saltan.
      </>
    ),
    samples: [filtros({ tabs: FILTROS_PESTANA_NO_DISPONIBLE, defaultTab: 'estado' })],
  },
];

export const doc: ComponentDocContent = {
  name: 'FilterTabs',
  icon: 'filter',
  classification: 'composicion',
  summary:
    'El FilterTabs es la composición para filtrar por categorías. Une pestañas con una lista de casillas por pestaña y guarda la selección de todas en una sola lista. Cada pestaña muestra con un Badge cuántas de sus opciones están marcadas.',
  definition: [
    {
      title: 'Anatomía',
      description:
        'Una columna apila el contenedor de pestañas y la lista de casillas de la pestaña seleccionada. Las pestañas son Tabs y cada fila es un Checkbox.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Pestañas y lista de casillas',
                  preview: filtros({ defaultValue: ['hoy', 'aprobado'] }, true),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Tab"]', side: 'right' },
                    { n: 2, selector: '[role="tab"]', index: 0, side: 'top' },
                    { n: 3, selector: '[data-figma-part="Icon-sizes"]', index: 1, side: 'top' },
                    { n: 4, selector: '[data-figma-part="Badge"]', index: 1, side: 'bottom' },
                    { n: 5, selector: '[data-figma-part="List"]', index: 0, side: 'right' },
                    { n: 6, selector: '[data-figma-part="List"] label > span[aria-hidden="true"]', index: 0, side: 'left' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Tab"]', side: 'top' },
                    { kind: 'height', selector: '[data-figma-part="Tab"]' },
                    { kind: 'gap', from: '[data-figma-part="Tab"]', to: '[data-figma-part="List"]', axis: 'y' },
                    { kind: 'gap', from: '[data-figma-part="List"] label', fromIndex: 0, to: '[data-figma-part="List"] label', toIndex: 1, axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor de pestañas:</strong> píldora a todo el ancho (<code>radius/general/full</code>) de 56 px de alto en Desktop y Tablet, y de 48 px en Mobile. Padding de 4 px (<code>space/general/md</code>). Lleva <code>aria-label</code> (por defecto &quot;Categorías&quot;).
                </>,
                <>
                  <strong>Pestaña:</strong> 48 px de alto en Desktop y Tablet, y 40 px en Mobile, con padding de 12 px (8 px en Mobile, <code>space/button/xl</code>). Todas miden lo mismo. La seleccionada lleva el relleno <code>background/tab/select-on-canva</code>.
                </>,
                <>
                  <strong>Ícono:</strong> 16 px, a la izquierda del texto y a 8 px de él (<code>icon</code> en cada pestaña). Sin <code>icon</code>, la pestaña va sin ícono.
                </>,
                <>
                  <strong>Badge:</strong> contador de 16 px de alto con las opciones marcadas de esa pestaña. Aparece cuando hay alguna y <code>showCounts</code> está activo. El lector de pantalla lo dice como &quot;2 seleccionadas&quot;.
                </>,
                <>
                  <strong>Lista:</strong> columna con 16 px entre filas (<code>space/general/2xl</code>), a 16 px del contenedor de pestañas. Es un grupo con el nombre de la pestaña.
                </>,
                <>
                  <strong>Casilla:</strong> Checkbox con texto, <code>positive</code> por defecto. Control de 16 px, gap de 8 px y texto de 16/20 px (<code>typography/field/size/md</code>). Cada opción de <code>options</code> es una fila.
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
          FilterTabs tiene 4 estados. No tiene prop <code>state</code>: Hover, Focus y Press de las pestañas y de las casillas son los de Tabs y Checkbox, y salen del puntero y del teclado.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default y de lo que cambia al marcar o deshabilitar. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Pestañas sobre el lienzo',
              preview: filtros({ defaultValue: ['aprobado'], defaultTab: 'estado' }, true),
              entries: [
                { part: 'Fondo del contenedor', color: 'background-tab-container-on-canva' },
                { part: 'Fondo de la pestaña seleccionada', color: 'background-tab-select-on-canva' },
                { part: 'Fondo (aparece en Hover y Focus)', color: 'background-tab-hover-on-canva' },
                { part: 'Texto', color: 'text-neutral-white', text: 'primitives-typography-size-md' },
                { part: 'Ícono', color: 'icon-general-default' },
                { part: 'Badge', color: 'background-acent-tertiary' },
                { part: 'Texto del Badge', color: 'text-neutral-white-unicolor' },
                { part: 'Anillo de foco (aparece en Focus)', color: 'border-field-active' },
                { part: 'Fondo (pestaña no disponible)', color: 'background-container-disabled-on-canva' },
                { part: 'Texto (pestaña no disponible)', color: 'text-neutral-disabled-on-card' },
                { part: 'Ícono (pestaña no disponible)', color: 'icon-general-disabled-negative' },
              ],
            },
            {
              title: 'Pestañas sobre tarjeta',
              preview: filtros({ contrast: 'on-card', defaultValue: ['aprobado'], defaultTab: 'estado' }),
              entries: [
                { part: 'Fondo del contenedor', color: 'background-tab-container-on-card' },
                { part: 'Fondo de la pestaña seleccionada', color: 'background-tab-select-on-card' },
                { part: 'Fondo (aparece en Hover y Focus)', color: 'background-tab-hover-on-card' },
              ],
            },
            {
              title: 'Casillas positive',
              preview: filtros({ tabs: FILTROS_OPCION_NO_DISPONIBLE, defaultValue: ['hoy'] }),
              entries: [
                { part: 'Trazo', color: 'background-field-surface-tertiary' },
                { part: 'Relleno (marcada)', color: 'background-field-active-high-contrast' },
                { part: 'Marca de verificación', color: 'icon-general-black' },
                { part: 'Texto', color: 'text-neutral-white', text: 'typography-field-size-md' },
                { part: 'Anillo de foco (aparece en Focus)', color: 'border-field-active' },
                { part: 'Trazo (opción no disponible)', color: 'background-field-disabled' },
                { part: 'Texto (opción no disponible)', color: 'text-neutral-disabled-on-canva' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente FilterTabs en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Filter tabs en la librería de Assets. Sus propiedades son Type y el slot List.
            </>,
            <>
              <strong>Type:</strong> 1, 2 y 3 son la pestaña seleccionada: la primera, la segunda o la tercera. En código es <code>tab</code> o <code>defaultTab</code>, con el <code>value</code> de la pestaña.
            </>,
            <>
              <strong>List:</strong> el slot recibe filas Selection (Checkbox con texto). En código son las <code>options</code> de cada pestaña, y cada pestaña tiene su propia lista.
            </>,
            <>
              <strong>Lo que difiere de Figma:</strong> Figma dibuja tres pestañas con su Badge siempre visible. El código acepta cualquier cantidad de pestañas y muestra el Badge solo con opciones marcadas. Figma no dibuja el anillo de foco ni las pestañas y opciones no disponibles, y el código los agrega.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el FilterTabs es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Filtros en varias categorías:</strong> cada pestaña agrupa las opciones de una categoría, como fecha, estado o tipo de documento. Se marcan varias opciones de una o de varias pestañas.
            </>,
            <>
              <strong>Poco espacio:</strong> en un panel lateral o en móvil, solo se ve la lista de una pestaña a la vez y las pestañas se reparten el ancho.
            </>,
            <>
              <strong>Ver lo marcado sin abrir cada pestaña:</strong> el Badge de cada pestaña cuenta sus opciones marcadas (<code>showCounts</code>).
            </>,
            <>
              <strong>Una sola selección:</strong> <code>onValueChange</code> devuelve una lista con las opciones de todas las pestañas, en el orden de las pestañas. Con <code>name</code>, las casillas viajan en un formulario.
            </>,
          ],
          avoid: [
            <>
              <strong>Una sola categoría:</strong> con una pestaña sobran las pestañas. (Alternativa: <code>Checkbox</code>).
            </>,
            <>
              <strong>Elegir una sola opción:</strong> las casillas permiten varias a la vez. (Alternativa: <code>Radio</code>).
            </>,
            <>
              <strong>Más de cuatro categorías:</strong> las pestañas no caben con su texto. (Alternativa: <code>FilterPanel</code>).
            </>,
            <>
              <strong>Calificación por estrellas:</strong> una casilla por valor no refleja una escala. (Alternativa: <code>RatingFilter</code>).
            </>,
          ],
        },
      ],
    },
    {
      title: 'Aplicaciones de breakpoints',
      description: 'Cada vista se dibuja con los valores responsive de su breakpoint. Tablet usa los mismos tokens que Desktop.',
      blocks: [
        {
          type: 'breakpoints',
          desktop: {
            columns: [
              {
                title: 'Pestañas',
                bullets: [
                  <>
                    <strong>Medidas:</strong> contenedor de 56 px de alto y pestañas de 48 px, con padding de 12 px (<code>space/button/xl</code>).
                  </>,
                  <>
                    <strong>Texto:</strong> 14 px regular en una sola línea, con puntos suspensivos si no cabe.
                  </>,
                ],
                preview: filtros({ defaultValue: ['hoy'] }),
              },
              {
                title: 'Lista',
                bullets: [
                  <>
                    <strong>Medidas:</strong> 16 px entre filas y 16 px hasta las pestañas.
                  </>,
                  <>
                    <strong>Texto:</strong> 16/20 px regular, que se parte en varias líneas si no cabe.
                  </>,
                ],
                preview: filtros({ tabs: FILTROS_LARGOS }),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Medidas:</strong> el contenedor baja a 48 px de alto y las pestañas a 40 px. El padding de la pestaña baja a 8 px.
              </>,
              <>
                <strong>Sin cambios:</strong> el padding de 4 px del contenedor, el gap de 8 px, el texto de la pestaña y la lista, y los 16 px entre filas.
              </>,
              <>
                <strong>Ancho:</strong> ocupa el ancho disponible y las pestañas se reparten por igual.
              </>,
            ],
            preview: filtros({ defaultValue: ['hoy'] }),
          },
          tablet: {
            bullets: [
              <>
                <strong>Medidas:</strong> igual que Desktop: contenedor de 56 px, pestañas de 48 px y padding de 12 px.
              </>,
              <>
                <strong>Sin cambios:</strong> el padding de 4 px del contenedor, el gap de 8 px, el texto de la pestaña y la lista, y los 16 px entre filas.
              </>,
              <>
                <strong>Ancho:</strong> ocupa el ancho disponible y las pestañas se reparten por igual.
              </>,
            ],
            preview: filtros({ defaultValue: ['hoy'] }),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de conteos, longitud de las opciones y cantidad de pestañas.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Conteos visibles',
              description: 'Deja el Badge para saber qué pestañas tienen opciones marcadas.',
              preview: filtros({ defaultValue: ['hoy', 'aprobado'], defaultTab: 'tipo' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Conteos ocultos',
              description: (
                <>
                  No pongas <code>showCounts=&#123;false&#125;</code> con varias pestañas: lo marcado queda fuera de vista.
                </>
              ),
              preview: filtros({ defaultValue: ['hoy', 'aprobado'], defaultTab: 'tipo', showCounts: false }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Opciones breves',
              description: 'Escribe una o dos palabras en cada opción.',
              preview: filtros({ defaultTab: 'estado' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Opciones extensas',
              description: 'No escribas frases completas: la fila ocupa varias líneas.',
              preview: filtros({ tabs: FILTROS_LARGOS }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Tres pestañas',
              description: 'Usa de dos a cuatro pestañas para que quepan con su texto.',
              preview: filtros(),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Seis pestañas',
              description: 'No pases de cuatro pestañas: el texto se corta o la lista se desplaza.',
              preview: filtros({ tabs: FILTROS_MUCHOS }),
            },
          ],
        },
      ],
    },
  ],
};
