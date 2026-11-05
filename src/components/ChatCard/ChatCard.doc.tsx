import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Avatar } from '../Avatar';
import { PHOTO_SRC } from '../Avatar/Avatar.sample-data';
import { ChatCard } from './ChatCard';

/*
 * Contenido de la página de documentación de ChatCard (plantilla v2). Manda el código
 * (`ChatCard.types.ts`, `ChatCard.variants.ts`, `ChatCard.tsx`), luego `ChatCard.docs.json`.
 */

const avatar = () => <Avatar variant="photo" size="md" src={PHOTO_SRC.Woman_1} alt="" />;
const card = (props: Partial<ComponentProps<typeof ChatCard>> = {}, title: ReactNode = 'Ana Pérez') => (
  <ChatCard title={title} leading={avatar()} description="Nos vemos mañana en la reunión." time="20.00" unread={3} {...props} />
);

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Conversación sin seleccionar. El título funciona como botón o enlace y ocupa el área clicable de la tarjeta.',
    samples: [card()],
  },
  {
    label: 'Active',
    tone: 'accent',
    description: <>Conversación seleccionada con <code>selected</code>. El control expone <code>aria-current=&quot;true&quot;</code> y la tarjeta muestra el fondo de selección.</>,
    samples: [card({ selected: true })],
  },
  {
    label: 'Focus',
    tone: 'accent',
    description: 'Al recibir el foco del teclado, la tarjeta muestra un contorno de 2 px alrededor de la raíz.',
    samples: [card({ autoFocus: true })],
  },
  {
    label: 'Disabled',
    tone: 'neutral',
    description: 'El botón nativo queda deshabilitado. El código no añade un estilo de atenuación para este estado.',
    samples: [card({ disabled: true })],
  },
];

const selectedCard = () => card({ selected: true });

