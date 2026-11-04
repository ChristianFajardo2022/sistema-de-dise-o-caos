import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { StarRating } from '../Rating';
import { RatingFilter } from './RatingFilter';

/*
 * Contenido de la página de documentación de RatingFilter (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`RatingFilter.types.ts`, `RatingFilter.variants.ts`, `RatingFilter.tsx`), luego `RatingFilter.docs.json`. El filtro
 * une un Slider (Slide bar de Figma) y un StarRating de 32 (Star rating de Figma); los dos se documentan como
 * componentes aparte. Medidas: raíz en columna con separación de 16 (`space/general/2xl`) y ancho del contenedor (Figma
 * lo fija en 300). Diferencias con Figma: Figma solo dibuja el valor (Type Default y 1 a 4); el código agrega foco de
 * 2 px, estado deshabilitado (opacidad de 50%), teclado y las estrellas como atajo con puntero. Figma pinta la pista con
 * `background/general/gray-fifth` y el tramo con `gray-firts`; el código usa los del Slider (`gray-sixth` y
 * `gray-secondary`).
 */

// Figma: 13725:72539 (component set Rating, página Filter)

type RatingFilterSampleProps = Partial<ComponentProps<typeof RatingFilter>>;

/** RatingFilter de ejemplo con 4 estrellas o más (Type=3 de Figma). El nombre accesible lo da `label`. */
const rating = (props: RatingFilterSampleProps = {}) => <RatingFilter defaultValue={4} {...props} />;

/** Ancho de ejemplo: el filtro ocupa el ancho del contenedor, así que el marco le fija uno que cabe en el teléfono. */
const box = (...items: ReactNode[]) => (
  <div className="flex w-72 min-w-44 max-w-full flex-col gap-ds-primitives-space-6xl">{items.map((item, i) => <Fragment key={i}>{item}</Fragment>)}</div>
);

/** Contorno de foco como lo dibuja el pulgar con el teclado: se fuerza para documentarlo. */
const focused = (...items: ReactNode[]) => (
  <div className="[&_[role=slider]]:outline-2 [&_[role=slider]]:outline-offset-2 [&_[role=slider]]:outline-solid [&_[role=slider]]:outline-ds-border-field-active">
    {box(...items)}
  </div>
);

/** Filtro con un título visible encima, enlazado por `aria-labelledby`. */
const titled = (id: string, title: string, props: RatingFilterSampleProps = {}) => (
  <div className="flex w-full flex-col gap-ds-space-general-lg">
    <span id={id} className="text-ds-typography-body-size-md leading-ds-typography-body-line-height-short-md text-ds-text-neutral-white">
      {title}
    </span>
    <RatingFilter aria-labelledby={id} {...props} />
  </div>
);

const ROOT = 'div:has(> [data-figma-part="Slide bar"])';

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: (
      <>
        Sin filtro (<code>value</code> en <code>null</code>). El pulgar queda al inicio de la pista y ninguna estrella se enciende.
      </>
    ),
    samples: [box(<RatingFilter defaultValue={null} label="Calificación sin filtro" />)],
  },
  {
    label: 'Con calificación',
    tone: 'accent',
    description: 'Con una calificación mínima de 2 a 5. El pulgar avanza en pasos de 25% y las estrellas se encienden hasta el valor.',
    samples: [box(rating({ label: 'Calificación de 4 estrellas' }))],
  },
  {
    label: 'Focus',
    tone: 'accent',
    description: 'Al llegar con el teclado. El pulgar dibuja un contorno de 2 px, separado 2 px. Las estrellas no reciben foco.',
    samples: [focused(rating({ label: 'Calificación con foco' }))],
  },
  {
    label: 'Disabled',
    tone: 'neutral',
    description: (
      <>
        Sin respuesta (<code>disabled</code>). Conserva el valor y baja la opacidad a 50%. Ni el slider ni las estrellas responden.
      </>
    ),
    samples: [box(rating({ disabled: true, label: 'Calificación deshabilitada' }))],
  },
];

