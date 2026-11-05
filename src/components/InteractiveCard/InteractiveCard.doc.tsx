import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Tag } from '../Tag';
import { InteractiveCard, InteractiveCardDescription, InteractiveCardDetail, InteractiveCardDetails, InteractiveCardStat, InteractiveCardStats } from './InteractiveCard';
import type { InteractiveCardState } from './InteractiveCard.types';

/*
 * Contenido de la página de documentación de InteractiveCard (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el
 * código (`InteractiveCard.types.ts`, `InteractiveCard.variants.ts`, `InteractiveCard.tsx`), luego
 * `InteractiveCard.docs.json`. Medidas: Simple de 80 px de alto (padding 16, gap 16, Avatar de 40, Radio de 16); Complex
 * con padding 32 en Desktop (24 en Tablet, 20 en Mobile), gap 24 (20 en Mobile), Avatar de 56 y muesca de 48 con Button
 * corner md de 40. Diferencias con Figma: Figma no dibuja el foco ni el Press (la tarjeta no cambia al pulsar); el
 * código añade un anillo de 2 px alrededor de la tarjeta. Figma llama a la Simple en reposo "Interactive card" (Type y
 * State); el código la trata como `variant="simple"` en reposo.
 */

// Figma: 13219:38332 (component set Interactive card)

type CardProps = Partial<ComponentProps<typeof InteractiveCard>>;

/** Anillo de foco de la tarjeta: las mismas clases que el componente aplica con `:focus-visible` dentro de la tarjeta. */
const FOCUS_RING = 'before:outline-2 before:outline-solid before:outline-ds-border-field-active';

const tags = (disabled = false): ReactNode => (
  <>
    <Tag iconLeft={false} disabled={disabled}>Diseño</Tag>
    <Tag type="success" iconLeft={false} disabled={disabled}>Activo</Tag>
  </>
);

/** Tarjeta Simple de ejemplo. Sin `name`: cada muestra es su propio grupo y no marca a las demás. */
const simple = (props: CardProps = {}) => <InteractiveCard title="Vista de lista" subtitle="Filas con detalle" {...props} />;

/** Complex compacta (encabezado, etiquetas y descripción). */
const complex = (props: CardProps = {}) => (
  <InteractiveCard
    variant="complex"
    title="Proyecto web"
    subtitle="Equipo de producto"
    cornerLabel="Abrir proyecto web"
    tags={tags(!!props.disabled || props.state === 'inactive')}
    content={<InteractiveCardDescription>Rediseño del sitio con páginas nuevas.</InteractiveCardDescription>}
    {...props}
  />
);

/** Complex completa: suma las secciones de datos y de bloques. */
const complexFull = (props: CardProps = {}) =>
  complex({
    ...props,
    children: (
      <>
        <InteractiveCardDetails>
          <InteractiveCardDetail term="Inicio">12 de enero</InteractiveCardDetail>
          <InteractiveCardDetail term="Plazo">30 de marzo</InteractiveCardDetail>
        </InteractiveCardDetails>
        <InteractiveCardStats>
          <InteractiveCardStat label="Tareas" value="24" />
          <InteractiveCardStat label="Archivos" value="8" />
        </InteractiveCardStats>
      </>
    ),
  });

/** Grupo de opciones. Con `name` las tarjetas comparten grupo; con `legend` llevan su pregunta. Sin ellos quedan sueltas. */
const group = (name: string | undefined, cards: (CardProps & { title: ReactNode })[], legend?: string) => (
  <fieldset className="m-0 flex min-w-0 flex-col gap-ds-space-general-lg border-0 p-0">
    {legend ? (
      <legend className="mb-ds-space-general-lg font-ds-primitives-typography-family-primary text-ds-typography-body-size-md text-ds-text-neutral-body">{legend}</legend>
    ) : null}
    {cards.map((card, i) => (
      <InteractiveCard key={i} name={name} {...card} />
    ))}
  </fieldset>
);

