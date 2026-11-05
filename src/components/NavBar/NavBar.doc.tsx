import type { ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { NavBar, NavBarItem } from './NavBar';
import type { NavBarItemData, NavBarItemState, NavBarMoreItem, NavBarProps } from './NavBar.types';

/*
 * Contenido de la página de documentación de Nav bar (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`NavBar.types.ts`, `NavBar.variants.ts`, `NavBar.tsx`), luego `NavBar.docs.json`. Icon y DropdownMenu (la lista de la
 * hoja "más") son componentes aparte: aquí solo se nombran.
 *
 * Las muestras son ilustraciones (`inert`): varias barras navegables repetirían en la página el landmark navigation y los
 * enlaces; la barra interactiva es la de Desarrollo. La hoja "más" se dibuja con `moreOpen` controlado y sin manejador,
 * para que el clic fuera de una muestra no cierre las demás.
 *
 * Diferencias con Figma: Figma puede ocultar el texto de la opción (`Text`) y el código siempre lo dibuja (es el nombre
 * accesible); Figma no dibuja el contorno de foco y el código agrega uno de 2 px; Figma no tiene Hover ni Press y el
 * código tampoco; con `state="focus"` el código dibuja el fondo de Figma, pero el foco real solo lleva contorno.
 * Entre breakpoints no cambia ningún token de la barra: la ficha dice "Sin cambios".
 */

// Figma: 14259:44045 (component set Nav bar), 14018:26460 (component set Options tab bar)

/** Opciones de ejemplo: destinos neutros de primer nivel. */
const ITEMS: NavBarItemData[] = [
  { value: 'inicio', label: 'Inicio', icon: 'homepage' },
  { value: 'documentos', label: 'Documentos', icon: 'document' },
  { value: 'proyectos', label: 'Proyectos', icon: 'folder' },
  { value: 'perfil', label: 'Perfil', icon: 'user' },
];

/** Opciones extra de la hoja "más". */
const MORE: NavBarMoreItem[] = [
  { value: 'favoritos', label: 'Favoritos', icon: 'heart' },
  { value: 'galeria', label: 'Galería', icon: 'image' },
  { value: 'notas', label: 'Notas', icon: 'note-favorite' },
  { value: 'ajustes', label: 'Ajustes', icon: 'setting' },
];

/** El mismo ícono en las cuatro opciones, para el ejemplo de lo que no se debe hacer. */
const SAME_ICON: NavBarItemData[] = ITEMS.map((item) => ({ ...item, icon: 'add-circle' }));

/** Etiquetas largas, para el ejemplo de lo que no se debe hacer. */
const LONG_LABELS: NavBarItemData[] = [
  { value: 'inicio', label: 'Página de inicio', icon: 'homepage' },
  { value: 'documentos', label: 'Documentos compartidos', icon: 'document' },
  { value: 'proyectos', label: 'Proyectos del equipo', icon: 'folder' },
  { value: 'perfil', label: 'Perfil y preferencias', icon: 'user' },
];

/** Cada barra de la página lleva un nombre distinto (landmark único). */
const bar = (name: string, props: Partial<NavBarProps> = {}) => <NavBar aria-label={name} items={ITEMS} defaultValue="documentos" {...props} />;

/** Barra con tres opciones y la hoja "más" abierta (controlada y sin manejador). */
const withSheet = (name: string, props: Partial<NavBarProps> = {}) =>
  bar(name, { items: ITEMS.slice(0, 3), moreItems: MORE, moreOpen: true, ...props });

/** Una ilustración al ancho del contenedor: la barra es fluida y la plantilla la reduce si no cabe. */
const plain = (node: ReactNode) => (
  <div inert className="w-full">
    {node}
  </div>
);

/** Una ilustración al ancho de diseño de la barra (376). */
const at376 = (node: ReactNode) => (
  <div inert style={{ width: 376 }}>
    {node}
  </div>
);

/** Una opción suelta (Options tab bar) sobre la superficie de la barra. */
const option = (state: NavBarItemState, label = 'Documentos') => (
  <div inert className="inline-block rounded-ds-radius-general-full bg-ds-background-container-default-on-canva p-ds-space-general-xl">
    <NavBarItem value="documentos" label={label} icon="document" state={state} className="w-[75px] flex-none" />
  </div>
);

/** Las tres opciones sueltas, en fila, para la tarjeta de tokens. */
const options = () => (
  <div inert className="flex gap-ds-space-general-md rounded-ds-radius-general-full bg-ds-background-container-default-on-canva p-ds-space-general-xl">
    {(['default', 'select', 'focus'] as const).map((state) => (
      <NavBarItem key={state} value={state} label="Documentos" icon="document" state={state} className="w-[75px] flex-none" />
    ))}
  </div>
);

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: (
      <>
        Opción sin seleccionar: ícono de línea y texto del cuerpo. No cambia al pasar el puntero ni al presionar: el código no define Hover ni Press.
      </>
    ),
    samples: [option('default')],
  },
  {
    label: 'Select',
    tone: 'accent',
    description: (
      <>
        Opción activa: ícono relleno, texto blanco y la muesca de la barra. Sale de <code>current</code> o del <code>value</code> de la barra y se anuncia con <code>aria-current=&quot;page&quot;</code>.
      </>
    ),
    samples: [option('select')],
  },
  {
    label: 'Focus',
    tone: 'accent',
    description: (
      <>
        Al llegar con el teclado, la opción lleva un contorno de 2 px. <code>state=&quot;focus&quot;</code> solo dibuja el fondo de Figma para documentar: el contorno aparece con el foco real.
      </>
    ),
    samples: [option('focus')],
  },
  {
    label: 'Hoja abierta',
    tone: 'accent',
    description: (
      <>
        Con <code>moreItems</code>, el botón &quot;más&quot; despliega la hoja y pasa a X. Ninguna opción se dibuja activa, pero la actual sigue con <code>aria-current=&quot;page&quot;</code>: solo cambia el dibujo. Escape, el clic fuera o Tab la cierran.
      </>
    ),
    samples: [at376(withSheet('Hoja abierta'))],
  },
];

