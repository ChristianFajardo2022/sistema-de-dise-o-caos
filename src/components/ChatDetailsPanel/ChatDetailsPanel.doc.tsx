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
 */

const photoAvatar = (size: 'md' | 'sm' = 'md') => (
  <Avatar variant="photo" size={size} src={PHOTO_SRC.Woman_1} alt="" badge={size === 'md'} badgeState="success" badgeLabel="En línea" />
);

const profileContent = () => (
  <>
    <ChatDetailsProfile avatar={photoAvatar()} name="Ana Pérez" description="Disponible para conversar" />
    <ul className="m-0 list-none p-0">
      <ChatDetailsLink icon="folder">Documentos</ChatDetailsLink>
      <ChatDetailsLink icon="gallery">Fotografías</ChatDetailsLink>
    </ul>
    <ChatDetailsGrid aria-label="Fotografías recientes">
      <FileCard type="thumbnail" title="Notas de reunión" selection="checkbox" className="size-auto aspect-square w-full" />
      <FileCard type="thumbnail" title="Pizarra del equipo" selection="checkbox" className="size-auto aspect-square w-full" />
    </ChatDetailsGrid>
  </>
);

const panel = (children: ReactNode | ((state: { collapsed: boolean }) => ReactNode), props: Partial<ComponentProps<typeof ChatDetailsPanel>> = {}) => (
  <ChatDetailsPanel aria-label="Detalles de la conversación" collapsible className="h-[560px]" {...props}>
    {children}
  </ChatDetailsPanel>
);

const profilePanel = () => panel(profileContent());

const railPanel = () => panel(
  ({ collapsed }) => collapsed ? (
    <>
      {photoAvatar('sm')}
      <div className="flex flex-col gap-ds-space-general-2xl">
        <ChatDetailsLink compact icon="folder">Documentos</ChatDetailsLink>
        <ChatDetailsLink compact icon="gallery">Fotografías</ChatDetailsLink>
      </div>
    </>
  ) : profileContent(),
  { defaultCollapsed: true }
);

const fileActions = () => (
  <>
    <Button iconOnly variant="secondary" size="xs" state="delete" aria-label="Eliminar seleccionados"><Icon name="trash" size={16} variant="fill" /></Button>
    <Button iconOnly variant="secondary" size="xs" aria-label="Descargar seleccionados"><Icon name="download" size={16} variant="fill" /></Button>
  </>
);

const filesPanel = () => panel(
  <>
    <ChatDetailsHeader onBack={() => {}} actions={fileActions()} />
    <ChatDetailsGrid aria-label="Documentos">
      <FileCard type="icon" title="Notas de reunión" description="Actualizado hoy" selection="checkbox" />
      <FileCard type="icon" title="Plan de trabajo" description="Actualizado ayer" selection="checkbox" />
    </ChatDetailsGrid>
  </>,
  { collapsible: false }
);

const states: DocStateItem[] = [
  {
    label: 'Expanded',
    tone: 'neutral',
    description: 'Panel de 320 px para mostrar la vista activa. El contenido puede ser un nodo o una función que recibe el estado de plegado.',
    samples: [profilePanel()],
  },
  {
    label: 'Collapsed',
    tone: 'accent',
    description: <>Riel de 80 px activado con <code>collapsed</code>. El botón expone <code>aria-expanded=&quot;false&quot;</code> y las vistas pueden sustituir el contenido por controles compactos.</>,
    samples: [railPanel()],
  },
];

const tokenPreview = () => profilePanel();

