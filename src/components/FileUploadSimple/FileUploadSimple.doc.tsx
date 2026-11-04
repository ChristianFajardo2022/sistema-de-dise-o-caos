import type { ComponentProps } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { FileUploadSimple } from './FileUploadSimple';

/*
 * Contenido de la página de documentación de FileUploadSimple (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el
 * código (`FileUploadSimple.tsx`, `FileUploadSimple.types.ts`, `FileUploadSimple.variants.ts`), luego
 * `FileUploadSimple.docs.json`. Medidas: raíz en columna de hasta 304 px con 8 px (`space/general/lg`) entre el
 * recuadro y el Alert; el recuadro es un FileDropzone con padding de 40 × 24 px, gap de 24 px y radio de 24 px. En
 * `idle` y `error` es el FileDropzone tal cual; en `uploading` y `loaded` es el mismo recuadro con contenido propio.
 * Sus medidas y tokens internos se documentan en la página de FileDropzone y aquí solo se resumen.
 * Diferencias con Figma: los dos sets se resumen en un solo `status` (Type y State) y el código añade `error`, el
 * arrastre, la validación y los anuncios. Figma pinta los tipos admitidos con `text/neutral/gray` y el código usa
 * `text/neutral/body`; en el estado cargado el tamaño del archivo va en regular y no en semibold.
 */

// Figma: 21407:3920 (component set File upload simple-2), 21412:4523 (component set File upload simple)

type SimpleProps = Partial<ComponentProps<typeof FileUploadSimple>>;

const MB = 1024 ** 2;

const FILE = { name: 'informe-trimestral.pdf', size: 100 * 1024 };

const FAILED = { type: 'error', title: 'No se pudo cargar', children: 'Intenta de nuevo con otro archivo.' } as const;
const DONE = { type: 'success', title: 'Carga completa', children: 'El archivo está listo.' } as const;

/** Carga de ejemplo con los tipos y el tamaño de muestra; el estado y los textos se pueden reemplazar. */
const upload = (props: SimpleProps = {}) => (
  <div className="w-[304px] max-w-full">
    <FileUploadSimple accept=".pdf,.jpg" maxSize={25 * MB} {...props} />
  </div>
);

const idle = (props: SimpleProps = {}) => upload({ status: 'idle', ...props });
const loaded = (props: SimpleProps = {}) => upload({ status: 'loaded', file: FILE, ...props });
const uploading = (props: SimpleProps = {}) => upload({ status: 'uploading', progress: 25, file: FILE, ...props });

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: (
      <>
        Reposo y sin archivo (<code>status=&quot;idle&quot;</code>). Es un FileDropzone: trazo punteado en <code>border/field/disabled</code>, sin relleno. En oscuro casi se funde con el panel.
      </>
    ),
    samples: [idle()],
  },
  {
    label: 'Hover',
    tone: 'accent',
    description: (
      <>
        Al pasar el puntero o al arrastrar un archivo encima. Suma el relleno y el trazo de acento, y el padding lateral baja de 24 a 16 px. Se fuerza con <code>state</code>.
      </>
    ),
    samples: [idle({ state: 'hover' }), loaded({ state: 'hover' })],
  },
  {
    label: 'Focus',
    tone: 'accent',
    description: (
      <>
        Al llegar con el teclado: el trazo toma el color de acento. Sin archivo, el input recibe el foco; con archivo, el enlace <em>volver a cargar</em>.
      </>
    ),
    samples: [idle({ state: 'focus' }), loaded({ state: 'focus' })],
  },
  {
    label: 'Upload',
    tone: 'neutral',
    description: (
      <>
        La carga está en curso (<code>status=&quot;uploading&quot;</code>). Los textos se apagan, el recuadro no reacciona y aparecen la barra de progreso y el botón eliminar.
      </>
    ),
    samples: [uploading(), uploading({ file: null })],
  },
  {
    label: 'Loaded',
    tone: 'success',
    description: (
      <>
        La carga terminó (<code>status=&quot;loaded&quot;</code>). Muestra el ícono de visto, el nombre del archivo, el enlace <em>volver a cargar</em> y su tamaño.
      </>
    ),
    samples: [loaded()],
  },
  {
    label: 'Inactive',
    tone: 'neutral',
    description: (
      <>
        Con <code>disabled</code>. Usa los tokens de inactivo, muestra el cursor <code>not-allowed</code> y no recibe archivos.
      </>
    ),
    samples: [idle({ disabled: true }), loaded({ disabled: true })],
  },
  {
    label: 'Error',
    tone: 'error',
    description: (
      <>
        Solo en código (<code>status=&quot;error&quot;</code>). Mantiene el aspecto de reposo y el motivo se muestra con <code>alert</code> bajo el recuadro.
      </>
    ),
    samples: [idle({ status: 'error', alert: FAILED })],
  },
];

