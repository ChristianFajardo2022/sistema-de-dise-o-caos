import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { FilterPanel } from './FilterPanel';
import { FilterSection } from './FilterSection';
import type { FilterSectionField } from './FilterPanel.types';
import { Chip, ChipGroup } from '../Chip';
import { FilterButton } from '../FilterButton';
import { RatingFilter } from '../RatingFilter';
import { cn } from '../../utils/cn';

/*
 * Contenido de la página de documentación de FilterPanel (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`FilterPanel.types.ts`, `FilterPanel.variants.ts`, `FilterPanel.tsx`, `FilterSection.tsx`), luego los `*.docs.json`.
 * FilterSection, la sección de cada filtro, se documenta dentro de esta página: dos grupos de Anatomía (card y plain),
 * tres columnas de Estados (Default, Dropdown y Con filtros), dos grupos de Tokens y viñetas de Uso en Figma.
 * Las muestras usan el panel sin modal (`modal={false}`): el modal se abre en la capa superior y no se puede medir.
 * Medidas: panel de 416 de ancho; padding 24 y separación 32 desde 48rem; en Mobile, hoja con padding 16/20/32,
 * separación 24 y radios de 16 arriba. Diferencias con Figma: Figma no dibuja el resumen de filtros, el conteo, el
 * Limpiar de cada sección, el foco ni el modo sin modal. Figma enlaza `gap/canva/default` (32/24/20) en la separación
 * entre zonas; no existe en tokens.css y el código usa `space/general/4xl` (32 desde 48rem, 24 en Mobile).
 */

// Figma: 14014:6050 (componente Filters), 15489:48186 (Individual filter) y 13874:43337 (component set Atoms)

type PanelProps = Partial<ComponentProps<typeof FilterPanel>>;
type SectionProps = Partial<ComponentProps<typeof FilterSection>>;

const ESTADOS: [string, string][] = [
  ['pendiente', 'Pendiente'],
  ['revision', 'En revisión'],
  ['aprobado', 'Aprobado'],
];

const TIPOS: [string, string][] = [
  ['informe', 'Informe'],
  ['acta', 'Acta'],
  ['presentacion', 'Presentación'],
];

/** Chips de selección múltiple unidos a la sección (función hija de FilterSection). */
const chips =
  (options: [string, string][]) =>
  ({ value, onValueChange, labelId }: FilterSectionField) => (
    <ChipGroup selectionMode="multiple" aria-labelledby={labelId} value={(value as string[] | undefined) ?? []} onValueChange={onValueChange} className="flex-wrap">
      {options.map(([v, label]) => (
        <Chip key={v} value={v} icon={false}>
          {label}
        </Chip>
      ))}
    </ChipGroup>
  );

const estadoChips = chips(ESTADOS);
const tipoChips = chips(TIPOS);

/** Sección Estado (card) con chips. */
const estado = (props: SectionProps = {}) => (
  <FilterSection id="estado" title="Estado" {...props}>
    {estadoChips}
  </FilterSection>
);

/** Sección Calificación (card) con RatingFilter. */
const calificacion = (props: SectionProps = {}) => (
  <FilterSection id="calificacion" title="Calificación" {...props}>
    {({ value, onValueChange, labelId }) => (
      <RatingFilter aria-labelledby={labelId} value={(value as number | null | undefined) ?? null} onValueChange={onValueChange} />
    )}
  </FilterSection>
);

/** Sección suelta (plain): título y chips sin tarjeta. */
const plain = (props: SectionProps = {}) => (
  <div className="w-96 max-w-full">
    <FilterSection id="tipo" variant="plain" title="Tipo de documento" {...props}>
      {tipoChips}
    </FilterSection>
  </div>
);

/** Superficie del panel (`background/container/default-on-canva`): las secciones card van sobre ella. */
const onPanel = (node: ReactNode, wide = false) => (
  <div
    className={cn(
      'max-w-full rounded-ds-radius-container-on-canva bg-ds-background-container-default-on-canva p-ds-space-general-3xl',
      wide ? 'w-104' : 'w-80'
    )}
  >
    {node}
  </div>
);

