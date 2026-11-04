import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { FileUpload } from './FileUpload';
import type { FileUploadEntry } from './FileUpload.types';

/*
 * Contenido de la página de documentación de FileUpload (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`FileUpload.tsx`, `FileUpload.types.ts`, `FileUpload.variants.ts`), luego `FileUpload.docs.json`. Medidas: raíz en
 * columna a ancho completo con 16 px entre el área para soltar y la lista (`space/general/2xl`) y 8 px entre archivos
 * (`space/general/lg`). El área es un FileDropzone y cada archivo un FileUploadItem: sus medidas y tokens internos se
 * documentan en su página y aquí solo se resumen.
 * Diferencias con Figma: el set solo dibuja una variante (File card activado); el código añade la lista nombrada, las
 * acciones por `id` y el regreso del foco al área. Figma pinta las especificaciones del área con `text/neutral/gray` y
 * el código usa `text/neutral/body`.
 */

// Figma: 11592:8647 (component set File upload (suelto))

type UploadProps = Partial<ComponentProps<typeof FileUpload>>;

const noop = () => {};

const MAX_SIZE = 25 * 1024 ** 2;

const entry = (id: string, name: string, status: FileUploadEntry['status'], extra: Partial<FileUploadEntry> = {}): FileUploadEntry => ({
  id,
  name,
  status,
  ...extra,
});

const report = (status: FileUploadEntry['status'] = 'loading', extra: Partial<FileUploadEntry> = {}) =>
  entry('1', 'informe-trimestral.pdf', status, extra);

/** Carga de ejemplo: área con tipos y tamaño, lista con los archivos que se pasen y todas las acciones. */
const upload = (items: FileUploadEntry[] = [], props: UploadProps = {}) => (
  <FileUpload
    accept=".pdf,.jpg"
    maxSize={MAX_SIZE}
    items={items}
    onRemove={noop}
    onRetry={noop}
    onDownload={noop}
    {...props}
  />
);

/** Varias cargas en una fila de muestras. */
const row = (...items: ReactNode[]) => (
  <div className="flex flex-col gap-ds-space-general-2xl">
    {items.map((item, i) => (
      <Fragment key={i}>{item}</Fragment>
    ))}
  </div>
);

const states: DocStateItem[] = [
  {
    label: 'Sin archivos',
    tone: 'neutral',
    description: (
      <>
        Con <code>items</code> vacío solo se dibuja el área para soltar. En Figma es la prop File card desactivada.
      </>
    ),
    samples: [upload([])],
  },
  {
    label: 'Loading',
    tone: 'neutral',
    description: (
      <>
        El archivo sube. La tarjeta muestra la barra de progreso y la acción Eliminar. El texto de estado va en verde (<code>text/semantic/success-secondary</code>) porque la carga avanza; no es un error.
      </>
    ),
    samples: [upload([report('loading', { progress: 40 })])],
  },
  {
    label: 'Complete',
    tone: 'success',
    description: 'La carga terminó. Aparecen Descargar y Eliminar.',
    samples: [upload([report('complete')])],
  },
  {
    label: 'Error',
    tone: 'error',
    description: 'El archivo tiene un error. Aparecen Descargar y Eliminar.',
    samples: [upload([report('error')])],
  },
  {
    label: 'Loading error',
    tone: 'error',
    description: 'La carga falló. Aparecen Reintentar y Eliminar.',
    samples: [upload([report('loading-error')])],
  },
  {
    label: 'Alert',
    tone: 'alert',
    description: 'La carga avisa de un problema y sigue con barra. Aparecen Reintentar y Eliminar.',
    samples: [upload([report('alert', { progress: 70, message: 'Faltan datos' })])],
  },
  {
    label: 'Disabled',
    tone: 'neutral',
    description: (
      <>
        Con <code>disabled</code> el área no recibe archivos. La lista y sus acciones siguen activas.
      </>
    ),
    samples: [upload([report('complete')], { disabled: true })],
  },
];

const twoFiles = [report('complete'), entry('2', 'foto-perfil.png', 'loading', { progress: 60 })];

