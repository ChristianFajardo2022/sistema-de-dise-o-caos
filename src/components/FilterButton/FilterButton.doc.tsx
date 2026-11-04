import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Button } from '../Button';
import type { ButtonState } from '../Button/Button.types';
import { FilterButton } from './FilterButton';

/*
 * Contenido de la página de documentación de FilterButton (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`FilterButton.types.ts`, `FilterButton.variants.ts`, `FilterButton.tsx`), luego `FilterButton.docs.json`. Las medidas
 * son las del Button que contiene (tertiary md en escritorio y tableta, de solo ícono en móvil). Diferencias con Figma:
 * el set solo dibuja Default e Inactive; Hover, Focus y Press salen del Button Tertiary. El set Icon button+Filters usa
 * en reposo los tokens de Press del Button Secondary low; el código usa los de Default.
 */

// Figma: 14112:4253 (component set Filter button) y 21923:89647 (component set Icon button+Filters)

type FilterButtonOptions = Partial<ComponentProps<typeof FilterButton>>;

/** Botón de ejemplo con tres filtros aplicados; la raíz lleva `data-slot` para la anatomía. */
const fb = (props: FilterButtonOptions = {}) => (
  <FilterButton layout="desktop" count={3} rootProps={{ 'data-slot': 'root' }} {...props} />
);

/**
 * Botón con el estado de interacción forzado. FilterButton no expone `state`: lo recibe el Button interno por las props
 * que se le pasan, solo para documentar.
 */
const forced = (state: ButtonState, props: FilterButtonOptions = {}) =>
  fb({ ...props, ...({ state } as object) });

/** Una muestra de escritorio y una de móvil por estado. */
const stateSamples = (state: ButtonState): ReactNode[] => [forced(state), forced(state, { layout: 'mobile' })];

/** Barra de herramientas de ejemplo: los filtros junto a otra acción. */
const bar = (filters: ReactNode) => (
  <div className="flex items-center gap-ds-space-general-2xl">
    {filters}
    <Button variant="secondary" size="xs">
      Ordenar
    </Button>
  </div>
);

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo. Botón de texto subrayado con chevron, y el contador de filtros aplicados delante.',
    samples: stateSamples('default'),
  },
  {
    label: 'Hover',
    tone: 'accent',
    description: 'Al pasar el puntero. El texto y el ícono cambian a los colores de hover del Button Tertiary.',
    samples: stateSamples('hover'),
  },
  {
    label: 'Focus',
    tone: 'accent',
    description: 'Al recibir el foco del teclado. En escritorio el cambio es mínimo: el Button Tertiary usa casi los mismos colores que en Default y no hay anillo aparte. En móvil aparece el fondo del botón.',
    samples: stateSamples('focus'),
  },
  {
    label: 'Press',
    tone: 'accent',
    description: 'Mientras se presiona. En escritorio el cambio es mínimo, como en Focus; en móvil aparece el fondo del botón.',
    samples: stateSamples('press'),
  },
  {
    label: 'Inactive',
    tone: 'neutral',
    description: (
      <>
        No interactivo (<code>disabled</code>). El botón se atenúa y el contador pasa a su estado Inactive.
      </>
    ),
    samples: [fb({ disabled: true }), fb({ disabled: true, layout: 'mobile' })],
  },
];

