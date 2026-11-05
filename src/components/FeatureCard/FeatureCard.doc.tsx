import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { ButtonCorner } from '../ButtonCorner';
import { Icon } from '../Icon';
import { ListItem } from '../ListItem';
import { FeatureCard } from './FeatureCard';
import featurePhoto from './assets/destacar-archivo.png';

/*
 * Contenido de la página de documentación de FeatureCard (plantilla v2). Manda el código (`FeatureCard.types.ts`,
 * `FeatureCard.variants.ts`, `FeatureCard.tsx`), luego `FeatureCard.docs.json`. El set de Figma solo tiene `Type=2`
 * (cutout): Photo y Surface se documentan desde el código.
 */

// Figma: 16903:57057 (component set Featured card)

type CardProps = ComponentProps<typeof FeatureCard>;

const TITLE = 'Nueva guía de estilo';
const DESCRIPTION = 'Reglas de color y tipografía para todo el equipo.';

const action = () => (
  <Button variant="secondary" size="sm" unicolor aria-label={`Ver más sobre ${TITLE}`}>
    Ver más
  </Button>
);

const corner = (label = 'Abrir Tareas por revisar') => (
  <ButtonCorner
    contrast="on-card"
    size="md"
    aria-label={label}
    icon={<Icon name="arrow-diagonal-right" size={16} variant="line" />}
  />
);

const itemList = () => (
  <ul role="list" className="m-0 flex min-w-0 flex-col p-0">
    <ListItem title="Informe trimestral" leading={<Avatar name="Hugo García" size="sm" />} />
    <ListItem variant="simple" title="Acta de reunión" />
  </ul>
);

/** Ancho de muestra: la plantilla reduce lo que no cabe. */
const sized = (width: string, node: ReactNode) => <div className={width}>{node}</div>;

const photo = (props: Partial<CardProps> = {}, width = 'w-[360px]') =>
  sized(
    width,
    <FeatureCard variant="photo" title={TITLE} description={DESCRIPTION} date="7 feb 2024" dateTime="2024-02-07" src={featurePhoto} action={action()} {...props} />
  );

const surface = (props: Partial<CardProps> = {}, withAction = true, width = 'w-[360px]') =>
  sized(
    width,
    <FeatureCard
      variant="surface"
      title="Tareas por revisar"
      description="Dos documentos esperan aprobación."
      date="7 feb 2024"
      dateTime="2024-02-07"
      action={withAction ? corner() : undefined}
      {...props}
    >
      {itemList()}
    </FeatureCard>
  );

const cutout = (props: Partial<CardProps> = {}, width = 'w-[498px]') =>
  sized(
    width,
    <FeatureCard variant="cutout" src={featurePhoto} eyebrow="Guía" title={'Cómo preparar\nuna presentación'} {...props} />
  );

/** Ancho de muestra dentro del marco de teléfono de Do and Dont’s (unos 310 px útiles). */
const PHONE = 'w-[310px]';

const states: DocStateItem[] = [
  {
    label: 'Photo',
    tone: 'neutral',
    description: <>Foto de fondo, texto arriba y una acción. El texto usa siempre los tokens del modo oscuro y un velo superior lo mantiene legible con cualquier foto.</>,
    samples: [photo()],
  },
  {
    label: 'Surface',
    tone: 'neutral',
    description: <>Superficie con una muesca arriba a la derecha para la acción y un espacio para una lista bajo el texto.</>,
    samples: [surface()],
  },
  {
    label: 'Surface sin acción',
    tone: 'neutral',
    description: <>Sin <code>action</code> la superficie no dibuja la muesca y el borde queda liso.</>,
    samples: [surface({}, false)],
  },
  {
    label: 'Cutout',
    tone: 'neutral',
    description: 'Foto grande con un recorte abajo a la izquierda. El titular y la línea corta van en el recorte, sin fecha, descripción ni acción.',
    samples: [cutout()],
  },
  {
    label: 'Sin imagen',
    tone: 'neutral',
    description: <>Sin <code>src</code> la foto se reemplaza por un marcador neutro con un ícono de imagen. Es un respaldo, no un diseño final.</>,
    samples: [photo({ src: undefined })],
  },
];

