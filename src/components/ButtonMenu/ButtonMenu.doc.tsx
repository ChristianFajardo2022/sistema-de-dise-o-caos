import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { ButtonMenu } from './ButtonMenu';
import type { ButtonMenuState } from './ButtonMenu.types';

/*
 * Contenido de la página de documentación de ButtonMenu (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`ButtonMenu.types.ts`, `ButtonMenu.variants.ts`, `ButtonMenu.tsx`), luego `ButtonMenu.docs.json`. Medidas: alto 32
 * (padding vertical `space/button/lg` de 8 y un marco de texto de 16), sin padding horizontal, gap de 4 y texto de 14;
 * no cambian entre breakpoints (ningún token responsive que usa se redefine en Tablet ni en Desktop).
 * Diferencias con Figma: el set solo trae Type Default y dibuja Icon-left e Icon-rigth ocultos; el contorno de foco con
 * teclado (2 px) no existe en Figma y lo añade el código.
 */

// Figma: 12419:5959 (component set Button menu (Atom))

type MenuProps = Partial<ComponentProps<typeof ButtonMenu>>;

/** Botón de ejemplo: texto genérico y la combinación que pida cada muestra. */
const bm = (props: MenuProps = {}, label: ReactNode = 'Proyectos') => <ButtonMenu {...props}>{label}</ButtonMenu>;

/** Botón con submenú: lleva el chevron y expone `aria-expanded`. */
const submenu = (props: MenuProps = {}, label: ReactNode = 'Proyectos') =>
  bm({ iconRight: true, 'aria-expanded': false, ...props }, label);

/** Fila de navegación de ejemplo. */
const row = (...items: ReactNode[]) => (
  <div className="flex items-center gap-ds-space-general-2xl">{items.map((item, i) => (
      <Fragment key={i}>{item}</Fragment>
    ))}
  </div>
);

/** Una muestra sin chevron y otra con chevron, con el estado forzado. */
const stateSamples = (state: ButtonMenuState): ReactNode[] => [bm({ state }, 'Inicio'), submenu({ state })];

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo. Texto Regular en gris, sin fondo ni trazo.',
    samples: stateSamples('default'),
  },
  {
    label: 'Hover',
    tone: 'accent',
    description: 'Al pasar el puntero. El texto y el ícono toman el color de hover; el peso sigue Regular.',
    samples: stateSamples('hover'),
  },
  {
    label: 'Focus',
    tone: 'accent',
    description: (
      <>
        Al recibir el foco del teclado. El texto pasa a Semibold con el color de Focus y el botón se ensancha. El código añade un contorno de 2 px con <code>border/field/active</code>, que Figma no dibuja.
      </>
    ),
    samples: stateSamples('focus'),
  },
  {
    label: 'Press/select',
    tone: 'accent',
    description: (
      <>
        Al presionar, en la sección actual (<code>selected</code>) y con el submenú abierto (<code>aria-expanded=&quot;true&quot;</code>). Se ve igual que Focus, sin contorno.
      </>
    ),
    samples: stateSamples('press'),
  },
  {
    label: 'Inactive',
    tone: 'neutral',
    description: (
      <>
        No interactivo (<code>disabled</code>). Texto e ícono toman el color Inactive y el cursor cambia a no permitido.
      </>
    ),
    samples: [bm({ disabled: true }, 'Inicio'), submenu({ disabled: true })],
  },
];

