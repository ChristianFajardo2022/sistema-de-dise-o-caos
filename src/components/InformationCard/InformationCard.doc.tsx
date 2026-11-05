import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Avatar, AvatarGroup } from '../Avatar';
import { Button } from '../Button';
import { ListItem } from '../ListItem';
import { ProgressBar } from '../ProgressBar';
import { NumberRating } from '../Rating';
import { Tag } from '../Tag';
import { InformationCard } from './InformationCard';

/*
 * Contenido de la página de documentación de InformationCard (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`InformationCard.types.ts`, `InformationCard.variants.ts`, `InformationCard.tsx`), luego `InformationCard.docs.json`.
 * Medidas responsive de `src/styles/tokens.css`: padding `space/container/on-canva` 20 / 24 / 32 (Mobile / Tablet / Desktop),
 * separación `space/general/4xl` 24 / 32 / 32, título del Simple `heading/size/lg` 18/22 en Mobile y 20/24 desde Tablet.
 * Diferencias con Figma: Figma no tiene nivel de encabezado ni nombre accesible; el código usa un `<article>` nombrado por el
 * título y `headingLevel`. Figma dibuja el Simple de 483 × 232; el código lo deja al ancho disponible con alto mínimo de 232.
 */

// Figma: 14195:31274 (component set Information card)

type CardProps = Partial<ComponentProps<typeof InformationCard>>;

const TEXT = {
  title: 'Lanzamiento de la app',
  subtitle: 'Equipo de producto',
  description: 'Versión con modo oscuro, notificaciones y un nuevo panel de ajustes.',
};

const NAMES = ['Ana Pérez', 'Hugo García', 'Sara Gil', 'Iván Soto'];

const folder = () => <Avatar variant="icon" size="lg" />;

const people = () => (
  <AvatarGroup aria-label="Participantes" max={5}>
    {NAMES.map((name) => (
      <Avatar key={name} name={name} />
    ))}
  </AvatarGroup>
);

const actions = () => (
  <>
    <Button variant="secondary" size="sm">
      Ver detalle
    </Button>
    <Button size="sm">Unirme</Button>
  </>
);

const progress = () => (
  <div className="flex min-w-0 flex-col gap-ds-space-general-2xl">
    <div className="flex min-w-0 items-center justify-between gap-ds-space-general-3xl">
      <Tag type="success" size="sm" iconLeft={false}>
        En curso
      </Tag>
      {people()}
    </div>
    <ProgressBar value={50} label="Avance del proyecto" />
  </div>
);

const list = () => (
  <ul role="list" data-figma-part="List" className="m-0 flex min-w-0 flex-col p-0">
    <ListItem title="Diseño de pantallas" category="Tarea" description="Vence el viernes" selectable leading={<Avatar name="Hugo García" size="sm" />} onView={() => {}} onDelete={() => {}} />
    <ListItem title="Pruebas con usuarios" category="Tarea" description="Vence el lunes" selectable leading={<Avatar name="Hugo García" size="sm" />} onEdit={() => {}} onDelete={() => {}} />
  </ul>
);

const rating = () => (
  <div className="flex min-w-0 flex-col gap-ds-space-general-lg">
    <p className="m-0 truncate font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)] text-ds-typography-heading-size-sm leading-ds-typography-heading-line-height-sm text-ds-text-neutral-heading">
      Valoración
    </p>
    <NumberRating value={4.5} />
  </div>
);

/** Tarjeta de ejemplo (por defecto, con los textos comunes); `props` pisa lo que haga falta. */
const card = (props: CardProps = {}) => <InformationCard {...TEXT} {...props} />;

/** Ancho de muestra razonable (la tarjeta ocupa el ancho disponible). */
const fixed = (node: ReactNode) => <div className="w-100 max-w-full">{node}</div>;

/** Ancho de Figma de la tarjeta completa (498): con pie y botones, o con lista, a 400 px no caben en una línea. */
const wide = (node: ReactNode) => <div className="w-[498px] max-w-full">{node}</div>;

const option1 = () =>
  card({
    leading: folder(),
    tagsPosition: 'content',
    tags: (
      <>
        <Tag>Diseño</Tag>
        <Tag iconLeft={false}>Web</Tag>
      </>
    ),
    footer: people(),
    actions: actions(),
  });

const option2 = () =>
  card({
    tags: (
      <>
        <Tag iconLeft={false}>Diseño</Tag>
        <Tag iconLeft={false}>Web</Tag>
      </>
    ),
    actions: actions(),
    children: progress(),
  });

const option3 = () =>
  card({
    leading: folder(),
    tags: (
      <>
        <Tag iconLeft={false}>Diseño</Tag>
        <Tag iconLeft={false}>Web</Tag>
      </>
    ),
    footer: rating(),
    actions: actions(),
    children: list(),
  });