export const doc: ComponentDocContent = {
  name: 'FilterButton',
  icon: 'filter',
  classification: 'molecula',
  summary:
    'El FilterButton es la molécula que abre los filtros y dice cuántos hay aplicados. Une un Button Tertiary con un Badge de número. En escritorio muestra texto y chevron; en móvil, solo el ícono de filtro.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una fila une el contador de filtros y el botón; el contador solo aparece cuando hay filtros aplicados.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Escritorio',
                  preview: fb(),
                  marks: [
                    { n: 1, selector: '[data-slot="root"]', side: 'bottom' },
                    { n: 2, selector: '[data-figma-part="Badge"]', side: 'top' },
                    { n: 3, selector: 'button', side: 'bottom' },
                    { n: 4, selector: '[data-slot="label"]', side: 'top' },
                    { n: 5, selector: '[data-figma-part="Icon-sizes"]', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: '[data-figma-part="Badge"]', to: 'button' },
                    { kind: 'height', selector: 'button' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> fila <code>span</code> con el contador y el botón, separados por <code>space/general/lg</code> (8 px). Recibe <code>className</code> y <code>rootProps</code>.
                </>,
                <>
                  <strong>Contador:</strong> Badge de número en Info, de 16 px de alto y tipografía de 10 px. Es decorativo: el botón lo lee como descripción.
                </>,
                <>
                  <strong>Botón:</strong> Button Tertiary md, de 56 px de alto, con padding vertical <code>space/button/lg</code> y sin padding horizontal.
                </>,
                <>
                  <strong>Texto:</strong> &quot;Filtros&quot; por defecto, en 14 px semibold con subrayado. Es el nombre accesible del botón.
                </>,
                <>
                  <strong>Chevron:</strong> ícono <code>chevron-right</code> en relleno, de 20 px, a la derecha del texto con un gap de 8 px.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Móvil',
                  preview: fb({ layout: 'mobile' }),
                  marks: [
                    { n: 1, selector: '[data-slot="root"]', side: 'bottom' },
                    { n: 2, selector: '[data-figma-part="Badge"]', side: 'top' },
                    { n: 3, selector: 'button', side: 'bottom' },
                    { n: 4, selector: '[data-figma-part="Icon-sizes"]', side: 'right' },
                  ],
                  dimensions: [{ kind: 'height', selector: 'button' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> la misma fila, sin separación entre el contador y el botón (<code>gap-0</code>).
                </>,
                <>
                  <strong>Contador:</strong> el mismo Badge de número en Info, pegado al botón.
                </>,
                <>
                  <strong>Botón:</strong> Button Tertiary md de solo ícono, con radio completo. Mide 56 px con los tokens de escritorio y 48 px con los de móvil.
                </>,
                <>
                  <strong>Ícono:</strong> <code>filter</code> en relleno, de 24 px. El texto pasa a ser el nombre accesible (<code>aria-label</code>).
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Botón de ícono con contador',
                  preview: fb({ layout: 'icon' }),
                  marks: [
                    { n: 1, selector: '[data-slot="root"]', side: 'left' },
                    { n: 2, selector: 'button', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Icon-sizes"]', side: 'left' },
                    { n: 4, selector: '[data-figma-part="Badge"]', side: 'right' },
                  ],
                  dimensions: [{ kind: 'height', selector: 'button' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> <code>span</code> de posición relativa que mide lo mismo que el botón.
                </>,
                <>
                  <strong>Botón:</strong> Button Secondary low de solo ícono, con radio completo y trazo de 1 px. Mide 56 px en escritorio y 48 px en móvil.
                </>,
                <>
                  <strong>Ícono:</strong> <code>filter</code> en relleno, de 20 px.
                </>,
                <>
                  <strong>Contador:</strong> Badge de número de 16 px, superpuesto en la esquina inferior derecha del botón.
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
          FilterButton tiene 5 estados. Hover, Focus y Press se fuerzan solo para documentar; en uso salen de la interacción.
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
              title: 'Default',
              preview: fb(),
              entries: [
                { part: 'Texto', color: 'text-button-tertiary-default', text: 'typography-button-size-md-uniform' },
                { part: 'Subrayado', color: 'border-general-gray-fourth' },
                { part: 'Ícono', color: 'icon-button-tertiary-default' },
                { part: 'Contador (fondo)', color: 'background-semantic-information-tertiary' },
                { part: 'Contador (texto)', color: 'text-semantic-information', text: 'typography-body-size-xs' },
              ],
            },
            {
              title: 'Inactive',
              preview: fb({ disabled: true }),
              entries: [
                { part: 'Texto', color: 'text-button-tertiary-inactive' },
                { part: 'Ícono', color: 'icon-button-tertiary-inactive' },
                { part: 'Contador (fondo)', color: 'background-general-gray-seventh' },
                { part: 'Contador (texto)', color: 'text-neutral-disabled-on-canva' },
              ],
            },
            {
              title: 'Botón de ícono',
              preview: fb({ layout: 'icon' }),
              entries: [
                { part: 'Borde', color: 'border-button-secondary-low-default' },
                { part: 'Ícono', color: 'icon-button-secondary-low-default' },
                { part: 'Contador (fondo)', color: 'background-acent-tertiary' },
                { part: 'Contador (texto)', color: 'text-neutral-white-unicolor' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente FilterButton en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Filter button en la librería de Assets y arrástralo al lienzo. Sus propiedades son Type y Badge. El texto del botón y el número se editan dentro del componente.
            </>,
            <>
              <strong>Type y Badge:</strong> Default es el botón activo e Inactive equivale a <code>disabled</code>. Badge, un booleano, equivale a <code>badge</code>; el número es <code>count</code>.
            </>,
            <>
              <strong>Marcos Desktop y Mobile:</strong> cada variante trae los dos marcos, que corresponden a <code>layout=&quot;desktop&quot;</code> y <code>layout=&quot;mobile&quot;</code>. El valor <code>auto</code> elige según el ancho de la ventana (48 rem) y no existe en Figma.
            </>,
            <>
              <strong>Botón de ícono:</strong> el set Icon button+Filters, con Type Default o Icon+badge, es <code>layout=&quot;icon&quot;</code>. Figma no dibuja Hover, Focus ni Press: vienen del Button.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el FilterButton es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Abrir un panel de filtros:</strong> el botón solo abre; el contenido lo arma <code>FilterPanel</code>. Pasa <code>aria-haspopup=&quot;dialog&quot;</code> y <code>aria-expanded</code> cuando el panel es modal.
            </>,
            <>
              <strong>Mostrar cuántos filtros hay aplicados:</strong> pasa <code>count</code>; con 0 o sin valor el contador no se dibuja.
            </>,
            <>
              <strong>Descripción con la cantidad:</strong> el nombre accesible es &quot;Filtros&quot; y la cantidad se lee como descripción: &quot;3 filtros aplicados&quot;. Cambia <code>countLabel</code> si el texto necesita otro término.
            </>,
            <>
              <strong>Cambiar de marco según el ancho:</strong> con <code>layout=&quot;auto&quot;</code> pasa a solo ícono por debajo de 48 rem.
            </>,
          ],
          avoid: [
            <>
              <strong>Listar los filtros en la página:</strong> el botón solo abre y no muestra opciones. (Alternativa: <code>FilterPanel</code>).
            </>,
            <>
              <strong>Cambiar de vista o de categoría:</strong> el botón no filtra por sí mismo. (Alternativa: <code>FilterTabs</code>).
            </>,
            <>
              <strong>Filtrar por calificación:</strong> necesita su propio selector. (Alternativa: <code>RatingFilter</code>).
            </>,
            <>
              <strong>Acciones que no son filtros:</strong> el ícono y el contador significan filtros. (Alternativa: <code>Button</code>).
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
                title: 'Texto y chevron',
                bullets: [
                  <>
                    <strong>Botón:</strong> 56 px de alto, con texto de 14 px y chevron de 20 px.
                  </>,
                  <>
                    <strong>Contador:</strong> 16 px de alto, a 8 px del botón.
                  </>,
                ],
                preview: fb(),
              },
              {
                title: 'Botón de ícono',
                bullets: [
                  <>
                    <strong>Botón:</strong> 56 × 56 px, con ícono de 20 px.
                  </>,
                  <>
                    <strong>Contador:</strong> 16 px, en la esquina inferior derecha.
                  </>,
                ],
                preview: fb({ layout: 'icon' }),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Solo ícono:</strong> el texto sale del botón y queda como nombre accesible.
              </>,
              <>
                <strong>Botón:</strong> 48 px de alto, con los tokens responsive de Mobile, e ícono de 24 px.
              </>,
              <>
                <strong>Contador:</strong> 16 px de alto, pegado al botón.
              </>,
            ],
            preview: fb({ layout: 'mobile' }),
          },
          tablet: {
            bullets: [
              <>
                <strong>Texto y chevron:</strong> con <code>layout=&quot;auto&quot;</code> se mantiene el marco de escritorio desde 48 rem.
              </>,
              <>
                <strong>Botón:</strong> 56 px de alto, los mismos valores que Desktop.
              </>,
              <>
                <strong>Contador:</strong> 16 px de alto, a 8 px del botón.
              </>,
            ],
            preview: fb(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de contador, texto del botón y número de botones de filtros por vista.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Cifra con tope',
              description: <>Pasa <code>count</code> como &quot;99+&quot; cuando haya muchos filtros.</>,
              preview: fb({ count: '99+' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Cifra completa',
              description: 'No pases cifras largas: el contador de 16 px no las contiene.',
              preview: fb({ count: 1250 }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Texto de una palabra',
              description: 'Deja el texto corto: el botón cabe junto al resto de la barra.',
              preview: bar(fb()),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Texto largo',
              description: 'No escribas una frase: el botón crece y empuja el resto de la barra.',
              preview: bar(fb({ children: 'Filtrar resultados por fecha y estado' })),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Un botón por vista',
              description: 'Deja un solo botón de filtros por vista, con un único panel.',
              preview: bar(fb()),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Botones repetidos',
              description: 'No repitas el botón: cada uno parece abrir filtros distintos.',
              preview: (
                bar(
                  <>
                    {fb()}
                    {fb({ count: 1 })}
                  </>
                )
              ),
            },
          ],
        },
      ],
    },
  ],
};
