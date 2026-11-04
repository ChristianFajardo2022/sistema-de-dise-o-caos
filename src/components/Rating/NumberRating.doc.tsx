import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { NumberRating } from './NumberRating';

/*
 * Contenido de la página de documentación de NumberRating (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Rating.types.ts`, `Rating.variants.ts`, `NumberRating.tsx`), luego `NumberRating.docs.json`. Medidas: fila de 18 de
 * alto, número de 14/18 en Semibold, estrella de 16 y gap de 4, iguales en Desktop, Tablet y Mobile.
 * Diferencias con Figma: Figma solo dibuja el número y la estrella; `total` (con el gap extra de 8 antes del texto de
 * reseñas), `label` y el rol `img` son extensiones del código. Figma guarda el número como texto libre (Number); el
 * código recibe `value` y lo formatea. El texto del número trae Medium 500 en el nodo, pero su variable de peso es
 * Semibold: el código usa Semibold.
 * Clasificación: molécula. Combina el número con IconStar, un componente con función propia (como StarRating y
 * RatingBar).
 */

// Figma: 12745:16784 (component Number rating)

type RatingProps = Partial<ComponentProps<typeof NumberRating>>;

/** Calificación de ejemplo con 4,5 de promedio. */
const nr = (props: RatingProps = {}): ReactNode => <NumberRating value={4.5} {...props} />;

const states: DocStateItem[] = [
  {
    label: 'Solo promedio',
    tone: 'neutral',
    description: (
      <>
        Sin <code>total</code>. Dibuja el número y la estrella, sin texto de apoyo.
      </>
    ),
    samples: [nr({ value: 5 }), nr(), nr({ value: 3.7 })],
  },
  {
    label: 'Con total',
    tone: 'neutral',
    description: (
      <>
        Con <code>total</code>. Suma el conteo de reseñas a la derecha, en texto de apoyo.
      </>
    ),
    samples: [nr({ total: 1 }), nr({ total: 12 }), nr({ total: 128 })],
  },
];

