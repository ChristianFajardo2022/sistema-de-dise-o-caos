import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { CheckboxTree } from './CheckboxTree';
import type { CheckboxTreeNode } from './CheckboxTree.types';

/*
 * Contenido de la página de documentación de CheckboxTree (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`CheckboxTree.types.ts`, `CheckboxTree.variants.ts`, `CheckboxTree.tsx`), luego `CheckboxTree.docs.json`.
 * Diferencias con Figma: el tipo Selection tree no dibuja el estado mixto ni el foco; el código los toma de Checkbox.
 * En Mobile, Figma baja el gap entre filas a 12 px (`gap/general/xl`) y el código lo deja en 16 px
 * (`space/general/2xl`, que no cambia por breakpoint).
 */

// Figma: 13874:43337 (component set Atoms, variante Type=Selection tree 14015:46215)

type TreeProps = Partial<ComponentProps<typeof CheckboxTree>>;

/** Rama de ejemplo con dos hojas. */
const documentos = (...hojas: CheckboxTreeNode[]): CheckboxTreeNode => ({
  value: 'documentos',
  label: 'Documentos',
  children: hojas.length ? hojas : [{ value: 'informes', label: 'Informes' }, { value: 'contratos', label: 'Contratos' }],
});

/** Árbol de ejemplo: dos ramas, como Figma. */
const ITEMS: CheckboxTreeNode[] = [
  documentos({ value: 'informes', label: 'Informes' }, { value: 'contratos', label: 'Contratos' }, { value: 'actas', label: 'Actas' }),
  {
    value: 'imagenes',
    label: 'Imágenes',
    children: [
      { value: 'fotos', label: 'Fotos' },
      { value: 'capturas', label: 'Capturas' },
    ],
  },
];

/** Una sola rama: muestras compactas para Estados. */
const ONE: CheckboxTreeNode[] = [documentos()];

/** Tres niveles de profundidad. */
const NESTED: CheckboxTreeNode[] = [
  {
    value: 'todos',
    label: 'Todos los espacios',
    children: [
      { value: 'diseno', label: 'Diseño', children: [{ value: 'diseno-1', label: 'Equipo 1' }, { value: 'diseno-2', label: 'Equipo 2' }] },
      { value: 'producto', label: 'Producto', children: [{ value: 'producto-1', label: 'Equipo 3' }] },
    ],
  },
];

/** Cuatro niveles: el ejemplo de lo que se evita. */
const DEEP: CheckboxTreeNode[] = [
  {
    value: 'a',
    label: 'Archivos',
    children: [
      {
        value: 'b',
        label: 'Documentos',
        children: [{ value: 'c', label: 'Informes', children: [{ value: 'd', label: 'Anuales' }, { value: 'e', label: 'Mensuales' }] }],
      },
    ],
  },
];

/** Dos niveles: el ejemplo de lo que se prefiere. */
const SHALLOW: CheckboxTreeNode[] = [
  documentos({ value: 'informes', label: 'Informes' }, { value: 'contratos', label: 'Contratos' }),
];

/** Lista plana: sin grupos. */
const FLAT: CheckboxTreeNode[] = [
  { value: 'informes', label: 'Informes' },
  { value: 'contratos', label: 'Contratos' },
  { value: 'actas', label: 'Actas' },
];

/** Una madre con una sola hija. */
const SINGLE: CheckboxTreeNode[] = [{ value: 'informes', label: 'Informes', children: [{ value: 'anuales', label: 'Anuales' }] }];

let seq = 0;

/** Árbol de ejemplo. Cada muestra lleva su propio nombre accesible. */
const tree = (items: CheckboxTreeNode[] = ITEMS, props: TreeProps = {}, width = 'w-76') => (
  <div className={`${width} max-w-full`}>
    <CheckboxTree aria-label={`Tipos de archivo ${(seq += 1)}`} items={items} {...props} />
  </div>
);

