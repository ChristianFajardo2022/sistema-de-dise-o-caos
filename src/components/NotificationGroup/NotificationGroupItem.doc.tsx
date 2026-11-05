import type { ComponentProps } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { NotificationGroupItem } from './NotificationGroupItem';

/*
 * Contenido de la página de documentación de NotificationGroupItem (plantilla v2). Manda el código
 * (`NotificationGroup.types.ts`, `NotificationGroup.variants.ts`, `NotificationGroupItem.tsx`), luego `NotificationGroupItem.docs.json`.
 */

const item = (props: Partial<ComponentProps<typeof NotificationGroupItem>> = {}) => (
  <ul role="list" className="m-0 w-full max-w-[316px] list-none p-0">
    <NotificationGroupItem
      description="Se actualizó la imagen de perfil."
      time="Hace 22 min"
      {...props}
    />
  </ul>
);

const states: DocStateItem[] = [
  {
    label: 'Default · Unread',
    tone: 'neutral',
    description: 'La fila muestra el punto de no leída y la descripción en peso semibold.',
    samples: [item({ unread: true })],
  },
  {
    label: 'Default · Read',
    tone: 'neutral',
    description: 'Sin el punto de no leída, la descripción usa peso regular.',
    samples: [item({ unread: false })],
  },
  {
    label: 'Eliminate · Unread',
    tone: 'error',
    description: <>Con <code>onDelete</code>, la acción de eliminar puede mostrarse a la derecha de la fila.</>,
    samples: [item({ unread: true, onDelete: () => {}, defaultRevealed: true })],
  },
  {
    label: 'Eliminate · Read',
    tone: 'error',
    description: <>La fila leída también admite eliminación si se habilita <code>onDelete</code>.</>,
    samples: [item({ unread: false, onDelete: () => {}, defaultRevealed: true })],
  },
];