export const doc: ComponentDocContent = {
  name: 'NumberRating',
  icon: 'star',
  classification: 'molecula',
  summary:
    'El NumberRating es la molécula que muestra el promedio de una calificación como número junto a una estrella amarilla y, si se pasa, el total de reseñas. No es interactivo y el lector de pantalla lo lee como una sola frase.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una fila con el promedio a la izquierda, una estrella a su derecha y, opcionalmente, el total de reseñas.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Promedio con estrella',
                  preview: nr(),
                  marks: [
                    { n: 1, selector: '[role="img"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Type@29"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="_vector"]', side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: '[data-figma-part="Type@29"]', to: '[data-figma-part="_vector"]' },
                    { kind: 'height', selector: '[role="img"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> fila de 18 de alto, sin padding ni fondo, que mide lo que su contenido. Entre el número y la estrella hay 4 (<code>space/general/md</code>). Es un solo <code>role=&quot;img&quot;</code> con el nombre accesible.
                </>,
                <>
                  <strong>Promedio:</strong> Helvetica Neue Semibold de 14/18 (<code>typography/body/size/md</code>) en <code>text/neutral/white</code>. Lleva coma decimal y un decimal como máximo.
                </>,
                <>
                  <strong>Estrella:</strong> IconStar en <code>select</code> y de 16 px, en <code>icon/semantic/alert-firts</code>. Es decorativa (<code>aria-hidden</code>).
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Promedio con total',
                  preview: nr({ total: 1280 }),
                  marks: [
                    { n: 1, selector: '[role="img"]', side: 'left' },
                    { n: 2, selector: '[role="img"] > span:last-child', side: 'top' },
                  ],
                  dimensions: [{ kind: 'gap', from: '[data-figma-part="_vector"]', to: '[role="img"] > span:last-child' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> crece a la derecha con el total; la altura de la fila no cambia.
                </>,
                <>
                  <strong>Total:</strong> texto de apoyo en Regular y <code>text/neutral/body</code>, con 12 de separación de la estrella (el gap de 4 y 8 propios, <code>space/general/lg</code>). Escribe &quot;reseña&quot; con 1 y &quot;reseñas&quot; con el resto, y separa los miles con punto desde 10.000.
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
          NumberRating tiene 2 variantes de aspecto, según se pase o no <code>total</code>. No es interactivo: no tiene hover, focus ni press y no recibe foco.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens de cada parte. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Promedio con estrella',
              preview: nr(),
              entries: [
                { part: 'Promedio', color: 'text-neutral-white', text: 'typography-body-size-md' },
                { part: 'Estrella', color: 'icon-semantic-alert-firts' },
              ],
            },
            {
              title: 'Total de reseñas',
              preview: nr({ total: 128 }),
              entries: [{ part: 'Total', color: 'text-neutral-body', text: 'typography-body-size-md' }],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente NumberRating en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Number rating en la librería de Assets y arrástralo junto al título. Su única propiedad es Number, el texto del promedio.
            </>,
            <>
              <strong>Number:</strong> en Figma es texto libre (4,5 por defecto). En código es <code>value</code>, un número de 0 a 5 que el componente formatea con coma decimal.
            </>,
            <>
              <strong>Estrella:</strong> es una instancia de Icon Star (Atom) con State select y Size 16. En código es <code>IconStar</code> con <code>state=&quot;select&quot;</code> y <code>size={'{16}'}</code>, y se documenta en StarRating.
            </>,
            <>
              <strong>Diferencias:</strong> Figma no dibuja el total ni el nombre accesible. El código suma <code>total</code>, que escribe las reseñas a la derecha, y <code>label</code>, que reemplaza el nombre accesible.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el NumberRating es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Resumen de calificación en poco espacio:</strong> el promedio y la estrella caben en una línea, por ejemplo en una tarjeta de perfil o en una lista.
            </>,
            <>
              <strong>Promedio con su peso:</strong> pasa <code>total</code> para que se vea sobre cuántas reseñas se calculó.
            </>,
            <>
              <strong>Lectura en una frase:</strong> el lector de pantalla dice &quot;4,5 de 5 estrellas, 1280 reseñas&quot;. El número, la estrella y el total quedan ocultos para no leerlos dos veces.
            </>,
            <>
              <strong>Nombre con contexto:</strong> <code>label</code> reemplaza el nombre accesible cuando la página necesita decir qué se califica.
            </>,
          ],
          avoid: [
            <>
              <strong>Pedir una calificación:</strong> no recibe clic ni foco. (Alternativa: <code>StarRating</code> con <code>onChange</code>).
            </>,
            <>
              <strong>Mostrar las cinco estrellas:</strong> aquí hay una sola estrella, que no dice cuántas se llenan. (Alternativa: <code>StarRating</code> en solo lectura).
            </>,
            <>
              <strong>Mostrar cómo se reparten las reseñas:</strong> el promedio no dice cuántas hay por estrella. (Alternativa: <code>RatingBar</code>).
            </>,
            <>
              <strong>Promedios fuera de 0 a 5:</strong> el componente no los limita y escribe el número tal cual. Valida el dato antes de pasarlo.
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
                title: 'Promedio con total',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Medida fija:</strong> 18 de alto, número de 14/18, estrella de 16 y gap de 4, sin variantes por breakpoint.
                  </>,
                ],
                preview: nr({ total: 128 }),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medida fija:</strong> 18 de alto, número de 14/18, estrella de 16 y gap de 4.
              </>,
              <>
                <strong>Ancho:</strong> mide lo que su contenido y no se estira al 100% del contenedor.
              </>,
            ],
            preview: nr({ total: 128 }),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medida fija:</strong> 18 de alto, número de 14/18, estrella de 16 y gap de 4.
              </>,
              <>
                <strong>Formato:</strong> el promedio lleva coma decimal en los tres breakpoints.
              </>,
            ],
            preview: nr({ total: 128 }),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de datos y de nombre accesible del NumberRating.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Promedio con su total',
              description: (
                <>
                  Pasa <code>total</code> para que se vea cuántas reseñas respaldan el promedio.
                </>
              ),
              preview: nr({ value: 5, total: 3 }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Promedio sin respaldo',
              description: 'No muestres un promedio alto sin total: puede ser una sola opinión.',
              preview: nr({ value: 5 }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Promedio dentro de la escala',
              description: 'Pasa un promedio de 0 a 5.',
              preview: nr({ value: 4.5, total: 12 }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Promedio fuera de la escala',
              description: 'No pases un promedio mayor de 5: el componente no lo limita.',
              preview: nr({ value: 7, total: 12 }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Nombre con contexto',
              description: (
                <>
                  Pasa <code>label</code> con lo que se califica. La muestra se ve igual, pero el lector de pantalla dice más.
                </>
              ),
              preview: nr({ total: 12, label: 'Calificación de la sesión: 4,5 de 5 estrellas, 12 reseñas' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Nombre genérico repetido',
              description: 'No dejes el nombre por defecto si hay varias calificaciones: todas suenan igual.',
              preview: nr({ total: 12 }),
            },
          ],
        },
      ],
    },
  ],
};