export const doc: ComponentDocContent = {
  name: 'FileUploadSimple',
  icon: 'document-upload',
  classification: 'molecula',
  summary:
    'El FileUploadSimple es la molécula para cargar un solo archivo. Une un FileDropzone, una barra de progreso, un botón para eliminar y un mensaje opcional en un recuadro que cambia con el estado de la carga. No sube nada: recibe el archivo y muestra el avance que tú describes.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Un recuadro de trazo punteado que cambia de contenido según el estado y, debajo, un mensaje opcional.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Sin archivo',
                  preview: idle(),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Input file upload (Atom)"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Icon Right"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Heading"]', index: 0, side: 'left' },
                    { n: 4, selector: '[data-figma-part="Heading"]', index: 1, side: 'right' },
                    { n: 5, selector: '[data-figma-part="Specifications"]', side: 'left' },
                    { n: 6, selector: '[data-figma-part="Máx. 23 GB"]', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Input file upload (Atom)"]', side: 'top' },
                    { kind: 'padding', selector: '[data-figma-part="Input file upload (Atom)"]', side: 'left' },
                    { kind: 'gap', from: '[data-figma-part="Icon Right"]', to: '[data-figma-part="Frame 1984079840"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Recuadro:</strong> un <code>FileDropzone</code> con radio de 24 px (<code>radius/field/lg</code>), padding de 40 px arriba y abajo (<code>space/field/2xl</code>) y de 24 px a los lados (<code>space/field/xl</code>). Mide hasta 304 px de ancho y un mínimo de 234 px de alto.
                </>,
                <>
                  <strong>Ícono:</strong> <code>attach-circle</code> de línea, de 32 px, con 24 px hasta los textos.
                </>,
                <>
                  <strong>Título:</strong> es <code>title</code> y dice &quot;Selecciona tu&quot; por defecto. Regular de 16 px con interlineado de 20 px (<code>typography/field/size/md</code>).
                </>,
                <>
                  <strong>Acción:</strong> es <code>actionText</code> y dice &quot;archivo&quot; por defecto. Mismo tamaño que el título, en color de enlace y a 4 px de él (<code>space/general/md</code>).
                </>,
                <>
                  <strong>Tipos admitidos:</strong> salen de <code>accept</code> o se escriben con <code>formatsText</code>. Regular de 14 px con interlineado de 18 px (<code>typography/field/size/sm</code>).
                </>,
                <>
                  <strong>Tamaño máximo:</strong> sale de <code>maxSize</code> o se escribe con <code>sizeText</code>. Mismo tamaño que los tipos, en semibold y a 4 px de ellos.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Cargado, con mensaje',
                  preview: loaded({ alert: DONE }),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Input file upload (Atom)"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Icon Right"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Heading"]', index: 0, side: 'left' },
                    { n: 4, selector: '[data-figma-part="Heading"]', index: 1, side: 'right' },
                    { n: 5, selector: '[data-figma-part="Specifications"]', side: 'left' },
                    { n: 6, selector: '[data-figma-part="Alerts"]', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: '[data-figma-part="Input file upload (Atom)"]', to: '[data-figma-part="Alerts"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Recuadro:</strong> el mismo FileDropzone, ahora con contenido propio: conserva el trazo, el ícono y las medidas, pero ya no tiene título ni acción.
                </>,
                <>
                  <strong>Ícono:</strong> <code>tick-circle</code> relleno de 32 px, en <code>icon/general/gray-high-contrast</code>.
                </>,
                <>
                  <strong>Nombre del archivo:</strong> regular de 16 px, en una sola línea con puntos suspensivos si no cabe.
                </>,
                <>
                  <strong>Enlace:</strong> botón <em>volver a cargar</em> (<code>replaceText</code>) en <code>text/link/default</code>. Abre el selector.
                </>,
                <>
                  <strong>Tamaño del archivo:</strong> regular de 14 px, seguido del máximo permitido si existe.
                </>,
                <>
                  <strong>Mensaje:</strong> un <code>Alert</code> (<code>alert</code>) a ancho completo y a 8 px del recuadro (<code>space/general/lg</code>). Sin <code>alert</code> no se dibuja.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Cargando',
                  preview: uploading(),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Icon Right"]', index: 0, side: 'top' },
                    { n: 2, selector: '[data-figma-part="Heading"]', index: 0, side: 'left' },
                    { n: 3, selector: '[data-figma-part="Specifications"]', side: 'left' },
                    { n: 4, selector: '[role="progressbar"]', side: 'left' },
                    { n: 5, selector: 'button[aria-label^="Eliminar"]', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: '[data-figma-part="Container "]', to: '[data-figma-part="Frame 1984080604"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Ícono:</strong> <code>tick-circle</code> con archivo conocido y <code>attach-circle</code> sin él, de 32 px.
                </>,
                <>
                  <strong>Nombre del archivo:</strong> en <code>text/neutral/disabled-on-card</code>: apagado mientras dura la carga.
                </>,
                <>
                  <strong>Tamaño del archivo:</strong> en <code>text/field/disabled-positive</code>. El máximo permitido se oculta.
                </>,
                <>
                  <strong>Barra de progreso:</strong> un <code>ProgressBar</code> con el valor de <code>progress</code>, de 0 a 100, y con el archivo como nombre accesible.
                </>,
                <>
                  <strong>Botón eliminar:</strong> un <code>ButtonCorner</code> sm con el ícono <code>trash</code> en <code>icon/semantic/error-firts</code>. Cancela la carga y llama a <code>onRemove</code>.
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
          FileUploadSimple tiene 7 estados: 6 salen de los dos sets de Figma y Error solo existe en código. Hover y Focus se fuerzan con <code>state</code> solo para documentarlos: en uso real salen del puntero, del arrastre y del teclado.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default, con los de Hover, Cargando e Inactive donde cambian. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Sin archivo',
              preview: idle(),
              entries: [
                { part: 'Trazo punteado', color: 'border-field-disabled' },
                { part: 'Trazo punteado (Hover y Focus)', color: 'border-field-active' },
                { part: 'Relleno (Hover)', color: 'background-field-active-opacity-secondary' },
                { part: 'Ícono', color: 'icon-general-gray-high-contrast' },
                { part: 'Título', color: 'text-neutral-white', text: 'typography-field-size-md' },
                { part: 'Acción', color: 'text-link-default', text: 'typography-field-size-md' },
                { part: 'Tipos admitidos', color: 'text-neutral-body', text: 'typography-field-size-sm' },
                { part: 'Tamaño máximo', color: 'text-neutral-white', text: 'typography-field-size-sm' },
              ],
            },
            {
              title: 'Cargado',
              preview: loaded(),
              entries: [
                { part: 'Ícono', color: 'icon-general-gray-high-contrast' },
                { part: 'Nombre del archivo', color: 'text-neutral-white', text: 'typography-field-size-md' },
                { part: 'Enlace', color: 'text-link-default', text: 'typography-field-size-md' },
                { part: 'Tamaño del archivo', color: 'text-neutral-body', text: 'typography-field-size-sm' },
                { part: 'Tamaño máximo', color: 'text-neutral-white', text: 'typography-field-size-sm' },
              ],
            },
            {
              title: 'Cargando',
              preview: uploading(),
              entries: [
                { part: 'Nombre del archivo', color: 'text-neutral-disabled-on-card', text: 'typography-field-size-md' },
                { part: 'Enlace', color: 'text-link-inactive', text: 'typography-field-size-md' },
                { part: 'Tamaño del archivo', color: 'text-field-disabled-positive', text: 'typography-field-size-sm' },
                { part: 'Ícono eliminar', color: 'icon-semantic-error-firts' },
                { part: 'Pista de la barra', color: 'background-general-gray-sixth' },
              ],
            },
            {
              title: 'Inactive',
              preview: idle({ disabled: true }),
              entries: [
                { part: 'Ícono', color: 'icon-general-disabled-negative' },
                { part: 'Título y tamaño máximo', color: 'text-neutral-disabled-on-card' },
                { part: 'Acción', color: 'text-link-inactive' },
                { part: 'Tipos admitidos', color: 'text-field-disabled-positive' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente FileUploadSimple en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> hay dos sets en la librería de Assets: File upload simple-2, con las propiedades Type, State, Alert y los textos Format, Size, Title y Document, y File upload simple, con Type, State y Alert.
            </>,
            <>
              <strong>Type y State:</strong> en código se unen en <code>status</code>. Default es <code>idle</code>, Upload (o Uploading) es <code>uploading</code> y State Loaded es <code>loaded</code>. Hover, Focus e Inactive son <code>state=&quot;hover&quot;</code>, <code>state=&quot;focus&quot;</code> y <code>disabled</code>.
            </>,
            <>
              <strong>Format, Size, Title y Document:</strong> son textos. En código son <code>formatsText</code>, <code>sizeText</code>, <code>title</code> y <code>actionText</code>. Los dos primeros salen de <code>accept</code> y <code>maxSize</code> si no se pasan.
            </>,
            <>
              <strong>Alert:</strong> es <code>alert</code>, con las props de <code>Alert</code>. <code>status=&quot;error&quot;</code> solo existe en código: en Figma el error es un Alert bajo un recuadro en Default.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el FileUploadSimple es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Cargar un solo archivo con avance en el mismo recuadro:</strong> quien lo usa hace la carga y describe <code>status</code> y <code>progress</code>. El componente no sube ni guarda nada.
            </>,
            <>
              <strong>Dejar que el componente lleve el estado:</strong> sin <code>status</code>, elegir un archivo pasa a <code>loaded</code>. <code>onFileChange</code> recibe el archivo válido o <code>null</code> al eliminar.
            </>,
            <>
              <strong>Reemplazar el archivo cargado:</strong> <em>volver a cargar</em> abre el selector y soltar un archivo encima también. <code>onReplace</code> recibe el archivo nuevo.
            </>,
            <>
              <strong>Cancelar una carga:</strong> en <code>uploading</code> el botón eliminar llama a <code>onRemove</code>. Con <code>status</code> controlado, vuelve a <code>idle</code> desde ahí.
            </>,
            <>
              <strong>Teclado y lectores de pantalla:</strong> el input es nativo y la barra se anuncia con el nombre del archivo. El inicio y el final de la carga se anuncian en una región <code>aria-live</code>, y el foco pasa al control que sustituye al anterior.
            </>,
          ],
          avoid: [
            <>
              <strong>Varios archivos a la vez:</strong> el recuadro admite uno solo. (Alternativa: <code>FileUpload</code>).
            </>,
            <>
              <strong>Solo elegir o soltar archivos, sin avance:</strong> no hay barra ni nombre que mostrar. (Alternativa: <code>FileDropzone</code>).
            </>,
            <>
              <strong>Una tarjeta de archivo suelta, sin recuadro para soltar:</strong> por ejemplo, para listar un archivo ya cargado. (Alternativa: <code>FileUploadItem</code>).
            </>,
            <>
              <strong>Validar el contenido del archivo:</strong> el componente revisa nombre, tipo y tamaño. Haz esa comprobación en <code>onFileChange</code>.
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
                title: 'Sin archivo',
                bullets: [
                  <>
                    <strong>Ancho fluido:</strong> ocupa el del contenedor hasta 304 px y centra su contenido. El padding es de 40 × 24 px y el gap de 24 px.
                  </>,
                  <>
                    <strong>Textos:</strong> título de 16 px con interlineado de 20 px, tipos y tamaño de 14 px con 18 px. Entre el título y los tipos hay 4 px (<code>space/field/xs</code>).
                  </>,
                ],
                preview: idle(),
              },
              {
                title: 'Cargando',
                bullets: [
                  <>
                    <strong>Mismo recuadro:</strong> mantiene el alto mínimo de 234 px y suma la barra de 32 px de alto bajo los textos, a 24 px de ellos.
                  </>,
                  <>
                    <strong>Nombre largo:</strong> se corta con puntos suspensivos en una sola línea y el enlace <em>volver a cargar</em> sigue visible.
                  </>,
                ],
                preview: uploading({ file: { name: 'informe-trimestral-de-resultados-2026.pdf', size: 100 * 1024 } }),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Separación menor:</strong> entre el título y los tipos hay 2 px (<code>space/field/xs</code>), no 4 px.
              </>,
              <>
                <strong>Mismas medidas:</strong> el título sigue en 16 px con interlineado de 20 px, y los tipos y el tamaño en 14 px con 18 px. El padding de 40 × 24 px y el radio de 24 px no cambian.
              </>,
              <>
                <strong>Toque:</strong> el recuadro ocupa el ancho de la vista hasta 304 px y el toque abre el selector del dispositivo.
              </>,
            ],
            preview: idle(),
          },
          tablet: {
            bullets: [
              <>
                <strong>Igual que Desktop:</strong> entre el título y los tipos hay 4 px (<code>space/field/xs</code>).
              </>,
              <>
                <strong>Medidas:</strong> padding de 40 × 24 px, gap de 24 px, título de 16 px con interlineado de 20 px y tipos de 14 px con 18 px.
              </>,
              <>
                <strong>Ancho:</strong> es fluido hasta 304 px y los textos se centran dentro del recuadro.
              </>,
            ],
            preview: idle(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de límites, mensajes y control del estado del FileUploadSimple.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Límites visibles',
              description: (
                <>
                  Define <code>accept</code> y <code>maxSize</code>: salen dentro del recuadro.
                </>
              ),
              preview: idle(),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Recuadro sin límites',
              description: 'No omitas los límites: nadie sabe qué archivo admite el recuadro.',
              preview: idle({ accept: undefined, maxSize: undefined }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Error con motivo',
              description: (
                <>
                  Pasa <code>alert</code> con el motivo y cómo seguir.
                </>
              ),
              preview: idle({ status: 'error', alert: FAILED }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Error sin motivo',
              description: (
                <>
                  No dejes <code>status=&quot;error&quot;</code> sin <code>alert</code>: nada explica el fallo.
                </>
              ),
              preview: idle({ status: 'error' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Avance con valor',
              description: (
                <>
                  Actualiza <code>progress</code> mientras sube el archivo.
                </>
              ),
              preview: uploading({ progress: 60 }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Avance detenido',
              description: (
                <>
                  No dejes <code>progress</code> en 0 mientras la carga avanza.
                </>
              ),
              preview: uploading({ progress: 0 }),
            },
          ],
        },
      ],
    },
  ],
};
