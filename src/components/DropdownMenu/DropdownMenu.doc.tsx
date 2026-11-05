import type { ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Avatar } from '../Avatar';
import { PHOTO_SRC } from '../Avatar/Avatar.sample-data';
import type { PhotoName } from '../Avatar/Avatar.sample-data';
import { Button } from '../Button';
import type { IconName } from '../Icon/Icon.types';
import { DropdownMenuItem } from './DropdownMenuItem';
import { DropdownMenuList } from './DropdownMenuList';
import { DropdownMenuNavList } from './DropdownMenuNavList';
import { DropdownMenuPanel } from './DropdownMenuPanel';
import type { DropdownMenuItemState, DropdownMenuPanelProps } from './DropdownMenu.types';

/*
 * Contenido de la página de documentación de Dropdown menu (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`DropdownMenu.tsx`, `DropdownMenuPanel.tsx`, `DropdownMenuItem.tsx`, `DropdownMenu.types.ts`,
 * `DropdownMenu.variants.ts`), luego `DropdownMenu.docs.json`. Medidas: panel de 310 de ancho, radio 16, trazo interior
 * de 1 y sombra md; padding 8 (a los lados `space/field/sm`, 4 en Mobile); ítems de 34 de alto (40 con avatar), padding
 * 8, radio 12 y texto 14/18, separados 4 (8 con avatar o con búsqueda); riel de 6; 4 px entre el disparador y el panel.
 *
 * Las piezas (DropdownMenuPanel, DropdownMenuItem, DropdownMenuList y DropdownMenuNavList) se documentan en esta página.
 * Las vistas usan el panel estático (`DropdownMenuPanel`) en el flujo: el `DropdownMenu` real se abre en la capa superior
 * (`popover`) y no se puede medir ni recortar dentro de un lienzo.
 * Diferencias con Figma: Figma no dibuja el foco de teclado (el código pone un contorno interior de 2 px), ni el
 * disparador, ni DropdownMenuList y DropdownMenuNavList; Item del panel no es una prop en código (cada ítem lleva su
 * `type`).
 */

// Figma: 11673:7804 (component set Dropdown, el panel) y 12174:13662 (component set Dropdown list, el ítem)

interface ItemData {
  label: string;
  icon: IconName;
  disabled?: boolean;
}

const ACTIONS: ItemData[] = [
  { label: 'Duplicar', icon: 'document-copy' },
  { label: 'Compartir', icon: 'share' },
  { label: 'Archivar', icon: 'archive', disabled: true },
];

const PEOPLE: { name: string; photo: PhotoName }[] = [
  { name: 'Ana Pérez', photo: 'Woman_1' },
  { name: 'Hugo García', photo: 'Men_1' },
  { name: 'Lucía Torres', photo: 'Woman_2' },
  { name: 'Mateo Ruiz', photo: 'Men_2' },
  { name: 'Sara Molina', photo: 'Woman_3' },
  { name: 'Diego Vega', photo: 'Men_3' },
];

const photo = (name: PhotoName) => <Avatar variant="photo" size="xs" src={PHOTO_SRC[name]} alt="" />;

/** Panel en el flujo (sin capa superior). `data-figma` le da un selector estable a los marcadores. */
const panel = (children: ReactNode, props: Partial<DropdownMenuPanelProps> = {}) => (
  <DropdownMenuPanel aria-label="Acciones" data-figma="Dropdown" {...props}>
    {children}
  </DropdownMenuPanel>
);

/** Las mismas acciones, todas habilitadas (muestras de Estados salvo Disabled). */
const ENABLED: ItemData[] = ACTIONS.map((item) => ({ ...item, disabled: false }));

/**
 * Ítems de acciones con ícono; `state` fuerza el aspecto del primero. El texto va en un `span` propio
 * (`data-slot="text"`) para que el marcador de Anatomía caiga sobre el texto y no en el borde de la fila.
 */
const actions = (state?: DropdownMenuItemState, list: ItemData[] = ACTIONS) =>
  list.map((item, i) => (
    <DropdownMenuItem key={item.label} type="icon" icon={item.icon} disabled={item.disabled} state={i === 0 ? state : undefined}>
      <span data-slot="text">{item.label}</span>
    </DropdownMenuItem>
  ));

