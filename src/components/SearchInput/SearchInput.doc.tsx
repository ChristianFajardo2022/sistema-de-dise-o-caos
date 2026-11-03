import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { SearchInput } from './SearchInput';
import type { SearchInputState } from './SearchInput.types';

/*
 * Contenido de la página de documentación de SearchInput (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el
 * código (`SearchInput.types.ts`, `SearchInput.variants.ts`, `SearchInput.tsx`), luego `SearchInput.docs.json`.
 * Medidas: barra de 64 (padding 12 y 24 a la izquierda, gap 16, radio 16), campo de 40 y botón de 32. Diferencias con
 * Figma: Figma no dibuja label ni mensajes en Error, Confirmation y Helper text (solo cambia el trazo) y no dibuja
 * foco; el código agrega label solo para lectores de pantalla, mensajes y un anillo de foco de 2 px.
 */

// Figma: 19830:28839 (component set "Search input (Avance)")

type SearchProps = Partial<ComponentProps<typeof SearchInput>>;

const CATEGORIES = [
  { value: 'todo', label: 'Todo' },
  { value: 'guias', label: 'Guías' },
  { value: 'ayuda', label: 'Ayuda' },
];

const SUGGESTIONS = {
  keywords: ['Configuración de la cuenta', 'Cambiar contraseña', 'Métodos de pago'],
  recent: ['Ajustes', 'Perfil', 'Cuenta'],
  popular: ['Inicio', 'Guías', 'Ayuda'],
};

/** SearchInput de ejemplo con nombre accesible y placeholder de muestra. */
const search = (props: SearchProps = {}) => <SearchInput label="Buscar en la ayuda" placeholder="Guía de inicio" {...props} />;

/** Con selector de categoría, para las vistas que muestran la barra completa. */
const full = (props: SearchProps = {}) => search({ categories: CATEGORIES, ...props });

/** Con el panel dibujado en el flujo (`state="active"`): el panel es absoluto, así que se deja sitio debajo. */
const withPanel = (props: SearchProps = {}) => (
  <div className="pb-90">{full({ state: 'active', suggestions: SUGGESTIONS, onClearRecent: () => {}, onClearPopular: () => {}, ...props })}</div>
);

/** Columna de ejemplos: el marco no tiene separación entre hijos. */
const column = (...items: ReactNode[]) => (
  <div className="flex w-full flex-col gap-ds-space-general-3xl">{items.map((item, i) => <Fragment key={i}>{item}</Fragment>)}</div>
);

const stateSample = (state: SearchInputState, props: SearchProps = {}): ReactNode[] => [search({ state, ...props })];

const states: DocStateItem[] = [
  { label: 'Default', tone: 'neutral', description: 'Reposo. Barra con relleno de búsqueda y trazo de 1 px.', samples: stateSample('default') },
  {
    label: 'Filled',
    tone: 'neutral',
    description: 'Con texto escrito. Se ve igual que Default; el texto toma el color de etiqueta.',
    samples: stateSample('filled', { defaultValue: 'Cambiar contraseña' }),
  },
  {
    label: 'Active/Focus',
    tone: 'accent',
    description: 'Con foco o con el panel abierto. El trazo pasa al borde activo y debajo se abre el panel de sugerencias.',
    samples: [withPanel({ categories: undefined })],
  },
  {
    label: 'Burnt-In',
    tone: 'neutral',
    description: (
      <>
        Solo lectura (<code>readOnly</code>). Relleno propio y texto atenuado; no abre el panel ni busca.
      </>
    ),
    samples: stateSample('burnt-in', { defaultValue: 'Cambiar contraseña' }),
  },
  {
    label: 'Disabled',
    tone: 'neutral',
    description: (
      <>
        No interactivo (<code>disabled</code>). Sin relleno, con trazo y texto atenuados; el campo, el selector y el botón no responden.
      </>
    ),
    samples: stateSample('disabled'),
  },
  {
    label: 'Error',
    tone: 'error',
    description: (
      <>
        Trazo de error y mensaje debajo (<code>errorText</code>). Marca <code>aria-invalid</code>.
      </>
    ),
    samples: stateSample('error', { errorText: 'Escribe una palabra para buscar' }),
  },
  {
    label: 'Confirmation',
    tone: 'success',
    description: (
      <>
        Trazo de éxito y mensaje debajo (<code>successText</code>).
      </>
    ),
    samples: stateSample('success', { successText: 'Búsqueda guardada' }),
  },
  {
    label: 'Helper text',
    tone: 'neutral',
    description: (
      <>
        Trazo de información y ayuda debajo (<code>helperText</code>).
      </>
    ),
    samples: stateSample('helper', { helperText: 'Escribe una palabra o una frase' }),
  },
];

