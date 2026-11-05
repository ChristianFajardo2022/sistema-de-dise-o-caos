import type { ComponentProps } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { NotificationGroup } from './NotificationGroup';
import { NotificationGroupItem } from './NotificationGroupItem';

/*
 * Contenido de la página de documentación de NotificationGroup (plantilla v2). Manda el código
 * (`NotificationGroup.types.ts`, `NotificationGroup.variants.ts`, `NotificationGroup.tsx`), luego `NotificationGroup.docs.json`.
 */

const rows = (
  descriptions = ['Se actualizó la imagen de perfil.', 'Se guardaron los ajustes de privacidad.', 'Se añadió una nota de reunión.'],
  unread = [true, false, false],
  times = descriptions.map((_, index) => `Hace ${22 + index * 20} min`)
) =>
  descriptions.map((description, index) => (
    <NotificationGroupItem key={description} time={times[index]} description={description} unread={unread[index]} />
  ));

const group = (props: Partial<ComponentProps<typeof NotificationGroup>> = {}, children = rows()) => (
  <ul role="list" className="m-0 w-full max-w-[351px] list-none p-0">
    <NotificationGroup title="Actualizaciones del perfil" time="Hace 22 min" countLabel="notificaciones" {...props}>
      {children}
    </NotificationGroup>
  </ul>
);

const deleteGroup = () => group({ unread: true, onDelete: () => {}, defaultRevealed: true });

const states: DocStateItem[] = [
  {
    label: 'Group · Unread',
    tone: 'neutral',
    description: 'Grupo no leído y recogido. Muestra el contador y solo la notificación más reciente.',
    samples: [group({ unread: true })],
  },
  {
    label: 'Group · Read',
    tone: 'neutral',
    description: 'Grupo leído y recogido. No tiene relleno y muestra el trazo inferior del estado Read.',
    samples: [group({ unread: false }, rows(undefined, [false, false, false]))],
  },
  {
    label: 'Dropdown group · Unread',
    tone: 'accent',
    description: <>Grupo no leído desplegado. La lista muestra todas las filas y el botón expone <code>aria-expanded</code>.</>,
    samples: [group({ unread: true, defaultExpanded: true })],
  },
  {
    label: 'Dropdown group · Read',
    tone: 'neutral',
    description: 'Grupo leído desplegado. Las filas mantienen sus propios estados de lectura.',
    samples: [group({ unread: false, defaultExpanded: true }, rows(undefined, [false, false, false]))],
  },
  {
    label: 'Group delete',
    tone: 'error',
    description: <>Con <code>onDelete</code>, el grupo puede revelar la acción para eliminar todas sus filas.</>,
    samples: [deleteGroup()],
  },
];

const tokensPreview = () => group({ unread: true });

