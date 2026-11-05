import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Avatar } from '../Avatar';
import { PHOTO_SRC } from '../Avatar/Avatar.sample-data';
import { Button } from '../Button';
import { FileCard } from '../FileCard';
import { Icon } from '../Icon';
import { ChatDetailsGrid, ChatDetailsHeader, ChatDetailsLink, ChatDetailsPanel, ChatDetailsProfile } from './ChatDetailsPanel';

/*
 * Contenido de la página de documentación de ChatDetailsPanel (plantilla v2). Manda el código
 * (`ChatDetailsPanel.types.ts`, `ChatDetailsPanel.variants.ts`, `ChatDetailsPanel.tsx`), luego `ChatDetailsPanel.docs.json`.
 * Cada muestra lleva su propio nombre de panel y de región: varias `aside` o regiones con el mismo nombre en una pestaña
 * son landmarks repetidos (axe `landmark-unique`).
 */

// Figma: 14894:12557 (component set Laterales (Atom))

type PanelProps = Partial<ComponentProps<typeof ChatDetailsPanel>>;
type PanelChildren = ReactNode | ((state: { collapsed: boolean }) => ReactNode);

const photoAvatar = (size: 'md' | 'sm' = 'md') => (
  <Avatar variant="photo" size={size} src={PHOTO_SRC.Woman_1} alt="" badge={size === 'md'} badgeState="success" badgeLabel="En línea" />
);

/** Vista de perfil. `sample` distingue el nombre de la región de fotografías en cada muestra. */
const profileContent = (sample: string) => (
  <>
    <ChatDetailsProfile data-slot="profile" avatar={photoAvatar()} name="Ana Pérez" description="Disponible para conversar" headingLevel={3} />
    <ul className="m-0 list-none p-0">
      <ChatDetailsLink icon="folder">Documentos</ChatDetailsLink>
      <ChatDetailsLink icon="gallery">Fotografías</ChatDetailsLink>
    </ul>
    <ChatDetailsGrid aria-label={`Fotografías recientes (${sample})`}>
      <FileCard type="thumbnail" title="Notas de reunión" selection="checkbox" className="size-auto aspect-square w-full" />
      <FileCard type="thumbnail" title="Pizarra del equipo" selection="checkbox" className="size-auto aspect-square w-full" />
    </ChatDetailsGrid>
  </>
);

/** Contenido del riel: avatar y accesos compactos a cada sección. */
const railContent = () => (
  <>
    {photoAvatar('sm')}
    <div className="flex flex-col gap-ds-space-general-2xl">
      <ChatDetailsLink compact icon="folder">Documentos</ChatDetailsLink>
      <ChatDetailsLink compact icon="gallery">Fotografías</ChatDetailsLink>
    </div>
  </>
);

/** Panel plegable de muestra. `sample` va en su nombre accesible para que no se repita en la pestaña. */
const panel = (sample: string, children: PanelChildren, props: PanelProps = {}) => (
  <ChatDetailsPanel aria-label={`Detalles de la conversación (${sample})`} collapsible className="h-[560px]" {...props}>
    {children}
  </ChatDetailsPanel>
);

const profilePanel = (sample: string) => panel(sample, profileContent(sample));

const railPanel = (sample: string, props: PanelProps = {}) =>
  panel(sample, ({ collapsed }) => (collapsed ? railContent() : profileContent(sample)), { defaultCollapsed: true, ...props });

const fileActions = () => (
  <>
    <Button iconOnly variant="secondary" size="xs" state="delete" aria-label="Eliminar seleccionados"><Icon name="trash" size={16} variant="fill" /></Button>
    <Button iconOnly variant="secondary" size="xs" aria-label="Descargar seleccionados"><Icon name="download" size={16} variant="fill" /></Button>
  </>
);