/** Ítems solo con texto. */
const texts = (labels: string[]) => labels.map((label) => <DropdownMenuItem key={label}>{label}</DropdownMenuItem>);

/** Disparador de ejemplo. */
const trigger = () => (
  <Button variant="secondary" size="sm" data-slot="trigger">
    Acciones
  </Button>
);

/** Menú abierto: el disparador arriba y el panel debajo, a 4 px y alineado a la derecha (`align="end"`). */
const opened = (state?: DropdownMenuItemState, list: ItemData[] = ACTIONS) => (
  <div className="flex flex-col items-end gap-ds-space-general-md">
    {trigger()}
    {panel(actions(state, list))}
  </div>
);

/** Panel con búsqueda y casillas: selección múltiple de personas. */
const searchPanel = (count = 3) =>
  panel(
    PEOPLE.slice(0, count).map((p, i) => (
      <DropdownMenuItem key={p.name} type="checkbox" defaultChecked={i === 0}>
        {p.name}
      </DropdownMenuItem>
    )),
    { type: 'search', 'aria-label': 'Personas', searchLabel: 'Buscar personas' }
  );

/** Un ítem de cada tipo. */
const itemTypes = () =>
  panel(
    <>
      <DropdownMenuItem>Renombrar</DropdownMenuItem>
      <DropdownMenuItem type="icon" icon="document-copy">
        Duplicar
      </DropdownMenuItem>
      <DropdownMenuItem type="checkbox" defaultChecked>
        Mostrar archivados
      </DropdownMenuItem>
      <DropdownMenuItem type="radio" defaultChecked>
        Más recientes
      </DropdownMenuItem>
      <DropdownMenuItem type="avatar" avatar={photo('Woman_1')}>
        Ana Pérez
      </DropdownMenuItem>
      <DropdownMenuItem type="dropdown">Ordenar por</DropdownMenuItem>
    </>,
    { 'aria-label': 'Opciones de la vista', scrollbar: false, maxHeight: 'none' }
  );

/** DropdownMenuList dentro de otra superficie y DropdownMenuNavList dentro de una navegación. */
const pieces = () => (
  <>
    <div className="rounded-ds-radius-field-md bg-ds-background-field-surface p-ds-space-field-sm">
      <DropdownMenuList aria-label="Opciones de la cuenta" className="flex flex-col gap-1">
        <DropdownMenuItem type="icon" icon="user">
          Mi perfil
        </DropdownMenuItem>
        <DropdownMenuItem type="icon" icon="setting" href="#ajustes">
          Ajustes
        </DropdownMenuItem>
      </DropdownMenuList>
    </div>
    <nav aria-label="Documentos" className="rounded-ds-radius-field-md bg-ds-background-field-surface p-ds-space-field-sm">
      <DropdownMenuNavList className="gap-1">
        <li>
          <DropdownMenuItem href="#recientes">Recientes</DropdownMenuItem>
        </li>
        <li>
          <DropdownMenuItem href="#compartidos" selected>
            Compartidos
          </DropdownMenuItem>
        </li>
      </DropdownMenuNavList>
    </nav>
  </>
);

const states: DocStateItem[] = [
  {
    label: 'Oculto',
    tone: 'neutral',
    description:
      'Reposo. Solo se ve el disparador; el panel ya está en el DOM. Escape, clic fuera, Tab o elegir un ítem lo cierran.',
    samples: [trigger()],
  },
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Panel abierto con los ítems en reposo. Al abrir, el foco va al ítem elegido o, si no hay, al primero.',
    samples: [opened(undefined, ENABLED)],
  },
  {
    label: 'Hover',
    tone: 'accent',
    description: 'Al pasar el puntero o al llegar con las flechas. Con el teclado suma un contorno interior de 2 px.',
    samples: [panel(actions('hover', ENABLED))],
  },
  {
    label: 'Select',
    tone: 'accent',
    description: (
      <>
        El ítem elegido: <code>selected</code>, o <code>checked</code> en casillas y radios.
      </>
    ),
    samples: [panel(actions('select', ENABLED))],
  },
  {
    label: 'Disabled',
    tone: 'neutral',
    description: (
      <>
        Con <code>disabled</code>, texto e ícono atenuados. Las flechas lo saltan y no se activa.
      </>
    ),
    samples: [panel(actions())],
  },
];