export const doc: ComponentDocContent = {
  name: 'ChatDetailsPanel',
  icon: 'info-circle',
  classification: 'composicion',
  summary: 'ChatDetailsPanel es la composición lateral que reúne la información de una conversación y sus vistas de perfil, documentos o fotografías. Aporta estructura, nombre accesible y plegado; sus subcomponentes organizan el contenido y la navegación interna.',
  definition: [
    {
      title: 'Anatomía',
      description: 'El panel organiza el perfil, la navegación a secciones y una región desplazable; en las vistas de archivo cambia el perfil por cabecera y cuadrícula.',
      blocks: [{ type: 'anatomy', groups: [{
        canvases: [{
          label: 'Perfil y fotografías',
          preview: profilePanel(),
          width: 320,
          marks: [
            { n: 1, selector: 'aside', side: 'left' },
            { n: 2, selector: '[data-figma-part="Info"]', side: 'top' },
            { n: 3, selector: '[data-figma-part="Heading"]', side: 'right' },
            { n: 4, selector: '[data-figma-part="Filename"]', side: 'right' },
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
          preview: filesPanel(),
          width: 320,
          marks: [
            { n: 1, selector: '[data-figma-part="Button"]', side: 'top' },
            { n: 2, selector: 'button[aria-label="Eliminar seleccionados"]', side: 'right' },
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
      description: 'ChatDetailsPanel tiene dos estados de anchura: Expanded y Collapsed. El estado plegado requiere <code>collapsible</code> para mostrar el botón de control.',
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens de color del panel y del perfil. Cambia el modo para comparar sus valores en claro y en oscuro.',
      titleInside: true,
      blocks: [{ type: 'tokens', groups: [{
        title: 'Panel de perfil',
        preview: tokenPreview(),
        entries: [
          { part: 'Fondo', color: 'background-container-default-on-canva' },
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
          <><strong>Navegar entre vistas:</strong> combina <code>ChatDetailsLink</code> y <code>ChatDetailsHeader</code>; quien compone las vistas gestiona el cambio y el retorno del foco.</>,
          <><strong>Galerías o documentos:</strong> muestra elementos en <code>ChatDetailsGrid</code>, con un nombre accesible para cada región desplazable.</>,
          <><strong>Diseño plegable:</strong> habilita <code>collapsible</code> y usa la función de <code>children</code> para adaptar el contenido al riel.</>,
        ],
        avoid: [
          <><strong>Contenido principal de la página:</strong> no uses el panel como contenedor principal. (Alternativa: la región principal de la pantalla).</>,
          <><strong>Panel sin nombre:</strong> no omitas <code>aria-label</code> en el <code>aside</code> ni en <code>ChatDetailsGrid</code>. (Alternativa: añade un nombre que describa el contenido).</>,
          <><strong>Cambiar vista sin gestionar foco:</strong> al desmontar el control activado, el foco puede volver al documento. (Alternativa: enfócalo en <code>ChatDetailsHeader.backRef</code> y restáuralo en la fila que abrió la vista).</>,
        ],
      }],
    },
    {
      title: 'Aplicaciones de breakpoints',
      description: 'Cada vista se dibuja con los valores responsive de su breakpoint. Tablet usa los mismos tokens que Desktop.',
      blocks: [{ type: 'breakpoints',
        desktop: { columns: [{ title: 'Panel expandido', bullets: [<>El ancho es 320 px.</>, <>El riel plegado mide 80 px.</>], preview: profilePanel() }] },
        mobile: { bullets: [<>El código mantiene el ancho expandido de 320 px.</>, <>El riel plegado mide 80 px y conserva los botones compactos.</>, <>TODO: confirmar con diseño la ubicación del panel y el comportamiento de su contenido en Mobile.</>], preview: profilePanel() },
        tablet: { bullets: [<>El panel mantiene los anchos fijos de 320 px y 80 px.</>, <>No hay props ni tokens de breakpoint en el componente.</>, <>Ajusta el contenedor padre para ubicar el panel junto al contenido.</>], preview: profilePanel() },
      }],
    },
    {
      title: 'Do and Dont’s',
      description: 'Criterios para componer el panel y sus vistas accesibles.',
      blocks: [{ type: 'practices', items: [
        { kind: 'do', framed: true, title: 'Adapta el riel', description: <>Usa la función de <code>children</code> para mostrar accesos compactos al plegar el panel.</>, preview: railPanel() },
        { kind: 'dont', framed: true, title: 'Contenido comprimido', description: 'No mantengas el perfil y la cuadrícula completos dentro del riel estrecho.', preview: panel(profileContent(), { defaultCollapsed: true }) },
        { kind: 'do', framed: true, title: 'Nombra la región', description: 'Da a cada región desplazable un nombre que identifique su contenido.', preview: filesPanel() },
        { kind: 'dont', framed: true, title: 'Región sin contexto', description: 'No reutilices un nombre genérico para las vistas de documentos y fotografías.', preview: panel(<><ChatDetailsHeader onBack={() => {}} /><ChatDetailsGrid aria-label="Contenido"><FileCard type="icon" title="Notas de reunión" /></ChatDetailsGrid></>, { collapsible: false }) },
        { kind: 'do', framed: true, title: 'Nivel de título correcto', description: <>Ajusta <code>headingLevel</code> para mantener el orden de encabezados de la página.</>, preview: <ChatDetailsProfile avatar={photoAvatar()} name="Ana Pérez" description="Disponible para conversar" headingLevel={2} /> },
        { kind: 'dont', framed: true, title: 'Nivel de título profundo', description: 'No elijas un nivel de encabezado solo por su tamaño visual.', preview: <ChatDetailsProfile avatar={photoAvatar()} name="Ana Pérez" description="Disponible para conversar" headingLevel={6} /> },
      ] }],
    },
  ],
};
