import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Avatar } from './Avatar';
import { AvatarGroup } from './AvatarGroup';
import { AvatarPlus } from './AvatarPlus';
import { PHOTO_SRC } from './Avatar.sample-data';
import { SampleLogo } from './Avatar.samples';

/*
 * Contenido de la página de documentación de Avatar (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Avatar.types.ts`, `Avatar.variants.ts`, `Avatar.tsx`), luego `Avatar.docs.json`. Diferencias con Figma: Figma nombra
 * los tamaños de brand (md 56, sm 48, xs 32) e icon (md 56, sm 48, xs 40) distinto del resto; el código usa la misma
 * escala (lg 56, md 48, sm 32, xs 24) y en icon `sm` mide 40. El xs de 24 px de brand e icon no existe en Figma y se
 * deriva. En brand, el fondo On Canva de Figma usa el token "on-card" del set Icon, y On Card el "on-canva"; el código
 * lo replica. Figma abre un Dropdown menu en el Hover del "+N"; el código lo abre con clic, Enter o Espacio.
 */

// Figma: 11096:4256 (Avatar), 11096:4024 (Avatar colors), 11096:4241 (Avatar photo), 14723:91426 (Avatar brand),
// 19585:42696 (Avatar icon), 11096:4276 (Avatar group), 11096:4313 (Avatar plus)

type AvatarProps = Partial<ComponentProps<typeof Avatar>>;

/** Avatar de ejemplo con iniciales. */
const person = (props: AvatarProps = {}) => <Avatar name="Hugo García" {...props} />;

/** Silueta con nombre accesible. */
const silhouette = (props: AvatarProps = {}) => <Avatar variant="user" label="Hugo García" {...props} />;

/** Foto de muestra con texto alternativo. */
const photo = (props: AvatarProps = {}) => <Avatar variant="photo" src={PHOTO_SRC.Woman_1} alt="Laura Méndez" {...props} />;

/** Logo de muestra: usa `currentColor`, así toma el color del token. */
const brand = (props: AvatarProps = {}) => <Avatar variant="brand" label="Equipo de diseño" logo={<SampleLogo />} {...props} />;

/** Ícono de la biblioteca. Sobre `on-card`: con `on-canva` el fondo se funde con el panel de la muestra. */
const glyph = (props: AvatarProps = {}) => <Avatar variant="icon" label="Carpeta" contrast="on-card" {...props} />;

/** Fila de ejemplos con separación para las cotas. */
const row = (...items: ReactNode[]) => (
  <div className="flex items-center gap-ds-primitives-space-6xl">
    {items.map((item, i) => (
      <Fragment key={i}>{item}</Fragment>
    ))}
  </div>
);

/** Fila apretada, para muestras sin cotas. */
const tight = (...items: ReactNode[]) => (
  <div className="flex items-center gap-ds-space-general-2xl">
    {items.map((item, i) => (
      <Fragment key={i}>{item}</Fragment>
    ))}
  </div>
);

/** Fila que pasa a la línea siguiente: cabe en el marco angosto de Mobile y Tablet. */
const wrap = (...items: ReactNode[]) => (
  <div className="flex flex-wrap items-center gap-ds-space-general-lg">
    {items.map((item, i) => (
      <Fragment key={i}>{item}</Fragment>
    ))}
  </div>
);

/** Muestras de los cuatro tamaños, de mayor a menor. */
const sizes = (make: (size: 'lg' | 'md' | 'sm' | 'xs') => ReactNode) => tight(make('lg'), make('md'), make('sm'), make('xs'));

/** Personas de ejemplo para los grupos. */
const PEOPLE = ['Ana Bernal', 'Carlos Duarte', 'Fabiola Gil', 'Hugo García', 'Julia Kent', 'Mateo Vargas'];

const people = (count: number) => PEOPLE.slice(0, count).map((name) => <Avatar key={name} name={name} />);

