import type { ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Breadcrumb, BreadcrumbItem } from '../Breadcrumb';
import { Button } from '../Button';
import { PageHeader } from './PageHeader';
import type { PageHeaderProps } from './PageHeader.types';

/*
 * Contenido de la página de documentación de PageHeader (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`PageHeader.types.ts`, `PageHeader.variants.ts`, `PageHeader.tsx`), luego `PageHeader.docs.json`. Diferencias con
 * Figma: el set trae una sola variante, con la flecha de volver siempre dibujada; el código la dibuja solo con
 * `onBack`, y agrega las migas (`breadcrumb`), las acciones (`actions`) y el foco del botón de volver (anillo de 2 px).
 * Figma enlaza el espacio entre filas a `gap/general/lg`, que no existe en tokens.css: el código usa
 * `space/general/xl` (12 px). Figma mide 2144 px de ancho por el lienzo; el código ocupa el ancho disponible.
 */

// Figma: 17265:93494 (component set Page Header)

/** Aspecto forzado del foco del botón de volver (el componente no tiene `state`): las mismas clases de `PageHeader.variants.ts`. */
const FOCUS_RING =
  '[&_button]:outline-2 [&_button]:outline-offset-2 [&_button]:outline-solid [&_button]:outline-ds-border-field-active';

// Cada muestra con migas es un landmark `nav`: necesita un nombre propio para que no se repitan en la página
let routeCount = 0;
const routeName = () => `Ruta de ejemplo ${++routeCount}`;

/** Migas de ejemplo: Inicio › Proyectos › Ajustes. */
const crumbs = (): ReactNode => (
  <Breadcrumb aria-label={routeName()}>
    <BreadcrumbItem href="#">Inicio</BreadcrumbItem>
    <BreadcrumbItem href="#">Proyectos</BreadcrumbItem>
    <BreadcrumbItem current>Ajustes</BreadcrumbItem>
  </Breadcrumb>
);

/**
 * Encabezado de ejemplo: título y descripción genéricos, con flecha de volver salvo que se pase `onBack: undefined`.
 * Las muestras usan `headingLevel={3}` para no romper el orden de títulos de esta página (el `h1` es el de la página).
 */
const page = (props: Partial<PageHeaderProps> = {}) => (
  <PageHeader
    headingLevel={3}
    title="Ajustes de perfil"
    description="Cambia tus datos y tus preferencias."
    onBack={() => {}}
    {...props}
  />
);

/** Acciones de ejemplo a la derecha del título. */
const actions = (...labels: string[]): ReactNode =>
  labels.map((label) => (
    <Button key={label} size="sm">
      {label}
    </Button>
  ));

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo. La flecha de volver se dibuja sin trazo, con el color de ícono por defecto.',
    samples: [page()],
  },
  {
    label: 'Focus',
    tone: 'accent',
    description: 'Al recibir el foco del teclado. El botón de volver muestra un anillo de 2 px separado 2 px del ícono.',
    samples: [<div key="focus" className={FOCUS_RING}>{page()}</div>],
  },
];

