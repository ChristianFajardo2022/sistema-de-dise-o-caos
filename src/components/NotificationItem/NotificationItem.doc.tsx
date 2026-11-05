import { Fragment } from 'react';
import type { ComponentProps } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { NotificationItem } from './NotificationItem';

/*
 * Contenido de la página de documentación de NotificationItem (plantilla v2). Manda el código
 * (`NotificationItem.types.ts`, `NotificationItem.variants.ts`, `NotificationItem.tsx`), luego `NotificationItem.docs.json`.
 * Diferencias con Figma: el título Active se dibuja en Medium (500) en la capa, pero enlaza `typography/weight/Semibold`
 * (600) y el código usa 600; el gap del encabezado baja a 12 en Mobile con `mobile:`.
 */

// Figma: 12571:4812 (component set Text notification (Atom))

const row = (props: Partial<ComponentProps<typeof NotificationItem>> = {}) => (
  <NotificationItem title="Documento compartido" description="Ana Pérez compartió Informe anual contigo." {...props} />
);

const list = (...rows: ReturnType<typeof row>[]) => <ul role="list" className="m-0 w-[333px] list-none p-0">{rows.map((r, i) => <Fragment key={i}>{r}</Fragment>)}</ul>;

const item = (props: Partial<ComponentProps<typeof NotificationItem>> = {}) => list(row(props));

/** Foco forzado solo para documentar: las mismas clases que dibuja el componente cuando su control recibe el foco. */
const FOCUS_RING = 'outline-2 outline-offset-2 outline-solid outline-ds-border-field-active';

const noop = () => {};

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Notificación leída. El título va en peso regular y no hay punto.',
    samples: [item({ unread: false })],
  },
  {
    label: 'Active',
    tone: 'neutral',
    description: <>Notificación no leída (<code>unread</code>). El título pasa a semibold y aparece el punto verde al final de la fila.</>,
    samples: [item({ unread: true })],
  },
  {
    label: 'Focus',
    tone: 'accent',
    description: <>Al recibir el foco del teclado, la fila dibuja un contorno de 2 px. Solo existe con <code>href</code> u <code>onClick</code>.</>,
    samples: [item({ unread: true, onClick: noop, className: FOCUS_RING })],
  },
];