export const doc: ComponentDocContent = {
  name: 'Dropdown menu',
  icon: 'more-circle',
  classification: 'molecula',
  summary:
    'El Dropdown menu es la molécula que abre, junto a un disparador, un panel con acciones u opciones. Une el panel, los ítems y un campo de búsqueda opcional; sus piezas llevan los mismos ítems a otras superficies.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Un disparador y un panel anclado debajo, con ítems de Dropdown list y, si hace falta, un campo de búsqueda.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Menú abierto',
                  preview: opened(),
                  marks: [
                    { n: 1, selector: '[data-slot="trigger"]', side: 'left' },
                    { n: 2, selector: '[data-figma="Dropdown"]', side: 'left' },
                    { n: 3, selector: '[data-item-type]', index: 1, side: 'left' },
                    { n: 4, selector: '[data-figma-part="Icon-sizes"]', index: 2, side: 'bottom' },
                    { n: 5, selector: '[data-slot="text"]', index: 0, side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: '[data-slot="trigger"]', to: '[data-figma="Dropdown"]', axis: 'y' },
                    { kind: 'padding', selector: '[data-figma="Dropdown"]', side: 'left' },
                    { kind: 'height', selector: '[data-item-type]', index: 0 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Disparador:</strong> un elemento que reenvía <code>ref</code> y props, como Button o AvatarPlus (<code>trigger</code>). Recibe <code>aria-expanded</code>, <code>aria-controls</code> y <code>aria-haspopup=&quot;menu&quot;</code>. El panel queda a 4 px (<code>offset</code>).
                </>,
                <>
                  <strong>Panel:</strong> 310 de ancho, radio de 16 (<code>radius/field/md</code>), trazo interior de 1 y sombra md. Padding de 8 arriba y abajo (<code>space/general/lg</code>) y a los lados (<code>space/field/sm</code>).
                </>,
                <>
                  <strong>Ítem:</strong> alto de 34, padding de 8 (<code>space/general/lg</code>) y radio de 12 (<code>radius/field/sm</code>). Los ítems van separados 4 px.
                </>,
                <>
                  <strong>Ícono:</strong> de 16 px en fill (<code>icon</code>), a 8 px del texto. Es decorativo.
                </>,
                <>
                  <strong>Texto:</strong> 14/18 regular (<code>typography/field/size/sm</code>). Si no cabe, se corta con puntos suspensivos.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Panel con búsqueda',
                  preview: searchPanel(),
                  marks: [
                    { n: 1, selector: '[data-figma="Dropdown"] > :first-child', side: 'top' },
                    { n: 2, selector: '[data-figma-part="Selection"]', index: 0, side: 'left' },
                    { n: 3, selector: '[data-item-type]', index: 0, side: 'bottom' },
                    { n: 4, selector: '[data-figma-part="Check List"]', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma="Dropdown"]', side: 'top' },
                    { kind: 'gap', from: '[data-figma="Dropdown"] > :first-child', to: '[data-figma-part="Check List"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Campo de búsqueda:</strong> Input de 48 de alto con ícono de lupa y label (<code>searchLabel</code>, &quot;Buscar&quot; por defecto). Lo activa <code>type=&quot;search&quot;</code>; filtrar los ítems lo hace quien usa el menú.
                </>,
                <>
                  <strong>Casilla:</strong> control de 16 px de los ítems <code>checkbox</code> y <code>radio</code>, a 8 px del texto. Marcar una casilla no cierra el panel.
                </>,
                <>
                  <strong>Ítem marcado:</strong> fondo del estado Select. Con búsqueda, los ítems van separados 8 px (<code>space/field/sm</code>).
                </>,
                <>
                  <strong>Riel de scroll:</strong> 6 de ancho, a 8 px de los ítems (<code>scrollbar</code>). El área crece hasta 20rem de alto (<code>maxHeight</code>) y luego se desplaza.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Tipos de ítem (DropdownMenuItem)',
                  preview: itemTypes(),
                  marks: [
                    { n: 1, selector: '[data-item-type="simple"] [data-figma-part="Text item"]', side: 'right' },
                    { n: 2, selector: '[data-item-type="icon"] [data-figma-part="Icon-sizes"]', side: 'left' },
                    { n: 3, selector: '[data-item-type="checkbox"] [data-figma-part="Selection"]', side: 'left' },
                    { n: 4, selector: '[data-item-type="radio"] [data-figma-part="Selection"]', side: 'left' },
                    { n: 5, selector: '[data-figma-part="Avatar"]', side: 'left' },
                    { n: 6, selector: '[data-item-type="dropdown"] [data-figma-part="Icon-sizes"]', side: 'right' },
                  ],
                  dimensions: [{ kind: 'height', selector: '[data-item-type="avatar"]' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Simple:</strong> solo texto (<code>type=&quot;simple&quot;</code>, el valor por defecto). Es un <code>menuitem</code>; con <code>href</code>, un enlace real.
                </>,
                <>
                  <strong>Icon:</strong> ícono de 16 px y texto (<code>type=&quot;icon&quot;</code>). Es el List Item simple con Icono activo en Figma.
                </>,
                <>
                  <strong>Checkbox:</strong> casilla cuadrada (<code>type=&quot;checkbox&quot;</code>, rol <code>menuitemcheckbox</code>). Se marcan varias y el panel sigue abierto.
                </>,
                <>
                  <strong>Radio:</strong> casilla redonda (<code>type=&quot;radio&quot;</code>, rol <code>menuitemradio</code>). Elegirla cierra el panel.
                </>,
                <>
                  <strong>Avatar:</strong> avatar de 24 px (<code>avatar</code>) y texto. El ítem mide 40 de alto y, con avatares, los ítems se separan 8 px.
                </>,
                <>
                  <strong>Dropdown:</strong> texto y chevron-down de 16 px a la derecha (<code>type=&quot;dropdown&quot;</code>).
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Piezas para otras superficies',
                  preview: pieces(),
                  marks: [
                    { n: 1, selector: '[role="menu"]', side: 'left' },
                    { n: 2, selector: 'a[role="menuitem"]', side: 'bottom' },
                    { n: 3, selector: 'ul', side: 'right' },
                    { n: 4, selector: '[aria-current="page"]', side: 'bottom' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>DropdownMenuList:</strong> los ítems con rol <code>menu</code> y el teclado del menú, sin panel ni disparador. La superficie la pone quien la usa, como el menú de perfil de AvatarMenu.
                </>,
                <>
                  <strong>Ítem con enlace:</strong> con <code>href</code>, el ítem es un <code>&lt;a&gt;</code> con rol <code>menuitem</code>. Enter o Espacio lo siguen y cierran la superficie (<code>onClose</code>).
                </>,
                <>
                  <strong>DropdownMenuNavList:</strong> lista <code>&lt;ul&gt;</code> de enlaces de navegación con el aspecto de Dropdown list, sin roles de menú. Cada ítem va en su propio <code>&lt;li&gt;</code>.
                </>,
                <>
                  <strong>Página actual:</strong> <code>selected</code> la marca con el fondo de Select y <code>aria-current=&quot;page&quot;</code>. Los enlaces siguen el orden de Tab.
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
          Dropdown menu tiene 5 estados. Oculto es del panel; Default, Hover, Select y Disabled, de cada ítem (State de Dropdown list). Hover y Select se fuerzan con <code>state</code> solo para documentar; en uso salen del puntero, del teclado, de <code>selected</code> y de <code>checked</code>. Disabled sale de <code>disabled</code>.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del panel, del ítem en cada estado, de las casillas y del campo de búsqueda. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Panel',
              preview: panel(actions()),
              entries: [
                { part: 'Fondo', color: 'background-field-surface' },
                { part: 'Trazo', color: 'border-general-default-on-card' },
                { part: 'Sombra (en oscuro es transparente: el panel se separa por el trazo)', color: 'effect-shadow-on-canva-md' },
                { part: 'Riel', color: 'background-general-gray-sixth' },
                { part: 'Barra del riel', color: 'background-general-gray-firts' },
              ],
            },
            {
              title: 'Ítem',
              preview: panel(actions('hover', [ACTIONS[0], { label: 'Compartir', icon: 'share' }])),
              entries: [
                { part: 'Texto', color: 'text-neutral-white', text: 'typography-field-size-sm' },
                { part: 'Ícono', color: 'icon-general-default' },
                { part: 'Fondo (Hover)', color: 'background-field-hover' },
                { part: 'Fondo (Select)', color: 'background-field-active-slow-contrast' },
                { part: 'Texto (Disabled)', color: 'text-neutral-disabled-on-canva' },
                { part: 'Ícono (Disabled)', color: 'icon-general-disabled-positive' },
                { part: 'Contorno (foco con teclado)', color: 'border-field-active' },
              ],
            },
            {
              title: 'Checkbox y radio',
              preview: itemTypes(),
              entries: [
                { part: 'Anillo', color: 'background-field-surface-tertiary' },
                { part: 'Relleno o anillo marcado', color: 'background-field-active-high-contrast' },
                { part: 'Check', color: 'icon-general-black' },
                { part: 'Casilla (Disabled)', color: 'background-field-disabled' },
              ],
            },
            {
              title: 'Búsqueda',
              preview: searchPanel(2),
              entries: [
                { part: 'Borde del campo', color: 'border-general-gray-fourth' },
                { part: 'Label', color: 'text-field-label', text: 'typography-field-size-md' },
                { part: 'Ícono de lupa', color: 'icon-general-default' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Dropdown menu en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Dropdown en la librería de Assets. Sus propiedades son Type, Item, Scroll bar y el slot Check List con los ítems.
            </>,
            <>
              <strong>Type y Scroll bar:</strong> Type es <code>type</code> (Simple o Search) y Scroll bar es <code>scrollbar</code>. Item (Simple, Icon, Checkbox o Avatar) no es una prop del panel: cada <code>DropdownMenuItem</code> lleva su <code>type</code>.
            </>,
            <>
              <strong>Dropdown list:</strong> el set del ítem es <code>DropdownMenuItem</code>. Su Type (List Item simple, Checkbox, RadioButton, Avatar o Dropdown) es <code>type</code>, y con Icono activo List Item simple es <code>type=&quot;icon&quot;</code>. Text item es <code>children</code>. State sale de la interacción y de <code>selected</code>, <code>checked</code> y <code>disabled</code>.
            </>,
            <>
              <strong>Lo que Figma no tiene:</strong> el disparador, la posición junto a él, el foco de teclado (contorno de 2 px en código) ni las piezas para otras superficies. El set Dropdown menu, fuera del lienzo, quedó reemplazado por Dropdown.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Dropdown menu es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Acciones sobre un elemento o una vista:</strong> duplicar, compartir o archivar. Patrón Menu Button: Enter, Espacio o Flecha abajo abren y enfocan el primer ítem; Flecha arriba, el último.
            </>,
            <>
              <strong>Recorrer con el teclado:</strong> flechas con vuelta, Inicio, Fin y la letra inicial. Escape cierra y devuelve el foco al disparador; Tab cierra y sigue al elemento siguiente.
            </>,
            <>
              <strong>Varias opciones con búsqueda:</strong> <code>type=&quot;search&quot;</code> con ítems <code>checkbox</code>. El foco entra al campo y Flecha abajo pasa a los ítems.
            </>,
            <>
              <strong>Lista informativa:</strong> <code>mode=&quot;list&quot;</code> muestra ítems que no se activan, como las personas ocultas tras el &quot;+N&quot; de AvatarGroup. El foco se queda en el disparador.
            </>,
            <>
              <strong>Panel no modal:</strong> no atrapa el foco, no lleva <code>aria-modal</code> ni bloquea el scroll. Un clic fuera lo cierra.
            </>,
          ],
          avoid: [
            <>
              <strong>Elegir un valor de un formulario:</strong> el menú no guarda ni envía un valor. (Alternativa: <code>Select</code>).
            </>,
            <>
              <strong>Una o dos acciones frecuentes:</strong> esconderlas suma un paso. (Alternativa: <code>Button</code>).
            </>,
            <>
              <strong>Enlaces de navegación del sitio:</strong> un lector de pantalla los anunciaría como acciones de menú. (Alternativa: <code>DropdownMenuNavList</code>).
            </>,
            <>
              <strong>Formularios o contenido libre:</strong> el panel solo admite ítems. (Alternativa: <code>Popover</code>).
            </>,
            <>
              <strong>Un texto de ayuda:</strong> los ítems son acciones u opciones, no explicaciones. (Alternativa: <code>Tooltip</code>).
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
                title: 'Menú de acciones',
                bullets: [
                  <>
                    <strong>Panel de 310</strong> con padding de 8 por todos lados e ítems de 34 de alto separados 4 px.
                  </>,
                  <>
                    <strong>Abajo y a la derecha:</strong> el borde derecho del panel coincide con el del disparador (<code>align=&quot;end&quot;</code>). Si abajo no cabe, se abre arriba.
                  </>,
                ],
                preview: opened(),
              },
              {
                title: 'Con búsqueda',
                bullets: [
                  <>
                    <strong>Padding y separación de 8</strong> (<code>space/field/sm</code>) entre el campo, los ítems y el borde.
                  </>,
                  <>
                    <strong>Campo de 48</strong> de alto en todos los breakpoints; el área de ítems crece hasta 20rem y luego se desplaza.
                  </>,
                ],
                preview: searchPanel(),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Padding de 4:</strong> <code>space/field/sm</code> baja a 4 a los lados del panel simple y en todo el panel con búsqueda, también entre sus ítems.
              </>,
              <>
                <strong>Ancho:</strong> 310, o la pantalla menos 8 px a cada lado. El panel no se sale de la pantalla.
              </>,
              <>
                <strong>Sin hoja inferior:</strong> es el mismo panel anclado al disparador. Abre con un toque y cierra al tocar fuera.
              </>,
            ],
            preview: searchPanel(),
          },
          tablet: {
            bullets: [
              <>
                <strong>Medidas:</strong> las mismas de Desktop, con padding de 8.
              </>,
              <>
                <strong>Entrada mixta:</strong> con puntero, toque o teclado se abre igual que en Desktop.
              </>,
              <>
                <strong>Bordes de la pantalla:</strong> el panel sigue al disparador al desplazar la página y pasa arriba si abajo no cabe.
              </>,
            ],
            preview: opened(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de texto de los ítems, íconos y búsqueda.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Ítems que nombran la acción',
              description: 'Escribe ítems cortos en infinitivo que se lean completos.',
              preview: panel(texts(['Duplicar', 'Compartir', 'Mover'])),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Ítems largos',
              description: 'No escribas frases en los ítems: se cortan con puntos suspensivos.',
              preview: panel(
                texts([
                  'Duplicar este documento en la misma carpeta',
                  'Compartir este documento con otras personas',
                  'Mover este documento a otra carpeta',
                ])
              ),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Íconos en todos los ítems',
              description: 'Usa ícono en todos los ítems o en ninguno, para que los textos se alineen.',
              preview: panel(actions(undefined, [ACTIONS[0], ACTIONS[1], { label: 'Mover', icon: 'folder' }])),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Íconos mezclados',
              description: 'No mezcles ítems con y sin ícono: los textos empiezan en lugares distintos.',
              preview: panel(
                <>
                  <DropdownMenuItem type="icon" icon="document-copy">
                    Duplicar
                  </DropdownMenuItem>
                  <DropdownMenuItem>Compartir</DropdownMenuItem>
                  <DropdownMenuItem type="icon" icon="folder">
                    Mover
                  </DropdownMenuItem>
                </>
              ),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Búsqueda en una lista larga',
              description: 'Agrega la búsqueda cuando la lista es larga, como las personas de un equipo.',
              preview: searchPanel(6),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Búsqueda con dos ítems',
              description: 'No pongas búsqueda en una lista corta: ocupa espacio y no ahorra pasos.',
              preview: searchPanel(2),
            },
          ],
        },
      ],
    },
  ],
};
