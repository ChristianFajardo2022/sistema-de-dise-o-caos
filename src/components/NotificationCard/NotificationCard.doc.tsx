import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { NotificationCard } from './NotificationCard';
import type { NotificationCardProps } from './NotificationCard.types';

/*
 * Contenido de la página de documentación de NotificationCard (plantilla v2). Manda el código
 * (`NotificationCard.types.ts`, `NotificationCard.variants.ts`, `NotificationCard.tsx`), luego `NotificationCard.docs.json`.
 * Diferencias con Figma: el set solo dibuja Unread y Read con el botón eliminar siempre a la vista (Simple delete); el
 * código lo oculta hasta deslizar, pasar `revealed` o tabular, y añade el estado interactivo (`href`, `onClick`) y el foco.
 */

// Figma: 14963:6348 (component set Group notification (Atom), Type Simple y Simple delete)

/** Tarjeta de ejemplo dentro de su lista (la tarjeta es un `<li>`). */
const card = (props: Partial<NotificationCardProps> = {}) => (
  <ul role="list" className="m-0 w-[351px] list-none p-0">
    <NotificationCard
      title="Nuevo mensaje de Ana Pérez"
      description="Te escribió sobre la reunión de mañana."
      time="Hace 22 min"
      {...props}
    />
  </ul>
);

const open = () => {};
const remove = () => {};

/** Tarjeta que se abre y se puede eliminar, con el botón eliminar a la vista. */
const deletable = (unread: boolean) => card({ unread, onClick: open, onDelete: remove, revealed: true });

const states: DocStateItem[] = [
  {
    label: 'Simple · Unread',
    tone: 'neutral',
    description: 'Notificación no leída. Lleva relleno, radio de 16 px y el punto verde junto al título.',
    samples: [card({ unread: true })],
  },
  {
    label: 'Simple · Read',
    tone: 'neutral',
    description: 'Notificación leída. Sin relleno y sin punto; dibuja un trazo inferior.',
    samples: [card({ unread: false })],
  },
  {
    label: 'Simple delete · Unread',
    tone: 'error',
    description: (
      <>
        Con <code>onDelete</code> y el botón eliminar a la vista. La tarjeta pierde el radio del lado derecho.
      </>
    ),
    samples: [deletable(true)],
  },
  {
    label: 'Simple delete · Read',
    tone: 'error',
    description: (
      <>
        Leída con el botón eliminar a la vista. El contenido gana 16 px de padding a la derecha.
      </>
    ),
    samples: [deletable(false)],
  },
  {
    label: 'Focus',
    tone: 'accent',
    description: (
      <>
        Al tabular hasta el título, la tarjeta entera dibuja un contorno de 2 px. Aquí se fuerza con <code>contentProps</code> solo
        para documentar.
      </>
    ),
    samples: [
      card({
        unread: true,
        onClick: open,
        contentProps: { className: 'outline-2 outline-offset-2 outline-solid outline-ds-border-field-active' },
      }),
    ],
  },
];