/** Panel sin modal (en el flujo) con las secciones que se le pasen. */
const panel = (props: PanelProps, ...sections: ReactNode[]) => (
  <FilterPanel modal={false} {...props}>
    {sections.map((s, i) => (
      <Fragment key={i}>{s}</Fragment>
    ))}
  </FilterPanel>
);

/** Panel completo de la anatomía: cerrar, resumen con un filtro, Estado abierta y Calificación plegada. */
const fullPanel = (title: string) =>
  panel(
    { title, onOpenChange: () => {}, defaultValue: { estado: ['aprobado'] }, defaultOpenSections: ['estado'] },
    estado(),
    calificacion()
  );

/** Panel compacto: dos secciones plegadas. */
const compactPanel = (title: string, props: PanelProps = {}) =>
  panel({ title, onOpenChange: () => {}, defaultOpenSections: [], ...props }, estado(), calificacion());

const states: DocStateItem[] = [
  {
    label: 'Oculto',
    tone: 'neutral',
    description: (
      <>
        Con <code>modal</code> y cerrado, el panel no se dibuja. Lo abre un FilterButton con el total de filtros aplicados.
      </>
    ),
    samples: [<FilterButton key="boton" count={2} />],
  },
  {
    label: 'Abierto',
    tone: 'accent',
    description: (
      <>
        Con <code>open</code>, muestra título, secciones y acciones. Como modal, atrapa el foco y deja inerte el resto de la página.
      </>
    ),
    samples: [compactPanel('Filtros')],
  },
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Sección plegada: solo el encabezado. El control queda oculto y fuera del orden de tabulación.',
    samples: [onPanel(estado({ defaultOpen: false }), true)],
  },
  {
    label: 'Dropdown',
    tone: 'accent',
    description: 'Sección abierta, el estado inicial de todas. El control aparece bajo el encabezado y el Button corner gira.',
    samples: [onPanel(estado(), true)],
  },
  {
    label: 'Con filtros',
    tone: 'accent',
    description: 'La sección con valor suma un Badge con el conteo y su botón Limpiar. El panel agrega un chip al resumen.',
    samples: [
      panel(
        { title: 'Filtrar resultados', onOpenChange: () => {}, defaultValue: { estado: ['pendiente', 'aprobado'] }, defaultOpenSections: ['estado'] },
        estado(),
        calificacion()
      ),
    ],
  },
];

