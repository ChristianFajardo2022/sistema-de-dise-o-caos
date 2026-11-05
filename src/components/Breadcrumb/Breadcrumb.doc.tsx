import type { ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';
import type { BreadcrumbItemProps } from './Breadcrumb.types';

/*
 * Contenido de la página de documentación de Breadcrumb (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Breadcrumb.types.ts`, `Breadcrumb.variants.ts`, `Breadcrumb.tsx`), luego `Breadcrumb.docs.json`. Diferencias con
 * Figma: el set Breadcrumb dibuja el ícono home y un chevron una sola vez, fuera del slot List; el código pone ambos
 * en cada BreadcrumbItem. Figma no tiene Hover, Focus ni Press (el código usa los tokens de enlace y un anillo de
 * foco de 2 px), ni el recorte con `truncate`, ni el texto plano. El componente no cambia entre breakpoints.
 */

// Figma: 11679:10314 (component set Breadcrumb) y 11679:10460 (component set Text Breadcrumb)

/** Aspecto forzado de un enlace con las mismas clases que usa `Breadcrumb.variants.ts` (el componente no tiene `state`). */
const FORCED = {
  hover: 'text-ds-text-link-hover underline',
  focus: 'outline-2 outline-offset-2 outline-solid outline-ds-border-field-active',
  press: 'text-ds-text-link-focus-press underline',
} as const;

type Forced = keyof typeof FORCED;

// Cada muestra es un landmark `nav`: necesita un nombre propio para que no se repitan en la página
let routeCount = 0;
const routeName = () => `Ruta de ejemplo ${++routeCount}`;

/** Ruta de ejemplo: Inicio › Proyectos › Documentos › Informe trimestral. `home` cambia el primer nivel por el ícono. */
const route = (opts: { home?: boolean; forced?: Forced; truncate?: boolean } = {}) => (
  <Breadcrumb aria-label={routeName()}>
    <BreadcrumbItem href="#" home={opts.home}>{opts.home ? undefined : 'Inicio'}</BreadcrumbItem>
    <BreadcrumbItem href="#" linkProps={opts.forced ? { className: FORCED[opts.forced] } : undefined} truncate={opts.truncate}>
      Proyectos
    </BreadcrumbItem>
    <BreadcrumbItem href="#">Documentos</BreadcrumbItem>
    <BreadcrumbItem current>Informe trimestral</BreadcrumbItem>
  </Breadcrumb>
);

/** Ruta corta de dos niveles: el primero toma el estado forzado (o el último, si es la página actual). */
const pair = (forced?: Forced, props: Partial<BreadcrumbItemProps> = {}): ReactNode => (
  <Breadcrumb aria-label={routeName()}>
    <BreadcrumbItem href="#" linkProps={forced ? { className: FORCED[forced] } : undefined}>Documentos</BreadcrumbItem>
    <BreadcrumbItem current {...props}>Informe trimestral</BreadcrumbItem>
  </Breadcrumb>
);

/** Ruta con un último nivel de nombre largo: recortado con `truncate` o envuelto. */
const longTrail = (truncate: boolean): ReactNode => (
  <Breadcrumb aria-label={routeName()}>
    <BreadcrumbItem href="#">Documentos</BreadcrumbItem>
    <BreadcrumbItem current truncate={truncate}>Informe trimestral de avance de los proyectos</BreadcrumbItem>
  </Breadcrumb>
);

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo. Enlace regular en gris, sin subrayado, seguido de su chevron.',
    samples: [pair()],
  },
  {
    label: 'Hover',
    tone: 'accent',
    description: 'Al pasar el puntero. El texto toma el color de enlace en hover y se subraya.',
    samples: [pair('hover')],
  },
  {
    label: 'Focus',
    tone: 'accent',
    description: 'Al recibir el foco del teclado. Aparece un anillo de 2 px separado 2 px del texto.',
    samples: [pair('focus')],
  },
  {
    label: 'Press',
    tone: 'accent',
    description: 'Mientras se presiona. El texto toma el color de foco y press de enlace y se subraya.',
    samples: [pair('press')],
  },
  {
    label: 'Select',
    tone: 'accent',
    description: (
      <>
        Página actual (<code>current</code>). Semibold, en el color de mayor contraste, sin enlace ni foco, con <code>aria-current=&quot;page&quot;</code>.
      </>
    ),
    samples: [pair()],
  },
];

