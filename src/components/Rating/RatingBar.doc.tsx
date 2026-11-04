import type { ComponentProps } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { RatingBar } from './RatingBar';
import type { RatingBarItem } from './Rating.types';

/*
 * Contenido de la página de documentación de RatingBar (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Rating.types.ts`, `Rating.variants.ts`, `RatingBar.tsx`), luego `RatingBar.docs.json`. Medidas: columna con gap de 8
 * (`space/general/lg`); cada fila mide 22 de alto: estrella de 16, gap de 8 y ProgressBar de tipo linear-text, con la
 * píldora de 8 × 2 y texto de 12/16 Semibold. Iguales en Desktop, Tablet y Mobile.
 * Diferencias con Figma: Figma dibuja siempre cinco filas con textos fijos y una sola variante (Propiedad 1 =
 * Predeterminada); el código calcula las filas desde `distribution`, ofrece `display="count"` y `barProps`, y suma el
 * nombre accesible de la lista y de cada barra ("5 estrellas"), que Figma no define.
 */

// Figma: 11569:947 (component set Rating bar)

type BarProps = Partial<ComponentProps<typeof RatingBar>>;

/** Distribución de muestra: 176 reseñas (68%, 23%, 6%, 2% y 1%). */
const DIST: RatingBarItem[] = [
  { stars: 5, count: 120 },
  { stars: 4, count: 40 },
  { stars: 3, count: 10 },
  { stars: 2, count: 4 },
  { stars: 1, count: 2 },
];

const DIST_COUNT: RatingBarItem[] = [
  { stars: 5, count: 1280 },
  { stars: 4, count: 640 },
  { stars: 3, count: 120 },
  { stars: 2, count: 30 },
  { stars: 1, count: 12 },
];

/** Pocas reseñas: una por calificación de 5 a 3. */
const FEW: RatingBarItem[] = [
  { stars: 5, count: 1 },
  { stars: 4, count: 1 },
  { stars: 3, count: 1 },
  { stars: 2, count: 0 },
  { stars: 1, count: 0 },
];

const EMPTY: RatingBarItem[] = [5, 4, 3, 2, 1].map((stars) => ({ stars, count: 0 }));

const LABEL = 'Reseñas por calificación';

/** Lista de ejemplo al ancho de Figma (312), sin desbordar el marco. */
const bar = (props: BarProps = {}) => (
  <RatingBar className="w-full max-w-[312px]" label={LABEL} distribution={DIST} {...props} />
);

const states: DocStateItem[] = [
  {
    label: 'Porcentaje',
    tone: 'neutral',
    description: (
      <>
        Valor por defecto (<code>display=&quot;percentage&quot;</code>). Cada píldora escribe el porcentaje de la fila sobre el total, como en Figma.
      </>
    ),
    samples: [bar()],
  },
  {
    label: 'Cantidad',
    tone: 'neutral',
    description: (
      <>
        Con <code>display=&quot;count&quot;</code> la píldora escribe cuántas reseñas tiene la fila, con el formato numérico del español. La longitud de la barra no cambia.
      </>
    ),
    samples: [bar({ display: 'count', distribution: DIST_COUNT })],
  },
  {
    label: 'Sin reseñas',
    tone: 'neutral',
    description: 'Si todas las filas están en 0, las barras quedan vacías y cada píldora dice 0%. El componente no oculta la lista.',
    samples: [bar({ distribution: EMPTY })],
  },
  {
    label: 'Color de barra',
    tone: 'neutral',
    description: (
      <>
        <code>barProps</code> pasa props a cada barra. Con <code>status=&quot;success&quot;</code> el relleno cambia de color; la barra no se vuelve interactiva.
      </>
    ),
    samples: [bar({ barProps: { status: 'success' } })],
  },
];