export const doc: ComponentDocContent = {
  name: 'SearchInput',
  icon: 'search',
  classification: 'molecula',
  summary:
    'El SearchInput es la molécula para buscar texto: une un selector de categoría opcional, un campo y un botón de búsqueda, y abre un panel con palabras clave, búsquedas recientes y populares. Tiene 8 estados.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una barra de 64 con selector, campo y botón; con el foco abre debajo un panel de sugerencias.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Barra con categorías',
                  width: 495,
                  preview: full(),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Input"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Box Area"]', index: 0, side: 'top' },
                    { n: 3, selector: '[data-figma-part="Line 1"]', side: 'bottom' },
                    { n: 4, selector: '[data-figma-part="Field"]', side: 'top' },
                    { n: 5, selector: '[data-figma-part="Button"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Input"]', side: 'left' },
                    { kind: 'padding', selector: '[data-figma-part="Input"]', side: 'top' },
                    { kind: 'height', selector: '[data-figma-part="Input"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Barra:</strong> alto de 64, radio de 16 (<code>radius/field/md</code>) y trazo interior de 1 px. Padding de 12 y de 24 a la izquierda (<code>space/field/md</code> y <code>space/field/xl</code>); gap de 16 (<code>space/field/lg</code>).
                </>,
                <>
                  <strong>Selector de categoría:</strong> texto de 14 px y chevron de 16 px, con gap de 8. Solo se dibuja si pasas <code>categories</code>.
                </>,
                <>
                  <strong>Separador:</strong> línea vertical de 40 de alto y 0.5 px (<code>border/general/default-on-card</code>). No ocupa ancho en el flujo.
                </>,
                <>
                  <strong>Campo:</strong> <code>input</code> de 40 de alto, con texto y placeholder de 14 px. La etiqueta es solo para lectores de pantalla.
                </>,
                <>
                  <strong>Botón de búsqueda:</strong> Button tertiary xs de 32 × 32 con la lupa de 20 px.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Panel de sugerencias',
                  width: 495,
                  preview: withPanel({ categories: undefined }),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Dropdown"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Palabra clave"]', index: 0, side: 'right' },
                    { n: 3, selector: '[data-figma-part="Búsquedas recientes"]', side: 'left' },
                    { n: 4, selector: '[data-figma-part="Button"]', index: 1, side: 'right' },
                    { n: 5, selector: '[data-figma-part="Tag"]', index: 0, side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: '[data-figma-part="Input"]', to: '[data-figma-part="Dropdown"]', axis: 'y' },
                    { kind: 'padding', selector: '[data-figma-part="Dropdown"]', side: 'left' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Panel:</strong> ancho de la barra, a 8 de ella. Padding de 24 (<code>space/field/xl</code>), gap de 24 entre secciones (<code>space/general/3xl</code>), radio de 16 y sombra de elevación.
                </>,
                <>
                  <strong>Palabras clave:</strong> lista de texto de 14 px con gap de 8. La opción activa o con puntero pinta <code>background/field/hover</code>.
                </>,
                <>
                  <strong>Título de sección:</strong> heading md de 16 px (Búsquedas recientes y Popular ahora), separado de la anterior por una línea de 0.5 px.
                </>,
                <>
                  <strong>Papelera:</strong> Button tertiary xs en estado delete. Solo aparece si pasas <code>onClearRecent</code> o <code>onClearPopular</code>.
                </>,
                <>
                  <strong>Chip:</strong> Tag neutral md con lupa en recientes y etiqueta en populares; gap de 8 entre chips.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Mensaje debajo de la barra',
                  width: 495,
                  preview: search({ state: 'helper', helperText: 'Escribe una palabra o una frase' }),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Input"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Helper text"]', side: 'bottom' },
                  ],
                  dimensions: [{ kind: 'gap', from: '[data-figma-part="Input"]', to: '[data-figma-part="Helper text"]', axis: 'y' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Barra:</strong> sin selector, con el campo a la izquierda. El trazo cambia con el tipo de mensaje.
                </>,
                <>
                  <strong>Mensaje:</strong> NotificationText a 4 de la barra (<code>space/general/md</code>). Prioridad: error, éxito y ayuda; va dentro de una región <code>aria-live</code>.
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
          SearchInput tiene 8 estados. Se fuerzan con <code>state</code> solo para documentar; en uso salen del foco, de <code>disabled</code>, de <code>readOnly</code> y de los mensajes. Hover y Press no cambian la barra: el foco de teclado dibuja un contorno de 2 px.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default, más los que aparecen en otros estados. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Barra',
              preview: full(),
              entries: [
                { part: 'Fondo', color: 'background-field-surface-search' },
                { part: 'Trazo', color: 'border-field-default' },
                { part: 'Texto y placeholder', color: 'text-field-label', text: 'typography-field-size-sm' },
                { part: 'Chevron', color: 'icon-general-default' },
                { part: 'Separador', color: 'border-general-default-on-card' },
                { part: 'Lupa', color: 'icon-button-tertiary-default' },
                { part: 'Trazo (aparece en Active/Focus)', color: 'border-field-active' },
                { part: 'Trazo (aparece en Error)', color: 'border-semantic-error' },
                { part: 'Trazo (aparece en Confirmation)', color: 'border-semantic-success' },
                { part: 'Trazo (aparece en Helper text)', color: 'border-semantic-information' },
              ],
            },
            {
              title: 'Burnt-In y Disabled',
              preview: column(search({ state: 'burnt-in', defaultValue: 'Cambiar contraseña' }), search({ state: 'disabled' })),
              entries: [
                { part: 'Fondo (Burnt-In)', color: 'background-field-burnt-in' },
                { part: 'Trazo (Burnt-In)', color: 'border-field-default' },
                { part: 'Texto (ambos)', color: 'text-field-disabled-negative' },
                { part: 'Trazo (Disabled)', color: 'border-field-disabled' },
                { part: 'Chevron (ambos)', color: 'icon-general-disabled-positive' },
              ],
            },
            {
              title: 'Panel',
              preview: withPanel({ categories: undefined }),
              entries: [
                { part: 'Fondo', color: 'background-field-surface' },
                { part: 'Trazo', color: 'border-general-default-on-canva' },
                { part: 'Texto de palabras clave', color: 'text-neutral-white', text: 'typography-body-size-md' },
                { part: 'Título de sección', color: 'text-neutral-white', text: 'typography-heading-size-md' },
                { part: 'Separador', color: 'border-general-default-on-card' },
                { part: 'Fondo de la opción (aparece en Hover)', color: 'background-field-hover' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente SearchInput en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Search input (Avance) en la librería de Assets. Sus propiedades son Label, Placeholder, Dropdown label y State.
            </>,
            <>
              <strong>Label y Placeholder:</strong> la propiedad Label de Figma es el texto del selector de categoría (en código sale de <code>categories</code>); Placeholder es el texto del campo (<code>placeholder</code>). El nombre accesible es <code>label</code> y Figma no lo dibuja.
            </>,
            <>
              <strong>State:</strong> Default, Filled, Active/Focus, Burnt-In, Disabled, Error, Confirmation o Helper text (<code>state</code>). En código salen de <code>readOnly</code>, <code>disabled</code>, <code>errorText</code>, <code>successText</code> y <code>helperText</code>; <code>state</code> solo los fuerza.
            </>,
            <>
              <strong>Diferencias:</strong> Figma no dibuja los mensajes de Error, Confirmation y Helper text, ni el foco. El código suma los tres. Dropdown label no tiene prop: el selector aparece con <code>categories</code>.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el SearchInput es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Buscar en un sitio o en un listado:</strong> una barra con búsqueda explícita (Enter o botón) que devuelve resultados con <code>onSearch</code>.
            </>,
            <>
              <strong>Buscar dentro de una categoría:</strong> pasa <code>categories</code> y <code>onSearch</code> recibe el texto y la categoría elegida.
            </>,
            <>
              <strong>Ayudar a escribir:</strong> pasa <code>suggestions</code> con palabras clave, recientes y populares. Tú las filtras según lo escrito.
            </>,
            <>
              <strong>Teclado:</strong> Flecha abajo o arriba abren y recorren las opciones, Enter elige o busca, Esc cierra y, con el panel cerrado, borra el texto.
            </>,
            <>
              <strong>Campo solo para lectores de pantalla:</strong> <code>label</code> es obligatorio; si hay ayuda o error, se vincula con <code>aria-describedby</code>.
            </>,
          ],
          avoid: [
            <>
              <strong>Texto libre en un formulario:</strong> la barra pide una búsqueda, no un dato. (Alternativa: <code>Input</code>).
            </>,
            <>
              <strong>Elegir un valor de una lista fija:</strong> las sugerencias no obligan a escoger una. (Alternativa: <code>Select</code>).
            </>,
            <>
              <strong>Filtrar sin buscar:</strong> el componente no filtra solo las sugerencias; si no las das, no abre el panel.
            </>,
            <>
              <strong>Sin <code>label</code>:</strong> el placeholder no es un nombre accesible y se pierde al escribir. (Alternativa: <code>label</code> con lo que se busca).
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
                title: 'Barra vacía y con texto',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Medidas:</strong> barra de 64, campo de 40 y botón de 32; texto de 14 px. La primera barra muestra el placeholder y la segunda, texto escrito.
                  </>,
                ],
                preview: column(search(), search({ defaultValue: 'Cambiar contraseña' })),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medidas:</strong> barra de 64 con padding de 12 y de 24 a la izquierda. La primera barra muestra el placeholder y la segunda, texto escrito.
              </>,
              <>
                <strong>Ancho:</strong> ocupa todo el ancho disponible; el campo se encoge y el texto se recorta.
              </>,
            ],
            preview: column(search(), search({ defaultValue: 'Cambiar contraseña' })),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medidas:</strong> barra de 64 con padding de 12 y de 24 a la izquierda. La primera barra muestra el placeholder y la segunda, texto escrito.
              </>,
              <>
                <strong>Ancho:</strong> ocupa todo el ancho disponible; quien lo coloca define el máximo.
              </>,
            ],
            preview: column(search(), search({ defaultValue: 'Cambiar contraseña' })),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de textos y mensajes del SearchInput.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Ejemplo real como placeholder',
              description: 'Usa un ejemplo de lo que se busca en el placeholder.',
              preview: search({ placeholder: 'Guía de inicio' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Instrucción como placeholder',
              description: 'No uses una orden como placeholder.',
              preview: search({ placeholder: 'Escribe aquí tu búsqueda' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Error que dice qué falta',
              description: (
                <>
                  Di qué necesita la búsqueda con <code>errorText</code>.
                </>
              ),
              preview: search({ errorText: 'Escribe una palabra para buscar' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Error que culpa',
              description: 'No culpes a quien busca.',
              preview: search({ errorText: 'Escribiste mal la búsqueda' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Ayuda breve',
              description: 'Da la pista en una frase corta.',
              preview: search({ helperText: 'Escribe al menos tres letras' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Ayuda larga',
              description: 'No escribas párrafos bajo la barra.',
              preview: search({ helperText: 'Para obtener mejores resultados escribe al menos tres letras y evita los signos' }),
            },
          ],
        },
      ],
    },
  ],
};
