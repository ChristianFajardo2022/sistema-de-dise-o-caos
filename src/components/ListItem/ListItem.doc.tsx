import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Avatar } from '../Avatar';
import { DropdownMenuItem } from '../DropdownMenu';
import { ListItem } from './ListItem';

/*
 * Contenido de la página de documentación de List item (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`ListItem.tsx`, `ListItem.types.ts`, `ListItem.variants.ts`), luego `ListItem.docs.json`. Medidas: fila Complex de 72 con Avatar sm de 40 (70 con el avatar de 32 de Figma)
 * (padding 8 a los lados y 16 arriba y abajo, hueco de 16), fila Simple de 56 (padding 12 arriba y abajo, hueco de 8),
 * botones de ícono de 32 con ícono de 20 y hueco de 4 entre acciones. El marco Mobile de Figma se resuelve con una
 * container query a 18rem de ancho, no con el ancho de la pantalla.
 * Diferencias con Figma: la línea de la categoría mide 0.5 en Figma y el código usa border/general/md (1 px); la acción
 * navegar (`onNavigate`, `href`) no existe en el set de Figma.
 */

// Figma: 12174:13893 (component set List (Atom)) y 12256:12862 (nodo List, ejemplo en lista)

type ListItemProps = Partial<ComponentProps<typeof ListItem>>;

const noop = () => {};

const folder = <Avatar variant="icon" size="sm" label="Carpeta" />;

const menu = [
  <DropdownMenuItem key="dup" type="icon" icon="document-copy">
    Duplicar
  </DropdownMenuItem>,
  <DropdownMenuItem key="mov" type="icon" icon="forward">
    Mover
  </DropdownMenuItem>,
];

/** Lista con una o varias filas. Un `li` suelto no es válido: siempre va dentro de un `ul`. */
const list = (...items: ReactNode[]) => (
  <ul role="list" className="m-0 w-full list-none p-0">
    {items.map((item, i) => (
      <Fragment key={i}>{item}</Fragment>
    ))}
  </ul>
);

/** Lista con ancho mínimo de escritorio (30rem): en los lienzos que ajustan al contenido evita que la fila caiga al diseño angosto. */
const wide = (...items: ReactNode[]) => <div className="w-full min-w-[30rem]">{list(...items)}</div>;

/** Fila Complex de ejemplo, con texto realista y sin el nombre del componente. */
const item = (props: ListItemProps = {}) => (
  <ListItem title="Informe trimestral" category="Documento" description="Actualizado hoy" leading={folder} {...props} />
);

/** Fila Simple de ejemplo. */
const simple = (props: ListItemProps = {}) => (
  <ListItem variant="simple" title="Informe trimestral" description="Actualizado hoy" {...props} />
);

/** Fila completa: casilla, avatar, texto y las tres acciones más el menú. */
const full = (props: ListItemProps = {}) =>
  item({ selectable: true, onView: noop, onEdit: noop, onDelete: noop, menu, ...props });

/** Fila de las columnas angostas (estados, breakpoints): sin el botón ver, para que las acciones quepan. */
const compact = (props: ListItemProps = {}) => item({ selectable: true, onEdit: noop, onDelete: noop, menu, ...props });

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo. Título, categoría y descripción en sus colores, y las acciones activas.',
    samples: [list(compact())],
  },
  {
    label: 'Selected',
    tone: 'accent',
    description: (
      <>
        Con la casilla marcada. Sale de <code>selected</code> o <code>defaultSelected</code>; el aspecto de la fila no cambia, solo el de la casilla.
      </>
    ),
    samples: [list(compact({ defaultSelected: true }))],
  },
  {
    label: 'Disabled',
    tone: 'neutral',
    description: (
      <>
        Con <code>disabled</code> los textos se atenúan y la casilla, los botones y el menú quedan inactivos. No se enfocan ni se activan.
      </>
    ),
    samples: [list(compact({ disabled: true }))],
  },
];

