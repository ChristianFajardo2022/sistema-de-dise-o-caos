import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { FileUploadItem } from './FileUploadItem';

/*
 * Contenido de la página de documentación de FileUploadItem (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el
 * código (`FileUploadItem.tsx`, `FileUploadItem.types.ts`, `FileUploadItem.variants.ts`), luego
 * `FileUploadItem.docs.json`. Medidas tomadas en el navegador: radio de 24 px, padding de 24 px (16 px en Mobile),
 * gap de 16 px entre la fila y la barra, 8 px entre el ícono y los textos, botones de 32 px con ícono de 20 px.
 * Diferencias con Figma: el Avatar sm del código mide 40 px con ícono de 24 px y el de Figma 32 px con ícono de 16 px
 * (Avatar no tiene ese tamaño: xs mide 24 y sm 40, no se fuerza). El fondo ya coincide: ambos usan
 * `background/icon/default-on-canva`, que casi se funde con la tarjeta. Figma baja
 * el gap a 12 px en Mobile (`gap/general/xl`) y el código usa `space/general/2xl` (16 px) en todos los breakpoints.
 * El set de Figma se llama File card, igual que el de `FileCard`: este es el de State Charging, Complete, Error,
 * Charging error y Alert.
 */

// Figma: 11557:17694 (component set File card, State Charging, Complete, Error, Charging error y Alert)

type ItemProps = Partial<ComponentProps<typeof FileUploadItem>>;

const noop = () => {};

/** Nombre de cada State de Figma (en código `loading` y `loading-error`), para el `data-figma` de las muestras. */
const FIGMA_STATE = {
  loading: 'Charging',
  complete: 'Complete',
  error: 'Error',
  'loading-error': 'Charging error',
  alert: 'Alert',
} as const;

/**
 * La superficie de la tarjeta (`background/container/default-on-card`) casi se funde con el lienzo de la plantilla:
 * las muestras van sobre la superficie del tema (`background/general/black`), como en las historias.
 */
const onSurface = (node: ReactNode) => (
  <div className="rounded-ds-radius-container-on-card bg-ds-background-general-black p-ds-space-general-2xl">{node}</div>
);

/** Tarjeta de 304 px con sus tres acciones; cada estado dibuja solo las que le tocan. */
const item = (props: ItemProps = {}) =>
  onSurface(
    <div className="w-[304px] max-w-full">
      <FileUploadItem
        title="Informe.pdf"
        progress={25}
        onDelete={noop}
        onDownload={noop}
        onRetry={noop}
        data-figma={`State=${FIGMA_STATE[props.status ?? 'loading']}`}
        {...props}
      />
    </div>
  );

const loading = (props: ItemProps = {}) => item({ status: 'loading', ...props });
const complete = (props: ItemProps = {}) => item({ status: 'complete', ...props });
const failed = (props: ItemProps = {}) => item({ status: 'loading-error', ...props });

const states: DocStateItem[] = [
  {
    label: 'Charging',
    tone: 'neutral',
    description: (
      <>
        La carga está en curso (<code>status=&quot;loading&quot;</code>). Muestra el ícono <code>folder</code>, el texto de estado, la barra verde con el avance y Eliminar.
      </>
    ),
    samples: [loading(), loading({ progress: 80 })],
  },
  {
    label: 'Complete',
    tone: 'success',
    description: (
      <>
        La carga terminó (<code>status=&quot;complete&quot;</code>). Cambia el ícono a <code>tick-circle</code>, quita la barra y ofrece Descargar y Eliminar.
      </>
    ),
    samples: [complete()],
  },
  {
    label: 'Error',
    tone: 'error',
    description: (
      <>
        El archivo tiene un error (<code>status=&quot;error&quot;</code>). Muestra <code>close-circle</code> y el mensaje en el color de error, sin barra, con Descargar y Eliminar.
      </>
    ),
    samples: [item({ status: 'error' })],
  },
  {
    label: 'Charging error',
    tone: 'error',
    description: (
      <>
        La carga falló (<code>status=&quot;loading-error&quot;</code>). Igual que Error, pero ofrece Reintentar y Eliminar en lugar de Descargar.
      </>
    ),
    samples: [failed()],
  },
  {
    label: 'Alert',
    tone: 'alert',
    description: (
      <>
        La carga sigue con una advertencia (<code>status=&quot;alert&quot;</code>). Muestra <code>warning</code> y una barra amarilla que conserva el avance, con Reintentar y Eliminar.
      </>
    ),
    samples: [item({ status: 'alert', message: 'Faltan hojas', progress: 70 })],
  },
];

