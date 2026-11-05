import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Avatar } from '../Avatar';
import { PHOTO_SRC } from '../Avatar/Avatar.sample-data';
import { DropdownMenuItem } from '../DropdownMenu';
import { ContactCard } from './ContactCard';

/*
 * Contenido de la página de documentación de ContactCard (plantilla v2). Manda el código (`ContactCard.types.ts`,
 * `ContactCard.variants.ts`, `ContactCard.tsx`), luego `ContactCard.docs.json`. Diferencia con Figma: el set pinta la
 * superficie de More con `background/container/default-on-canva`; el código usa `default-on-card` en las tres variantes.
 */

// Figma: 18867:20091 (component set Call/chat card)

const avatar = () => <Avatar variant="photo" size="lg" src={PHOTO_SRC.Men_4} alt="" />;
const menu = (
  <>
    <DropdownMenuItem>Ver perfil</DropdownMenuItem>
    <DropdownMenuItem>Silenciar</DropdownMenuItem>
  </>
);

/** Tarjeta de muestra: avatar con calificación, nombre y rol. `More` lleva menú; las otras dos, manejadores vacíos. */
const card = (props: Partial<ComponentProps<typeof ContactCard>> = {}, title: ReactNode = 'Ana Pérez') => (
  <ContactCard title={title} eyebrow="Diseñadora de producto" rating={4.5} leading={avatar()} menuItems={menu} {...props} />
);

/** Muestra con ancho fijo razonable (Figma: 402 px; 360 px para que se lea también a 390). */
const sized = (node: ReactNode) => <div className="w-[360px]">{node}</div>;

/** Para Anatomía: la tarjeta se apoya en la superficie del tema, porque su fondo es el mismo del lienzo y no se vería. */
const onSurface = (node: ReactNode) => <div className="w-[360px] bg-ds-background-general-black p-4">{node}</div>;

const states: DocStateItem[] = [
  {
    label: 'More',
    tone: 'neutral',
    description: <>Botón de tres puntos en la muesca de la esquina. Con <code>menuItems</code> abre un menú; sin ellos solo dispara <code>onMoreClick</code>.</>,
    samples: [sized(card())],
  },
  {
    label: 'Communication',
    tone: 'neutral',
    description: 'Dos botones secundarios de ícono, llamar y chatear. La superficie no lleva muesca.',
    samples: [sized(card({ variant: 'communication' }))],
  },
  {
    label: 'External Link',
    tone: 'neutral',
    description: 'Un botón primario de llamada en la muesca de la esquina. Es la acción que más destaca de la tarjeta.',
    samples: [sized(card({ variant: 'external-link' }))],
  },
  {
    label: 'Sin avatar',
    tone: 'neutral',
    description: <>Sin <code>leading</code> ni <code>rating</code> la tarjeta empieza por el texto. El código lo admite; Figma no lo dibuja.</>,
    samples: [sized(card({ leading: undefined, rating: undefined }))],
  },
];