export const doc: ComponentDocContent = {
  name: 'FileUpload',
  icon: 'document-upload',
  classification: 'composicion',
  summary:
    'El FileUpload es la composición para cargar archivos. Une un FileDropzone y, debajo, una lista con un FileUploadItem por archivo. No sube nada: recibe los archivos y muestra el avance que tú describes. Aporta la lista nombrada, las acciones por id y el foco al eliminar.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una columna con el área para soltar arriba y, debajo, la lista de archivos.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Con archivos',
                  preview: upload(twoFiles),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Input file upload (Atom)"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Container"]', side: 'left' },
                    { n: 3, selector: '[data-figma-part="File card"]', index: 0, side: 'right' },
                    { n: 4, selector: '[role="progressbar"]', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: '[data-figma-part="Input file upload (Atom)"]', to: '[data-figma-part="Container"]', axis: 'y' },
                    { kind: 'gap', from: '[data-figma-part="File card"]', fromIndex: 0, to: '[data-figma-part="File card"]', toIndex: 1, axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Área para soltar:</strong> un <code>FileDropzone</code> a ancho completo, con trazo punteado, ícono de 32 px, título, acción y los tipos y el tamaño máximo. Sus medidas están en su propia página.
                </>,
                <>
                  <strong>Lista:</strong> una <code>ul</code> con nombre (<code>listLabel</code>) a 16 px del área (<code>space/general/2xl</code>). Solo se dibuja si <code>items</code> tiene archivos. Las tarjetas van separadas 8 px (<code>space/general/lg</code>).
                </>,
                <>
                  <strong>Archivo:</strong> un <code>li</code> con un <code>FileUploadItem</code> a ancho completo: ícono de estado, nombre, texto de estado y acciones. Padding de 24 px y radio de 24 px. En modo claro el fondo (<code>background/container/default-on-card</code>) casi se funde con el panel y no se aprecian el padding ni el radio.
                </>,
                <>
                  <strong>Barra de progreso:</strong> aparece en <code>loading</code> y <code>alert</code>, con el valor de <code>progress</code> de 0 a 100.
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
          FileUpload tiene 7 estados y no fuerza Hover, Focus ni Press: el área responde al puntero, al foco y al arrastre como el FileDropzone. Los estados son los de la lista (<code>status</code> de cada archivo), el vacío y <code>disabled</code>.
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
              title: 'Área para soltar',
              preview: upload([]),
              entries: [
                { part: 'Trazo punteado', color: 'border-field-disabled' },
                { part: 'Ícono', color: 'icon-general-gray-high-contrast' },
                { part: 'Título', color: 'text-neutral-white', text: 'typography-field-size-md' },
                { part: 'Acción', color: 'text-link-default', text: 'typography-field-size-md' },
                { part: 'Tipos admitidos', color: 'text-neutral-body', text: 'typography-field-size-sm' },
                { part: 'Tamaño máximo', color: 'text-neutral-white', text: 'typography-field-size-sm' },
              ],
            },
            {
              title: 'Archivo en carga',
              preview: upload([report('loading', { progress: 40 })]),
              entries: [
                { part: 'Fondo de la tarjeta', color: 'background-container-default-on-card' },
                { part: 'Nombre', color: 'text-neutral-heading', text: 'primitives-typography-size-md' },
                { part: 'Texto de estado', color: 'text-semantic-success-secondary', text: 'typography-body-size-md' },
                { part: 'Progreso', color: 'background-semantic-success-tertiary' },
                { part: 'Pista de la barra', color: 'background-general-gray-sixth' },
              ],
            },
            {
              title: 'Archivo con error',
              preview: upload([report('loading-error')]),
              entries: [
                { part: 'Ícono de estado', color: 'icon-semantic-error-firts' },
                { part: 'Texto de estado', color: 'text-semantic-error-secondary', text: 'typography-body-size-md' },
              ],
            },
            {
              title: 'Archivo con advertencia',
              preview: upload([report('alert', { progress: 70, message: 'Faltan datos' })]),
              entries: [
                { part: 'Ícono de estado', color: 'icon-semantic-alert-firts' },
                { part: 'Texto de estado', color: 'text-semantic-alert-secondary', text: 'typography-body-size-md' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente FileUpload en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como File upload (suelto) en la librería de Assets. Tiene una sola variante, File upload complex, con la prop File card y el slot Container.
            </>,
            <>
              <strong>File card:</strong> muestra u oculta la lista. En código la lista aparece sola cuando <code>items</code> tiene al menos un archivo.
            </>,
            <>
              <strong>Container:</strong> es el slot que recibe las tarjetas. En código lo llenas con <code>items</code>: un <code>FileUploadItem</code> por archivo, con los estados Loading, Complete, Error, Loading error y Alert.
            </>,
            <>
              <strong>Diferencias:</strong> el área es la instancia Input file upload (Atom), que en código es <code>FileDropzone</code>; sus estados Default, Hover, Focus y Disabled se documentan en esa página. Figma no dibuja la lista nombrada, las acciones por <code>id</code> ni el regreso del foco.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el FileUpload es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Varios archivos con avance:</strong> quien lo usa hace la carga y describe <code>status</code> y <code>progress</code> en <code>items</code>. El componente no sube ni guarda nada.
            </>,
            <>
              <strong>Tipos y tamaño limitados:</strong> <code>accept</code> y <code>maxSize</code> filtran al elegir y al soltar. Los archivos descartados llegan en <code>onFilesRejected</code>.
            </>,
            <>
              <strong>Acciones por archivo:</strong> <code>onRemove</code>, <code>onRetry</code> y <code>onDownload</code> reciben el <code>id</code>. Sin el manejador no se dibuja el botón.
            </>,
            <>
              <strong>Teclado y lectores de pantalla:</strong> la lista es una <code>ul</code> con nombre (<code>listLabel</code>) y, al eliminar un archivo, el foco vuelve al área. Con <code>disabled</code> pasa a la lista.
            </>,
          ],
          avoid: [
            <>
              <strong>Solo elegir archivos, sin lista de avance:</strong> la lista no hace falta. (Alternativa: <code>FileDropzone</code>).
            </>,
            <>
              <strong>Un solo archivo que ocupa el recuadro:</strong> el avance se muestra dentro del área. (Alternativa: <code>FileUploadSimple</code>).
            </>,
            <>
              <strong>Una tarjeta suelta, sin área para soltar:</strong> por ejemplo, para mostrar un archivo ya cargado. (Alternativa: <code>FileUploadItem</code>).
            </>,
            <>
              <strong>Lista de documentos sin carga:</strong> no hay avance ni reintentos que mostrar. (Alternativa: <code>ListItem</code>).
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
                title: 'Área para soltar',
                bullets: [
                  <>
                    <strong>Un solo cambio:</strong> el espacio entre el título y los tipos admitidos mide 4 px (<code>space/field/xs</code>) en Desktop y Tablet, y 2 px en Mobile.
                  </>,
                  <>
                    <strong>Padding de 40 px</strong> arriba y abajo y de 24 a los lados, con ícono de 32 px, título de 16/20 y tipos de 14/18. Es igual en los tres breakpoints.
                  </>,
                ],
                preview: upload([]),
              },
              {
                title: 'Lista',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Tarjetas de 108 px</strong> con barra y de 70 px sin ella, con 24 px de padding y 8 px entre archivos.
                  </>,
                ],
                preview: upload([report('loading', { progress: 40 })]),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Cambio en el área:</strong> el espacio entre el título y los tipos admitidos baja de 4 a 2 px (<code>space/field/xs</code>). La lista mantiene sus medidas.
              </>,
              <>
                <strong>Ancho:</strong> el área y la lista ocupan el ancho disponible, con 16 px entre ellas.
              </>,
              <>
                <strong>Nombres largos:</strong> el nombre del archivo se corta con puntos suspensivos y las acciones siguen visibles.
              </>,
            ],
            preview: upload([report('loading', { progress: 40 })]),
          },
          tablet: {
            bullets: [
              <>
                <strong>Como Desktop:</strong> el espacio entre el título y los tipos admitidos mide 4 px (<code>space/field/xs</code>); solo Mobile lo baja a 2 px.
              </>,
              <>
                <strong>Ancho:</strong> el área y la lista ocupan el ancho disponible, con 16 px entre ellas.
              </>,
              <>
                <strong>Nombres largos:</strong> el nombre del archivo se corta con puntos suspensivos y las acciones siguen visibles.
              </>,
            ],
            preview: upload([report('loading', { progress: 40 })]),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de límites, errores y estructura del FileUpload.',
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
                  Define <code>accept</code> y <code>maxSize</code>: salen bajo el área.
                </>
              ),
              preview: upload([]),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Área sin límites',
              description: 'No omitas los límites: nadie sabe qué archivos admite el área.',
              preview: upload([], { accept: undefined, maxSize: undefined }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Error con reintento',
              description: (
                <>
                  Pasa <code>onRetry</code> para ofrecer Reintentar en la carga fallida.
                </>
              ),
              preview: upload([report('loading-error')]),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Error sin salida',
              description: (
                <>
                  No dejes un error de carga sin <code>onRetry</code>: solo queda eliminar.
                </>
              ),
              preview: upload([report('loading-error')], { onRetry: undefined }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Una sola área',
              description: 'Reúne todos los archivos en una lista bajo la misma área.',
              preview: upload(twoFiles),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Un área por archivo',
              description: 'No repitas el componente por cada archivo.',
              preview: row(upload([twoFiles[0]]), upload([twoFiles[1]])),
            },
          ],
        },
      ],
    },
  ],
};