export const doc: ComponentDocContent = {
  name: 'FilterPanel',
  icon: 'filter-edit',
  classification: 'composicion',
  summary:
    'El FilterPanel es la composición que reúne los filtros de una vista: título, resumen de lo elegido, secciones plegables y las acciones Limpiar y Aplicar. Incluye FilterSection, la sección de cada filtro. Se abre como panel lateral o, en móvil, como hoja inferior.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una superficie en columna con encabezado, resumen, secciones y acciones. Cada sección es una FilterSection: tarjeta plegable (card) o título con su control (plain).',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Panel con un filtro elegido',
                  preview: fullPanel('Filtros avanzados'),
                  marks: [
                    { n: 1, selector: 'section > div', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Filtros avanzados"]', side: 'top' },
                    { n: 3, selector: 'button[aria-label="Cerrar filtros"]', side: 'right' },
                    { n: 4, selector: '[aria-label="Filtros seleccionados"]', side: 'left' },
                    { n: 5, selector: '[data-accordion-root]', side: 'right' },
                    { n: 6, selector: '[data-figma-part="Buttons"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: 'section > div', side: 'left' },
                    { kind: 'gap', from: '[aria-label="Filtros seleccionados"]', to: '[data-accordion-root]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> 416 de ancho, padding de 24 (<code>space/general/3xl</code>) y separación de 32 entre zonas (<code>space/general/4xl</code>). Radios de 32 a la izquierda (<code>radius/container/on-canva</code>) y 0 a la derecha, junto al borde de la pantalla.
                </>,
                <>
                  <strong>Título:</strong> Prospero semibold de 20/24 (<code>typography/heading/size/lg</code>). Por defecto &quot;Filtros avanzados&quot; (<code>title</code>); nombra el panel.
                </>,
                <>
                  <strong>Cerrar:</strong> ícono close de 24 en línea, sin caja. Aparece con <code>modal</code> o con <code>onOpenChange</code>; su nombre es &quot;Cerrar filtros&quot; (<code>closeLabel</code>).
                </>,
                <>
                  <strong>Resumen:</strong> un ChipGroup con un Chip por sección con valor; su botón de quitar borra ese filtro. Sin filtros no se dibuja (<code>showSummary</code>).
                </>,
                <>
                  <strong>Secciones:</strong> las FilterSection en columna, con separación de 8 (<code>space/general/lg</code>). Ocupan el alto libre y se desplazan si no caben.
                </>,
                <>
                  <strong>Acciones:</strong> Button Secondary md (Limpiar) y Primary md (Aplicar), alineados a la derecha con separación de 8.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'FilterSection card con valor',
                  preview: onPanel(estado({ defaultValue: ['aprobado'] }), true),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Card accordion (Atom)"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Avatar"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Filename"] > span > :last-child', side: 'top' },
                    { n: 4, selector: '[data-figma-part="Button corner "]', side: 'right' },
                    { n: 5, selector: '[role="region"] [data-figma-part="Container"] > div', side: 'left' },
                    { n: 6, selector: 'button[aria-label^="Limpiar"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Card accordion (Atom)"]', side: 'left' },
                    { kind: 'gap', from: '[data-figma-part="Card accordion (Atom)"] > h3', to: '[role="region"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Tarjeta:</strong> Card accordion con contraste On card (<code>variant=&quot;card&quot;</code>, el valor por defecto). Padding de 24 (<code>space/container/on-card</code>) y radio de 24; ocupa el ancho del panel.
                </>,
                <>
                  <strong>Avatar:</strong> 40 con el ícono folder de 24. <code>iconName</code> cambia el ícono e <code>icon={'{false}'}</code> lo quita.
                </>,
                <>
                  <strong>Conteo:</strong> Badge de número junto al título (Prospero semibold de 16/20). Cuenta lo elegido; con 0 no aparece.
                </>,
                <>
                  <strong>Button corner:</strong> botón de 32 en la muesca que indica si la sección está abierta. El que pliega es el encabezado entero.
                </>,
                <>
                  <strong>Control:</strong> el contenido (<code>children</code>), en columna con separación de 16 (<code>space/general/2xl</code>). Aquí, un ChipGroup.
                </>,
                <>
                  <strong>Limpiar:</strong> Button Tertiary xs. Aparece cuando la sección tiene valor y quita solo ese filtro.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'FilterSection plain con valor',
                  preview: plain({ defaultValue: ['informe'] }),
                  marks: [
                    { n: 1, selector: '[data-filter-section-title]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Frame 1984080547"] > :nth-child(2)', side: 'top' },
                    { n: 3, selector: 'button[aria-label^="Limpiar"]', side: 'right' },
                    { n: 4, selector: '[role="group"] > [data-figma-part="Container"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: '[data-filter-section-title]', to: '[data-figma-part="Frame 1984080547"] > :nth-child(2)' },
                    { kind: 'gap', from: '[data-figma-part="Frame 1984080547"]', to: '[role="group"] > [data-figma-part="Container"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Título:</strong> Prospero semibold de 12/16 (<code>typography/heading/size/xs</code>). Nombra el grupo (<code>role=&quot;group&quot;</code>).
                </>,
                <>
                  <strong>Conteo:</strong> el mismo Badge de número, a 16 del título (<code>space/general/2xl</code>).
                </>,
                <>
                  <strong>Limpiar:</strong> Button Tertiary xs, alineado a la derecha.
                </>,
                <>
                  <strong>Contenido:</strong> fila con ajuste de línea y separación de 8 (<code>space/general/lg</code>), 8 bajo el título. Sin tarjeta ni plegado.
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
          FilterPanel tiene 5 estados. Oculto y Abierto son del panel; Default, Dropdown y Con filtros, de cada FilterSection. No hay prop <code>state</code>: salen de <code>open</code>, de las secciones abiertas y de los valores. El foco de teclado dibuja un contorno de 2 px.
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
              title: 'Panel',
              preview: compactPanel('Filtrar documentos'),
              entries: [
                { part: 'Fondo', color: 'background-container-default-on-canva' },
                { part: 'Título', color: 'text-neutral-white', text: 'typography-heading-size-lg' },
                { part: 'Ícono de cerrar', color: 'background-general-white' },
                { part: 'Asa (aparece en Mobile)', color: 'background-general-gray-fifth' },
                { part: 'Trazo de Limpiar', color: 'border-button-secondary-low-default' },
                { part: 'Fondo de Aplicar', color: 'background-button-primary-default' },
                { part: 'Contorno de foco (aparece en Focus)', color: 'border-field-active' },
              ],
            },
            {
              title: 'FilterSection card',
              preview: onPanel(estado({ defaultValue: ['aprobado'] }), true),
              entries: [
                { part: 'Tarjeta', color: 'background-container-default-on-card' },
                { part: 'Fondo del avatar', color: 'background-icon-default-on-card' },
                { part: 'Ícono del avatar y del Button corner', color: 'icon-general-default' },
                { part: 'Título', color: 'text-neutral-heading', text: 'typography-heading-size-md' },
                { part: 'Fondo del conteo', color: 'background-acent-tertiary' },
                { part: 'Número del conteo', color: 'text-neutral-white-unicolor' },
                { part: 'Texto de Limpiar', color: 'text-button-tertiary-default' },
              ],
            },
            {
              title: 'FilterSection plain',
              preview: plain({ defaultValue: ['informe'] }),
              entries: [{ part: 'Título', color: 'text-neutral-heading', text: 'typography-heading-size-xs' }],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente FilterPanel en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Filters en la librería de Assets. Es un componente suelto con los marcos Desktop y Mobile y una propiedad, Scroll, que muestra la barra de desplazamiento. En código es <code>FilterPanel</code>: el marco lo elige el ancho de la pantalla y la zona de secciones se desplaza sola.
            </>,
            <>
              <strong>Secciones:</strong> cada tarjeta es un Card accordion (Atom) con Contrast On card. En código es <code>FilterSection</code> con <code>variant=&quot;card&quot;</code>. El contenido sale del set Atoms (Type Rate date, Chips, Dropdown, Weight, Rating, Toogles, Checkbox, Selection tree…) y se arma con componentes aparte: DatePicker, ChipGroup, Select, NumberPicker, RatingFilter, Switch, Checkbox, CheckboxTree, Radio, Slider o FilterTabs.
            </>,
            <>
              <strong>Individual filter:</strong> el filtro suelto, con título y chips sin tarjeta, es <code>FilterSection</code> con <code>variant=&quot;plain&quot;</code>. Su slot Container es <code>children</code>.
            </>,
            <>
              <strong>Lo que Figma no tiene:</strong> el resumen de filtros, el conteo del título, el Limpiar de cada sección, el foco y el panel sin modal (<code>modal={'{false}'}</code>). Los botones &quot;Button&quot; de Figma son <code>clearLabel</code> (&quot;Limpiar&quot;) y <code>applyLabel</code> (&quot;Aplicar&quot;).
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el FilterPanel es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Varios criterios a la vez:</strong> cada criterio va en su FilterSection con su control (DatePicker para la fecha, ChipGroup para el estado, CheckboxTree para el tipo de documento, RatingFilter para la calificación) y se aplican juntos con Aplicar.
            </>,
            <>
              <strong>Un borrador que se aplica:</strong> edita una copia de lo aplicado con <code>value</code> y <code>onValueChange</code>. <code>onApply</code> la recibe y el modal se cierra; Escape o Cerrar la descartan.
            </>,
            <>
              <strong>Abrir desde un FilterButton:</strong> su badge muestra <code>countFilters(aplicados)</code>. Al cerrar el panel, el foco vuelve al botón.
            </>,
            <>
              <strong>Teclado:</strong> como modal, el foco queda dentro y Escape cierra. Las flechas, Inicio y Fin recorren los encabezados de las secciones.
            </>,
            <>
              <strong>Lectores de pantalla:</strong> una región <code>role=&quot;status&quot;</code> anuncia el total (&quot;2 filtros seleccionados&quot;) y cada Limpiar dice su sección (&quot;Limpiar Estado&quot;).
            </>,
          ],
          avoid: [
            <>
              <strong>Un solo filtro a la vista:</strong> el panel esconde las opciones detrás de un botón. (Alternativa: <code>FilterSection</code> con <code>variant=&quot;plain&quot;</code> en la página).
            </>,
            <>
              <strong>Hasta cuatro categorías con casillas:</strong> caben como pestañas a la vista, sin abrir un panel. (Alternativa: <code>FilterTabs</code>).
            </>,
            <>
              <strong>Buscar por texto:</strong> el panel no tiene campo de búsqueda. (Alternativa: <code>SearchInput</code>).
            </>,
            <>
              <strong>Filtros que se aplican al instante:</strong> los cambios del panel cuentan solo al pulsar Aplicar. (Alternativa: <code>FilterSection</code> suelta con <code>onValueChange</code>).
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
                title: 'Panel lateral',
                bullets: [
                  <>
                    <strong>Panel lateral:</strong> 416 de ancho a la derecha y alto de la pantalla, con radios de 32 a la izquierda (<code>radius/container/on-canva</code>).
                  </>,
                  <>
                    <strong>Zonas:</strong> padding de 24 y separación de 32. Título de 20/24 y acciones en fila a la derecha.
                  </>,
                ],
                preview: compactPanel('Filtros avanzados'),
              },
              {
                title: 'FilterSection',
                bullets: [
                  <>
                    <strong>Tarjeta:</strong> padding de 24 (<code>space/container/on-card</code>) y 24 entre el encabezado y el control.
                  </>,
                  <>
                    <strong>Título:</strong> 16/20 (<code>typography/heading/size/md</code>), igual en los tres breakpoints.
                  </>,
                ],
                preview: onPanel(estado(), true),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Hoja inferior:</strong> por debajo de 48rem el modal ocupa todo el ancho y se apoya en el borde inferior, hasta el 90% del alto. Radios de 16 arriba y asa de 48 × 2.
              </>,
              <>
                <strong>Medidas:</strong> padding de 16 arriba, 20 a los lados y 32 abajo; separación de 24 y título de 16/20. Las tarjetas bajan su padding a 16.
              </>,
              <>
                <strong>Acciones apiladas:</strong> Limpiar y Aplicar ocupan todo el ancho, una sobre otra.
              </>,
            ],
            preview: compactPanel('Filtros'),
          },
          tablet: {
            bullets: [
              <>
                <strong>Como Desktop:</strong> desde 48rem es el panel lateral de 416 con radios de 32 a la izquierda.
              </>,
              <>
                <strong>Medidas:</strong> padding de 24, separación de 32 y título de 20/24. Las acciones van en fila a la derecha.
              </>,
              <>
                <strong>Ancho fijo:</strong> el panel no se estira con la pantalla; la zona de secciones se desplaza cuando no cabe.
              </>,
            ],
            preview: compactPanel('Filtrar documentos'),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de títulos, contenido y limpieza de cada sección.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Título con el criterio',
              description: 'Titula cada sección con el criterio que filtra: Estado, Fecha o Calificación.',
              preview: onPanel(estado({ defaultValue: ['aprobado'] })),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Título genérico',
              description: 'Evita títulos genéricos: el resumen y Limpiar los repiten y no se sabe qué quitan.',
              preview: onPanel(estado({ title: 'Opciones', defaultValue: ['aprobado'] })),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Un criterio por sección',
              description: 'Pon un solo control en cada sección, con su propio conteo y su Limpiar.',
              preview: onPanel(calificacion({ defaultValue: 4 })),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Dos criterios en una sección',
              description: 'Evita dos controles en una sección: comparten un solo valor, un conteo y un Limpiar.',
              preview: onPanel(
                <FilterSection id="mezcla" title="Estado y calificación" defaultValue={['aprobado']}>
                  {(field) => (
                    <>
                      {estadoChips(field)}
                      <RatingFilter label="Calificación mínima" />
                    </>
                  )}
                </FilterSection>
              ),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Limpiar en cada sección',
              description: 'Deja el Limpiar de la sección para quitar un filtro sin vaciar los demás.',
              preview: onPanel(estado({ defaultValue: ['pendiente', 'revision', 'aprobado'] })),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Sección sin Limpiar',
              description: (
                <>
                  Evita <code>clearable={'{false}'}</code>: para quitar ese filtro hay que desmarcar cada opción.
                </>
              ),
              preview: onPanel(estado({ clearable: false, defaultValue: ['pendiente', 'aprobado'] })),
            },
          ],
        },
      ],
    },
  ],
};