/** Vista de documentos. Sin `back`, la cabecera no dibuja el botón Anterior. */
const filesPanel = (sample: string, { back = true, className }: { back?: boolean; className?: string } = {}) =>
  panel(
    sample,
    <>
      <ChatDetailsHeader onBack={back ? () => {} : undefined} actions={fileActions()} />
      <ChatDetailsGrid aria-label={`Documentos (${sample})`}>
        <FileCard type="icon" title="Notas de reunión" description="Actualizado hoy" selection="checkbox" />
        <FileCard type="icon" title="Plan de trabajo" description="Actualizado ayer" selection="checkbox" />
      </ChatDetailsGrid>
    </>,
    { collapsible: false, ...(className && { className }) },
  );

/*
 * Muestras de Do and Dont’s: el panel (fondo On Canva) sobre la superficie de la pantalla (`background/container/surface`),
 * como en la app. Sin ella se funde con la pantalla del marco de teléfono, que usa el mismo fondo On Canva.
 */
const onScreen = (node: ReactNode) => (
  <div className="flex w-full justify-end rounded-ds-radius-general-lg bg-ds-background-container-surface p-ds-space-general-md">{node}</div>
);

/*
 * Perfil suelto de la regla de encabezados. Es una ilustración (`inert`): el h6 del caso malo saltaría niveles en la
 * propia página de documentación, y el lector de pantalla no debe recorrer la muestra.
 */
const profileSample = (headingLevel: 3 | 6) => (
  <div inert className="flex w-full justify-center">
    <ChatDetailsProfile avatar={photoAvatar()} name="Ana Pérez" description="Disponible para conversar" headingLevel={headingLevel} />
  </div>
);

const states: DocStateItem[] = [
  {
    label: 'Expanded',
    tone: 'neutral',
    description: 'Panel de 320 px con la vista activa. El contenido puede ser un nodo o una función que recibe el estado de plegado.',
    samples: [profilePanel('estado expandido')],
  },
  {
    label: 'Collapsed',
    tone: 'accent',
    description: (
      <>
        Riel de 80 px. El botón expone <code>aria-expanded=&quot;false&quot;</code>; la función de <code>children</code> cambia el contenido por
        accesos compactos.
      </>
    ),
    samples: [railPanel('estado plegado')],
  },
];