export const doc: ComponentDocContent = {
  name: 'ChatCard',
  icon: 'users',
  classification: 'molecula',
  summary: 'ChatCard es la molécula para mostrar una conversación en una lista y permitir abrirla o seleccionarla. Combina avatar, título, vista previa y metadatos; puede indicar presencia y mensajes sin leer, y admite acciones secundarias independientes.',
  definition: [
    {
      title: 'Anatomía',
      description: 'La tarjeta organiza la identidad y la vista previa a la izquierda, y los metadatos a la derecha.',
      blocks: [{ type: 'anatomy', groups: [{
        canvases: [{
          label: 'Conversación con metadatos',
          preview: card(),
          marks: [
            { n: 1, selector: '[data-figma-part="Frame 1984080547"]', side: 'left' },
            { n: 2, selector: '[data-figma-part="Filename"]', side: 'top' },
            { n: 3, selector: '[data-figma-part="Status"]', index: 0, side: 'bottom' },
            { n: 4, selector: '[data-figma-part="Frame 1984080546"]', index: -1, side: 'right' },
            { n: 5, selector: '[data-figma-part="Badge"]', index: -1, side: 'right' },
          ],
          dimensions: [
            { kind: 'padding', selector: '[data-selected]', side: 'left' },
            { kind: 'gap', from: '[data-figma-part="Frame 1984080547"]', to: '[data-figma-part="Frame 1984080546"]' },
          ],
        }, {
          label: 'Conversación sin metadatos',
          preview: <ChatCard title="Hugo García" description="Gracias por revisar el documento." leading={avatar()} presence="offline" />,
          marks: [
            { n: 1, selector: '[data-figma-part="Badge"]', side: 'bottom' },
            { n: 2, selector: '[data-figma-part="Filename"]', side: 'top' },
            { n: 3, selector: '[data-figma-part="Status"]', side: 'bottom' },
          ],
        }],
        guidelines: [
          <><strong>Contenedor:</strong> fila de ancho completo con padding de 12 px, separación de 24 px y radio de 16 px. <code>selected</code> aplica <code>background-container-select-on-card</code>.</>,
          <><strong>Avatar y presencia:</strong> el slot <code>leading</code> mide 48 × 48 px en la composición. <code>presence</code> añade un <code>Badge</code> simple en la esquina inferior derecha.</>,
          <><strong>Título:</strong> es el control interactivo, con tipografía secundaria semibold de 16 px y altura de línea de 20 px. Ocupa toda el área de la tarjeta; con <code>href</code> se renderiza como enlace.</>,
          <><strong>Descripción:</strong> usa tipografía primaria regular de 14 px y altura de línea de 18 px. <code>descriptionLines</code> permite una o dos líneas antes del corte.</>,
          <><strong>Metadatos:</strong> <code>time</code> y <code>unread</code> se alinean al extremo derecho. La hora usa 12 px; el número sin leer se muestra en un <code>Badge</code>.</>,
        ],
      }] }],
    },
    {
      title: 'Estados',
      description: 'ChatCard tiene los estados Default y Active del set de Figma. El código añade foco de teclado y admite el estado nativo Disabled del botón.',
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default y de la selección. La tarjeta no fuerza un modo de color.',
      titleInside: true,
      blocks: [{ type: 'tokens', groups: [{
        title: 'Conversación',
        preview: selectedCard(),
        entries: [
          { part: 'Fondo seleccionado', color: 'background-container-select-on-card' },
          { part: 'Título', color: 'text-neutral-heading', text: 'typography-heading-size-md' },
          { part: 'Descripción y hora', color: 'text-neutral-gray', text: 'primitives-typography-size-md' },
        ],
      }] }],
    },
    {
      title: 'Uso del componente ChatCard en Figma:',
      description: '',
      titleInside: true,
      blocks: [{ type: 'figma', bullets: [
        <><strong>Búsqueda y configuración:</strong> encuentra el set «Chat card» en Assets. La tarjeta mide 767 × 72 px en el set documentado.</>,
        <><strong>Filename y Status:</strong> usa <code>title</code> para el nombre de la conversación y <code>description</code> para la vista previa del último mensaje.</>,
        <><strong>State:</strong> Default corresponde a <code>selected={false}</code>; Active corresponde a <code>selected</code>, que también comunica la selección con <code>aria-current</code>.</>,
        <><strong>Diferencias:</strong> el código admite presencia, metadatos, acciones, una o dos líneas de descripción y un control de enlace. El slot <code>actions</code> no forma parte del cuadro del set.</>,
      ] }],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo ChatCard es la pieza correcta y cuándo conviene otra.',
      blocks: [{ type: 'usage',
        use: [
          <><strong>Lista de conversaciones:</strong> coloca cada tarjeta dentro de un <code>li</code> y agrúpalas en un <code>ul</code>.</>,
          <><strong>Abrir una conversación:</strong> usa un botón para una acción de la vista actual o pasa <code>href</code> para navegación semántica.</>,
          <><strong>Indicar selección:</strong> activa <code>selected</code> en la conversación actual; el control comunica el estado con <code>aria-current=&quot;true&quot;</code>.</>,
          <><strong>Acciones adicionales:</strong> pasa controles separados por <code>actions</code>; quedan fuera del área clicable principal y conservan su propio foco.</>,
          <><strong>Mensajes nuevos:</strong> usa <code>unread</code> para el conteo y <code>unreadLabel</code> para describirlo a lectores de pantalla.</>,
        ],
        avoid: [
          <><strong>Contenido que no abre ni selecciona:</strong> no uses una tarjeta interactiva para mostrar información estática. (Alternativa: <code>InformationCard</code>).</>,
          <><strong>Acciones dentro del título:</strong> evita anidar otro botón o enlace en <code>title</code>. (Alternativa: coloca controles secundarios en <code>actions</code>).</>,
          <><strong>Indicador de selección solo visual:</strong> no uses el fondo activo como único aviso de selección. (Alternativa: usa <code>selected</code> para exponer también <code>aria-current</code>).</>,
        ],
      }],
    },
    {
      title: 'Aplicaciones de breakpoints',
      description: 'Cada vista se dibuja con los valores responsive de su breakpoint. Tablet usa los mismos tokens que Desktop.',
      blocks: [{ type: 'breakpoints',
        desktop: { columns: [{ title: 'Lista de conversaciones', bullets: [<><strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.</>, <>El título y la descripción comparten el espacio flexible; los metadatos quedan alineados a la derecha.</>], preview: card() }] },
        mobile: { bullets: [<><strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.</>, <>Usa <code>descriptionLines={2}</code> si la vista previa necesita dos líneas.</>, <>La tarjeta conserva el ancho disponible y el foco visible del control.</>], preview: card({ descriptionLines: 2 }) },
        tablet: { bullets: [<><strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.</>, <>La descripción puede ocupar una o dos líneas según <code>descriptionLines</code>.</>, <>Las acciones secundarias mantienen su espacio al extremo derecho.</>], preview: card({ actions: <span className="text-ds-text-neutral-gray">•••</span> }) },
      }],
    },
    {
      title: 'Do and Dont’s',
      description: 'Criterios para presentar conversaciones claras y accesibles.',
      blocks: [{ type: 'practices', items: [
        { kind: 'do', framed: true, title: 'Agrupa como lista', description: 'Coloca cada tarjeta en un elemento de lista para conservar su estructura semántica.', preview: <ul className="m-0 list-none p-0"><li>{card()}</li></ul> },
        { kind: 'dont', framed: true, title: 'Tarjetas sin estructura', description: 'No apiles controles interactivos sin agruparlos como una lista de conversaciones.', preview: <>{card()}{card({ title: 'Hugo García' })}</> },
        { kind: 'do', framed: true, title: 'Marca la selección', description: <>Activa <code>selected</code> en la conversación actual para mostrarla y anunciarla como seleccionada.</>, preview: card({ selected: true }) },
        { kind: 'dont', framed: true, title: 'Selección solo visual', description: 'No simules el fondo activo con clases: el control perdería `aria-current`.', preview: <div className="rounded-ds-radius-general-xl bg-ds-background-container-select-on-card p-ds-space-general-xl"><ChatCard title="Ana Pérez" leading={avatar()} description="Nos vemos mañana en la reunión." time="20.00" unread={3} /></div> },
        { kind: 'do', framed: true, title: 'Vista previa legible', description: <>Usa <code>descriptionLines={2}</code> cuando el último mensaje necesite más espacio.</>, preview: card({ descriptionLines: 2 }) },
        { kind: 'dont', framed: true, title: 'Vista previa cortada', description: 'No fuerces una sola línea cuando oculte información necesaria para reconocer el mensaje.', preview: card({ descriptionLines: 1 }) },
      ] }],
    },
  ],
};