export const doc: ComponentDocContent = {
  name: 'Button menu',
  icon: 'menu',
  classification: 'atomo',
  summary:
    'El Button menu es el átomo del menú de navegación principal. Es un texto sin fondo ni trazo que cambia de color al interactuar, con ícono opcional a la izquierda y chevron a la derecha. Es un enlace o un botón que abre un submenú.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una fila une el ícono opcional, el texto y el chevron opcional; no tiene fondo ni trazo.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Con ícono y chevron',
                  preview: submenu({ iconLeft: 'heart' }),
                  marks: [
                    { n: 1, selector: 'button', side: 'bottom' },
                    { n: 2, selector: '[data-figma-part="Icon-sizes"]', index: 0, side: 'top' },
                    { n: 3, selector: '[data-figma-part="Text-button"]', side: 'top' },
                    { n: 4, selector: '[data-figma-part="Icon-sizes"]', index: -1, side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: '[data-figma-part="Icon-sizes"]', fromIndex: 0, to: '[data-figma-part="Text-button"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> fila de 32 px de alto, con padding vertical <code>space/button/lg</code> (8 px) y sin padding horizontal (<code>space/general/xs</code>). Sin fondo, trazo ni radio. Es un <code>button</code> o, con <code>href</code>, un enlace <code>a</code>.
                </>,
                <>
                  <strong>Ícono izquierdo:</strong> opcional (<code>iconLeft</code>), de 16 px y en línea. Toma el color <code>icon/button/menu/*</code> del estado.
                </>,
                <>
                  <strong>Texto:</strong> marco de 16 px de alto (<code>dimention/button/container/xs</code>) con texto de 14 px. Es el nombre accesible del botón.
                </>,
                <>
                  <strong>Chevron:</strong> ícono <code>chevron-down</code> de 16 px (<code>iconRight</code>), solo en botones que abren un submenú. El gap entre ícono, texto y chevron es <code>gap/button/internal-margin-md</code> (4 px).
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Solo texto',
                  preview: bm({}, 'Inicio'),
                  marks: [
                    { n: 1, selector: 'button', side: 'bottom' },
                    { n: 2, selector: '[data-figma-part="Text-button"]', side: 'top' },
                  ],
                  dimensions: [{ kind: 'height', selector: 'button' }, { kind: 'padding', selector: 'button', side: 'bottom' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> es la forma que dibuja el set de Figma, con Icon-left e Icon-rigth ocultos. Mide 32 px de alto. El ancho sigue al texto y crece en Focus y Press/select, que pasan a Semibold.
                </>,
                <>
                  <strong>Texto:</strong> 14 px (<code>typography/button/size/md-uniform</code>), Regular en reposo y Semibold en Focus y Press/select.
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
          Button menu tiene 5 estados. Hover, Focus y Press/select se fuerzan con <code>state</code> solo para documentar; en uso salen de la interacción, de <code>selected</code> y de <code>aria-expanded</code>.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens por estado. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Default',
              preview: submenu({ state: 'default' }),
              entries: [
                { part: 'Texto', color: 'text-button-menu-default', text: 'typography-button-size-md-uniform' },
                { part: 'Ícono', color: 'icon-button-menu-default' },
              ],
            },
            {
              title: 'Hover',
              preview: submenu({ state: 'hover' }),
              entries: [
                { part: 'Texto', color: 'text-button-menu-hover' },
                { part: 'Ícono', color: 'icon-button-menu-hover' },
              ],
            },
            {
              title: 'Focus y Press/select',
              preview: submenu({ state: 'press' }),
              entries: [
                { part: 'Texto', color: 'text-button-menu-focus-press-select' },
                { part: 'Ícono', color: 'icon-button-menu-focus-press-select' },
                { part: 'Contorno (aparece en Focus con teclado)', color: 'border-field-active' },
              ],
            },
            {
              title: 'Inactive',
              preview: submenu({ state: 'inactive' }),
              entries: [
                { part: 'Texto', color: 'text-button-menu-inactive' },
                { part: 'Ícono', color: 'icon-button-menu-inactive' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Button menu en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Button menu (Atom) en la librería de Assets y arrástralo al lienzo. Sus propiedades son Text, Icon-left, Icon-rigth, Type y State.
            </>,
            <>
              <strong>Text, Icon-left e Icon-rigth:</strong> Text es el contenido (<code>children</code>). Icon-left equivale a <code>iconLeft</code>, que recibe el nombre del ícono. Icon-rigth, un booleano, equivale a <code>iconRight</code> y dibuja el chevron.
            </>,
            <>
              <strong>State:</strong> Default, Hover y Focus salen de la interacción. Press/select equivale a <code>selected</code> o a <code>aria-expanded=&quot;true&quot;</code>, e Inactive, a <code>disabled</code>. Con <code>state</code> se fuerza el aspecto solo para documentar.
            </>,
            <>
              <strong>Diferencias con el código:</strong> Type solo tiene Default, así que el enlace y el botón con submenú no se distinguen en Figma. Figma tampoco dibuja el contorno de foco de 2 px ni deja Icon-left e Icon-rigth visibles por defecto.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Button menu es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Navegar a otra página:</strong> con <code>href</code> es un enlace. Marca la sección actual con <code>selected</code>, que añade <code>aria-current=&quot;page&quot;</code> (en un <code>button</code>, <code>aria-current=&quot;true&quot;</code>).
            </>,
            <>
              <strong>Abrir un submenú:</strong> sin <code>href</code> es un botón. Pasa <code>iconRight</code>, <code>aria-expanded</code> y <code>aria-controls</code>; el submenú lo arma <code>DropdownMenu</code> o el Header.
            </>,
            <>
              <strong>Reforzar el texto con un ícono:</strong> <code>iconLeft</code> dibuja un ícono de 16 px antes del texto. El ícono es decorativo y el texto sigue siendo el nombre accesible.
            </>,
            <>
              <strong>Desactivar una sección:</strong> <code>disabled</code> atenúa el botón. En un enlace se quita el <code>href</code>, se expone <code>aria-disabled</code> y sale del orden de Tab.
            </>,
          ],
          avoid: [
            <>
              <strong>Acciones de la página, como guardar o enviar:</strong> el Button menu no tiene fondo ni trazo y no destaca. (Alternativa: <code>Button</code>).
            </>,
            <>
              <strong>Enlaces dentro de un texto:</strong> su caja de 32 px no sigue el renglón. (Alternativa: <code>ButtonLink</code>).
            </>,
            <>
              <strong>Entradas solo con ícono:</strong> el Button menu siempre lleva texto. (Alternativa: <code>ButtonCorner</code> o <code>Dots</code>).
            </>,
            <>
              <strong>Menú de la cuenta de la persona:</strong> necesita imagen y lista propias. (Alternativa: <code>AvatarMenu</code>).
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
                title: 'Enlace',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Caja:</strong> 32 px de alto y el ancho del texto, que es de 14 px en todos los breakpoints (<code>-uniform</code>).
                  </>,
                ],
                preview: bm({ href: '#inicio', selected: true }, 'Inicio'),
              },
              {
                title: 'Botón con submenú',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Chevron:</strong> 16 px, a 4 px del texto en todos los breakpoints.
                  </>,
                ],
                preview: submenu(),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Caja:</strong> 32 px de alto, con padding vertical de 8 px y sin padding horizontal.
              </>,
              <>
                <strong>Texto:</strong> 14 px, sin ajuste de línea (<code>whitespace-nowrap</code>); el ancho disponible lo gestiona quien lo contiene.
              </>,
            ],
            preview: submenu(),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Caja:</strong> 32 px de alto, con padding vertical de 8 px y sin padding horizontal.
              </>,
              <>
                <strong>Texto:</strong> 14 px, sin ajuste de línea (<code>whitespace-nowrap</code>); el ancho disponible lo gestiona quien lo contiene.
              </>,
            ],
            preview: submenu(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de longitud del texto, uso del chevron y sección actual.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Una o dos palabras',
              description: 'Deja el texto en una o dos palabras para que la fila quepa.',
              preview: row(bm({ href: '#docs' }, 'Documentos'), bm({ href: '#ajustes' }, 'Ajustes')),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Texto largo',
              description: 'No escribas una frase: no se parte en renglones y empuja el resto de la fila.',
              preview: row(bm({ href: '#docs' }, 'Documentos compartidos del equipo'), bm({ href: '#ajustes' }, 'Ajustes')),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Chevron con submenú',
              description: 'Pon el chevron solo en el botón que abre un submenú.',
              preview: row(bm({ href: '#inicio' }, 'Inicio'), submenu({ 'aria-controls': 'submenu-proyectos' })),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Chevron en un enlace',
              description: 'No pongas chevron en un enlace: promete un submenú que no existe.',
              preview: row(bm({ href: '#inicio', iconRight: true }, 'Inicio'), submenu({ 'aria-controls': 'submenu-proyectos' })),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Una sección actual',
              description: 'Marca solo la página donde está la persona.',
              preview: row(bm({ href: '#inicio', selected: true }, 'Inicio'), bm({ href: '#docs' }, 'Documentos'), bm({ href: '#ayuda' }, 'Ayuda')),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Varias secciones actuales',
              description: 'No marques varias: se pierde la referencia de dónde estás.',
              preview: row(bm({ href: '#inicio', selected: true }, 'Inicio'), bm({ href: '#docs', selected: true }, 'Documentos'), bm({ href: '#ayuda' }, 'Ayuda')),
            },
          ],
        },
      ],
    },
  ],
};
