import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { FileCard } from './FileCard';

/*
 * Contenido de la página de documentación de FileCard (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`FileCard.types.ts`, `FileCard.variants.ts`, `FileCard.tsx`), luego `FileCard.docs.json`. Las medidas son las de los
 * tokens: Desktop y Tablet comparten valores; Mobile baja los espacios responsive (`space/container/on-card`
 * 24 → 16, `space/general/3xl` 24 → 20, `space/general/5xl` 40 → 32, `space/general/6xl` 56 → 40) y el Avatar
 * de 48 → 40.
 * Diferencias con Figma: el set de la miniatura solo dibuja Type Icon; el código lo expone como `type="thumbnail"`.
 * Figma pinta el fondo del Avatar con `background/icon/default-on-canva` y el código usa `default-on-card`.
 * El tercer set llamado File card (State Charging, Complete, Error, Charging error, Alert) es `FileUploadItem`.
 */

// Figma: 14043:59452 (component set File card, Photo e Icon), 15005:15958 (component set File card, miniatura)

type CardProps = Partial<ComponentProps<typeof FileCard>>;

const noop = () => {};
const DESC = 'Tamaño de archivo: 1,2 MB';
const LONG_TITLE = 'Informe trimestral de la reunión con el equipo de diseño, versión final revisada.pdf';

/**
 * La superficie de la tarjeta (`background/container/default-on-card`) casi se funde con el lienzo de la plantilla:
 * las muestras van sobre la superficie del tema (`background/general/black`), como en las historias.
 */
const onSurface = (node: ReactNode) => (
  <div className="rounded-ds-radius-container-on-card bg-ds-background-general-black p-ds-space-general-2xl">{node}</div>
);

/** Photo a su ancho de diseño (344 px) con el botón de más opciones. */
const photo = (props: CardProps = {}) =>
  onSurface(
    <div className="w-[344px]">
      <FileCard data-slot="file-card" type="photo" title="Portada.png" description={DESC} onMoreClick={noop} {...props} />
    </div>
  );

/** Icon a su ancho de diseño (402 px) con Checkbox. */
const icon = (props: CardProps = {}) =>
  onSurface(
    <div className="w-[402px]">
      <FileCard data-slot="file-card" type="icon" title="Informe.pdf" description={DESC} selection="checkbox" {...props} />
    </div>
  );

/** Icon que ocupa el ancho disponible (vistas de breakpoint y Do and Dont’s). */
const iconFluid = (props: CardProps = {}) => (
  <FileCard data-slot="file-card" type="icon" title="Informe.pdf" description={DESC} selection="checkbox" {...props} />
);

/** Miniatura de 160 × 160 px con selección y acciones. */
const thumb = (props: CardProps = {}) =>
  onSurface(
    <FileCard
      data-slot="file-card"
      type="thumbnail"
      title="Foto 01.jpg"
      selection="checkbox"
      onDownload={noop}
      onDelete={noop}
      {...props}
    />
  );

/** Varias muestras en columna. */
const stack = (...items: ReactNode[]) => (
  <div className="flex w-full flex-col gap-ds-space-general-2xl">
    {items.map((item, i) => (
      <Fragment key={i}>{item}</Fragment>
    ))}
  </div>
);

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: (
      <>
        Reposo. La superficie usa <code>background/container/default-on-card</code> y el Button corner, el mismo relleno.
      </>
    ),
    samples: [photo(), icon(), thumb()],
  },
  {
    label: 'Hover',
    tone: 'accent',
    description:
      'Al pasar el puntero. La superficie y el Button corner cambian a sus colores de hover. En la miniatura aparecen Descargar y Eliminar.',
    samples: [photo({ state: 'hover' }), icon({ state: 'hover' }), thumb({ state: 'hover' })],
  },
  {
    label: 'Select',
    tone: 'accent',
    description: (
      <>
        Con el control de selección marcado. La superficie pasa a <code>background/container/select-on-card</code> (<code>select-on-canva</code> en la miniatura).
      </>
    ),
    samples: [photo({ state: 'select', selection: 'checkbox', defaultChecked: true }), icon({ state: 'select', defaultChecked: true }), thumb({ state: 'select', defaultChecked: true })],
  },
  {
    label: 'Disabled',
    tone: 'neutral',
    description: (
      <>
        Con <code>disabled</code> el control de selección no recibe foco ni clic. La superficie no cambia.
      </>
    ),
    samples: [icon({ disabled: true }), thumb({ disabled: true })],
  },
];