export const doc: ComponentDocContent = {
  name: 'FileUploadItem',
  icon: 'document-upload',
  classification: 'molecula',
  summary:
    'El FileUploadItem es la molécula que muestra un archivo mientras se carga o después de cargarlo. Une un ícono de estado, el nombre, un texto de estado, una barra de progreso y botones de acción. No sube nada: describes el estado y el componente lo dibuja.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una tarjeta con una fila de ícono, textos y acciones y, en las cargas en curso, una barra de progreso debajo.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Carga en curso',
                  preview: loading(),
                  marks: [
                    { n: 1, selector: '[data-figma="State=Charging"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Icon-sizes"]', index: 0, side: 'left' },
                    { n: 3, selector: '[data-figma-part="Filename"]', side: 'top' },
                    { n: 4, selector: '[data-figma-part="Status"]', side: 'right' },
                    { n: 5, selector: 'button[aria-label^="Eliminar"]', side: 'right' },
                    { n: 6, selector: '[role="progressbar"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma="State=Charging"]', side: 'left' },
                    { kind: 'gap', from: '[data-figma="State=Charging"] > div:first-child', to: '[role="progressbar"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Tarjeta:</strong> columna a ancho completo con radio de 24 px (<code>radius/general/2xl</code>) y padding de 24 px (<code>space/container/on-card</code>). Entre la fila y la barra hay 16 px (<code>space/general/2xl</code>).
                </>,
                <>
                  <strong>Ícono de estado:</strong> un <code>Avatar</code> <code>icon</code> sm de 40 px con ícono de 24 px, con fondo <code>background/icon/default-on-canva</code> que casi se funde con la tarjeta, a 8 px de los textos (<code>space/general/lg</code>). En Charging dibuja <code>icon</code> (<code>folder</code> por defecto).
                </>,
                <>
                  <strong>Nombre:</strong> es <code>title</code>. Semibold de 14 px con interlineado de 18 px, en <code>text/neutral/heading</code>. Ocupa una sola línea y se recorta con puntos suspensivos si no cabe.
                </>,
                <>
                  <strong>Estado:</strong> es <code>message</code>, con un texto por defecto según <code>status</code>. Regular de 14 px con interlineado de 20 px (<code>typography/body/size/md</code>), en el color semántico del estado. Se anuncia a lectores de pantalla al cambiar.
                </>,
                <>
                  <strong>Eliminar:</strong> un <code>Button</code> <code>tertiary</code> xs de solo ícono, de 32 px, con <code>trash</code> de 20 px en <code>state=&quot;delete&quot;</code>. Se dibuja si pasas <code>onDelete</code>.
                </>,
                <>
                  <strong>Barra:</strong> un <code>ProgressBar</code> <code>linear-text</code> con el valor de <code>progress</code> de 0 a 100: pista de 8 px de alto y pastilla con el porcentaje. Solo aparece en Charging y Alert.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Carga completa',
                  preview: complete(),
                  marks: [
                    { n: 1, selector: '[data-figma="State=Complete"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Icon-sizes"]', index: 0, side: 'left' },
                    { n: 3, selector: 'button[aria-label^="Descargar"]', side: 'top' },
                    { n: 4, selector: 'button[aria-label^="Eliminar"]', side: 'right' },
                  ],
                  dimensions: [{ kind: 'padding', selector: '[data-figma="State=Complete"]', side: 'left' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Tarjeta:</strong> sin barra mide solo lo que mide la fila más su padding. Las medidas son las de la carga en curso.
                </>,
                <>
                  <strong>Ícono de estado:</strong> <code>tick-circle</code> en <code>icon/semantic/success-firts</code>. Los otros estados usan <code>close-circle</code> en <code>icon/semantic/error-firts</code> o <code>warning</code> en <code>icon/semantic/alert-firts</code>.
                </>,
                <>
                  <strong>Descargar:</strong> un <code>Button</code> <code>tertiary</code> xs con <code>download</code>. Solo existe en Complete y Error, y se dibuja si pasas <code>onDownload</code>.
                </>,
                <>
                  <strong>Eliminar:</strong> el mismo botón de las demás tarjetas. Los botones van pegados, sin separación (<code>gap/general/xs</code>).
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Carga fallida',
                  preview: failed({ message: 'Sin conexión, intenta de nuevo' }),
                  marks: [
                    { n: 1, selector: '[data-figma="State=Charging error"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Error Message"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Error Details"]', side: 'bottom' },
                    { n: 4, selector: 'button[aria-label^="Reintentar"]', side: 'top' },
                  ],
                  dimensions: [{ kind: 'padding', selector: '[data-figma="State=Charging error"]', side: 'left' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Tarjeta:</strong> misma tarjeta, sin barra. Si el mensaje ocupa varias líneas, la fila crece en alto y los botones quedan centrados.
                </>,
                <>
                  <strong>Nombre:</strong> en los estados de error y de advertencia el nombre es el mismo <code>title</code>.
                </>,
                <>
                  <strong>Mensaje:</strong> en <code>text/semantic/error-secondary</code> (<code>text/semantic/alert-secondary</code> en Alert). Cambia con <code>message</code> y ajusta línea.
                </>,
                <>
                  <strong>Reintentar:</strong> un <code>Button</code> <code>tertiary</code> xs con <code>refresh</code>. Solo existe en Charging error y Alert, y se dibuja si pasas <code>onRetry</code>.
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
          FileUploadItem tiene 5 estados y son los de la carga, no de interacción: la tarjeta no tiene Hover, Focus ni Press propios. Esos los tienen sus botones, que son del <code>Button</code> y reaccionan al puntero y al teclado. La barra es del <code>ProgressBar</code> y solo existe en Charging y Alert.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Charging y de lo que cambia en los otros. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Charging',
              preview: loading(),
              entries: [
                { part: 'Fondo de la tarjeta', color: 'background-container-default-on-card' },
                { part: 'Fondo del ícono (se funde con la tarjeta)', color: 'background-icon-default-on-canva' },
                { part: 'Ícono', color: 'icon-general-default' },
                { part: 'Nombre', color: 'text-neutral-heading', text: 'primitives-typography-size-md' },
                { part: 'Estado', color: 'text-semantic-success-secondary', text: 'typography-body-size-md' },
                { part: 'Relleno de la barra', color: 'background-semantic-success-tertiary' },
                { part: 'Pista y pastilla de la barra', color: 'background-general-gray-sixth' },
                { part: 'Porcentaje', color: 'text-neutral-white' },
                { part: 'Ícono de Eliminar', color: 'icon-button-tertiary-delete' },
              ],
            },
            {
              title: 'Complete',
              preview: complete(),
              entries: [
                { part: 'Ícono de estado', color: 'icon-semantic-success-firts' },
                { part: 'Estado', color: 'text-semantic-success-secondary' },
                { part: 'Ícono de Descargar', color: 'icon-button-tertiary-default' },
              ],
            },
            {
              title: 'Error y Charging error',
              preview: failed(),
              entries: [
                { part: 'Ícono de estado', color: 'icon-semantic-error-firts' },
                { part: 'Mensaje', color: 'text-semantic-error-secondary' },
                { part: 'Ícono de Reintentar', color: 'icon-button-tertiary-default' },
              ],
            },
            {
              title: 'Alert',
              preview: item({ status: 'alert', progress: 70 }),
              entries: [
                { part: 'Ícono de estado', color: 'icon-semantic-alert-firts' },
                { part: 'Mensaje', color: 'text-semantic-alert-secondary' },
                { part: 'Relleno de la barra', color: 'background-semantic-alert-tertiary' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente FileUploadItem en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como File card en la página Card de la librería de Assets. Hay otros dos sets con ese nombre (Photo e Icon, y la miniatura): son <code>FileCard</code>. Este tiene State y los textos Tittle, Error state, Loading error y Alert, y el interruptor Download.
            </>,
            <>
              <strong>State:</strong> sus valores son Charging, Complete, Error, Charging error y Alert. En código son <code>status</code> con <code>loading</code>, <code>complete</code>, <code>error</code>, <code>loading-error</code> y <code>alert</code>.
            </>,
            <>
              <strong>Tittle, Error state, Loading error y Alert:</strong> son textos. En código son <code>title</code> y <code>message</code>, un solo texto de estado que cambia según <code>status</code>.
            </>,
            <>
              <strong>Download:</strong> es un interruptor de Figma. En código el botón aparece si pasas <code>onDownload</code>, y lo mismo vale para <code>onRetry</code> y <code>onDelete</code>. Figma no tiene la barra en Complete, Error ni Charging error; el código tampoco.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el FileUploadItem es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Mostrar un archivo con el estado de su carga:</strong> nombre, mensaje y acciones en una tarjeta. Quien lo usa sube el archivo y describe <code>status</code> y <code>progress</code>; el componente no sube nada.
            </>,
            <>
              <strong>Ofrecer solo las acciones que aplican:</strong> cada botón se dibuja si pasas su manejador. Descargar solo existe en Complete y Error, Reintentar en Charging error y Alert, y Eliminar en todos.
            </>,
            <>
              <strong>Anunciar el estado a lectores de pantalla:</strong> el mensaje está en una región <code>aria-live</code> <code>polite</code> y se anuncia cuando su texto cambia, por ejemplo de Cargando a Carga completa. No depende solo del color.
            </>,
            <>
              <strong>Dar nombre a la barra y a las acciones:</strong> la barra es un <code>progressbar</code> nombrado por el archivo y su valor se lee con el estado. Cada botón se nombra con el archivo (<code>&quot;Eliminar Informe.pdf&quot;</code>); con <code>deleteLabel</code>, <code>downloadLabel</code> y <code>retryLabel</code> reemplazas el nombre completo.
            </>,
          ],
          avoid: [
            <>
              <strong>Varios archivos con área para soltar:</strong> el ítem es una sola tarjeta. (Alternativa: <code>FileUpload</code>).
            </>,
            <>
              <strong>Un archivo con su propio recuadro para soltar:</strong> el ítem no recibe archivos. (Alternativa: <code>FileUploadSimple</code>).
            </>,
            <>
              <strong>Archivo que se presenta o se elige fuera de una carga:</strong> el ítem es el archivo dentro de una carga, con su estado (también Complete, con Descargar y Eliminar). (Alternativa: <code>FileCard</code>).
            </>,
            <>
              <strong>Mensajes que cambian con cada porcentaje:</strong> cada cambio de <code>message</code> se anuncia. Actualiza <code>progress</code> y cambia el mensaje solo cuando cambia el estado.
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
                title: 'Con barra',
                bullets: [
                  <>
                    <strong>Padding:</strong> 24 px (<code>space/container/on-card</code>) y radio de 24 px. La tarjeta ocupa el ancho de su contenedor.
                  </>,
                  <>
                    <strong>Fila y barra:</strong> la fila mide 40 px de alto como mínimo y la barra suma 22 px, a 16 px de la fila.
                  </>,
                ],
                preview: loading(),
              },
              {
                title: 'Sin barra',
                bullets: [
                  <>
                    <strong>Fila sola:</strong> sin barra, el alto es el de la fila más el padding. Si el mensaje ocupa varias líneas, la fila crece.
                  </>,
                  <>
                    <strong>Nombre largo:</strong> el nombre se recorta a una línea y los botones conservan sus 32 px.
                  </>,
                ],
                preview: complete({ title: 'Informe trimestral de la reunión con el equipo de diseño.pdf' }),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Padding menor:</strong> baja de 24 a 16 px (<code>space/container/on-card</code>).
              </>,
              <>
                <strong>Mismas medidas:</strong> el radio de 24 px, el gap de 16 px entre la fila y la barra y los textos de 14 px no cambian.
              </>,
              <>
                <strong>Ancho:</strong> la tarjeta ocupa el ancho de la vista y el mensaje ajusta línea cuando no cabe.
              </>,
            ],
            preview: loading(),
          },
          tablet: {
            bullets: [
              <>
                <strong>Igual que Desktop:</strong> padding de 24 px (<code>space/container/on-card</code>).
              </>,
              <>
                <strong>Medidas:</strong> radio de 24 px, gap de 16 px, textos de 14 px y botones de 32 px.
              </>,
              <>
                <strong>Ancho:</strong> es fluido, sin ancho máximo.
              </>,
            ],
            preview: loading(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de mensajes, acciones y nombres del FileUploadItem.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Mensaje con motivo',
              description: 'Di qué pasó y qué hacer en el mensaje.',
              preview: failed({ message: 'Sin conexión, intenta de nuevo' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Mensaje sin dato',
              description: 'No dejes un mensaje que no explica el fallo.',
              preview: failed({ message: 'Error' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Fallo con salida',
              description: (
                <>
                  Pasa <code>onRetry</code> y <code>onDelete</code> en una carga fallida.
                </>
              ),
              preview: failed(),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Fallo sin salida',
              description: 'No dejes una carga fallida sin acciones.',
              preview: failed({ onRetry: undefined, onDelete: undefined }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Nombre con extensión',
              description: 'Usa nombres que quepan en una línea.',
              preview: complete({ title: 'Informe.pdf' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Nombre largo',
              description: 'No uses nombres largos: se recortan y pierden la extensión.',
              preview: complete({ title: 'Informe trimestral de la reunión con el equipo de diseño, versión final revisada.pdf' }),
            },
          ],
        },
      ],
    },
  ],
};
