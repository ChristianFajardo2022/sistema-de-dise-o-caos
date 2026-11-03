import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Badge } from '../Badge';
import { Button } from '../Button';
import type { ButtonState } from '../Button/Button.types';
import { Icon } from '../Icon';
import { NotificationBell } from './NotificationBell';
import { notificationBellBadgeClass, notificationBellVariants } from './NotificationBell.variants';

/*
 * Contenido de la página de documentación de NotificationBell (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el
 * código (`NotificationBell.types.ts`, `NotificationBell.variants.ts`, `NotificationBell.tsx`), luego
 * `NotificationBell.docs.json`. Las medidas son las del Button que contiene (md 56 · sm 48 · xs 32 en escritorio y
 * tableta; md 48 · sm 40 · xs 32 en móvil). Diferencias con Figma: el set solo dibuja el tamaño de 32 y lo pinta con los
 * tokens de Press del Button; el código usa los de Default y añade los tamaños sm y md, `open` y `disabled`.
 */

// Figma: 12978:19007 (component set Icon button+badge (Atom))

/** Campana de ejemplo: raíz marcada con `data-slot` para la anatomía. */
const bell = (props: Partial<ComponentProps<typeof NotificationBell>> = {}) => (
  <NotificationBell count={3} rootProps={{ 'data-slot': 'root' }} {...props} />
);

/**
 * Campana con Hover o Focus forzados: NotificationBell no expone `state`, así que se arma con las mismas piezas
 * (Button, Badge y las clases exportadas) solo para documentar.
 */
const forced = (state: ButtonState, count = 3) => (
  <span className={notificationBellVariants()}>
    <Button iconOnly variant="secondary" contrast="low" size="xs" state={state} aria-label="Notificaciones">
      <Icon name="notification" size={16} variant="fill" />
    </Button>
    {count > 0 && (
      <Badge type="number" state="error" aria-hidden="true" className={notificationBellBadgeClass}>
        {count}
      </Badge>
    )}
  </span>
);

/** Campana con un Badge suelto encima del botón (el caso que se evita). */
const loose = (n: ReactNode) => (
  <span className={notificationBellVariants()}>
    <Button iconOnly variant="secondary" contrast="low" size="xs" aria-label="Notificaciones">
      <Icon name="notification" size={16} variant="fill" />
    </Button>
    <Badge type="number" state="error" className={notificationBellBadgeClass}>
      {n}
    </Badge>
  </span>
);

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo. Botón con borde y ícono de campana; el contador aparece solo si hay notificaciones sin leer.',
    samples: [bell(), bell({ count: 0 })],
  },
  {
    label: 'Hover',
    tone: 'accent',
    description: 'Al pasar el puntero. El borde y el ícono cambian a los colores de hover del Button.',
    samples: [forced('hover'), forced('hover', 0)],
  },
  {
    label: 'Focus',
    tone: 'accent',
    description: 'Al recibir el foco del teclado. El borde y el ícono cambian a los colores de focus del Button.',
    samples: [forced('focus'), forced('focus', 0)],
  },
  {
    label: 'Press',
    tone: 'accent',
    description: (
      <>
        Al presionar, y mientras el panel está a la vista (<code>open</code>), que además expone <code>aria-expanded</code>.
      </>
    ),
    samples: [bell({ open: true }), bell({ open: true, count: 0 })],
  },
  {
    label: 'Inactive',
    tone: 'neutral',
    description: (
      <>
        No interactivo (<code>disabled</code>). El botón conserva su forma con colores atenuados.
      </>
    ),
    samples: [bell({ disabled: true }), bell({ disabled: true, count: 0 })],
  },
];

const sizes = (
  <div className="flex items-center gap-ds-space-general-6xl">
    {bell({ size: 'md' })}
    {bell({ size: 'sm' })}
    {bell({ size: 'xs' })}
  </div>
);