export const doc: ComponentDocContent = {
  name: 'List item',
  icon: 'row-vertical',
  classification: 'molecula',
  summary:
    'El List item es la molécula para mostrar un elemento dentro de una lista. Une casilla, avatar, título, categoría, descripción y acciones en una fila, y puede abrir otra vista al activarla. Tiene dos tipos: Complex y Simple.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una fila con trazo superior que une, de izquierda a derecha, casilla, avatar, texto y acciones.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Complex',
                  preview: wide(full({ selectable: false })),
                  marks: [
                    { n: 1, selector: 'li', side: 'top' },
                    { n: 2, selector: '[data-figma-part="Avatar"]', side: 'left' },
                    { n: 3, selector: '[data-figma-part="Filename"]', side: 'top' },
                    { n: 4, selector: '[data-figma-part="Item Category"]', side: 'top' },
                    { n: 5, selector: '[data-figma-part="Container"] > [data-figma-part="Status"]', side: 'bottom' },
                    { n: 6, selector: '[data-figma-part="Actions Block"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: 'li', side: 'top' },
                    { kind: 'gap', from: '[data-figma-part="Avatar"]', to: '[data-figma-part="Container"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Fila:</strong> alto de 72 con un Avatar sm de 40 px (Figma dibuja 70 con un avatar de 32), padding de 8 a los lados (<code>space/general/lg</code>) y de 16 arriba y abajo (<code>space/general/2xl</code>). Un trazo interior de 1.5 px cierra el borde superior. Los elementos van separados 16 px.
                </>,
                <>
                  <strong>Avatar:</strong> slot <code>leading</code>, con un <code>Avatar</code>, un <code>AvatarGroup</code> o un ícono. Es opcional y solo existe en Complex.
                </>,
                <>
                  <strong>Título:</strong> obligatorio (<code>title</code>) y nombre accesible de la casilla y de los botones. Prospero semibold de 12/16. Si no cabe, se corta con puntos suspensivos.
                </>,
                <>
                  <strong>Categoría:</strong> opcional (<code>category</code>), en el color de acento y 14/18, a 8 px del título. Una línea vertical de 1 px de ancho y 10 de alto la separa.
                </>,
                <>
                  <strong>Descripción:</strong> opcional (<code>description</code>), debajo del título a 2 px, en 14/18.
                </>,
                <>
                  <strong>Acciones:</strong> botones de ícono de 32 px (<code>onView</code>, <code>onEdit</code>, <code>onDelete</code>) y el menú de tres puntos (<code>menu</code>), separados 4 px. Cada una aparece solo si se pasa.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Simple',
                  preview: wide(simple({ selectable: true, onEdit: noop, onDelete: noop })),
                  marks: [
                    { n: 1, selector: 'li', side: 'top' },
                    { n: 2, selector: '[data-figma-part="Selection"]', side: 'left' },
                    { n: 3, selector: '[data-figma-part="Filename"]', side: 'top' },
                    { n: 4, selector: '[data-figma-part="Status"]', side: 'bottom' },
                    { n: 5, selector: '[data-figma-part="Actions Block"]', side: 'bottom' },
                  ],
                  dimensions: [{ kind: 'gap', from: '[data-figma-part="Selection"]', to: '[data-figma-part="Filename"]' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Fila:</strong> alto de 56, padding de 8 a los lados y de 12 arriba y abajo (<code>space/general/xl</code>). Los elementos van separados 8 px y la línea de contenido mide 32 de alto.
                </>,
                <>
                  <strong>Casilla:</strong> opcional (<code>selectable</code>), un Checkbox de 16 px nombrado con el título.
                </>,
                <>
                  <strong>Título:</strong> 100 px de ancho fijo, Prospero semibold de 12/16. Si no cabe, se corta con puntos suspensivos.
                </>,
                <>
                  <strong>Descripción:</strong> ocupa el ancho libre, en la misma línea del título y en 14/18. No lleva avatar ni categoría.
                </>,
                <>
                  <strong>Acciones:</strong> los mismos botones y menú de Complex, al final de la fila.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Navegar',
                  preview: wide(item({ title: 'Documentos', category: undefined, description: undefined, onNavigate: noop })),
                  marks: [
                    { n: 1, selector: 'li', side: 'top' },
                    { n: 2, selector: '[data-list-control]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Actions Block"]', side: 'bottom' },
                  ],
                  dimensions: [{ kind: 'height', selector: '[data-figma-part="Actions Block"]' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Fila:</strong> con <code>onNavigate</code> o <code>href</code> toda la fila es el área de clic y cambia de fondo al pasar el puntero.
                </>,
                <>
                  <strong>Título:</strong> pasa a ser un <code>button</code> (o un <code>a</code> con <code>href</code>) estirado sobre la fila. Con el teclado, el foco se dibuja alrededor de toda la fila.
                </>,
                <>
                  <strong>Flecha:</strong> <code>chevron-right</code> de 20 px en un hueco de 32, decorativa. No la leen los lectores de pantalla.
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
          List item tiene 3 estados. Default y Disabled son los del set de Figma; Selected sale de la casilla. Con <code>onNavigate</code> o <code>href</code>, la fila además responde al puntero y al foco con CSS propio, que no se fuerza con <code>state</code>.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default, de Disabled y de la fila navegable. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Complex',
              preview: wide(full()),
              entries: [
                { part: 'Trazo superior', color: 'border-general-default-on-canva' },
                { part: 'Título', color: 'text-neutral-heading', text: 'typography-heading-size-xs' },
                { part: 'Categoría', color: 'text-acent-firts', text: 'typography-body-size-md' },
                { part: 'Línea de la categoría', color: 'border-general-gray-secondary' },
                { part: 'Descripción', color: 'text-neutral-gray', text: 'typography-body-size-md' },
                { part: 'Ícono eliminar', color: 'icon-button-tertiary-delete' },
              ],
            },
            {
              title: 'Simple',
              preview: wide(simple({ selectable: true, onEdit: noop, onDelete: noop })),
              entries: [
                { part: 'Trazo superior', color: 'border-general-default-on-canva' },
                { part: 'Título', color: 'text-neutral-heading', text: 'typography-heading-size-xs' },
                { part: 'Descripción', color: 'text-neutral-body', text: 'typography-body-size-md' },
              ],
            },
            {
              title: 'Disabled',
              preview: wide(full({ disabled: true })),
              entries: [
                { part: 'Título y descripción (Complex)', color: 'text-neutral-disabled-on-canva' },
                { part: 'Categoría (Complex)', color: 'text-neutral-disabled-on-card' },
                { part: 'Título y descripción (Simple)', color: 'text-neutral-disabled-on-card' },
              ],
            },
            {
              title: 'Navegar',
              preview: wide(item({ title: 'Documentos', category: undefined, description: undefined, onNavigate: noop })),
              entries: [
                { part: 'Fondo (aparece en Hover)', color: 'background-container-hover-on-canva' },
                { part: 'Contorno (aparece con foco de teclado)', color: 'border-field-active' },
                { part: 'Flecha', color: 'icon-button-tertiary-default' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente List item en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como List (Atom) en la librería de Assets. Sus propiedades son Type y State, y varios interruptores: Select, Avatar single, Avatar group, Category, Description, Group icon button e Icon.
            </>,
            <>
              <strong>Type:</strong> Simple y Complex son <code>variant=&quot;simple&quot;</code> y <code>variant=&quot;complex&quot;</code>. State Default es el valor por defecto y Disabled es <code>disabled</code>.
            </>,
            <>
              <strong>Interruptores:</strong> en código no hay un booleano por pieza. Select es <code>selectable</code>; Avatar single y Avatar group son el slot <code>leading</code>; Category y Description son <code>category</code> y <code>description</code>; Group icon button e Icon aparecen al pasar <code>onView</code>, <code>onEdit</code>, <code>onDelete</code> o <code>menu</code>.
            </>,
            <>
              <strong>Lista:</strong> el set List es un espacio para filas. En código, cada fila es un <code>li</code> dentro de un <code>ul</code> con <code>role=&quot;list&quot;</code>.
            </>,
            <>
              <strong>Diferencias:</strong> Figma no tiene la fila navegable (<code>onNavigate</code>, <code>href</code>) ni el estado Selected. El marco Mobile de Figma se resuelve en código por el ancho de la fila, no por el de la pantalla.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el List item es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Elementos del mismo tipo:</strong> documentos, perfiles o ajustes, con título y un dato de apoyo. Cada fila admite sus propias acciones.
            </>,
            <>
              <strong>Selección múltiple:</strong> con <code>selectable</code> la casilla toma el nombre del título, y con <code>selected</code> y <code>onSelectedChange</code> controlas la selección desde fuera.
            </>,
            <>
              <strong>Abrir otra vista:</strong> con <code>onNavigate</code> o <code>href</code> la fila entera es un solo control, con flecha al final y foco visible en toda la fila.
            </>,
            <>
              <strong>Listas accesibles:</strong> es un <code>li</code>, así que va dentro de un <code>ul</code> u <code>ol</code>. Con <code>list-style: none</code> añade <code>role=&quot;list&quot;</code> para VoiceOver.
            </>,
            <>
              <strong>Texto corto:</strong> usa <code>variant=&quot;simple&quot;</code> cuando solo hay un nombre y un dato en una línea.
            </>,
          ],
          avoid: [
            <>
              <strong>Contenido con imagen o varios datos:</strong> una fila de una sola línea no los organiza. (Alternativa: <code>InformationCard</code>).
            </>,
            <>
              <strong>Datos en columnas que se comparan u ordenan:</strong> la fila no alinea valores entre filas. (Alternativa: <code>Table</code>).
            </>,
            <>
              <strong>Opciones de un menú:</strong> una acción suelta no es un elemento de lista. (Alternativa: <code>DropdownMenuItem</code>).
            </>,
            <>
              <strong>Archivos con progreso de carga:</strong> la fila no muestra el avance ni los reintentos. (Alternativa: <code>FileUploadItem</code>).
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
                title: 'Complex',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Alto de 72</strong> con Avatar sm de 40 px, padding de 16 arriba y abajo y de 8 a los lados, título de 12/16 y texto de 14/18.
                  </>,
                ],
                preview: list(compact()),
              },
              {
                title: 'Simple',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Alto de 56</strong> y padding de 12 arriba y abajo, con el título de 100 px de ancho y la descripción en la misma línea.
                  </>,
                ],
                preview: list(simple({ selectable: true, onEdit: noop })),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile. Solo la descripción de Simple en el diseño angosto cambia de tamaño (<code>typography/body/size/lg</code>: 16 px desde 48rem de pantalla y 14 px por debajo).
              </>,
              <>
                <strong>Por ancho de la fila:</strong> si mide menos de 18rem (288 px), la categoría sube sobre el título y la descripción baja a todo el ancho. Depende del espacio de la fila, no de la pantalla.
              </>,
              <>
                <strong>Ancho:</strong> la fila ocupa el ancho de su lista y el texto se ajusta con puntos suspensivos.
              </>,
            ],
            preview: list(compact()),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Por ancho de la fila:</strong> en una columna lateral de menos de 288 px usa el diseño angosto; en el ancho completo, la fila de Desktop.
              </>,
              <>
                <strong>Ancho:</strong> la fila ocupa el ancho de su lista y el texto se ajusta con puntos suspensivos.
              </>,
            ],
            preview: list(compact()),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de longitud del título y de la descripción, y de la acción navegar.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Título corto',
              description: 'Escribe títulos cortos que se lean completos.',
              preview: list(item({ title: 'Informe trimestral' })),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Título largo',
              description: 'No escribas frases como título: se corta con puntos suspensivos.',
              preview: list(item({ title: 'Informe trimestral de resultados del primer semestre de ventas' })),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Navegar sin otros controles',
              description: 'Deja la fila navegable sola, con su flecha.',
              preview: list(item({ title: 'Documentos', category: undefined, description: undefined, onNavigate: noop })),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Navegar con casilla y menú',
              description: 'No mezcles navegar con selectable ni con menu: el clic en la fila es ambiguo.',
              preview: list(item({ title: 'Documentos', category: undefined, description: undefined, selectable: true, menu, onNavigate: noop })),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Descripción corta',
              description: 'Limita la descripción a un dato corto.',
              preview: list(item({ description: 'Actualizado hoy' })),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Descripción larga',
              description: 'No escribas párrafos: la fila crece y pierde el ritmo de la lista.',
              preview: list(item({ description: 'Actualizado hoy por el equipo de diseño después de la reunión del lunes con las notas de cada revisión' })),
            },
          ],
        },
      ],
    },
  ],
};