export const doc: ComponentDocContent = {
  name: 'NotificationItem',
  icon: 'notification',
  classification: 'molecula',
  summary:
    'NotificationItem es la molécula que muestra una notificación como fila de texto: un título, una descripción opcional y un punto que indica si no se ha leído. Puede abrir el detalle con un enlace o un botón, y es la fila de la lista simple del panel de notificaciones.',
  definition: [
    {
      title: 'Anatomía',
      description: 'La fila apila el encabezado, con el título y el punto de no leída, sobre la descripción, dentro de un elemento de lista.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Fila no leída',
                  preview: item({ unread: true }),
                  marks: [
                    { n: 1, selector: 'li', side: 'bottom' },
                    { n: 2, selector: '[data-figma-part="Heading"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Text notification"]', side: 'left' },
                    { n: 4, selector: '[data-figma-part="Badge"]', side: 'right' },
                    { n: 5, selector: '[data-figma-part="Text description"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[data-figma-part="Heading"]' },
                  ],
                },
              ],
              guidelines: [
                <><strong>Fila:</strong> <code>&lt;li&gt;</code> en columna con gap de 4 px (<code>gap/general/sm</code>), relleno inferior de 16 px (<code>space/general/2xl</code>) y trazo inferior de 0,5 px en <code>border-general-default-on-card</code>.</>,
                <><strong>Encabezado:</strong> fila de 20 px que alinea el título a la izquierda y el punto a la derecha, con gap de 16 px (<code>gap/general/xl</code>; 12 px en Mobile).</>,
                <><strong>Título:</strong> Helvetica Neue de 16/20 px en <code>text-neutral-white</code>. Regular si está leída; semibold (600) si no lo está.</>,
                <><strong>Punto de no leída:</strong> Badge <code>simple</code> de 12 px con estado <code>success</code>. Lleva el texto <code>unreadLabel</code> solo para lectores de pantalla.</>,
                <><strong>Descripción:</strong> opcional, de 14/18 px en <code>text-neutral-body</code>. Sin <code>description</code> no se dibuja.</>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Fila interactiva con foco',
                  preview: item({ unread: true, onClick: noop, className: FOCUS_RING }),
                  marks: [
                    { n: 1, selector: 'li', side: 'right' },
                    { n: 2, selector: '[data-notification-control]', side: 'left' },
                    { n: 3, selector: '[data-figma-part="Text description"]', side: 'bottom' },
                  ],
                },
              ],
              guidelines: [
                <><strong>Contorno de foco:</strong> 2 px con 2 px de separación, en <code>border-field-active</code>. Se dibuja en la fila cuando su control recibe el foco con el teclado.</>,
                <><strong>Control:</strong> el título es un <code>&lt;button&gt;</code> con <code>onClick</code> o un <code>&lt;a&gt;</code> con <code>href</code>. Un pseudoelemento lo estira sobre toda la fila y su nombre accesible es el título.</>,
                <><strong>Descripción accesible:</strong> el control la forma con el texto de no leída y la descripción, para que el lector de pantalla los lea después del título.</>,
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Estados',
      description: <>NotificationItem tiene 3 estados. Default y Active salen del set Text notification (Atom) de Figma; Focus sale del código. No tiene Hover ni Press: la fila no cambia al pasar el puntero. Focus se fuerza solo para documentar.</>,
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens de cada estado de lectura. Cambia el modo para ver el valor de cada color.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Default (leída)',
              preview: item({ unread: false }),
              entries: [
                { part: 'Trazo inferior', color: 'border-general-default-on-card' },
                { part: 'Título', color: 'text-neutral-white', text: 'primitives-typography-size-lg' },
                { part: 'Descripción', color: 'text-neutral-body', text: 'primitives-typography-size-md' },
              ],
            },
            {
              title: 'Active (no leída)',
              preview: item({ unread: true }),
              entries: [
                { part: 'Trazo inferior', color: 'border-general-default-on-card' },
                { part: 'Título', color: 'text-neutral-white', text: 'primitives-typography-size-lg' },
                { part: 'Punto', color: 'background-semantic-success-tertiary' },
                { part: 'Descripción', color: 'text-neutral-body', text: 'primitives-typography-size-md' },
                { part: 'Contorno (aparece en Focus)', color: 'border-field-active' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente NotificationItem en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <><strong>Búsqueda y configuración:</strong> encuentra «Text notification (Atom)» en la librería de Assets. Tiene las propiedades Notification (<code>title</code>), Description (<code>description</code>) y Type.</>,
            <><strong>Type:</strong> Default es la notificación leída; Active es la no leída (<code>unread</code>), con el título más grueso y el punto verde.</>,
            <><strong>Diferencias:</strong> Figma solo dibuja el reposo. El código añade la fila interactiva (<code>href</code> u <code>onClick</code>), el contorno de foco y el texto <code>unreadLabel</code> del punto.</>,
            <><strong>Sets relacionados:</strong> Simple notifications y Mobile notifications corresponden a <code>NotificationPanel</code>, que usa esta fila en su lista simple. La notificación con hora y acción de eliminar es <code>NotificationCard</code>.</>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo NotificationItem es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <><strong>Lista simple de avisos:</strong> cada aviso es un título con una descripción corta, sin hora. Es la fila de la lista Simple de <code>NotificationPanel</code>.</>,
            <><strong>Indicar lo no leído:</strong> usa <code>unread</code>. El punto también se anuncia como «No leída» (<code>unreadLabel</code>).</>,
            <><strong>Abrir el detalle:</strong> pasa <code>href</code> para un enlace o <code>onClick</code> para un botón. El control cubre toda la fila.</>,
            <><strong>Solo informar:</strong> sin <code>href</code> ni <code>onClick</code> la fila no es un control y el título es un párrafo.</>,
            <><strong>Dentro de una lista:</strong> es un <code>&lt;li&gt;</code>; ponla en un <code>&lt;ul role=&quot;list&quot;&gt;</code>.</>,
          ],
          avoid: [
            <><strong>Aviso con hora o eliminar:</strong> esta fila no muestra la hora ni la acción de eliminar. (Alternativa: <code>NotificationCard</code>).</>,
            <><strong>Avisos de un mismo tema:</strong> no los repitas uno por uno. (Alternativa: <code>NotificationGroup</code>).</>,
            <><strong>Mensaje de ayuda o error de un campo:</strong> no es una notificación. (Alternativa: <code>NotificationText</code>).</>,
            <><strong>Aviso temporal sobre la página:</strong> la fila no desaparece sola. (Alternativa: <code>Toast</code>).</>,
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
                title: 'Fila',
                bullets: [
                  <>El gap del encabezado es de 16 px y el relleno inferior de 16 px.</>,
                  <>Ocupa el ancho de su lista; Figma la dibuja de 333 px.</>,
                ],
                preview: item({ unread: true }),
              },
            ],
          },
          mobile: {
            bullets: [
              <><strong>Gap del encabezado:</strong> baja a 12 px (<code>gap/general/xl</code>).</>,
              <>El relleno inferior, el título (16/20 px) y la descripción (14/18 px) no cambian.</>,
              <>Ocupa el ancho de su lista; el texto ajusta línea.</>,
            ],
            preview: item({ unread: true }),
          },
          tablet: {
            bullets: [
              <><strong>Sin cambios:</strong> mide lo mismo que en Desktop.</>,
              <>El gap del encabezado es de 16 px.</>,
              <>Ocupa el ancho de su lista; el texto ajusta línea.</>,
            ],
            preview: item({ unread: true }),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Criterios para escribir las filas y marcar su lectura.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Título que resume',
              description: 'Resume el aviso en el título y deja el detalle para la descripción.',
              preview: item({ unread: true }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Todo en el título',
              description: 'No metas el detalle en el título: se alarga y la descripción se pierde.',
              preview: item({ unread: true, title: 'Ana Pérez compartió el documento Informe anual contigo', description: undefined }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Solo lo pendiente',
              description: <>Usa <code>unread</code> solo en lo que falta por leer.</>,
              preview: list(
                row({ unread: true }),
                row({ title: 'Comentario nuevo', description: 'Hugo García respondió tu comentario.' }),
                row({ title: 'Reunión actualizada', description: 'El equipo cambió la sala del jueves.' })
              ),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Todo sin leer',
              description: 'No marques todas las filas: el punto deja de distinguir lo pendiente.',
              preview: list(
                row({ unread: true }),
                row({ unread: true, title: 'Comentario nuevo', description: 'Hugo García respondió tu comentario.' }),
                row({ unread: true, title: 'Reunión actualizada', description: 'El equipo cambió la sala del jueves.' })
              ),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Descripción que aporta',
              description: 'Escribe en la descripción lo que el título no dice.',
              preview: item({ unread: false }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Descripción repetida',
              description: 'No repitas el título en la descripción.',
              preview: item({ unread: false, description: 'Documento compartido' }),
            },
          ],
        },
      ],
    },
  ],
};