const simple = (props: CardProps = {}) =>
  card({ variant: 'simple', title: 'Notas de la reunión', description: 'Acuerdos y próximos pasos del equipo.', subtitle: undefined, ...props });

const states: DocStateItem[] = [
  {
    label: 'Option 1',
    tone: 'neutral',
    description: <>Avatar arriba, etiquetas bajo el título (<code>tagsPosition=&quot;content&quot;</code>) y pie con participantes y botones.</>,
    samples: [wide(option1())],
  },
  {
    label: 'Option 2',
    tone: 'neutral',
    description: 'Etiquetas arriba, un bloque de progreso entre la descripción y el pie, y botones.',
    samples: [fixed(option2())],
  },
  {
    label: 'Option 3',
    tone: 'neutral',
    description: 'Avatar y etiquetas arriba, una lista de ítems y un pie con calificación y botones.',
    samples: [wide(option3())],
  },
  {
    label: 'Simple',
    tone: 'neutral',
    description: <>Título arriba y descripción abajo, sin slots. Con <code>image</code> dibuja una rejilla de puntos de fondo.</>,
    samples: [fixed(simple({ image: true })), fixed(simple())],
  },
];

const LONG_TITLE = 'Revisión completa del diseño de las pantallas de inicio, ajustes y perfil';

