import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { ScrollArea } from './ScrollArea';

/*
 * Contenido de la página de documentación de Scroll area (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`ScrollArea.types.ts`, `ScrollArea.variants.ts`, `ScrollArea.tsx`), luego `ScrollArea.docs.json`. Diferencias con Figma:
 * Figma solo dibuja la barra (riel y pulgar, 6 × 314, con un slot Scroll); el código es el contenedor con desplazamiento
 * nativo y le aplica esa barra con pseudo-elementos. El alto del pulgar (71 en Figma) lo calcula el navegador. Figma no
 * dibuja el foco, el eje horizontal, el espacio con la barra ni el nombre accesible.
 */

// Figma: 11189:8771 (component Scroll bar)

type AreaProps = Partial<ComponentProps<typeof ScrollArea>>;

/** Lista de ejemplo de `n` filas; con `wide` es más ancha que el área (desplazamiento horizontal). */
const list = (n: number, wide = false, framed = false) => (
  <ul
    data-slot="content"
    className={`m-0 list-none p-0 text-ds-typography-body-size-sm text-ds-text-neutral-body ${wide ? 'w-[40rem]' : ''}`}
  >
    {Array.from({ length: n }, (_, i) => (
      <li
        key={i}
        className={framed ? 'mb-ds-space-general-md rounded-sm border border-ds-border-general-default-on-card px-ds-space-general-lg py-ds-space-general-md' : 'py-1'}
      >
        {`Documento ${i + 1}`}
      </li>
    ))}
  </ul>
);

/** Área de muestra. `label` da un nombre distinto a cada región de la página (axe `landmark-unique`). */
const area = (label: string, props: AreaProps = {}, rows = 14, wide = false, framed = false) => (
  <ScrollArea aria-label={label} className="w-64" data-slot="area" maxHeight="9rem" {...props}>
    {list(rows, wide, framed)}
  </ScrollArea>
);

/** Con el foco del teclado forzado: las mismas clases que dibuja `focus-visible`, para poder mostrarlo. */
const FOCUS = 'outline-2 outline-offset-2 outline-solid outline-ds-border-field-active';

const states: DocStateItem[] = [
  {
    label: 'Sin desborde',
    tone: 'neutral',
    description: 'El contenido cabe. El área no es región ni entra en el orden de tabulación, y no muestra barra.',
    samples: [area('Sin desborde', { maxHeight: '20rem' }, 3)],
  },
  {
    label: 'Con desborde',
    tone: 'neutral',
    description: (
      <>
        El contenido supera el área. Pasa a <code>role=&quot;region&quot;</code> con <code>tabIndex=&#123;0&#125;</code> y muestra la barra.
      </>
    ),
    samples: [area('Con desborde')],
  },
  {
    label: 'Focus',
    tone: 'accent',
    description: 'Con el teclado, el área recibe un contorno de 2 px. Con él, las flechas, RePág, AvPág, Inicio y Fin desplazan el contenido.',
    samples: [area('Con foco', { className: `w-64 ${FOCUS}` })],
  },
];

/** Marcos de los Do / Don't: un ancho de teléfono, sin anchos propios. */
const frame = (node: ReactNode) => <div className="w-full">{node}</div>;