export const doc: ComponentDocContent = {
  name: 'NotificationCard',
  icon: 'notification',
  classification: 'molecula',
  summary:
    'NotificationCard es la molécula que muestra una notificación como tarjeta: hora, título y descripción, con relleno y un punto verde si no está leída. Puede abrir un detalle y revelar un botón para eliminarla.',
  definition: [
    {
      title: 'Anatomía',
      description: 'La tarjeta apila la hora, el título con su punto y la descripción; a su derecha puede llevar el botón eliminar.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'No leída con eliminar a la vista',
                  preview: deletable(true),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Content"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Time"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Badge"]', side: 'left' },
                    { n: 4, selector: '[data-figma-part="Heading"]', index: 1, side: 'top' },
                    { n: 5, selector: '[data-figma-part="Content"] > p', side: 'bottom' },
                    { n: 6, selector: '[data-figma-part="Eliminate"]', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Content"]', side: 'left' },
                    { kind: 'height', selector: '[data-figma-part="Eliminate"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Tarjeta:</strong> relleno <code>background-container-hover-on-canva</code>, padding <code>space/container/on-card</code> (24 px; 16 px en
                  Mobile), radio de 16 px y 4 px entre filas.
                </>,
                <>
                  <strong>Hora:</strong> texto de 12 px/16 px sobre el título, en <code>text-neutral-white</code>.
                </>,
                <>
                  <strong>Punto:</strong> Badge <code>simple</code> en <code>background-semantic-success-tertiary</code>. Solo aparece si la notificación no está leída
                  y lleva el texto «No leída» para lectores de pantalla.
                </>,
                <>
                  <strong>Título:</strong> Prospero semibold de 12 px/16 px (<code>typography/heading/size/xs</code>). Es el control (enlace o botón) cuando la tarjeta se
                  abre.
                </>,
                <>
                  <strong>Descripción:</strong> texto de 14 px/20 px (<code>typography/body/size/md</code>). No limita las líneas.
                </>,
                <>
                  <strong>Eliminar:</strong> botón de 48 px de ancho con fondo <code>background-semantic-error-tertiary</code>, ícono <code>trash</code> de 24 px y radio
                  de 16 px a la derecha. Mide 0 px de ancho hasta que se muestra.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Leída',
                  preview: card({ unread: false, onClick: open }),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Content"]', side: 'bottom' },
                    { n: 2, selector: '[data-figma-part="Time"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Heading"]', index: 1, side: 'right' },
                    { n: 4, selector: '[data-figma-part="Content"] > p', side: 'left' },
                  ],
                  dimensions: [{ kind: 'padding', selector: '[data-figma-part="Content"]', side: 'top' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Tarjeta:</strong> sin relleno ni radio. Padding vertical de 24 px y un trazo inferior de 0,5 px en <code>border-general-default-on-card</code>.
                </>,
                <>
                  <strong>Hora:</strong> igual que en la tarjeta no leída.
                </>,
                <>
                  <strong>Título:</strong> sin punto verde; conserva la tipografía semibold.
                </>,
                <>
                  <strong>Descripción:</strong> mismo texto de 14 px/20 px.
                </>,
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
          NotificationCard tiene 5 estados: los 4 del set Group notification (Atom) de Figma, que combinan Simple y Simple delete con Unread y Read, y Focus, que
          añade el código. No cambia al pasar el puntero ni al presionar.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens de la tarjeta en estado Default. Cambia el modo para ver el valor de cada uno.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Unread',
              preview: card({ unread: true }),
              entries: [
                { part: 'Fondo', color: 'background-container-hover-on-canva' },
                { part: 'Punto', color: 'background-semantic-success-tertiary' },
                { part: 'Título', color: 'text-neutral-white', text: 'typography-heading-size-xs' },
                { part: 'Hora', color: 'text-neutral-white', text: 'primitives-typography-size-sm' },
                { part: 'Descripción', color: 'text-neutral-white', text: 'primitives-typography-size-md' },
              ],
            },
            {
              title: 'Read',
              preview: card({ unread: false }),
              entries: [
                { part: 'Trazo inferior', color: 'border-general-default-on-card' },
                { part: 'Título', color: 'text-neutral-white', text: 'typography-heading-size-xs' },
                { part: 'Hora', color: 'text-neutral-white', text: 'primitives-typography-size-sm' },
                { part: 'Descripción', color: 'text-neutral-white', text: 'primitives-typography-size-md' },
              ],
            },
            {
              title: 'Eliminar',
              preview: deletable(true),
              entries: [
                { part: 'Fondo', color: 'background-semantic-error-tertiary' },
                { part: 'Ícono', color: 'background-general-white' },
                { part: 'Focus (aparece al tabular)', color: 'border-field-active' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente NotificationCard en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como «Group notification (Atom)» en la librería de Assets. Sus propiedades son Type, State,
              Heading, Description y List.
            </>,
            <>
              <strong>Type:</strong> Simple y Simple delete son <code>NotificationCard</code>. En código, <code>onDelete</code> dibuja el botón eliminar y <code>revealed</code>{' '}
              lo deja a la vista; Figma lo muestra siempre en Simple delete.
            </>,
            <>
              <strong>State:</strong> Unread es <code>unread</code> (relleno y punto verde) y Read es el valor por defecto. Heading es <code>title</code>, Description es{' '}
              <code>description</code> y la capa «Hace 22m» es <code>time</code>.
            </>,
            <>
              <strong>Diferencias:</strong> Group, Group delete y Dropdown group, del mismo set, son <code>NotificationGroup</code>. Figma no dibuja la versión interactiva
              (<code>href</code>, <code>onClick</code>), el deslizamiento ni el foco; el código sí.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo NotificationCard es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Una notificación con su hora:</strong> muestra cada aviso como una tarjeta con hora, título y descripción, dentro de una lista{' '}
              <code>&lt;ul role=&quot;list&quot;&gt;</code>.
            </>,
            <>
              <strong>Marcar lo no leído:</strong> pasa <code>unread</code> para dar relleno y punto verde. Lectores de pantalla oyen «No leída»; cambia ese texto con{' '}
              <code>unreadLabel</code>.
            </>,
            <>
              <strong>Abrir el detalle:</strong> pasa <code>href</code> (el título es un enlace) u <code>onClick</code> (el título es un botón). El control cubre toda la
              tarjeta y su descripción accesible reúne la hora, «No leída» y la descripción.
            </>,
            <>
              <strong>Eliminar una notificación:</strong> pasa <code>onDelete</code>. El botón aparece al deslizar a la izquierda, con <code>revealed</code> o al tabular, y
              Supr también elimina. El foco pasa a la tarjeta vecina antes de eliminar.
            </>,
          ],
          avoid: [
            <>
              <strong>Varias notificaciones del mismo tema:</strong> no las apiles una a una. (Alternativa: <code>NotificationGroup</code>).
            </>,
            <>
              <strong>Una fila simple sin hora ni eliminar:</strong> no uses una tarjeta completa para un título con descripción. (Alternativa: <code>NotificationItem</code>).
            </>,
            <>
              <strong>Confirmaciones que desaparecen:</strong> no muestres como tarjeta un aviso temporal tras una acción. (Alternativa: <code>Toast</code>).
            </>,
            <>
              <strong>Fuera de una lista:</strong> no coloques la tarjeta suelta: es un <code>&lt;li&gt;</code> y necesita su <code>&lt;ul&gt;</code>.
            </>,
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
                title: 'No leída',
                bullets: [
                  <>
                    <strong>Padding:</strong> 24 px, radio de 16 px y 4 px entre filas.
                  </>,
                  <>
                    <strong>Texto:</strong> hora de 12 px/16 px, título de 12 px/16 px y descripción de 14 px/20 px.
                  </>,
                ],
                preview: card({ unread: true }),
              },
              {
                title: 'Con eliminar',
                bullets: [
                  <>
                    <strong>Botón:</strong> 48 px de ancho a la derecha, con radio de 16 px.
                  </>,
                  <>
                    <strong>Deslizar:</strong> también se muestra con un deslizamiento a la izquierda de al menos 40 px.
                  </>,
                ],
                preview: deletable(true),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Padding:</strong> el token <code>space/container/on-card</code> baja a 16 px.
              </>,
              <>
                <strong>Ancho:</strong> la tarjeta ocupa el ancho de su lista; el texto ajusta línea.
              </>,
              <>
                <strong>Eliminar:</strong> mantiene 48 px de ancho y se revela con el deslizamiento.
              </>,
            ],
            preview: card({ unread: true }),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> usa los mismos tokens que Desktop.
              </>,
              <>
                <strong>Padding:</strong> 24 px y radio de 16 px.
              </>,
              <>
                <strong>Ancho:</strong> la tarjeta ocupa el ancho de su lista.
              </>,
            ],
            preview: card({ unread: true }),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Criterios para escribir la tarjeta y mantenerla accesible.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Título que informa',
              description: 'Escribe en el título qué ocurrió.',
              preview: card({ unread: true, title: 'Nota de reunión añadida', description: 'Ana Pérez añadió una nota.' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Título genérico',
              description: 'No uses un título como «Notificación»: no dice qué cambió.',
              preview: card({ unread: true, title: 'Notificación', description: 'Ana Pérez añadió una nota.' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Descripción breve',
              description: 'Limita la descripción a una o dos frases.',
              preview: card({ unread: true, title: 'Perfil actualizado', description: 'Cambiaste la foto de tu perfil.' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Descripción extensa',
              description: 'No cuentes todo el detalle en la tarjeta: ábrelo con el control.',
              preview: card({
                unread: true,
                title: 'Perfil actualizado',
                description:
                  'Cambiaste la foto de tu perfil, el nombre que aparece en tus mensajes, el idioma de la interfaz, la zona horaria y las preferencias de privacidad.',
              }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Tarjeta con acción',
              description: (
                <>
                  Pasa <code>href</code> u <code>onClick</code> si la tarjeta abre un detalle.
                </>
              ),
              preview: card({ unread: true, onClick: open }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Tarjeta sin acción',
              description: 'No dejes sin control una tarjeta que lleva a otra vista: se ve igual, pero el teclado no la alcanza.',
              preview: card({ unread: true }),
            },
          ],
        },
      ],
    },
  ],
};
