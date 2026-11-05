import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Pagination } from './Pagination';
import { PaginationPage } from './PaginationPage';

/*
 * Contenido de la página de documentación de Pagination (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Pagination.types.ts`, `Pagination.variants.ts`, `Pagination.tsx`, `PaginationPage.tsx`), luego `Pagination.docs.json`.
 * Page (PaginationPage), la pieza de cada número, se documenta dentro de esta página: un grupo de Anatomía, tres de
 * sus estados (Default, Hover y Select), un grupo de Tokens y viñetas de Uso en Figma.
 * Diferencias con Figma: Figma dibuja el State Hover de Page igual que Default y el código aclara el relleno un paso
 * (`background/general/gray-sixth`); Figma no dibuja el foco (el código agrega un contorno de 2 px), los puntos
 * suspensivos de `boundaryCount` ni el error del campo. La ventana de números empieza en la página actual, como en
 * Figma (decisión vigente).
 */

// Figma: 12048:7622 (component set Pagination) y 11953:4965 (component set Page (Atom))

type PaginationProps = Partial<ComponentProps<typeof Pagination>>;
type PageProps = Partial<ComponentProps<typeof PaginationPage>>;

/** Nombres de las muestras: cada paginación de la página lleva uno distinto (landmark único). */
const NAMES = ['documentos', 'proyectos', 'perfiles', 'reuniones', 'informes', 'archivos', 'tareas', 'notas', 'avisos', 'carpetas', 'etiquetas', 'equipos', 'plantillas', 'recetas', 'mensajes', 'tableros', 'listas', 'grupos', 'cursos', 'vistas'];
let count = 0;

/** Paginación de ejemplo con un nombre accesible propio. */
const pag = (props: PaginationProps = {}) => {
  const name = `Paginación de ${NAMES[count % NAMES.length]}${count >= NAMES.length ? ` ${Math.floor(count / NAMES.length) + 1}` : ''}`;
  count += 1;
  return <Pagination totalPages={20} aria-label={name} {...props} />;
};

/** Pieza Page de ejemplo. */
const page = (number: number, props: PageProps = {}) => <PaginationPage number={number} aria-label={`Página ${number}`} {...props} />;

/** Varias muestras en fila, con claves. */
const row = (...items: ReactNode[]) => (
  <div className="flex items-center gap-ds-space-general-sm">
    {items.map((item, i) => (
      <Fragment key={i}>{item}</Fragment>
    ))}
  </div>
);

/** Varias muestras en columna, con claves. */
const stack = (...items: ReactNode[]) => (
  <div className="flex w-full flex-col items-center gap-ds-space-general-4xl">
    {items.map((item, i) => (
      <Fragment key={i}>{item}</Fragment>
    ))}
  </div>
);

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo. El texto de estado, los botones y los números están disponibles, con la página actual marcada.',
    samples: [pag({ defaultPage: 6 })],
  },
  {
    label: 'Hover',
    tone: 'accent',
    description: (
      <>
        Al pasar el puntero sobre un número. El relleno se aclara un paso. En Page se fuerza con <code>state=&quot;hover&quot;</code>.
      </>
    ),
    samples: [row(page(7, { state: 'hover' }), page(8), page(9))],
  },
  {
    label: 'Select',
    tone: 'accent',
    description: (
      <>
        La página actual. Relleno de mayor contraste, <code>aria-current=&quot;page&quot;</code> y sin cambio al pasar el puntero.
      </>
    ),
    samples: [row(page(7), page(8, { selected: true }), page(9))],
  },
  {
    label: 'Inactive',
    tone: 'neutral',
    description: 'Anterior y Siguiente quedan deshabilitados en la primera y la última página. Mostrar más, en la última.',
    samples: [pag({ defaultPage: 1 }), pag({ type: 'more', totalPages: 3, defaultPage: 3 })],
  },
];