export const doc: ComponentDocContent = {
  name: 'Nav bar',
  icon: 'homepage',
  classification: 'molecula',
  summary:
    'La Nav bar es la molécula de navegación inferior para pantallas angostas: reúne entre tres y cuatro opciones con ícono y texto, y marca la activa. Con opciones extra, un botón redondo abre una hoja con ellas.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una píldora con las opciones en fila y, si hay opciones extra, un botón redondo al lado que abre una hoja sobre la barra.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Nav bar con cuatro opciones',
                  width: 376,
                  preview: at376(bar('Cuatro opciones')),
                  marks: [
                    { n: 1, selector: 'nav', side: 'left' },
                    { n: 2, selector: 'nav > div > div', side: 'right' },
                    { n: 3, selector: '[data-figma-part="Description group"] > li:nth-child(2) > *', side: 'bottom' },
                    { n: 4, selector: '[data-figma-part="Icon select"]', side: 'top' },
                    { n: 5, selector: '[data-figma-part="Transferencia"]', index: 1, side: 'bottom' },
                    { n: 6, selector: '[data-figma-part="Ellipse 1"]', side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: 'nav > div', side: 'left' },
                    { kind: 'padding', selector: 'nav > div', side: 'top' },
                    { kind: 'gap', from: '[data-figma-part="Description group"] > li', fromIndex: 0, to: '[data-figma-part="Description group"] > li', toIndex: 1 },
                    { kind: 'height', selector: 'nav > div > div' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> <code>nav</code> del ancho de su contenedor, con nombre accesible obligatorio (<code>aria-label</code>) y padding de 16 (<code>space/general/2xl</code>). Cerrada, lleva un degradado vertical (<code>background/degrade/nav-bar</code>) que suaviza el contenido que pasa por detrás.
                </>,
                <>
                  <strong>Barra:</strong> píldora de 64 de alto con radio <code>radius/general/full</code> y relleno <code>background/container/default-on-canva</code>. Padding de 16 a los lados y de 12 arriba y abajo (<code>space/general/xl</code>). Las opciones se separan 4 (<code>space/general/md</code>) y reparten el ancho por igual.
                </>,
                <>
                  <strong>Opción:</strong> botón, o enlace si lleva <code>href</code>, de 40 de alto con ícono y texto apilados. La activa lleva <code>aria-current=&quot;page&quot;</code>.
                </>,
                <>
                  <strong>Ícono:</strong> Icon de 20, un componente aparte. Es de línea en la opción inactiva y de relleno en la activa.
                </>,
                <>
                  <strong>Texto:</strong> una línea de 10/14 (<code>typography/body/size/xs</code>), a 2 del ícono (<code>space/general/sm</code>). Es también el nombre accesible. No baja de línea: el componente lo corta con puntos suspensivos, un límite y no una opción, así que el nombre debe caber.
                </>,
                <>
                  <strong>Muesca y punto:</strong> la píldora se recorta en círculo sobre la opción activa y un punto de 8 (<code>background/acent/tertiary</code>) la marca. Se mueve con la opción activa y no se dibuja con la hoja abierta.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Nav bar con tres opciones y la hoja abierta',
                  width: 376,
                  preview: at376(withSheet('Tres opciones y más')),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Bottom sheet"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Dropdown list"]', index: 0, side: 'right' },
                    { n: 3, selector: 'nav > div:last-child > div', side: 'bottom' },
                    { n: 4, selector: '[data-figma-part="Button"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Bottom sheet"]', side: 'left' },
                    { kind: 'gap', from: '[data-figma-part="Dropdown list"]', fromIndex: 0, to: '[data-figma-part="Dropdown list"]', toIndex: 1, axis: 'y' },
                    { kind: 'gap', from: 'nav > div:last-child > div', to: '[data-figma-part="Button"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Hoja:</strong> aparece sobre la barra, con relleno <code>background/container/surface</code> y esquinas superiores de 24 (<code>radius/general/2xl</code>). Padding de 16 y de 4 abajo (<code>space/general/md</code>); los ítems se separan 10.
                </>,
                <>
                  <strong>Ítem:</strong> ítem de DropdownMenu con ícono de 16 y texto, un componente aparte. La hoja es un <code>menu</code> llamado como el botón (<code>moreLabel</code>).
                </>,
                <>
                  <strong>Barra:</strong> con <code>moreItems</code> caben tres opciones. Con la hoja abierta, la fila pasa a <code>background/container/surface</code>, ninguna opción se dibuja activa (solo cambia el dibujo; <code>aria-current</code> se mantiene) y la muesca desaparece.
                </>,
                <>
                  <strong>Botón &quot;más&quot;:</strong> círculo de 64 (<code>radius/button/full</code>), a 8 de la barra (<code>space/general/lg</code>). Se llama &quot;Más opciones&quot; (<code>moreLabel</code>) y lleva <code>aria-expanded</code>. Su ícono de 24 gira 45° al abrir y el fondo pasa a <code>background/general/white</code>.
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
          Nav bar tiene 4 estados. Default, Select y Focus son de cada opción y Hoja abierta es de la barra. Focus se fuerza con <code>state</code> solo para documentar.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default de cada pieza. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Barra',
              preview: at376(bar('Barra')),
              entries: [
                { part: 'Degradado del contenedor (inicio)', color: 'background-degrade-nav-bar-0' },
                { part: 'Degradado del contenedor (final)', color: 'background-degrade-nav-bar-100' },
                { part: 'Fondo de la barra', color: 'background-container-default-on-canva' },
                { part: 'Punto de la opción activa', color: 'background-acent-tertiary' },
              ],
            },
            {
              title: 'Opción',
              preview: options(),
              entries: [
                { part: 'Texto', color: 'text-neutral-body', text: 'typography-body-size-xs' },
                { part: 'Ícono', color: 'icon-general-gray-high-contrast' },
                { part: 'Texto activa (Select)', color: 'text-neutral-white' },
                { part: 'Ícono activa (Select)', color: 'icon-general-default' },
                { part: 'Fondo (Focus)', color: 'background-general-gray-seventh' },
                { part: 'Contorno (aparece con el foco real)', color: 'border-field-active' },
              ],
            },
            {
              title: 'Botón más y hoja',
              preview: at376(withSheet('Botón más y hoja')),
              entries: [
                { part: 'Fondo del botón', color: 'background-container-default-on-canva' },
                { part: 'Ícono del botón', color: 'icon-general-default' },
                { part: 'Fondo del botón (abierto)', color: 'background-general-white' },
                { part: 'Ícono del botón (abierto)', color: 'icon-general-black' },
                { part: 'Fondo de la hoja y de la fila', color: 'background-container-surface' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Nav bar en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Nav bar en la librería de Assets. Tiene dos propiedades: Style (3 options o 4 options) y tab (1 a 4).
            </>,
            <>
              <strong>Style y tab:</strong> 4 options son cuatro opciones; 3 options son tres y el botón &quot;más&quot;, en código <code>moreItems</code>. tab 1 a 3 (o 1 a 4) es la opción activa: <code>value</code> o <code>defaultValue</code>. En 3 options, tab 4 es la hoja abierta: <code>moreOpen</code>.
            </>,
            <>
              <strong>Options tab bar:</strong> el átomo de cada opción tiene Propiedad 1 (Default, Select, Focus) y Text2 para el texto. En código es <code>NavBarItem</code>: <code>state</code> con <code>default</code>, <code>select</code> o <code>focus</code>, y <code>label</code>.
            </>,
            <>
              <strong>Lo que difiere:</strong> Figma puede ocultar el texto de la opción (Text); el código siempre lo dibuja porque es el nombre accesible. Figma no dibuja el contorno de foco y el código agrega uno de 2 px.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo la Nav bar es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Navegación principal en móvil:</strong> entre tres y cuatro destinos de primer nivel, siempre a la vista y al alcance del pulgar. Fíjala abajo con <code>fixed inset-x-0 bottom-0</code> y reserva ese espacio en la página para que no tape el contenido.
            </>,
            <>
              <strong>Opciones que navegan o que cambian la vista:</strong> con <code>href</code> la opción es un enlace; sin él, un botón. La activa se anuncia con <code>aria-current=&quot;page&quot;</code>.
            </>,
            <>
              <strong>Destinos secundarios:</strong> con <code>moreItems</code> la barra muestra tres opciones y un botón que abre una hoja con el resto. El foco entra en el primer ítem al abrirla con el botón; Escape y el clic fuera la cierran y el foco vuelve al botón.
            </>,
            <>
              <strong>Varias barras en una página:</strong> cada una lleva un <code>aria-label</code> distinto para que los lectores de pantalla las diferencien.
            </>,
          ],
          avoid: [
            <>
              <strong>Pantallas anchas:</strong> la barra se estira al ancho del contenedor y deja de ser un patrón de pulgar. (Alternativa: <code>Header</code> o <code>SideBar</code>).
            </>,
            <>
              <strong>Más de cuatro destinos principales:</strong> la barra dibuja cuatro opciones, o tres con la hoja, que es para los secundarios. (Alternativa: <code>SideBar</code>).
            </>,
            <>
              <strong>Cambiar de contenido dentro de una página:</strong> la barra lleva a destinos de primer nivel. (Alternativa: <code>Tabs</code>).
            </>,
            <>
              <strong>Acciones como Guardar:</strong> una opción de la barra es un destino, no una acción. (Alternativa: <code>Button</code>).
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
                title: 'Cuatro opciones',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile. Ningún token de la barra cambia con el breakpoint.
                  </>,
                  <>
                    <strong>Medidas fijas:</strong> barra de 64, opciones de 40, ícono de 20 y texto de 10/14. Se diseña a 376 de ancho y ocupa el de su contenedor.
                  </>,
                ],
                preview: at376(bar('Barra en Desktop')),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Ancho:</strong> las opciones reparten el ancho de la barra por igual; el texto no baja de línea y el componente lo corta con puntos suspensivos: es un límite, así que el nombre debe caber.
              </>,
              <>
                <strong>Posición:</strong> la fija quien la usa, abajo de la pantalla, y la barra reserva su propio alto en el documento.
              </>,
            ],
            preview: at376(bar('Barra en Mobile')),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medidas fijas:</strong> la altura y el padding de 16 no cambian; solo crece el ancho que reparten las opciones.
              </>,
              <>
                <strong>Hoja &quot;más&quot;:</strong> con <code>moreItems</code> se comporta igual: el botón de 64 queda a 8 de la barra y abre la hoja sobre ella.
              </>,
            ],
            preview: at376(bar('Barra en Tablet', { items: ITEMS.slice(0, 3), moreItems: MORE })),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de la opción activa, el texto de las opciones y sus íconos.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Una opción activa',
              description: (
                <>
                  Deja siempre una opción activa con <code>defaultValue</code> o <code>value</code>: la barra dice en qué destino está la persona.
                </>
              ),
              preview: plain(bar('Con opción activa')),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Ninguna opción activa',
              description: (
                <>
                  No uses un <code>value</code> que no sea de ninguna opción: nada se marca y no se sabe en qué destino se está.
                </>
              ),
              preview: plain(bar('Sin opción activa', { defaultValue: 'otro' })),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Etiquetas de una palabra',
              description: 'Nombra cada opción con una sola palabra: el texto de 10 px no baja de línea.',
              preview: plain(bar('Etiquetas cortas')),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Etiquetas con frases',
              description: 'No uses frases: el componente las corta con puntos suspensivos y se pierde el destino.',
              preview: plain(bar('Etiquetas largas', { items: LONG_LABELS })),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Un ícono por opción',
              description: 'Elige un ícono distinto para cada destino: se reconocen de un vistazo.',
              preview: plain(bar('Íconos distintos')),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'El mismo ícono repetido',
              description: 'No repitas el ícono: obliga a leer cada texto para distinguir las opciones.',
              preview: plain(bar('Ícono repetido', { items: SAME_ICON })),
            },
          ],
        },
      ],
    },
  ],
};