/** Superficie inversa al tema (`background/general/white`): ahí va el contraste Negative. */
const onInverse = (children: ReactNode) => <div className="bg-ds-background-general-white p-ds-space-general-2xl">{children}</div>;

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo. Ninguna hoja marcada y todas las madres sin marcar.',
    samples: [tree(ONE)],
  },
  {
    label: 'Indeterminate',
    tone: 'accent',
    description: (
      <>
        Mixto. La madre se dibuja con raya cuando solo algunas hojas están marcadas (<code>indeterminate</code> en el input).
      </>
    ),
    samples: [tree(ONE, { defaultValue: ['informes'] })],
  },
  {
    label: 'Select',
    tone: 'accent',
    description: 'Marcado. La madre se marca cuando todas sus hojas lo están.',
    samples: [tree(ONE, { defaultValue: ['informes', 'contratos'] })],
  },
  {
    label: 'Disabled',
    tone: 'neutral',
    description: (
      <>
        Sin respuesta en todo el árbol (<code>disabled</code>). Conserva lo marcado, con casillas y textos atenuados.
      </>
    ),
    samples: [tree(ONE, { disabled: true, defaultValue: ['informes'] })],
  },
  {
    label: 'Disabled leaf',
    tone: 'neutral',
    description: (
      <>
        Una hoja sin respuesta (<code>disabled</code> en el nodo). Alternar la madre no la cambia.
      </>
    ),
    samples: [tree([documentos({ value: 'informes', label: 'Informes' }, { value: 'contratos', label: 'Contratos', disabled: true })])],
  },
];

