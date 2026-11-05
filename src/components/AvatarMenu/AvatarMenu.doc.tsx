import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { DropdownMenuItem } from '../DropdownMenu';
import type { DropdownMenuItemState } from '../DropdownMenu/DropdownMenu.types';
import { AvatarMenu } from './AvatarMenu';
import { AvatarMenuPanel } from './AvatarMenuPanel';

/*
 * Contenido de la página de documentación de Avatar menu (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`AvatarMenu.tsx`, `AvatarMenuPanel.tsx`, `AvatarMenu.types.ts`, `AvatarMenu.variants.ts`), luego
 * `AvatarMenu.docs.json`. Medidas: avatar de 48 (`md`) o 32 (`sm`); tarjeta con el ancho de su contenido, radio 24,
 * padding 32 en escritorio (24 en tableta, 20 en móvil), trazo de 1 (interior, sin ocupar espacio) y separación de 16 entre sus bloques; ítems de 34
 * de alto; la tarjeta se coloca a 8 px del avatar, alineada a su borde derecho.
 *
 * Las vistas dibujan la tarjeta estática (`AvatarMenuPanel`) en el flujo bajo un `AvatarMenu` cerrado: el menú real se
 * abre en la capa superior (`popover`) y no se puede medir dentro de un lienzo. Un `AvatarMenu` cerrado trae su tarjeta
 * oculta en el DOM; por eso los marcadores de la tarjeta se acotan con `[data-slot="panel"]`.
 * Diferencias con Figma: Figma no dibuja el foco de teclado (el código pone un contorno de 2 px), el Badge del avatar
 * está oculto en Figma y no existe en código, y el avatar de 32 (`size="sm"`) no tiene variante propia en Figma.
 */

// Figma: 12537:1567 (component set Avatar+dropdown (Atom))

type AvatarMenuProps = Partial<ComponentProps<typeof AvatarMenu>>;

const PERSON = { name: 'Hugo García', email: 'hugo.garcia@ejemplo.com' };

/** Ítems de ejemplo del slot List items; `state` fuerza el aspecto del primero (solo documentación). */
const items = (state?: DropdownMenuItemState) => (
  <>
    <DropdownMenuItem type="icon" icon="user" state={state}>
      Mi perfil
    </DropdownMenuItem>
    <DropdownMenuItem type="icon" icon="setting">
      Ajustes
    </DropdownMenuItem>
    <DropdownMenuItem type="icon" icon="message-question">
      Ayuda
    </DropdownMenuItem>
  </>
);

/** Avatar menu cerrado. `data-slot="trigger"` le da un selector estable a los marcadores. */
const trigger = (props: AvatarMenuProps = {}) => (
  <AvatarMenu {...PERSON} onLogout={() => {}} rootProps={{ 'data-slot': 'trigger' }} {...props}>
    {items()}
  </AvatarMenu>
);

/** Tarjeta en el flujo (sin capa superior). */
const panel = (props: Partial<ComponentProps<typeof AvatarMenuPanel>> = {}, state?: DropdownMenuItemState) => (
  <AvatarMenuPanel {...PERSON} onLogout={() => {}} {...props}>
    {items(state)}
  </AvatarMenuPanel>
);

/** Menú abierto: el avatar arriba y la tarjeta debajo, a 8 px y alineada a la derecha. */
const opened = (state?: DropdownMenuItemState, size: 'sm' | 'md' = 'md') => (
  <div className="flex flex-col items-end gap-ds-space-general-lg">
    {trigger({ size })}
    <div data-slot="panel">{panel({}, state)}</div>
  </div>
);

/** Avatar con el contorno de foco forzado: Figma no lo dibuja y `AvatarMenu` no tiene `state`. */
const focused = () => (
  <span className="inline-flex [&_button]:outline-2 [&_button]:outline-offset-2 [&_button]:outline-solid [&_button]:outline-ds-border-field-active">
    {trigger()}
  </span>
);

/** Fila de muestras con separación para las cotas. */
const row = (...children: ReactNode[]) => (
  <div className="flex items-end gap-ds-space-general-7xl">
    {children.map((child, i) => (
      <span key={i} className="inline-flex">
        {child}
      </span>
    ))}
  </div>
);

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Menú cerrado: solo se ve el avatar con las iniciales.',
    samples: [trigger()],
  },
  {
    label: 'Dropdown',
    tone: 'neutral',
    description: (
      <>
        Menú abierto: la tarjeta queda debajo del avatar. Se abre con <code>open</code> o <code>defaultOpen</code>; en uso, con clic, Enter, Espacio o las flechas.
      </>
    ),
    samples: [opened()],
  },
  {
    label: 'Focus',
    tone: 'accent',
    description: 'Al llegar con el teclado, el avatar suma un contorno de 2 px. Al cerrar el menú, el foco vuelve a él.',
    samples: [focused()],
  },
  {
    label: 'Hover',
    tone: 'accent',
    description: 'Es del ítem, no del avatar: al pasar el puntero o llegar con las flechas, el ítem toma su fondo de Hover.',
    samples: [<div key="panel">{panel({}, 'hover')}</div>],
  },
];

