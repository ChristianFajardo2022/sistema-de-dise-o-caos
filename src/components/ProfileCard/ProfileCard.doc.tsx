import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Avatar } from '../Avatar';
import { PHOTO_SRC } from '../Avatar/Avatar.sample-data';
import { BrandLogo } from '../Avatar/assets/BrandLogo';
import { Button } from '../Button';
import { IconStar } from '../Rating';
import { Tag } from '../Tag';
import { ProfileCard } from './ProfileCard';

/*
 * Contenido de la página de documentación de ProfileCard (plantilla v2). Manda el código (`ProfileCard.types.ts`,
 * `ProfileCard.variants.ts`, `ProfileCard.tsx`), luego `ProfileCard.docs.json`. Medidas responsive de `src/styles/tokens.css`:
 * `space/container/on-card` 16 / 24 / 24 y `space/container/on-canva` 20 / 24 / 32 (Mobile / Tablet / Desktop),
 * `space/general/4xl` 24 / 32 / 32 y `space/general/3xl` 20 / 24 / 24.
 * Diferencias con Figma: el set pinta la superficie (Subtract) con `background-container-default-on-canva` y el Button corner
 * con `background-container-default-on-canva`; el código usa `default-on-card` y `hover-on-canva`. Figma dibuja las tarjetas de
 * 352 px (vertical y horizontal) y 317 px (Qualification); el código ocupa el ancho disponible.
 */

// Figma: 12995:3291 (component set Profile card)

type CardProps = Partial<ComponentProps<typeof ProfileCard>>;

const BASE = {
  title: 'Ana Pérez',
  subtitle: ['Diseñadora de producto', 'Medellín'],
  description: 'Proyectos de producto digital y servicios.',
};

const photo = () => <Avatar variant="photo" size="lg" src={PHOTO_SRC.Woman_1} alt="" />;
const brand = () => <Avatar variant="brand" size="lg" logo={<BrandLogo />} />;

const tags = () => (
  <>
    <Tag iconLeft={false}>Producto</Tag>
    <Tag iconLeft={false}>Investigación</Tag>
  </>
);

const stats = () => [
  { value: 128, label: 'Proyectos' },
  { value: 54, label: 'Reseñas' },
  { value: '4,5', label: 'Calificaciones', icon: <IconStar state="select" size={16} /> },
];

const contact = (name = 'Ana Pérez', variant: 'primary' | 'secondary' = 'secondary') => (
  <Button variant={variant} size="sm" aria-label={`Contactar a ${name}`}>
    Contactar
  </Button>
);

/** Standar vertical con avatar, calificación, etiquetas, selección y una acción. */
const vertical = (props: CardProps = {}) => (
  <ProfileCard {...BASE} leading={photo()} rating={4.5} tags={tags()} selection="checkbox" actions={contact()} {...props} />
);

const horizontal = (props: CardProps = {}) => vertical({ layout: 'horizontal', ...props });

/** Full: fila ancha con acciones, más opciones, etiquetas y contadores. */
const full = (props: CardProps = {}) => (
  <ProfileCard
    layout="full"
    title="Equipo de diseño"
    subtitle={['Estudio de producto', 'Medellín']}
    description="Proyectos de producto digital, con talleres con equipos."
    leading={brand()}
    tags={tags()}
    stats={stats()}
    actions={contact('Equipo de diseño', 'primary')}
    onMoreClick={() => {}}
    {...props}
  />
);

/** Qualification: todo centrado, con estrellas y contadores. */
const centered = (props: CardProps = {}) => (
  <ProfileCard
    {...BASE}
    layout="centered"
    leading={photo()}
    rating={4.5}
    stars={4}
    stats={stats()}
    actions={contact('Ana Pérez', 'primary')}
    {...props}
  />
);

/** Anchos de muestra: el de Figma en vertical y horizontal (352 px) y Qualification (317 px); Full pide más de 42 rem. */
const w352 = (node: ReactNode) => <div className="w-[352px]">{node}</div>;
const w317 = (node: ReactNode) => <div className="w-[317px]">{node}</div>;
/** Sobre la superficie del tema: la de la tarjeta (`default-on-card`) se funde con el lienzo de la anatomía. */
const onTheme = (node: ReactNode) => <div className="w-[384px] bg-ds-background-general-black p-4">{node}</div>;
const wide = (node: ReactNode) => <div className="w-[720px]">{node}</div>;
/** Ancho de la muestra móvil de Full (menos de 42 rem): la plantilla la reduce al marco. */
const narrow = (node: ReactNode) => <div className="w-[340px]">{node}</div>;

