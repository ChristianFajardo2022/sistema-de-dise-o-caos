import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Badge } from './Badge';
import type { BadgeState } from './Badge.types';

/*
 * Contenido de la página de documentación de Badge (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Badge.types.ts`, `Badge.variants.ts`, `Badge.tsx`), luego `Badge.docs.json`. Medidas: punto de 12 px; ícono de 16 × 16 px
 * con glifo de 12; número y ícono con número de 16 px de alto, padding X de 2 px y texto 10/14 en regular; esquina
 * `radius/container/On canva`. Las medidas son iguales en Desktop, Tablet y Mobile: solo el token de esquina cambia
 * (24 px en Mobile, 32 px en Tablet y Desktop) y con 16 px de alto la cápsula se ve igual.
 * Diferencias con Figma: Figma llama a la prop State y a sus valores Default, Success, Alert, Error, Info, Neutral, Negative,
 * Positive e Inactive; el código usa los mismos en minúscula. Figma no trae nombre accesible ni rol: el código añade la prop
 * `label` y marca como decorativo el badge sin texto ni `label`.
 */

// Figma: component set Badge (36 variantes: Type × State)

type BadgeProps = Partial<ComponentProps<typeof Badge>>;

/**
 * Badge de ejemplo. El texto es el contenido de los tipos number e icon-number. `data-figma` solo sirve de selector
 * para los marcadores de la anatomía.
 */
const badge = (props: BadgeProps = {}, text: ReactNode = '5') => (
  <Badge type="icon-number" label="comentarios" data-figma="Type=Icon + number" {...props}>
    {text}
  </Badge>
);

/** Los cuatro tipos en el mismo State, para la columna de cada State. */
const types = (state: BadgeState, icon: BadgeProps['icon'] = 'star'): ReactNode[] => [
  <Badge key="simple" type="simple" state={state} label="Estado" />,
  <Badge key="icon" type="icon" state={state} icon={icon} label="Estado" />,
  <Badge key="number" type="number" state={state} label="comentarios">
    5
  </Badge>,
  <Badge key="icon-number" type="icon-number" state={state} icon={icon} label="comentarios">
    12
  </Badge>,
];

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: (
      <>
        Color de acento. Es el valor por defecto (<code>state=&quot;default&quot;</code>).
      </>
    ),
    samples: types('default'),
  },
  {
    label: 'Success',
    tone: 'success',
    description: <>Algo salió bien o está activo. Fondo y texto en verde.</>,
    samples: types('success', 'tick-circle'),
  },
  {
    label: 'Alert',
    tone: 'neutral',
    description: <>Algo requiere atención sin ser un fallo. Fondo y texto en ámbar.</>,
    samples: types('alert', 'warning'),
  },
  {
    label: 'Error',
    tone: 'error',
    description: <>Algo falló o necesita corrección. Fondo rojo y texto blanco.</>,
    samples: types('error', 'close-circle'),
  },
  {
    label: 'Info',
    tone: 'neutral',
    description: <>Dato informativo. Fondo y texto en azul.</>,
    samples: types('info', 'info-circle'),
  },
  {
    label: 'Neutral',
    tone: 'neutral',
    description: <>Sin carga semántica. Fondo gris.</>,
    samples: types('neutral'),
  },
  {
    label: 'Negative',
    tone: 'neutral',
    description: <>Contraste sobre la superficie del tema: fondo de la superficie inversa y texto de la superficie del tema. El punto simple no cambia con el modo y en claro se pierde sobre el panel.</>,
    samples: types('negative'),
  },
  {
    label: 'Positive',
    tone: 'neutral',
    description: <>Contraste sobre la superficie inversa: toma el color de la superficie del tema, así que sobre ella se funde.</>,
    samples: types('positive'),
  },
  {
    label: 'Inactive',
    tone: 'neutral',
    description: <>Elemento deshabilitado o sin actividad. Fondo gris apagado y texto deshabilitado. En oscuro casi no se distingue del panel.</>,
    samples: types('inactive'),
  },
];

/** Fila de badges con espacio entre ellos. Cada uno lleva su `key`. */
const row = (...items: ReactNode[]): ReactNode => (
  <div className="flex items-center gap-ds-space-general-2xl">
    {items.map((item, i) => (
      <Fragment key={i}>{item}</Fragment>
    ))}
  </div>
);