export const doc: ComponentDocContent = {
  name: 'RatingFilter',
  icon: 'filter',
  classification: 'molecula',
  summary:
    'El RatingFilter es la molécula para filtrar por calificación mínima. Une un Slider de cinco posiciones con una fila de cinco estrellas que refleja el valor. La primera posición es Sin filtro; las demás van de 2 a 5 estrellas o más.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una columna con un Slider arriba y una fila de estrellas debajo. El slider elige el valor y las estrellas lo repiten a la vista.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Con 4 estrellas o más',
                  preview: box(rating({ label: 'Calificación de 4 estrellas' })),
                  marks: [
                    { n: 1, selector: ROOT, side: 'left' },
                    { n: 2, selector: '[data-figma-part="Slide bar"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Rectangle 2"]', side: 'top' },
                    { n: 4, selector: '[data-figma-part="Star rating"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: '[data-figma-part="Slide bar"]', to: '[data-figma-part="Star rating"]', axis: 'y' },
                    { kind: 'height', selector: '[data-figma-part="Star rating"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Raíz:</strong> columna que ocupa el ancho del contenedor. Separa el slider de las estrellas con 16 (<code>space/general/2xl</code>).
                </>,
                <>
                  <strong>Slide bar:</strong> un Slider de un pulgar con cinco posiciones, una cada 25%. Mide 6 de alto: pista de 4 y 1 de padding arriba y abajo.
                </>,
                <>
                  <strong>Pulgar:</strong> círculo de 16 que elige la calificación mínima. Su centro recorre la pista sin salirse.
                </>,
                <>
                  <strong>Star rating:</strong> cinco estrellas de 32 (StarRating <code>md</code>) repartidas a todo el ancho. Van en amarillo hasta el valor y en gris desde ahí.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Sin filtro',
                  preview: box(<RatingFilter defaultValue={null} label="Calificación sin filtro" />),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Rectangle 2"]', side: 'top' },
                    { n: 2, selector: '[data-figma-part="Star rating"] > span', index: 0, side: 'bottom' },
                  ],
                  dimensions: [{ kind: 'height', selector: '[data-figma-part="Star rating"] > span', index: -1 }],
                },
              ],
              guidelines: [
                <>
                  <strong>Pulgar al inicio:</strong> la primera posición es Sin filtro. No existe &quot;1 estrella o más&quot;, porque toda calificación es de 1 o más.
                </>,
                <>
                  <strong>Estrellas apagadas:</strong> las cinco en gris. La primera estrella, al pulsarla, también vuelve a Sin filtro.
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
          RatingFilter tiene 4 estados: Default, Con calificación, Focus y Disabled. No hay prop <code>state</code>: salen del valor, del teclado y de <code>disabled</code>, así que Focus se fuerza solo para documentarlo. No tiene Hover: el puntero solo cambia el cursor.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Slide bar',
              preview: box(rating({ label: 'Calificación de 4 estrellas' })),
              entries: [
                { part: 'Pista', color: 'background-general-gray-sixth' },
                { part: 'Tramo seleccionado', color: 'background-general-gray-secondary' },
                { part: 'Pulgar', color: 'background-general-white-unicolor' },
                { part: 'Contorno del pulgar', color: 'border-general-gray-fourth' },
                { part: 'Contorno de foco (aparece en Focus)', color: 'border-field-active' },
              ],
            },
            {
              title: 'Star rating',
              preview: box(rating({ label: 'Calificación de 4 estrellas' })),
              entries: [
                { part: 'Estrella encendida', color: 'icon-semantic-alert-firts' },
                { part: 'Estrella apagada', color: 'icon-general-gray-low-contrast' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente RatingFilter en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Rating en la página Filter de la librería de Assets. Tiene una sola propiedad, Type, con cinco valores: Default, 1, 2, 3 y 4.
            </>,
            <>
              <strong>Type:</strong> Default es sin filtro y en código es <code>value=&#123;null&#125;</code>. De 1 a 4 es la calificación mínima desplazada en uno: Type 1 son 2 estrellas, Type 2 son 3, Type 3 son 4 y Type 4 son 5, que en código es <code>value</code> de 2 a 5.
            </>,
            <>
              <strong>Partes:</strong> cada set trae una instancia Slide bar (<code>Slider</code>) y una instancia Star rating (<code>StarRating</code> de 32). Fíjate en ellas para cambiar los tokens de cada parte.
            </>,
            <>
              <strong>Lo que Figma no tiene:</strong> Type es solo el valor, así que Focus, Disabled y el teclado no existen en Figma. El código agrega un contorno de 2 px, <code>disabled</code> con opacidad de 50% y las estrellas como atajo con puntero. Figma fija el ancho en 300; el código ocupa el del contenedor.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el RatingFilter es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Filtrar por calificación mínima:</strong> deja ver los resultados con &quot;3 estrellas o más&quot;. Un solo valor, de 2 a 5 estrellas.
            </>,
            <>
              <strong>Sin filtro:</strong> la primera posición devuelve <code>null</code> en <code>onValueChange</code>. Es el valor inicial.
            </>,
            <>
              <strong>Teclado:</strong> el control es el slider. Las flechas cambian el valor, Inicio vuelve a Sin filtro y Fin llega a 5 estrellas.
            </>,
            <>
              <strong>Puntero:</strong> las estrellas son un atajo y están ocultas a los lectores de pantalla, que solo anuncian el slider (&quot;3 estrellas o más&quot;).
            </>,
            <>
              <strong>Nombre y formulario:</strong> pasa <code>label</code> o <code>aria-labelledby</code> con el título visible. <code>name</code> envía el valor en un formulario.
            </>,
          ],
          avoid: [
            <>
              <strong>Mostrar un puntaje:</strong> el filtro es un control, no un dato. (Alternativa: <code>StarRating</code> o <code>NumberRating</code>).
            </>,
            <>
              <strong>Agrupar varios filtros:</strong> el RatingFilter es un solo control, sin título ni botón de aplicar. (Alternativa: <code>FilterPanel</code>, que lo usa como contenido de una sección).
            </>,
            <>
              <strong>Calificar un elemento:</strong> aquí se elige un mínimo, no una opinión. (Alternativa: <code>StarRating</code> interactivo).
            </>,
            <>
              <strong>Filtrar entre dos calificaciones:</strong> el filtro solo tiene un mínimo. (Alternativa: <code>Slider</code> de rango).
            </>,
            <>
              <strong>Mostrar cuántas reseñas tiene cada calificación:</strong> el filtro no cuenta. (Alternativa: <code>RatingBar</code>).
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
                title: 'Sin filtro',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Pulgar:</strong> al inicio de la pista. Las estrellas son de 32 y quedan apagadas.
                  </>,
                ],
                preview: box(<RatingFilter defaultValue={null} label="Calificación sin filtro" />),
              },
              {
                title: 'Con calificación',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Separación:</strong> 16 (<code>space/general/2xl</code>) entre el slider y las estrellas.
                  </>,
                ],
                preview: box(rating({ label: 'Calificación de 4 estrellas' })),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medidas fijas:</strong> slider de 6 de alto con pulgar de 16 y estrellas de 32. Solo el ancho se adapta al contenedor.
              </>,
              <>
                <strong>Toque:</strong> el slider y las estrellas responden al dedo. Las estrellas dejan una zona de toque de 32, mayor que los 24 mínimos.
              </>,
            ],
            preview: box(rating({ label: 'Calificación de 4 estrellas' })),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medidas fijas:</strong> slider de 6 de alto con pulgar de 16 y estrellas de 32.
              </>,
              <>
                <strong>Ancho:</strong> ocupa el del contenedor y las estrellas se reparten en él. Figma lo dibuja de 300.
              </>,
            ],
            preview: box(rating({ label: 'Calificación de 4 estrellas' })),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de valor inicial, título y uso del filtro.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Arranque sin filtro',
              description: 'Deja el filtro sin valor al inicio, para que nada se oculte sin que la persona lo pida.',
              preview: <RatingFilter defaultValue={null} label="Calificación sin filtro" />,
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Arranque filtrado',
              description: 'Evita arrancar con una calificación elegida: oculta resultados desde el primer momento.',
              preview: <RatingFilter defaultValue={5} label="Calificación de 5 estrellas" />,
            },
            {
              kind: 'do',
              framed: true,
              title: 'Con título visible',
              description: (
                <>
                  Pon un título encima y enlázalo con <code>aria-labelledby</code>.
                </>
              ),
              preview: titled('rating-filter-titulo-do', 'Calificación', { defaultValue: 4 }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Sin título visible',
              description: 'Evita dejar las estrellas solas: no dicen qué se filtra.',
              preview: <RatingFilter defaultValue={4} label="Calificación de 4 estrellas" />,
            },
            {
              kind: 'do',
              framed: true,
              title: 'Puntaje de solo lectura',
              description: (
                <>
                  Muestra un puntaje con <code>StarRating</code>.
                </>
              ),
              preview: <StarRating value={4} size="md" />,
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Puntaje en un filtro',
              description: 'Evita el filtro para mostrar un dato: parece un control y el slider invita a moverlo.',
              preview: <RatingFilter value={4} label="Calificación de 4 estrellas" />,
            },
          ],
        },
      ],
    },
  ],
};
