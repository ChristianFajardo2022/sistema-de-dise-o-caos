import { Fragment } from 'react';
import type { ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Icon } from '../Icon';
import type { IconName } from '../Icon/Icon.types';
import { TopAppBar } from './TopAppBar';
import type { TopAppBarPlatform, TopAppBarProps } from './TopAppBar.types';

/*
 * Contenido de la página de documentación de Top App Bar (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`TopAppBar.types.ts`, `TopAppBar.variants.ts`, `TopAppBar.tsx`), luego `TopAppBar.docs.json`. Button, Button corner,
 * Avatar e Icon son componentes aparte: aquí solo se nombran.
 *
 * Las muestras son ilustraciones (`inert`) con el título en nivel 3: varias barras con `h1` y `banner` en la misma página
 * repetirían landmarks y encabezados. La barra interactiva es la del lienzo de Desarrollo.
 *
 * Diferencias con Figma: el Centered Title de Android no trae título en el archivo; el código sí lo admite. Figma pide el
 * subtítulo de Centered Title y Left-Aligned en bold (700) y el código usa semibold (600). Figma dibuja el set a 1440 de
 * ancho; el componente ocupa el ancho que le dé su contenedor.
 */

// Figma: 17295:110677 (component set Top App Bar)

/** Botón de acción de la derecha: círculo de 44 en iOS, botón de 48 sin relleno en Android. */
const action = (platform: TopAppBarPlatform, icon: IconName, label: string) =>
  platform === 'ios' ? (
    <Button variant="primary" iconOnly touchTarget aria-label={label}>
      <Icon name={icon} variant="fill" size={20} />
    </Button>
  ) : (
    <Button variant="tertiary" size="sm" iconOnly aria-label={label}>
      <Icon name={icon} variant="fill" size={24} />
    </Button>
  );

/** Barra de ejemplo con las acciones de su plataforma; `props` sobrescribe lo que pida cada muestra. */
const bar = (props: Partial<TopAppBarProps> = {}) => {
  const platform = props.platform ?? 'ios';
  return (
    <TopAppBar
      headingLevel={3}
      title="Documentos"
      subtitle="Carpeta compartida"
      onBack={() => {}}
      actions={platform === 'ios' ? action('ios', 'add-2', 'Agregar') : action('android', 'search', 'Buscar')}
      {...props}
    />
  );
};

/** Dibuja la muestra a un ancho de diseño (la plantilla la reduce si no cabe) y como ilustración. */
const at = (width: number, node: ReactNode) => (
  <div inert style={{ width }}>
    {node}
  </div>
);

/** Muestra de Do and Dont's: a todo el ancho del marco y como ilustración. */
const fill = (node: ReactNode) => <div inert>{node}</div>;

/** Fila de muestras de una variante: iOS arriba y Android debajo. */
const both = (props: Partial<TopAppBarProps> = {}) => (
  <div className="flex flex-col gap-ds-space-general-2xl">
    {[bar({ ...props, platform: 'ios' }), bar({ ...props, platform: 'android' })].map((node, i) => (
      <Fragment key={i}>{at(376, node)}</Fragment>
    ))}
  </div>
);

const states: DocStateItem[] = [
  {
    label: 'Centered Title',
    tone: 'neutral',
    description: (
      <>
        Título y subtítulo centrados entre el botón de volver y las acciones. Es el valor por defecto (<code>titlePosition=&quot;centered&quot;</code>).
      </>
    ),
    samples: [both({ titlePosition: 'centered' })],
  },
  {
    label: 'Left-Aligned',
    tone: 'neutral',
    description: (
      <>
        Título y subtítulo junto al botón de la izquierda, que ocupan el espacio libre. Admite <code>avatar</code>.
      </>
    ),
    samples: [both({ titlePosition: 'left' })],
  },
  {
    label: 'With Action Only',
    tone: 'neutral',
    description: 'Botones arriba, uno a cada lado, y el título grande debajo. La barra mide 125 en iOS y 120 en Android.',
    samples: [both({ titlePosition: 'action-only' })],
  },
  {
    label: 'Title Only',
    tone: 'neutral',
    description: 'Título grande en la misma fila que los botones, sin subtítulo.',
    samples: [both({ titlePosition: 'title-only' })],
  },
];