export const doc: ComponentDocContent = {
  name: 'Breadcrumb',
  icon: 'home1',
  classification: 'molecula',
  summary:
    'El Breadcrumb es la molécula que muestra dónde estás dentro de una jerarquía y te deja volver a cualquier nivel anterior. Une niveles con enlace, un ícono home opcional, separadores y la página actual, que no es un enlace. Cada nivel es un BreadcrumbItem.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Un nav con una lista ordenada de niveles. Cada nivel es un enlace o texto, seguido de un separador.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Ruta con ícono home',
                  preview: route({ home: true }),
                  marks: [
                    { n: 1, selector: 'ol', side: 'top' },
                    { n: 2, selector: 'li:first-child a > svg', side: 'bottom' },
                    { n: 3, selector: 'li:nth-child(2) a', side: 'top' },
                    { n: 4, selector: '[data-separator]', index: 1, side: 'bottom' },
                    { n: 5, selector: '[aria-current="page"]', side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: 'li:nth-child(2) a', to: 'li:nth-child(2) > [data-separator]' },
                    { kind: 'gap', from: 'li:nth-child(2)', to: 'li:nth-child(3)' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Lista:</strong> <code>&lt;nav&gt;</code> con un <code>&lt;ol&gt;</code> que ajusta línea cuando no cabe. Entre niveles hay 4 px (<code>gap/general/sm</code>); no tiene fondo, borde ni padding.
                </>,
                <>
                  <strong>Ícono home:</strong> opcional (<code>home</code>), de 16 px en variante fill con <code>icon/general/default</code>. Sin texto, su nombre accesible es &quot;Inicio&quot;.
                </>,
                <>
                  <strong>Enlace:</strong> Helvetica Neue regular de 14/20 (<code>typography/body/size/md</code>) en <code>text/neutral/gray</code>. Entre el texto y su chevron hay 4 px.
                </>,
                <>
                  <strong>Separador:</strong> chevron de 14 px en variante line con <code>icon/general/default</code>. Es decorativo y el último nivel no lo muestra.
                </>,
                <>
                  <strong>Página actual:</strong> el último nivel, sin enlace. Semibold en <code>text/neutral/white</code>.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Alto de la página actual',
                  preview: (
                    <Breadcrumb aria-label={routeName()}>
                      <BreadcrumbItem current>Informe trimestral</BreadcrumbItem>
                    </Breadcrumb>
                  ),
                  marks: [{ n: 1, selector: '[aria-current="page"]', side: 'top' }],
                  dimensions: [
                    { kind: 'height', selector: '[aria-current="page"]' },
                    { kind: 'padding', selector: '[aria-current="page"]', side: 'bottom' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Página actual:</strong> 22 px de alto: una línea de 14/20 (<code>typography/body/line-height-large/md</code>) más 2 px de padding inferior (<code>space/general/sm</code>). Un enlace mide 20 px, sin ese padding.
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
          Breadcrumb tiene 5 estados, todos del nivel (<code>BreadcrumbItem</code>); la lista no tiene estados propios. No existe Inactive: un nivel sin <code>href</code> ni <code>current</code> se dibuja como texto plano. Hover, Focus y Press se fuerzan solo para documentar; en uso salen de la interacción.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default, más los de Hover, Press y Focus, que Figma no define. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Enlace (Default)',
              preview: pair(),
              entries: [
                { part: 'Texto', color: 'text-neutral-gray', text: 'typography-body-size-md' },
                { part: 'Chevron e ícono home', color: 'icon-general-default' },
              ],
            },
            {
              title: 'Enlace (Hover, Press y Focus)',
              preview: pair('hover'),
              entries: [
                { part: 'Texto (Hover)', color: 'text-link-hover' },
                { part: 'Texto (Press)', color: 'text-link-focus-press' },
                { part: 'Anillo (Focus)', color: 'border-field-active' },
              ],
            },
            {
              title: 'Página actual (Select)',
              preview: pair(),
              entries: [{ part: 'Texto', color: 'text-neutral-white', text: 'typography-body-size-md' }],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Breadcrumb en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Breadcrumb en la librería de Assets. Trae un slot List que se llena con instancias de Text Breadcrumb, un componente aparte con las propiedades Text, Chevron y Type.
            </>,
            <>
              <strong>Type:</strong> Default es un enlace (<code>href</code>) y Select es la página actual (<code>current</code>). El set Breadcrumb solo muestra Type=Default.
            </>,
            <>
              <strong>Text y Chevron:</strong> Text es el texto del nivel (<code>children</code>). Chevron muestra u oculta el separador (<code>chevron</code>); en código se oculta solo en el último nivel.
            </>,
            <>
              <strong>Diferencias con el código:</strong> Figma dibuja el ícono home y un chevron una sola vez, fuera del slot List; el código los pone en cada <code>BreadcrumbItem</code> (<code>home</code>). Figma no tiene Hover, Focus ni Press, ni el recorte con <code>truncate</code>.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Breadcrumb es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Jerarquías de varios niveles:</strong> muestra la ruta del nivel más general al más específico y permite subir a cualquiera con un enlace.
            </>,
            <>
              <strong>Página actual:</strong> <code>current</code> marca el último nivel como texto con <code>aria-current=&quot;page&quot;</code>, sin enlace.
            </>,
            <>
              <strong>Primer nivel con solo el ícono:</strong> <code>home</code> sin <code>children</code> ahorra ancho; su nombre accesible es &quot;Inicio&quot; (<code>homeLabel</code> lo cambia).
            </>,
            <>
              <strong>Nombres largos:</strong> envuelven por defecto. <code>truncate</code> es una opción para espacios fijos: recorta a 12 rem con elipsis y el nombre completo solo se ve con puntero (<code>title</code>).
            </>,
            <>
              <strong>Enrutadores:</strong> <code>linkProps</code> pasa un <code>onClick</code> al enlace sin perder el <code>href</code>.
            </>,
          ],
          avoid: [
            <>
              <strong>Navegar entre secciones hermanas:</strong> el Breadcrumb solo sube por la jerarquía. (Alternativa: <code>Tabs</code> o <code>NavBar</code>).
            </>,
            <>
              <strong>Mostrar el avance de un proceso:</strong> los niveles son lugares, no pasos. (Alternativa: <code>Stepper</code>).
            </>,
            <>
              <strong>Ejecutar una acción:</strong> cada nivel navega; no dispara acciones. (Alternativa: <code>ButtonLink</code>).
            </>,
            <>
              <strong>Niveles intermedios sin enlace:</strong> sin <code>href</code> no se puede subir a ellos. (Alternativa: dar un <code>href</code> a cada nivel salvo el actual).
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
                title: 'Ruta con ícono home',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Texto de 14/20</strong> en todos los breakpoints, con 4 px entre niveles.
                  </>,
                ],
                preview: route({ home: true }),
              },
              {
                title: 'Ruta con recorte',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> el recorte (12 rem por nivel) es el mismo en todos los breakpoints.
                  </>,
                  <>
                    <strong>Texto completo</strong> en <code>title</code>, que solo se ve con puntero.
                  </>,
                ],
                preview: longTrail(true),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medidas fijas:</strong> texto de 14/20, ícono home de 16 px y chevron de 14 px.
              </>,
              <>
                <strong>Ancho:</strong> depende de los textos; si la ruta no cabe, los niveles pasan a otra línea.
              </>,
            ],
            preview: route({ home: true }),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medidas fijas:</strong> texto de 14/20, ícono home de 16 px y chevron de 14 px.
              </>,
              <>
                <strong>Ancho:</strong> depende de los textos; si la ruta no cabe, los niveles pasan a otra línea.
              </>,
            ],
            preview: route({ home: true }),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de la página actual, del recorte y del separador.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Última página sin enlace',
              description: (
                <>
                  Marca el último nivel con <code>current</code>: es texto, no un enlace.
                </>
              ),
              preview: pair(),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Última página enlazada',
              description: 'No enlaces el último nivel a la misma página donde ya estás.',
              preview: (
                <Breadcrumb aria-label={routeName()}>
                  <BreadcrumbItem href="#">Documentos</BreadcrumbItem>
                  <BreadcrumbItem href="#">Informe trimestral</BreadcrumbItem>
                </Breadcrumb>
              ),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Niveles con nombre corto',
              description: 'Nombra cada nivel con una o dos palabras para que la ruta ocupe una línea.',
              preview: (
                <Breadcrumb aria-label={routeName()}>
                  <BreadcrumbItem href="#">Documentos</BreadcrumbItem>
                  <BreadcrumbItem current>Informe</BreadcrumbItem>
                </Breadcrumb>
              ),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Niveles con frases largas',
              description: 'No uses una frase como nombre de nivel: la ruta ocupa varias líneas.',
              preview: longTrail(false),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Chevron entre niveles',
              description: 'Deja el separador solo entre niveles, sin chevron tras el último.',
              preview: pair(),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Chevron tras el último',
              description: 'No fuerces el chevron en el último nivel: apunta a un destino que no existe.',
              preview: pair(undefined, { chevron: true }),
            },
          ],
        },
      ],
    },
  ],
};