export const doc: ComponentDocContent = {
  name: 'ChatDetailsPanel',
  icon: 'info-circle',
  classification: 'composicion',
  summary:
    'ChatDetailsPanel es la composición lateral que reúne la información de una conversación y sus vistas de perfil, documentos o fotografías. Aporta estructura, nombre accesible y plegado; sus subcomponentes organizan el contenido y la navegación interna.',
  definition: [
    {
      title: 'Anatomía',
      description: 'El panel organiza el perfil, la navegación a secciones y una región desplazable; en las vistas de archivo cambia el perfil por cabecera y cuadrícula.',
      blocks: [{ type: 'anatomy', groups: [{
        canvases: [{
          label: 'Perfil y fotografías',
          preview: profilePanel('anatomía del perfil'),
          width: 320,
          marks: [
            { n: 1, selector: 'aside', side: 'left' },
            { n: 2, selector: '[data-slot="profile"]', side: 'left' },
            { n: 3, selector: '[data-figma-part="Heading"]', side: 'right' },
            { n: 4, selector: 'ul > li', index: 0, side: 'right' },
            { n: 5, selector: '[role="region"]', side: 'bottom' },
          ],
          dimensions: [
            { kind: 'padding', selector: 'aside', side: 'left' },
            { kind: 'height', selector: '[data-figma-part="Info"]' },
          ],
        }],
        guidelines: [
          <><strong>Panel:</strong> <code>aside</code> con nombre accesible obligatorio. El ancho expandido es 320 px; usa fondo On Canva, radio de 24 px, sombra mediana y padding de 24 px.</>,
          <><strong>Perfil:</strong> <code>ChatDetailsProfile</code> centra un avatar de 48 px, el nombre y una descripción opcional.</>,
          <><strong>Nombre:</strong> <code>name</code> se renderiza como encabezado de nivel 2 por defecto. Ajusta <code>headingLevel</code> para respetar la jerarquía de la página.</>,
          <><strong>Enlaces de sección:</strong> <code>ChatDetailsLink</code> usa una fila <code>ListItem</code> con ícono y navegación. Agrupa sus elementos en una lista <code>ul</code>.</>,
          <><strong>Cuadrícula:</strong> <code>ChatDetailsGrid</code> crea una región con nombre y una lista de dos columnas dentro de un área desplazable.</>,
        ],
      }, {
        canvases: [{
          label: 'Vista de documentos',
          preview: filesPanel('anatomía de documentos'),
          width: 320,
          marks: [
            { n: 1, selector: '[data-figma-part="Button"]', side: 'top' },
            { n: 2, selector: 'div:has(> button[aria-label="Eliminar seleccionados"])', side: 'top' },
            { n: 3, selector: '[role="region"]', side: 'bottom' },
          ],
        }],
        guidelines: [
          <><strong>Anterior:</strong> <code>ChatDetailsHeader</code> muestra el botón para regresar cuando recibe <code>onBack</code>.</>,
          <><strong>Acciones:</strong> el slot <code>actions</code> alinea controles secundarios a la derecha. El código no impone su semántica ni su estado.</>,
          <><strong>Archivos:</strong> coloca tarjetas dentro de <code>ChatDetailsGrid</code>; la región mantiene desplazamiento y nombre accesible.</>,
        ],
      }] }],
    },
    {
      title: 'Estados',
      description: (
        <>
          ChatDetailsPanel tiene 2 estados de ancho, los dos del panel: Expanded y Collapsed. Se pliega con <code>collapsed</code> o{' '}
          <code>defaultCollapsed</code>; <code>collapsible</code> solo agrega el botón que alterna entre los dos.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens de color del panel y del perfil. Cambia el modo para comparar sus valores en claro y en oscuro.',
      titleInside: true,
      blocks: [{ type: 'tokens', groups: [{
        title: 'Panel de perfil',
        preview: profilePanel('tokens'),
        entries: [
          { part: 'Fondo', color: 'background-container-default-on-canva' },
          { part: 'Sombra (en oscuro es transparente)', color: 'effect-shadow-on-canva-md' },
          { part: 'Nombre', color: 'text-neutral-heading', text: 'typography-heading-size-md' },
          { part: 'Descripción', color: 'text-neutral-body', text: 'typography-body-size-md' },
        ],
      }] }],
    },
    {
      title: 'Uso del componente ChatDetailsPanel en Figma:',
      description: '',
      titleInside: true,
      blocks: [{ type: 'figma', bullets: [
        <><strong>Búsqueda y configuración:</strong> encuentra el set «Laterales (Atom)». Usa sus propiedades Type para las vistas Photo, Type4, Document, Phot, Type6 y Type5.</>,
        <><strong>Correspondencia:</strong> Photo es perfil, Type4 es el riel plegado, Document y Phot son vistas de archivos; Type6 y Type5 añaden acciones a documentos y fotografías.</>,
        <><strong>Variantes de código:</strong> controla el plegado con <code>collapsible</code>, <code>collapsed</code> o <code>defaultCollapsed</code>. Compón vistas con <code>ChatDetailsHeader</code>, <code>ChatDetailsProfile</code>, <code>ChatDetailsLink</code> y <code>ChatDetailsGrid</code>.</>,
        <><strong>Diferencias:</strong> Figma usa chevron-right en ambos estados del botón de plegar; el código usa chevron-left cuando está plegado y agrega <code>aria-expanded</code> y <code>aria-controls</code>. Type5 y Type6 requieren estilos adicionales por <code>className</code>.</>,
      ] }],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo ChatDetailsPanel es la pieza correcta y cuándo conviene otra.',
      blocks: [{ type: 'usage',
        use: [
          <><strong>Detalles de una conversación:</strong> usa el panel como región complementaria con un <code>aria-label</code> descriptivo.</>,
          <><strong>Navegar entre vistas:</strong> combina <code>ChatDetailsLink</code> y <code>ChatDetailsHeader</code>. Quien compone las vistas mueve el foco: al abrir una vista, a <code>backRef</code>; al volver, a la fila que la abrió.</>,
          <><strong>Galerías o documentos:</strong> muestra elementos en <code>ChatDetailsGrid</code>, con un nombre accesible para cada región desplazable.</>,
          <><strong>Diseño plegable:</strong> habilita <code>collapsible</code> y usa la función de <code>children</code> para adaptar el contenido al riel.</>,
        ],
        avoid: [
          <><strong>Mensajes de la conversación:</strong> no pongas la conversación dentro del panel; el panel la complementa. (Alternativa: <code>ChatMessageList</code> con <code>ChatComposer</code>).</>,
          <><strong>Navegación principal:</strong> no uses el panel como menú lateral de la aplicación. (Alternativa: <code>SideBar</code>).</>,
          <><strong>Perfil fuera de un chat:</strong> no uses el panel para mostrar una ficha de persona en otra pantalla. (Alternativa: <code>ProfileCard</code>).</>,
        ],
      }],
    },
    {
      title: 'Aplicaciones de breakpoints',
      description: 'Cada vista se dibuja con los valores responsive de su breakpoint. Tablet usa los mismos tokens que Desktop.',
      blocks: [{ type: 'breakpoints',
        desktop: { columns: [{ title: 'Panel expandido', bullets: [
          <><strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.</>,
          <><strong>Anchos fijos:</strong> 320 px expandido y 80 px plegado.</>,
        ], preview: profilePanel('Desktop') }] },
        mobile: { bullets: [
          <><strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.</>,
          <><strong>Anchos fijos:</strong> 320 px expandido y 80 px plegado, con los accesos compactos en el riel.</>,
          <><strong>Ubicación:</strong> el componente no tiene props ni tokens de breakpoint; el contenedor padre decide dónde va.</>,
        ], preview: profilePanel('Mobile') },
        tablet: { bullets: [
          <><strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.</>,
          <><strong>Anchos fijos:</strong> 320 px expandido y 80 px plegado.</>,
          <><strong>Alto:</strong> el panel no fija su alto; dáselo con <code>className</code> o con el contenedor padre.</>,
        ], preview: profilePanel('Tablet') },
      }],
    },
    {
      title: 'Do and Dont’s',
      description: 'Criterios para componer el panel y sus vistas accesibles.',
      blocks: [{ type: 'practices', items: [
        { kind: 'do', framed: true, title: 'Adapta el riel', description: <>Usa la función de <code>children</code> para mostrar accesos compactos al plegar el panel.</>, preview: onScreen(railPanel('riel adaptado', { className: 'h-80' })) },
        { kind: 'dont', framed: true, title: 'Riel vacío', description: 'No dejes el riel solo con el botón de plegar: la persona pierde los accesos.', preview: onScreen(panel('riel vacío', ({ collapsed }) => (collapsed ? null : profileContent('riel vacío')), { defaultCollapsed: true, className: 'h-80' })) },
        { kind: 'do', framed: true, title: 'Ofrece volver', description: <>Pasa <code>onBack</code> a <code>ChatDetailsHeader</code> en cada vista de archivos.</>, preview: onScreen(filesPanel('vista con Anterior', { className: 'h-80' })) },
        { kind: 'dont', framed: true, title: 'Vista sin salida', description: 'No abras una vista de archivos sin el botón Anterior: la persona no puede volver al perfil.', preview: onScreen(filesPanel('vista sin Anterior', { back: false, className: 'h-80' })) },
        { kind: 'do', framed: true, title: 'Nivel de título correcto', description: <>Ajusta <code>headingLevel</code> al orden de la página; el nombre se ve igual en cualquier nivel.</>, preview: profileSample(3) },
        { kind: 'dont', framed: true, title: 'Nivel de título que salta', description: 'No saltes niveles: se ve igual, pero el lector de pantalla anuncia una jerarquía falsa.', preview: profileSample(6) },
      ] }],
    },
  ],
};