export const doc: ComponentDocContent = {
  name: 'ContactCard',
  icon: 'call',
  classification: 'molecula',
  summary:
    'ContactCard es la molécula para presentar a una persona de contacto con una acción rápida. Une avatar, calificación, nombre, rol y botones de llamada o chat, y tiene tres variantes según la acción de la derecha.',
  definition: [
    {
      title: 'Anatomía',
      description: 'La tarjeta pone la persona a la izquierda y la acción a la derecha.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'More',
                  preview: onSurface(card()),
                  marks: [
                    { n: 1, selector: 'article', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Item card"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Badge"]', side: 'bottom' },
                    { n: 4, selector: '[data-figma-part="Titulo"]', side: 'top' },
                    { n: 5, selector: '[data-figma-part="Subtitulo"]', side: 'bottom' },
                    { n: 6, selector: '[data-figma-part="Button corner "]', side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: 'article', side: 'left' },
                    { kind: 'gap', from: '[data-figma-part="Item card"]', to: '[data-figma-part="Information"]' },
                  ],
                },
              ],
              guidelines: [
                <><strong>Contenedor:</strong> es un <code>article</code> nombrado por su título, con separación de 16 px y radio de 24 px. Mide 98 px de alto en Desktop y Tablet, y 82 px en Mobile. Su fondo es <code>background-container-default-on-card</code> y la esquina lleva una muesca de 48 px para el botón.</>,
                <><strong>Avatar:</strong> el slot <code>leading</code> mide 56 × 56 px. Recibe un <code>Avatar</code> de tamaño <code>lg</code>.</>,
                <><strong>Calificación:</strong> <code>rating</code> dibuja un <code>Badge</code> de tipo <code>icon-number</code> sobre el avatar, con coma decimal (4,5). Los lectores de pantalla oyen el texto de <code>ratingLabel</code>.</>,
                <><strong>Línea corta:</strong> <code>eyebrow</code> va sobre el nombre, en 12 px con interlineado de 18 px y color <code>text-neutral-body</code>. En el DOM va después del título.</>,
                <><strong>Título:</strong> <code>title</code> es el encabezado (nivel 3 por defecto) y nombra la tarjeta. Usa 12 px semibold con interlineado de 16 px.</>,
                <><strong>Botón de la esquina:</strong> un <code>ButtonCorner</code> de 40 px con tres puntos. El texto no pasa por debajo de él.</>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Communication',
                  preview: onSurface(card({ variant: 'communication' })),
                  marks: [
                    { n: 1, selector: 'article', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Item card"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Frame 1984080549"] > button', index: 0, side: 'top' },
                    { n: 4, selector: '[data-figma-part="Frame 1984080549"] > button', index: 1, side: 'bottom' },
                  ],
                  dimensions: [{ kind: 'gap', from: '[data-figma-part="Frame 1984080549"] > button', fromIndex: 0, to: '[data-figma-part="Frame 1984080549"] > button', toIndex: 1 }],
                },
                {
                  label: 'External Link',
                  preview: onSurface(card({ variant: 'external-link' })),
                  marks: [
                    { n: 1, selector: 'article', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Item card"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Button"]', side: 'bottom' },
                  ],
                },
              ],
              guidelines: [
                <><strong>Contenedor:</strong> igual que en More. Communication no lleva muesca y External Link la lleva de 54 px.</>,
                <><strong>Avatar:</strong> mismo slot y misma calificación en las tres variantes.</>,
                <><strong>Botón de llamada:</strong> un <code>Button</code> de solo ícono, tamaño <code>sm</code> (48 px). Es secundario en Communication y primario en External Link.</>,
                <><strong>Botón de chat:</strong> solo en Communication. Es un <code>Button</code> secundario del mismo tamaño, a 8 px del de llamada.</>,
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
          ContactCard tiene 4 estados. No es interactiva: sus estados son variantes de aspecto. Sus botones sí responden a Hover, Focus y Press, y se documentan en <code>Button</code> y <code>ButtonCorner</code>.
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
              title: 'More',
              preview: sized(card()),
              entries: [
                { part: 'Fondo de la tarjeta', color: 'background-container-default-on-card' },
                { part: 'Título', color: 'text-neutral-white', text: 'typography-heading-size-xs' },
                { part: 'Línea corta', color: 'text-neutral-body', text: 'typography-body-size-sm' },
                { part: 'Calificación (fondo)', color: 'background-acent-tertiary' },
                { part: 'Calificación (texto)', color: 'text-neutral-white-unicolor', text: 'typography-heading-size-xs' },
                { part: 'Botón de la esquina (fondo)', color: 'background-container-default-on-canva' },
                { part: 'Botón de la esquina (ícono)', color: 'icon-general-default' },
              ],
            },
            {
              title: 'Communication',
              preview: sized(card({ variant: 'communication' })),
              entries: [
                { part: 'Botones (borde)', color: 'border-button-secondary-low-default' },
                { part: 'Botones (ícono)', color: 'icon-button-secondary-low-default' },
              ],
            },
            {
              title: 'External Link',
              preview: sized(card({ variant: 'external-link' })),
              entries: [
                { part: 'Botón de llamada (fondo)', color: 'background-button-primary-default' },
                { part: 'Botón de llamada (ícono)', color: 'icon-button-primary-default' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente ContactCard en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <><strong>Búsqueda y configuración:</strong> encuentra el componente como Call/chat card en la librería de Assets. Su única propiedad es Propiedad 1, con tres valores.</>,
            <><strong>Propiedad 1:</strong> More es <code>variant=&quot;more&quot;</code>, Communication es <code>variant=&quot;communication&quot;</code> y External Link es <code>variant=&quot;external-link&quot;</code>.</>,
            <><strong>Titulo y Subtitulo:</strong> las capas de texto están al revés que en el código. Subtitulo (el nombre) es <code>title</code> y Titulo (el rol) es <code>eyebrow</code>.</>,
            <><strong>Diferencias:</strong> en More, Figma pinta la superficie con <code>background-container-default-on-canva</code>; el código usa <code>default-on-card</code> en las tres variantes. El código añade el menú, los nombres accesibles y <code>actions</code>.</>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo ContactCard es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <><strong>Contacto con una acción rápida:</strong> usa <code>variant=&quot;communication&quot;</code> para llamar o chatear desde la misma tarjeta.</>,
            <><strong>Una acción principal:</strong> usa <code>variant=&quot;external-link&quot;</code> cuando llamar es lo único que importa.</>,
            <><strong>Opciones adicionales:</strong> usa <code>variant=&quot;more&quot;</code> con <code>menuItems</code> para agrupar acciones como ver perfil o silenciar.</>,
            <><strong>Botones propios:</strong> pasa <code>actions</code> para reemplazar lo de la derecha. Cada botón necesita su <code>aria-label</code>.</>,
            <><strong>Nombre de la persona:</strong> pasa <code>personName</code> cuando <code>title</code> no es texto, para que los botones se anuncien como &quot;Llamar a Ana Pérez&quot;.</>,
          ],
          avoid: [
            <><strong>Tarjeta que abre un detalle al hacer clic:</strong> ContactCard no es clicable; solo lo son sus botones. (Alternativa: un enlace en el título, como hace <code>ChatCard</code> con <code>href</code>, o <code>ButtonLink</code> para la acción).</>,
            <><strong>Perfil completo con etiquetas y contadores:</strong> ContactCard solo lleva nombre, rol y calificación. (Alternativa: <code>ProfileCard</code>).</>,
            <><strong>Conversación con mensajes sin leer:</strong> aquí no hay vista previa ni hora. (Alternativa: <code>ChatCard</code>).</>,
            <><strong>Información sin acción:</strong> si nadie va a llamar ni chatear, la tarjeta sobra. (Alternativa: <code>InformationCard</code>).</>,
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
                title: 'More',
                bullets: [
                  <><strong>Padding de 24 px:</strong> <code>space/container/on-card</code>, con separación de 16 px entre avatar y texto. La tarjeta mide 98 px de alto.</>,
                  <>El texto ocupa el ancho que deja el avatar y la muesca; si no cabe, se corta con puntos suspensivos.</>,
                ],
                preview: card(),
              },
              {
                title: 'Communication',
                bullets: [
                  <><strong>Padding de 24 px:</strong> igual que en More, sin muesca en la esquina.</>,
                  <>Los dos botones de 48 px quedan fijos a la derecha y el texto cede el espacio.</>,
                ],
                preview: card({ variant: 'communication' }),
              },
            ],
          },
          mobile: {
            bullets: [
              <><strong>Padding de 16 px:</strong> en Mobile <code>space/container/on-card</code> baja de 24 a 16 px.</>,
              <>La separación entre avatar y texto sigue en 16 px. La tarjeta mide 82 px de alto, frente a 98 px en Desktop y Tablet.</>,
              <>La tipografía no cambia: título de 12 px y línea corta de 12 px.</>,
            ],
            preview: card(),
          },
          tablet: {
            bullets: [
              <><strong>Padding de 24 px:</strong> igual que en Desktop.</>,
              <>La tarjeta ocupa el ancho disponible; el avatar de 56 px no cambia.</>,
              <>Los botones conservan su tamaño de 48 px (o 40 px en More).</>,
            ],
            preview: card({ variant: 'external-link' }),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas para tarjetas de contacto claras y accesibles.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Nombre y rol por separado',
              description: <>Pon el nombre en <code>title</code> y el rol en <code>eyebrow</code>.</>,
              preview: card({ variant: 'communication', eyebrow: 'Diseñadora' }, 'Ana Pérez'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Nombre y rol juntos',
              description: <>No juntes nombre y rol en <code>title</code>: el texto se corta y los botones lo repiten.</>,
              preview: card({ variant: 'communication', eyebrow: undefined }, 'Ana Pérez, diseñadora de producto sénior'),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Nombre para los botones',
              description: <>Pasa <code>personName</code> si <code>title</code> no es texto. Las dos muestras se ven igual: cambia lo que anuncia el lector de pantalla.</>,
              preview: card({ variant: 'communication', eyebrow: 'Diseñadora', personName: 'Ana Pérez' }, <span>Ana Pérez</span>),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Botones sin nombre',
              description: <>No dejes <code>title</code> como elemento sin <code>personName</code>: los botones dicen solo &quot;Llamar a&quot; y &quot;Chatear con&quot;. Se ve igual que la muestra correcta.</>,
              preview: card({ variant: 'communication', eyebrow: 'Diseñadora' }, <span>Ana Pérez</span>),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Calificación sobre el avatar',
              description: <>Pasa <code>rating</code> junto con <code>leading</code> para que la calificación quede sobre el avatar.</>,
              preview: card({ variant: 'external-link', eyebrow: 'Diseñadora' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Calificación sin avatar',
              description: <>No pases <code>rating</code> sin <code>leading</code>: la calificación queda flotando sobre un espacio vacío.</>,
              preview: card({ variant: 'external-link', eyebrow: 'Diseñadora', leading: undefined }),
            },
          ],
        },
      ],
    },
  ],
};