/** Ancho de muestra para la anatomía: sin él, la tarjeta se encoge al ancho de su contenido. `onCanvas` la apoya en la superficie de lienzo, sobre la que se usa la Simple. */
const sized = (node: ReactNode, width: number, onCanvas = false) => (
  <div
    style={{ width }}
    className={onCanvas ? 'max-w-full rounded-ds-radius-general-2xl bg-ds-background-container-default-on-canva p-ds-space-general-2xl' : 'max-w-full'}
  >
    {node}
  </div>
);

/** Las dos formas con el mismo ancho de muestra (360 px), para que la plantilla las reduzca por igual. */
const stateSamples = (state: InteractiveCardState, extra: CardProps = {}): ReactNode[] => [
  sized(simple({ state, ...extra }), 360),
  sized(complex({ state, ...extra }), 360),
];

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo. La Simple usa la superficie de tarjeta y la Complex, la de lienzo. El radio queda sin marcar.',
    samples: stateSamples('default'),
  },
  {
    label: 'Hover',
    tone: 'accent',
    description: (
      <>
        Al pasar el puntero. La Simple aclara su fondo (<code>background-container-hover-on-card</code>) y suma sombra; la Complex dibuja un trazo de 1 px y un anillo en el Button corner. Sin efecto en Select e Inactive.
      </>
    ),
    samples: stateSamples('hover'),
  },
  {
    label: 'Focus',
    tone: 'accent',
    description: 'Al llegar con el teclado. Un anillo de 2 px rodea la tarjeta, a 4 px del borde; en la Simple, el radio no dibuja el suyo. Figma no lo dibuja. La muestra usa las clases del componente porque el foco real no se puede dejar fijo.',
    samples: [sized(simple({ className: FOCUS_RING }), 360), sized(complex({ className: FOCUS_RING }), 360)],
  },
  {
    label: 'Select',
    tone: 'accent',
    description: 'Con el radio marcado, ya sea con clic, con Espacio o al llegar con las flechas del grupo. Manda sobre Hover: el fondo pasa a la superficie de selección y la tarjeta suma un trazo.',
    samples: stateSamples('select'),
  },
  {
    label: 'Inactive',
    tone: 'neutral',
    description: <>Con <code>disabled</code>. El radio y el Button corner quedan deshabilitados, los textos pasan a su tono deshabilitado y el cursor indica que no está disponible.</>,
    samples: stateSamples('inactive', { disabled: true }),
  },
];

const breakpointComplex = () => complex();