export const doc: ComponentDocContent = {
  name: 'Avatar menu',
  icon: 'user',
  classification: 'molecula',
  summary:
    'El Avatar menu es la molécula que abre el menú de perfil de la persona. Une un Avatar con iniciales y una tarjeta con su nombre, su correo o cargo y una lista de acciones, con cierre de sesión al final.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Un avatar que hace de disparador y, debajo, una tarjeta con la identidad de la persona, un divisor y el menú de acciones.',
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
                    { n: 1, selector: '[data-slot="trigger"] > button', side: 'left' },
                    { n: 2, selector: '[data-slot="panel"] [data-figma-part="Profile card"]', side: 'left' },
                    { n: 3, selector: '[data-slot="panel"] [data-figma-part="Avatar"]', side: 'left' },
                    { n: 4, selector: '[data-slot="panel"] [data-figma-part="Name"]', side: 'right' },
                    { n: 5, selector: '[data-slot="panel"] [data-figma-part="Divider"]', side: 'right' },
                    { n: 6, selector: '[data-slot="panel"] [role="menu"]', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: '[data-slot="trigger"]', to: '[data-slot="panel"]', axis: 'y' },
                    { kind: 'padding', selector: '[data-slot="panel"] [data-figma-part="Profile card"]', side: 'left' },
                    { kind: 'gap', from: '[data-slot="panel"] [data-figma-part="Container"]', to: '[data-slot="panel"] [data-figma-part="Divider"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Avatar:</strong> botón redondo de 48 px (<code>size=&quot;md&quot;</code>) con las iniciales de <code>name</code>. Recibe <code>aria-haspopup=&quot;menu&quot;</code>, <code>aria-expanded</code> y <code>aria-controls</code>. La tarjeta queda a 8 px (<code>space/general/lg</code>).
                </>,
                <>
                  <strong>Tarjeta:</strong> ancho según su contenido, radio de 24 (<code>radius/container/on-card</code>), trazo de 1 px (<code>border/general/md</code>) y padding de 32 (<code>space/container/on-canva</code>). Sus bloques van separados 16 px (<code>space/general/2xl</code>).
                </>,
                <>
                  <strong>Avatar de la tarjeta:</strong> iniciales en 24 px, a 8 px del nombre. Es decorativo.
                </>,
                <>
                  <strong>Nombre y correo:</strong> el nombre en 16 px semibold y el correo o cargo (<code>email</code>) en 12 px. Si no caben, se cortan con puntos suspensivos.
                </>,
                <>
                  <strong>Divisor:</strong> línea de 1 px (<code>border/general/md</code>) que separa la identidad del menú, con el color <code>border/general/default-on-card</code>. Es decorativo.
                </>,
                <>
                  <strong>Menú:</strong> los ítems de Dropdown menu que pasas como <code>children</code>, de 34 de alto, más el cierre de sesión (<code>onLogout</code>) 16 px más abajo.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Tamaños del avatar',
                  preview: row(trigger({ size: 'sm' }), trigger({ size: 'md' })),
                  marks: [
                    { n: 1, selector: '[data-slot="trigger"] > button', index: 0, side: 'top' },
                    { n: 2, selector: '[data-slot="trigger"] > button', index: 1, side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[data-slot="trigger"] > button', index: 0 },
                    { kind: 'height', selector: '[data-slot="trigger"] > button', index: 1 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Small:</strong> avatar de 32 px (<code>size=&quot;sm&quot;</code>), para espacios estrechos como el móvil. Las iniciales bajan a 12 px.
                </>,
                <>
                  <strong>Medium:</strong> avatar de 48 px (<code>size=&quot;md&quot;</code>, el valor por defecto), con las iniciales en 14 px.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Tarjeta (AvatarMenuPanel)',
                  preview: panel(),
                  marks: [
                    { n: 1, selector: '[role="menuitem"]', index: 0, side: 'left' },
                    { n: 2, selector: '[data-figma-part="Icon-sizes"]', index: 0, side: 'top' },
                    { n: 3, selector: '[role="menuitem"]', index: -1, side: 'left' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[role="menuitem"]', index: 0 },
                    { kind: 'gap', from: '[role="menuitem"]', fromIndex: 2, to: '[role="menuitem"]', toIndex: 3, axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Ítem:</strong> alto de 34, padding de 8 y radio de 12, con las medidas de Dropdown menu. Los ítems de tus <code>children</code> van sin separación entre sí.
                </>,
                <>
                  <strong>Ícono:</strong> 16 px en <code>type=&quot;icon&quot;</code>, a 8 px del texto. Es decorativo.
                </>,
                <>
                  <strong>Cerrar sesión:</strong> último ítem, con el ícono <code>logout2</code> y 16 px de separación sobre los demás. Sin <code>onLogout</code> no se dibuja.
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
          Avatar menu tiene 4 estados. Default y Dropdown son del conjunto: cerrado y abierto, los dos Type de Figma. Focus es del avatar y Hover, de cada ítem. Hover y Focus se fuerzan solo para documentar; en uso salen del teclado y del puntero.
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
              title: 'Avatar',
              preview: trigger(),
              entries: [
                { part: 'Fondo', color: 'background-acent-secondary' },
                { part: 'Iniciales', color: 'text-acent-secondary', text: 'typography-button-size-md' },
                { part: 'Contorno (Focus)', color: 'border-field-active' },
              ],
            },
            {
              title: 'Tarjeta',
              preview: panel(),
              entries: [
                { part: 'Fondo', color: 'background-container-default-on-canva' },
                { part: 'Trazo', color: 'border-general-default-on-card' },
                { part: 'Nombre', color: 'text-neutral-white', text: 'primitives-typography-size-lg' },
                { part: 'Correo o cargo', color: 'text-acent-firts', text: 'primitives-typography-size-sm' },
                { part: 'Divisor', color: 'border-general-default-on-card' },
              ],
            },
            {
              title: 'Ítem',
              preview: panel({}, 'hover'),
              entries: [
                { part: 'Texto', color: 'text-neutral-white', text: 'typography-field-size-sm' },
                { part: 'Ícono', color: 'icon-general-default' },
                { part: 'Fondo (Hover)', color: 'background-field-hover' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Avatar menu en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Avatar+dropdown (Atom) en la librería de Assets. Sus propiedades son Type, Name, Email or cargo y el slot List items.
            </>,
            <>
              <strong>Type:</strong> Default es el menú cerrado y Dropdown, el abierto. En código es <code>open</code> (controlado) o <code>defaultOpen</code>.
            </>,
            <>
              <strong>Name y Email or cargo:</strong> son <code>name</code> y <code>email</code>. <code>name</code> también da las iniciales del avatar y el nombre accesible del botón.
            </>,
            <>
              <strong>List items:</strong> el slot recibe los ítems de Dropdown list, que en código son <code>DropdownMenuItem</code> en <code>children</code>. El último ítem de Figma es <code>onLogout</code>.
            </>,
            <>
              <strong>Lo que Figma no tiene:</strong> el avatar de 32 px (<code>size=&quot;sm&quot;</code>), el foco de teclado (contorno de 2 px en código) ni el cierre con Escape o clic fuera.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Avatar menu es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Menú de la cuenta en la cabecera:</strong> perfil, ajustes, ayuda y cierre de sesión de la persona que usa la aplicación. Lo usa el Header.
            </>,
            <>
              <strong>Abrir con el teclado:</strong> Enter, Espacio o Flecha abajo abren y llevan el foco al primer ítem; Flecha arriba, al último. Flechas, Inicio y Fin recorren los ítems.
            </>,
            <>
              <strong>Cerrar:</strong> Escape y el clic fuera cierran y devuelven el foco al avatar; Tab cierra y sigue al elemento siguiente. Activar un ítem también cierra.
            </>,
            <>
              <strong>Nombre accesible:</strong> el botón se anuncia con las iniciales primero (&quot;HG, menú de perfil de Hugo García&quot;), para que coincida con lo que se ve. Con una foto en <code>avatar</code>, usa <code>label</code>.
            </>,
            <>
              <strong>Abrir desde fuera:</strong> <code>open</code> y <code>onOpenChange</code> controlan el menú, por ejemplo para cerrarlo al cambiar de página.
            </>,
          ],
          avoid: [
            <>
              <strong>Acciones sobre un elemento o una vista:</strong> duplicar o compartir no son de la cuenta. (Alternativa: <code>DropdownMenu</code>).
            </>,
            <>
              <strong>Un menú con otro disparador:</strong> el disparador es siempre el avatar. (Alternativa: <code>DropdownMenu</code> con <code>Dots</code> o <code>Button</code> como <code>trigger</code>).
            </>,
            <>
              <strong>Navegar por las secciones del sitio:</strong> la tarjeta es para la cuenta, no para el mapa del sitio. (Alternativa: <code>SideBar</code> o <code>Header</code>).
            </>,
            <>
              <strong>Elegir un valor de un formulario:</strong> el menú no guarda ni envía un valor. (Alternativa: <code>Select</code>).
            </>,
          ],
        },
      ],
    },
    {
      title: 'Aplicaciones de breakpoints',
      description: 'Cada vista se dibuja con los valores responsive de su breakpoint. Tablet comparte los tokens de Desktop salvo el padding de la tarjeta, que baja a 24.',
      blocks: [
        {
          type: 'breakpoints',
          desktop: {
            columns: [
              {
                title: 'Avatar y tarjeta',
                bullets: [
                  <>
                    <strong>Avatar de 48 px</strong> y tarjeta con padding de 32 y radio de 24.
                  </>,
                  <>
                    <strong>Abajo y a la derecha:</strong> el borde derecho de la tarjeta coincide con el del avatar, a 8 px. Si abajo no cabe, se abre arriba.
                  </>,
                ],
                preview: opened(),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Avatar de 32 px:</strong> pasa <code>size=&quot;sm&quot;</code>. La prop no cambia sola con el ancho.
              </>,
              <>
                <strong>Tarjeta más compacta:</strong> el padding baja a 20 y el radio, a 16.
              </>,
              <>
                <strong>Sin hoja inferior:</strong> es la misma tarjeta anclada al avatar. Se abre con un toque y se cierra al tocar fuera.
              </>,
            ],
            preview: opened(undefined, 'sm'),
          },
          tablet: {
            bullets: [
              <>
                <strong>Avatar de 48 px</strong> y tarjeta con el radio de 24 de Desktop.
              </>,
              <>
                <strong>Padding de 24:</strong> baja desde 32 (<code>space/container/on-canva</code>).
              </>,
              <>
                <strong>Entrada mixta:</strong> con puntero, toque o teclado se abre igual que en Desktop.
              </>,
            ],
            preview: opened(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de contenido de la tarjeta.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Acciones de la cuenta',
              description: 'Deja en el menú solo acciones de la cuenta: perfil, ajustes y ayuda.',
              preview: panel({ onLogout: undefined }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Secciones del sitio',
              description: 'No uses el menú para navegar: las secciones van en la navegación principal.',
              preview: (
                <AvatarMenuPanel {...PERSON}>
                  <DropdownMenuItem type="icon" icon="homepage">
                    Inicio
                  </DropdownMenuItem>
                  <DropdownMenuItem type="icon" icon="document">
                    Documentos
                  </DropdownMenuItem>
                  <DropdownMenuItem type="icon" icon="folder">
                    Proyectos
                  </DropdownMenuItem>
                </AvatarMenuPanel>
              ),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Cierre con onLogout',
              description: (
                <>
                  Cierra la sesión con <code>onLogout</code>: queda al final y separado de las demás acciones.
                </>
              ),
              preview: (
                <AvatarMenuPanel {...PERSON} onLogout={() => {}}>
                  <DropdownMenuItem type="icon" icon="user">
                    Mi perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem type="icon" icon="setting">
                    Ajustes
                  </DropdownMenuItem>
                </AvatarMenuPanel>
              ),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Cierre como ítem propio',
              description: 'No agregues Cerrar sesión como un ítem más: queda pegado a los demás.',
              preview: (
                <AvatarMenuPanel {...PERSON}>
                  <DropdownMenuItem type="icon" icon="user">
                    Mi perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem type="icon" icon="setting">
                    Ajustes
                  </DropdownMenuItem>
                  <DropdownMenuItem type="icon" icon="logout2">
                    Cerrar sesión
                  </DropdownMenuItem>
                </AvatarMenuPanel>
              ),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Nombre y cargo cortos',
              description: 'Escribe un nombre y un cargo breves, que se lean completos.',
              preview: panel({ name: 'Ana Pérez', email: 'Analista' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Textos largos',
              description: 'No pongas textos largos: el nombre y el correo se cortan.',
              preview: panel({ name: 'Ana María Pérez Rodríguez de la Torre', email: 'ana.maria.perez.rodriguez@ejemplo.com' }),
            },
          ],
        },
      ],
    },
  ],
};