export const doc: ComponentDocContent = {
  name: 'FileCard',
  icon: 'document',
  classification: 'molecula',
  summary:
    'FileCard es la molécula para presentar un archivo como tarjeta: ícono o foto, nombre y metadatos. Une un Avatar, un control de selección o de más opciones y, en miniatura, las acciones Descargar y Eliminar. La tarjeta no se activa sola: lo hacen sus controles.',
  definition: [
    {
      title: 'Anatomía',
      description:
        'La tarjeta apila el lienzo o el ícono y el texto, con un Button corner en la muesca de la esquina superior derecha. En la miniatura el texto no se ve.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Photo',
                  preview: photo(),
                  marks: [
                    { n: 1, selector: '[data-slot="file-card"]', side: 'top' },
                    { n: 2, selector: '[data-figma-part="canva"]', side: 'left' },
                    { n: 3, selector: 'button[aria-label^="Más opciones"]', side: 'right' },
                    { n: 4, selector: '[data-figma-part="Filename"]', side: 'left' },
                    { n: 5, selector: '[data-figma-part="Status"]', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[data-figma-part="canva"]' },
                    { kind: 'padding', selector: '[data-figma-part="Text"]', side: 'left' },
                    { kind: 'gap', from: '[data-figma-part="Filename"]', to: '[data-figma-part="Status"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> ocupa el ancho disponible (344 px en Figma) con radio de 24 px en tres esquinas; la cuarta es la muesca. La sombra <code>effect/shadow sm</code> es transparente en modo oscuro.
                </>,
                <>
                  <strong>Lienzo:</strong> 160 px de alto, con <code>background/container/default-on-card</code> y trazo <code>border/general/default-on-card</code>. Con <code>src</code> muestra la foto; sin ella, un Avatar de ícono centrado.
                </>,
                <>
                  <strong>Button corner:</strong> botón de más opciones (<code>ButtonCorner</code> md de 40 px, con muesca de 48 px). Aparece con <code>onMoreClick</code>. Con <code>selection</code> lo reemplaza un control de selección.
                </>,
                <>
                  <strong>Título:</strong> tipografía secundaria semibold de 12/16 con <code>text/neutral/heading</code>, en una línea y recortado con puntos suspensivos.
                </>,
                <>
                  <strong>Metadatos:</strong> tipografía primaria regular de 14/18 con <code>text/neutral/gray</code>. El bloque de texto lleva padding de 40 px arriba y 16 px a los lados y abajo (<code>space/general/5xl</code> y <code>space/general/2xl</code>), con 8 px entre título y metadatos (<code>space/general/lg</code>).
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Icon',
                  preview: icon(),
                  marks: [
                    { n: 1, selector: '[data-slot="file-card"]', side: 'top' },
                    { n: 2, selector: '[data-slot="file-card"] > span[aria-hidden="true"]:not([data-figma-part])', side: 'left' },
                    { n: 3, selector: '[data-figma-part="Filename"]', side: 'right' },
                    { n: 4, selector: '[data-figma-part="Status"]', side: 'bottom' },
                    { n: 5, selector: '[data-figma-part="Button corner "]', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-slot="file-card"]', side: 'left' },
                    { kind: 'gap', from: '[data-slot="file-card"] > span[aria-hidden="true"]:not([data-figma-part])', to: '[data-figma-part="Filename"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> ocupa el ancho disponible (402 px en Figma). Padding de 24 px (<code>space/container/on-card</code>), 24 px entre el Avatar y el texto (<code>space/general/3xl</code>) y radio de 24 px, con una muesca de 40 px para el Button corner.
                </>,
                <>
                  <strong>Avatar:</strong> <code>Avatar</code> de ícono de 48 px, arriba a la izquierda. Por defecto dibuja <code>folder</code>; <code>icon</code> cambia el ícono.
                </>,
                <>
                  <strong>Título:</strong> igual que en Photo.
                </>,
                <>
                  <strong>Metadatos:</strong> igual que en Photo. El contenido de <code>children</code> va debajo.
                </>,
                <>
                  <strong>Button corner:</strong> <code>ButtonCorner</code> sm de 32 px. Con <code>selection</code> contiene un <code>Checkbox</code> o un <code>Radio</code> reales que cubren todo el círculo.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Thumbnail',
                  preview: thumb(),
                  marks: [
                    { n: 1, selector: '[data-slot="file-card"]', side: 'top' },
                    { n: 2, selector: '[data-slot="file-card"] > span[aria-hidden="true"]:not([data-figma-part])', side: 'bottom' },
                    { n: 3, selector: '[data-figma-part="Button corner "]', side: 'right' },
                  ],
                  dimensions: [{ kind: 'height', selector: '[data-slot="file-card"]' }],
                },
                {
                  label: 'Thumbnail con acciones',
                  preview: thumb({ state: 'hover' }),
                  marks: [
                    { n: 4, selector: '[data-figma-part="Backdrop"]', side: 'left' },
                    { n: 5, selector: 'button[aria-label^="Descargar"]', side: 'top' },
                    { n: 6, selector: 'button[aria-label^="Eliminar"]', side: 'bottom' },
                  ],
                  dimensions: [{ kind: 'gap', from: 'button[aria-label^="Descargar"]', to: 'button[aria-label^="Eliminar"]' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> 160 × 160 px fijos, con padding de 56 px arriba y abajo (<code>space/general/6xl</code>) y de 24 px a los lados (<code>space/container/on-card</code>). Radio de 24 px y muesca de 40 px. El título no se ve: queda como texto para lectores de pantalla.
                </>,
                <>
                  <strong>Avatar:</strong> <code>Avatar</code> de ícono de 32 px, centrado. Con <code>src</code> se reemplaza por la foto, que cubre toda la tarjeta.
                </>,
                <>
                  <strong>Button corner:</strong> de 34 px, con trazo interior <code>border/general/default-on-canva</code>. Contiene el control de selección; no hay botón de más opciones.
                </>,
                <>
                  <strong>Backdrop:</strong> capa <code>background/effect/backdrop</code> con la misma silueta. Aparece con hover, con foco dentro y en pantallas sin hover.
                </>,
                <>
                  <strong>Descargar:</strong> <code>Button</code> primary xs de solo ícono, con ícono de 16 px y 8 px de separación con Eliminar (<code>space/general/lg</code>). Aparece con <code>onDownload</code>.
                </>,
                <>
                  <strong>Eliminar:</strong> <code>Button</code> primary xs de solo ícono con <code>state=&quot;delete&quot;</code>. Aparece con <code>onDelete</code>.
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
          FileCard tiene 4 estados. Default, Hover y Select son del set de Figma; Disabled sale del código. Hover y Select se fuerzan con <code>state</code> solo para documentar: en uso real salen del puntero y del control marcado. La tarjeta no recibe el foco: lo recibe cada control, con su propio anillo, y en la miniatura el foco dentro muestra las acciones igual que Hover.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default, más el fondo de Hover y Select. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Photo',
              preview: photo(),
              entries: [
                { part: 'Fondo del lienzo y del texto', color: 'background-container-default-on-card' },
                { part: 'Fondo (Hover)', color: 'background-container-hover-on-card' },
                { part: 'Fondo (Select)', color: 'background-container-select-on-card' },
                { part: 'Trazo del lienzo', color: 'border-general-default-on-card' },
                { part: 'Avatar', color: 'background-icon-default-on-card' },
                { part: 'Título', color: 'text-neutral-heading', text: 'typography-heading-size-xs' },
                { part: 'Metadatos', color: 'text-neutral-gray', text: 'primitives-typography-size-md' },
              ],
            },
            {
              title: 'Icon',
              preview: icon(),
              entries: [
                { part: 'Fondo', color: 'background-container-default-on-card' },
                { part: 'Fondo (Hover)', color: 'background-container-hover-on-card' },
                { part: 'Fondo (Select)', color: 'background-container-select-on-card' },
                { part: 'Trazo (aparece en Hover y Select)', color: 'border-general-default-on-canva' },
                { part: 'Avatar', color: 'background-icon-default-on-card' },
                { part: 'Avatar (Hover)', color: 'background-icon-default-on-canva' },
              ],
            },
            {
              title: 'Thumbnail',
              preview: thumb({ state: 'hover' }),
              entries: [
                { part: 'Fondo', color: 'background-container-default-on-card' },
                { part: 'Fondo (Hover)', color: 'background-container-hover-on-card' },
                { part: 'Fondo (Select)', color: 'background-container-select-on-canva' },
                { part: 'Trazo (aparece en Hover)', color: 'border-general-default-on-canva' },
                { part: 'Backdrop (aparece en Hover)', color: 'background-effect-backdrop' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente FileCard en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como File card en la página Card de la librería de Assets. Un set tiene Type (Photo, Icon) y State (Default, Hover, Select); el otro es la miniatura, con Type Icon y los mismos State. Un tercer set con el mismo nombre (State Charging, Complete, Error, Charging error, Alert) es la tarjeta de carga: en código es <code>FileUploadItem</code>.
            </>,
            <>
              <strong>Type y State:</strong> Photo e Icon son <code>type=&quot;photo&quot;</code> y <code>type=&quot;icon&quot;</code>; la miniatura es <code>type=&quot;thumbnail&quot;</code>. State equivale a <code>state</code> (<code>default</code>, <code>hover</code>, <code>select</code>), que solo fuerza el aspecto.
            </>,
            <>
              <strong>Button corner, Select y Radio button:</strong> en código se resumen en <code>selection</code> (<code>checkbox</code> o <code>radio</code>) y <code>onMoreClick</code>. Con <code>selection</code> no se dibuja el botón de más opciones. Title text y Tittle son <code>title</code>; Description, <code>description</code>.
            </>,
            <>
              <strong>Diferencias:</strong> los slots y capas ocultas de Figma (List, Box text, Tag y similares) son <code>children</code>. Figma no dibuja Focus ni Disabled; el código sí.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo FileCard es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Presentar un archivo existente:</strong> muestra su nombre, sus metadatos y una vista previa, sea un documento, una imagen o un audio que solo se presenta sin reproducirlo.
            </>,
            <>
              <strong>Elegir archivos:</strong> con <code>selection=&quot;checkbox&quot;</code> se eligen varios; con <code>selection=&quot;radio&quot;</code> y el mismo <code>name</code>, uno solo. El control es un input real con el título como nombre accesible.
            </>,
            <>
              <strong>Galería de imágenes:</strong> usa <code>type=&quot;thumbnail&quot;</code> con <code>src</code> y las acciones <code>onDownload</code> y <code>onDelete</code>, que aparecen con hover, con foco dentro y en pantallas táctiles.
            </>,
            <>
              <strong>Más opciones por archivo:</strong> pasa <code>onMoreClick</code> en Photo o Icon, sin <code>selection</code>. Para un menú, suma <code>aria-expanded</code> y <code>aria-controls</code> en <code>moreButtonProps</code>.
            </>,
          ],
          avoid: [
            <>
              <strong>Archivo que se está subiendo:</strong> la tarjeta no tiene progreso ni reintento. (Alternativa: <code>FileUploadItem</code>, o <code>FileUpload</code> para el área y la lista completas).
            </>,
            <>
              <strong>Tarjeta entera seleccionable:</strong> en FileCard solo responde el control de la esquina. (Alternativa: <code>InteractiveCard</code>).
            </>,
            <>
              <strong>Abrir o navegar al tocar la tarjeta:</strong> FileCard no navega y <code>InteractiveCard</code> tampoco. (Alternativa: un enlace en el título como en <code>ChatCard</code> con <code>href</code>, o <code>ButtonLink</code> para la acción).
            </>,
            <>
              <strong>Audio con duración y reproducción:</strong> FileCard no reproduce. (Alternativa: <code>ChatAudioPlayer</code>).
            </>,
            <>
              <strong>Contenido que no es un archivo:</strong> un contacto, una cifra o una función destacada tienen su propia tarjeta. (Alternativa: <code>ContactCard</code>, <code>DataCard</code> o <code>FeatureCard</code>).
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
                title: 'Photo e Icon',
                bullets: [
                  <>
                    <strong>Icon:</strong> padding de 24 px (<code>space/container/on-card</code>), 24 px entre el Avatar y el texto (<code>space/general/3xl</code>) y Avatar de 48 px.
                  </>,
                  <>
                    <strong>Photo:</strong> el texto lleva 40 px de padding arriba (<code>space/general/5xl</code>) y 16 px en los demás lados.
                  </>,
                ],
                preview: iconFluid(),
              },
              {
                title: 'Thumbnail',
                bullets: [
                  <>
                    <strong>160 × 160 px</strong> en todos los breakpoints, con 56 px de padding arriba y abajo (<code>space/general/6xl</code>) y 24 px a los lados.
                  </>,
                  <>
                    <strong>Acciones:</strong> aparecen con hover y con foco dentro; en pantallas táctiles quedan visibles.
                  </>,
                ],
                preview: thumb(),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Icon:</strong> el padding baja de 24 a 16 px, la separación entre Avatar y texto de 24 a 20 px y el Avatar de 48 a 40 px.
              </>,
              <>
                <strong>Photo y miniatura:</strong> el texto de Photo baja de 40 a 32 px de padding superior. La miniatura mantiene 160 × 160 px y baja su padding vertical de 56 a 40 px y el lateral de 24 a 16 px.
              </>,
              <>
                <strong>Ancho:</strong> Photo e Icon ocupan el ancho disponible y el título se recorta en una línea. Las acciones de la miniatura se ven siempre en pantallas táctiles.
              </>,
            ],
            preview: iconFluid(),
          },
          tablet: {
            bullets: [
              <>
                <strong>Como Desktop:</strong> Icon con 24 px de padding y Avatar de 48 px; Photo con 40 px de padding superior en el texto.
              </>,
              <>
                <strong>Miniatura:</strong> 160 × 160 px, con 56 px de padding arriba y abajo y 24 px a los lados.
              </>,
              <>
                <strong>Ancho:</strong> Photo e Icon ocupan el ancho disponible; el título se recorta en una línea.
              </>,
            ],
            preview: iconFluid(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de nombre, selección y tipo de tarjeta de FileCard.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Nombre y metadatos separados',
              description: (
                <>
                  Pon el nombre en <code>title</code> y el tamaño en <code>description</code>.
                </>
              ),
              preview: iconFluid({ title: 'Informe trimestral.pdf' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Todo en el título',
              description: 'No mezcles nombre y datos en el título: se recorta.',
              preview: iconFluid({ title: LONG_TITLE, description: undefined }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Elección única con radio',
              description: (
                <>
                  Usa <code>selection=&quot;radio&quot;</code> con el mismo <code>name</code> cuando se elige un solo archivo.
                </>
              ),
              preview: stack(
                iconFluid({ selection: 'radio', name: 'principal', value: 'a', title: 'Versión A.pdf', defaultChecked: true }),
                iconFluid({ selection: 'radio', name: 'principal', value: 'b', title: 'Versión B.pdf' })
              ),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Casillas para elegir uno',
              description: 'No uses casillas si solo cabe un archivo: nada impide marcar los dos.',
              preview: stack(
                iconFluid({ title: 'Versión A.pdf', defaultChecked: true }),
                iconFluid({ title: 'Versión B.pdf', defaultChecked: true })
              ),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Documento como Icon',
              description: (
                <>
                  Usa <code>type=&quot;icon&quot;</code> para documentos: el nombre queda a la vista.
                </>
              ),
              preview: iconFluid({ title: 'Acta de reunión.pdf', description: 'Tamaño de archivo: 84 KB' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Documento como miniatura',
              description: (
                <>
                  No uses <code>type=&quot;thumbnail&quot;</code> sin foto: el nombre no se ve.
                </>
              ),
              preview: thumb({ title: 'Acta de reunión.pdf' }),
            },
          ],
        },
      ],
    },
  ],
};