const states: DocStateItem[] = [
  {
    label: 'Standar vertical',
    tone: 'neutral',
    description: <>Avatar arriba y texto debajo. El Button corner de la esquina lleva la selección. Es <code>layout=&quot;vertical&quot;</code>.</>,
    samples: [onTheme(vertical())],
  },
  {
    label: 'Standar horizontal',
    tone: 'neutral',
    description: <>Avatar a la izquierda y texto a la derecha. El nombre deja libre la esquina del Button corner. Es <code>layout=&quot;horizontal&quot;</code>.</>,
    samples: [onTheme(horizontal())],
  },
  {
    label: 'Full',
    tone: 'neutral',
    description: <>Fila ancha con acciones y más opciones; etiquetas y contadores van debajo. Es <code>layout=&quot;full&quot;</code>.</>,
    samples: [wide(full())],
  },
  {
    label: 'Qualification',
    tone: 'neutral',
    description: <>Todo centrado, con estrellas y contadores. No lleva muesca ni más opciones. Es <code>layout=&quot;centered&quot;</code>.</>,
    samples: [w317(centered())],
  },
  {
    label: 'Seleccionada',
    tone: 'accent',
    description: <>El control de la esquina está marcado, con <code>defaultChecked</code> o <code>checked</code>. Figma no dibuja este estado.</>,
    samples: [onTheme(vertical({ defaultChecked: true }))],
  },
  {
    label: 'Selección deshabilitada',
    tone: 'neutral',
    description: <><code>disabled</code> desactiva solo el control de selección; las acciones siguen activas. Figma no dibuja este estado.</>,
    samples: [onTheme(vertical({ disabled: true }))],
  },
];