export const doc: ComponentDocContent = {
  name: 'FeatureCard',
  icon: 'image',
  classification: 'molecula',
  summary:
    'FeatureCard es la molécula para destacar un contenido con imagen, como una novedad o una guía. Tiene tres tipos: Photo, con foto de fondo y una acción; Surface, con una superficie y un espacio para una lista; y Cutout, con una foto grande y el titular en un recorte. No es interactiva.',
  definition: [
    {
      title: 'Anatomía',
      description: 'FeatureCard es un artículo nombrado por su título. Cada tipo ordena sus partes de otra forma.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Photo',
                  preview: photo(),
                  marks: [
                    { n: 1, selector: 'article', side: 'left' },
                    { n: 2, selector: '[data-slot="date-icon"]', side: 'top' },
                    { n: 3, selector: 'h3', side: 'right' },
                    { n: 4, selector: '[data-figma-part="Status"]', side: 'right' },
                    { n: 5, selector: 'button', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: 'article', side: 'left' },
                    { kind: 'gap', from: 'h3', to: '[data-figma-part="Status"]', axis: 'y' },
                    { kind: 'gap', from: '[data-figma-part="Title/state"]', to: 'button', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <><strong>Contenedor y foto:</strong> el artículo ocupa el ancho disponible, con proporción 498 / 654, radio <code>radius/general/2xl</code>, padding <code>space/general/3xl</code> y separación <code>space/general/2xl</code> entre el bloque de texto y la acción. La foto llena el fondo.</>,
                <><strong>Fecha:</strong> ícono <code>calendar</code> de 12 px y texto de 10 px dentro de un <code>time</code>, con 4 px de separación. Se muestra con <code>date</code> y <code>dateTime</code>.</>,
                <><strong>Título:</strong> encabezado en fuente secundaria semibold. Es el nombre accesible del artículo; el nivel se elige con <code>headingLevel</code> (<code>h3</code> por defecto).</>,
                <><strong>Descripción:</strong> texto de 16 px con altura de línea de 20 px, a 8 px del título.</>,
                <><strong>Acción:</strong> normalmente un <code>Button</code> secondary sm <code>unicolor</code> bajo el texto. Lleva su propio nombre accesible.</>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Surface',
                  preview: surface(),
                  marks: [
                    { n: 1, selector: 'article', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Button corner "]', side: 'top' },
                    { n: 3, selector: 'h3', side: 'right' },
                    { n: 4, selector: '[data-figma-part="Espacio"]', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: 'article', side: 'left' },
                    { kind: 'gap', from: '[data-figma-part="Title/state"]', to: '[data-figma-part="Espacio"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <><strong>Contenedor:</strong> superficie <code>background/container/default-on-canva</code> con padding <code>space/general/3xl</code> y 16 px entre el texto y el espacio.</>,
                <><strong>Muesca y acción:</strong> la muesca de 48 px recibe un <code>ButtonCorner</code> <code>contrast=&quot;on-card&quot;</code>. Sin <code>action</code> no hay muesca.</>,
                <><strong>Texto:</strong> fecha, título y descripción como en Photo, pero la fecha usa <code>text/neutral/body</code>.</>,
                <><strong>Espacio:</strong> contenido libre bajo el texto, a ancho completo. Úsalo para una lista de <code>ListItem</code>.</>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Cutout',
                  preview: cutout(),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Subtract"]', side: 'top' },
                    { n: 2, selector: '[data-figma-part="Frame 1984080612"]', side: 'right' },
                    { n: 3, selector: '[data-figma-part="Subtítulo"]', side: 'left' },
                    { n: 4, selector: 'h3', side: 'bottom' },
                  ],
                  dimensions: [{ kind: 'gap', from: '[data-figma-part="Subtítulo"]', to: 'h3', axis: 'y' }],
                },
              ],
              guidelines: [
                <><strong>Foto con recorte:</strong> la foto llena la tarjeta (proporción mínima 612 / 681) y se recorta abajo a la izquierda con esquinas de <code>radius/general/2xl</code>. El recorte mide lo mismo que el bloque de texto.</>,
                <><strong>Bloque de texto:</strong> va pegado abajo a la izquierda, con 16 px de aire arriba y 24 px a la derecha. Si el texto no cabe, la tarjeta crece.</>,
                <><strong>Línea corta:</strong> <code>eyebrow</code>, en fuente secundaria semibold de 12 px. Se ve arriba del titular, aunque el titular va primero en el DOM.</>,
                <><strong>Titular:</strong> fuente secundaria bold de 40 px con altura de línea de 44 px. Admite saltos de línea con <code>\n</code>.</>,
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Estados',
      description: 'FeatureCard tiene 5 variantes de aspecto. No es interactiva: no tiene Hover, Focus ni Press, porque lo interactivo es la acción que se le pasa.',
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens de cada tipo. Cambia el modo para ver su valor; el texto de Photo queda siempre en modo oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Photo',
              preview: photo(),
              entries: [
                { part: 'Velo superior', color: 'primitives-color-primary-g14', mode: 'dark' },
                { part: 'Fecha', color: 'text-neutral-white', text: 'typography-body-size-xs', mode: 'dark' },
                { part: 'Ícono de la fecha', color: 'icon-general-default', mode: 'dark' },
                { part: 'Título', color: 'text-neutral-heading', text: 'typography-heading-size-2xl', mode: 'dark' },
                { part: 'Descripción', color: 'text-neutral-gray', text: 'primitives-typography-size-lg', mode: 'dark' },
                { part: 'Fondo sin imagen', color: 'background-container-default-on-card' },
              ],
            },
            {
              title: 'Surface',
              preview: surface(),
              entries: [
                { part: 'Fondo', color: 'background-container-default-on-canva' },
                { part: 'Fecha', color: 'text-neutral-body', text: 'typography-body-size-xs' },
                { part: 'Ícono de la fecha', color: 'icon-general-gray-high-contrast' },
                { part: 'Título', color: 'text-neutral-heading', text: 'typography-heading-size-2xl' },
                { part: 'Descripción', color: 'text-neutral-gray', text: 'primitives-typography-size-lg' },
              ],
            },
            {
              title: 'Cutout',
              preview: cutout(),
              entries: [
                { part: 'Línea corta', color: 'text-neutral-white', text: 'typography-heading-size-xs' },
                { part: 'Titular', color: 'text-neutral-heading', text: 'primitives-typography-size-5xl' },
                { part: 'Sombra de la foto', color: 'responsive-effect-shadow-on-canva-md' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente FeatureCard en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <><strong>Búsqueda y configuración:</strong> encuentra el componente como Featured card en la librería de Assets. El set solo tiene la variante <code>Type=2</code>, de 612 × 681 px.</>,
            <><strong>Type:</strong> <code>Type=2</code> corresponde a <code>variant=&quot;cutout&quot;</code>. Photo y Surface no tienen set en Figma: se documentan desde el código.</>,
            <><strong>Textos:</strong> Tittle es <code>title</code> (admite salto de línea con <code>\n</code>), Subtittle es <code>eyebrow</code> y Description, Date y Espacio son <code>description</code>, <code>date</code> y <code>children</code>.</>,
            <><strong>Diferencias:</strong> el set declara Description, Date y Espacio, pero <code>Type=2</code> no los dibuja. En el código solo los usan Photo y Surface; Cutout los ignora.</>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo FeatureCard es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <><strong>Novedad con foto:</strong> usa Photo para una noticia, una guía o una campaña que lleva imagen y una acción.</>,
            <><strong>Destacado con lista:</strong> usa Surface cuando el destacado agrupa elementos en el espacio y la acción va en la muesca.</>,
            <><strong>Portada con titular:</strong> usa Cutout para un titular grande sobre una foto, sin acción.</>,
            <><strong>Título que nombra la tarjeta:</strong> el título es el nombre del artículo; elige <code>headingLevel</code> según el lugar en la página.</>,
          ],
          avoid: [
            <><strong>Elegir entre opciones:</strong> FeatureCard no se selecciona. (Alternativa: <code>InteractiveCard</code>).</>,
            <><strong>Mostrar un dato:</strong> una cifra con su etiqueta no necesita foto. (Alternativa: <code>DataCard</code>).</>,
            <><strong>Mostrar un archivo:</strong> no uses una foto destacada para un documento. (Alternativa: <code>FileCard</code>).</>,
            <><strong>Mostrar una persona:</strong> el perfil y el contacto tienen sus tarjetas. (Alternativas: <code>ProfileCard</code> y <code>ContactCard</code>).</>,
            <><strong>Agrupar información en secciones:</strong> varias secciones de datos no necesitan una foto. (Alternativa: <code>InformationCard</code>).</>,
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
                title: 'Photo y Surface',
                bullets: [
                  <>Padding de 24 px y título de 32 px con altura de línea de 36 px.</>,
                  <>El ancho es el del contenedor; Photo conserva la proporción 498 / 654 y Surface crece con su contenido.</>,
                ],
                preview: photo(),
              },
              {
                title: 'Cutout',
                bullets: [
                  <>Padding derecho del texto de 24 px y titular de 40 px, que no cambia entre breakpoints.</>,
                  <>El ancho es el del contenedor, con proporción mínima 612 / 681; si el texto no cabe, la tarjeta crece.</>,
                ],
                preview: cutout(),
              },
            ],
          },
          mobile: {
            bullets: [
              <><strong>Padding:</strong> baja a 20 px en Photo y Surface, y en el padding derecho del texto de Cutout.</>,
              <><strong>Título:</strong> baja a 24 px con altura de línea de 32 px en Photo y Surface. El titular de Cutout se queda en 40 px.</>,
              <>La tarjeta ocupa todo el ancho disponible y el texto ajusta línea.</>,
            ],
            preview: photo(),
          },
          tablet: {
            bullets: [
              <><strong>Padding:</strong> 24 px, igual que en Desktop.</>,
              <><strong>Título:</strong> 32 px con altura de línea de 36 px, igual que en Desktop.</>,
              <>La tarjeta ocupa todo el ancho disponible y el texto ajusta línea.</>,
            ],
            preview: photo(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Criterios para destacar contenido con claridad y sin perder accesibilidad.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Acción con contexto',
              description: <>Da a la acción un <code>aria-label</code> que empiece con su texto visible y nombre el tema.</>,
              preview: photo({}, PHONE),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Acción genérica',
              description: <>No dejes varias acciones con el mismo nombre. Se ve igual que la muestra correcta; el lector de pantalla solo oye &quot;Ver más&quot;.</>,
              preview: photo(
                {
                  action: (
                    <Button variant="secondary" size="sm" unicolor>
                      Ver más
                    </Button>
                  ),
                },
                PHONE
              ),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Descripción breve',
              description: 'Limita la descripción a una o dos frases.',
              preview: surface({ description: 'Dos documentos esperan aprobación.' }, true, PHONE),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Descripción larga',
              description: 'No uses la descripción para párrafos: la tarjeta crece y el título pierde peso.',
              preview: surface({
                description:
                  'Dos documentos esperan aprobación antes de la reunión del lunes. Revisa los comentarios del equipo, confirma las cifras del informe y deja tus notas en el acta para que todas las personas lleguen con el mismo contexto.',
              }, true, PHONE),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Imagen definida',
              description: <>Pasa <code>src</code> en Photo y Cutout; el marcador es solo un respaldo.</>,
              preview: cutout({ eyebrow: 'Equipo', title: 'Novedades' }, PHONE),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Marcador como final',
              description: <>No publiques la tarjeta sin <code>src</code>: el marcador gris no comunica el contenido.</>,
              preview: cutout({ src: undefined, eyebrow: 'Equipo', title: 'Novedades' }, PHONE),
            },
          ],
        },
      ],
    },
  ],
};