export const doc: ComponentDocContent = {
  name: 'Top App Bar',
  icon: 'menu',
  classification: 'molecula',
  summary:
    'El Top App Bar es la molécula que encabeza una pantalla móvil: botón de volver o de menú, título con subtítulo opcional y acciones. Se adapta a iOS y Android y tiene cuatro disposiciones.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una fila con el botón de volver, el título y las acciones. Con título grande, los botones van arriba y el título debajo.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'iOS con título centrado',
                  width: 376,
                  preview: at(376, bar({ titlePosition: 'centered', platform: 'ios' })),
                  marks: [
                    { n: 1, selector: 'header', side: 'left' },
                    { n: 2, selector: 'header button', index: 0, side: 'bottom' },
                    { n: 3, selector: '[data-figma-part="Title"]', side: 'top' },
                    { n: 4, selector: '[data-figma-part="Subtitle"]', side: 'bottom' },
                    { n: 5, selector: '[data-figma-part="Espacio"]', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: 'header', side: 'left' },
                    { kind: 'padding', selector: 'header', side: 'top' },
                    { kind: 'gap', from: '[data-figma-part="Title"]', to: '[data-figma-part="Subtitle"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Barra:</strong> <code>header</code> de todo el ancho, sin relleno y con texto <code>text/neutral/heading</code>. Padding de 16 (<code>space/general/2xl</code>) y 12 entre zonas (<code>space/general/xl</code>). El alto es fijo: 54 en iOS y 64 en Android.
                </>,
                <>
                  <strong>Botón de volver:</strong> con <code>onBack</code>, un Button corner de ícono con chevron de 20 y círculo de 44 en iOS; en Android, un Button tertiary de solo ícono de 48 con flecha de 24. Se llama &quot;Volver&quot; (<code>backLabel</code>). <code>leading</code> lo reemplaza.
                </>,
                <>
                  <strong>Título:</strong> heading real, <code>h1</code> por defecto (<code>headingLevel</code> cambia el nivel). Tipografía de títulos en semibold y <code>typography/heading/size-md</code>: 16 con interlineado de 20.
                </>,
                <>
                  <strong>Subtítulo:</strong> párrafo de <code>typography/body/size-sm</code> (12) a 4 del título (<code>space/general/md</code>). En Centered Title y Left-Aligned va en semibold con interlineado de 18.
                </>,
                <>
                  <strong>Acciones:</strong> <code>actions</code>, a la derecha. En iOS, Buttons primary de 44 con 4 entre sí; en Android, Buttons tertiary de 48 sin separación.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Android con avatar',
                  width: 376,
                  preview: at(376, bar({ platform: 'android', titlePosition: 'left', avatar: <Avatar variant="initials" size="md" name="Ana Pérez" /> })),
                  marks: [
                    { n: 1, selector: 'header', side: 'left' },
                    { n: 2, selector: 'header button', index: 0, side: 'bottom' },
                    { n: 3, selector: '[data-figma-part="Avatar"]', side: 'top' },
                    { n: 4, selector: '[data-figma-part="Title"]', side: 'top' },
                    { n: 5, selector: '[data-figma-part="Subtitle"]', side: 'bottom' },
                    { n: 6, selector: '[data-figma-part="Espacio"]', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: 'header', side: 'left' },
                    { kind: 'gap', from: 'header button', fromIndex: 0, to: '[data-figma-part="Avatar"]' },
                    { kind: 'gap', from: '[data-figma-part="Title"]', to: '[data-figma-part="Subtitle"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Barra:</strong> mide 64 de alto en Android. En Left-Aligned todo va en una fila y el título ocupa el espacio libre.
                </>,
                <>
                  <strong>Botón de volver:</strong> Button tertiary de solo ícono de 48 con <code>arrow-left2</code> de 24.
                </>,
                <>
                  <strong>Avatar:</strong> <code>avatar</code>, un Avatar de tamaño md (48) entre el botón y el título, a 12 de cada uno (<code>space/general/xl</code>). No aplica con título grande.
                </>,
                <>
                  <strong>Título:</strong> alineado a la izquierda, con la misma tipografía que en iOS.
                </>,
                <>
                  <strong>Subtítulo:</strong> debajo del título y a su misma altura de texto, con 4 de separación.
                </>,
                <>
                  <strong>Acciones:</strong> Button tertiary de 48. Con varias, quedan pegadas una a otra.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'iOS con título grande',
                  width: 376,
                  preview: at(376, bar({ platform: 'ios', titlePosition: 'action-only' })),
                  marks: [
                    { n: 1, selector: 'header', side: 'left' },
                    { n: 2, selector: 'header button', index: 0, side: 'top' },
                    { n: 3, selector: '[data-figma-part="Espacio"]', side: 'top' },
                    { n: 4, selector: '[data-figma-part="Title"]', side: 'left' },
                    { n: 5, selector: '[data-figma-part="Subtitle"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: 'header', side: 'left' },
                    { kind: 'gap', from: 'header > div:first-child', to: '[data-figma-part="Tittle"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Barra:</strong> columna centrada con 12 entre la fila de botones y el título. Mide 125 en iOS y 120 en Android.
                </>,
                <>
                  <strong>Botón de volver:</strong> arriba a la izquierda.
                </>,
                <>
                  <strong>Acciones:</strong> arriba a la derecha; la fila separa los dos extremos.
                </>,
                <>
                  <strong>Título grande:</strong> <code>typography/heading/size-xl</code>: 24 con interlineado de 28 desde Tablet, y 20 con 26 en Mobile.
                </>,
                <>
                  <strong>Subtítulo:</strong> en regular, <code>typography/body/size-sm</code> (12) con interlineado de 16.
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
          Top App Bar tiene 4 variantes de aspecto, una por Position. No es interactivo: Hover, Focus y Press son de sus botones. En cada columna, iOS arriba y Android debajo (<code>platform</code>).
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default de cada plataforma. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'iOS',
              preview: at(376, bar({ platform: 'ios' })),
              entries: [
                { part: 'Título', color: 'text-neutral-heading', text: 'typography-heading-size-md' },
                { part: 'Subtítulo', color: 'text-neutral-heading', text: 'typography-body-size-sm' },
                { part: 'Fondo del botón de volver', color: 'background-container-default-on-canva' },
                { part: 'Ícono del botón de volver', color: 'icon-general-default' },
                { part: 'Fondo de la acción', color: 'background-button-primary-default' },
                { part: 'Ícono de la acción', color: 'icon-button-primary-default' },
              ],
            },
            {
              title: 'Android',
              preview: at(376, bar({ platform: 'android' })),
              entries: [
                { part: 'Título', color: 'text-neutral-heading', text: 'typography-heading-size-md' },
                { part: 'Subtítulo', color: 'text-neutral-heading', text: 'typography-body-size-sm' },
                { part: 'Ícono de los botones', color: 'icon-button-tertiary-default' },
              ],
            },
            {
              title: 'Título grande',
              preview: at(376, bar({ platform: 'ios', titlePosition: 'action-only' })),
              entries: [
                { part: 'Título', color: 'text-neutral-heading', text: 'typography-heading-size-xl' },
                { part: 'Subtítulo', color: 'text-neutral-heading', text: 'typography-body-size-sm' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Top App Bar en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Top App Bar en la librería de Assets. Tiene 8 variantes: Type (valores &quot;Ios&quot; y &quot;Android&quot;) por Position (Centered Title, Left-Aligned, With Action Only, Title Only). En código es un solo componente.
            </>,
            <>
              <strong>Type y Position:</strong> Type es <code>platform</code> (<code>ios</code> o <code>android</code>) y cambia las medidas y el botón de volver. Position es <code>titlePosition</code>: <code>centered</code>, <code>left</code>, <code>action-only</code> y <code>title-only</code>.
            </>,
            <>
              <strong>Title, Subtitle, Avatar y Espacio:</strong> Title y Subtitletext son <code>title</code> y <code>subtitle</code>; Avatar es <code>avatar</code>. Button rigth y el slot Espacio son <code>actions</code>. El botón de la izquierda sale de <code>onBack</code>, o de <code>leading</code> si lo reemplazas.
            </>,
            <>
              <strong>Lo que difiere:</strong> el Centered Title de Android no trae título en Figma, solo el menú y la búsqueda; el código sí lo admite. Title Only no dibuja subtítulo. La Status Bar es decorativa y no forma parte del componente.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Top App Bar es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Título de una pantalla móvil:</strong> una barra por pantalla, arriba, con volver o menú, título y acciones. Es un <code>header</code> y el título es un heading, <code>h1</code> por defecto.
            </>,
            <>
              <strong>Volver o menú:</strong> <code>onBack</code> dibuja el botón de volver con su nombre (<code>backLabel</code>). <code>leading</code> lo reemplaza, por ejemplo con un botón de menú.
            </>,
            <>
              <strong>Acciones de la pantalla:</strong> <code>actions</code> recibe botones de solo ícono, cada uno con <code>aria-label</code>. En iOS, Button primary con <code>touchTarget</code>; en Android, Button tertiary.
            </>,
            <>
              <strong>Título grande:</strong> con <code>action-only</code> los botones van arriba y el título debajo; con <code>title-only</code> comparte la fila con los botones y no lleva subtítulo.
            </>,
          ],
          avoid: [
            <>
              <strong>Título de una vista en escritorio:</strong> la barra es una pieza móvil. (Alternativa: <code>PageHeader</code>).
            </>,
            <>
              <strong>Navegación principal de la aplicación:</strong> la barra no lleva secciones ni buscador. (Alternativa: <code>Header</code>).
            </>,
            <>
              <strong>Cambiar entre secciones en móvil:</strong> la barra no es una navegación. (Alternativa: <code>NavBar</code>).
            </>,
            <>
              <strong>Más acciones de las que caben:</strong> los botones recortan el espacio del título. (Alternativa: <code>DropdownMenu</code> con su <code>trigger</code>).
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
                title: 'Título en la fila',
                bullets: [
                  <>
                    <strong>Alto fijo:</strong> 54 en iOS y 64 en Android, con padding de 16.
                  </>,
                  <>
                    <strong>Ancho completo:</strong> ocupa el ancho de su contenedor. Figma lo dibuja a 1440.
                  </>,
                ],
                preview: at(1440, bar({ titlePosition: 'centered' })),
              },
              {
                title: 'Título grande',
                bullets: [
                  <>
                    <strong>Título de 24:</strong> <code>typography/heading/size-xl</code> con interlineado de 28; baja a 20 en Mobile.
                  </>,
                  <>
                    <strong>Alto fijo:</strong> 125 en iOS y 120 en Android.
                  </>,
                ],
                preview: at(1440, bar({ titlePosition: 'action-only' })),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Título grande de 20:</strong> baja de 24 a 20 y su interlineado de 28 a 26 (<code>typography/heading/size-xl</code>).
              </>,
              <>
                <strong>Alturas iguales:</strong> 54 y 64 en una fila; 125 y 120 con título grande.
              </>,
              <>
                <strong>Ancho de la pantalla:</strong> el título tiene menos espacio, así que conviene mantenerlo corto.
              </>,
            ],
            preview: at(376, bar({ titlePosition: 'action-only' })),
          },
          tablet: {
            bullets: [
              <>
                <strong>Título grande de 24:</strong> los mismos tokens que Desktop, con interlineado de 28.
              </>,
              <>
                <strong>Alturas iguales:</strong> no cambian respecto a Desktop ni Mobile.
              </>,
              <>
                <strong>768 de ancho:</strong> el título y las acciones tienen más espacio que en Mobile.
              </>,
            ],
            preview: at(768, bar({ titlePosition: 'action-only' })),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas del título, el subtítulo y las acciones de la barra.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Título corto',
              description: 'Escribe un título de una o dos palabras que nombre la pantalla.',
              preview: fill(bar({ titlePosition: 'left' })),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Título largo',
              description: 'No uses una frase como título: ajusta línea y se sale del alto fijo.',
              preview: fill(bar({ titlePosition: 'left', title: 'Documentos compartidos con el equipo de diseño este mes', subtitle: undefined })),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Acciones principales',
              description: 'Deja hasta tres acciones en la barra y mueve el resto a un menú.',
              preview: fill(bar({
                platform: 'android',
                titlePosition: 'left',
                actions: (
                  <>
                    {action('android', 'search', 'Buscar')}
                    {action('android', '3-dots-more', 'Más opciones')}
                  </>
                ),
              })),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Acciones de más',
              description: 'No llenes la barra de botones: recortan el espacio del título.',
              preview: fill(bar({
                platform: 'android',
                titlePosition: 'left',
                actions: (
                  <>
                    {action('android', 'search', 'Buscar')}
                    {action('android', 'calendar', 'Calendario')}
                    {action('android', 'attach-circle', 'Adjuntar')}
                    {action('android', 'add-2', 'Agregar')}
                    {action('android', '3-dots-more', 'Más opciones')}
                  </>
                ),
              })),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Subtítulo de apoyo',
              description: 'Usa el subtítulo para un dato que complete el título.',
              preview: fill(bar({ titlePosition: 'left', title: 'Reuniones', subtitle: 'Hoy, 3 pendientes' })),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Subtítulo repetido',
              description: 'No repitas en el subtítulo lo que ya dice el título.',
              preview: fill(bar({ titlePosition: 'left', title: 'Reuniones', subtitle: 'Reuniones' })),
            },
          ],
        },
      ],
    },
  ],
};