export const doc: ComponentDocContent = {
  name: 'RatingBar',
  icon: 'star',
  classification: 'molecula',
  summary:
    'El RatingBar es la molécula que muestra cuántas reseñas recibió cada calificación, de 5 a 1 estrellas. Une una estrella y una barra de progreso en cada fila y escribe el porcentaje o la cantidad. No es interactivo: solo informa.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una lista en columna: cada fila une una estrella a la izquierda y una barra de progreso con su valor a la derecha.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Lista de cinco filas',
                  preview: bar(),
                  marks: [
                    { n: 1, selector: 'ul', side: 'left' },
                    { n: 2, selector: 'li > span', index: 0, side: 'top' },
                    { n: 3, selector: '[data-figma-part="Bar"]', index: 0, side: 'top' },
                    { n: 4, selector: '[data-figma-part="Container"]', index: 0, side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: 'li > span', fromIndex: 0, to: '[role="progressbar"]', toIndex: 0 },
                    { kind: 'height', selector: 'li', index: 0 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Lista:</strong> columna sin padding ni fondo, al ancho del contenedor (Figma la dibuja de 312). Separa las filas con 8 (<code>space/general/lg</code>) y se nombra con <code>label</code>.
                </>,
                <>
                  <strong>Estrella:</strong> <code>IconStar</code> en <code>select</code>, de 16 px y decorativa (<code>aria-hidden</code>). Una por fila: no escribe el número de estrellas.
                </>,
                <>
                  <strong>Barra:</strong> <code>ProgressBar</code> de tipo linear-text, de 8 de alto, con el relleno proporcional al total. Cada barra se llama &quot;5 estrellas&quot;, &quot;4 estrellas&quot; y así hasta &quot;1 estrella&quot;.
                </>,
                <>
                  <strong>Píldora de valor:</strong> porcentaje o cantidad en Helvetica Neue Semibold de 12/16 (<code>typography/field/size/xs</code>). La fila mide 22 de alto, con 8 entre la estrella y la barra.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Porcentaje y cantidad',
                  preview: (
                    <div className="flex w-full max-w-[312px] flex-col gap-ds-space-general-4xl">
                      {bar({ distribution: DIST.slice(0, 2) })}
                      {bar({ display: 'count', distribution: DIST_COUNT.slice(0, 2) })}
                    </div>
                  ),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Container"]', index: 0, side: 'right' },
                    { n: 2, selector: '[data-figma-part="Container"]', index: 2, side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Container"]', index: 0, side: 'left' },
                    { kind: 'padding', selector: '[data-figma-part="Container"]', index: 0, side: 'top' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Porcentaje:</strong> la píldora redondea el valor al entero y escribe &quot;68%&quot;. Su padding es 8 × 2 (<code>space/button/lg</code> y <code>space/general/sm</code>).
                </>,
                <>
                  <strong>Cantidad:</strong> con <code>display=&quot;count&quot;</code> escribe &quot;1280&quot; y la barra conserva la misma proporción sobre el total.
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
          RatingBar tiene 4 variantes de aspecto, que se eligen con <code>display</code>, con los datos y con <code>barProps</code>. No es interactivo: no tiene Hover, Focus ni Press, y sus barras no reciben foco.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado predeterminado. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Barra predeterminada',
              preview: bar({ distribution: DIST.slice(0, 2) }),
              entries: [
                { part: 'Estrella', color: 'icon-semantic-alert-firts' },
                { part: 'Pista de la barra', color: 'background-general-gray-sixth' },
                { part: 'Relleno', color: 'background-general-white' },
                { part: 'Píldora', color: 'background-general-gray-sixth' },
                { part: 'Texto', color: 'text-neutral-white', text: 'typography-field-size-xs' },
              ],
            },
            {
              title: 'Con barProps status',
              preview: bar({ distribution: DIST.slice(0, 2), barProps: { status: 'success' } }),
              entries: [
                { part: 'Relleno (success)', color: 'background-semantic-success-tertiary' },
                { part: 'Relleno (error)', color: 'background-semantic-error-tertiary' },
                { part: 'Relleno (alert)', color: 'background-semantic-alert-tertiary' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente RatingBar en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Rating bar en la librería de Assets. Tiene una sola variante (Propiedad 1 = Predeterminada) con cinco filas, una por calificación.
            </>,
            <>
              <strong>Filas:</strong> cada fila es una instancia de Icon Star (<code>IconStar</code> con <code>state=&quot;select&quot;</code> y <code>size=16</code>) junto a una instancia de Progress bar de tipo linear-text. En código las filas salen de <code>distribution</code>.
            </>,
            <>
              <strong>Valores:</strong> en Figma el relleno y el texto de cada fila se editan a mano en la instancia de Progress bar. En código el relleno es <code>count</code> sobre <code>total</code> y el texto sigue a <code>display</code>.
            </>,
            <>
              <strong>Diferencias:</strong> Figma no define <code>display=&quot;count&quot;</code>, <code>barProps</code> ni los nombres accesibles (<code>label</code> y &quot;5 estrellas&quot;); el código los suma.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el RatingBar es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Desglose de reseñas:</strong> muestra cuántas reseñas tiene cada calificación, de 5 a 1, junto al promedio.
            </>,
            <>
              <strong>Porcentaje o cantidad:</strong> usa <code>display=&quot;percentage&quot;</code> para comparar filas y <code>display=&quot;count&quot;</code> cuando importa el número exacto.
            </>,
            <>
              <strong>Lista con nombre:</strong> pasa <code>label</code> para que el lector de pantalla anuncie la lista. Cada barra dice su calificación y su valor, por ejemplo &quot;5 estrellas, 68%&quot;.
            </>,
            <>
              <strong>Reseñas fuera del desglose:</strong> si dejas calificaciones fuera de la lista, pasa <code>total</code> con el total real, nunca menor que la suma de las filas. Las filas sin reseñas se muestran en 0, no se quitan.
            </>,
          ],
          avoid: [
            <>
              <strong>Una sola calificación:</strong> la lista pide el desglose completo. (Alternativa: <code>StarRating</code>).
            </>,
            <>
              <strong>Solo el promedio:</strong> una cifra con su estrella no necesita barras. (Alternativa: <code>NumberRating</code>).
            </>,
            <>
              <strong>Pedir una calificación:</strong> el RatingBar no es interactivo. (Alternativa: <code>StarRating</code> con <code>onChange</code>).
            </>,
            <>
              <strong>Avance de una tarea:</strong> las filas comparan categorías, no miden un progreso. (Alternativa: <code>ProgressBar</code>).
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
                title: 'Desglose de cinco filas',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Medida fija:</strong> filas de 22 de alto, estrella de 16 px, gap de 8 y texto de 12/16, sin variantes por breakpoint.
                  </>,
                ],
                preview: bar(),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medida fija:</strong> filas de 22 de alto, estrella de 16 px, gap de 8 y texto de 12/16.
              </>,
              <>
                <strong>Ancho:</strong> la lista ocupa el ancho del contenedor y la barra absorbe el espacio que sobra entre la estrella y la píldora.
              </>,
            ],
            preview: bar(),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medida fija:</strong> filas de 22 de alto, estrella de 16 px, gap de 8 y texto de 12/16.
              </>,
              <>
                <strong>Ancho:</strong> la lista ocupa el ancho del contenedor y la barra absorbe el espacio que sobra entre la estrella y la píldora.
              </>,
            ],
            preview: bar(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de datos del RatingBar.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Cantidad con pocas reseñas',
              description: 'Muestra la cantidad si hay pocas reseñas: 1 de 3 dice más que un 33%.',
              preview: bar({ display: 'count', distribution: FEW }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Porcentaje con pocas reseñas',
              description: 'No uses porcentaje con pocas reseñas: un 33% parece más de lo que es.',
              preview: bar({ distribution: FEW }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Total de la suma',
              description: 'Deja que el total sea la suma de las filas, para que cada barra sea su parte real.',
              preview: bar(),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Total menor',
              description: 'No fijes un total menor que la suma: la primera fila llena la barra y las demás quedan infladas.',
              preview: bar({ total: 60 }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Las cinco filas',
              description: 'Muestra las cinco calificaciones, también la de 0, para que no falte ninguna.',
              preview: bar({ distribution: [...DIST.slice(0, 4), { stars: 1, count: 0 }] }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Filas omitidas',
              description: 'No quites las filas sin reseñas: parece que falta el dato.',
              preview: bar({ distribution: DIST.slice(0, 4) }),
            },
          ],
        },
      ],
    },
  ],
};
