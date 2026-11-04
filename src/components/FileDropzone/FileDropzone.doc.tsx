import type { ComponentProps } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Button } from '../Button';
import { FileDropzone } from './FileDropzone';

/*
 * Contenido de la página de documentación de FileDropzone (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`FileDropzone.types.ts`, `FileDropzone.variants.ts`, `FileDropzone.tsx`), luego `FileDropzone.docs.json`. Medidas:
 * columna centrada de ancho fluido (304 en Figma), padding 40 × 24 (24 × 16 en Hover, Focus y Disabled), gap de 24,
 * radio de 24 y trazo punteado 8/8. Diferencias con Figma: el texto de los tipos usa `text/neutral/body` en el código y
 * Figma enlaza `text/neutral/gray`; el gap de 24 es `gap/field/3xl` en Figma, que no existe en tokens.css (el código
 * usa `space/field/xl`, que vale lo mismo); el ícono del estado Default no tiene variable en Figma (color fijo) y el
 * código usa `icon/general/gray-high-contrast`; el valor `static` de `state`, el arrastre, la validación y la forma con
 * `children` no existen en Figma. FileUpload, que suma la lista de archivos, es un componente aparte.
 */

// Figma: 11438:5774 (component set Input file upload (Atom))

type DropzoneProps = Partial<ComponentProps<typeof FileDropzone>>;

const MB = 1024 ** 2;

/** Muestra con los tipos y el tamaño de ejemplo; los textos y límites se pueden reemplazar. */
const dropzone = (props: DropzoneProps = {}) => (
  <div className="w-[304px] max-w-full">
    <FileDropzone accept=".pdf,.jpg,.png" maxSize={25 * MB} {...props} />
  </div>
);

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: (
      <>
        Reposo: trazo punteado en <code>border/field/disabled</code> y sin relleno. En oscuro casi se funde con el panel. <code>state=&quot;static&quot;</code> lo fija igual, sin el cursor de acción.
      </>
    ),
    samples: [dropzone({ state: 'default' })],
  },
  {
    label: 'Hover',
    tone: 'accent',
    description: (
      <>
        Al pasar el puntero o al arrastrar un archivo encima. Suma el relleno <code>background/field/active-opacity-secondary</code> y el trazo <code>border/field/active</code>. El padding lateral baja de 24 a 16.
      </>
    ),
    samples: [dropzone({ state: 'hover' })],
  },
  {
    label: 'Focus',
    tone: 'accent',
    description: (
      <>
        Al llegar con el teclado: el input recibe el foco y la raíz toma el trazo de Hover, sin relleno, con un contorno de 2 px.
      </>
    ),
    samples: [dropzone({ state: 'focus' })],
  },
  {
    label: 'Disabled',
    tone: 'neutral',
    description: (
      <>
        Con <code>disabled</code>. Usa los tokens de inactivo, muestra el cursor <code>not-allowed</code> y no responde al clic ni al soltar archivos.
      </>
    ),
    samples: [dropzone({ state: 'disabled' })],
  },
];