export const doc: ComponentDocContent = {
  name: 'Pagination',
  icon: 'chevron-right',
  classification: 'molecula',
  summary:
    'La Pagination es la molécula que reparte una lista larga en páginas. Une el texto de estado, los botones Anterior y Siguiente y, según su tipo, números de página, un campo de número o un botón Mostrar más. Incluye Page, la pieza de cada número.',
  definition: [
    {
      title: 'Anatomía',
      description:
        'Una navegación con el texto de estado y los controles de cambio de página. El Type decide qué controles lleva: números, campo o botón. Cada número es una pieza Page.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Type numeric',
                  preview: pag({ defaultPage: 6 }),
                  marks: [
                    { n: 1, selector: 'nav', side: 'left' },
                    { n: 2, selector: 'nav > p', side: 'top' },
                    { n: 3, selector: 'nav > ul', side: 'bottom' },
                    { n: 4, selector: 'ul > li:first-child button', side: 'left' },
                    { n: 5, selector: 'button[aria-current="page"]', side: 'top' },
                    { n: 6, selector: 'ul > li:last-child button', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: 'nav > p', to: 'nav > ul', axis: 'y' },
                    { kind: 'gap', from: 'ul > li:nth-child(1) button', to: 'ul > li:nth-child(2) button' },
                    { kind: 'height', selector: 'ul > li:first-child button' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> un <code>nav</code> en columna, centrado, con 16 px entre el texto y la fila (<code>space/general/2xl</code>). Su nombre accesible por defecto es &quot;Paginación&quot; (<code>labels.navigation</code>).
                </>,
                <>
                  <strong>Texto de estado:</strong> &quot;Página 6 de 20&quot; en 14/18 regular (<code>typography/body/size/md</code>), centrado y en <code>text/neutral/white</code>. Es una región <code>aria-live=&quot;polite&quot;</code>: anuncia cada cambio.
                </>,
                <>
                  <strong>Fila de controles:</strong> una lista con 2 px entre elementos (<code>space/general/sm</code>). Cada control es un elemento de lista.
                </>,
                <>
                  <strong>Anterior:</strong> Button Secondary xs de solo ícono, 32 × 32 px, con <code>chevron-left</code> de 16 px. Su nombre es &quot;Anterior&quot; y se deshabilita en la primera página.
                </>,
                <>
                  <strong>Página actual:</strong> una pieza Page con relleno de mayor contraste y <code>aria-current=&quot;page&quot;</code>. La ventana de números empieza en la actual.
                </>,
                <>
                  <strong>Siguiente:</strong> el mismo Button con <code>chevron-right</code>. Se deshabilita en la última página.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Type input',
                  preview: pag({ type: 'input', defaultPage: 10 }),
                  marks: [
                    { n: 1, selector: 'nav', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Página"]', side: 'top' },
                    { n: 3, selector: 'input', side: 'top' },
                    { n: 4, selector: '[data-figma-part="de 20"]', side: 'top' },
                    { n: 5, selector: 'nav > ul', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: '[data-figma-part="Página"]', to: 'input' },
                    { kind: 'height', selector: 'nav > ul li:first-child button' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> un <code>nav</code> en fila, centrado, con 16 px entre elementos (<code>space/general/2xl</code>).
                </>,
                <>
                  <strong>Texto previo:</strong> &quot;Página&quot; en 14/18 regular (<code>pageWord</code>). Es visual: el campo lleva su propio nombre.
                </>,
                <>
                  <strong>Campo:</strong> un DigitInput de 32 px de alto con la página actual. Acepta tantos dígitos como tiene el total, valida el rango y confirma con Enter. Su nombre es &quot;Número de página&quot; (<code>labels.input</code>).
                </>,
                <>
                  <strong>Texto posterior:</strong> &quot;de 20&quot; con el total (<code>ofTotal</code>).
                </>,
                <>
                  <strong>Botones:</strong> los mismos Anterior y Siguiente, a la derecha del campo y con 2 px entre ellos.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Type more',
                  preview: pag({ type: 'more', totalPages: 8, defaultPage: 2 }),
                  marks: [
                    { n: 1, selector: 'nav', side: 'left' },
                    { n: 2, selector: 'nav > p', side: 'top' },
                    { n: 3, selector: 'nav > button', side: 'bottom' },
                  ],
                  dimensions: [{ kind: 'gap', from: 'nav > p', to: 'nav > button', axis: 'y' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> un <code>nav</code> en columna, centrado, con 16 px entre el texto y el botón (<code>space/general/2xl</code>).
                </>,
                <>
                  <strong>Texto de estado:</strong> &quot;Página 2 de 8&quot;, igual que en Type numeric.
                </>,
                <>
                  <strong>Mostrar más:</strong> Button Primary md. Cada clic avanza una página y, en la última, queda deshabilitado. Su texto es <code>labels.loadMore</code>.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Page',
                  preview: row(page(7), page(8, { selected: true })),
                  marks: [
                    { n: 1, selector: 'button', index: 0, side: 'left' },
                    { n: 2, selector: '[data-figma-part="Date"]', index: 0, side: 'top' },
                    { n: 3, selector: 'button', index: 1, side: 'right' },
                  ],
                  dimensions: [{ kind: 'height', selector: 'button', index: 0 }],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> botón circular de 32 × 32 px (<code>radius/general/full</code>) y sin padding. Relleno <code>background/general/gray-seventh</code> en Default y Hover.
                </>,
                <>
                  <strong>Número:</strong> 12/16 (<code>typography/body/size/sm</code>), centrado, en peso semibold. Es la prop <code>number</code>.
                </>,
                <>
                  <strong>Seleccionada:</strong> relleno <code>background/general/white</code>, texto <code>text/neutral/black</code> en peso regular y <code>aria-current=&quot;page&quot;</code> (prop <code>selected</code>).
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
          Pagination tiene 4 estados. Default e Inactive son del conjunto; Hover y Select, de cada pieza Page. No hay prop <code>state</code> en Pagination: salen de la página actual y de sus extremos. En Page, Hover y Select se fuerzan con <code>state</code> solo para documentar. El foco de teclado dibuja un contorno de 2 px.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default; los de otros estados llevan el estado entre paréntesis. Los botones Anterior, Siguiente y Mostrar más usan los tokens de Button. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Pagination',
              preview: pag({ defaultPage: 6 }),
              entries: [
                { part: 'Texto de estado', color: 'text-neutral-white', text: 'typography-body-size-md' },
                { part: 'Texto previo y posterior del campo', color: 'text-neutral-white', text: 'typography-body-size-md' },
              ],
            },
            {
              title: 'Page',
              preview: row(page(7), page(8, { selected: true })),
              entries: [
                { part: 'Relleno', color: 'background-general-gray-seventh' },
                { part: 'Número', color: 'text-neutral-white', text: 'typography-body-size-sm' },
                { part: 'Relleno (Hover)', color: 'background-general-gray-sixth' },
                { part: 'Relleno (Select)', color: 'background-general-white' },
                { part: 'Número (Select)', color: 'text-neutral-black' },
                { part: 'Contorno (aparece en Focus)', color: 'border-field-active' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Pagination en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Pagination en la librería de Assets. Sus propiedades son Type (numeric, input y More) y Pages (initial, middle y final). En código es <code>Pagination</code> con <code>type</code> (<code>numeric</code>, <code>input</code> o <code>more</code>).
            </>,
            <>
              <strong>Pages:</strong> no es una prop. Initial, middle y final salen de <code>page</code> y <code>totalPages</code>. Figma dibuja la ventana de 5 números empezando en la actual, y el código también. More solo existe en initial.
            </>,
            <>
              <strong>Page (Atom):</strong> la pieza de cada número tiene State (Default, Hover y Select) y Number. En código es <code>PaginationPage</code> con <code>state</code>, <code>selected</code> y <code>number</code>; Pagination la coloca por ti.
            </>,
            <>
              <strong>Inactive:</strong> no es un valor del set Pagination. Sale de los botones Anterior, Siguiente y Mostrar más, que se deshabilitan solos.
            </>,
            <>
              <strong>Lo que Figma no tiene:</strong> el foco, los puntos suspensivos (<code>boundaryCount</code>), el aviso de número fuera de rango y los textos configurables (<code>labels</code>). En Figma, Hover de Page se ve igual que Default; el código aclara el relleno un paso.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo la Pagination es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Listas partidas en páginas:</strong> resultados o filas de tamaño fijo. El texto &quot;Página 6 de 20&quot; dice dónde estás y cuánto falta.
            </>,
            <>
              <strong>Saltar a una página lejana:</strong> con <code>type=&quot;input&quot;</code> escribe el número y confirma con Enter. Un número fuera de rango marca el campo y avisa &quot;Escribe un número entre 1 y 20&quot;.
            </>,
            <>
              <strong>Listas que crecen:</strong> con <code>type=&quot;more&quot;</code> cada clic avanza una página y el botón se deshabilita en la última. Tú sumas los datos nuevos a la lista.
            </>,
            <>
              <strong>Teclado y lectores de pantalla:</strong> es un <code>nav</code> con una lista, nombre propio y <code>aria-current=&quot;page&quot;</code> en la actual. Cada cambio se anuncia en el texto de estado.
            </>,
            <>
              <strong>Estado propio o tuyo:</strong> <code>defaultPage</code> la deja sola; <code>page</code> con <code>onPageChange</code> la controlas tú, por ejemplo para pedir los datos de esa página.
            </>,
          ],
          avoid: [
            <>
              <strong>Una sola página:</strong> sin otra página a la que ir, los controles sobran. Muestra la lista completa.
            </>,
            <>
              <strong>Pasos de un proceso:</strong> Pagination no lleva un orden ni un avance. (Alternativa: <code>Stepper</code>).
            </>,
            <>
              <strong>Secciones con nombre propio:</strong> un número no dice qué hay en cada página. (Alternativa: <code>Tabs</code>).
            </>,
            <>
              <strong>Páginas que son direcciones:</strong> los números son botones: no cambian la URL ni se abren en otra pestaña. Si cada página debe tener enlace, enlaza <code>onPageChange</code> con tu enrutador.
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
                title: 'Numeric e input',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Medidas fijas:</strong> botones y números de 32 × 32 px, separados 2 px, y 16 px entre el texto y la fila.
                  </>,
                ],
                preview: stack(pag({ defaultPage: 6 }), pag({ type: 'input', defaultPage: 6 })),
              },
              {
                title: 'Mostrar más',
                bullets: [
                  <>
                    <strong>Botón:</strong> mide lo que su texto y queda centrado bajo el texto de estado.
                  </>,
                  <>
                    <strong>Altura:</strong> Button Primary md, con la altura de escritorio (<code>56 px</code>).
                  </>,
                ],
                preview: pag({ type: 'more', totalPages: 8, defaultPage: 2 }),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Mostrar más:</strong> por debajo de 48rem el botón ocupa todo el ancho (<code>fullWidth</code>).
              </>,
              <>
                <strong>Numeric e input:</strong> sin cambios. La ventana de 5 números más Anterior y Siguiente mide 236 px y cabe en 376.
              </>,
              <>
                <strong>Altura del botón:</strong> Button Primary md baja a 48 px (tokens de Mobile de Button).
              </>,
            ],
            preview: <div className="w-full">{pag({ type: 'more', totalPages: 8, defaultPage: 2 })}</div>,
          },
          tablet: {
            bullets: [
              <>
                <strong>Como Desktop:</strong> desde 48rem, Mostrar más mide lo que su texto.
              </>,
              <>
                <strong>Numeric e input:</strong> sin cambios, con las mismas medidas fijas de 32 × 32 px.
              </>,
              <>
                <strong>Altura del botón:</strong> Button Primary md con la altura de escritorio (<code>56 px</code>).
              </>,
            ],
            preview: pag({ type: 'more', totalPages: 8, defaultPage: 2 }),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de extremos, tipo de control y tamaño de la ventana.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Extremos a la vista',
              description: (
                <>
                  Fija la primera y la última página con <code>boundaryCount</code> en listas largas.
                </>
              ),
              preview: pag({ totalPages: 50, defaultPage: 10, boundaryCount: 1, siblingCount: 1 }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Solo la ventana',
              description: 'No dejes solo la ventana en listas largas: la última página queda lejos.',
              preview: pag({ totalPages: 50, defaultPage: 10, siblingCount: 1 }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Campo para muchas páginas',
              description: 'Usa el campo cuando hay cientos de páginas y la persona sabe cuál busca.',
              preview: pag({ type: 'input', totalPages: 240, defaultPage: 36 }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Campo para pocas páginas',
              description: 'No uses el campo con pocas páginas: los números llegan antes.',
              preview: pag({ type: 'input', totalPages: 3, defaultPage: 1 }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Ventana de 5 números',
              description: 'Deja la ventana en 5 números o menos para que quepa en móvil.',
              preview: pag({ totalPages: 30, defaultPage: 6 }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Ventana larga',
              description: (
                <>
                  No subas <code>siblingCount</code> a 4: nueve números no caben en móvil.
                </>
              ),
              preview: pag({ totalPages: 30, defaultPage: 6, siblingCount: 4 }),
            },
          ],
        },
      ],
    },
  ],
};