export const doc: ComponentDocContent = {
  name: 'NotificationGroupItem',
  icon: 'notification',
  classification: 'molecula',
  summary: 'NotificationGroupItem es la fila que muestra una notificación dentro de un grupo. Presenta la hora, la descripción y el estado de lectura; puede abrir contenido relacionado mediante un enlace o botón, y admitir una acción para eliminar la fila.',
  definition: [
    {
      title: 'Anatomía',
      description: 'La fila alinea la hora y el estado de lectura sobre la descripción, dentro de un elemento de lista.',
      blocks: [{ type: 'anatomy', groups: [{
        canvases: [{
          label: 'Fila no leída',
          preview: item({ unread: true }),
          marks: [
            { n: 1, selector: 'li', side: 'left' },
            { n: 2, selector: '[data-figma-part="Content"]', side: 'top' },
            { n: 3, selector: '[data-figma-part="Hace 22m"]', side: 'right' },
            { n: 4, selector: '[data-figma-part="Badge"]', side: 'top' },
            { n: 5, selector: '[data-figma-part^="Lorem ipsum"]', side: 'bottom' },
          ],
          dimensions: [
            { kind: 'height', selector: '[data-figma-part="Content"]' },
            { kind: 'gap', from: '[data-figma-part="Time"]', to: '[data-figma-part^="Lorem ipsum"]', axis: 'y' },
          ],
        }],
        guidelines: [
          <><strong>Fila:</strong> es un <code>li</code> de 316 px de ancho en la referencia. Lleva radio de 16 px y trazos superior e inferior de 0,5 px.</>,
          <><strong>Contenido:</strong> usa padding vertical de 8 px, padding derecho de 12 px y no añade padding izquierdo.</>,
          <><strong>Hora:</strong> aparece arriba con tipografía regular de 12 px/16 px.</>,
          <><strong>Estado de lectura:</strong> <code>unread</code> añade un punto Success con nombre accesible «No leída» junto a la hora.</>,
          <><strong>Descripción:</strong> ocupa una línea o varias según el contenido, con tipografía de 14 px/20 px. Usa peso semibold si no está leída y regular si ya se leyó.</>,
        ],
      }, {
        canvases: [{
          label: 'Fila interactiva',
          preview: item({ unread: false, href: '#ajustes' }),
          marks: [
            { n: 1, selector: 'a[data-notification-control]', side: 'left' },
            { n: 2, selector: '[data-figma-part="Time"]', side: 'top' },
            { n: 3, selector: '[data-figma-part^="Lorem ipsum"]', side: 'bottom' },
          ],
        }],
        guidelines: [
          <><strong>Control:</strong> la descripción se convierte en enlace con <code>href</code> o en botón con <code>onClick</code>; el control se estira sobre la fila.</>,
          <><strong>Descripción accesible:</strong> la hora y el estado de lectura se asocian al control para lectores de pantalla.</>,
          <><strong>Destino:</strong> usa <code>href</code> para navegar a otra ruta y <code>onClick</code> para ejecutar una acción en la vista actual.</>,
        ],
      }] }],
    },
    {
      title: 'Estados',
      description: 'NotificationGroupItem tiene 4 estados del set Dropdown group notification (Atom) de Figma: Type Default o Eliminate, cada uno en State Unread o Read. No es interactiva por defecto.',
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens de la descripción, la hora y los trazos de la fila. El token de texto neutro cambia con el modo: no es un color fijo.',
      titleInside: true,
      blocks: [{ type: 'tokens', groups: [
        {
          title: 'Unread',
          preview: item({ unread: true }),
          entries: [
            { part: 'Trazo superior e inferior', color: 'border-general-default-on-card' },
            { part: 'Hora', color: 'text-neutral-white', text: 'primitives-typography-size-sm' },
            { part: 'Descripción', color: 'text-neutral-white', text: 'primitives-typography-size-md' },
            { part: 'Peso de la descripción', text: 'primitives-typography-weight-semibold' },
            { part: 'Punto de no leída', color: 'background-semantic-success-tertiary' },
          ],
        },
        {
          title: 'Read',
          preview: item({ unread: false }),
          entries: [
            { part: 'Trazo superior e inferior', color: 'border-general-default-on-card' },
            { part: 'Hora', color: 'text-neutral-white', text: 'primitives-typography-size-sm' },
            { part: 'Descripción', color: 'text-neutral-white', text: 'primitives-typography-size-md' },
            { part: 'Peso de la descripción', text: 'primitives-typography-weight-regular' },
          ],
        },
      ] }],
    },
    {
      title: 'Uso del componente NotificationGroupItem en Figma:',
      description: '',
      titleInside: true,
      blocks: [{ type: 'figma', bullets: [
        <><strong>Búsqueda y configuración:</strong> encuentra «Dropdown group notification (Atom)» en Assets. Sus propiedades son Type Default o Eliminate y State Unread o Read.</>,
        <><strong>Description y Time:</strong> Description contiene el mensaje de la fila; Time muestra el tiempo relativo. El código asigna el punto de lectura y la hora a la descripción accesible del control.</>,
        <><strong>State:</strong> Unread añade el punto verde y pone la descripción en semibold; Read quita el punto y usa peso regular.</>,
        <><strong>Diferencias:</strong> Figma muestra la fila visual. El código permite convertir Description en enlace o botón y agrega la acción de eliminar con teclado y gestos.</>,
      ] }],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo NotificationGroupItem es la pieza correcta y cuándo conviene otra.',
      blocks: [{ type: 'usage',
        use: [
          <><strong>Fila de un grupo:</strong> coloca cada fila dentro de <code>NotificationGroup</code>, que organiza las filas en una lista.</>,
          <><strong>Acceso a contenido:</strong> usa <code>href</code> para navegación o <code>onClick</code> para abrir contenido dentro de la vista actual.</>,
          <><strong>Notificación informativa:</strong> omite <code>href</code> y <code>onClick</code> si la fila no tiene una acción.</>,
          <><strong>Marcar lectura:</strong> usa <code>unread</code> para mostrar el punto y el peso semibold; pasa <code>unreadLabel</code> si necesitas otro nombre accesible.</>,
          <><strong>Eliminar una fila:</strong> pasa <code>onDelete</code> cuando la notificación individual se pueda eliminar.</>,
        ],
        avoid: [
          <><strong>Fila fuera de una lista:</strong> el componente renderiza <code>li</code>. (Alternativa: <code>NotificationGroup</code>, que organiza las filas en una lista).</>,
          <><strong>Notificación aislada:</strong> no uses la fila para una notificación que no pertenece a un grupo. (Alternativa: <code>NotificationItem</code> o <code>NotificationCard</code>).</>,
          <><strong>Estado contradictorio:</strong> no marques como leída una notificación que sigue pendiente de revisión; activa <code>unread</code>.</>,
        ],
      }],
    },
    {
      title: 'Aplicaciones de breakpoints',
      description: 'Cada vista se dibuja con los valores responsive de su breakpoint. Tablet usa los mismos tokens que Desktop.',
      blocks: [{ type: 'breakpoints',
        desktop: { columns: [{ title: 'Fila del grupo', bullets: [<>La referencia mide 316 px de ancho.</>, <>El contenido usa padding vertical de 8 px y derecho de 12 px.</>], preview: item({ unread: true }) }] },
        mobile: { bullets: [<><strong>Sin cambios:</strong> conserva el mismo padding en Desktop, Tablet y Mobile.</>, <>La fila ocupa el ancho que le da el grupo.</>, <>Si la fila tiene control, mantiene el área clicable extendida sobre ella.</>], preview: item({ unread: true }) },
        tablet: { bullets: [<><strong>Sin cambios:</strong> conserva el mismo padding en Desktop, Tablet y Mobile.</>, <>La fila ocupa el ancho que le da el grupo.</>, <>El punto de no leída queda junto a la hora.</>], preview: item({ unread: true }) },
      }],
    },
    {
      title: 'Do and Dont’s',
      description: 'Criterios para comunicar el estado y la acción de cada fila.',
      blocks: [{ type: 'practices', items: [
        { kind: 'do', framed: true, title: 'Marca como no leída', description: <>Activa <code>unread</code> mientras la notificación esté pendiente: el punto y el peso semibold la destacan.</>, preview: item({ unread: true, description: 'Tienes una invitación pendiente de responder.' }) },
        { kind: 'dont', framed: true, title: 'Estado leído incorrecto', description: 'No muestres como leída una notificación pendiente: el mensaje pide respuesta y la fila parece resuelta.', preview: item({ unread: false, description: 'Tienes una invitación pendiente de responder.' }) },
        { kind: 'do', framed: true, title: 'Descripción breve', description: 'Resume la notificación en una frase corta para que la fila se lea de un vistazo.', preview: item({ unread: true, description: 'Se guardaron los ajustes.' }) },
        { kind: 'dont', framed: true, title: 'Descripción extensa', description: 'No escribas párrafos en la fila: crece sin límite y empuja el resto del grupo.', preview: item({ unread: true, description: 'Se actualizó la imagen de perfil, se guardaron los ajustes de privacidad y se añadió una nota de reunión con todos los detalles del cambio.' }) },
        { kind: 'do', framed: true, title: 'Elimina la fila', description: <>Pasa <code>onDelete</code> si la persona puede quitar esta notificación.</>, preview: item({ onDelete: () => {}, defaultRevealed: true, description: 'Se actualizó la imagen de perfil.' }) },
        { kind: 'dont', framed: true, title: 'Acción innecesaria', description: 'No muestres eliminar si la fila debe permanecer: el mensaje exige una acción antes de descartarlo.', preview: item({ unread: true, onDelete: () => {}, defaultRevealed: true, description: 'Debes aceptar los términos para continuar.' }) },
      ] }],
    },
  ],
};