/** Fila de avatares sueltos, sin agrupar. */
const loose = (count: number) => (
  <div className="flex items-center gap-ds-space-general-lg">
    {PEOPLE.slice(0, count).map((name) => (
      <Avatar key={name} name={name} size="sm" />
    ))}
  </div>
);

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo de los cinco tipos: iniciales, silueta, foto, marca e ícono.',
    samples: [person({ size: 'md' }), silhouette({ size: 'md' }), photo({ size: 'md' }), brand({ size: 'md' }), glyph({ size: 'md' })],
  },
  {
    label: 'Hover',
    tone: 'accent',
    description: (
      <>
        Solo en <code>icon</code>. Fondo de hover. Se fuerza con <code>state</code>: el avatar no responde al puntero.
      </>
    ),
    samples: [glyph({ size: 'md', state: 'hover' })],
  },
  {
    label: 'Select',
    tone: 'accent',
    description: (
      <>
        Solo en <code>icon</code>. Fondo de selección con <code>selected</code>. Se ignora si hay <code>inactive</code>.
      </>
    ),
    samples: [glyph({ size: 'md', selected: true })],
  },
  {
    label: 'Inactive',
    tone: 'neutral',
    description: (
      <>
        En <code>icon</code> y <code>brand</code> (<code>inactive</code>). El fondo no cambia y el glifo pasa a gris.
      </>
    ),
    samples: [glyph({ size: 'md', inactive: true }), brand({ size: 'md', inactive: true })],
  },
  {
    label: 'Disabled',
    tone: 'neutral',
    description: (
      <>
        En iniciales, silueta y foto (<code>disabled</code>). Fondo y texto en gris; la foto pasa a escala de grises. En modo oscuro el fondo gris se funde con el panel de la muestra.
      </>
    ),
    samples: [person({ size: 'md', disabled: true }), silhouette({ size: 'md', disabled: true }), photo({ size: 'md', disabled: true })],
  },
];