export const doc: ComponentDocContent = {
  name: 'InformationCard',
  icon: 'info-circle',
  classification: 'molecula',
  summary:
    'InformationCard es la molécula para presentar un contenido con título, descripción y etiquetas, y acompañarlo de una lista, un progreso, un pie y botones. No es interactiva ni avisa de un resultado: para eso existe Alert.',
  definition: [
    {
      title: 'Anatomía',
      description: 'La tarjeta es un contenedor por slots: el encabezado, el contenido y el pie son opcionales y se combinan según la opción.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Composición completa (Option 3)',
                  preview: wide(
                    card({
                      leading: folder(),
                      tags: <Tag iconLeft={false}>Diseño</Tag>,
                      footer: rating(),
                      actions: actions(),
                      children: list(),
                    })
                  ),
                  marks: [
                    { n: 1, selector: 'article', side: 'left' },
                    { n: 2, selector: 'article > [data-figma-part="Container"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Filename"]', side: 'right' },
                    { n: 4, selector: 'article > [data-figma-part="Content"] > [data-figma-part="Status"]', side: 'right' },
                    { n: 5, selector: 'article > [data-figma-part="List"]', side: 'left' },
                    { n: 6, selector: 'article > [data-figma-part="Desktop"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: 'article', side: 'left' },
                    { kind: 'gap', from: 'article > [data-figma-part="Container"]', to: 'article > [data-figma-part="Content"]', axis: 'y' },
                    { kind: 'gap', from: '[data-figma-part="Frame 1984080587"]', to: 'article > [data-figma-part="Content"] > [data-figma-part="Status"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <><strong>Contenedor:</strong> <code>&lt;article&gt;</code> de ancho completo, sin muesca. En Desktop tiene 32 px de padding (<code>space/container/on-canva</code>), 32 px entre secciones (<code>space/general/4xl</code>) y radio de 24 px (<code>radius/general/2xl</code>), sobre <code>background/container/default-on-canva</code>.</>,
                <><strong>Encabezado:</strong> el slot <code>leading</code> a la izquierda (normalmente un <code>Avatar</code> de 56 × 56 px) y <code>tags</code> a la derecha, con 8 px entre ellos (<code>space/general/lg</code>).</>,
                <><strong>Título:</strong> encabezado <code>h3</code> por defecto (<code>headingLevel</code>), Prospero semibold de 16/20 px (<code>heading/size/md</code>) en una sola línea. El <code>subtitle</code> va debajo, a 4 px (<code>space/general/md</code>), en 12/16 px.</>,
                <><strong>Descripción:</strong> 14/18 px en <code>text/neutral/gray</code>, a 8 px del título (<code>space/general/lg</code>). Con las etiquetas bajo el título (<code>tagsPosition=&quot;content&quot;</code>), la separación es de 16 px (<code>space/general/2xl</code>).</>,
                <><strong>Contenido:</strong> <code>children</code> va entre la descripción y el pie, a 32 px: un bloque de progreso o una lista de <code>ListItem</code>.</>,
                <><strong>Pie:</strong> con <code>footer</code> se dibuja una línea de 0,5 px (<code>border/general/md</code>) en <code>border/general/default-on-card</code>, a 32 px de la fila. La fila lleva el <code>footer</code> a la izquierda y las <code>actions</code> a la derecha, con 24 px entre ellos (<code>space/general/3xl</code>).</>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Simple',
                  preview: fixed(simple({ image: true })),
                  marks: [
                    { n: 1, selector: 'article', side: 'top' },
                    { n: 2, selector: 'article > [data-figma-part="Filename"]', side: 'left' },
                    { n: 3, selector: 'article > [data-figma-part="Status"]', side: 'left' },
                    { n: 4, selector: 'article > [data-figma-part="Image"]', side: 'bottom' },
                  ],
                  dimensions: [{ kind: 'padding', selector: 'article', side: 'left' }],
                },
              ],
              guidelines: [
                <><strong>Contenedor:</strong> mismo padding y radio, con un alto mínimo de 232 px. El título queda arriba y la descripción abajo (<code>justify-between</code>).</>,
                <><strong>Título:</strong> Prospero semibold de 20/24 px en Desktop (<code>heading/size/lg</code>), en <code>text/neutral/heading</code>. Puede ocupar varias líneas.</>,
                <><strong>Descripción:</strong> 14/18 px en <code>text/neutral/gray</code>.</>,
                <><strong>Rejilla:</strong> con <code>image</code> se dibuja una rejilla de puntos cada 32 px en <code>border/general/default-on-card</code>, detrás del contenido. Es decorativa (<code>aria-hidden</code>).</>,
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Estados',
      description: 'InformationCard tiene 4 variantes de aspecto, una por Type de Figma. No es interactiva: no tiene Hover, Focus ni Press. Lo interactivo son los botones, la lista y los avatares que lleva dentro.',
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default. Cambia el modo para ver su valor.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Default (Option 1, 2 y 3)',
              preview: fixed(option2()),
              entries: [
                { part: 'Fondo', color: 'background-container-default-on-canva' },
                { part: 'Título', color: 'text-neutral-heading', text: 'typography-heading-size-md' },
                { part: 'Subtítulo', color: 'text-neutral-gray', text: 'typography-body-size-sm' },
                { part: 'Descripción', color: 'text-neutral-gray', text: 'typography-body-size-md' },
                { part: 'Línea del pie', color: 'border-general-default-on-card' },
              ],
            },
            {
              title: 'Simple',
              preview: fixed(simple({ image: true })),
              entries: [
                { part: 'Fondo', color: 'background-container-default-on-canva' },
                { part: 'Título', color: 'text-neutral-heading', text: 'typography-heading-size-lg' },
                { part: 'Descripción', color: 'text-neutral-gray', text: 'typography-body-size-md' },
                { part: 'Rejilla de puntos (con image)', color: 'border-general-default-on-card' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente InformationCard en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <><strong>Búsqueda y configuración:</strong> encuentra el componente como Information card en la librería de Assets. Tiene la propiedad Type con 4 valores (Option 1, Option 2, Option 3 y Simple) y una propiedad booleana por cada sección.</>,
            <><strong>Type:</strong> Option 1, 2 y 3 son la misma tarjeta con secciones distintas, así que en código son un solo componente con <code>variant=&quot;default&quot;</code> y slots. Simple equivale a <code>variant=&quot;simple&quot;</code>.</>,
            <><strong>Propiedades booleanas:</strong> encenderlas equivale a pasar la prop. Icon es <code>leading</code>, Tag es <code>tags</code>, Subtitle es <code>subtitle</code>, Description es <code>description</code>, List y Progress son <code>children</code>, Avatar group y Content son <code>footer</code>, Group button es <code>actions</code> e Image es <code>image</code>. El texto Tittle (con dos t en Figma) es <code>title</code>.</>,
            <><strong>Lo que Figma no tiene:</strong> el nivel del encabezado (<code>headingLevel</code>) y el nombre accesible del <code>&lt;article&gt;</code>. Las etiquetas bajo el título de Option 1 son <code>tagsPosition=&quot;content&quot;</code>; en Option 2 y 3 van arriba.</>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo InformationCard es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <><strong>Resumir un elemento:</strong> un proyecto, un documento o un evento con título, descripción y etiquetas en una sola superficie.</>,
            <><strong>Agrupar contenido relacionado:</strong> una lista de ítems, un progreso, participantes o una calificación bajo el mismo título.</>,
            <><strong>Ofrecer hasta dos acciones:</strong> botones <code>Button</code> de tamaño <code>sm</code> en <code>actions</code>, a la derecha del pie.</>,
            <><strong>Mostrar una idea breve:</strong> con <code>variant=&quot;simple&quot;</code>, un título y una descripción, y la rejilla de puntos si se quiere decorar.</>,
          ],
          avoid: [
            <><strong>Avisar de un resultado o un estado:</strong> la tarjeta no tiene tipo semántico ni lo anuncia a lectores de pantalla. (Alternativa: <code>Alert</code>).</>,
            <><strong>Anunciar un evento en una lista:</strong> no tiene estado leído ni hora. (Alternativa: <code>NotificationCard</code>).</>,
            <><strong>Elegir una opción con toda la tarjeta:</strong> no es interactiva ni es un control. (Alternativa: <code>InteractiveCard</code>).</>,
            <><strong>Destacar una cifra:</strong> el dato grande con su ícono tiene su propia pieza. (Alternativa: <code>DataCard</code>).</>,
            <><strong>Presentar una persona, un archivo o un producto:</strong> la tarjeta no trae datos de perfil, miniatura de archivo ni precio. (Alternativa: <code>ProfileCard</code> o <code>ContactCard</code> para personas, <code>FileCard</code> para archivos, <code>ProductCard</code> para productos).</>,
          ],
        },
      ],
    },
    {
      title: 'Aplicaciones de breakpoints',
      description: 'Cada vista se dibuja con los valores responsive de su breakpoint. Tablet comparte los tokens de Desktop salvo el padding, que baja a 24 px.',
      blocks: [
        {
          type: 'breakpoints',
          desktop: {
            columns: [
              {
                title: 'Composición por slots',
                bullets: [
                  <><strong>Medidas:</strong> 32 px de padding (<code>space/container/on-canva</code>) y 32 px entre secciones (<code>space/general/4xl</code>).</>,
                  <><strong>Textos:</strong> título de 16/20 px y descripción de 14/18 px. El título ocupa una línea.</>,
                ],
                preview: option2(),
              },
              {
                title: 'Simple',
                bullets: [
                  <><strong>Medidas:</strong> 32 px de padding y alto mínimo de 232 px.</>,
                  <><strong>Textos:</strong> título de 20/24 px (<code>heading/size/lg</code>) y descripción de 14/18 px.</>,
                ],
                preview: simple({ image: true }),
              },
            ],
          },
          mobile: {
            bullets: [
              <><strong>Medidas:</strong> el padding baja a 20 px y la separación entre secciones a 24 px.</>,
              <><strong>Simple:</strong> el título baja a 18/22 px.</>,
              <><strong>Pie:</strong> la separación de la fila baja a 20 px y, si las <code>actions</code> no caben junto al <code>footer</code>, pasan a la línea siguiente, alineadas a la derecha.</>,
            ],
            preview: option2(),
          },
          tablet: {
            bullets: [
              <><strong>Medidas:</strong> el padding es de 24 px; la separación entre secciones, de 32 px.</>,
              <><strong>Simple:</strong> el título vuelve a 20/24 px.</>,
              <><strong>Pie:</strong> la fila separa sus elementos con 24 px.</>,
            ],
            preview: option2(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas para que la tarjeta se lea y se recorra bien.',
      blocks: [
        {
          type: 'practices',
          items: [
            { kind: 'do', framed: true, title: 'Título corto', description: 'Escribe un título que se lea completo en una línea.', preview: card({ title: 'Revisión del diseño' }) },
            { kind: 'dont', framed: true, title: 'Título largo', description: 'No escribas un título que no quepa: se corta con puntos suspensivos.', preview: card({ title: LONG_TITLE }) },
            { kind: 'do', framed: true, title: 'Dos acciones', description: <>Deja un <code>Button</code> secundario y uno principal en <code>actions</code>.</>, preview: card({ actions: actions() }) },
            {
              kind: 'dont',
              framed: true,
              title: 'Demasiados botones',
              description: <>No pongas más de dos botones en <code>actions</code>: se parten en varias líneas y compiten.</>,
              preview: card({
                actions: (
                  <>
                    <Button variant="secondary" size="sm">
                      Ver detalle
                    </Button>
                    <Button variant="secondary" size="sm">
                      Editar
                    </Button>
                    <Button variant="secondary" size="sm">
                      Compartir
                    </Button>
                    <Button size="sm">Unirme</Button>
                  </>
                ),
              }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Nivel de encabezado',
              description: <>Ajusta <code>headingLevel</code> al nivel que sigue al encabezado de la sección. Las dos muestras se ven igual: cambia lo que anuncia un lector de pantalla.</>,
              preview: card({ headingLevel: 4, title: 'Resumen del proyecto' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Sin encabezado',
              description: <>No uses <code>headingLevel=&quot;none&quot;</code> si la tarjeta es una sección: quien navega por encabezados no la encuentra. Se ve igual que la muestra correcta.</>,
              preview: card({ headingLevel: 'none', title: 'Resumen del proyecto' }),
            },
          ],
        },
      ],
    },
  ],
};