export const doc: ComponentDocContent = {
  name: 'FileDropzone',
  icon: 'attach-circle',
  classification: 'atomo',
  summary:
    'El FileDropzone es el átomo para elegir o soltar archivos. Dibuja un recuadro de trazo punteado con ícono, un título con la acción en color de enlace, y los tipos y el tamaño admitidos. Valida cada archivo y avisa de los descartados; no guarda la lista.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Un recuadro de trazo punteado con el ícono y los textos en columna. Con contenido propio queda solo el recuadro.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Recuadro con textos',
                  preview: dropzone({ rootProps: { 'data-slot': 'dropzone' } }),
                  marks: [
                    { n: 1, selector: '[data-slot="dropzone"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Icon Right"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Heading"]', index: 0, side: 'left' },
                    { n: 4, selector: '[data-figma-part="Heading"]', index: 1, side: 'right' },
                    { n: 5, selector: '[data-figma-part="Specifications"]', side: 'left' },
                    { n: 6, selector: '[data-figma-part="Máx. 23 GB"]', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-slot="dropzone"]', side: 'top' },
                    { kind: 'padding', selector: '[data-slot="dropzone"]', side: 'left' },
                    { kind: 'gap', from: '[data-figma-part="Icon Right"]', to: '[data-figma-part="Frame 1984079840"]', axis: 'y' },
                    { kind: 'gap', from: '[data-figma-part="Frame 1984079840"]', to: '[data-figma-part="Info Group"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> columna centrada de ancho fluido (304 en Figma), con radio de 24 (<code>radius/field/lg</code>), padding de 40 arriba y abajo (<code>space/field/2xl</code>) y de 24 a los lados (<code>space/field/xl</code>). Entre el ícono y los textos hay 24. El trazo es punteado, de 1 px, con guion y espacio de 8, y lo dibuja un SVG decorativo.
                </>,
                <>
                  <strong>Ícono:</strong> <code>attach-circle</code> de línea, de 32 px, en <code>icon/general/gray-high-contrast</code>. Se reemplaza con <code>icon</code>.
                </>,
                <>
                  <strong>Título:</strong> Helvetica Neue regular de 16 con interlineado de 20 (<code>typography/field/size/md</code>), en <code>text/neutral/white</code>. Es <code>title</code> y dice &quot;Selecciona tu&quot; por defecto.
                </>,
                <>
                  <strong>Acción:</strong> mismo tamaño que el título, en <code>text/link/default</code> y a 4 de él (<code>space/general/md</code>). Es <code>actionText</code> y dice &quot;archivo&quot; por defecto.
                </>,
                <>
                  <strong>Tipos admitidos:</strong> Helvetica Neue regular de 14 con interlineado de 18 (<code>typography/field/size/sm</code>), en <code>text/neutral/body</code>. Sale de <code>accept</code> o se escribe con <code>specifications</code>. Sin ninguno, no se dibuja.
                </>,
                <>
                  <strong>Tamaño máximo:</strong> mismo tamaño, en semibold y <code>text/neutral/white</code>, a 4 de los tipos. Sale de <code>maxSize</code> o se escribe con <code>maxSizeLabel</code>. Sin ninguno, no se dibuja.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Con contenido propio',
                  preview: (
                    <div className="w-[304px] max-w-full">
                      <FileDropzone rootProps={{ 'data-slot': 'dropzone' }}>
                        <Button variant="secondary" size="sm">
                          Elegir archivo
                        </Button>
                      </FileDropzone>
                    </div>
                  ),
                  marks: [
                    { n: 1, selector: '[data-slot="dropzone"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Icon Right"]', side: 'top' },
                    { n: 3, selector: 'button', side: 'right' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Recuadro:</strong> con <code>children</code> la raíz pasa a <code>&lt;div&gt;</code>: queda el trazo, el ícono y los estados. No hay input ni región de avisos.
                </>,
                <>
                  <strong>Ícono:</strong> el mismo <code>attach-circle</code> de 32 px, centrado sobre el contenido.
                </>,
                <>
                  <strong>Contenido propio:</strong> reemplaza título, acción y límites. Quien lo usa aporta sus controles y el manejo de arrastre con <code>rootProps</code>.
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
          FileDropzone tiene 4 estados: Default, Hover, Focus y Disabled. Hover y Focus se fuerzan con <code>state</code> solo para documentarlos: en uso real salen del puntero, del arrastre y del teclado.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default, con los de Hover y Disabled donde cambian. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Recuadro',
              preview: dropzone(),
              entries: [
                { part: 'Trazo punteado', color: 'border-field-disabled' },
                { part: 'Trazo punteado (Hover y Focus)', color: 'border-field-active' },
                { part: 'Relleno (Hover)', color: 'background-field-active-opacity-secondary' },
                { part: 'Ícono', color: 'icon-general-gray-high-contrast' },
              ],
            },
            {
              title: 'Textos',
              preview: dropzone(),
              entries: [
                { part: 'Título', color: 'text-neutral-white', text: 'typography-field-size-md' },
                { part: 'Acción', color: 'text-link-default', text: 'typography-field-size-md' },
                { part: 'Tipos admitidos', color: 'text-neutral-body', text: 'typography-field-size-sm' },
                { part: 'Tamaño máximo', color: 'text-neutral-white', text: 'typography-field-size-sm' },
              ],
            },
            {
              title: 'Disabled',
              preview: dropzone({ state: 'disabled' }),
              entries: [
                { part: 'Trazo punteado', color: 'border-field-disabled' },
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
      title: 'Uso del componente FileDropzone en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Input file upload (Atom) en la librería de Assets. Sus propiedades son State, Tittle, Document, Format y Size.
            </>,
            <>
              <strong>State:</strong> Default, Hover, Focus y Disabled son los valores de <code>state</code> (<code>default</code>, <code>hover</code>, <code>focus</code> y <code>disabled</code>). El valor <code>static</code> solo existe en código: es Default sin el cursor de acción. Disabled también sale de <code>disabled</code>.
            </>,
            <>
              <strong>Tittle, Document, Format y Size:</strong> son textos. En código son <code>title</code>, <code>actionText</code>, <code>specifications</code> y <code>maxSizeLabel</code>. Las dos últimas salen de <code>accept</code> y <code>maxSize</code> si no se pasan.
            </>,
            <>
              <strong>Diferencias:</strong> Figma dibuja solo el recuadro. El código añade el arrastre, la validación (<code>accept</code>, <code>maxSize</code>, <code>multiple</code>), los avisos de archivos descartados, el ícono propio (<code>icon</code>) y el contenido propio (<code>children</code>). La lista de archivos es el componente FileUpload.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el FileDropzone es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Elegir o soltar archivos en un formulario:</strong> clic, Enter y Espacio abren el selector nativo, y también se pueden arrastrar archivos encima.
            </>,
            <>
              <strong>Limitar tipo o tamaño:</strong> <code>accept</code> y <code>maxSize</code> se validan al elegir y al soltar. Los descartados llegan a <code>onFilesRejected</code> con su motivo (<code>type</code>, <code>size</code> o <code>count</code>).
            </>,
            <>
              <strong>Admitir varios archivos:</strong> con <code>multiple</code>. Sin él se toma solo el primero y el resto se descarta.
            </>,
            <>
              <strong>Formularios accesibles:</strong> el input es real y se anuncia como &quot;Selecciona tu archivo&quot;, con los tipos y el tamaño como descripción. Los descartados se anuncian en una región <code>aria-live</code>.
            </>,
          ],
          avoid: [
            <>
              <strong>Mostrar los archivos ya cargados con su progreso:</strong> el FileDropzone no guarda ni lista archivos. (Alternativa: <code>FileUpload</code>).
            </>,
            <>
              <strong>Una sola acción de adjuntar, sin zona de soltar:</strong> un recuadro de 304 px pesa de más en una barra o un chat. (Alternativa: <code>Button</code>).
            </>,
            <>
              <strong>Validar el contenido del archivo:</strong> el componente revisa nombre, tipo y tamaño, no lo que hay dentro. Haz esa comprobación en <code>onFilesSelected</code>.
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
                title: 'Un archivo',
                bullets: [
                  <>
                    <strong>Ancho fluido:</strong> ocupa el del contenedor (304 en Figma) y centra su contenido. El padding es de 40 × 24 y el gap de 24.
                  </>,
                  <>
                    <strong>Textos:</strong> título de 16 con interlineado de 20, tipos y tamaño de 14 con 18. Entre el título y los tipos hay 4 (<code>space/field/xs</code>).
                  </>,
                ],
                preview: dropzone(),
              },
              {
                title: 'Textos largos',
                bullets: [
                  <>
                    <strong>Ajuste de línea:</strong> título, tipos y tamaño bajan de línea si no caben y se centran. El recuadro crece en alto.
                  </>,
                  <>
                    <strong>Separación:</strong> entre el título y la acción, y entre los tipos y el tamaño, hay 4 (<code>space/general/md</code>).
                  </>,
                ],
                preview: dropzone({ accept: 'image/*', multiple: true, title: 'Arrastra tus imágenes o', actionText: 'elígelas', specifications: 'Imágenes: JPG, PNG, WEBP y GIF.' }),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Separación menor:</strong> entre el título y los tipos hay 2 (<code>space/field/xs</code>), no 4.
              </>,
              <>
                <strong>Mismas medidas:</strong> el título sigue en 16 con interlineado de 20, y los tipos y el tamaño en 14 con 18. El padding de 40 × 24 y el radio de 24 no cambian.
              </>,
              <>
                <strong>Toque:</strong> el recuadro llena el ancho de la vista y el toque abre el selector del dispositivo. El arrastre queda para pantallas con puntero.
              </>,
            ],
            preview: dropzone(),
          },
          tablet: {
            bullets: [
              <>
                <strong>Igual que Desktop:</strong> entre el título y los tipos hay 4 (<code>space/field/xs</code>).
              </>,
              <>
                <strong>Medidas:</strong> padding de 40 × 24, gap de 24, título de 16 con interlineado de 20 y tipos de 14 con 18.
              </>,
              <>
                <strong>Ancho:</strong> es fluido y los textos se centran dentro del recuadro.
              </>,
            ],
            preview: dropzone(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de textos, límites y número de archivos del FileDropzone.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Acción descriptiva',
              description: 'Haz que la acción diga qué se elige.',
              preview: dropzone({ title: 'Selecciona tu', actionText: 'archivo' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Acción genérica',
              description: 'No uses aquí como texto de la acción.',
              preview: dropzone({ title: 'Haz clic', actionText: 'aquí' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Límites a la vista',
              description: 'Quien sube sabe qué se acepta antes de elegir el archivo.',
              preview: dropzone(),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Límites ocultos',
              description: 'Sin aviso previo, el rechazo llega después de elegir el archivo.',
              preview: dropzone({ accept: undefined, maxSize: undefined }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Texto en plural',
              description: 'Usa plural en los textos si admites varios archivos.',
              preview: dropzone({ multiple: true, title: 'Arrastra tus archivos o', actionText: 'elígelos' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Texto en singular',
              description: 'El texto sugiere un solo archivo y el recuadro admite varios.',
              preview: dropzone({ multiple: true, title: 'Selecciona tu', actionText: 'archivo' }),
            },
          ],
        },
      ],
    },
  ],
};