export const doc: ComponentDocContent = {
  name: 'Avatar',
  icon: 'user',
  classification: 'molecula',
  summary:
    'El Avatar es la molécula que representa a una persona o entidad con iniciales, silueta, foto, logo o ícono. Tiene cuatro tamaños, un indicador de estado opcional y se agrupa con AvatarGroup. No es interactivo: informa y no recibe foco.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Un círculo o píldora lleva el contenido y, en iniciales, silueta y foto, un indicador opcional en la esquina inferior derecha.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Iniciales con indicador',
                  preview: person({ badge: true, badgeLabel: 'En línea' }),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Avatar"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="HG"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Badge"]', index: 0, side: 'right' },
                  ],
                  dimensions: [{ kind: 'height', selector: '[data-figma-part="Avatar"]' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Círculo:</strong> 56 × 56 px en <code>lg</code> (<code>dimention/<wbr />avatar/<wbr />lg</code>), radio completo (<code>radius/<wbr />button/<wbr />full</code>) y fondo según <code>color</code> (<code>background/<wbr />acent/<wbr />secondary</code> en Purple).
                </>,
                <>
                  <strong>Iniciales:</strong> primera letra del primer y del último nombre, en mayúscula. Helvetica semibold de 14 px en <code>lg</code> y <code>md</code> (<code>typography/<wbr />button/<wbr />size/<wbr />md</code>) y de 12 px en <code>sm</code> y <code>xs</code>.
                </>,
                <>
                  <strong>Indicador:</strong> <code>Badge</code> simple de 12 px abajo a la derecha. Mide 8 px en <code>sm</code> y no se dibuja en <code>xs</code>.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Silueta',
                  preview: silhouette({ color: 'blue' }),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Avatar"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Ellipse 1"]', side: 'top' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Círculo:</strong> las mismas medidas y el mismo fondo por color que las iniciales.
                </>,
                <>
                  <strong>Cabeza y hombros:</strong> dos círculos con el color de ícono del tono (<code>icon/<wbr />semantic/<wbr />information/<wbr />secondary</code> en Blue). La cabeza mide 20 px en <code>lg</code>; los hombros, 56 px, y el avatar los recorta por abajo.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Foto con indicador',
                  preview: photo({ badge: true, badgeLabel: 'En línea', badgeState: 'success' }),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Photos (Atom)"]', side: 'left' },
                    { n: 2, selector: 'img', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Badge"]', index: 0, side: 'right' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Círculo:</strong> recorta la imagen con el mismo radio y tamaño que las iniciales.
                </>,
                <>
                  <strong>Imagen:</strong> <code>img</code> que cubre el círculo (<code>src</code> con <code>alt</code>) o contenido propio en <code>children</code>.
                </>,
                <>
                  <strong>Indicador:</strong> el mismo <code>Badge</code> de 12 px. <code>badgeState</code> cambia su color.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Marca',
                  preview: brand(),
                  marks: [
                    { n: 1, selector: '[role="img"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Icon Right"]', side: 'top' },
                  ],
                  dimensions: [{ kind: 'padding', selector: '[role="img"]', side: 'left' }],
                },
                {
                  label: 'Ícono',
                  preview: glyph(),
                  marks: [
                    { n: 1, selector: '[role="img"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Icon-sizes"]', side: 'top' },
                  ],
                  dimensions: [{ kind: 'padding', selector: '[role="img"]', side: 'left' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Píldora:</strong> 56 × 56 px en <code>lg</code> con radio completo (<code>radius/<wbr />general/<wbr />full</code>) y fondo por <code>contrast</code> (<code>background/<wbr />icon/<wbr />default-on-canva</code> u <code>on-card</code>). Es la raíz: no lleva círculo interior ni indicador.
                </>,
                <>
                  <strong>Glifo:</strong> el logo de <code>brand</code> ocupa un recuadro de 32 px (<code>logo</code> debe usar <code>currentColor</code>); el ícono de <code>icon</code> mide 24 px. El relleno de la píldora lo centra.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Cuatro tamaños',
                  preview: row(person({ size: 'lg' }), person({ size: 'md' }), person({ size: 'sm' }), person({ size: 'xs' })),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Avatar"]', index: 0, side: 'top' },
                    { n: 2, selector: '[data-figma-part="Avatar"]', index: 1, side: 'top' },
                    { n: 3, selector: '[data-figma-part="Avatar"]', index: 2, side: 'top' },
                    { n: 4, selector: '[data-figma-part="Avatar"]', index: 3, side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[data-figma-part="Avatar"]', index: 0 },
                    { kind: 'height', selector: '[data-figma-part="Avatar"]', index: 1 },
                    { kind: 'height', selector: '[data-figma-part="Avatar"]', index: 2 },
                    { kind: 'height', selector: '[data-figma-part="Avatar"]', index: 3 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>lg:</strong> 56 px. Es el tamaño por defecto (<code>dimention/<wbr />avatar/<wbr />lg</code>).
                </>,
                <>
                  <strong>md:</strong> 48 px (<code>dimention/<wbr />avatar/<wbr />md</code>).
                </>,
                <>
                  <strong>sm:</strong> 32 px (<code>dimention/<wbr />avatar/<wbr />sm</code>). Es el de los avatares de un grupo.
                </>,
                <>
                  <strong>xs:</strong> 24 px (<code>dimention/<wbr />avatar/<wbr />xs</code>). No lleva indicador.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Grupo con +N',
                  preview: (
                    <AvatarGroup aria-label="Participantes" max={3}>
                      {people(5)}
                    </AvatarGroup>
                  ),
                  marks: [
                    { n: 1, selector: '[role="group"]', side: 'top' },
                    { n: 2, selector: '[data-figma-part="Avatar color"]', side: 'left' },
                    { n: 3, selector: '[data-figma-part="Button"]', side: 'right' },
                  ],
                  dimensions: [{ kind: 'height', selector: '[data-figma-part="Button"]' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Grupo:</strong> <code>AvatarGroup</code> en una fila. Es un <code>role=&quot;group&quot;</code> solo si recibe <code>aria-label</code>. Impone su tamaño a los avatares (<code>sm</code> por defecto).
                </>,
                <>
                  <strong>Avatares:</strong> hasta <code>max</code> (5 por defecto), solapados 8 px y con anillo de 0.5 px (<code>border/<wbr />general/<wbr />white-unicolor</code>).
                </>,
                <>
                  <strong>+N:</strong> <code>AvatarPlus</code>, un botón de 32 px de alto con fondo <code>background/<wbr />general/<wbr />gray-sixth</code> y texto semibold de 14 px. Abre la lista de avatares ocultos.
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
          Avatar tiene 5 variantes de aspecto y no es interactivo: no recibe foco ni responde al puntero. Los estados vienen del State de Figma. Hover se fuerza con <code>state</code> solo para documentar.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default y de los estados que cambian el color. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Iniciales',
              preview: person(),
              entries: [
                { part: 'Fondo (Purple)', color: 'background-acent-secondary' },
                { part: 'Texto (Purple)', color: 'text-acent-secondary', text: 'typography-button-size-md' },
                { part: 'Fondo (Yellow)', color: 'background-semantic-alert-secondary' },
                { part: 'Texto (Yellow)', color: 'text-semantic-alert' },
                { part: 'Fondo (Blue)', color: 'background-semantic-information-secondary' },
                { part: 'Texto (Blue)', color: 'text-semantic-information' },
                { part: 'Fondo (Green)', color: 'background-semantic-success-secondary' },
                { part: 'Texto (Green)', color: 'text-semantic-success' },
                { part: 'Fondo (Red)', color: 'background-semantic-error-secondary' },
                { part: 'Texto (Red)', color: 'text-semantic-error' },
                { part: 'Fondo (Disabled)', color: 'background-container-disabled-on-card' },
                { part: 'Texto (Disabled)', color: 'text-neutral-disabled-on-card' },
              ],
            },
            {
              title: 'Silueta',
              preview: silhouette(),
              entries: [
                { part: 'Cabeza y hombros (Purple)', color: 'icon-acent-tertiary' },
                { part: 'Cabeza y hombros (Yellow)', color: 'icon-semantic-alert-secondary' },
                { part: 'Cabeza y hombros (Blue)', color: 'icon-semantic-information-secondary' },
                { part: 'Cabeza y hombros (Green)', color: 'icon-semantic-success-secondary' },
                { part: 'Cabeza y hombros (Red)', color: 'icon-semantic-error-secondary' },
                { part: 'Cabeza y hombros (Disabled)', color: 'icon-general-disabled-negative' },
              ],
            },
            {
              title: 'Foto e indicador',
              preview: photo({ badge: true, badgeLabel: 'En línea' }),
              entries: [
                { part: 'Indicador', color: 'background-acent-tertiary' },
                { part: 'Indicador (success)', color: 'background-semantic-success-tertiary' },
                { part: 'Anillo del grupo', color: 'border-general-white-unicolor' },
              ],
            },
            {
              title: 'Marca',
              preview: brand(),
              entries: [
                { part: 'Fondo (On Canva)', color: 'background-icon-default-on-card' },
                { part: 'Fondo (On Card)', color: 'background-icon-default-on-canva' },
                { part: 'Logo', color: 'background-logo-default' },
                { part: 'Logo (Inactive)', color: 'icon-general-disabled-positive' },
              ],
            },
            {
              title: 'Ícono',
              preview: glyph(),
              entries: [
                { part: 'Fondo (On canva)', color: 'background-icon-default-on-canva' },
                { part: 'Fondo (On canva, Hover)', color: 'background-icon-hover-on-canva' },
                { part: 'Fondo (On canva, Select)', color: 'background-icon-select-on-canva' },
                { part: 'Fondo (On card)', color: 'background-icon-default-on-card' },
                { part: 'Fondo (On card, Hover)', color: 'background-icon-hover-on-card' },
                { part: 'Fondo (On card, Select)', color: 'background-icon-select-on-card' },
                { part: 'Fondo (On card, Inactive)', color: 'background-icon-disable-on-card' },
                { part: 'Ícono', color: 'icon-general-default' },
                { part: 'Ícono (Inactive)', color: 'icon-general-disabled-positive' },
              ],
            },
            {
              title: '+N',
              preview: <AvatarPlus count={2} />,
              entries: [
                { part: 'Fondo', color: 'background-general-gray-sixth' },
                { part: 'Texto', color: 'text-neutral-white', text: 'typography-button-size-md' },
                { part: 'Trazo (aparece en Hover)', color: 'border-general-white-unicolor' },
                { part: 'Contorno de foco', color: 'border-field-active' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Avatar en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Avatar en la librería de Assets. El set Avatar tiene la propiedad Type (Text, Photo, Brand, Icon y User) y envuelve a los átomos Avatar colors, Avatar photo, Avatar brand y Avatar icon. En código es <code>variant</code>.
            </>,
            <>
              <strong>Type y Size:</strong> Text y User son <code>initials</code> y <code>user</code>; Photo, Brand e Icon son <code>photo</code>, <code>brand</code> e <code>icon</code>. Figma nombra los tamaños de Brand (md 56, sm 48, xs 32) e Icon (md 56, sm 48, xs 40) distinto: en código son <code>lg</code>, <code>md</code> y <code>sm</code>, y en <code>icon</code> el <code>sm</code> mide 40 px. El xs de 24 px de Brand e Icon no existe en Figma.
            </>,
            <>
              <strong>State, Color y Contrast:</strong> Icon tiene State Default, Hover, Select e Inactive (<code>state</code>, <code>selected</code> e <code>inactive</code>). El estado gris se llama Disabled en Avatar colors y Avatar brand, e Inactive en Avatar icon (la foto en grises sale de la foto Disabled de Photos): en código, <code>disabled</code> para iniciales, silueta y foto, e <code>inactive</code> para <code>icon</code> y <code>brand</code> (<code>disabled</code> sigue como alias). Contrast On canva y On card son <code>contrast</code>; en Brand el fondo está cruzado: On Canva usa el fondo de On card de Icon.
            </>,
            <>
              <strong>Grupo y +N:</strong> Avatar group corresponde a <code>AvatarGroup</code> y Avatar plus a <code>AvatarPlus</code>. El Hover de Figma abre un Dropdown menu; el código lo abre con clic, Enter o Espacio.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Avatar es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Identificar a una persona:</strong> <code>initials</code> con <code>name</code>, <code>photo</code> con <code>src</code> y <code>alt</code>, o <code>user</code> si no hay nombre ni foto.
            </>,
            <>
              <strong>Representar una entidad:</strong> <code>brand</code> con su logo en <code>logo</code>, o <code>icon</code> con un ícono de la biblioteca.
            </>,
            <>
              <strong>Mostrar presencia:</strong> <code>badge</code> con <code>badgeState</code> y <code>badgeLabel</code>, como <code>success</code> y &quot;En línea&quot;.
            </>,
            <>
              <strong>Varias personas:</strong> <code>AvatarGroup</code> muestra hasta <code>max</code> y resume el resto en un +N que abre la lista de ocultos.
            </>,
            <>
              <strong>Lectores de pantalla:</strong> con <code>name</code>, <code>label</code> o <code>alt</code> se lee como imagen con ese nombre. Sin ninguno es decorativo.
            </>,
          ],
          avoid: [
            <>
              <strong>Abrir un menú o ejecutar una acción:</strong> el avatar no recibe foco ni clic. (Alternativa: <code>AvatarMenu</code>).
            </>,
            <>
              <strong>Contador o estado sin persona:</strong> un punto o un número solo no es un avatar. (Alternativa: <code>Badge</code>).
            </>,
            <>
              <strong>Indicador en <code>xs</code>:</strong> no se dibuja. Usa <code>sm</code> o más.
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
                title: 'Iniciales, silueta y foto',
                bullets: [
                  <>
                    <strong>Tamaños:</strong> <code>lg</code> 56 px, <code>md</code> 48 px, <code>sm</code> 32 px y <code>xs</code> 24 px.
                  </>,
                  <>
                    <strong>Iniciales:</strong> 14 px en <code>lg</code> y <code>md</code>; 12 px en <code>sm</code> y <code>xs</code>.
                  </>,
                ],
                preview: sizes((size) => person({ size })),
              },
              {
                title: 'Marca e ícono',
                bullets: [
                  <>
                    <strong>Tamaños:</strong> <code>lg</code> 56 px y <code>md</code> 48 px; en <code>icon</code>, <code>sm</code> mide 40 px.
                  </>,
                  <>
                    <strong>Relleno:</strong> el ícono de 24 px queda centrado con relleno de 16 px en <code>lg</code> y de 12 px en <code>md</code>.
                  </>,
                ],
                preview: tight(brand({ size: 'lg' }), glyph({ size: 'lg' }), glyph({ size: 'md' })),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Tamaños:</strong> <code>lg</code> baja a 48 px y <code>md</code> a 40 px. <code>sm</code> (32 px) y <code>xs</code> (24 px) no cambian.
              </>,
              <>
                <strong>Iniciales:</strong> 16 px en <code>lg</code> y <code>md</code> (<code>typography/<wbr />button/<wbr />size/<wbr />md</code>); 12 px en <code>sm</code> y <code>xs</code>.
              </>,
              <>
                <strong>Ícono:</strong> el relleno baja a 12 px en <code>lg</code> y a 8 px en <code>md</code>, así el glifo sigue en 24 px.
              </>,
            ],
            preview: wrap(person({ size: 'lg' }), person({ size: 'md' }), person({ size: 'sm' }), person({ size: 'xs' }), glyph({ size: 'lg' })),
          },
          tablet: {
            bullets: [
              <>
                <strong>Tamaños:</strong> <code>lg</code> 56 px, <code>md</code> 48 px, <code>sm</code> 32 px y <code>xs</code> 24 px, como en Desktop.
              </>,
              <>
                <strong>Iniciales:</strong> 14 px en <code>lg</code> y <code>md</code>; 12 px en <code>sm</code> y <code>xs</code>.
              </>,
              <>
                <strong>Ícono:</strong> relleno de 16 px en <code>lg</code> y de 12 px en <code>md</code>; el glifo mide 24 px.
              </>,
            ],
            preview: wrap(person({ size: 'lg' }), person({ size: 'md' }), person({ size: 'sm' }), person({ size: 'xs' }), glyph({ size: 'lg' })),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de nombre accesible, agrupación y tipo de avatar.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Avatar con nombre',
              description: (
                <>
                  Pasa <code>label</code>, <code>name</code> o <code>alt</code> para que el lector lo anuncie.
                </>
              ),
              preview: silhouette(),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Avatar sin nombre',
              description: 'Sin nombre accesible, el avatar queda decorativo y el lector lo omite.',
              preview: <Avatar variant="user" />,
            },
            {
              kind: 'do',
              framed: true,
              title: 'Grupo con límite',
              description: (
                <>
                  Agrupa con <code>AvatarGroup</code> y define <code>max</code>.
                </>
              ),
              preview: (
                <AvatarGroup aria-label="Participantes" max={4}>
                  {people(6)}
                </AvatarGroup>
              ),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Fila sin agrupar',
              description: (
                <>
                  No alinees avatares sueltos: usa <code>AvatarGroup</code>.
                </>
              ),
              preview: loose(6),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Iniciales para personas',
              description: 'Usa iniciales o foto para identificar a una persona.',
              preview: person({ size: 'md' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Ícono para personas',
              description: 'No uses el ícono para una persona: es para entidades.',
              preview: glyph({ size: 'md', label: 'Hugo García' }),
            },
          ],
        },
      ],
    },
  ],
};