export const doc: ComponentDocContent = {
  name: 'InteractiveCard',
  icon: 'folder',
  classification: 'molecula',
  summary:
    'InteractiveCard es la molécula para elegir una opción entre varias con una tarjeta completa. Toda su superficie es un radio. La versión Simple combina avatar, textos y Radio; la Complex suma etiquetas, secciones y un Button corner.',
  definition: [
    {
      title: 'Anatomía',
      description: 'La Simple es una fila con avatar, textos y radio. La Complex es una columna con encabezado, contenido y secciones, y un Button corner en su muesca.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Simple',
                  preview: sized(simple({ rootProps: { 'data-slot': 'card' } }), 400, true),
                  marks: [
                    { n: 1, selector: '[data-slot="card"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Avatar"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Título"]', side: 'top' },
                    { n: 4, selector: '[data-figma-part="Subtítulo"]', side: 'bottom' },
                    { n: 5, selector: '[data-figma-part="Selection"]', side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-slot="card"]', side: 'left' },
                    { kind: 'gap', from: '[data-figma-part="Avatar"]', to: '[data-figma-part="Text container"]' },
                    { kind: 'height', selector: '[data-slot="card"]' },
                  ],
                },
              ],
              guidelines: [
                <><strong>Contenedor:</strong> fila de ancho completo, de 80 px de alto, con padding de 16 px, separación de 16 px y radio de 24 px (<code>radius-general-2xl</code>). El fondo es <code>background-container-default-on-card</code>.</>,
                <><strong>Avatar:</strong> avatar de ícono de 40 px. <code>icon</code> cambia el ícono (por defecto <code>folder</code>), <code>leading</code> pone otro contenido y <code>leading={'{null}'}</code> lo quita.</>,
                <><strong>Título:</strong> <code>title</code>, en tipografía secundaria semibold de 16 px con altura de línea de 20 px. Es el nombre accesible del radio.</>,
                <><strong>Subtítulo:</strong> <code>subtitle</code>, en tipografía primaria regular de 14 px con altura de línea de 20 px. Es la descripción accesible del radio.</>,
                <><strong>Radio:</strong> <code>Radio</code> de 16 px al extremo derecho. Con <code>indicator={'{false}'}</code> se oculta y la tarjeta sigue siendo un radio accesible.</>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Complex',
                  preview: sized(complexFull({ rootProps: { 'data-slot': 'card' } }), 440),
                  marks: [
                    { n: 1, selector: '[data-slot="card"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Button corner "]', side: 'right' },
                    { n: 3, selector: '[data-figma-part="Avatar"]', side: 'left' },
                    { n: 4, selector: '[data-figma-part="Tags9"]', index: 0, side: 'right' },
                    { n: 5, selector: '[data-figma-part="Status"]', side: 'left' },
                    { n: 6, selector: '[data-figma-part="Box text"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-slot="card"]', side: 'left' },
                    { kind: 'gap', from: '[data-figma-part="Content"]', to: '[data-figma-part="List"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <><strong>Contenedor:</strong> columna de ancho completo con radio de 24 px. El padding mide 32 px en Desktop y la separación entre grupos, 24 px (ver Aplicaciones de breakpoints). El fondo es <code>background-container-default-on-canva</code>.</>,
                <><strong>Button corner:</strong> <code>ButtonCorner</code> de 40 px dentro de la muesca de 48 px. <code>cornerLabel</code> es su nombre accesible y <code>onCornerClick</code>, su clic: no marca la tarjeta.</>,
                <><strong>Encabezado:</strong> avatar de 56 px, título de 20 px y subtítulo. Un <code>InteractiveCardHeader</code> dentro de <code>content</code> con <code>emphasis=&quot;subtitle&quot;</code> destaca un dato.</>,
                <><strong>Etiquetas:</strong> <code>tags</code> las pone a la derecha del encabezado. <code>InteractiveCardTags</code>, dentro de <code>content</code>, las coloca en una fila con separación de 8 px.</>,
                <><strong>Descripción:</strong> <code>InteractiveCardDescription</code> dentro de <code>content</code>, con tipografía regular de 14 px, altura de línea de 18 px y <code>text-neutral-body</code>.</>,
                <><strong>Secciones:</strong> los <code>children</code> van con 24 px entre sí: <code>InteractiveCardDetails</code>, <code>InteractiveCardList</code> con <code>ListItem</code> e <code>InteractiveCardStats</code>, cuyos bloques usan padding y <code>background-container-hover-on-canva</code>.</>,
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
          InteractiveCard tiene 5 estados. Default, Hover, Select e Inactive son del set de Figma; Focus lo añade el código. Hover, Select e Inactive se fuerzan con <code>state</code> solo para documentar; Focus se dibuja con las clases del componente. Press no existe: la tarjeta no cambia mientras se pulsa y pasa directo a Select.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens de la tarjeta en reposo y los que cambian en Hover, Select, Focus e Inactive. Cambia el modo para ver su valor.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Simple',
              preview: simple(),
              entries: [
                { part: 'Fondo', color: 'background-container-default-on-card' },
                { part: 'Fondo (Hover)', color: 'background-container-hover-on-card' },
                { part: 'Fondo (Select)', color: 'background-container-select-on-card' },
                { part: 'Trazo (Select)', color: 'border-general-default-on-card' },
                { part: 'Avatar', color: 'background-icon-default-on-canva' },
                { part: 'Título', color: 'text-neutral-white', text: 'typography-heading-size-md' },
                { part: 'Subtítulo', color: 'text-neutral-body', text: 'typography-body-size-md' },
                { part: 'Texto (Inactive)', color: 'text-neutral-disabled-on-canva' },
                { part: 'Anillo (Focus)', color: 'border-field-active' },
              ],
            },
            {
              title: 'Complex',
              preview: complex(),
              entries: [
                { part: 'Fondo', color: 'background-container-default-on-canva' },
                { part: 'Trazo (Hover)', color: 'border-general-default-on-card' },
                { part: 'Fondo (Select)', color: 'background-general-gray-seventh' },
                { part: 'Trazo (Select)', color: 'border-general-gray-tertiary' },
                { part: 'Avatar', color: 'background-icon-default-on-card' },
                { part: 'Título', color: 'text-neutral-white', text: 'typography-heading-size-lg' },
                { part: 'Descripción', color: 'text-neutral-body', text: 'primitives-typography-size-md' },
                { part: 'Bloque de dato', color: 'background-container-hover-on-canva' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente InteractiveCard en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <><strong>Búsqueda y configuración:</strong> encuentra el set «Interactive card» en la librería de Assets. Sus propiedades principales son Type (Simple, Complex) y State (Default, Hover, Select, Inactive).</>,
            <><strong>Type y State:</strong> Simple y Complex son <code>variant=&quot;simple&quot;</code> y <code>variant=&quot;complex&quot;</code>. En Figma, la Simple en reposo se llama «Interactive card» en Type y en State; el código no la distingue de <code>variant=&quot;simple&quot;</code> sin marcar.</>,
            <><strong>Textos y capas:</strong> Tittle es <code>title</code>, Subtittle2 es <code>subtitle</code>, Radio button es <code>indicator</code> y Tag superior es <code>tags</code>. Los slots List y Box text corresponden a los <code>children</code> de la Complex.</>,
            <><strong>Diferencias:</strong> en Figma, Hover, Select e Inactive son variantes; en el código salen de <code>:hover</code>, del radio marcado y de <code>disabled</code>. Figma no dibuja el foco, que el código añade. El Button corner de la Complex existe en Figma solo como instancia; en el código lo activa <code>cornerLabel</code>.</>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo InteractiveCard es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <><strong>Elegir una opción entre varias:</strong> da el mismo <code>name</code> a las tarjetas y agrúpalas en un <code>fieldset</code> con <code>legend</code>. Las flechas mueven la selección y Espacio la confirma.</>,
            <><strong>Opciones con contenido:</strong> usa la Complex cuando cada opción necesita etiquetas, datos o una lista para decidir.</>,
            <><strong>Opciones con texto breve:</strong> usa la Simple, con título y subtítulo cortos.</>,
            <><strong>Acción propia dentro de la tarjeta:</strong> pásala por <code>cornerLabel</code> y <code>onCornerClick</code>, o marca tu control con <code>data-card-action</code>. Conserva su foco y su clic sin marcar la tarjeta.</>,
            <><strong>Opción no disponible:</strong> usa <code>disabled</code>; la tarjeta se salta con el teclado.</>,
          ],
          avoid: [
            <><strong>Elegir varias opciones:</strong> el radio admite una sola. (Alternativa: <code>Checkbox</code>).</>,
            <><strong>Abrir una vista o navegar:</strong> la tarjeta marca una opción y no lleva a otra parte. (Alternativa: <code>ButtonLink</code>; para conversaciones, <code>ChatCard</code> con <code>href</code>).</>,
            <><strong>Mostrar información sin elegir:</strong> una tarjeta con radio promete una selección. (Alternativas: <code>InformationCard</code>, <code>DataCard</code>, <code>FileCard</code>, <code>ContactCard</code>, <code>ProfileCard</code> o <code>ProductCard</code>).</>,
            <><strong>Destacar un contenido:</strong> la selección no sirve para llamar la atención. (Alternativa: <code>FeatureCard</code>).</>,
          ],
        },
      ],
    },
    {
      title: 'Aplicaciones de breakpoints',
      description: 'Cada vista se dibuja con los valores responsive de su breakpoint. Tablet comparte los tokens de Desktop salvo el padding de la Complex, que baja de 32 a 24 px.',
      blocks: [
        {
          type: 'breakpoints',
          desktop: {
            columns: [
              {
                title: 'Simple',
                bullets: [
                  <><strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.</>,
                  <>Ocupa todo el ancho disponible, con 80 px de alto, padding y separación de 16 px.</>,
                ],
                preview: simple(),
              },
              {
                title: 'Complex',
                bullets: [
                  <>Padding de 32 px y separación de 24 px entre grupos.</>,
                  <>Título de 20 px con altura de línea de 24 px y bloques de dato con padding de 24 px.</>,
                ],
                preview: breakpointComplex(),
              },
            ],
          },
          mobile: {
            bullets: [
              <>La Simple no cambia: conserva sus 80 px de alto.</>,
              <>La Complex baja el padding a 20 px y la separación entre grupos a 20 px.</>,
              <>El título pasa a 18 px con altura de línea de 22 px, y el padding de los bloques de dato, a 16 px.</>,
            ],
            preview: breakpointComplex(),
          },
          tablet: {
            bullets: [
              <>La Simple no cambia: conserva sus 80 px de alto.</>,
              <>La Complex baja el padding de 32 a 24 px; la separación entre grupos sigue en 24 px.</>,
              <>El título mide 20 px con altura de línea de 24 px, como en Desktop.</>,
            ],
            preview: breakpointComplex(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas para elegir con tarjetas claras y accesibles.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Grupo con pregunta',
              description: <>Une las tarjetas con el mismo <code>name</code> y una <code>legend</code>.</>,
              preview: group('doc-do-grupo', [{ title: 'Vista de lista', subtitle: 'Filas con detalle' }, { title: 'Vista de tarjetas', subtitle: 'Bloques con resumen' }], 'Elige una vista'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Tarjetas sueltas',
              description: <>No dejes las tarjetas sin <code>name</code> ni <code>legend</code>: pueden quedar varias marcadas.</>,
              preview: group(undefined, [{ title: 'Vista de lista', subtitle: 'Filas con detalle' }, { title: 'Vista de tarjetas', subtitle: 'Bloques con resumen' }]),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Título que distingue',
              description: 'Nombra cada tarjeta con lo que la diferencia.',
              preview: group('doc-do-titulo', [{ title: 'Orden alfabético', subtitle: 'De la A a la Z' }, { title: 'Orden por fecha', subtitle: 'Lo más reciente primero' }]),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Título genérico',
              description: 'No repitas el mismo título: es el nombre del radio y no se distingue.',
              preview: group('doc-dont-titulo', [{ title: 'Seleccionar', subtitle: 'De la A a la Z' }, { title: 'Seleccionar', subtitle: 'Lo más reciente primero' }]),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Subtítulo breve',
              description: 'Resume la opción en una línea.',
              preview: group('doc-do-subtitulo', [{ title: 'Con vista previa', subtitle: 'Muestra el inicio del texto' }, { title: 'Sin vista previa', subtitle: 'Solo el título' }]),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Subtítulo largo',
              description: 'No cargues la tarjeta con un párrafo: se vuelve difícil de comparar.',
              preview: group('doc-dont-subtitulo', [
                { title: 'Con vista previa', subtitle: 'Muestra el inicio del texto, el autor, la fecha, el estado y las etiquetas de cada elemento.' },
                { title: 'Sin vista previa', subtitle: 'Muestra solo el título, el autor, la fecha, el estado y las etiquetas de cada elemento.' },
              ]),
            },
          ],
        },
      ],
    },
  ],
};