export const doc: ComponentDocContent = {
  name: 'Page Header',
  icon: 'chevron-left',
  classification: 'molecula',
  summary:
    'El Page Header es la molécula que abre una vista con su título y, si hace falta, una flecha para volver, una descripción, migas y acciones. Une un botón, un heading y un párrafo en una sola función: decir dónde estás y qué puedes hacer.',
  definition: [
    {
      title: 'Anatomía',
      description:
        'Un header con una fila (flecha de volver, título y acciones) y, debajo, la descripción. Las migas van encima de la fila.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Título, volver y descripción',
                  width: 'fill',
                  preview: page(),
                  marks: [
                    { n: 1, selector: 'header', side: 'top' },
                    { n: 2, selector: 'button', side: 'top' },
                    { n: 3, selector: 'h3', side: 'top' },
                    { n: 4, selector: 'p', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: '[data-figma-part="Header"]', to: 'p', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> <code>&lt;header&gt;</code> en columna, a todo el ancho, con 12 px entre filas (<code>space/general/xl</code>). No tiene fondo, borde ni padding.
                </>,
                <>
                  <strong>Flecha de volver:</strong> opcional (<code>onBack</code>). Botón nativo de 24 × 24 px con el ícono <code>chevron-left</code> de 24 px en variante line y <code>icon/general/default</code>. Su nombre accesible es &quot;Volver&quot; (<code>backLabel</code> lo cambia).
                </>,
                <>
                  <strong>Título:</strong> heading real, <code>h1</code> por defecto. Prospero semibold de 32/36 (<code>typography/heading/size/2xl</code>) en <code>text/neutral/heading</code>; ocupa el espacio libre de la fila y ajusta línea.
                </>,
                <>
                  <strong>Descripción:</strong> opcional (<code>description</code>). Helvetica Neue regular de 16/22 (<code>typography/body/size/lg</code>) en <code>text/neutral/body</code>, a todo el ancho.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Migas y acciones',
                  width: 'fill',
                  preview: page({ breadcrumb: crumbs(), actions: actions('Guardar'), description: undefined }),
                  marks: [
                    { n: 1, selector: 'nav', side: 'top' },
                    { n: 2, selector: 'h3', side: 'bottom' },
                    { n: 3, selector: '[data-figma-part="Header"] > div:last-child', side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: 'nav', to: '[data-figma-part="Header"]', axis: 'y' },
                    { kind: 'gap', from: 'button', to: 'h3' },
                    { kind: 'gap', from: 'h3', to: '[data-figma-part="Header"] > div:last-child' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Migas:</strong> opcionales (<code>breadcrumb</code>). Un <code>Breadcrumb</code> aparte, encima de la fila, a 12 px de ella. No está en Figma.
                </>,
                <>
                  <strong>Título:</strong> sigue ocupando el espacio libre; si el título es largo, pasa a otra línea antes de empujar las acciones.
                </>,
                <>
                  <strong>Acciones:</strong> opcionales (<code>actions</code>). Se alinean a la derecha de la fila, con 12 px entre ellas, y no se encogen. No están en Figma.
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
          Page Header tiene 2 estados, ambos del botón de volver; el resto del encabezado no es interactivo. Hover y Press no cambian el aspecto del botón. Focus se fuerza solo para documentar: en uso sale del teclado.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default, más el de Focus, que Figma no define. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Título',
              preview: page({ onBack: undefined, description: undefined }),
              entries: [{ part: 'Texto', color: 'text-neutral-heading', text: 'typography-heading-size-2xl' }],
            },
            {
              title: 'Descripción',
              preview: page({ onBack: undefined, title: 'Perfil' }),
              entries: [{ part: 'Texto', color: 'text-neutral-body', text: 'typography-body-size-lg' }],
            },
            {
              title: 'Botón de volver',
              preview: page({ description: undefined }),
              entries: [
                { part: 'Ícono', color: 'icon-general-default' },
                { part: 'Anillo (Focus)', color: 'border-field-active' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Page Header en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Page Header en la librería de Assets. Tiene una sola variante (Property 1=Default) y tres propiedades: Description, Text header y Text description.
            </>,
            <>
              <strong>Text header y Text description:</strong> Text header es el título (<code>title</code>, que el código dibuja como heading; <code>headingLevel</code> cambia su nivel). Text description es <code>description</code>. Description en false equivale a no pasar <code>description</code>.
            </>,
            <>
              <strong>Flecha de volver:</strong> en Figma el set siempre dibuja la flecha. En código aparece solo con <code>onBack</code> y es un botón con nombre accesible (<code>backLabel</code>).
            </>,
            <>
              <strong>Diferencias con el código:</strong> Figma no tiene migas, acciones ni foco; el código los agrega (<code>breadcrumb</code>, <code>actions</code>). El set mide 2144 px de ancho por el lienzo de Figma; el código ocupa el ancho disponible.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Page Header es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Título de una vista:</strong> abre el contenido con un heading real. <code>h1</code> por defecto; <code>headingLevel</code> baja el nivel si la vista ya tiene su <code>h1</code>.
            </>,
            <>
              <strong>Volver a un nivel anterior:</strong> <code>onBack</code> dibuja la flecha como botón y <code>backLabel</code> cambia su nombre accesible.
            </>,
            <>
              <strong>Ubicación y acciones de la vista:</strong> <code>breadcrumb</code> aloja un <code>Breadcrumb</code> sobre el título y <code>actions</code> pone botones a la derecha.
            </>,
            <>
              <strong>Descripción opcional:</strong> <code>description</code> aclara el contenido de la vista; sin ella no se dibuja.
            </>,
            <>
              <strong>Dentro del contenido:</strong> colócalo dentro de <code>main</code>; allí el <code>header</code> no cuenta como el banner de la página.
            </>,
          ],
          avoid: [
            <>
              <strong>Título de la vista en móvil dentro de una barra:</strong> el Page Header es un bloque del contenido. (Alternativa: <code>TopAppBar</code>).
            </>,
            <>
              <strong>Barra de la aplicación:</strong> no lleva búsqueda, perfil ni notificaciones. (Alternativa: <code>Header</code>).
            </>,
            <>
              <strong>Navegar entre secciones hermanas:</strong> la flecha solo vuelve a un nivel anterior. (Alternativa: <code>Tabs</code>).
            </>,
            <>
              <strong>Mostrar solo la ruta:</strong> las migas orientan, no titulan. (Alternativa: <code>Breadcrumb</code>).
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
                title: 'Título, volver y descripción',
                bullets: [
                  <>
                    <strong>Título:</strong> Prospero semibold de 32/36 (<code>typography/heading/size/2xl</code>).
                  </>,
                  <>
                    <strong>Descripción:</strong> Helvetica Neue regular de 16/22 (<code>typography/body/size/lg</code>).
                  </>,
                ],
                preview: page(),
              },
              {
                title: 'Migas y acciones',
                bullets: [
                  <>
                    <strong>Ancho:</strong> el título ocupa el espacio que dejan las acciones y ajusta línea.
                  </>,
                  <>
                    <strong>Acciones:</strong> mantienen su ancho y quedan a la derecha de la fila.
                  </>,
                ],
                preview: page({ breadcrumb: crumbs(), actions: actions('Guardar') }),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Título:</strong> baja a 24/32.
              </>,
              <>
                <strong>Descripción:</strong> baja a 14/20.
              </>,
              <>
                <strong>Sin cambios:</strong> la flecha de 24 px y los 12 px entre filas miden lo mismo; el encabezado ocupa el ancho disponible.
              </>,
            ],
            preview: page(),
          },
          tablet: {
            bullets: [
              <>
                <strong>Título:</strong> 32/36, igual que en Desktop.
              </>,
              <>
                <strong>Descripción:</strong> 16/22, igual que en Desktop.
              </>,
              <>
                <strong>Sin cambios:</strong> la flecha de 24 px y los 12 px entre filas miden lo mismo; el encabezado ocupa el ancho disponible.
              </>,
            ],
            preview: page(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas del título, de la salida y de las acciones.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Título corto',
              description: 'Titula con pocas palabras y deja el detalle para la descripción.',
              preview: page({ onBack: undefined }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Título como oración',
              description: 'No escribas el título como una oración: ocupa varias líneas.',
              preview: page({ onBack: undefined, title: 'Cambia los datos y las preferencias de tu perfil' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Solo migas',
              description: 'Elige las migas para ubicar a la persona y volver a cualquier nivel.',
              preview: page({ onBack: undefined, breadcrumb: crumbs() }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Migas y flecha',
              description: 'No juntes migas y flecha: repiten la misma salida.',
              preview: page({ breadcrumb: crumbs() }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Una acción',
              description: 'Deja una sola acción principal junto al título.',
              preview: page({ onBack: undefined, actions: actions('Guardar') }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Varias acciones',
              description: 'No amontones acciones junto al título: le quitan el ancho.',
              preview: page({ onBack: undefined, actions: actions('Guardar', 'Editar') }),
            },
          ],
        },
      ],
    },
  ],
};