/** Texto de apoyo junto al badge en los pares Do and Dont's. */
const caption = (text: string): ReactNode => (
  <span className="text-ds-primitives-typography-size-md text-ds-text-neutral-body">{text}</span>
);

/** Elemento con un punto de estado y su texto. */
const presence = (label?: string): ReactNode => (
  <div className="flex items-center gap-ds-space-general-md">
    <Badge type="simple" state="success" label={label} />
    {caption('Ana Pérez')}
  </div>
);

/** Vista de los breakpoints: los cuatro tipos en fila. */
const breakpointRow = (): ReactNode =>
  row(
    <Badge type="simple" state="success" label="En línea" />,
    <Badge type="icon" state="alert" icon="warning" label="Pendiente" />,
    <Badge type="number" state="error" label="notificaciones sin leer">
      5
    </Badge>,
    <Badge type="icon-number" state="info" icon="info-circle" label="avisos">
      12
    </Badge>
  );

export const doc: ComponentDocContent = {
  name: 'Badge',
  icon: 'star',
  classification: 'atomo',
  summary:
    'El Badge es el átomo que indica un estado o un conteo con un punto, un ícono, un número o un ícono con número. Tiene cuatro tipos y nueve colores semánticos. No es interactivo: informa y no recibe foco ni clics.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una cápsula pequeña que combina, según el tipo, un ícono y un número. El tipo simple es solo un punto.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Ícono y número',
                  preview: badge({ state: 'info', icon: 'info-circle' }, '12'),
                  marks: [
                    { n: 1, selector: '[data-figma]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Icon-sizes"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Container"]', side: 'bottom' },
                  ],
                  dimensions: [{ kind: 'gap', from: '[data-figma-part="Icon-sizes"]', to: '[data-figma-part="Container"]' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> cápsula de 16 px de alto como mínimo, con padding X de 2 px (<code>space/general/sm</code>), gap de 4 px (<code>space/general/md</code>) y esquina <code>radius/container/On canva</code>.
                </>,
                <>
                  <strong>Ícono:</strong> 12 px, siempre en fill. Se elige con <code>icon</code> y su color depende de <code>state</code>.
                </>,
                <>
                  <strong>Número:</strong> texto de 10 px con interlineado de 14 px (<code>typography/body/size/xs</code>) en regular, centrado, con ancho mínimo de 12 px y padding inferior de 2 px (<code>space/text/sm</code>).
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Punto e ícono',
                  preview: row(
                    <Badge type="simple" state="success" label="En línea" />,
                    <Badge type="icon" state="alert" icon="warning" label="Pendiente" data-figma="Type=Icon" />
                  ),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Badge"]', side: 'top' },
                    { n: 2, selector: '[data-figma="Type=Icon"]', side: 'bottom' },
                    { n: 3, selector: '[data-figma-part="Icon-sizes"]', side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[data-figma-part="Badge"]' },
                    { kind: 'padding', selector: '[data-figma="Type=Icon"]', side: 'left' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Punto:</strong> círculo de 12 × 12 px con el color de <code>state</code>. El marco transparente mide lo mismo y no lleva relleno.
                </>,
                <>
                  <strong>Contenedor del ícono:</strong> cuadrado de 16 × 16 px con padding de 2 px (<code>space/general/sm</code>) y la misma esquina de cápsula.
                </>,
                <>
                  <strong>Ícono:</strong> 12 px en fill, centrado en el contenedor.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Solo número',
                  preview: row(
                    <Badge type="number" state="error" label="notificaciones sin leer" data-figma="Type=Number">
                      5
                    </Badge>,
                    <Badge type="number" state="error" label="notificaciones sin leer" data-figma="Type=Number">
                      99+
                    </Badge>
                  ),
                  marks: [
                    { n: 1, selector: '[data-figma="Type=Number"]', index: 0, side: 'bottom' },
                    { n: 2, selector: '[data-figma-part="Container"]', index: 1, side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma="Type=Number"]', index: 1, side: 'left' },
                    { kind: 'height', selector: '[data-figma="Type=Number"]', index: 0 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> 16 px de alto y 16 px de ancho como mínimo; crece con el texto. Padding X de 2 px (<code>space/badge/sm</code>) y padding Y de 0 px (<code>space/badge/xs</code>).
                </>,
                <>
                  <strong>Texto:</strong> el contenido en 10/14 px regular, sin salto de línea. Los conteos de dos o tres caracteres ensanchan la cápsula.
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
          Badge tiene 9 variantes de aspecto, una por State, cada una en sus cuatro tipos. No es interactivo: no tiene hover, focus ni press y no recibe foco.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens de cada State en los tipos con texto. Cambia el modo para ver su valor.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Default',
              preview: badge({ state: 'default' }),
              entries: [
                { part: 'Fondo y punto', color: 'background-acent-tertiary' },
                { part: 'Texto', color: 'text-neutral-white-unicolor', text: 'typography-body-size-xs' },
                { part: 'Ícono', color: 'icon-general-default-unicolor' },
              ],
            },
            {
              title: 'Success',
              preview: badge({ state: 'success', icon: 'tick-circle' }),
              entries: [
                { part: 'Fondo y punto', color: 'background-semantic-success-tertiary' },
                { part: 'Texto', color: 'text-semantic-success', text: 'typography-body-size-xs' },
                { part: 'Ícono', color: 'icon-semantic-success-tertiary' },
              ],
            },
            {
              title: 'Alert',
              preview: badge({ state: 'alert', icon: 'warning' }),
              entries: [
                { part: 'Fondo y punto', color: 'background-semantic-alert-tertiary' },
                { part: 'Texto', color: 'text-semantic-alert', text: 'typography-body-size-xs' },
                { part: 'Ícono', color: 'icon-semantic-alert-tertiary' },
              ],
            },
            {
              title: 'Error',
              preview: badge({ state: 'error', icon: 'close-circle' }),
              entries: [
                { part: 'Fondo y punto', color: 'background-semantic-error-fourth' },
                { part: 'Texto', color: 'text-neutral-white-unicolor', text: 'typography-body-size-xs' },
                { part: 'Ícono', color: 'icon-general-default-unicolor' },
              ],
            },
            {
              title: 'Info',
              preview: badge({ state: 'info', icon: 'info-circle' }),
              entries: [
                { part: 'Fondo y punto', color: 'background-semantic-information-tertiary' },
                { part: 'Texto', color: 'text-semantic-information', text: 'typography-body-size-xs' },
                { part: 'Ícono', color: 'icon-semantic-information-tertiary' },
              ],
            },
            {
              title: 'Neutral',
              preview: badge({ state: 'neutral' }),
              entries: [
                { part: 'Fondo y punto', color: 'background-general-gray-fifth' },
                { part: 'Texto', color: 'text-neutral-white', text: 'typography-body-size-xs' },
                { part: 'Ícono', color: 'icon-general-default' },
              ],
            },
            {
              title: 'Negative',
              preview: badge({ state: 'negative' }),
              entries: [
                { part: 'Fondo', color: 'background-general-white' },
                { part: 'Punto (no cambia con el modo)', color: 'background-general-white-unicolor', mode: 'light' },
                { part: 'Texto', color: 'text-neutral-black', text: 'typography-body-size-xs' },
                { part: 'Ícono', color: 'icon-general-black' },
              ],
            },
            {
              title: 'Positive',
              preview: badge({ state: 'positive' }),
              entries: [
                { part: 'Fondo y punto', color: 'background-general-black' },
                { part: 'Texto', color: 'text-neutral-white', text: 'typography-body-size-xs' },
                { part: 'Ícono', color: 'icon-general-default' },
              ],
            },
            {
              title: 'Inactive',
              preview: badge({ state: 'inactive' }),
              entries: [
                { part: 'Fondo y punto', color: 'background-general-gray-seventh' },
                { part: 'Texto', color: 'text-neutral-disabled-on-canva', text: 'typography-body-size-xs' },
                { part: 'Ícono', color: 'icon-general-disabled-positive' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Badge en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Badge en la librería de Assets. Sus propiedades son Type, State y Text.
            </>,
            <>
              <strong>Type:</strong> Simple, Icon, Number o Icon + number. En código es <code>type</code> con <code>simple</code>, <code>icon</code>, <code>number</code> o <code>icon-number</code>.
            </>,
            <>
              <strong>State:</strong> es el color semántico, no un estado de interacción. En código es <code>state</code> con los mismos nueve valores en minúscula.
            </>,
            <>
              <strong>Text:</strong> el número de los tipos Number e Icon + number. En código es el contenido (<code>children</code>). Figma no tiene nombre accesible: el código añade <code>label</code>, y el ícono se elige con <code>icon</code>.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Badge es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Conteo junto a un elemento:</strong> el tipo <code>number</code> muestra cuántos avisos o mensajes hay. Con <code>label</code> se lee &quot;5 notificaciones sin leer&quot;.
            </>,
            <>
              <strong>Punto de estado:</strong> el tipo <code>simple</code> marca presencia o disponibilidad. Añade <code>label</code> para que el estado también se lea.
            </>,
            <>
              <strong>Marca con ícono:</strong> el tipo <code>icon</code> indica un estado con un dibujo. Elige el glifo con <code>icon</code> y descríbelo con <code>label</code>.
            </>,
            <>
              <strong>Color con significado:</strong> <code>success</code>, <code>alert</code>, <code>error</code> e <code>info</code> comunican el tipo de estado.
            </>,
          ],
          avoid: [
            <>
              <strong>Acciones:</strong> el Badge no recibe clic ni foco. (Alternativa: <code>Tag</code> con <code>onClick</code> o <code>Button</code>).
            </>,
            <>
              <strong>Texto largo:</strong> solo muestra números cortos y los tipos simple e icon no dibujan texto. (Alternativa: <code>Tag</code>).
            </>,
            <>
              <strong>Significado solo con color:</strong> un punto sin <code>label</code> es decorativo (<code>aria-hidden</code>). (Alternativa: añadir <code>label</code> o un texto al lado).
            </>,
            <>
              <strong>Contadores que deben anunciarse:</strong> el Badge no es una región viva. (Alternativa: envolverlo en un contenedor con <code>aria-live</code>).
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
                title: 'Tipos',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Medida fija:</strong> el punto mide 12 px y los demás tipos 16 px de alto, con el texto en 10/14 px.
                  </>,
                ],
                preview: breakpointRow(),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medida fija:</strong> el badge no se estira con el contenedor y no se encoge en una fila flex.
              </>,
              <>
                <strong>Esquina:</strong> <code>radius/container/On canva</code> vale 24 px en Mobile y 32 px en Tablet y Desktop; con 16 px de alto la cápsula se ve igual.
              </>,
            ],
            preview: breakpointRow(),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medida fija:</strong> el badge no se estira con el contenedor y no se encoge en una fila flex.
              </>,
              <>
                <strong>Ancho del número:</strong> crece con el texto y no se parte en dos líneas.
              </>,
            ],
            preview: breakpointRow(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de nombre accesible, longitud del conteo y contraste.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Punto con nombre',
              description: (
                <>
                  Pon <code>label</code> al punto que informa un estado.
                </>
              ),
              preview: presence('En línea'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Punto sin nombre',
              description: (
                <>
                  No dejes sin <code>label</code> un punto que informa: el lector de pantalla lo ignora.
                </>
              ),
              preview: presence(),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Conteo con tope',
              description: 'Muestra 99+ cuando pasa de 99: una cifra corta cabe en la cápsula.',
              preview: row(
                <Badge type="number" state="error" label="notificaciones sin leer">
                  99+
                </Badge>,
                caption('Notificaciones')
              ),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Conteo sin tope',
              description: 'No muestres 1250: la cápsula se ensancha y empuja el texto vecino.',
              preview: row(
                <Badge type="number" state="error" label="notificaciones sin leer">
                  1250
                </Badge>,
                caption('Notificaciones')
              ),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Contraste con el fondo',
              description: 'Usa negative sobre la superficie del tema: es el que contrasta con ella.',
              preview: row(
                <Badge type="number" state="negative" label="mensajes">
                  5
                </Badge>,
                caption('Mensajes')
              ),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Badge que se funde',
              description: 'No uses positive ahí: toma el color del fondo y desaparece.',
              preview: row(
                <Badge type="number" state="positive" label="mensajes">
                  5
                </Badge>,
                caption('Mensajes')
              ),
            },
          ],
        },
      ],
    },
  ],
};