export const doc: ComponentDocContent = {
  name: 'CheckboxTree',
  icon: 'task',
  classification: 'molecula',
  summary:
    'El CheckboxTree es la molécula para elegir opciones agrupadas. Une varios Checkbox en un árbol con sangría, donde cada madre resume a sus hijas como marcada, desmarcada o mixta. Usa inputs nativos y entrega la lista de hojas marcadas, controlada o no.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Un grupo raíz contiene ramas. Cada rama une una madre con sus hijas, y cada fila es un Checkbox con texto.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Árbol de dos niveles',
                  preview: tree(ITEMS, {}, 'w-44'),
                  marks: [
                    { n: 1, selector: '[role="group"]', index: 0, side: 'left' },
                    { n: 2, selector: '[data-figma-part="Group "]', index: 0, side: 'top' },
                    { n: 3, selector: '[data-figma-part="Selection"]', index: 0, side: 'right' },
                    { n: 4, selector: '[role="group"][aria-labelledby]', index: 0, side: 'right' },
                    { n: 5, selector: '[data-figma-part="Text description"]', index: 1, side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: '[data-figma-part="Group "]', fromIndex: 0, to: '[data-figma-part="Group "]', toIndex: 1, axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Raíz:</strong> <code>role=&quot;group&quot;</code> en columna, con <code>aria-label</code> o <code>aria-labelledby</code>. Separa las ramas 16 px (<code>space/general/2xl</code>).
                </>,
                <>
                  <strong>Rama:</strong> una madre con sus hijas, también en columna y con 16 px entre filas (<code>space/general/2xl</code>).
                </>,
                <>
                  <strong>Madre:</strong> fila con un Checkbox que resume a sus hijas. Controla a las hijas con <code>aria-controls</code>.
                </>,
                <>
                  <strong>Hijas:</strong> <code>role=&quot;group&quot;</code> nombrado por la madre, con sangría izquierda de 24 px (<code>space/general/3xl</code>).
                </>,
                <>
                  <strong>Texto:</strong> la etiqueta de la fila (<code>label</code>). Tipografía de 16 px con alto de línea de 20 px (<code>typography/<wbr />field/<wbr />size/md</code>).
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Tres niveles',
                  preview: tree(NESTED, {}, 'w-44'),
                  marks: [
                    { n: 1, selector: 'label > span[aria-hidden="true"]', index: 1, side: 'left' },
                    { n: 2, selector: 'label > span[aria-hidden="true"]', index: 2, side: 'left' },
                    { n: 3, selector: '[data-figma-part="Text description"]', index: 5, side: 'right' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Primer nivel:</strong> las hijas de la madre superior, como Diseño, se desplazan 24 px.
                </>,
                <>
                  <strong>Segundo nivel:</strong> una madre dentro de una rama abre otra sangría de 24 px. Se suman: sus hijas, como Equipo 1, quedan a 48 px.
                </>,
                <>
                  <strong>Hoja:</strong> la fila sin hijas. Es la que se guarda en <code>value</code>.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Fila',
                  preview: tree([{ value: 'informes', label: 'Informes' }], { defaultValue: ['informes'] }),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Selection"]', index: 0, side: 'top' },
                    { n: 2, selector: 'label > span[aria-hidden="true"]', index: 0, side: 'left' },
                    { n: 3, selector: '[data-figma-part="Text description"]', index: 0, side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: 'label > span[aria-hidden="true"]', fromIndex: 0, to: '[data-figma-part="Text description"]', toIndex: 0 },
                    { kind: 'height', selector: '[data-figma-part="Selection"]', index: 0 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Fila:</strong> instancia de Selection que ocupa todo el ancho. Mide 20 px de alto, como la línea del texto.
                </>,
                <>
                  <strong>Control:</strong> el <code>Checkbox</code> de 16 × 16 px. En una madre también dibuja el estado mixto.
                </>,
                <>
                  <strong>Texto:</strong> a 8 px del control (<code>space/general/lg</code>).
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
          CheckboxTree tiene 5 estados. Salen de <code>defaultValue</code>, <code>disabled</code> y del nodo: no hay una prop <code>state</code>. No cambia en Hover. El foco de teclado dibuja el contorno de 2 px del Checkbox.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Los colores y el texto son los del Checkbox; el árbol solo agrega sangría y separación. Cambia el modo para ver el valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Positive',
              preview: tree(ONE, { defaultValue: ['informes'] }),
              entries: [
                { part: 'Contorno', color: 'background-field-surface-tertiary' },
                { part: 'Relleno (Select y mixto)', color: 'background-field-active-high-contrast' },
                { part: 'Check y raya', color: 'icon-general-black' },
                { part: 'Texto', color: 'text-neutral-white', text: 'typography-field-size-md' },
                { part: 'Contorno y relleno (Disabled)', color: 'background-field-disabled' },
                { part: 'Texto (Disabled default)', color: 'text-neutral-disabled-on-canva' },
                { part: 'Texto (Disabled select)', color: 'text-neutral-disabled-on-card' },
                { part: 'Contorno de foco', color: 'border-field-active' },
              ],
            },
            {
              title: 'Negative',
              preview: onInverse(tree(ONE, { defaultValue: ['informes'], contrast: 'negative' })),
              entries: [
                { part: 'Contorno y relleno', color: 'background-field-active-slow-contrast' },
                { part: 'Check y raya', color: 'icon-general-default' },
                { part: 'Texto', color: 'text-neutral-black', text: 'typography-field-size-md' },
                { part: 'Contorno y relleno (Disabled)', color: 'background-field-disabled' },
                { part: 'Check y raya (Disabled select)', color: 'icon-general-black' },
                { part: 'Texto (Disabled)', color: 'text-neutral-disabled-on-card' },
                { part: 'Contorno de foco', color: 'border-field-active' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente CheckboxTree en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como el valor Selection tree de Type en el set Atoms de la página Filter. Su propiedad List es un slot donde van los grupos.
            </>,
            <>
              <strong>Type:</strong> Selection tree corresponde a este componente. Checkbox y Radiobutton, del mismo set, corresponden a <code>Checkbox</code> y <code>Radio</code>.
            </>,
            <>
              <strong>Group y Selection:</strong> cada Group es un nodo con <code>children</code>. Cada Selection es un <code>Checkbox</code> con texto, y su <code>Text description</code> es el <code>label</code> del nodo.
            </>,
            <>
              <strong>Lo que no dibuja Figma:</strong> el estado mixto y el foco de teclado, que salen del <code>Checkbox</code>. Figma tampoco define el tipo Selection tree en estado deshabilitado: el código usa <code>disabled</code>, y Disabled leaf (<code>disabled</code> en un nodo) existe solo en el código.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el CheckboxTree es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Opciones con grupos:</strong> categorías y subcategorías donde la madre debe resumir a las hijas.
            </>,
            <>
              <strong>Selección parcial:</strong> la madre queda mixta (<code>indeterminate</code>) si solo algunas hijas están marcadas.
            </>,
            <>
              <strong>Marcar una rama entera:</strong> alternar la madre marca o desmarca todas sus hojas habilitadas.
            </>,
            <>
              <strong>Formularios:</strong> con <code>name</code>, cada hoja marcada envía su <code>value</code>.
            </>,
            <>
              <strong>Teclado y lectores de pantalla:</strong> Tab recorre las casillas y Espacio alterna. Cada rama es un grupo nombrado por su madre, y el árbol necesita <code>aria-label</code> o <code>aria-labelledby</code>.
            </>,
          ],
          avoid: [
            <>
              <strong>Opciones sin grupos:</strong> una lista plana no necesita madres. (Alternativa: <code>Checkbox</code>).
            </>,
            <>
              <strong>Una sola respuesta:</strong> las casillas no se excluyen entre sí. (Alternativa: <code>Radio</code>).
            </>,
            <>
              <strong>Ramas que se abren y cierran:</strong> todas las ramas se muestran abiertas y no hay control para expandir.
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
                title: 'Dos niveles',
                bullets: [
                  <>
                    <strong>Sangría:</strong> 24 px a la izquierda de las hijas (<code>space/general/3xl</code>).
                  </>,
                  <>
                    <strong>Separación:</strong> 16 px entre filas y entre ramas (<code>space/general/2xl</code>).
                  </>,
                ],
                preview: tree(),
              },
              {
                title: 'Tres niveles',
                bullets: [
                  <>
                    <strong>Sangría:</strong> se suma por nivel: 24 px en el primero y 48 px en el segundo.
                  </>,
                  <>
                    <strong>Ancho:</strong> cada fila ocupa todo el ancho disponible del árbol.
                  </>,
                ],
                preview: tree(NESTED),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sangría:</strong> baja a 20 px por nivel (<code>space/general/3xl</code>).
              </>,
              <>
                <strong>Separación:</strong> sigue en 16 px (<code>space/general/2xl</code>). Figma la baja a 12 px.
              </>,
              <>
                <strong>Texto largo:</strong> pasa a la línea siguiente dentro de la fila y el control conserva su tamaño.
              </>,
            ],
            preview: tree([
              documentos(
                { value: 'informes', label: 'Informes de seguimiento con los resultados de cada trimestre' },
                { value: 'contratos', label: 'Contratos' }
              ),
            ]),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sangría:</strong> 24 px por nivel, como en Desktop (<code>space/general/3xl</code>).
              </>,
              <>
                <strong>Separación:</strong> 16 px entre filas y entre ramas (<code>space/general/2xl</code>).
              </>,
              <>
                <strong>Texto largo:</strong> pasa a la línea siguiente dentro de la fila y el control conserva su tamaño.
              </>,
            ],
            preview: tree([
              documentos(
                { value: 'informes', label: 'Informes de seguimiento con los resultados de cada trimestre' },
                { value: 'contratos', label: 'Contratos' }
              ),
            ]),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de profundidad, agrupación y número de opciones.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Hasta tres niveles',
              description: 'Limita el árbol a tres niveles para que la sangría no estreche las filas.',
              preview: tree(NESTED),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Cuatro niveles',
              description: 'No anides un cuarto nivel: cada uno suma 24 px de sangría.',
              preview: tree(DEEP),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Opciones con grupos',
              description: 'Usa el árbol si la madre debe resumir el estado de sus hijas.',
              preview: tree(),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Lista plana',
              description: (
                <>
                  No uses el árbol si las opciones no tienen grupos: usa <code>Checkbox</code>.
                </>
              ),
              preview: tree(FLAT),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Varias hijas',
              description: 'Agrupa dos o más opciones bajo cada madre.',
              preview: tree(SHALLOW, { defaultValue: ['informes'] }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Una sola hija',
              description: 'No crees una madre con una sola hija: las dos siempre cambian juntas.',
              preview: tree(SINGLE, { defaultValue: ['anuales'] }),
            },
          ],
        },
      ],
    },
  ],
};