export const doc: ComponentDocContent = {
  name: 'Scroll area',
  icon: 'row-vertical',
  classification: 'atomo',
  summary:
    'El Scroll area es el átomo que limita el alto o el ancho de un contenido y lo hace desplazable con la barra del sistema de diseño. Usa el desplazamiento nativo, así que funciona con rueda, toque y teclado, y se anuncia como región cuando desborda.',
  definition: [
    {
      title: 'Anatomía',
      description:
        'Un contenedor con desplazamiento nativo, el contenido que desplaza y una barra con riel y pulgar. Cambia el eje con la prop orientation.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Vertical',
                  preview: area('Anatomía vertical', { scrollbarGap: 'lg', maxHeight: '9rem' }),
                  marks: [
                    { n: 1, selector: '[data-slot="area"]', side: 'left' },
                    { n: 2, selector: '[data-slot="content"]', side: 'top' },
                    { n: 3, selector: '[data-slot="area"]', side: 'right' },
                  ],
                  dimensions: [{ kind: 'padding', selector: '[data-slot="area"]', side: 'right' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> un <code>div</code> con <code>overflow-y-auto</code> y el alto limitado por <code>maxHeight</code>. Sin desborde es un <code>div</code> sin rol; con desborde, una región con <code>aria-label</code> y <code>tabIndex=&#123;0&#125;</code>.
                </>,
                <>
                  <strong>Contenido:</strong> lo que pasa en <code>children</code>. Puede no ser enfocable: el teclado desplaza el contenedor.
                </>,
                <>
                  <strong>Barra:</strong> riel y pulgar de 6 px con radio completo (<code>radius/button/full</code>). El pulgar mide lo que calcula el navegador según el contenido visible. <code>scrollbarGap</code> deja entre el contenido y la barra 4 (<code>md</code>), 8 (<code>lg</code>) o 12 px (<code>xl</code>), y la cota muestra el de esta muestra.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Horizontal',
                  preview: area('Anatomía horizontal', { orientation: 'horizontal', scrollbarGap: 'lg', maxHeight: undefined }, 3, true, true),
                  marks: [
                    { n: 1, selector: '[data-slot="area"]', side: 'left' },
                    { n: 2, selector: '[data-slot="content"]', side: 'top' },
                    { n: 3, selector: '[data-slot="area"]', side: 'bottom' },
                  ],
                  dimensions: [{ kind: 'padding', selector: '[data-slot="area"]', side: 'bottom' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> con <code>orientation=&quot;horizontal&quot;</code> usa <code>overflow-x-auto</code> y recorta el eje vertical. Con <code>both</code> desplaza los dos ejes.
                </>,
                <>
                  <strong>Contenido:</strong> más ancho que el área. El área no fija su ancho: lo da el contenedor padre.
                </>,
                <>
                  <strong>Barra:</strong> va abajo y el espacio de <code>scrollbarGap</code> se aplica en el lado inferior. Con ambos ejes se aplica en el derecho y en el inferior.
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
          Scroll area tiene 3 estados, que salen de su contenido y del teclado. No tiene prop <code>state</code>: el foco de la muestra se fuerza con las clases del contorno solo para documentar. Hover y Press los resuelve el navegador sobre la barra.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens de la barra y del foco. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Barra',
              preview: area('Tokens de la barra'),
              entries: [
                { part: 'Riel', color: 'background-general-gray-sixth' },
                { part: 'Pulgar', color: 'background-general-gray-firts' },
              ],
            },
            {
              title: 'Foco',
              preview: area('Tokens del foco', { className: `w-64 ${FOCUS}` }),
              entries: [{ part: 'Contorno de foco (aparece en Focus)', color: 'border-field-active' }],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Scroll area en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Scroll bar en la librería de Assets. Mide 6 × 314 y tiene una sola propiedad, el slot Scroll. En código es <code>ScrollArea</code>.
            </>,
            <>
              <strong>Solo la barra:</strong> Figma dibuja el riel (<code>background/general/gray-sixth</code>) y el pulgar de 71 de alto (<code>background/general/gray-firts</code>), ambos con <code>radius/button/full</code>. El código dibuja esa barra sobre un contenedor con desplazamiento nativo y deja el alto del pulgar al navegador.
            </>,
            <>
              <strong>Espacio con la barra:</strong> el Scroll bar de Figma se coloca a 8 del contenido. En código es <code>scrollbarGap=&quot;lg&quot;</code>; por defecto es <code>none</code>.
            </>,
            <>
              <strong>Lo que Figma no tiene:</strong> el eje horizontal y el de ambos (<code>orientation</code>), el límite de alto (<code>maxHeight</code>), el foco con teclado y el nombre accesible (<code>aria-label</code>, obligatorio).
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Scroll area es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Listas largas en un espacio fijo:</strong> limita el alto con <code>maxHeight</code> (<code>20rem</code>, <code>314px</code>, <code>50vh</code>). Sin él, el área crece con su contenido y no desplaza.
            </>,
            <>
              <strong>Contenido más ancho que su marco:</strong> con <code>orientation=&quot;horizontal&quot;</code> o <code>both</code>, como una galería o una vista ampliada.
            </>,
            <>
              <strong>Región que se desplaza con teclado:</strong> con desborde, el área es una región enfocable con <code>aria-label</code>. Flechas, RePág, AvPág, Inicio y Fin desplazan aunque el contenido no tenga nada enfocable.
            </>,
            <>
              <strong>Contenido con bordes o fondos:</strong> agrega <code>scrollbarGap</code> para separar las filas de la barra.
            </>,
          ],
          avoid: [
            <>
              <strong>Elegir una opción de una lista larga:</strong> el área solo desplaza y no gestiona la selección. (Alternativa: <code>Select</code>).
            </>,
            <>
              <strong>Recorrer muchos registros por páginas:</strong> una lista que crece sin tope se vuelve difícil de recorrer. (Alternativa: <code>Pagination</code>).
            </>,
            <>
              <strong>Contenido que cabe:</strong> sin desborde no hay barra ni región; usa un contenedor normal.
            </>,
            <>
              <strong>Áreas dentro de áreas:</strong> la rueda cambia de contenedor al llegar al borde y desorienta. Deja una sola.
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
                title: 'Vertical',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Barra de 6 px:</strong> en Chrome y Safari. Firefox usa <code>scrollbar-width: thin</code> con los mismos colores y decide el ancho.
                  </>,
                ],
                preview: area('Desktop vertical', { scrollbarGap: 'lg' }),
              },
              {
                title: 'Horizontal',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> el eje y el espacio de la barra son los mismos en todo ancho.
                  </>,
                  <>
                    <strong>Ancho del padre:</strong> el área ocupa el que le da su contenedor y desplaza lo que lo supera.
                  </>,
                ],
                preview: area('Desktop horizontal', { orientation: 'horizontal', scrollbarGap: 'lg', maxHeight: undefined }, 3, true, true),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Barra del sistema:</strong> en móviles y en macOS con barras superpuestas, el sistema puede ocultarla hasta que desplazas.
              </>,
              <>
                <strong>Toque y teclado:</strong> el desplazamiento nativo responde al toque; la región sigue enfocable con teclado externo.
              </>,
            ],
            preview: area('Mobile', { scrollbarGap: 'lg' }),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Tokens iguales:</strong> el espacio <code>space/general/*</code> y el radio de la barra no cambian entre breakpoints.
              </>,
              <>
                <strong>Alto fijo:</strong> <code>maxHeight</code> no depende del ancho; si el área debe crecer en pantallas altas, usa un valor relativo como <code>50vh</code>.
              </>,
            ],
            preview: area('Tablet', { scrollbarGap: 'lg' }),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de nombre, alto y espacio de la barra.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Nombre por contenido',
              description: 'El nombre no se ve y lo anuncia el lector de pantalla: usa lo que contiene, como Documentos recientes.',
              preview: frame(area('Documentos recientes')),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Nombre genérico',
              description: 'No uses nombres genéricos como Contenido: el lector de pantalla lo anuncia y no dice qué hay dentro.',
              preview: frame(area('Contenido')),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Alto limitado',
              description: 'Limita el alto con maxHeight para que el área desplace.',
              preview: frame(area('Alto limitado', { maxHeight: '8rem' }, 8)),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Alto sin límite',
              description: 'No omitas maxHeight en un padre sin alto: el área crece y no desplaza.',
              preview: frame(area('Alto sin límite', { maxHeight: undefined }, 8)),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Espacio con la barra',
              description: 'Separa de la barra las filas con borde con scrollbarGap.',
              preview: frame(area('Con espacio', { scrollbarGap: 'lg', maxHeight: '9rem' }, 6, false, true)),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Filas pegadas',
              description: 'No dejes las filas con borde pegadas a la barra.',
              preview: frame(area('Sin espacio', { scrollbarGap: 'none', maxHeight: '9rem' }, 6, false, true)),
            },
          ],
        },
      ],
    },
  ],
};