export const doc: ComponentDocContent = {
  name: 'NotificationBell',
  icon: 'notification',
  classification: 'molecula',
  summary:
    'La NotificationBell es la molécula que avisa de las notificaciones sin leer. Une un Button de solo ícono con un Badge de número y abre el panel de notificaciones. Pasa del máximo a "99+" y dice la cantidad en su nombre accesible.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Un contenedor une el botón de campana y el contador; el contador solo aparece con notificaciones sin leer.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Con contador',
                  preview: bell({ size: 'sm' }),
                  marks: [
                    { n: 1, selector: '[data-slot="root"]', side: 'left' },
                    { n: 2, selector: 'button', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Icon-sizes"]', side: 'left' },
                    { n: 4, selector: '[data-figma-part="Badge"]', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: 'button', side: 'left' },
                    { kind: 'height', selector: '[data-figma-part="Badge"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> <code>span</code> de posición relativa que mide lo mismo que el botón. Recibe <code>className</code> y <code>rootProps</code>.
                </>,
                <>
                  <strong>Botón:</strong> Button Secondary low de solo ícono, con radio completo y trazo de 1 px. Mide 32 en xs, 48 en sm y 56 en md, con padding de 8 en xs.
                </>,
                <>
                  <strong>Ícono:</strong> campana <code>notification</code> en relleno. Mide 16 px en xs y 20 px en sm y md.
                </>,
                <>
                  <strong>Contador:</strong> Badge de número en Error, de 16 px de alto y con tipografía de 10 px. Va en la esquina inferior derecha y es decorativo: la cantidad va en el nombre accesible.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Sin contador',
                  preview: bell({ size: 'sm', count: 0 }),
                  marks: [
                    { n: 1, selector: '[data-slot="root"]', side: 'left' },
                    { n: 2, selector: 'button', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Icon-sizes"]', side: 'left' },
                  ],
                  dimensions: [{ kind: 'height', selector: 'button' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> con <code>count</code> en 0 o sin valor solo contiene el botón.
                </>,
                <>
                  <strong>Botón:</strong> el mismo Button, sin contador. El nombre accesible es solo <code>label</code>.
                </>,
                <>
                  <strong>Ícono:</strong> la misma campana, centrada en el botón.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Tamaños',
                  preview: sizes,
                  marks: [
                    { n: 1, selector: 'button', index: 0, side: 'top' },
                    { n: 2, selector: 'button', index: 1, side: 'top' },
                    { n: 3, selector: 'button', index: 2, side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: 'button', index: 0 },
                    { kind: 'height', selector: 'button', index: 1 },
                    { kind: 'height', selector: 'button', index: 2 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>md:</strong> botón de 56, con ícono de 20 px.
                </>,
                <>
                  <strong>sm:</strong> botón de 48, con ícono de 20 px. Es el de los paneles de notificaciones.
                </>,
                <>
                  <strong>xs:</strong> botón de 32, con ícono de 16 px. Es el del componente de Figma.
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
          NotificationBell tiene 5 estados. Hover y Focus se fuerzan solo para documentar; en uso salen de la interacción. Press se activa con <code>open</code>.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Botón',
              preview: bell({ count: 0 }),
              entries: [
                { part: 'Borde', color: 'border-button-secondary-low-default' },
                { part: 'Ícono', color: 'icon-button-secondary-low-default' },
                { part: 'Borde (con open)', color: 'border-button-secondary-low-press' },
              ],
            },
            {
              title: 'Contador',
              preview: bell(),
              entries: [
                { part: 'Fondo', color: 'background-semantic-error-fourth' },
                { part: 'Texto', color: 'text-neutral-white-unicolor', text: 'typography-body-size-xs' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente NotificationBell en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Icon button+badge (Atom) en la librería de Assets y arrástralo al lienzo. Su única propiedad es Type.
            </>,
            <>
              <strong>Type:</strong> Default es el botón solo (<code>count</code> en 0) e Icon+badge añade el contador (<code>count</code> mayor que 0). El texto del contador se edita en el Badge.
            </>,
            <>
              <strong>Tamaños:</strong> el set mide 32, el tamaño <code>xs</code>. Para el botón de los paneles (<code>size=&quot;sm&quot;</code>, 48) usa el de NotificationPanel.
            </>,
            <>
              <strong>Lo que no dibuja Figma:</strong> el estado abierto (<code>open</code>), <code>disabled</code> y el tope <code>max</code>. El código los admite.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo la NotificationBell es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Aviso de notificaciones sin leer:</strong> en el Header o la barra lateral, con <code>count</code> para el contador.
            </>,
            <>
              <strong>Abrir el panel de notificaciones:</strong> <code>open</code> expone <code>aria-expanded</code> y pinta el botón en Press; <code>aria-controls</code> y <code>aria-haspopup=&quot;dialog&quot;</code> van como props del botón.
            </>,
            <>
              <strong>Cantidades grandes:</strong> pasado <code>max</code> (99 por defecto) el contador dice &quot;99+&quot; y el nombre accesible, &quot;más de 99 sin leer&quot;.
            </>,
            <>
              <strong>Nombre accesible con la cantidad:</strong> &quot;Notificaciones, 3 sin leer&quot;. Cambia <code>label</code> y <code>unreadLabel</code> si el texto necesita otro idioma o término.
            </>,
          ],
          avoid: [
            <>
              <strong>Listar las notificaciones:</strong> el botón solo avisa y abre. (Alternativa: <code>NotificationPanel</code>).
            </>,
            <>
              <strong>Acciones que no son avisos:</strong> la campana significa notificaciones. (Alternativa: <code>Button</code> de solo ícono).
            </>,
            <>
              <strong>Contar otra cosa:</strong> el contador es para no leídas. (Alternativa: <code>Badge</code>).
            </>,
            <>
              <strong>Dibujar el contador aparte:</strong> un Badge suelto no entra en el nombre accesible. (Alternativa: <code>count</code>).
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
                title: 'Tamaños',
                bullets: [
                  <>
                    <strong>Botón:</strong> md 56, sm 48 y xs 32.
                  </>,
                  <>
                    <strong>Ícono y contador:</strong> ícono de 20 px en md y sm y de 16 px en xs; contador de 16 px de alto.
                  </>,
                ],
                preview: sizes,
              },
              {
                title: 'Sin contador',
                bullets: [
                  <>
                    <strong>Botón solo:</strong> con <code>count</code> en 0 mide lo mismo que con contador.
                  </>,
                  <>
                    <strong>Nombre accesible:</strong> solo <code>label</code>, sin la cantidad.
                  </>,
                ],
                preview: (
                  <div className="flex items-center gap-ds-space-general-3xl">
                    {bell({ size: 'md', count: 0 })}
                    {bell({ size: 'sm', count: 0 })}
                    {bell({ size: 'xs', count: 0 })}
                  </div>
                ),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Botón:</strong> md 48, sm 40 y xs 32, con los tokens responsive de Mobile.
              </>,
              <>
                <strong>Ícono y contador:</strong> no cambian: 20 y 16 px de ícono y 16 px de contador.
              </>,
              <>
                <strong>Contador:</strong> sigue en la esquina inferior derecha del botón.
              </>,
            ],
            preview: sizes,
          },
          tablet: {
            bullets: [
              <>
                <strong>Botón:</strong> md 56, sm 48 y xs 32, los mismos valores que Desktop.
              </>,
              <>
                <strong>Ícono y contador:</strong> 20 y 16 px de ícono y 16 px de contador.
              </>,
              <>
                <strong>Contador:</strong> sigue en la esquina inferior derecha del botón.
              </>,
            ],
            preview: sizes,
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de nombre accesible, contador y número de campanas por vista.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Cantidad en el nombre',
              description: <>Pasa <code>count</code>: el nombre accesible incluye la cantidad.</>,
              preview: bell({ size: 'sm', count: 5 }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Badge suelto',
              description: 'No pongas un Badge a mano sobre un Button: el lector no dice qué cuenta.',
              preview: loose(5),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Tope del contador',
              description: <>Define <code>max</code> para que el contador no pase de &quot;99+&quot;.</>,
              preview: bell({ size: 'sm', count: 150, max: 99 }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Cifra completa',
              description: 'No muestres cifras largas: el contador de 16 px no las contiene.',
              preview: loose(1250),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Una campana por vista',
              description: 'Deja una sola campana por vista, con un único panel.',
              preview: bell({ size: 'sm' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Campanas repetidas',
              description: 'No repitas la campana: se duplica el aviso.',
              preview: (
                <div className="flex items-center gap-ds-space-general-2xl">
                  {bell({ size: 'sm' })}
                  {bell({ size: 'sm' })}
                </div>
              ),
            },
          ],
        },
      ],
    },
  ],
};