export const doc: ComponentDocContent = {
  name: 'ProfileCard',
  icon: 'user',
  classification: 'molecula',
  summary:
    'ProfileCard es la molécula para presentar a una persona o un equipo con su perfil completo. Une avatar con calificación, nombre, datos, etiquetas, descripción, acciones y contadores, y tiene cuatro disposiciones: vertical, horizontal, full y centered.',
  definition: [
    {
      title: 'Anatomía',
      description: 'La tarjeta pone la persona primero y reparte sus datos, etiquetas y acciones según la disposición.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Standar vertical',
                  preview: onTheme(vertical()),
                  marks: [
                    { n: 1, selector: 'article', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Avatar"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="00"]', side: 'right' },
                    { n: 4, selector: 'h3', side: 'left' },
                    { n: 5, selector: '[data-figma-part="Button corner "]', side: 'top' },
                    { n: 6, selector: 'p[data-figma-part="Status"]', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: 'article', side: 'left' },
                    { kind: 'gap', from: '[data-figma-part="Avatar"]', to: '[data-figma-part="Content"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <><strong>Contenedor:</strong> es un <code>article</code> nombrado por el título. Su padding es <code>space/container/on-card</code> (24 px en Desktop y Tablet, 16 px en Mobile) y deja 32 px entre bloques en Desktop y Tablet (<code>space/general/4xl</code>). La superficie tiene radio de 24 px y una muesca de 48 px para el Button corner.</>,
                <><strong>Avatar:</strong> <code>leading</code> recibe un <code>Avatar</code> <code>photo</code> o <code>brand</code> de tamaño <code>lg</code>.</>,
                <><strong>Calificación:</strong> <code>rating</code> dibuja un <code>Badge</code> de tipo <code>icon-number</code> sobre el avatar, con coma decimal (4,5). Los lectores de pantalla oyen el texto de <code>ratingLabel</code>. Sin <code>leading</code> no se dibuja.</>,
                <><strong>Nombre:</strong> <code>title</code> es el encabezado (nivel 3 por defecto, <code>headingLevel</code>) y nombra la tarjeta. Usa <code>typography-heading-size-md</code> en una sola línea. Bajo él, <code>subtitle</code> separa sus datos con «·».</>,
                <><strong>Button corner:</strong> con <code>selection</code> es un <code>Checkbox</code> o un <code>Radio</code> real; sin él, con <code>onMoreClick</code>, es el botón de tres puntos. En <code>vertical</code> y <code>horizontal</code> es 40 px.</>,
                <><strong>Descripción:</strong> <code>description</code> va bajo las etiquetas, en <code>typography-body-size-md</code> y <code>text-neutral-gray</code>. Después vienen <code>actions</code> y <code>stats</code>.</>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Standar horizontal',
                  preview: onTheme(horizontal()),
                  marks: [
                    { n: 1, selector: 'article', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Avatar"]', side: 'top' },
                    { n: 3, selector: 'h3', side: 'top' },
                    { n: 4, selector: '[data-figma-part="Button corner "]', side: 'top' },
                  ],
                  dimensions: [{ kind: 'gap', from: '[data-figma-part="Avatar"]', to: '[data-figma-part="Content"]' }],
                },
              ],
              guidelines: [
                <><strong>Contenedor:</strong> igual que en vertical: mismo padding, misma superficie con muesca y radio de 24 px. Los bloques se reparten en fila.</>,
                <><strong>Avatar:</strong> queda a la izquierda, con 32 px hasta el texto en Desktop y Tablet.</>,
                <><strong>Nombre:</strong> el bloque de nombre deja 56 px libres a la derecha para no pasar bajo el Button corner.</>,
                <><strong>Button corner:</strong> mismo control que en vertical, en la esquina superior derecha.</>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Full',
                  preview: wide(full()),
                  width: 720,
                  marks: [
                    { n: 1, selector: '[data-figma-part="Desktop"]', side: 'left' },
                    { n: 2, selector: 'h3', side: 'top' },
                    { n: 3, selector: 'button[aria-label^="Contactar"]', side: 'top' },
                    { n: 4, selector: '[data-figma-part="Dots-moreoptions"]', side: 'top' },
                    { n: 5, selector: '[data-figma-part="Tags"]', side: 'bottom' },
                    { n: 6, selector: '[data-figma-part="Counters"]', side: 'bottom' },
                  ],
                  dimensions: [{ kind: 'padding', selector: '[data-figma-part="Desktop"]', side: 'left' }],
                },
              ],
              guidelines: [
                <><strong>Marco:</strong> fondo <code>background-container-default-on-canva</code>, radio de 24 px y padding <code>space/container/on-canva</code> (32 px en Desktop). La tarjeta lleva sombra <code>shadow-on-card</code>. Los bloques se separan 24 px.</>,
                <><strong>Nombre:</strong> junto al avatar de la izquierda. Los datos y la descripción quedan debajo, en la misma columna.</>,
                <><strong>Acciones:</strong> <code>actions</code> va a la derecha del texto, con 8 px entre botones.</>,
                <><strong>Más opciones:</strong> con <code>onMoreClick</code> aparece un <code>Dots</code> <code>sm</code> al final de la fila. En Full no hay selección.</>,
                <><strong>Etiquetas:</strong> <code>tags</code> va en la segunda fila, a la izquierda, con 8 px entre etiquetas.</>,
                <><strong>Contadores:</strong> <code>stats</code> va a la derecha de la segunda fila. Cada columna tiene la cifra arriba, la etiqueta abajo y un divisor de 1 px.</>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Qualification',
                  preview: w317(centered()),
                  marks: [
                    { n: 1, selector: 'article', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Star rating"]', side: 'right' },
                    { n: 3, selector: 'p[data-figma-part="Status"]', side: 'right' },
                    { n: 4, selector: 'button[aria-label^="Contactar"]', side: 'right' },
                    { n: 5, selector: '[data-figma-part="Counters"]', side: 'right' },
                  ],
                  dimensions: [{ kind: 'padding', selector: 'article', side: 'left' }],
                },
              ],
              guidelines: [
                <><strong>Contenedor:</strong> fondo <code>background-container-default-on-canva</code>, radio de 24 px, sombra <code>shadow-on-card</code> y padding <code>space/container/on-canva</code> (32 px en Desktop). Todo el contenido va centrado.</>,
                <><strong>Estrellas:</strong> <code>stars</code> dibuja la fila de solo lectura, de 0 a 5, como una imagen con el puntaje. Puede usarse en cualquier disposición.</>,
                <><strong>Descripción:</strong> <code>description</code> se centra bajo las estrellas.</>,
                <><strong>Acción:</strong> <code>actions</code> va centrada; en esta disposición el botón principal es <code>primary</code>.</>,
                <><strong>Contadores:</strong> <code>stats</code> cierra la tarjeta, centrados y con divisor entre columnas.</>,
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
          ProfileCard tiene 6 estados. No es interactiva: sus estados son variantes de aspecto. Sus controles sí responden a Hover, Focus y Press, y se documentan en <code>Button</code>, <code>ButtonCorner</code>, <code>Checkbox</code>, <code>Radio</code> y <code>Dots</code>.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default. La tarjeta no fuerza un modo de color.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Standar vertical y horizontal',
              preview: onTheme(vertical()),
              entries: [
                { part: 'Superficie', color: 'background-container-default-on-card' },
                { part: 'Button corner (fondo)', color: 'background-container-hover-on-canva' },
                { part: 'Nombre', color: 'text-neutral-heading', text: 'typography-heading-size-md' },
                { part: 'Datos', color: 'text-neutral-gray', text: 'typography-body-size-sm' },
                { part: 'Descripción', color: 'text-neutral-gray', text: 'typography-body-size-md' },
                { part: 'Calificación (fondo)', color: 'background-acent-tertiary' },
                { part: 'Calificación (texto)', color: 'text-neutral-white-unicolor' },
                { part: 'Etiqueta (fondo)', color: 'background-acent-secondary' },
                { part: 'Etiqueta (texto)', color: 'text-acent-secondary' },
              ],
            },
            {
              title: 'Full',
              preview: wide(full()),
              entries: [
                { part: 'Marco', color: 'background-container-default-on-canva' },
                { part: 'Nombre', color: 'text-neutral-heading', text: 'typography-heading-size-md' },
                { part: 'Datos', color: 'text-neutral-gray', text: 'typography-body-size-sm' },
                { part: 'Cifra del contador', color: 'text-neutral-heading', text: 'typography-heading-size-lg' },
                { part: 'Etiqueta del contador', color: 'text-neutral-gray', text: 'typography-body-size-sm' },
                { part: 'Divisor del contador', color: 'border-general-default-on-canva' },
              ],
            },
            {
              title: 'Qualification',
              preview: w317(centered()),
              entries: [
                { part: 'Superficie', color: 'background-container-default-on-canva' },
                { part: 'Nombre', color: 'text-neutral-heading', text: 'typography-heading-size-md' },
                { part: 'Descripción', color: 'text-neutral-gray', text: 'typography-body-size-md' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente ProfileCard en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <><strong>Búsqueda y configuración:</strong> encuentra el componente como Profile card en la librería de Assets. Su propiedad de variante es Type, con cuatro valores, y tiene interruptores para Counters, Tags, Icon buttons, Radius button, Subtitle, Description y Button.</>,
            <><strong>Type:</strong> Standar vertical es <code>layout=&quot;vertical&quot;</code> (el valor por defecto), Standar horizontal es <code>horizontal</code>, Full es <code>full</code> y Qualification es <code>centered</code>. <code>hero</code> es el nombre anterior de <code>full</code>: sigue funcionando, pero está deprecado.</>,
            <><strong>Interruptores y textos:</strong> Radius button es <code>selection</code> (<code>checkbox</code> o <code>radio</code>), Tags es <code>tags</code>, Counters es <code>stats</code>, Icon buttons y Button son <code>actions</code>, y los textos Title, Subtittle y Description son <code>title</code>, <code>subtitle</code> y <code>description</code>. Las estrellas de Qualification son <code>stars</code>.</>,
            <><strong>Diferencias:</strong> Figma pinta la superficie y el Button corner con <code>background-container-default-on-canva</code>; el código usa <code>default-on-card</code> y <code>hover-on-canva</code>. Full trae su marco Mobile dentro del set; el código lo activa por el ancho del contenedor (menos de 42 rem). El código añade los nombres accesibles, <code>headingLevel</code> y los estados Seleccionada y Selección deshabilitada.</>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo ProfileCard es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <><strong>Perfil completo de una persona o un equipo:</strong> reúne avatar, datos, etiquetas, descripción y contadores en una sola tarjeta.</>,
            <><strong>Elegir entre varios perfiles:</strong> usa <code>selection</code> con <code>name</code> y <code>value</code>. Con <code>radio</code> se elige uno; con <code>checkbox</code>, varios.</>,
            <><strong>Acciones sobre la persona:</strong> pasa <code>actions</code> y deja que cada botón nombre a la persona en su <code>aria-label</code>.</>,
            <><strong>Reputación visible:</strong> usa <code>rating</code> para la calificación sobre el avatar, o <code>stars</code> y <code>stats</code> en <code>layout=&quot;centered&quot;</code>.</>,
            <><strong>Jerarquía de la página:</strong> ajusta <code>headingLevel</code> para que el nombre siga el orden de los encabezados de la página.</>,
          ],
          avoid: [
            <><strong>Tarjeta que se elige o se abre al hacer clic:</strong> en ProfileCard no se elige la tarjeta entera, solo su control de selección; el resto no es clicable. (Alternativa: <code>InteractiveCard</code>).</>,
            <><strong>Contacto rápido con solo nombre, rol y llamada:</strong> ProfileCard es más completa de lo que hace falta. (Alternativa: <code>ContactCard</code>).</>,
            <><strong>Una cifra o métrica sin persona:</strong> aquí el dato es la persona, no el número. (Alternativa: <code>DataCard</code>).</>,
            <><strong>Perfil dentro de una conversación:</strong> ProfileCard no trae documentos ni fotografías. (Alternativa: <code>ChatDetailsPanel</code>).</>,
          ],
        },
      ],
    },
    {
      title: 'Aplicaciones de breakpoints',
      description: 'Cada vista se dibuja con los valores responsive de su breakpoint. Tablet comparte los tokens de Desktop salvo el padding de Full y Qualification (space/container/on-canva), que baja de 32 a 24 px.',
      blocks: [
        {
          type: 'breakpoints',
          desktop: {
            columns: [
              {
                title: 'Standar vertical',
                bullets: [
                  <><strong>Padding de 24 px:</strong> <code>space/container/on-card</code>, con 32 px entre el avatar y el contenido (<code>space/general/4xl</code>).</>,
                  <>La tarjeta ocupa el ancho disponible y su alto depende del contenido. El nombre cabe en una línea.</>,
                ],
                preview: w352(vertical()),
              },
              {
                title: 'Full',
                bullets: [
                  <><strong>Padding de 32 px:</strong> <code>space/container/on-canva</code>, con 24 px entre filas (<code>space/general/3xl</code>).</>,
                  <>La primera fila reúne avatar, texto, acciones y más opciones; la segunda, etiquetas a la izquierda y contadores a la derecha.</>,
                ],
                preview: wide(full()),
              },
            ],
          },
          mobile: {
            bullets: [
              <><strong>Full en versión móvil:</strong> con el contenedor bajo 42 rem, avatar y acciones quedan arriba, el texto y las etiquetas debajo, y los contadores ocupan todo el ancho.</>,
              <><strong>Padding de 20 px:</strong> en Full y Qualification, <code>space/container/on-canva</code> baja de 32 a 20 px, y la separación entre filas, de 24 a 20 px.</>,
              <><strong>Vertical y horizontal:</strong> el padding es de 16 px y la separación entre bloques, de 24 px. Bajo 48 rem de pantalla, las acciones ocupan todo el ancho.</>,
            ],
            preview: narrow(full()),
          },
          tablet: {
            bullets: [
              <><strong>Padding de 24 px:</strong> en Full y Qualification, <code>space/container/on-canva</code> mide 24 px en Tablet y 32 px en Desktop.</>,
              <>Vertical y horizontal usan los mismos valores que Desktop: 24 px de padding y 32 px entre bloques.</>,
              <>Full conserva sus dos filas mientras el contenedor mida 42 rem o más; por debajo pasa a su versión móvil.</>,
            ],
            preview: w317(centered()),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas para perfiles claros y accesibles.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Acción con el nombre',
              description: <>Incluye a la persona en el <code>aria-label</code> de cada acción.</>,
              preview: <ProfileCard {...BASE} leading={photo()} actions={contact('Ana Pérez')} />,
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Acción sin nombre',
              description: <>No dejes la acción sin <code>aria-label</code>: en una lista, el lector de pantalla repite «Contactar» en cada tarjeta. Se ve igual que la muestra correcta.</>,
              preview: (
                <ProfileCard
                  {...BASE}
                  leading={photo()}
                  actions={
                    <Button variant="secondary" size="sm">
                      Contactar
                    </Button>
                  }
                />
              ),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Calificación con avatar',
              description: <>Pasa <code>rating</code> junto con <code>leading</code> para que el Badge quede sobre el avatar.</>,
              preview: <ProfileCard {...BASE} leading={photo()} rating={4.5} />,
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Calificación sin avatar',
              description: <>No pases <code>rating</code> sin <code>leading</code>: el Badge no se dibuja y la calificación se pierde.</>,
              preview: <ProfileCard {...BASE} rating={4.5} />,
            },
            {
              kind: 'do',
              framed: true,
              title: 'Datos cortos',
              description: <>Pon en <code>subtitle</code> datos de pocas palabras y el resto en <code>description</code>.</>,
              preview: <ProfileCard {...BASE} leading={photo()} />,
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Texto largo en datos',
              description: <>No pongas la descripción en <code>subtitle</code>: son datos cortos que se separan con «·».</>,
              preview: (
                <ProfileCard
                  title={BASE.title}
                  subtitle="Proyectos de producto digital y servicios. Diez años de experiencia en investigación."
                  leading={photo()}
                />
              ),
            },
          ],
        },
      ],
    },
  ],
};