export const doc: ComponentDocContent = {
  name: 'NotificationGroup',
  icon: 'notification',
  classification: 'composicion',
  summary: 'NotificationGroup es la composición que reúne notificaciones relacionadas en una tarjeta desplegable. Muestra el título, la hora y el contador del grupo, y permite consultar sus filas, comunicar si hay contenido sin leer o eliminar el grupo completo.',
  definition: [
    {
      title: 'Anatomía',
      description: 'El grupo combina una cabecera con hora y control de despliegue, un título con contador y una lista de notificaciones.',
      blocks: [{ type: 'anatomy', groups: [{
        canvases: [{
          label: 'Grupo recogido sin leer',
          preview: group({ unread: true }),
          marks: [
            { n: 1, selector: 'li', side: 'left' },
            { n: 2, selector: '[data-figma-part="Time"]', side: 'top' },
            { n: 3, selector: 'button[data-notification-control]', side: 'right' },
            { n: 4, selector: 'p[data-figma-part="Heading"]', side: 'top' },
            { n: 5, selector: '[data-figma-part="List"]', side: 'bottom' },
          ],
          dimensions: [
            { kind: 'padding', selector: '[data-figma-part="Content"]', side: 'left' },
            { kind: 'height', selector: '[data-figma-part="Time"]' },
          ],
        }],
        guidelines: [
          <><strong>Tarjeta:</strong> el estado Unread usa fondo <code>background-container-hover-on-canva</code>, padding de 24 px en Tablet y Desktop y radio de 16 px.</>,
          <><strong>Hora:</strong> aparece sobre el título y comparte la fila con el control de desplegar.</>,
          <><strong>Control:</strong> el botón chevron controla la lista completa y muestra su estado con <code>aria-expanded</code> y <code>aria-controls</code>.</>,
          <><strong>Título y contador:</strong> el Badge número anuncia el total; el título usa tipografía secundaria semibold de 12 px/16 px.</>,
          <><strong>Lista:</strong> contiene <code>NotificationGroupItem</code>. Recogida solo muestra la primera fila; desplegada muestra todas.</>,
        ],
      }, {
        canvases: [{
          label: 'Grupo desplegado',
          preview: group({ unread: false, defaultExpanded: true }, rows(undefined, [false, false, false])),
          marks: [
            { n: 1, selector: '[data-figma-part="Content"]', side: 'left' },
            { n: 2, selector: 'button[data-notification-control]', side: 'right' },
            { n: 3, selector: '[data-figma-part="Heading"]', index: -1, side: 'top' },
            { n: 4, selector: '[data-figma-part="List"]', side: 'bottom' },
          ],
        }],
        guidelines: [
          <><strong>Tarjeta leída:</strong> sin relleno; recogida añade un trazo inferior. Desplegada conserva el radio de 16 px y las filas dibujan sus trazos.</>,
          <><strong>Desplegar:</strong> el chevron rota 180° cuando la lista está abierta.</>,
          <><strong>Encabezado:</strong> alinea el contador con el título del grupo.</>,
          <><strong>Filas:</strong> aparecen desde la más reciente hasta la más antigua, en el orden que recibe el componente.</>,
        ],
      }] }],
    },
    {
      title: 'Estados',
      description: 'NotificationGroup combina los estados Unread y Read con los tipos Group, Dropdown group y Group delete de Figma.',
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens de la tarjeta Unread y Read. Cambia el modo para comparar el relleno y el trazo inferior.',
      titleInside: true,
      blocks: [{ type: 'tokens', groups: [
        {
          title: 'Unread',
          preview: tokensPreview(),
          entries: [
            { part: 'Fondo', color: 'background-container-hover-on-canva' },
            { part: 'Título', color: 'text-neutral-white', text: 'typography-heading-size-xs' },
            { part: 'Hora', color: 'text-neutral-white', text: 'primitives-typography-size-sm' },
          ],
        },
        {
          title: 'Read',
          preview: group({ unread: false }, rows(undefined, [false, false, false])),
          entries: [
            { part: 'Trazo inferior (recogida)', color: 'border-general-default-on-card' },
            { part: 'Título', color: 'text-neutral-white', text: 'typography-heading-size-xs' },
            { part: 'Hora', color: 'text-neutral-white', text: 'primitives-typography-size-sm' },
          ],
        },
      ] }],
    },
    {
      title: 'Uso del componente NotificationGroup en Figma:',
      description: '',
      titleInside: true,
      blocks: [{ type: 'figma', bullets: [
        <><strong>Búsqueda y configuración:</strong> encuentra «Group notification (Atom)» en Assets. Usa los tipos Group, Group delete y Dropdown group, combinados con los estados Unread y Read.</>,
        <><strong>Group y Dropdown group:</strong> Group muestra la tarjeta recogida; Dropdown group contiene las filas del set «Dropdown group notification (Atom)», con Type Default o Eliminate y State Unread o Read.</>,
        <><strong>Group delete, Read y Unread:</strong> Group delete añade la acción de eliminar. Unread aplica relleno; Read lo quita y, recogido, dibuja un trazo inferior.</>,
        <><strong>Diferencias:</strong> Simple y Simple delete del mismo set corresponden a <code>NotificationCard</code>. En código, <code>expanded</code> controla el desplegable y <code>onDelete</code> habilita la eliminación del grupo.</>,
      ] }],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo NotificationGroup es la pieza correcta y cuándo conviene otra.',
      blocks: [{ type: 'usage',
        use: [
          <><strong>Notificaciones relacionadas:</strong> agrupa filas de un mismo tema o remitente para reducir el espacio que ocupa el registro.</>,
          <><strong>Resumen del grupo:</strong> pasa las filas de la más reciente a la más antigua. Recogido, el grupo muestra la primera.</>,
          <><strong>Desplegar contenido:</strong> usa <code>expanded</code> o <code>defaultExpanded</code> para controlar la lista; el botón informa el estado a tecnologías de asistencia.</>,
          <><strong>Indicar lectura:</strong> usa <code>unread</code> en el grupo y en cada <code>NotificationGroupItem</code> según corresponda.</>,
          <><strong>Eliminar el grupo:</strong> pasa <code>onDelete</code> cuando la acción pueda borrar todas las filas agrupadas.</>,
        ],
        avoid: [
          <><strong>Notificaciones no relacionadas:</strong> no agrupes elementos que la persona deba revisar por separado. (Alternativa: <code>NotificationItem</code>).</>,
          <><strong>Una sola notificación:</strong> no uses el desplegable para una fila aislada. (Alternativa: <code>NotificationCard</code>).</>,
          <><strong>Contador distinto de las filas:</strong> no pases <code>count</code> con un valor que contradiga la cantidad real. (Alternativa: omite <code>count</code> y deja que se calcule desde los hijos).</>,
        ],
      }],
    },
    {
      title: 'Aplicaciones de breakpoints',
      description: 'Cada vista se dibuja con los valores responsive de su breakpoint. Tablet usa los mismos tokens que Desktop.',
      blocks: [{ type: 'breakpoints',
        desktop: { columns: [
          { title: 'Unread', bullets: [<>Padding de 24 px y radio de 16 px.</>, <>El grupo recogido muestra una fila y el contador total.</>], preview: group({ unread: true }) },
          { title: 'Read', bullets: [<>Sin relleno; el trazo inferior aparece al recoger el grupo.</>, <>El despliegue mantiene el radio y muestra los trazos de las filas.</>], preview: group({ unread: false, defaultExpanded: true }, rows(undefined, [false, false, false])) },
        ] },
        mobile: { bullets: [<><strong>Padding:</strong> el token <code>space/container/on-card</code> baja a 16 px.</>, <>El ancho depende del contenedor padre; la tarjeta ocupa el ancho disponible.</>, <>El control de despliegue mantiene toda la tarjeta como área de activación.</>], preview: group({ unread: true }) },
        tablet: { bullets: [<><strong>Sin cambios:</strong> usa los mismos tokens que Desktop.</>, <>El padding es de 24 px y el radio de 16 px.</>, <>La tarjeta ocupa el ancho disponible de su contenedor.</>], preview: group({ unread: true, defaultExpanded: true }) },
      }],
    },
    {
      title: 'Do and Dont’s',
      description: 'Criterios para agrupar notificaciones y mantener coherentes el estado y el contador.',
      blocks: [{ type: 'practices', items: [
        { kind: 'do', framed: true, title: 'Primero lo reciente', description: 'Ordena las filas de la más reciente a la más antigua para que la vista recogida adelante la última notificación.', preview: group({ unread: true }, rows(['Se actualizó la imagen de perfil.', 'Se guardaron los ajustes de privacidad.'], [true, false])) },
        { kind: 'dont', framed: true, title: 'Primero lo antiguo', description: 'No pongas primero una notificación anterior si la tarjeta recogida debe mostrar la más reciente.', preview: group({ unread: true }, rows(['Se guardaron los ajustes de privacidad.', 'Se actualizó la imagen de perfil.'], [false, true], ['Hace 42 min', 'Hace 22 min'])) },
        { kind: 'do', framed: true, title: 'Cuenta automática', description: <>Omite <code>count</code> para mantener el Badge sincronizado con las filas del grupo.</>, preview: group({ unread: true }, rows(['Se actualizó la imagen de perfil.', 'Se guardaron los ajustes de privacidad.'], [true, false])) },
        { kind: 'dont', framed: true, title: 'Conteo incorrecto', description: 'No declares un total distinto de la cantidad de filas visibles al desplegar.', preview: group({ unread: true, count: 9, defaultExpanded: true }, rows(['Se actualizó la imagen de perfil.', 'Se guardaron los ajustes de privacidad.'], [true, false])) },
        { kind: 'do', framed: true, title: 'Marca el grupo nuevo', description: <>Activa <code>unread</code> cuando el grupo tenga notificaciones pendientes de revisar.</>, preview: group({ unread: true }) },
        { kind: 'dont', framed: true, title: 'Estado contradictorio', description: 'No muestres filas sin leer dentro de un grupo marcado como leído.', preview: group({ unread: false }) },
      ] }],
    },
  ],
};
